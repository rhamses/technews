---
title: "Trino for large scale ETL at Lyft"
link: "https://trino.io/blog/2022/12/12/trino-summit-2022-lyft-recap.html"
guid: "https://trino.io/blog/2022/12/12/trino-summit-2022-lyft-recap.html"
pubDate: "2022-12-12T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Buckle up, for the next post in the Trino Summit 2022 recap series. In this post, we’re covering the talk\ngiven by Lyft engineers, Charles and Ritesh, on how they have not only scaled\nTrino as adoption grew, but with less nodes and more effective usage. They\nalso started moving to utilizing Trino more for ETL rather than just interactive\nanalytics. Get ready for a smooth ride as Lyft brings you large scale ETL with\nTrino.\n\n\n\n\n  Check out the slides!\n\nRecap\nLyft uses Trino to perform ETL jobs reading 10 petabytes of data per day and\nwriting 100 terabytes per day. They run 250,000 queries per day, with around\n2,000 unique users. This requires approximately 750 EC2 instances scaling up or\ndown with an autoscaler. Over 90 percent of queries complete within a one to\nthree minutes.\nIn the last year, Lyft cut their number of Trino nodes in half, while increasing\ntheir workloads. This is possible due to recent improvements in Trino and\nupgrades in Java versions. Lyft is not using fault-tolerant execution, but has\nstarted seeing interest in using Trino for ETL jobs due to the faster\nturnaround. Some issues Lyft has faced has been around how resource hungry Trino\nis, as well as, the issue where the coordinator can be a single point of failure\nfor queries executing on a cluster.\nLyft was one of the earliest companies to really push using Trino for ETL use\ncases. They built custom best effort rollback code in Apache Airflow. If a query\nfails, the operation reverts to the state before the operation began. Lyft runs\nfour Trino clusters split by the type of workload used on that cluster. The best\npractices are careful usage around broadcast joins, query sharding, and scaling\nwriters for ETL loads.\nOne final point Lyft pointed out is keeping up with the rapid release cycle of\nTrino was a challenge. Lyft showcases their regression testing using their query\nreplay framework. This session is a smooth five out of five ride. Enjoy!\nShare this session\nIf you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/12/12/trino-summit-2022-lyft-recap.html. If you think Trino is awesome, \ngive us a 🌟 on GitHub !"
author: "Charles Song, Ritesh Varyani, Brian Olsen"
contentHtml: "<p>Buckle up, for the next <a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">post in the Trino Summit 2022 recap series</a>. In this post, we’re covering the talk\ngiven by Lyft engineers, Charles and Ritesh, on how they have not only scaled\nTrino as adoption grew, but with less nodes and more effective usage. They\nalso started moving to utilizing Trino more for ETL rather than just interactive\nanalytics. Get ready for a smooth ride as Lyft brings you large scale ETL with\nTrino.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-summit-2022/Trino@Lyft.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>Lyft uses Trino to perform ETL jobs reading 10 petabytes of data per day and\nwriting 100 terabytes per day. They run 250,000 queries per day, with around\n2,000 unique users. This requires approximately 750 EC2 instances scaling up or\ndown with an autoscaler. Over 90 percent of queries complete within a one to\nthree minutes.</p>\n\n<p>In the last year, Lyft cut their number of Trino nodes in half, while increasing\ntheir workloads. This is possible due to recent improvements in Trino and\nupgrades in Java versions. Lyft is not using fault-tolerant execution, but has\nstarted seeing interest in using Trino for ETL jobs due to the faster\nturnaround. Some issues Lyft has faced has been around how resource hungry Trino\nis, as well as, the issue where the coordinator can be a single point of failure\nfor queries executing on a cluster.</p>\n\n<p>Lyft was one of the earliest companies to really push using Trino for ETL use\ncases. They built custom best effort rollback code in Apache Airflow. If a query\nfails, the operation reverts to the state before the operation began. Lyft runs\nfour Trino clusters split by the type of workload used on that cluster. The best\npractices are careful usage around broadcast joins, query sharding, and scaling\nwriters for ETL loads.</p>\n\n<p>One final point Lyft pointed out is keeping up with the rapid release cycle of\nTrino was a challenge. Lyft showcases their regression testing using their query\nreplay framework. This session is a smooth five out of five ride. Enjoy!</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/12/12/trino-summit-2022-lyft-recap.html\">https://trino.io/blog/2022/12/12/trino-summit-2022-lyft-recap.html</a>. If you think Trino is awesome, \n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/lyft-social.png\" /></p>"
---

Buckle up, for the next post in the Trino Summit 2022 recap series. In this post, we’re covering the talk
given by Lyft engineers, Charles and Ritesh, on how they have not only scaled
Trino as adoption grew, but with less nodes and more effective usage. They
also started moving to utilizing Trino more for ETL rather than just interactive
analytics. Get ready for a smooth ride as Lyft brings you large scale ETL with
Trino.




  Check out the slides!

Recap
Lyft uses Trino to perform ETL jobs reading 10 petabytes of data per day and
writing 100 terabytes per day. They run 250,000 queries per day, with around
2,000 unique users. This requires approximately 750 EC2 instances scaling up or
down with an autoscaler. Over 90 percent of queries complete within a one to
three minutes.
In the last year, Lyft cut their number of Trino nodes in half, while increasing
their workloads. This is possible due to recent improvements in Trino and
upgrades in Java versions. Lyft is not using fault-tolerant execution, but has
started seeing interest in using Trino for ETL jobs due to the faster
turnaround. Some issues Lyft has faced has been around how resource hungry Trino
is, as well as, the issue where the coordinator can be a single point of failure
for queries executing on a cluster.
Lyft was one of the earliest companies to really push using Trino for ETL use
cases. They built custom best effort rollback code in Apache Airflow. If a query
fails, the operation reverts to the state before the operation began. Lyft runs
four Trino clusters split by the type of workload used on that cluster. The best
practices are careful usage around broadcast joins, query sharding, and scaling
writers for ETL loads.
One final point Lyft pointed out is keeping up with the rapid release cycle of
Trino was a challenge. Lyft showcases their regression testing using their query
replay framework. This session is a smooth five out of five ride. Enjoy!
Share this session
If you thought this talk was interesting, please consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/12/12/trino-summit-2022-lyft-recap.html. If you think Trino is awesome, 
give us a 🌟 on GitHub !
