---
title: "Trino optimization with distributed caching on data lakes"
link: "https://trino.io/blog/2023/07/21/trino-fest-2023-alluxio-recap.html"
guid: "https://trino.io/blog/2023/07/21/trino-fest-2023-alluxio-recap.html"
pubDate: "2023-07-21T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "By 2025, there will be 100 zetabytes stored in the cloud. That’s\n100,000,000,000,000,000,000,000 bytes - a huge, eye-popping number. But only\nabout 10% of that data is actually used on a regular basis. At Uber, for\nexample, only 1% of their disk space is used for 50% of the data they access on\nany given day. With so much data but such a small percentage being used, it\nraises the question: how can we identify frequently-used data and make it more\naccessible, efficient, and lower-cost to access?\nOnce we have identified that “hot data,” the answer is data caching. By caching\nthat data in storage, you can reap a ton of benefits: performance gains, lower\ncosts, less network congestion, and reduced throttling on the storage layer.\nData caching sounds great, but why are we talking about it at a Trino event?\nBecause data caching with Alluxio is coming to Trino!\n\n\n\n\n  Check out the slides!\n\nRecap\nSo what are the key features of data caching? The first and foremost is that the\nfrequently-accessed data gets stored on local SSDs. In the case of Trino, this\nmeans that the Trino worker nodes will store data to reduce latency and decrease\nthe number of loads from object storage. Even if the worker restarts, it also still has\nthat data stored. Caching will work on all the data lake connectors, so whether\nyou’re using Iceberg, Hive, Hudi, or Delta Lake, it’ll be speeding your queries\nup. The best part is that once it’s in Trino, all you need to do is enable it,\nset three configuration properties, and let the performance improvement speak\nfor itself. There’s no other change to how queries run or execute, so there’s no\nheadache or migration needed.\nHope then gives deeper technical detail on exactly how data caching works. She\nhighlights a few existing examples of how large-scale companies, Uber and\nShopee, have utilized data caching to reap massive performance gains. Then the\ntalk is passed off to Beinan, who gives further technical detail,\nexploring cache invalidation, how to maximize cache hit rate, cluster\nelasticity, cache storage efficiency, and data consistency. He also explores\nongoing work on semantic caching, native/off-heap caching, and distributed\ncaching, all of which have interesting upsides and benefits.\nGive the full talk a listen if you’re interested, as both Hope and Beinan go\ninto a lot of great, technical detail that you won’t want to miss out on. And\ndon’t forget to keep an eye on Trino release notes to see when it’s live!\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Hope Wang, Beinan Wang, and Cole Bowden"
contentHtml: "<p>By 2025, there will be 100 zetabytes stored in the cloud. That’s\n100,000,000,000,000,000,000,000 bytes - a huge, eye-popping number. But only\nabout 10% of that data is actually used on a regular basis. At Uber, for\nexample, only 1% of their disk space is used for 50% of the data they access on\nany given day. With so much data but such a small percentage being used, it\nraises the question: how can we identify frequently-used data and make it more\naccessible, efficient, and lower-cost to access?</p>\n\n<p>Once we have identified that “hot data,” the answer is data caching. By caching\nthat data in storage, you can reap a ton of benefits: performance gains, lower\ncosts, less network congestion, and reduced throttling on the storage layer.\nData caching sounds great, but why are we talking about it at a Trino event?\nBecause <a href=\"https://github.com/trinodb/trino/pull/16375\">data caching with Alluxio is coming to Trino</a>!</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-fest-2023/TrinoFest2023Alluxio.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>So what are the key features of data caching? The first and foremost is that the\nfrequently-accessed data gets stored on local SSDs. In the case of Trino, this\nmeans that the Trino worker nodes will store data to reduce latency and decrease\nthe number of loads from object storage. Even if the worker restarts, it also still has\nthat data stored. Caching will work on all the data lake connectors, so whether\nyou’re using Iceberg, Hive, Hudi, or Delta Lake, it’ll be speeding your queries\nup. The best part is that once it’s in Trino, all you need to do is enable it,\nset three configuration properties, and let the performance improvement speak\nfor itself. There’s no other change to how queries run or execute, so there’s no\nheadache or migration needed.</p>\n\n<p>Hope then gives deeper technical detail on exactly how data caching works. She\nhighlights a few existing examples of how large-scale companies, Uber and\nShopee, have utilized data caching to reap massive performance gains. Then the\ntalk is passed off to Beinan, who gives further technical detail,\nexploring cache invalidation, how to maximize cache hit rate, cluster\nelasticity, cache storage efficiency, and data consistency. He also explores\nongoing work on semantic caching, native/off-heap caching, and distributed\ncaching, all of which have interesting upsides and benefits.</p>\n\n<p>Give the full talk a listen if you’re interested, as both Hope and Beinan go\ninto a lot of great, technical detail that you won’t want to miss out on. And\ndon’t forget to keep an eye on Trino release notes to see when it’s live!</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

By 2025, there will be 100 zetabytes stored in the cloud. That’s
100,000,000,000,000,000,000,000 bytes - a huge, eye-popping number. But only
about 10% of that data is actually used on a regular basis. At Uber, for
example, only 1% of their disk space is used for 50% of the data they access on
any given day. With so much data but such a small percentage being used, it
raises the question: how can we identify frequently-used data and make it more
accessible, efficient, and lower-cost to access?
Once we have identified that “hot data,” the answer is data caching. By caching
that data in storage, you can reap a ton of benefits: performance gains, lower
costs, less network congestion, and reduced throttling on the storage layer.
Data caching sounds great, but why are we talking about it at a Trino event?
Because data caching with Alluxio is coming to Trino!




  Check out the slides!

Recap
So what are the key features of data caching? The first and foremost is that the
frequently-accessed data gets stored on local SSDs. In the case of Trino, this
means that the Trino worker nodes will store data to reduce latency and decrease
the number of loads from object storage. Even if the worker restarts, it also still has
that data stored. Caching will work on all the data lake connectors, so whether
you’re using Iceberg, Hive, Hudi, or Delta Lake, it’ll be speeding your queries
up. The best part is that once it’s in Trino, all you need to do is enable it,
set three configuration properties, and let the performance improvement speak
for itself. There’s no other change to how queries run or execute, so there’s no
headache or migration needed.
Hope then gives deeper technical detail on exactly how data caching works. She
highlights a few existing examples of how large-scale companies, Uber and
Shopee, have utilized data caching to reap massive performance gains. Then the
talk is passed off to Beinan, who gives further technical detail,
exploring cache invalidation, how to maximize cache hit rate, cluster
elasticity, cache storage efficiency, and data consistency. He also explores
ongoing work on semantic caching, native/off-heap caching, and distributed
caching, all of which have interesting upsides and benefits.
Give the full talk a listen if you’re interested, as both Hope and Beinan go
into a lot of great, technical detail that you won’t want to miss out on. And
don’t forget to keep an eye on Trino release notes to see when it’s live!
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
