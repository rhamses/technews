---
title: "Introducing new window features"
link: "https://trino.io/blog/2021/03/10/introducing-new-window-features.html"
guid: "https://trino.io/blog/2021/03/10/introducing-new-window-features.html"
pubDate: "2021-03-10T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "In Trino, we are thrilled to get feedback and feature requests from our\nfantastic community, and we’re tirelessly motivated to meet the expectations!\nThe SQL specification is another source of inspiration. From time to time, we\ngo through those encrypted scrolls to give you a new feature that you didn’t\neven know you needed!\nRecently, there was a push in Trino to extend support for window functions.\nIn this post, we explain the complexities of window function, and describe a\ncouple of our recent additions. If “window” doesn’t sound familiar, read on.\nAlready a window expert? Skip to what’s new.\nA window is the structure you run your window function OVER. It has three\ncomponents:\npartitioning\nordering\nframe\nYou use partitioning to break your input data into independent chunks. Ordering\nis to order rows within the partition. And frame is a kind of “sliding window”.\nFor every processed row, the frame encloses a certain portion of the sorted\npartition. Your window function processes this portion and yields the result\nfor the row.\nA “running average” is one simple example:\n\nSELECT avg(totalprice) OVER (\n    PARTITION BY custkey\n    ORDER BY orderdate\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\nFROM orders\n\n\nFor a particular customer identified by custkey, it sorts their orders by\ndate and computes a sequence of average prices since the beginning up to each\nconsecutive entry. The window frame for a row includes all rows from the start\nup to and including that row.\n\nAccording to standard SQL, there are 3 ways to specify the frame. The first way\nis ROWS (like in the example). With ROWS, you can specify frame bounds by a\nphysical offset from the current row. While ROWS BETWEEN UNBOUNDED PRECEDING\nAND CURRENT ROW means “between the beginning of the partition and the current\nrow”, you can also specify precisely where the frame starts and ends, for\nexample with: ROWS BETWEEN 10 PRECEDING AND 5 FOLLOWING.\nRANGE is a more complicated way of defining frame on ordered data. It does\nnot rely on physical offset (in rows), but on logical offset (in value). That\nis, the frame includes rows where the value is within a certain range from the\nvalue in the current row.\nUntil recently, Trino only supported RANGE in limited cases.\nYou could use RANGE UNBOUNDED PRECEDING, CURRENT ROW and UNBOUNDED\nFOLLOWING:\nUNBOUNDED PRECEDING includes all rows since the partition start,\nUNBOUNDED FOLLOWING includes all rows until the partition end,\nCURRENT ROW is trickier. It includes all rows where values of the sort key\nare the same as in the current row. We call them a peer group.\nIt’s time to introduce the first new feature:\n Full support for frame type RANGE\nSince version 346, it is\npossible to specify RANGE with an offset value. The frame includes all rows\nwhose value is within this range from the current row.\nLet’s modify our example:\n\nSELECT avg(totalprice) OVER (\n    PARTITION BY custkey\n    ORDER BY orderdate\n    RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)\nFROM orders\n\n\nNow, for every row, we get the average price from the preceding month. Note that\nthe offset interval '1' month applies to orderdate, which is the sorting\ncolumn.\n\nOf course, we don’t have to order by date. The sorting column can be of any\nnumeric or date/time type, and the offset must be compatible. Also, the offset\ndoesn’t have to be a literal. It can come in another column of a table or,\ngenerally, it can be any expression, as long as the type matches.\nA frame of type RANGE does not quite fit in the abstraction of a “sliding\nwindow”. Frames can be bigger or smaller depending not only on the offset\nvalues but also on the actual input data. A long series of similar entries can\nproduce a huge frame, while a gap in input values can result in an empty frame.\nFor illustration, imagine a group of students, and the results of some test they\ntook. Our table has two columns: student_id and result, which is the number\nof points. For each student, let’s find how many students did better by 1 to 2\npoints:\n\nWITH students_results(student_id, result) AS (VALUES\n    ('student_1', 17),\n    ('student_2', 16),\n    ('student_3', 18),\n    ('student_4', 18),\n    ('student_5', 10),\n    ('student_6', 20),\n    ('student_7', 16))\nSELECT\n    student_id,\n    result,\n    count(*) OVER (\n        ORDER BY result\n        RANGE BETWEEN 1 FOLLOWING AND 2 FOLLOWING) AS close_better_scores_count\nFROM students_results;\n\n student_id | result | close_better_scores_count\n------------+--------+---------------------------\n student_5  |     10 |                         0\n student_7  |     16 |                         3\n student_2  |     16 |                         3\n student_1  |     17 |                         2\n student_3  |     18 |                         1\n student_4  |     18 |                         1\n student_6  |     20 |                         0\n(7 rows)\n\n\nNote that the frame does not contain the current row. For a particular student,\nit only includes students with better results, and not themselves. For the\nunfortunate student_5, there are no students with similar test results. The\nframe is also empty for the lucky student_6 who scored the most points.\n\nBesides ROWS and RANGE, there is another way to specify the frame on\nordered data. And yes, Trino supports this mechanism! Let me introduce the\nsecond of our recent additions:\nSupport for frame type GROUPS\nThis feature, added in\nversion 346, allows you to\ninclude or exclude the whole peer groups of rows in ordered data.\nFor illustration, let’s consider again the students_results table. For each\nstudent, let’s find the gap between their result and the result of a student (or\nstudents) who did slightly better.\n\nWITH students_results(student_id, result) AS (VALUES\n    ('student_1', 17),\n    ('student_2', 16),\n    ('student_3', 18),\n    ('student_4', 18),\n    ('student_5', 10),\n    ('student_6', 20),\n    ('student_7', 16))\nSELECT\n    student_id,\n    result,\n    max(result) OVER (\n        ORDER BY result\n        GROUPS BETWEEN CURRENT ROW AND 1 FOLLOWING) - result AS gap_till_better_score\nFROM students_results;\n\n student_id | result | gap_till_better_score\n------------+--------+-----------------------\n student_5  |     10 |                     6\n student_7  |     16 |                     1\n student_2  |     16 |                     1\n student_1  |     17 |                     1\n student_3  |     18 |                     2\n student_4  |     18 |                     2\n student_6  |     20 |                     0\n(7 rows)\n\n\nThe window function for each student returns the closest better result. The\nframe of type GROUPS used here, includes all entries equal to the current\nentry in terms of points (that is the student’s peer group), and the next\ngroup.\n\nIn frames of type GROUPS, like in other frame types, the offset doesn’t have\nto be constant. It can be any expression, as long as its type is exact numeric\nwith scale 0. Simply put, we can skip any integer number of groups.\nUnder the covers\nHow do we deal with finding the frame bounds effectively? With ROWS it’s easy.\nWe only need to skip a determined number of rows forward or backwards.\nWith RANGE, we need to examine the actual values to see if they fall within\nthe given range. Our approach is optimized for the case where the offset values\nare constant for all rows. Our solution involves caching frame bounds computed\nfor the preceding row, and using them as the starting point to find frame\nbounds for the current row. Ideally, we never have to move the frame bounds\nback as we process subsequent rows. In such a case, the amortized cost of frame\nbound calculations per row is constant.\n\nOur strategy for determining frame bounds for GROUPS is similar. We cache the\nframe bounds computed for the preceding row and use them as the starting point\nfor the current row. If the frame offset is constant, frame bounds slide from\none peer group to another every time the processed row leaves one peer group and\nenters the next one.\n\nSupport for WINDOW clause\nAs all the preceding examples show, a window function is a big chunk of syntax.\nWhat if we wanted to use several window functions over the same window? Say, we\nneed an average price and a total price from the preceding month. And the top\nprice. Does it have to look like the below?\n\nSELECT\n    avg(totalprice) OVER (\n        PARTITION BY custkey \n        ORDER BY orderdate\n        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW),\n    sum(totalprice) OVER (\n        PARTITION BY custkey \n        ORDER BY orderdate\n        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW),\n    max(totalprice) OVER (\n        PARTITION BY custkey \n        ORDER BY orderdate\n        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)\nFROM orders\n\n\nWell, no more. Starting with\nTrino 352, you can\npredefine a window specification, and then use it or redefine it wherever you\nneed. This is thanks to the third of our new additions: support for WINDOW\nclause.\nTechnically speaking, the WINDOW clause is part of the FROM clause:\n\nSELECT …\n    FROM …\n        WHERE …\n        GROUP BY …\n        HAVING …\n        WINDOW …\nORDER BY …\nOFFSET …\nLIMIT / FETCH …\n\n\nIn the WINDOW clause, you can define any number of named windows. Then you\ncan simply refer to them by their names in the SELECT list or an ORDER BY\nclause.\nLet’s check how the WINDOW clause helps with our example query:\n\nSELECT \n\tavg(totalprice) OVER w,\n\tsum(totalprice) OVER w,\n\tmax(totalprice) OVER w\nFROM orders\nWINDOW w AS (\n    PARTITION BY custkey\n    ORDER BY orderdate\n    RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)\n\n\nTo be even more concise, the WINDOW clause allows you to define more\nspecialized windows from existing window definitions:\n\nWINDOW \n\tw1 AS (PARTITION BY custkey),\n\tw2 AS (w1 ORDER BY orderdate),\n\tw3 AS (w2 RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)\n\n\nAlternatively you can define the window only partially and then complete it\nwhere it’s used:\n\nSELECT \n\tavg(totalprice) OVER (w ROWS BETWEEN 10 PRECEDING AND CURRENT ROW) AS recent_average,\n\tsum(totalprice) OVER (w ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) AS next_buys,\nFROM orders\n    WINDOW w AS (PARTITION BY custkey ORDER BY orderdate)\n\n\nThere are some ANSI rules, though, you need to follow when redefining windows:\nPARTITION BY is only allowed in the base definition,\nORDER BY can only be specified once in the named windows reference chain,\nframe can only be specified in the final definition.\nIn case you wonder, there’s no need to worry if some predefined windows are\neventually unused. Unused windows do not affect the efficiency of your query\nexecution. Partitioning, sorting and frame bound computations are costly\noperations. That’s why we made sure that unused window parts do not appear in\nthe query plan.\nThere’s one last detail about the WINDOW clause that needs clarification. The\ncolumns referenced in the WINDOW clause are columns of the input table. In the\nfollowing example, country_code is clearly a column of the table countries:\n\n... FROM countries WINDOW w AS (ORDER BY country_code)\n\n\nObvious enough. Why am I telling this?\nWindow functions can be used in two different clauses of a query, SELECT and\nORDER BY. With the ORDER BY clause, there is a rule that column references\nused there refer to the output table rather than the input table. Consider this\nquery:\n\nWITH countries(country_code) AS (VALUES 'pol', 'CAN', 'USA')\nSELECT upper(country_code) AS country_code\n    FROM countries\n    WINDOW w AS (ORDER BY country_code)\nORDER BY row_number() OVER w\n\n\nWindow w is used in the ORDER BY clause. So, does the window’s ordering use\nthe original country_code column from the input table, or does it “see” the\nuppercased country_code from the output table?\n\nThe SQL spec is clear about it: a column reference in the named window always\nrefers to the original column, no matter where you use this window. In the\nexample, the result is ordered according to the original values: lowercase pol\nafter uppercase USA:\n\nAs expected:\n\n country_code\n--------------\n CAN\n USA\n POL\n(3 rows)\n\n\nAnd here the story ends. Thanks for your attention! I hope you enjoy Trino’s\nnew superpowers. In case of questions or issues — you\nknow where to find us. More goodies are on the way, so stay tuned! How\nabout regex matching on tables?"
author: "Kasia Findeisen (kasiafi)"
contentHtml: "<div>\n<article>\n  <div><p>In Trino, we are thrilled to get feedback and feature requests from our\nfantastic community, and we’re tirelessly motivated to meet the expectations!\nThe SQL specification is another source of inspiration. From time to time, we\ngo through those encrypted scrolls to give you a new feature that you didn’t\neven know you needed!</p>\n<p>Recently, there was a push in Trino to extend support for window functions.\nIn this post, we explain the complexities of window function, and describe a\ncouple of our recent additions. If “window” doesn’t sound familiar, read on.\nAlready a window expert? Skip to <a target=\"_blank\" href=\"https://trino.io/blog/2021/03/10/introducing-new-window-features.html#new%20features\">what’s new</a>.</p>\n<p>A window is the structure you run your window function <code>OVER</code>. It has three\ncomponents:</p>\n<ul>\n  <li>partitioning</li>\n  <li>ordering</li>\n  <li>frame</li>\n</ul>\n<p>You use partitioning to break your input data into independent chunks. Ordering\nis to order rows within the partition. And frame is a kind of “sliding window”.\nFor every processed row, the frame encloses a certain portion of the sorted\npartition. Your window function processes this portion and yields the result\nfor the row.</p>\n<p>A “running average” is one simple example:</p>\n<div><pre><code>SELECT avg(totalprice) OVER (\n    PARTITION BY custkey\n    ORDER BY orderdate\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\nFROM orders\n</code></pre></div>\n<p>For a particular customer identified by <code>custkey</code>, it sorts their orders by\ndate and computes a sequence of average prices since the beginning up to each\nconsecutive entry. The window frame for a row includes all rows from the start\nup to and including that row.</p>\n<p><img src=\"https://trino.io/assets/blog/window-features/running-average.svg\" alt=\"\"></p>\n<p>According to standard SQL, there are 3 ways to specify the frame. The first way\nis <code>ROWS</code> (like in the example). With <code>ROWS</code>, you can specify frame bounds by a\nphysical offset from the current row. While <code>ROWS BETWEEN UNBOUNDED PRECEDING\nAND CURRENT ROW</code> means “between the beginning of the partition and the current\nrow”, you can also specify precisely where the frame starts and ends, for\nexample with: <code>ROWS BETWEEN 10 PRECEDING AND 5 FOLLOWING</code>.</p>\n<p><code>RANGE</code> is a more complicated way of defining frame on ordered data. It does\nnot rely on physical offset (in rows), but on logical offset (in value). That\nis, the frame includes rows where the value is within a certain range from the\nvalue in the current row.</p>\n<p>Until recently, Trino only supported <code>RANGE</code> in limited cases.\nYou could use <code>RANGE UNBOUNDED PRECEDING</code>, <code>CURRENT ROW</code> and <code>UNBOUNDED\nFOLLOWING</code>:</p>\n<ul>\n  <li><code>UNBOUNDED PRECEDING</code> includes all rows since the partition start,</li>\n  <li><code>UNBOUNDED FOLLOWING</code> includes all rows until the partition end,</li>\n  <li><code>CURRENT ROW</code> is trickier. It includes all rows where values of the sort key\nare the same as in the current row. We call them a <em>peer group</em>.</li>\n</ul>\n<p>It’s time to introduce the first new feature:</p>\n<h2 id=\"-full-support-for-frame-type-range\">\n    <a></a> Full support for frame type RANGE <a target=\"_blank\" href=\"https://trino.io/blog/2021/03/10/introducing-new-window-features.html#-full-support-for-frame-type-range\">#</a>\n</h2>\n<p>Since <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-346.html\">version 346</a>, it is\npossible to specify <code>RANGE</code> with an offset value. The frame includes all rows\nwhose value is within this range from the current row.</p>\n<p>Let’s modify our example:</p>\n<div><pre><code>SELECT avg(totalprice) OVER (\n    PARTITION BY custkey\n    ORDER BY orderdate\n    RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)\nFROM orders\n</code></pre></div>\n<p>Now, for every row, we get the average price from the preceding month. Note that\nthe offset <code>interval '1' month</code> applies to <code>orderdate</code>, which is the sorting\ncolumn.</p>\n<p><img src=\"https://trino.io/assets/blog/window-features/running-average-range.svg\" alt=\"\"></p>\n<p>Of course, we don’t have to order by date. The sorting column can be of any\nnumeric or date/time type, and the offset must be compatible. Also, the offset\ndoesn’t have to be a literal. It can come in another column of a table or,\ngenerally, it can be any expression, as long as the type matches.</p>\n<p>A frame of type <code>RANGE</code> does not quite fit in the abstraction of a “sliding\nwindow”. Frames can be bigger or smaller depending not only on the offset\nvalues but also on the actual input data. A long series of similar entries can\nproduce a huge frame, while a gap in input values can result in an empty frame.</p>\n<p>For illustration, imagine a group of students, and the results of some test they\ntook. Our table has two columns: <code>student_id</code> and <code>result</code>, which is the number\nof points. For each student, let’s find how many students did better by 1 to 2\npoints:</p>\n<div><pre><code>WITH students_results(student_id, result) AS (VALUES\n    ('student_1', 17),\n    ('student_2', 16),\n    ('student_3', 18),\n    ('student_4', 18),\n    ('student_5', 10),\n    ('student_6', 20),\n    ('student_7', 16))\nSELECT\n    student_id,\n    result,\n    count(*) OVER (\n        ORDER BY result\n        RANGE BETWEEN 1 FOLLOWING AND 2 FOLLOWING) AS close_better_scores_count\nFROM students_results;\n student_id | result | close_better_scores_count\n------------+--------+---------------------------\n student_5  |     10 |                         0\n student_7  |     16 |                         3\n student_2  |     16 |                         3\n student_1  |     17 |                         2\n student_3  |     18 |                         1\n student_4  |     18 |                         1\n student_6  |     20 |                         0\n(7 rows)\n</code></pre></div>\n<p>Note that the frame does not contain the current row. For a particular student,\nit only includes students with better results, and not themselves. For the\nunfortunate <code>student_5</code>, there are no students with similar test results. The\nframe is also empty for the lucky <code>student_6</code> who scored the most points.</p>\n<p><img src=\"https://trino.io/assets/blog/window-features/students-range.svg\" alt=\"\"></p>\n<p>Besides <code>ROWS</code> and <code>RANGE</code>, there is another way to specify the frame on\nordered data. And yes, Trino supports this mechanism! Let me introduce the\nsecond of our recent additions:</p>\n<h2 id=\"support-for-frame-type-groups\">\n    Support for frame type GROUPS <a target=\"_blank\" href=\"https://trino.io/blog/2021/03/10/introducing-new-window-features.html#support-for-frame-type-groups\">#</a>\n</h2>\n<p>This feature, added in\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-346.html\">version 346</a>, allows you to\ninclude or exclude the whole <em>peer groups</em> of rows in ordered data.</p>\n<p>For illustration, let’s consider again the <code>students_results</code> table. For each\nstudent, let’s find the gap between their result and the result of a student (or\nstudents) who did slightly better.</p>\n<div><pre><code>WITH students_results(student_id, result) AS (VALUES\n    ('student_1', 17),\n    ('student_2', 16),\n    ('student_3', 18),\n    ('student_4', 18),\n    ('student_5', 10),\n    ('student_6', 20),\n    ('student_7', 16))\nSELECT\n    student_id,\n    result,\n    max(result) OVER (\n        ORDER BY result\n        GROUPS BETWEEN CURRENT ROW AND 1 FOLLOWING) - result AS gap_till_better_score\nFROM students_results;\n student_id | result | gap_till_better_score\n------------+--------+-----------------------\n student_5  |     10 |                     6\n student_7  |     16 |                     1\n student_2  |     16 |                     1\n student_1  |     17 |                     1\n student_3  |     18 |                     2\n student_4  |     18 |                     2\n student_6  |     20 |                     0\n(7 rows)\n</code></pre></div>\n<p>The window function for each student returns the closest better result. The\nframe of type <code>GROUPS</code> used here, includes all entries equal to the current\nentry in terms of points (that is the student’s <em>peer group</em>), and the next\ngroup.</p>\n<p><img src=\"https://trino.io/assets/blog/window-features/students-groups.svg\" alt=\"\"></p>\n<p>In frames of type <code>GROUPS</code>, like in other frame types, the offset doesn’t have\nto be constant. It can be any expression, as long as its type is exact numeric\nwith scale 0. Simply put, we can skip any integer number of groups.</p>\n<h3 id=\"under-the-covers\">\n    Under the covers <a target=\"_blank\" href=\"https://trino.io/blog/2021/03/10/introducing-new-window-features.html#under-the-covers\">#</a>\n</h3>\n<p>How do we deal with finding the frame bounds effectively? With <code>ROWS</code> it’s easy.\nWe only need to skip a determined number of rows forward or backwards.</p>\n<p>With <code>RANGE</code>, we need to examine the actual values to see if they fall within\nthe given range. Our approach is optimized for the case where the offset values\nare constant for all rows. Our solution involves caching frame bounds computed\nfor the preceding row, and using them as the starting point to find frame\nbounds for the current row. Ideally, we never have to move the frame bounds\nback as we process subsequent rows. In such a case, the amortized cost of frame\nbound calculations per row is constant.</p>\n<p><img src=\"https://trino.io/assets/blog/window-features/sliding-frame-range.svg\" alt=\"\"></p>\n<p>Our strategy for determining frame bounds for <code>GROUPS</code> is similar. We cache the\nframe bounds computed for the preceding row and use them as the starting point\nfor the current row. If the frame offset is constant, frame bounds slide from\none peer group to another every time the processed row leaves one peer group and\nenters the next one.</p>\n<p><img src=\"https://trino.io/assets/blog/window-features/sliding-frame-groups.svg\" alt=\"\"></p>\n<h2 id=\"support-for-window-clause\">\n    Support for WINDOW clause <a target=\"_blank\" href=\"https://trino.io/blog/2021/03/10/introducing-new-window-features.html#support-for-window-clause\">#</a>\n</h2>\n<p>As all the preceding examples show, a window function is a big chunk of syntax.\nWhat if we wanted to use several window functions over the same window? Say, we\nneed an average price and a total price from the preceding month. And the top\nprice. Does it have to look like the below?</p>\n<div><pre><code>SELECT\n    avg(totalprice) OVER (\n        PARTITION BY custkey \n        ORDER BY orderdate\n        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW),\n    sum(totalprice) OVER (\n        PARTITION BY custkey \n        ORDER BY orderdate\n        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW),\n    max(totalprice) OVER (\n        PARTITION BY custkey \n        ORDER BY orderdate\n        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)\nFROM orders\n</code></pre></div>\n<p>Well, no more. Starting with\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-352.html\">Trino 352</a>, you can\npredefine a window specification, and then use it or redefine it wherever you\nneed. This is thanks to the third of our new additions: support for <code>WINDOW</code>\nclause.</p>\n<p>Technically speaking, the <code>WINDOW</code> clause is part of the <code>FROM</code> clause:</p>\n<div><pre><code>SELECT …\n    FROM …\n        WHERE …\n        GROUP BY …\n        HAVING …\n        WINDOW …\nORDER BY …\nOFFSET …\nLIMIT / FETCH …\n</code></pre></div>\n<p>In the <code>WINDOW</code> clause, you can define any number of named windows. Then you\ncan simply refer to them by their names in the <code>SELECT</code> list or an <code>ORDER BY</code>\nclause.</p>\n<p>Let’s check how the <code>WINDOW</code> clause helps with our example query:</p>\n<div><pre><code>SELECT \n\tavg(totalprice) OVER w,\n\tsum(totalprice) OVER w,\n\tmax(totalprice) OVER w\nFROM orders\nWINDOW w AS (\n    PARTITION BY custkey\n    ORDER BY orderdate\n    RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)\n</code></pre></div>\n<p>To be even more concise, the <code>WINDOW</code> clause allows you to define more\nspecialized windows from existing window definitions:</p>\n<div><pre><code>WINDOW \n\tw1 AS (PARTITION BY custkey),\n\tw2 AS (w1 ORDER BY orderdate),\n\tw3 AS (w2 RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)\n</code></pre></div>\n<p>Alternatively you can define the window only partially and then complete it\nwhere it’s used:</p>\n<div><pre><code>SELECT \n\tavg(totalprice) OVER (w ROWS BETWEEN 10 PRECEDING AND CURRENT ROW) AS recent_average,\n\tsum(totalprice) OVER (w ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) AS next_buys,\nFROM orders\n    WINDOW w AS (PARTITION BY custkey ORDER BY orderdate)\n</code></pre></div>\n<p>There are some ANSI rules, though, you need to follow when redefining windows:</p>\n<ul>\n  <li><code>PARTITION BY</code> is only allowed in the base definition,</li>\n  <li><code>ORDER BY</code> can only be specified once in the named windows reference chain,</li>\n  <li>frame can only be specified in the final definition.</li>\n</ul>\n<p>In case you wonder, there’s no need to worry if some predefined windows are\neventually unused. Unused windows do not affect the efficiency of your query\nexecution. Partitioning, sorting and frame bound computations are costly\noperations. That’s why we made sure that unused window parts do not appear in\nthe query plan.</p>\n<p>There’s one last detail about the <code>WINDOW</code> clause that needs clarification. The\ncolumns referenced in the <code>WINDOW</code> clause are columns of the input table. In the\nfollowing example, <code>country_code</code> is clearly a column of the table <code>countries</code>:</p>\n<div><pre><code>... FROM countries WINDOW w AS (ORDER BY country_code)\n</code></pre></div>\n<p>Obvious enough. Why am I telling this?</p>\n<p>Window functions can be used in two different clauses of a query, <code>SELECT</code> and\n<code>ORDER BY</code>. With the <code>ORDER BY</code> clause, there is a rule that column references\nused there refer to the output table rather than the input table. Consider this\nquery:</p>\n<div><pre><code>WITH countries(country_code) AS (VALUES 'pol', 'CAN', 'USA')\nSELECT upper(country_code) AS country_code\n    FROM countries\n    WINDOW w AS (ORDER BY country_code)\nORDER BY row_number() OVER w\n</code></pre></div>\n<p>Window <code>w</code> is used in the <code>ORDER BY</code> clause. So, does the window’s ordering use\nthe original <code>country_code</code> column from the input table, or does it “see” the\nuppercased <code>country_code</code> from the output table?</p>\n<p><img src=\"https://trino.io/assets/blog/window-features/country-code.svg\" alt=\"\"></p>\n<p>The SQL spec is clear about it: a column reference in the named window always\nrefers to the original column, no matter where you use this window. In the\nexample, the result is ordered according to the original values: lowercase <code>pol</code>\nafter uppercase <code>USA</code>:</p>\n<p><img src=\"https://trino.io/assets/blog/window-features/country-code-result.svg\" alt=\"\"></p>\n<p>As expected:</p>\n<div><pre><code> country_code\n--------------\n CAN\n USA\n POL\n(3 rows)\n</code></pre></div>\n<p>And here the story ends. Thanks for your attention! I hope you enjoy Trino’s\nnew superpowers. In case of questions or issues — <a target=\"_blank\" href=\"https://trino.io/slack\">you\nknow where to find us</a>. More goodies are on the way, so stay tuned! How\nabout regex matching on tables?</p>\n  </div>\n</article>\n</div>"
---

In Trino, we are thrilled to get feedback and feature requests from our
fantastic community, and we’re tirelessly motivated to meet the expectations!
The SQL specification is another source of inspiration. From time to time, we
go through those encrypted scrolls to give you a new feature that you didn’t
even know you needed!
Recently, there was a push in Trino to extend support for window functions.
In this post, we explain the complexities of window function, and describe a
couple of our recent additions. If “window” doesn’t sound familiar, read on.
Already a window expert? Skip to what’s new.
A window is the structure you run your window function OVER. It has three
components:
partitioning
ordering
frame
You use partitioning to break your input data into independent chunks. Ordering
is to order rows within the partition. And frame is a kind of “sliding window”.
For every processed row, the frame encloses a certain portion of the sorted
partition. Your window function processes this portion and yields the result
for the row.
A “running average” is one simple example:

SELECT avg(totalprice) OVER (
    PARTITION BY custkey
    ORDER BY orderdate
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
FROM orders


For a particular customer identified by custkey, it sorts their orders by
date and computes a sequence of average prices since the beginning up to each
consecutive entry. The window frame for a row includes all rows from the start
up to and including that row.

According to standard SQL, there are 3 ways to specify the frame. The first way
is ROWS (like in the example). With ROWS, you can specify frame bounds by a
physical offset from the current row. While ROWS BETWEEN UNBOUNDED PRECEDING
AND CURRENT ROW means “between the beginning of the partition and the current
row”, you can also specify precisely where the frame starts and ends, for
example with: ROWS BETWEEN 10 PRECEDING AND 5 FOLLOWING.
RANGE is a more complicated way of defining frame on ordered data. It does
not rely on physical offset (in rows), but on logical offset (in value). That
is, the frame includes rows where the value is within a certain range from the
value in the current row.
Until recently, Trino only supported RANGE in limited cases.
You could use RANGE UNBOUNDED PRECEDING, CURRENT ROW and UNBOUNDED
FOLLOWING:
UNBOUNDED PRECEDING includes all rows since the partition start,
UNBOUNDED FOLLOWING includes all rows until the partition end,
CURRENT ROW is trickier. It includes all rows where values of the sort key
are the same as in the current row. We call them a peer group.
It’s time to introduce the first new feature:
 Full support for frame type RANGE
Since version 346, it is
possible to specify RANGE with an offset value. The frame includes all rows
whose value is within this range from the current row.
Let’s modify our example:

SELECT avg(totalprice) OVER (
    PARTITION BY custkey
    ORDER BY orderdate
    RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)
FROM orders


Now, for every row, we get the average price from the preceding month. Note that
the offset interval '1' month applies to orderdate, which is the sorting
column.

Of course, we don’t have to order by date. The sorting column can be of any
numeric or date/time type, and the offset must be compatible. Also, the offset
doesn’t have to be a literal. It can come in another column of a table or,
generally, it can be any expression, as long as the type matches.
A frame of type RANGE does not quite fit in the abstraction of a “sliding
window”. Frames can be bigger or smaller depending not only on the offset
values but also on the actual input data. A long series of similar entries can
produce a huge frame, while a gap in input values can result in an empty frame.
For illustration, imagine a group of students, and the results of some test they
took. Our table has two columns: student_id and result, which is the number
of points. For each student, let’s find how many students did better by 1 to 2
points:

WITH students_results(student_id, result) AS (VALUES
    ('student_1', 17),
    ('student_2', 16),
    ('student_3', 18),
    ('student_4', 18),
    ('student_5', 10),
    ('student_6', 20),
    ('student_7', 16))
SELECT
    student_id,
    result,
    count(*) OVER (
        ORDER BY result
        RANGE BETWEEN 1 FOLLOWING AND 2 FOLLOWING) AS close_better_scores_count
FROM students_results;

 student_id | result | close_better_scores_count
------------+--------+---------------------------
 student_5  |     10 |                         0
 student_7  |     16 |                         3
 student_2  |     16 |                         3
 student_1  |     17 |                         2
 student_3  |     18 |                         1
 student_4  |     18 |                         1
 student_6  |     20 |                         0
(7 rows)


Note that the frame does not contain the current row. For a particular student,
it only includes students with better results, and not themselves. For the
unfortunate student_5, there are no students with similar test results. The
frame is also empty for the lucky student_6 who scored the most points.

Besides ROWS and RANGE, there is another way to specify the frame on
ordered data. And yes, Trino supports this mechanism! Let me introduce the
second of our recent additions:
Support for frame type GROUPS
This feature, added in
version 346, allows you to
include or exclude the whole peer groups of rows in ordered data.
For illustration, let’s consider again the students_results table. For each
student, let’s find the gap between their result and the result of a student (or
students) who did slightly better.

WITH students_results(student_id, result) AS (VALUES
    ('student_1', 17),
    ('student_2', 16),
    ('student_3', 18),
    ('student_4', 18),
    ('student_5', 10),
    ('student_6', 20),
    ('student_7', 16))
SELECT
    student_id,
    result,
    max(result) OVER (
        ORDER BY result
        GROUPS BETWEEN CURRENT ROW AND 1 FOLLOWING) - result AS gap_till_better_score
FROM students_results;

 student_id | result | gap_till_better_score
------------+--------+-----------------------
 student_5  |     10 |                     6
 student_7  |     16 |                     1
 student_2  |     16 |                     1
 student_1  |     17 |                     1
 student_3  |     18 |                     2
 student_4  |     18 |                     2
 student_6  |     20 |                     0
(7 rows)


The window function for each student returns the closest better result. The
frame of type GROUPS used here, includes all entries equal to the current
entry in terms of points (that is the student’s peer group), and the next
group.

In frames of type GROUPS, like in other frame types, the offset doesn’t have
to be constant. It can be any expression, as long as its type is exact numeric
with scale 0. Simply put, we can skip any integer number of groups.
Under the covers
How do we deal with finding the frame bounds effectively? With ROWS it’s easy.
We only need to skip a determined number of rows forward or backwards.
With RANGE, we need to examine the actual values to see if they fall within
the given range. Our approach is optimized for the case where the offset values
are constant for all rows. Our solution involves caching frame bounds computed
for the preceding row, and using them as the starting point to find frame
bounds for the current row. Ideally, we never have to move the frame bounds
back as we process subsequent rows. In such a case, the amortized cost of frame
bound calculations per row is constant.

Our strategy for determining frame bounds for GROUPS is similar. We cache the
frame bounds computed for the preceding row and use them as the starting point
for the current row. If the frame offset is constant, frame bounds slide from
one peer group to another every time the processed row leaves one peer group and
enters the next one.

Support for WINDOW clause
As all the preceding examples show, a window function is a big chunk of syntax.
What if we wanted to use several window functions over the same window? Say, we
need an average price and a total price from the preceding month. And the top
price. Does it have to look like the below?

SELECT
    avg(totalprice) OVER (
        PARTITION BY custkey 
        ORDER BY orderdate
        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW),
    sum(totalprice) OVER (
        PARTITION BY custkey 
        ORDER BY orderdate
        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW),
    max(totalprice) OVER (
        PARTITION BY custkey 
        ORDER BY orderdate
        RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)
FROM orders


Well, no more. Starting with
Trino 352, you can
predefine a window specification, and then use it or redefine it wherever you
need. This is thanks to the third of our new additions: support for WINDOW
clause.
Technically speaking, the WINDOW clause is part of the FROM clause:

SELECT …
    FROM …
        WHERE …
        GROUP BY …
        HAVING …
        WINDOW …
ORDER BY …
OFFSET …
LIMIT / FETCH …


In the WINDOW clause, you can define any number of named windows. Then you
can simply refer to them by their names in the SELECT list or an ORDER BY
clause.
Let’s check how the WINDOW clause helps with our example query:

SELECT 
	avg(totalprice) OVER w,
	sum(totalprice) OVER w,
	max(totalprice) OVER w
FROM orders
WINDOW w AS (
    PARTITION BY custkey
    ORDER BY orderdate
    RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)


To be even more concise, the WINDOW clause allows you to define more
specialized windows from existing window definitions:

WINDOW 
	w1 AS (PARTITION BY custkey),
	w2 AS (w1 ORDER BY orderdate),
	w3 AS (w2 RANGE BETWEEN interval '1' month PRECEDING AND CURRENT ROW)


Alternatively you can define the window only partially and then complete it
where it’s used:

SELECT 
	avg(totalprice) OVER (w ROWS BETWEEN 10 PRECEDING AND CURRENT ROW) AS recent_average,
	sum(totalprice) OVER (w ROWS BETWEEN CURRENT ROW AND 10 FOLLOWING) AS next_buys,
FROM orders
    WINDOW w AS (PARTITION BY custkey ORDER BY orderdate)


There are some ANSI rules, though, you need to follow when redefining windows:
PARTITION BY is only allowed in the base definition,
ORDER BY can only be specified once in the named windows reference chain,
frame can only be specified in the final definition.
In case you wonder, there’s no need to worry if some predefined windows are
eventually unused. Unused windows do not affect the efficiency of your query
execution. Partitioning, sorting and frame bound computations are costly
operations. That’s why we made sure that unused window parts do not appear in
the query plan.
There’s one last detail about the WINDOW clause that needs clarification. The
columns referenced in the WINDOW clause are columns of the input table. In the
following example, country_code is clearly a column of the table countries:

... FROM countries WINDOW w AS (ORDER BY country_code)


Obvious enough. Why am I telling this?
Window functions can be used in two different clauses of a query, SELECT and
ORDER BY. With the ORDER BY clause, there is a rule that column references
used there refer to the output table rather than the input table. Consider this
query:

WITH countries(country_code) AS (VALUES 'pol', 'CAN', 'USA')
SELECT upper(country_code) AS country_code
    FROM countries
    WINDOW w AS (ORDER BY country_code)
ORDER BY row_number() OVER w


Window w is used in the ORDER BY clause. So, does the window’s ordering use
the original country_code column from the input table, or does it “see” the
uppercased country_code from the output table?

The SQL spec is clear about it: a column reference in the named window always
refers to the original column, no matter where you use this window. In the
example, the result is ordered according to the original values: lowercase pol
after uppercase USA:

As expected:

 country_code
--------------
 CAN
 USA
 POL
(3 rows)


And here the story ends. Thanks for your attention! I hope you enjoy Trino’s
new superpowers. In case of questions or issues — you
know where to find us. More goodies are on the way, so stay tuned! How
about regex matching on tables?
