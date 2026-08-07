---
title: "Dynamic filtering for highly-selective join optimization"
link: "https://trino.io/blog/2019/06/30/dynamic-filtering.html"
guid: "https://trino.io/blog/2019/06/30/dynamic-filtering.html"
pubDate: "2019-06-30T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "By using dynamic filtering via run-time predicate pushdown, we can significantly optimize highly-selective inner-joins.\nIntroduction\nIn the highly-selective join scenario, most of the probe-side rows are dropped immediately after being read, since they \ndon’t match the join criteria.\nOur idea was to extend Presto’s predicate pushdown support from the planning phase to run-time, in order to skip reading \nthe non-relevant rows from our connector \ninto Presto1. It should allow much faster joins, when the build-side scan results in a low-cardinality table:\n\nThe approach above is called “dynamic filtering”, and there is an ongoing effort \nto integrate it into Presto.\nThe main difficulty is the need to pass the build-side values from the inner-join operator to the probe-side scan operator, \nsince the operators may run on different machines. A possible solution is to use the coordinator to facilitate the message \npassing. However, it requires multiple changes in the existing Presto codebase and careful design is needed to avoid overloading\nthe coordinator.\nSince it’s a complex feature with lots of moving parts, we suggest the approach below that allows solving it in a simpler way \nfor specific join use-cases. We note that parts of the implementation below will also help implementing the general dynamic \nfiltering solution.\nDesign\nOur approach relies on the cost-based optimizer \n(CBO) that allows using “broadcast” join, since in our case the build-side is much smaller than the probe-side. In this case, \nthe probe-side scan and the inner-join operators are running in the same process - so the message passing between them becomes \nmuch simpler.\nTherefore, most of the required changes are at the \nLocalExecutionPlanner \nclass, and there is no dependencies on the planner nor the coordinator.\nImplementation\nFirst, we make sure that a broadcast join is used and that the local stage query plan contains the probe-side \nTableScan node.\nOtherwise - we don’t apply our the optimization since we need access to the probe-side PageSourceProvider \nfor predicate pushdown.\nThen, we add a new “collection” operator, just before the hash-builder operator as described below:\n\nThis operator collects the build-side values, and after its input is over, exposes the resulting dynamic filter as a \nTupleDomain \nto the probe-side PageSourceProvider.\nSince the probe-side scan operators are running concurrently with the build-side collection, we don’t block the first probe-side \nsplits - but allow them to be processed while dynamic filters collection is in progress.\nThe lookup-join operator is not changed, but the optimization above allows it to process much less probe-side rows, while \nkeeping the result the same.\nBenchmarks\nWe ran TPC-DS queries on i3.metal 3-node Varada cluster using TPC-DS scale 1000 data.\nThe following queries benefit the most for our dynamic filtering implementation (measuring the elapsed time in seconds).\nQuery\n      Dynamic filtering & CBO\n      Only CBO\n      No CBO\n    \nq10\n      2.5\n      8.9\n      10.0\n    \nq20\n      3.9\n      12.6\n      26.7\n    \nq31\n      6.5\n      34.8\n      41.5\n    \nq32\n      6.9\n      23.0\n      29.7\n    \nq34\n      3.1\n      11.4\n      14.1\n    \nq69\n      2.7\n      8.9\n      9.9\n    \nq71\n      9.9\n      91.8\n      107.4\n    \nq77\n      3.5\n      17.9\n      18.1\n    \nq96\n      1.9\n      8.0\n      10.2\n    \nq98\n      5.8\n      26.5\n      57.1\n    \n\nFor example, running the TPC-DS q71 query \nresults in ~9x performance improvement:\nDynamic filtering\n      Enabled\n      Disabled\n    \nElapsed (sec)\n      10\n      92\n    \nCPU (min)\n      14\n      127\n    \nData read (GB)\n      11\n      112\n    \nDiscussion\nThese queries are joining large fact “sales” tables with much smaller and filtered dimension tables (e.g. “items”, “customers”, “stores”) - \nresulting in significant optimization by using dynamic filtering.\nNote that we rely on the fact that our connector allows efficient run-time filtering of the build-side table, by using an inline index \nfor every column for each split.\nWe also rely on the CBO and statistics’ estimation to correctly convert join distribution type to “broadcast” join. Since current statistics’ \nestimation doesn’t support all query plans, this optimization cannot be currently applied for some types of \naggregations \n(e.g. TPC-DS q19 query).\nIn addition, our current dynamic filtering doesn’t support multiple join operators in the same stage, so there are some TPC-DS queries \n(e.g. q13) \nthat may be optimized further.\nFuture work\nThe implementation above is currently in the process of being reviewed and will be \navailable in a release soon. In addition, we intend to improve the existing implementation to resolve the limitations described above, \nand to support more join patterns.\nInitially we had experimented with adding Index Join support to our connector, but since it requires a global index and efficient lookups for high performance, we switched to the dynamic filtering approach. ↩"
author: "Roman Zeyde"
contentHtml: "<div>\n<article>\n  <div><p>By using dynamic filtering via run-time predicate pushdown, we can significantly optimize highly-selective inner-joins.</p>\n<!--more-->\n<h2 id=\"introduction\">\n    Introduction <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering.html#introduction\">#</a>\n</h2>\n<p>In the highly-selective join scenario, most of the probe-side rows are dropped immediately after being read, since they \ndon’t match the join criteria.</p>\n<p>Our idea was to extend Presto’s predicate pushdown support from the planning phase to run-time, in order to skip reading \nthe non-relevant rows from <a target=\"_blank\" href=\"https://www.slideshare.net/OriReshef/presto-for-apps-deck-varada-prestoconf\">our connector</a> \ninto Presto<sup><a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering.html#fn:1\">1</a></sup>. It should allow much faster joins, when the build-side scan results in a low-cardinality table:</p>\n<p><img src=\"https://trino.io/assets/blog/dynamic-filtering/dynamic-filtering.png\" alt=\"\"></p>\n<p>The approach above is called “dynamic filtering”, and there is <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/52\">an ongoing effort</a> \nto integrate it into Presto.</p>\n<p>The main difficulty is the need to pass the build-side values from the inner-join operator to the probe-side scan operator, \nsince the operators may run on different machines. A possible solution is to use the coordinator to facilitate the message \npassing. However, it requires multiple changes in the existing Presto codebase and careful design is needed to avoid overloading\nthe coordinator.</p>\n<p>Since it’s a complex feature with lots of moving parts, we suggest the approach below that allows solving it in a simpler way \nfor specific join use-cases. We note that parts of the implementation below will also help implementing the general dynamic \nfiltering solution.</p>\n<h2 id=\"design\">\n    Design <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering.html#design\">#</a>\n</h2>\n<p>Our approach relies on the <a target=\"_blank\" href=\"https://www.starburst.io/wp-content/uploads/2018/09/Presto-Cost-Based-Query-Optimizer-WP.pdf\">cost-based optimizer</a> \n(CBO) that allows using “broadcast” join, since in our case the build-side is much smaller than the probe-side. In this case, \nthe probe-side scan and the inner-join operators are running in the same process - so the message passing between them becomes \nmuch simpler.</p>\n<p>Therefore, most of the required changes are at the \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/sql/planner/LocalExecutionPlanner.java\"><code>LocalExecutionPlanner</code></a> \nclass, and there is no dependencies on the planner nor the coordinator.</p>\n<h2 id=\"implementation\">\n    Implementation <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering.html#implementation\">#</a>\n</h2>\n<p>First, we make sure that a broadcast join is used and that the local stage query plan contains the probe-side \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/sql/planner/plan/TableScanNode.java\"><code>TableScan</code></a> node.\nOtherwise - we don’t apply our the optimization since we need access to the probe-side <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/split/PageSourceProvider.java\"><code>PageSourceProvider</code></a> \nfor predicate pushdown.</p>\n<p>Then, we add a new “collection” operator, just before the hash-builder operator as described below:</p>\n<p><img src=\"https://trino.io/assets/blog/dynamic-filtering/operators.png\" alt=\"\"></p>\n<p>This operator collects the build-side values, and after its input is over, exposes the resulting dynamic filter as a \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-spi/src/main/java/io/prestosql/spi/predicate/TupleDomain.java\"><code>TupleDomain</code></a> \nto the probe-side <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/split/PageSourceProvider.java\"><code>PageSourceProvider</code></a>.</p>\n<p>Since the probe-side scan operators are running concurrently with the build-side collection, we don’t block the first probe-side \nsplits - but allow them to be processed while dynamic filters collection is in progress.</p>\n<p>The lookup-join operator is not changed, but the optimization above allows it to process much less probe-side rows, while \nkeeping the result the same.</p>\n<h2 id=\"benchmarks\">\n    Benchmarks <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering.html#benchmarks\">#</a>\n</h2>\n<p>We ran TPC-DS queries on i3.metal 3-node Varada cluster using TPC-DS scale 1000 data.\nThe following queries benefit the most for our dynamic filtering implementation (measuring the elapsed time in seconds).</p>\n<table>\n  <thead>\n    <tr>\n      <th>Query</th>\n      <th>Dynamic filtering &amp; CBO</th>\n      <th>Only CBO</th>\n      <th>No CBO</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q10.sql\">q10</a></td>\n      <td>2.5</td>\n      <td>8.9</td>\n      <td>10.0</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q20.sql\">q20</a></td>\n      <td>3.9</td>\n      <td>12.6</td>\n      <td>26.7</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q31.sql\">q31</a></td>\n      <td>6.5</td>\n      <td>34.8</td>\n      <td>41.5</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q32.sql\">q32</a></td>\n      <td>6.9</td>\n      <td>23.0</td>\n      <td>29.7</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q34.sql\">q34</a></td>\n      <td>3.1</td>\n      <td>11.4</td>\n      <td>14.1</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q69.sql\">q69</a></td>\n      <td>2.7</td>\n      <td>8.9</td>\n      <td>9.9</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q71.sql\">q71</a></td>\n      <td>9.9</td>\n      <td>91.8</td>\n      <td>107.4</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q77.sql\">q77</a></td>\n      <td>3.5</td>\n      <td>17.9</td>\n      <td>18.1</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q96.sql\">q96</a></td>\n      <td>1.9</td>\n      <td>8.0</td>\n      <td>10.2</td>\n    </tr>\n    <tr>\n      <td><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q98.sql\">q98</a></td>\n      <td>5.8</td>\n      <td>26.5</td>\n      <td>57.1</td>\n    </tr>\n  </tbody>\n</table>\n<p><img src=\"https://trino.io/assets/blog/dynamic-filtering/benchmark.png\" alt=\"\"></p>\n<p>For example, running the <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q71.sql\">TPC-DS q71 query</a> \nresults in ~9x performance improvement:</p>\n<table>\n  <thead>\n    <tr>\n      <th>Dynamic filtering</th>\n      <th>Enabled</th>\n      <th>Disabled</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Elapsed (sec)</td>\n      <td>10</td>\n      <td>92</td>\n    </tr>\n    <tr>\n      <td>CPU (min)</td>\n      <td>14</td>\n      <td>127</td>\n    </tr>\n    <tr>\n      <td>Data read (GB)</td>\n      <td>11</td>\n      <td>112</td>\n    </tr>\n  </tbody>\n</table>\n<h2 id=\"discussion\">\n    Discussion <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering.html#discussion\">#</a>\n</h2>\n<p>These queries are joining large fact “sales” tables with much smaller and filtered dimension tables (e.g. “items”, “customers”, “stores”) - \nresulting in significant optimization by using dynamic filtering.</p>\n<p>Note that we rely on the fact that our connector allows efficient run-time filtering of the build-side table, by using an inline index \nfor every column for each split.</p>\n<p>We also rely on the CBO and statistics’ estimation to correctly convert join distribution type to “broadcast” join. Since current statistics’ \nestimation doesn’t support all query plans, this optimization cannot be currently applied for some types of \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/58b86da0eda9d479d418d9752b8cdd4d2c44d9ae/presto-main/src/main/java/io/prestosql/cost/AggregationStatsRule.java\">aggregations</a> \n(e.g. <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q19.sql\">TPC-DS q19 query</a>).</p>\n<p>In addition, our current dynamic filtering doesn’t support multiple join operators in the same stage, so there are some TPC-DS queries \n(e.g. <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-product-tests/src/main/resources/sql-tests/testcases/tpcds/q13.sql\">q13</a>) \nthat may be optimized further.</p>\n<h2 id=\"future-work\">\n    Future work <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering.html#future-work\">#</a>\n</h2>\n<p>The implementation above is currently in the process of being <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/931\">reviewed</a> and will be \navailable in a release soon. In addition, we intend to improve the existing implementation to resolve the limitations described above, \nand to support more join patterns.</p>\n<div>\n  <ol>\n    <li>\n      <p>Initially we had experimented with adding <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/1afbe98bb1eebfcf9050efa5c9a6bb6ccad80c8c/presto-spi/src/main/java/io/prestosql/spi/connector/ConnectorMetadata.java#L527-L533\">Index Join support</a> to our connector, but since it requires a global index and efficient lookups for high performance, we switched to the dynamic filtering approach.&#160;<a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering.html#fnref:1\">↩</a></p>\n    </li>\n  </ol>\n</div>\n  </div>\n</article>\n</div>"
---

By using dynamic filtering via run-time predicate pushdown, we can significantly optimize highly-selective inner-joins.
Introduction
In the highly-selective join scenario, most of the probe-side rows are dropped immediately after being read, since they 
don’t match the join criteria.
Our idea was to extend Presto’s predicate pushdown support from the planning phase to run-time, in order to skip reading 
the non-relevant rows from our connector 
into Presto1. It should allow much faster joins, when the build-side scan results in a low-cardinality table:

The approach above is called “dynamic filtering”, and there is an ongoing effort 
to integrate it into Presto.
The main difficulty is the need to pass the build-side values from the inner-join operator to the probe-side scan operator, 
since the operators may run on different machines. A possible solution is to use the coordinator to facilitate the message 
passing. However, it requires multiple changes in the existing Presto codebase and careful design is needed to avoid overloading
the coordinator.
Since it’s a complex feature with lots of moving parts, we suggest the approach below that allows solving it in a simpler way 
for specific join use-cases. We note that parts of the implementation below will also help implementing the general dynamic 
filtering solution.
Design
Our approach relies on the cost-based optimizer 
(CBO) that allows using “broadcast” join, since in our case the build-side is much smaller than the probe-side. In this case, 
the probe-side scan and the inner-join operators are running in the same process - so the message passing between them becomes 
much simpler.
Therefore, most of the required changes are at the 
LocalExecutionPlanner 
class, and there is no dependencies on the planner nor the coordinator.
Implementation
First, we make sure that a broadcast join is used and that the local stage query plan contains the probe-side 
TableScan node.
Otherwise - we don’t apply our the optimization since we need access to the probe-side PageSourceProvider 
for predicate pushdown.
Then, we add a new “collection” operator, just before the hash-builder operator as described below:

This operator collects the build-side values, and after its input is over, exposes the resulting dynamic filter as a 
TupleDomain 
to the probe-side PageSourceProvider.
Since the probe-side scan operators are running concurrently with the build-side collection, we don’t block the first probe-side 
splits - but allow them to be processed while dynamic filters collection is in progress.
The lookup-join operator is not changed, but the optimization above allows it to process much less probe-side rows, while 
keeping the result the same.
Benchmarks
We ran TPC-DS queries on i3.metal 3-node Varada cluster using TPC-DS scale 1000 data.
The following queries benefit the most for our dynamic filtering implementation (measuring the elapsed time in seconds).
Query
      Dynamic filtering & CBO
      Only CBO
      No CBO
    
q10
      2.5
      8.9
      10.0
    
q20
      3.9
      12.6
      26.7
    
q31
      6.5
      34.8
      41.5
    
q32
      6.9
      23.0
      29.7
    
q34
      3.1
      11.4
      14.1
    
q69
      2.7
      8.9
      9.9
    
q71
      9.9
      91.8
      107.4
    
q77
      3.5
      17.9
      18.1
    
q96
      1.9
      8.0
      10.2
    
q98
      5.8
      26.5
      57.1
    

For example, running the TPC-DS q71 query 
results in ~9x performance improvement:
Dynamic filtering
      Enabled
      Disabled
    
Elapsed (sec)
      10
      92
    
CPU (min)
      14
      127
    
Data read (GB)
      11
      112
    
Discussion
These queries are joining large fact “sales” tables with much smaller and filtered dimension tables (e.g. “items”, “customers”, “stores”) - 
resulting in significant optimization by using dynamic filtering.
Note that we rely on the fact that our connector allows efficient run-time filtering of the build-side table, by using an inline index 
for every column for each split.
We also rely on the CBO and statistics’ estimation to correctly convert join distribution type to “broadcast” join. Since current statistics’ 
estimation doesn’t support all query plans, this optimization cannot be currently applied for some types of 
aggregations 
(e.g. TPC-DS q19 query).
In addition, our current dynamic filtering doesn’t support multiple join operators in the same stage, so there are some TPC-DS queries 
(e.g. q13) 
that may be optimized further.
Future work
The implementation above is currently in the process of being reviewed and will be 
available in a release soon. In addition, we intend to improve the existing implementation to resolve the limitations described above, 
and to support more join patterns.
Initially we had experimented with adding Index Join support to our connector, but since it requires a global index and efficient lookups for high performance, we switched to the dynamic filtering approach. ↩
