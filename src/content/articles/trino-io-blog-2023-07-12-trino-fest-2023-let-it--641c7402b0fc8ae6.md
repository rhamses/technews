---
title: "Let it snow for Trino"
link: "https://trino.io/blog/2023/07/12/trino-fest-2023-let-it-snow-recap.html"
guid: "https://trino.io/blog/2023/07/12/trino-fest-2023-let-it-snow-recap.html"
pubDate: "2023-07-12T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "In this recap, we can skip right to the exciting part: through the joint efforts\nof engineers at ForePaaS and Bloomberg, there is a Snowflake connector coming\nto Trino! Though it hasn’t landed yet, it has been tested and run in production\nat both companies, and a pull request is open and working its way towards\ncompletion as this blog post goes up. In the talk, Yu and Erik talk about\ndifficulties in developing the connector, the motivations to make it happen, and\nthe new features that come as part of it for Trino users to take advantage of.\nSound interesting? Give the talk a listen, or read on for more details.\n\n\n\n\n  Check out the slides!\n\nFor those unfamiliar, Snowflake is a cloud-based data warehousing and analytics\nplatform. It offers a great combination of scale, flexibility, and performance,\nwith the downside of being a proprietary software that is vendor-locked, and in\norder to use Snowflake, you must go through Snowflake, Inc. ForePaaS and its\ncustomers store data in Snowflake, but they also store data in many other \nformats and systems, and they rely on Trino to run their analytics. With no\nSnowflake connector in Trino, this meant that while they could run analytics and\nqueries on most data, Trino had a blind spot. They needed to develop a Snowflake\nconnector in order to see and query 100% of their data. Bloomberg was in a\nsimilar boat, having data in Snowflake, using Trino for analytics, and needing a\nway to join those two together. With a shared need, ForePaaS and Bloomberg\njoined forced and made the connector happen.\nThe connector has been in use at both companies for some time, and it comes with\nthe full feature set one would expect from a Trino connector. With the connector,\nyou can query Snowflake directly from Trino, taking advantage of Trino’s\nlightning-fast speeds and the underlying features of Snowflake with no issue.\nCurious to see more? For the rest of the talk, Erik Anderson at Bloomberg gives\na demo of the connector in action. Give the talk a watch, and you can check out\nprogress on how adding the connector to Trino is coming along on\nthe pull request contributing it.\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Yu Teng, Erik Anderson, Cole Bowden"
contentHtml: "<p>In this recap, we can skip right to the exciting part: through the joint efforts\nof engineers at ForePaaS and Bloomberg, there is a Snowflake connector coming\nto Trino! Though it hasn’t landed yet, it has been tested and run in production\nat both companies, and a pull request is open and working its way towards\ncompletion as this blog post goes up. In the talk, Yu and Erik talk about\ndifficulties in developing the connector, the motivations to make it happen, and\nthe new features that come as part of it for Trino users to take advantage of.\nSound interesting? Give the talk a listen, or read on for more details.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-fest-2023/TrinoFest2023LetItSnow.pdf\">\n  Check out the slides!\n</a></p>\n\n<p>For those unfamiliar, Snowflake is a cloud-based data warehousing and analytics\nplatform. It offers a great combination of scale, flexibility, and performance,\nwith the downside of being a proprietary software that is vendor-locked, and in\norder to use Snowflake, you must go through Snowflake, Inc. ForePaaS and its\ncustomers store data in Snowflake, but they also store data in many other \nformats and systems, and they rely on Trino to run their analytics. With no\nSnowflake connector in Trino, this meant that while they could run analytics and\nqueries on most data, Trino had a blind spot. They needed to develop a Snowflake\nconnector in order to see and query 100% of their data. Bloomberg was in a\nsimilar boat, having data in Snowflake, using Trino for analytics, and needing a\nway to join those two together. With a shared need, ForePaaS and Bloomberg\njoined forced and made the connector happen.</p>\n\n<p>The connector has been in use at both companies for some time, and it comes with\nthe full feature set one would expect from a Trino connector. With the connector,\nyou can query Snowflake directly from Trino, taking advantage of Trino’s\nlightning-fast speeds and the underlying features of Snowflake with no issue.</p>\n\n<p>Curious to see more? For the rest of the talk, Erik Anderson at Bloomberg gives\na demo of the connector in action. Give the talk a watch, and you can check out\nprogress on how adding the connector to Trino is coming along on\n<a href=\"https://github.com/trinodb/trino/pull/17909\">the pull request contributing it</a>.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

In this recap, we can skip right to the exciting part: through the joint efforts
of engineers at ForePaaS and Bloomberg, there is a Snowflake connector coming
to Trino! Though it hasn’t landed yet, it has been tested and run in production
at both companies, and a pull request is open and working its way towards
completion as this blog post goes up. In the talk, Yu and Erik talk about
difficulties in developing the connector, the motivations to make it happen, and
the new features that come as part of it for Trino users to take advantage of.
Sound interesting? Give the talk a listen, or read on for more details.




  Check out the slides!

For those unfamiliar, Snowflake is a cloud-based data warehousing and analytics
platform. It offers a great combination of scale, flexibility, and performance,
with the downside of being a proprietary software that is vendor-locked, and in
order to use Snowflake, you must go through Snowflake, Inc. ForePaaS and its
customers store data in Snowflake, but they also store data in many other 
formats and systems, and they rely on Trino to run their analytics. With no
Snowflake connector in Trino, this meant that while they could run analytics and
queries on most data, Trino had a blind spot. They needed to develop a Snowflake
connector in order to see and query 100% of their data. Bloomberg was in a
similar boat, having data in Snowflake, using Trino for analytics, and needing a
way to join those two together. With a shared need, ForePaaS and Bloomberg
joined forced and made the connector happen.
The connector has been in use at both companies for some time, and it comes with
the full feature set one would expect from a Trino connector. With the connector,
you can query Snowflake directly from Trino, taking advantage of Trino’s
lightning-fast speeds and the underlying features of Snowflake with no issue.
Curious to see more? For the rest of the talk, Erik Anderson at Bloomberg gives
a demo of the connector in action. Give the talk a watch, and you can check out
progress on how adding the connector to Trino is coming along on
the pull request contributing it.
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
