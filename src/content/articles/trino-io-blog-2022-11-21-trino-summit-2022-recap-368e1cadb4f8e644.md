---
title: "Trino Summit 2022 recap"
link: "https://trino.io/blog/2022/11/21/trino-summit-2022-recap.html"
guid: "https://trino.io/blog/2022/11/21/trino-summit-2022-recap.html"
pubDate: "2022-11-21T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Trino Summit 2022 was in a word, invigorating. I’m still coming off the high \nfrom the amount of energy I gained from being at this summit, meeting many of\nyou face-to-face for the first time. Most surprisingly, I learned that Trino\ncontributor James Petty from AWS was actually not famous painter\nBob Ross.\n\nIf you’ve ever planned a conference, you know that there are a lot of details to\niron out, and you can be left exhausted by the end. After this year’s Trino\nSummit though, rather than being worn out, I felt like it ended too quickly and\nI simply wanted more time to chat with everyone. A single day was simply not\nenough, and now all I can think about is the next summit. We not only got to\nhear an incredible lineup of talks and discussions from first-time Trino Summit\nspeakers like Apple, Shopify, and Lyft, but also had many engaging discussions\noutside the auditorium.\n\n\n\n\nThere were cross-community discussions between Delta Lake, Airflow, and Alluxio\nabout how to turbo-charge Trino integrations with these communities. There were\nmany companies talking about best practices and gotchas while migrating from\nHive to Iceberg or Delta Lake. Others wanted to learn how to use fault-tolerant\nexecution. I spoke with managers of companies like LinkedIn and Bloomberg who\nwanted to help develop their engineers to get more involved with contributing to\nTrino. We all finally got to see the faces of people we had been talking to for\nthe past two to three years for the first time. People were getting their free\ncopies of Trino: The Definitive Guide signed by Manfred, Matt, and Martin and\nbrought home other swag. After a long day of talks, we wrapped Trino Summit up\nwith two happy hours on the roof of the Commonwealth club watching the sunset\nover the San Francisco bay bridge.\n\n\nSession summaries\nI would like to quickly summarize a few short takeaways I had from each talk at\nthe summit. I highly recommend you watch the full videos on the Trino YouTube\nwhich are linked in the titles:\n Keynote: State of Trino\n(Read more)\nTrino co-creator, Martin, covers recently developed features, community \nstatistics, and discusses roadmap features like Project Hummingbird.\nDain and David join Martin on the stage to answer audience questions.\n\n Trino at Apple\n(Read more)\nApple has an in-house k8s operator to manage Trino cluster lifecycles, and an\norchestrator to provision and simplify cluster creation and management.\nApple has a heavy focus on Apache Iceberg as their table format and has\ncontributed a significant amount of PRs to improve interoperability between\nTrino and Spark and increased coverage of Iceberg APIs.\n\n Enterprise-ready Trino at Bloomberg: One Giant Leap Toward Data Mesh!\n(Read more)\nBloomberg uses Trino to centralize access to their massive amounts of catalogs\nunder many different departments.\nTo offer Trino-as-a-Service for varying workloads, they use a Trino Load\nBalancer (a fork of the popular presto-gateway project at Lyft) to add new\nfunctionality. In talking with them after their presentation, the Bloomberg\nteam expressed an interest in wanting to open source this work to the\ncommunity as a more generalized solution than the gateway project.\n\n Optimizing Trino using spot instances\n(Read more)\nIn an attempt to minimize costs, Zillow is measuring the efficacy of running\nTrino ETL jobs on spot instances.\nThis currently runs the risk of retries for failure but future work will look\nat utilizing the new fault-tolerant execution method to mitigate retries in\nthe event of failure.\n\n Leveraging Trino to Power Data at Goldman Sachs\n(Read more)\nGoldman Sachs uses Trino to power their data quality service, taking advantage\nof the fact that Trino centralizes all visibility across their platform.\n\n Elevating data fabric to data mesh: Solving data needs in hybrid datalakes\n(Read more)\nComcast takes us through their Trino architecture journey by providing the\nhistory of their Data Fabric service, and now discusses the data governance\nand culture changes required to realize a Data Mesh with Trino.\n\n Rewriting History: Migrating petabytes of data to Apache Iceberg using Trino\n(Read more)\nShopify has recently migrates of its workloads to Trino. One of the first\nhurdles was dealing with many issues in the Hive table format, so they quickly\nupgraded to the Iceberg table format.\nThey initially encountered numerous issued, but experienced incredibly fast\nturnaround of fixes from the Trino project that resolved their issues during\nthe migration.\nThere’s also a benchmark of how updating to a columnar format and Iceberg\ntable format drastically improves the results.\n\n Trino for Large Scale ETL at Lyft\n(Read more)\nLyft is using Trino to perform ETL jobs scanning 10PB of data per day, and\nwriting 100TB per day. They are not using fault-tolerant execution.\nIn the last year, Lyft cut their number of Trino nodes in half, while\nincreasing the volume of their workloads due to recent improvements in Trino\nand upgrades in Java versions.\nKeeping up with the rapid release cycle of Trino was a challenge and Lyft\nshowcases their regression testing using their query replay framework.\n\n Federating them all on Starburst Galaxy\n(Read more)\nRunning and scaling Trino is difficult. Starburst showcases Starburst Galaxy,\na SaaS data platform built around the Trino query engine.\nThis demoes running federated queries over Pokémon data scattered across\nMongoDB and Iceberg tables.\n\n Trino at Quora: Speed, Cost, Reliability Challenges and Tips\n(Read more)\nQuora uses a large number of Trino clusters for ad-hoc, ETL, time series, A/B\ntesting, and backfill data.\nQuora faced some initially high costs on Trino due to inefficient uses of\nresources.\nTo address this they migrated to use Graviton instances, implemented\nautoscaling, and optimized query efficiency.\n\n Journey to Iceberg with SK Telecom\n(Read more)\nThe speakers travelled all the way from South Korea to join us in person.\nSK Telecom had a multitude of performance issues that all stemmed from the\nlack of flexibility in the Hive model and metastore.\nThey migrated to Iceberg to address performance issues and had added benefits\nof Iceberg’s table format to improve developer workflow.\nHousekeeping operations like optimize were already addressed by the Iceberg\ncommunity and quickly added to Trino.\nThis reduced query processing time by 80%.\n\n Using Trino with Apache Airflow for (almost) all your data problems\n(Read more)\nAirflow is a highly functional and well-adopted workflow management platform\nto schedule jobs on your data platform.\nThe Trino integration for Airflow recently landed and this coincided with the\nGA arrival of fault-tolerance execution mode in Trino.\n\n How we use Trino to analyze our Product-led Growth (PLG) user activation funnel\n(Read more)\nUpsolver solves a lot of common data problems on their platform.\nOne such problem is measuring activation rates in a product-led growthteam. This requires taking action on many sources of data.\nTrino makes a natural fit to address the issues of joining this data together.\n\nFederate ‘em all\nAfter a whole day of throwing Trino balls out to the crowd, we got to see a\nnice metaphor for federated data by throwing them all in the air and yelling,\n“Federate ‘em all!”\n\nTrino Contributor Congregation\nThe day after the summit, we invited a relatively small group of our\ncontributors to meet for the inaugural Trino Contributor Congregation (TCC).\nThis gathered many of our long-time and heavy Trino contributors. We had folks\nfrom companies like Starburst, AWS, Apple, Bloomberg, Lyft, Comcast, LinkedIn,\nTreasure Data, and others. Let’s dive into some of the topics we discussed.\n\nWe discussed feature proposals like:\nThe Trino loadbalancer which is an adaption of the popular gateway project from Lyft.\nA Ranger plugin to be maintained by the Trino community rather than rely on the Ranger project.\nA Snowflake connector that was traditionally held back by the lack of infrastructure.\nWe discussed the need for better shared testing datasets outside of the TPC-H\nand TPC-DS that are more representative of real workloads that many are using.\nWe discussed the need for a clearer process for contributors to follow to\nminimize the time to get features merged and avoid stale PRs. This is being\naddressed by the backlog grooming performed by the developer relations team, and\nassigning maintainers to own various PRs. While there is never a promise to\nmerge a PR, improving the turnaround and communication on PRs is crucial to keep\nhappy contributors and improve the health of the project.\nWhile we were sad that not everyone could make the in-person TCC, we plan to\nhave virtual TCCs on a more frequent cadence and have the in-person TCCs\nalongside larger in-person events. Getting these TCCs right is core to growing\nthe maintainership and continued success of the Trino project.\nWe hope all of you who could join us in-person and online enjoyed yourselves. We\nall had such a blast! Stay tuned for updates on the next Trino Summit location!"
author: "Brian Olsen"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/trino-summit-2022/stage.jpg\">\n    </p>\n    <p>Trino Summit 2022 was in a word, invigorating. I’m still coming off the high \nfrom the amount of energy I gained from being at this summit, meeting many of\nyou face-to-face for the first time. Most surprisingly, I learned that Trino\ncontributor James Petty from AWS was actually not famous painter\n<a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Bob_Ross\">Bob Ross</a>.</p>\n<!--more-->\n<p><img src=\"https://trino.io/assets/blog/trino-summit-2022/james-petty.png\"></p>\n<p>If you’ve ever planned a conference, you know that there are a lot of details to\niron out, and you can be left exhausted by the end. After this year’s Trino\nSummit though, rather than being worn out, I felt like it ended too quickly and\nI simply wanted more time to chat with everyone. A single day was simply not\nenough, and now all I can think about is the next summit. We not only got to\nhear an incredible lineup of talks and discussions from first-time Trino Summit\nspeakers like Apple, Shopify, and Lyft, but also had many engaging discussions\noutside the auditorium.</p>\n<p><img src=\"https://trino.io/assets/blog/trino-summit-2022/swag.jpg\">\n<img src=\"https://trino.io/assets/blog/trino-summit-2022/authors.jpg\">\n<img src=\"https://trino.io/assets/blog/trino-summit-2022/talking-1.jpg\">\n<img src=\"https://trino.io/assets/blog/trino-summit-2022/talking-2.jpg\"></p>\n<p>There were cross-community discussions between Delta Lake, Airflow, and Alluxio\nabout how to turbo-charge Trino integrations with these communities. There were\nmany companies talking about best practices and gotchas while migrating from\nHive to Iceberg or Delta Lake. Others wanted to learn how to use fault-tolerant\nexecution. I spoke with managers of companies like LinkedIn and Bloomberg who\nwanted to help develop their engineers to get more involved with contributing to\nTrino. We all finally got to see the faces of people we had been talking to for\nthe past two to three years for the first time. People were getting their free\ncopies of Trino: The Definitive Guide signed by Manfred, Matt, and Martin and\nbrought home other swag. After a long day of talks, we wrapped Trino Summit up\nwith two happy hours on the roof of the Commonwealth club watching the sunset\nover the San Francisco bay bridge.</p>\n<p><img src=\"https://trino.io/assets/blog/trino-summit-2022/speech.jpg\">\n<img src=\"https://trino.io/assets/blog/trino-summit-2022/happy-hour.jpg\"></p>\n<h2 id=\"session-summaries\">\n    Session summaries <a target=\"_blank\" href=\"https://trino.io/blog/2022/11/21/trino-summit-2022-recap.html#session-summaries\">#</a>\n</h2>\n<p>I would like to quickly summarize a few short takeaways I had from each talk at\nthe summit. I highly recommend you watch the full videos on the Trino YouTube\nwhich are linked in the titles:</p>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=mUq_h3oArp4\"><i></i> Keynote: State of Trino</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/11/22/trino-summit-2022-state-of-trino-keynote-recap\">Read more</a>)</p>\n<ul>\n  <li>Trino co-creator, Martin, covers recently developed features, community \nstatistics, and discusses roadmap features like Project Hummingbird.</li>\n  <li>\n    <p>Dain and David join Martin on the stage to answer audience questions.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=mUq_h3oArp4\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/keynote.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=3afcRK6Yvio\"><i></i> Trino at Apple</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/11/28/trino-summit-2022-apple-recap\">Read more</a>)</p>\n<ul>\n  <li>Apple has an in-house k8s operator to manage Trino cluster lifecycles, and an\norchestrator to provision and simplify cluster creation and management.</li>\n  <li>\n    <p>Apple has a heavy focus on Apache Iceberg as their table format and has\ncontributed a significant amount of PRs to improve interoperability between\nTrino and Spark and increased coverage of Iceberg APIs.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=3afcRK6Yvio\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/apple.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ePr-iVQ5ri4\"><i></i> Enterprise-ready Trino at Bloomberg: One Giant Leap Toward Data Mesh!</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/11/30/trino-summit-2022-bloomberg-recap\">Read more</a>)</p>\n<ul>\n  <li>Bloomberg uses Trino to centralize access to their massive amounts of catalogs\nunder many different departments.</li>\n  <li>\n    <p>To offer Trino-as-a-Service for varying workloads, they use a Trino Load\nBalancer (a fork of the popular presto-gateway project at Lyft) to add new\nfunctionality. In talking with them after their presentation, the Bloomberg\nteam expressed an interest in wanting to open source this work to the\ncommunity as a more generalized solution than the gateway project.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=ePr-iVQ5ri4\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/bloomberg.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=vz9reBUgQTE\"><i></i> Optimizing Trino using spot instances</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/01/trino-summit-2022-zillow-recap\">Read more</a>)</p>\n<ul>\n  <li>In an attempt to minimize costs, Zillow is measuring the efficacy of running\nTrino ETL jobs on spot instances.</li>\n  <li>\n    <p>This currently runs the risk of retries for failure but future work will look\nat utilizing the new fault-tolerant execution method to mitigate retries in\nthe event of failure.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=vz9reBUgQTE\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/zillow.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=g9fLA3tFG-Q\"><i></i> Leveraging Trino to Power Data at Goldman Sachs</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/05/trino-summit-2022-goldman-sachs-recap\">Read more</a>)</p>\n<ul>\n  <li>Goldman Sachs uses Trino to power their data quality service, taking advantage\nof the fact that Trino centralizes all visibility across their platform.</li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=g9fLA3tFG-Q\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/goldman-sachs.png\"></a></p>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=sSWBi7bBotQ\"><i></i> Elevating data fabric to data mesh: Solving data needs in hybrid datalakes</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/07/trino-summit-2022-comcast-recap\">Read more</a>)</p>\n<ul>\n  <li>\n    <p>Comcast takes us through their Trino architecture journey by providing the\nhistory of their Data Fabric service, and now discusses the data governance\nand culture changes required to realize a Data Mesh with Trino.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=sSWBi7bBotQ\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/comcast.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=nJBBw-xnLU8\"><i></i> Rewriting History: Migrating petabytes of data to Apache Iceberg using Trino</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/09/trino-summit-2022-shopify-recap\">Read more</a>)</p>\n<ul>\n  <li>Shopify has recently migrates of its workloads to Trino. One of the first\nhurdles was dealing with many issues in the Hive table format, so they quickly\nupgraded to the Iceberg table format.</li>\n  <li>They initially encountered numerous issued, but experienced incredibly fast\nturnaround of fixes from the Trino project that resolved their issues during\nthe migration.</li>\n  <li>\n    <p>There’s also a benchmark of how updating to a columnar format and Iceberg\ntable format drastically improves the results.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=nJBBw-xnLU8\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/shopify.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=FL3c1Ue7YWM\"><i></i> Trino for Large Scale ETL at Lyft</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/12/trino-summit-2022-lyft-recap\">Read more</a>)</p>\n<ul>\n  <li>Lyft is using Trino to perform ETL jobs scanning 10PB of data per day, and\nwriting 100TB per day. They are not using fault-tolerant execution.</li>\n  <li>In the last year, Lyft cut their number of Trino nodes in half, while\nincreasing the volume of their workloads due to recent improvements in Trino\nand upgrades in Java versions.</li>\n  <li>\n    <p>Keeping up with the rapid release cycle of Trino was a challenge and Lyft\nshowcases their regression testing using their query replay framework.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=FL3c1Ue7YWM\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/lyft.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=Zfmxwu0m98k\"><i></i> Federating them all on Starburst Galaxy</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/14/trino-summit-2022-starburst-recap\">Read more</a>)</p>\n<ul>\n  <li>Running and scaling Trino is difficult. Starburst showcases Starburst Galaxy,\na SaaS data platform built around the Trino query engine.</li>\n  <li>\n    <p>This demoes running federated queries over Pokémon data scattered across\nMongoDB and Iceberg tables.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=Zfmxwu0m98k\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/starburst.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=Q03DzL_fm-I\"><i></i> Trino at Quora: Speed, Cost, Reliability Challenges and Tips</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/16/trino-summit-2022-quora-recap\">Read more</a>)</p>\n<ul>\n  <li>Quora uses a large number of Trino clusters for ad-hoc, ETL, time series, A/B\ntesting, and backfill data.</li>\n  <li>Quora faced some initially high costs on Trino due to inefficient uses of\nresources.</li>\n  <li>\n    <p>To address this they migrated to use Graviton instances, implemented\nautoscaling, and optimized query efficiency.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=Q03DzL_fm-I\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/quora.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=V9_aPLXATh8\"><i></i> Journey to Iceberg with SK Telecom</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/19/trino-summit-2022-sk-telecom-recap\">Read more</a>)</p>\n<ul>\n  <li>The speakers travelled all the way from South Korea to join us in person.</li>\n  <li>SK Telecom had a multitude of performance issues that all stemmed from the\nlack of flexibility in the Hive model and metastore.</li>\n  <li>They migrated to Iceberg to address performance issues and had added benefits\nof Iceberg’s table format to improve developer workflow.</li>\n  <li>Housekeeping operations like optimize were already addressed by the Iceberg\ncommunity and quickly added to Trino.</li>\n  <li>\n    <p>This reduced query processing time by 80%.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=V9_aPLXATh8\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/sk-telecom.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=xKDN7RUJ5i4\"><i></i> Using Trino with Apache Airflow for (almost) all your data problems</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/21/trino-summit-2022-astronomer-recap\">Read more</a>)</p>\n<ul>\n  <li>Airflow is a highly functional and well-adopted workflow management platform\nto schedule jobs on your data platform.</li>\n  <li>\n    <p>The Trino integration for Airflow recently landed and this coincided with the\nGA arrival of fault-tolerance execution mode in Trino.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=xKDN7RUJ5i4\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/astronomer.jpg\"></a></p>\n  </li>\n</ul>\n<p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=MCB_1furnAo\"><i></i> How we use Trino to analyze our Product-led Growth (PLG) user activation funnel</a>\n(<a target=\"_blank\" href=\"https://trino.io/blog/2022/12/23/trino-summit-2022-upsolver-recap\">Read more</a>)</p>\n<ul>\n  <li>Upsolver solves a lot of common data problems on their platform.</li>\n  <li>One such problem is measuring activation rates in a product-led growthteam. This requires taking action on many sources of data.</li>\n  <li>\n    <p>Trino makes a natural fit to address the issues of joining this data together.</p>\n    <p><a target=\"_blank\" href=\"https://www.youtube.com/watch?v=MCB_1furnAo\"><img src=\"https://trino.io/assets/blog/trino-summit-2022/upsolver.jpg\"></a></p>\n  </li>\n</ul>\n<h2 id=\"federate-em-all\">\n    Federate ‘em all <a target=\"_blank\" href=\"https://trino.io/blog/2022/11/21/trino-summit-2022-recap.html#federate-em-all\">#</a>\n</h2>\n<p>After a whole day of throwing Trino balls out to the crowd, we got to see a\nnice metaphor for federated data by throwing them all in the air and yelling,\n“Federate ‘em all!”</p>\n<p><img src=\"https://trino.io/assets/blog/trino-summit-2022/balls.jpg\"></p>\n<h2 id=\"trino-contributor-congregation\">\n    Trino Contributor Congregation <a target=\"_blank\" href=\"https://trino.io/blog/2022/11/21/trino-summit-2022-recap.html#trino-contributor-congregation\">#</a>\n</h2>\n<p>The day after the summit, we invited a relatively small group of our\ncontributors to meet for the inaugural Trino Contributor Congregation (TCC).\nThis gathered many of our long-time and heavy Trino contributors. We had folks\nfrom companies like Starburst, AWS, Apple, Bloomberg, Lyft, Comcast, LinkedIn,\nTreasure Data, and others. Let’s dive into some of the topics we discussed.</p>\n<p><img src=\"https://trino.io/assets/blog/trino-summit-2022/contributor-congregation.jpg\"></p>\n<p>We discussed feature proposals like:</p>\n<ul>\n  <li>The Trino loadbalancer which is an adaption of the popular gateway project from Lyft.</li>\n  <li>A Ranger plugin to be maintained by the Trino community rather than rely on the Ranger project.</li>\n  <li>A Snowflake connector that was traditionally held back by the lack of infrastructure.</li>\n</ul>\n<p>We discussed the need for better shared testing datasets outside of the TPC-H\nand TPC-DS that are more representative of real workloads that many are using.</p>\n<p>We discussed the need for a clearer process for contributors to follow to\nminimize the time to get features merged and avoid stale PRs. This is being\naddressed by the backlog grooming performed by the developer relations team, and\nassigning maintainers to own various PRs. While there is never a promise to\nmerge a PR, improving the turnaround and communication on PRs is crucial to keep\nhappy contributors and improve the health of the project.</p>\n<p>While we were sad that not everyone could make the in-person TCC, we plan to\nhave virtual TCCs on a more frequent cadence and have the in-person TCCs\nalongside larger in-person events. Getting these TCCs right is core to growing\nthe maintainership and continued success of the Trino project.</p>\n<p>We hope all of you who could join us in-person and online enjoyed yourselves. We\nall had such a blast! Stay tuned for updates on the next Trino Summit location!</p>\n<p><img src=\"https://trino.io/assets/blog/trino-summit-2022/bun-bun-bye.jpg\"></p>\n  </div>\n</article>\n</div>"
---

Trino Summit 2022 was in a word, invigorating. I’m still coming off the high 
from the amount of energy I gained from being at this summit, meeting many of
you face-to-face for the first time. Most surprisingly, I learned that Trino
contributor James Petty from AWS was actually not famous painter
Bob Ross.

If you’ve ever planned a conference, you know that there are a lot of details to
iron out, and you can be left exhausted by the end. After this year’s Trino
Summit though, rather than being worn out, I felt like it ended too quickly and
I simply wanted more time to chat with everyone. A single day was simply not
enough, and now all I can think about is the next summit. We not only got to
hear an incredible lineup of talks and discussions from first-time Trino Summit
speakers like Apple, Shopify, and Lyft, but also had many engaging discussions
outside the auditorium.




There were cross-community discussions between Delta Lake, Airflow, and Alluxio
about how to turbo-charge Trino integrations with these communities. There were
many companies talking about best practices and gotchas while migrating from
Hive to Iceberg or Delta Lake. Others wanted to learn how to use fault-tolerant
execution. I spoke with managers of companies like LinkedIn and Bloomberg who
wanted to help develop their engineers to get more involved with contributing to
Trino. We all finally got to see the faces of people we had been talking to for
the past two to three years for the first time. People were getting their free
copies of Trino: The Definitive Guide signed by Manfred, Matt, and Martin and
brought home other swag. After a long day of talks, we wrapped Trino Summit up
with two happy hours on the roof of the Commonwealth club watching the sunset
over the San Francisco bay bridge.


Session summaries
I would like to quickly summarize a few short takeaways I had from each talk at
the summit. I highly recommend you watch the full videos on the Trino YouTube
which are linked in the titles:
 Keynote: State of Trino
(Read more)
Trino co-creator, Martin, covers recently developed features, community 
statistics, and discusses roadmap features like Project Hummingbird.
Dain and David join Martin on the stage to answer audience questions.

 Trino at Apple
(Read more)
Apple has an in-house k8s operator to manage Trino cluster lifecycles, and an
orchestrator to provision and simplify cluster creation and management.
Apple has a heavy focus on Apache Iceberg as their table format and has
contributed a significant amount of PRs to improve interoperability between
Trino and Spark and increased coverage of Iceberg APIs.

 Enterprise-ready Trino at Bloomberg: One Giant Leap Toward Data Mesh!
(Read more)
Bloomberg uses Trino to centralize access to their massive amounts of catalogs
under many different departments.
To offer Trino-as-a-Service for varying workloads, they use a Trino Load
Balancer (a fork of the popular presto-gateway project at Lyft) to add new
functionality. In talking with them after their presentation, the Bloomberg
team expressed an interest in wanting to open source this work to the
community as a more generalized solution than the gateway project.

 Optimizing Trino using spot instances
(Read more)
In an attempt to minimize costs, Zillow is measuring the efficacy of running
Trino ETL jobs on spot instances.
This currently runs the risk of retries for failure but future work will look
at utilizing the new fault-tolerant execution method to mitigate retries in
the event of failure.

 Leveraging Trino to Power Data at Goldman Sachs
(Read more)
Goldman Sachs uses Trino to power their data quality service, taking advantage
of the fact that Trino centralizes all visibility across their platform.

 Elevating data fabric to data mesh: Solving data needs in hybrid datalakes
(Read more)
Comcast takes us through their Trino architecture journey by providing the
history of their Data Fabric service, and now discusses the data governance
and culture changes required to realize a Data Mesh with Trino.

 Rewriting History: Migrating petabytes of data to Apache Iceberg using Trino
(Read more)
Shopify has recently migrates of its workloads to Trino. One of the first
hurdles was dealing with many issues in the Hive table format, so they quickly
upgraded to the Iceberg table format.
They initially encountered numerous issued, but experienced incredibly fast
turnaround of fixes from the Trino project that resolved their issues during
the migration.
There’s also a benchmark of how updating to a columnar format and Iceberg
table format drastically improves the results.

 Trino for Large Scale ETL at Lyft
(Read more)
Lyft is using Trino to perform ETL jobs scanning 10PB of data per day, and
writing 100TB per day. They are not using fault-tolerant execution.
In the last year, Lyft cut their number of Trino nodes in half, while
increasing the volume of their workloads due to recent improvements in Trino
and upgrades in Java versions.
Keeping up with the rapid release cycle of Trino was a challenge and Lyft
showcases their regression testing using their query replay framework.

 Federating them all on Starburst Galaxy
(Read more)
Running and scaling Trino is difficult. Starburst showcases Starburst Galaxy,
a SaaS data platform built around the Trino query engine.
This demoes running federated queries over Pokémon data scattered across
MongoDB and Iceberg tables.

 Trino at Quora: Speed, Cost, Reliability Challenges and Tips
(Read more)
Quora uses a large number of Trino clusters for ad-hoc, ETL, time series, A/B
testing, and backfill data.
Quora faced some initially high costs on Trino due to inefficient uses of
resources.
To address this they migrated to use Graviton instances, implemented
autoscaling, and optimized query efficiency.

 Journey to Iceberg with SK Telecom
(Read more)
The speakers travelled all the way from South Korea to join us in person.
SK Telecom had a multitude of performance issues that all stemmed from the
lack of flexibility in the Hive model and metastore.
They migrated to Iceberg to address performance issues and had added benefits
of Iceberg’s table format to improve developer workflow.
Housekeeping operations like optimize were already addressed by the Iceberg
community and quickly added to Trino.
This reduced query processing time by 80%.

 Using Trino with Apache Airflow for (almost) all your data problems
(Read more)
Airflow is a highly functional and well-adopted workflow management platform
to schedule jobs on your data platform.
The Trino integration for Airflow recently landed and this coincided with the
GA arrival of fault-tolerance execution mode in Trino.

 How we use Trino to analyze our Product-led Growth (PLG) user activation funnel
(Read more)
Upsolver solves a lot of common data problems on their platform.
One such problem is measuring activation rates in a product-led growthteam. This requires taking action on many sources of data.
Trino makes a natural fit to address the issues of joining this data together.

Federate ‘em all
After a whole day of throwing Trino balls out to the crowd, we got to see a
nice metaphor for federated data by throwing them all in the air and yelling,
“Federate ‘em all!”

Trino Contributor Congregation
The day after the summit, we invited a relatively small group of our
contributors to meet for the inaugural Trino Contributor Congregation (TCC).
This gathered many of our long-time and heavy Trino contributors. We had folks
from companies like Starburst, AWS, Apple, Bloomberg, Lyft, Comcast, LinkedIn,
Treasure Data, and others. Let’s dive into some of the topics we discussed.

We discussed feature proposals like:
The Trino loadbalancer which is an adaption of the popular gateway project from Lyft.
A Ranger plugin to be maintained by the Trino community rather than rely on the Ranger project.
A Snowflake connector that was traditionally held back by the lack of infrastructure.
We discussed the need for better shared testing datasets outside of the TPC-H
and TPC-DS that are more representative of real workloads that many are using.
We discussed the need for a clearer process for contributors to follow to
minimize the time to get features merged and avoid stale PRs. This is being
addressed by the backlog grooming performed by the developer relations team, and
assigning maintainers to own various PRs. While there is never a promise to
merge a PR, improving the turnaround and communication on PRs is crucial to keep
happy contributors and improve the health of the project.
While we were sad that not everyone could make the in-person TCC, we plan to
have virtual TCCs on a more frequent cadence and have the in-person TCCs
alongside larger in-person events. Getting these TCCs right is core to growing
the maintainership and continued success of the Trino project.
We hope all of you who could join us in-person and online enjoyed yourselves. We
all had such a blast! Stay tuned for updates on the next Trino Summit location!
