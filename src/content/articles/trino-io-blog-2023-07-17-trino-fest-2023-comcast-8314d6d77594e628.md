---
title: "Data mesh implementation using Hive views"
link: "https://trino.io/blog/2023/07/17/trino-fest-2023-comcast-recap.html"
guid: "https://trino.io/blog/2023/07/17/trino-fest-2023-comcast-recap.html"
pubDate: "2023-07-17T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "At Comcast, data is used in a data mesh ecosystem, with a vision where users can\ndiscover data and request data through a self-service platform. With federation,\nvarious tools, and the ability to create, read, and write data with different\nplatforms, it’s a full-blown data mesh. So how do you build that? With Trino, of\ncourse, and with the power of Hive views. Tune into the 10-minute lightning talk\nthat Alejandro gave at Trino Fest to learn more about how Comcast pulled it off.\n\n\n\nRecap\nWith various different storage systems, like S3 and MinIO, and users that\nwant to be able to use a variety of data platforms, including Trino, but also\nDatabricks and Spark, Comcast needed something to sit between the data and those\nplatforms. The solution was the Hive CLI and Hive views, which could read from \nall their various forms of storage, and which could be read from all the\nuser-facing query engines and data platforms with no issues.\nBy centralizing data, there was also the upside of easily integrating with\nPrivacera, which allowed for privacy policies to be implemented without much\nissue. Users could request access to the data within the Hive views, and data\nowners could approve or reject access as appropriate. Because of the\ncentralization, it was easy to go very fine-grained with data access rules,\nallowing for access control as specific as column-level.\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Alejandro Rojas, Cole Bowden"
contentHtml: "<p>At Comcast, data is used in a data mesh ecosystem, with a vision where users can\ndiscover data and request data through a self-service platform. With federation,\nvarious tools, and the ability to create, read, and write data with different\nplatforms, it’s a full-blown data mesh. So how do you build that? With Trino, of\ncourse, and with the power of Hive views. Tune into the 10-minute lightning talk\nthat Alejandro gave at Trino Fest to learn more about how Comcast pulled it off.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>With various different storage systems, like S3 and MinIO, and users that\nwant to be able to use a variety of data platforms, including Trino, but also\nDatabricks and Spark, Comcast needed something to sit between the data and those\nplatforms. The solution was the Hive CLI and Hive views, which could read from \nall their various forms of storage, and which could be read from all the\nuser-facing query engines and data platforms with no issues.</p>\n\n<p>By centralizing data, there was also the upside of easily integrating with\nPrivacera, which allowed for privacy policies to be implemented without much\nissue. Users could request access to the data within the Hive views, and data\nowners could approve or reject access as appropriate. Because of the\ncentralization, it was easy to go very fine-grained with data access rules,\nallowing for access control as specific as column-level.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

At Comcast, data is used in a data mesh ecosystem, with a vision where users can
discover data and request data through a self-service platform. With federation,
various tools, and the ability to create, read, and write data with different
platforms, it’s a full-blown data mesh. So how do you build that? With Trino, of
course, and with the power of Hive views. Tune into the 10-minute lightning talk
that Alejandro gave at Trino Fest to learn more about how Comcast pulled it off.



Recap
With various different storage systems, like S3 and MinIO, and users that
want to be able to use a variety of data platforms, including Trino, but also
Databricks and Spark, Comcast needed something to sit between the data and those
platforms. The solution was the Hive CLI and Hive views, which could read from 
all their various forms of storage, and which could be read from all the
user-facing query engines and data platforms with no issues.
By centralizing data, there was also the upside of easily integrating with
Privacera, which allowed for privacy policies to be implemented without much
issue. Users could request access to the data within the Hive views, and data
owners could approve or reject access as appropriate. Because of the
centralization, it was easy to go very fine-grained with data access rules,
allowing for access control as specific as column-level.
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
