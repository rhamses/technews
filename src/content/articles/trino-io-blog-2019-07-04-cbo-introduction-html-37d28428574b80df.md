---
title: "Introduction to Trino Cost-Based Optimizer"
link: "https://trino.io/blog/2019/07/04/cbo-introduction.html"
guid: "https://trino.io/blog/2019/07/04/cbo-introduction.html"
pubDate: "2019-07-04T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Last edited 15 June 2022: Update to use the Trino project name.\nThe Cost-Based Optimizer (CBO) in Trino achieves stunning results in industry\nstandard benchmarks (and not only in benchmarks)! The CBO makes decisions based\non several factors, including shape of the query, filters and table statistics.\nI would like to tell you more about what the table statistics are in Trino and\nwhat information can be derived from them.\nThis post was originally published at Starburst Data Engineering\nBlog.\nBackground\nBefore diving deep into how Trino analyzes statistics, let’s set up a stage so\nthat our considerations are framed in some context. Let’s consider a Data\nScientist who wants to know which customers spend most dollars with the\ncompany, based on history of orders (probably to offer them some discounts).\nThey would probably fire up a query like this:\n\nSELECT c.custkey, sum(l.price)\nFROM customer c, orders o, lineitem l\nWHERE c.custkey = o.custkey AND l.orderkey = o.orderkey\nGROUP BY c.custkey ORDER BY sum(l.price) DESC;\n\n\nNow, Trino needs to create an execution plan for this query. It does so by\nfirst transforming a query to a plan in the simplest possible way — here it\nwill create CROSS JOINS for FROM customer c, orders o, lineitem l part of the\nquery and FILTER for WHERE c.custkey = o.custkey AND l.orderkey = o.orderkey.\nThe initial plan is very naïve — CROSS JOINS will produce humongous amounts of\nintermediate data. There is no point in even trying to execute such a plan and\nTrino won’t do that. Instead, it applies transformation to make the plan more\nwhat user probably wanted, as shown below. Note: for succinctness, only part of\nthe query plan is drawn, without aggregation (GROUP BY) and sorting (ORDER\nBY).\n\nIndeed, this is much better than the CROSS JOINS. But we can do even better, if\nwe consider cost.\nCost-Based Optimizer\nWithout going into database internals on how JOIN is implemented, let’s take\nfor granted that it makes a big difference which table is right and which is\nleft in the JOIN. (Simple explanation would be that the table on the right\nbasically needs to be kept in the memory while JOIN result is calculated).\nBecause of that, the following plans produce same result, but may have\ndifferent execution time or memory requirements.\n\nCPU time, memory requirements and network bandwidth usage are the three\ndimensions that contribute to query execution time, both in single query and\nconcurrent workloads. These dimensions are captured as the cost in Trino.\nOur Data Scientist knows that most of the customers made at least one order and\nevery order had at least one item (and many orders had many items), so\nlineitem is the biggest table, orders is medium and customer is the\nsmallest. When joining customer and orders, having orders on the right\nside of the JOIN is not a good idea! However, how the planner can know that? In\nthe real world, the query planner cannot reliably deduce information just from\ntable names. This is where table statistics kick in.\nTable statistics\nTrino has connector-based\narchitecture. A\nconnector can provide table and column\nstatistics:\nnumber of rows in a table,\nnumber of distinct values in a column,\nfraction of NULL values in a column,\nminimum/maximum value in a column,\naverage data size for a column.\nOf course, if some information is missing — e.g. average text length in a\nvarchar column is unknown — a connector can still provide other information and\nCost-Based Optimizer will be able to use that.\nIn our Data Scientist’s example, data sizes can look something like the\nfollowing:\n\nHaving this knowledge, Trino’s Cost-Based\nOptimizer\nwill come up with completely different join ordering in the plan.\n\nFilter statistics\nAs we saw, knowing the sizes of the tables involved in a query is fundamental\nto properly reordering the joins in the query plan. However, knowing just the\nsizes is not enough. Returning to our example, the Data Scientist might want to\ndrill down into results of their previous query, to know which customers\nrepeatedly bought and spent most money on a particular item (clearly, this must\nbe some consumable, or a mobile phone). For this, they will use almost\nidentical query as the original one, adding one more condition.\n\nSELECT c.custkey, sum(l.price)\nFROM customer c, orders o, lineitem l\nWHERE c.custkey = o.custkey AND l.orderkey = o.orderkey\n  AND l.item = 106170                              --- additional condition\nGROUP BY c.custkey ORDER BY sum(l.price) DESC;\n\n\nThe additional FILTER might be applied after the JOIN or before. Obviously,\nfiltering as early as possible is the best strategy, but this also means the\nactual size of the data involved in the JOIN will be different now. In our Data\nScientist’s example, the join order will indeed be different.\n\nUnder the Hood\nExecution Time and Cost\nFrom external perspective, only three things really matter:\nexecution time,\nexecution cost (in dollars),\nability to run (sufficiently) many concurrent queries at a time.\nThe execution time is often called “wall time” to emphasize that we’re not\nreally interested in “CPU time” or number of machines/nodes/threads involved.\nOur Data Scientist’s clock on the wall is the ultimate judge. It would be nice\nif they were not forced to get coffee/eat lunch during each query they run. On\nthe other hand, a CFO will be interested in keeping cluster costs at the lowest\npossible level (without, of course, impeding employees’ effectiveness). Lastly,\na System Administrator needs to ensure that all cluster users can work at the\nsame time. That is, that the cluster can handle many queries at a time,\nyielding enough throughput that “wall time” observed by each of the users is\nsatisfactory.\n\nIt is possible to optimize for only one of the above dimensions. For example,\nwe can have single node cluster and CFO will be happy (but employees will go\nsomewhere else). Contrarily, we may have thousand node cluster even if the\ncompany cannot afford that. Users will be (initially) happy, until the company\ngoes bankrupt. Ultimately, however, we need to balance these trade-offs, which\nbasically means that queries need to be executed as fast as possible, with as\nlittle resources as possible.\nIn Trino, this is modeled with the concept of the cost, which captures\nproperties like CPU cost, memory requirements and network bandwidth usage.\nDifferent variants of a query execution plan are explored, assigned a cost and\ncompared. The variant with the least overall cost is selected for execution.\nThis approach neatly balances the needs of cluster users, administrators and\nthe CFO.\nThe cost of each operation in the query plan is calculated in a way appropriate\nfor the type of the operation, taking into account statistics of the data\ninvolved in the operation. Now, let’s see where the statistics come from.\nStatistics\nIn our Data Scientist’s example, the row counts for tables were taken directly\nfrom table statistics, i.e. provided by a connector. But where did “~3K rows”\ncome from? Let’s dive into some nitty-gritty details.\nA query execution plan is made of “building block” operations, including:\ntable scans (reading the table; at runtime this is actually combined with a\nfilter)\nfilters (SQL’s WHERE clause or any other conditions deduced by the query\nplanner)\nprojections (i.e. computing output expressions)\njoins\naggregations (in fact there are a few different “building blocks” for\naggregations, but that’s a story for another time)\nsorting (SQL’s ORDER BY)\nlimiting (SQL’s LIMIT)\nsorting and limiting combined (SQL’s ORDER BY .. LIMIT .. deserves\nspecialized support)\nand a lot more!\nThe way how the statistics are computed for most interesting “building blocks”\nis discussed below.\nTable Scan statistics\n\nAs explained in “Table statistics” section, the connector which defines the\ntable is responsible for providing the table statistics. Furthermore, the\nconnector will be informed about any filtering conditions that are to be\napplied to the data read from the table. This may be important e.g. in the case\nof Hive partitioned table, where statistics are stored on per-partition basis.\nIf the filtering condition excludes some (or many) partitions, the statistics\nwill consider smaller data set (remaining partitions) and will be more\naccurate.\nTo recall, a connector can provide the following table and column statistics:\nnumber of rows in a table,\nnumber of distinct values in a column,\nfraction of NULL values in a column,\nminimum/maximum value in a column,\naverage data size for a column.\nFilter statistics\n\nWhen considering a filtering operation, a filter’s condition is analyzed and\nthe following estimations are calculated:\nwhat is the probability that data row will pass the filtering condition. From\nthis, expected number of rows after the filter is derived,\nfraction of NULL values for columns involved in the filtering condition (for\nmost conditions, this will simply be 0%),\nnumber of distinct values for columns involved in the filtering condition,\nnumber of distinct values for columns that were not part of the filtering\ncondition, if their original number of distinct values was more than the\nexpected number of data rows that pass the filter.\nFor example, for a condition like l.item = 106170 we can observe that:\nno rows with l.item being NULL will meet the condition,\nthere will be only one distinct value of l.item (106170) after the\nfiltering operation,\non average, number of data rows expected to pass the filter will be equal to\nnumber_of_input_rows * fraction_of_non_nulls / distinct_values. (This\nassumes, of course, that users most often drill down in the data they really\nhave, which is quite a reasonable assumption and also safe to make).\nProjection statistics\n\nProjections (l.item – 1 AS iid) are similar to filters, except that, of\ncourse, they do not impact the expected number of rows after the operation.\nFor a projection, the following types of column statistics are calculated (if\npossible for given projection expression):\nnumber of distinct values produced by the projection,\nfraction of NULL values produced by the projection,\nminimum/maximum value produced by the projection.\nNaturally, if iid is only returned to the user, then these statistics are not\nuseful. However, if it’s later used in filter or join operation, these\nstatistics are important to correctly estimate the number of rows that meet the\nfilter condition or are returned from the join.\nConclusion\nSumming up, Trino’s Cost-Based Optimizer is conceptually a very simple thing.\nAlternative query plans are considered, the best plan is chosen and executed.\nDetails are not so simple, though. Fortunately, to use\nTrino, one doesn’t need to know all these details.\nOf course, anyone with a technical inclination that like to wander in database\ninternals is invited to study the Trino code!\nEnabling Trino CBO is really simple:\nset optimizer.join-reordering-strategy=AUTOMATIC and\njoin-distribution-type=AUTOMATIC in your config.properties,\nanalyze your tables,\nno, there is no third step. That’s it!\nTake Trino CBO for a spin today and let us know about your Trino\nexperience!\n□"
author: "Piotr Findeisen, Starburst Data"
contentHtml: "<p>Last edited 15 June 2022: Update to use the Trino project name.</p>\n\n<p>The Cost-Based Optimizer (CBO) in Trino achieves stunning results in industry\nstandard benchmarks (and not only in benchmarks)! The CBO makes decisions based\non several factors, including shape of the query, filters and table statistics.\nI would like to tell you more about what the table statistics are in Trino and\nwhat information can be derived from them.</p>\n\n<!--more-->\n\n<p>This post was originally published at <a href=\"https://www.starburstdata.com/technical-blog/introduction-to-presto-cost-based-optimizer/\">Starburst Data Engineering\nBlog</a>.</p>\n\n<h1 id=\"background\">Background</h1>\n\n<p>Before diving deep into how Trino analyzes statistics, let’s set up a stage so\nthat our considerations are framed in some context. Let’s consider a Data\nScientist who wants to know which customers spend most dollars with the\ncompany, based on history of orders (probably to offer them some discounts).\nThey would probably fire up a query like this:</p>\n\n<div class=\"language-sql highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code><span class=\"k\">SELECT</span> <span class=\"k\">c</span><span class=\"p\">.</span><span class=\"n\">custkey</span><span class=\"p\">,</span> <span class=\"k\">sum</span><span class=\"p\">(</span><span class=\"n\">l</span><span class=\"p\">.</span><span class=\"n\">price</span><span class=\"p\">)</span>\n<span class=\"k\">FROM</span> <span class=\"n\">customer</span> <span class=\"k\">c</span><span class=\"p\">,</span> <span class=\"n\">orders</span> <span class=\"n\">o</span><span class=\"p\">,</span> <span class=\"n\">lineitem</span> <span class=\"n\">l</span>\n<span class=\"k\">WHERE</span> <span class=\"k\">c</span><span class=\"p\">.</span><span class=\"n\">custkey</span> <span class=\"o\">=</span> <span class=\"n\">o</span><span class=\"p\">.</span><span class=\"n\">custkey</span> <span class=\"k\">AND</span> <span class=\"n\">l</span><span class=\"p\">.</span><span class=\"n\">orderkey</span> <span class=\"o\">=</span> <span class=\"n\">o</span><span class=\"p\">.</span><span class=\"n\">orderkey</span>\n<span class=\"k\">GROUP</span> <span class=\"k\">BY</span> <span class=\"k\">c</span><span class=\"p\">.</span><span class=\"n\">custkey</span> <span class=\"k\">ORDER</span> <span class=\"k\">BY</span> <span class=\"k\">sum</span><span class=\"p\">(</span><span class=\"n\">l</span><span class=\"p\">.</span><span class=\"n\">price</span><span class=\"p\">)</span> <span class=\"k\">DESC</span><span class=\"p\">;</span>\n</code></pre></div></div>\n\n<p>Now, Trino needs to create an execution plan for this query. It does so by\nfirst transforming a query to a plan in the simplest possible way — here it\nwill create CROSS JOINS for <code class=\"language-plaintext highlighter-rouge\">FROM customer c, orders o, lineitem l</code> part of the\nquery and FILTER for <code class=\"language-plaintext highlighter-rouge\">WHERE c.custkey = o.custkey AND l.orderkey = o.orderkey</code>.\nThe initial plan is very naïve — CROSS JOINS will produce humongous amounts of\nintermediate data. There is no point in even trying to execute such a plan and\nTrino won’t do that. Instead, it applies transformation to make the plan more\nwhat user probably wanted, as shown below. Note: for succinctness, only part of\nthe query plan is drawn, without aggregation (<code class=\"language-plaintext highlighter-rouge\">GROUP BY</code>) and sorting (<code class=\"language-plaintext highlighter-rouge\">ORDER\nBY</code>).</p>\n\n<p><img src=\"/assets/blog/cbo-introduction/trino-eliminate-cross-join.png\" alt=\"\" /></p>\n\n<p>Indeed, this is much better than the CROSS JOINS. But we can do even better, if\nwe consider <em>cost</em>.</p>\n\n<h1 id=\"cost-based-optimizer\">Cost-Based Optimizer</h1>\n\n<p>Without going into database internals on how JOIN is implemented, let’s take\nfor granted that it makes a big difference which table is right and which is\nleft in the JOIN. (Simple explanation would be that the table on the right\nbasically needs to be kept in the memory while JOIN result is calculated).\nBecause of that, the following plans produce same result, but may have\ndifferent execution time or memory requirements.</p>\n\n<p><img src=\"/assets/blog/cbo-introduction/trino-join-flip.png\" alt=\"\" /></p>\n\n<p>CPU time, memory requirements and network bandwidth usage are the three\ndimensions that contribute to query execution time, both in single query and\nconcurrent workloads. These dimensions are captured as the <em>cost</em> in Trino.</p>\n\n<p>Our Data Scientist knows that most of the customers made at least one order and\nevery order had at least one item (and many orders had many items), so\n<code class=\"language-plaintext highlighter-rouge\">lineitem</code> is the biggest table, <code class=\"language-plaintext highlighter-rouge\">orders</code> is medium and <code class=\"language-plaintext highlighter-rouge\">customer</code> is the\nsmallest. When joining <code class=\"language-plaintext highlighter-rouge\">customer</code> and <code class=\"language-plaintext highlighter-rouge\">orders</code>, having <code class=\"language-plaintext highlighter-rouge\">orders</code> on the right\nside of the JOIN is not a good idea! However, how the planner can know that? In\nthe real world, the query planner cannot reliably deduce information just from\ntable names. This is where table statistics kick in.</p>\n\n<h2 id=\"table-statistics\">Table statistics</h2>\n\n<p>Trino has <a href=\"https://trino.io/docs/current/develop/connectors.html\">connector-based\narchitecture</a>. A\nconnector can provide <a href=\"https://trino.io/docs/current/optimizer/statistics.html\">table and column\nstatistics</a>:</p>\n\n<ul>\n  <li>number of rows in a table,</li>\n  <li>number of distinct values in a column,</li>\n  <li>fraction of <code class=\"language-plaintext highlighter-rouge\">NULL</code> values in a column,</li>\n  <li>minimum/maximum value in a column,</li>\n  <li>average data size for a column.</li>\n</ul>\n\n<p>Of course, if some information is missing — e.g. average text length in a\nvarchar column is unknown — a connector can still provide other information and\nCost-Based Optimizer will be able to use that.</p>\n\n<p>In our Data Scientist’s example, data sizes can look something like the\nfollowing:</p>\n\n<p><img src=\"/assets/blog/cbo-introduction/trino-data-table-statistics.png\" alt=\"\" /></p>\n\n<p>Having this knowledge, <a href=\"https://trino.io/docs/current/optimizer/cost-based-optimizations.html\">Trino’s Cost-Based\nOptimizer</a>\nwill come up with completely different join ordering in the plan.</p>\n\n<p><img src=\"/assets/blog/cbo-introduction/trino-cbo-results.png\" alt=\"\" /></p>\n\n<h2 id=\"filter-statistics\">Filter statistics</h2>\n\n<p>As we saw, knowing the sizes of the tables involved in a query is fundamental\nto properly reordering the joins in the query plan. However, knowing just the\nsizes is not enough. Returning to our example, the Data Scientist might want to\ndrill down into results of their previous query, to know which customers\nrepeatedly bought and spent most money on a particular item (clearly, this must\nbe some consumable, or a mobile phone). For this, they will use almost\nidentical query as the original one, adding one more condition.</p>\n\n<div class=\"language-sql highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code><span class=\"k\">SELECT</span> <span class=\"k\">c</span><span class=\"p\">.</span><span class=\"n\">custkey</span><span class=\"p\">,</span> <span class=\"k\">sum</span><span class=\"p\">(</span><span class=\"n\">l</span><span class=\"p\">.</span><span class=\"n\">price</span><span class=\"p\">)</span>\n<span class=\"k\">FROM</span> <span class=\"n\">customer</span> <span class=\"k\">c</span><span class=\"p\">,</span> <span class=\"n\">orders</span> <span class=\"n\">o</span><span class=\"p\">,</span> <span class=\"n\">lineitem</span> <span class=\"n\">l</span>\n<span class=\"k\">WHERE</span> <span class=\"k\">c</span><span class=\"p\">.</span><span class=\"n\">custkey</span> <span class=\"o\">=</span> <span class=\"n\">o</span><span class=\"p\">.</span><span class=\"n\">custkey</span> <span class=\"k\">AND</span> <span class=\"n\">l</span><span class=\"p\">.</span><span class=\"n\">orderkey</span> <span class=\"o\">=</span> <span class=\"n\">o</span><span class=\"p\">.</span><span class=\"n\">orderkey</span>\n  <span class=\"k\">AND</span> <span class=\"n\">l</span><span class=\"p\">.</span><span class=\"n\">item</span> <span class=\"o\">=</span> <span class=\"mi\">106170</span>                              <span class=\"c1\">--- additional condition</span>\n<span class=\"k\">GROUP</span> <span class=\"k\">BY</span> <span class=\"k\">c</span><span class=\"p\">.</span><span class=\"n\">custkey</span> <span class=\"k\">ORDER</span> <span class=\"k\">BY</span> <span class=\"k\">sum</span><span class=\"p\">(</span><span class=\"n\">l</span><span class=\"p\">.</span><span class=\"n\">price</span><span class=\"p\">)</span> <span class=\"k\">DESC</span><span class=\"p\">;</span>\n</code></pre></div></div>\n\n<p>The additional FILTER might be applied after the JOIN or before. Obviously,\nfiltering as early as possible is the best strategy, but this also means the\nactual size of the data involved in the JOIN will be different now. In our Data\nScientist’s example, the join order will indeed be different.</p>\n\n<p><img src=\"/assets/blog/cbo-introduction/trino-cbo-results-with-filter.png\" alt=\"\" /></p>\n\n<h1 id=\"under-the-hood\">Under the Hood</h1>\n\n<h2 id=\"execution-time-and-cost\">Execution Time and Cost</h2>\n\n<p>From external perspective, only three things really matter:</p>\n\n<ul>\n  <li>execution time,</li>\n  <li>execution cost (in dollars),</li>\n  <li>ability to run (sufficiently) many concurrent queries at a time.</li>\n</ul>\n\n<p>The execution time is often called “wall time” to emphasize that we’re not\nreally interested in “CPU time” or number of machines/nodes/threads involved.\nOur Data Scientist’s clock on the wall is the ultimate judge. It would be nice\nif they were not forced to get coffee/eat lunch during each query they run. On\nthe other hand, a CFO will be interested in keeping cluster costs at the lowest\npossible level (without, of course, impeding employees’ effectiveness). Lastly,\na System Administrator needs to ensure that all cluster users can work at the\nsame time. That is, that the cluster can handle many queries at a time,\nyielding enough throughput that “wall time” observed by each of the users is\nsatisfactory.</p>\n\n<p><img src=\"/assets/blog/cbo-introduction/under-the-hood.png\" alt=\"\" /></p>\n\n<p>It is possible to optimize for only one of the above dimensions. For example,\nwe can have single node cluster and CFO will be happy (but employees will go\nsomewhere else). Contrarily, we may have thousand node cluster even if the\ncompany cannot afford that. Users will be (initially) happy, until the company\ngoes bankrupt. Ultimately, however, we need to balance these trade-offs, which\nbasically means that queries need to be executed as fast as possible, with as\nlittle resources as possible.</p>\n\n<p>In Trino, this is modeled with the concept of the cost, which captures\nproperties like CPU cost, memory requirements and network bandwidth usage.\nDifferent variants of a query execution plan are explored, assigned a cost and\ncompared. The variant with the least overall cost is selected for execution.\nThis approach neatly balances the needs of cluster users, administrators and\nthe CFO.</p>\n\n<p>The cost of each operation in the query plan is calculated in a way appropriate\nfor the type of the operation, taking into account statistics of the data\ninvolved in the operation. Now, let’s see where the statistics come from.</p>\n\n<h2 id=\"statistics\">Statistics</h2>\n\n<p>In our Data Scientist’s example, the row counts for tables were taken directly\nfrom table statistics, i.e. provided by a connector. But where did “~3K rows”\ncome from? Let’s dive into some nitty-gritty details.</p>\n\n<p>A query execution plan is made of “building block” operations, including:</p>\n\n<ul>\n  <li>table scans (reading the table; at runtime this is actually combined with a\nfilter)</li>\n  <li>filters (SQL’s <code class=\"language-plaintext highlighter-rouge\">WHERE</code> clause or any other conditions deduced by the query\nplanner)</li>\n  <li>projections (i.e. computing output expressions)</li>\n  <li>joins</li>\n  <li>aggregations (in fact there are a few different “building blocks” for\naggregations, but that’s a story for another time)</li>\n  <li>sorting (SQL’s <code class=\"language-plaintext highlighter-rouge\">ORDER BY</code>)</li>\n  <li>limiting (SQL’s <code class=\"language-plaintext highlighter-rouge\">LIMIT</code>)</li>\n  <li>sorting and limiting combined (SQL’s <code class=\"language-plaintext highlighter-rouge\">ORDER BY .. LIMIT ..</code> deserves\nspecialized support)</li>\n  <li>and a lot more!</li>\n</ul>\n\n<p>The way how the statistics are computed for most interesting “building blocks”\nis discussed below.</p>\n\n<h2 id=\"table-scan-statistics\">Table Scan statistics</h2>\n\n<p><img src=\"/assets/blog/cbo-introduction/table-scan-statistics.png\" alt=\"\" /></p>\n\n<p>As explained in “Table statistics” section, the connector which defines the\ntable is responsible for providing the table statistics. Furthermore, the\nconnector will be informed about any filtering conditions that are to be\napplied to the data read from the table. This may be important e.g. in the case\nof Hive partitioned table, where statistics are stored on per-partition basis.\nIf the filtering condition excludes some (or many) partitions, the statistics\nwill consider smaller data set (remaining partitions) and will be more\naccurate.</p>\n\n<p>To recall, a connector can provide the following table and column statistics:</p>\n\n<ul>\n  <li>number of rows in a table,</li>\n  <li>number of distinct values in a column,</li>\n  <li>fraction of <code class=\"language-plaintext highlighter-rouge\">NULL</code> values in a column,</li>\n  <li>minimum/maximum value in a column,</li>\n  <li>average data size for a column.</li>\n</ul>\n\n<h2 id=\"filter-statistics-1\">Filter statistics</h2>\n\n<p><img src=\"/assets/blog/cbo-introduction/filter-statistics.png\" alt=\"\" /></p>\n\n<p>When considering a filtering operation, a filter’s condition is analyzed and\nthe following estimations are calculated:</p>\n\n<ul>\n  <li>what is the probability that data row will pass the filtering condition. From\nthis, expected number of rows after the filter is derived,</li>\n  <li>fraction of <code class=\"language-plaintext highlighter-rouge\">NULL</code> values for columns involved in the filtering condition (for\nmost conditions, this will simply be 0%),</li>\n  <li>number of distinct values for columns involved in the filtering condition,</li>\n  <li>number of distinct values for columns that were not part of the filtering\ncondition, if their original number of distinct values was more than the\nexpected number of data rows that pass the filter.</li>\n</ul>\n\n<p>For example, for a condition like <code class=\"language-plaintext highlighter-rouge\">l.item = 106170</code> we can observe that:</p>\n\n<ul>\n  <li>no rows with <code class=\"language-plaintext highlighter-rouge\">l.item</code> being <code class=\"language-plaintext highlighter-rouge\">NULL</code> will meet the condition,</li>\n  <li>there will be only one distinct value of <code class=\"language-plaintext highlighter-rouge\">l.item</code> (106170) after the\nfiltering operation,</li>\n  <li>on average, number of data rows expected to pass the filter will be equal to\n<code class=\"language-plaintext highlighter-rouge\">number_of_input_rows * fraction_of_non_nulls / distinct_values</code>. (This\nassumes, of course, that users most often drill down in the data they really\nhave, which is quite a reasonable assumption and also safe to make).</li>\n</ul>\n\n<h2 id=\"projection-statistics\">Projection statistics</h2>\n\n<p><img src=\"/assets/blog/cbo-introduction/projection-statistics.png\" alt=\"\" /></p>\n\n<p>Projections (<code class=\"language-plaintext highlighter-rouge\">l.item – 1 AS iid</code>) are similar to filters, except that, of\ncourse, they do not impact the expected number of rows after the operation.</p>\n\n<p>For a projection, the following types of column statistics are calculated (if\npossible for given projection expression):</p>\n\n<ul>\n  <li>number of distinct values produced by the projection,</li>\n  <li>fraction of <code class=\"language-plaintext highlighter-rouge\">NULL</code> values produced by the projection,</li>\n  <li>minimum/maximum value produced by the projection.</li>\n</ul>\n\n<p>Naturally, if <code class=\"language-plaintext highlighter-rouge\">iid</code> is only returned to the user, then these statistics are not\nuseful. However, if it’s later used in filter or join operation, these\nstatistics are important to correctly estimate the number of rows that meet the\nfilter condition or are returned from the join.</p>\n\n<h1 id=\"conclusion\">Conclusion</h1>\n\n<p>Summing up, Trino’s Cost-Based Optimizer is conceptually a very simple thing.\nAlternative query plans are considered, the best plan is chosen and executed.\nDetails are not so simple, though. Fortunately, to use\n<a href=\"https://trino.io/\">Trino</a>, one doesn’t need to know all these details.\nOf course, anyone with a technical inclination that like to wander in database\ninternals is invited to study <a href=\"https://github.com/trinodb/trino\">the Trino code</a>!</p>\n\n<p>Enabling Trino CBO is really simple:</p>\n\n<ul>\n  <li>set <code class=\"language-plaintext highlighter-rouge\">optimizer.join-reordering-strategy=AUTOMATIC</code> and\n<code class=\"language-plaintext highlighter-rouge\">join-distribution-type=AUTOMATIC</code> in your <code class=\"language-plaintext highlighter-rouge\">config.properties</code>,</li>\n  <li><a href=\"https://trino.io/docs/current/sql/analyze.html\">analyze</a> your tables,</li>\n  <li>no, there is no third step. That’s it!</li>\n</ul>\n\n<p>Take Trino CBO for a spin today and let us know about <em>your</em> Trino\nexperience!</p>\n\n<p>□</p>"
---

Last edited 15 June 2022: Update to use the Trino project name.
The Cost-Based Optimizer (CBO) in Trino achieves stunning results in industry
standard benchmarks (and not only in benchmarks)! The CBO makes decisions based
on several factors, including shape of the query, filters and table statistics.
I would like to tell you more about what the table statistics are in Trino and
what information can be derived from them.
This post was originally published at Starburst Data Engineering
Blog.
Background
Before diving deep into how Trino analyzes statistics, let’s set up a stage so
that our considerations are framed in some context. Let’s consider a Data
Scientist who wants to know which customers spend most dollars with the
company, based on history of orders (probably to offer them some discounts).
They would probably fire up a query like this:

SELECT c.custkey, sum(l.price)
FROM customer c, orders o, lineitem l
WHERE c.custkey = o.custkey AND l.orderkey = o.orderkey
GROUP BY c.custkey ORDER BY sum(l.price) DESC;


Now, Trino needs to create an execution plan for this query. It does so by
first transforming a query to a plan in the simplest possible way — here it
will create CROSS JOINS for FROM customer c, orders o, lineitem l part of the
query and FILTER for WHERE c.custkey = o.custkey AND l.orderkey = o.orderkey.
The initial plan is very naïve — CROSS JOINS will produce humongous amounts of
intermediate data. There is no point in even trying to execute such a plan and
Trino won’t do that. Instead, it applies transformation to make the plan more
what user probably wanted, as shown below. Note: for succinctness, only part of
the query plan is drawn, without aggregation (GROUP BY) and sorting (ORDER
BY).

Indeed, this is much better than the CROSS JOINS. But we can do even better, if
we consider cost.
Cost-Based Optimizer
Without going into database internals on how JOIN is implemented, let’s take
for granted that it makes a big difference which table is right and which is
left in the JOIN. (Simple explanation would be that the table on the right
basically needs to be kept in the memory while JOIN result is calculated).
Because of that, the following plans produce same result, but may have
different execution time or memory requirements.

CPU time, memory requirements and network bandwidth usage are the three
dimensions that contribute to query execution time, both in single query and
concurrent workloads. These dimensions are captured as the cost in Trino.
Our Data Scientist knows that most of the customers made at least one order and
every order had at least one item (and many orders had many items), so
lineitem is the biggest table, orders is medium and customer is the
smallest. When joining customer and orders, having orders on the right
side of the JOIN is not a good idea! However, how the planner can know that? In
the real world, the query planner cannot reliably deduce information just from
table names. This is where table statistics kick in.
Table statistics
Trino has connector-based
architecture. A
connector can provide table and column
statistics:
number of rows in a table,
number of distinct values in a column,
fraction of NULL values in a column,
minimum/maximum value in a column,
average data size for a column.
Of course, if some information is missing — e.g. average text length in a
varchar column is unknown — a connector can still provide other information and
Cost-Based Optimizer will be able to use that.
In our Data Scientist’s example, data sizes can look something like the
following:

Having this knowledge, Trino’s Cost-Based
Optimizer
will come up with completely different join ordering in the plan.

Filter statistics
As we saw, knowing the sizes of the tables involved in a query is fundamental
to properly reordering the joins in the query plan. However, knowing just the
sizes is not enough. Returning to our example, the Data Scientist might want to
drill down into results of their previous query, to know which customers
repeatedly bought and spent most money on a particular item (clearly, this must
be some consumable, or a mobile phone). For this, they will use almost
identical query as the original one, adding one more condition.

SELECT c.custkey, sum(l.price)
FROM customer c, orders o, lineitem l
WHERE c.custkey = o.custkey AND l.orderkey = o.orderkey
  AND l.item = 106170                              --- additional condition
GROUP BY c.custkey ORDER BY sum(l.price) DESC;


The additional FILTER might be applied after the JOIN or before. Obviously,
filtering as early as possible is the best strategy, but this also means the
actual size of the data involved in the JOIN will be different now. In our Data
Scientist’s example, the join order will indeed be different.

Under the Hood
Execution Time and Cost
From external perspective, only three things really matter:
execution time,
execution cost (in dollars),
ability to run (sufficiently) many concurrent queries at a time.
The execution time is often called “wall time” to emphasize that we’re not
really interested in “CPU time” or number of machines/nodes/threads involved.
Our Data Scientist’s clock on the wall is the ultimate judge. It would be nice
if they were not forced to get coffee/eat lunch during each query they run. On
the other hand, a CFO will be interested in keeping cluster costs at the lowest
possible level (without, of course, impeding employees’ effectiveness). Lastly,
a System Administrator needs to ensure that all cluster users can work at the
same time. That is, that the cluster can handle many queries at a time,
yielding enough throughput that “wall time” observed by each of the users is
satisfactory.

It is possible to optimize for only one of the above dimensions. For example,
we can have single node cluster and CFO will be happy (but employees will go
somewhere else). Contrarily, we may have thousand node cluster even if the
company cannot afford that. Users will be (initially) happy, until the company
goes bankrupt. Ultimately, however, we need to balance these trade-offs, which
basically means that queries need to be executed as fast as possible, with as
little resources as possible.
In Trino, this is modeled with the concept of the cost, which captures
properties like CPU cost, memory requirements and network bandwidth usage.
Different variants of a query execution plan are explored, assigned a cost and
compared. The variant with the least overall cost is selected for execution.
This approach neatly balances the needs of cluster users, administrators and
the CFO.
The cost of each operation in the query plan is calculated in a way appropriate
for the type of the operation, taking into account statistics of the data
involved in the operation. Now, let’s see where the statistics come from.
Statistics
In our Data Scientist’s example, the row counts for tables were taken directly
from table statistics, i.e. provided by a connector. But where did “~3K rows”
come from? Let’s dive into some nitty-gritty details.
A query execution plan is made of “building block” operations, including:
table scans (reading the table; at runtime this is actually combined with a
filter)
filters (SQL’s WHERE clause or any other conditions deduced by the query
planner)
projections (i.e. computing output expressions)
joins
aggregations (in fact there are a few different “building blocks” for
aggregations, but that’s a story for another time)
sorting (SQL’s ORDER BY)
limiting (SQL’s LIMIT)
sorting and limiting combined (SQL’s ORDER BY .. LIMIT .. deserves
specialized support)
and a lot more!
The way how the statistics are computed for most interesting “building blocks”
is discussed below.
Table Scan statistics

As explained in “Table statistics” section, the connector which defines the
table is responsible for providing the table statistics. Furthermore, the
connector will be informed about any filtering conditions that are to be
applied to the data read from the table. This may be important e.g. in the case
of Hive partitioned table, where statistics are stored on per-partition basis.
If the filtering condition excludes some (or many) partitions, the statistics
will consider smaller data set (remaining partitions) and will be more
accurate.
To recall, a connector can provide the following table and column statistics:
number of rows in a table,
number of distinct values in a column,
fraction of NULL values in a column,
minimum/maximum value in a column,
average data size for a column.
Filter statistics

When considering a filtering operation, a filter’s condition is analyzed and
the following estimations are calculated:
what is the probability that data row will pass the filtering condition. From
this, expected number of rows after the filter is derived,
fraction of NULL values for columns involved in the filtering condition (for
most conditions, this will simply be 0%),
number of distinct values for columns involved in the filtering condition,
number of distinct values for columns that were not part of the filtering
condition, if their original number of distinct values was more than the
expected number of data rows that pass the filter.
For example, for a condition like l.item = 106170 we can observe that:
no rows with l.item being NULL will meet the condition,
there will be only one distinct value of l.item (106170) after the
filtering operation,
on average, number of data rows expected to pass the filter will be equal to
number_of_input_rows * fraction_of_non_nulls / distinct_values. (This
assumes, of course, that users most often drill down in the data they really
have, which is quite a reasonable assumption and also safe to make).
Projection statistics

Projections (l.item – 1 AS iid) are similar to filters, except that, of
course, they do not impact the expected number of rows after the operation.
For a projection, the following types of column statistics are calculated (if
possible for given projection expression):
number of distinct values produced by the projection,
fraction of NULL values produced by the projection,
minimum/maximum value produced by the projection.
Naturally, if iid is only returned to the user, then these statistics are not
useful. However, if it’s later used in filter or join operation, these
statistics are important to correctly estimate the number of rows that meet the
filter condition or are returned from the join.
Conclusion
Summing up, Trino’s Cost-Based Optimizer is conceptually a very simple thing.
Alternative query plans are considered, the best plan is chosen and executed.
Details are not so simple, though. Fortunately, to use
Trino, one doesn’t need to know all these details.
Of course, anyone with a technical inclination that like to wander in database
internals is invited to study the Trino code!
Enabling Trino CBO is really simple:
set optimizer.join-reordering-strategy=AUTOMATIC and
join-distribution-type=AUTOMATIC in your config.properties,
analyze your tables,
no, there is no third step. That’s it!
Take Trino CBO for a spin today and let us know about your Trino
experience!
□
