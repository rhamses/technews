---
title: "Trino delivers for Amazon Athena"
link: "https://trino.io/blog/2022/12/01/athena.html"
guid: "https://trino.io/blog/2022/12/01/athena.html"
pubDate: "2022-12-01T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Our community just keeps growing! Today, it is time to reach out and welcome\nanother large group of Trino users. The release of the new engine version for\nAmazon Athena upgrades Athena to a recent\nversion of Trino from a rather old version. This update brings a ton of\nimprovements from the Trino project to the users of the popular cloud-based\nquery service.\nShared history\nAmazon Athena and Trino share a long history. From the beginning of Athena, the\nquery engine under the hood was Trino, then still called Presto. Athena created\na low-maintenance, powerful access mode to your data in S3 and beyond. It\ncombined the performance and features of Trino, with the convenience of a cloud\nservice, which enabled new users and use cases. You could take advantage of\nTrino without needing a team of experts to deploy and operate a Trino cluster\nfor your organization. In fact, we wrote about this in the first edition of\nTrino: The Definitive Guide. There is also a section in the new second\nedition that you can get for\nfree from Starburst.\nTime flies\nBut since the initial release of Athena, time has not stood still. In fact, the\nTrino project has accelerated in innovation, features, and releases\ntremendously. Until now Athena\nusers missed out on these improvements. However with the update Amazon Athena\nusers now get access to many of these great features. As AWS mentions in the\nannouncement,\n“over 50 new SQL functions, 30 new features, and more than 90 query performance\nimprovements” are now available due the upgrade to a new version of Trino. These\ninclude Row pattern recognition with MATCH_RECOGNIZE, new window features, support for UPDATE or\nTRUNCATE statements, and many others.\nPerformance improvements in our core engine and all the Trino connectors show up\nin every release note. The improvements observed by the Athena team in their\nbenchmarks\nshow the resulting gains nicely. This is great evidence that our approach of\nconstantly working on small improvements wherever we find potential works well.\nThis approach is necessary since Trino is already at a very high performance\nlevel, and like an elite athlete, where every small improvement matters.\nIt is also important to note that these improvements are only in the  Trino\nversion of the engine, since the Presto project does not include these\nfeatures.\nClient tools and collaboration\nAthena users also benefit from improvements for supporting client tools such as\nPython clients, dbt, Metabase and others. Working with other communities is of\ncritical importance to the Trino project. The innovations in our Iceberg\nconnector that are all now also available to\nAthena users are a great example how we can lead the way together. Working with\ncontributors from Amazon and other companies and projects has yielded some\namazing improvements. At the Trino summit and contributor\ncongregation, we to reconnected in person and\nestablished even closer collaboration.\nLooking forward\nSo, what is next for Trino and Athena users? First up, you should upgrade to the\nnew Trino engine in Athena, and avoid the legacy Presto engine.\nSecond, check out some of the great presentations from Trino Summit 2022 and hear about some of our\nimpressions.\nAnd last but not least, stay tuned for more goodness. Trino already shipped\nfurther releases that included support for MERGE, table functions, and more\nperformance improvements. The Athena team is working hard on updating Trino for\nyour benefit regularly.\nCelebrating our first decade of the Trino project this last summer has shown a great trajectory for\nthe project and the community, and it looks like the next decade is going to be\neven better!\nSending a warm welcome from the Trino community to the Amazon Athena team and\nusers. Now you know that you were Trino users all along.\nMartin and Manfred"
author: "Manfred Moser, Martin Traverso"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/trino-light.png\">\n    </p>\n    <p>Our community just keeps growing! Today, it is time to reach out and welcome\nanother large group of Trino users. The release of the new engine version for\n<a target=\"_blank\" href=\"https://aws.amazon.com/athena\">Amazon Athena</a> upgrades Athena to a recent\nversion of Trino from a rather old version. This update brings a ton of\nimprovements from the Trino project to the users of the popular cloud-based\nquery service.</p>\n<!--more-->\n<h2 id=\"shared-history\">\n    Shared history <a target=\"_blank\" href=\"https://trino.io/blog/2022/12/01/athena.html#shared-history\">#</a>\n</h2>\n<p>Amazon Athena and Trino share a long history. From the beginning of Athena, the\nquery engine under the hood was Trino, then still called Presto. Athena created\na low-maintenance, powerful access mode to your data in S3 and beyond. It\ncombined the performance and features of Trino, with the convenience of a cloud\nservice, which enabled new users and use cases. You could take advantage of\nTrino without needing a team of experts to deploy and operate a Trino cluster\nfor your organization. In fact, we wrote about this in the first edition of\n<strong>Trino: The Definitive Guide</strong>. There is also a section in the <a target=\"_blank\" href=\"https://trino.io/blog/2022/10/03/the-definitive-guide-2\">new second\nedition</a> that you can get for\n<a target=\"_blank\" href=\"https://www.starburst.io/info/oreilly-trino-guide/\">free from Starburst</a>.</p>\n<h2 id=\"time-flies\">\n    Time flies <a target=\"_blank\" href=\"https://trino.io/blog/2022/12/01/athena.html#time-flies\">#</a>\n</h2>\n<p>But since the initial release of Athena, time has not stood still. In fact, the\nTrino project has accelerated in <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation\">innovation, features, and releases\ntremendously</a>. Until now Athena\nusers missed out on these improvements. However with the update Amazon Athena\nusers now get access to many of these great features. As <a target=\"_blank\" href=\"https://aws.amazon.com/about-aws/whats-new/2022/10/amazon-athena-announces-upgraded-query-engine/\">AWS mentions in the\nannouncement</a>,\n“over 50 new SQL functions, 30 new features, and more than 90 query performance\nimprovements” are now available due the upgrade to a new version of Trino. These\ninclude <a target=\"_blank\" href=\"https://trino.io/blog/2021/05/19/row_pattern_matching\">Row pattern recognition with MATCH_RECOGNIZE</a>, <a target=\"_blank\" href=\"https://trino.io/blog/2021/03/10/introducing-new-window-features\">new window features</a>, support for <code>UPDATE</code> or\n<code>TRUNCATE</code> statements, and many others.</p>\n<p>Performance improvements in our core engine and all the Trino connectors show up\nin every release note. The <a target=\"_blank\" href=\"https://aws.amazon.com/blogs/big-data/upgrade-to-athena-engine-version-3-to-increase-query-performance-and-access-more-analytics-features/\">improvements observed by the Athena team in their\nbenchmarks</a>\nshow the resulting gains nicely. This is great evidence that our approach of\nconstantly working on small improvements wherever we find potential works well.\nThis approach is necessary since Trino is already at a very high performance\nlevel, and like an elite athlete, where every small improvement matters.</p>\n<p>It is also important to note that these improvements are only in the  Trino\nversion of the engine, since the <a target=\"_blank\" href=\"https://trino.io/blog/2022/08/02/leaving-facebook-meta-best-for-trino\">Presto project does not include these\nfeatures</a>.</p>\n<h2 id=\"client-tools-and-collaboration\">\n    Client tools and collaboration <a target=\"_blank\" href=\"https://trino.io/blog/2022/12/01/athena.html#client-tools-and-collaboration\">#</a>\n</h2>\n<p>Athena users also benefit from improvements for supporting client tools such as\nPython clients, dbt, Metabase and others. Working with other communities is of\ncritical importance to the Trino project. The <a target=\"_blank\" href=\"https://trino.io/episodes/40\">innovations in our Iceberg\nconnector</a> that are all now also available to\nAthena users are a great example how we can lead the way together. Working with\ncontributors from Amazon and other companies and projects has yielded some\namazing improvements. At the <a target=\"_blank\" href=\"https://trino.io/episodes/42\">Trino summit and contributor\ncongregation</a>, we to reconnected in person and\nestablished even closer collaboration.</p>\n<h2 id=\"looking-forward\">\n    Looking forward <a target=\"_blank\" href=\"https://trino.io/blog/2022/12/01/athena.html#looking-forward\">#</a>\n</h2>\n<p>So, what is next for Trino and Athena users? First up, you should upgrade to the\nnew Trino engine in Athena, and avoid the legacy Presto engine.</p>\n<p>Second, check out some of the great presentations from <a target=\"_blank\" href=\"https://trino.io/blog/2022/11/21/trino-summit-2022-recap\">Trino Summit 2022</a> and <a target=\"_blank\" href=\"https://trino.io/episodes/42\">hear about some of our\nimpressions</a>.</p>\n<p>And last but not least, stay tuned for more goodness. Trino already shipped\nfurther releases that included support for <code>MERGE</code>, table functions, and more\nperformance improvements. The Athena team is working hard on updating Trino for\nyour benefit regularly.</p>\n<p>Celebrating our <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap\">first decade of the Trino project this last summer</a> has shown a great trajectory for\nthe project and the community, and it looks like the next decade is going to be\neven better!</p>\n<p>Sending a warm welcome from the Trino community to the Amazon Athena team and\nusers. Now you know that you were Trino users all along.</p>\n<p><em>Martin and Manfred</em></p>\n  </div>\n</article>\n</div>"
---

Our community just keeps growing! Today, it is time to reach out and welcome
another large group of Trino users. The release of the new engine version for
Amazon Athena upgrades Athena to a recent
version of Trino from a rather old version. This update brings a ton of
improvements from the Trino project to the users of the popular cloud-based
query service.
Shared history
Amazon Athena and Trino share a long history. From the beginning of Athena, the
query engine under the hood was Trino, then still called Presto. Athena created
a low-maintenance, powerful access mode to your data in S3 and beyond. It
combined the performance and features of Trino, with the convenience of a cloud
service, which enabled new users and use cases. You could take advantage of
Trino without needing a team of experts to deploy and operate a Trino cluster
for your organization. In fact, we wrote about this in the first edition of
Trino: The Definitive Guide. There is also a section in the new second
edition that you can get for
free from Starburst.
Time flies
But since the initial release of Athena, time has not stood still. In fact, the
Trino project has accelerated in innovation, features, and releases
tremendously. Until now Athena
users missed out on these improvements. However with the update Amazon Athena
users now get access to many of these great features. As AWS mentions in the
announcement,
“over 50 new SQL functions, 30 new features, and more than 90 query performance
improvements” are now available due the upgrade to a new version of Trino. These
include Row pattern recognition with MATCH_RECOGNIZE, new window features, support for UPDATE or
TRUNCATE statements, and many others.
Performance improvements in our core engine and all the Trino connectors show up
in every release note. The improvements observed by the Athena team in their
benchmarks
show the resulting gains nicely. This is great evidence that our approach of
constantly working on small improvements wherever we find potential works well.
This approach is necessary since Trino is already at a very high performance
level, and like an elite athlete, where every small improvement matters.
It is also important to note that these improvements are only in the  Trino
version of the engine, since the Presto project does not include these
features.
Client tools and collaboration
Athena users also benefit from improvements for supporting client tools such as
Python clients, dbt, Metabase and others. Working with other communities is of
critical importance to the Trino project. The innovations in our Iceberg
connector that are all now also available to
Athena users are a great example how we can lead the way together. Working with
contributors from Amazon and other companies and projects has yielded some
amazing improvements. At the Trino summit and contributor
congregation, we to reconnected in person and
established even closer collaboration.
Looking forward
So, what is next for Trino and Athena users? First up, you should upgrade to the
new Trino engine in Athena, and avoid the legacy Presto engine.
Second, check out some of the great presentations from Trino Summit 2022 and hear about some of our
impressions.
And last but not least, stay tuned for more goodness. Trino already shipped
further releases that included support for MERGE, table functions, and more
performance improvements. The Athena team is working hard on updating Trino for
your benefit regularly.
Celebrating our first decade of the Trino project this last summer has shown a great trajectory for
the project and the community, and it looks like the next decade is going to be
even better!
Sending a warm welcome from the Trino community to the Amazon Athena team and
users. Now you know that you were Trino users all along.
Martin and Manfred
