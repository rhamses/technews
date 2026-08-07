---
title: "A gentle introduction to the Hive connector"
link: "https://trino.io/blog/2020/10/20/intro-to-hive-connector.html"
guid: "https://trino.io/blog/2020/10/20/intro-to-hive-connector.html"
pubDate: "2020-10-20T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "TL;DR: The Hive connector is what you use in Trino for reading data from object\nstorage that is organized according to the rules laid out by Hive, without using\nthe Hive runtime code.\nOne of the most confusing aspects when starting Trino is the Hive connector. \nTypically, you seek out the use of Trino when you experience an intensely slow\nquery turnaround from your existing Hadoop, Spark, or Hive infrastructure. In\nfact, the genesis of Trino, formerly known as Presto, came about due to these \nslow Hive query conditions at Facebook back in 2012.\nSo when you learn that Trino has a Hive connector,\nit can be rather confusing since you moved to Trino to circumvent the slowness\nof your current Hive cluster. Another common source of confusion is when you\nwant to query your data from your cloud object storage, such as AWS S3, MinIO, \nand Google Cloud Storage. This too uses the Hive connector. If that \nconfuses you, don’t worry, you are not alone. This blog aims to explain this\ncommonly confusing nomenclature.\nHive architecture\nTo understand the origins and inner workings of Trino’s Hive connector, you\nfirst need to know a few high level components of the Hive architecture.\n\nYou can simplify the Hive architecture to four components:\nThe runtime contains the logic of the query engine that translates the SQL\n-esque Hive Query Language(HQL) into MapReduce jobs that run over files stored \nin the filesystem.\nThe storage component is simply that, it stores files in various formats and\nindex structures to recall these files. The file formats can be anything as\nsimple as JSON and CSV, to more complex files such as columnar formats like ORC\nand Parquet. Traditionally, Hive runs on top of the Hadoop Distributed\nFilesystem (HDFS). As cloud-based options became more prevalent, object storage\nlike Amazon S3, Azure Blob Storage, Google Cloud Storage, and others needed\nto be leveraged as well and replaced HDFS as the storage component.\nIn order for Hive to process these files, it must have a mapping\nfrom SQL tables in the runtime to files and directories in the storage\ncomponent. To accomplish this, Hive uses the Hive Metastore Service (HMS), \noften shortened to the metastore to manage the metadata about the files such\nas table columns, file locations, file formats, etc…\nThe last component not included in the image is Hive’s data organization\nspecification. The documentation of this element only exists in the code in\nHive and has been reverse engineered to be used by other systems like Trino \nto remain compatible with other systems.\nTrino reuses all of these components except for the runtime. This is the same\napproach most compute engines take when dealing with data in object stores, \nspecifically, Trino, Spark, Drill, and Impala. When you think of the Hive\nconnector, you should think about a connector that is capable of reading data\norganized by the unwritten Hive specification.\nTrino runtime replaces Hive runtime\nIn the early days of big data systems, many expected query turnaround to take a \nlong time due to the high volume of unstructured data in ETL workloads. The\nprimary goal in early iterations of these systems was simply throughput over\nlarge volumes of data while maintaining fault-tolerance. Now, more businesses\nwant to run fast interactive queries over their big data instead of running jobs\nthat take hours and produce possibly undesirable results. Many companies have\npetabytes of data and metadata in their data warehouse. Data in storage is\ncumbersome to move and the data in the metastore takes a long time to repopulate\nin other formats. Since only the runtime that executed Hive queries needs\nreplacement, the Trino engine utilizes the existing metastore metadata and\nfiles residing in storage, and the Trino runtime effectively replaces the\nHive runtime responsible for analyzing the data.\nTrino Architecture\n\nThe Hive connector nomenclature\nNotice, that the only change in the Trino architecture is the runtime. The\nHMS still exists along with the storage. This is not by accident. This design\nexists to address a common problem faced by many companies. It simplifies the\nmigration from using Hive to using Trino. Regardless of the storage component\nused the runtime makes use of the HMS and that is the reason this connector is\nthe Hive connector.\nWhere the confusion tends to come from, is when you search for a connector\nfrom the context of the storage systems you want to query. You may not even be \naware the metastore is a necessity or even exists. Typically, you look for an\nS3 connector, a GCS connector or a MinIO connector. All you need is the Hive \nconnector and the HMS to manage the metadata of the objects in your storage.\nThe Hive Metastore Service\nThe HMS is the only Hive process used in the entire Trino ecosystem when using\nthe Hive connector. The HMS is actually a simple service with a binary API using\nthe Thrift protocol. This service makes updates to\nthe metadata, stored in an RDBMS such as PostgreSQL, MySQL, or MariaDB. There\nare other compatible replacements of the HMS such as AWS Glue, a\ndrop-in substitution for the HMS.\nGetting started with the Hive Connector on Trino\nTo drive this point home, I created a tutorial that showcases using Trino and\nlooking at the metadata it produces. In the following scenario, the docker \nenvironment contains four docker containers:\ntrino - the runtime in this scenario that replaces Hive.\nminio - the storage is an open-source cloud object storage.\nhive-metastore -  the metastore service instance.\nmariadb - the database that the metastore uses to store the metadata.\nYou can play around with the system and optionally view the configurations. The\nscenario asks you to run a query to populate data in MinIO and then see the\nresulting metadata populated in MariaDB by the HMS. The next step asks you to\nrun queries over the mariadb database which holds the generated\nmetadata from the metastore.\nIf you have any questions or run into any issues with the example, you can find\nus on slack on the #dev or #general channels.\nHave fun!"
author: "Brian Olsen"
contentHtml: "<div>\n<article>\n  <div><p>TL;DR: The Hive connector is what you use in Trino for reading data from object\nstorage that is organized according to the rules laid out by Hive, without using\nthe Hive runtime code.</p>\n<p>One of the most confusing aspects when starting Trino is the Hive connector. \nTypically, you seek out the use of Trino when you experience an intensely slow\nquery turnaround from your existing Hadoop, Spark, or Hive infrastructure. In\nfact, the genesis of Trino, formerly known as Presto, came about due to these \nslow Hive query conditions at Facebook back in 2012.</p>\n<p>So when you learn that Trino has a Hive connector,\nit can be rather confusing since you moved to Trino to circumvent the slowness\nof your current Hive cluster. Another common source of confusion is when you\nwant to query your data from your cloud object storage, such as AWS S3, MinIO, \nand Google Cloud Storage. This too uses the Hive connector. If that \nconfuses you, don’t worry, you are not alone. This blog aims to explain this\ncommonly confusing nomenclature.</p>\n<!--more-->\n<h2 id=\"hive-architecture\">\n    Hive architecture <a target=\"_blank\" href=\"https://trino.io/blog/2020/10/20/intro-to-hive-connector.html#hive-architecture\">#</a>\n</h2>\n<p>To understand the origins and inner workings of Trino’s Hive connector, you\nfirst need to know a few high level components of the Hive architecture.</p>\n<p><img src=\"https://trino.io/assets/blog/intro-to-hive-connector/hive.png\" alt=\"\"></p>\n<p>You can simplify the Hive architecture to four components:</p>\n<p><em>The runtime</em> contains the logic of the query engine that translates the SQL\n-esque Hive Query Language(HQL) into MapReduce jobs that run over files stored \nin the filesystem.</p>\n<p><em>The storage</em> component is simply that, it stores files in various formats and\nindex structures to recall these files. The file formats can be anything as\nsimple as JSON and CSV, to more complex files such as columnar formats like ORC\nand Parquet. Traditionally, Hive runs on top of the Hadoop Distributed\nFilesystem (HDFS). As cloud-based options became more prevalent, object storage\nlike Amazon S3, Azure Blob Storage, Google Cloud Storage, and others needed\nto be leveraged as well and replaced HDFS as the storage component.</p>\n<p>In order for Hive to process these files, it must have a mapping\nfrom SQL tables in <em>the runtime</em> to files and directories in <em>the storage</em>\ncomponent. To accomplish this, Hive uses the Hive Metastore Service (HMS), \noften shortened to <em>the metastore</em> to manage the metadata about the files such\nas table columns, file locations, file formats, etc…</p>\n<p>The last component not included in the image is Hive’s <em>data organization\nspecification</em>. The documentation of this element only exists in the code in\nHive and has been reverse engineered to be used by other systems like Trino \nto remain compatible with other systems.</p>\n<p>Trino reuses all of these components except for <em>the runtime</em>. This is the same\napproach most compute engines take when dealing with data in object stores, \nspecifically, Trino, Spark, Drill, and Impala. When you think of the Hive\nconnector, you should think about a connector that is capable of reading data\norganized by the unwritten Hive specification.</p>\n<h3 id=\"trino-runtime-replaces-hive-runtime\">\n    Trino runtime replaces Hive runtime <a target=\"_blank\" href=\"https://trino.io/blog/2020/10/20/intro-to-hive-connector.html#trino-runtime-replaces-hive-runtime\">#</a>\n</h3>\n<p>In the early days of big data systems, many expected query turnaround to take a \nlong time due to the high volume of unstructured data in ETL workloads. The\nprimary goal in early iterations of these systems was simply throughput over\nlarge volumes of data while maintaining fault-tolerance. Now, more businesses\nwant to run fast interactive queries over their big data instead of running jobs\nthat take hours and produce possibly undesirable results. Many companies have\npetabytes of data and metadata in their data warehouse. Data in storage is\ncumbersome to move and the data in the metastore takes a long time to repopulate\nin other formats. Since only the runtime that executed Hive queries needs\nreplacement, the Trino engine utilizes the existing metastore metadata and\nfiles residing in storage, and the Trino runtime effectively replaces the\nHive runtime responsible for analyzing the data.</p>\n<h2 id=\"trino-architecture\">\n    Trino Architecture <a target=\"_blank\" href=\"https://trino.io/blog/2020/10/20/intro-to-hive-connector.html#trino-architecture\">#</a>\n</h2>\n<p><img src=\"https://trino.io/assets/blog/intro-to-hive-connector/trino.png\" alt=\"\"></p>\n<h3 id=\"the-hive-connector-nomenclature\">\n    The Hive connector nomenclature <a target=\"_blank\" href=\"https://trino.io/blog/2020/10/20/intro-to-hive-connector.html#the-hive-connector-nomenclature\">#</a>\n</h3>\n<p>Notice, that the only change in the Trino architecture is <em>the runtime</em>. The\nHMS still exists along with <em>the storage</em>. This is not by accident. This design\nexists to address a common problem faced by many companies. It simplifies the\nmigration from using Hive to using Trino. Regardless of <em>the storage</em> component\nused <em>the runtime</em> makes use of the HMS and that is the reason this connector is\nthe Hive connector.</p>\n<p>Where the confusion tends to come from, is when you search for a connector\nfrom the context of the storage systems you want to query. You may not even be \naware <em>the metastore</em> is a necessity or even exists. Typically, you look for an\nS3 connector, a GCS connector or a MinIO connector. All you need is the Hive \nconnector and the HMS to manage the metadata of the objects in your storage.</p>\n<h3 id=\"the-hive-metastore-service\">\n    The Hive Metastore Service <a target=\"_blank\" href=\"https://trino.io/blog/2020/10/20/intro-to-hive-connector.html#the-hive-metastore-service\">#</a>\n</h3>\n<p>The HMS is the only Hive process used in the entire Trino ecosystem when using\nthe Hive connector. The HMS is actually a simple service with a binary API using\n<a target=\"_blank\" href=\"https://thrift.apache.org/\">the Thrift protocol</a>. This service makes updates to\nthe metadata, stored in an RDBMS such as PostgreSQL, MySQL, or MariaDB. There\nare other compatible replacements of the HMS such as AWS Glue, a\ndrop-in substitution for the HMS.</p>\n<h3 id=\"getting-started-with-the-hive-connector-on-trino\">\n    Getting started with the Hive Connector on Trino <a target=\"_blank\" href=\"https://trino.io/blog/2020/10/20/intro-to-hive-connector.html#getting-started-with-the-hive-connector-on-trino\">#</a>\n</h3>\n<p>To drive this point home, I created a tutorial that showcases using Trino and\nlooking at the metadata it produces. In the following scenario, the docker \nenvironment contains four docker containers:</p>\n<ul>\n  <li><code>trino</code> - <em>the runtime</em> in this scenario that replaces Hive.</li>\n  <li><code>minio</code> - <em>the storage</em> is an open-source cloud object storage.</li>\n  <li><code>hive-metastore</code> -  <em>the metastore</em> service instance.</li>\n  <li><code>mariadb</code> - the database that <em>the metastore</em> uses to store the metadata.</li>\n</ul>\n<p>You can play around with the system and optionally view the configurations. The\nscenario asks you to run a query to populate data in MinIO and then see the\nresulting metadata populated in MariaDB by the HMS. The next step asks you to\nrun queries over the <code>mariadb</code> database which holds the generated\nmetadata from <em>the metastore</em>.</p>\n<p>If you have any questions or run into any issues with the example, you can find\nus on <a target=\"_blank\" href=\"https://trino.io/slack\">slack</a> on the #dev or #general channels.</p>\n<p>Have fun!</p>\n<p><a href=\"https://github.com/bitsondatadev/trino-getting-started/tree/main/hive/trino-minio\" target=\"_blank\">\n<img src=\"https://trino.io/assets/blog/intro-to-hive-connector/intro-to-hive.jpeg\">\n</a></p>\n  </div>\n</article>\n</div>"
---

TL;DR: The Hive connector is what you use in Trino for reading data from object
storage that is organized according to the rules laid out by Hive, without using
the Hive runtime code.
One of the most confusing aspects when starting Trino is the Hive connector. 
Typically, you seek out the use of Trino when you experience an intensely slow
query turnaround from your existing Hadoop, Spark, or Hive infrastructure. In
fact, the genesis of Trino, formerly known as Presto, came about due to these 
slow Hive query conditions at Facebook back in 2012.
So when you learn that Trino has a Hive connector,
it can be rather confusing since you moved to Trino to circumvent the slowness
of your current Hive cluster. Another common source of confusion is when you
want to query your data from your cloud object storage, such as AWS S3, MinIO, 
and Google Cloud Storage. This too uses the Hive connector. If that 
confuses you, don’t worry, you are not alone. This blog aims to explain this
commonly confusing nomenclature.
Hive architecture
To understand the origins and inner workings of Trino’s Hive connector, you
first need to know a few high level components of the Hive architecture.

You can simplify the Hive architecture to four components:
The runtime contains the logic of the query engine that translates the SQL
-esque Hive Query Language(HQL) into MapReduce jobs that run over files stored 
in the filesystem.
The storage component is simply that, it stores files in various formats and
index structures to recall these files. The file formats can be anything as
simple as JSON and CSV, to more complex files such as columnar formats like ORC
and Parquet. Traditionally, Hive runs on top of the Hadoop Distributed
Filesystem (HDFS). As cloud-based options became more prevalent, object storage
like Amazon S3, Azure Blob Storage, Google Cloud Storage, and others needed
to be leveraged as well and replaced HDFS as the storage component.
In order for Hive to process these files, it must have a mapping
from SQL tables in the runtime to files and directories in the storage
component. To accomplish this, Hive uses the Hive Metastore Service (HMS), 
often shortened to the metastore to manage the metadata about the files such
as table columns, file locations, file formats, etc…
The last component not included in the image is Hive’s data organization
specification. The documentation of this element only exists in the code in
Hive and has been reverse engineered to be used by other systems like Trino 
to remain compatible with other systems.
Trino reuses all of these components except for the runtime. This is the same
approach most compute engines take when dealing with data in object stores, 
specifically, Trino, Spark, Drill, and Impala. When you think of the Hive
connector, you should think about a connector that is capable of reading data
organized by the unwritten Hive specification.
Trino runtime replaces Hive runtime
In the early days of big data systems, many expected query turnaround to take a 
long time due to the high volume of unstructured data in ETL workloads. The
primary goal in early iterations of these systems was simply throughput over
large volumes of data while maintaining fault-tolerance. Now, more businesses
want to run fast interactive queries over their big data instead of running jobs
that take hours and produce possibly undesirable results. Many companies have
petabytes of data and metadata in their data warehouse. Data in storage is
cumbersome to move and the data in the metastore takes a long time to repopulate
in other formats. Since only the runtime that executed Hive queries needs
replacement, the Trino engine utilizes the existing metastore metadata and
files residing in storage, and the Trino runtime effectively replaces the
Hive runtime responsible for analyzing the data.
Trino Architecture

The Hive connector nomenclature
Notice, that the only change in the Trino architecture is the runtime. The
HMS still exists along with the storage. This is not by accident. This design
exists to address a common problem faced by many companies. It simplifies the
migration from using Hive to using Trino. Regardless of the storage component
used the runtime makes use of the HMS and that is the reason this connector is
the Hive connector.
Where the confusion tends to come from, is when you search for a connector
from the context of the storage systems you want to query. You may not even be 
aware the metastore is a necessity or even exists. Typically, you look for an
S3 connector, a GCS connector or a MinIO connector. All you need is the Hive 
connector and the HMS to manage the metadata of the objects in your storage.
The Hive Metastore Service
The HMS is the only Hive process used in the entire Trino ecosystem when using
the Hive connector. The HMS is actually a simple service with a binary API using
the Thrift protocol. This service makes updates to
the metadata, stored in an RDBMS such as PostgreSQL, MySQL, or MariaDB. There
are other compatible replacements of the HMS such as AWS Glue, a
drop-in substitution for the HMS.
Getting started with the Hive Connector on Trino
To drive this point home, I created a tutorial that showcases using Trino and
looking at the metadata it produces. In the following scenario, the docker 
environment contains four docker containers:
trino - the runtime in this scenario that replaces Hive.
minio - the storage is an open-source cloud object storage.
hive-metastore -  the metastore service instance.
mariadb - the database that the metastore uses to store the metadata.
You can play around with the system and optionally view the configurations. The
scenario asks you to run a query to populate data in MinIO and then see the
resulting metadata populated in MariaDB by the HMS. The next step asks you to
run queries over the mariadb database which holds the generated
metadata from the metastore.
If you have any questions or run into any issues with the example, you can find
us on slack on the #dev or #general channels.
Have fun!
