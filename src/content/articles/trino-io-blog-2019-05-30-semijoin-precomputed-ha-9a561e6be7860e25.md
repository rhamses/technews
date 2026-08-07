---
title: "Using Precomputed Hash in SemiJoin Operations"
link: "https://trino.io/blog/2019/05/30/semijoin-precomputed-hasd.html"
guid: "https://trino.io/blog/2019/05/30/semijoin-precomputed-hasd.html"
pubDate: "2019-05-30T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Queries involving IN and NOT IN over a subquery are much faster in \nPresto 312.\n\nWe ran the benchmark above with 3 workers (r3.2xlarge) and 1 coordinator (r3.xlarge) on \nTPC-DS scale 1000 stored in ORC format using the following queries:\n\nSELECT count(*)\nFROM store_sales\nWHERE store_sales.ss_customer_sk IN (\n    SELECT c_customer_sk FROM customer\n)\n\n\n\nSELECT count(*)\nFROM store_sales\nWHERE store_sales.ss_store_sk NOT IN (\n    SELECT s_store_sk \n    FROM store\n    WHERE s_hours <> '8AM-4PM'\n)\n\n\nWhat was the improvement?\nWe found that the optimization to use precomputed hashes, which is enabled by \ndefault, was missing in SemiJoin operator.  Hash values were precomputed at the leaf \nstages but they were not being used in the SemiJoin operator leading to re-calculation \nof the hash values at this operator. Since queries involving IN and NOT IN over a \nsubquery use SemiJoin operator, the fix to use precomputed hash in SemiJoin operator \nimproves the performance of such queries significantly.\nHow does optimize-hash-generation optimization work\nPresto divides a query plan into parts called Stages which can be run in parallel on \nmultiple nodes, each node working on different set of data. There are two types of stages:\nLeaf Stages: these are the stages that are at the leaf of the Query Plan and read \ndata from a datasource, like a Hive Table.\nIntermediate Stages: these are the stages other than the leaf stages and process \ndata from other upstream stages.\nThe Exchange operator shuffles and transfers the output from upstream stages to the \nintermediate stages. For certain operators like GROUP BY and JOIN, output data of \nthe leaf stage is partitioned by the values of a column and the shuffle operation ensures \nthat a particular partition is always processed by the same task of the Intermediate stage. \nThis partitioning requires calculation of a hash on that column’s values during exchange \nand later in the intermediate stage same hash is needed during the execution of GROUP BY \nor JOIN operation. To prevent redundant calculations, Presto calculates this hash value \nin the leaf stage, uses it in Exchange operator and makes it available in the output to let\nGROUP BY or JOIN operations use it in the intermediate stage.\nConsider this query to count the number of stores per city:\n\nSELECT count(*), city \nFROM stores \nGROUP BY city\n\n\nThe query plan (simplified) and its division into stages looks like below:\n\nThe leaf stage (Stage2) reads the table from a data source, feeds the partially \naggregated data to Stage1 where final aggregation happens, and finally, the result is available \nvia Stage0.\nEach row produced by Stage2, needs to be partitioned by the value of city column in it to ensure \ndata for same city is processed by the same task of Stage1. After the exchange, when a row is consumed \nin Stage1, it needs to be hashed again to find a group for the row so that the final aggregation \naccumulates results for each city in it’s corresponding group bucket. Double hash calculations on \nthe values of city column is prevented by doing this calculation once while reading the data and then \nusing it in both Exchange and Final Aggregation operations which reduces CPU usage of the query. \nAdditionally, pushing this calculation into leaf stage which is better parallelized when there is \na large number of splits for this stage, improves query latency.\nHow to get this fix?\nThis fix is available in Presto version 312 and above. The optimize-hash-generation setting is enabled \nby default so the fix will be in action as soon as you upgrade your Presto installation."
author: "Shubham Tagra, Qubole"
contentHtml: "<div>\n<article>\n  <div><p>Queries involving <code>IN</code> and <code>NOT IN</code> over a subquery are much faster in \n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-312.html\">Presto 312</a>.</p>\n<p><img src=\"https://trino.io/assets/blog/semijoin-precomputed-hash/semijoin-precomputed-hash-gains.png\" alt=\"\"></p>\n<!--more-->\n<p>We ran the benchmark above with 3 workers (r3.2xlarge) and 1 coordinator (r3.xlarge) on \nTPC-DS scale 1000 stored in ORC format using the following queries:</p>\n<div><pre><code><span>SELECT</span> <span>count</span><span>(</span><span>*</span><span>)</span>\n<span>FROM</span> <span>store_sales</span>\n<span>WHERE</span> <span>store_sales</span><span>.</span><span>ss_customer_sk</span> <span>IN</span> <span>(</span>\n    <span>SELECT</span> <span>c_customer_sk</span> <span>FROM</span> <span>customer</span>\n<span>)</span>\n</code></pre></div>\n<div><pre><code><span>SELECT</span> <span>count</span><span>(</span><span>*</span><span>)</span>\n<span>FROM</span> <span>store_sales</span>\n<span>WHERE</span> <span>store_sales</span><span>.</span><span>ss_store_sk</span> <span>NOT</span> <span>IN</span> <span>(</span>\n    <span>SELECT</span> <span>s_store_sk</span> \n    <span>FROM</span> <span>store</span>\n    <span>WHERE</span> <span>s_hours</span> <span>&lt;&gt;</span> <span>'8AM-4PM'</span>\n<span>)</span>\n</code></pre></div>\n<h2 id=\"what-was-the-improvement\">\n    What was the improvement? <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/30/semijoin-precomputed-hasd.html#what-was-the-improvement\">#</a>\n</h2>\n<p>We found that the optimization to use precomputed hashes, which is enabled by \ndefault, was missing in <code>SemiJoin</code> operator.  Hash values were precomputed at the leaf \nstages but they were not being used in the <code>SemiJoin</code> operator leading to re-calculation \nof the hash values at this operator. Since queries involving <code>IN</code> and <code>NOT IN</code> over a \nsubquery use <code>SemiJoin</code> operator, <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/767\">the fix to use precomputed hash in SemiJoin operator</a> \nimproves the performance of such queries significantly.</p>\n<h2 id=\"how-does-optimize-hash-generation-optimization-work\">\n    How does <em>optimize-hash-generation</em> optimization work <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/30/semijoin-precomputed-hasd.html#how-does-optimize-hash-generation-optimization-work\">#</a>\n</h2>\n<p>Presto divides a query plan into parts called Stages which can be run in parallel on \nmultiple nodes, each node working on different set of data. There are two types of stages:</p>\n<ol>\n  <li>Leaf Stages: these are the stages that are at the leaf of the Query Plan and read \ndata from a datasource, like a Hive Table.</li>\n  <li>Intermediate Stages: these are the stages other than the leaf stages and process \ndata from other upstream stages.</li>\n</ol>\n<p>The <code>Exchange</code> operator shuffles and transfers the output from upstream stages to the \nintermediate stages. For certain operators like <code>GROUP BY</code> and <code>JOIN</code>, output data of \nthe leaf stage is partitioned by the values of a column and the shuffle operation ensures \nthat a particular partition is always processed by the same task of the Intermediate stage. \nThis partitioning requires calculation of a hash on that column’s values during exchange \nand later in the intermediate stage same hash is needed during the execution of <code>GROUP BY</code> \nor <code>JOIN</code> operation. To prevent redundant calculations, Presto calculates this hash value \nin the leaf stage, uses it in <code>Exchange</code> operator and makes it available in the output to let\n<code>GROUP BY</code> or <code>JOIN</code> operations use it in the intermediate stage.</p>\n<p>Consider this query to count the number of stores per city:</p>\n<div><pre><code><span>SELECT</span> <span>count</span><span>(</span><span>*</span><span>),</span> <span>city</span> \n<span>FROM</span> <span>stores</span> \n<span>GROUP</span> <span>BY</span> <span>city</span>\n</code></pre></div>\n<p>The query plan (simplified) and its division into stages looks like below:</p>\n<p><img src=\"https://trino.io/assets/blog/semijoin-precomputed-hash/query-plan.png\" alt=\"\"></p>\n<p>The leaf stage (<code>Stage2</code>) reads the table from a data source, feeds the partially \naggregated data to <code>Stage1</code> where final aggregation happens, and finally, the result is available \nvia <code>Stage0</code>.</p>\n<p>Each row produced by <code>Stage2</code>, needs to be partitioned by the value of <code>city</code> column in it to ensure \ndata for same city is processed by the same task of <code>Stage1</code>. After the exchange, when a row is consumed \nin <code>Stage1</code>, it needs to be hashed again to find a group for the row so that the final aggregation \naccumulates results for each city in it’s corresponding group bucket. Double hash calculations on \nthe values of <code>city</code> column is prevented by doing this calculation once while reading the data and then \nusing it in both <code>Exchange</code> and <code>Final Aggregation</code> operations which reduces CPU usage of the query. \nAdditionally, pushing this calculation into leaf stage which is better parallelized when there is \na large number of splits for this stage, improves query latency.</p>\n<h2 id=\"how-to-get-this-fix\">\n    How to get this fix? <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/30/semijoin-precomputed-hasd.html#how-to-get-this-fix\">#</a>\n</h2>\n<p>This fix is available in Presto version 312 and above. The <code>optimize-hash-generation</code> setting is enabled \nby default so the fix will be in action as soon as you upgrade your Presto installation.</p>\n  </div>\n</article>\n</div>"
---

Queries involving IN and NOT IN over a subquery are much faster in 
Presto 312.

We ran the benchmark above with 3 workers (r3.2xlarge) and 1 coordinator (r3.xlarge) on 
TPC-DS scale 1000 stored in ORC format using the following queries:

SELECT count(*)
FROM store_sales
WHERE store_sales.ss_customer_sk IN (
    SELECT c_customer_sk FROM customer
)



SELECT count(*)
FROM store_sales
WHERE store_sales.ss_store_sk NOT IN (
    SELECT s_store_sk 
    FROM store
    WHERE s_hours <> '8AM-4PM'
)


What was the improvement?
We found that the optimization to use precomputed hashes, which is enabled by 
default, was missing in SemiJoin operator.  Hash values were precomputed at the leaf 
stages but they were not being used in the SemiJoin operator leading to re-calculation 
of the hash values at this operator. Since queries involving IN and NOT IN over a 
subquery use SemiJoin operator, the fix to use precomputed hash in SemiJoin operator 
improves the performance of such queries significantly.
How does optimize-hash-generation optimization work
Presto divides a query plan into parts called Stages which can be run in parallel on 
multiple nodes, each node working on different set of data. There are two types of stages:
Leaf Stages: these are the stages that are at the leaf of the Query Plan and read 
data from a datasource, like a Hive Table.
Intermediate Stages: these are the stages other than the leaf stages and process 
data from other upstream stages.
The Exchange operator shuffles and transfers the output from upstream stages to the 
intermediate stages. For certain operators like GROUP BY and JOIN, output data of 
the leaf stage is partitioned by the values of a column and the shuffle operation ensures 
that a particular partition is always processed by the same task of the Intermediate stage. 
This partitioning requires calculation of a hash on that column’s values during exchange 
and later in the intermediate stage same hash is needed during the execution of GROUP BY 
or JOIN operation. To prevent redundant calculations, Presto calculates this hash value 
in the leaf stage, uses it in Exchange operator and makes it available in the output to let
GROUP BY or JOIN operations use it in the intermediate stage.
Consider this query to count the number of stores per city:

SELECT count(*), city 
FROM stores 
GROUP BY city


The query plan (simplified) and its division into stages looks like below:

The leaf stage (Stage2) reads the table from a data source, feeds the partially 
aggregated data to Stage1 where final aggregation happens, and finally, the result is available 
via Stage0.
Each row produced by Stage2, needs to be partitioned by the value of city column in it to ensure 
data for same city is processed by the same task of Stage1. After the exchange, when a row is consumed 
in Stage1, it needs to be hashed again to find a group for the row so that the final aggregation 
accumulates results for each city in it’s corresponding group bucket. Double hash calculations on 
the values of city column is prevented by doing this calculation once while reading the data and then 
using it in both Exchange and Final Aggregation operations which reduces CPU usage of the query. 
Additionally, pushing this calculation into leaf stage which is better parallelized when there is 
a large number of splits for this stage, improves query latency.
How to get this fix?
This fix is available in Presto version 312 and above. The optimize-hash-generation setting is enabled 
by default so the fix will be in action as soon as you upgrade your Presto installation.
