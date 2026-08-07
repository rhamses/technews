---
title: "A cache refresh for Trino"
link: "https://trino.io/blog/2024/03/08/cache-refresh.html"
guid: "https://trino.io/blog/2024/03/08/cache-refresh.html"
pubDate: "2024-03-08T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Thinking about our recent work on caching in Trino reminds me of the famous\nsaying, “There are only two hard things in computer science: cache invalidation\nand naming things.” Well,\nin the Trino community we know all about caching and naming. With the recent\nTrino 439 release, caching\nfrom object storage file systems got a refresh. Catalogs using the Delta Lake,\nHive, Iceberg, and soon Hudi connectors now get to access performance benefits\nfrom the new Alluxio-powered file system caching.\nIn the past\nSo how did we get here? A long, long time ago, Qubole open-sourced a light\nlight-weight data caching framework called\nRubiX. The library was integrated into the\nTrino Hive connector, and it enabled Hive connector storage\ncaching. But over time, any\nopen source project without active maintenance becomes stale. And like a stale\ncache, a stale open source project can cause issues, or becomes outdated and\nunsuitable for modern use. Though RubiX had once served Trino well, it was time\nto remove the dust, and RubiX had to go.\nMaking progress\nCatching back up to 2024, Trino now includes powerful connectors for the modern\nlakehouse formats Delta Lake, Hudi, and Iceberg:\nHive is still around, just like HDFS, but we consider them both close to legacy\nstatus. Yet all four connectors could benefit from caching. Good news came at\nTrino Summit 2022 when Hope Wang and Beinan Wang from\nAlluxio presented about their\nintegration with Trino and the Hive connector - Trino optimization with\ndistributed caching on data lake. They mentioned plans to open\nsource their implementation and an initial pull request (PR) was created.\n\n    \n\n  \nCollaboration\nThe initial presentation and PR planted a seed in the community. The Trino\nproject had been moving fast in terms of deprecating the old dependencies from\nthe Hadoop and Hive ecosystem, so the initial Alluxio PR was no longer up to\ndate and compatible with latest Trino version. Discussions with David\nPhillips laid out the path to adjust to the new\nfile system support and get ready for reviews towards a merge.\nIn the end it was Florent Delannoy who started\nanother PR for file system caching support, specifically for the Delta Lake\nconnector. His teammate Jonas\nIrgens Kylling, also a presenter from Trino Fest\n2023, took over the work on the\nPR. The collaboration on it was an epic effort. After many months of time,\nover 300 comments directly on GitHub and numerous hours of coding, reviewing,\ntesting, and discussion on Slack and elsewhere the work finally resulted in a\nsuccessful merge, and therefore inclusion in the next release.\nSpecial props for their help for Florent and Jonas must go out to David\nPhillips, Raunaq\nMorarka, Piotr\nFindeisen, Mateusz\nGajewski, Beinan Wang,\nAmogh Margoor, Manish\nMalhorta, and Marton\nBod.\nFinishing\nIn parallel to the work on the initial PR for Delta Lake, yours truly ended up\nworking on the documentation, and pulled together an issue and conversations to\nstreamline the roll out.\nMateusz Gajewski had also put together a PR to\nremove the old RubiX integration already. With the merge of the initial PR we\nwere off to the races. We merged the removal of RubiX and the addition of the\ndocs. Mateusz also added support for OpenTelemetry.\nManish Malhorta and Amogh\nMargoor sent a PR for Iceberg support. They\nwere also about to add Hive support, when Raunaq\nMorarka beat them and submitted that PR.\nAfter some final clean up, Cole Bowden and Martin\nTraverso got the release notes together and shipped\nTrino 439! Now you can use\nit, too.\nUsing file system caching\nThere are only a few relatively simple steps to add file system caching to your\ncatalogs that use Delta Lake, Hive, or Iceberg connectors:\nProvision fast local file system storage on all your Trino cluster nodes. How\nyou do that depends on your cluster provisioning.\nEnable file system caching and configure the cache location, for example at\n/tmp/trino-cache on the nodes, in your catalog properties files.\n\nfs.cache.enabled=true\nfs.cache.directories=/tmp/trino-cache\n\n\nAfter a cluster restart, file system caching is active for the configured\ncatalogs, and you can tweak it with further, optional configuration\nproperties.\nWhat’s next\nWhat a success! It took many members from the global Trino village to get this\nfeature added. Now our users across the globe can enjoy even more benefits of\nusing Trino, and also participate in our next steps:\nFurther improvements to the current implementation, maybe adding\nworker-to-worker connections for exchanging cached files.\nPreparation to add file system caching with the Hudi connector is in progress\nwith Sagar Sumit and Y Ethan\nGuo and implementation is following next.\nAdjust to any learnings from production usage.\nOur thanks, and those from all current and future users, go out to everyone\ninvolved in this effort. What are we going to do next?\nManfred\nPS: If you want to share your use of Trino or connect with other Trino users,\njoin us for the free Trino Fest 2024 as speaker or attendee live in Boston,\nor virtually from your home."
author: "Manfred Moser"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/trino-cache-refresh.png\">\n    </p>\n    <p>Thinking about our recent work on caching in Trino reminds me of the famous\nsaying, <a target=\"_blank\" href=\"https://www.karlton.org/2017/12/naming-things-hard/\">“There are only two hard things in computer science: cache invalidation\nand naming things</a>.” Well,\nin the Trino community we know all about caching and naming. With the recent\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-439.html\">Trino 439 release</a>, caching\nfrom object storage file systems got a refresh. Catalogs using the Delta Lake,\nHive, Iceberg, and soon Hudi connectors now get to access performance benefits\nfrom the new Alluxio-powered file system caching.</p>\n<!--more-->\n<h2 id=\"in-the-past\">\n    In the past <a target=\"_blank\" href=\"https://trino.io/blog/2024/03/08/cache-refresh.html#in-the-past\">#</a>\n</h2>\n<p>So how did we get here? A long, long time ago, Qubole open-sourced a <a target=\"_blank\" href=\"https://github.com/qubole/rubix\">light\nlight-weight data caching framework called\nRubiX</a>. The library was integrated into the\nTrino Hive connector, and it enabled <a target=\"_blank\" href=\"https://trino.io/docs/438/connector/hive-caching.html\">Hive connector storage\ncaching</a>. But over time, any\nopen source project without active maintenance becomes stale. And like a stale\ncache, a stale open source project can cause issues, or becomes outdated and\nunsuitable for modern use. Though RubiX had once served Trino well, it was time\nto remove the dust, and RubiX had to go.</p>\n<h2 id=\"making-progress\">\n    Making progress <a target=\"_blank\" href=\"https://trino.io/blog/2024/03/08/cache-refresh.html#making-progress\">#</a>\n</h2>\n<p>Catching back up to 2024, Trino now includes powerful connectors for the modern\nlakehouse formats Delta Lake, Hudi, and Iceberg:</p>\n<div>\n    <p><a href=\"https://trino.io/docs/current/connector/delta-lake.html\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/delta-lake.png\" title=\"Delta Lake connector\">\n      </a>\n    </p>\n    <p><a href=\"https://trino.io/docs/current/connector/hudi.html\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/apache-hudi.png\" title=\"Hudi connector\">\n      </a>\n    </p>\n    <p><a href=\"https://trino.io/docs/current/connector/iceberg.html\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/apache-iceberg.png\" title=\"Iceberg connector\">\n      </a>\n    </p>\n  </div>\n<p>Hive is still around, just like HDFS, but we consider them both close to legacy\nstatus. Yet all four connectors could benefit from caching. Good news came at\nTrino Summit 2022 when Hope Wang and Beinan Wang from\n<a target=\"_blank\" href=\"https://trino.io/ecosystem/add-on#alluxio\">Alluxio</a> presented about their\nintegration with Trino and the Hive connector - <a target=\"_blank\" href=\"https://trino.io/blog/2023/07/21/trino-fest-2023-alluxio-recap\">Trino optimization with\ndistributed caching on data lake</a>. They mentioned plans to open\nsource their implementation and an initial pull request (PR) was created.</p>\n<div>\n    <p><img src=\"https://trino.io/assets/images/logos/alluxio.png\" title=\"Alluxio\">\n    </p>\n  </div>\n<h2 id=\"collaboration\">\n    Collaboration <a target=\"_blank\" href=\"https://trino.io/blog/2024/03/08/cache-refresh.html#collaboration\">#</a>\n</h2>\n<p>The initial presentation and PR planted a seed in the community. The Trino\nproject had been moving fast in terms of deprecating the old dependencies from\nthe Hadoop and Hive ecosystem, so the initial Alluxio PR was no longer up to\ndate and compatible with latest Trino version. Discussions with <a target=\"_blank\" href=\"https://github.com/electrum\">David\nPhillips</a> laid out the path to adjust to the new\nfile system support and get ready for reviews towards a merge.</p>\n<p>In the end it was <a target=\"_blank\" href=\"https://github.com/pluies\">Florent Delannoy</a> who started\nanother <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/18719\">PR for file system caching support, specifically for the Delta Lake\nconnector</a>. His teammate <a target=\"_blank\" href=\"https://github.com/jkylling\">Jonas\nIrgens Kylling</a>, also a <a target=\"_blank\" href=\"https://trino.io/blog/2023/07/14/trino-fest-2023-dune\">presenter from Trino Fest\n2023</a>, took over the work on the\nPR. The collaboration on it was an <strong>epic effort</strong>. After many months of time,\nover 300 comments directly on GitHub and numerous hours of coding, reviewing,\ntesting, and discussion on Slack and elsewhere the work finally resulted in a\nsuccessful merge, and therefore inclusion in the next release.</p>\n<p>Special props for their help for Florent and Jonas must go out to <a target=\"_blank\" href=\"https://github.com/electrum\">David\nPhillips</a>, <a target=\"_blank\" href=\"https://github.com/raunaqmorarka\">Raunaq\nMorarka</a>, <a target=\"_blank\" href=\"https://github.com/findepi\">Piotr\nFindeisen</a>, <a target=\"_blank\" href=\"https://github.com/wendigo\">Mateusz\nGajewski</a>, <a target=\"_blank\" href=\"https://github.com/beinan\">Beinan Wang</a>,\n<a target=\"_blank\" href=\"https://github.com/amoghmargoor\">Amogh Margoor</a>, <a target=\"_blank\" href=\"https://github.com/osscm\">Manish\nMalhorta</a>, and <a target=\"_blank\" href=\"https://github.com/marton-bod\">Marton\nBod</a>.</p>\n<h2 id=\"finishing\">\n    Finishing <a target=\"_blank\" href=\"https://trino.io/blog/2024/03/08/cache-refresh.html#finishing\">#</a>\n</h2>\n<p>In parallel to the work on the initial PR for Delta Lake, yours truly ended up\nworking on the documentation, and pulled together an <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/20550\">issue and conversations to\nstreamline the roll out</a>.</p>\n<p><a target=\"_blank\" href=\"https://github.com/wendigo\">Mateusz Gajewski</a> had also put together a PR to\nremove the old RubiX integration already. With the merge of the initial PR we\nwere off to the races. We merged the removal of RubiX and the addition of the\ndocs. Mateusz also added support for OpenTelemetry.</p>\n<p><a target=\"_blank\" href=\"https://github.com/osscm\">Manish Malhorta</a> and <a target=\"_blank\" href=\"https://github.com/amoghmargoor\">Amogh\nMargoor</a> sent a PR for Iceberg support. They\nwere also about to add Hive support, when <a target=\"_blank\" href=\"https://github.com/raunaqmorarka\">Raunaq\nMorarka</a> beat them and submitted that PR.</p>\n<p>After some final clean up, <a target=\"_blank\" href=\"https://github.com/colebow\">Cole Bowden</a> and <a target=\"_blank\" href=\"https://github.com/martint\">Martin\nTraverso</a> got the release notes together and shipped\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-438.html\">Trino 439</a>! Now you can use\nit, too.</p>\n<h2 id=\"using-file-system-caching\">\n    Using file system caching <a target=\"_blank\" href=\"https://trino.io/blog/2024/03/08/cache-refresh.html#using-file-system-caching\">#</a>\n</h2>\n<p>There are only a few relatively simple steps to add file system caching to your\ncatalogs that use Delta Lake, Hive, or Iceberg connectors:</p>\n<ul>\n  <li>Provision fast local file system storage on all your Trino cluster nodes. How\nyou do that depends on your cluster provisioning.</li>\n  <li>Enable file system caching and configure the cache location, for example at\n<code>/tmp/trino-cache</code> on the nodes, in your catalog properties files.</li>\n</ul>\n<div><pre><code>fs.cache.enabled=true\nfs.cache.directories=/tmp/trino-cache\n</code></pre></div>\n<p>After a cluster restart, file system caching is active for the configured\ncatalogs, and you can tweak it with <a target=\"_blank\" href=\"https://trino.io/docs/current/object-storage/file-system-cache.html\">further, optional configuration\nproperties</a>.</p>\n<h2 id=\"whats-next\">\n    What’s next <a target=\"_blank\" href=\"https://trino.io/blog/2024/03/08/cache-refresh.html#whats-next\">#</a>\n</h2>\n<p>What a success! It took many members from the global Trino village to get this\nfeature added. Now our users across the globe can enjoy even more benefits of\nusing Trino, and also participate in our next steps:</p>\n<ul>\n  <li>Further improvements to the current implementation, maybe adding\nworker-to-worker connections for exchanging cached files.</li>\n  <li>Preparation to add file system caching with the Hudi connector is in progress\nwith <a target=\"_blank\" href=\"https://github.com/codope\">Sagar Sumit</a> and <a target=\"_blank\" href=\"https://github.com/yihua\">Y Ethan\nGuo</a> and implementation is following next.</li>\n  <li>Adjust to any learnings from production usage.</li>\n</ul>\n<p>Our thanks, and those from all current and future users, go out to everyone\ninvolved in this effort. What are we going to do next?</p>\n<p><em>Manfred</em></p>\n<p>PS: If you want to share your use of Trino or connect with other Trino users,\n<a target=\"_blank\" href=\"https://trino.io/blog/2024/02/20/announcing-trino-fest-2024\">join us for the free Trino Fest 2024</a> as speaker or attendee live in Boston,\nor virtually from your home.</p>\n  </div>\n</article>\n</div>"
---

Thinking about our recent work on caching in Trino reminds me of the famous
saying, “There are only two hard things in computer science: cache invalidation
and naming things.” Well,
in the Trino community we know all about caching and naming. With the recent
Trino 439 release, caching
from object storage file systems got a refresh. Catalogs using the Delta Lake,
Hive, Iceberg, and soon Hudi connectors now get to access performance benefits
from the new Alluxio-powered file system caching.
In the past
So how did we get here? A long, long time ago, Qubole open-sourced a light
light-weight data caching framework called
RubiX. The library was integrated into the
Trino Hive connector, and it enabled Hive connector storage
caching. But over time, any
open source project without active maintenance becomes stale. And like a stale
cache, a stale open source project can cause issues, or becomes outdated and
unsuitable for modern use. Though RubiX had once served Trino well, it was time
to remove the dust, and RubiX had to go.
Making progress
Catching back up to 2024, Trino now includes powerful connectors for the modern
lakehouse formats Delta Lake, Hudi, and Iceberg:
Hive is still around, just like HDFS, but we consider them both close to legacy
status. Yet all four connectors could benefit from caching. Good news came at
Trino Summit 2022 when Hope Wang and Beinan Wang from
Alluxio presented about their
integration with Trino and the Hive connector - Trino optimization with
distributed caching on data lake. They mentioned plans to open
source their implementation and an initial pull request (PR) was created.

    

  
Collaboration
The initial presentation and PR planted a seed in the community. The Trino
project had been moving fast in terms of deprecating the old dependencies from
the Hadoop and Hive ecosystem, so the initial Alluxio PR was no longer up to
date and compatible with latest Trino version. Discussions with David
Phillips laid out the path to adjust to the new
file system support and get ready for reviews towards a merge.
In the end it was Florent Delannoy who started
another PR for file system caching support, specifically for the Delta Lake
connector. His teammate Jonas
Irgens Kylling, also a presenter from Trino Fest
2023, took over the work on the
PR. The collaboration on it was an epic effort. After many months of time,
over 300 comments directly on GitHub and numerous hours of coding, reviewing,
testing, and discussion on Slack and elsewhere the work finally resulted in a
successful merge, and therefore inclusion in the next release.
Special props for their help for Florent and Jonas must go out to David
Phillips, Raunaq
Morarka, Piotr
Findeisen, Mateusz
Gajewski, Beinan Wang,
Amogh Margoor, Manish
Malhorta, and Marton
Bod.
Finishing
In parallel to the work on the initial PR for Delta Lake, yours truly ended up
working on the documentation, and pulled together an issue and conversations to
streamline the roll out.
Mateusz Gajewski had also put together a PR to
remove the old RubiX integration already. With the merge of the initial PR we
were off to the races. We merged the removal of RubiX and the addition of the
docs. Mateusz also added support for OpenTelemetry.
Manish Malhorta and Amogh
Margoor sent a PR for Iceberg support. They
were also about to add Hive support, when Raunaq
Morarka beat them and submitted that PR.
After some final clean up, Cole Bowden and Martin
Traverso got the release notes together and shipped
Trino 439! Now you can use
it, too.
Using file system caching
There are only a few relatively simple steps to add file system caching to your
catalogs that use Delta Lake, Hive, or Iceberg connectors:
Provision fast local file system storage on all your Trino cluster nodes. How
you do that depends on your cluster provisioning.
Enable file system caching and configure the cache location, for example at
/tmp/trino-cache on the nodes, in your catalog properties files.

fs.cache.enabled=true
fs.cache.directories=/tmp/trino-cache


After a cluster restart, file system caching is active for the configured
catalogs, and you can tweak it with further, optional configuration
properties.
What’s next
What a success! It took many members from the global Trino village to get this
feature added. Now our users across the globe can enjoy even more benefits of
using Trino, and also participate in our next steps:
Further improvements to the current implementation, maybe adding
worker-to-worker connections for exchanging cached files.
Preparation to add file system caching with the Hudi connector is in progress
with Sagar Sumit and Y Ethan
Guo and implementation is following next.
Adjust to any learnings from production usage.
Our thanks, and those from all current and future users, go out to everyone
involved in this effort. What are we going to do next?
Manfred
PS: If you want to share your use of Trino or connect with other Trino users,
join us for the free Trino Fest 2024 as speaker or attendee live in Boston,
or virtually from your home.
