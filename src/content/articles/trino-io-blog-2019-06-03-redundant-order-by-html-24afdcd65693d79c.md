---
title: "Removing redundant ORDER BY"
link: "https://trino.io/blog/2019/06/03/redundant-order-by.html"
guid: "https://trino.io/blog/2019/06/03/redundant-order-by.html"
pubDate: "2019-06-03T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Optimizers are all about doing work in the most cost-effective manner and avoiding unnecessary work.\nSome SQL constructs such as ORDER BY do not affect query results in many situations, and can negatively\naffect performance unless the optimizer is smart enough to remove them.\nUntil very recently, Presto would insert a sorting step for each ORDER BY clause in a query. This, combined\nwith users and tools inadvertently using ORDER BY in places that have no effect, could result in severe\nperformance degradation and waste of resources. We finally fixed this in\nPresto 312!\nQuoting from the SQL specification (ISO 9075 Part 2):\nA <query expression> can contain an optional <order by clause>. The ordering of the rows of the table\n specified by the <query expression> is guaranteed only for the <query expression> that immediately \n contains the <order by clause>.\nThis means, a query engine is free to ignore any ORDER BY clause that doesn’t fit that context. Let’s consider\nsome examples where the clause is irrelevant.\n\nINSERT INTO some_table \nSELECT * FROM another_table \nORDER BY field \n\n\nWhile this query has the semblance of creating a sorted table, that’s not so. Tables in SQL are inherently\nunordered. Once the data is written, there’s no guarantee it will come out sorted when read. This is \nparticularly true for a parallel, distributed query engine like Presto that reads and processes data using\nmany threads simultaneously. Note that some storage engines may store data sorted, but that is not controlled\nduring data insertion. Executing the ORDER BY just causes the query to perform poorly due to reduced \nparallelism in the merging step of a distributed sort, and consumes more CPU and memory to sort the data.\n\nSELECT *\nFROM some_table \n   JOIN (SELECT * FROM another_table ORDER BY field) u \n   ON some_table.key = u.key \n\n\nIn this case, whether the tables involved in the join are sorted doesn’t matter, since Presto is going to \nbuild a hash lookup table out of one of them to execute the join operation. As in the previous example\npreserving the ORDER BY just causes the query to perform poorly.\nWhen does ORDER BY matter? Since it is “guaranteed only for the <query expression> that immediately \ncontains the <order by clause>”, only operations that are part of the same <query expression> are \nsensitive to it.\nA query expression is a block with the following structure:\n\n<query expression> ::=\n  [ <with clause> ] \n  <query expression body>\n  [ <order by clause> ] \n  [ <result offset clause> ] \n  [ <fetch first clause> ]\n\n\nwhere <query expression body> devolves into one of the set operations (UNION, INTERSECT, EXCEPT), \na SELECT construct, VALUES or TABLE clause.\nThe only operations that occur after an ORDER BY are FETCH FIRST (a.k.a., LIMIT) and OFFSET. So, \nunless a subquery contains one of these two clauses, the query engine is free to remove the ORDER BY \nclause without breaking the semantics dictated by the specification.\nHere’s an example where the clause is meaningful:\n\nSELECT *\nFROM some_table\nWHERE field = (\n    SELECT a \n    FROM another_table \n    ORDER BY b \n    LIMIT 1)\n\n\nOther databases tackle this in a variety of ways. MariaDB\nand Hive 3.0\nwill ignore redundant ORDER BY clauses. SQL Server, on the other hand, will produce an error:\nThe ORDER BY clause is invalid in views, inline functions, derived tables, subqueries, and common table\nexpressions, unless TOP or FOR XML is also specified.\nWhat’s the catch?\nIt is a common mistake for users to think the ORDER BY clause has a meaning in the language regardless of where it \nappears in a query. The fact that, for implementation reasons, in some cases ORDER BY is significant for Presto \ncomplicates matters. We often see users rely on this when formulating queries where aggregation or window functions \nare sensitive to the order of their inputs:\n\nSELECT array_agg(name) FROM (\n    SELECT *\n    FROM nation\n    ORDER BY name DESC\n)\n\n\n\nSELECT *, row_number() OVER ()\nFROM (\n    SELECT *\n    FROM nation\n    ORDER BY name DESC\n)\n\n\nThe Right Way™ of doing this in SQL is to use the aggregation or window-specific ORDER BY clause. For the\nexamples above:\n\nSELECT array_agg(name ORDER BY name DESC) \nFROM nation\n\n\n\nSELECT *, row_number() OVER (ORDER BY name DESC)\nFROM nation\n\n\nIn order to ease the transition, the new behavior can be turned off globally via the optimizer.skip-redundant-sort\nconfiguration option or on a per-session basis via the skip_redundant_sort session property. \nThese options will be removed in a future version.\nAdditionally, any time Presto detects a redundant ORDER BY clause, it will warn users about it:"
author: "Martin Traverso"
contentHtml: "<div>\n<article>\n  <div><p>Optimizers are all about doing work in the most cost-effective manner and avoiding unnecessary work.\nSome SQL constructs such as <code>ORDER BY</code> do not affect query results in many situations, and can negatively\naffect performance unless the optimizer is <em>smart enough</em> to remove them.</p>\n<p>Until very recently, Presto would insert a sorting step for each <code>ORDER BY</code> clause in a query. This, combined\nwith users and tools inadvertently using <code>ORDER BY</code> in places that have no effect, could result in severe\nperformance degradation and waste of resources. We finally fixed this in\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-312.html\">Presto 312</a>!</p>\n<p>Quoting from the SQL specification (ISO 9075 Part 2):</p>\n<blockquote>\n  <p>A <code>&lt;query expression&gt;</code> can contain an optional <code>&lt;order by clause&gt;</code>. The ordering of the rows of the table\n specified by the <code>&lt;query expression&gt;</code> is guaranteed only for the <code>&lt;query expression&gt;</code> that immediately \n contains the <code>&lt;order by clause&gt;</code>.</p>\n</blockquote>\n<p>This means, a query engine is free to ignore any <code>ORDER BY</code> clause that doesn’t fit that context. Let’s consider\nsome examples where the clause is irrelevant.</p>\n<div><pre><code><span>INSERT</span> <span>INTO</span> <span>some_table</span> \n<span>SELECT</span> <span>*</span> <span>FROM</span> <span>another_table</span> \n<span>ORDER</span> <span>BY</span> <span>field</span> \n</code></pre></div>\n<p>While this query has the semblance of creating a sorted table, that’s not so. Tables in SQL are inherently\nunordered. Once the data is written, there’s no guarantee it will come out sorted when read. This is \nparticularly true for a parallel, distributed query engine like Presto that reads and processes data using\nmany threads simultaneously. Note that some storage engines may store data sorted, but that is not controlled\nduring data insertion. Executing the <code>ORDER BY</code> just causes the query to perform poorly due to reduced \nparallelism in the merging step of a distributed sort, and consumes more CPU and memory to sort the data.</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>some_table</span> \n   <span>JOIN</span> <span>(</span><span>SELECT</span> <span>*</span> <span>FROM</span> <span>another_table</span> <span>ORDER</span> <span>BY</span> <span>field</span><span>)</span> <span>u</span> \n   <span>ON</span> <span>some_table</span><span>.</span><span>key</span> <span>=</span> <span>u</span><span>.</span><span>key</span> \n</code></pre></div>\n<p>In this case, whether the tables involved in the join are sorted doesn’t matter, since Presto is going to \nbuild a hash lookup table out of one of them to execute the join operation. As in the previous example\npreserving the <code>ORDER BY</code> just causes the query to perform poorly.</p>\n<p>When <em>does</em> <code>ORDER BY</code> matter? Since it is “guaranteed only for the <code>&lt;query expression&gt;</code> that immediately \ncontains the <code>&lt;order by clause&gt;</code>”, only operations that are part of the same <code>&lt;query expression&gt;</code> are \nsensitive to it.</p>\n<p>A query expression is a block with the following structure:</p>\n<div><pre><code>&lt;query expression&gt; ::=\n  [ &lt;with clause&gt; ] \n  &lt;query expression body&gt;\n  [ &lt;order by clause&gt; ] \n  [ &lt;result offset clause&gt; ] \n  [ &lt;fetch first clause&gt; ]\n</code></pre></div>\n<p>where <code>&lt;query expression body&gt;</code> devolves into one of the set operations (<code>UNION</code>, <code>INTERSECT</code>, <code>EXCEPT</code>), \na <code>SELECT</code> construct, <code>VALUES</code> or <code>TABLE</code> clause.</p>\n<p>The only operations that occur after an <code>ORDER BY</code> are <code>FETCH FIRST</code> (a.k.a., <code>LIMIT</code>) and <code>OFFSET</code>. So, \nunless a subquery contains one of these two clauses, the query engine is free to remove the <code>ORDER BY</code> \nclause without breaking the semantics dictated by the specification.</p>\n<p>Here’s an example where the clause is meaningful:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>some_table</span>\n<span>WHERE</span> <span>field</span> <span>=</span> <span>(</span>\n    <span>SELECT</span> <span>a</span> \n    <span>FROM</span> <span>another_table</span> \n    <span>ORDER</span> <span>BY</span> <span>b</span> \n    <span>LIMIT</span> <span>1</span><span>)</span>\n</code></pre></div>\n<p>Other databases tackle this in a variety of ways. <a target=\"_blank\" href=\"https://mariadb.com/kb/en/library/why-is-order-by-in-a-from-subquery-ignored/\">MariaDB</a>\nand <a target=\"_blank\" href=\"https://cwiki.apache.org/confluence/display/Hive/Configuration+Properties#ConfigurationProperties-hive.remove.orderby.in.subquery\">Hive 3.0</a>\nwill ignore redundant <code>ORDER BY</code> clauses. SQL Server, on the other hand, will produce an error:</p>\n<blockquote>\n  <p>The ORDER BY clause is invalid in views, inline functions, derived tables, subqueries, and common table\nexpressions, unless TOP or FOR XML is also specified.</p>\n</blockquote>\n<h2 id=\"whats-the-catch\">\n    What’s the catch? <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/03/redundant-order-by.html#whats-the-catch\">#</a>\n</h2>\n<p>It is a common mistake for users to think the <code>ORDER BY</code> clause has a meaning in the language regardless of where it \nappears in a query. The fact that, for implementation reasons, in some cases <code>ORDER BY</code> is significant for Presto \ncomplicates matters. We often see users rely on this when formulating queries where aggregation or window functions \nare sensitive to the order of their inputs:</p>\n<div><pre><code><span>SELECT</span> <span>array_agg</span><span>(</span><span>name</span><span>)</span> <span>FROM</span> <span>(</span>\n    <span>SELECT</span> <span>*</span>\n    <span>FROM</span> <span>nation</span>\n    <span>ORDER</span> <span>BY</span> <span>name</span> <span>DESC</span>\n<span>)</span>\n</code></pre></div>\n<div><pre><code><span>SELECT</span> <span>*</span><span>,</span> <span>row_number</span><span>()</span> <span>OVER</span> <span>()</span>\n<span>FROM</span> <span>(</span>\n    <span>SELECT</span> <span>*</span>\n    <span>FROM</span> <span>nation</span>\n    <span>ORDER</span> <span>BY</span> <span>name</span> <span>DESC</span>\n<span>)</span>\n</code></pre></div>\n<p>The Right Way™ of doing this in SQL is to use the aggregation or window-specific <code>ORDER BY</code> clause. For the\nexamples above:</p>\n<div><pre><code><span>SELECT</span> <span>array_agg</span><span>(</span><span>name</span> <span>ORDER</span> <span>BY</span> <span>name</span> <span>DESC</span><span>)</span> \n<span>FROM</span> <span>nation</span>\n</code></pre></div>\n<div><pre><code><span>SELECT</span> <span>*</span><span>,</span> <span>row_number</span><span>()</span> <span>OVER</span> <span>(</span><span>ORDER</span> <span>BY</span> <span>name</span> <span>DESC</span><span>)</span>\n<span>FROM</span> <span>nation</span>\n</code></pre></div>\n<p>In order to ease the transition, the new behavior can be turned off globally via the <code>optimizer.skip-redundant-sort</code>\nconfiguration option or on a per-session basis via the <code>skip_redundant_sort</code> session property. \nThese options will be removed in a future version.</p>\n<p>Additionally, any time Presto detects a redundant <code>ORDER BY</code> clause, it will warn users about it:</p>\n<p><img src=\"https://trino.io/assets/blog/redundant-order-by/redundant-order-by.png\" alt=\"\"></p>\n  </div>\n</article>\n</div>"
---

Optimizers are all about doing work in the most cost-effective manner and avoiding unnecessary work.
Some SQL constructs such as ORDER BY do not affect query results in many situations, and can negatively
affect performance unless the optimizer is smart enough to remove them.
Until very recently, Presto would insert a sorting step for each ORDER BY clause in a query. This, combined
with users and tools inadvertently using ORDER BY in places that have no effect, could result in severe
performance degradation and waste of resources. We finally fixed this in
Presto 312!
Quoting from the SQL specification (ISO 9075 Part 2):
A <query expression> can contain an optional <order by clause>. The ordering of the rows of the table
 specified by the <query expression> is guaranteed only for the <query expression> that immediately 
 contains the <order by clause>.
This means, a query engine is free to ignore any ORDER BY clause that doesn’t fit that context. Let’s consider
some examples where the clause is irrelevant.

INSERT INTO some_table 
SELECT * FROM another_table 
ORDER BY field 


While this query has the semblance of creating a sorted table, that’s not so. Tables in SQL are inherently
unordered. Once the data is written, there’s no guarantee it will come out sorted when read. This is 
particularly true for a parallel, distributed query engine like Presto that reads and processes data using
many threads simultaneously. Note that some storage engines may store data sorted, but that is not controlled
during data insertion. Executing the ORDER BY just causes the query to perform poorly due to reduced 
parallelism in the merging step of a distributed sort, and consumes more CPU and memory to sort the data.

SELECT *
FROM some_table 
   JOIN (SELECT * FROM another_table ORDER BY field) u 
   ON some_table.key = u.key 


In this case, whether the tables involved in the join are sorted doesn’t matter, since Presto is going to 
build a hash lookup table out of one of them to execute the join operation. As in the previous example
preserving the ORDER BY just causes the query to perform poorly.
When does ORDER BY matter? Since it is “guaranteed only for the <query expression> that immediately 
contains the <order by clause>”, only operations that are part of the same <query expression> are 
sensitive to it.
A query expression is a block with the following structure:

<query expression> ::=
  [ <with clause> ] 
  <query expression body>
  [ <order by clause> ] 
  [ <result offset clause> ] 
  [ <fetch first clause> ]


where <query expression body> devolves into one of the set operations (UNION, INTERSECT, EXCEPT), 
a SELECT construct, VALUES or TABLE clause.
The only operations that occur after an ORDER BY are FETCH FIRST (a.k.a., LIMIT) and OFFSET. So, 
unless a subquery contains one of these two clauses, the query engine is free to remove the ORDER BY 
clause without breaking the semantics dictated by the specification.
Here’s an example where the clause is meaningful:

SELECT *
FROM some_table
WHERE field = (
    SELECT a 
    FROM another_table 
    ORDER BY b 
    LIMIT 1)


Other databases tackle this in a variety of ways. MariaDB
and Hive 3.0
will ignore redundant ORDER BY clauses. SQL Server, on the other hand, will produce an error:
The ORDER BY clause is invalid in views, inline functions, derived tables, subqueries, and common table
expressions, unless TOP or FOR XML is also specified.
What’s the catch?
It is a common mistake for users to think the ORDER BY clause has a meaning in the language regardless of where it 
appears in a query. The fact that, for implementation reasons, in some cases ORDER BY is significant for Presto 
complicates matters. We often see users rely on this when formulating queries where aggregation or window functions 
are sensitive to the order of their inputs:

SELECT array_agg(name) FROM (
    SELECT *
    FROM nation
    ORDER BY name DESC
)



SELECT *, row_number() OVER ()
FROM (
    SELECT *
    FROM nation
    ORDER BY name DESC
)


The Right Way™ of doing this in SQL is to use the aggregation or window-specific ORDER BY clause. For the
examples above:

SELECT array_agg(name ORDER BY name DESC) 
FROM nation



SELECT *, row_number() OVER (ORDER BY name DESC)
FROM nation


In order to ease the transition, the new behavior can be turned off globally via the optimizer.skip-redundant-sort
configuration option or on a per-session basis via the skip_redundant_sort session property. 
These options will be removed in a future version.
Additionally, any time Presto detects a redundant ORDER BY clause, it will warn users about it:
