---
title: "Enterprise-ready Trino at Bloomberg: One Giant Leap Toward Data Mesh!"
link: "https://trino.io/blog/2022/11/30/trino-summit-2022-bloomberg-recap.html"
guid: "https://trino.io/blog/2022/11/30/trino-summit-2022-bloomberg-recap.html"
pubDate: "2022-11-30T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "This post continues a larger series of posts on the Trino Summit 2022 sessions.\nFollowing the Trino at Apple talk, engineers from Bloomberg shared\nthe latest about their additions to Trino. Bloomberg uses Trino to federate huge\namounts of disparate financial data together. When you have many users with\ndifferent use cases and resource needs, you need something to ensure that the\nhuge workloads don’t bully the small ones. Enter the Trino Load Balancer, a\nprivacy-aware solution to help maintain high availability while still treating\ndata security as the first-class citizen that it should be.\n\n\n\n\n  Check out the slides!\n\nRecap\nBloomberg collects data, creates experimental data, and ingests data from\nvendors. Its data analysts then refine, clean, and structure that data using\nwhatever their preferred method is, generating even more diverse data. Internal\nteams and clients then want to look at and query that generated data, too. Sound\nlike a data mesh? That’s because it is. Trino isn’t new at Bloomberg, and it’s\nbeen in use to help federate all of those varying data sets into one unified\naccess point.\nWhen trying to deploy multiple Trino clusters for such a wide array of users who\ndemand high uptime, high throughput, and fast response times, the Trino\ncoordinator becomes a single point of failure. There’s the risk of\ninfrastructure outages, the need to shut things down for occasional upgrades,\nand some users run high-throughput jobs for millions of rows while others are\nexpecting low-latency jobs for only hundreds. Keeping Trino up, running, and\nmeeting all users’ expectations is no small task.\nAnd that’s where the Trino Load Balancer comes in! As a fork of the open-source\npresto-gateway, it helps to do exactly what it says on the tin for Trino:\nbalance workloads. By being aware of what’s running on each cluster and how many\nresources are being used, it can direct traffic to the ideal clusters to meet\neach user’s needs. And with a brief demo, we get a look at how data owners\ncan set policies that are respected within the load balancer, ensuring that\nusers can only access and query what they’re supposed to.\nShare this session\nIf you thought this talk was interesting, consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/11/30/trino-summit-2022-bloomberg-recap.html. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Vishal Jadhav, Pablo Arteaga, Cole Bowden"
contentHtml: "<p>This post continues <a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">a larger series of posts</a> on the Trino Summit 2022 sessions.\nFollowing the <a href=\"/blog/2022/11/28/trino-summit-2022-apple-recap.html\">Trino at Apple talk</a>, engineers from Bloomberg shared\nthe latest about their additions to Trino. Bloomberg uses Trino to federate huge\namounts of disparate financial data together. When you have many users with\ndifferent use cases and resource needs, you need something to ensure that the\nhuge workloads don’t bully the small ones. Enter the Trino Load Balancer, a\nprivacy-aware solution to help maintain high availability while still treating\ndata security as the first-class citizen that it should be.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-summit-2022/Trino-at-Bloomberg.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>Bloomberg collects data, creates experimental data, and ingests data from\nvendors. Its data analysts then refine, clean, and structure that data using\nwhatever their preferred method is, generating even more diverse data. Internal\nteams and clients then want to look at and query that generated data, too. Sound\nlike a data mesh? That’s because it is. Trino isn’t new at Bloomberg, and it’s\nbeen in use to help federate all of those varying data sets into one unified\naccess point.</p>\n\n<p>When trying to deploy multiple Trino clusters for such a wide array of users who\ndemand high uptime, high throughput, and fast response times, the Trino\ncoordinator becomes a single point of failure. There’s the risk of\ninfrastructure outages, the need to shut things down for occasional upgrades,\nand some users run high-throughput jobs for millions of rows while others are\nexpecting low-latency jobs for only hundreds. Keeping Trino up, running, and\nmeeting all users’ expectations is no small task.</p>\n\n<p>And that’s where the Trino Load Balancer comes in! As a fork of the open-source\npresto-gateway, it helps to do exactly what it says on the tin for Trino:\nbalance workloads. By being aware of what’s running on each cluster and how many\nresources are being used, it can direct traffic to the ideal clusters to meet\neach user’s needs. And with a brief demo, we get a look at how data owners\ncan set policies that are respected within the load balancer, ensuring that\nusers can only access and query what they’re supposed to.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/11/30/trino-summit-2022-bloomberg-recap.html\">https://trino.io/blog/2022/11/30/trino-summit-2022-bloomberg-recap.html</a>. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/bloomberg-social.png\" /></p>"
---

This post continues a larger series of posts on the Trino Summit 2022 sessions.
Following the Trino at Apple talk, engineers from Bloomberg shared
the latest about their additions to Trino. Bloomberg uses Trino to federate huge
amounts of disparate financial data together. When you have many users with
different use cases and resource needs, you need something to ensure that the
huge workloads don’t bully the small ones. Enter the Trino Load Balancer, a
privacy-aware solution to help maintain high availability while still treating
data security as the first-class citizen that it should be.




  Check out the slides!

Recap
Bloomberg collects data, creates experimental data, and ingests data from
vendors. Its data analysts then refine, clean, and structure that data using
whatever their preferred method is, generating even more diverse data. Internal
teams and clients then want to look at and query that generated data, too. Sound
like a data mesh? That’s because it is. Trino isn’t new at Bloomberg, and it’s
been in use to help federate all of those varying data sets into one unified
access point.
When trying to deploy multiple Trino clusters for such a wide array of users who
demand high uptime, high throughput, and fast response times, the Trino
coordinator becomes a single point of failure. There’s the risk of
infrastructure outages, the need to shut things down for occasional upgrades,
and some users run high-throughput jobs for millions of rows while others are
expecting low-latency jobs for only hundreds. Keeping Trino up, running, and
meeting all users’ expectations is no small task.
And that’s where the Trino Load Balancer comes in! As a fork of the open-source
presto-gateway, it helps to do exactly what it says on the tin for Trino:
balance workloads. By being aware of what’s running on each cluster and how many
resources are being used, it can direct traffic to the ideal clusters to meet
each user’s needs. And with a brief demo, we get a look at how data owners
can set policies that are respected within the load balancer, ensuring that
users can only access and query what they’re supposed to.
Share this session
If you thought this talk was interesting, consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/11/30/trino-summit-2022-bloomberg-recap.html. If you think Trino is awesome,
give us a 🌟 on GitHub !
