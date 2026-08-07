---
title: "AWS Athena (Trino) in the cybersecurity space"
link: "https://trino.io/blog/2023/07/05/trino-fest-2023-arcticwolf.html"
guid: "https://trino.io/blog/2023/07/05/trino-fest-2023-arcticwolf.html"
pubDate: "2023-07-05T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Arctic Wolf Networks, a cybersecurity company that provides security monitoring\nto cyber threats, is one of the companies that have recently switched to using\nAWS Athena as a new and efficient service to query their data using Trino. AWS\nAthena is a serverless, interactive analytics service built on open-source\nframeworks that runs on Trino, supporting open table and file formats and\nproviding a simplified, flexible way to analyze petabytes of data where it\nlives. Senior software developer Anas Shakra from Arctic Wolf Networks gave a\ntalk at Trino Fest 2023\ndetailing their switch to AWS Athena and how “queries that took hours with old\nsolution now take around a minute today”. Tune in to the talk or you can read\nthe recap!\n\n\n\nRecap\nAt Arctic Wolf, data access use-cases fall under three categories: investigations,\ncompliance, and customer self-serve platform. The process of preparing the data\nfollows an established pattern of starting with datastore, performing an\noperation to filter or transform the data, and then outputting the data in some\nformat like a CSV or JSON, depending on the client needs. Arctic Wolf’s custom\nlegacy service was unable to match the growing service demand and had four main\nproblems:\nOptimized for breadth over depth\nStruggles to handle growing service demand\nProprietary query language\nComplicated design\nThis compelled Anas’ team to find a different and improved service: Trino as\nprovided by AWS Athena.\nThey had four main objectives for the new service: defined access patterns,\nperformant at scale, user-friendly, and deterministic pricing. AWS Athena\nsatisfied these objectives, while also providing numerous benefits such as using\na powerful query engine, being purposefully built for large datasets, using SQL\nsyntax, and having a clear pricing structure. However, with these benefits come\nsome drawbacks for Athena. These includes being subject to quota limits, having\nsuboptimal file sizes for their system, and being unable to control access\nsufficiently. Anas addresses this by using log queries that resolves these three\nmain impediments. As next step, Anas is considering switching to a self-managed\nTrino deployment for more control with the same performance gains.\nWant to learn more about log queries that they use? Check out Anas’ explanation\nin the video!\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Anas Shakra, Ryan Duan"
contentHtml: "<p>Arctic Wolf Networks, a cybersecurity company that provides security monitoring\nto cyber threats, is one of the companies that have recently switched to using\nAWS Athena as a new and efficient service to query their data using Trino. AWS\nAthena is a serverless, interactive analytics service built on open-source\nframeworks that runs on Trino, supporting open table and file formats and\nproviding a simplified, flexible way to analyze petabytes of data where it\nlives. Senior software developer Anas Shakra from Arctic Wolf Networks gave a\ntalk at <a href=\"/blog/2023/06/20/trino-fest-2023-recap.html\">Trino Fest 2023</a>\ndetailing their switch to AWS Athena and how “queries that took hours with old\nsolution now take around a minute today”. Tune in to the talk or you can read\nthe recap!</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>At Arctic Wolf, data access use-cases fall under three categories: investigations,\ncompliance, and customer self-serve platform. The process of preparing the data\nfollows an established pattern of starting with datastore, performing an\noperation to filter or transform the data, and then outputting the data in some\nformat like a CSV or JSON, depending on the client needs. Arctic Wolf’s custom\nlegacy service was unable to match the growing service demand and had four main\nproblems:</p>\n\n<ul>\n  <li>Optimized for breadth over depth</li>\n  <li>Struggles to handle growing service demand</li>\n  <li>Proprietary query language</li>\n  <li>Complicated design</li>\n</ul>\n\n<p>This compelled Anas’ team to find a different and improved service: Trino as\nprovided by AWS Athena.</p>\n\n<p>They had four main objectives for the new service: defined access patterns,\nperformant at scale, user-friendly, and deterministic pricing. AWS Athena\nsatisfied these objectives, while also providing numerous benefits such as using\na powerful query engine, being purposefully built for large datasets, using SQL\nsyntax, and having a clear pricing structure. However, with these benefits come\nsome drawbacks for Athena. These includes being subject to quota limits, having\nsuboptimal file sizes for their system, and being unable to control access\nsufficiently. Anas addresses this by using log queries that resolves these three\nmain impediments. As next step, Anas is considering switching to a self-managed\nTrino deployment for more control with the same performance gains.</p>\n\n<p>Want to learn more about log queries that they use? Check out Anas’ explanation\nin the video!</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

Arctic Wolf Networks, a cybersecurity company that provides security monitoring
to cyber threats, is one of the companies that have recently switched to using
AWS Athena as a new and efficient service to query their data using Trino. AWS
Athena is a serverless, interactive analytics service built on open-source
frameworks that runs on Trino, supporting open table and file formats and
providing a simplified, flexible way to analyze petabytes of data where it
lives. Senior software developer Anas Shakra from Arctic Wolf Networks gave a
talk at Trino Fest 2023
detailing their switch to AWS Athena and how “queries that took hours with old
solution now take around a minute today”. Tune in to the talk or you can read
the recap!



Recap
At Arctic Wolf, data access use-cases fall under three categories: investigations,
compliance, and customer self-serve platform. The process of preparing the data
follows an established pattern of starting with datastore, performing an
operation to filter or transform the data, and then outputting the data in some
format like a CSV or JSON, depending on the client needs. Arctic Wolf’s custom
legacy service was unable to match the growing service demand and had four main
problems:
Optimized for breadth over depth
Struggles to handle growing service demand
Proprietary query language
Complicated design
This compelled Anas’ team to find a different and improved service: Trino as
provided by AWS Athena.
They had four main objectives for the new service: defined access patterns,
performant at scale, user-friendly, and deterministic pricing. AWS Athena
satisfied these objectives, while also providing numerous benefits such as using
a powerful query engine, being purposefully built for large datasets, using SQL
syntax, and having a clear pricing structure. However, with these benefits come
some drawbacks for Athena. These includes being subject to quota limits, having
suboptimal file sizes for their system, and being unable to control access
sufficiently. Anas addresses this by using log queries that resolves these three
main impediments. As next step, Anas is considering switching to a self-managed
Trino deployment for more control with the same performance gains.
Want to learn more about log queries that they use? Check out Anas’ explanation
in the video!
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
