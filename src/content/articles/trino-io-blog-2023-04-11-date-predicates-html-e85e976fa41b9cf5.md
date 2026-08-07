---
title: "Just the right time date predicates with Iceberg"
link: "https://trino.io/blog/2023/04/11/date-predicates.html"
guid: "https://trino.io/blog/2023/04/11/date-predicates.html"
pubDate: "2023-04-11T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "In the data lake world, data partitioning is a technique that is critical to the\nperformance of read operations. In order to avoid scanning large amounts of data\naccidentally, and also to limit the number of partitions that are being\nprocessed by a query, a query engine must push down constant expressions when\nfiltering partitions.\nPartitions in an Iceberg table tend to be fairly large, containing up to tens or\neven hundreds of data files. It is therefore crucial to be able to skip\nirrelevant partitions while scanning a table in order to ensure high performance\nquery processing speed. When a table is created in a data lake, its partitioning\nscheme constitutes a de-facto index, speeding up queries against it by pruning\nout irrelevant partitions from the scan operation.\nDate and time are natural and universal partitioning candidates. Common\npartition patterns revolve around month, day, hour. One exciting feature  of the\nIceberg table format is its hidden\npartitioning.\nIceberg uses handy\ntransforms\nsuch as year, month, day, hour to deal with the complexities of mapping\na raw timestamp value to an actual partition value in a manner that is\ntransparent to the user.\nLet’s look at a typical example of an Iceberg table containing log events which\nare partitioned by day:\n\nCREATE TABLE logs (\n    event_time timestamp(6) with time zone,\n    level varchar,\n    message varchar)\nWITH (partitioning=ARRAY['day(event_time)'])\n\n\nWhen dealing with logs, it often happens that we want to know what happened\ntoday or within the last few days:\n\nSELECT *\nFROM logs\nWHERE\n  event_time >= CURRENT_DATE\n\n\n\nSELECT *\nFROM logs\nWHERE\n  event_time >= CURRENT_DATE - INTERVAL '7' DAY\n\n\nConstant folding\nTrino uses the constant folding optimization technique for dealing with these\ntypes of queries by internally rewriting the filter expression as a comparison\npredicate against a constant evaluated before executing the query in order to\navoid recalculating the same expression for each row scanned:\n\nPredicate pushdown\nAnother common query scenario for log data is to query for a specific date in\nthe past. A seasoned SQL user, being aware of the underlying data type of the\npartitioning column, would likely specify the date to be queried explicitly as\ntwo timestamp constant filter expressions:\n\nSELECT *\nFROM logs\nWHERE\n  event_time >= TIMESTAMP '2022-01-20 00:00:00.000000 UTC'\n  AND event_time < TIMESTAMP '2022-01-21 00:00:00.000000 UTC'\n\n\nA different flavor of the above-mentioned query would be to use\nthe BETWEEN\nrange operator:\n\nSELECT *\nFROM logs\nWHERE\n  event_time BETWEEN TIMESTAMP '2022-01-20 00:00:00.000000 UTC'\n  AND TIMESTAMP '2022-01-20 23:59:59.999999 UTC'\n\n\nUsers can focus on writing queries that are concise and readable by other human\nreaders, and leave the eventual grunt optimization work to the query engine.\nA succinct way of querying the logs for a specific day would be to cast the\ntimestamp field value to its corresponding date value and compare it with\nthe day containing the relevant logs:\n\nSELECT *\nFROM logs\nWHERE\n  CAST(event_time AS date) = DATE '2022-01-20'\n\n\nIn this case, Trino unwraps the initial temporal\nfilter to a filter that tests\nwhether the column event_time is within the constant timestamp range\ncorresponding to the date used in the initial filter, which is equivalent to the\nmost efficient of the explicit filters mentioned above.\nA different approach of querying the log data for a specific date is to use the\ndate_trunc\nfunction:\n\nSELECT *\nFROM logs\nWHERE\n  date_trunc('day', event_time) = DATE '2022-01-20'\n\n\nTrino again replaces the initial temporal\nfilter to a filter testing\nwhether the column event_time is within the constant timestamp range\ncorresponding to the date used in the initial filter.\nA slightly different use case is querying the log data to see whether an exotic\nerror type is recorded in the logs during previous months of the current year by\nmaking use of the\nyear() function:\n\nSELECT *\nFROM logs\nWHERE\n  year(event_time) = 2023\n\n\nThis time, Trino rewrites the temporal\nfilter\napplied on the column event_time with a BETWEEN filter for the unfolded date\nrange corresponding to the entire span of the specified year:\n\nevent_time BETWEEN TIMESTAMP '2023-01-01 00:00:00.000000 UTC'\nAND '2023-12-31 23:59:59.999999'\n\n\nWithout predicate pushdown, the filtering is done by Trino on each tuple, after\nscanning the entire content of the table:\n\nThe optimization techniques employed by Trino to speed up the above mentioned\ntypes of queries all involve replacing the provided filter with an equivalent\nfilter expression. Constant replacement optimizations compare the table column\nagainst a constant or a constant range with the purpose of literally pushing the\nfilter down to Iceberg.\nAs a consequence, the partition pruning happens on the metadata layer of the\ntable instead of filtering on top of the data itself, dramatically reducing the\namount of actual data files scanned:\n\nAs described in the Iceberg Table Spec, for\nany snapshot of the table, Iceberg tracks each individual data file and the\npartition to which it belongs. Iceberg uses a hierarchical index in its metadata\nlayer by storing lower_bounds and upper_bounds for:\neach partition in the manifest list files\neach data file in the manifest files\nDesugaring seemingly variable filter expressions to comparison predicates\ninvolving only columns and constants or constant ranges pays off. Not only does\nit prune out partitions, but it also skips portions of the data file (for\nexample a Apache Parquet row group) or even the data file altogether in certain\ncircumstances. For instance, pruning and skipping can occur  if the queried\nrange value does not overlap with the indexed Iceberg metadata range of values\ncontained in the file, in case of a non-partition column filter.\nTo put things in perspective, the optimization techniques presented in this\narticle, which have been already integrated in Trino, can cause the execution of\nqueries containing temporal filters with selective filters to complete in\nseconds compared (depending on the size of the table scanned) to hours.\nA reader keen to experiment and discover whether the previously mentioned\noptimization techniques are actually effective can use\nEXPLAIN to examine the output\nof the query planning stage. If the temporal predicate employed in the query is\nbeing pushed down, the scan operation should definitely have fewer rows than the\ncount of all rows contained in the table.\nThe queries in this post showcase just a tiny fraction of the myriad of\ntechniques which can be employed to perform queries on date and time columns.\nTrino continuously strives to streamline its users’ workflows by providing the\nresults of queries as fast as possible."
author: "Marius Grama"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/date-predicates/christian-pfeifer-l6OraG-v0d8-unsplash.jpg\">\n    </p>\n    <p>In the data lake world, data partitioning is a technique that is critical to the\nperformance of read operations. In order to avoid scanning large amounts of data\naccidentally, and also to limit the number of partitions that are being\nprocessed by a query, a query engine must push down constant expressions when\nfiltering partitions.</p>\n<!--more-->\n<p>Partitions in an Iceberg table tend to be fairly large, containing up to tens or\neven hundreds of data files. It is therefore crucial to be able to skip\nirrelevant partitions while scanning a table in order to ensure high performance\nquery processing speed. When a table is created in a data lake, its partitioning\nscheme constitutes a de-facto index, speeding up queries against it by pruning\nout irrelevant partitions from the scan operation.</p>\n<p>Date and time are natural and universal partitioning candidates. Common\npartition patterns revolve around month, day, hour. One exciting feature  of the\nIceberg table format is its <a target=\"_blank\" href=\"https://trino.io/blog/2021/07/12/in-place-table-evolution-and-cloud-compatibility-with-iceberg#partition-specification-evolution\">hidden\npartitioning</a>.\nIceberg uses handy\n<a target=\"_blank\" href=\"https://trino.io/docs/current/connector/iceberg.html#partitioned-tables\">transforms</a>\nsuch as <code>year</code>, <code>month</code>, <code>day</code>, <code>hour</code> to deal with the complexities of mapping\na raw timestamp value to an actual partition value in a manner that is\ntransparent to the user.</p>\n<p>Let’s look at a typical example of an Iceberg table containing log events which\nare partitioned by day:</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>logs</span> <span>(</span>\n    <span>event_time</span> <span>timestamp</span><span>(</span><span>6</span><span>)</span> <span>with</span> <span>time</span> <span>zone</span><span>,</span>\n    <span>level</span> <span>varchar</span><span>,</span>\n    <span>message</span> <span>varchar</span><span>)</span>\n<span>WITH</span> <span>(</span><span>partitioning</span><span>=</span><span>ARRAY</span><span>[</span><span>'day(event_time)'</span><span>])</span>\n</code></pre></div>\n<p>When dealing with logs, it often happens that we want to know what happened\ntoday or within the last few days:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>logs</span>\n<span>WHERE</span>\n  <span>event_time</span> <span>&gt;=</span> <span>CURRENT_DATE</span>\n</code></pre></div>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>logs</span>\n<span>WHERE</span>\n  <span>event_time</span> <span>&gt;=</span> <span>CURRENT_DATE</span> <span>-</span> <span>INTERVAL</span> <span>'7'</span> <span>DAY</span>\n</code></pre></div>\n<h2 id=\"constant-folding\">\n    Constant folding <a target=\"_blank\" href=\"https://trino.io/blog/2023/04/11/date-predicates.html#constant-folding\">#</a>\n</h2>\n<p>Trino uses the <em>constant folding</em> optimization technique for dealing with these\ntypes of queries by internally rewriting the filter expression as a comparison\npredicate against a constant evaluated before executing the query in order to\navoid recalculating the same expression for each row scanned:</p>\n<p><img src=\"https://trino.io/assets/blog/date-predicates/constant_folding.png\" alt=\"\"></p>\n<h2 id=\"predicate-pushdown\">\n    Predicate pushdown <a target=\"_blank\" href=\"https://trino.io/blog/2023/04/11/date-predicates.html#predicate-pushdown\">#</a>\n</h2>\n<p>Another common query scenario for log data is to query for a specific date in\nthe past. A seasoned SQL user, being aware of the underlying data type of the\npartitioning column, would likely specify the date to be queried explicitly as\ntwo timestamp constant filter expressions:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>logs</span>\n<span>WHERE</span>\n  <span>event_time</span> <span>&gt;=</span> <span>TIMESTAMP</span> <span>'2022-01-20 00:00:00.000000 UTC'</span>\n  <span>AND</span> <span>event_time</span> <span>&lt;</span> <span>TIMESTAMP</span> <span>'2022-01-21 00:00:00.000000 UTC'</span>\n</code></pre></div>\n<p>A different flavor of the above-mentioned query would be to use\nthe <a target=\"_blank\" href=\"https://trino.io/docs/current/functions/comparison.html#range-operator-between\">BETWEEN</a>\nrange operator:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>logs</span>\n<span>WHERE</span>\n  <span>event_time</span> <span>BETWEEN</span> <span>TIMESTAMP</span> <span>'2022-01-20 00:00:00.000000 UTC'</span>\n  <span>AND</span> <span>TIMESTAMP</span> <span>'2022-01-20 23:59:59.999999 UTC'</span>\n</code></pre></div>\n<p>Users can focus on writing queries that are concise and readable by other human\nreaders, and leave the eventual grunt optimization work to the query engine.</p>\n<p>A succinct way of querying the logs for a specific day would be to cast the\n<code>timestamp</code> field value to its corresponding <code>date</code> value and compare it with\nthe day containing the relevant logs:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>logs</span>\n<span>WHERE</span>\n  <span>CAST</span><span>(</span><span>event_time</span> <span>AS</span> <span>date</span><span>)</span> <span>=</span> <span>DATE</span> <span>'2022-01-20'</span>\n</code></pre></div>\n<p>In this case, Trino <a target=\"_blank\" href=\"https://github.com/trinodb/trino/commit/49be4c2a\">unwraps the initial temporal\nfilter</a> to a filter that tests\nwhether the column <code>event_time</code> is within the constant timestamp range\ncorresponding to the date used in the initial filter, which is equivalent to the\nmost efficient of the explicit filters mentioned above.</p>\n<p>A different approach of querying the log data for a specific date is to use the\n<a target=\"_blank\" href=\"https://trino.io/docs/current/functions/datetime.html#truncation-function\">date_trunc</a>\nfunction:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>logs</span>\n<span>WHERE</span>\n  <span>date_trunc</span><span>(</span><span>'day'</span><span>,</span> <span>event_time</span><span>)</span> <span>=</span> <span>DATE</span> <span>'2022-01-20'</span>\n</code></pre></div>\n<p>Trino again <a target=\"_blank\" href=\"https://github.com/trinodb/trino/commit/80c079f9\">replaces the initial temporal\nfilter</a> to a filter testing\nwhether the column <code>event_time</code> is within the constant timestamp range\ncorresponding to the date used in the initial filter.</p>\n<p>A slightly different use case is querying the log data to see whether an exotic\nerror type is recorded in the logs during previous months of the current year by\nmaking use of the\n<a target=\"_blank\" href=\"https://trino.io/docs/current/functions/datetime.html#year\">year()</a> function:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>logs</span>\n<span>WHERE</span>\n  <span>year</span><span>(</span><span>event_time</span><span>)</span> <span>=</span> <span>2023</span>\n</code></pre></div>\n<p>This time, Trino <a target=\"_blank\" href=\"https://github.com/trinodb/trino/commit/b8967a3c1550b6e64ad8d3e7979ea46fbfc51550\">rewrites the temporal\nfilter</a>\napplied on the column <code>event_time</code> with a <code>BETWEEN</code> filter for the unfolded date\nrange corresponding to the entire span of the specified year:</p>\n<div><pre><code><span>event_time</span> <span>BETWEEN</span> <span>TIMESTAMP</span> <span>'2023-01-01 00:00:00.000000 UTC'</span>\n<span>AND</span> <span>'2023-12-31 23:59:59.999999'</span>\n</code></pre></div>\n<p>Without predicate pushdown, the filtering is done by Trino on each tuple, after\nscanning the entire content of the table:</p>\n<p><img src=\"https://trino.io/assets/blog/date-predicates/filter_basic_data_flow.png\" alt=\"\"></p>\n<p>The optimization techniques employed by Trino to speed up the above mentioned\ntypes of queries all involve replacing the provided filter with an equivalent\nfilter expression. Constant replacement optimizations compare the table column\nagainst a constant or a constant range with the purpose of literally pushing the\nfilter down to <a target=\"_blank\" href=\"https://iceberg.apache.org/\">Iceberg</a>.</p>\n<p>As a consequence, the partition pruning happens on the metadata layer of the\ntable instead of filtering on top of the data itself, dramatically reducing the\namount of actual data files scanned:</p>\n<p><img src=\"https://trino.io/assets/blog/date-predicates/filter_push_down_data_flow.png\" alt=\"\"></p>\n<p>As described in the <a target=\"_blank\" href=\"https://iceberg.apache.org/spec/\">Iceberg Table Spec</a>, for\nany snapshot of the table, Iceberg tracks each individual data file and the\npartition to which it belongs. Iceberg uses a hierarchical index in its metadata\nlayer by storing <code>lower_bounds</code> and <code>upper_bounds</code> for:</p>\n<ul>\n  <li>each partition in the manifest list files</li>\n  <li>each data file in the manifest files</li>\n</ul>\n<p>Desugaring seemingly variable filter expressions to comparison predicates\ninvolving only columns and constants or constant ranges pays off. Not only does\nit prune out partitions, but it also skips portions of the data file (for\nexample a Apache Parquet row group) or even the data file altogether in certain\ncircumstances. For instance, pruning and skipping can occur  if the queried\nrange value does not overlap with the indexed Iceberg metadata range of values\ncontained in the file, in case of a non-partition column filter.</p>\n<p>To put things in perspective, the optimization techniques presented in this\narticle, which have been already integrated in Trino, can cause the execution of\nqueries containing temporal filters with selective filters to complete in\nseconds compared (depending on the size of the table scanned) to hours.</p>\n<p>A reader keen to experiment and discover whether the previously mentioned\noptimization techniques are actually effective can use\n<a target=\"_blank\" href=\"https://trino.io/docs/current/sql/explain.html\">EXPLAIN</a> to examine the output\nof the query planning stage. If the temporal predicate employed in the query is\nbeing pushed down, the scan operation should definitely have fewer rows than the\ncount of all rows contained in the table.</p>\n<p>The queries in this post showcase just a tiny fraction of the myriad of\ntechniques which can be employed to perform queries on date and time columns.\nTrino continuously strives to streamline its users’ workflows by providing the\nresults of queries as fast as possible.</p>\n  </div>\n</article>\n</div>"
---

In the data lake world, data partitioning is a technique that is critical to the
performance of read operations. In order to avoid scanning large amounts of data
accidentally, and also to limit the number of partitions that are being
processed by a query, a query engine must push down constant expressions when
filtering partitions.
Partitions in an Iceberg table tend to be fairly large, containing up to tens or
even hundreds of data files. It is therefore crucial to be able to skip
irrelevant partitions while scanning a table in order to ensure high performance
query processing speed. When a table is created in a data lake, its partitioning
scheme constitutes a de-facto index, speeding up queries against it by pruning
out irrelevant partitions from the scan operation.
Date and time are natural and universal partitioning candidates. Common
partition patterns revolve around month, day, hour. One exciting feature  of the
Iceberg table format is its hidden
partitioning.
Iceberg uses handy
transforms
such as year, month, day, hour to deal with the complexities of mapping
a raw timestamp value to an actual partition value in a manner that is
transparent to the user.
Let’s look at a typical example of an Iceberg table containing log events which
are partitioned by day:

CREATE TABLE logs (
    event_time timestamp(6) with time zone,
    level varchar,
    message varchar)
WITH (partitioning=ARRAY['day(event_time)'])


When dealing with logs, it often happens that we want to know what happened
today or within the last few days:

SELECT *
FROM logs
WHERE
  event_time >= CURRENT_DATE



SELECT *
FROM logs
WHERE
  event_time >= CURRENT_DATE - INTERVAL '7' DAY


Constant folding
Trino uses the constant folding optimization technique for dealing with these
types of queries by internally rewriting the filter expression as a comparison
predicate against a constant evaluated before executing the query in order to
avoid recalculating the same expression for each row scanned:

Predicate pushdown
Another common query scenario for log data is to query for a specific date in
the past. A seasoned SQL user, being aware of the underlying data type of the
partitioning column, would likely specify the date to be queried explicitly as
two timestamp constant filter expressions:

SELECT *
FROM logs
WHERE
  event_time >= TIMESTAMP '2022-01-20 00:00:00.000000 UTC'
  AND event_time < TIMESTAMP '2022-01-21 00:00:00.000000 UTC'


A different flavor of the above-mentioned query would be to use
the BETWEEN
range operator:

SELECT *
FROM logs
WHERE
  event_time BETWEEN TIMESTAMP '2022-01-20 00:00:00.000000 UTC'
  AND TIMESTAMP '2022-01-20 23:59:59.999999 UTC'


Users can focus on writing queries that are concise and readable by other human
readers, and leave the eventual grunt optimization work to the query engine.
A succinct way of querying the logs for a specific day would be to cast the
timestamp field value to its corresponding date value and compare it with
the day containing the relevant logs:

SELECT *
FROM logs
WHERE
  CAST(event_time AS date) = DATE '2022-01-20'


In this case, Trino unwraps the initial temporal
filter to a filter that tests
whether the column event_time is within the constant timestamp range
corresponding to the date used in the initial filter, which is equivalent to the
most efficient of the explicit filters mentioned above.
A different approach of querying the log data for a specific date is to use the
date_trunc
function:

SELECT *
FROM logs
WHERE
  date_trunc('day', event_time) = DATE '2022-01-20'


Trino again replaces the initial temporal
filter to a filter testing
whether the column event_time is within the constant timestamp range
corresponding to the date used in the initial filter.
A slightly different use case is querying the log data to see whether an exotic
error type is recorded in the logs during previous months of the current year by
making use of the
year() function:

SELECT *
FROM logs
WHERE
  year(event_time) = 2023


This time, Trino rewrites the temporal
filter
applied on the column event_time with a BETWEEN filter for the unfolded date
range corresponding to the entire span of the specified year:

event_time BETWEEN TIMESTAMP '2023-01-01 00:00:00.000000 UTC'
AND '2023-12-31 23:59:59.999999'


Without predicate pushdown, the filtering is done by Trino on each tuple, after
scanning the entire content of the table:

The optimization techniques employed by Trino to speed up the above mentioned
types of queries all involve replacing the provided filter with an equivalent
filter expression. Constant replacement optimizations compare the table column
against a constant or a constant range with the purpose of literally pushing the
filter down to Iceberg.
As a consequence, the partition pruning happens on the metadata layer of the
table instead of filtering on top of the data itself, dramatically reducing the
amount of actual data files scanned:

As described in the Iceberg Table Spec, for
any snapshot of the table, Iceberg tracks each individual data file and the
partition to which it belongs. Iceberg uses a hierarchical index in its metadata
layer by storing lower_bounds and upper_bounds for:
each partition in the manifest list files
each data file in the manifest files
Desugaring seemingly variable filter expressions to comparison predicates
involving only columns and constants or constant ranges pays off. Not only does
it prune out partitions, but it also skips portions of the data file (for
example a Apache Parquet row group) or even the data file altogether in certain
circumstances. For instance, pruning and skipping can occur  if the queried
range value does not overlap with the indexed Iceberg metadata range of values
contained in the file, in case of a non-partition column filter.
To put things in perspective, the optimization techniques presented in this
article, which have been already integrated in Trino, can cause the execution of
queries containing temporal filters with selective filters to complete in
seconds compared (depending on the size of the table scanned) to hours.
A reader keen to experiment and discover whether the previously mentioned
optimization techniques are actually effective can use
EXPLAIN to examine the output
of the query planning stage. If the temporal predicate employed in the query is
being pushed down, the scan operation should definitely have fewer rows than the
count of all rows contained in the table.
The queries in this post showcase just a tiny fraction of the myriad of
techniques which can be employed to perform queries on date and time columns.
Trino continuously strives to streamline its users’ workflows by providing the
results of queries as fast as possible.
