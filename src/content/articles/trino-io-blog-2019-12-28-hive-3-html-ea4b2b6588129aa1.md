---
title: "Hive 3 support in Presto"
link: "https://trino.io/blog/2019/12/28/hive-3.html"
guid: "https://trino.io/blog/2019/12/28/hive-3.html"
pubDate: "2019-12-28T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "The Hive community is centered around a few different Hive distributions, one of them\nbeing Hortonworks Data Platform (HDP). Even after the Cloudera-Hortonworks merger there\nis vivid interest in HDP 3, featuring Hive 3. Presto is ready for the game.\nIn this post, we summarize which Hive 3 features Presto already supports, covering\nall the work that went into Presto to achieve that. We also outline next steps lying\nahead.\nIntroduction\nThere are several Hive versions in active use by the Hive community: 0.x, 1.x, 2.x\nand 3.x. Hive 3 major release brings a number of interesting features, including:\nsupport for Hadoop Erasure Coding (EC), allowing much better HDFS storage capacity\nutilization\nwithout reducing data availability,\nupdate to ORC ACID transactional tables - they no longer need to be bucketed,\ntransactional tables for all file formats (“insert-only” except for ORC),\nmaterialized views,\nnew bucketing function, offering a better data distribution and less data skew,\nnew timestamp semantics and timestamp-related changes in file formats,\nand a lot more (let’s skip over features and changes that are not interesting from\nPresto perspective).\nThat’s no surprise that many people want to try out all these features and run Hive 3,\neither the Apache project’s official release or using HDP version 3.\nHive 3 in Presto\nThe Presto community expressed interest in using Presto with Hive 3, both in the project’s\nissues and on Slack.\nYou spoke, we listened. Actually – we, community, spoke and listened.\nIn collaboration between Starburst, Qubole and the wider Presto community, Presto gradually\nimproves its compatibility with Hive 3:\nPresto 319 fixed issues with backwards-incompatible changes in Hive metastore thrift API\nPresto 320 added continuous integration with Hive 3\nPresto 321 added support for Hive bucketing v2\n(\"bucketing_version\"=\"2\")\nPresto 325 added continuous integration with HDP 3’s Hive 3\nPresto 327 added support for reading from insert-only transactional tables, and added compatibility with timestamp\nvalues stored in ORC by Hive 3.1\nUpcoming improvements already being worked on include:\nRead support for ORC ACID tables\nRead support for bucketed ORC ACID tables\nTry it out\nThe amazing Presto community is working hard on\ngetting Hive 3 support fully integrated in the Presto project and a lot is already accomplished.\nChances are THAT all you need is already included in the latest release. If you need one of the upcoming\nimprovements, watch the pull requests linked above, the roadmap issue,\njoin Slack and stay tuned for upcoming release announcements. In the meantime, you\ncan try out the features today by running the 323-e release of Starburst Presto.\n□"
author: "Piotr Findeisen, Starburst Data"
contentHtml: "<p>The Hive community is centered around a few different Hive distributions, one of them\nbeing Hortonworks Data Platform (HDP). Even after the Cloudera-Hortonworks merger there\nis vivid interest in HDP 3, featuring Hive 3. Presto is ready for the game.</p>\n\n<p>In this post, we summarize which Hive 3 features Presto already supports, covering\nall the work that went into Presto to achieve that. We also outline next steps lying\nahead.</p>\n\n<!--more-->\n\n<h1 id=\"introduction\">Introduction</h1>\n\n<p>There are several Hive versions in active use by the Hive community: 0.x, 1.x, 2.x\nand 3.x. Hive 3 major release brings a number of interesting features, including:</p>\n\n<ul>\n  <li>support for Hadoop Erasure Coding (EC), allowing <a href=\"https://blog.cloudera.com/introduction-to-hdfs-erasure-coding-in-apache-hadoop/\">much better HDFS storage capacity\nutilization</a>\nwithout reducing data availability,</li>\n  <li>update to ORC ACID transactional tables - they no longer need to be bucketed,</li>\n  <li>transactional tables for all file formats (“insert-only” except for ORC),</li>\n  <li>materialized views,</li>\n  <li>new bucketing function, offering a better data distribution and less data skew,</li>\n  <li>new timestamp semantics and timestamp-related changes in file formats,</li>\n  <li>and a lot more (let’s skip over features and changes that are not interesting from\nPresto perspective).</li>\n</ul>\n\n<p>That’s no surprise that many people want to try out all these features and run Hive 3,\neither the Apache project’s official release or using HDP version 3.</p>\n\n<h1 id=\"hive-3-in-presto\">Hive 3 in Presto</h1>\n\n<p>The Presto community expressed interest in using Presto with Hive 3, both in the project’s\n<a href=\"https://github.com/trinodb/trino/issues/576\">issues</a> and on <a href=\"/slack.html\">Slack</a>.</p>\n\n<p>You spoke, we listened. Actually – we, community, spoke <em>and</em> listened.</p>\n\n<p>In collaboration between Starburst, Qubole and the wider Presto community, Presto gradually\nimproves its compatibility with Hive 3:</p>\n\n<ul>\n  <li>Presto 319 <a href=\"https://github.com/trinodb/trino/pull/1532\">fixed issues with backwards-incompatible changes in Hive metastore thrift API</a></li>\n  <li>Presto 320 <a href=\"https://github.com/trinodb/trino/pull/1614\">added continuous integration with Hive 3</a></li>\n  <li>Presto 321 <a href=\"https://github.com/trinodb/trino/pull/1697\">added support for Hive bucketing v2</a>\n(<code class=\"language-plaintext highlighter-rouge\">\"bucketing_version\"=\"2\"</code>)</li>\n  <li>Presto 325 <a href=\"https://github.com/trinodb/trino/pull/1958\">added continuous integration with HDP 3’s Hive 3</a></li>\n  <li>Presto 327 <a href=\"https://github.com/trinodb/trino/pull/1034\">added support for reading from insert-only transactional tables</a>, and <a href=\"https://github.com/trinodb/trino/pull/2099\">added compatibility with timestamp\nvalues stored in ORC by Hive 3.1</a></li>\n</ul>\n\n<p>Upcoming improvements already being worked on include:</p>\n\n<ul>\n  <li><a href=\"https://github.com/trinodb/trino/pull/2068\">Read support for ORC ACID tables</a></li>\n  <li><a href=\"https://github.com/trinodb/trino/pull/1591\">Read support for bucketed ORC ACID tables</a></li>\n</ul>\n\n<h1 id=\"try-it-out\">Try it out</h1>\n\n<p>The <a href=\"https://twitter.com/findepi/status/1204783485094944768\">amazing Presto community</a> is working hard on\ngetting Hive 3 support fully integrated in the Presto project and a lot is already accomplished.\nChances are THAT all you need is already included in the latest release. If you need one of the upcoming\nimprovements, watch the pull requests linked above, the <a href=\"https://github.com/trinodb/trino/issues/1218\">roadmap issue</a>,\njoin <a href=\"/slack.html\">Slack</a> and stay tuned for upcoming release announcements. In the meantime, you\ncan try out the features today by running the <a href=\"https://docs.starburstdata.com/latest/release/release-323-e.html\">323-e release</a> of Starburst Presto.</p>\n\n<p>□</p>"
---

The Hive community is centered around a few different Hive distributions, one of them
being Hortonworks Data Platform (HDP). Even after the Cloudera-Hortonworks merger there
is vivid interest in HDP 3, featuring Hive 3. Presto is ready for the game.
In this post, we summarize which Hive 3 features Presto already supports, covering
all the work that went into Presto to achieve that. We also outline next steps lying
ahead.
Introduction
There are several Hive versions in active use by the Hive community: 0.x, 1.x, 2.x
and 3.x. Hive 3 major release brings a number of interesting features, including:
support for Hadoop Erasure Coding (EC), allowing much better HDFS storage capacity
utilization
without reducing data availability,
update to ORC ACID transactional tables - they no longer need to be bucketed,
transactional tables for all file formats (“insert-only” except for ORC),
materialized views,
new bucketing function, offering a better data distribution and less data skew,
new timestamp semantics and timestamp-related changes in file formats,
and a lot more (let’s skip over features and changes that are not interesting from
Presto perspective).
That’s no surprise that many people want to try out all these features and run Hive 3,
either the Apache project’s official release or using HDP version 3.
Hive 3 in Presto
The Presto community expressed interest in using Presto with Hive 3, both in the project’s
issues and on Slack.
You spoke, we listened. Actually – we, community, spoke and listened.
In collaboration between Starburst, Qubole and the wider Presto community, Presto gradually
improves its compatibility with Hive 3:
Presto 319 fixed issues with backwards-incompatible changes in Hive metastore thrift API
Presto 320 added continuous integration with Hive 3
Presto 321 added support for Hive bucketing v2
("bucketing_version"="2")
Presto 325 added continuous integration with HDP 3’s Hive 3
Presto 327 added support for reading from insert-only transactional tables, and added compatibility with timestamp
values stored in ORC by Hive 3.1
Upcoming improvements already being worked on include:
Read support for ORC ACID tables
Read support for bucketed ORC ACID tables
Try it out
The amazing Presto community is working hard on
getting Hive 3 support fully integrated in the Presto project and a lot is already accomplished.
Chances are THAT all you need is already included in the latest release. If you need one of the upcoming
improvements, watch the pull requests linked above, the roadmap issue,
join Slack and stay tuned for upcoming release announcements. In the meantime, you
can try out the features today by running the 323-e release of Starburst Presto.
□
