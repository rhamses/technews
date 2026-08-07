---
title: "Trino Gateway has arrived"
link: "https://trino.io/blog/2023/09/28/trino-gateway.html"
guid: "https://trino.io/blog/2023/09/28/trino-gateway.html"
pubDate: "2023-09-28T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "You started with one Trino cluster, and your users like the power for SQL and\nquerying all sorts of data sources.\nThen you needed to upgrade and got a cluster for testing going. That was a while\nago, and now you run a separate cluster configured for ETL workloads with\nfault-tolerant execution, and some others with different configurations.\nWith Trino Gateway we now have an answer to your users request to provide one URL\nfor all the clusters. Trino Gateway has arrived!\nToday, we are happy to announce our first release of Trino\nGateway.\nThe release is the result of many, many months of effort to move the legacy\nPresto Gateway to Trino, start a refactor of the project, and add numerous new\nfeatures.\nMany larger deployments across the Trino community rely on the gateway as a load\nbalancer, proxy server, and configurable routing gateway for multiple Trino\nclusters. Users don’t need to worry about what catalog and data source is\navailable in what Trino cluster. Trino Gateway exposes one URL for them all.\nAdministrators can ensure routing is correct and use the REST API to configure\nthe necessary rules. This also allows seamless upgrades of clusters behind Trino\nGateway in a blue/green deployment mode.\nUp to now, many users had to maintain separate forks of the legacy Presto\nGateway. Some of these users created numerous improvements in isolation of each\nother, sometimes even implementing the same feature multiple times. This first\nrelease of Trino Gateway starts a strong collaboration of some of these users.\nBloomberg contributed the main bulk of the new features, including the\nmuch-requested support for authentication and authorization on Trino Gateway\nitself. Maintainers and contributors from Starburst pulled together the\nstakeholders and managed the project, and collaborators from Naver, LinkedIn,\nDune, and others are already helping out and ready to move the project forward.\nThere are exciting times ahead for the project, and we have big plans for\ndocumentation, installation, and general modernizations of the app, so go and\nhave a look at the project, read the documentation and release notes, file an\nissue, or submit a pull request:\n\n\nInterested to find out more? Find us and others users and contributors on the\ntrino-gateway\nand\ntrino-gateway-dev\nchannels in the Trino community Slack.\nAlso, don’t forget to tell us about your usage of Trino Gateway or Trino and\nsubmit a talk for Trino Summit\n2023. And if you just want to learn\nand listen to others, register as\nattendee.\nManfred, Martin, and all the other Trino Gateway contributors"
author: "Manfred Moser, Martin Traverso"
contentHtml: "<p>You started with one Trino cluster, and your users like the power for SQL and\n<a href=\"/ecosystem/index.html#data-sources\">querying all sorts of data sources</a>.\nThen you needed to upgrade and got a cluster for testing going. That was a while\nago, and now you run a separate cluster configured for ETL workloads with\nfault-tolerant execution, and some others with different configurations.</p>\n\n<p>With Trino Gateway we now have an answer to your users request to provide one URL\nfor all the clusters. Trino Gateway has arrived!</p>\n\n<!--more-->\n\n<p>Today, we are happy to announce our <a href=\"https://github.com/trinodb/trino-gateway/blob/main/docs/release-notes.md#trino-gateway-3-26-sep-2023\">first release of Trino\nGateway</a>.\nThe release is the result of many, many months of effort to move the legacy\nPresto Gateway to Trino, start a refactor of the project, and add numerous new\nfeatures.</p>\n\n<p>Many larger deployments across the Trino community rely on the gateway as a load\nbalancer, proxy server, and configurable routing gateway for multiple Trino\nclusters. Users don’t need to worry about what catalog and data source is\navailable in what Trino cluster. Trino Gateway exposes one URL for them all.\nAdministrators can ensure routing is correct and use the REST API to configure\nthe necessary rules. This also allows seamless upgrades of clusters behind Trino\nGateway in a blue/green deployment mode.</p>\n\n<p>Up to now, many users had to maintain separate forks of the legacy Presto\nGateway. Some of these users created numerous improvements in isolation of each\nother, sometimes even implementing the same feature multiple times. This first\nrelease of Trino Gateway starts a strong collaboration of some of these users.\nBloomberg contributed the main bulk of the new features, including the\nmuch-requested support for authentication and authorization on Trino Gateway\nitself. Maintainers and contributors from Starburst pulled together the\nstakeholders and managed the project, and collaborators from Naver, LinkedIn,\nDune, and others are already helping out and ready to move the project forward.</p>\n\n<p>There are exciting times ahead for the project, and we have big plans for\ndocumentation, installation, and general modernizations of the app, so go and\nhave a look at the project, read the documentation and release notes, file an\nissue, or submit a pull request:</p>\n\n<div class=\"card-deck spacer-30\">\n    <a class=\"btn btn-pink\" href=\"https://github.com/trinodb/trino-gateway\">\n        Trino Gateway\n    </a>\n</div>\n<div class=\"spacer-30\"></div>\n\n<p>Interested to find out more? Find us and others users and contributors on the\n<a href=\"https://trinodb.slack.com/app_redirect?channel=trino-gateway\"><code class=\"language-plaintext highlighter-rouge\">trino-gateway</code></a>\nand\n<a href=\"https://trinodb.slack.com/app_redirect?channel=trino-gateway-dev\"><code class=\"language-plaintext highlighter-rouge\">trino-gateway-dev</code></a>\nchannels in <a href=\"/slack.html\">the Trino community Slack</a>.</p>\n\n<p>Also, don’t forget to tell us about your usage of Trino Gateway or Trino and\n<a href=\"https://sessionize.com/trino-summit-2023/\">submit a talk for Trino Summit\n2023</a>. And if you just want to learn\nand listen to others, <a href=\"https://www.starburst.io/info/trinosummit2023/?utm_source=trino&amp;utm_medium=website&amp;utm_campaign=NORAM-FY24-Q4-EV-Trino-Summit-2023&amp;utm_content=blog-1\">register as\nattendee</a>.</p>\n\n<p><em>Manfred, Martin, and all the other Trino Gateway contributors</em></p>"
---

You started with one Trino cluster, and your users like the power for SQL and
querying all sorts of data sources.
Then you needed to upgrade and got a cluster for testing going. That was a while
ago, and now you run a separate cluster configured for ETL workloads with
fault-tolerant execution, and some others with different configurations.
With Trino Gateway we now have an answer to your users request to provide one URL
for all the clusters. Trino Gateway has arrived!
Today, we are happy to announce our first release of Trino
Gateway.
The release is the result of many, many months of effort to move the legacy
Presto Gateway to Trino, start a refactor of the project, and add numerous new
features.
Many larger deployments across the Trino community rely on the gateway as a load
balancer, proxy server, and configurable routing gateway for multiple Trino
clusters. Users don’t need to worry about what catalog and data source is
available in what Trino cluster. Trino Gateway exposes one URL for them all.
Administrators can ensure routing is correct and use the REST API to configure
the necessary rules. This also allows seamless upgrades of clusters behind Trino
Gateway in a blue/green deployment mode.
Up to now, many users had to maintain separate forks of the legacy Presto
Gateway. Some of these users created numerous improvements in isolation of each
other, sometimes even implementing the same feature multiple times. This first
release of Trino Gateway starts a strong collaboration of some of these users.
Bloomberg contributed the main bulk of the new features, including the
much-requested support for authentication and authorization on Trino Gateway
itself. Maintainers and contributors from Starburst pulled together the
stakeholders and managed the project, and collaborators from Naver, LinkedIn,
Dune, and others are already helping out and ready to move the project forward.
There are exciting times ahead for the project, and we have big plans for
documentation, installation, and general modernizations of the app, so go and
have a look at the project, read the documentation and release notes, file an
issue, or submit a pull request:


Interested to find out more? Find us and others users and contributors on the
trino-gateway
and
trino-gateway-dev
channels in the Trino community Slack.
Also, don’t forget to tell us about your usage of Trino Gateway or Trino and
submit a talk for Trino Summit
2023. And if you just want to learn
and listen to others, register as
attendee.
Manfred, Martin, and all the other Trino Gateway contributors
