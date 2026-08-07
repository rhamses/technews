---
title: "Trino Fest 2024 recap"
link: "https://trino.io/blog/2024/06/24/trino-fest-recap.html"
guid: "https://trino.io/blog/2024/06/24/trino-fest-recap.html"
pubDate: "2024-06-24T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Trino Fest 2024 is successfully in the books! While over 100 enthusiastic\nmembers of the community gathered in Boston, over 650 virtual attendees joined\nus worldwide to learn from our expert speakers as they discussed topics such as\ntable formats, enhancements and optimizations, and use cases with Trino both\nlarge and small. And now it is your chance to revisit the presentations or catch\nup on everything you missed.\nImpressions\nJudging from early results from attendee and speaker feedback, everyone enjoyed\nthe event. Asked about what sessions the audience liked we got answers like\nThey were all very insightful.\nAll of it, but especially the realtime demos to see speed difference on query\noptimization.\nand All of them, nothing was missed!\nJust like some attendees, our speakers travelled from Europe, Asia, and other\nplaces, and enjoyed the event.\nThanks for organizing the awesome event and inviting me for the talk!\nWas great to finally meet you and we had a great time at Trino Fest!\nThanks for a great event last week. It was a pleasure to meet you all.\nMany of us also met Commander Bun Bun,\nand we sent greetings to the remote audience as\nwell.\n\nThe keynote, the sessions, and all the talk in the hallways confirmed that Trino\ncontinues to thrive and expand in usage. Large companies like Apple, Microsoft,\nLinkedIn, Amazon, and many other users openly talk\nabout shipping Trino as part of their products and using it for internal usage\nas well. Smaller companies either run Trino themselves or take advantage of\nTrino-based products for all their data platform needs. Our sessions for Trino\nFest offered something to learn for everyone.\n\nSponsors\nBringing together the event was only possible thanks to the great Trino events\nteam around Anna Schibli\nat our main sponsor Starburst, and the assistance from all our other sponsors. A\nheartfelt thank you from Commander Bun Bun and all of us go out to you!\nSessions\nNow, following is what you are really looking for. All the talks, speakers,\nshort recaps, slide decks, video recordings, and following Q&A sessions, ready\nfor you. Enjoy!\nWhat’s new in Trino this summer\nPresented by Martin Traverso from\nStarburst\nMartin recapped everything that’s happened in Trino over the last six months,\ntaking a look at the biggest new features and how Trino development is going\nbetter than ever. He also gave a sneak peek at what we can expect soon in Trino.\n Video recording\n| Slides\nReducing query cost and query runtimes of Trino powered analytics platforms\nPresented by Jonas Irgens Kylling from\nDune.\nJonas gave a detailed talk about how Dune has improved their performance of\nTrino with a few key tweaks. That includes leveraging caching with Alluxio,\nadvanced cluster management, and storing, sampling, and filtering query results.\n Video recording\n| Slides\nEnhancing Trino’s query performance and data management with Hudi: innovations and future\nPresented by Ethan Guo from\nOnehouse.\nEthan gave a look into development on Hudi and Trino’s Hudi connector,\nexplaining multi-modal indexing and how it can improve query performance. He\nalso gave an overview of the roadmap and future of the connector.\n Video recording\n| Slides\nTrino Engineering @ Microsoft\nPresented by George Fisher and Ishan Patwa from\nMicrosoft.\nGeorge and Ishan gave a deep dive into what’s been going on with Microsoft’s\ndeployment and management of Trino. This included clients and integrations,\nresult caching, a sharded SQL connector, deep debugging and monitoring, and\nseamless security integration with Azure.\n Video recording\nEnhancing data governance in Trino with the OpenLineage integration\nPresented by Alok Kumar Prusty from\nApple.\nAlok’s lightning talk is all about how Apple deployed OpenLineage, an open\nframework for data lineage collection and analysis, and built a Trino plugin to\npublish OpenLineage complaint events that can be viewed and monitored.\n Video recording\nBest practices and insights when migrating to Apache Iceberg for data engineers\nPresented by Amit Gilad from\nCloudinary.\nAmit shared how Cloudinary expanded their data lake to use Apache Iceberg. He\ndemonstrated how moving from Snowflake to an open table format allowed them to\nreduce storage costs and leverage different query and processing engines to run\nmore powerful analytics at scale.\n Video recording\n| Slides\nTrino query intelligence: insights, recommendations, and predictions\nPresented by Marton Bod from Apple.\nMarton’s lightning talk explored how Apple has monitored and stored metadata for\nevery Trino query execution, then used that data for for real-time cluster\ndashboarding, self-service troubleshooting, and automatic generation of\nrecommendations for users.\n Video recording\nThe open source journey of the Trino Delta Lake Connector\nPresented by Marius Grama from\nStarburst.\nMarius went into a deep dive on all the work and collaboration that’s gone into\nmaking the Delta Lake connector in Trino a robust, first-class connector. Casual\ndiscussions, engineers working together, GitHub issues filed by the community,\nand innovative contributions have all come together, and Marius’ talk shows why\nan open source community is so powerful.\n Video recording\n| Slides\nTiny Trino; new perspectives in small data\nPresented by Ben Jeter and Thomas Zugibe from\nExecutive Homes.\nBen and Tommy explore how Executive Homes uses Trino’s robust suite of\nintegrations to handle data at a small scale. Instead of petabytes, how about a\nhandful of gigabytes in several different systems? It’s something that Trino is\nwell-equipped to handle thanks to how well-supported it is in the data\necosystem, and they explain why.\n Video recording\n| Slides\nBridging the divide: running Trino SQL on a vector data lake powered by Lance\nPresented by Lei Xu from LanceDB\nand Noah Shpak from Character.ai.\nLei and Noah give an overview of LanceDB, how it works, and what makes it a\ngreat database for multimodal AI. Then they dive into a Trino connector for\nLance, and explore how Trino slots into Character.AI’s workload to blend\nanalytics with training and generating new models.\n Video recording\n| Slides\nHow FourKites runs a scalable and cost-effective log analytics solution to\nhandle petabytes of logs\nPresented by Arpit Garg from\nFourKites.\nWith nearly a petabyte of logs being managed at FourKites, it shouldn’t be a\nhuge surprise that they’ve turned to Trino to handle understanding and analyzing\nthem. Arpit discusses how they’ve scaled log ingestion, strategically used S3\nwith Parquet to minimize storage costs, transformed and extracted those logs at\nscale, and leveraged Trino to search and explore the datasets with Superset as a\nfrontend for visualization.\n Video recording\n| Slides\nObserving Trino\nPresented by Matt Stephenson from\nStarburst.\nStarburst has built a comprehensive observability platform around Trino to\nbetter serve its users and customers. Matt explored all the components of it,\nincluding how to integrate with Jaeger, Prometheus, and ELK.\n Video recording\n| Slides\nAccelerate Performance at Scale: Best Practices for Trino with Amazon S3\nPresented by Dai Ozaki from AWS.\nDai’s talk explores best practices to get the most out of using Trino in\nconjunction with Amazon S3. He discusses partitioning, scaling workloads,\nreducing latency, and resolving common bottlenecks, providing valuable insights\nfor anyone trying to manage and deploy Trino with S3.\n Video recording\n| Slides\nWhat’s next\nWhile you are busy catching up, we are still working hard on a recap of the\nTrino Contributor Congregation. We also had a lot of great conversations that\nlead us to follow up action items such as more pull requests to review, new\ncontributors to onboard, and more projects to work on.\nMake sure you to join the community on Slack to learn\nmore in the next little while.\nOh, and one last thing…\n\n\nSee you soon,\nManfred, Cole, and Monica"
author: "Manfred Moser, Cole Bowden, Monica Miller"
contentHtml: "<p>Trino Fest 2024 is successfully in the books! While over 100 enthusiastic\nmembers of the community gathered in Boston, over 650 virtual attendees joined\nus worldwide to learn from our expert speakers as they discussed topics such as\ntable formats, enhancements and optimizations, and use cases with Trino both\nlarge and small. And now it is your chance to revisit the presentations or catch\nup on everything you missed.</p>\n\n<!--more-->\n\n<h2 id=\"impressions\">Impressions</h2>\n\n<p>Judging from early results from attendee and speaker feedback, everyone enjoyed\nthe event. Asked about what sessions the audience liked we got answers like</p>\n\n<ul>\n  <li><em>They were all very insightful.</em></li>\n  <li><em>All of it, but especially the realtime demos to see speed difference on query\noptimization.</em></li>\n  <li>and <em>All of them, nothing was missed!</em></li>\n</ul>\n\n<p>Just like some attendees, our speakers travelled from Europe, Asia, and other\nplaces, and enjoyed the event.</p>\n\n<ul>\n  <li><em>Thanks for organizing the awesome event and inviting me for the talk!</em></li>\n  <li><em>Was great to finally meet you and we had a great time at Trino Fest!</em></li>\n  <li><em>Thanks for a great event last week. It was a pleasure to meet you all.</em></li>\n</ul>\n\n<p>Many of us also <a href=\"https://www.linkedin.com/posts/k-shreya-s_trinofest2024-bigdata-analytics-activity-7209236269774585857-p8-e?utm_source=share&amp;utm_medium=member_desktop\">met Commander Bun Bun</a>,\nand <a href=\"https://www.youtube.com/watch?v=4jPYpU9Jrrw\">we sent greetings to the remote audience as\nwell</a>.</p>\n\n<p><img src=\"https://trino.io/assets/blog/trino-fest-2024/cbb-manfred.jpg\" /></p>\n\n<p>The keynote, the sessions, and all the talk in the hallways confirmed that Trino\ncontinues to thrive and expand in usage. Large companies like <a href=\"https://trino.io/users.html\">Apple, Microsoft,\nLinkedIn, Amazon, and many other users</a> openly talk\nabout shipping Trino as part of their products and using it for internal usage\nas well. Smaller companies either run Trino themselves or take advantage of\nTrino-based products for all their data platform needs. Our sessions for Trino\nFest offered something to learn for everyone.</p>\n\n<p><img src=\"https://trino.io/assets/blog/trino-fest-2024/hallway-chat.png\" /></p>\n\n<h2 id=\"sponsors\">Sponsors</h2>\n\n<p>Bringing together the event was only possible thanks to the great Trino events\nteam around <a href=\"https://www.linkedin.com/in/anna-schibli-418692172/\">Anna Schibli</a>\nat our main sponsor Starburst, and the assistance from all our other sponsors. A\nheartfelt thank you from Commander Bun Bun and all of us go out to you!</p>\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm\">\n      <a href=\"https://www.starburst.io/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/starburst-small.png\" title=\"Starburst, event host and organizer\" />\n      </a>\n    </div>\n    <div class=\"col-sm\">\n      <a href=\"https://www.onehouse.ai/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/onehouse-small.png\" title=\"Onehouse, event sponsor\" />\n      </a>\n    </div>\n    <div class=\"col-sm\">\n      <a href=\"https://www.startree.ai/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/startree-small.png\" title=\"Startree, event sponsor\" />\n      </a>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-sm\">\n      <a href=\"https://www.alluxio.io/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/alluxio-small.png\" title=\"Alluxio, event sponsor\" />\n      </a>\n    </div>\n    <div class=\"col-sm\">\n      <a href=\"https://cloudinary.com/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/cloudinary-small.png\" title=\"Cloudinary, event sponsor\" />\n      </a>\n    </div>\n    <div class=\"col-sm\">\n      <a href=\"https://www.upsolver.com/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/upsolver-small.png\" title=\"Upsolver, event sponsor\" />\n      </a>\n    </div>\n  </div>\n</div>\n\n<h2 id=\"sessions\">Sessions</h2>\n\n<p>Now, following is what you are really looking for. All the talks, speakers,\nshort recaps, slide decks, video recordings, and following Q&amp;A sessions, ready\nfor you. Enjoy!</p>\n\n<p><strong>What’s new in Trino this summer</strong>\n<br />Presented by Martin Traverso from\n<a href=\"https://www.starburst.io\" target=\"_blank\">Starburst</a></p>\n\n<p>Martin recapped everything that’s happened in Trino over the last six months,\ntaking a look at the biggest new features and how Trino development is going\nbetter than ever. He also gave a sneak peek at what we can expect soon in Trino.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=mk3n0_tAdZY\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/keynote.pdf\" target=\"_blank\">Slides</a></p>\n\n<hr />\n\n<p><strong>Reducing query cost and query runtimes of Trino powered analytics platforms</strong>\n<br />Presented by Jonas Irgens Kylling from\n<a href=\"https://dune.com/\" target=\"_blank\">Dune</a>.</p>\n\n<p>Jonas gave a detailed talk about how Dune has improved their performance of\nTrino with a few key tweaks. That includes leveraging caching with Alluxio,\nadvanced cluster management, and storing, sampling, and filtering query results.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=11yhPXIXiBY\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/dune.pdf\">Slides</a></p>\n\n<hr />\n\n<p><strong>Enhancing Trino’s query performance and data management with Hudi: innovations and future</strong>\n<br />Presented by Ethan Guo from\n<a href=\"https://www.onehouse.ai/\" target=\"_blank\">Onehouse</a>.</p>\n\n<p>Ethan gave a look into development on Hudi and Trino’s Hudi connector,\nexplaining multi-modal indexing and how it can improve query performance. He\nalso gave an overview of the roadmap and future of the connector.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=JMzS2BbeK0E\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/onehouse.pdf\">Slides</a></p>\n\n<hr />\n\n<p><strong>Trino Engineering @ Microsoft</strong>\n<br />Presented by George Fisher and Ishan Patwa from\n<a href=\"https://www.microsoft.com/\" target=\"_blank\">Microsoft</a>.</p>\n\n<p>George and Ishan gave a deep dive into what’s been going on with Microsoft’s\ndeployment and management of Trino. This included clients and integrations,\nresult caching, a sharded SQL connector, deep debugging and monitoring, and\nseamless security integration with Azure.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=t7ndqYUhKSA\" target=\"_blank\">Video recording</a></p>\n\n<hr />\n\n<p><strong>Enhancing data governance in Trino with the OpenLineage integration</strong>\n<br />Presented by Alok Kumar Prusty from\n<a href=\"https://www.apple.com/\" target=\"_blank\">Apple</a>.</p>\n\n<p>Alok’s lightning talk is all about how Apple deployed OpenLineage, an open\nframework for data lineage collection and analysis, and built a Trino plugin to\npublish OpenLineage complaint events that can be viewed and monitored.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=A7hj1M7IYj8\" target=\"_blank\">Video recording</a></p>\n\n<hr />\n\n<p><strong>Best practices and insights when migrating to Apache Iceberg for data engineers</strong>\n<br />Presented by Amit Gilad from\n<a href=\"https://cloudinary.com/\" target=\"_blank\">Cloudinary</a>.</p>\n\n<p>Amit shared how Cloudinary expanded their data lake to use Apache Iceberg. He\ndemonstrated how moving from Snowflake to an open table format allowed them to\nreduce storage costs and leverage different query and processing engines to run\nmore powerful analytics at scale.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=dKQ2zShNlyQ\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/cloudinary.pdf\">Slides</a></p>\n\n<hr />\n\n<p><strong>Trino query intelligence: insights, recommendations, and predictions</strong>\n<br />Presented by Marton Bod from <a href=\"https://www.apple.com/\" target=\"_blank\">Apple</a>.</p>\n\n<p>Marton’s lightning talk explored how Apple has monitored and stored metadata for\nevery Trino query execution, then used that data for for real-time cluster\ndashboarding, self-service troubleshooting, and automatic generation of\nrecommendations for users.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=K3iSXOJNaSQ\" target=\"_blank\">Video recording</a></p>\n\n<hr />\n\n<p><strong>The open source journey of the Trino Delta Lake Connector</strong>\n<br />Presented by Marius Grama from\n<a href=\"https://www.starburst.io\" target=\"_blank\">Starburst</a>.</p>\n\n<p>Marius went into a deep dive on all the work and collaboration that’s gone into\nmaking the Delta Lake connector in Trino a robust, first-class connector. Casual\ndiscussions, engineers working together, GitHub issues filed by the community,\nand innovative contributions have all come together, and Marius’ talk shows why\nan open source community is so powerful.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=mPfRYdvDcMo\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/delta-lake.pdf\">Slides</a></p>\n\n<hr />\n\n<p><strong>Tiny Trino; new perspectives in small data</strong>\n<br />Presented by Ben Jeter and Thomas Zugibe from\n<a href=\"https://www.executivehomes.com/\" target=\"_blank\">Executive Homes</a>.</p>\n\n<p>Ben and Tommy explore how Executive Homes uses Trino’s robust suite of\nintegrations to handle data at a small scale. Instead of petabytes, how about a\nhandful of gigabytes in several different systems? It’s something that Trino is\nwell-equipped to handle thanks to how well-supported it is in the data\necosystem, and they explain why.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=ZcY9LJDdB6Y\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/executive-homes.pdf\">Slides</a></p>\n\n<hr />\n\n<p><strong>Bridging the divide: running Trino SQL on a vector data lake powered by Lance</strong>\n<br />Presented by Lei Xu from <a href=\"https://lancedb.com/\" target=\"_blank\">LanceDB</a>\nand Noah Shpak from <a href=\"https://character.ai/\" target=\"_blank\">Character.ai</a>.</p>\n\n<p>Lei and Noah give an overview of LanceDB, how it works, and what makes it a\ngreat database for multimodal AI. Then they dive into a Trino connector for\nLance, and explore how Trino slots into Character.AI’s workload to blend\nanalytics with training and generating new models.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=jmOsVbGfon0\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/lance-characterai.pdf\">Slides</a></p>\n\n<hr />\n\n<p><strong>How FourKites runs a scalable and cost-effective log analytics solution to\nhandle petabytes of logs</strong>\n<br />Presented by Arpit Garg from\n<a href=\"https://www.fourkites.com/\" target=\"_blank\">FourKites</a>.</p>\n\n<p>With nearly a petabyte of logs being managed at FourKites, it shouldn’t be a\nhuge surprise that they’ve turned to Trino to handle understanding and analyzing\nthem. Arpit discusses how they’ve scaled log ingestion, strategically used S3\nwith Parquet to minimize storage costs, transformed and extracted those logs at\nscale, and leveraged Trino to search and explore the datasets with Superset as a\nfrontend for visualization.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=xdCZBQJt-0g\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/fourkites.pdf\">Slides</a></p>\n\n<hr />\n\n<p><strong>Observing Trino</strong>\n<br />Presented by Matt Stephenson from\n<a href=\"https://www.starburst.io\" target=\"_blank\">Starburst</a>.</p>\n\n<p>Starburst has built a comprehensive observability platform around Trino to\nbetter serve its users and customers. Matt explored all the components of it,\nincluding how to integrate with Jaeger, Prometheus, and ELK.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=v7p72Ggcc5I\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/observing-trino.pdf\">Slides</a></p>\n\n<hr />\n\n<p><strong>Accelerate Performance at Scale: Best Practices for Trino with Amazon S3</strong>\n<br />Presented by Dai Ozaki from <a href=\"https://aws.amazon.com/\" target=\"_blank\">AWS</a>.</p>\n\n<p>Dai’s talk explores best practices to get the most out of using Trino in\nconjunction with Amazon S3. He discusses partitioning, scaling workloads,\nreducing latency, and resolving common bottlenecks, providing valuable insights\nfor anyone trying to manage and deploy Trino with S3.\n<br /><i class=\"fab fa-youtube\" style=\"color: red;\"></i> <a href=\"https://www.youtube.com/watch?v=cjUUcHlUKxQ\" target=\"_blank\">Video recording</a>\n| <a href=\"https://trino.io/assets/blog/trino-fest-2024/aws-s3.pdf\">Slides</a></p>\n\n<h2 id=\"whats-next\">What’s next</h2>\n\n<p>While you are busy catching up, we are still working hard on a recap of the\nTrino Contributor Congregation. We also had a lot of great conversations that\nlead us to follow up action items such as more pull requests to review, new\ncontributors to onboard, and more projects to work on.</p>\n\n<p>Make sure you to <a href=\"https://trino.io/slack.html\">join the community on Slack</a> to learn\nmore in the next little while.</p>\n\n<p>Oh, and one last thing…</p>\n\n<div class=\"card-deck spacer-30\">\n    <a class=\"btn btn-orange\" href=\"https://www.starburst.io/info/trino-summit-2024/?utm_medium=trino&amp;utm_source=website&amp;utm_campaign=NORAM-FY25-Q4-CM-Trino-Summit-2024-IMC-Upgrade&amp;utm_content=Trino-Fest-Blog-Recap\">\n        Trino Summit 2024 registration is open\n    </a>\n</div>\n<div class=\"spacer-30\"></div>\n\n<p>See you soon,</p>\n\n<p><em>Manfred, Cole, and Monica</em></p>"
---

Trino Fest 2024 is successfully in the books! While over 100 enthusiastic
members of the community gathered in Boston, over 650 virtual attendees joined
us worldwide to learn from our expert speakers as they discussed topics such as
table formats, enhancements and optimizations, and use cases with Trino both
large and small. And now it is your chance to revisit the presentations or catch
up on everything you missed.
Impressions
Judging from early results from attendee and speaker feedback, everyone enjoyed
the event. Asked about what sessions the audience liked we got answers like
They were all very insightful.
All of it, but especially the realtime demos to see speed difference on query
optimization.
and All of them, nothing was missed!
Just like some attendees, our speakers travelled from Europe, Asia, and other
places, and enjoyed the event.
Thanks for organizing the awesome event and inviting me for the talk!
Was great to finally meet you and we had a great time at Trino Fest!
Thanks for a great event last week. It was a pleasure to meet you all.
Many of us also met Commander Bun Bun,
and we sent greetings to the remote audience as
well.

The keynote, the sessions, and all the talk in the hallways confirmed that Trino
continues to thrive and expand in usage. Large companies like Apple, Microsoft,
LinkedIn, Amazon, and many other users openly talk
about shipping Trino as part of their products and using it for internal usage
as well. Smaller companies either run Trino themselves or take advantage of
Trino-based products for all their data platform needs. Our sessions for Trino
Fest offered something to learn for everyone.

Sponsors
Bringing together the event was only possible thanks to the great Trino events
team around Anna Schibli
at our main sponsor Starburst, and the assistance from all our other sponsors. A
heartfelt thank you from Commander Bun Bun and all of us go out to you!
Sessions
Now, following is what you are really looking for. All the talks, speakers,
short recaps, slide decks, video recordings, and following Q&A sessions, ready
for you. Enjoy!
What’s new in Trino this summer
Presented by Martin Traverso from
Starburst
Martin recapped everything that’s happened in Trino over the last six months,
taking a look at the biggest new features and how Trino development is going
better than ever. He also gave a sneak peek at what we can expect soon in Trino.
 Video recording
| Slides
Reducing query cost and query runtimes of Trino powered analytics platforms
Presented by Jonas Irgens Kylling from
Dune.
Jonas gave a detailed talk about how Dune has improved their performance of
Trino with a few key tweaks. That includes leveraging caching with Alluxio,
advanced cluster management, and storing, sampling, and filtering query results.
 Video recording
| Slides
Enhancing Trino’s query performance and data management with Hudi: innovations and future
Presented by Ethan Guo from
Onehouse.
Ethan gave a look into development on Hudi and Trino’s Hudi connector,
explaining multi-modal indexing and how it can improve query performance. He
also gave an overview of the roadmap and future of the connector.
 Video recording
| Slides
Trino Engineering @ Microsoft
Presented by George Fisher and Ishan Patwa from
Microsoft.
George and Ishan gave a deep dive into what’s been going on with Microsoft’s
deployment and management of Trino. This included clients and integrations,
result caching, a sharded SQL connector, deep debugging and monitoring, and
seamless security integration with Azure.
 Video recording
Enhancing data governance in Trino with the OpenLineage integration
Presented by Alok Kumar Prusty from
Apple.
Alok’s lightning talk is all about how Apple deployed OpenLineage, an open
framework for data lineage collection and analysis, and built a Trino plugin to
publish OpenLineage complaint events that can be viewed and monitored.
 Video recording
Best practices and insights when migrating to Apache Iceberg for data engineers
Presented by Amit Gilad from
Cloudinary.
Amit shared how Cloudinary expanded their data lake to use Apache Iceberg. He
demonstrated how moving from Snowflake to an open table format allowed them to
reduce storage costs and leverage different query and processing engines to run
more powerful analytics at scale.
 Video recording
| Slides
Trino query intelligence: insights, recommendations, and predictions
Presented by Marton Bod from Apple.
Marton’s lightning talk explored how Apple has monitored and stored metadata for
every Trino query execution, then used that data for for real-time cluster
dashboarding, self-service troubleshooting, and automatic generation of
recommendations for users.
 Video recording
The open source journey of the Trino Delta Lake Connector
Presented by Marius Grama from
Starburst.
Marius went into a deep dive on all the work and collaboration that’s gone into
making the Delta Lake connector in Trino a robust, first-class connector. Casual
discussions, engineers working together, GitHub issues filed by the community,
and innovative contributions have all come together, and Marius’ talk shows why
an open source community is so powerful.
 Video recording
| Slides
Tiny Trino; new perspectives in small data
Presented by Ben Jeter and Thomas Zugibe from
Executive Homes.
Ben and Tommy explore how Executive Homes uses Trino’s robust suite of
integrations to handle data at a small scale. Instead of petabytes, how about a
handful of gigabytes in several different systems? It’s something that Trino is
well-equipped to handle thanks to how well-supported it is in the data
ecosystem, and they explain why.
 Video recording
| Slides
Bridging the divide: running Trino SQL on a vector data lake powered by Lance
Presented by Lei Xu from LanceDB
and Noah Shpak from Character.ai.
Lei and Noah give an overview of LanceDB, how it works, and what makes it a
great database for multimodal AI. Then they dive into a Trino connector for
Lance, and explore how Trino slots into Character.AI’s workload to blend
analytics with training and generating new models.
 Video recording
| Slides
How FourKites runs a scalable and cost-effective log analytics solution to
handle petabytes of logs
Presented by Arpit Garg from
FourKites.
With nearly a petabyte of logs being managed at FourKites, it shouldn’t be a
huge surprise that they’ve turned to Trino to handle understanding and analyzing
them. Arpit discusses how they’ve scaled log ingestion, strategically used S3
with Parquet to minimize storage costs, transformed and extracted those logs at
scale, and leveraged Trino to search and explore the datasets with Superset as a
frontend for visualization.
 Video recording
| Slides
Observing Trino
Presented by Matt Stephenson from
Starburst.
Starburst has built a comprehensive observability platform around Trino to
better serve its users and customers. Matt explored all the components of it,
including how to integrate with Jaeger, Prometheus, and ELK.
 Video recording
| Slides
Accelerate Performance at Scale: Best Practices for Trino with Amazon S3
Presented by Dai Ozaki from AWS.
Dai’s talk explores best practices to get the most out of using Trino in
conjunction with Amazon S3. He discusses partitioning, scaling workloads,
reducing latency, and resolving common bottlenecks, providing valuable insights
for anyone trying to manage and deploy Trino with S3.
 Video recording
| Slides
What’s next
While you are busy catching up, we are still working hard on a recap of the
Trino Contributor Congregation. We also had a lot of great conversations that
lead us to follow up action items such as more pull requests to review, new
contributors to onboard, and more projects to work on.
Make sure you to join the community on Slack to learn
more in the next little while.
Oh, and one last thing…


See you soon,
Manfred, Cole, and Monica
