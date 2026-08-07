---
title: "Row pattern recognition with MATCH_RECOGNIZE"
link: "https://trino.io/blog/2021/05/19/row_pattern_matching.html"
guid: "https://trino.io/blog/2021/05/19/row_pattern_matching.html"
pubDate: "2021-05-19T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "The MATCH_RECOGNIZE syntax was introduced in the latest SQL specification\nof 2016. It is a super powerful tool for analyzing trends in your data. We are\nproud to announce that Trino supports this great feature since\nversion 356. With\nMATCH_RECOGNIZE, you can define a pattern using the well-known regular\nexpression syntax, and match it to a set of rows. Upon finding a matching row\nsequence, you can retrieve all kinds of detailed or summary information about\nthe match, and pass it on to be processed by the subsequent parts of your\nquery. This is a new level of what a pure SQL statement can do.\nThis blog post gives you a taste of row pattern matching capabilities, and a\nquick overview of the MATCH_RECOGNIZE syntax.\nA regular expression and a table: a fruitful relationship\nThe regex matching we all know is about searching for patterns in character\nstrings. But how does a regex match a sequence of rows? Certainly, a row of\ndata is a more complex structure than a character. And so, row pattern matching\nis more expressive than regex matching in text. Unlike characters, which stay\nconstantly in their places in a string, rows aren’t assigned up-front to\npattern components. This is where the additional level of complexity comes\nfrom: whether the row is an A, B or C, is conditional. It is revealed as\nthe pattern matching goes forward. It depends on the data in the row, but also\non the context of the current match and even on the match number. Also, a row\ncan match different labels at a time.\nConsider this simple example:\n\nPATTERN: A B+ C D?\n\n\nFirst, let’s match it to the string \"ABBCEE\". There is exactly one way to\nmatch it: the prefix \"ABBC\" is a match.\nNow, let’s see what it takes to match a pattern to rows of a table.\nConsider the table numbers with a single column number:\n\nYou need defining conditions to define how the rows of the table can be\nmapped to pattern components A, B, C and D:\n\nDEFINE:\n    A <- true (matches every row)\n    B <- number is greater than previous number\n    C <- number is lower or equal to A\n    D <- matches every row, but only in the first match;\n         otherwise doesn't match any row\n\n\nAs you can see, the conditions can refer to other pattern components (C\n depends on A), or the sequential match number (D).\nWhen searching for a match, the engine goes row by row, and assigns labels\naccording to the pattern. Every time the pattern shows the next component\n(label) to be matched, the defining condition of that component is evaluated\nfor the current row in the context of the partial match.\n\nAfter finding a match, you can step one row forward and search for another one.\n\nSo far, two matches were found in the same set of rows. Interestingly, a row\nthat was labeled as B in the first match, became A in the second match.\nLet’s try to find another match.\n\nTime to get more technical\n…and use some real life money examples.\nIn the preceding examples, the pattern consisted of components A, B, C\nand D. They were chosen this way to capture the analogy between pattern\nmatching in a string and pattern matching in a set of rows. According to the\nSQL specification, row pattern components can be named with arbitrary\nidentifiers, as long as they are compliant with the SQL identifier semantics,\nso you don’t need to limit yourself to single-letter names, and instead you can\nuse more verbose labels.\nOfficially, the pattern components, or labels, are called the primary pattern\nvariables. They are the basic components of the row pattern. Consider the\nfollowing example:\n\nPATTERN( START DOWN+ UP+ )\n\n\nThere are three primary pattern variables: START, DOWN and UP. The + is\nthe “one or more” quantifier you know from the regex syntax. Intuitively, this\npattern should match a sequence of rows which are first “decreasing”, and then\n“increasing”. You need to inform the engine how it should map rows to the\nvariables. In other words, you need to define what the “decreasing” and\n“increasing” rows are:\n\nDEFINE DOWN AS price < PREV(price),\n       UP AS price > PREV(price)\n\n\nNow it’s clear that “decreasing” and “increasing” is about the price values.\nThere is no defining condition for the START variable, which informs the\nengine that the match can start anywhere.\nThe preceding example shows the two key clauses of row pattern recognition:\nPATTERN and DEFINE. Let’s see what other keywords there are in the\nMATCH_RECOHNIZE clause.\nSyntax overview\nThe MATCH_RECOGNIZE syntax is long and rich enough to capture everything that\na pattern matching tool needs, and all the options which let you easily toggle\nyour matching strategies.\nTechnically, MATCH_RECOGNIZE is part of the FROM clause:\n\nSELECT ...\n    FROM some_table\n        MATCH_RECOGNIZE (\n          [ PARTITION BY column [, ...] ]\n          [ ORDER BY column [, ...] ]\n          [ MEASURES measure_definition [, ...] ]\n          [ rows_per_match ]\n          [ AFTER MATCH skip_to ]\n          PATTERN ( row_pattern )\n          [ SUBSET subset_definition [, ...] ]\n          DEFINE variable_definition [, ...]\n          )\n\n\nMATCH_RECOGNIZE can be used in the query as one of the stages of processing\ndata. You can SELECT from its results or even stream them into another\nMATCH_RECOGNIZE.\nThe PATTERN and DEFINE clauses are the heart of row pattern recognition.\nThey are also the only two required subclauses of MATCH_RECOGNIZE. They were\ntouched upon in the previous section.\nThe pattern syntax is close to regular expression syntax. It also supports some\nextensions specific to row pattern recognition. They are explained in\nRow pattern syntax.\nThe PARTITION BY and ORDER BY clauses are similar to those in the WINDOW\nsyntax. They help you structure the input data. You can use PARTITION BY to\nbreak up your data into independent chunks. ORDER BY is useful to establish \nthe order of rows before searching for the pattern. Typically, you want to\nanalyze series of events over time, so ordering by date is a good choice.\n\nIn the MEASURES clause, you can specify what information you need about every\nmatch that is found. In the example, if you’re interested in the order date,\nthe lowest value of price and the sequential number of the match, this is the\nway to retrieve them:\n\nMEASURES order_date AS date,\n         LAST(DOWN.price) AS bottom_price,\n         MATCH_NUMBER() AS match_no\n\n\ndate, bottom_price and match_no are exposed by the pattern recognition\nclause as output columns.\nThe expressions in the MEASURES and DEFINE clauses allow you to combine the\ninput data with the information about the matched pattern. They support many\nextensions and special constructs to help you get the most of your data, both\nwhen defining the pattern, and retrieving useful information after a successful\nmatch. The special keyword LAST is one example. For the full list of the\nmagic spells, check Expressions for special tasks.\nThe MATCH_RECOGNIZE clause has two useful toggles. The first of them lets you\nchoose whether the output includes all rows of the match, or a single-row\nsummary. For all rows, specify ALL ROWS PER MATCH. For a single row, choose\nthe default ONE ROW PER MATCH. There are also sub-options available, enabling\ndifferent handling of empty matches and unmatched rows.\n\nAnother toggle is the AFTER MATCH SKIP clause. It allows you to specify where\nthe row pattern matching resumes after finding a match. The default option is\nAFTER MATCH SKIP PAST LAST ROW, but you can also skip to the next row or to a\nspecific position in the match based on the matched pattern variables.\n\nThe SUBSET clause is where the union pattern variables are defined. They\nare a concise way to refer to a group of primary pattern variables:\n\nSUBSET U = (DOWN, UP)\n\n\nThe following expression returns the value of price from the last row\nmatched either to DOWN or UP primary variable:\n\nLAST(U.price)\n\n\n Row pattern syntax\nThe basic element of row pattern is the primary pattern variable. Other syntax\ncomponents include:\nConcatenation\n\nA B C\n\n\nAlternation\n\nA | B | C\n\n\nPermutation\n\nPERMUTE(A, B, C)\n\n\nGrouping\n\n(A B C)\n\n\nPartition start anchor\n\n^\n\n\nPartition end anchor\n\n$\n\n\nEmpty pattern\n\n()\n\n\nExclusion syntax\n\n{- row_pattern -}\n\n\nExclusion syntax is useful in combination with the ALL ROWS PER MATCH option.\nIf you find some sections of the match uninteresting, you can wrap them in the\nexclusion, and they are dropped from the output.\n\nQuantifiers\nRow pattern syntax supports all kinds of quantifiers: the basic ones *, +,\n?, and others, which let you specify the exact number of repetitions, or the\naccepted range: {n}, {n, m}, {n,}, {,n}. Make sure you don’t confuse\nthose:\n{n} is for exactly n repetitions,\n{n,} is equal to {n, ∞},\n{,n} is equal to {0, n}.\nQuantifiers are greedy by default. It means that they prefer higher number of\nrepetitions over lower number. If you want it the other way, you can change a\nquantifier to reluctant by appending ? immediately after it. So, (pattern)?\nprefers a single match of the pattern, while (pattern)?? would rather omit\nthe pattern altogether.\nMatch preference\nMATCH_RECOGNIZE is supposed to produce at most one match starting from a\nspecific row. If there are more matches available, the winner is chosen based\non the order of preference. The greedy and reluctant quantifiers are one\nexample of preference. Other pattern components have their own rules:\npattern alternation prefers the left-hand components to the right-hand ones.\npattern permutation is equivalent to alternation of all permutations of its\ncomponents. If multiple matches are possible, the match is chosen based on the\nlexicographical order established by the order of components in the PERMUTE\nlist. For PERMUTE(A, B, C), the preference of options goes as follows:\nA B C, A C B, B A C, B C A, C A B, C B A.\n Expressions for special tasks\nThe MATCH_RECOGNIZE clause provides special expression syntax, available in\nthe MEASURES and DEFINE clauses. Its purpose is to combine the input data\nwith the information about the match. The syntax includes:\nPattern variable references\nThey allow referring to certain components of the match, for example\nDOWN.price, UP.order_date.\nLogical navigation operations: LAST, FIRST\nThey allow you to navigate over the rows of a match based on the pattern\nvariables assigned to them. For example, LAST(DOWN.price, 3) navigates to the\nlast row labeled as “DOWN”, goes three occurrences of the “DOWN” label\nbackwards, and gets the price value from that row. The default offset is 0:\nLAST(DOWN.price) gets the price value from the last row labeled as “DOWN”.\nIf the logical navigation goes beyond the match bounds, the operation returns\nnull.\nPhysical navigation operations: PREV, NEXT\nThey let you navigate over the rows of the partition by a specified offset.\nPhysical navigations use logical navigations as the starting point. For\nexample, NEXT(DOWN.price, 5) first navigates to the last row labeled as\n“DOWN”. Starting from there, it goes five rows forward and gets the price\nvalue from that row. In the preceding example, the logical navigation LAST is\nimplicit, but you can specify the nested logical navigation explicitly, for\nexample NEXT(FIRST(DOWN.price, 4), 5). The default offset is 1, which means\nthat the physical navigations by default go one row backwards, or one row\nforward.\nThe physical navigation can retrieve values beyond the match bounds. It gives\nyou great flexibility. For example, the defining conditions of pattern\nvariables can peek at the values ahead. Also, when computing row pattern\nmeasures, you can refer to the wider context of the match.\nThe CLASSIFIER function\nIt returns the primary pattern variable associated with the row.\nThe MATCH_NUMBER function\nIt returns the sequential number of the match within the partition.\nThe RUNNING and FINAL keywords\nThe expressions in the DEFINE clause are evaluated when the pattern matching\nis in progress. At each step, the engine only knows a part of the match. This\nis the running semantics.\nThe expressions of the MEASURES clause are evaluated when the match is\ncomplete. The engine can see the whole match from the position of the final\nrow. This is the final semantics.\nHowever, with the ALL ROWS PER MATCH option, when the match result is\nprocessed row by row, you can choose either approach to compute the measures.\nTo do that, you can specify the RUNNING or FINAL keyword before the logical\nnavigation operation, for example RUNNING LAST(DOWN.price) or\nFINAL LAST(DOWN.price).\nThe running semantics is the default both in the DEFINE and MESAURES\nclauses. Note that FINAL only applies to the MEASURES clause.\nTo sum up, here’s one complex measure expression combining different elements\nof the special syntax:\n\nTrino CLI show-off time!\nNow, let’s see the whole machinery come to life. This is the same example data\nthat we used before, and the same goal: detect a “V”-shape of the price\nvalues over time for different customers.\n\ntrino> WITH orders(customer_id, order_date, price) AS (VALUES\n    ('cust_1', DATE '2020-05-11', 100),\n    ('cust_1', DATE '2020-05-12', 200),\n    ('cust_2', DATE '2020-05-13',   8),\n    ('cust_1', DATE '2020-05-14', 100),\n    ('cust_2', DATE '2020-05-15',   4),\n    ('cust_1', DATE '2020-05-16',  50),\n    ('cust_1', DATE '2020-05-17', 100),\n    ('cust_2', DATE '2020-05-18',   6))\nSELECT customer_id, start_price, bottom_price, final_price, start_date, final_date\n    FROM orders\n        MATCH_RECOGNIZE (\n            PARTITION BY customer_id\n            ORDER BY order_date\n            MEASURES\n                START.price AS start_price,\n                LAST(DOWN.price) AS bottom_price,\n                LAST(UP.price) AS final_price,\n                START.order_date AS start_date,\n                LAST(UP.order_date) AS final_date\n            ONE ROW PER MATCH\n            AFTER MATCH SKIP PAST LAST ROW\n            PATTERN (START DOWN+ UP+)\n            DEFINE\n                DOWN AS price < PREV(price),\n                UP AS price > PREV(price)\n            );\n\n customer_id | start_price | bottom_price | final_price | start_date | final_date\n-------------+-------------+--------------+-------------+------------+------------\n cust_1      |         200 |           50 |         100 | 2020-05-12 | 2020-05-17\n cust_2      |           8 |            4 |           6 | 2020-05-13 | 2020-05-18\n(2 rows)\n\n\nTwo matches are detected, one for cust_1, and one for cust_2.\nEmpty matches explained\nAn empty match is a legit result of row pattern recognition. There are\ndifferent pattern constructs that can result in an empty match. The empty\npattern syntax () is the trivial one. Empty match can also result e.g. from\nquantification: A*, or alternation: A | ().\nAn empty match does not consume any input rows, but like every match, it is\nassociated with a row, called the starting row. That is the row at which the\npattern matching started. Note that if the pattern allows an empty match, it\nguarantees that no rows remain unmatched. Also, an empty match, as well as\nnon-empty matches, gets a sequential number, which can be retrieved by the\nMATCH_NUMBER function.\nDepending on your use case, you can consider empty matches informative or just\nsee them as a leftover of the algorithm.\nThere’s one more thing linked to empty matches. Some patterns have the\ndangerous potential of looping endlessly over a piece that doesn’t consume any\nrows. It doesn’t have to be as explicit as ()*. There are complex patterns\nthat don’t show their looping potential at first glance. We handled them\ncarefully so that you never have to waste your time on looping queries.\nIn a few words, what’s so cool about row pattern matching?\nFrom the SQL viewpoint, you can think of row pattern matching as extended\nwindow functions. Window functions allow you to capture some dependencies in\nrows of data based on their relative position or value. Row pattern matching\nallows you to detect arbitrarily complicated dependencies, based not only on\nthe input values but also on the details of the actual match and on the match\nnumber.\nBefore the introduction of MATCH_RECOGNIZE, you had to feed your data to\nexternal tools to reason about trends and patterns. Now, you can achieve it\ndirectly in your query, and even build your query upon the pattern recognition\nclause to further process the match results.\nRow pattern matching is typically used:\nin trade applications for tracking trends or identifying customers with\nspecific behavioral patterns,\nin shipping applications for tracking packages through all possible valid\npaths,\nin financial applications for detecting unusual incidents, which might signal\nfraud.\nWhat’s your use case?\nI hope you enjoy Trino’s new feature. Refer to\nTrino docs for even\nmore details, examples and usage tips. Please do reach out to us with any\nquestions or issues. We plan to support row pattern matching in\nthe WINDOW clause soon, so stay tuned!"
author: "Kasia Findeisen (kasiafi)"
contentHtml: "<div>\n<article>\n  <div><p>The <code>MATCH_RECOGNIZE</code> syntax was introduced in the latest SQL specification\nof 2016. It is a super powerful tool for analyzing trends in your data. We are\nproud to announce that Trino supports this great feature since\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-356.html\">version 356</a>. With\n<code>MATCH_RECOGNIZE</code>, you can define a pattern using the well-known regular\nexpression syntax, and match it to a set of rows. Upon finding a matching row\nsequence, you can retrieve all kinds of detailed or summary information about\nthe match, and pass it on to be processed by the subsequent parts of your\nquery. This is a new level of what a pure SQL statement can do.</p>\n<p>This blog post gives you a taste of row pattern matching capabilities, and a\nquick overview of the <code>MATCH_RECOGNIZE</code> syntax.</p>\n<!--more-->\n<h2 id=\"a-regular-expression-and-a-table-a-fruitful-relationship\">\n    A regular expression and a table: a fruitful relationship <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#a-regular-expression-and-a-table-a-fruitful-relationship\">#</a>\n</h2>\n<p>The regex matching we all know is about searching for patterns in character\nstrings. But how does a regex match a sequence of rows? Certainly, a row of\ndata is a more complex structure than a character. And so, row pattern matching\nis more expressive than regex matching in text. Unlike characters, which stay\nconstantly in their places in a string, rows aren’t assigned up-front to\npattern components. This is where the additional level of complexity comes\nfrom: whether the row is an <code>A</code>, <code>B</code> or <code>C</code>, is conditional. It is revealed as\nthe pattern matching goes forward. It depends on the data in the row, but also\non the context of the current match and even on the match number. Also, a row\ncan match different labels at a time.</p>\n<p>Consider this simple example:</p>\n<div><pre><code>PATTERN: A B+ C D?\n</code></pre></div>\n<p>First, let’s match it to the string <code>\"ABBCEE\"</code>. There is exactly one way to\nmatch it: the prefix <code>\"ABBC\"</code> is a match.</p>\n<p>Now, let’s see what it takes to match a pattern to rows of a table.\nConsider the table <code>numbers</code> with a single column <code>number</code>:</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/table-numbers.svg\" alt=\"\"></p>\n<p>You need <code>defining conditions</code> to define how the rows of the table can be\nmapped to pattern components <code>A</code>, <code>B</code>, <code>C</code> and <code>D</code>:</p>\n<div><pre><code>DEFINE:\n    A &lt;- true (matches every row)\n    B &lt;- number is greater than previous number\n    C &lt;- number is lower or equal to A\n    D &lt;- matches every row, but only in the first match;\n         otherwise doesn't match any row\n</code></pre></div>\n<p>As you can see, the conditions can refer to other pattern components (<code>C</code>\n depends on <code>A</code>), or the sequential match number (<code>D</code>).</p>\n<p>When searching for a match, the engine goes row by row, and assigns labels\naccording to the pattern. Every time the pattern shows the next component\n(label) to be matched, the defining condition of that component is evaluated\nfor the current row in the context of the partial match.</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/first-match.svg\" alt=\"\"></p>\n<p>After finding a match, you can step one row forward and search for another one.</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/second-match.svg\" alt=\"\"></p>\n<p>So far, two matches were found in the same set of rows. Interestingly, a row\nthat was labeled as <code>B</code> in the first match, became <code>A</code> in the second match.\nLet’s try to find another match.</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/third-match.svg\" alt=\"\"></p>\n<h2 id=\"time-to-get-more-technical\">\n    Time to get more technical <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#time-to-get-more-technical\">#</a>\n</h2>\n<p>…and use some real  money examples.</p>\n<p>In the preceding examples, the pattern consisted of components <code>A</code>, <code>B</code>, <code>C</code>\nand <code>D</code>. They were chosen this way to capture the analogy between pattern\nmatching in a string and pattern matching in a set of rows. According to the\nSQL specification, row pattern components can be named with arbitrary\nidentifiers, as long as they are compliant with the SQL identifier semantics,\nso you don’t need to limit yourself to single-letter names, and instead you can\nuse more verbose labels.</p>\n<p>Officially, the pattern components, or labels, are called the <code>primary pattern\nvariables</code>. They are the basic components of the row pattern. Consider the\nfollowing example:</p>\n<div><pre><code>PATTERN( START DOWN+ UP+ )\n</code></pre></div>\n<p>There are three primary pattern variables: <code>START</code>, <code>DOWN</code> and <code>UP</code>. The <code>+</code> is\nthe “one or more” quantifier you know from the regex syntax. Intuitively, this\npattern should match a sequence of rows which are first “decreasing”, and then\n“increasing”. You need to inform the engine how it should map rows to the\nvariables. In other words, you need to define what the “decreasing” and\n“increasing” rows are:</p>\n<div><pre><code>DEFINE DOWN AS price &lt; PREV(price),\n       UP AS price &gt; PREV(price)\n</code></pre></div>\n<p>Now it’s clear that “decreasing” and “increasing” is about the <code>price</code> values.\nThere is no defining condition for the <code>START</code> variable, which informs the\nengine that the match can start anywhere.</p>\n<p>The preceding example shows the two key clauses of row pattern recognition:\n<code>PATTERN</code> and <code>DEFINE</code>. Let’s see what other keywords there are in the\n<code>MATCH_RECOHNIZE</code> clause.</p>\n<h2 id=\"syntax-overview\">\n    Syntax overview <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#syntax-overview\">#</a>\n</h2>\n<p>The <code>MATCH_RECOGNIZE</code> syntax is long and rich enough to capture everything that\na pattern matching tool needs, and all the options which let you easily toggle\nyour matching strategies.</p>\n<p>Technically, <code>MATCH_RECOGNIZE</code> is part of the <code>FROM</code> clause:</p>\n<div><pre><code>SELECT ...\n    FROM some_table\n        MATCH_RECOGNIZE (\n          [ PARTITION BY column [, ...] ]\n          [ ORDER BY column [, ...] ]\n          [ MEASURES measure_definition [, ...] ]\n          [ rows_per_match ]\n          [ AFTER MATCH skip_to ]\n          PATTERN ( row_pattern )\n          [ SUBSET subset_definition [, ...] ]\n          DEFINE variable_definition [, ...]\n          )\n</code></pre></div>\n<p><code>MATCH_RECOGNIZE</code> can be used in the query as one of the stages of processing\ndata. You can <code>SELECT</code> from its results or even stream them into another\n<code>MATCH_RECOGNIZE</code>.</p>\n<p>The <code>PATTERN</code> and <code>DEFINE</code> clauses are the heart of row pattern recognition.\nThey are also the only two required subclauses of <code>MATCH_RECOGNIZE</code>. They were\ntouched upon in the previous section.</p>\n<p>The pattern syntax is close to regular expression syntax. It also supports some\nextensions specific to row pattern recognition. They are explained in\n<a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#pattern-syntax\">Row pattern syntax</a>.</p>\n<p>The <code>PARTITION BY</code> and <code>ORDER BY</code> clauses are similar to those in the <code>WINDOW</code>\nsyntax. They help you structure the input data. You can use <code>PARTITION BY</code> to\nbreak up your data into independent chunks. <code>ORDER BY</code> is useful to establish \nthe order of rows before searching for the pattern. Typically, you want to\nanalyze series of events over time, so ordering by date is a good choice.</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/partition-by-order-by.svg\" alt=\"\"></p>\n<p>In the <code>MEASURES</code> clause, you can specify what information you need about every\nmatch that is found. In the example, if you’re interested in the order date,\nthe lowest value of <code>price</code> and the sequential number of the match, this is the\nway to retrieve them:</p>\n<div><pre><code>MEASURES order_date AS date,\n         LAST(DOWN.price) AS bottom_price,\n         MATCH_NUMBER() AS match_no\n</code></pre></div>\n<p><code>date</code>, <code>bottom_price</code> and <code>match_no</code> are exposed by the pattern recognition\nclause as output columns.</p>\n<p>The expressions in the <code>MEASURES</code> and <code>DEFINE</code> clauses allow you to combine the\ninput data with the information about the matched pattern. They support many\nextensions and special constructs to help you get the most of your data, both\nwhen defining the pattern, and retrieving useful information after a successful\nmatch. The special keyword <code>LAST</code> is one example. For the full list of the\nmagic spells, check <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#expressions\">Expressions for special tasks</a>.</p>\n<p>The <code>MATCH_RECOGNIZE</code> clause has two useful toggles. The first of them lets you\nchoose whether the output includes all rows of the match, or a single-row\nsummary. For all rows, specify <code>ALL ROWS PER MATCH</code>. For a single row, choose\nthe default <code>ONE ROW PER MATCH</code>. There are also sub-options available, enabling\ndifferent handling of empty matches and unmatched rows.</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/rows-per-match.svg\" alt=\"\"></p>\n<p>Another toggle is the <code>AFTER MATCH SKIP</code> clause. It allows you to specify where\nthe row pattern matching resumes after finding a match. The default option is\n<code>AFTER MATCH SKIP PAST LAST ROW</code>, but you can also skip to the next row or to a\nspecific position in the match based on the matched pattern variables.</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/after-match-skip.svg\" alt=\"\"></p>\n<p>The <code>SUBSET</code> clause is where the <code>union pattern variables</code> are defined. They\nare a concise way to refer to a group of primary pattern variables:</p>\n<div><pre><code>SUBSET U = (DOWN, UP)\n</code></pre></div>\n<p>The following expression returns the value of <code>price</code> from the last row\nmatched either to <code>DOWN</code> or <code>UP</code> primary variable:</p>\n<div><pre><code>LAST(U.price)\n</code></pre></div>\n<h2 id=\"-row-pattern-syntax\">\n    <a></a> Row pattern syntax <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#-row-pattern-syntax\">#</a>\n</h2>\n<p>The basic element of row pattern is the primary pattern variable. Other syntax\ncomponents include:</p>\n<p><strong>Concatenation</strong></p>\n<div><pre><code>A B C\n</code></pre></div>\n<p><strong>Alternation</strong></p>\n<div><pre><code>A | B | C\n</code></pre></div>\n<p><strong>Permutation</strong></p>\n<div><pre><code>PERMUTE(A, B, C)\n</code></pre></div>\n<p><strong>Grouping</strong></p>\n<div><pre><code>(A B C)\n</code></pre></div>\n<p><strong>Partition start anchor</strong></p>\n<div><pre><code>^\n</code></pre></div>\n<p><strong>Partition end anchor</strong></p>\n<div><pre><code>$\n</code></pre></div>\n<p><strong>Empty pattern</strong></p>\n<div><pre><code>()\n</code></pre></div>\n<p><strong>Exclusion syntax</strong></p>\n<div><pre><code>{- row_pattern -}\n</code></pre></div>\n<p>Exclusion syntax is useful in combination with the <code>ALL ROWS PER MATCH</code> option.\nIf you find some sections of the match uninteresting, you can wrap them in the\nexclusion, and they are dropped from the output.</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/exclusion.svg\" alt=\"\"></p>\n<p><strong>Quantifiers</strong></p>\n<p>Row pattern syntax supports all kinds of quantifiers: the basic ones <code>*</code>, <code>+</code>,\n<code>?</code>, and others, which let you specify the exact number of repetitions, or the\naccepted range: <code>{n}</code>, <code>{n, m}</code>, <code>{n,}</code>, <code>{,n}</code>. Make sure you don’t confuse\nthose:</p>\n<ul>\n  <li><code>{n}</code> is for exactly n repetitions,</li>\n  <li><code>{n,}</code> is equal to <code>{n, ∞}</code>,</li>\n  <li><code>{,n}</code> is equal to <code>{0, n}</code>.</li>\n</ul>\n<p>Quantifiers are greedy by default. It means that they prefer higher number of\nrepetitions over lower number. If you want it the other way, you can change a\nquantifier to reluctant by appending <code>?</code> immediately after it. So, <code>(pattern)?</code>\nprefers a single match of the pattern, while <code>(pattern)??</code> would rather omit\nthe pattern altogether.</p>\n<h3 id=\"match-preference\">\n    Match preference <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#match-preference\">#</a>\n</h3>\n<p><code>MATCH_RECOGNIZE</code> is supposed to produce at most one match starting from a\nspecific row. If there are more matches available, the winner is chosen based\non the order of preference. The greedy and reluctant quantifiers are one\nexample of preference. Other pattern components have their own rules:</p>\n<ul>\n  <li>\n    <p>pattern alternation prefers the left-hand components to the right-hand ones.</p>\n  </li>\n  <li>\n    <p>pattern permutation is equivalent to alternation of all permutations of its\ncomponents. If multiple matches are possible, the match is chosen based on the\nlexicographical order established by the order of components in the <code>PERMUTE</code>\nlist. For <code>PERMUTE(A, B, C)</code>, the preference of options goes as follows:\n<code>A B C</code>, <code>A C B</code>, <code>B A C</code>, <code>B C A</code>, <code>C A B</code>, <code>C B A</code>.</p>\n  </li>\n</ul>\n<h2 id=\"-expressions-for-special-tasks\">\n    <a></a> Expressions for special tasks <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#-expressions-for-special-tasks\">#</a>\n</h2>\n<p>The <code>MATCH_RECOGNIZE</code> clause provides special expression syntax, available in\nthe <code>MEASURES</code> and <code>DEFINE</code> clauses. Its purpose is to combine the input data\nwith the information about the match. The syntax includes:</p>\n<ul>\n  <li><strong>Pattern variable references</strong></li>\n</ul>\n<p>They allow referring to certain components of the match, for example\n<code>DOWN.price</code>, <code>UP.order_date</code>.</p>\n<ul>\n  <li><strong>Logical navigation operations: <code>LAST</code>, <code>FIRST</code></strong></li>\n</ul>\n<p>They allow you to navigate over the rows of a match based on the pattern\nvariables assigned to them. For example, <code>LAST(DOWN.price, 3)</code> navigates to the\nlast row labeled as “DOWN”, goes three occurrences of the “DOWN” label\nbackwards, and gets the <code>price</code> value from that row. The default offset is <code>0</code>:\n<code>LAST(DOWN.price)</code> gets the <code>price</code> value from the last row labeled as “DOWN”.\nIf the logical navigation goes beyond the match bounds, the operation returns\n<code>null</code>.</p>\n<ul>\n  <li><strong>Physical navigation operations: <code>PREV</code>, <code>NEXT</code></strong></li>\n</ul>\n<p>They let you navigate over the rows of the partition by a specified offset.\nPhysical navigations use logical navigations as the starting point. For\nexample, <code>NEXT(DOWN.price, 5)</code> first navigates to the last row labeled as\n“DOWN”. Starting from there, it goes five rows forward and gets the <code>price</code>\nvalue from that row. In the preceding example, the logical navigation <code>LAST</code> is\nimplicit, but you can specify the nested logical navigation explicitly, for\nexample <code>NEXT(FIRST(DOWN.price, 4), 5)</code>. The default offset is <code>1</code>, which means\nthat the physical navigations by default go one row backwards, or one row\nforward.</p>\n<p>The physical navigation can retrieve values beyond the match bounds. It gives\nyou great flexibility. For example, the defining conditions of pattern\nvariables can peek at the values ahead. Also, when computing row pattern\nmeasures, you can refer to the wider context of the match.</p>\n<ul>\n  <li><strong>The <code>CLASSIFIER</code> function</strong></li>\n</ul>\n<p>It returns the primary pattern variable associated with the row.</p>\n<ul>\n  <li><strong>The <code>MATCH_NUMBER</code> function</strong></li>\n</ul>\n<p>It returns the sequential number of the match within the partition.</p>\n<ul>\n  <li><strong>The <code>RUNNING</code> and <code>FINAL</code> keywords</strong></li>\n</ul>\n<p>The expressions in the <code>DEFINE</code> clause are evaluated when the pattern matching\nis in progress. At each step, the engine only knows a part of the match. This\nis the <em>running semantics</em>.</p>\n<p>The expressions of the <code>MEASURES</code> clause are evaluated when the match is\ncomplete. The engine can see the whole match from the position of the final\nrow. This is the <em>final semantics</em>.</p>\n<p>However, with the <code>ALL ROWS PER MATCH</code> option, when the match result is\nprocessed row by row, you can choose either approach to compute the measures.\nTo do that, you can specify the <code>RUNNING</code> or <code>FINAL</code> keyword before the logical\nnavigation operation, for example <code>RUNNING LAST(DOWN.price)</code> or\n<code>FINAL LAST(DOWN.price)</code>.</p>\n<p>The <em>running semantics</em> is the default both in the <code>DEFINE</code> and <code>MESAURES</code>\nclauses. Note that <code>FINAL</code> only applies to the <code>MEASURES</code> clause.</p>\n<p>To sum up, here’s one complex measure expression combining different elements\nof the special syntax:</p>\n<p><img src=\"https://trino.io/assets/blog/match-recognize/measure-example.svg\" alt=\"\"></p>\n<h2 id=\"trino-cli-show-off-time\">\n    Trino CLI show-off time! <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#trino-cli-show-off-time\">#</a>\n</h2>\n<p>Now, let’s see the whole machinery come to life. This is the same example data\nthat we used before, and the same goal: detect a “V”-shape of the <code>price</code>\nvalues over time for different customers.</p>\n<div><pre><code>trino&gt; WITH orders(customer_id, order_date, price) AS (VALUES\n    ('cust_1', DATE '2020-05-11', 100),\n    ('cust_1', DATE '2020-05-12', 200),\n    ('cust_2', DATE '2020-05-13',   8),\n    ('cust_1', DATE '2020-05-14', 100),\n    ('cust_2', DATE '2020-05-15',   4),\n    ('cust_1', DATE '2020-05-16',  50),\n    ('cust_1', DATE '2020-05-17', 100),\n    ('cust_2', DATE '2020-05-18',   6))\nSELECT customer_id, start_price, bottom_price, final_price, start_date, final_date\n    FROM orders\n        MATCH_RECOGNIZE (\n            PARTITION BY customer_id\n            ORDER BY order_date\n            MEASURES\n                START.price AS start_price,\n                LAST(DOWN.price) AS bottom_price,\n                LAST(UP.price) AS final_price,\n                START.order_date AS start_date,\n                LAST(UP.order_date) AS final_date\n            ONE ROW PER MATCH\n            AFTER MATCH SKIP PAST LAST ROW\n            PATTERN (START DOWN+ UP+)\n            DEFINE\n                DOWN AS price &lt; PREV(price),\n                UP AS price &gt; PREV(price)\n            );\n customer_id | start_price | bottom_price | final_price | start_date | final_date\n-------------+-------------+--------------+-------------+------------+------------\n cust_1      |         200 |           50 |         100 | 2020-05-12 | 2020-05-17\n cust_2      |           8 |            4 |           6 | 2020-05-13 | 2020-05-18\n(2 rows)\n</code></pre></div>\n<p>Two matches are detected, one for <code>cust_1</code>, and one for <code>cust_2</code>.</p>\n<h2 id=\"empty-matches-explained\">\n    Empty matches explained <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#empty-matches-explained\">#</a>\n</h2>\n<p>An empty match is a legit result of row pattern recognition. There are\ndifferent pattern constructs that can result in an empty match. The empty\npattern syntax <code>()</code> is the trivial one. Empty match can also result e.g. from\nquantification: <code>A*</code>, or alternation: <code>A | ()</code>.</p>\n<p>An empty match does not consume any input rows, but like every match, it is\nassociated with a row, called the <em>starting row</em>. That is the row at which the\npattern matching started. Note that if the pattern allows an empty match, it\nguarantees that no rows remain unmatched. Also, an empty match, as well as\nnon-empty matches, gets a sequential number, which can be retrieved by the\n<code>MATCH_NUMBER</code> function.</p>\n<p>Depending on your use case, you can consider empty matches informative or just\nsee them as a leftover of the algorithm.</p>\n<p>There’s one more thing linked to empty matches. Some patterns have the\ndangerous potential of looping endlessly over a piece that doesn’t consume any\nrows. It doesn’t have to be as explicit as <code>()*</code>. There are complex patterns\nthat don’t show their looping potential at first glance. We handled them\ncarefully so that you never have to waste your time on looping queries.</p>\n<h2 id=\"in-a-few-words-whats-so-cool-about-row-pattern-matching\">\n    In a few words, what’s so cool about row pattern matching? <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching.html#in-a-few-words-whats-so-cool-about-row-pattern-matching\">#</a>\n</h2>\n<p>From the SQL viewpoint, you can think of row pattern matching as extended\nwindow functions. Window functions allow you to capture some dependencies in\nrows of data based on their relative position or value. Row pattern matching\nallows you to detect arbitrarily complicated dependencies, based not only on\nthe input values but also on the details of the actual match and on the match\nnumber.</p>\n<p>Before the introduction of <code>MATCH_RECOGNIZE</code>, you had to feed your data to\nexternal tools to reason about trends and patterns. Now, you can achieve it\ndirectly in your query, and even build your query upon the pattern recognition\nclause to further process the match results.</p>\n<p>Row pattern matching is typically used:</p>\n<ul>\n  <li>\n    <p>in trade applications for tracking trends or identifying customers with\nspecific behavioral patterns,</p>\n  </li>\n  <li>\n    <p>in shipping applications for tracking packages through all possible valid\npaths,</p>\n  </li>\n  <li>\n    <p>in financial applications for detecting unusual incidents, which might signal\nfraud.</p>\n  </li>\n</ul>\n<p>What’s your use case?</p>\n<p>I hope you enjoy Trino’s new feature. Refer to\n<a target=\"_blank\" href=\"https://trino.io/docs/current/sql/match-recognize.html\">Trino docs</a> for even\nmore details, examples and usage tips. <a target=\"_blank\" href=\"https://trino.io/slack\">Please <strong>do</strong> reach out to us with any\nquestions or issues</a>. We plan to support row pattern matching in\nthe <code>WINDOW</code> clause soon, so stay tuned!</p>\n  </div>\n</article>\n</div>"
---

The MATCH_RECOGNIZE syntax was introduced in the latest SQL specification
of 2016. It is a super powerful tool for analyzing trends in your data. We are
proud to announce that Trino supports this great feature since
version 356. With
MATCH_RECOGNIZE, you can define a pattern using the well-known regular
expression syntax, and match it to a set of rows. Upon finding a matching row
sequence, you can retrieve all kinds of detailed or summary information about
the match, and pass it on to be processed by the subsequent parts of your
query. This is a new level of what a pure SQL statement can do.
This blog post gives you a taste of row pattern matching capabilities, and a
quick overview of the MATCH_RECOGNIZE syntax.
A regular expression and a table: a fruitful relationship
The regex matching we all know is about searching for patterns in character
strings. But how does a regex match a sequence of rows? Certainly, a row of
data is a more complex structure than a character. And so, row pattern matching
is more expressive than regex matching in text. Unlike characters, which stay
constantly in their places in a string, rows aren’t assigned up-front to
pattern components. This is where the additional level of complexity comes
from: whether the row is an A, B or C, is conditional. It is revealed as
the pattern matching goes forward. It depends on the data in the row, but also
on the context of the current match and even on the match number. Also, a row
can match different labels at a time.
Consider this simple example:

PATTERN: A B+ C D?


First, let’s match it to the string "ABBCEE". There is exactly one way to
match it: the prefix "ABBC" is a match.
Now, let’s see what it takes to match a pattern to rows of a table.
Consider the table numbers with a single column number:

You need defining conditions to define how the rows of the table can be
mapped to pattern components A, B, C and D:

DEFINE:
    A <- true (matches every row)
    B <- number is greater than previous number
    C <- number is lower or equal to A
    D <- matches every row, but only in the first match;
         otherwise doesn't match any row


As you can see, the conditions can refer to other pattern components (C
 depends on A), or the sequential match number (D).
When searching for a match, the engine goes row by row, and assigns labels
according to the pattern. Every time the pattern shows the next component
(label) to be matched, the defining condition of that component is evaluated
for the current row in the context of the partial match.

After finding a match, you can step one row forward and search for another one.

So far, two matches were found in the same set of rows. Interestingly, a row
that was labeled as B in the first match, became A in the second match.
Let’s try to find another match.

Time to get more technical
…and use some real life money examples.
In the preceding examples, the pattern consisted of components A, B, C
and D. They were chosen this way to capture the analogy between pattern
matching in a string and pattern matching in a set of rows. According to the
SQL specification, row pattern components can be named with arbitrary
identifiers, as long as they are compliant with the SQL identifier semantics,
so you don’t need to limit yourself to single-letter names, and instead you can
use more verbose labels.
Officially, the pattern components, or labels, are called the primary pattern
variables. They are the basic components of the row pattern. Consider the
following example:

PATTERN( START DOWN+ UP+ )


There are three primary pattern variables: START, DOWN and UP. The + is
the “one or more” quantifier you know from the regex syntax. Intuitively, this
pattern should match a sequence of rows which are first “decreasing”, and then
“increasing”. You need to inform the engine how it should map rows to the
variables. In other words, you need to define what the “decreasing” and
“increasing” rows are:

DEFINE DOWN AS price < PREV(price),
       UP AS price > PREV(price)


Now it’s clear that “decreasing” and “increasing” is about the price values.
There is no defining condition for the START variable, which informs the
engine that the match can start anywhere.
The preceding example shows the two key clauses of row pattern recognition:
PATTERN and DEFINE. Let’s see what other keywords there are in the
MATCH_RECOHNIZE clause.
Syntax overview
The MATCH_RECOGNIZE syntax is long and rich enough to capture everything that
a pattern matching tool needs, and all the options which let you easily toggle
your matching strategies.
Technically, MATCH_RECOGNIZE is part of the FROM clause:

SELECT ...
    FROM some_table
        MATCH_RECOGNIZE (
          [ PARTITION BY column [, ...] ]
          [ ORDER BY column [, ...] ]
          [ MEASURES measure_definition [, ...] ]
          [ rows_per_match ]
          [ AFTER MATCH skip_to ]
          PATTERN ( row_pattern )
          [ SUBSET subset_definition [, ...] ]
          DEFINE variable_definition [, ...]
          )


MATCH_RECOGNIZE can be used in the query as one of the stages of processing
data. You can SELECT from its results or even stream them into another
MATCH_RECOGNIZE.
The PATTERN and DEFINE clauses are the heart of row pattern recognition.
They are also the only two required subclauses of MATCH_RECOGNIZE. They were
touched upon in the previous section.
The pattern syntax is close to regular expression syntax. It also supports some
extensions specific to row pattern recognition. They are explained in
Row pattern syntax.
The PARTITION BY and ORDER BY clauses are similar to those in the WINDOW
syntax. They help you structure the input data. You can use PARTITION BY to
break up your data into independent chunks. ORDER BY is useful to establish 
the order of rows before searching for the pattern. Typically, you want to
analyze series of events over time, so ordering by date is a good choice.

In the MEASURES clause, you can specify what information you need about every
match that is found. In the example, if you’re interested in the order date,
the lowest value of price and the sequential number of the match, this is the
way to retrieve them:

MEASURES order_date AS date,
         LAST(DOWN.price) AS bottom_price,
         MATCH_NUMBER() AS match_no


date, bottom_price and match_no are exposed by the pattern recognition
clause as output columns.
The expressions in the MEASURES and DEFINE clauses allow you to combine the
input data with the information about the matched pattern. They support many
extensions and special constructs to help you get the most of your data, both
when defining the pattern, and retrieving useful information after a successful
match. The special keyword LAST is one example. For the full list of the
magic spells, check Expressions for special tasks.
The MATCH_RECOGNIZE clause has two useful toggles. The first of them lets you
choose whether the output includes all rows of the match, or a single-row
summary. For all rows, specify ALL ROWS PER MATCH. For a single row, choose
the default ONE ROW PER MATCH. There are also sub-options available, enabling
different handling of empty matches and unmatched rows.

Another toggle is the AFTER MATCH SKIP clause. It allows you to specify where
the row pattern matching resumes after finding a match. The default option is
AFTER MATCH SKIP PAST LAST ROW, but you can also skip to the next row or to a
specific position in the match based on the matched pattern variables.

The SUBSET clause is where the union pattern variables are defined. They
are a concise way to refer to a group of primary pattern variables:

SUBSET U = (DOWN, UP)


The following expression returns the value of price from the last row
matched either to DOWN or UP primary variable:

LAST(U.price)


 Row pattern syntax
The basic element of row pattern is the primary pattern variable. Other syntax
components include:
Concatenation

A B C


Alternation

A | B | C


Permutation

PERMUTE(A, B, C)


Grouping

(A B C)


Partition start anchor

^


Partition end anchor

$


Empty pattern

()


Exclusion syntax

{- row_pattern -}


Exclusion syntax is useful in combination with the ALL ROWS PER MATCH option.
If you find some sections of the match uninteresting, you can wrap them in the
exclusion, and they are dropped from the output.

Quantifiers
Row pattern syntax supports all kinds of quantifiers: the basic ones *, +,
?, and others, which let you specify the exact number of repetitions, or the
accepted range: {n}, {n, m}, {n,}, {,n}. Make sure you don’t confuse
those:
{n} is for exactly n repetitions,
{n,} is equal to {n, ∞},
{,n} is equal to {0, n}.
Quantifiers are greedy by default. It means that they prefer higher number of
repetitions over lower number. If you want it the other way, you can change a
quantifier to reluctant by appending ? immediately after it. So, (pattern)?
prefers a single match of the pattern, while (pattern)?? would rather omit
the pattern altogether.
Match preference
MATCH_RECOGNIZE is supposed to produce at most one match starting from a
specific row. If there are more matches available, the winner is chosen based
on the order of preference. The greedy and reluctant quantifiers are one
example of preference. Other pattern components have their own rules:
pattern alternation prefers the left-hand components to the right-hand ones.
pattern permutation is equivalent to alternation of all permutations of its
components. If multiple matches are possible, the match is chosen based on the
lexicographical order established by the order of components in the PERMUTE
list. For PERMUTE(A, B, C), the preference of options goes as follows:
A B C, A C B, B A C, B C A, C A B, C B A.
 Expressions for special tasks
The MATCH_RECOGNIZE clause provides special expression syntax, available in
the MEASURES and DEFINE clauses. Its purpose is to combine the input data
with the information about the match. The syntax includes:
Pattern variable references
They allow referring to certain components of the match, for example
DOWN.price, UP.order_date.
Logical navigation operations: LAST, FIRST
They allow you to navigate over the rows of a match based on the pattern
variables assigned to them. For example, LAST(DOWN.price, 3) navigates to the
last row labeled as “DOWN”, goes three occurrences of the “DOWN” label
backwards, and gets the price value from that row. The default offset is 0:
LAST(DOWN.price) gets the price value from the last row labeled as “DOWN”.
If the logical navigation goes beyond the match bounds, the operation returns
null.
Physical navigation operations: PREV, NEXT
They let you navigate over the rows of the partition by a specified offset.
Physical navigations use logical navigations as the starting point. For
example, NEXT(DOWN.price, 5) first navigates to the last row labeled as
“DOWN”. Starting from there, it goes five rows forward and gets the price
value from that row. In the preceding example, the logical navigation LAST is
implicit, but you can specify the nested logical navigation explicitly, for
example NEXT(FIRST(DOWN.price, 4), 5). The default offset is 1, which means
that the physical navigations by default go one row backwards, or one row
forward.
The physical navigation can retrieve values beyond the match bounds. It gives
you great flexibility. For example, the defining conditions of pattern
variables can peek at the values ahead. Also, when computing row pattern
measures, you can refer to the wider context of the match.
The CLASSIFIER function
It returns the primary pattern variable associated with the row.
The MATCH_NUMBER function
It returns the sequential number of the match within the partition.
The RUNNING and FINAL keywords
The expressions in the DEFINE clause are evaluated when the pattern matching
is in progress. At each step, the engine only knows a part of the match. This
is the running semantics.
The expressions of the MEASURES clause are evaluated when the match is
complete. The engine can see the whole match from the position of the final
row. This is the final semantics.
However, with the ALL ROWS PER MATCH option, when the match result is
processed row by row, you can choose either approach to compute the measures.
To do that, you can specify the RUNNING or FINAL keyword before the logical
navigation operation, for example RUNNING LAST(DOWN.price) or
FINAL LAST(DOWN.price).
The running semantics is the default both in the DEFINE and MESAURES
clauses. Note that FINAL only applies to the MEASURES clause.
To sum up, here’s one complex measure expression combining different elements
of the special syntax:

Trino CLI show-off time!
Now, let’s see the whole machinery come to life. This is the same example data
that we used before, and the same goal: detect a “V”-shape of the price
values over time for different customers.

trino> WITH orders(customer_id, order_date, price) AS (VALUES
    ('cust_1', DATE '2020-05-11', 100),
    ('cust_1', DATE '2020-05-12', 200),
    ('cust_2', DATE '2020-05-13',   8),
    ('cust_1', DATE '2020-05-14', 100),
    ('cust_2', DATE '2020-05-15',   4),
    ('cust_1', DATE '2020-05-16',  50),
    ('cust_1', DATE '2020-05-17', 100),
    ('cust_2', DATE '2020-05-18',   6))
SELECT customer_id, start_price, bottom_price, final_price, start_date, final_date
    FROM orders
        MATCH_RECOGNIZE (
            PARTITION BY customer_id
            ORDER BY order_date
            MEASURES
                START.price AS start_price,
                LAST(DOWN.price) AS bottom_price,
                LAST(UP.price) AS final_price,
                START.order_date AS start_date,
                LAST(UP.order_date) AS final_date
            ONE ROW PER MATCH
            AFTER MATCH SKIP PAST LAST ROW
            PATTERN (START DOWN+ UP+)
            DEFINE
                DOWN AS price < PREV(price),
                UP AS price > PREV(price)
            );

 customer_id | start_price | bottom_price | final_price | start_date | final_date
-------------+-------------+--------------+-------------+------------+------------
 cust_1      |         200 |           50 |         100 | 2020-05-12 | 2020-05-17
 cust_2      |           8 |            4 |           6 | 2020-05-13 | 2020-05-18
(2 rows)


Two matches are detected, one for cust_1, and one for cust_2.
Empty matches explained
An empty match is a legit result of row pattern recognition. There are
different pattern constructs that can result in an empty match. The empty
pattern syntax () is the trivial one. Empty match can also result e.g. from
quantification: A*, or alternation: A | ().
An empty match does not consume any input rows, but like every match, it is
associated with a row, called the starting row. That is the row at which the
pattern matching started. Note that if the pattern allows an empty match, it
guarantees that no rows remain unmatched. Also, an empty match, as well as
non-empty matches, gets a sequential number, which can be retrieved by the
MATCH_NUMBER function.
Depending on your use case, you can consider empty matches informative or just
see them as a leftover of the algorithm.
There’s one more thing linked to empty matches. Some patterns have the
dangerous potential of looping endlessly over a piece that doesn’t consume any
rows. It doesn’t have to be as explicit as ()*. There are complex patterns
that don’t show their looping potential at first glance. We handled them
carefully so that you never have to waste your time on looping queries.
In a few words, what’s so cool about row pattern matching?
From the SQL viewpoint, you can think of row pattern matching as extended
window functions. Window functions allow you to capture some dependencies in
rows of data based on their relative position or value. Row pattern matching
allows you to detect arbitrarily complicated dependencies, based not only on
the input values but also on the details of the actual match and on the match
number.
Before the introduction of MATCH_RECOGNIZE, you had to feed your data to
external tools to reason about trends and patterns. Now, you can achieve it
directly in your query, and even build your query upon the pattern recognition
clause to further process the match results.
Row pattern matching is typically used:
in trade applications for tracking trends or identifying customers with
specific behavioral patterns,
in shipping applications for tracking packages through all possible valid
paths,
in financial applications for detecting unusual incidents, which might signal
fraud.
What’s your use case?
I hope you enjoy Trino’s new feature. Refer to
Trino docs for even
more details, examples and usage tips. Please do reach out to us with any
questions or issues. We plan to support row pattern matching in
the WINDOW clause soon, so stay tuned!
