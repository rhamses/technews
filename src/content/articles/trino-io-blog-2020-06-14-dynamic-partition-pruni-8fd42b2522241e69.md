---
title: "Dynamic partition pruning"
link: "https://trino.io/blog/2020/06/14/dynamic-partition-pruning.html"
guid: "https://trino.io/blog/2020/06/14/dynamic-partition-pruning.html"
pubDate: "2020-06-14T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Star-schema is one of the most widely used data mart patterns. \nThe star schema consists of fact tables (usually partitioned) and dimension tables, \nwhich are used to filter rows from fact tables.\nConsider the following query which captures a common pattern of a fact table store_sales partitioned by the column \nss_sold_date_sk joined with a filtered dimension table date_dim:\n\nSELECT COUNT(*) FROM \nstore_sales JOIN date_dim ON store_sales.ss_sold_date_sk = date_dim.d_date_sk\nWHERE d_following_holiday='Y' AND d_year = 2000;\n\n\nWithout dynamic filtering, Presto will push predicates for the dimension table to the table scan on date_dim but \nit will scan all the data in the fact table since there are no filters on store_sales in the query.\nThe join operator will end up throwing away most of the probe-side rows as the join criteria is highly selective. \nThe current implementation of dynamic filtering improves\non this, however it is limited only to broadcast joins on tables stored in ORC or Parquet format. \nAdditionally, it does not take advantage of the layout of partitioned Hive tables.\nWith dynamic partition pruning, which extends the current implementation of dynamic filtering, every worker node collects \nvalues eligible for the join from date_dim.d_date_sk column and passes it to the coordinator. \nCoordinator can then skip processing of the partitions of store_sales which don’t meet the join criteria. \nThis greatly reduces the amount of data scanned from store_sales table by worker nodes. \nThis optimization is applicable to any storage format and to both broadcast and partitioned join.\nDesign considerations\nThis optimization requires dynamic filters collected by worker nodes to be communicated to the coordinator over the network.\nWe needed to ensure that this additional communication overhead does not overload the coordinator.\nThis was achieved by packing dynamic filters into Presto’s existing framework for sending status updates from worker to coordinator.\nDynamicFilterService \nwas added on the coordinator node to perform dynamic filter collection asynchronously.\nQueries registered with this service can request dynamic filters while scheduling splits without blocking any operations.\nThis service is also responsible for ensuring that all the build-side tasks of a join stage have completed execution before \nconstructing dynamic filters to be used in the scheduling of probe-side table scans by the coordinator.\nImplementation\nFor identifying opportunities for dynamic filtering in the logical plan, we rely on the implementation added in\n#91. Dynamic filters are modeled as FunctionCall expressions which \nevaluate to a boolean value. They are created in the PredicatePushDown optimizer rule from the equi-join clauses of inner join \nnodes and pushed down in the plan along with other predicates. Dynamic filters are added to the plan after the cost-based \noptimization rules. This ensures that dynamic filters do not interfere with cost estimation and join reordering.\nThe PredicatePushDown rule can end up pushing dynamic filters to unsupported places in the plan via inferencing. \nThis was solved by adding the \nRemoveUnsupportedDynamicFilters\noptimizer rule which is responsible for ensuring that:\nDynamic filters are present only directly above a TableScan node and only if the subtree is on the probe side of some downstream JoinNode\nDynamic filters are removed from JoinNode if there is no consumer for it on its probe side subtree.\nWe also run DynamicFiltersChecker\nat the end of the planning phase to ensure that the above conditions have been satisfied by the optimized plan.\nWe reuse the existing DynamicFilterSourceOperator\nin LocalExecutionPlanner to collect build-side values from each inner join on each worker node. In addition to passing the collected TupleDomain\nto LocalDynamicFiltersCollector \nwithin the same worker node for use in broadcast join probe-side scans, we also pass them to TaskContext to populate task \nstatus updates for the coordinator.\nContinuousTaskStatusFetcher on the coordinator node pulls task status updates from all worker nodes up to every\ntask.status-refresh-max-wait seconds (default is 1 second) or less (if task status changes). DynamicFilterService \non the coordinator regularly polls for dynamic filters from task status updates through SqlQueryExecution and provides\nan interface to supply dynamic filters when they are ready. The ConnectorSplitManager#getSplits API has been updated to\noptionally utilize dynamic filters supplied by the DynamicFilterService.\nIn the Hive connector, BackgroundHiveSplitLoader can apply dynamic filtering by either completely skipping the listing\nof files within a partition, or by avoiding the creation of splits within a loaded partition if the dynamic filters \nbecome available in InternalHiveSplitFactory#createInternalHiveSplit due to lazy enumeration of splits.\nBenchmarks\nWe ran TPC-DS queries on 5 worker nodes cluster of r4.8xlarge machines using data stored in ORC format.\nTPC-DS tables were partitioned as:\ncatalog_returns on cr_returned_date_sk\ncatalog_sales on cs_sold_date_sk\nstore_returns on sr_returned_date_sk\nstore_sales on ss_sold_date_sk\nweb_returns on wr_returned_date_sk\nweb_sales on ws_sold_date_sk\ncreateAllORCTables.hql\nThe following queries ran faster by more than 20% with dynamic partition pruning (measuring the elapsed time in seconds,\n CPU time in minutes and Data read in MB).\nQuery\n      Baseline elapsed\n      Dynamic partition pruning elapsed\n      Baseline CPU\n      Dynamic partition pruning CPU\n      Baseline data read\n      Dynamic partition pruning data read\n    \nq01\n      10.96\n      8.50\n      10.2\n      8.9\n      17.91\n      14.53\n    \nq04\n      21.63\n      10.80\n      23.6\n      16.1\n      34.81\n      12.99\n    \nq05\n      41.38\n      14.94\n      57.1\n      16.8\n      54.81\n      11.45\n    \nq07\n      12.35\n      9.26\n      26.4\n      14.6\n      30.28\n      17.31\n    \nq08\n      10.48\n      6.43\n      11.0\n      4.7\n      10.19\n      3.52\n    \nq11\n      20.04\n      14.82\n      35.6\n      27.8\n      25.37\n      9.72\n    \nq17\n      24.05\n      9.87\n      26.4\n      12.0\n      30.18\n      9.75\n    \nq18\n      13.98\n      6.00\n      17.5\n      7.7\n      20.29\n      8.81\n    \nq25\n      18.91\n      8.04\n      26.9\n      9.1\n      37.54\n      11.12\n    \nq27\n      11.98\n      5.58\n      25.1\n      8.6\n      26.69\n      10.12\n    \nq29\n      24.11\n      15.46\n      30.5\n      18.5\n      30.18\n      13.50\n    \nq31\n      27.81\n      12.77\n      48.2\n      21.3\n      39.53\n      13.73\n    \nq32\n      11.51\n      8.15\n      12.7\n      10.3\n      15.05\n      12.76\n    \nq33\n      15.95\n      4.31\n      24.3\n      5.4\n      31.26\n      6.67\n    \nq35\n      15.10\n      5.22\n      13.8\n      6.2\n      4.83\n      1.70\n    \nq36\n      11.68\n      6.43\n      22.4\n      11.4\n      24.28\n      12.78\n    \nq38\n      21.08\n      16.20\n      39.4\n      31.6\n      5.65\n      3.15\n    \nq40\n      37.40\n      11.98\n      37.7\n      8.4\n      17.02\n      9.20\n    \nq46\n      11.57\n      9.06\n      24.4\n      17.3\n      18.51\n      14.19\n    \nq48\n      20.48\n      12.65\n      42.3\n      22.5\n      20.71\n      11.54\n    \nq49\n      26.69\n      16.01\n      38.8\n      12.0\n      68.67\n      30.57\n    \nq50\n      46.90\n      33.22\n      43.4\n      42.5\n      21.30\n      16.77\n    \nq54\n      43.05\n      11.39\n      27.5\n      14.8\n      17.71\n      11.52\n    \nq56\n      16.23\n      4.12\n      23.8\n      5.5\n      31.26\n      6.72\n    \nq60\n      16.39\n      6.02\n      25.1\n      6.6\n      31.26\n      7.42\n    \nq61\n      17.18\n      5.50\n      33.4\n      7.1\n      42.63\n      9.37\n    \nq66\n      13.67\n      6.59\n      19.1\n      8.9\n      19.63\n      8.34\n    \nq69\n      9.89\n      7.46\n      10.5\n      6.1\n      4.83\n      3.16\n    \nq71\n      17.32\n      6.11\n      23.3\n      6.6\n      31.26\n      8.06\n    \nq74\n      16.86\n      9.44\n      24.1\n      17.6\n      22.59\n      8.08\n    \nq75\n      122.04\n      69.45\n      102.7\n      62.9\n      110.86\n      63.91\n    \nq77\n      23.94\n      7.51\n      29.3\n      6.8\n      49.95\n      12.20\n    \nq80\n      43.46\n      18.57\n      45.8\n      11.5\n      37.25\n      11.78\n    \nq85\n      20.97\n      16.54\n      16.9\n      14.7\n      14.65\n      10.52\n    \n\n18 TPC-DS queries improved runtime by over 50% while decreasing CPU usage by an average of 64%.\nData read was decreased by 66%.\n7 TPC-DS queries improved between 30% to 50% while decreasing CPU usage by an average of 47%.\nData read was decreased by 54%.\n29 TPC-DS queries improved by 10% to 30% while decreasing CPU by an average of 20%.\nData read was decreased by 27%.\nNote that the baseline here includes the improvements from the existing \nnode local dynamic filtering implementation.\nDiscussion\nIn order for dynamic filtering to work, the smaller dimension table needs to be chosen as a join’s build side.\nCost-based optimizer can automatically do this using table statistics from the metastore.\nTherefore, we generated table statistics prior to running this benchmark and rely on the CBO to correctly choose\nthe smaller table on the build side of join.\nIt is quite common for large fact tables to be partitioned by dimensions like time.\nQueries joining such tables with filtered dimension tables benefit significantly from dynamic partition pruning. \nThis optimization is applicable to partitioned Hive tables stored in any data format.\nIt also works with both broadcast and partitioned joins. Other connectors can easily take advantage of dynamic filters \nby implementing the new ConnectorSplitManager#getSplits API which supplies dynamic filters to the connector.\nFuture work\nSupport for using min-max range in DynamicFilterSourceOperator when \nthe build-side contains too many values.\nPassing dynamic filters back to the worker nodes from coordinator \nto allow ORC and Parquet readers to use dynamic filters with partitioned joins.\nAllow connectors to block probe-side scan until dynamic filters are ready.\nSupport dynamic filtering with inequality operators\nSupport for semi-joins\nTake advantage of dynamic filters in connectors other than Hive."
author: "Raunaq Morarka, Qubole and Karol Sobczak, Starburst Data"
contentHtml: "<div>\n<article>\n  <div><p><a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Star_schema\">Star-schema</a> is one of the most widely used data mart patterns. \nThe star schema consists of fact tables (usually partitioned) and dimension tables, \nwhich are used to filter rows from fact tables.\nConsider the following query which captures a common pattern of a fact table <code>store_sales</code> partitioned by the column \n<code>ss_sold_date_sk</code> joined with a filtered dimension table <code>date_dim</code>:</p>\n<div><pre><code>SELECT COUNT(*) FROM \nstore_sales JOIN date_dim ON store_sales.ss_sold_date_sk = date_dim.d_date_sk\nWHERE d_following_holiday='Y' AND d_year = 2000;\n</code></pre></div>\n<p>Without dynamic filtering, Presto will push predicates for the dimension table to the table scan on <code>date_dim</code> but \nit will scan all the data in the fact table since there are no filters on <code>store_sales</code> in the query.\nThe join operator will end up throwing away most of the probe-side rows as the join criteria is highly selective. \nThe current implementation of <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/30/dynamic-filtering\">dynamic filtering</a> improves\non this, however it is limited only to broadcast joins on tables stored in ORC or Parquet format. \nAdditionally, it does not take advantage of the layout of partitioned Hive tables.</p>\n<p>With dynamic partition pruning, which extends the current implementation of dynamic filtering, every worker node collects \nvalues eligible for the join from <code>date_dim.d_date_sk</code> column and passes it to the coordinator. \nCoordinator can then skip processing of the partitions of <code>store_sales</code> which don’t meet the join criteria. \nThis greatly reduces the amount of data scanned from <code>store_sales</code> table by worker nodes. \nThis optimization is applicable to any storage format and to both broadcast and partitioned join.</p>\n<!--more-->\n<h2 id=\"design-considerations\">\n    Design considerations <a target=\"_blank\" href=\"https://trino.io/blog/2020/06/14/dynamic-partition-pruning.html#design-considerations\">#</a>\n</h2>\n<p>This optimization requires dynamic filters collected by worker nodes to be communicated to the coordinator over the network.\nWe needed to ensure that this additional communication overhead does not overload the coordinator.\nThis was achieved by packing dynamic filters into Presto’s existing framework for sending status updates from worker to coordinator.</p>\n<p><a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/server/DynamicFilterService.java\"><code>DynamicFilterService</code></a> \nwas added on the coordinator node to perform dynamic filter collection asynchronously.\nQueries registered with this service can request dynamic filters while scheduling splits without blocking any operations.\nThis service is also responsible for ensuring that all the build-side tasks of a join stage have completed execution before \nconstructing dynamic filters to be used in the scheduling of probe-side table scans by the coordinator.</p>\n<h2 id=\"implementation\">\n    Implementation <a target=\"_blank\" href=\"https://trino.io/blog/2020/06/14/dynamic-partition-pruning.html#implementation\">#</a>\n</h2>\n<p>For identifying opportunities for dynamic filtering in the logical plan, we rely on the implementation added in\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/91\">#91</a>. Dynamic filters are modeled as <code>FunctionCall</code> expressions which \nevaluate to a boolean value. They are created in the <code>PredicatePushDown</code> optimizer rule from the equi-join clauses of inner join \nnodes and pushed down in the plan along with other predicates. Dynamic filters are added to the plan after the cost-based \noptimization rules. This ensures that dynamic filters do not interfere with cost estimation and join reordering.\nThe <code>PredicatePushDown</code> rule can end up pushing dynamic filters to unsupported places in the plan via inferencing. \nThis was solved by adding the \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/sql/planner/iterative/rule/RemoveUnsupportedDynamicFilters.java\"><code>RemoveUnsupportedDynamicFilters</code></a>\noptimizer rule which is responsible for ensuring that:</p>\n<ul>\n  <li>Dynamic filters are present only directly above a <code>TableScan</code> node and only if the subtree is on the probe side of some downstream <code>JoinNode</code></li>\n  <li>Dynamic filters are removed from <code>JoinNode</code> if there is no consumer for it on its probe side subtree.</li>\n</ul>\n<p>We also run <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/sql/planner/sanity/DynamicFiltersChecker.java\"><code>DynamicFiltersChecker</code></a>\nat the end of the planning phase to ensure that the above conditions have been satisfied by the optimized plan.</p>\n<p>We reuse the existing <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/operator/DynamicFilterSourceOperator.java\"><code>DynamicFilterSourceOperator</code></a>\nin <code>LocalExecutionPlanner</code> to collect build-side values from each inner join on each worker node. In addition to passing the collected <code>TupleDomain</code>\nto <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/sql/planner/LocalDynamicFiltersCollector.java\"><code>LocalDynamicFiltersCollector</code></a> \nwithin the same worker node for use in broadcast join probe-side scans, we also pass them to <code>TaskContext</code> to populate task \nstatus updates for the coordinator.</p>\n<p><code>ContinuousTaskStatusFetcher</code> on the coordinator node pulls task status updates from all worker nodes up to every\n<code>task.status-refresh-max-wait</code> seconds (default is 1 second) or less (if task status changes). <code>DynamicFilterService</code> \non the coordinator regularly polls for dynamic filters from task status updates through <code>SqlQueryExecution</code> and provides\nan interface to supply dynamic filters when they are ready. The <code>ConnectorSplitManager#getSplits</code> API has been updated to\noptionally utilize dynamic filters supplied by the <code>DynamicFilterService</code>.</p>\n<p>In the Hive connector, <code>BackgroundHiveSplitLoader</code> can apply dynamic filtering by either completely skipping the listing\nof files within a partition, or by avoiding the creation of splits within a loaded partition if the dynamic filters \nbecome available in <code>InternalHiveSplitFactory#createInternalHiveSplit</code> due to lazy enumeration of splits.</p>\n<h2 id=\"benchmarks\">\n    Benchmarks <a target=\"_blank\" href=\"https://trino.io/blog/2020/06/14/dynamic-partition-pruning.html#benchmarks\">#</a>\n</h2>\n<p>We ran TPC-DS queries on 5 worker nodes cluster of r4.8xlarge machines using data stored in ORC format.\nTPC-DS tables were partitioned as:</p>\n<ul>\n  <li><code>catalog_returns</code> on <code>cr_returned_date_sk</code></li>\n  <li><code>catalog_sales</code> on <code>cs_sold_date_sk</code></li>\n  <li><code>store_returns</code> on <code>sr_returned_date_sk</code></li>\n  <li><code>store_sales</code> on <code>ss_sold_date_sk</code></li>\n  <li><code>web_returns</code> on <code>wr_returned_date_sk</code></li>\n  <li><code>web_sales</code> on <code>ws_sold_date_sk</code></li>\n</ul>\n<p><a target=\"_blank\" href=\"https://github.com/hdinsight/tpcds-hdinsight/blob/master/ddl/createAllORCTables.hql\">createAllORCTables.hql</a></p>\n<p>The following queries ran faster by more than 20% with dynamic partition pruning (measuring the elapsed time in seconds,\n CPU time in minutes and Data read in MB).</p>\n<table>\n  <thead>\n    <tr>\n      <th>Query</th>\n      <th>Baseline elapsed</th>\n      <th>Dynamic partition pruning elapsed</th>\n      <th>Baseline CPU</th>\n      <th>Dynamic partition pruning CPU</th>\n      <th>Baseline data read</th>\n      <th>Dynamic partition pruning data read</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>q01</td>\n      <td>10.96</td>\n      <td>8.50</td>\n      <td>10.2</td>\n      <td>8.9</td>\n      <td>17.91</td>\n      <td>14.53</td>\n    </tr>\n    <tr>\n      <td>q04</td>\n      <td>21.63</td>\n      <td>10.80</td>\n      <td>23.6</td>\n      <td>16.1</td>\n      <td>34.81</td>\n      <td>12.99</td>\n    </tr>\n    <tr>\n      <td>q05</td>\n      <td>41.38</td>\n      <td>14.94</td>\n      <td>57.1</td>\n      <td>16.8</td>\n      <td>54.81</td>\n      <td>11.45</td>\n    </tr>\n    <tr>\n      <td>q07</td>\n      <td>12.35</td>\n      <td>9.26</td>\n      <td>26.4</td>\n      <td>14.6</td>\n      <td>30.28</td>\n      <td>17.31</td>\n    </tr>\n    <tr>\n      <td>q08</td>\n      <td>10.48</td>\n      <td>6.43</td>\n      <td>11.0</td>\n      <td>4.7</td>\n      <td>10.19</td>\n      <td>3.52</td>\n    </tr>\n    <tr>\n      <td>q11</td>\n      <td>20.04</td>\n      <td>14.82</td>\n      <td>35.6</td>\n      <td>27.8</td>\n      <td>25.37</td>\n      <td>9.72</td>\n    </tr>\n    <tr>\n      <td>q17</td>\n      <td>24.05</td>\n      <td>9.87</td>\n      <td>26.4</td>\n      <td>12.0</td>\n      <td>30.18</td>\n      <td>9.75</td>\n    </tr>\n    <tr>\n      <td>q18</td>\n      <td>13.98</td>\n      <td>6.00</td>\n      <td>17.5</td>\n      <td>7.7</td>\n      <td>20.29</td>\n      <td>8.81</td>\n    </tr>\n    <tr>\n      <td>q25</td>\n      <td>18.91</td>\n      <td>8.04</td>\n      <td>26.9</td>\n      <td>9.1</td>\n      <td>37.54</td>\n      <td>11.12</td>\n    </tr>\n    <tr>\n      <td>q27</td>\n      <td>11.98</td>\n      <td>5.58</td>\n      <td>25.1</td>\n      <td>8.6</td>\n      <td>26.69</td>\n      <td>10.12</td>\n    </tr>\n    <tr>\n      <td>q29</td>\n      <td>24.11</td>\n      <td>15.46</td>\n      <td>30.5</td>\n      <td>18.5</td>\n      <td>30.18</td>\n      <td>13.50</td>\n    </tr>\n    <tr>\n      <td>q31</td>\n      <td>27.81</td>\n      <td>12.77</td>\n      <td>48.2</td>\n      <td>21.3</td>\n      <td>39.53</td>\n      <td>13.73</td>\n    </tr>\n    <tr>\n      <td>q32</td>\n      <td>11.51</td>\n      <td>8.15</td>\n      <td>12.7</td>\n      <td>10.3</td>\n      <td>15.05</td>\n      <td>12.76</td>\n    </tr>\n    <tr>\n      <td>q33</td>\n      <td>15.95</td>\n      <td>4.31</td>\n      <td>24.3</td>\n      <td>5.4</td>\n      <td>31.26</td>\n      <td>6.67</td>\n    </tr>\n    <tr>\n      <td>q35</td>\n      <td>15.10</td>\n      <td>5.22</td>\n      <td>13.8</td>\n      <td>6.2</td>\n      <td>4.83</td>\n      <td>1.70</td>\n    </tr>\n    <tr>\n      <td>q36</td>\n      <td>11.68</td>\n      <td>6.43</td>\n      <td>22.4</td>\n      <td>11.4</td>\n      <td>24.28</td>\n      <td>12.78</td>\n    </tr>\n    <tr>\n      <td>q38</td>\n      <td>21.08</td>\n      <td>16.20</td>\n      <td>39.4</td>\n      <td>31.6</td>\n      <td>5.65</td>\n      <td>3.15</td>\n    </tr>\n    <tr>\n      <td>q40</td>\n      <td>37.40</td>\n      <td>11.98</td>\n      <td>37.7</td>\n      <td>8.4</td>\n      <td>17.02</td>\n      <td>9.20</td>\n    </tr>\n    <tr>\n      <td>q46</td>\n      <td>11.57</td>\n      <td>9.06</td>\n      <td>24.4</td>\n      <td>17.3</td>\n      <td>18.51</td>\n      <td>14.19</td>\n    </tr>\n    <tr>\n      <td>q48</td>\n      <td>20.48</td>\n      <td>12.65</td>\n      <td>42.3</td>\n      <td>22.5</td>\n      <td>20.71</td>\n      <td>11.54</td>\n    </tr>\n    <tr>\n      <td>q49</td>\n      <td>26.69</td>\n      <td>16.01</td>\n      <td>38.8</td>\n      <td>12.0</td>\n      <td>68.67</td>\n      <td>30.57</td>\n    </tr>\n    <tr>\n      <td>q50</td>\n      <td>46.90</td>\n      <td>33.22</td>\n      <td>43.4</td>\n      <td>42.5</td>\n      <td>21.30</td>\n      <td>16.77</td>\n    </tr>\n    <tr>\n      <td>q54</td>\n      <td>43.05</td>\n      <td>11.39</td>\n      <td>27.5</td>\n      <td>14.8</td>\n      <td>17.71</td>\n      <td>11.52</td>\n    </tr>\n    <tr>\n      <td>q56</td>\n      <td>16.23</td>\n      <td>4.12</td>\n      <td>23.8</td>\n      <td>5.5</td>\n      <td>31.26</td>\n      <td>6.72</td>\n    </tr>\n    <tr>\n      <td>q60</td>\n      <td>16.39</td>\n      <td>6.02</td>\n      <td>25.1</td>\n      <td>6.6</td>\n      <td>31.26</td>\n      <td>7.42</td>\n    </tr>\n    <tr>\n      <td>q61</td>\n      <td>17.18</td>\n      <td>5.50</td>\n      <td>33.4</td>\n      <td>7.1</td>\n      <td>42.63</td>\n      <td>9.37</td>\n    </tr>\n    <tr>\n      <td>q66</td>\n      <td>13.67</td>\n      <td>6.59</td>\n      <td>19.1</td>\n      <td>8.9</td>\n      <td>19.63</td>\n      <td>8.34</td>\n    </tr>\n    <tr>\n      <td>q69</td>\n      <td>9.89</td>\n      <td>7.46</td>\n      <td>10.5</td>\n      <td>6.1</td>\n      <td>4.83</td>\n      <td>3.16</td>\n    </tr>\n    <tr>\n      <td>q71</td>\n      <td>17.32</td>\n      <td>6.11</td>\n      <td>23.3</td>\n      <td>6.6</td>\n      <td>31.26</td>\n      <td>8.06</td>\n    </tr>\n    <tr>\n      <td>q74</td>\n      <td>16.86</td>\n      <td>9.44</td>\n      <td>24.1</td>\n      <td>17.6</td>\n      <td>22.59</td>\n      <td>8.08</td>\n    </tr>\n    <tr>\n      <td>q75</td>\n      <td>122.04</td>\n      <td>69.45</td>\n      <td>102.7</td>\n      <td>62.9</td>\n      <td>110.86</td>\n      <td>63.91</td>\n    </tr>\n    <tr>\n      <td>q77</td>\n      <td>23.94</td>\n      <td>7.51</td>\n      <td>29.3</td>\n      <td>6.8</td>\n      <td>49.95</td>\n      <td>12.20</td>\n    </tr>\n    <tr>\n      <td>q80</td>\n      <td>43.46</td>\n      <td>18.57</td>\n      <td>45.8</td>\n      <td>11.5</td>\n      <td>37.25</td>\n      <td>11.78</td>\n    </tr>\n    <tr>\n      <td>q85</td>\n      <td>20.97</td>\n      <td>16.54</td>\n      <td>16.9</td>\n      <td>14.7</td>\n      <td>14.65</td>\n      <td>10.52</td>\n    </tr>\n  </tbody>\n</table>\n<p><img src=\"https://trino.io/assets/blog/dynamic-partition-pruning/benchmark.png\" alt=\"\"></p>\n<ul>\n  <li>18 TPC-DS queries improved runtime by over 50% while decreasing CPU usage by an average of 64%.\nData read was decreased by 66%.</li>\n  <li>7 TPC-DS queries improved between 30% to 50% while decreasing CPU usage by an average of 47%.\nData read was decreased by 54%.</li>\n  <li>29 TPC-DS queries improved by 10% to 30% while decreasing CPU by an average of 20%.\nData read was decreased by 27%.</li>\n</ul>\n<p>Note that the baseline here includes the improvements from the existing \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/1686\">node local dynamic filtering</a> implementation.</p>\n<h2 id=\"discussion\">\n    Discussion <a target=\"_blank\" href=\"https://trino.io/blog/2020/06/14/dynamic-partition-pruning.html#discussion\">#</a>\n</h2>\n<p>In order for dynamic filtering to work, the smaller dimension table needs to be chosen as a join’s build side.\nCost-based optimizer can automatically do this using table statistics from the metastore.\nTherefore, we generated table statistics prior to running this benchmark and rely on the CBO to correctly choose\nthe smaller table on the build side of join.</p>\n<p>It is quite common for large fact tables to be partitioned by dimensions like time.\nQueries joining such tables with filtered dimension tables benefit significantly from dynamic partition pruning. \nThis optimization is applicable to partitioned Hive tables stored in any data format.\nIt also works with both broadcast and partitioned joins. Other connectors can easily take advantage of dynamic filters \nby implementing the new <code>ConnectorSplitManager#getSplits</code> API which supplies dynamic filters to the connector.</p>\n<h2 id=\"future-work\">\n    Future work <a target=\"_blank\" href=\"https://trino.io/blog/2020/06/14/dynamic-partition-pruning.html#future-work\">#</a>\n</h2>\n<ul>\n  <li>Support for using <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/3871\">min-max range</a> in DynamicFilterSourceOperator when \nthe build-side contains too many values.</li>\n  <li><a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/3972\">Passing dynamic filters back to the worker nodes</a> from coordinator \nto allow ORC and Parquet readers to use dynamic filters with partitioned joins.</li>\n  <li>Allow connectors to <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/3414\">block probe-side scan</a> until dynamic filters are ready.</li>\n  <li><a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/2674\">Support dynamic filtering with inequality operators</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/2190\">Support for semi-joins</a></li>\n  <li>Take advantage of dynamic filters in connectors other than Hive.</li>\n</ul>\n  </div>\n</article>\n</div>"
---

Star-schema is one of the most widely used data mart patterns. 
The star schema consists of fact tables (usually partitioned) and dimension tables, 
which are used to filter rows from fact tables.
Consider the following query which captures a common pattern of a fact table store_sales partitioned by the column 
ss_sold_date_sk joined with a filtered dimension table date_dim:

SELECT COUNT(*) FROM 
store_sales JOIN date_dim ON store_sales.ss_sold_date_sk = date_dim.d_date_sk
WHERE d_following_holiday='Y' AND d_year = 2000;


Without dynamic filtering, Presto will push predicates for the dimension table to the table scan on date_dim but 
it will scan all the data in the fact table since there are no filters on store_sales in the query.
The join operator will end up throwing away most of the probe-side rows as the join criteria is highly selective. 
The current implementation of dynamic filtering improves
on this, however it is limited only to broadcast joins on tables stored in ORC or Parquet format. 
Additionally, it does not take advantage of the layout of partitioned Hive tables.
With dynamic partition pruning, which extends the current implementation of dynamic filtering, every worker node collects 
values eligible for the join from date_dim.d_date_sk column and passes it to the coordinator. 
Coordinator can then skip processing of the partitions of store_sales which don’t meet the join criteria. 
This greatly reduces the amount of data scanned from store_sales table by worker nodes. 
This optimization is applicable to any storage format and to both broadcast and partitioned join.
Design considerations
This optimization requires dynamic filters collected by worker nodes to be communicated to the coordinator over the network.
We needed to ensure that this additional communication overhead does not overload the coordinator.
This was achieved by packing dynamic filters into Presto’s existing framework for sending status updates from worker to coordinator.
DynamicFilterService 
was added on the coordinator node to perform dynamic filter collection asynchronously.
Queries registered with this service can request dynamic filters while scheduling splits without blocking any operations.
This service is also responsible for ensuring that all the build-side tasks of a join stage have completed execution before 
constructing dynamic filters to be used in the scheduling of probe-side table scans by the coordinator.
Implementation
For identifying opportunities for dynamic filtering in the logical plan, we rely on the implementation added in
#91. Dynamic filters are modeled as FunctionCall expressions which 
evaluate to a boolean value. They are created in the PredicatePushDown optimizer rule from the equi-join clauses of inner join 
nodes and pushed down in the plan along with other predicates. Dynamic filters are added to the plan after the cost-based 
optimization rules. This ensures that dynamic filters do not interfere with cost estimation and join reordering.
The PredicatePushDown rule can end up pushing dynamic filters to unsupported places in the plan via inferencing. 
This was solved by adding the 
RemoveUnsupportedDynamicFilters
optimizer rule which is responsible for ensuring that:
Dynamic filters are present only directly above a TableScan node and only if the subtree is on the probe side of some downstream JoinNode
Dynamic filters are removed from JoinNode if there is no consumer for it on its probe side subtree.
We also run DynamicFiltersChecker
at the end of the planning phase to ensure that the above conditions have been satisfied by the optimized plan.
We reuse the existing DynamicFilterSourceOperator
in LocalExecutionPlanner to collect build-side values from each inner join on each worker node. In addition to passing the collected TupleDomain
to LocalDynamicFiltersCollector 
within the same worker node for use in broadcast join probe-side scans, we also pass them to TaskContext to populate task 
status updates for the coordinator.
ContinuousTaskStatusFetcher on the coordinator node pulls task status updates from all worker nodes up to every
task.status-refresh-max-wait seconds (default is 1 second) or less (if task status changes). DynamicFilterService 
on the coordinator regularly polls for dynamic filters from task status updates through SqlQueryExecution and provides
an interface to supply dynamic filters when they are ready. The ConnectorSplitManager#getSplits API has been updated to
optionally utilize dynamic filters supplied by the DynamicFilterService.
In the Hive connector, BackgroundHiveSplitLoader can apply dynamic filtering by either completely skipping the listing
of files within a partition, or by avoiding the creation of splits within a loaded partition if the dynamic filters 
become available in InternalHiveSplitFactory#createInternalHiveSplit due to lazy enumeration of splits.
Benchmarks
We ran TPC-DS queries on 5 worker nodes cluster of r4.8xlarge machines using data stored in ORC format.
TPC-DS tables were partitioned as:
catalog_returns on cr_returned_date_sk
catalog_sales on cs_sold_date_sk
store_returns on sr_returned_date_sk
store_sales on ss_sold_date_sk
web_returns on wr_returned_date_sk
web_sales on ws_sold_date_sk
createAllORCTables.hql
The following queries ran faster by more than 20% with dynamic partition pruning (measuring the elapsed time in seconds,
 CPU time in minutes and Data read in MB).
Query
      Baseline elapsed
      Dynamic partition pruning elapsed
      Baseline CPU
      Dynamic partition pruning CPU
      Baseline data read
      Dynamic partition pruning data read
    
q01
      10.96
      8.50
      10.2
      8.9
      17.91
      14.53
    
q04
      21.63
      10.80
      23.6
      16.1
      34.81
      12.99
    
q05
      41.38
      14.94
      57.1
      16.8
      54.81
      11.45
    
q07
      12.35
      9.26
      26.4
      14.6
      30.28
      17.31
    
q08
      10.48
      6.43
      11.0
      4.7
      10.19
      3.52
    
q11
      20.04
      14.82
      35.6
      27.8
      25.37
      9.72
    
q17
      24.05
      9.87
      26.4
      12.0
      30.18
      9.75
    
q18
      13.98
      6.00
      17.5
      7.7
      20.29
      8.81
    
q25
      18.91
      8.04
      26.9
      9.1
      37.54
      11.12
    
q27
      11.98
      5.58
      25.1
      8.6
      26.69
      10.12
    
q29
      24.11
      15.46
      30.5
      18.5
      30.18
      13.50
    
q31
      27.81
      12.77
      48.2
      21.3
      39.53
      13.73
    
q32
      11.51
      8.15
      12.7
      10.3
      15.05
      12.76
    
q33
      15.95
      4.31
      24.3
      5.4
      31.26
      6.67
    
q35
      15.10
      5.22
      13.8
      6.2
      4.83
      1.70
    
q36
      11.68
      6.43
      22.4
      11.4
      24.28
      12.78
    
q38
      21.08
      16.20
      39.4
      31.6
      5.65
      3.15
    
q40
      37.40
      11.98
      37.7
      8.4
      17.02
      9.20
    
q46
      11.57
      9.06
      24.4
      17.3
      18.51
      14.19
    
q48
      20.48
      12.65
      42.3
      22.5
      20.71
      11.54
    
q49
      26.69
      16.01
      38.8
      12.0
      68.67
      30.57
    
q50
      46.90
      33.22
      43.4
      42.5
      21.30
      16.77
    
q54
      43.05
      11.39
      27.5
      14.8
      17.71
      11.52
    
q56
      16.23
      4.12
      23.8
      5.5
      31.26
      6.72
    
q60
      16.39
      6.02
      25.1
      6.6
      31.26
      7.42
    
q61
      17.18
      5.50
      33.4
      7.1
      42.63
      9.37
    
q66
      13.67
      6.59
      19.1
      8.9
      19.63
      8.34
    
q69
      9.89
      7.46
      10.5
      6.1
      4.83
      3.16
    
q71
      17.32
      6.11
      23.3
      6.6
      31.26
      8.06
    
q74
      16.86
      9.44
      24.1
      17.6
      22.59
      8.08
    
q75
      122.04
      69.45
      102.7
      62.9
      110.86
      63.91
    
q77
      23.94
      7.51
      29.3
      6.8
      49.95
      12.20
    
q80
      43.46
      18.57
      45.8
      11.5
      37.25
      11.78
    
q85
      20.97
      16.54
      16.9
      14.7
      14.65
      10.52
    

18 TPC-DS queries improved runtime by over 50% while decreasing CPU usage by an average of 64%.
Data read was decreased by 66%.
7 TPC-DS queries improved between 30% to 50% while decreasing CPU usage by an average of 47%.
Data read was decreased by 54%.
29 TPC-DS queries improved by 10% to 30% while decreasing CPU by an average of 20%.
Data read was decreased by 27%.
Note that the baseline here includes the improvements from the existing 
node local dynamic filtering implementation.
Discussion
In order for dynamic filtering to work, the smaller dimension table needs to be chosen as a join’s build side.
Cost-based optimizer can automatically do this using table statistics from the metastore.
Therefore, we generated table statistics prior to running this benchmark and rely on the CBO to correctly choose
the smaller table on the build side of join.
It is quite common for large fact tables to be partitioned by dimensions like time.
Queries joining such tables with filtered dimension tables benefit significantly from dynamic partition pruning. 
This optimization is applicable to partitioned Hive tables stored in any data format.
It also works with both broadcast and partitioned joins. Other connectors can easily take advantage of dynamic filters 
by implementing the new ConnectorSplitManager#getSplits API which supplies dynamic filters to the connector.
Future work
Support for using min-max range in DynamicFilterSourceOperator when 
the build-side contains too many values.
Passing dynamic filters back to the worker nodes from coordinator 
to allow ORC and Parquet readers to use dynamic filters with partitioned joins.
Allow connectors to block probe-side scan until dynamic filters are ready.
Support dynamic filtering with inequality operators
Support for semi-joins
Take advantage of dynamic filters in connectors other than Hive.
