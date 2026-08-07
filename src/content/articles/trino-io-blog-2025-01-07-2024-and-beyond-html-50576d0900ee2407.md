---
title: "Trino in 2024 and beyond"
link: "https://trino.io/blog/2025/01/07/2024-and-beyond.html"
guid: "https://trino.io/blog/2025/01/07/2024-and-beyond.html"
pubDate: "2025-01-07T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Wow, what an amazing year 2024 was for Trino! Martin Traverso presented about\nthe achievements and progress of the project at the recent Trino Summit\n2024. Let me dive\ndeeper into the content of his keynote and elaborate some more about our amazing\nplans for the future.\nStatistics\nIn his first slide of the presentation Enduring with persistence to reach the\nsummit Martin presented some of the amazing statistics of the year:\nOver 30 releases packed with features and improvements - Trino releases 436-467\n5,000+ additional commits to the 40,000+ total commits since project start\n225+ unique contributors in 2024, 925+ total\n10.5k+ stars on GitHub\n13,500+ Slack members\nTrino Community Broadcast episodes 54-67\nImprovements\nSome of the major improvements in Trino are:\nAccess controls with\nOpen Policy Agent and\nApache Ranger\nImproved observability with OpenLineage, \nOpenTelemetry, OpenMetrics, and \nKafka\nSignificant client protocol improvements\nPython user-defined functions\nNew connectors such as Faker,\nSnowflake, or\nVertica\nNumerous improvements on object storage connectors and integrations\nOf course we also paid a lot of attention to bug fixes and shipped tremendous\nperformance improvements.\nSlides and video\nIf you want to find out all the details, have a look at the\nslides\nand the video recording:\n\nOther projects\nMartin also talked about the many improvements in other Trino projects such as\nTrino Gateway,\ntrino-python-client, the new\ntrino-js-client, and the new\ntrino-csharp-client.\nPlans for 2025\nFor 2025, we have some pretty big plans in addition to our continued software\nsupply chain attention, performance improvemsnts and bug fixes.\nSecrets management and dynamic catalogs\nClient protocol improvements for all client drivers\nPackaging improvements\nMore connectors such as DuckDB, LanceDB, HsqlDB, Loki, …\nContinued and even increased work on performance improvements\nResearch and prototype towards a next generation optimizer\nSQL language improvements such as PIVOT, ASOF joins, …\nOf course, what really happens in 2025 and Trino depends on you all. The project\nlives and breathes only thanks to the efforts of all our contributors and\nmaintainers and we look forward to working with you all.\nTrino survey\nBesides filing issues, sending pull requests, and discussing topics on Slack and\nGitHub, we also have some specific questions and would really appreciate your\nfeedback. Answering should take less than a minute.\n\nWith Trino as a huge collaborative effort only one thing is for certain:\n2025 will be an exciting year for Commander Bun Bun, Trino, and the Trino project."
author: "Manfred Moser"
contentHtml: "<p>Wow, what an amazing year 2024 was for Trino! Martin Traverso presented about\nthe achievements and progress of the project at the <a href=\"/blog/2024/12/18/trino-summit-2024-quick-recap.html\">recent Trino Summit\n2024</a>. Let me dive\ndeeper into the content of his keynote and elaborate some more about our amazing\nplans for the future.</p>\n\n<!--more-->\n\n<h2 id=\"statistics\">Statistics</h2>\n\n<p>In his first slide of the presentation <strong>Enduring with persistence to reach the\nsummit</strong> Martin presented some of the amazing statistics of the year:</p>\n\n<ul>\n  <li>Over 30 releases packed with features and improvements - <a href=\"/docs/current/release.html#releases-2024\">Trino releases 436-467</a></li>\n  <li>5,000+ additional commits to the 40,000+ total commits since project start</li>\n  <li>225+ unique contributors in 2024, 925+ total</li>\n  <li>10.5k+ stars on GitHub</li>\n  <li>13,500+ Slack members</li>\n  <li>Trino Community Broadcast episodes 54-67</li>\n</ul>\n\n<h2 id=\"improvements\">Improvements</h2>\n\n<p>Some of the major improvements in Trino are:</p>\n\n<ul>\n  <li>Access controls with\n<a href=\"/docs/current/security/opa-access-control.html\">Open Policy Agent</a> and\n<a href=\"/docs/current/security/ranger-access-control.html\">Apache Ranger</a></li>\n  <li>Improved observability with <a href=\"/docs/current/admin/event-listeners-openlineage.html\">OpenLineage</a>, \n<a href=\"/docs/current/admin/opentelemetry.html\">OpenTelemetry</a>, OpenMetrics, and \n<a href=\"/docs/current/admin/event-listeners-kafka.html\">Kafka</a></li>\n  <li>Significant <a href=\"/docs/current/client/client-protocol.html\">client protocol</a> improvements</li>\n  <li><a href=\"/docs/current/udf/python.html\">Python user-defined functions</a></li>\n  <li>New connectors such as <a href=\"/docs/current/connector/faker.html\">Faker</a>,\n<a href=\"/docs/current/connector/snowflake.html\">Snowflake</a>, or\n<a href=\"/docs/current/connector/vertica.html\">Vertica</a></li>\n  <li>Numerous improvements on object storage connectors and integrations</li>\n</ul>\n\n<p>Of course we also paid a lot of attention to bug fixes and shipped tremendous\nperformance improvements.</p>\n\n<h2 id=\"slides-and-video\">Slides and video</h2>\n\n<p>If you want to find out all the details, have a look at the\n<a href=\"https://trino.io/assets/blog/trino-summit-2024/trino-summit-2024-keynote.pdf\"><strong>slides</strong></a>\nand the video recording:</p>\n\n<p><a href=\"https://www.youtube.com/watch?v=wmR6kzOCo-I\"><img src=\"https://img.youtube.com/vi/wmR6kzOCo-I/0.jpg\" alt=\"YouTube\" /></a></p>\n\n<h2 id=\"other-projects\">Other projects</h2>\n\n<p>Martin also talked about the many improvements in other Trino projects such as\n<a href=\"https://trinodb.github.io/trino-gateway/\">Trino Gateway</a>,\n<a href=\"https://github.com/trinodb/trino-python-client\">trino-python-client</a>, the new\n<a href=\"https://github.com/trinodb/trino-js-client\">trino-js-client</a>, and the new\n<a href=\"https://github.com/trinodb/trino-csharp-client\">trino-csharp-client</a>.</p>\n\n<h2 id=\"plans-for-2025\">Plans for 2025</h2>\n\n<p>For 2025, we have some pretty big plans in addition to our continued software\nsupply chain attention, performance improvemsnts and bug fixes.</p>\n\n<ul>\n  <li>Secrets management and dynamic catalogs</li>\n  <li>Client protocol improvements for all client drivers</li>\n  <li><a href=\"https://github.com/trinodb/trino/issues/22597\">Packaging improvements</a></li>\n  <li>More connectors such as DuckDB, LanceDB, HsqlDB, Loki, …</li>\n  <li>Continued and even increased work on performance improvements</li>\n  <li>Research and prototype towards a next generation optimizer</li>\n  <li>SQL language improvements such as <code class=\"language-plaintext highlighter-rouge\">PIVOT</code>, <code class=\"language-plaintext highlighter-rouge\">ASOF</code> joins, …</li>\n</ul>\n\n<p>Of course, what really happens in 2025 and Trino depends on you all. The project\nlives and breathes only thanks to the efforts of all our contributors and\nmaintainers and we look forward to working with you all.</p>\n\n<h2 id=\"trino-survey\">Trino survey</h2>\n\n<p>Besides filing issues, sending pull requests, and discussing topics on Slack and\nGitHub, we also have some specific questions and would really appreciate your\nfeedback. Answering should take less than a minute.</p>\n\n<div class=\"card-deck spacer-30\">\n    <a class=\"btn btn-pink\" target=\"_blank\" href=\"https://docs.google.com/forms/d/e/1FAIpQLSfrEIZ_5iyj17_hMJMdFhCIx9bQyHm6G-x6-CIq2VajURm6cQ/viewform?usp=sharing\">\n        Help by answering the Trino survey\n    </a>\n</div>\n<p><br /></p>\n\n<p>With Trino as a huge collaborative effort only one thing is for certain:</p>\n\n<blockquote>\n  <p>2025 will be an exciting year for Commander Bun Bun, Trino, and the Trino project.</p>\n</blockquote>"
---

Wow, what an amazing year 2024 was for Trino! Martin Traverso presented about
the achievements and progress of the project at the recent Trino Summit
2024. Let me dive
deeper into the content of his keynote and elaborate some more about our amazing
plans for the future.
Statistics
In his first slide of the presentation Enduring with persistence to reach the
summit Martin presented some of the amazing statistics of the year:
Over 30 releases packed with features and improvements - Trino releases 436-467
5,000+ additional commits to the 40,000+ total commits since project start
225+ unique contributors in 2024, 925+ total
10.5k+ stars on GitHub
13,500+ Slack members
Trino Community Broadcast episodes 54-67
Improvements
Some of the major improvements in Trino are:
Access controls with
Open Policy Agent and
Apache Ranger
Improved observability with OpenLineage, 
OpenTelemetry, OpenMetrics, and 
Kafka
Significant client protocol improvements
Python user-defined functions
New connectors such as Faker,
Snowflake, or
Vertica
Numerous improvements on object storage connectors and integrations
Of course we also paid a lot of attention to bug fixes and shipped tremendous
performance improvements.
Slides and video
If you want to find out all the details, have a look at the
slides
and the video recording:

Other projects
Martin also talked about the many improvements in other Trino projects such as
Trino Gateway,
trino-python-client, the new
trino-js-client, and the new
trino-csharp-client.
Plans for 2025
For 2025, we have some pretty big plans in addition to our continued software
supply chain attention, performance improvemsnts and bug fixes.
Secrets management and dynamic catalogs
Client protocol improvements for all client drivers
Packaging improvements
More connectors such as DuckDB, LanceDB, HsqlDB, Loki, …
Continued and even increased work on performance improvements
Research and prototype towards a next generation optimizer
SQL language improvements such as PIVOT, ASOF joins, …
Of course, what really happens in 2025 and Trino depends on you all. The project
lives and breathes only thanks to the efforts of all our contributors and
maintainers and we look forward to working with you all.
Trino survey
Besides filing issues, sending pull requests, and discussing topics on Slack and
GitHub, we also have some specific questions and would really appreciate your
feedback. Answering should take less than a minute.

With Trino as a huge collaborative effort only one thing is for certain:
2025 will be an exciting year for Commander Bun Bun, Trino, and the Trino project.
