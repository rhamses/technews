---
title: "Redis & Trino - Real-time indexed SQL queries (new connector)"
link: "https://trino.io/blog/2023/07/10/trino-fest-2023-redis.html"
guid: "https://trino.io/blog/2023/07/10/trino-fest-2023-redis.html"
pubDate: "2023-07-10T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Ever since the pandemic, it has become clear that the need for a digital first\neconomy is becoming more and more necessary. As Redis’ Field CTO Allen Terleto\nsaid during their talk from Trino Fest 2023, “In a digital first economy, data is the\nlifeblood of the organization, which makes the databases the heart of enterprise\narchitectures”. Redis, a popular open source project, is a distributed in-memory\nkey–value database. It includes a cache, message broker, and optional\ndurability. In his talk, Allen demonstrates Redis’ new connector for Trino. It\ncan push down advanced queries and aggregations while leveraging Redis’ unique\nin-memory secondary indexing. As a result, performance with the new connector is\nmuch higher.\n\n\n\nRecap\nRedis is an open source, in-memory, NoSQL database that natively supports a\nvariety of data structures. Redis is designed for utmost performance and high\nthroughput use cases across different types of workloads. Redis is widely known\nfor being the fastest data store in the market with sub millisecond performance,\nits ease of use, and being a multi-model database. Redis is able to map\nrelational tables to a key-value database by adding a key-value pair as a hash\nattribute for each column. However, how can you search for a certain key in a\nway that scales well in high throughput databases? Redis has a unique way to\ndeal with this problem: secondary indexing and Redis Search.\nRedis Search enables secondary indexing and full-text search, which allows Redis\nto support many features such as multi-field queries, aggregations, exact phrase\nmatching, numeric filtering, geo-filtering, and vector similarity semantic\nsearch on top of text queries. As Allen says, “Redis Search will be at the heart\nof our new integration with Trino and game-changing better performance at scale\nto the existing Redis Trino connector”. In addition, Redis supports a native\ndata model for JSON documents, allowing you to store, update, and retrieve JSON\nvalues in a Redis database like other Redis data types. It also works with Redis\nSearch to let you index and query JSON documents.\nThe syntax for Redis Search is a bit different from traditional SQL syntax, so\nRedis is introducing a quicker and more reliable Redis-Trino connector that lets\nyou easily integrate with visualizations frameworks and platforms that support\nTrino. The connector is open source and publicly available on their public\nGitHub. In addition, it will be contributed directly to the Trino project.\nWant to see Redis in action? Check out the video where Julien does a demo on how\nyou can load data from some file system, relational database, or data warehouse\nand query it without writing a single line of code.\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Allen Terleto, Julien Ruaux, Ryan Duan"
contentHtml: "<p>Ever since the pandemic, it has become clear that the need for a digital first\neconomy is becoming more and more necessary. As Redis’ Field CTO Allen Terleto\nsaid during their talk from <a href=\"/blog/2023/06/20/trino-fest-2023-recap.html\">Trino Fest 2023</a>, “In a digital first economy, data is the\nlifeblood of the organization, which makes the databases the heart of enterprise\narchitectures”. Redis, a popular open source project, is a distributed in-memory\nkey–value database. It includes a cache, message broker, and optional\ndurability. In his talk, Allen demonstrates Redis’ new connector for Trino. It\ncan push down advanced queries and aggregations while leveraging Redis’ unique\nin-memory secondary indexing. As a result, performance with the new connector is\nmuch higher.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>Redis is an open source, in-memory, NoSQL database that natively supports a\nvariety of data structures. Redis is designed for utmost performance and high\nthroughput use cases across different types of workloads. Redis is widely known\nfor being the fastest data store in the market with sub millisecond performance,\nits ease of use, and being a multi-model database. Redis is able to map\nrelational tables to a key-value database by adding a key-value pair as a hash\nattribute for each column. However, how can you search for a certain key in a\nway that scales well in high throughput databases? Redis has a unique way to\ndeal with this problem: secondary indexing and Redis Search.</p>\n\n<p>Redis Search enables secondary indexing and full-text search, which allows Redis\nto support many features such as multi-field queries, aggregations, exact phrase\nmatching, numeric filtering, geo-filtering, and vector similarity semantic\nsearch on top of text queries. As Allen says, “Redis Search will be at the heart\nof our new integration with Trino and game-changing better performance at scale\nto the existing Redis Trino connector”. In addition, Redis supports a native\ndata model for JSON documents, allowing you to store, update, and retrieve JSON\nvalues in a Redis database like other Redis data types. It also works with Redis\nSearch to let you index and query JSON documents.</p>\n\n<p>The syntax for Redis Search is a bit different from traditional SQL syntax, so\nRedis is introducing a quicker and more reliable Redis-Trino connector that lets\nyou easily integrate with visualizations frameworks and platforms that support\nTrino. The connector is open source and publicly available on their public\nGitHub. In addition, it will be contributed directly to the Trino project.</p>\n\n<p>Want to see Redis in action? Check out the video where Julien does a demo on how\nyou can load data from some file system, relational database, or data warehouse\nand query it without writing a single line of code.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

Ever since the pandemic, it has become clear that the need for a digital first
economy is becoming more and more necessary. As Redis’ Field CTO Allen Terleto
said during their talk from Trino Fest 2023, “In a digital first economy, data is the
lifeblood of the organization, which makes the databases the heart of enterprise
architectures”. Redis, a popular open source project, is a distributed in-memory
key–value database. It includes a cache, message broker, and optional
durability. In his talk, Allen demonstrates Redis’ new connector for Trino. It
can push down advanced queries and aggregations while leveraging Redis’ unique
in-memory secondary indexing. As a result, performance with the new connector is
much higher.



Recap
Redis is an open source, in-memory, NoSQL database that natively supports a
variety of data structures. Redis is designed for utmost performance and high
throughput use cases across different types of workloads. Redis is widely known
for being the fastest data store in the market with sub millisecond performance,
its ease of use, and being a multi-model database. Redis is able to map
relational tables to a key-value database by adding a key-value pair as a hash
attribute for each column. However, how can you search for a certain key in a
way that scales well in high throughput databases? Redis has a unique way to
deal with this problem: secondary indexing and Redis Search.
Redis Search enables secondary indexing and full-text search, which allows Redis
to support many features such as multi-field queries, aggregations, exact phrase
matching, numeric filtering, geo-filtering, and vector similarity semantic
search on top of text queries. As Allen says, “Redis Search will be at the heart
of our new integration with Trino and game-changing better performance at scale
to the existing Redis Trino connector”. In addition, Redis supports a native
data model for JSON documents, allowing you to store, update, and retrieve JSON
values in a Redis database like other Redis data types. It also works with Redis
Search to let you index and query JSON documents.
The syntax for Redis Search is a bit different from traditional SQL syntax, so
Redis is introducing a quicker and more reliable Redis-Trino connector that lets
you easily integrate with visualizations frameworks and platforms that support
Trino. The connector is open source and publicly available on their public
GitHub. In addition, it will be contributed directly to the Trino project.
Want to see Redis in action? Check out the video where Julien does a demo on how
you can load data from some file system, relational database, or data warehouse
and query it without writing a single line of code.
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
