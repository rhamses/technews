---
title: "Faster Queries on Nested Data"
link: "https://trino.io/blog/2020/08/14/dereference-pushdown.html"
guid: "https://trino.io/blog/2020/08/14/dereference-pushdown.html"
pubDate: "2020-08-14T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Presto 334\nadds significant performance improvements for queries\naccessing nested fields inside struct columns. They have been optimized through\nthe pushdown of dereference expressions. With this feature, the query execution\nprunes structural data eagerly, extracting the necessary fields.\nMotivation\nRowType is a built-in data type of Presto, storing the in-memory\nrepresentation of commonly used nested data types of the connectors, eg.\nSTRUCT type in Hive. Datasets often contain wide and deeply nested structural\ncolumns, i.e. a struct column having hundreds of fields, with the fields being\nnested themselves.\nAlthough such RowType columns can contain plenty of data, most of the\nanalytical queries access just a few fields out of it. Without dereference\npushdown, Presto scans the whole column, and shuffles all that data around\nbefore projecting the necessary fields. This suboptimal execution causes higher\nCPU usage, higher memory usage and higher query latencies, than required. The\nunnecessary operations get even more expensive with wider/deeper structs and\nmore complex query plans.\nLinkedIn’s data ecosystem makes heavy usage of nested columns. It is common to\nhave 2-3 levels of nesting, and up to 50 fields in most of our tracking tables.\nBecause of the query execution inefficiency for nested fields, ETL pipelines\nwere set up at LinkedIn to copy the nested columns as a set of top-level columns\n corresponding to subfields. This step added overhead in our ingestion process\nand delayed data availability for analytics. It also caused ORC schemas to be\ninconsistent with the rest of the infrastructure, making it harder to migrate\nfrom existing flows on row-oriented formats.\nSimilarly, Lyft’s schemas make heavy use of nested data to decompose a ride\ninto its routes, riders, segments, modes, and geo-coordinates. Prior to the\nperformance improvements, analytical queries would either need to be run on\nclusters with very long timeouts, or the data would have to be flattened before\nbeing analyzed, adding an extra ETL step. Not only would this be costly, it\nwould also cause the original schema to diverge in our data warehouse making it\nmore difficult for data scientists to understand.\nThe dereference pushdown optimization in Presto is having a massive impact on\nthe ingestion story at both LinkedIn and Lyft. Nested data is now being made\navailable faster for consumption with a consistency of structure across all\nstores, while maintaining performance parity for analytical queries.\nExample\nSay we have a Hive table jobs, with a struct-typed column job_info in the\nschema. The column job_info is wide and deeply nested, i.e. ROW(company\nvarchar, requirements ROW(skills array(...), education ROW(...), salary ...) ,\n...). Most queries would access a small percentage of data from this struct\nusing the dereference projection (the . operation). Consider such a query Q\nbelow.\n\nSELECT A.appid id, J.job_info.company c\nFROM applications A JOIN jobs J\nON A.jobid = J.jobid\nLIMIT 100\n\n\nIt should suffice to scan only one field company from J.job_info for\nexecuting this query. But, without dereference pushdown, Presto scans and\nshuffles everything from job_info, only to project a single field at the end.\n\nSolution: Pushdown of Dereference Expressions\nWith dereference pushdown, Presto optimizes queries by extracting the sufficient\n fields from a ROW as early as possible. This is enforced by modifying the\nquery plan through a set of optimizers, and can be broadly divided into two\nparts.\nFirst, dereference projections are extracted in the query plan and pushed as\nclose to the table scan as possible. This happens independent of what the\nconnector is. Secondly, there is a further improvement for Hive tables. The\nHive Connector and ORC/Parquet readers have been optimized to scan only the\nsufficient subfield columns.\nPushdown of predicates on the subfields is also a crucial optimization. For\nexample, if a query has filters on subfields (i.e. a.b > 5), they should be\nutilized by ORC/Parquet readers while scanning files. The pushdown helps with\nthe pruning of files, stripes and row-groups based on column-level statistics.\nThis optimization is achieved as a byproduct of the above two optimizations.\nWith the dereference pushdown, queries observe significant performance gains in\nterms of CPU/memory usage and query runtime, roughly proportional to the\nrelative size of nested columns compared to the accessed fields.\nPushdown in Query Plan\nThe goal here is to execute dereference projections as early as possible. This\nusually means performing them right after the table scans.\nA projection operation that performs dereferencing on input symbols (i.e.\njob_info.company) reduces the amount of data going up the plan tree. Pushing\ndereference projections down means that we are pruning data early. It reduces\nthe amount of data being processed and shuffled in query execution. For the\nexample query Q, the query plan looks like the following when dereference\npushdown is enabled.\n\nThe projection job_info.company now directly follows the scan of jobs table,\n avoiding the propagation the job_info through Limit and Join nodes. Note\nthat all of job_info is still being scanned, and pruning it in the reader\nrequires connector-dependent optimizations.\nPushdown in the Hive Connector\nIn columnar formats like ORC and Parquet, the data is laid out in a columnar\nfashion even for subfields. If we have a column STRUCT(f1, f2, f3), the\nsubfields f1, f2 and f3 are stored as independent columns. An optimized\nquery engine should only scan the required fields through its ORC reader,\nskipping the rest. This optimization has been added for Hive connector.\nDereference projections above a TableScanNode are pushed down in the Hive\nconnector as “virtual” (or “projected”) columns. The query plan is modified to\nrefer to these new columns. For the query Q, jobs table would be scanned\ndifferently with this optimization, as shown below. The projection is now\nembedded in the Hive connector. Here, job_info#company can be thought of as\na virtual column representing the subfield job_info.company.\n\nThe Hive connector handles the projections before returning columns to Presto’s\nengine. It provides the required virtual columns to format-specific readers.\nORC and Parquet readers optimize their scans based on subfields required,\nincreasing their read throughput. Subfield pruning is not possible for\nrow-oriented format readers (e.g. AVRO). For them, Hive connector performs\nadaptation to project the required fields.\nPushdown of Predicates on Subfields\nColumnar formats store per-column statistics in the data files, which can be\nused by the readers for filtering. eg. if a query contains filter y = 5 for a\ntop-level column y, Presto’s ORC reader can skip ORC stripes and files by\nlooking at the upper and lower bounds for y in the statistics.\nThe same concept of predicate-based pruning can work for filters involving\nsubfields, since the statistics are also stored for subfield columns. i.e.\nPresto’s ORC/Parquet reader should be able to filter based on a constraint like\nx.f1 = 5 for more optimal scans. Good news! In the final optimized plan,\npredicates on a subfield are pushed down to the hive connector as a constraint\non the corresponding virtual column, and later used for optimizing the scan.\nThe complete logic is a bit complicated to explain here, but can be illustrated\nthrough the following example.\nGiven an initial plan with a predicate on a dereferenced field (x.f1 = 5), a\nchain of optimizers transform it to a more optimal plan with reader-level\npredicates. In the future, the same optimization will be added to the Parquet\nreader.\n\nIn the final plan, Hive connector knows to scan the column y and the subfield\nx.f1. It also takes advantage of the “virtual” column constraint x#f1 = 5\nfor reader-level pruning.\nPerformance Improvement\nDereference pushdown improves performance for queries accessing nested fields\nin multiple ways. First, it increases the read throughput for table scans,\nreducing the CPU time. The pruning of fields during the scan also means lesser\ndata to process for all downstream operators and tasks. So the early\nprojections result in more optimal execution for any operations that involve\nshuffle or copy of data. Moreover, for ORC/Parquet, the read performance\nimproves in the case of selective filters on subfields.\nBelow are some experimental results on a production dataset at LinkedIn which\ncontains 3 STRUCT columns, having ~20-30 small subfields in each. The\nexample queries used in the analysis access only a few subfields. The queries\nhave been listed as their approximate query shape for the sake of brevity. The\nplots compare CPU usage, peak memory usage and averaged query wall time.\n\n      \n    \n\nCPU usage and peak memory usage show orders-of-magnitude improvement in\npresence of dereference pushdown. Query wall times also reduce considerably,\nand this improvement is more drastic for the relatively complex JOIN query,\nas expected.\nPlease note that these are not benchmarks! The performance improvement you’ll\nsee will vary depending on how many columns are contained in your nested data\nversus how many you’ve referenced. At Lyft we saw improvements of 50x for some\nqueries!\nFuture Work\nThe pushdown of dereference expressions can be extended to arrays. i.e.\ndereference operations applied after unnesting an array should also get pushed\ndown to the readers. For example, using our jobs table from before, our\njobs.job_info structure may contain a repeating structure such as\nrequired_skills. With the following query, the entire required_skills\nstructure would be read even though only a small part of it is being referenced.\n\nSELECT S.description\nFROM jobs J\nCROSS JOIN UNNEST (job_info.required_skills) S\nWHERE S.years_of_experience >= 2\n\n\nThe work for this improvement is being tracked in this issue.\nSimilar to Hive Connector, connector-level dereference pushdown can be extended\nto other connectors supporting nested types.\nAnother future improvement will be the pushdown of predicates on subfields for\ndata stored in Parquet format. Although the pruning of nested fields occurs\nwith Parquet, the predicates are not yet pushed down into the reader.\nConclusion\nPushing down dereference operations in the query provides massive performance\ngains, especially while operating on large structs. At LinkedIn and Lyft, this\nfeature has shown great impact for analytical queries on nested datasets.\nWe’re excited for the Presto community to try it out. Feel free to dig into\nthis github issue for\ntechnical details. Please reach out to us on Slack for further\ndisucssions or reporting issues."
author: "Pratham Desai (LinkedIn), James Taylor (Lyft)"
contentHtml: "<div>\n<article>\n  <div><p><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-334.html\">Presto 334</a>\nadds significant performance improvements for queries\naccessing nested fields inside struct columns. They have been optimized through\nthe pushdown of dereference expressions. With this feature, the query execution\nprunes structural data eagerly, extracting the necessary fields.</p>\n<h2 id=\"motivation\">\n    Motivation <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#motivation\">#</a>\n</h2>\n<p><code>RowType</code> is a built-in data type of Presto, storing the in-memory\nrepresentation of commonly used nested data types of the connectors, eg.\n<code>STRUCT</code> type in Hive. Datasets often contain wide and deeply nested structural\ncolumns, i.e. a struct column having hundreds of fields, with the fields being\nnested themselves.</p>\n<p>Although such <code>RowType</code> columns can contain plenty of data, most of the\nanalytical queries access just a few fields out of it. Without dereference\npushdown, Presto scans the whole column, and shuffles all that data around\nbefore projecting the necessary fields. This suboptimal execution causes higher\nCPU usage, higher memory usage and higher query latencies, than required. The\nunnecessary operations get even more expensive with wider/deeper structs and\nmore complex query plans.</p>\n<p>LinkedIn’s data ecosystem makes heavy usage of nested columns. It is common to\nhave 2-3 levels of nesting, and up to 50 fields in most of our tracking tables.\nBecause of the query execution inefficiency for nested fields, ETL pipelines\nwere set up at LinkedIn to copy the nested columns as a set of top-level columns\n corresponding to subfields. This step added overhead in our ingestion process\nand delayed data availability for analytics. It also caused ORC schemas to be\ninconsistent with the rest of the infrastructure, making it harder to migrate\nfrom existing flows on row-oriented formats.</p>\n<p>Similarly, Lyft’s schemas make heavy use of nested data to decompose a ride\ninto its routes, riders, segments, modes, and geo-coordinates. Prior to the\nperformance improvements, analytical queries would either need to be run on\nclusters with very long timeouts, or the data would have to be flattened before\nbeing analyzed, adding an extra ETL step. Not only would this be costly, it\nwould also cause the original schema to diverge in our data warehouse making it\nmore difficult for data scientists to understand.</p>\n<p>The dereference pushdown optimization in Presto is having a massive impact on\nthe ingestion story at both LinkedIn and Lyft. Nested data is now being made\navailable faster for consumption with a consistency of structure across all\nstores, while maintaining performance parity for analytical queries.</p>\n<h2 id=\"example\">\n    Example <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#example\">#</a>\n</h2>\n<p>Say we have a Hive table <code>jobs</code>, with a struct-typed column <code>job_info</code> in the\nschema. The column <code>job_info</code> is wide and deeply nested, i.e. <code>ROW(company\nvarchar, requirements ROW(skills array(...), education ROW(...), salary ...) ,\n...)</code>. Most queries would access a small percentage of data from this struct\nusing the dereference projection (the <code>.</code> operation). Consider such a query <code>Q</code>\nbelow.</p>\n<div><pre><code><span>SELECT</span> <span>A</span><span>.</span><span>appid</span> <span>id</span><span>,</span> <span>J</span><span>.</span><span>job_info</span><span>.</span><span>company</span> <span>c</span>\n<span>FROM</span> <span>applications</span> <span>A</span> <span>JOIN</span> <span>jobs</span> <span>J</span>\n<span>ON</span> <span>A</span><span>.</span><span>jobid</span> <span>=</span> <span>J</span><span>.</span><span>jobid</span>\n<span>LIMIT</span> <span>100</span>\n</code></pre></div>\n<p>It should suffice to scan only one field <code>company</code> from <code>J.job_info</code> for\nexecuting this query. But, without dereference pushdown, Presto scans and\nshuffles everything from <code>job_info</code>, only to project a single field at the end.</p>\n<p><img src=\"https://trino.io/assets/blog/dereference-pushdown/original_plan.png\" alt=\"\"></p>\n<h2 id=\"solution-pushdown-of-dereference-expressions\">\n    Solution: Pushdown of Dereference Expressions <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#solution-pushdown-of-dereference-expressions\">#</a>\n</h2>\n<p>With dereference pushdown, Presto optimizes queries by extracting the sufficient\n fields from a <code>ROW</code> as early as possible. This is enforced by modifying the\nquery plan through a set of optimizers, and can be broadly divided into two\nparts.</p>\n<p>First, dereference projections are extracted in the query plan and pushed as\nclose to the table scan as possible. This happens independent of what the\nconnector is. Secondly, there is a further improvement for Hive tables. The\nHive Connector and ORC/Parquet readers have been optimized to scan only the\nsufficient subfield columns.</p>\n<p>Pushdown of predicates on the subfields is also a crucial optimization. For\nexample, if a query has filters on subfields (i.e. <code>a.b &gt; 5</code>), they should be\nutilized by ORC/Parquet readers while scanning files. The pushdown helps with\nthe pruning of files, stripes and row-groups based on column-level statistics.\nThis optimization is achieved as a byproduct of the above two optimizations.</p>\n<p>With the dereference pushdown, queries observe significant performance gains in\nterms of CPU/memory usage and query runtime, roughly proportional to the\nrelative size of nested columns compared to the accessed fields.</p>\n<h2 id=\"pushdown-in-query-plan\">\n    Pushdown in Query Plan <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#pushdown-in-query-plan\">#</a>\n</h2>\n<p>The goal here is to execute dereference projections as early as possible. This\nusually means performing them right after the table scans.</p>\n<p>A projection operation that performs dereferencing on input symbols (i.e.\n<code>job_info.company</code>) reduces the amount of data going up the plan tree. Pushing\ndereference projections down means that we are pruning data early. It reduces\nthe amount of data being processed and shuffled in query execution. For the\nexample query <code>Q</code>, the query plan looks like the following when dereference\npushdown is enabled.</p>\n<p><img src=\"https://trino.io/assets/blog/dereference-pushdown/transformed_plan.png\" alt=\"\"></p>\n<p>The projection <code>job_info.company</code> now directly follows the scan of <code>jobs</code> table,\n avoiding the propagation the <code>job_info</code> through <code>Limit</code> and <code>Join</code> nodes. Note\nthat all of <code>job_info</code> is still being scanned, and pruning it in the reader\nrequires connector-dependent optimizations.</p>\n<h2 id=\"pushdown-in-the-hive-connector\">\n    Pushdown in the Hive Connector <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#pushdown-in-the-hive-connector\">#</a>\n</h2>\n<p>In columnar formats like ORC and Parquet, the data is laid out in a columnar\nfashion even for subfields. If we have a column <code>STRUCT(f1, f2, f3)</code>, the\nsubfields <code>f1</code>, <code>f2</code> and <code>f3</code> are stored as independent columns. An optimized\nquery engine should only scan the required fields through its ORC reader,\nskipping the rest. This optimization has been added for Hive connector.</p>\n<p>Dereference projections above a <code>TableScanNode</code> are pushed down in the Hive\nconnector as “virtual” (or “projected”) columns. The query plan is modified to\nrefer to these new columns. For the query <code>Q</code>, <code>jobs</code> table would be scanned\ndifferently with this optimization, as shown below. The projection is now\nembedded in the Hive connector. Here, <code>job_info#company</code> can be thought of as\na virtual column representing the subfield <code>job_info.company</code>.</p>\n<p><img src=\"https://trino.io/assets/blog/dereference-pushdown/connector_pushdown.png\" alt=\"\"></p>\n<p>The Hive connector handles the projections before returning columns to Presto’s\nengine. It provides the required virtual columns to format-specific readers.\nORC and Parquet readers optimize their scans based on subfields required,\nincreasing their read throughput. Subfield pruning is not possible for\nrow-oriented format readers (e.g. AVRO). For them, Hive connector performs\nadaptation to project the required fields.</p>\n<h2 id=\"pushdown-of-predicates-on-subfields\">\n    Pushdown of Predicates on Subfields <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#pushdown-of-predicates-on-subfields\">#</a>\n</h2>\n<p>Columnar formats store per-column statistics in the data files, which can be\nused by the readers for filtering. eg. if a query contains filter <code>y = 5</code> for a\ntop-level column <code>y</code>, Presto’s ORC reader can skip ORC stripes and files by\nlooking at the upper and lower bounds for <code>y</code> in the statistics.</p>\n<p>The same concept of predicate-based pruning can work for filters involving\nsubfields, since the statistics are also stored for subfield columns. i.e.\nPresto’s ORC/Parquet reader should be able to filter based on a constraint like\n<code>x.f1 = 5</code> for more optimal scans. Good news! In the final optimized plan,\npredicates on a subfield are pushed down to the hive connector as a constraint\non the corresponding virtual column, and later used for optimizing the scan.\nThe complete logic is a bit complicated to explain here, but can be illustrated\nthrough the following example.</p>\n<p>Given an initial plan with a predicate on a dereferenced field (<code>x.f1 = 5</code>), a\nchain of optimizers transform it to a more optimal plan with reader-level\npredicates. In the future, the same optimization will be added to the Parquet\nreader.</p>\n<p><img src=\"https://trino.io/assets/blog/dereference-pushdown/predicate_pushdown.png\" alt=\"\"></p>\n<p>In the final plan, Hive connector knows to scan the column <code>y</code> and the subfield\n<code>x.f1</code>. It also takes advantage of the “virtual” column constraint <code>x#f1 = 5</code>\nfor reader-level pruning.</p>\n<h2 id=\"performance-improvement\">\n    Performance Improvement <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#performance-improvement\">#</a>\n</h2>\n<p>Dereference pushdown improves performance for queries accessing nested fields\nin multiple ways. First, it increases the read throughput for table scans,\nreducing the CPU time. The pruning of fields during the scan also means lesser\ndata to process for all downstream operators and tasks. So the early\nprojections result in more optimal execution for any operations that involve\nshuffle or copy of data. Moreover, for ORC/Parquet, the read performance\nimproves in the case of selective filters on subfields.</p>\n<p>Below are some experimental results on a production dataset at LinkedIn which\ncontains 3 <code>STRUCT</code> columns, having ~20-30 small subfields in each. The\nexample queries used in the analysis access only a few subfields. The queries\nhave been listed as their approximate query shape for the sake of brevity. The\nplots compare CPU usage, peak memory usage and averaged query wall time.</p>\n<p><img src=\"https://trino.io/assets/blog/dereference-pushdown/runtime_perf.png\" alt=\"\"></p>\n<p>CPU usage and peak memory usage show orders-of-magnitude improvement in\npresence of dereference pushdown. Query wall times also reduce considerably,\nand this improvement is more drastic for the relatively complex <code>JOIN</code> query,\nas expected.</p>\n<p>Please note that these are not benchmarks! The performance improvement you’ll\nsee will vary depending on how many columns are contained in your nested data\nversus how many you’ve referenced. At Lyft we saw improvements of <code>50x</code> for some\nqueries!</p>\n<h2 id=\"future-work\">\n    Future Work <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#future-work\">#</a>\n</h2>\n<p>The pushdown of dereference expressions can be extended to arrays. i.e.\ndereference operations applied after unnesting an array should also get pushed\ndown to the readers. For example, using our jobs table from before, our\n<code>jobs.job_info</code> structure may contain a repeating structure such as\n<code>required_skills</code>. With the following query, the entire required_skills\nstructure would be read even though only a small part of it is being referenced.</p>\n<div><pre><code><span>SELECT</span> <span>S</span><span>.</span><span>description</span>\n<span>FROM</span> <span>jobs</span> <span>J</span>\n<span>CROSS</span> <span>JOIN</span> <span>UNNEST</span> <span>(</span><span>job_info</span><span>.</span><span>required_skills</span><span>)</span> <span>S</span>\n<span>WHERE</span> <span>S</span><span>.</span><span>years_of_experience</span> <span>&gt;=</span> <span>2</span>\n</code></pre></div>\n<p>The work for this improvement is being tracked in <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/3925\">this issue</a>.</p>\n<p>Similar to Hive Connector, connector-level dereference pushdown can be extended\nto other connectors supporting nested types.</p>\n<p>Another future improvement will be the pushdown of predicates on subfields for\ndata stored in Parquet format. Although the pruning of nested fields occurs\nwith Parquet, the predicates are not yet pushed down into the reader.</p>\n<h2 id=\"conclusion\">\n    Conclusion <a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown.html#conclusion\">#</a>\n</h2>\n<p>Pushing down dereference operations in the query provides massive performance\ngains, especially while operating on large structs. At LinkedIn and Lyft, this\nfeature has shown great impact for analytical queries on nested datasets.</p>\n<p>We’re excited for the Presto community to try it out. Feel free to dig into\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/1953\">this github issue</a> for\ntechnical details. Please reach out to us on <a target=\"_blank\" href=\"https://trino.io/slack\">Slack</a> for further\ndisucssions or reporting issues.</p>\n  </div>\n</article>\n</div>"
---

Presto 334
adds significant performance improvements for queries
accessing nested fields inside struct columns. They have been optimized through
the pushdown of dereference expressions. With this feature, the query execution
prunes structural data eagerly, extracting the necessary fields.
Motivation
RowType is a built-in data type of Presto, storing the in-memory
representation of commonly used nested data types of the connectors, eg.
STRUCT type in Hive. Datasets often contain wide and deeply nested structural
columns, i.e. a struct column having hundreds of fields, with the fields being
nested themselves.
Although such RowType columns can contain plenty of data, most of the
analytical queries access just a few fields out of it. Without dereference
pushdown, Presto scans the whole column, and shuffles all that data around
before projecting the necessary fields. This suboptimal execution causes higher
CPU usage, higher memory usage and higher query latencies, than required. The
unnecessary operations get even more expensive with wider/deeper structs and
more complex query plans.
LinkedIn’s data ecosystem makes heavy usage of nested columns. It is common to
have 2-3 levels of nesting, and up to 50 fields in most of our tracking tables.
Because of the query execution inefficiency for nested fields, ETL pipelines
were set up at LinkedIn to copy the nested columns as a set of top-level columns
 corresponding to subfields. This step added overhead in our ingestion process
and delayed data availability for analytics. It also caused ORC schemas to be
inconsistent with the rest of the infrastructure, making it harder to migrate
from existing flows on row-oriented formats.
Similarly, Lyft’s schemas make heavy use of nested data to decompose a ride
into its routes, riders, segments, modes, and geo-coordinates. Prior to the
performance improvements, analytical queries would either need to be run on
clusters with very long timeouts, or the data would have to be flattened before
being analyzed, adding an extra ETL step. Not only would this be costly, it
would also cause the original schema to diverge in our data warehouse making it
more difficult for data scientists to understand.
The dereference pushdown optimization in Presto is having a massive impact on
the ingestion story at both LinkedIn and Lyft. Nested data is now being made
available faster for consumption with a consistency of structure across all
stores, while maintaining performance parity for analytical queries.
Example
Say we have a Hive table jobs, with a struct-typed column job_info in the
schema. The column job_info is wide and deeply nested, i.e. ROW(company
varchar, requirements ROW(skills array(...), education ROW(...), salary ...) ,
...). Most queries would access a small percentage of data from this struct
using the dereference projection (the . operation). Consider such a query Q
below.

SELECT A.appid id, J.job_info.company c
FROM applications A JOIN jobs J
ON A.jobid = J.jobid
LIMIT 100


It should suffice to scan only one field company from J.job_info for
executing this query. But, without dereference pushdown, Presto scans and
shuffles everything from job_info, only to project a single field at the end.

Solution: Pushdown of Dereference Expressions
With dereference pushdown, Presto optimizes queries by extracting the sufficient
 fields from a ROW as early as possible. This is enforced by modifying the
query plan through a set of optimizers, and can be broadly divided into two
parts.
First, dereference projections are extracted in the query plan and pushed as
close to the table scan as possible. This happens independent of what the
connector is. Secondly, there is a further improvement for Hive tables. The
Hive Connector and ORC/Parquet readers have been optimized to scan only the
sufficient subfield columns.
Pushdown of predicates on the subfields is also a crucial optimization. For
example, if a query has filters on subfields (i.e. a.b > 5), they should be
utilized by ORC/Parquet readers while scanning files. The pushdown helps with
the pruning of files, stripes and row-groups based on column-level statistics.
This optimization is achieved as a byproduct of the above two optimizations.
With the dereference pushdown, queries observe significant performance gains in
terms of CPU/memory usage and query runtime, roughly proportional to the
relative size of nested columns compared to the accessed fields.
Pushdown in Query Plan
The goal here is to execute dereference projections as early as possible. This
usually means performing them right after the table scans.
A projection operation that performs dereferencing on input symbols (i.e.
job_info.company) reduces the amount of data going up the plan tree. Pushing
dereference projections down means that we are pruning data early. It reduces
the amount of data being processed and shuffled in query execution. For the
example query Q, the query plan looks like the following when dereference
pushdown is enabled.

The projection job_info.company now directly follows the scan of jobs table,
 avoiding the propagation the job_info through Limit and Join nodes. Note
that all of job_info is still being scanned, and pruning it in the reader
requires connector-dependent optimizations.
Pushdown in the Hive Connector
In columnar formats like ORC and Parquet, the data is laid out in a columnar
fashion even for subfields. If we have a column STRUCT(f1, f2, f3), the
subfields f1, f2 and f3 are stored as independent columns. An optimized
query engine should only scan the required fields through its ORC reader,
skipping the rest. This optimization has been added for Hive connector.
Dereference projections above a TableScanNode are pushed down in the Hive
connector as “virtual” (or “projected”) columns. The query plan is modified to
refer to these new columns. For the query Q, jobs table would be scanned
differently with this optimization, as shown below. The projection is now
embedded in the Hive connector. Here, job_info#company can be thought of as
a virtual column representing the subfield job_info.company.

The Hive connector handles the projections before returning columns to Presto’s
engine. It provides the required virtual columns to format-specific readers.
ORC and Parquet readers optimize their scans based on subfields required,
increasing their read throughput. Subfield pruning is not possible for
row-oriented format readers (e.g. AVRO). For them, Hive connector performs
adaptation to project the required fields.
Pushdown of Predicates on Subfields
Columnar formats store per-column statistics in the data files, which can be
used by the readers for filtering. eg. if a query contains filter y = 5 for a
top-level column y, Presto’s ORC reader can skip ORC stripes and files by
looking at the upper and lower bounds for y in the statistics.
The same concept of predicate-based pruning can work for filters involving
subfields, since the statistics are also stored for subfield columns. i.e.
Presto’s ORC/Parquet reader should be able to filter based on a constraint like
x.f1 = 5 for more optimal scans. Good news! In the final optimized plan,
predicates on a subfield are pushed down to the hive connector as a constraint
on the corresponding virtual column, and later used for optimizing the scan.
The complete logic is a bit complicated to explain here, but can be illustrated
through the following example.
Given an initial plan with a predicate on a dereferenced field (x.f1 = 5), a
chain of optimizers transform it to a more optimal plan with reader-level
predicates. In the future, the same optimization will be added to the Parquet
reader.

In the final plan, Hive connector knows to scan the column y and the subfield
x.f1. It also takes advantage of the “virtual” column constraint x#f1 = 5
for reader-level pruning.
Performance Improvement
Dereference pushdown improves performance for queries accessing nested fields
in multiple ways. First, it increases the read throughput for table scans,
reducing the CPU time. The pruning of fields during the scan also means lesser
data to process for all downstream operators and tasks. So the early
projections result in more optimal execution for any operations that involve
shuffle or copy of data. Moreover, for ORC/Parquet, the read performance
improves in the case of selective filters on subfields.
Below are some experimental results on a production dataset at LinkedIn which
contains 3 STRUCT columns, having ~20-30 small subfields in each. The
example queries used in the analysis access only a few subfields. The queries
have been listed as their approximate query shape for the sake of brevity. The
plots compare CPU usage, peak memory usage and averaged query wall time.

      
    

CPU usage and peak memory usage show orders-of-magnitude improvement in
presence of dereference pushdown. Query wall times also reduce considerably,
and this improvement is more drastic for the relatively complex JOIN query,
as expected.
Please note that these are not benchmarks! The performance improvement you’ll
see will vary depending on how many columns are contained in your nested data
versus how many you’ve referenced. At Lyft we saw improvements of 50x for some
queries!
Future Work
The pushdown of dereference expressions can be extended to arrays. i.e.
dereference operations applied after unnesting an array should also get pushed
down to the readers. For example, using our jobs table from before, our
jobs.job_info structure may contain a repeating structure such as
required_skills. With the following query, the entire required_skills
structure would be read even though only a small part of it is being referenced.

SELECT S.description
FROM jobs J
CROSS JOIN UNNEST (job_info.required_skills) S
WHERE S.years_of_experience >= 2


The work for this improvement is being tracked in this issue.
Similar to Hive Connector, connector-level dereference pushdown can be extended
to other connectors supporting nested types.
Another future improvement will be the pushdown of predicates on subfields for
data stored in Parquet format. Although the pruning of nested fields occurs
with Parquet, the predicates are not yet pushed down into the reader.
Conclusion
Pushing down dereference operations in the query provides massive performance
gains, especially while operating on large structs. At LinkedIn and Lyft, this
feature has shown great impact for analytical queries on nested datasets.
We’re excited for the Presto community to try it out. Feel free to dig into
this github issue for
technical details. Please reach out to us on Slack for further
disucssions or reporting issues.
