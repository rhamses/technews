---
title: "Time travel in Delta Lake connector"
link: "https://trino.io/blog/2024/04/11/time-travel-delta-lake.html"
guid: "https://trino.io/blog/2024/04/11/time-travel-delta-lake.html"
pubDate: "2024-04-11T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Exciting news - time travel capability has finally arrived in the Delta Lake\nconnector! After introducing support for time travel in the Iceberg connector\nback in 2022, we’re thrilled to announce that the Delta Lake connector now joins\nthe ranks as the second connector offering this feature.\nBackground and motivation\nTime travel as a feature has a number of practical use cases:\nData recovery and rollback: In the event of data corruption or erroneous\n updates, time travel allows users to roll back to a previous version of the\n data, restoring it to a known good state.\nAuditing and compliance: Time travel enables auditors and compliance\n teams to analyze data changes over time, ensuring regulatory compliance and\n providing transparency into data operations.\nHistorical analysis: Data analysts and data scientists can perform\n historical analysis by querying data at different points in time, uncovering\n trends, patterns, and anomalies that may not be apparent in current data.\nTime travel SQL example\nStart by creating a catalog example with the Delta Lake\nconnector, create a demo\nschema, and make it the current catalog with the\nUSE statement.\n\nUSE example.demo;\n\n\nLet’s create a Delta Lake table, add some data, modify the table and add some\nmore data using the following SQL statement:\n\nCREATE TABLE users(id int, name varchar) WITH (column_mapping_mode = 'name');\nINSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Mallory');\nALTER TABLE users DROP COLUMN name;\nINSERT INTO users VALUES 4;\n\n\nUse the following statement to look at all data in the table:\n\nSELECT * FROM users ORDER BY id;\n\n\n\n id\n----\n  1\n  2\n  3\n  4\n\n\nThe $history metadata table offers a record of past operations:\n\nSELECT version, timestamp, operation\nFROM \"users$history\";\n\n\n\n version |             timestamp              |  operation\n---------+------------------------------------+--------------\n       0 | 2024-04-10 17:49:18.528 Asia/Tokyo | CREATE TABLE\n       1 | 2024-04-10 17:49:18.755 Asia/Tokyo | WRITE\n       2 | 2024-04-10 17:49:18.929 Asia/Tokyo | DROP COLUMNS\n       3 | 2024-04-10 17:49:19.137 Asia/Tokyo | WRITE\n\n\nYou can specify the version using FOR VERSION AS OF. For example, to time\ntravel to version 1, which includes a WRITE operation, the query would look\nlike this:\n\nSELECT *\nFROM users FOR VERSION AS OF 1;\n\n\nAs you can see, time travel not only rolls back the data but also the table definition:\n\n id |  name\n----+---------\n  1 | Alice\n  2 | Bob\n  3 | Mallory\n\n\nTechnical details\nDelta Lake manages transaction logs in the _delta_log directory located under\nthe table’s specified location.\nLast checkpoint: The optional file that manages the last checkpoint\nversion is named _last_checkpoint.\nDelta log entries: The JSON file contains an atomic set of actions, for\nexample 00000000000000000000.json\nCheckpoints: The Parquet file contains the complete replay of all actions,\nup to and including the checkpointed table version, for example\n00000000000000000010.checkpoint.parquet\nMore details are available in the Delta Lake protocol\ndocumentation.\nFollowing is an example of the _delta_log directory:\n\n00000000000000000000.json\n00000000000000000001.json\n00000000000000000002.json\n00000000000000000003.json\n00000000000000000003.checkpoint.parquet\n00000000000000000004.json\n00000000000000000005.json\n...\n_last_checkpoint\n\n\nWhen the specified version is older than the last checkpoint, such as version 2,\nthe connector reads the transaction log files starting from the initial\ncheckpoint file (00000000000000000000.json) up to the specified version\n(00000000000000000002.json).\nWhen the specified version is equal to the last checkpoint, in our example\nversion 3, the connector reads only the checkpoint file for that version\n(00000000000000000003.checkpoint.parquet).\nWhen the specified version is newer than the last checkpoint, so version 4, the\nconnector reads the checkpoint file for the last checkpoint version\n(00000000000000000003.checkpoint.parquet) and the transaction log file for the\nspecified version (00000000000000000004.json).\nThe actual logic without the last checkpoint is more complex because the\nconnector cannot determine the checkpoints without listing file names in the\n_delta_log directory.\nConclusion\nTime travel in the Trino Delta Lake\nconnector opens up new\npossibilities for data exploration and analysis, empowering users to delve into\nthe past and derive insights from historical data. By seamlessly integrating\nwith Delta Lake’s versioning and transaction logs, Trino provides a powerful\ntool for querying data as it appeared at different points in time. Whether it’s\nauditing, historical analysis, or data recovery, time travel adds a valuable\ndimension to data-driven decision-making, making it an indispensable feature for\nmodern data platforms.\nBonus\nJoin us for Trino Fest 2024 where Marius Grama presents “The open\nsource journey of the Trino Delta Lake connector” and shares more tips and\ntricks."
author: "Yuya Ebihara"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/images/logos/trino-delta.png\">\n    </p>\n    <p>Exciting news - time travel capability has finally arrived in the Delta Lake\nconnector! After introducing support for time travel in the Iceberg connector\nback in 2022, we’re thrilled to announce that the Delta Lake connector now joins\nthe ranks as the second connector offering this feature.</p>\n<!--more-->\n<h2 id=\"background-and-motivation\">\n    Background and motivation <a target=\"_blank\" href=\"https://trino.io/blog/2024/04/11/time-travel-delta-lake.html#background-and-motivation\">#</a>\n</h2>\n<p>Time travel as a feature has a number of practical use cases:</p>\n<ul>\n  <li><strong>Data recovery and rollback</strong>: In the event of data corruption or erroneous\n updates, time travel allows users to roll back to a previous version of the\n data, restoring it to a known good state.</li>\n  <li><strong>Auditing and compliance</strong>: Time travel enables auditors and compliance\n teams to analyze data changes over time, ensuring regulatory compliance and\n providing transparency into data operations.</li>\n  <li><strong>Historical analysis</strong>: Data analysts and data scientists can perform\n historical analysis by querying data at different points in time, uncovering\n trends, patterns, and anomalies that may not be apparent in current data.</li>\n</ul>\n<h2 id=\"time-travel-sql-example\">\n    Time travel SQL example <a target=\"_blank\" href=\"https://trino.io/blog/2024/04/11/time-travel-delta-lake.html#time-travel-sql-example\">#</a>\n</h2>\n<p>Start by creating a catalog <code>example</code> with the <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/delta-lake.html\">Delta Lake\nconnector</a>, create a <code>demo</code>\nschema, and make it the current catalog with the\n<a target=\"_blank\" href=\"https://trino.io/docs/current/sql/use.html\">USE</a> statement.</p>\n<div><pre><code><span>USE</span> <span>example</span><span>.</span><span>demo</span><span>;</span>\n</code></pre></div>\n<p>Let’s create a Delta Lake table, add some data, modify the table and add some\nmore data using the following SQL statement:</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>users</span><span>(</span><span>id</span> <span>int</span><span>,</span> <span>name</span> <span>varchar</span><span>)</span> <span>WITH</span> <span>(</span><span>column_mapping_mode</span> <span>=</span> <span>'name'</span><span>);</span>\n<span>INSERT</span> <span>INTO</span> <span>users</span> <span>VALUES</span> <span>(</span><span>1</span><span>,</span> <span>'Alice'</span><span>),</span> <span>(</span><span>2</span><span>,</span> <span>'Bob'</span><span>),</span> <span>(</span><span>3</span><span>,</span> <span>'Mallory'</span><span>);</span>\n<span>ALTER</span> <span>TABLE</span> <span>users</span> <span>DROP</span> <span>COLUMN</span> <span>name</span><span>;</span>\n<span>INSERT</span> <span>INTO</span> <span>users</span> <span>VALUES</span> <span>4</span><span>;</span>\n</code></pre></div>\n<p>Use the following statement to look at all data in the table:</p>\n<div><pre><code><span>SELECT</span> <span>*</span> <span>FROM</span> <span>users</span> <span>ORDER</span> <span>BY</span> <span>id</span><span>;</span>\n</code></pre></div>\n<div><pre><code> id\n----\n  1\n  2\n  3\n  4\n</code></pre></div>\n<p>The <code>$history</code> metadata table offers a record of past operations:</p>\n<div><pre><code><span>SELECT</span> <span>version</span><span>,</span> <span>timestamp</span><span>,</span> <span>operation</span>\n<span>FROM</span> <span>\"users$history\"</span><span>;</span>\n</code></pre></div>\n<div><pre><code> version |             timestamp              |  operation\n---------+------------------------------------+--------------\n       0 | 2024-04-10 17:49:18.528 Asia/Tokyo | CREATE TABLE\n       1 | 2024-04-10 17:49:18.755 Asia/Tokyo | WRITE\n       2 | 2024-04-10 17:49:18.929 Asia/Tokyo | DROP COLUMNS\n       3 | 2024-04-10 17:49:19.137 Asia/Tokyo | WRITE\n</code></pre></div>\n<p>You can specify the version using <code>FOR VERSION AS OF</code>. For example, to time\ntravel to version 1, which includes a <code>WRITE</code> operation, the query would look\nlike this:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>users</span> <span>FOR</span> <span>VERSION</span> <span>AS</span> <span>OF</span> <span>1</span><span>;</span>\n</code></pre></div>\n<p>As you can see, time travel not only rolls back the data but also the table definition:</p>\n<div><pre><code> <span>id</span> <span>|</span>  <span>name</span>\n<span>----+---------</span>\n  <span>1</span> <span>|</span> <span>Alice</span>\n  <span>2</span> <span>|</span> <span>Bob</span>\n  <span>3</span> <span>|</span> <span>Mallory</span>\n</code></pre></div>\n<h2 id=\"technical-details\">\n    Technical details <a target=\"_blank\" href=\"https://trino.io/blog/2024/04/11/time-travel-delta-lake.html#technical-details\">#</a>\n</h2>\n<p>Delta Lake manages transaction logs in the <code>_delta_log</code> directory located under\nthe table’s specified location.</p>\n<ul>\n  <li><strong>Last checkpoint</strong>: The optional file that manages the last checkpoint\nversion is named <code>_last_checkpoint</code>.</li>\n  <li><strong>Delta log entries</strong>: The JSON file contains an atomic set of actions, for\nexample <code>00000000000000000000.json</code></li>\n  <li><strong>Checkpoints</strong>: The Parquet file contains the complete replay of all actions,\nup to and including the checkpointed table version, for example\n<code>00000000000000000010.checkpoint.parquet</code></li>\n</ul>\n<p>More details are available in the <a target=\"_blank\" href=\"https://github.com/delta-io/delta/blob/master/PROTOCOL.md\">Delta Lake protocol\ndocumentation</a>.</p>\n<p>Following is an example of the <code>_delta_log</code> directory:</p>\n<div><pre><code>00000000000000000000.json\n00000000000000000001.json\n00000000000000000002.json\n00000000000000000003.json\n00000000000000000003.checkpoint.parquet\n00000000000000000004.json\n00000000000000000005.json\n...\n_last_checkpoint\n</code></pre></div>\n<p>When the specified version is older than the last checkpoint, such as version 2,\nthe connector reads the transaction log files starting from the initial\ncheckpoint file (<code>00000000000000000000.json</code>) up to the specified version\n(<code>00000000000000000002.json</code>).</p>\n<p>When the specified version is equal to the last checkpoint, in our example\nversion 3, the connector reads only the checkpoint file for that version\n(<code>00000000000000000003.checkpoint.parquet</code>).</p>\n<p>When the specified version is newer than the last checkpoint, so version 4, the\nconnector reads the checkpoint file for the last checkpoint version\n(<code>00000000000000000003.checkpoint.parquet</code>) and the transaction log file for the\nspecified version (<code>00000000000000000004.json</code>).</p>\n<p>The actual logic without the last checkpoint is more complex because the\nconnector cannot determine the checkpoints without listing file names in the\n<code>_delta_log</code> directory.</p>\n<h2 id=\"conclusion\">\n    Conclusion <a target=\"_blank\" href=\"https://trino.io/blog/2024/04/11/time-travel-delta-lake.html#conclusion\">#</a>\n</h2>\n<p>Time travel in the Trino <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/delta-lake.html\">Delta Lake\nconnector</a> opens up new\npossibilities for data exploration and analysis, empowering users to delve into\nthe past and derive insights from historical data. By seamlessly integrating\nwith Delta Lake’s versioning and transaction logs, Trino provides a powerful\ntool for querying data as it appeared at different points in time. Whether it’s\nauditing, historical analysis, or data recovery, time travel adds a valuable\ndimension to data-driven decision-making, making it an indispensable feature for\nmodern data platforms.</p>\n<h2 id=\"bonus\">\n    Bonus <a target=\"_blank\" href=\"https://trino.io/blog/2024/04/11/time-travel-delta-lake.html#bonus\">#</a>\n</h2>\n<p>Join us for <a target=\"_blank\" href=\"https://trino.io/blog/2024/02/20/announcing-trino-fest-2024\">Trino Fest 2024</a> where <a target=\"_blank\" href=\"https://github.com/findinpath\">Marius Grama</a> presents <em>“The open\nsource journey of the Trino Delta Lake connector”</em> and shares more tips and\ntricks.</p>\n  </div>\n</article>\n</div>"
---

Exciting news - time travel capability has finally arrived in the Delta Lake
connector! After introducing support for time travel in the Iceberg connector
back in 2022, we’re thrilled to announce that the Delta Lake connector now joins
the ranks as the second connector offering this feature.
Background and motivation
Time travel as a feature has a number of practical use cases:
Data recovery and rollback: In the event of data corruption or erroneous
 updates, time travel allows users to roll back to a previous version of the
 data, restoring it to a known good state.
Auditing and compliance: Time travel enables auditors and compliance
 teams to analyze data changes over time, ensuring regulatory compliance and
 providing transparency into data operations.
Historical analysis: Data analysts and data scientists can perform
 historical analysis by querying data at different points in time, uncovering
 trends, patterns, and anomalies that may not be apparent in current data.
Time travel SQL example
Start by creating a catalog example with the Delta Lake
connector, create a demo
schema, and make it the current catalog with the
USE statement.

USE example.demo;


Let’s create a Delta Lake table, add some data, modify the table and add some
more data using the following SQL statement:

CREATE TABLE users(id int, name varchar) WITH (column_mapping_mode = 'name');
INSERT INTO users VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Mallory');
ALTER TABLE users DROP COLUMN name;
INSERT INTO users VALUES 4;


Use the following statement to look at all data in the table:

SELECT * FROM users ORDER BY id;



 id
----
  1
  2
  3
  4


The $history metadata table offers a record of past operations:

SELECT version, timestamp, operation
FROM "users$history";



 version |             timestamp              |  operation
---------+------------------------------------+--------------
       0 | 2024-04-10 17:49:18.528 Asia/Tokyo | CREATE TABLE
       1 | 2024-04-10 17:49:18.755 Asia/Tokyo | WRITE
       2 | 2024-04-10 17:49:18.929 Asia/Tokyo | DROP COLUMNS
       3 | 2024-04-10 17:49:19.137 Asia/Tokyo | WRITE


You can specify the version using FOR VERSION AS OF. For example, to time
travel to version 1, which includes a WRITE operation, the query would look
like this:

SELECT *
FROM users FOR VERSION AS OF 1;


As you can see, time travel not only rolls back the data but also the table definition:

 id |  name
----+---------
  1 | Alice
  2 | Bob
  3 | Mallory


Technical details
Delta Lake manages transaction logs in the _delta_log directory located under
the table’s specified location.
Last checkpoint: The optional file that manages the last checkpoint
version is named _last_checkpoint.
Delta log entries: The JSON file contains an atomic set of actions, for
example 00000000000000000000.json
Checkpoints: The Parquet file contains the complete replay of all actions,
up to and including the checkpointed table version, for example
00000000000000000010.checkpoint.parquet
More details are available in the Delta Lake protocol
documentation.
Following is an example of the _delta_log directory:

00000000000000000000.json
00000000000000000001.json
00000000000000000002.json
00000000000000000003.json
00000000000000000003.checkpoint.parquet
00000000000000000004.json
00000000000000000005.json
...
_last_checkpoint


When the specified version is older than the last checkpoint, such as version 2,
the connector reads the transaction log files starting from the initial
checkpoint file (00000000000000000000.json) up to the specified version
(00000000000000000002.json).
When the specified version is equal to the last checkpoint, in our example
version 3, the connector reads only the checkpoint file for that version
(00000000000000000003.checkpoint.parquet).
When the specified version is newer than the last checkpoint, so version 4, the
connector reads the checkpoint file for the last checkpoint version
(00000000000000000003.checkpoint.parquet) and the transaction log file for the
specified version (00000000000000000004.json).
The actual logic without the last checkpoint is more complex because the
connector cannot determine the checkpoints without listing file names in the
_delta_log directory.
Conclusion
Time travel in the Trino Delta Lake
connector opens up new
possibilities for data exploration and analysis, empowering users to delve into
the past and derive insights from historical data. By seamlessly integrating
with Delta Lake’s versioning and transaction logs, Trino provides a powerful
tool for querying data as it appeared at different points in time. Whether it’s
auditing, historical analysis, or data recovery, time travel adds a valuable
dimension to data-driven decision-making, making it an indispensable feature for
modern data platforms.
Bonus
Join us for Trino Fest 2024 where Marius Grama presents “The open
source journey of the Trino Delta Lake connector” and shares more tips and
tricks.
