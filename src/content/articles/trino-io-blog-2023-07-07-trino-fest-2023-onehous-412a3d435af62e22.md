---
title: "Skip rocks and files: Turbocharge Trino queries with Hudi’s multi-modal indexing subsystem"
link: "https://trino.io/blog/2023/07/07/trino-fest-2023-onehouse-recap.html"
guid: "https://trino.io/blog/2023/07/07/trino-fest-2023-onehouse-recap.html"
pubDate: "2023-07-07T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Optimizing data access and query performance is crucial to building low-latency\napplications and running analytics. Even with the modern data lakehouse designed\nto be as efficient and performant as possible, there are a number of bottlenecks\nthat can slow things down and plenty of challenges to overcome. Nadine and Sagar\nexplored this at Trino Fest, introducing us to multi-modal indexing and the\nmetadata table in Hudi, how they work, and how leveraging them with Trino can\nunlock queries faster than ever before.\n\n\n\n\n  Check out the slides!\n\nRecap\nWhen you’re building large-scale data-based applications, bottlenecks are\ninevitable. Finding ways to address these bottlenecks and optimizing your\nplatform to avoid them is going to be a huge cost, so it pays off to know your\nrequirements. In the same vein, if you know the types of services and features\nyou need to effectively scale, you can build with them in mind from the ground\nup. Hudi has a couple key features you might be interested in that aren’t\npresent in all lakehouses:\nWrite indexing, speeding up and optimizing inserts and upserts\nAutomated table services, which handle clustering, cleaning, compacting,\nand metadata indexing without any need for manual orchestration or overhead\nNadine also goes on a deep dive into exactly how the Hudi table format works,\nbut emphasizes that these extra features elevate it to being an entire platform,\nnot just a table format.\nFrom there, Nadine passes things off to Sagar, who does an explanation of the\nmulti-modal indexing sub-system in Hudi, which features a scalable metadata\ntable, different types of indexes, and an async indexer. All of these features\nminimize tradeoffs while maximizing performance, helping you read and write data\nfaster than ever. And with Trino’s Hudi connector, the Trino coordinator is able\nto read the feature-rich Hudi metadata to more effectively delegate workers,\nleveraging that speed as the best-in-class query engine for running analytics on\nyour data stored in Hudi.\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Nadine Farah, Sagar Sumit, Cole Bowden"
contentHtml: "<p>Optimizing data access and query performance is crucial to building low-latency\napplications and running analytics. Even with the modern data lakehouse designed\nto be as efficient and performant as possible, there are a number of bottlenecks\nthat can slow things down and plenty of challenges to overcome. Nadine and Sagar\nexplored this at Trino Fest, introducing us to multi-modal indexing and the\nmetadata table in Hudi, how they work, and how leveraging them with Trino can\nunlock queries faster than ever before.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-fest-2023/TrinoFest2023Onehouse.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>When you’re building large-scale data-based applications, bottlenecks are\ninevitable. Finding ways to address these bottlenecks and optimizing your\nplatform to avoid them is going to be a huge cost, so it pays off to know your\nrequirements. In the same vein, if you know the types of services and features\nyou need to effectively scale, you can build with them in mind from the ground\nup. Hudi has a couple key features you might be interested in that aren’t\npresent in all lakehouses:</p>\n\n<ul>\n  <li>Write indexing, speeding up and optimizing inserts and upserts</li>\n  <li>Automated table services, which handle clustering, cleaning, compacting,\nand metadata indexing without any need for manual orchestration or overhead</li>\n</ul>\n\n<p>Nadine also goes on a deep dive into exactly how the Hudi table format works,\nbut emphasizes that these extra features elevate it to being an entire platform,\nnot just a table format.</p>\n\n<p>From there, Nadine passes things off to Sagar, who does an explanation of the\nmulti-modal indexing sub-system in Hudi, which features a scalable metadata\ntable, different types of indexes, and an async indexer. All of these features\nminimize tradeoffs while maximizing performance, helping you read and write data\nfaster than ever. And with Trino’s Hudi connector, the Trino coordinator is able\nto read the feature-rich Hudi metadata to more effectively delegate workers,\nleveraging that speed as the best-in-class query engine for running analytics on\nyour data stored in Hudi.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

Optimizing data access and query performance is crucial to building low-latency
applications and running analytics. Even with the modern data lakehouse designed
to be as efficient and performant as possible, there are a number of bottlenecks
that can slow things down and plenty of challenges to overcome. Nadine and Sagar
explored this at Trino Fest, introducing us to multi-modal indexing and the
metadata table in Hudi, how they work, and how leveraging them with Trino can
unlock queries faster than ever before.




  Check out the slides!

Recap
When you’re building large-scale data-based applications, bottlenecks are
inevitable. Finding ways to address these bottlenecks and optimizing your
platform to avoid them is going to be a huge cost, so it pays off to know your
requirements. In the same vein, if you know the types of services and features
you need to effectively scale, you can build with them in mind from the ground
up. Hudi has a couple key features you might be interested in that aren’t
present in all lakehouses:
Write indexing, speeding up and optimizing inserts and upserts
Automated table services, which handle clustering, cleaning, compacting,
and metadata indexing without any need for manual orchestration or overhead
Nadine also goes on a deep dive into exactly how the Hudi table format works,
but emphasizes that these extra features elevate it to being an entire platform,
not just a table format.
From there, Nadine passes things off to Sagar, who does an explanation of the
multi-modal indexing sub-system in Hudi, which features a scalable metadata
table, different types of indexes, and an async indexer. All of these features
minimize tradeoffs while maximizing performance, helping you read and write data
faster than ever. And with Trino’s Hudi connector, the Trino coordinator is able
to read the feature-rich Hudi metadata to more effectively delegate workers,
leveraging that speed as the best-in-class query engine for running analytics on
your data stored in Hudi.
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
