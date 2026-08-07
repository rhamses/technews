---
title: "Out with the old file system"
link: "https://trino.io/blog/2025/02/10/old-file-system.html"
guid: "https://trino.io/blog/2025/02/10/old-file-system.html"
pubDate: "2025-02-10T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "What a long journey it has been! From the start Trino supported querying Hive\ndata and used libraries from the Hive and Hadoop ecosystem. With the release of\nTrino 470 we mark\nanother milestone to more features and better performance for data lake and\nlakehouse querying with Trino. We deprecated the legacy file system support, and\nwill permanently remove them in an upcoming release.\nBackground\nTrino always had a focus on performance and security. As a result we implemented\ncustom readers for file formats like Apache ORC and Apache Parquet many years\nago. We also have improved libraries for compression and decompression of files\nfrom object storage and and implemented our own support for other table formats\nwith the Apache Iceberg, Delta Lake and Apache Hudi connectors.\nFor the underlying object storage solutions and file systems, we originally\nextended the libraries around the Hive system and added implementations for\nAmazon S3, Azure Storage, Google Cloud Storage and others. Over time the\nmismatch of the HDFS libraries and the cloud-centric usage with modern file\nsystems became more and more of a maintenance headache. It also represented an\nunnecessary complexity overhead, resulted in performance problems, and forced us\nto carry the Hadoop dependencies with all their baggage of old Java code and\nsecurity issues.\nIn the end David Philips, as our file system lead, decided in 2022 that it was\ntime to write our own file system support as needed for Trino. By summer of 2023\nand with Trino 419 a first support for\nS3 became available for the\nIceberg and Delta Lake connectors. Over a year later in September 2024 and with\nTrino 458, we declared\nthe old file system support on top of the Hadoop libraries legacy and advised\nusers to migrate.\nSince then you are required to declare what file system you want to enable in\neach catalog with fs.native-azure.enabled=true,fs.native-gcs.enabled=true or\nfs.native-s3.enabled=true. If you are truly using HDFS, or if you insist on\nusing the old legacy support you can also use fs.hadoop.enabled=true.\nTrino 470\nWith the recent Trino 470\nrelease from February\n2025, we took the next step. All catalog configuration properties for using the\nold, legacy support for accessing Azure Storage, Google Cloud Storage, S3, and\nS3-compatible file systems are now deprecated.\nThese properties include all names starting with hive.azure, hive.cos,\nhive.gcs, and hive.s3. The result of this deprecation is that Trino emits\nwarnings during the startup for each of these properties in the server log.\nWe also removed all documentation for the old properties, leaving only relevant\nmigration guides in place.\nNext steps\nWithin the next weeks or months we will completely remove all these properties\nand the underlying code. We therefore renew our call out from numerous\ncontributor calls, Trino Community Broadcast episodes, and our Trino Fest and\nTrino Summit events:\nStop using the old legacy file systems today.\nIf you need help, have a look at the documentation for your connector, the file\nsystem you use, and the migration guide for each file system:\nDelta Lake connector\nHive connector\nHudi connector\nIceberg connector\nAzure Storage file system support\nGoogle Cloud Storage file system support\nS3 file system support\nThe new systems are more stable and performant, and save you time and money.\nMigrate today, and if you encounter any issues, or find that there are features\nmissing, ping us on Slack and chime in on the\nroadmap issue for the removal of the legacy file system\nsupport."
author: "Manfred Moser, David Phillips, Mateusz Gajewski"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/hadoop-trashcan.png\">\n    </p>\n    <p>What a long journey it has been! From the start Trino supported querying Hive\ndata and used libraries from the Hive and Hadoop ecosystem. With the release of\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-470.html\">Trino 470</a> we mark\nanother milestone to more features and better performance for data lake and\nlakehouse querying with Trino. We deprecated the legacy file system support, and\nwill permanently remove them in an upcoming release.</p>\n<!--more-->\n<h2 id=\"background\">\n    Background <a target=\"_blank\" href=\"https://trino.io/blog/2025/02/10/old-file-system.html#background\">#</a>\n</h2>\n<p>Trino always had a focus on performance and security. As a result we implemented\ncustom readers for file formats like Apache ORC and Apache Parquet many years\nago. We also have improved libraries for compression and decompression of files\nfrom object storage and and implemented our own support for other table formats\nwith the Apache Iceberg, Delta Lake and Apache Hudi connectors.</p>\n<p>For the underlying object storage solutions and file systems, we originally\nextended the libraries around the Hive system and added implementations for\nAmazon S3, Azure Storage, Google Cloud Storage and others. Over time the\nmismatch of the HDFS libraries and the cloud-centric usage with modern file\nsystems became more and more of a maintenance headache. It also represented an\nunnecessary complexity overhead, resulted in performance problems, and forced us\nto carry the Hadoop dependencies with all their baggage of old Java code and\nsecurity issues.</p>\n<p>In the end David Philips, as our file system lead, decided in 2022 that it was\ntime to write our own file system support as needed for Trino. By summer of 2023\nand with Trino 419 a <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/17498\">first support for\nS3</a> became available for the\nIceberg and Delta Lake connectors. Over a year later in September 2024 and with\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-458.html\">Trino 458</a>, we declared\nthe old file system support on top of the Hadoop libraries legacy and advised\nusers to migrate.</p>\n<p>Since then you are required to declare what file system you want to enable in\neach catalog with <code>fs.native-azure.enabled=true</code>,<code>fs.native-gcs.enabled=true</code> or\n<code>fs.native-s3.enabled=true</code>. If you are truly using HDFS, or if you insist on\nusing the old legacy support you can also use <code>fs.hadoop.enabled=true</code>.</p>\n<h2 id=\"trino-470\">\n    Trino 470 <a target=\"_blank\" href=\"https://trino.io/blog/2025/02/10/old-file-system.html#trino-470\">#</a>\n</h2>\n<p>With the recent <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-470.html\">Trino 470\nrelease</a> from February\n2025, we took the next step. All catalog configuration properties for using the\nold, legacy support for accessing Azure Storage, Google Cloud Storage, S3, and\nS3-compatible file systems are now <strong>deprecated</strong>.</p>\n<p>These properties include all names starting with <code>hive.azure</code>, <code>hive.cos</code>,\n<code>hive.gcs</code>, and <code>hive.s3</code>. The result of this deprecation is that Trino emits\nwarnings during the startup for each of these properties in the server log.</p>\n<p>We also removed all documentation for the old properties, leaving only relevant\nmigration guides in place.</p>\n<h2 id=\"next-steps\">\n    Next steps <a target=\"_blank\" href=\"https://trino.io/blog/2025/02/10/old-file-system.html#next-steps\">#</a>\n</h2>\n<p>Within the next weeks or months we will completely remove all these properties\nand the underlying code. We therefore renew our call out from numerous\ncontributor calls, Trino Community Broadcast episodes, and our Trino Fest and\nTrino Summit events:</p>\n<blockquote>\n  <p>Stop using the old legacy file systems today.</p>\n</blockquote>\n<p>If you need help, have a look at the documentation for your connector, the file\nsystem you use, and the migration guide for each file system:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/hive.html\">Delta Lake connector</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/hive.html\">Hive connector</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/hive.html\">Hudi connector</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/hive.html\">Iceberg connector</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/object-storage/file-system-azure.html\">Azure Storage file system support</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/object-storage/file-system-gcs.html\">Google Cloud Storage file system support</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/object-storage/file-system-s3.html\">S3 file system support</a></li>\n</ul>\n<p>The new systems are more stable and performant, and save you time and money.\nMigrate today, and if you encounter any issues, or find that there are features\nmissing, ping us on <a target=\"_blank\" href=\"https://trino.io/slack./html\">Slack</a> and chime in on the\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/24878\">roadmap issue for the removal of the legacy file system\nsupport</a>.</p>\n  </div>\n</article>\n</div>"
---

What a long journey it has been! From the start Trino supported querying Hive
data and used libraries from the Hive and Hadoop ecosystem. With the release of
Trino 470 we mark
another milestone to more features and better performance for data lake and
lakehouse querying with Trino. We deprecated the legacy file system support, and
will permanently remove them in an upcoming release.
Background
Trino always had a focus on performance and security. As a result we implemented
custom readers for file formats like Apache ORC and Apache Parquet many years
ago. We also have improved libraries for compression and decompression of files
from object storage and and implemented our own support for other table formats
with the Apache Iceberg, Delta Lake and Apache Hudi connectors.
For the underlying object storage solutions and file systems, we originally
extended the libraries around the Hive system and added implementations for
Amazon S3, Azure Storage, Google Cloud Storage and others. Over time the
mismatch of the HDFS libraries and the cloud-centric usage with modern file
systems became more and more of a maintenance headache. It also represented an
unnecessary complexity overhead, resulted in performance problems, and forced us
to carry the Hadoop dependencies with all their baggage of old Java code and
security issues.
In the end David Philips, as our file system lead, decided in 2022 that it was
time to write our own file system support as needed for Trino. By summer of 2023
and with Trino 419 a first support for
S3 became available for the
Iceberg and Delta Lake connectors. Over a year later in September 2024 and with
Trino 458, we declared
the old file system support on top of the Hadoop libraries legacy and advised
users to migrate.
Since then you are required to declare what file system you want to enable in
each catalog with fs.native-azure.enabled=true,fs.native-gcs.enabled=true or
fs.native-s3.enabled=true. If you are truly using HDFS, or if you insist on
using the old legacy support you can also use fs.hadoop.enabled=true.
Trino 470
With the recent Trino 470
release from February
2025, we took the next step. All catalog configuration properties for using the
old, legacy support for accessing Azure Storage, Google Cloud Storage, S3, and
S3-compatible file systems are now deprecated.
These properties include all names starting with hive.azure, hive.cos,
hive.gcs, and hive.s3. The result of this deprecation is that Trino emits
warnings during the startup for each of these properties in the server log.
We also removed all documentation for the old properties, leaving only relevant
migration guides in place.
Next steps
Within the next weeks or months we will completely remove all these properties
and the underlying code. We therefore renew our call out from numerous
contributor calls, Trino Community Broadcast episodes, and our Trino Fest and
Trino Summit events:
Stop using the old legacy file systems today.
If you need help, have a look at the documentation for your connector, the file
system you use, and the migration guide for each file system:
Delta Lake connector
Hive connector
Hudi connector
Iceberg connector
Azure Storage file system support
Google Cloud Storage file system support
S3 file system support
The new systems are more stable and performant, and save you time and money.
Migrate today, and if you encounter any issues, or find that there are features
missing, ping us on Slack and chime in on the
roadmap issue for the removal of the legacy file system
support.
