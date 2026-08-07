---
title: "Starburst Galaxy: A romance of many architectures"
link: "https://trino.io/blog/2023/07/25/trino-fest-2023-datto.html"
guid: "https://trino.io/blog/2023/07/25/trino-fest-2023-datto.html"
pubDate: "2023-07-25T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Let’s cut straight to the chase with this lightning talk from Benjamin Jeter, a\ndata architect, platform manager, and data engineer at Datto. For those that are\nnot familiar with Datto, they are an American cybersecurity and data backup\ncompany. They’re the leading global provider of security and cloud-based\nsoftware solutions purpose-built for Managed Service Providers (MSPs). In\nBenjamin’s talk, he goes through some of the considerations and design goals of\na reference architecture pattern that they use and why they chose to use Trino\nwith Starburst Galaxy.\n\n\n\n\n  Check out the slides!\n\nRecap\nBut you might be wondering: what does Ben mean when he says “reference\narchitecture”? A reference architecture pattern is a pattern for making\narbitrary data available to end users in a reproducible and modular way. It’s an\nopinionated representation of what best practices look like for a given class of\nuse cases. You can almost think of it as a conceptual tool for thinking\ncritically about specific patterns through a pragmatic balance of simplicity and\neffectiveness. However, it is not something that will work for every use case\nand not necessarily the best solution.\nThe main design goal that Benjamin had was to facilitate near real-time data\naccess while using only Trino. In addition, he wanted it to be simple, easy to\nunderstand, flexible, and adaptable. Accomplishing this design goal requires\nmany steps, such as first having a daily batch transform that transforms JSON\ninto Iceberg and serve as T-1\ndata. Then he created an\nunpartitioned external table that is rebuilt every day as part of the daily\nbatch transform. Using the Great Lakes\nconnectivity\nwith this table allows Datto to have scan on query semantics, which enables data\naccess about as real-time as you can get it without a streaming solutions like\nKafka or Kinesis. Benjamin shows how easy it is to design a use case with just a\ncouple lines of code using Trino with Starburst Galaxy.\nInterested? Check out the video where Benjamin shows the code and explains how\nit works!\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Benjamin Jeter, Ryan Duan"
contentHtml: "<p>Let’s cut straight to the chase with this lightning talk from Benjamin Jeter, a\ndata architect, platform manager, and data engineer at Datto. For those that are\nnot familiar with Datto, they are an American cybersecurity and data backup\ncompany. They’re the leading global provider of security and cloud-based\nsoftware solutions purpose-built for Managed Service Providers (MSPs). In\nBenjamin’s talk, he goes through some of the considerations and design goals of\na reference architecture pattern that they use and why they chose to use Trino\nwith Starburst Galaxy.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-fest-2023/TrinoFest2023Datto.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>But you might be wondering: what does Ben mean when he says “reference\narchitecture”? A reference architecture pattern is a pattern for making\narbitrary data available to end users in a reproducible and modular way. It’s an\nopinionated representation of what best practices look like for a given class of\nuse cases. You can almost think of it as a conceptual tool for thinking\ncritically about specific patterns through a pragmatic balance of simplicity and\neffectiveness. However, it is not something that will work for every use case\nand not necessarily the best solution.</p>\n\n<p>The main design goal that Benjamin had was to facilitate near real-time data\naccess while using only Trino. In addition, he wanted it to be simple, easy to\nunderstand, flexible, and adaptable. Accomplishing this design goal requires\nmany steps, such as first having a daily batch transform that transforms JSON\ninto Iceberg and serve as <a href=\"https://www.investopedia.com/terms/t/tplus1.asp\">T-1\ndata</a>. Then he created an\nunpartitioned external table that is rebuilt every day as part of the daily\nbatch transform. Using the <a href=\"https://docs.starburst.io/starburst-galaxy/sql/great-lakes.html\">Great Lakes\nconnectivity</a>\nwith this table allows Datto to have scan on query semantics, which enables data\naccess about as real-time as you can get it without a streaming solutions like\nKafka or Kinesis. Benjamin shows how easy it is to design a use case with just a\ncouple lines of code using Trino with Starburst Galaxy.</p>\n\n<p>Interested? Check out the video where Benjamin shows the code and explains how\nit works!</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

Let’s cut straight to the chase with this lightning talk from Benjamin Jeter, a
data architect, platform manager, and data engineer at Datto. For those that are
not familiar with Datto, they are an American cybersecurity and data backup
company. They’re the leading global provider of security and cloud-based
software solutions purpose-built for Managed Service Providers (MSPs). In
Benjamin’s talk, he goes through some of the considerations and design goals of
a reference architecture pattern that they use and why they chose to use Trino
with Starburst Galaxy.




  Check out the slides!

Recap
But you might be wondering: what does Ben mean when he says “reference
architecture”? A reference architecture pattern is a pattern for making
arbitrary data available to end users in a reproducible and modular way. It’s an
opinionated representation of what best practices look like for a given class of
use cases. You can almost think of it as a conceptual tool for thinking
critically about specific patterns through a pragmatic balance of simplicity and
effectiveness. However, it is not something that will work for every use case
and not necessarily the best solution.
The main design goal that Benjamin had was to facilitate near real-time data
access while using only Trino. In addition, he wanted it to be simple, easy to
understand, flexible, and adaptable. Accomplishing this design goal requires
many steps, such as first having a daily batch transform that transforms JSON
into Iceberg and serve as T-1
data. Then he created an
unpartitioned external table that is rebuilt every day as part of the daily
batch transform. Using the Great Lakes
connectivity
with this table allows Datto to have scan on query semantics, which enables data
access about as real-time as you can get it without a streaming solutions like
Kafka or Kinesis. Benjamin shows how easy it is to design a use case with just a
couple lines of code using Trino with Starburst Galaxy.
Interested? Check out the video where Benjamin shows the code and explains how
it works!
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
