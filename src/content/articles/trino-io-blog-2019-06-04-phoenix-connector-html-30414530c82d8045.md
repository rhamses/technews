---
title: "Apache Phoenix Connector"
link: "https://trino.io/blog/2019/06/04/phoenix-connector.html"
guid: "https://trino.io/blog/2019/06/04/phoenix-connector.html"
pubDate: "2019-06-04T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Presto 312\nintroduces a new Apache Phoenix Connector, \nwhich allows Presto to query data stored in HBase\nusing Apache Phoenix.  This unlocks new capabilities that previously\nweren’t possible with Phoenix alone, such as federation (querying of multiple Phoenix clusters) and\njoining Phoenix data with data from other Presto data sources.\nSetup\nTo get started, simply drop in a new catalog properties file, such as etc/catalog/phoenix.properties,\nwhich defines the following:\n\nconnector.name=phoenix\nphoenix.connection-url=jdbc:phoenix:host1,host2,host3:2181:/hbase\nphoenix.config.resources=/path/to/hbase-site.xml\n\n\nThe phoenix.connection-url is the standard Phoenix connection string, which contains the zookeeper\nquorum host information and root zookeeper node.\nThe phoenix.config.resources is a comma separated list of configuration files, used to specify any\ncustom connection properties.\nSchema\nFor the most part, data types in Phoenix match up with those in Presto, with a few\nminor exceptions.  One thing\nto note, however, is that tables in Phoenix require a primary key, whereas Presto has no concept of\nprimary keys.  To handle this, the Phoenix connector uses a table property to specify the primary key. \nFor example, consider the following statement in Phoenix:\n\nCREATE TABLE example (\n  pk_part_1 varchar,\n  pk_part_2 varchar,\n  val bigint\n  CONSTRAINT pk PRIMARY KEY (pk_part_1, pk_part_2)\n)\n\n\nThe equivalent statement in Presto would look something like:\n\nCREATE TABLE phoenix.default.example (\n  pk_part_1 varchar,\n  pk_part_2 varchar,\n  val bigint\n)\nWITH (\n  rowkeys = 'pk_part_1,pk_part2'\n)\n\n\nAdditional Phoenix and HBase table properties can be specified in a \nsimilar way. \nNote also that the default (empty) schema in Phoenix will always map to a Presto schema named “default”.\nBeyond MapReduce\nWhen Phoenix users want to run long-running queries that scan over all/most of the data in a table,\nthey typically have used the Phoenix MapReduce integration. \nHowever, this has limitations, as the document states:\nNote: The SELECT query must not perform any aggregation or use DISTINCT as these are not supported by our map-reduce integration.\nThis is because the framework only constructs simple Mappers which scan over each region.  To\ndo more complex operations like aggregations, the framework would need Reducers as well.\nSomeone could implement that, but then they would essentially be on the path towards rewriting\nHive from scratch.\nPresto now provides the ability to do these more complex operations.  The Phoenix connector\nperforms the same filtered scans as the MapReduce framework, but now the Presto engine does\nthe aggregations, joins, etc.\nFederation\nWith the Phoenix connector, querying multiple Phoenix clusters is as easy as querying the\nrespective catalogs.  As a simple example, suppose we have one cluster in region us-west and\nanother cluster in us-east.  If we create two catalog files, phoenix_west.properties and\nphoenix_east.properties, then we can query both:\n\nSELECT 'us-west' as region, * FROM phoenix_west.default.example\nUNION\nSELECT 'us-east' as region, * FROM phoenix_east.default.example\n\n\nJoining with other data sources\nAnother nice feature of Presto is the ability to join data in Phoenix with other data sources.\nSuppose we have the following tables:\n\ncustomer (\n  custkey bigint,\n  comment varchar,\n  ...\n)\n\n\n\norders (\n  orderkey bigint,\n  custkey bigint,\n  totalprice double,\n  ...\n)\n\n\nSuppose further that:\nEither table can hold large amounts of data\nThe customer comment field can change frequently\nWe want to be able to query for orders with a certain totalprice range, and join with the\ncustomer table to get the comment for these orders\nPhoenix/HBase is a row-oriented storage solution with very fast lookup by primary key.  On the\nother hand, ORC is a column-oriented file format that can filter results by column value very\nefficiently.  So in this use case, it might make sense to store the customer table in Phoenix\nwith custkey as the primary key, and the orders table in ORC, perhaps in an object store like\nS3.  We can then use Presto to leverage the strengths of each of our data stores and combine OLTP\nwith OLAP:\n\nSELECT c.custkey, c.comment, o.totalprice\nFROM phoenix.tpch.customer AS c\nINNER JOIN\n(\n  SELECT custkey, totalprice FROM hive.tpch.orders WHERE totalprice < 100\n) o\nON c.custkey = o.custkey\n\n\nInserting/Updating data\nIn the prior example, since our customer data is coming from Phoenix, our OLTP store, we can\neasily insert new data:\n\nINSERT INTO phoenix.tpch.customer VALUES (101, 'some comment')\n\n\nSince Presto’s INSERT translates to Phoenix’s UPSERT, inserting is the same as updating - i.e.\nif there’s already a custkey of 101, then the comment will get updated instead.\nFuture work\nWith upcoming improvements to Presto, there will be opportunities to further optimize the performance\nof the Phoenix connector.\nOne of the biggest ways Phoenix optimizes performance is through the use of \nHBase coprocessors, which allow custom\ncode to be run on each regionserver.  For example, to do aggregations, Phoenix runs a partial\naggregation in the coprocessor of each table region, and the result for each region is then passed\nback to the client for a final aggregation.  That way, the table data itself doesn’t need to be\nsent from each region to the client - just the partial aggregation result.  However, currently only\nfilters are pushed down to the Phoenix connector.  With the ongoing work in Presto to support more\ncomplex pushdown to connectors, we will be able to\npushdown operations like aggregations to the Phoenix connector, which in turn can push them further\ndown to the HBase coprocessors.\nAnother area of potential improvement is integration with Presto’s \ncost-based optimizer,\nwhich can analyze table statistics to do things like join reordering. Phoenix already supports\nstatistics collection, with more improvements\nunderway, so this is just a matter of integrating with the Presto statistics framework.\nQuestions?\nIf you have any questions about the connector, or Phoenix in general, feel free to ask on the\nPhoenix dev mailing list: dev@phoenix.apache.org."
author: "Vincent Poon"
contentHtml: "<div>\n<article>\n  <div><p><a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-312.html\">Presto 312</a>\nintroduces a new <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/phoenix.html\">Apache Phoenix Connector</a>, \nwhich allows Presto to query data stored in <a target=\"_blank\" href=\"https://hbase.apache.org/\">HBase</a>\nusing <a target=\"_blank\" href=\"https://phoenix.apache.org/\">Apache Phoenix</a>.  This unlocks new capabilities that previously\nweren’t possible with Phoenix alone, such as federation (querying of multiple Phoenix clusters) and\njoining Phoenix data with data from other Presto data sources.</p>\n<h2 id=\"setup\">\n    Setup <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/04/phoenix-connector.html#setup\">#</a>\n</h2>\n<p>To get started, simply drop in a new catalog properties file, such as <code>etc/catalog/phoenix.properties</code>,\nwhich defines the following:</p>\n<div><pre><code>connector.name=phoenix\nphoenix.connection-url=jdbc:phoenix:host1,host2,host3:2181:/hbase\nphoenix.config.resources=/path/to/hbase-site.xml\n</code></pre></div>\n<p>The <code>phoenix.connection-url</code> is the standard Phoenix connection string, which contains the zookeeper\nquorum host information and root zookeeper node.</p>\n<p>The <code>phoenix.config.resources</code> is a comma separated list of configuration files, used to specify any\n<a target=\"_blank\" href=\"https://phoenix.apache.org/tuning.html\">custom connection properties</a>.</p>\n<h2 id=\"schema\">\n    Schema <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/04/phoenix-connector.html#schema\">#</a>\n</h2>\n<p>For the most part, data types in Phoenix match up with those in Presto, with a few\n<a target=\"_blank\" href=\"https://trino.io/docs/current/connector/phoenix.html#data-types\">minor exceptions</a>.  One thing\nto note, however, is that tables in Phoenix require a primary key, whereas Presto has no concept of\nprimary keys.  To handle this, the Phoenix connector uses a table property to specify the primary key. \nFor example, consider the following statement in Phoenix:</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>example</span> <span>(</span>\n  <span>pk_part_1</span> <span>varchar</span><span>,</span>\n  <span>pk_part_2</span> <span>varchar</span><span>,</span>\n  <span>val</span> <span>bigint</span>\n  <span>CONSTRAINT</span> <span>pk</span> <span>PRIMARY</span> <span>KEY</span> <span>(</span><span>pk_part_1</span><span>,</span> <span>pk_part_2</span><span>)</span>\n<span>)</span>\n</code></pre></div>\n<p>The equivalent statement in Presto would look something like:</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>phoenix</span><span>.</span><span>default</span><span>.</span><span>example</span> <span>(</span>\n  <span>pk_part_1</span> <span>varchar</span><span>,</span>\n  <span>pk_part_2</span> <span>varchar</span><span>,</span>\n  <span>val</span> <span>bigint</span>\n<span>)</span>\n<span>WITH</span> <span>(</span>\n  <span>rowkeys</span> <span>=</span> <span>'pk_part_1,pk_part2'</span>\n<span>)</span>\n</code></pre></div>\n<p>Additional Phoenix and HBase table properties can be specified in a \n<a target=\"_blank\" href=\"https://trino.io/docs/current/connector/phoenix.html#table-properties-phoenix\">similar way</a>. \nNote also that the default (empty) schema in Phoenix will always map to a Presto schema named “default”.</p>\n<h2 id=\"beyond-mapreduce\">\n    Beyond MapReduce <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/04/phoenix-connector.html#beyond-mapreduce\">#</a>\n</h2>\n<p>When Phoenix users want to run long-running queries that scan over all/most of the data in a table,\nthey typically have used the Phoenix <a target=\"_blank\" href=\"https://phoenix.apache.org/phoenix_mr.html\">MapReduce integration</a>. \nHowever, this has limitations, as the document states:</p>\n<blockquote>\n  <p>Note: The SELECT query must not perform any aggregation or use DISTINCT as these are not supported by our map-reduce integration.</p>\n</blockquote>\n<p>This is because the framework only constructs simple Mappers which scan over each region.  To\ndo more complex operations like aggregations, the framework would need Reducers as well.\nSomeone could implement that, but then they would essentially be on the path towards rewriting\nHive from scratch.</p>\n<p>Presto now provides the ability to do these more complex operations.  The Phoenix connector\nperforms the same filtered scans as the MapReduce framework, but now the Presto engine does\nthe aggregations, joins, etc.</p>\n<h2 id=\"federation\">\n    Federation <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/04/phoenix-connector.html#federation\">#</a>\n</h2>\n<p>With the Phoenix connector, querying multiple Phoenix clusters is as easy as querying the\nrespective catalogs.  As a simple example, suppose we have one cluster in region <code>us-west</code> and\nanother cluster in <code>us-east</code>.  If we create two catalog files, <code>phoenix_west.properties</code> and\n<code>phoenix_east.properties</code>, then we can query both:</p>\n<div><pre><code><span>SELECT</span> <span>'us-west'</span> <span>as</span> <span>region</span><span>,</span> <span>*</span> <span>FROM</span> <span>phoenix_west</span><span>.</span><span>default</span><span>.</span><span>example</span>\n<span>UNION</span>\n<span>SELECT</span> <span>'us-east'</span> <span>as</span> <span>region</span><span>,</span> <span>*</span> <span>FROM</span> <span>phoenix_east</span><span>.</span><span>default</span><span>.</span><span>example</span>\n</code></pre></div>\n<h2 id=\"joining-with-other-data-sources\">\n    Joining with other data sources <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/04/phoenix-connector.html#joining-with-other-data-sources\">#</a>\n</h2>\n<p>Another nice feature of Presto is the ability to join data in Phoenix with other data sources.\nSuppose we have the following tables:</p>\n<div><pre><code>customer (\n  custkey bigint,\n  comment varchar,\n  ...\n)\n</code></pre></div>\n<div><pre><code>orders (\n  orderkey bigint,\n  custkey bigint,\n  totalprice double,\n  ...\n)\n</code></pre></div>\n<p>Suppose further that:</p>\n<ul>\n  <li>Either table can hold large amounts of data</li>\n  <li>The customer <code>comment</code> field can change frequently</li>\n  <li>We want to be able to query for orders with a certain <code>totalprice</code> range, and join with the\ncustomer table to get the <code>comment</code> for these orders</li>\n</ul>\n<p>Phoenix/HBase is a row-oriented storage solution with very fast lookup by primary key.  On the\nother hand, ORC is a column-oriented file format that can filter results by column value very\nefficiently.  So in this use case, it might make sense to store the <code>customer</code> table in Phoenix\nwith <code>custkey</code> as the primary key, and the <code>orders</code> table in ORC, perhaps in an object store like\nS3.  We can then use Presto to leverage the strengths of each of our data stores and combine OLTP\nwith OLAP:</p>\n<div><pre><code><span>SELECT</span> <span>c</span><span>.</span><span>custkey</span><span>,</span> <span>c</span><span>.</span><span>comment</span><span>,</span> <span>o</span><span>.</span><span>totalprice</span>\n<span>FROM</span> <span>phoenix</span><span>.</span><span>tpch</span><span>.</span><span>customer</span> <span>AS</span> <span>c</span>\n<span>INNER</span> <span>JOIN</span>\n<span>(</span>\n  <span>SELECT</span> <span>custkey</span><span>,</span> <span>totalprice</span> <span>FROM</span> <span>hive</span><span>.</span><span>tpch</span><span>.</span><span>orders</span> <span>WHERE</span> <span>totalprice</span> <span>&lt;</span> <span>100</span>\n<span>)</span> <span>o</span>\n<span>ON</span> <span>c</span><span>.</span><span>custkey</span> <span>=</span> <span>o</span><span>.</span><span>custkey</span>\n</code></pre></div>\n<h2 id=\"insertingupdating-data\">\n    Inserting/Updating data <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/04/phoenix-connector.html#insertingupdating-data\">#</a>\n</h2>\n<p>In the prior example, since our <code>customer</code> data is coming from Phoenix, our OLTP store, we can\neasily insert new data:</p>\n<div><pre><code><span>INSERT</span> <span>INTO</span> <span>phoenix</span><span>.</span><span>tpch</span><span>.</span><span>customer</span> <span>VALUES</span> <span>(</span><span>101</span><span>,</span> <span>'some comment'</span><span>)</span>\n</code></pre></div>\n<p>Since Presto’s <code>INSERT</code> translates to Phoenix’s <code>UPSERT</code>, inserting is the same as updating - i.e.\nif there’s already a <code>custkey</code> of 101, then the <code>comment</code> will get updated instead.</p>\n<h2 id=\"future-work\">\n    Future work <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/04/phoenix-connector.html#future-work\">#</a>\n</h2>\n<p>With upcoming improvements to Presto, there will be opportunities to further optimize the performance\nof the Phoenix connector.</p>\n<p>One of the biggest ways Phoenix optimizes performance is through the use of \n<a target=\"_blank\" href=\"https://www.3pillarglobal.com/insights/hbase-coprocessors\">HBase coprocessors</a>, which allow custom\ncode to be run on each regionserver.  For example, to do aggregations, Phoenix runs a partial\naggregation in the coprocessor of each table region, and the result for each region is then passed\nback to the client for a final aggregation.  That way, the table data itself doesn’t need to be\nsent from each region to the client - just the partial aggregation result.  However, currently only\nfilters are pushed down to the Phoenix connector.  With the ongoing work in Presto to support more\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/18\">complex pushdown</a> to connectors, we will be able to\npushdown operations like aggregations to the Phoenix connector, which in turn can push them further\ndown to the HBase coprocessors.</p>\n<p>Another area of potential improvement is integration with Presto’s \n<a target=\"_blank\" href=\"https://www.starburstdata.com/technical-blog/introduction-to-presto-cost-based-optimizer/\">cost-based optimizer</a>,\nwhich can analyze table statistics to do things like join reordering. Phoenix already supports\n<a target=\"_blank\" href=\"https://phoenix.apache.org/update_statistics.html\">statistics collection</a>, with more improvements\nunderway, so this is just a matter of integrating with the Presto statistics framework.</p>\n<h2 id=\"questions\">\n    Questions? <a target=\"_blank\" href=\"https://trino.io/blog/2019/06/04/phoenix-connector.html#questions\">#</a>\n</h2>\n<p>If you have any questions about the connector, or Phoenix in general, feel free to ask on the\nPhoenix dev mailing list: <a target=\"_blank\" href=\"https://trino.io/cdn-cgi/l/email-protection#80e4e5f6c0f0e8efe5eee9f8aee1f0e1e3e8e5aeeff2e7\"><span>[email&#160;protected]</span></a>.</p>\n  </div>\n</article>\n</div>"
---

Presto 312
introduces a new Apache Phoenix Connector, 
which allows Presto to query data stored in HBase
using Apache Phoenix.  This unlocks new capabilities that previously
weren’t possible with Phoenix alone, such as federation (querying of multiple Phoenix clusters) and
joining Phoenix data with data from other Presto data sources.
Setup
To get started, simply drop in a new catalog properties file, such as etc/catalog/phoenix.properties,
which defines the following:

connector.name=phoenix
phoenix.connection-url=jdbc:phoenix:host1,host2,host3:2181:/hbase
phoenix.config.resources=/path/to/hbase-site.xml


The phoenix.connection-url is the standard Phoenix connection string, which contains the zookeeper
quorum host information and root zookeeper node.
The phoenix.config.resources is a comma separated list of configuration files, used to specify any
custom connection properties.
Schema
For the most part, data types in Phoenix match up with those in Presto, with a few
minor exceptions.  One thing
to note, however, is that tables in Phoenix require a primary key, whereas Presto has no concept of
primary keys.  To handle this, the Phoenix connector uses a table property to specify the primary key. 
For example, consider the following statement in Phoenix:

CREATE TABLE example (
  pk_part_1 varchar,
  pk_part_2 varchar,
  val bigint
  CONSTRAINT pk PRIMARY KEY (pk_part_1, pk_part_2)
)


The equivalent statement in Presto would look something like:

CREATE TABLE phoenix.default.example (
  pk_part_1 varchar,
  pk_part_2 varchar,
  val bigint
)
WITH (
  rowkeys = 'pk_part_1,pk_part2'
)


Additional Phoenix and HBase table properties can be specified in a 
similar way. 
Note also that the default (empty) schema in Phoenix will always map to a Presto schema named “default”.
Beyond MapReduce
When Phoenix users want to run long-running queries that scan over all/most of the data in a table,
they typically have used the Phoenix MapReduce integration. 
However, this has limitations, as the document states:
Note: The SELECT query must not perform any aggregation or use DISTINCT as these are not supported by our map-reduce integration.
This is because the framework only constructs simple Mappers which scan over each region.  To
do more complex operations like aggregations, the framework would need Reducers as well.
Someone could implement that, but then they would essentially be on the path towards rewriting
Hive from scratch.
Presto now provides the ability to do these more complex operations.  The Phoenix connector
performs the same filtered scans as the MapReduce framework, but now the Presto engine does
the aggregations, joins, etc.
Federation
With the Phoenix connector, querying multiple Phoenix clusters is as easy as querying the
respective catalogs.  As a simple example, suppose we have one cluster in region us-west and
another cluster in us-east.  If we create two catalog files, phoenix_west.properties and
phoenix_east.properties, then we can query both:

SELECT 'us-west' as region, * FROM phoenix_west.default.example
UNION
SELECT 'us-east' as region, * FROM phoenix_east.default.example


Joining with other data sources
Another nice feature of Presto is the ability to join data in Phoenix with other data sources.
Suppose we have the following tables:

customer (
  custkey bigint,
  comment varchar,
  ...
)



orders (
  orderkey bigint,
  custkey bigint,
  totalprice double,
  ...
)


Suppose further that:
Either table can hold large amounts of data
The customer comment field can change frequently
We want to be able to query for orders with a certain totalprice range, and join with the
customer table to get the comment for these orders
Phoenix/HBase is a row-oriented storage solution with very fast lookup by primary key.  On the
other hand, ORC is a column-oriented file format that can filter results by column value very
efficiently.  So in this use case, it might make sense to store the customer table in Phoenix
with custkey as the primary key, and the orders table in ORC, perhaps in an object store like
S3.  We can then use Presto to leverage the strengths of each of our data stores and combine OLTP
with OLAP:

SELECT c.custkey, c.comment, o.totalprice
FROM phoenix.tpch.customer AS c
INNER JOIN
(
  SELECT custkey, totalprice FROM hive.tpch.orders WHERE totalprice < 100
) o
ON c.custkey = o.custkey


Inserting/Updating data
In the prior example, since our customer data is coming from Phoenix, our OLTP store, we can
easily insert new data:

INSERT INTO phoenix.tpch.customer VALUES (101, 'some comment')


Since Presto’s INSERT translates to Phoenix’s UPSERT, inserting is the same as updating - i.e.
if there’s already a custkey of 101, then the comment will get updated instead.
Future work
With upcoming improvements to Presto, there will be opportunities to further optimize the performance
of the Phoenix connector.
One of the biggest ways Phoenix optimizes performance is through the use of 
HBase coprocessors, which allow custom
code to be run on each regionserver.  For example, to do aggregations, Phoenix runs a partial
aggregation in the coprocessor of each table region, and the result for each region is then passed
back to the client for a final aggregation.  That way, the table data itself doesn’t need to be
sent from each region to the client - just the partial aggregation result.  However, currently only
filters are pushed down to the Phoenix connector.  With the ongoing work in Presto to support more
complex pushdown to connectors, we will be able to
pushdown operations like aggregations to the Phoenix connector, which in turn can push them further
down to the HBase coprocessors.
Another area of potential improvement is integration with Presto’s 
cost-based optimizer,
which can analyze table statistics to do things like join reordering. Phoenix already supports
statistics collection, with more improvements
underway, so this is just a matter of integrating with the Presto statistics framework.
Questions?
If you have any questions about the connector, or Phoenix in general, feel free to ask on the
Phoenix dev mailing list: dev@phoenix.apache.org.
