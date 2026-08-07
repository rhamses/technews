---
title: "Trino at Quora: Speed, cost, reliability challenges, and tips"
link: "https://trino.io/blog/2022/12/16/trino-summit-2022-quora-recap.html"
guid: "https://trino.io/blog/2022/12/16/trino-summit-2022-quora-recap.html"
pubDate: "2022-12-16T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "As we near the end of the Trino Summit 2022 recap series, it’s time to take a stop at Quora. At\nQuora, being an engineer responsible for maintaining Trino comes with its fair\nshare of challenges. With concerns about cost, performance, and reliability,\nQuora has taken several creative steps to ensure that they get the most out of\nTrino. Other Trino users may be able to learn a few neat tips and tricks to\ndo the same by tuning in.\n\n\n\n\n  Check out the slides!\n\nRecap\nTrino at Quora is used in the big ways that we’re all familiar with. It receives\nqueries from a variety of clients and services, then executes those queries\non an S3 data lake and Hive metastore to return results at high speeds. With a\nwide variety of clients, Quora gets the most out of Trino, using it for ad-hoc\nanalysis, but also for ETL, backfill jobs, A/B testing, and time series queries.\nBut as with any large system being used for so many things, this isn’t without a\nfew challenges.\nThe first challenge is a universal one - how can Quora keep the costs of running\nTrino to a minimum? One of the biggest strategies was to migrate to AWS Graviton\ninstances to run Trino clusters, as they have proven to be more cost-efficient\nthan other AMD and Intel-based EC2 instances at Quora. Graviton does have lower \navailability, though, so they sometimes must be complemented with some AMD/Intel\ninstances in order to avoid any downtime. Auto-scaling also led to great cost\nsavings, as the workloads varied based on time of day. By checking usage and\nanticipating it by ramping up the number of machines during the busy workday and\nramping it back down when fewer jobs are in progress, Quora was able to minimize\nidle machines and cut back on unnecessary spending. Finally, and perhaps most\nobviously, the team at Quora worked to make ETL queries more efficient. By using\npartitions effectively and creating a tool to detect inefficient queries\nscanning too many partition keys, the result is efficient queries that take less\ntime and use fewer resources, saving on cost.\nUp next - how could Quora maximize Trino’s performance? With data analysts\nexpecting quick runtimes and occasionally running into problems, fine-tuning\nTrino to run as well as it possibly can isn’t always an easy task. One\nparticular major issue they found at Quora was that some worker nodes which ran\nfor 24 hours or more straight would utilize less CPU and run slow, bogging\nthings down. The fix? Gracefully restart worker nodes that run for over a day,\nand implement a detector to flag and restart any nodes which showed signs of\nbehaving slowly.\nThe final big concern at Quora is reliability, as users expect Trino to be up\nand running whenever they need it. In one instance, they found that overwriting\na specific configuration option caused a cluster to crash repeatedly and\nslow down to a crawl. The issue was that they’d steadily been bumping the value\nof the query.min-expire-age configuration property up and up and up from the\ndefault value of 15 minutes, until eventually, unexpired query history was using\nup too much memory and causing the cluster to falter. Lowering the value back\ndown to something more advisable saved the day in that situation. But wanting to\navoid similar situations from happening again, Quora built extensive monitoring\ntools to track the health of their Trino clusters. They ensure that even when\nuser error does cause problems, those problems can be flagged and send out\nalerts, bringing the data engineering team to the rescue.\nShare this session\nIf you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/12/16/trino-summit-2022-quora-recap.html. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Yifan Pan, Cole Bowden"
contentHtml: "<p>As we near the end of the <a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">Trino Summit 2022 recap series</a>, it’s time to take a stop at Quora. At\nQuora, being an engineer responsible for maintaining Trino comes with its fair\nshare of challenges. With concerns about cost, performance, and reliability,\nQuora has taken several creative steps to ensure that they get the most out of\nTrino. Other Trino users may be able to learn a few neat tips and tricks to\ndo the same by tuning in.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-summit-2022/Trino@Quora.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>Trino at Quora is used in the big ways that we’re all familiar with. It receives\nqueries from a variety of clients and services, then executes those queries\non an S3 data lake and Hive metastore to return results at high speeds. With a\nwide variety of clients, Quora gets the most out of Trino, using it for ad-hoc\nanalysis, but also for ETL, backfill jobs, A/B testing, and time series queries.\nBut as with any large system being used for so many things, this isn’t without a\nfew challenges.</p>\n\n<p>The first challenge is a universal one - how can Quora keep the costs of running\nTrino to a minimum? One of the biggest strategies was to migrate to AWS Graviton\ninstances to run Trino clusters, as they have proven to be more cost-efficient\nthan other AMD and Intel-based EC2 instances at Quora. Graviton does have lower \navailability, though, so they sometimes must be complemented with some AMD/Intel\ninstances in order to avoid any downtime. Auto-scaling also led to great cost\nsavings, as the workloads varied based on time of day. By checking usage and\nanticipating it by ramping up the number of machines during the busy workday and\nramping it back down when fewer jobs are in progress, Quora was able to minimize\nidle machines and cut back on unnecessary spending. Finally, and perhaps most\nobviously, the team at Quora worked to make ETL queries more efficient. By using\npartitions effectively and creating a tool to detect inefficient queries\nscanning too many partition keys, the result is efficient queries that take less\ntime and use fewer resources, saving on cost.</p>\n\n<p>Up next - how could Quora maximize Trino’s performance? With data analysts\nexpecting quick runtimes and occasionally running into problems, fine-tuning\nTrino to run as well as it possibly can isn’t always an easy task. One\nparticular major issue they found at Quora was that some worker nodes which ran\nfor 24 hours or more straight would utilize less CPU and run slow, bogging\nthings down. The fix? Gracefully restart worker nodes that run for over a day,\nand implement a detector to flag and restart any nodes which showed signs of\nbehaving slowly.</p>\n\n<p>The final big concern at Quora is reliability, as users expect Trino to be up\nand running whenever they need it. In one instance, they found that overwriting\na specific configuration option caused a cluster to crash repeatedly and\nslow down to a crawl. The issue was that they’d steadily been bumping the value\nof the <code class=\"language-plaintext highlighter-rouge\">query.min-expire-age</code> configuration property up and up and up from the\ndefault value of 15 minutes, until eventually, unexpired query history was using\nup too much memory and causing the cluster to falter. Lowering the value back\ndown to something more advisable saved the day in that situation. But wanting to\navoid similar situations from happening again, Quora built extensive monitoring\ntools to track the health of their Trino clusters. They ensure that even when\nuser error does cause problems, those problems can be flagged and send out\nalerts, bringing the data engineering team to the rescue.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/12/16/trino-summit-2022-quora-recap.html\">https://trino.io/blog/2022/12/16/trino-summit-2022-quora-recap.html</a>. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/quora-social.jpg\" /></p>"
---

As we near the end of the Trino Summit 2022 recap series, it’s time to take a stop at Quora. At
Quora, being an engineer responsible for maintaining Trino comes with its fair
share of challenges. With concerns about cost, performance, and reliability,
Quora has taken several creative steps to ensure that they get the most out of
Trino. Other Trino users may be able to learn a few neat tips and tricks to
do the same by tuning in.




  Check out the slides!

Recap
Trino at Quora is used in the big ways that we’re all familiar with. It receives
queries from a variety of clients and services, then executes those queries
on an S3 data lake and Hive metastore to return results at high speeds. With a
wide variety of clients, Quora gets the most out of Trino, using it for ad-hoc
analysis, but also for ETL, backfill jobs, A/B testing, and time series queries.
But as with any large system being used for so many things, this isn’t without a
few challenges.
The first challenge is a universal one - how can Quora keep the costs of running
Trino to a minimum? One of the biggest strategies was to migrate to AWS Graviton
instances to run Trino clusters, as they have proven to be more cost-efficient
than other AMD and Intel-based EC2 instances at Quora. Graviton does have lower 
availability, though, so they sometimes must be complemented with some AMD/Intel
instances in order to avoid any downtime. Auto-scaling also led to great cost
savings, as the workloads varied based on time of day. By checking usage and
anticipating it by ramping up the number of machines during the busy workday and
ramping it back down when fewer jobs are in progress, Quora was able to minimize
idle machines and cut back on unnecessary spending. Finally, and perhaps most
obviously, the team at Quora worked to make ETL queries more efficient. By using
partitions effectively and creating a tool to detect inefficient queries
scanning too many partition keys, the result is efficient queries that take less
time and use fewer resources, saving on cost.
Up next - how could Quora maximize Trino’s performance? With data analysts
expecting quick runtimes and occasionally running into problems, fine-tuning
Trino to run as well as it possibly can isn’t always an easy task. One
particular major issue they found at Quora was that some worker nodes which ran
for 24 hours or more straight would utilize less CPU and run slow, bogging
things down. The fix? Gracefully restart worker nodes that run for over a day,
and implement a detector to flag and restart any nodes which showed signs of
behaving slowly.
The final big concern at Quora is reliability, as users expect Trino to be up
and running whenever they need it. In one instance, they found that overwriting
a specific configuration option caused a cluster to crash repeatedly and
slow down to a crawl. The issue was that they’d steadily been bumping the value
of the query.min-expire-age configuration property up and up and up from the
default value of 15 minutes, until eventually, unexpired query history was using
up too much memory and causing the cluster to falter. Lowering the value back
down to something more advisable saved the day in that situation. But wanting to
avoid similar situations from happening again, Quora built extensive monitoring
tools to track the health of their Trino clusters. They ensure that even when
user error does cause problems, those problems can be flagged and send out
alerts, bringing the data engineering team to the rescue.
Share this session
If you thought this talk was interesting, please consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/12/16/trino-summit-2022-quora-recap.html. If you think Trino is awesome,
give us a 🌟 on GitHub !
