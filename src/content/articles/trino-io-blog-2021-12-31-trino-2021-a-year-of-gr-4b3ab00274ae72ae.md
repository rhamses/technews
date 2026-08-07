---
title: "Trino 2021 Wrapped: A Year of Growth"
link: "https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html"
guid: "https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html"
pubDate: "2021-12-31T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "As we reflect on Trino’s journey in 2021, one thing stands out. Compared to \nprevious years we have seen even further accelerated, tremendous growth. Yes,\nthis is what all these year-in-retrospect blog posts say, but this has some \nspecial significance to it. This week marked the one-year anniversary since the \nproject dropped the Presto name and moved to the Trino name.\nImmediately after the announcement, the Trino GitHub repository\nstarted trending in number of stargazers. Up until this point, the PrestoSQL\nGitHub repository had only amassed 1,600 stargazers in the two years since it \nhad split from the PrestoDB repository. However, within four months after the \nrenaming, the number of stargazers had doubled. GitHub stars, issues, pull \nrequests and commits started growing at a new trajectory.\nAt the time of writing, we just hit 4,600 stargazers on GitHub. This means, we \nhave grown by over 3,000 stargazers in the last year, a 187% increase. While we \nare on the subject, let’s talk about the health of the Trino community.\n2021 by the numbers\nLet’s take a look at the Trino project growth by the numbers:\n3679 new commits 💻 in GitHub\n3015 new stargazers ⭐ in GitHub\n2450 new members 👋 in Slack\n1979 pull requests merged ✅ in GitHub\n1213 issues 📝 created in GitHub\n988 new followers 🐦 on Twitter\n525 average weekly members 💬 in Slack\n491 new subscribers 📺 in YouTube\n23 Trino Community Broadcast ▶️ episodes\n17 Trino 🚀 releases\n13 blog ✍️ posts\n10 Trino 🍕 meetups\n1 Trino ⛰️ Summit\nAlong with the growth we’ve seen in GitHub, we have seen a 47% growth of the Trino Twitter \nfollowers this year. The Trino Slack community,\nwhere a large amount of troubleshooting and development discussions occur, saw a\n75% growth, nearing 6,000 members. Finally, the Trino YouTube channel\nhas seen an impressive 280% growth in subscribers.\nA lot of the increase on this channel was due to the Trino Community Broadcast, \nthat brought users and contributors from the community to cover 23 episodes\nabout the following topics:\n7 episodes on the Trino ecosystem (dbt, Amundsen, Debezium, Superset)\n4 episodes on the Trino project (Renaming Trino, Intro to Trino, Trinewbies)\n4 episodes on Trino connectors (Iceberg, Druid, Pinot)\n4 episodes on Trino internals (Distributed Hash-Joins, Dynamic Filtering, Views)\n2 episodes on Trino using Kubernetes (Trinetes series)\n2 episodes on Trino users (LinkedIn, Resurface)\nWhile stargazers, subscribers, episodes, and followers tell the story of the \ngrowing awareness of the Trino project with the new name, what about the actual\nrate of development on the project?\nAt the start of the year, there were 21,924 commits. This year, we pushed 3,679 \ncommits to the repository, sitting at over 25,600 now. Looking at the graph, this\nkeeps us pretty consistent with 2020’s throughput.\nWith the project’s trajectory displayed in numbers, let’s examine the top \nfeatures that landed in Trino this year.\nFeatures\nHere’s a high-level list of the most exciting features that made their way into\nTrino in 2021. For details and to keep up you can check out the release notes.\nSQL language improvements\nSQL language support is crucial for the increasing complexities of queries and \nusage of Trino. In 2021 we added numerous new language features and \nimprovements:\nMATCH_RECOGNIZE\na feature that allows for complex analysis across multiple rows. To learn more \nabout this feature watch the Community Broadcast show.\nWINDOW clause.\nRANGE and ROWS\nkeyword for usage within a window function.\nTime travel support and syntax, like FOR VERSION AS OF and FOR TIMESTAMP AS OF.\nUPDATE is supported.\nSubquery expressions that return multiple columns. Example: SELECT x = (VALUES (1, 'a')).\nAdd support for ALTER MATERIALIZED VIEW … RENAME TO …\nfrom_geojson_geometry/to_geojson_geometry functions.\ncontains \nfunction for checking if a CIDR contains an IP address.\nlistagg\nfunction returns concatenated values seperated by a specified separator.\nsoundex function\nthat checks phonetic similarity of two strings.\nformat_number function.\nSET TIME ZONE to set the\n current time zone for the session.\nArbitrary queries in SHOW STATS.\nCURRENT_CATALOG and CURRENT_SCHEMA session functions.\nTRUNCATE TABLE which allows for a more efficient delete.\nDENY statement, which enables you to remove a user or groups access via SQL.\nIN <catalog> clause to CREATE ROLE, DROP ROLE, GRANT ROLE, \nREVOKE ROLE, and SET ROLE to specify the target catalog of the statement \ninstead of using the current session catalog.\nQuery processing improvements\nAdded support for automatic query retries (this feature is very experimental\nwith some limitations for now).\nTransparent query retries.\nUpdated the behavior of ROW to JSON cast to produce JSON objects instead\nof JSON arrays.\nColumn and table lineage tracking in QueryCompletedEvent.\nPerformance improvements\nImproved performance for the following operations:\nQuerying Parquet data for files containing column indexes.\nReading dictionary-encoded Parquet files.\nQueries using rank() window function.\nQueries using sum()\nand avg() for \ndecimal types.\nQueries using GROUP BY with single grouping column.\nAggregation on decimal values.\nEvaluation of the WHERE and SELECT clause.\nComputing the product of decimal values with precision larger than 19.\nQueries that process row or array data.\nQueries that contain a DISTINCT clause.\nReduced memory usage and improved performance of joins.\nORDER BY LIMIT performance was improved when data was pre-sorted.\nNode-local Dynamic Filtering\nSecurity\nAdded the following improvements and features relevant for authentication, \nauthorization and integration with other security systems:\nAutomatic configuration of TLS for \nsecure internal communication.\nHandling of Server Name Indication (SNI) for multiple TLS certificates.\nThis removes the need to provision per-worker TLS certificates.\nAccess control for materialized views.\nOAuth2/OIDC opaque access tokens.\nConfiguring HTTP proxy for OAuth2 authentication.\nConfiguring multiple password authentication plugins.\nHiding inaccessible columns from SELECT * statement.\nData Sources\nBigQuery connector\nAdded CREATE TABLE and DROP TABLE support.\nAdded support for case insensitive name matching for BigQuery views.\nSupport reading bignumeric type whose precision is less than or equal to \n38.\nAdded support for CREATE SCHEMA and DROP SCHEMA statements.\nImproved support for BigQuery datetime and timestamp types.\nCassandra connector\nMapped Cassandra uuid type to Trino uuid.\nAdded support for Cassandra tuple type.\nChanged minimum number of speculative executions from two to one.\nSupport for reading user-defined types.\nClickhouse connector\nAdded ClickHouse connector.\nImproved performance of aggregation queries by computing aggregations within \nClickHouse. Currently, the following aggregate functions are eligible for\npushdown: count, min, max, sum and avg.\nAdded support for dropping columns.\nMap ClickHouse UUID columns as UUID type in Trino instead of VARCHAR.\nHDFS, S3, Azure and cloud object storage systems\nA core use case of Trino uses the Hive and Iceberg connectors to connect to\na data lake. These connectors differ from most as Trino is the sole query engine\nas opposed to the client calling another system. Here are some changes that\nfor these connectors:\nEnabled Glue statistics to support better query planning when using AWS.\nUPDATE support for ACID tables\nA lot of Hive view improvements.\nParquet column indexes.\ntarget_max_file_size configuration to control the file size of data written\nby Trino.\nStreaming uploads to S3 by default to improve performance and reduce disk usage.\nImproved performance for tables with small files and partitioned tables.\nTransparent redirection from a Hive catalog to Iceberg catalog if the table is\nan Iceberg table.\nUpdated to Iceberg 0.11.0 behavior for transforms of dates and timestamps\nbefore 1970.\nAdded procedure system.flush_metadata_cache() to flush metadata caches.\nAvoid generating splits for empty files.\nSped up Iceberg query performance when dynamic filtering can be leveraged.\nIncreased Iceberg performance when reading timestamps from Parquet files.\nImproved Iceberg performance for queries on nested data through dereference\npushdown.\nAdded support for INSERT OVERWRITE operations on S3-backed tables.\nMade the Iceberg uuid type available.\nTrino views made available in Iceberg.\nElasticsearch connector\nAdded support for reading fields as json values.\nFixed failure when documents contain fields of unsupported types.\nAdded support for scaled_float type.\nAdded support for assuming an IAM role.\nAdded retry requests with backoff when Elasticsearch is overloaded.\nBetter support for Elastic Cloud.\nMongoDB connector\nAdded timestamp_objectid()\nfunction.\nEnabled mongodb.socket-keep-alive config property by default.\nAdd support for json type.\nSupport reading MongoDB DBRef type.\nAllow skipping creation of an index for the _schema collection, if it \nalready exists.\nAdded support to redact the value of mongodb.credentials in the server log.\nAdded support for dropping columns.\nMySQL connector\nAdded support for reading and writing timestamp values with precision higher\nthan three.\nAdded support for predicate pushdown on timestamp columns.\nExclude an internal sys schema from schema listings.\nPinot connector\nUpdated Pinot connector to be compatible with versions >= 0.8.0 and drop \nsupport for older versions.\nAdded support for pushdown of filters on varbinary columns to Pinot.\nFixed incorrect results for queries that contain aggregations and IN and \nNOT IN filters over varchar columns.\nFixed failure for queries with filters on real or double columns having \n+Infinity or -Infinity values.\nImplemented aggregation pushdown.\nAllowed HTTPS URLs in pinot.controller-urls.\nPhoenix connector\nPhoenix 5 support was added.\nReduced memory usage for some queries.\nImproved performance by adding ability to parallelize queries within Trino.\nFeatures added to various connectors\nIn addition to the above some more features were added that apply to connectors\nthat use common code. These features improve performance using:\nStatistical aggregate function pushdown \nTopN pushdown and join pushdown\nImproved planning times by reducing number of connections opened\nImproved performance by improving metadata caching hit rate\nRule based identifier mapping support\nDELETE, non-transactional inserts and write-batch-size \nMetadata cache max size\nTRUNCATE TABLE\nImproved handling of Gregorian - Julian switch for date type\nEnsured correctness when pushing down predicates and topN to remote system \nthat is case-insensitive or sorts differently from Trino.\nRuntime improvements\nThere are a lot of performance improvements to list from the release notes.\nHere are a few examples:\nImproved coordinator CPU utilization.\nImproved query performance by reducing CPU overhead of repartitioning data \nacross worker nodes.\nReduced graceful shutdown time for worker nodes.\nEverything else\nHTTP Event listener\nAdded support for ARM64 in the Trino Docker image.\nAdded clear command to the Trino CLI to clear the screen.\nImproved tab completion for the Trino CLI.\nCustom connector metrics.\nFixed many, many, many bugs!\nTrino Summit\nIn 2021 we also enjoyed a successful inaugural Trino Summit, hosted by \nStarburst, with well over 500 attendees. There were wonderful talks\ngiven at this event from companies like Doordash, EA, LinkedIn, Netflix, \nRobinhood, Stream Native, and Tabular. If you missed this event, we have the \nrecordings and slides available.\nAs a teaser, the event started with Commander Bun Bun playing guitar to AC/DC’s,\n“Back In Black”.\n \n\n\nRenaming from PrestoSQL to Trino\nAs mentioned above, we renamed the project this year. What followed, was an \noutpouring of support and shock from the larger tech community. Community \nmembers immediately got to work. The project had to change the namespace \npractically overnight from the io.prestosql namespace to io.trino and a \nmigration blog post\nwas published. Due to the hasty nature of the Linux Foundation to enforce the\nPresto trademark, users had to adapt quickly.\nThis confused many in the community,\nespecially once the ownership of old PrestoSQL accounts were taken down by the\nLinux Foundation. The https://prestosql.io site had broken documentation links,\nJDBC urls had to change from jdbc:presto to jdbc:trino, header protocol\nnames had to be changed from prefix X-Presto- to X-Trino-, and various other\nuser impacting changes had to be made in the matter of weeks. Even the legacy \nDocker images were removed from the prestosql/presto Docker repository,\ncausing disruptions for many users who immediately had to upgrade to the \ntrinodb/trino Docker repository.\nWe reached out to multiple projects to update compatibility to\nTrino.\nDBeaver\nQueryBook\nHomebrew\ndbt\nsqlalchemy\nsqlpad\nApache Superset\nRedash\nAwesome Java\nAwesome For Beginners\nAirflow\ntrino-gateway\nMetabase\nand so much more…\nDespite the breaking changes, once the immediate hurdles fell behind, not only \nwas the community excited and supportive about the brand change, but\nparticularly they were all loving the new mascot. Our adorable bunny was soon \nafter named Commander Bun Bun by the community.\n2022 Roadmap: Project Tardigrade\nOne of the interesting developments that came out of Trino Summit was a feature\nTrino co-creator, Martin, talked about in the State of Trino presentation.\nHe proposed adding granular fault-tolerance and features to improve performance \nin the core engine. While Trino has been proven to run batch analytics workloads\nat scale, many have avoided long-running batch jobs in fear of a query failure. \nThe fault-tolerance feature introduces a first step for the Trino project to \ngain first-class support for long-running batch queries at massive scale.\nThe granular fault-tolerance is being thoughtfully crafted to maintain the \nspeed advantage that Trino has over other query engines, while increasing the \nresiliency of queries. In other words, rather than when a query runs out of\nresources or fails for any other reason, a subset of the query is\nretried. To support this intermediate stage data is persisted to replicated RAM \nor SSD.\n\n\nThe project to introduce granular fault-tolerance into Trino is called\nProject Tardigrade. It is a focus for many contributors now, and we will \nintroduce you to details in the coming months. The project is named after the \nmicroscopic Tardigrades that are the worlds most indestructible creatures, akin\nto the resiliency we are adding to Trino’s queries. We look forward to telling \nyou more as features unfold.\nAlong with Project Tardigrade will be a series of changes focused around faster\nperformance in the query engine using columnar evaluation, adaptive planning,\nand better scheduling for SIMD and GPU processors. We also will be working on\ndynamically resolved functions, MERGE support, Time Travel queries in data lake\nconnectors, Java 17, improved caching mechanisms, and much much more!\nConclusion\nIn summary, living this first year under the banner of Trino was nothing short\nof a wild endeavor. Any engineer knows that naming things is hard, and renaming\nthings is all the more difficult.\nAs we head into 2022, we can be certain of one thing. Trino will be reaching \ninto newer areas of development and breaking norms just as it did as Presto in \nprevious eras. The adoption of native fault-tolerance to a lightning fast query\nengine will bring Trino to a new level of adoption. Keep your eyes peeled for \nmore about Project Tardigrade.\nAlong with Project Tardigrade, we are looking forward to another year filled\nwith features, issues, and suggestions from our amazing and passionate community.\nThank you all for an incredible year. We can’t wait to see what you all bring in\n2022!"
author: "Brian Olsen, Martin Traverso, Manfred Moser"
contentHtml: "<div>\n<article>\n  <div><p>As we reflect on Trino’s journey in 2021, one thing stands out. Compared to \nprevious years we have seen even further accelerated, tremendous growth. Yes,\nthis is what all these year-in-retrospect blog posts say, but this has some \nspecial significance to it. This week marked the one-year anniversary since the \nproject <a target=\"_blank\" href=\"https://trino.io/blog/2020/12/27/announcing-trino\">dropped the Presto name and moved to the Trino name</a>.\nImmediately after the announcement, the <a target=\"_blank\" href=\"https://github.com/trinodb/trino\">Trino GitHub repository</a>\nstarted trending in number of stargazers. Up until this point, the PrestoSQL\nGitHub repository had only amassed 1,600 stargazers in the two years since it \nhad split from the PrestoDB repository. However, within four months after the \nrenaming, the number of stargazers had doubled. GitHub stars, issues, pull \nrequests and commits started growing at a new trajectory.</p>\n<!--more-->\n<p>\n <a href=\"https://twitter.com/bitsondatadev/status/1344028682126565381\" target=\"_blank\">\n   <img src=\"https://trino.io/assets/blog/2021-review/trending.png\">\n </a>\n</p>\n<p>At the time of writing, we just hit 4,600 stargazers on GitHub. This means, we \nhave grown by over 3,000 stargazers in the last year, a 187% increase. While we \nare on the subject, let’s talk about the health of the Trino community.</p>\n<h2 id=\"2021-by-the-numbers\">\n    2021 by the numbers <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#2021-by-the-numbers\">#</a>\n</h2>\n<p>Let’s take a look at the Trino project growth by the numbers:</p>\n<ul>\n  <li>3679 new commits 💻 in GitHub</li>\n  <li>3015 new stargazers ⭐ in GitHub</li>\n  <li>2450 new members 👋 in Slack</li>\n  <li>1979 pull requests merged ✅ in GitHub</li>\n  <li>1213 issues 📝 created in GitHub</li>\n  <li>988 new followers 🐦 on Twitter</li>\n  <li>525 average weekly members 💬 in Slack</li>\n  <li>491 new subscribers 📺 in YouTube</li>\n  <li>23 Trino Community Broadcast ▶️ episodes</li>\n  <li>17 Trino 🚀 releases</li>\n  <li>13 blog ✍️ posts</li>\n  <li>10 Trino 🍕 meetups</li>\n  <li>1 Trino ⛰️ Summit</li>\n</ul>\n<p>Along with the growth we’ve seen in GitHub, we have seen a 47% growth of <a target=\"_blank\" href=\"https://twitter.com/trinodb\">the Trino Twitter</a> \nfollowers this year. <a target=\"_blank\" href=\"https://trino.io/slack\">The Trino Slack community</a>,\nwhere a large amount of troubleshooting and development discussions occur, saw a\n75% growth, nearing 6,000 members. Finally, <a target=\"_blank\" href=\"https://www.youtube.com/c/TrinoDB\">the Trino YouTube channel</a>\nhas seen an impressive 280% growth in subscribers.</p>\n<p>A lot of the increase on this channel was due to the <a target=\"_blank\" href=\"https://trino.io/broadcast/\">Trino Community Broadcast</a>, \nthat brought users and contributors from the community to cover 23 episodes\nabout the following topics:</p>\n<ul>\n  <li>7 episodes on the Trino ecosystem (dbt, Amundsen, Debezium, Superset)</li>\n  <li>4 episodes on the Trino project (Renaming Trino, Intro to Trino, Trinewbies)</li>\n  <li>4 episodes on Trino connectors (Iceberg, Druid, Pinot)</li>\n  <li>4 episodes on Trino internals (Distributed Hash-Joins, Dynamic Filtering, Views)</li>\n  <li>2 episodes on Trino using Kubernetes (Trinetes series)</li>\n  <li>2 episodes on Trino users (LinkedIn, Resurface)</li>\n</ul>\n<p>While stargazers, subscribers, episodes, and followers tell the story of the \ngrowing awareness of the Trino project with the new name, what about the actual\nrate of development on the project?</p>\n<p>At the start of the year, there were 21,924 commits. This year, we pushed 3,679 \ncommits to the repository, sitting at over 25,600 now. Looking at the graph, this\nkeeps us pretty consistent with 2020’s throughput.</p>\n<p>\n <img src=\"https://trino.io/assets/blog/2021-review/commits.png\">\n</p>\n<p>With the project’s trajectory displayed in numbers, let’s examine the top \nfeatures that landed in Trino this year.</p>\n<h2 id=\"features\">\n    Features <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#features\">#</a>\n</h2>\n<p>Here’s a high-level list of the most exciting features that made their way into\nTrino in 2021. For details and to keep up you can check out the <a target=\"_blank\" href=\"https://trino.io/docs/current/release.html\">release notes</a>.</p>\n<h3 id=\"sql-language-improvements\">\n    SQL language improvements <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#sql-language-improvements\">#</a>\n</h3>\n<p>SQL language support is crucial for the increasing complexities of queries and \nusage of Trino. In 2021 we added numerous new language features and \nimprovements:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching\"><code>MATCH_RECOGNIZE</code></a>\na feature that allows for complex analysis across multiple rows. To learn more \nabout this feature watch <a target=\"_blank\" href=\"https://trino.io/episodes/23\">the Community Broadcast show</a>.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/sql/select.html#window-clause\"><code>WINDOW</code></a> clause.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2021/03/10/introducing-new-window-features#new%20features\"><code>RANGE</code> and <code>ROWS</code></a>\nkeyword for usage within a window function.</li>\n  <li>Time travel support and syntax, like <code>FOR VERSION AS OF</code> and <code>FOR TIMESTAMP AS OF</code>.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/sql/update.html\"><code>UPDATE</code></a> is supported.</li>\n  <li>Subquery expressions that return multiple columns. Example: <code>SELECT x = (VALUES (1, 'a'))</code>.</li>\n  <li>Add support for <code>ALTER MATERIALIZED VIEW</code> … <code>RENAME TO</code> …</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/functions/geospatial.html#from_geojson_geometry\">from_geojson_geometry/to_geojson_geometry</a> functions.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/functions/ipaddress.html#ip-address-contains\">contains</a> \nfunction for checking if a CIDR contains an IP address.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/functions/aggregate.html#listagg\"><code>listagg</code></a>\nfunction returns concatenated values seperated by a specified separator.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/functions/string.html#soundex\">soundex</a> function\nthat checks phonetic similarity of two strings.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/functions/conversion.html#format_number\">format_number</a> function.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/sql/set-time-zone.html\"><code>SET TIME ZONE</code></a> to set the\n current time zone for the session.</li>\n  <li>Arbitrary queries in <a target=\"_blank\" href=\"https://trino.io/docs/current/sql/show-stats.html\"><code>SHOW STATS</code></a>.</li>\n  <li><code>CURRENT_CATALOG</code> and <code>CURRENT_SCHEMA</code> session functions.</li>\n  <li><code>TRUNCATE TABLE</code> which allows for a more efficient delete.</li>\n  <li><code>DENY</code> statement, which enables you to remove a user or groups access via SQL.</li>\n  <li><code>IN &lt;catalog&gt;</code> clause to <code>CREATE ROLE</code>, <code>DROP ROLE</code>, <code>GRANT ROLE</code>, \n<code>REVOKE ROLE</code>, and <code>SET ROLE</code> to specify the target catalog of the statement \ninstead of using the current session catalog.</li>\n</ul>\n<h3 id=\"query-processing-improvements\">\n    Query processing improvements <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#query-processing-improvements\">#</a>\n</h3>\n<ul>\n  <li>Added support for automatic query retries (this feature is very experimental\nwith some limitations for now).</li>\n  <li>Transparent query retries.</li>\n  <li>Updated the behavior of <code>ROW</code> to <code>JSON</code> cast to produce <code>JSON</code> objects instead\nof <code>JSON</code> arrays.</li>\n  <li>Column and table lineage tracking in <code>QueryCompletedEvent</code>.</li>\n</ul>\n<h2 id=\"performance-improvements\">\n    Performance improvements <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#performance-improvements\">#</a>\n</h2>\n<p>Improved performance for the following operations:</p>\n<ul>\n  <li>Querying Parquet data for files containing column indexes.</li>\n  <li>Reading dictionary-encoded Parquet files.</li>\n  <li>Queries using <a target=\"_blank\" href=\"https://trino.io/docs/current/functions/window.html#rank\"><code>rank()</code></a> window function.</li>\n  <li>Queries using <a target=\"_blank\" href=\"https://trino.io/docs/current/functions/aggregate.html#sum\"><code>sum()</code></a>\nand <a target=\"_blank\" href=\"https://trino.io/docs/current/functions/aggregate.html#avg\"><code>avg()</code></a> for \ndecimal types.</li>\n  <li>Queries using <code>GROUP BY</code> with single grouping column.</li>\n  <li>Aggregation on decimal values.</li>\n  <li>Evaluation of the <code>WHERE</code> and <code>SELECT</code> clause.</li>\n  <li>Computing the product of decimal values with precision larger than 19.</li>\n  <li>Queries that process row or array data.</li>\n  <li>Queries that contain a <code>DISTINCT</code> clause.</li>\n  <li>Reduced memory usage and improved performance of joins.</li>\n  <li><code>ORDER BY LIMIT</code> performance was improved when data was pre-sorted.</li>\n  <li>Node-local Dynamic Filtering</li>\n</ul>\n<h2 id=\"security\">\n    Security <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#security\">#</a>\n</h2>\n<p>Added the following improvements and features relevant for authentication, \nauthorization and integration with other security systems:</p>\n<ul>\n  <li>Automatic configuration of TLS for \n<a target=\"_blank\" href=\"https://trino.io/docs/current/security/internal-communication.html\">secure internal communication</a>.</li>\n  <li>Handling of Server Name Indication (SNI) for multiple TLS certificates.\nThis removes the need to provision per-worker TLS certificates.</li>\n  <li>Access control for materialized views.</li>\n  <li>OAuth2/OIDC <a target=\"_blank\" href=\"https://trino.io/docs/current/security/oauth2.html\">opaque access tokens</a>.</li>\n  <li>Configuring HTTP proxy for OAuth2 authentication.</li>\n  <li>Configuring <a target=\"_blank\" href=\"https://trino.io/docs/current/security/authentication-types.html#multiple-password-authenticators\">multiple password authentication plugins</a>.</li>\n  <li>Hiding inaccessible columns from <code>SELECT *</code> statement.</li>\n</ul>\n<h2 id=\"data-sources\">\n    Data Sources <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#data-sources\">#</a>\n</h2>\n<h3 id=\"bigquery-connector\">\n    BigQuery connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#bigquery-connector\">#</a>\n</h3>\n<ul>\n  <li>Added <code>CREATE TABLE</code> and <code>DROP TABLE</code> support.</li>\n  <li>Added support for case insensitive name matching for BigQuery views.</li>\n  <li>Support reading <code>bignumeric</code> type whose precision is less than or equal to \n38.</li>\n  <li>Added support for <code>CREATE SCHEMA</code> and <code>DROP SCHEMA</code> statements.</li>\n  <li>Improved support for BigQuery datetime and timestamp types.</li>\n</ul>\n<h3 id=\"cassandra-connector\">\n    Cassandra connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#cassandra-connector\">#</a>\n</h3>\n<ul>\n  <li>Mapped Cassandra <code>uuid</code> type to Trino <code>uuid</code>.</li>\n  <li>Added support for Cassandra <code>tuple</code> type.</li>\n  <li>Changed minimum number of speculative executions from two to one.</li>\n  <li>Support for reading user-defined types.</li>\n</ul>\n<h3 id=\"clickhouse-connector\">\n    Clickhouse connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#clickhouse-connector\">#</a>\n</h3>\n<ul>\n  <li>Added <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/clickhouse.html\">ClickHouse connector</a>.</li>\n  <li>Improved performance of aggregation queries by computing aggregations within \nClickHouse. Currently, the following aggregate functions are eligible for\npushdown: <code>count</code>, <code>min</code>, <code>max</code>, <code>sum</code> and <code>avg</code>.</li>\n  <li>Added support for dropping columns.</li>\n  <li>Map ClickHouse <code>UUID</code> columns as <code>UUID</code> type in Trino instead of <code>VARCHAR</code>.</li>\n</ul>\n<h3 id=\"hdfs-s3-azure-and-cloud-object-storage-systems\">\n    HDFS, S3, Azure and cloud object storage systems <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#hdfs-s3-azure-and-cloud-object-storage-systems\">#</a>\n</h3>\n<p>A core use case of Trino uses the Hive and Iceberg connectors to connect to\na data lake. These connectors differ from most as Trino is the sole query engine\nas opposed to the client calling another system. Here are some changes that\nfor these connectors:</p>\n<ul>\n  <li>Enabled Glue statistics to support better query planning when using AWS.</li>\n  <li><code>UPDATE</code> support for ACID tables</li>\n  <li>A lot of Hive view improvements.</li>\n  <li>Parquet column indexes.</li>\n  <li><code>target_max_file_size</code> configuration to control the file size of data written\nby Trino.</li>\n  <li>Streaming uploads to S3 by default to improve performance and reduce disk usage.</li>\n  <li>Improved performance for tables with small files and partitioned tables.</li>\n  <li>Transparent redirection from a Hive catalog to Iceberg catalog if the table is\nan Iceberg table.</li>\n  <li>Updated to Iceberg 0.11.0 behavior for transforms of dates and timestamps\nbefore 1970.</li>\n  <li>Added procedure <code>system.flush_metadata_cache()</code> to flush metadata caches.</li>\n  <li>Avoid generating splits for empty files.</li>\n  <li>Sped up Iceberg query performance when dynamic filtering can be leveraged.</li>\n  <li>Increased Iceberg performance when reading timestamps from Parquet files.</li>\n  <li>Improved Iceberg performance for queries on nested data through dereference\npushdown.</li>\n  <li>Added support for <code>INSERT OVERWRITE</code> operations on S3-backed tables.</li>\n  <li>Made the Iceberg <code>uuid</code> type available.</li>\n  <li>Trino views made available in Iceberg.</li>\n</ul>\n<h3 id=\"elasticsearch-connector\">\n    Elasticsearch connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#elasticsearch-connector\">#</a>\n</h3>\n<ul>\n  <li>Added support for reading fields as <code>json</code> values.</li>\n  <li>Fixed failure when documents contain fields of unsupported types.</li>\n  <li>Added support for <code>scaled_float</code> type.</li>\n  <li>Added support for assuming an IAM role.</li>\n  <li>Added retry requests with backoff when Elasticsearch is overloaded.</li>\n  <li>Better support for Elastic Cloud.</li>\n</ul>\n<h3 id=\"mongodb-connector\">\n    MongoDB connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#mongodb-connector\">#</a>\n</h3>\n<ul>\n  <li>Added <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/mongodb.html#timestamp_objectid\"><code>timestamp_objectid()</code></a>\nfunction.</li>\n  <li>Enabled <code>mongodb.socket-keep-alive</code> config property by default.</li>\n  <li>Add support for <code>json</code> type.</li>\n  <li>Support reading MongoDB <code>DBRef</code> type.</li>\n  <li>Allow skipping creation of an index for the <code>_schema</code> collection, if it \nalready exists.</li>\n  <li>Added support to redact the value of <code>mongodb.credentials</code> in the server log.</li>\n  <li>Added support for dropping columns.</li>\n</ul>\n<h3 id=\"mysql-connector\">\n    MySQL connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#mysql-connector\">#</a>\n</h3>\n<ul>\n  <li>Added support for reading and writing <code>timestamp</code> values with precision higher\nthan three.</li>\n  <li>Added support for predicate pushdown on <code>timestamp</code> columns.</li>\n  <li>Exclude an internal <code>sys</code> schema from schema listings.</li>\n</ul>\n<h3 id=\"pinot-connector\">\n    Pinot connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#pinot-connector\">#</a>\n</h3>\n<ul>\n  <li>Updated Pinot connector to be compatible with versions &gt;= 0.8.0 and drop \nsupport for older versions.</li>\n  <li>Added support for pushdown of filters on <code>varbinary</code> columns to Pinot.</li>\n  <li>Fixed incorrect results for queries that contain aggregations and <code>IN</code> and \n<code>NOT IN</code> filters over varchar columns.</li>\n  <li>Fixed failure for queries with filters on <code>real</code> or <code>double</code> columns having \n<code>+Infinity</code> or <code>-Infinity</code> values.</li>\n  <li>Implemented aggregation pushdown.</li>\n  <li>Allowed HTTPS URLs in <code>pinot.controller-urls</code>.</li>\n</ul>\n<h3 id=\"phoenix-connector\">\n    Phoenix connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#phoenix-connector\">#</a>\n</h3>\n<ul>\n  <li>Phoenix 5 support was added.</li>\n  <li>Reduced memory usage for some queries.</li>\n  <li>Improved performance by adding ability to parallelize queries within Trino.</li>\n</ul>\n<h3 id=\"features-added-to-various-connectors\">\n    Features added to various connectors <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#features-added-to-various-connectors\">#</a>\n</h3>\n<p>In addition to the above some more features were added that apply to connectors\nthat use common code. These features improve performance using:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-352.html#mysql-connector\">Statistical aggregate function pushdown </a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-353.html\">TopN pushdown and join pushdown</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-353.html\">Improved planning times by reducing number of connections opened</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-356.html\">Improved performance by improving metadata caching hit rate</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-357.html\">Rule based identifier mapping support</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-360.html\">DELETE, non-transactional inserts and write-batch-size </a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-361.html\">Metadata cache max size</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-365.html\">TRUNCATE TABLE</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-366.html\">Improved handling of Gregorian - Julian switch for date type</a></li>\n  <li>Ensured correctness when pushing down predicates and topN to remote system \nthat is case-insensitive or sorts differently from Trino.</li>\n</ul>\n<h2 id=\"runtime-improvements\">\n    Runtime improvements <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#runtime-improvements\">#</a>\n</h2>\n<p>There are a lot of performance improvements to list from the <a target=\"_blank\" href=\"https://trino.io/docs/current/release.html\">release notes</a>.\nHere are a few examples:</p>\n<ul>\n  <li>Improved coordinator CPU utilization.</li>\n  <li>Improved query performance by reducing CPU overhead of repartitioning data \nacross worker nodes.</li>\n  <li>Reduced graceful shutdown time for worker nodes.</li>\n</ul>\n<h2 id=\"everything-else\">\n    Everything else <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#everything-else\">#</a>\n</h2>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/admin/event-listeners-http.html\">HTTP Event listener</a></li>\n  <li>Added support for ARM64 in the <a target=\"_blank\" href=\"https://hub.docker.com/r/trinodb/trino\">Trino Docker image</a>.</li>\n  <li>Added <code>clear</code> command to the Trino CLI to clear the screen.</li>\n  <li>Improved tab completion for the Trino CLI.</li>\n  <li>Custom connector metrics.</li>\n  <li>Fixed many, many, many bugs!</li>\n</ul>\n<h2 id=\"trino-summit\">\n    Trino Summit <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#trino-summit\">#</a>\n</h2>\n<p>In 2021 we also enjoyed a successful inaugural Trino Summit, hosted by \nStarburst, with well over 500 attendees. There were wonderful talks\ngiven at this event from companies like Doordash, EA, LinkedIn, Netflix, \nRobinhood, Stream Native, and Tabular. If you missed this event, we have the \n<a target=\"_blank\" href=\"https://www.starburst.io/resources/trino-summit/\">recordings and slides available</a>.</p>\n<p>As a teaser, the event started with Commander Bun Bun playing guitar to AC/DC’s,\n“Back In Black”.</p>\n\n<h2 id=\"renaming-from-prestosql-to-trino\">\n    Renaming from PrestoSQL to Trino <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#renaming-from-prestosql-to-trino\">#</a>\n</h2>\n<p>As mentioned above, we renamed the project this year. What followed, was an \noutpouring of support and shock from the larger tech community. Community \nmembers immediately got to work. The project had to change the namespace \npractically overnight from the <code>io.prestosql</code> namespace to <code>io.trino</code> and a \n<a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino\">migration blog post</a>\nwas published. Due to the hasty nature of the Linux Foundation to enforce the\nPresto trademark, users had to adapt quickly.</p>\n<p>\n <a href=\"https://twitter.com/trinodb/status/1343330429684703232?s=20\" target=\"_blank\">\n   <img src=\"https://trino.io/assets/blog/2021-review/tweets.png\">\n </a>\n</p>\n<p>This <a target=\"_blank\" href=\"https://stackoverflow.com/questions/67414714\">confused many in the community</a>,\nespecially once the ownership of old PrestoSQL accounts were taken down by the\nLinux Foundation. The <a target=\"_blank\" href=\"https://prestosql.io/\">https://prestosql.io</a> site had broken documentation links,\nJDBC urls had to change from <code>jdbc:presto</code> to <code>jdbc:trino</code>, header protocol\nnames had to be changed from prefix <code>X-Presto-</code> to <code>X-Trino-</code>, and various other\nuser impacting changes had to be made in the matter of weeks. Even the legacy \nDocker images were removed from the <a target=\"_blank\" href=\"https://hub.docker.com/r/prestosql/presto\">prestosql/presto Docker repository</a>,\ncausing disruptions for many users who immediately had to upgrade to the \n<a target=\"_blank\" href=\"https://hub.docker.com/r/trinodb/trino\">trinodb/trino Docker repository</a>.</p>\n<p>We reached out to multiple projects to update compatibility to\nTrino.</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://github.com/dbeaver/dbeaver/pull/10925\">DBeaver</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/pinterest/querybook/issues/509\">QueryBook</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/Homebrew/homebrew-core/pull/83185\">Homebrew</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/dbt-labs/dbt-presto/issues/39\">dbt</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/dungdm93/sqlalchemy-trino/issues/20\">sqlalchemy</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/sqlpad/sqlpad/pull/974\">sqlpad</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/apache/superset/pull/13105\">Apache Superset</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/getredash/redash/pull/5411\">Redash</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/akullpp/awesome-java/pull/917\">Awesome Java</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/MunGell/awesome-for-beginners/pull/933\">Awesome For Beginners</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/apache/airflow/pull/15187\">Airflow</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/lyft/presto-gateway/issues/134\">trino-gateway</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/metabase/metabase/issues/17532\">Metabase</a></li>\n  <li>and so much more…</li>\n</ul>\n<p>Despite the breaking changes, once the immediate hurdles fell behind, not only \nwas the community excited and supportive about the brand change, but\nparticularly they were all loving the new mascot. Our adorable bunny was soon \nafter <a target=\"_blank\" href=\"https://trino.io/episodes/10\">named Commander Bun Bun by the community</a>.</p>\n<p>\n <a href=\"https://twitter.com/jtannady/status/1346888143459545092\" target=\"_blank\">\n   <img src=\"https://trino.io/assets/blog/2021-review/cbb.png\">\n </a>\n</p>\n<h2 id=\"2022-roadmap-project-tardigrade\">\n    2022 Roadmap: Project Tardigrade <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#2022-roadmap-project-tardigrade\">#</a>\n</h2>\n<p>One of the interesting developments that came out of Trino Summit was a feature\nTrino co-creator, Martin, talked about in <a target=\"_blank\" href=\"https://www.starburst.io/resources/trino-summit/?wchannelid=2ug6mgs5ao&wmediaid=o264qw85dj\">the State of Trino presentation</a>.\nHe proposed adding granular fault-tolerance and features to improve performance \nin the core engine. While Trino has been proven to run batch analytics workloads\nat scale, many have avoided long-running batch jobs in fear of a query failure. \nThe fault-tolerance feature introduces a first step for the Trino project to \ngain first-class support for long-running batch queries at massive scale.</p>\n<p>The granular fault-tolerance is being thoughtfully crafted to maintain the \nspeed advantage that Trino has over other query engines, while increasing the \nresiliency of queries. In other words, rather than when a query runs out of\nresources or fails for any other reason, a subset of the query is\nretried. To support this intermediate stage data is persisted to replicated RAM \nor SSD.</p>\n<p><a target=\"_blank\" title=\"Schokraie E, Warnken U, Hotz-Wagenblatt A, Grohme MA, Hengherr S, et al. (2012), CC BY 2.5 <https://creativecommons.org/licenses/by/2.5>, via Wikimedia Commons\" href=\"https://commons.wikimedia.org/wiki/File:SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png\"><img alt=\"SEM image of Milnesium tardigradum in active state - journal.pone.0045682.g001-2\" src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png/512px-SEM_image_of_Milnesium_tardigradum_in_active_state_-_journal.pone.0045682.g001-2.png\">\n</a></p>\n<p>The project to introduce granular fault-tolerance into Trino is called\nProject Tardigrade. It is a focus for many contributors now, and we will \nintroduce you to details in the coming months. The project is named after the \nmicroscopic Tardigrades that are the worlds most indestructible creatures, akin\nto the resiliency we are adding to Trino’s queries. We look forward to telling \nyou more as features unfold.</p>\n<p>Along with Project Tardigrade will be a series of changes focused around faster\nperformance in the query engine using columnar evaluation, adaptive planning,\nand better scheduling for SIMD and GPU processors. We also will be working on\ndynamically resolved functions, MERGE support, Time Travel queries in data lake\nconnectors, Java 17, improved caching mechanisms, and much much more!</p>\n<h2 id=\"conclusion\">\n    Conclusion <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/31/trino-2021-a-year-of-growth.html#conclusion\">#</a>\n</h2>\n<p>In summary, living this first year under the banner of Trino was nothing short\nof a wild endeavor. Any engineer knows that naming things is hard, and renaming\nthings is all the more difficult.</p>\n<p>As we head into 2022, we can be certain of one thing. Trino will be reaching \ninto newer areas of development and breaking norms just as it did as Presto in \nprevious eras. The adoption of native fault-tolerance to a lightning fast query\nengine will bring Trino to a new level of adoption. Keep your eyes peeled for \nmore about Project Tardigrade.</p>\n<p>Along with Project Tardigrade, we are looking forward to another year filled\nwith features, issues, and suggestions from our amazing and passionate community.\nThank you all for an incredible year. We can’t wait to see what you all bring in\n2022!</p>\n  </div>\n</article>\n</div>"
---

As we reflect on Trino’s journey in 2021, one thing stands out. Compared to 
previous years we have seen even further accelerated, tremendous growth. Yes,
this is what all these year-in-retrospect blog posts say, but this has some 
special significance to it. This week marked the one-year anniversary since the 
project dropped the Presto name and moved to the Trino name.
Immediately after the announcement, the Trino GitHub repository
started trending in number of stargazers. Up until this point, the PrestoSQL
GitHub repository had only amassed 1,600 stargazers in the two years since it 
had split from the PrestoDB repository. However, within four months after the 
renaming, the number of stargazers had doubled. GitHub stars, issues, pull 
requests and commits started growing at a new trajectory.
At the time of writing, we just hit 4,600 stargazers on GitHub. This means, we 
have grown by over 3,000 stargazers in the last year, a 187% increase. While we 
are on the subject, let’s talk about the health of the Trino community.
2021 by the numbers
Let’s take a look at the Trino project growth by the numbers:
3679 new commits 💻 in GitHub
3015 new stargazers ⭐ in GitHub
2450 new members 👋 in Slack
1979 pull requests merged ✅ in GitHub
1213 issues 📝 created in GitHub
988 new followers 🐦 on Twitter
525 average weekly members 💬 in Slack
491 new subscribers 📺 in YouTube
23 Trino Community Broadcast ▶️ episodes
17 Trino 🚀 releases
13 blog ✍️ posts
10 Trino 🍕 meetups
1 Trino ⛰️ Summit
Along with the growth we’ve seen in GitHub, we have seen a 47% growth of the Trino Twitter 
followers this year. The Trino Slack community,
where a large amount of troubleshooting and development discussions occur, saw a
75% growth, nearing 6,000 members. Finally, the Trino YouTube channel
has seen an impressive 280% growth in subscribers.
A lot of the increase on this channel was due to the Trino Community Broadcast, 
that brought users and contributors from the community to cover 23 episodes
about the following topics:
7 episodes on the Trino ecosystem (dbt, Amundsen, Debezium, Superset)
4 episodes on the Trino project (Renaming Trino, Intro to Trino, Trinewbies)
4 episodes on Trino connectors (Iceberg, Druid, Pinot)
4 episodes on Trino internals (Distributed Hash-Joins, Dynamic Filtering, Views)
2 episodes on Trino using Kubernetes (Trinetes series)
2 episodes on Trino users (LinkedIn, Resurface)
While stargazers, subscribers, episodes, and followers tell the story of the 
growing awareness of the Trino project with the new name, what about the actual
rate of development on the project?
At the start of the year, there were 21,924 commits. This year, we pushed 3,679 
commits to the repository, sitting at over 25,600 now. Looking at the graph, this
keeps us pretty consistent with 2020’s throughput.
With the project’s trajectory displayed in numbers, let’s examine the top 
features that landed in Trino this year.
Features
Here’s a high-level list of the most exciting features that made their way into
Trino in 2021. For details and to keep up you can check out the release notes.
SQL language improvements
SQL language support is crucial for the increasing complexities of queries and 
usage of Trino. In 2021 we added numerous new language features and 
improvements:
MATCH_RECOGNIZE
a feature that allows for complex analysis across multiple rows. To learn more 
about this feature watch the Community Broadcast show.
WINDOW clause.
RANGE and ROWS
keyword for usage within a window function.
Time travel support and syntax, like FOR VERSION AS OF and FOR TIMESTAMP AS OF.
UPDATE is supported.
Subquery expressions that return multiple columns. Example: SELECT x = (VALUES (1, 'a')).
Add support for ALTER MATERIALIZED VIEW … RENAME TO …
from_geojson_geometry/to_geojson_geometry functions.
contains 
function for checking if a CIDR contains an IP address.
listagg
function returns concatenated values seperated by a specified separator.
soundex function
that checks phonetic similarity of two strings.
format_number function.
SET TIME ZONE to set the
 current time zone for the session.
Arbitrary queries in SHOW STATS.
CURRENT_CATALOG and CURRENT_SCHEMA session functions.
TRUNCATE TABLE which allows for a more efficient delete.
DENY statement, which enables you to remove a user or groups access via SQL.
IN <catalog> clause to CREATE ROLE, DROP ROLE, GRANT ROLE, 
REVOKE ROLE, and SET ROLE to specify the target catalog of the statement 
instead of using the current session catalog.
Query processing improvements
Added support for automatic query retries (this feature is very experimental
with some limitations for now).
Transparent query retries.
Updated the behavior of ROW to JSON cast to produce JSON objects instead
of JSON arrays.
Column and table lineage tracking in QueryCompletedEvent.
Performance improvements
Improved performance for the following operations:
Querying Parquet data for files containing column indexes.
Reading dictionary-encoded Parquet files.
Queries using rank() window function.
Queries using sum()
and avg() for 
decimal types.
Queries using GROUP BY with single grouping column.
Aggregation on decimal values.
Evaluation of the WHERE and SELECT clause.
Computing the product of decimal values with precision larger than 19.
Queries that process row or array data.
Queries that contain a DISTINCT clause.
Reduced memory usage and improved performance of joins.
ORDER BY LIMIT performance was improved when data was pre-sorted.
Node-local Dynamic Filtering
Security
Added the following improvements and features relevant for authentication, 
authorization and integration with other security systems:
Automatic configuration of TLS for 
secure internal communication.
Handling of Server Name Indication (SNI) for multiple TLS certificates.
This removes the need to provision per-worker TLS certificates.
Access control for materialized views.
OAuth2/OIDC opaque access tokens.
Configuring HTTP proxy for OAuth2 authentication.
Configuring multiple password authentication plugins.
Hiding inaccessible columns from SELECT * statement.
Data Sources
BigQuery connector
Added CREATE TABLE and DROP TABLE support.
Added support for case insensitive name matching for BigQuery views.
Support reading bignumeric type whose precision is less than or equal to 
38.
Added support for CREATE SCHEMA and DROP SCHEMA statements.
Improved support for BigQuery datetime and timestamp types.
Cassandra connector
Mapped Cassandra uuid type to Trino uuid.
Added support for Cassandra tuple type.
Changed minimum number of speculative executions from two to one.
Support for reading user-defined types.
Clickhouse connector
Added ClickHouse connector.
Improved performance of aggregation queries by computing aggregations within 
ClickHouse. Currently, the following aggregate functions are eligible for
pushdown: count, min, max, sum and avg.
Added support for dropping columns.
Map ClickHouse UUID columns as UUID type in Trino instead of VARCHAR.
HDFS, S3, Azure and cloud object storage systems
A core use case of Trino uses the Hive and Iceberg connectors to connect to
a data lake. These connectors differ from most as Trino is the sole query engine
as opposed to the client calling another system. Here are some changes that
for these connectors:
Enabled Glue statistics to support better query planning when using AWS.
UPDATE support for ACID tables
A lot of Hive view improvements.
Parquet column indexes.
target_max_file_size configuration to control the file size of data written
by Trino.
Streaming uploads to S3 by default to improve performance and reduce disk usage.
Improved performance for tables with small files and partitioned tables.
Transparent redirection from a Hive catalog to Iceberg catalog if the table is
an Iceberg table.
Updated to Iceberg 0.11.0 behavior for transforms of dates and timestamps
before 1970.
Added procedure system.flush_metadata_cache() to flush metadata caches.
Avoid generating splits for empty files.
Sped up Iceberg query performance when dynamic filtering can be leveraged.
Increased Iceberg performance when reading timestamps from Parquet files.
Improved Iceberg performance for queries on nested data through dereference
pushdown.
Added support for INSERT OVERWRITE operations on S3-backed tables.
Made the Iceberg uuid type available.
Trino views made available in Iceberg.
Elasticsearch connector
Added support for reading fields as json values.
Fixed failure when documents contain fields of unsupported types.
Added support for scaled_float type.
Added support for assuming an IAM role.
Added retry requests with backoff when Elasticsearch is overloaded.
Better support for Elastic Cloud.
MongoDB connector
Added timestamp_objectid()
function.
Enabled mongodb.socket-keep-alive config property by default.
Add support for json type.
Support reading MongoDB DBRef type.
Allow skipping creation of an index for the _schema collection, if it 
already exists.
Added support to redact the value of mongodb.credentials in the server log.
Added support for dropping columns.
MySQL connector
Added support for reading and writing timestamp values with precision higher
than three.
Added support for predicate pushdown on timestamp columns.
Exclude an internal sys schema from schema listings.
Pinot connector
Updated Pinot connector to be compatible with versions >= 0.8.0 and drop 
support for older versions.
Added support for pushdown of filters on varbinary columns to Pinot.
Fixed incorrect results for queries that contain aggregations and IN and 
NOT IN filters over varchar columns.
Fixed failure for queries with filters on real or double columns having 
+Infinity or -Infinity values.
Implemented aggregation pushdown.
Allowed HTTPS URLs in pinot.controller-urls.
Phoenix connector
Phoenix 5 support was added.
Reduced memory usage for some queries.
Improved performance by adding ability to parallelize queries within Trino.
Features added to various connectors
In addition to the above some more features were added that apply to connectors
that use common code. These features improve performance using:
Statistical aggregate function pushdown 
TopN pushdown and join pushdown
Improved planning times by reducing number of connections opened
Improved performance by improving metadata caching hit rate
Rule based identifier mapping support
DELETE, non-transactional inserts and write-batch-size 
Metadata cache max size
TRUNCATE TABLE
Improved handling of Gregorian - Julian switch for date type
Ensured correctness when pushing down predicates and topN to remote system 
that is case-insensitive or sorts differently from Trino.
Runtime improvements
There are a lot of performance improvements to list from the release notes.
Here are a few examples:
Improved coordinator CPU utilization.
Improved query performance by reducing CPU overhead of repartitioning data 
across worker nodes.
Reduced graceful shutdown time for worker nodes.
Everything else
HTTP Event listener
Added support for ARM64 in the Trino Docker image.
Added clear command to the Trino CLI to clear the screen.
Improved tab completion for the Trino CLI.
Custom connector metrics.
Fixed many, many, many bugs!
Trino Summit
In 2021 we also enjoyed a successful inaugural Trino Summit, hosted by 
Starburst, with well over 500 attendees. There were wonderful talks
given at this event from companies like Doordash, EA, LinkedIn, Netflix, 
Robinhood, Stream Native, and Tabular. If you missed this event, we have the 
recordings and slides available.
As a teaser, the event started with Commander Bun Bun playing guitar to AC/DC’s,
“Back In Black”.
 


Renaming from PrestoSQL to Trino
As mentioned above, we renamed the project this year. What followed, was an 
outpouring of support and shock from the larger tech community. Community 
members immediately got to work. The project had to change the namespace 
practically overnight from the io.prestosql namespace to io.trino and a 
migration blog post
was published. Due to the hasty nature of the Linux Foundation to enforce the
Presto trademark, users had to adapt quickly.
This confused many in the community,
especially once the ownership of old PrestoSQL accounts were taken down by the
Linux Foundation. The https://prestosql.io site had broken documentation links,
JDBC urls had to change from jdbc:presto to jdbc:trino, header protocol
names had to be changed from prefix X-Presto- to X-Trino-, and various other
user impacting changes had to be made in the matter of weeks. Even the legacy 
Docker images were removed from the prestosql/presto Docker repository,
causing disruptions for many users who immediately had to upgrade to the 
trinodb/trino Docker repository.
We reached out to multiple projects to update compatibility to
Trino.
DBeaver
QueryBook
Homebrew
dbt
sqlalchemy
sqlpad
Apache Superset
Redash
Awesome Java
Awesome For Beginners
Airflow
trino-gateway
Metabase
and so much more…
Despite the breaking changes, once the immediate hurdles fell behind, not only 
was the community excited and supportive about the brand change, but
particularly they were all loving the new mascot. Our adorable bunny was soon 
after named Commander Bun Bun by the community.
2022 Roadmap: Project Tardigrade
One of the interesting developments that came out of Trino Summit was a feature
Trino co-creator, Martin, talked about in the State of Trino presentation.
He proposed adding granular fault-tolerance and features to improve performance 
in the core engine. While Trino has been proven to run batch analytics workloads
at scale, many have avoided long-running batch jobs in fear of a query failure. 
The fault-tolerance feature introduces a first step for the Trino project to 
gain first-class support for long-running batch queries at massive scale.
The granular fault-tolerance is being thoughtfully crafted to maintain the 
speed advantage that Trino has over other query engines, while increasing the 
resiliency of queries. In other words, rather than when a query runs out of
resources or fails for any other reason, a subset of the query is
retried. To support this intermediate stage data is persisted to replicated RAM 
or SSD.


The project to introduce granular fault-tolerance into Trino is called
Project Tardigrade. It is a focus for many contributors now, and we will 
introduce you to details in the coming months. The project is named after the 
microscopic Tardigrades that are the worlds most indestructible creatures, akin
to the resiliency we are adding to Trino’s queries. We look forward to telling 
you more as features unfold.
Along with Project Tardigrade will be a series of changes focused around faster
performance in the query engine using columnar evaluation, adaptive planning,
and better scheduling for SIMD and GPU processors. We also will be working on
dynamically resolved functions, MERGE support, Time Travel queries in data lake
connectors, Java 17, improved caching mechanisms, and much much more!
Conclusion
In summary, living this first year under the banner of Trino was nothing short
of a wild endeavor. Any engineer knows that naming things is hard, and renaming
things is all the more difficult.
As we head into 2022, we can be certain of one thing. Trino will be reaching 
into newer areas of development and breaking norms just as it did as Presto in 
previous eras. The adoption of native fault-tolerance to a lightning fast query
engine will bring Trino to a new level of adoption. Keep your eyes peeled for 
more about Project Tardigrade.
Along with Project Tardigrade, we are looking forward to another year filled
with features, issues, and suggestions from our amazing and passionate community.
Thank you all for an incredible year. We can’t wait to see what you all bring in
2022!
