---
title: "Apache Pinot Connector"
link: "https://trino.io/blog/2020/05/25/pinot-connector.html"
guid: "https://trino.io/blog/2020/05/25/pinot-connector.html"
pubDate: "2020-05-25T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Presto 334 introduces the new Pinot Connector\nwhich allows Presto to query data stored in Apache Pinot™.\nNot only does this allow access to Pinot tables but gives users the ability to do things they could not do with Pinot\nalone such as join Pinot tables to other tables and use Presto’s scalar functions, window functions and complex aggregations.\nPinot UDF’s can be directly used by including the Pinot SQL query in quotes, explained below in the Pinot SQL Passthrough section.\nThis enables aggregations and other complex query types to be done directly in Pinot.\nThis connector supports Pinot 0.3.0 and newer.\nSetup\nCreate a properties file in the catalog directory, such as etc/catalog/pinot.properties which includes at least the\nfollowing to get started:\n\nconnector.name=pinot\npinot.controller-urls=host1:9000,host2:9000\n\n\nThe pinot.controller-urls is a comma separated list of controller hosts. If Pinot is deployed via Kubernetes and you expose the \nthe pinot.controller-urls needs to point to the controller Service endpoint. The Pinot broker and server must be accessible\nvia DNS as Pinot will return hostnames and not ip addresses.\nIf you have a smaller number of Pinot servers than Presto workers or a relatively small number of rows per Pinot segment,\nyou can minimize the requests to pinot by increasing the number of Pinot segments per split (default is 1 segment per split):\n\npinot.segments-per-split=15\n\n\nIf DNS resolution is slow or you get Request timed out errors, you can increase the request timeout as follows:\n\npinot.request-timeout=3m\n\n\nSchema\nPinot supports the following data types. Currently null values are not supported. The corresponding Presto datatypes are:\nPinot Datatype\n      Presto Datatype\n    \nboolean\n      boolean\n    \ninteger\n      integer\n    \nfloat, double\n      double\n    \nstring, bytes*\n      varchar\n    \ninteger_array\n      array(integer)\n    \nfloat_array, double_array\n      array(double)\n    \nlong_array\n      array(bigint)\n    \nstring_array\n      array(varchar)\n    \nThe Pinot bytes type is converted to a hex-encoded varchar. See the Pinot docs for more information.\nPinot SQL Passthrough\nIf you would like to leverage Pinot’s fast aggregations you can use a “dynamic” table where you specify the Pinot SQL \nquery as the table name and it is passed directly to Pinot:\n\nSELECT * \nFROM pinot.default.\"SELECT col3, col4, MAX(col1), COUNT(col2) FROM pinot_table GROUP BY col3, col4\"\nWHERE col3 IN ('FOO', 'BAR') AND col4 > 50\nLIMIT 30000\n\n\nThe filter in the outer presto query will be pushed down into the Pinot query via Presto’s\napplyFilter().\nThese queries are routed to the broker and\nshould not return huge amounts of data as broker queries currently return a single response with all the results. This\nis more suited to aggregate queries.\nLimits are pushed into the “dynamic” Pinot query via Presto’s\napplyLimit().\nThe above query would yield the following Pinot PQL query:\nPinot functions such as PERCENTILEEST can be used in the quoted sql.\n\nSELECT MAX(col1), COUNT(col2)\nFROM pinot_table\nWHERE col3 IN('FOO', 'BAR') and col4 > 50\nLIMIT 30000\n\n\nIf you are returning a larger dataset you can issue a normal Presto query which will get routed to the Pinot servers which\nstore the Pinot segments. Filters and Limits are pushed down to Pinot for regular queries as well.\nFuture Work\nAs Presto and Pinot continue to evolve the Pinot connector will leverage new features such as aggregation pushdown and more."
author: "Elon Azoulay"
contentHtml: "<div>\n<article>\n  <div><p>Presto 334 introduces the new <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/pinot.html\">Pinot Connector</a>\nwhich allows Presto to query data stored in <a target=\"_blank\" href=\"https://pinot.apache.org/\">Apache Pinot™</a>.\nNot only does this allow access to Pinot tables but gives users the ability to do things they could not do with Pinot\nalone such as join Pinot tables to other tables and use Presto’s scalar functions, window functions and complex aggregations.</p>\n<p>Pinot UDF’s can be directly used by including the Pinot SQL query in quotes, explained below in the <em>Pinot SQL Passthrough</em> section.\nThis enables aggregations and other complex query types to be done directly in Pinot.</p>\n<p>This connector supports Pinot 0.3.0 and newer.</p>\n<h2 id=\"setup\">\n    Setup <a target=\"_blank\" href=\"https://trino.io/blog/2020/05/25/pinot-connector.html#setup\">#</a>\n</h2>\n<p>Create a properties file in the catalog directory, such as <code>etc/catalog/pinot.properties</code> which includes at least the\nfollowing to get started:</p>\n<div><pre><code>connector.name=pinot\npinot.controller-urls=host1:9000,host2:9000\n</code></pre></div>\n<p>The <code>pinot.controller-urls</code> is a comma separated list of controller hosts. If Pinot is deployed via <a target=\"_blank\" href=\"https://kubernetes.io/\">Kubernetes</a> and you expose the \nthe <code>pinot.controller-urls</code> needs to point to the controller Service endpoint. The Pinot broker and server must be accessible\nvia DNS as Pinot will return hostnames and not ip addresses.</p>\n<p>If you have a smaller number of Pinot servers than Presto workers or a relatively small number of rows per Pinot segment,\nyou can minimize the requests to pinot by increasing the number of Pinot segments per split (default is 1 segment per split):</p>\n<div><pre><code>pinot.segments-per-split=15\n</code></pre></div>\n<p>If DNS resolution is slow or you get <code>Request timed out</code> errors, you can increase the request timeout as follows:</p>\n<div><pre><code>pinot.request-timeout=3m\n</code></pre></div>\n<h2 id=\"schema\">\n    Schema <a target=\"_blank\" href=\"https://trino.io/blog/2020/05/25/pinot-connector.html#schema\">#</a>\n</h2>\n<p>Pinot supports the following data types. Currently null values are not supported. The corresponding Presto datatypes are:</p>\n<table>\n  <thead>\n    <tr>\n      <th>Pinot Datatype</th>\n      <th>Presto Datatype</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>boolean</td>\n      <td>boolean</td>\n    </tr>\n    <tr>\n      <td>integer</td>\n      <td>integer</td>\n    </tr>\n    <tr>\n      <td>float, double</td>\n      <td>double</td>\n    </tr>\n    <tr>\n      <td>string, bytes*</td>\n      <td>varchar</td>\n    </tr>\n    <tr>\n      <td>integer_array</td>\n      <td>array(integer)</td>\n    </tr>\n    <tr>\n      <td>float_array, double_array</td>\n      <td>array(double)</td>\n    </tr>\n    <tr>\n      <td>long_array</td>\n      <td>array(bigint)</td>\n    </tr>\n    <tr>\n      <td>string_array</td>\n      <td>array(varchar)</td>\n    </tr>\n  </tbody>\n</table>\n<ul>\n  <li>The Pinot <code>bytes</code> type is converted to a hex-encoded varchar. See the <a target=\"_blank\" href=\"https://pinot.apache.org/\">Pinot docs</a> for more information.</li>\n</ul>\n<h2 id=\"pinot-sql-passthrough\">\n    Pinot SQL Passthrough <a target=\"_blank\" href=\"https://trino.io/blog/2020/05/25/pinot-connector.html#pinot-sql-passthrough\">#</a>\n</h2>\n<p>If you would like to leverage Pinot’s fast aggregations you can use a “dynamic” table where you specify the Pinot SQL \nquery as the table name and it is passed directly to Pinot:</p>\n<div><pre><code><span>SELECT</span> <span>*</span> \n<span>FROM</span> <span>pinot</span><span>.</span><span>default</span><span>.</span><span>\"SELECT col3, col4, MAX(col1), COUNT(col2) FROM pinot_table GROUP BY col3, col4\"</span>\n<span>WHERE</span> <span>col3</span> <span>IN</span> <span>(</span><span>'FOO'</span><span>,</span> <span>'BAR'</span><span>)</span> <span>AND</span> <span>col4</span> <span>&gt;</span> <span>50</span>\n<span>LIMIT</span> <span>30000</span>\n</code></pre></div>\n<p>The filter in the outer presto query will be pushed down into the Pinot query via Presto’s\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/334/presto-spi/src/main/java/io/prestosql/spi/connector/ConnectorMetadata.java#L746\">applyFilter()</a>.\nThese queries are routed to the broker and\nshould not return huge amounts of data as broker queries currently return a single response with all the results. This\nis more suited to aggregate queries.</p>\n<p>Limits are pushed into the “dynamic” Pinot query via Presto’s\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/334/presto-spi/src/main/java/io/prestosql/spi/connector/ConnectorMetadata.java#L727\">applyLimit()</a>.\nThe above query would yield the following Pinot PQL query:</p>\n<p>Pinot functions such as <code>PERCENTILEEST</code> can be used in the quoted sql.</p>\n<div><pre><code><span>SELECT</span> <span>MAX</span><span>(</span><span>col1</span><span>),</span> <span>COUNT</span><span>(</span><span>col2</span><span>)</span>\n<span>FROM</span> <span>pinot_table</span>\n<span>WHERE</span> <span>col3</span> <span>IN</span><span>(</span><span>'FOO'</span><span>,</span> <span>'BAR'</span><span>)</span> <span>and</span> <span>col4</span> <span>&gt;</span> <span>50</span>\n<span>LIMIT</span> <span>30000</span>\n</code></pre></div>\n<p>If you are returning a larger dataset you can issue a normal Presto query which will get routed to the Pinot servers which\nstore the Pinot segments. Filters and Limits are pushed down to Pinot for regular queries as well.</p>\n<h2 id=\"future-work\">\n    Future Work <a target=\"_blank\" href=\"https://trino.io/blog/2020/05/25/pinot-connector.html#future-work\">#</a>\n</h2>\n<p>As Presto and Pinot continue to evolve the Pinot connector will leverage new features such as aggregation pushdown and more.</p>\n  </div>\n</article>\n</div>"
---

Presto 334 introduces the new Pinot Connector
which allows Presto to query data stored in Apache Pinot™.
Not only does this allow access to Pinot tables but gives users the ability to do things they could not do with Pinot
alone such as join Pinot tables to other tables and use Presto’s scalar functions, window functions and complex aggregations.
Pinot UDF’s can be directly used by including the Pinot SQL query in quotes, explained below in the Pinot SQL Passthrough section.
This enables aggregations and other complex query types to be done directly in Pinot.
This connector supports Pinot 0.3.0 and newer.
Setup
Create a properties file in the catalog directory, such as etc/catalog/pinot.properties which includes at least the
following to get started:

connector.name=pinot
pinot.controller-urls=host1:9000,host2:9000


The pinot.controller-urls is a comma separated list of controller hosts. If Pinot is deployed via Kubernetes and you expose the 
the pinot.controller-urls needs to point to the controller Service endpoint. The Pinot broker and server must be accessible
via DNS as Pinot will return hostnames and not ip addresses.
If you have a smaller number of Pinot servers than Presto workers or a relatively small number of rows per Pinot segment,
you can minimize the requests to pinot by increasing the number of Pinot segments per split (default is 1 segment per split):

pinot.segments-per-split=15


If DNS resolution is slow or you get Request timed out errors, you can increase the request timeout as follows:

pinot.request-timeout=3m


Schema
Pinot supports the following data types. Currently null values are not supported. The corresponding Presto datatypes are:
Pinot Datatype
      Presto Datatype
    
boolean
      boolean
    
integer
      integer
    
float, double
      double
    
string, bytes*
      varchar
    
integer_array
      array(integer)
    
float_array, double_array
      array(double)
    
long_array
      array(bigint)
    
string_array
      array(varchar)
    
The Pinot bytes type is converted to a hex-encoded varchar. See the Pinot docs for more information.
Pinot SQL Passthrough
If you would like to leverage Pinot’s fast aggregations you can use a “dynamic” table where you specify the Pinot SQL 
query as the table name and it is passed directly to Pinot:

SELECT * 
FROM pinot.default."SELECT col3, col4, MAX(col1), COUNT(col2) FROM pinot_table GROUP BY col3, col4"
WHERE col3 IN ('FOO', 'BAR') AND col4 > 50
LIMIT 30000


The filter in the outer presto query will be pushed down into the Pinot query via Presto’s
applyFilter().
These queries are routed to the broker and
should not return huge amounts of data as broker queries currently return a single response with all the results. This
is more suited to aggregate queries.
Limits are pushed into the “dynamic” Pinot query via Presto’s
applyLimit().
The above query would yield the following Pinot PQL query:
Pinot functions such as PERCENTILEEST can be used in the quoted sql.

SELECT MAX(col1), COUNT(col2)
FROM pinot_table
WHERE col3 IN('FOO', 'BAR') and col4 > 50
LIMIT 30000


If you are returning a larger dataset you can issue a normal Presto query which will get routed to the Pinot servers which
store the Pinot segments. Filters and Limits are pushed down to Pinot for regular queries as well.
Future Work
As Presto and Pinot continue to evolve the Pinot connector will leverage new features such as aggregation pushdown and more.
