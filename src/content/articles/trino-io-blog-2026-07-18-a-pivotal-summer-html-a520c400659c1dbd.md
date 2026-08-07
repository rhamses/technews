---
title: "A pivotal summer"
link: "https://trino.io/blog/2026/07/18/a-pivotal-summer.html"
guid: "https://trino.io/blog/2026/07/18/a-pivotal-summer.html"
pubDate: "2026-07-18T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Last month we called Trino 482 the summer of grammar release,\nbecause it closed so many small gaps in Trino’s dialect of SQL at once. Those\nadditions were mostly about breadth: a long list of standard predicates and\nforms, each a modest convenience on its own.\nTrino 483 keeps the season going, but the character is different. This release\nlands a handful of larger, more powerful additions instead of a dozen small gaps.\nThey change the shape of the queries you write rather than just tidying them\nup. One of them, PIVOT, is big enough to carry the release on its own. As\nbefore, every example is live. Hit Run and watch Trino 483 evaluate it.\n\n\n\ntry-sql { display: block; margin: 1.5rem auto; }\ntry-sql iframe { display: block; margin: 0 auto; }\n\n\nPIVOT, at last\nThe headline feature is the PIVOT clause. If\nyou’ve ever written a pile of CASE expressions wrapped in aggregates to\nturn a categorical column into a column per category, this is for you.\nEvery example in this section runs against the same little sales table: one row\nper region, channel, and month, with an amount. To see why PIVOT is one of the\nlongest-standing feature requests, start with what you had to write before: one\nsum(CASE ...) per month, spelled out by hand, with the column names left as\nyour own bookkeeping.\nSELECT region,\n       sum(CASE WHEN month = 1 THEN amount END) AS jan_total,\n       sum(CASE WHEN month = 2 THEN amount END) AS feb_total\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nGROUP BY region\nPIVOT says the same thing declaratively. You provide one or more aggregations,\na pivot column whose values become the new columns, and the list of values you\ncare about. Each additional month is just another entry in the IN list rather\nthan another hand-written CASE:\nSELECT *\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nPIVOT (\n    sum(amount) AS total\n    FOR month IN (1 AS jan, 2 AS feb)\n    GROUP BY region\n)\nThe output has columns region, jan_total, and feb_total. Each pivoted\ncolumn name is stitched together from the pivot value’s alias and the\naggregation’s alias, and the GROUP BY names the dimensions that survive as\nordinary columns.\nMore than one number per cell\nA PIVOT can compute several aggregations at once. When it does, each one needs\nan alias, so the pivot can build unambiguous column names by pairing every value\nwith every aggregation. In the following example each month gets both a total\namount and an order count:\nSELECT *\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nPIVOT (\n    sum(amount) AS total,\n    count(*) AS orders\n    FOR month IN (1 AS jan, 2 AS feb)\n    GROUP BY region\n)\nThe result gains jan_total, jan_orders, feb_total, and feb_orders: the\ncolumns for each value stay grouped together, in the order the aggregations are\ndeclared. The aggregation slot is a full expression, not just a bare function\ncall, so sum(amount) - sum(refund) AS net or\nsum(amount) FILTER (WHERE amount > 0) AS gains are equally valid, and the pivot\nvalue scoping applies to every aggregate inside the slot.\nSubtotals with grouping sets\nWant a bottom-line total across all regions, and not just a row per region? You\ndon’t have to run a second query and staple it on. The GROUP BY inside a\nPIVOT accepts the same forms as a top-level one, so GROUPING SETS, CUBE, and\nROLLUP come along for free. Wrapping region in a ROLLUP adds a grand-total\nrow, with region left NULL:\nSELECT *\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nPIVOT (\n    sum(amount) AS total\n    FOR month IN (1 AS jan, 2 AS feb)\n    GROUP BY ROLLUP (region)\n)\nPivoting on more than one dimension\nThe pivot column can be a tuple. Name a parenthesized list of columns in the\nFOR clause and supply matching tuples in the IN list, and each combination\nbecomes its own column. This is how you build a cell per (channel, month) pair:\nSELECT *\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nPIVOT (\n    sum(amount) AS total\n    FOR (channel, month) IN (\n        ('web', 1) AS web_jan,\n        ('web', 2) AS web_feb,\n        ('store', 1) AS store_jan\n    )\n    GROUP BY region\n)\nNotice west’s web_feb_total comes back NULL: no row matches that\ncombination, so the aggregate sees an empty input. That is the one sharp edge to\nremember. The IN list is a fixed set of constants you write out, so PIVOT\nonly produces columns for the values you name, and a value that never appears in\nthe data still produces a column full of empty-input results.\nBecause the result of a PIVOT is itself just a relation, it can be aliased,\nnested in a subquery, or fed straight into another PIVOT.\nNavigating JSON without the ceremony\nTrino has always had powerful tools for querying JSON, such as json_query,\njson_value, and json_exists, but they\nask you to write out a full JSON path expression and a RETURNING clause for\neven the simplest lookup. The SQL specification also defines a more convenient\nsimplified accessor syntax. Trino 483\nnow implements it and lets you reach into a json value with the same dotted\nand subscripted notation you’d use on a row or an array.\nThe receiver has to be a value of the json type. Below, a JSON literal\nsupplies the document. Watch out for one trap: CAST('...' AS json) does not\nparse the text into an object. It wraps the whole string as a single JSON string\nvalue, and the accessor then quietly hands you back NULL. Use a JSON literal,\nas shown here, to get an actual document. From there, each .member, [index],\nor .method() step extends the path for you:\nSELECT j.name.string() AS name,\n       j.items[0].price.decimal(10,2) AS first_item_price\nFROM (VALUES JSON '{\"name\": \"Ada\", \"items\": [{\"price\": 9.99}, {\"price\": 19.99}]}') t(j)\nThe trailing .string() on j.name is an item method that plays the role of\nthe old RETURNING varchar clause, and j.items[0].price.decimal(10,2) shows a\nsubscript and nested members composing in a single chain. There’s an item method\nfor every type json_value can return (.bigint(), .date(), .decimal(p, s),\n.timestamp(), and so on), so the whole extraction reads fluently.\nOne thing worth internalizing: member names are matched case-sensitively\nagainst the JSON keys, because the JSON path language is case-sensitive. So\nj.Foo and j.foo are different paths, unlike ordinary SQL identifiers. The\nitem-method names, on the other hand, are regular SQL identifiers and stay\ncase-insensitive.\nThere’s also a wildcard form. SELECT j.* expands to the top-level members of a\nJSON object, returned as a single column holding a JSON array:\nSELECT j.* AS (members)\nFROM (VALUES JSON '{\"a\": 1, \"b\": 2, \"c\": 3}') t(j)\nParsing dates inside JSON paths\nStaying with JSON for a moment: SQL/JSON path expressions gained a datetime()\nmethod, which parses a textual item into a proper date or time value from inside\nthe path itself. It takes an optional format template, so you can handle the\nnon-ISO date strings that turn up in real-world documents without post-processing\nin SQL:\nSELECT json_value('{\"order_date\": \"17-07-2026\"}',\n                  'lax $.order_date.datetime(\"DD-MM-YYYY\")'\n                  RETURNING date) AS order_date\nWithout a format template, datetime() reads the value as the most specific of\ndate, time, or timestamp with or without a time zone that its shape\nallows.\nDo these two periods overlap?\nAnyone who has written the predicate for “do two date ranges intersect” knows\nit’s easy to get subtly wrong. The boundary conditions are fiddly, and the\nnaive start1 <= end2 AND start2 <= end1 doesn’t say much about intent. The\nstandard OVERLAPS predicate now\nexpresses it directly. Each operand is a (start, end) pair, and the result is\ntrue when the two periods share any instant:\nSELECT (DATE '2026-06-01', DATE '2026-08-31')\n           OVERLAPS (DATE '2026-08-01', DATE '2026-09-30') AS summer_meets_fall,\n       (DATE '2026-01-01', DATE '2026-03-31')\n           OVERLAPS (DATE '2026-06-01', DATE '2026-08-31') AS q1_meets_summer\nThe second element of a pair can also be an interval instead of an end point,\nin which case the end is computed as start + interval, handy when you know a\nperiod by its length rather than its endpoints. OVERLAPS uses half-open\nsemantics, so two periods that merely touch at a boundary don’t count as\noverlapping. And since no corner of SQL escapes the question of null, a null\nendpoint isn’t an error: it simply leaves that side of the period open-ended.\nGeometry grows a third dimension\nThe language additions have plenty of company. Trino 483 substantially expands\nthe geospatial function library, and\ntwo themes stand out.\nThe first is real support for three-dimensional geometry. ST_Point now has\noverloads that take a Z coordinate (and an SRID), there’s an ST_Z accessor to\nread it back, and ST_Force2D / ST_Force3D let you add or drop the third\ndimension at will. Crucially, Z coordinates and SRID metadata are now preserved\nacross serialization, format conversions, and the geometry operations that\nshould carry them through:\nSELECT ST_Z(ST_Point(1, 2, DOUBLE '3')) AS z_coordinate\nThe second is reprojection. ST_Transform (and ST_TransformXY, which\nleaves Z untouched) converts a geometry between coordinate reference systems by\nEPSG SRID, so you can move between, say, WGS 84 longitude/latitude and Web\nMercator. Paired with the new ST_GeomFromEWKT, which parses well-known text\nwith an SRID= prefix, projecting a point takes one expression:\nSELECT ST_AsText(\n    ST_Transform(\n        ST_GeomFromEWKT('SRID=4326;POINT (-71.0882 42.3607)'),\n        3857)) AS web_mercator\nBeyond those, there’s a whole batch of new constructors and operations:\nST_MakeLine, ST_Collect, ST_Polygonize, ST_VoronoiPolygons,\nST_MinimumBoundingCircle, ST_OrientedEnvelope, and the\ngeometry_collect_agg aggregate, among others. Here’s a line assembled from a\nhandful of points:\nSELECT ST_AsText(\n    ST_MakeLine(ARRAY[ST_Point(0, 0), ST_Point(1, 1), ST_Point(2, 0)])) AS line\nA small one to finish\nNot every addition needs to reshape your queries. There’s a new\ntitle_case function that capitalizes\nthe first letter of each word and lowercases the rest, the obvious companion to\nthe upper and lower you already know:\nSELECT title_case('the trino summer of grammar') AS titled\nWrapping up\nWhere 482 was about filling in the many small corners of standard SQL, 483 is\nabout a few genuinely new capabilities:\npivoting rows into columns,\nnavigating JSON as if it were native, and\nasking a straightforward question about overlapping time.\nDifferent flavor, same goal: a dialect of SQL that lets you say what you mean\nwith less ceremony.\nAnd that’s just the language side of the ledger. Trino 483 also ships char\ncolumn filter fixes, a redesigned Web UI now serving as the default, and a long\nlist of connector improvements across Delta Lake, Iceberg, Hive, and more.\nThirsty for the rest? The Trino 483 release\nnotes have the full accounting.\nHappy querying!"
author: "Martin Traverso"
contentHtml: "<p>Last month we called Trino 482 the <a href=\"/blog/2026/06/26/summer-of-grammar.html\">summer of grammar release</a>,\nbecause it closed so many small gaps in Trino’s dialect of SQL at once. Those\nadditions were mostly about breadth: a long list of standard predicates and\nforms, each a modest convenience on its own.</p>\n\n<p>Trino 483 keeps the season going, but the character is different. This release\nlands a handful of larger, more powerful additions instead of a dozen small gaps.\nThey change the <em>shape</em> of the queries you write rather than just tidying them\nup. One of them, <code class=\"language-plaintext highlighter-rouge\">PIVOT</code>, is big enough to carry the release on its own. As\nbefore, every example is live. Hit <strong>Run</strong> and watch Trino 483 evaluate it.</p>\n\n<!--more-->\n\n\n\n\n\n<h2 id=\"pivot-at-last\"><code class=\"language-plaintext highlighter-rouge\">PIVOT</code>, at last</h2>\n\n<p>The headline feature is the <a href=\"/docs/current/sql/pivot.html\"><code class=\"language-plaintext highlighter-rouge\">PIVOT</code></a> clause. If\nyou’ve ever written a pile of <code class=\"language-plaintext highlighter-rouge\">CASE</code> expressions wrapped in aggregates to\nturn a categorical column into a column <em>per category</em>, this is for you.</p>\n\n<p>Every example in this section runs against the same little <code class=\"language-plaintext highlighter-rouge\">sales</code> table: one row\nper region, channel, and month, with an amount. To see why <code class=\"language-plaintext highlighter-rouge\">PIVOT</code> is one of the\nlongest-standing feature requests, start with what you had to write before: one\n<code class=\"language-plaintext highlighter-rouge\">sum(CASE ...)</code> per month, spelled out by hand, with the column names left as\nyour own bookkeeping.</p>\n\n<try-sql version=\"483\" height=\"320\">\n<pre data-query=\"\">SELECT region,\n       sum(CASE WHEN month = 1 THEN amount END) AS jan_total,\n       sum(CASE WHEN month = 2 THEN amount END) AS feb_total\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nGROUP BY region</pre>\n</try-sql>\n\n<p><code class=\"language-plaintext highlighter-rouge\">PIVOT</code> says the same thing declaratively. You provide one or more aggregations,\na pivot column whose values become the new columns, and the list of values you\ncare about. Each additional month is just another entry in the <code class=\"language-plaintext highlighter-rouge\">IN</code> list rather\nthan another hand-written <code class=\"language-plaintext highlighter-rouge\">CASE</code>:</p>\n\n<try-sql version=\"483\" height=\"340\">\n<pre data-query=\"\">SELECT *\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nPIVOT (\n    sum(amount) AS total\n    FOR month IN (1 AS jan, 2 AS feb)\n    GROUP BY region\n)</pre>\n</try-sql>\n\n<p>The output has columns <code class=\"language-plaintext highlighter-rouge\">region</code>, <code class=\"language-plaintext highlighter-rouge\">jan_total</code>, and <code class=\"language-plaintext highlighter-rouge\">feb_total</code>. Each pivoted\ncolumn name is stitched together from the pivot value’s alias and the\naggregation’s alias, and the <code class=\"language-plaintext highlighter-rouge\">GROUP BY</code> names the dimensions that survive as\nordinary columns.</p>\n\n<h3 id=\"more-than-one-number-per-cell\">More than one number per cell</h3>\n\n<p>A <code class=\"language-plaintext highlighter-rouge\">PIVOT</code> can compute several aggregations at once. When it does, each one needs\nan alias, so the pivot can build unambiguous column names by pairing every value\nwith every aggregation. In the following example each month gets both a total\namount and an order count:</p>\n\n<try-sql version=\"483\" height=\"360\">\n<pre data-query=\"\">SELECT *\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nPIVOT (\n    sum(amount) AS total,\n    count(*) AS orders\n    FOR month IN (1 AS jan, 2 AS feb)\n    GROUP BY region\n)</pre>\n</try-sql>\n\n<p>The result gains <code class=\"language-plaintext highlighter-rouge\">jan_total</code>, <code class=\"language-plaintext highlighter-rouge\">jan_orders</code>, <code class=\"language-plaintext highlighter-rouge\">feb_total</code>, and <code class=\"language-plaintext highlighter-rouge\">feb_orders</code>: the\ncolumns for each value stay grouped together, in the order the aggregations are\ndeclared. The aggregation slot is a full expression, not just a bare function\ncall, so <code class=\"language-plaintext highlighter-rouge\">sum(amount) - sum(refund) AS net</code> or\n<code class=\"language-plaintext highlighter-rouge\">sum(amount) FILTER (WHERE amount &gt; 0) AS gains</code> are equally valid, and the pivot\nvalue scoping applies to every aggregate inside the slot.</p>\n\n<h3 id=\"subtotals-with-grouping-sets\">Subtotals with grouping sets</h3>\n\n<p>Want a bottom-line total across all regions, and not just a row per region? You\ndon’t have to run a second query and staple it on. The <code class=\"language-plaintext highlighter-rouge\">GROUP BY</code> inside a\n<code class=\"language-plaintext highlighter-rouge\">PIVOT</code> accepts the same forms as a top-level one, so <code class=\"language-plaintext highlighter-rouge\">GROUPING SETS</code>, <code class=\"language-plaintext highlighter-rouge\">CUBE</code>, and\n<code class=\"language-plaintext highlighter-rouge\">ROLLUP</code> come along for free. Wrapping <code class=\"language-plaintext highlighter-rouge\">region</code> in a <code class=\"language-plaintext highlighter-rouge\">ROLLUP</code> adds a grand-total\nrow, with <code class=\"language-plaintext highlighter-rouge\">region</code> left <code class=\"language-plaintext highlighter-rouge\">NULL</code>:</p>\n\n<try-sql version=\"483\" height=\"340\">\n<pre data-query=\"\">SELECT *\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nPIVOT (\n    sum(amount) AS total\n    FOR month IN (1 AS jan, 2 AS feb)\n    GROUP BY ROLLUP (region)\n)</pre>\n</try-sql>\n\n<h3 id=\"pivoting-on-more-than-one-dimension\">Pivoting on more than one dimension</h3>\n\n<p>The pivot column can be a <em>tuple</em>. Name a parenthesized list of columns in the\n<code class=\"language-plaintext highlighter-rouge\">FOR</code> clause and supply matching tuples in the <code class=\"language-plaintext highlighter-rouge\">IN</code> list, and each combination\nbecomes its own column. This is how you build a cell per (channel, month) pair:</p>\n\n<try-sql version=\"483\" height=\"360\">\n<pre data-query=\"\">SELECT *\nFROM (VALUES\n    ('east', 'web',   1, 100),\n    ('east', 'store', 1,  40),\n    ('east', 'web',   2, 150),\n    ('west', 'web',   1, 200),\n    ('west', 'store', 1,  60),\n    ('west', 'store', 2,  90)\n) AS sales(region, channel, month, amount)\nPIVOT (\n    sum(amount) AS total\n    FOR (channel, month) IN (\n        ('web', 1) AS web_jan,\n        ('web', 2) AS web_feb,\n        ('store', 1) AS store_jan\n    )\n    GROUP BY region\n)</pre>\n</try-sql>\n\n<p>Notice <code class=\"language-plaintext highlighter-rouge\">west</code>’s <code class=\"language-plaintext highlighter-rouge\">web_feb_total</code> comes back <code class=\"language-plaintext highlighter-rouge\">NULL</code>: no row matches that\ncombination, so the aggregate sees an empty input. That is the one sharp edge to\nremember. The <code class=\"language-plaintext highlighter-rouge\">IN</code> list is a fixed set of constants you write out, so <code class=\"language-plaintext highlighter-rouge\">PIVOT</code>\nonly produces columns for the values you name, and a value that never appears in\nthe data still produces a column full of empty-input results.</p>\n\n<p>Because the result of a <code class=\"language-plaintext highlighter-rouge\">PIVOT</code> is itself just a relation, it can be aliased,\nnested in a subquery, or fed straight into another <code class=\"language-plaintext highlighter-rouge\">PIVOT</code>.</p>\n\n<h2 id=\"navigating-json-without-the-ceremony\">Navigating JSON without the ceremony</h2>\n\n<p>Trino has always had powerful tools for querying JSON, such as <a href=\"/docs/current/functions/json.html\"><code class=\"language-plaintext highlighter-rouge\">json_query</code>,\n<code class=\"language-plaintext highlighter-rouge\">json_value</code>, and <code class=\"language-plaintext highlighter-rouge\">json_exists</code></a>, but they\nask you to write out a full JSON path expression and a <code class=\"language-plaintext highlighter-rouge\">RETURNING</code> clause for\neven the simplest lookup. The SQL specification also defines a more convenient\n<a href=\"/docs/current/functions/json.html\">simplified accessor</a> syntax. Trino 483\nnow implements it and lets you reach into a <code class=\"language-plaintext highlighter-rouge\">json</code> value with the same dotted\nand subscripted notation you’d use on a row or an array.</p>\n\n<p>The receiver has to be a value of the <code class=\"language-plaintext highlighter-rouge\">json</code> type. Below, a <code class=\"language-plaintext highlighter-rouge\">JSON</code> literal\nsupplies the document. Watch out for one trap: <code class=\"language-plaintext highlighter-rouge\">CAST('...' AS json)</code> does <em>not</em>\nparse the text into an object. It wraps the whole string as a single JSON string\nvalue, and the accessor then quietly hands you back <code class=\"language-plaintext highlighter-rouge\">NULL</code>. Use a <code class=\"language-plaintext highlighter-rouge\">JSON</code> literal,\nas shown here, to get an actual document. From there, each <code class=\"language-plaintext highlighter-rouge\">.member</code>, <code class=\"language-plaintext highlighter-rouge\">[index]</code>,\nor <code class=\"language-plaintext highlighter-rouge\">.method()</code> step extends the path for you:</p>\n\n<try-sql version=\"483\" height=\"240\">\n<pre data-query=\"\">SELECT j.name.string() AS name,\n       j.items[0].price.decimal(10,2) AS first_item_price\nFROM (VALUES JSON '{\"name\": \"Ada\", \"items\": [{\"price\": 9.99}, {\"price\": 19.99}]}') t(j)</pre>\n</try-sql>\n\n<p>The trailing <code class=\"language-plaintext highlighter-rouge\">.string()</code> on <code class=\"language-plaintext highlighter-rouge\">j.name</code> is an <em>item method</em> that plays the role of\nthe old <code class=\"language-plaintext highlighter-rouge\">RETURNING varchar</code> clause, and <code class=\"language-plaintext highlighter-rouge\">j.items[0].price.decimal(10,2)</code> shows a\nsubscript and nested members composing in a single chain. There’s an item method\nfor every type <code class=\"language-plaintext highlighter-rouge\">json_value</code> can return (<code class=\"language-plaintext highlighter-rouge\">.bigint()</code>, <code class=\"language-plaintext highlighter-rouge\">.date()</code>, <code class=\"language-plaintext highlighter-rouge\">.decimal(p, s)</code>,\n<code class=\"language-plaintext highlighter-rouge\">.timestamp()</code>, and so on), so the whole extraction reads fluently.</p>\n\n<p>One thing worth internalizing: member names are matched <strong>case-sensitively</strong>\nagainst the JSON keys, because the JSON path language is case-sensitive. So\n<code class=\"language-plaintext highlighter-rouge\">j.Foo</code> and <code class=\"language-plaintext highlighter-rouge\">j.foo</code> are different paths, unlike ordinary SQL identifiers. The\nitem-method names, on the other hand, are regular SQL identifiers and stay\ncase-insensitive.</p>\n\n<p>There’s also a wildcard form. <code class=\"language-plaintext highlighter-rouge\">SELECT j.*</code> expands to the top-level members of a\nJSON object, returned as a single column holding a JSON array:</p>\n\n<try-sql version=\"483\" height=\"200\">\n<pre data-query=\"\">SELECT j.* AS (members)\nFROM (VALUES JSON '{\"a\": 1, \"b\": 2, \"c\": 3}') t(j)</pre>\n</try-sql>\n\n<h2 id=\"parsing-dates-inside-json-paths\">Parsing dates inside JSON paths</h2>\n\n<p>Staying with JSON for a moment: SQL/JSON path expressions gained a <code class=\"language-plaintext highlighter-rouge\">datetime()</code>\nmethod, which parses a textual item into a proper date or time value from inside\nthe path itself. It takes an optional format template, so you can handle the\nnon-ISO date strings that turn up in real-world documents without post-processing\nin SQL:</p>\n\n<try-sql version=\"483\" height=\"200\">\n<pre data-query=\"\">SELECT json_value('{\"order_date\": \"17-07-2026\"}',\n                  'lax $.order_date.datetime(\"DD-MM-YYYY\")'\n                  RETURNING date) AS order_date</pre>\n</try-sql>\n\n<p>Without a format template, <code class=\"language-plaintext highlighter-rouge\">datetime()</code> reads the value as the most specific of\n<code class=\"language-plaintext highlighter-rouge\">date</code>, <code class=\"language-plaintext highlighter-rouge\">time</code>, or <code class=\"language-plaintext highlighter-rouge\">timestamp</code> with or without a time zone that its shape\nallows.</p>\n\n<h2 id=\"do-these-two-periods-overlap\">Do these two periods overlap?</h2>\n\n<p>Anyone who has written the predicate for “do two date ranges intersect” knows\nit’s easy to get subtly wrong. The boundary conditions are fiddly, and the\nnaive <code class=\"language-plaintext highlighter-rouge\">start1 &lt;= end2 AND start2 &lt;= end1</code> doesn’t say much about intent. The\nstandard <a href=\"/docs/current/functions/datetime.html\"><code class=\"language-plaintext highlighter-rouge\">OVERLAPS</code></a> predicate now\nexpresses it directly. Each operand is a <code class=\"language-plaintext highlighter-rouge\">(start, end)</code> pair, and the result is\n<code class=\"language-plaintext highlighter-rouge\">true</code> when the two periods share any instant:</p>\n\n<try-sql version=\"483\" height=\"220\">\n<pre data-query=\"\">SELECT (DATE '2026-06-01', DATE '2026-08-31')\n           OVERLAPS (DATE '2026-08-01', DATE '2026-09-30') AS summer_meets_fall,\n       (DATE '2026-01-01', DATE '2026-03-31')\n           OVERLAPS (DATE '2026-06-01', DATE '2026-08-31') AS q1_meets_summer</pre>\n</try-sql>\n\n<p>The second element of a pair can also be an <code class=\"language-plaintext highlighter-rouge\">interval</code> instead of an end point,\nin which case the end is computed as <code class=\"language-plaintext highlighter-rouge\">start + interval</code>, handy when you know a\nperiod by its length rather than its endpoints. <code class=\"language-plaintext highlighter-rouge\">OVERLAPS</code> uses half-open\nsemantics, so two periods that merely touch at a boundary don’t count as\noverlapping. And since no corner of SQL escapes the question of <code class=\"language-plaintext highlighter-rouge\">null</code>, a <code class=\"language-plaintext highlighter-rouge\">null</code>\nendpoint isn’t an error: it simply leaves that side of the period open-ended.</p>\n\n<h2 id=\"geometry-grows-a-third-dimension\">Geometry grows a third dimension</h2>\n\n<p>The language additions have plenty of company. Trino 483 substantially expands\nthe <a href=\"/docs/current/functions/geospatial.html\">geospatial</a> function library, and\ntwo themes stand out.</p>\n\n<p>The first is real support for <strong>three-dimensional geometry</strong>. <code class=\"language-plaintext highlighter-rouge\">ST_Point</code> now has\noverloads that take a Z coordinate (and an SRID), there’s an <code class=\"language-plaintext highlighter-rouge\">ST_Z</code> accessor to\nread it back, and <code class=\"language-plaintext highlighter-rouge\">ST_Force2D</code> / <code class=\"language-plaintext highlighter-rouge\">ST_Force3D</code> let you add or drop the third\ndimension at will. Crucially, Z coordinates and SRID metadata are now preserved\nacross serialization, format conversions, and the geometry operations that\nshould carry them through:</p>\n\n<try-sql version=\"483\" height=\"200\">\n<pre data-query=\"\">SELECT ST_Z(ST_Point(1, 2, DOUBLE '3')) AS z_coordinate</pre>\n</try-sql>\n\n<p>The second is <strong>reprojection</strong>. <code class=\"language-plaintext highlighter-rouge\">ST_Transform</code> (and <code class=\"language-plaintext highlighter-rouge\">ST_TransformXY</code>, which\nleaves Z untouched) converts a geometry between coordinate reference systems by\nEPSG SRID, so you can move between, say, WGS 84 longitude/latitude and Web\nMercator. Paired with the new <code class=\"language-plaintext highlighter-rouge\">ST_GeomFromEWKT</code>, which parses well-known text\nwith an <code class=\"language-plaintext highlighter-rouge\">SRID=</code> prefix, projecting a point takes one expression:</p>\n\n<try-sql version=\"483\" height=\"220\">\n<pre data-query=\"\">SELECT ST_AsText(\n    ST_Transform(\n        ST_GeomFromEWKT('SRID=4326;POINT (-71.0882 42.3607)'),\n        3857)) AS web_mercator</pre>\n</try-sql>\n\n<p>Beyond those, there’s a whole batch of new constructors and operations:\n<code class=\"language-plaintext highlighter-rouge\">ST_MakeLine</code>, <code class=\"language-plaintext highlighter-rouge\">ST_Collect</code>, <code class=\"language-plaintext highlighter-rouge\">ST_Polygonize</code>, <code class=\"language-plaintext highlighter-rouge\">ST_VoronoiPolygons</code>,\n<code class=\"language-plaintext highlighter-rouge\">ST_MinimumBoundingCircle</code>, <code class=\"language-plaintext highlighter-rouge\">ST_OrientedEnvelope</code>, and the\n<code class=\"language-plaintext highlighter-rouge\">geometry_collect_agg</code> aggregate, among others. Here’s a line assembled from a\nhandful of points:</p>\n\n<try-sql version=\"483\" height=\"220\">\n<pre data-query=\"\">SELECT ST_AsText(\n    ST_MakeLine(ARRAY[ST_Point(0, 0), ST_Point(1, 1), ST_Point(2, 0)])) AS line</pre>\n</try-sql>\n\n<h2 id=\"a-small-one-to-finish\">A small one to finish</h2>\n\n<p>Not every addition needs to reshape your queries. There’s a new\n<a href=\"/docs/current/functions/string.html\"><code class=\"language-plaintext highlighter-rouge\">title_case</code></a> function that capitalizes\nthe first letter of each word and lowercases the rest, the obvious companion to\nthe <code class=\"language-plaintext highlighter-rouge\">upper</code> and <code class=\"language-plaintext highlighter-rouge\">lower</code> you already know:</p>\n\n<try-sql version=\"483\" height=\"200\">\n<pre data-query=\"\">SELECT title_case('the trino summer of grammar') AS titled</pre>\n</try-sql>\n\n<h2 id=\"wrapping-up\">Wrapping up</h2>\n\n<p>Where 482 was about filling in the many small corners of standard SQL, 483 is\nabout a few genuinely new capabilities:</p>\n\n<ul>\n  <li>pivoting rows into columns,</li>\n  <li>navigating JSON as if it were native, and</li>\n  <li>asking a straightforward question about overlapping time.</li>\n</ul>\n\n<p>Different flavor, same goal: a dialect of SQL that lets you say what you mean\nwith less ceremony.</p>\n\n<p>And that’s just the language side of the ledger. Trino 483 also ships <code class=\"language-plaintext highlighter-rouge\">char</code>\ncolumn filter fixes, a redesigned Web UI now serving as the default, and a long\nlist of connector improvements across Delta Lake, Iceberg, Hive, and more.\nThirsty for the rest? The <a href=\"/docs/current/release/release-483.html\">Trino 483 release\nnotes</a> have the full accounting.</p>\n\n<p>Happy querying!</p>"
---

Last month we called Trino 482 the summer of grammar release,
because it closed so many small gaps in Trino’s dialect of SQL at once. Those
additions were mostly about breadth: a long list of standard predicates and
forms, each a modest convenience on its own.
Trino 483 keeps the season going, but the character is different. This release
lands a handful of larger, more powerful additions instead of a dozen small gaps.
They change the shape of the queries you write rather than just tidying them
up. One of them, PIVOT, is big enough to carry the release on its own. As
before, every example is live. Hit Run and watch Trino 483 evaluate it.



try-sql { display: block; margin: 1.5rem auto; }
try-sql iframe { display: block; margin: 0 auto; }


PIVOT, at last
The headline feature is the PIVOT clause. If
you’ve ever written a pile of CASE expressions wrapped in aggregates to
turn a categorical column into a column per category, this is for you.
Every example in this section runs against the same little sales table: one row
per region, channel, and month, with an amount. To see why PIVOT is one of the
longest-standing feature requests, start with what you had to write before: one
sum(CASE ...) per month, spelled out by hand, with the column names left as
your own bookkeeping.
SELECT region,
       sum(CASE WHEN month = 1 THEN amount END) AS jan_total,
       sum(CASE WHEN month = 2 THEN amount END) AS feb_total
FROM (VALUES
    ('east', 'web',   1, 100),
    ('east', 'store', 1,  40),
    ('east', 'web',   2, 150),
    ('west', 'web',   1, 200),
    ('west', 'store', 1,  60),
    ('west', 'store', 2,  90)
) AS sales(region, channel, month, amount)
GROUP BY region
PIVOT says the same thing declaratively. You provide one or more aggregations,
a pivot column whose values become the new columns, and the list of values you
care about. Each additional month is just another entry in the IN list rather
than another hand-written CASE:
SELECT *
FROM (VALUES
    ('east', 'web',   1, 100),
    ('east', 'store', 1,  40),
    ('east', 'web',   2, 150),
    ('west', 'web',   1, 200),
    ('west', 'store', 1,  60),
    ('west', 'store', 2,  90)
) AS sales(region, channel, month, amount)
PIVOT (
    sum(amount) AS total
    FOR month IN (1 AS jan, 2 AS feb)
    GROUP BY region
)
The output has columns region, jan_total, and feb_total. Each pivoted
column name is stitched together from the pivot value’s alias and the
aggregation’s alias, and the GROUP BY names the dimensions that survive as
ordinary columns.
More than one number per cell
A PIVOT can compute several aggregations at once. When it does, each one needs
an alias, so the pivot can build unambiguous column names by pairing every value
with every aggregation. In the following example each month gets both a total
amount and an order count:
SELECT *
FROM (VALUES
    ('east', 'web',   1, 100),
    ('east', 'store', 1,  40),
    ('east', 'web',   2, 150),
    ('west', 'web',   1, 200),
    ('west', 'store', 1,  60),
    ('west', 'store', 2,  90)
) AS sales(region, channel, month, amount)
PIVOT (
    sum(amount) AS total,
    count(*) AS orders
    FOR month IN (1 AS jan, 2 AS feb)
    GROUP BY region
)
The result gains jan_total, jan_orders, feb_total, and feb_orders: the
columns for each value stay grouped together, in the order the aggregations are
declared. The aggregation slot is a full expression, not just a bare function
call, so sum(amount) - sum(refund) AS net or
sum(amount) FILTER (WHERE amount > 0) AS gains are equally valid, and the pivot
value scoping applies to every aggregate inside the slot.
Subtotals with grouping sets
Want a bottom-line total across all regions, and not just a row per region? You
don’t have to run a second query and staple it on. The GROUP BY inside a
PIVOT accepts the same forms as a top-level one, so GROUPING SETS, CUBE, and
ROLLUP come along for free. Wrapping region in a ROLLUP adds a grand-total
row, with region left NULL:
SELECT *
FROM (VALUES
    ('east', 'web',   1, 100),
    ('east', 'store', 1,  40),
    ('east', 'web',   2, 150),
    ('west', 'web',   1, 200),
    ('west', 'store', 1,  60),
    ('west', 'store', 2,  90)
) AS sales(region, channel, month, amount)
PIVOT (
    sum(amount) AS total
    FOR month IN (1 AS jan, 2 AS feb)
    GROUP BY ROLLUP (region)
)
Pivoting on more than one dimension
The pivot column can be a tuple. Name a parenthesized list of columns in the
FOR clause and supply matching tuples in the IN list, and each combination
becomes its own column. This is how you build a cell per (channel, month) pair:
SELECT *
FROM (VALUES
    ('east', 'web',   1, 100),
    ('east', 'store', 1,  40),
    ('east', 'web',   2, 150),
    ('west', 'web',   1, 200),
    ('west', 'store', 1,  60),
    ('west', 'store', 2,  90)
) AS sales(region, channel, month, amount)
PIVOT (
    sum(amount) AS total
    FOR (channel, month) IN (
        ('web', 1) AS web_jan,
        ('web', 2) AS web_feb,
        ('store', 1) AS store_jan
    )
    GROUP BY region
)
Notice west’s web_feb_total comes back NULL: no row matches that
combination, so the aggregate sees an empty input. That is the one sharp edge to
remember. The IN list is a fixed set of constants you write out, so PIVOT
only produces columns for the values you name, and a value that never appears in
the data still produces a column full of empty-input results.
Because the result of a PIVOT is itself just a relation, it can be aliased,
nested in a subquery, or fed straight into another PIVOT.
Navigating JSON without the ceremony
Trino has always had powerful tools for querying JSON, such as json_query,
json_value, and json_exists, but they
ask you to write out a full JSON path expression and a RETURNING clause for
even the simplest lookup. The SQL specification also defines a more convenient
simplified accessor syntax. Trino 483
now implements it and lets you reach into a json value with the same dotted
and subscripted notation you’d use on a row or an array.
The receiver has to be a value of the json type. Below, a JSON literal
supplies the document. Watch out for one trap: CAST('...' AS json) does not
parse the text into an object. It wraps the whole string as a single JSON string
value, and the accessor then quietly hands you back NULL. Use a JSON literal,
as shown here, to get an actual document. From there, each .member, [index],
or .method() step extends the path for you:
SELECT j.name.string() AS name,
       j.items[0].price.decimal(10,2) AS first_item_price
FROM (VALUES JSON '{"name": "Ada", "items": [{"price": 9.99}, {"price": 19.99}]}') t(j)
The trailing .string() on j.name is an item method that plays the role of
the old RETURNING varchar clause, and j.items[0].price.decimal(10,2) shows a
subscript and nested members composing in a single chain. There’s an item method
for every type json_value can return (.bigint(), .date(), .decimal(p, s),
.timestamp(), and so on), so the whole extraction reads fluently.
One thing worth internalizing: member names are matched case-sensitively
against the JSON keys, because the JSON path language is case-sensitive. So
j.Foo and j.foo are different paths, unlike ordinary SQL identifiers. The
item-method names, on the other hand, are regular SQL identifiers and stay
case-insensitive.
There’s also a wildcard form. SELECT j.* expands to the top-level members of a
JSON object, returned as a single column holding a JSON array:
SELECT j.* AS (members)
FROM (VALUES JSON '{"a": 1, "b": 2, "c": 3}') t(j)
Parsing dates inside JSON paths
Staying with JSON for a moment: SQL/JSON path expressions gained a datetime()
method, which parses a textual item into a proper date or time value from inside
the path itself. It takes an optional format template, so you can handle the
non-ISO date strings that turn up in real-world documents without post-processing
in SQL:
SELECT json_value('{"order_date": "17-07-2026"}',
                  'lax $.order_date.datetime("DD-MM-YYYY")'
                  RETURNING date) AS order_date
Without a format template, datetime() reads the value as the most specific of
date, time, or timestamp with or without a time zone that its shape
allows.
Do these two periods overlap?
Anyone who has written the predicate for “do two date ranges intersect” knows
it’s easy to get subtly wrong. The boundary conditions are fiddly, and the
naive start1 <= end2 AND start2 <= end1 doesn’t say much about intent. The
standard OVERLAPS predicate now
expresses it directly. Each operand is a (start, end) pair, and the result is
true when the two periods share any instant:
SELECT (DATE '2026-06-01', DATE '2026-08-31')
           OVERLAPS (DATE '2026-08-01', DATE '2026-09-30') AS summer_meets_fall,
       (DATE '2026-01-01', DATE '2026-03-31')
           OVERLAPS (DATE '2026-06-01', DATE '2026-08-31') AS q1_meets_summer
The second element of a pair can also be an interval instead of an end point,
in which case the end is computed as start + interval, handy when you know a
period by its length rather than its endpoints. OVERLAPS uses half-open
semantics, so two periods that merely touch at a boundary don’t count as
overlapping. And since no corner of SQL escapes the question of null, a null
endpoint isn’t an error: it simply leaves that side of the period open-ended.
Geometry grows a third dimension
The language additions have plenty of company. Trino 483 substantially expands
the geospatial function library, and
two themes stand out.
The first is real support for three-dimensional geometry. ST_Point now has
overloads that take a Z coordinate (and an SRID), there’s an ST_Z accessor to
read it back, and ST_Force2D / ST_Force3D let you add or drop the third
dimension at will. Crucially, Z coordinates and SRID metadata are now preserved
across serialization, format conversions, and the geometry operations that
should carry them through:
SELECT ST_Z(ST_Point(1, 2, DOUBLE '3')) AS z_coordinate
The second is reprojection. ST_Transform (and ST_TransformXY, which
leaves Z untouched) converts a geometry between coordinate reference systems by
EPSG SRID, so you can move between, say, WGS 84 longitude/latitude and Web
Mercator. Paired with the new ST_GeomFromEWKT, which parses well-known text
with an SRID= prefix, projecting a point takes one expression:
SELECT ST_AsText(
    ST_Transform(
        ST_GeomFromEWKT('SRID=4326;POINT (-71.0882 42.3607)'),
        3857)) AS web_mercator
Beyond those, there’s a whole batch of new constructors and operations:
ST_MakeLine, ST_Collect, ST_Polygonize, ST_VoronoiPolygons,
ST_MinimumBoundingCircle, ST_OrientedEnvelope, and the
geometry_collect_agg aggregate, among others. Here’s a line assembled from a
handful of points:
SELECT ST_AsText(
    ST_MakeLine(ARRAY[ST_Point(0, 0), ST_Point(1, 1), ST_Point(2, 0)])) AS line
A small one to finish
Not every addition needs to reshape your queries. There’s a new
title_case function that capitalizes
the first letter of each word and lowercases the rest, the obvious companion to
the upper and lower you already know:
SELECT title_case('the trino summer of grammar') AS titled
Wrapping up
Where 482 was about filling in the many small corners of standard SQL, 483 is
about a few genuinely new capabilities:
pivoting rows into columns,
navigating JSON as if it were native, and
asking a straightforward question about overlapping time.
Different flavor, same goal: a dialect of SQL that lets you say what you mean
with less ceremony.
And that’s just the language side of the ledger. Trino 483 also ships char
column filter fixes, a redesigned Web UI now serving as the default, and a long
list of connector improvements across Delta Lake, Iceberg, Hive, and more.
Thirsty for the rest? The Trino 483 release
notes have the full accounting.
Happy querying!
