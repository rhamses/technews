---
title: "Inspecting Trino on ice"
link: "https://trino.io/blog/2023/07/19/trino-fest-2023-stripe.html"
guid: "https://trino.io/blog/2023/07/19/trino-fest-2023-stripe.html"
pubDate: "2023-07-19T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "For those unfamiliar, Stripe is an online payment processor that facilitates\nonline payments for digital-native merchants. They use Trino to facilitate ad\nhoc analytics, enable dashboarding, and provide an API for internal services and\ndata apps to utilize Trino. In Kevin Liu’s session at Trino Fest 2023, he showcases the Trino Iceberg\nconnector and how it can replace more complex usage to access Iceberg metadata.\nHe also discusses how Trino is a core part of operations at Stripe.\n\n\n\n\n  Check out the slides!\n\nRecap\nTrino is the foundational infrastructure on which other data apps and services\nare built upon. In Kevin’s words, “I call Trino the Swiss army knife in the data\necosystem.”\nAt Stripe, they use Iceberg tables extensively, replacing legacy Hive tables.\nBut Iceberg isn’t perfect: one problem with Iceberg is reading its metadata from\nS3. To work with Iceberg metadata, Stripe developed an internal CLI tool. The\ntool requires a privileged internal machine, which is only accessible to\ndevelopers. And outputs the result in JSON format, which is difficult to\nprocess, read, and use for further analysis. However, Kevin found that the Trino\nIceberg connector can replace most of the functionality of the Iceberg CLI. The\nconnector brings Iceberg metadata information to Trino’s powerful analytical\nengine and facilitates lightning fast debugging and analysis.\nUnfortunately, there was no way to grab all desired table property information\nfrom the Trino Iceberg connector, because they were using an older version.\nThus, they use the Trino PostgreSQL connector to connect directly to the backend\ndatabase of the Hive Metastore, allowing them to inspect table metadata\ndirectly. With the two connectors, they have all the information about the data\nwarehouse, powering their analysis and meta-analysis of the data and how it’s\nused.\nThey also use Trino to inspect Iceberg usage patterns. They log every Trino\nquery using the Trino event listener and store that in another PostgreSQL\ndatabase. This gives the full information of every query that has ever run\nthrough Trino, and allows them to perform analysis using historical queries.\nCombined with Trino’s built-in query metadata enrichment, this method enables a\nmultitude of auditing, debugging, and optimization use cases.\nIn the future, they plan to use Trino to improve data quality by leveraging it\nas a validation framework, to perform Iceberg table maintenance, and to optimize\ntables based on historical read patterns.\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Kevin Liu, Ryan Duan"
contentHtml: "<p>For those unfamiliar, Stripe is an online payment processor that facilitates\nonline payments for digital-native merchants. They use Trino to facilitate ad\nhoc analytics, enable dashboarding, and provide an API for internal services and\ndata apps to utilize Trino. In Kevin Liu’s session at <a href=\"/blog/2023/06/20/trino-fest-2023-recap.html\">Trino Fest 2023</a>, he showcases the Trino Iceberg\nconnector and how it can replace more complex usage to access Iceberg metadata.\nHe also discusses how Trino is a core part of operations at Stripe.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-fest-2023/TrinoFest2023Stripe.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>Trino is the foundational infrastructure on which other data apps and services\nare built upon. In Kevin’s words, “I call Trino the Swiss army knife in the data\necosystem.”</p>\n\n<p>At Stripe, they use Iceberg tables extensively, replacing legacy Hive tables.\nBut Iceberg isn’t perfect: one problem with Iceberg is reading its metadata from\nS3. To work with Iceberg metadata, Stripe developed an internal CLI tool. The\ntool requires a privileged internal machine, which is only accessible to\ndevelopers. And outputs the result in JSON format, which is difficult to\nprocess, read, and use for further analysis. However, Kevin found that the Trino\nIceberg connector can replace most of the functionality of the Iceberg CLI. The\nconnector brings Iceberg metadata information to Trino’s powerful analytical\nengine and facilitates lightning fast debugging and analysis.</p>\n\n<p>Unfortunately, there was no way to grab all desired table property information\nfrom the Trino Iceberg connector, because they were using an older version.\nThus, they use the Trino PostgreSQL connector to connect directly to the backend\ndatabase of the Hive Metastore, allowing them to inspect table metadata\ndirectly. With the two connectors, they have all the information about the data\nwarehouse, powering their analysis and meta-analysis of the data and how it’s\nused.</p>\n\n<p>They also use Trino to inspect Iceberg usage patterns. They log every Trino\nquery using the Trino event listener and store that in another PostgreSQL\ndatabase. This gives the full information of every query that has ever run\nthrough Trino, and allows them to perform analysis using historical queries.\nCombined with Trino’s built-in query metadata enrichment, this method enables a\nmultitude of auditing, debugging, and optimization use cases.</p>\n\n<p>In the future, they plan to use Trino to improve data quality by leveraging it\nas a validation framework, to perform Iceberg table maintenance, and to optimize\ntables based on historical read patterns.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

For those unfamiliar, Stripe is an online payment processor that facilitates
online payments for digital-native merchants. They use Trino to facilitate ad
hoc analytics, enable dashboarding, and provide an API for internal services and
data apps to utilize Trino. In Kevin Liu’s session at Trino Fest 2023, he showcases the Trino Iceberg
connector and how it can replace more complex usage to access Iceberg metadata.
He also discusses how Trino is a core part of operations at Stripe.




  Check out the slides!

Recap
Trino is the foundational infrastructure on which other data apps and services
are built upon. In Kevin’s words, “I call Trino the Swiss army knife in the data
ecosystem.”
At Stripe, they use Iceberg tables extensively, replacing legacy Hive tables.
But Iceberg isn’t perfect: one problem with Iceberg is reading its metadata from
S3. To work with Iceberg metadata, Stripe developed an internal CLI tool. The
tool requires a privileged internal machine, which is only accessible to
developers. And outputs the result in JSON format, which is difficult to
process, read, and use for further analysis. However, Kevin found that the Trino
Iceberg connector can replace most of the functionality of the Iceberg CLI. The
connector brings Iceberg metadata information to Trino’s powerful analytical
engine and facilitates lightning fast debugging and analysis.
Unfortunately, there was no way to grab all desired table property information
from the Trino Iceberg connector, because they were using an older version.
Thus, they use the Trino PostgreSQL connector to connect directly to the backend
database of the Hive Metastore, allowing them to inspect table metadata
directly. With the two connectors, they have all the information about the data
warehouse, powering their analysis and meta-analysis of the data and how it’s
used.
They also use Trino to inspect Iceberg usage patterns. They log every Trino
query using the Trino event listener and store that in another PostgreSQL
database. This gives the full information of every query that has ever run
through Trino, and allows them to perform analysis using historical queries.
Combined with Trino’s built-in query metadata enrichment, this method enables a
multitude of auditing, debugging, and optimization use cases.
In the future, they plan to use Trino to improve data quality by leveraging it
as a validation framework, to perform Iceberg table maintenance, and to optimize
tables based on historical read patterns.
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
