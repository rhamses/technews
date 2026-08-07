---
title: "Trino on ice I: A gentle introduction To Iceberg"
link: "https://trino.io/blog/2021/05/03/a-gentle-introduction-to-iceberg.html"
guid: "https://trino.io/blog/2021/05/03/a-gentle-introduction-to-iceberg.html"
pubDate: "2021-05-03T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Welcome to the Trino on ice series, covering the details around how the Iceberg\ntable format works with the Trino query engine. The examples build on each\nprevious post, so it’s recommended to read the posts sequentially and reference\nthem as needed later. Here are links to the posts in this series:\nTrino on ice I: A gentle introduction to Iceberg\nTrino on ice II: In-place table evolution and cloud compatibility with Iceberg\nTrino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec\nTrino on ice IV: Deep dive into Iceberg internals\nBack in the Gentle introduction to the Hive connector \nblog post, I discussed a commonly misunderstood architecture and uses of the \nTrino Hive connector. In short, while some may think the name indicates Trino \nmakes a call to a running Hive instance, the Hive connector does not use the \nHive runtime to answer queries. Instead, the connector is named Hive connector \nbecause it relies on Hive conventions and implementation details from the Hadoop\necosystem - the invisible Hive specification.\nI call this specification invisible because it doesn’t exist. It lives in the \nHive code and the minds of those who developed it. This is makes it very \ndifficult for anybody else who has to integrate with any distributed object \nstorage that uses Hive, since they had to rely on reverse engineering and \nkeeping up with the changes. The way you interact with Hive changes based on \nwhich version of Hive or Hadoop \nyou are running. It also varies if you are in the cloud or over an object store.\nSpark has even modified the Hive spec\nin some ways to fit the Hive model to their use cases. It’s a big mess that data \nengineers have put up with for years. Yet despite the confusion and lack of \norganization due to Hive’s number of unwritten assumptions, the Hive connector \nis the most popular connector in use for Trino. Virtually every big data query \nengine uses the Hive model today in some form. As a result it is used by \nnumerous companies to store and access data in their data lakes.\nSo how did something with no specification become so ubiquitous in data lakes? \nHive was first in the large object storage and big data world as part of Hadoop.\nHadoop became popular from good marketing for Hadoop to solve the problems of \ndealing with the increase in data with the Web 2.0 boom . Of course, Hive didn’t\nget everything wrong. In fact, without Hive, and the fact that it is open \nsource, there may not have been a unified specification at all. Despite the many\nhours data engineers have spent bashing their heads against the wall with all \nthe unintended consequences of Hive, it still served a very useful purpose.\nSo why did I just rant about Hive for so long if I’m here to tell you about \nApache Iceberg? It’s impossible for a teenager \ngrowing up today to truly appreciate music streaming services without knowing \nwhat it was like to have an iPod with limited storage, or listening to a \nscratched burnt CD that skips, or flipping your tape or record to side-B. The \nsame way anyone born before the turn of the millennium really appreciates \nstreaming services, so you too will appreciate Iceberg once you’ve learned the \nintricacies of managing a data lake built on Hive and Hadoop.\nIf you haven’t used Hive before, this blog post outlines just a few pain points \nthat come from this data warehousing software to give you proper context. If you have already\nlived through these headaches, this post acts as a guide to Iceberg from \nHive. This post is the first in a series of blog posts discussing Apache Iceberg in \ngreat detail, through the lens of the Trino query engine user. If you’re not \naware of Trino (formerly PrestoSQL) yet, it is the project that houses the \nfounding Presto community after the \nfounders of Presto left Facebook.\nThis and the next couple of posts discuss the Iceberg specification and all\nthe features Iceberg has to offer, many times in comparison with Hive.\nBefore jumping into the comparisons, what is Iceberg exactly? The first thing to\nunderstand is that Iceberg is not a file format, but a table format. It may not\nbe clear what this means by just stating that, but the function of a table \nformat becomes clearer as the improvements Iceberg brings from the Hive table \nstandard materialize. Iceberg doesn’t replace file formats like ORC and Parquet,\nbut is the layer between the query engine and the data. Iceberg maps and indexes\nthe files in order to provide a higher level abstraction that handles the \nrelational table format for data lakes. You will understand more about table \nformats through examples in this series.\nHidden Partitions\nHive Partitions\nSince most developers and users interact with the table format via the query \nlanguage, a noticeable difference is the flexibility you have while creating a \npartitioned table. Assume you are trying to create a table for tracking events \noccurring in our system. You run both sets of SQL commands from Trino, just \nusing the Hive and Iceberg connectors which are designated by the catalog name \n(i.e. the catalog name starting with hive. uses the Hive connector, while the\niceberg. table uses the Iceberg connector). To begin with, the first DDL \nstatement attempts to create an events table in the logging schema in the \nhive catalog, which is configured to use the Hive connector. Trino also \ncreates a partition on the events table using the event_time field which is a\nTIMESTAMP field.\n\nCREATE TABLE hive.logging.events (\n  level VARCHAR,\n  event_time TIMESTAMP,\n  message VARCHAR,\n  call_stack ARRAY(VARCHAR)\n) WITH (\n  format = 'ORC',\n  partitioned_by = ARRAY['event_time']\n);\n\n\nRunning this in Trino using the Hive connector produces the following error message.\n\nPartition keys must be the last columns in the table and in the same order as the table properties: [event_time]\n\n\nThe Hive DDL is very dependent on ordering for columns and specifically \npartition columns. Partition fields must be located in the final column \npositions and in the order of partitioning in the DDL statement. The next \nstatement attempts to create the same table, but now with the event_time field \nmoved to the last column position.\n\nCREATE TABLE hive.logging.events (\n  level VARCHAR,\n  message VARCHAR,\n  call_stack ARRAY(VARCHAR),\n  event_time TIMESTAMP\n) WITH (\n  format = 'ORC',\n  partitioned_by = ARRAY['event_time']\n);\n\n\nThis time, the DDL command works successfully, but you likely don’t want to\npartition your data on the plain timestamp. This results in a separate file for \neach distinct timestamp value in your table (likely almost a file for each \nevent). In Hive, there’s no way to indicate the time granularity at which you \nwant to partition natively. The method to support this scenario with Hive is to\ncreate a new VARCHAR column, event_time_day that is dependent on the \nevent_time column to create the date partition value.\n\nCREATE TABLE hive.logging.events (\n  level VARCHAR,\n  event_time TIMESTAMP,\n  message VARCHAR,\n  call_stack ARRAY(VARCHAR),\n  event_time_day VARCHAR\n) WITH (\n  format = 'ORC',\n  partitioned_by = ARRAY['event_time_day']\n);\n\n\nThis method wastes space by adding a new column to your table. Even worse,\nit puts the burden of knowledge on the user to include this new column for \nwriting data. It is then necessary to use that separate column for any read \naccess to take advantage of the performance gains from the partitioning.\n\nINSERT INTO hive.logging.events\nVALUES\n(\n  'ERROR',\n  timestamp '2021-04-01 12:00:00.000001',\n  'Oh noes', \n  ARRAY ['Exception in thread \"main\" java.lang.NullPointerException'], \n  '2021-04-01'\n),\n(\n  'ERROR',\n  timestamp '2021-04-02 15:55:55.555555',\n  'Double oh noes',\n  ARRAY ['Exception in thread \"main\" java.lang.NullPointerException'],\n  '2021-04-02'\n),\n(\n  'WARN', \n  timestamp '2021-04-02 00:00:11.1122222',\n  'Maybeh oh noes?',\n  ARRAY ['Bad things could be happening??'], \n  '2021-04-02'\n);\n\n\nNotice that the last partition value '2021-04-01' has to match the TIMESTAMP \ndate during insertion. There is no validation in Hive to make sure this is \nhappening because it only requires a VARCHAR and knows to partition based on \ndifferent values.\nOn the other hand, If a user runs the following query:\n\nSELECT *\nFROM hive.logging.events\nWHERE event_time < timestamp '2021-04-02';\n\n\nthey get the correct results back, but have to scan all the data in the table:\nlevel\n      event_time\n      message\n      call_stack\n    \nERROR\n      2021-04-01 12:00:00\n      Oh noes\n      Exception in thread “main” java.lang.NullPointerException\n    \nThis happens because the user forgot to include the \nevent_time_day < '2021-04-02' predicate in the WHERE \nclause. This eliminates all the benefits that led us to create the partition in\nthe first place and yet frequently this is missed by the users of these tables.\n\nSELECT *\nFROM hive.logging.events\nWHERE event_time < timestamp '2021-04-02' \nAND event_time_day < '2021-04-02';\n\n\nResult:\nlevel\n      event_time\n      message\n      call_stack\n    \nERROR\n      2021-04-01 12:00:00\n      Oh noes\n      Exception in thread “main” java.lang.NullPointerException\n    \nIceberg Partitions\nThe following DDL statement illustrates how these issues are handled in Iceberg\nvia the Trino Iceberg connector.\n\nCREATE TABLE iceberg.logging.events (\n  level VARCHAR,\n  event_time TIMESTAMP(6),\n  message VARCHAR,\n  call_stack ARRAY(VARCHAR)\n) WITH (\n  partitioning = ARRAY['day(event_time)']\n);\n\n\nTaking note of a few things. First, notice the partition on the event_time \ncolumn that is defined without having to move it to the last position. There \nis also no need to create a separate field to handle the daily partition on the\nevent_time field. The partition specification is maintained internally\nby Iceberg, and neither the user nor the reader of this table needs to know \nanything about the partition specification to take advantage of it. This concept\nis called hidden partitioning , where only the table creator/maintainer \nhas to know the partitioning specification. Here is what the insert \nstatements look like now:\n\nINSERT INTO iceberg.logging.events\nVALUES\n(\n  'ERROR',\n  timestamp '2021-04-01 12:00:00.000001',\n  'Oh noes', \n  ARRAY ['Exception in thread \"main\" java.lang.NullPointerException']\n),\n(\n  'ERROR',\n  timestamp '2021-04-02 15:55:55.555555',\n  'Double oh noes',\n  ARRAY ['Exception in thread \"main\" java.lang.NullPointerException']),\n(\n  'WARN', \n  timestamp '2021-04-02 00:00:11.1122222',\n  'Maybeh oh noes?',\n  ARRAY ['Bad things could be happening??']\n);\n\n\nThe VARCHAR dates are no longer needed. The event_time field is \ninternally converted to the proper partition value to partition each row. Also,\nnotice that the same query that ran in Hive returns the same results. The big \ndifference is that it doesn’t require any extra clause to indicate to filter \npartition as well as filter the results.\n\nSELECT *\nFROM iceberg.logging.events\nWHERE event_time < timestamp '2021-04-02';\n\n\nResult:\nlevel\n      event_time\n      message\n      call_stack\n    \nERROR\n      2021-04-01 12:00:00\n      Oh noes\n      Exception in thread “main” java.lang.NullPointerException\n    \nSo hopefully that gives you a glimpse into what a table format and specification\nare, and why Iceberg is such a wonderful improvement over the existing and \noutdated method of storing your data in your data lake. While this post covers\na lot of aspects of Iceberg’s capabilities, this is just the tip of the Iceberg…\nIf you want to play around with Iceberg using Trino, check out the \nTrino Iceberg docs.\nThe next post covers how table evolution works in Iceberg, as well as, how \nIceberg is an improved storage format for cloud storage."
author: "Brian Olsen"
contentHtml: "<p align=\"center\">\n <img align=\"center\" width=\"100%\" height=\"100%\" src=\"/assets/blog/trino-on-ice/trino-iceberg.png\" />\n</p>\n\n<p>Welcome to the Trino on ice series, covering the details around how the Iceberg\ntable format works with the Trino query engine. The examples build on each\nprevious post, so it’s recommended to read the posts sequentially and reference\nthem as needed later. Here are links to the posts in this series:</p>\n\n<ul>\n  <li><a href=\"/blog/2021/05/03/a-gentle-introduction-to-iceberg.html\">Trino on ice I: A gentle introduction to Iceberg</a></li>\n  <li><a href=\"/blog/2021/07/12/in-place-table-evolution-and-cloud-compatibility-with-iceberg.html\">Trino on ice II: In-place table evolution and cloud compatibility with Iceberg</a></li>\n  <li><a href=\"/blog/2021/07/30/iceberg-concurrency-snapshots-spec.html\">Trino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec</a></li>\n  <li><a href=\"/blog/2021/08/12/deep-dive-into-iceberg-internals.html\">Trino on ice IV: Deep dive into Iceberg internals</a></li>\n</ul>\n\n<p>Back in the <a href=\"/blog/2020/10/20/intro-to-hive-connector.html\">Gentle introduction to the Hive connector</a> \nblog post, I discussed a commonly misunderstood architecture and uses of the \nTrino Hive connector. In short, while some may think the name indicates Trino \nmakes a call to a running Hive instance, the Hive connector does not use the \nHive runtime to answer queries. Instead, the connector is named Hive connector \nbecause it relies on Hive conventions and implementation details from the Hadoop\necosystem - the invisible Hive specification.</p>\n\n<!--more-->\n\n<p>I call this specification invisible because it doesn’t exist. It lives in the \nHive code and the minds of those who developed it. This is makes it very \ndifficult for anybody else who has to integrate with any distributed object \nstorage that uses Hive, since they had to rely on reverse engineering and \nkeeping up with the changes. The way you interact with Hive changes based on \n<a href=\"https://medium.com/hashmapinc/four-steps-for-migrating-from-hive-2-x-to-3-x-e85a8363a18\">which version of Hive or Hadoop</a> \nyou are running. It also varies if you are in the cloud or over an object store.\nSpark has even <a href=\"https://spark.apache.org/docs/2.4.4/sql-migration-guide-hive-compatibility.html\">modified the Hive spec</a>\nin some ways to fit the Hive model to their use cases. It’s a big mess that data \nengineers have put up with for years. Yet despite the confusion and lack of \norganization due to Hive’s number of unwritten assumptions, the Hive connector \nis the most popular connector in use for Trino. Virtually every big data query \nengine uses the Hive model today in some form. As a result it is used by \nnumerous companies to store and access data in their data lakes.</p>\n\n<p>So how did something with no specification become so ubiquitous in data lakes? \nHive was first in the large object storage and big data world as part of Hadoop.\nHadoop became popular from good marketing for Hadoop to solve the problems of \ndealing with the increase in data with the Web 2.0 boom . Of course, Hive didn’t\nget everything wrong. In fact, without Hive, and the fact that it is open \nsource, there may not have been a unified specification at all. Despite the many\nhours data engineers have spent bashing their heads against the wall with all \nthe unintended consequences of Hive, it still served a very useful purpose.</p>\n\n<p>So why did I just rant about Hive for so long if I’m here to tell you about \n<a href=\"https://iceberg.apache.org/\">Apache Iceberg</a>? It’s impossible for a teenager \ngrowing up today to truly appreciate music streaming services without knowing \nwhat it was like to have an iPod with limited storage, or listening to a \nscratched burnt CD that skips, or flipping your tape or record to side-B. The \nsame way anyone born before the turn of the millennium really appreciates \nstreaming services, so you too will appreciate Iceberg once you’ve learned the \nintricacies of managing a data lake built on Hive and Hadoop.</p>\n\n<p>If you haven’t used Hive before, this blog post outlines just a few pain points \nthat come from this data warehousing software to give you proper context. If you have already\nlived through these headaches, this post acts as a guide to Iceberg from \nHive. This post is the first in a series of blog posts discussing Apache Iceberg in \ngreat detail, through the lens of the Trino query engine user. If you’re not \naware of Trino (formerly PrestoSQL) yet, it is the project that houses the \nfounding Presto community after the \n<a href=\"https://trino.io/blog/2020/12/27/announcing-trino.html\">founders of Presto left Facebook</a>.\nThis and the next couple of posts discuss the Iceberg specification and all\nthe features Iceberg has to offer, many times in comparison with Hive.</p>\n\n<p>Before jumping into the comparisons, what is Iceberg exactly? The first thing to\nunderstand is that Iceberg is not a file format, but a table format. It may not\nbe clear what this means by just stating that, but the function of a table \nformat becomes clearer as the improvements Iceberg brings from the Hive table \nstandard materialize. Iceberg doesn’t replace file formats like ORC and Parquet,\nbut is the layer between the query engine and the data. Iceberg maps and indexes\nthe files in order to provide a higher level abstraction that handles the \nrelational table format for data lakes. You will understand more about table \nformats through examples in this series.</p>\n\n<h2 id=\"hidden-partitions\">Hidden Partitions</h2>\n\n<h3 id=\"hive-partitions\">Hive Partitions</h3>\n\n<p>Since most developers and users interact with the table format via the query \nlanguage, a noticeable difference is the flexibility you have while creating a \npartitioned table. Assume you are trying to create a table for tracking events \noccurring in our system. You run both sets of SQL commands from Trino, just \nusing the Hive and Iceberg connectors which are designated by the catalog name \n(i.e. the catalog name starting with <code class=\"language-plaintext highlighter-rouge\">hive.</code> uses the Hive connector, while the\n<code class=\"language-plaintext highlighter-rouge\">iceberg.</code> table uses the Iceberg connector). To begin with, the first DDL \nstatement attempts to create an <code class=\"language-plaintext highlighter-rouge\">events</code> table in the <code class=\"language-plaintext highlighter-rouge\">logging</code> schema in the \n<code class=\"language-plaintext highlighter-rouge\">hive</code> catalog, which is configured to use the Hive connector. Trino also \ncreates a partition on the <code class=\"language-plaintext highlighter-rouge\">events</code> table using the <code class=\"language-plaintext highlighter-rouge\">event_time</code> field which is a\n<code class=\"language-plaintext highlighter-rouge\">TIMESTAMP</code> field.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CREATE TABLE hive.logging.events (\n  level VARCHAR,\n  event_time TIMESTAMP,\n  message VARCHAR,\n  call_stack ARRAY(VARCHAR)\n) WITH (\n  format = 'ORC',\n  partitioned_by = ARRAY['event_time']\n);\n</code></pre></div></div>\n\n<p>Running this in Trino using the Hive connector produces the following error message.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>Partition keys must be the last columns in the table and in the same order as the table properties: [event_time]\n</code></pre></div></div>\n\n<p>The Hive DDL is very dependent on ordering for columns and specifically \npartition columns. Partition fields must be located in the final column \npositions and in the order of partitioning in the DDL statement. The next \nstatement attempts to create the same table, but now with the <code class=\"language-plaintext highlighter-rouge\">event_time</code> field \nmoved to the last column position.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CREATE TABLE hive.logging.events (\n  level VARCHAR,\n  message VARCHAR,\n  call_stack ARRAY(VARCHAR),\n  event_time TIMESTAMP\n) WITH (\n  format = 'ORC',\n  partitioned_by = ARRAY['event_time']\n);\n</code></pre></div></div>\n\n<p>This time, the DDL command works successfully, but you likely don’t want to\npartition your data on the plain timestamp. This results in a separate file for \neach distinct timestamp value in your table (likely almost a file for each \nevent). In Hive, there’s no way to indicate the time granularity at which you \nwant to partition natively. The method to support this scenario with Hive is to\ncreate a new <code class=\"language-plaintext highlighter-rouge\">VARCHAR</code> column, <code class=\"language-plaintext highlighter-rouge\">event_time_day</code> that is dependent on the \n<code class=\"language-plaintext highlighter-rouge\">event_time</code> column to create the date partition value.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CREATE TABLE hive.logging.events (\n  level VARCHAR,\n  event_time TIMESTAMP,\n  message VARCHAR,\n  call_stack ARRAY(VARCHAR),\n  event_time_day VARCHAR\n) WITH (\n  format = 'ORC',\n  partitioned_by = ARRAY['event_time_day']\n);\n</code></pre></div></div>\n\n<p>This method wastes space by adding a new column to your table. Even worse,\nit puts the burden of knowledge on the user to include this new column for \nwriting data. It is then necessary to use that separate column for any read \naccess to take advantage of the performance gains from the partitioning.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>INSERT INTO hive.logging.events\nVALUES\n(\n  'ERROR',\n  timestamp '2021-04-01 12:00:00.000001',\n  'Oh noes', \n  ARRAY ['Exception in thread \"main\" java.lang.NullPointerException'], \n  '2021-04-01'\n),\n(\n  'ERROR',\n  timestamp '2021-04-02 15:55:55.555555',\n  'Double oh noes',\n  ARRAY ['Exception in thread \"main\" java.lang.NullPointerException'],\n  '2021-04-02'\n),\n(\n  'WARN', \n  timestamp '2021-04-02 00:00:11.1122222',\n  'Maybeh oh noes?',\n  ARRAY ['Bad things could be happening??'], \n  '2021-04-02'\n);\n</code></pre></div></div>\n\n<p>Notice that the last partition value <code class=\"language-plaintext highlighter-rouge\">'2021-04-01'</code> has to match the <code class=\"language-plaintext highlighter-rouge\">TIMESTAMP</code> \ndate during insertion. There is no validation in Hive to make sure this is \nhappening because it only requires a <code class=\"language-plaintext highlighter-rouge\">VARCHAR</code> and knows to partition based on \ndifferent values.</p>\n\n<p>On the other hand, If a user runs the following query:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>SELECT *\nFROM hive.logging.events\nWHERE event_time &lt; timestamp '2021-04-02';\n</code></pre></div></div>\n<p>they get the correct results back, but have to scan all the data in the table:</p>\n\n<table>\n  <thead>\n    <tr>\n      <th>level</th>\n      <th>event_time</th>\n      <th>message</th>\n      <th>call_stack</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ERROR</td>\n      <td>2021-04-01 12:00:00</td>\n      <td>Oh noes</td>\n      <td>Exception in thread “main” java.lang.NullPointerException</td>\n    </tr>\n  </tbody>\n</table>\n\n<p>This happens because the user forgot to include the \n<code class=\"language-plaintext highlighter-rouge\">event_time_day &lt; '2021-04-02'</code> predicate in the <code class=\"language-plaintext highlighter-rouge\">WHERE</code> \nclause. This eliminates all the benefits that led us to create the partition in\nthe first place and yet frequently this is missed by the users of these tables.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>SELECT *\nFROM hive.logging.events\nWHERE event_time &lt; timestamp '2021-04-02' \nAND event_time_day &lt; '2021-04-02';\n</code></pre></div></div>\n\n<p>Result:</p>\n\n<table>\n  <thead>\n    <tr>\n      <th>level</th>\n      <th>event_time</th>\n      <th>message</th>\n      <th>call_stack</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ERROR</td>\n      <td>2021-04-01 12:00:00</td>\n      <td>Oh noes</td>\n      <td>Exception in thread “main” java.lang.NullPointerException</td>\n    </tr>\n  </tbody>\n</table>\n\n<h3 id=\"iceberg-partitions\">Iceberg Partitions</h3>\n\n<p>The following DDL statement illustrates how these issues are handled in Iceberg\nvia the Trino Iceberg connector.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CREATE TABLE iceberg.logging.events (\n  level VARCHAR,\n  event_time TIMESTAMP(6),\n  message VARCHAR,\n  call_stack ARRAY(VARCHAR)\n) WITH (\n  partitioning = ARRAY['day(event_time)']\n);\n</code></pre></div></div>\n\n<p>Taking note of a few things. First, notice the partition on the <code class=\"language-plaintext highlighter-rouge\">event_time</code> \ncolumn that is defined without having to move it to the last position. There \nis also no need to create a separate field to handle the daily partition on the\n<code class=\"language-plaintext highlighter-rouge\">event_time</code> field. The <em><strong>partition specification</strong></em> is maintained internally\nby Iceberg, and neither the user nor the reader of this table needs to know \nanything about the partition specification to take advantage of it. This concept\nis called <em><strong>hidden partitioning</strong></em> , where only the table creator/maintainer \nhas to know the <em><strong>partitioning specification</strong></em>. Here is what the insert \nstatements look like now:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>INSERT INTO iceberg.logging.events\nVALUES\n(\n  'ERROR',\n  timestamp '2021-04-01 12:00:00.000001',\n  'Oh noes', \n  ARRAY ['Exception in thread \"main\" java.lang.NullPointerException']\n),\n(\n  'ERROR',\n  timestamp '2021-04-02 15:55:55.555555',\n  'Double oh noes',\n  ARRAY ['Exception in thread \"main\" java.lang.NullPointerException']),\n(\n  'WARN', \n  timestamp '2021-04-02 00:00:11.1122222',\n  'Maybeh oh noes?',\n  ARRAY ['Bad things could be happening??']\n);\n</code></pre></div></div>\n\n<p>The <code class=\"language-plaintext highlighter-rouge\">VARCHAR</code> dates are no longer needed. The <code class=\"language-plaintext highlighter-rouge\">event_time</code> field is \ninternally converted to the proper partition value to partition each row. Also,\nnotice that the same query that ran in Hive returns the same results. The big \ndifference is that it doesn’t require any extra clause to indicate to filter \npartition as well as filter the results.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>SELECT *\nFROM iceberg.logging.events\nWHERE event_time &lt; timestamp '2021-04-02';\n</code></pre></div></div>\n\n<p>Result:</p>\n\n<table>\n  <thead>\n    <tr>\n      <th>level</th>\n      <th>event_time</th>\n      <th>message</th>\n      <th>call_stack</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ERROR</td>\n      <td>2021-04-01 12:00:00</td>\n      <td>Oh noes</td>\n      <td>Exception in thread “main” java.lang.NullPointerException</td>\n    </tr>\n  </tbody>\n</table>\n\n<p>So hopefully that gives you a glimpse into what a table format and specification\nare, and why Iceberg is such a wonderful improvement over the existing and \noutdated method of storing your data in your data lake. While this post covers\na lot of aspects of Iceberg’s capabilities, this is just the tip of the Iceberg…</p>\n\n<p align=\"center\">\n <img align=\"center\" width=\"50%\" height=\"100%\" src=\"/assets/blog/trino-on-ice/see_myself_out.gif\" />\n</p>\n\n<p>If you want to play around with Iceberg using Trino, check out the \n<a href=\"https://trino.io/docs/current/connector/iceberg.html\">Trino Iceberg docs</a>.\nThe next post covers how table evolution works in Iceberg, as well as, how \nIceberg is an improved storage format for cloud storage.</p>"
---

Welcome to the Trino on ice series, covering the details around how the Iceberg
table format works with the Trino query engine. The examples build on each
previous post, so it’s recommended to read the posts sequentially and reference
them as needed later. Here are links to the posts in this series:
Trino on ice I: A gentle introduction to Iceberg
Trino on ice II: In-place table evolution and cloud compatibility with Iceberg
Trino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec
Trino on ice IV: Deep dive into Iceberg internals
Back in the Gentle introduction to the Hive connector 
blog post, I discussed a commonly misunderstood architecture and uses of the 
Trino Hive connector. In short, while some may think the name indicates Trino 
makes a call to a running Hive instance, the Hive connector does not use the 
Hive runtime to answer queries. Instead, the connector is named Hive connector 
because it relies on Hive conventions and implementation details from the Hadoop
ecosystem - the invisible Hive specification.
I call this specification invisible because it doesn’t exist. It lives in the 
Hive code and the minds of those who developed it. This is makes it very 
difficult for anybody else who has to integrate with any distributed object 
storage that uses Hive, since they had to rely on reverse engineering and 
keeping up with the changes. The way you interact with Hive changes based on 
which version of Hive or Hadoop 
you are running. It also varies if you are in the cloud or over an object store.
Spark has even modified the Hive spec
in some ways to fit the Hive model to their use cases. It’s a big mess that data 
engineers have put up with for years. Yet despite the confusion and lack of 
organization due to Hive’s number of unwritten assumptions, the Hive connector 
is the most popular connector in use for Trino. Virtually every big data query 
engine uses the Hive model today in some form. As a result it is used by 
numerous companies to store and access data in their data lakes.
So how did something with no specification become so ubiquitous in data lakes? 
Hive was first in the large object storage and big data world as part of Hadoop.
Hadoop became popular from good marketing for Hadoop to solve the problems of 
dealing with the increase in data with the Web 2.0 boom . Of course, Hive didn’t
get everything wrong. In fact, without Hive, and the fact that it is open 
source, there may not have been a unified specification at all. Despite the many
hours data engineers have spent bashing their heads against the wall with all 
the unintended consequences of Hive, it still served a very useful purpose.
So why did I just rant about Hive for so long if I’m here to tell you about 
Apache Iceberg? It’s impossible for a teenager 
growing up today to truly appreciate music streaming services without knowing 
what it was like to have an iPod with limited storage, or listening to a 
scratched burnt CD that skips, or flipping your tape or record to side-B. The 
same way anyone born before the turn of the millennium really appreciates 
streaming services, so you too will appreciate Iceberg once you’ve learned the 
intricacies of managing a data lake built on Hive and Hadoop.
If you haven’t used Hive before, this blog post outlines just a few pain points 
that come from this data warehousing software to give you proper context. If you have already
lived through these headaches, this post acts as a guide to Iceberg from 
Hive. This post is the first in a series of blog posts discussing Apache Iceberg in 
great detail, through the lens of the Trino query engine user. If you’re not 
aware of Trino (formerly PrestoSQL) yet, it is the project that houses the 
founding Presto community after the 
founders of Presto left Facebook.
This and the next couple of posts discuss the Iceberg specification and all
the features Iceberg has to offer, many times in comparison with Hive.
Before jumping into the comparisons, what is Iceberg exactly? The first thing to
understand is that Iceberg is not a file format, but a table format. It may not
be clear what this means by just stating that, but the function of a table 
format becomes clearer as the improvements Iceberg brings from the Hive table 
standard materialize. Iceberg doesn’t replace file formats like ORC and Parquet,
but is the layer between the query engine and the data. Iceberg maps and indexes
the files in order to provide a higher level abstraction that handles the 
relational table format for data lakes. You will understand more about table 
formats through examples in this series.
Hidden Partitions
Hive Partitions
Since most developers and users interact with the table format via the query 
language, a noticeable difference is the flexibility you have while creating a 
partitioned table. Assume you are trying to create a table for tracking events 
occurring in our system. You run both sets of SQL commands from Trino, just 
using the Hive and Iceberg connectors which are designated by the catalog name 
(i.e. the catalog name starting with hive. uses the Hive connector, while the
iceberg. table uses the Iceberg connector). To begin with, the first DDL 
statement attempts to create an events table in the logging schema in the 
hive catalog, which is configured to use the Hive connector. Trino also 
creates a partition on the events table using the event_time field which is a
TIMESTAMP field.

CREATE TABLE hive.logging.events (
  level VARCHAR,
  event_time TIMESTAMP,
  message VARCHAR,
  call_stack ARRAY(VARCHAR)
) WITH (
  format = 'ORC',
  partitioned_by = ARRAY['event_time']
);


Running this in Trino using the Hive connector produces the following error message.

Partition keys must be the last columns in the table and in the same order as the table properties: [event_time]


The Hive DDL is very dependent on ordering for columns and specifically 
partition columns. Partition fields must be located in the final column 
positions and in the order of partitioning in the DDL statement. The next 
statement attempts to create the same table, but now with the event_time field 
moved to the last column position.

CREATE TABLE hive.logging.events (
  level VARCHAR,
  message VARCHAR,
  call_stack ARRAY(VARCHAR),
  event_time TIMESTAMP
) WITH (
  format = 'ORC',
  partitioned_by = ARRAY['event_time']
);


This time, the DDL command works successfully, but you likely don’t want to
partition your data on the plain timestamp. This results in a separate file for 
each distinct timestamp value in your table (likely almost a file for each 
event). In Hive, there’s no way to indicate the time granularity at which you 
want to partition natively. The method to support this scenario with Hive is to
create a new VARCHAR column, event_time_day that is dependent on the 
event_time column to create the date partition value.

CREATE TABLE hive.logging.events (
  level VARCHAR,
  event_time TIMESTAMP,
  message VARCHAR,
  call_stack ARRAY(VARCHAR),
  event_time_day VARCHAR
) WITH (
  format = 'ORC',
  partitioned_by = ARRAY['event_time_day']
);


This method wastes space by adding a new column to your table. Even worse,
it puts the burden of knowledge on the user to include this new column for 
writing data. It is then necessary to use that separate column for any read 
access to take advantage of the performance gains from the partitioning.

INSERT INTO hive.logging.events
VALUES
(
  'ERROR',
  timestamp '2021-04-01 12:00:00.000001',
  'Oh noes', 
  ARRAY ['Exception in thread "main" java.lang.NullPointerException'], 
  '2021-04-01'
),
(
  'ERROR',
  timestamp '2021-04-02 15:55:55.555555',
  'Double oh noes',
  ARRAY ['Exception in thread "main" java.lang.NullPointerException'],
  '2021-04-02'
),
(
  'WARN', 
  timestamp '2021-04-02 00:00:11.1122222',
  'Maybeh oh noes?',
  ARRAY ['Bad things could be happening??'], 
  '2021-04-02'
);


Notice that the last partition value '2021-04-01' has to match the TIMESTAMP 
date during insertion. There is no validation in Hive to make sure this is 
happening because it only requires a VARCHAR and knows to partition based on 
different values.
On the other hand, If a user runs the following query:

SELECT *
FROM hive.logging.events
WHERE event_time < timestamp '2021-04-02';


they get the correct results back, but have to scan all the data in the table:
level
      event_time
      message
      call_stack
    
ERROR
      2021-04-01 12:00:00
      Oh noes
      Exception in thread “main” java.lang.NullPointerException
    
This happens because the user forgot to include the 
event_time_day < '2021-04-02' predicate in the WHERE 
clause. This eliminates all the benefits that led us to create the partition in
the first place and yet frequently this is missed by the users of these tables.

SELECT *
FROM hive.logging.events
WHERE event_time < timestamp '2021-04-02' 
AND event_time_day < '2021-04-02';


Result:
level
      event_time
      message
      call_stack
    
ERROR
      2021-04-01 12:00:00
      Oh noes
      Exception in thread “main” java.lang.NullPointerException
    
Iceberg Partitions
The following DDL statement illustrates how these issues are handled in Iceberg
via the Trino Iceberg connector.

CREATE TABLE iceberg.logging.events (
  level VARCHAR,
  event_time TIMESTAMP(6),
  message VARCHAR,
  call_stack ARRAY(VARCHAR)
) WITH (
  partitioning = ARRAY['day(event_time)']
);


Taking note of a few things. First, notice the partition on the event_time 
column that is defined without having to move it to the last position. There 
is also no need to create a separate field to handle the daily partition on the
event_time field. The partition specification is maintained internally
by Iceberg, and neither the user nor the reader of this table needs to know 
anything about the partition specification to take advantage of it. This concept
is called hidden partitioning , where only the table creator/maintainer 
has to know the partitioning specification. Here is what the insert 
statements look like now:

INSERT INTO iceberg.logging.events
VALUES
(
  'ERROR',
  timestamp '2021-04-01 12:00:00.000001',
  'Oh noes', 
  ARRAY ['Exception in thread "main" java.lang.NullPointerException']
),
(
  'ERROR',
  timestamp '2021-04-02 15:55:55.555555',
  'Double oh noes',
  ARRAY ['Exception in thread "main" java.lang.NullPointerException']),
(
  'WARN', 
  timestamp '2021-04-02 00:00:11.1122222',
  'Maybeh oh noes?',
  ARRAY ['Bad things could be happening??']
);


The VARCHAR dates are no longer needed. The event_time field is 
internally converted to the proper partition value to partition each row. Also,
notice that the same query that ran in Hive returns the same results. The big 
difference is that it doesn’t require any extra clause to indicate to filter 
partition as well as filter the results.

SELECT *
FROM iceberg.logging.events
WHERE event_time < timestamp '2021-04-02';


Result:
level
      event_time
      message
      call_stack
    
ERROR
      2021-04-01 12:00:00
      Oh noes
      Exception in thread “main” java.lang.NullPointerException
    
So hopefully that gives you a glimpse into what a table format and specification
are, and why Iceberg is such a wonderful improvement over the existing and 
outdated method of storing your data in your data lake. While this post covers
a lot of aspects of Iceberg’s capabilities, this is just the tip of the Iceberg…
If you want to play around with Iceberg using Trino, check out the 
Trino Iceberg docs.
The next post covers how table evolution works in Iceberg, as well as, how 
Iceberg is an improved storage format for cloud storage.
