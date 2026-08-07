---
title: "Trino in 2020 - An amazing year in review"
link: "https://trino.io/blog/2021/01/08/2020-review.html"
guid: "https://trino.io/blog/2021/01/08/2020-review.html"
pubDate: "2021-01-08T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Wow! If you would have to sum up what happened in the last year in this\ngreat community, wow would be it. It is truly awe-inspiring to be part of\nthis incredible journey of Trino. Oh yeah, on that note. Our community and\nproject chose the new name Trino,\nto be able to continue to innovate and develop freely as a community of peers.\nPresto® and Presto® SQL are a thing of the past.\nNow that is out of the way, let’s dive right in and see what all our community\nmembers across the globe have created with us!\n2019 was a big year for us, but check\nout how 2020 eclipsed even that!\nBy the numbers\nEven the size and growth of our community on Slack is impressive:\nStarted in January 2020 with ~1600 members and 280 weekly active\nOver 3200 members by December 2020\n560 members active weekly\nThe innovation and change of the source code on GitHub is a result of the hard work of the community:\nOver 4000 commits merged\nMore than 2800 pull requests received\n23 releases, nearly every two\nweeks basically!\nAs you can see, much of the excitement around the name change has quickly\nincreased the number of stars we have on GitHub. While some of this certainly\nstems from an initial buzz around a shiny new name, we also believe that this\nname change has brought clarity to the community. Trino is an improved version,\nsupported by the founders and creators of Presto®, along with the major\ncontributors.\nAnd if you have not done so already, make sure to star the\nrepository and join us on slack.\nFeatures and code\nWhile everything mentioned is already exciting, the true work is visible in the\nnew features and improvements in Trino. It is a long list, but read on. You\nwon’t want to miss anything.\nImprovements to ANSI SQL support\nA core feature of Trino is the ability to use the same standard SQL for any\nconnected data source. These improvements empower all users.\nVariable-precision temporal types, with precision down to picoseconds\n(10−12s). This a very important feature for any time critical\nsystems such as financial transactions processing\nCorrect, and now SQL specification compliant timestamp semantics, making\nmigration of SQL statements from other compliant systems such as many RDBMSs\neasier\nImplicit coercions for INSERT clause\nSupport for RANGE and GROUPS-based window frames\nMore support for various shapes of correlated subqueries\nSupport for INTERSECT ALL and EXCEPT ALL\nParameter support in LIMIT, FETCH FIRST, and OFFSET clause\nExperimental support for recursive queries\nEnforcement of NOT NULL constraints when inserting data\nQuantified comparisons (e.g., > ALL (...)) in aggregation queries\nOther query improvements\nA number of other features were added to make querying your data sources with\nTrino even more powerful:\nT-digest data type and functions\nfor approximate quantile computations\nSupport for setting and reading column comments\nNumerous new functions including concat_ws(), regexp_count(),\nregexp_position(), contains_sequence(), murmur3(),\nfrom_unixtime_nanos(), from_iso8601_timestamp_nanos(),\nhuman_readable_seconds(), bitwise operations, luhn_check(),\napprox_most_frequent(), translate(), starts_with()\nPerformance\nTrino is already ludicrously fast. But then again, even faster is\nbetter, so we worked on that:\nImproved pushdown of complex operations into connectors, including\naggregation pushdown and TopN\npushdown.\nDynamic filtering and partition pruning, which can improve performance of\nhighly selective joins manyfold.\nCost-based decisions for queries containing IN <subquery> in WHERE clause.\nInformation_schema performance improvements, which benefit third-party BI\ntools that need to inspect table metadata, for example DBeaver, Datagrip,\nPower BI, Tableau, Looker, and others.\nFaster queries on nested data in Parquet and ORC.\nFaster and more accurate approx_percentile, based on t-digest data structure.\nSupport of Bloom filters in ORC.\nExperimental, optimized Parquet writer.\nSecurity\nThe more data you access with Trino, the more it becomes critical to secure it.\nWith that in mind we added a lot of improvements:\nThe Web UI now requires\nauthentication. Various actions such as viewing query details, killing\nqueries, etc., are protected with authorization checks based on the identity\nof the user. Additionally, the UI now supports OAuth2 for user identification.\nExternal and internal APIs are now properly secured with authentication and\nauthorization checks. Importantly, this fixes a CVE reported\nvulnerability\nthat affects all older versions of Presto®.\nA new mechanism to externalize secrets in configuration\n files that makes it easier to integrate\n with third-party secret managers and deployment tools.\nSupport for JSON Web Key (JWK) authentication and pluggable certificate\nauthenticators.\nAdd new Salesforce authenticator.\nThe query engine and access control SPIs now support injecting row filters and\ncolumn masks.\nNew syntax for managing permissions (GRANT/REVOKE on schema,\nALTER TABLE/SCHEMA/VIEW ... SET AUTHORIZATION).\nData sources\nTrino empowers you to use one platform to access all data sources. Connectors\nenable this and we added numerous new connectors:\nIceberg\nPrometheus\nOracle\nPinot\nDruid\nBigQuery\nMemSQL\nAll other connectors received a large host of improvements. Let’s just look at\ntwo popular connectors:\nHive connector for HDFS, S3, Azure and cloud object storage systems\nComplex Hive views, allows integration with Hive or simplifying\nmigration from Hive\nACID transactional tables with INSERT\nand DELETE support\nBuilt-in storage caching and\nsupport for external caching with\nAlluxio\nNew procedures: system.drop_stats(), register_partition(),\nunregister_partition()\nSupport for Azure object storage\nSupport for S3 encrypted files, flexible S3 security mappings and\nIntelligent-Tiering S3 storage\nElasticsearch connector\nThe Elasticsearch connector\nreceived numerous powerful improvements:\nPassword authentication\nSupport for index aliases\nSupport for array types, Nested, and IP type\nSupport for Elasticsearch 7.x\nRuntime improvements\nOperating and maintaining a Trino cluster takes a significant amount of\nresources. So any work to improve the runtime needs have a significant positive\nimpact:\nRequirement to use Java\n11, with\nbetter GC performance, overall performance, and improved container\nsupport\nSupport for ARM64-based processors to run Trino\nSupport for minimum number of workers before query starts, useful for\nimplementing autoscaling\nData integrity checks for network transfers to prevent data corruption during\nprocessing\nEverything else\nThere is so much more to capture, and you really would have to read all the\nrelease notes in detail to know it\nall. To safe you from that, here are a few more noteworthy changes:\nExperimental support for materialized views in Iceberg connector\nJDBC driver backward compatibility tests\nSupport for multiple event listeners\nAdded Python client support for exec with parameters\nNew look and navigation for the documentation, and\nlots of new content\nCommunity resources and events\nBeyond the raw code and helping each other, the community collaborated on other\nhelpful resources like books and in-depth video tutorials.\nMatt, Manfred,\nand Martin  published the book Trino: The\nDefinitive Guide with O’Reilly. Over 5000\nreaders took advantage of the free digital copy.\nBrian and Manfred launched the live streaming event Trino Community\nBroadcast, and grew their audience and back catalog to\ninclude some very useful material. If you have not seen it yet, go and watch\nsome old episodes and join us in the next ones.\nWe also had a number of other online events and presentations, with direct\nparticipation of our community members:\nA dedicated conference event\nfor the community in Japan was very successful.\nThe Argentina Big Data Meetup had a large audience from the\ncommunity in South America\nA series of virtual events around the project started with a roadmap and\noverview meeting and included a number real world use case examples at scale:\nState of Trino\nTrino at Pinterest\nTrino Migration at ARM Treasure Data\nTrino at Zuora\nAnother series of training classes with the project founders was hugely\nsuccessful. It includes very valuable content for any Trino user, from beginners\nto experts, that you should not miss:\nAdvanced SQL in Trino with David\nUnderstanding and Tuning Trino Query Processing with Martin\nSecuring Trino with Dain\nConfiguring and Tuning Trino with Dain\nConclusion\n2020 was a wild ride for us all. Trino and the Trino community definitely\nemerged as a winner, and we are looking forward to a very bright future with you\nall.\nA couple of ongoing work is already underway and very promising:\nOptimized Parquet reader, on par with ORC reader support\nSupport for SQL UPDATE and MERGE statements\nOauth2 support for JDBC\nSupport for SQL WINDOW clause and MATCH_RECOGNIZE usage\nWe’re starting the new year with a shiny new name, a cute little bunny, and a\nvery vibrant community. The future is looking great for Trino!\nDon’t hesitate and miss out on all the benefits of Trino. Join us on\nSlack to get started!"
author: "Martin Traverso, Manfred Moser, Brian Olsen"
contentHtml: "<div>\n<article>\n  <div><p><strong>Wow!</strong> If you would have to sum up what happened in the last year in this\ngreat community, <strong>wow</strong> would be it. It is truly awe-inspiring to be part of\nthis incredible journey of Trino. Oh yeah, on that note. Our community and\nproject <a target=\"_blank\" href=\"https://trino.io/blog/2020/12/27/announcing-trino\">chose the new name Trino</a>,\nto be able to continue to innovate and develop freely as a community of peers.\nPresto® and Presto® SQL are a thing of the past.</p>\n<p>Now that is out of the way, let’s dive right in and see what all our community\nmembers across the globe have created with us!</p>\n<!--more-->\n<p><a target=\"_blank\" href=\"https://trino.io/blog/2020/01/01/2019-summary\">2019 was a big year for us</a>, but check\nout how 2020 eclipsed even that!</p>\n<h2 id=\"by-the-numbers\">\n    By the numbers <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#by-the-numbers\">#</a>\n</h2>\n<p>Even the size and growth of <a target=\"_blank\" href=\"https://trino.io/slack\">our community on Slack</a> is impressive:</p>\n<ul>\n  <li>Started in January 2020 with ~1600 members and 280 weekly active</li>\n  <li>Over 3200 members by December 2020</li>\n  <li>560 members active weekly</li>\n</ul>\n<p>The innovation and change of <a target=\"_blank\" href=\"https://github.com/trinodb/trino\">the source code on GitHub</a> is a result of the hard work of the community:</p>\n<ul>\n  <li>Over 4000 commits merged</li>\n  <li>More than 2800 pull requests received</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/release.html#releases-2020\">23 releases</a>, nearly every two\nweeks basically!</li>\n</ul>\n<p>As you can see, much of the excitement around the name change has quickly\nincreased the number of stars we have on GitHub. While some of this certainly\nstems from an initial buzz around a shiny new name, we also believe that this\nname change has brought clarity to the community. Trino is an improved version,\nsupported by the founders and creators of Presto®, along with the major\ncontributors.</p>\n<p>And if you have not done so already, make sure to <a target=\"_blank\" href=\"https://github.com/trinodb/trino\">star the\nrepository</a> and <a target=\"_blank\" href=\"https://trino.io/slack\">join us on slack</a>.</p>\n<h2 id=\"features-and-code\">\n    Features and code <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#features-and-code\">#</a>\n</h2>\n<p>While everything mentioned is already exciting, the true work is visible in the\nnew features and improvements in Trino. It is a long list, but read on. You\nwon’t want to miss anything.</p>\n<h3 id=\"improvements-to-ansi-sql-support\">\n    Improvements to ANSI SQL support <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#improvements-to-ansi-sql-support\">#</a>\n</h3>\n<p>A core feature of Trino is the ability to use the same standard SQL for any\nconnected data source. These improvements empower all users.</p>\n<ul>\n  <li>Variable-precision temporal types, with precision down to picoseconds\n(10<sup>−12</sup>s). This a very important feature for any time critical\nsystems such as financial transactions processing</li>\n  <li>Correct, and now SQL specification compliant timestamp semantics, making\nmigration of SQL statements from other compliant systems such as many RDBMSs\neasier</li>\n  <li>Implicit coercions for <code>INSERT</code> clause</li>\n  <li>Support for <code>RANGE</code> and <code>GROUPS</code>-based window frames</li>\n  <li>More support for various shapes of correlated subqueries</li>\n  <li>Support for <code>INTERSECT ALL</code> and <code>EXCEPT ALL</code></li>\n  <li>Parameter support in <code>LIMIT</code>, <code>FETCH FIRST</code>, and <code>OFFSET</code> clause</li>\n  <li>Experimental support for <a target=\"_blank\" href=\"https://trino.io/docs/current/sql/select.html?highlight=recursive#with-recursive-clause\">recursive queries</a></li>\n  <li>Enforcement of <code>NOT NULL</code> constraints when inserting data</li>\n  <li>Quantified comparisons (e.g., <code>&gt; ALL (...)</code>) in aggregation queries</li>\n</ul>\n<h3 id=\"other-query-improvements\">\n    Other query improvements <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#other-query-improvements\">#</a>\n</h3>\n<p>A number of other features were added to make querying your data sources with\nTrino even more powerful:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/language/types.html#t-digest\">T-digest data type</a> and functions\nfor approximate quantile computations</li>\n  <li>Support for setting and reading column comments</li>\n  <li>Numerous new functions including <code>concat_ws()</code>, <code>regexp_count()</code>,\n<code>regexp_position()</code>, <code>contains_sequence()</code>, <code>murmur3()</code>,\n<code>from_unixtime_nanos()</code>, <code>from_iso8601_timestamp_nanos()</code>,\n<code>human_readable_seconds()</code>, <code>bitwise</code> operations, <code>luhn_check()</code>,\n<code>approx_most_frequent()</code>, <code>translate()</code>, <code>starts_with()</code></li>\n</ul>\n<h2 id=\"performance\">\n    Performance <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#performance\">#</a>\n</h2>\n<p>Trino is already <a target=\"_blank\" href=\"https://trino.io/\">ludicrously fast</a>. But then again, even faster is\nbetter, so we worked on that:</p>\n<ul>\n  <li>Improved pushdown of complex operations into connectors, including\n<a target=\"_blank\" href=\"https://trino.io/docs/current/optimizer/pushdown.html\">aggregation pushdown</a> and TopN\npushdown.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/06/14/dynamic-partition-pruning\">Dynamic filtering and partition pruning</a>, which can improve performance of\nhighly selective joins manyfold.</li>\n  <li>Cost-based decisions for queries containing <code>IN &lt;subquery&gt;</code> in <code>WHERE</code> clause.</li>\n  <li>Information_schema performance improvements, which benefit third-party BI\ntools that need to inspect table metadata, for example DBeaver, Datagrip,\nPower BI, Tableau, Looker, and others.</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/08/14/dereference-pushdown\">Faster queries on nested data in Parquet and ORC</a>.</li>\n  <li>Faster and more accurate <code>approx_percentile</code>, based on t-digest data structure.</li>\n  <li>Support of Bloom filters in ORC.</li>\n  <li>Experimental, optimized Parquet writer.</li>\n</ul>\n<h2 id=\"security\">\n    Security <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#security\">#</a>\n</h2>\n<p>The more data you access with Trino, the more it becomes critical to secure it.\nWith that in mind we added a lot of improvements:</p>\n<ul>\n  <li>The <a target=\"_blank\" href=\"https://trino.io/docs/current/admin/web-interface.html\">Web UI</a> now requires\nauthentication. Various actions such as viewing query details, killing\nqueries, etc., are protected with authorization checks based on the identity\nof the user. Additionally, the UI now supports OAuth2 for user identification.</li>\n  <li>External and internal APIs are now properly secured with authentication and\nauthorization checks. Importantly, this fixes a <a target=\"_blank\" href=\"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-15087\">CVE reported\nvulnerability</a>\nthat affects all older versions of Presto®.</li>\n  <li>A <a target=\"_blank\" href=\"https://trino.io/docs/current/security/secrets.html\">new mechanism to externalize secrets in configuration\n files</a> that makes it easier to integrate\n with third-party secret managers and deployment tools.</li>\n  <li>Support for JSON Web Key (JWK) authentication and <a target=\"_blank\" href=\"https://trino.io/docs/current/develop/certificate-authenticator.html\">pluggable certificate\nauthenticators</a>.</li>\n  <li>Add new <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/docs/current/security/salesforce.html\">Salesforce authenticator</a>.</li>\n  <li>The query engine and access control SPIs now support injecting row filters and\ncolumn masks.</li>\n  <li>New syntax for managing permissions (<code>GRANT/REVOKE</code> on schema,\n<code>ALTER TABLE/SCHEMA/VIEW ... SET AUTHORIZATION</code>).</li>\n</ul>\n<h2 id=\"data-sources\">\n    Data sources <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#data-sources\">#</a>\n</h2>\n<p>Trino empowers you to use one platform to access all data sources. Connectors\nenable this and we added numerous new connectors:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/iceberg.html\">Iceberg</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/prometheus.html\">Prometheus</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/oracle.html\">Oracle</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/pinot.html\">Pinot</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/druid.html\">Druid</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/bigquery.html\">BigQuery</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/memsql.html\">MemSQL</a></li>\n</ul>\n<p>All other connectors received a large host of improvements. Let’s just look at\ntwo popular connectors:</p>\n<h3 id=\"hive-connector-for-hdfs-s3-azure-and-cloud-object-storage-systems\">\n    Hive connector for HDFS, S3, Azure and cloud object storage systems <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#hive-connector-for-hdfs-s3-azure-and-cloud-object-storage-systems\">#</a>\n</h3>\n<ul>\n  <li>Complex Hive views, allows integration with Hive or simplifying\nmigration from Hive</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/06/01/hive-acid\">ACID transactional tables</a> with <code>INSERT</code>\nand <code>DELETE</code> support</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/hive-caching.html\">Built-in storage caching</a> and\nsupport for <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/hive-alluxio.html\">external caching with\nAlluxio</a></li>\n  <li>New procedures: <code>system.drop_stats()</code>, <code>register_partition()</code>,\n<code>unregister_partition()</code></li>\n  <li>Support for <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/hive-azure.html\">Azure object storage</a></li>\n  <li>Support for <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/hive-s3.html\">S3 encrypted files, flexible S3 security mappings and\nIntelligent-Tiering S3 storage</a></li>\n</ul>\n<h3 id=\"elasticsearch-connector\">\n    Elasticsearch connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#elasticsearch-connector\">#</a>\n</h3>\n<p>The <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/elasticsearch.html\">Elasticsearch connector</a>\nreceived numerous powerful improvements:</p>\n<ul>\n  <li>Password authentication</li>\n  <li>Support for index aliases</li>\n  <li>Support for array types, Nested, and IP type</li>\n  <li>Support for Elasticsearch 7.x</li>\n</ul>\n<h2 id=\"runtime-improvements\">\n    Runtime improvements <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#runtime-improvements\">#</a>\n</h2>\n<p>Operating and maintaining a Trino cluster takes a significant amount of\nresources. So any work to improve the runtime needs have a significant positive\nimpact:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/installation/deployment.html#java-runtime-environment\">Requirement to use Java\n11</a>, with\nbetter GC performance, overall performance, and improved container\nsupport</li>\n  <li>Support for ARM64-based processors to run Trino</li>\n  <li>Support for minimum number of workers before query starts, useful for\nimplementing autoscaling</li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/06/25/data-integrity-protection\">Data integrity checks for network transfers</a> to prevent data corruption during\nprocessing</li>\n</ul>\n<h2 id=\"everything-else\">\n    Everything else <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#everything-else\">#</a>\n</h2>\n<p>There is so much more to capture, and you really would have to read all the\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release.html#releases-2020\">release notes</a> in detail to know it\nall. To safe you from that, here are a few more noteworthy changes:</p>\n<ul>\n  <li>Experimental support for materialized views in Iceberg connector</li>\n  <li>JDBC driver backward compatibility tests</li>\n  <li>Support for multiple event listeners</li>\n  <li>Added Python client support for exec with parameters</li>\n  <li>New look and navigation for the <a target=\"_blank\" href=\"https://trino.io/docs/current/index.html\">documentation</a>, and\nlots of new content</li>\n</ul>\n<h2 id=\"community-resources-and-events\">\n    Community resources and events <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#community-resources-and-events\">#</a>\n</h2>\n<p>Beyond the raw code and helping each other, the community collaborated on other\nhelpful resources like books and in-depth video tutorials.</p>\n<p><a target=\"_blank\" href=\"https://github.com/mattsfuller\">Matt</a>, <a target=\"_blank\" href=\"https://github.com/mosabua\">Manfred</a>,\nand <a target=\"_blank\" href=\"https://github.com/martint\">Martin</a>  published the book <a target=\"_blank\" href=\"https://trino.io/trino-the-definitive-guide\">Trino: The\nDefinitive Guide</a> with O’Reilly. Over 5000\nreaders took advantage of the <a target=\"_blank\" href=\"https://trino.io/blog/2020/04/11/the-definitive-guide\">free digital copy</a>.</p>\n<p>Brian and Manfred launched the live streaming event <a target=\"_blank\" href=\"https://trino.io/broadcast/\">Trino Community\nBroadcast</a>, and grew their audience and back catalog to\ninclude some very useful material. If you have not seen it yet, go and <a target=\"_blank\" href=\"https://trino.io/broadcast/episodes\">watch\nsome old episodes</a> and join us in the next ones.</p>\n<p>We also had a number of other online events and presentations, with direct\nparticipation of our community members:</p>\n<ul>\n  <li>A <a target=\"_blank\" href=\"https://trino.io/blog/2020/11/21/a-report-about-presto-conference-tokyo-2020\">dedicated conference event</a>\nfor the community in Japan was very successful.</li>\n  <li>The <a target=\"_blank\" href=\"https://trino.io/blog/2020/09/28/argentina-big-data-meetup\">Argentina Big Data Meetup</a> had a large audience from the\ncommunity in South America</li>\n</ul>\n<p>A series of virtual events around the project started with a roadmap and\noverview meeting and included a number real world use case examples at scale:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/05/15/state-of-presto\">State of Trino</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/07/22/presto-summit-pinterest\">Trino at Pinterest</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/07/06/presto-summit-arm-td\">Trino Migration at ARM Treasure Data</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/06/16/presto-summit-zuora\">Trino at Zuora</a></li>\n</ul>\n<p>Another series of training classes with the project founders was hugely\nsuccessful. It includes very valuable content for any Trino user, from beginners\nto experts, that you should not miss:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/07/15/training-advanced-sql\">Advanced SQL in Trino with David</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/07/30/training-query-tuning\">Understanding and Tuning Trino Query Processing with Martin</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/08/13/training-security\">Securing Trino with Dain</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2020/08/27/training-performance\">Configuring and Tuning Trino with Dain</a></li>\n</ul>\n<h2 id=\"conclusion\">\n    Conclusion <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/08/2020-review.html#conclusion\">#</a>\n</h2>\n<p>2020 was a wild ride for us all. Trino and the Trino community definitely\nemerged as a winner, and we are looking forward to a very bright future with you\nall.</p>\n<p>A couple of ongoing work is already underway and very promising:</p>\n<ul>\n  <li>Optimized Parquet reader, on par with ORC reader support</li>\n  <li>Support for SQL <code>UPDATE</code> and <code>MERGE</code> statements</li>\n  <li>Oauth2 support for JDBC</li>\n  <li>Support for SQL <code>WINDOW</code> clause and <code>MATCH_RECOGNIZE</code> usage</li>\n</ul>\n<p>We’re starting the new year with a shiny new name, a cute little bunny, and a\nvery vibrant community. The future is looking great for Trino!</p>\n<p>Don’t hesitate and miss out on all the benefits of Trino. Join us <a target=\"_blank\" href=\"https://trino.io/slack\">on\nSlack</a> to get started!</p>\n  </div>\n</article>\n</div>"
---

Wow! If you would have to sum up what happened in the last year in this
great community, wow would be it. It is truly awe-inspiring to be part of
this incredible journey of Trino. Oh yeah, on that note. Our community and
project chose the new name Trino,
to be able to continue to innovate and develop freely as a community of peers.
Presto® and Presto® SQL are a thing of the past.
Now that is out of the way, let’s dive right in and see what all our community
members across the globe have created with us!
2019 was a big year for us, but check
out how 2020 eclipsed even that!
By the numbers
Even the size and growth of our community on Slack is impressive:
Started in January 2020 with ~1600 members and 280 weekly active
Over 3200 members by December 2020
560 members active weekly
The innovation and change of the source code on GitHub is a result of the hard work of the community:
Over 4000 commits merged
More than 2800 pull requests received
23 releases, nearly every two
weeks basically!
As you can see, much of the excitement around the name change has quickly
increased the number of stars we have on GitHub. While some of this certainly
stems from an initial buzz around a shiny new name, we also believe that this
name change has brought clarity to the community. Trino is an improved version,
supported by the founders and creators of Presto®, along with the major
contributors.
And if you have not done so already, make sure to star the
repository and join us on slack.
Features and code
While everything mentioned is already exciting, the true work is visible in the
new features and improvements in Trino. It is a long list, but read on. You
won’t want to miss anything.
Improvements to ANSI SQL support
A core feature of Trino is the ability to use the same standard SQL for any
connected data source. These improvements empower all users.
Variable-precision temporal types, with precision down to picoseconds
(10−12s). This a very important feature for any time critical
systems such as financial transactions processing
Correct, and now SQL specification compliant timestamp semantics, making
migration of SQL statements from other compliant systems such as many RDBMSs
easier
Implicit coercions for INSERT clause
Support for RANGE and GROUPS-based window frames
More support for various shapes of correlated subqueries
Support for INTERSECT ALL and EXCEPT ALL
Parameter support in LIMIT, FETCH FIRST, and OFFSET clause
Experimental support for recursive queries
Enforcement of NOT NULL constraints when inserting data
Quantified comparisons (e.g., > ALL (...)) in aggregation queries
Other query improvements
A number of other features were added to make querying your data sources with
Trino even more powerful:
T-digest data type and functions
for approximate quantile computations
Support for setting and reading column comments
Numerous new functions including concat_ws(), regexp_count(),
regexp_position(), contains_sequence(), murmur3(),
from_unixtime_nanos(), from_iso8601_timestamp_nanos(),
human_readable_seconds(), bitwise operations, luhn_check(),
approx_most_frequent(), translate(), starts_with()
Performance
Trino is already ludicrously fast. But then again, even faster is
better, so we worked on that:
Improved pushdown of complex operations into connectors, including
aggregation pushdown and TopN
pushdown.
Dynamic filtering and partition pruning, which can improve performance of
highly selective joins manyfold.
Cost-based decisions for queries containing IN <subquery> in WHERE clause.
Information_schema performance improvements, which benefit third-party BI
tools that need to inspect table metadata, for example DBeaver, Datagrip,
Power BI, Tableau, Looker, and others.
Faster queries on nested data in Parquet and ORC.
Faster and more accurate approx_percentile, based on t-digest data structure.
Support of Bloom filters in ORC.
Experimental, optimized Parquet writer.
Security
The more data you access with Trino, the more it becomes critical to secure it.
With that in mind we added a lot of improvements:
The Web UI now requires
authentication. Various actions such as viewing query details, killing
queries, etc., are protected with authorization checks based on the identity
of the user. Additionally, the UI now supports OAuth2 for user identification.
External and internal APIs are now properly secured with authentication and
authorization checks. Importantly, this fixes a CVE reported
vulnerability
that affects all older versions of Presto®.
A new mechanism to externalize secrets in configuration
 files that makes it easier to integrate
 with third-party secret managers and deployment tools.
Support for JSON Web Key (JWK) authentication and pluggable certificate
authenticators.
Add new Salesforce authenticator.
The query engine and access control SPIs now support injecting row filters and
column masks.
New syntax for managing permissions (GRANT/REVOKE on schema,
ALTER TABLE/SCHEMA/VIEW ... SET AUTHORIZATION).
Data sources
Trino empowers you to use one platform to access all data sources. Connectors
enable this and we added numerous new connectors:
Iceberg
Prometheus
Oracle
Pinot
Druid
BigQuery
MemSQL
All other connectors received a large host of improvements. Let’s just look at
two popular connectors:
Hive connector for HDFS, S3, Azure and cloud object storage systems
Complex Hive views, allows integration with Hive or simplifying
migration from Hive
ACID transactional tables with INSERT
and DELETE support
Built-in storage caching and
support for external caching with
Alluxio
New procedures: system.drop_stats(), register_partition(),
unregister_partition()
Support for Azure object storage
Support for S3 encrypted files, flexible S3 security mappings and
Intelligent-Tiering S3 storage
Elasticsearch connector
The Elasticsearch connector
received numerous powerful improvements:
Password authentication
Support for index aliases
Support for array types, Nested, and IP type
Support for Elasticsearch 7.x
Runtime improvements
Operating and maintaining a Trino cluster takes a significant amount of
resources. So any work to improve the runtime needs have a significant positive
impact:
Requirement to use Java
11, with
better GC performance, overall performance, and improved container
support
Support for ARM64-based processors to run Trino
Support for minimum number of workers before query starts, useful for
implementing autoscaling
Data integrity checks for network transfers to prevent data corruption during
processing
Everything else
There is so much more to capture, and you really would have to read all the
release notes in detail to know it
all. To safe you from that, here are a few more noteworthy changes:
Experimental support for materialized views in Iceberg connector
JDBC driver backward compatibility tests
Support for multiple event listeners
Added Python client support for exec with parameters
New look and navigation for the documentation, and
lots of new content
Community resources and events
Beyond the raw code and helping each other, the community collaborated on other
helpful resources like books and in-depth video tutorials.
Matt, Manfred,
and Martin  published the book Trino: The
Definitive Guide with O’Reilly. Over 5000
readers took advantage of the free digital copy.
Brian and Manfred launched the live streaming event Trino Community
Broadcast, and grew their audience and back catalog to
include some very useful material. If you have not seen it yet, go and watch
some old episodes and join us in the next ones.
We also had a number of other online events and presentations, with direct
participation of our community members:
A dedicated conference event
for the community in Japan was very successful.
The Argentina Big Data Meetup had a large audience from the
community in South America
A series of virtual events around the project started with a roadmap and
overview meeting and included a number real world use case examples at scale:
State of Trino
Trino at Pinterest
Trino Migration at ARM Treasure Data
Trino at Zuora
Another series of training classes with the project founders was hugely
successful. It includes very valuable content for any Trino user, from beginners
to experts, that you should not miss:
Advanced SQL in Trino with David
Understanding and Tuning Trino Query Processing with Martin
Securing Trino with Dain
Configuring and Tuning Trino with Dain
Conclusion
2020 was a wild ride for us all. Trino and the Trino community definitely
emerged as a winner, and we are looking forward to a very bright future with you
all.
A couple of ongoing work is already underway and very promising:
Optimized Parquet reader, on par with ORC reader support
Support for SQL UPDATE and MERGE statements
Oauth2 support for JDBC
Support for SQL WINDOW clause and MATCH_RECOGNIZE usage
We’re starting the new year with a shiny new name, a cute little bunny, and a
very vibrant community. The future is looking great for Trino!
Don’t hesitate and miss out on all the benefits of Trino. Join us on
Slack to get started!
