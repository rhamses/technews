---
title: "Anomaly detection for Salesforce’s production data using Trino"
link: "https://trino.io/blog/2023/06/26/trino-fest-2023-salesforce.html"
guid: "https://trino.io/blog/2023/06/26/trino-fest-2023-salesforce.html"
pubDate: "2023-06-26T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Rolling into our next presentation from Trino Fest 2023, we’re excited to bring you\nTuli Navas and Geeta Shankar’s talk from the Performance Engineering Team at\nSalesforce. They provide numerous reasons for why they need Trino and\nfurther explain how it is essential for anomaly detection in\ntheir data. It’s an insightful talk about using a query engine to ensure data\nquality and how switching to Trino has massively improved their performance.\nYou definitely don’t want to miss it.\n\n\n\n\n  Check out the slides!\n\nRecap\nSalesforce provides customer relationship management software and applications\nfocused on sales, customer service, marketing automation, e-commerce, analytics,\nand application development. They host hundreds of thousands of customers that\ngenerate millions of transactions per day. For a company of this size, they\nneed a query engine that is fast and efficient. During the talk, Tuli made it\nclear how much Salesforce relies on Trino, stating, “Trino has been a one-stop\nshop for analytics.” Trino is the perfect solution for them, as Tuli mentions,\n“Because of how well Trino scales and how efficiently it has been able to\nprocess even the most gnarly looking queries.” It allows them to do everything\nthey need.\nIn addition, Trino has helped Salesforce get more value from their production\nlogging data by accelerating their access to it, speeding up their decision\nmaking. For years, they used Splunk for all their production data, but after\nswitching to Trino, they have had numerous improvements:\nReducing their team’s analytics cost\nImproving their cost-to-serve\nImproving the time it takes to run the same query by 194%\nProviding an SLA of 20-minute latency on all production logs\nRetaining and accessing data up to 2 years compared to Splunk’s 30 days\nReducing the number of queries needed, which creates a smaller footprint\nCreating tables and views for temporary data storage and analytics\nWith this, they use specific heuristics to create an anomaly detection framework\nwith a very quick response time that they are able to constantly observe. This\nalso allows them to monitor customer behavior efficiently, allowing them to\nrespond to any urgent changes quickly. In the future, they plan to expand and\nramp up their usage of Trino throughout their teams.\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Tuli Nivas, Geeta Shankar, Ryan Duan"
contentHtml: "<p>Rolling into our next presentation from <a href=\"/blog/2023/06/20/trino-fest-2023-recap.html\">Trino Fest 2023</a>, we’re excited to bring you\nTuli Navas and Geeta Shankar’s talk from the Performance Engineering Team at\nSalesforce. They provide numerous reasons for why they need Trino and\nfurther explain how it is essential for anomaly detection in\ntheir data. It’s an insightful talk about using a query engine to ensure data\nquality and how switching to Trino has massively improved their performance.\nYou definitely don’t want to miss it.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-fest-2023/TrinoFest2023Salesforce.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>Salesforce provides customer relationship management software and applications\nfocused on sales, customer service, marketing automation, e-commerce, analytics,\nand application development. They host hundreds of thousands of customers that\ngenerate millions of transactions per day. For a company of this size, they\nneed a query engine that is fast and efficient. During the talk, Tuli made it\nclear how much Salesforce relies on Trino, stating, “Trino has been a one-stop\nshop for analytics.” Trino is the perfect solution for them, as Tuli mentions,\n“Because of how well Trino scales and how efficiently it has been able to\nprocess even the most gnarly looking queries.” It allows them to do everything\nthey need.</p>\n\n<p>In addition, Trino has helped Salesforce get more value from their production\nlogging data by accelerating their access to it, speeding up their decision\nmaking. For years, they used Splunk for all their production data, but after\nswitching to Trino, they have had numerous improvements:</p>\n\n<ul>\n  <li>Reducing their team’s analytics cost</li>\n  <li>Improving their cost-to-serve</li>\n  <li>Improving the time it takes to run the same query by 194%</li>\n  <li>Providing an SLA of 20-minute latency on all production logs</li>\n  <li>Retaining and accessing data up to 2 years compared to Splunk’s 30 days</li>\n  <li>Reducing the number of queries needed, which creates a smaller footprint</li>\n  <li>Creating tables and views for temporary data storage and analytics</li>\n</ul>\n\n<p>With this, they use specific heuristics to create an anomaly detection framework\nwith a very quick response time that they are able to constantly observe. This\nalso allows them to monitor customer behavior efficiently, allowing them to\nrespond to any urgent changes quickly. In the future, they plan to expand and\nramp up their usage of Trino throughout their teams.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

Rolling into our next presentation from Trino Fest 2023, we’re excited to bring you
Tuli Navas and Geeta Shankar’s talk from the Performance Engineering Team at
Salesforce. They provide numerous reasons for why they need Trino and
further explain how it is essential for anomaly detection in
their data. It’s an insightful talk about using a query engine to ensure data
quality and how switching to Trino has massively improved their performance.
You definitely don’t want to miss it.




  Check out the slides!

Recap
Salesforce provides customer relationship management software and applications
focused on sales, customer service, marketing automation, e-commerce, analytics,
and application development. They host hundreds of thousands of customers that
generate millions of transactions per day. For a company of this size, they
need a query engine that is fast and efficient. During the talk, Tuli made it
clear how much Salesforce relies on Trino, stating, “Trino has been a one-stop
shop for analytics.” Trino is the perfect solution for them, as Tuli mentions,
“Because of how well Trino scales and how efficiently it has been able to
process even the most gnarly looking queries.” It allows them to do everything
they need.
In addition, Trino has helped Salesforce get more value from their production
logging data by accelerating their access to it, speeding up their decision
making. For years, they used Splunk for all their production data, but after
switching to Trino, they have had numerous improvements:
Reducing their team’s analytics cost
Improving their cost-to-serve
Improving the time it takes to run the same query by 194%
Providing an SLA of 20-minute latency on all production logs
Retaining and accessing data up to 2 years compared to Splunk’s 30 days
Reducing the number of queries needed, which creates a smaller footprint
Creating tables and views for temporary data storage and analytics
With this, they use specific heuristics to create an anomaly detection framework
with a very quick response time that they are able to constantly observe. This
also allows them to monitor customer behavior efficiently, allowing them to
respond to any urgent changes quickly. In the future, they plan to expand and
ramp up their usage of Trino throughout their teams.
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
