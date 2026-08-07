---
title: "A decade of query engine innovation"
link: "https://trino.io/blog/2022/08/04/decade-innovation.html"
guid: "https://trino.io/blog/2022/08/04/decade-innovation.html"
pubDate: "2022-08-04T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "It’s amazing how far we have come! Our massively-parallel processing SQL query\nengine, Trino, has really grown up. We have moved beyond just querying object\nstores using Hive, beyond just one company using the project, beyond usage in\nSilicon Valley, beyond simple SQL SELECT statements, and definitely also\nbeyond our expectations. Let’s have a look at some of the great technical and\narchitectural changes the project underwent, and how we all benefit from the\ncommitment to quality, openness and collaboration.\nRuntime and deployment\nStarting with how you even run Trino and install it, numerous changes came about\nin the last decade. We moved from Java 7 to Java 8, then to Java 11, and only\nrecently to the latest supported Java LTS release - Java 17. Each time we\nbenefited from the innovations in the runtime performance as well as the\nimproved Java language features. With Java 17, we are just about to start a lot\nof these improvements.\nWhen it comes to actually running and deploying\nTrino, the tarball is still a good choice\nfor simple installation and as a base for other packages. Over time we added\nRPM archive support, which is being replaced more and more by Docker\ncontainers. The container images also enable modern deployment on Kubernetes\nwith our Helm chart.\nAnd let us add one last note about deployments. Trino was always designed to\nwork on large servers. However the actual growth in a decade in the real world\nhas amazing to see. Machine sizes keep growing to hundreds of CPU cores and\ncloser to a terabyte of memory, and these truly large machines are now running\nas clusters with many workers of that size. And more and more of these\ndeployments take advantage of our added support for the ARM processor\narchitecture and the increasing availability of suitable servers from the\ncloud providers.\nSecurity\nWhat is security, authentication, authorization? In the beginning none of this\nexisted in the first releases of Trino. Two years after launch we added first\nsimple authentication and authorization support. Today the days when Kerberos\nwas critical, and you needed to use the Java KeyStore in most deployments are\nlong gone. The wide adoption of Trino led to improvements such as support for\nautomatic certificate creation and TLS for internal\ncommunication,\nsecret injection from environment\nvariables, and the many\nauthentication\ntypes\nstarting with LDAP and password file, to the modern OAuth2.0 and SSO systems.\nTrino supports fine-grained access control and security management SQL commands\nlike GRANT and\nREVOKE.\nYou can secure connections from client tools, and use numerous methods to ensure\nsecured access to your data sources.\nClient tools and integrations\nIn the very beginning all you could do is submit a query to the client REST\nAPI. Very quickly\nwe added the Trino CLI\nand the JDBC driver. And\nwhile it has continued to be widely used in the community, and gathered great\nfeatures such as command-completion and history, different output formats, and\nmuch more, the Trino CLI is not the only tool anymore. The JDBC driver, the\nPython client, the Go\nclient, and the ODBC driver from\nStarburst, all expanded the support for different\nclient tools. You can query Trino in your Java-based IDE, such as IntelliJ\nIDEA, or database tool, such as DBeaver or\nMetabase. You can take advantage of visualizations\nin Apache Superset, or automate with Apache\nAirflow, dbt, or\nApache Flink. And many commercial tools such as\nTableau, Looker,\nPowerBI, or\nThoughtSpot also proudly support Trino users.\nSQL\nAll the client tools and integrations rely on the rich SQL support of Trino,\nwhich has grown tremendously. Purely analytics-related support for SELECT and\nall its complexities was not enough. Trino gained support for data management to\ncreate schema and tables, but also views and materialized views. And with that\nwrite support we needed INSERT, UPDATE, and\nDELETE.\nThat’s all done and MERGE is next. But the core language features were not\nable to satisfy the needs of our users. We added functions for a large variety\nof topics ranging from simple string and date\nfunctions to JSON\nsupport, geospatial\nfunctions, and many\nothers.\nFrom the core language perspective we added newer SQL functionality, such as\nwindow functions and MATCH_RECOGNIZE support. Currently we are on a journey to implement\nsupport for table functions, including polymorphic table functions.\nConnectors and data sources\nWhen it comes to the new SQL language features, there are two categories. There\nare generic functions and statements that build on top of commonly used\nfunctionality like SELECT. These typically work with any connector and therefore\nany data sources. And then there are SQL language features that need support in\na connector. After all, inserting data in PostgreSQL and an object storage\nsystem are very different. Our community has been hard at work however, and\nnumerous connectors have gone way beyond simple read-only access.\nLooking at the number of available connectors, innovation has been tremendous.\nThe original Hive connector with support for HDFS and a Hive Metastore Service,\nbecame a powerhouse of features. Support for object storage systems including\nAmazon S3 and compatible systems, Azure Data Lake Storage, and Google Cloud\nStorage, was supplemented by support for Amazon Glue as metastore. We also\nconstantly added support for different file formats in these systems, and\nimproved performance for ORC, Parquet, Avro, and others.\nThe initial idea to support other data sources led to connectors for over a\ndozen other databases, including relational systems such\nPostgreSQL,\nOracle, SQL\nServer, and many others. We also\ngained support for Elasticsearch and\nOpenSearch, MongoDB,\nApache Kafka, and other systems that traditionally\nare not available to query with SQL. Trino unlocks completely new use cases for\nthese systems.\nThe wide range of supported systems includes traditional data lakes and data\nwarehouses. With the emerging new table formats and the related Trino\nconnectors, our project is a powerful tool to run your lakehouse system. Delta\nLake and Apache Iceberg\nconnectors are already capable of full read and write operations and include\nnumerous other features. An Apache Hudi connector is\nin the works and coming soon.\nWe also have robust and widely used connectors for real-time analytics systems\nlike Apache Pinot, Apache\nDruid and Clickhouse,\nthat are constantly improved by the community.\nQuery processing and performance\nLast but not least, these queries also need to be processed. From the start high\nefficiency and low latency were a core design goal, and with features like\nnative compilation the resulting performance surpassed other systems. Over the\nyears our query analyzer and planner was supplemented by more and more\nsophisticated algorithms and features. Connectors learned to retrieve and manage\ntable statistics, the optimizer was created and morphed into a cost-based\noptimizer, and we added further\nimprovements that benefit query processing performance. We added dynamic\nfiltering, dynamic partition pruning, predicate pushdown, join pushdown,\naggregate function pushdown and numerous others. Each of these improvements was\nalso finely tuned, and runs in production with huge workloads providing us more\ndata on how to improve next.\nOne large pivot we recently added was the addition of fault-tolerant query\nexecution mode. Queries execution\ncan survive cluster node failures when this feature is enabled. Parts of the\nexecution can be retried and query processing can proceed. Trino is moving on\nfrom the best analytics engine to be the best query engine for many more use\ncase!\nLooking forward\nAs you can see there is a lot to look back to and celebrate. But while we are\ndefinitely proud of our successes working with the community, we see no time to rest.\nThere are many more improvements we are working on. Just to tease you a bit, let\nus just mention that there will be more polymorphic table functions, new\nlakehouse connectors and features, more client tools, and maybe even dynamic\nconfiguration of the cluster.\nWhat would you like to add? Join us to celebrate and innovate towards your\nfavorite features. And who knows, we might see you in the Trino Summit in November, or in a\nfuture episode of the Trino Community Broadcast."
author: "Manfred Moser, Martin Traverso, Dain Sundstrom, David Phillips"
contentHtml: "<div>\n<article>\n  <div><p>It’s amazing how far we have come! Our massively-parallel processing SQL query\nengine, Trino, has really grown up. We have moved beyond just querying object\nstores using Hive, beyond just one company using the project, beyond usage in\nSilicon Valley, beyond simple SQL <code>SELECT</code> statements, and definitely also\nbeyond our expectations. Let’s have a look at some of the great technical and\narchitectural changes the project underwent, and how we all benefit from the\n<a target=\"_blank\" href=\"https://trino.io/blog/2022/08/02/leaving-facebook-meta-best-for-trino\">commitment to quality, openness and collaboration</a>.</p>\n<!--more-->\n<h2 id=\"runtime-and-deployment\">\n    Runtime and deployment <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation.html#runtime-and-deployment\">#</a>\n</h2>\n<p>Starting with how you even run Trino and install it, numerous changes came about\nin the last decade. We moved from Java 7 to Java 8, then to Java 11, and <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/14/trino-updates-to-java-17\">only\nrecently to the latest supported Java LTS release - Java 17</a>. Each time we\nbenefited from the innovations in the runtime performance as well as the\nimproved Java language features. With <strong>Java 17</strong>, we are just about to start a lot\nof these improvements.</p>\n<p>When it comes to actually <a target=\"_blank\" href=\"https://trino.io/episodes/35\">running and deploying\nTrino</a>, the <strong>tarball</strong> is still a good choice\nfor simple installation and as a base for other packages. Over time we added\n<strong>RPM</strong> archive support, which is being replaced more and more by Docker\n<strong>containers</strong>. The container images also enable modern deployment on Kubernetes\nwith <a target=\"_blank\" href=\"https://github.com/trinodb/charts\">our Helm chart</a>.</p>\n<p>And let us add one last note about deployments. Trino was always designed to\nwork on large servers. However the actual growth in a decade in the real world\nhas amazing to see. Machine sizes keep growing to hundreds of CPU cores and\ncloser to a terabyte of memory, and these truly large machines are now running\nas clusters with many workers of that size. And more and more of these\ndeployments take advantage of our added support for the <strong>ARM processor\narchitecture</strong> and the increasing availability of suitable servers from the\ncloud providers.</p>\n<h2 id=\"security\">\n    Security <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation.html#security\">#</a>\n</h2>\n<p>What is security, authentication, authorization? In the beginning none of this\nexisted in the first releases of Trino. Two years after launch we added first\nsimple authentication and authorization support. Today the days when Kerberos\nwas critical, and you needed to use the Java KeyStore in most deployments are\nlong gone. The wide adoption of Trino led to improvements such as support for\n<a target=\"_blank\" href=\"https://trino.io/docs/current/security/internal-communication.html\">automatic certificate creation and TLS for internal\ncommunication</a>,\n<a target=\"_blank\" href=\"https://trino.io/docs/current/security/secrets.html\">secret injection from environment\nvariables</a>, and the many\n<a target=\"_blank\" href=\"https://trino.io/docs/current/security/authentication-types.html\">authentication\ntypes</a>\nstarting with LDAP and password file, to the modern OAuth2.0 and SSO systems.\nTrino supports fine-grained access control and <a target=\"_blank\" href=\"https://trino.io/docs/current/language/sql-support.html#security-operations\">security management SQL commands\nlike <code>GRANT</code> and\n<code>REVOKE</code></a>.\nYou can secure connections from client tools, and use numerous methods to ensure\nsecured access to your data sources.</p>\n<h2 id=\"client-tools-and-integrations\">\n    Client tools and integrations <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation.html#client-tools-and-integrations\">#</a>\n</h2>\n<p>In the very beginning all you could do is submit a query to the <a target=\"_blank\" href=\"https://trino.io/docs/current/develop/client-protocol.html\">client REST\nAPI</a>. Very quickly\nwe added the <a target=\"_blank\" href=\"https://trino.io/docs/current/installation/cli.html\">Trino CLI</a>\nand the <a target=\"_blank\" href=\"https://trino.io/docs/current/installation/jdbc.html\">JDBC driver</a>. And\nwhile it has continued to be widely used in the community, and gathered great\nfeatures such as command-completion and history, different output formats, and\nmuch more, the Trino CLI is not the only tool anymore. The JDBC driver, the\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino-python-client\">Python client</a>, the <a target=\"_blank\" href=\"https://github.com/trinodb/trino-go-client\">Go\nclient</a>, and the ODBC driver from\n<a target=\"_blank\" href=\"https://starburst.io/\">Starburst</a>, all expanded the support for different\nclient tools. You can query Trino in your Java-based IDE, such as IntelliJ\nIDEA, or database tool, such as <a target=\"_blank\" href=\"https://dbeaver.io/\">DBeaver</a> or\n<a target=\"_blank\" href=\"https://www.metabase.com/\">Metabase</a>. You can take advantage of visualizations\nin <a target=\"_blank\" href=\"https://superset.apache.org/\">Apache Superset</a>, or automate with <a target=\"_blank\" href=\"https://airflow.apache.org/\">Apache\nAirflow</a>, <a target=\"_blank\" href=\"https://www.getdbt.com/\">dbt</a>, or\n<a target=\"_blank\" href=\"https://flink.apache.org/\">Apache Flink</a>. And many commercial tools such as\n<a target=\"_blank\" href=\"https://www.tableau.com/\">Tableau</a>, <a target=\"_blank\" href=\"https://www.looker.com/\">Looker</a>,\n<a target=\"_blank\" href=\"https://powerbi.microsoft.com/\">PowerBI</a>, or\n<a target=\"_blank\" href=\"https://www.thoughtspot.com/\">ThoughtSpot</a> also proudly support Trino users.</p>\n<h2 id=\"sql\">\n    SQL <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation.html#sql\">#</a>\n</h2>\n<p>All the client tools and integrations rely on the rich SQL support of Trino,\nwhich has grown tremendously. Purely analytics-related support for <code>SELECT</code> and\nall its complexities was not enough. Trino gained support for data management to\ncreate schema and tables, but also views and materialized views. And with that\n<a target=\"_blank\" href=\"https://trino.io/docs/current/language/sql-support.html#write-operations\">write support we needed <code>INSERT</code>, <code>UPDATE</code>, and\n<code>DELETE</code></a>.\nThat’s all done and <code>MERGE</code> is next. But the core language features were not\nable to satisfy the needs of our users. We added functions for a large variety\nof topics ranging from simple string and <a target=\"_blank\" href=\"https://trino.io/docs/current/functions/datetime.html\">date\nfunctions</a> to <a target=\"_blank\" href=\"https://trino.io/docs/current/functions/json.html\">JSON\nsupport</a>, <a target=\"_blank\" href=\"https://trino.io/docs/current/functions/geospatial.html\">geospatial\nfunctions</a>, and many\nothers.</p>\n<p>From the core language perspective we added newer SQL functionality, such as\n<a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching\">window functions and <code>MATCH_RECOGNIZE</code> support</a>. Currently we are on a journey to implement\n<a target=\"_blank\" href=\"https://trino.io/blog/2022/07/22/polymorphic-table-functions\">support for table functions, including polymorphic table functions</a>.</p>\n<h2 id=\"connectors-and-data-sources\">\n    Connectors and data sources <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation.html#connectors-and-data-sources\">#</a>\n</h2>\n<p>When it comes to the new SQL language features, there are two categories. There\nare generic functions and statements that build on top of commonly used\nfunctionality like <code>SELECT</code>. These typically work with any connector and therefore\nany data sources. And then there are SQL language features that need support in\na connector. After all, inserting data in PostgreSQL and an object storage\nsystem are very different. Our community has been hard at work however, and\nnumerous connectors have gone way beyond simple read-only access.</p>\n<p>Looking at the number of available connectors, innovation has been tremendous.\nThe original Hive connector with support for HDFS and a Hive Metastore Service,\nbecame a powerhouse of features. Support for object storage systems including\nAmazon S3 and compatible systems, Azure Data Lake Storage, and Google Cloud\nStorage, was supplemented by support for Amazon Glue as metastore. We also\nconstantly added support for different file formats in these systems, and\nimproved performance for ORC, Parquet, Avro, and others.</p>\n<p>The initial idea to support other data sources led to connectors for over a\ndozen other databases, including relational systems such\n<a target=\"_blank\" href=\"https://www.postgresql.org/\">PostgreSQL</a>,\n<a target=\"_blank\" href=\"https://www.oracle.com/database/\">Oracle</a>, <a target=\"_blank\" href=\"https://www.microsoft.com/en-us/sql-server\">SQL\nServer</a>, and many others. We also\ngained support for <a target=\"_blank\" href=\"https://www.elastic.co/elasticsearch/\">Elasticsearch</a> and\n<a target=\"_blank\" href=\"https://www.opensearch.org/\">OpenSearch</a>, <a target=\"_blank\" href=\"https://www.mongodb.com/\">MongoDB</a>,\n<a target=\"_blank\" href=\"https://kafka.apache.org/\">Apache Kafka</a>, and other systems that traditionally\nare not available to query with SQL. Trino unlocks completely new use cases for\nthese systems.</p>\n<p>The wide range of supported systems includes traditional data lakes and data\nwarehouses. With the emerging new table formats and the related Trino\nconnectors, our project is a powerful tool to run your lakehouse system. <a target=\"_blank\" href=\"https://delta.io/\">Delta\nLake</a> and <a target=\"_blank\" href=\"https://iceberg.apache.org/\">Apache Iceberg</a>\nconnectors are already capable of full read and write operations and include\nnumerous other features. An <a target=\"_blank\" href=\"https://hudi.apache.org/\">Apache Hudi</a> connector is\nin the works and coming soon.</p>\n<p>We also have robust and widely used connectors for real-time analytics systems\nlike <a target=\"_blank\" href=\"https://pinot.apache.org/\">Apache Pinot</a>, <a target=\"_blank\" href=\"https://druid.apache.org/\">Apache\nDruid</a> and <a target=\"_blank\" href=\"https://clickhouse.com/\">Clickhouse</a>,\nthat are constantly improved by the community.</p>\n<h2 id=\"query-processing-and-performance\">\n    Query processing and performance <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation.html#query-processing-and-performance\">#</a>\n</h2>\n<p>Last but not least, these queries also need to be processed. From the start high\nefficiency and low latency were a core design goal, and with features like\nnative compilation the resulting performance surpassed other systems. Over the\nyears our query analyzer and planner was supplemented by more and more\nsophisticated algorithms and features. Connectors learned to retrieve and manage\ntable statistics, the optimizer was created and morphed into a <a target=\"_blank\" href=\"https://trino.io/blog/2019/07/04/cbo-introduction\">cost-based\noptimizer</a>, and we added further\nimprovements that benefit query processing performance. We added dynamic\nfiltering, <a target=\"_blank\" href=\"https://trino.io/blog/2020/06/14/dynamic-partition-pruning\">dynamic partition pruning</a>, predicate pushdown, join pushdown,\naggregate function pushdown and numerous others. Each of these improvements was\nalso finely tuned, and runs in production with huge workloads providing us more\ndata on how to improve next.</p>\n<p>One large pivot we recently added was the addition of <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch\">fault-tolerant query\nexecution mode</a>. Queries execution\ncan survive cluster node failures when this feature is enabled. Parts of the\nexecution can be retried and query processing can proceed. Trino is moving on\nfrom the best analytics engine to be the best query engine for many more use\ncase!</p>\n<h2 id=\"looking-forward\">\n    Looking forward <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation.html#looking-forward\">#</a>\n</h2>\n<p>As you can see there is a lot to look back to and celebrate. But while we are\ndefinitely proud of our successes working with the community, we see no time to rest.\nThere are many more improvements we are working on. Just to tease you a bit, let\nus just mention that there will be more polymorphic table functions, new\nlakehouse connectors and features, more client tools, and maybe even dynamic\nconfiguration of the cluster.</p>\n<p>What would you like to add? Join us to celebrate and innovate towards your\nfavorite features. And who knows, we might see you in the <a target=\"_blank\" href=\"https://trino.io/blog/2022/06/30/trino-summit-call-for-speakers\">Trino Summit</a> in November, or in a\nfuture episode of the <a target=\"_blank\" href=\"https://trino.io/broadcast/\">Trino Community Broadcast</a>.</p>\n  </div>\n</article>\n</div>"
---

It’s amazing how far we have come! Our massively-parallel processing SQL query
engine, Trino, has really grown up. We have moved beyond just querying object
stores using Hive, beyond just one company using the project, beyond usage in
Silicon Valley, beyond simple SQL SELECT statements, and definitely also
beyond our expectations. Let’s have a look at some of the great technical and
architectural changes the project underwent, and how we all benefit from the
commitment to quality, openness and collaboration.
Runtime and deployment
Starting with how you even run Trino and install it, numerous changes came about
in the last decade. We moved from Java 7 to Java 8, then to Java 11, and only
recently to the latest supported Java LTS release - Java 17. Each time we
benefited from the innovations in the runtime performance as well as the
improved Java language features. With Java 17, we are just about to start a lot
of these improvements.
When it comes to actually running and deploying
Trino, the tarball is still a good choice
for simple installation and as a base for other packages. Over time we added
RPM archive support, which is being replaced more and more by Docker
containers. The container images also enable modern deployment on Kubernetes
with our Helm chart.
And let us add one last note about deployments. Trino was always designed to
work on large servers. However the actual growth in a decade in the real world
has amazing to see. Machine sizes keep growing to hundreds of CPU cores and
closer to a terabyte of memory, and these truly large machines are now running
as clusters with many workers of that size. And more and more of these
deployments take advantage of our added support for the ARM processor
architecture and the increasing availability of suitable servers from the
cloud providers.
Security
What is security, authentication, authorization? In the beginning none of this
existed in the first releases of Trino. Two years after launch we added first
simple authentication and authorization support. Today the days when Kerberos
was critical, and you needed to use the Java KeyStore in most deployments are
long gone. The wide adoption of Trino led to improvements such as support for
automatic certificate creation and TLS for internal
communication,
secret injection from environment
variables, and the many
authentication
types
starting with LDAP and password file, to the modern OAuth2.0 and SSO systems.
Trino supports fine-grained access control and security management SQL commands
like GRANT and
REVOKE.
You can secure connections from client tools, and use numerous methods to ensure
secured access to your data sources.
Client tools and integrations
In the very beginning all you could do is submit a query to the client REST
API. Very quickly
we added the Trino CLI
and the JDBC driver. And
while it has continued to be widely used in the community, and gathered great
features such as command-completion and history, different output formats, and
much more, the Trino CLI is not the only tool anymore. The JDBC driver, the
Python client, the Go
client, and the ODBC driver from
Starburst, all expanded the support for different
client tools. You can query Trino in your Java-based IDE, such as IntelliJ
IDEA, or database tool, such as DBeaver or
Metabase. You can take advantage of visualizations
in Apache Superset, or automate with Apache
Airflow, dbt, or
Apache Flink. And many commercial tools such as
Tableau, Looker,
PowerBI, or
ThoughtSpot also proudly support Trino users.
SQL
All the client tools and integrations rely on the rich SQL support of Trino,
which has grown tremendously. Purely analytics-related support for SELECT and
all its complexities was not enough. Trino gained support for data management to
create schema and tables, but also views and materialized views. And with that
write support we needed INSERT, UPDATE, and
DELETE.
That’s all done and MERGE is next. But the core language features were not
able to satisfy the needs of our users. We added functions for a large variety
of topics ranging from simple string and date
functions to JSON
support, geospatial
functions, and many
others.
From the core language perspective we added newer SQL functionality, such as
window functions and MATCH_RECOGNIZE support. Currently we are on a journey to implement
support for table functions, including polymorphic table functions.
Connectors and data sources
When it comes to the new SQL language features, there are two categories. There
are generic functions and statements that build on top of commonly used
functionality like SELECT. These typically work with any connector and therefore
any data sources. And then there are SQL language features that need support in
a connector. After all, inserting data in PostgreSQL and an object storage
system are very different. Our community has been hard at work however, and
numerous connectors have gone way beyond simple read-only access.
Looking at the number of available connectors, innovation has been tremendous.
The original Hive connector with support for HDFS and a Hive Metastore Service,
became a powerhouse of features. Support for object storage systems including
Amazon S3 and compatible systems, Azure Data Lake Storage, and Google Cloud
Storage, was supplemented by support for Amazon Glue as metastore. We also
constantly added support for different file formats in these systems, and
improved performance for ORC, Parquet, Avro, and others.
The initial idea to support other data sources led to connectors for over a
dozen other databases, including relational systems such
PostgreSQL,
Oracle, SQL
Server, and many others. We also
gained support for Elasticsearch and
OpenSearch, MongoDB,
Apache Kafka, and other systems that traditionally
are not available to query with SQL. Trino unlocks completely new use cases for
these systems.
The wide range of supported systems includes traditional data lakes and data
warehouses. With the emerging new table formats and the related Trino
connectors, our project is a powerful tool to run your lakehouse system. Delta
Lake and Apache Iceberg
connectors are already capable of full read and write operations and include
numerous other features. An Apache Hudi connector is
in the works and coming soon.
We also have robust and widely used connectors for real-time analytics systems
like Apache Pinot, Apache
Druid and Clickhouse,
that are constantly improved by the community.
Query processing and performance
Last but not least, these queries also need to be processed. From the start high
efficiency and low latency were a core design goal, and with features like
native compilation the resulting performance surpassed other systems. Over the
years our query analyzer and planner was supplemented by more and more
sophisticated algorithms and features. Connectors learned to retrieve and manage
table statistics, the optimizer was created and morphed into a cost-based
optimizer, and we added further
improvements that benefit query processing performance. We added dynamic
filtering, dynamic partition pruning, predicate pushdown, join pushdown,
aggregate function pushdown and numerous others. Each of these improvements was
also finely tuned, and runs in production with huge workloads providing us more
data on how to improve next.
One large pivot we recently added was the addition of fault-tolerant query
execution mode. Queries execution
can survive cluster node failures when this feature is enabled. Parts of the
execution can be retried and query processing can proceed. Trino is moving on
from the best analytics engine to be the best query engine for many more use
case!
Looking forward
As you can see there is a lot to look back to and celebrate. But while we are
definitely proud of our successes working with the community, we see no time to rest.
There are many more improvements we are working on. Just to tease you a bit, let
us just mention that there will be more polymorphic table functions, new
lakehouse connectors and features, more client tools, and maybe even dynamic
configuration of the cluster.
What would you like to add? Join us to celebrate and innovate towards your
favorite features. And who knows, we might see you in the Trino Summit in November, or in a
future episode of the Trino Community Broadcast.
