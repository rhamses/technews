---
title: "Trino's summer of grammar"
link: "https://trino.io/blog/2026/06/26/summer-of-grammar.html"
guid: "https://trino.io/blog/2026/06/26/summer-of-grammar.html"
pubDate: "2026-06-26T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "What a query engine runs, before anything else, is a language. And like any language, SQL\nis defined by its grammar: the predicates, operators, and forms you’re allowed\nto write down. Trino has always spoken SQL fluently, but the ISO 9075\nstandard is a big book, and there have\nalways been a few corners of it we hadn’t gotten around to implementing yet.\nTrino 482 closes a remarkable number of those gaps in a single release. So many,\nin fact, that we started calling it the summer of grammar. This post walks\nthrough the new language features, and because reading SQL is never quite as\nconvincing as running it, every example below is live. Hit Run and watch\nTrino 482 evaluate it for real.\n\n\n\ntry-sql { display: block; margin: 1.5rem auto; }\ntry-sql iframe { display: block; margin: 0 auto; }\n\n\nBETWEEN, both ways\nLet’s start with an old friend. Everyone knows\nx BETWEEN a AND b: it’s just\nshorthand for a <= x AND x <= b. The catch is that the order matters. If you\nget the bounds backwards, the predicate is silently always false, because nothing\nis simultaneously >= 10 and <= 1.\nThe SQL standard has a fix for this that Trino didn’t previously support: the\nSYMMETRIC keyword. x BETWEEN SYMMETRIC a AND b treats the two bounds as an\nunordered pair, so it’s true whenever x falls between the smaller and the\nlarger, regardless of which you wrote first. ASYMMETRIC (the default) spells\nout the classic order-sensitive behavior.\nSELECT 5 BETWEEN SYMMETRIC 10 AND 1 AS symmetric,\n       5 BETWEEN ASYMMETRIC 10 AND 1 AS asymmetric\nThis is genuinely useful when the bounds come from columns or parameters and you\ncan’t guarantee which one is larger.\nThree-valued logic, made explicit\nNo discussion of SQL is complete without an exploration of the semantics of\nnull. SQL uses three-valued\nlogic: a\nboolean expression can be true, false, or unknown (represented by null).\nThat third value is where a lot of subtle bugs live, because NOT (a > b) is\nnot the same as a <= b once null enters the picture.\nThe standard’s answer is the\nIS [NOT] TRUE, IS [NOT] FALSE, and IS [NOT]\nUNKNOWN predicates, and they now work\nin Trino. Unlike =, these always return true or false, and never null. That\nis exactly what you want when you need to collapse three-valued logic back down\nto two.\nSELECT (1 > 2) IS FALSE AS is_false,\n       (1 < 2) IS TRUE AS is_true,\n       CAST(NULL AS boolean) IS UNKNOWN AS is_unknown\nLooking inside subqueries\nTwo new predicates let you ask questions about the shape of a subquery’s\nresults, not just its values.\nThe UNIQUE predicate is true when no two rows returned by a subquery are equal.\nIt’s the declarative way to assert “this subquery has no duplicates” without\ncontorting yourself into a GROUP BY ... HAVING count(*) > 1 and checking\nwhether it’s empty.\nSELECT UNIQUE (SELECT x FROM (VALUES 1, 2, 3) t(x)) AS all_distinct,\n       UNIQUE (SELECT x FROM (VALUES 1, 2, 2) t(x)) AS has_duplicate\nThe MATCH predicate tests whether a row value appears in a subquery’s results.\nAdd the UNIQUE keyword and it’s true only when the row matches exactly one\nrow, a neat way to express “this value exists, and there’s only one of it.”\nSELECT 2 MATCH (SELECT x FROM (VALUES 1, 2, 3) t(x)) AS found,\n       2 MATCH UNIQUE (SELECT x FROM (VALUES 1, 2, 2) t(x)) AS found_once\nCASE gets some opinions\nA simple CASE expression\n(CASE x WHEN 1 THEN ... WHEN 2 THEN ... END) traditionally only compares the\noperand for equality against each WHEN value. If you wanted ranges or IS NULL\nchecks, you had to switch to a searched CASE and repeat the operand in every\nbranch.\nNo longer. The WHEN clauses of a simple CASE can now contain comparison\noperators, BETWEEN, and IS NULL, so you write the operand once and let each\nbranch apply its own predicate to it.\nSELECT x,\n       CASE x\n           WHEN < 0 THEN 'negative'\n           WHEN BETWEEN 0 AND 9 THEN 'small'\n           ELSE 'large'\n       END AS bucket\nFROM (VALUES -5, 3, 100) t(x)\nTime, locally\nTrino has long supported\nAT TIME ZONE to render a timestamp in\na specific zone. The standard also defines AT LOCAL, which converts a value to\nthe session’s own time zone without you having to name it explicitly. It’s the\ndifference between “show me this in America/Los_Angeles” and “show me this\nwherever I happen to be.”\nSELECT TIMESTAMP '2026-06-21 14:00:00 America/Los_Angeles' AT LOCAL AS in_my_zone\nThe result above is rendered in the session’s time zone. Change the session zone\nand the same expression follows you there.\nCalling functions with named arguments\nWhen a function takes more than two or three arguments, positional calls become a\nguessing game: which argument was the fourth one, again? Trino 482 adds the\nstandard name => value syntax for passing arguments by name, in any order.\nThis is especially handy for table\nfunctions, which often have several optional\nparameters, but it works for any function whose parameters are named, including\nthe user-defined functions you write yourself. Notice\nthat the call below supplies the arguments in the opposite order from the\ndeclaration, and gets the right answer anyway:\nWITH FUNCTION add_tax(price double, rate double)\n    RETURNS double\n    RETURN price * (1 + rate)\nSELECT add_tax(rate => 0.20, price => 100.0) AS total_with_tax\nNew functions, and a new way to call the old ones\nA handful of new functions landed as well.\nOVERLAY is the standard string function\nfor splicing one string into another, replacing a span you identify by position\nand length:\nSELECT OVERLAY('Hello World' PLACING 'Trino' FROM 7 FOR 5) AS spliced\nThere’s a new ends_with function, the\nobvious companion to the long-standing starts_with, and a\nROW::fields function that returns the field\nnames of a row value, which is handy when you’re working with anonymous or\nprogrammatically-built rows.\nSELECT ends_with('trino.io', '.io') AS yes,\n       ROW::fields(CAST(ROW(1, 'a') AS ROW(id integer, name varchar))) AS field_names\nPerhaps the most fun addition is ergonomic rather than functional: you can now\ninvoke string functions as methods on character values. 'Trino'.length() is\njust another way to write length('Trino'), and the type::function form lets\nyou reach a function through its type. It reads naturally when you’re chaining\ntransformations.\nSELECT 'Trino'.length() AS length,\n       varchar::chr(65) AS letter_a\nchar and varchar make peace\nThis is the one to read carefully, because it’s a deliberate breaking change.\nFor historical reasons, Trino used to implicitly coerce varchar to char,\nwhich dragged in char’s blank-padded comparison semantics and surprised just\nabout everyone. Trino 482 reverses the direction: a\nchar value now coerces to varchar with\nits trailing spaces removed, and comparisons between the two follow ordinary\nvarchar semantics, where trailing spaces are significant and nothing is\nsilently padded.\nIn practice this means char values behave the way your intuition expects when\nthey meet varchar:\nSELECT CAST('abc' AS char(5)) || '!' AS concatenated,\n       CAST('abc' AS char(5)) = 'abc' AS equal,\n       CAST('abc' AS char(5)) = 'abc   ' AS equal_with_spaces\nThe char(5) value 'abc' is stored padded to five characters, but on its way\ninto a varchar context the padding is dropped, so the concatenation produces\nabc!, and the comparison against 'abc' is true while the comparison against\n'abc   ' is false. If you depend on the old behavior, you can restore it by\nsetting the deprecated.legacy-varchar-to-char-coercion configuration property\nto true, but we’d encourage you to move off it.\nRelatedly, char values can now be cast directly to numeric, boolean,\nvarbinary, and temporal types, which previously required a detour through\nvarchar:\nSELECT CAST(CAST('2026-06-21' AS char(10)) AS date) AS as_date,\n       CAST(CAST('123' AS char(3)) AS integer) AS as_integer\nAnd a few more\nA couple of smaller grammar improvements round things out.\nSQL/JSON path expressions gained the like_regex predicate, so you can filter\ninside a JSON document with json_exists\nusing a regular expression rather than exact matches:\nSELECT json_exists('[\"foobar\", \"baz\"]', 'lax $[*] ? (@ like_regex \"^foo\")') AS has_match\nAnd row and array values that contain null elements can now be compared and\nordered (in ORDER BY, DISTINCT, min, max, and range comparisons) where\nthey previously would have failed. null elements sort consistently to the end:\nSELECT x\nFROM (VALUES (ARRAY[1, 1]), (ARRAY[1, 2]), (ARRAY[1, NULL])) t(x)\nORDER BY x\nWrapping up\nNone of these features is, on its own, the headline of a release. But taken\ntogether they make Trino’s dialect of SQL noticeably more complete and more\npleasant to write: fewer workarounds, fewer “why doesn’t the standard form work\nhere,” and a few genuinely new tools. That’s a good summer’s work on the grammar.\nFor the complete list, including the connector and engine improvements we didn’t\ncover here, see the Trino 482 release\nnotes.\nHappy querying!"
author: "Martin Traverso, Mateusz Gajewski"
contentHtml: "<p>What a query engine runs, before anything else, is a language. And like any language, SQL\nis defined by its grammar: the predicates, operators, and forms you’re allowed\nto write down. Trino has always spoken SQL fluently, but the <a href=\"https://www.iso.org/standard/76583.html\">ISO 9075\nstandard</a> is a big book, and there have\nalways been a few corners of it we hadn’t gotten around to implementing yet.</p>\n\n<p>Trino 482 closes a remarkable number of those gaps in a single release. So many,\nin fact, that we started calling it the summer of grammar. This post walks\nthrough the new language features, and because reading SQL is never quite as\nconvincing as running it, every example below is live. Hit <strong>Run</strong> and watch\nTrino 482 evaluate it for real.</p>\n\n<!--more-->\n\n\n\n\n\n<h2 id=\"between-both-ways\"><code class=\"language-plaintext highlighter-rouge\">BETWEEN</code>, both ways</h2>\n\n<p>Let’s start with an old friend. Everyone knows\n<a href=\"/docs/current/functions/comparison.html\"><code class=\"language-plaintext highlighter-rouge\">x BETWEEN a AND b</code></a>: it’s just\nshorthand for <code class=\"language-plaintext highlighter-rouge\">a &lt;= x AND x &lt;= b</code>. The catch is that the order matters. If you\nget the bounds backwards, the predicate is silently always false, because nothing\nis simultaneously <code class=\"language-plaintext highlighter-rouge\">&gt;= 10</code> and <code class=\"language-plaintext highlighter-rouge\">&lt;= 1</code>.</p>\n\n<p>The SQL standard has a fix for this that Trino didn’t previously support: the\n<code class=\"language-plaintext highlighter-rouge\">SYMMETRIC</code> keyword. <code class=\"language-plaintext highlighter-rouge\">x BETWEEN SYMMETRIC a AND b</code> treats the two bounds as an\nunordered pair, so it’s true whenever <code class=\"language-plaintext highlighter-rouge\">x</code> falls between the smaller and the\nlarger, regardless of which you wrote first. <code class=\"language-plaintext highlighter-rouge\">ASYMMETRIC</code> (the default) spells\nout the classic order-sensitive behavior.</p>\n\n<try-sql version=\"482\" height=\"200\">\n<pre data-query=\"\">SELECT 5 BETWEEN SYMMETRIC 10 AND 1 AS symmetric,\n       5 BETWEEN ASYMMETRIC 10 AND 1 AS asymmetric</pre>\n</try-sql>\n\n<p>This is genuinely useful when the bounds come from columns or parameters and you\ncan’t guarantee which one is larger.</p>\n\n<h2 id=\"three-valued-logic-made-explicit\">Three-valued logic, made explicit</h2>\n\n<p>No discussion of SQL is complete without an exploration of the semantics of\n<code class=\"language-plaintext highlighter-rouge\">null</code>. SQL uses <a href=\"https://en.wikipedia.org/wiki/Three-valued_logic#Application_in_SQL\">three-valued\nlogic</a>: a\nboolean expression can be <code class=\"language-plaintext highlighter-rouge\">true</code>, <code class=\"language-plaintext highlighter-rouge\">false</code>, or <em>unknown</em> (represented by <code class=\"language-plaintext highlighter-rouge\">null</code>).\nThat third value is where a lot of subtle bugs live, because <code class=\"language-plaintext highlighter-rouge\">NOT (a &gt; b)</code> is\n<em>not</em> the same as <code class=\"language-plaintext highlighter-rouge\">a &lt;= b</code> once <code class=\"language-plaintext highlighter-rouge\">null</code> enters the picture.</p>\n\n<p>The standard’s answer is the\n<a href=\"/docs/current/functions/comparison.html\"><code class=\"language-plaintext highlighter-rouge\">IS [NOT] TRUE</code>, <code class=\"language-plaintext highlighter-rouge\">IS [NOT] FALSE</code>, and <code class=\"language-plaintext highlighter-rouge\">IS [NOT]\nUNKNOWN</code></a> predicates, and they now work\nin Trino. Unlike <code class=\"language-plaintext highlighter-rouge\">=</code>, these always return <code class=\"language-plaintext highlighter-rouge\">true</code> or <code class=\"language-plaintext highlighter-rouge\">false</code>, and never <code class=\"language-plaintext highlighter-rouge\">null</code>. That\nis exactly what you want when you need to collapse three-valued logic back down\nto two.</p>\n\n<try-sql version=\"482\" height=\"220\">\n<pre data-query=\"\">SELECT (1 &gt; 2) IS FALSE AS is_false,\n       (1 &lt; 2) IS TRUE AS is_true,\n       CAST(NULL AS boolean) IS UNKNOWN AS is_unknown</pre>\n</try-sql>\n\n<h2 id=\"looking-inside-subqueries\">Looking inside subqueries</h2>\n\n<p>Two new predicates let you ask questions about the <em>shape</em> of a subquery’s\nresults, not just its values.</p>\n\n<p>The <code class=\"language-plaintext highlighter-rouge\">UNIQUE</code> predicate is <code class=\"language-plaintext highlighter-rouge\">true</code> when no two rows returned by a subquery are equal.\nIt’s the declarative way to assert “this subquery has no duplicates” without\ncontorting yourself into a <code class=\"language-plaintext highlighter-rouge\">GROUP BY ... HAVING count(*) &gt; 1</code> and checking\nwhether it’s empty.</p>\n\n<try-sql version=\"482\" height=\"200\">\n<pre data-query=\"\">SELECT UNIQUE (SELECT x FROM (VALUES 1, 2, 3) t(x)) AS all_distinct,\n       UNIQUE (SELECT x FROM (VALUES 1, 2, 2) t(x)) AS has_duplicate</pre>\n</try-sql>\n\n<p>The <code class=\"language-plaintext highlighter-rouge\">MATCH</code> predicate tests whether a row value appears in a subquery’s results.\nAdd the <code class=\"language-plaintext highlighter-rouge\">UNIQUE</code> keyword and it’s <code class=\"language-plaintext highlighter-rouge\">true</code> only when the row matches <em>exactly one</em>\nrow, a neat way to express “this value exists, and there’s only one of it.”</p>\n\n<try-sql version=\"482\" height=\"200\">\n<pre data-query=\"\">SELECT 2 MATCH (SELECT x FROM (VALUES 1, 2, 3) t(x)) AS found,\n       2 MATCH UNIQUE (SELECT x FROM (VALUES 1, 2, 2) t(x)) AS found_once</pre>\n</try-sql>\n\n<h2 id=\"case-gets-some-opinions\"><code class=\"language-plaintext highlighter-rouge\">CASE</code> gets some opinions</h2>\n\n<p>A simple <a href=\"/docs/current/functions/conditional.html\"><code class=\"language-plaintext highlighter-rouge\">CASE</code></a> expression\n(<code class=\"language-plaintext highlighter-rouge\">CASE x WHEN 1 THEN ... WHEN 2 THEN ... END</code>) traditionally only compares the\noperand for equality against each <code class=\"language-plaintext highlighter-rouge\">WHEN</code> value. If you wanted ranges or <code class=\"language-plaintext highlighter-rouge\">IS NULL</code>\nchecks, you had to switch to a searched <code class=\"language-plaintext highlighter-rouge\">CASE</code> and repeat the operand in every\nbranch.</p>\n\n<p>No longer. The <code class=\"language-plaintext highlighter-rouge\">WHEN</code> clauses of a simple <code class=\"language-plaintext highlighter-rouge\">CASE</code> can now contain comparison\noperators, <code class=\"language-plaintext highlighter-rouge\">BETWEEN</code>, and <code class=\"language-plaintext highlighter-rouge\">IS NULL</code>, so you write the operand once and let each\nbranch apply its own predicate to it.</p>\n\n<try-sql version=\"482\" height=\"240\">\n<pre data-query=\"\">SELECT x,\n       CASE x\n           WHEN &lt; 0 THEN 'negative'\n           WHEN BETWEEN 0 AND 9 THEN 'small'\n           ELSE 'large'\n       END AS bucket\nFROM (VALUES -5, 3, 100) t(x)</pre>\n</try-sql>\n\n<h2 id=\"time-locally\">Time, locally</h2>\n\n<p>Trino has long supported\n<a href=\"/docs/current/functions/datetime.html\"><code class=\"language-plaintext highlighter-rouge\">AT TIME ZONE</code></a> to render a timestamp in\na specific zone. The standard also defines <code class=\"language-plaintext highlighter-rouge\">AT LOCAL</code>, which converts a value to\nthe session’s own time zone without you having to name it explicitly. It’s the\ndifference between “show me this in <code class=\"language-plaintext highlighter-rouge\">America/Los_Angeles</code>” and “show me this\nwherever I happen to be.”</p>\n\n<try-sql version=\"482\" height=\"200\">\n<pre data-query=\"\">SELECT TIMESTAMP '2026-06-21 14:00:00 America/Los_Angeles' AT LOCAL AS in_my_zone</pre>\n</try-sql>\n\n<p>The result above is rendered in the session’s time zone. Change the session zone\nand the same expression follows you there.</p>\n\n<h2 id=\"calling-functions-with-named-arguments\">Calling functions with named arguments</h2>\n\n<p>When a function takes more than two or three arguments, positional calls become a\nguessing game: which argument was the fourth one, again? Trino 482 adds the\nstandard <code class=\"language-plaintext highlighter-rouge\">name =&gt; value</code> syntax for passing arguments by name, in any order.</p>\n\n<p>This is especially handy for <a href=\"/docs/current/functions/table.html\">table\nfunctions</a>, which often have several optional\nparameters, but it works for any function whose parameters are named, including\nthe <a href=\"/docs/current/udf.html\">user-defined functions</a> you write yourself. Notice\nthat the call below supplies the arguments in the <em>opposite</em> order from the\ndeclaration, and gets the right answer anyway:</p>\n\n<try-sql version=\"482\" height=\"220\">\n<pre data-query=\"\">WITH FUNCTION add_tax(price double, rate double)\n    RETURNS double\n    RETURN price * (1 + rate)\nSELECT add_tax(rate =&gt; 0.20, price =&gt; 100.0) AS total_with_tax</pre>\n</try-sql>\n\n<h2 id=\"new-functions-and-a-new-way-to-call-the-old-ones\">New functions, and a new way to call the old ones</h2>\n\n<p>A handful of new functions landed as well.\n<a href=\"/docs/current/functions/string.html\"><code class=\"language-plaintext highlighter-rouge\">OVERLAY</code></a> is the standard string function\nfor splicing one string into another, replacing a span you identify by position\nand length:</p>\n\n<try-sql version=\"482\" height=\"200\">\n<pre data-query=\"\">SELECT OVERLAY('Hello World' PLACING 'Trino' FROM 7 FOR 5) AS spliced</pre>\n</try-sql>\n\n<p>There’s a new <a href=\"/docs/current/functions/string.html\"><code class=\"language-plaintext highlighter-rouge\">ends_with</code></a> function, the\nobvious companion to the long-standing <code class=\"language-plaintext highlighter-rouge\">starts_with</code>, and a\n<a href=\"/docs/current/functions/row.html\"><code class=\"language-plaintext highlighter-rouge\">ROW::fields</code></a> function that returns the field\nnames of a <code class=\"language-plaintext highlighter-rouge\">row</code> value, which is handy when you’re working with anonymous or\nprogrammatically-built rows.</p>\n\n<try-sql version=\"482\" height=\"220\">\n<pre data-query=\"\">SELECT ends_with('trino.io', '.io') AS yes,\n       ROW::fields(CAST(ROW(1, 'a') AS ROW(id integer, name varchar))) AS field_names</pre>\n</try-sql>\n\n<p>Perhaps the most fun addition is ergonomic rather than functional: you can now\ninvoke string functions as <em>methods</em> on character values. <code class=\"language-plaintext highlighter-rouge\">'Trino'.length()</code> is\njust another way to write <code class=\"language-plaintext highlighter-rouge\">length('Trino')</code>, and the <code class=\"language-plaintext highlighter-rouge\">type::function</code> form lets\nyou reach a function through its type. It reads naturally when you’re chaining\ntransformations.</p>\n\n<try-sql version=\"482\" height=\"200\">\n<pre data-query=\"\">SELECT 'Trino'.length() AS length,\n       varchar::chr(65) AS letter_a</pre>\n</try-sql>\n\n<h2 id=\"char-and-varchar-make-peace\"><code class=\"language-plaintext highlighter-rouge\">char</code> and <code class=\"language-plaintext highlighter-rouge\">varchar</code> make peace</h2>\n\n<p>This is the one to read carefully, because it’s a deliberate <strong>breaking change</strong>.</p>\n\n<p>For historical reasons, Trino used to implicitly coerce <code class=\"language-plaintext highlighter-rouge\">varchar</code> to <code class=\"language-plaintext highlighter-rouge\">char</code>,\nwhich dragged in <code class=\"language-plaintext highlighter-rouge\">char</code>’s blank-padded comparison semantics and surprised just\nabout everyone. Trino 482 reverses the direction: a\n<a href=\"/docs/current/language/types.html\"><code class=\"language-plaintext highlighter-rouge\">char</code></a> value now coerces to <code class=\"language-plaintext highlighter-rouge\">varchar</code> with\nits trailing spaces removed, and comparisons between the two follow ordinary\n<code class=\"language-plaintext highlighter-rouge\">varchar</code> semantics, where trailing spaces are significant and nothing is\nsilently padded.</p>\n\n<p>In practice this means <code class=\"language-plaintext highlighter-rouge\">char</code> values behave the way your intuition expects when\nthey meet <code class=\"language-plaintext highlighter-rouge\">varchar</code>:</p>\n\n<try-sql version=\"482\" height=\"240\">\n<pre data-query=\"\">SELECT CAST('abc' AS char(5)) || '!' AS concatenated,\n       CAST('abc' AS char(5)) = 'abc' AS equal,\n       CAST('abc' AS char(5)) = 'abc   ' AS equal_with_spaces</pre>\n</try-sql>\n\n<p>The <code class=\"language-plaintext highlighter-rouge\">char(5)</code> value <code class=\"language-plaintext highlighter-rouge\">'abc'</code> is stored padded to five characters, but on its way\ninto a <code class=\"language-plaintext highlighter-rouge\">varchar</code> context the padding is dropped, so the concatenation produces\n<code class=\"language-plaintext highlighter-rouge\">abc!</code>, and the comparison against <code class=\"language-plaintext highlighter-rouge\">'abc'</code> is true while the comparison against\n<code class=\"language-plaintext highlighter-rouge\">'abc   '</code> is false. If you depend on the old behavior, you can restore it by\nsetting the <code class=\"language-plaintext highlighter-rouge\">deprecated.legacy-varchar-to-char-coercion</code> configuration property\nto <code class=\"language-plaintext highlighter-rouge\">true</code>, but we’d encourage you to move off it.</p>\n\n<p>Relatedly, <code class=\"language-plaintext highlighter-rouge\">char</code> values can now be cast directly to numeric, <code class=\"language-plaintext highlighter-rouge\">boolean</code>,\n<code class=\"language-plaintext highlighter-rouge\">varbinary</code>, and temporal types, which previously required a detour through\n<code class=\"language-plaintext highlighter-rouge\">varchar</code>:</p>\n\n<try-sql version=\"482\" height=\"200\">\n<pre data-query=\"\">SELECT CAST(CAST('2026-06-21' AS char(10)) AS date) AS as_date,\n       CAST(CAST('123' AS char(3)) AS integer) AS as_integer</pre>\n</try-sql>\n\n<h2 id=\"and-a-few-more\">And a few more</h2>\n\n<p>A couple of smaller grammar improvements round things out.</p>\n\n<p>SQL/JSON path expressions gained the <code class=\"language-plaintext highlighter-rouge\">like_regex</code> predicate, so you can filter\ninside a JSON document with <a href=\"/docs/current/functions/json.html\"><code class=\"language-plaintext highlighter-rouge\">json_exists</code></a>\nusing a regular expression rather than exact matches:</p>\n\n<try-sql version=\"482\" height=\"200\">\n<pre data-query=\"\">SELECT json_exists('[\"foobar\", \"baz\"]', 'lax $[*] ? (@ like_regex \"^foo\")') AS has_match</pre>\n</try-sql>\n\n<p>And <code class=\"language-plaintext highlighter-rouge\">row</code> and <code class=\"language-plaintext highlighter-rouge\">array</code> values that contain <code class=\"language-plaintext highlighter-rouge\">null</code> elements can now be compared and\nordered (in <code class=\"language-plaintext highlighter-rouge\">ORDER BY</code>, <code class=\"language-plaintext highlighter-rouge\">DISTINCT</code>, <code class=\"language-plaintext highlighter-rouge\">min</code>, <code class=\"language-plaintext highlighter-rouge\">max</code>, and range comparisons) where\nthey previously would have failed. <code class=\"language-plaintext highlighter-rouge\">null</code> elements sort consistently to the end:</p>\n\n<try-sql version=\"482\" height=\"220\">\n<pre data-query=\"\">SELECT x\nFROM (VALUES (ARRAY[1, 1]), (ARRAY[1, 2]), (ARRAY[1, NULL])) t(x)\nORDER BY x</pre>\n</try-sql>\n\n<h2 id=\"wrapping-up\">Wrapping up</h2>\n\n<p>None of these features is, on its own, the headline of a release. But taken\ntogether they make Trino’s dialect of SQL noticeably more complete and more\npleasant to write: fewer workarounds, fewer “why doesn’t the standard form work\nhere,” and a few genuinely new tools. That’s a good summer’s work on the grammar.</p>\n\n<p>For the complete list, including the connector and engine improvements we didn’t\ncover here, see the <a href=\"/docs/current/release/release-482.html\">Trino 482 release\nnotes</a>.</p>\n\n<p>Happy querying!</p>"
---

What a query engine runs, before anything else, is a language. And like any language, SQL
is defined by its grammar: the predicates, operators, and forms you’re allowed
to write down. Trino has always spoken SQL fluently, but the ISO 9075
standard is a big book, and there have
always been a few corners of it we hadn’t gotten around to implementing yet.
Trino 482 closes a remarkable number of those gaps in a single release. So many,
in fact, that we started calling it the summer of grammar. This post walks
through the new language features, and because reading SQL is never quite as
convincing as running it, every example below is live. Hit Run and watch
Trino 482 evaluate it for real.



try-sql { display: block; margin: 1.5rem auto; }
try-sql iframe { display: block; margin: 0 auto; }


BETWEEN, both ways
Let’s start with an old friend. Everyone knows
x BETWEEN a AND b: it’s just
shorthand for a <= x AND x <= b. The catch is that the order matters. If you
get the bounds backwards, the predicate is silently always false, because nothing
is simultaneously >= 10 and <= 1.
The SQL standard has a fix for this that Trino didn’t previously support: the
SYMMETRIC keyword. x BETWEEN SYMMETRIC a AND b treats the two bounds as an
unordered pair, so it’s true whenever x falls between the smaller and the
larger, regardless of which you wrote first. ASYMMETRIC (the default) spells
out the classic order-sensitive behavior.
SELECT 5 BETWEEN SYMMETRIC 10 AND 1 AS symmetric,
       5 BETWEEN ASYMMETRIC 10 AND 1 AS asymmetric
This is genuinely useful when the bounds come from columns or parameters and you
can’t guarantee which one is larger.
Three-valued logic, made explicit
No discussion of SQL is complete without an exploration of the semantics of
null. SQL uses three-valued
logic: a
boolean expression can be true, false, or unknown (represented by null).
That third value is where a lot of subtle bugs live, because NOT (a > b) is
not the same as a <= b once null enters the picture.
The standard’s answer is the
IS [NOT] TRUE, IS [NOT] FALSE, and IS [NOT]
UNKNOWN predicates, and they now work
in Trino. Unlike =, these always return true or false, and never null. That
is exactly what you want when you need to collapse three-valued logic back down
to two.
SELECT (1 > 2) IS FALSE AS is_false,
       (1 < 2) IS TRUE AS is_true,
       CAST(NULL AS boolean) IS UNKNOWN AS is_unknown
Looking inside subqueries
Two new predicates let you ask questions about the shape of a subquery’s
results, not just its values.
The UNIQUE predicate is true when no two rows returned by a subquery are equal.
It’s the declarative way to assert “this subquery has no duplicates” without
contorting yourself into a GROUP BY ... HAVING count(*) > 1 and checking
whether it’s empty.
SELECT UNIQUE (SELECT x FROM (VALUES 1, 2, 3) t(x)) AS all_distinct,
       UNIQUE (SELECT x FROM (VALUES 1, 2, 2) t(x)) AS has_duplicate
The MATCH predicate tests whether a row value appears in a subquery’s results.
Add the UNIQUE keyword and it’s true only when the row matches exactly one
row, a neat way to express “this value exists, and there’s only one of it.”
SELECT 2 MATCH (SELECT x FROM (VALUES 1, 2, 3) t(x)) AS found,
       2 MATCH UNIQUE (SELECT x FROM (VALUES 1, 2, 2) t(x)) AS found_once
CASE gets some opinions
A simple CASE expression
(CASE x WHEN 1 THEN ... WHEN 2 THEN ... END) traditionally only compares the
operand for equality against each WHEN value. If you wanted ranges or IS NULL
checks, you had to switch to a searched CASE and repeat the operand in every
branch.
No longer. The WHEN clauses of a simple CASE can now contain comparison
operators, BETWEEN, and IS NULL, so you write the operand once and let each
branch apply its own predicate to it.
SELECT x,
       CASE x
           WHEN < 0 THEN 'negative'
           WHEN BETWEEN 0 AND 9 THEN 'small'
           ELSE 'large'
       END AS bucket
FROM (VALUES -5, 3, 100) t(x)
Time, locally
Trino has long supported
AT TIME ZONE to render a timestamp in
a specific zone. The standard also defines AT LOCAL, which converts a value to
the session’s own time zone without you having to name it explicitly. It’s the
difference between “show me this in America/Los_Angeles” and “show me this
wherever I happen to be.”
SELECT TIMESTAMP '2026-06-21 14:00:00 America/Los_Angeles' AT LOCAL AS in_my_zone
The result above is rendered in the session’s time zone. Change the session zone
and the same expression follows you there.
Calling functions with named arguments
When a function takes more than two or three arguments, positional calls become a
guessing game: which argument was the fourth one, again? Trino 482 adds the
standard name => value syntax for passing arguments by name, in any order.
This is especially handy for table
functions, which often have several optional
parameters, but it works for any function whose parameters are named, including
the user-defined functions you write yourself. Notice
that the call below supplies the arguments in the opposite order from the
declaration, and gets the right answer anyway:
WITH FUNCTION add_tax(price double, rate double)
    RETURNS double
    RETURN price * (1 + rate)
SELECT add_tax(rate => 0.20, price => 100.0) AS total_with_tax
New functions, and a new way to call the old ones
A handful of new functions landed as well.
OVERLAY is the standard string function
for splicing one string into another, replacing a span you identify by position
and length:
SELECT OVERLAY('Hello World' PLACING 'Trino' FROM 7 FOR 5) AS spliced
There’s a new ends_with function, the
obvious companion to the long-standing starts_with, and a
ROW::fields function that returns the field
names of a row value, which is handy when you’re working with anonymous or
programmatically-built rows.
SELECT ends_with('trino.io', '.io') AS yes,
       ROW::fields(CAST(ROW(1, 'a') AS ROW(id integer, name varchar))) AS field_names
Perhaps the most fun addition is ergonomic rather than functional: you can now
invoke string functions as methods on character values. 'Trino'.length() is
just another way to write length('Trino'), and the type::function form lets
you reach a function through its type. It reads naturally when you’re chaining
transformations.
SELECT 'Trino'.length() AS length,
       varchar::chr(65) AS letter_a
char and varchar make peace
This is the one to read carefully, because it’s a deliberate breaking change.
For historical reasons, Trino used to implicitly coerce varchar to char,
which dragged in char’s blank-padded comparison semantics and surprised just
about everyone. Trino 482 reverses the direction: a
char value now coerces to varchar with
its trailing spaces removed, and comparisons between the two follow ordinary
varchar semantics, where trailing spaces are significant and nothing is
silently padded.
In practice this means char values behave the way your intuition expects when
they meet varchar:
SELECT CAST('abc' AS char(5)) || '!' AS concatenated,
       CAST('abc' AS char(5)) = 'abc' AS equal,
       CAST('abc' AS char(5)) = 'abc   ' AS equal_with_spaces
The char(5) value 'abc' is stored padded to five characters, but on its way
into a varchar context the padding is dropped, so the concatenation produces
abc!, and the comparison against 'abc' is true while the comparison against
'abc   ' is false. If you depend on the old behavior, you can restore it by
setting the deprecated.legacy-varchar-to-char-coercion configuration property
to true, but we’d encourage you to move off it.
Relatedly, char values can now be cast directly to numeric, boolean,
varbinary, and temporal types, which previously required a detour through
varchar:
SELECT CAST(CAST('2026-06-21' AS char(10)) AS date) AS as_date,
       CAST(CAST('123' AS char(3)) AS integer) AS as_integer
And a few more
A couple of smaller grammar improvements round things out.
SQL/JSON path expressions gained the like_regex predicate, so you can filter
inside a JSON document with json_exists
using a regular expression rather than exact matches:
SELECT json_exists('["foobar", "baz"]', 'lax $[*] ? (@ like_regex "^foo")') AS has_match
And row and array values that contain null elements can now be compared and
ordered (in ORDER BY, DISTINCT, min, max, and range comparisons) where
they previously would have failed. null elements sort consistently to the end:
SELECT x
FROM (VALUES (ARRAY[1, 1]), (ARRAY[1, 2]), (ARRAY[1, NULL])) t(x)
ORDER BY x
Wrapping up
None of these features is, on its own, the headline of a release. But taken
together they make Trino’s dialect of SQL noticeably more complete and more
pleasant to write: fewer workarounds, fewer “why doesn’t the standard form work
here,” and a few genuinely new tools. That’s a good summer’s work on the grammar.
For the complete list, including the connector and engine improvements we didn’t
cover here, see the Trino 482 release
notes.
Happy querying!
