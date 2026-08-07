---
title: "Optimizing Trino using spot instances with Zillow"
link: "https://trino.io/blog/2022/12/01/trino-summit-2022-zillow-recap.html"
guid: "https://trino.io/blog/2022/12/01/trino-summit-2022-zillow-recap.html"
pubDate: "2022-12-01T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "In this installment of the Trino Summit 2022 sessions posts, we jump into an exciting topic by folks\nfrom Zillow about running Trino on spot instances.\nSpot instances are cheap and ephemeral nodes that lead to reduced overall\ncompute costs. Spot instances are cheaper as they are not guaranteed to remain\navailable.\nIn this session, Zillow engineers talk about how they use Trino on spots to take\nadvantage of the cost savings while handling the transitory nature of spots.\n\n\n\n\n  Check out the slides!\n\nRecap\nZillow’s BI platform team is tasked with enabling access to data and metrics\nfrom their data lake in a self-serving and performant manner. The platform must\nhandle generating up-to-date reports and metrics to unlock time-critical\nopportunities. They also need to enable adhoc analytics across multiple domains\nwithin Zillow.\nThere are close to 600 data pipelines and 65,000 queries running daily. The\naverage read covers 600 terabytes of data, and the average P95 time is around\n20 seconds. They have six Trino clusters that service various workflows based on\nload. These are all deployed on Amazon EKS with a range of eight to 60 workers\nbased on CPU utilization.\nWhen deploying Trino on EKS, Zillow uses worker groups, which enables them to\ncollocate nodes in AWS local zones. It also made it possible to choose spot \ninstances, which are 90% cheaper than regular on-demand instances. A critical\naspect they needed to cover was to correctly tune the percentage of nodes that\nwere spot instances. They created pools of nodes that were entirely on-demand\nfor coordinators since a coordinator going down, brings down the entire cluster.\nOther pools used for workers are tuned to an optimal blend of spot and\non-demand.\nWatch this session to learn how to properly optimize the number of spot\ninstances running for your Trino clusters, without losing reliability of your\nservice. Also learn some ways that Zillow is planning on using the\nfault-tolerant execution mode.\nShare this session\nIf you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/12/01/trino-summit-2022-zillow-recap.html. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Santhosh Venkatraman, Rupesh Kumar Perugu, Brian Olsen"
contentHtml: "<p>In this installment of <a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">the Trino Summit 2022 sessions posts</a>, we jump into an exciting topic by folks\nfrom <a href=\"https://www.zillow.com\">Zillow</a> about running Trino on spot instances.\nSpot instances are cheap and ephemeral nodes that lead to reduced overall\ncompute costs. Spot instances are cheaper as they are not guaranteed to remain\navailable.</p>\n\n<p>In this session, Zillow engineers talk about how they use Trino on spots to take\nadvantage of the cost savings while handling the transitory nature of spots.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-summit-2022/Trino@Zillow.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>Zillow’s BI platform team is tasked with enabling access to data and metrics\nfrom their data lake in a self-serving and performant manner. The platform must\nhandle generating up-to-date reports and metrics to unlock time-critical\nopportunities. They also need to enable adhoc analytics across multiple domains\nwithin Zillow.</p>\n\n<p>There are close to 600 data pipelines and 65,000 queries running daily. The\naverage read covers 600 terabytes of data, and the average P95 time is around\n20 seconds. They have six Trino clusters that service various workflows based on\nload. These are all deployed on Amazon EKS with a range of eight to 60 workers\nbased on CPU utilization.</p>\n\n<p>When deploying Trino on EKS, Zillow uses worker groups, which enables them to\ncollocate nodes in AWS local zones. It also made it possible to choose spot \ninstances, which are 90% cheaper than regular on-demand instances. A critical\naspect they needed to cover was to correctly tune the percentage of nodes that\nwere spot instances. They created pools of nodes that were entirely on-demand\nfor coordinators since a coordinator going down, brings down the entire cluster.\nOther pools used for workers are tuned to an optimal blend of spot and\non-demand.</p>\n\n<p>Watch this session to learn how to properly optimize the number of spot\ninstances running for your Trino clusters, without losing reliability of your\nservice. Also learn some ways that Zillow is planning on using the\nfault-tolerant execution mode.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/12/01/trino-summit-2022-zillow-recap.html\">https://trino.io/blog/2022/12/01/trino-summit-2022-zillow-recap.html</a>. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/zillow-social.png\" /></p>"
---

In this installment of the Trino Summit 2022 sessions posts, we jump into an exciting topic by folks
from Zillow about running Trino on spot instances.
Spot instances are cheap and ephemeral nodes that lead to reduced overall
compute costs. Spot instances are cheaper as they are not guaranteed to remain
available.
In this session, Zillow engineers talk about how they use Trino on spots to take
advantage of the cost savings while handling the transitory nature of spots.




  Check out the slides!

Recap
Zillow’s BI platform team is tasked with enabling access to data and metrics
from their data lake in a self-serving and performant manner. The platform must
handle generating up-to-date reports and metrics to unlock time-critical
opportunities. They also need to enable adhoc analytics across multiple domains
within Zillow.
There are close to 600 data pipelines and 65,000 queries running daily. The
average read covers 600 terabytes of data, and the average P95 time is around
20 seconds. They have six Trino clusters that service various workflows based on
load. These are all deployed on Amazon EKS with a range of eight to 60 workers
based on CPU utilization.
When deploying Trino on EKS, Zillow uses worker groups, which enables them to
collocate nodes in AWS local zones. It also made it possible to choose spot 
instances, which are 90% cheaper than regular on-demand instances. A critical
aspect they needed to cover was to correctly tune the percentage of nodes that
were spot instances. They created pools of nodes that were entirely on-demand
for coordinators since a coordinator going down, brings down the entire cluster.
Other pools used for workers are tuned to an optimal blend of spot and
on-demand.
Watch this session to learn how to properly optimize the number of spot
instances running for your Trino clusters, without losing reliability of your
service. Also learn some ways that Zillow is planning on using the
fault-tolerant execution mode.
Share this session
If you thought this talk was interesting, please consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/12/01/trino-summit-2022-zillow-recap.html. If you think Trino is awesome,
give us a 🌟 on GitHub !
