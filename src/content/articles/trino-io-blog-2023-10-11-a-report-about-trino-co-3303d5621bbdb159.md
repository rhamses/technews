---
title: "A report from the Trino Conference Tokyo 2023"
link: "https://trino.io/blog/2023/10/11/a-report-about-trino-conference-tokyo-2023.html"
guid: "https://trino.io/blog/2023/10/11/a-report-about-trino-conference-tokyo-2023.html"
pubDate: "2023-10-11T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "The Trino community in Japan held an online event on October 5th, 2023. This\narticle is a summary of the conference aiming to share the presentations and\nprovide an overview.\nWatch a replay of the whole event, or jump to specific time stamps and topic of\ninterest:\n\n\n\nThis year, there were 4 sessions:\nTrino, Starburst Galaxy, and Enterprise\nLog infrastructure using Trino and Iceberg\nData infrastructure using Spark and Trino on bare metal k8s\nGetting started Trino and a transactional data lake with serverless Athena\nTrino, Starburst Galaxy, and Enterprise\nThe first session was presented by Yuya Ebihara (me) from Starburst. I explained\nthe Trino changes from 2022 and 2023, as well as features of Starburst Galaxy\nand Starburst Enterprise. The session introduced a press release of the\npartnership of Starburst and Dell Technologies in\nJapan.\n\n\nLog infrastructure using Trino and Iceberg\nThe second session was presented by Tadahisa Kamijo from Sakura Internet. He\n explained some requirements for new analytics environments such as concurrent\nread/write, schema evolution, record-level modification, restoring past\nsnapshots, and addressing performance issues with the Hive metastore. They\ndecided to use Trino and Iceberg for handling these requests. Kamijo-san also\nintroduced the file layout in Iceberg and demonstrated how to debug Iceberg\nfiles using their Java client.\n\n\nData infrastructure using Spark an Trino on bare metal k8s\nThe third session was presented by Yasukazu Nagatomi from MicroAd. They started\na migration to Trino from Impala to resolve the following issues - separating\ncomputing and storage, refreshing and utilizing table and column statistics even\nwith large tables, and supporting schema evolution. Nagatomi-san shared a use\ncase of the Trino features fault-tolerant execution and spill-to-disk, which is\nthe first public use case of these features in Japan.\n \n  ベアメタルで実現するSpark＆Trino on K8sなデータ基盤  from MicroAd, Inc.(Engineer) \nGetting started Trino and a transactional data lake with serverless Athena\nThe last session was presented by Sotaro Hikita from AWS. Athena is a serverless\nservice for ad hoc analytics with Trino and Presto foundation. It supports not only S3\ndata but also various datasources via Federated Query. In Athena, Iceberg\nsupports both read and write operations, while Hudi and Delta Lake only support\nread operations.\n\n\nWrap up\nWe sincerely appreciate the participation of community members in Japan. Thank\nyou so much for watching the live event. We are planning to hold an offline\nevent next year, see you next time!\nYuya"
author: "Yuya Ebihara"
contentHtml: "<p>The Trino community in Japan held an online event on October 5th, 2023. This\narticle is a summary of the conference aiming to share the presentations and\nprovide an overview.</p>\n\n<!--more-->\n\n<p>Watch a replay of the whole event, or jump to specific time stamps and topic of\ninterest:</p>\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p>This year, there were 4 sessions:</p>\n\n<ol>\n  <li>Trino, Starburst Galaxy, and Enterprise</li>\n  <li>Log infrastructure using Trino and Iceberg</li>\n  <li>Data infrastructure using Spark and Trino on bare metal k8s</li>\n  <li>Getting started Trino and a transactional data lake with serverless Athena</li>\n</ol>\n\n<h1 id=\"trino-starburst-galaxy-and-enterprise\">Trino, Starburst Galaxy, and Enterprise</h1>\n\n<p>The first session was presented by Yuya Ebihara (me) from Starburst. I explained\nthe Trino changes from 2022 and 2023, as well as features of Starburst Galaxy\nand Starburst Enterprise. The session introduced <a href=\"https://prtimes.jp/main/html/rd/p/000000226.000025237.html\">a press release of the\npartnership of Starburst and Dell Technologies in\nJapan</a>.</p>\n\n\n\n<h1 id=\"log-infrastructure-using-trino-and-iceberg\">Log infrastructure using Trino and Iceberg</h1>\n\n<p>The second session was presented by Tadahisa Kamijo from Sakura Internet. He\n explained some requirements for new analytics environments such as concurrent\nread/write, schema evolution, record-level modification, restoring past\nsnapshots, and addressing performance issues with the Hive metastore. They\ndecided to use Trino and Iceberg for handling these requests. Kamijo-san also\nintroduced the file layout in Iceberg and demonstrated how to debug Iceberg\nfiles using their Java client.</p>\n\n\n\n<h1 id=\"data-infrastructure-using-spark-an-trino-on-bare-metal-k8s\">Data infrastructure using Spark an Trino on bare metal k8s</h1>\n\n<p>The third session was presented by Yasukazu Nagatomi from MicroAd. They started\na migration to Trino from Impala to resolve the following issues - separating\ncomputing and storage, refreshing and utilizing table and column statistics even\nwith large tables, and supporting schema evolution. Nagatomi-san shared a use\ncase of the Trino features fault-tolerant execution and spill-to-disk, which is\nthe first public use case of these features in Japan.</p>\n\n\n<div style=\"margin-bottom:5px\"> <strong> <a href=\"//www.slideshare.net/microad_engineer/trino-conference-tokyo-2023\" title=\"ベアメタルで実現するSpark＆Trino on K8sなデータ基盤\" target=\"_blank\">ベアメタルで実現するSpark＆Trino on K8sなデータ基盤</a> </strong> from <strong><a href=\"//www.slideshare.net/microad_engineer\" target=\"_blank\">MicroAd, Inc.(Engineer)</a></strong> </div>\n\n<h1 id=\"getting-started-trino-and-a-transactional-data-lake-with-serverless-athena\">Getting started Trino and a transactional data lake with serverless Athena</h1>\n\n<p>The last session was presented by Sotaro Hikita from AWS. Athena is a serverless\nservice for ad hoc analytics with Trino and Presto foundation. It supports not only S3\ndata but also various datasources via Federated Query. In Athena, Iceberg\nsupports both read and write operations, while Hudi and Delta Lake only support\nread operations.</p>\n\n\n\n<h1 id=\"wrap-up\">Wrap up</h1>\n\n<p>We sincerely appreciate the participation of community members in Japan. Thank\nyou so much for watching the live event. We are planning to hold an offline\nevent next year, see you next time!</p>\n\n<p><em>Yuya</em></p>"
---

The Trino community in Japan held an online event on October 5th, 2023. This
article is a summary of the conference aiming to share the presentations and
provide an overview.
Watch a replay of the whole event, or jump to specific time stamps and topic of
interest:



This year, there were 4 sessions:
Trino, Starburst Galaxy, and Enterprise
Log infrastructure using Trino and Iceberg
Data infrastructure using Spark and Trino on bare metal k8s
Getting started Trino and a transactional data lake with serverless Athena
Trino, Starburst Galaxy, and Enterprise
The first session was presented by Yuya Ebihara (me) from Starburst. I explained
the Trino changes from 2022 and 2023, as well as features of Starburst Galaxy
and Starburst Enterprise. The session introduced a press release of the
partnership of Starburst and Dell Technologies in
Japan.


Log infrastructure using Trino and Iceberg
The second session was presented by Tadahisa Kamijo from Sakura Internet. He
 explained some requirements for new analytics environments such as concurrent
read/write, schema evolution, record-level modification, restoring past
snapshots, and addressing performance issues with the Hive metastore. They
decided to use Trino and Iceberg for handling these requests. Kamijo-san also
introduced the file layout in Iceberg and demonstrated how to debug Iceberg
files using their Java client.


Data infrastructure using Spark an Trino on bare metal k8s
The third session was presented by Yasukazu Nagatomi from MicroAd. They started
a migration to Trino from Impala to resolve the following issues - separating
computing and storage, refreshing and utilizing table and column statistics even
with large tables, and supporting schema evolution. Nagatomi-san shared a use
case of the Trino features fault-tolerant execution and spill-to-disk, which is
the first public use case of these features in Japan.
 
  ベアメタルで実現するSpark＆Trino on K8sなデータ基盤  from MicroAd, Inc.(Engineer) 
Getting started Trino and a transactional data lake with serverless Athena
The last session was presented by Sotaro Hikita from AWS. Athena is a serverless
service for ad hoc analytics with Trino and Presto foundation. It supports not only S3
data but also various datasources via Federated Query. In Athena, Iceberg
supports both read and write operations, while Hudi and Delta Lake only support
read operations.


Wrap up
We sincerely appreciate the participation of community members in Japan. Thank
you so much for watching the live event. We are planning to hold an offline
event next year, see you next time!
Yuya
