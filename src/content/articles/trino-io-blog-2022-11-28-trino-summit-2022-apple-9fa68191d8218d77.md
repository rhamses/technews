---
title: "Trino at Apple"
link: "https://trino.io/blog/2022/11/28/trino-summit-2022-apple-recap.html"
guid: "https://trino.io/blog/2022/11/28/trino-summit-2022-apple-recap.html"
pubDate: "2022-11-28T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "This post continues a larger series of posts on the Trino Summit 2022 sessions.\nFollowing the Keynote: State of Trino session, engineers from Apple shared the\ncurrent usage of Trino at Apple. They discuss how they support Trino as a\nservice for multiple end-users, and the critical features that drew Apple to\nTrino. They wrap up with some challenges they have faced and some development\nthey have planned to contribute to Trino.\n\n\n\n\n  Check out the slides!\n\nRecap\nTrino is deployed at scale in Apple, and it continues to see tremendous\nadoption across multiple teams at Apple. Yathi Peddyshetty, Software Engineer @ Apple\nThe commonplace adhoc and BI analytics use cases make up a lot of how Apple uses\nTrino today. They also have increasing uses in federated querying and A/B \ntesting.\nTo deploy Trino as a service, Apple has an in-house Kubernetes operator to\nmanage the Trino cluster lifecycles. They also created an orchestrator to\nprovision and simplify cluster creation and management. They make this a\nself-service console that allows users to provision their own clusters per\nrequest. Their custom orchestrator also takes care of autoscaling and other\ntechnical complexities of maintaining a scalable Trino system.\nApple primarily uses Iceberg, Hive, and Cassandra connectors. They have a heavy\nfocus on Apache Iceberg as their table format and have contributed a significant\namount of PRs to improve interoperability between Trino and Spark, and increased\ncoverage of Iceberg APIs. Other challenges Apple face stem from the lack of\nflexible routing of queries to achieve zero downtime, and having pluggable\noptimizer rules and operators.\nApple has various features on their roadmap to eventually contribute to the\ncommunity. This includes, exposing remaining functionality in the Iceberg APIs,\nsupport all partition transforms, predicate pushdowns, bucketed joins, simple\naggregate pushdowns, Iceberg native views in Trino, and more.\nShare this session\nIf you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/11/28/trino-summit-2022-apple-recap.html. If you think Trino is awesome, \ngive us a 🌟 on GitHub !"
author: "Vinitha Gankidi, Yathi Peddyshetty, Brian Olsen"
contentHtml: "<p>This post continues <a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">a larger series of posts</a> on the Trino Summit 2022 sessions.\nFollowing the <a href=\"/blog/2022/11/22/trino-summit-2022-state-of-trino-keynote-recap.html\">Keynote: State of Trino session</a>, engineers from Apple shared the\ncurrent usage of Trino at Apple. They discuss how they support Trino as a\nservice for multiple end-users, and the critical features that drew Apple to\nTrino. They wrap up with some challenges they have faced and some development\nthey have planned to contribute to Trino.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-summit-2022/Trino@Apple.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<blockquote>\n  <p>Trino is deployed at scale in Apple, and it continues to see tremendous\nadoption across multiple teams at Apple. <em>Yathi Peddyshetty, Software Engineer @ Apple</em></p>\n</blockquote>\n\n<p>The commonplace adhoc and BI analytics use cases make up a lot of how Apple uses\nTrino today. They also have increasing uses in federated querying and A/B \ntesting.</p>\n\n<p>To deploy Trino as a service, Apple has an in-house Kubernetes operator to\nmanage the Trino cluster lifecycles. They also created an orchestrator to\nprovision and simplify cluster creation and management. They make this a\nself-service console that allows users to provision their own clusters per\nrequest. Their custom orchestrator also takes care of autoscaling and other\ntechnical complexities of maintaining a scalable Trino system.</p>\n\n<p>Apple primarily uses Iceberg, Hive, and Cassandra connectors. They have a heavy\nfocus on Apache Iceberg as their table format and have contributed a significant\namount of PRs to improve interoperability between Trino and Spark, and increased\ncoverage of Iceberg APIs. Other challenges Apple face stem from the lack of\nflexible routing of queries to achieve zero downtime, and having pluggable\noptimizer rules and operators.</p>\n\n<p>Apple has various features on their roadmap to eventually contribute to the\ncommunity. This includes, exposing remaining functionality in the Iceberg APIs,\nsupport all partition transforms, predicate pushdowns, bucketed joins, simple\naggregate pushdowns, Iceberg native views in Trino, and more.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/11/28/trino-summit-2022-apple-recap.html\">https://trino.io/blog/2022/11/28/trino-summit-2022-apple-recap.html</a>. If you think Trino is awesome, \n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/apple-social.png\" /></p>"
---

This post continues a larger series of posts on the Trino Summit 2022 sessions.
Following the Keynote: State of Trino session, engineers from Apple shared the
current usage of Trino at Apple. They discuss how they support Trino as a
service for multiple end-users, and the critical features that drew Apple to
Trino. They wrap up with some challenges they have faced and some development
they have planned to contribute to Trino.




  Check out the slides!

Recap
Trino is deployed at scale in Apple, and it continues to see tremendous
adoption across multiple teams at Apple. Yathi Peddyshetty, Software Engineer @ Apple
The commonplace adhoc and BI analytics use cases make up a lot of how Apple uses
Trino today. They also have increasing uses in federated querying and A/B 
testing.
To deploy Trino as a service, Apple has an in-house Kubernetes operator to
manage the Trino cluster lifecycles. They also created an orchestrator to
provision and simplify cluster creation and management. They make this a
self-service console that allows users to provision their own clusters per
request. Their custom orchestrator also takes care of autoscaling and other
technical complexities of maintaining a scalable Trino system.
Apple primarily uses Iceberg, Hive, and Cassandra connectors. They have a heavy
focus on Apache Iceberg as their table format and have contributed a significant
amount of PRs to improve interoperability between Trino and Spark, and increased
coverage of Iceberg APIs. Other challenges Apple face stem from the lack of
flexible routing of queries to achieve zero downtime, and having pluggable
optimizer rules and operators.
Apple has various features on their roadmap to eventually contribute to the
community. This includes, exposing remaining functionality in the Iceberg APIs,
support all partition transforms, predicate pushdowns, bucketed joins, simple
aggregate pushdowns, Iceberg native views in Trino, and more.
Share this session
If you thought this talk was interesting, please consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/11/28/trino-summit-2022-apple-recap.html. If you think Trino is awesome, 
give us a 🌟 on GitHub !
