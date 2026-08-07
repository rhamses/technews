---
title: "Using Trino to analyze a product-led growth (PLG) user activation funnel"
link: "https://trino.io/blog/2022/12/23/trino-summit-2022-upsolver-recap.html"
guid: "https://trino.io/blog/2022/12/23/trino-summit-2022-upsolver-recap.html"
pubDate: "2022-12-23T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "As the holiday season approaches, we have reached the end of our\nTrino Summit 2022 recap posts.\nWith the last talk of the summit, Mei Long from Upsolver gave an insightful\noverview of how they use data to inform product decisions.\n\n\n\n\n  Check out the slides!\n\nRecap\nWhen talking about product-led growth (PLG), it helps to start by defining what\nit even means. The core idea is simple: see how users engage with your product,\nand make decisions based on how you can improve the product to better serve\nthose users. At Upsolver, the goal of PLG is to maximize user value. The issue\nis that while this can be simple in some situations, when you’re delivering\ncomplicated analytics tools, it’s not always immediately clear what features\nwould be the most valuable or useful. You need a lot of data to glean a lot of\ninsight, and you need to make sure your insights that can lead to action. And of\ncourse, you need to be absolutely certain that your data is high-quality,\naccurate, and trustworthy, lest you end up accidentally giving a customer a\nten million dollar discount.\nMei explores the initial pass at using analytics to drive PLG at Upsolver,\nletting her intern use a tool called Amplitude that worked for a time and for\nlimited use cases. As Upsolver grew, the analytics requirements did, too, and\nAmplitude wasn’t powerful enough for Upsolver’s use case, nor for the more\ncomplicated queries and analysis that needed to be run.\nWant to guess what query engine they swapped to using? Trino. Mei dives into a\nquick demo that shows how Upsolver ingests all of its streaming data and stores\nit for Trino to query, driving down time-to-insight to make it quick and\nefficient to ask questions and make decisions based on those answers. With Trino\nat the ready, Upsolver has never been better-equipped to work towards PLG.\nShare this session\nIf you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/12/23/trino-summit-2022-upsolver-recap.html. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Mei Long, Cole Bowden"
contentHtml: "<p>As the holiday season approaches, we have reached the end of our\n<a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">Trino Summit 2022 recap posts</a>.\nWith the last talk of the summit, Mei Long from Upsolver gave an insightful\noverview of how they use data to inform product decisions.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-summit-2022/Trino@Upsolver.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>When talking about product-led growth (PLG), it helps to start by defining what\nit even means. The core idea is simple: see how users engage with your product,\nand make decisions based on how you can improve the product to better serve\nthose users. At Upsolver, the goal of PLG is to maximize user value. The issue\nis that while this can be simple in some situations, when you’re delivering\ncomplicated analytics tools, it’s not always immediately clear what features\nwould be the most valuable or useful. You need a lot of data to glean a lot of\ninsight, and you need to make sure your insights that can lead to action. And of\ncourse, you need to be absolutely certain that your data is high-quality,\naccurate, and trustworthy, lest you end up accidentally giving a customer a\nten million dollar discount.</p>\n\n<p>Mei explores the initial pass at using analytics to drive PLG at Upsolver,\nletting her intern use a tool called Amplitude that worked for a time and for\nlimited use cases. As Upsolver grew, the analytics requirements did, too, and\nAmplitude wasn’t powerful enough for Upsolver’s use case, nor for the more\ncomplicated queries and analysis that needed to be run.</p>\n\n<p>Want to guess what query engine they swapped to using? Trino. Mei dives into a\nquick demo that shows how Upsolver ingests all of its streaming data and stores\nit for Trino to query, driving down time-to-insight to make it quick and\nefficient to ask questions and make decisions based on those answers. With Trino\nat the ready, Upsolver has never been better-equipped to work towards PLG.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/12/23/trino-summit-2022-upsolver-recap.html\">https://trino.io/blog/2022/12/23/trino-summit-2022-upsolver-recap.html</a>. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/upsolver-social.png\" /></p>"
---

As the holiday season approaches, we have reached the end of our
Trino Summit 2022 recap posts.
With the last talk of the summit, Mei Long from Upsolver gave an insightful
overview of how they use data to inform product decisions.




  Check out the slides!

Recap
When talking about product-led growth (PLG), it helps to start by defining what
it even means. The core idea is simple: see how users engage with your product,
and make decisions based on how you can improve the product to better serve
those users. At Upsolver, the goal of PLG is to maximize user value. The issue
is that while this can be simple in some situations, when you’re delivering
complicated analytics tools, it’s not always immediately clear what features
would be the most valuable or useful. You need a lot of data to glean a lot of
insight, and you need to make sure your insights that can lead to action. And of
course, you need to be absolutely certain that your data is high-quality,
accurate, and trustworthy, lest you end up accidentally giving a customer a
ten million dollar discount.
Mei explores the initial pass at using analytics to drive PLG at Upsolver,
letting her intern use a tool called Amplitude that worked for a time and for
limited use cases. As Upsolver grew, the analytics requirements did, too, and
Amplitude wasn’t powerful enough for Upsolver’s use case, nor for the more
complicated queries and analysis that needed to be run.
Want to guess what query engine they swapped to using? Trino. Mei dives into a
quick demo that shows how Upsolver ingests all of its streaming data and stores
it for Trino to query, driving down time-to-insight to make it quick and
efficient to ask questions and make decisions based on those answers. With Trino
at the ready, Upsolver has never been better-equipped to work towards PLG.
Share this session
If you thought this talk was interesting, please consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/12/23/trino-summit-2022-upsolver-recap.html. If you think Trino is awesome,
give us a 🌟 on GitHub !
