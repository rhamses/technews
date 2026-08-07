---
title: "Log4Shell does not affect Trino"
link: "https://trino.io/blog/2021/12/13/log4shell-does-not-affect-trino.html"
guid: "https://trino.io/blog/2021/12/13/log4shell-does-not-affect-trino.html"
pubDate: "2021-12-13T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "In the last few days we had a surge of folks in our community reaching out with\nconcerns over the Log4Shell exploit\n(CVE-2021-44228),\nand we want to inform you that Trino is not affected. Trino does not use log4j\nin the core engine or runtime classes. There are some connectors that include \nthe log4j dependency from client dependencies, but are either not used or are \nnot versions affected by the Log4Shell vulnerability. Regular security reviews, \nincluding code and dependency analysis, are part of the regular development \nprocess. As we learn more we will update the code to keep vulnerabilities out of\nthe code.\nTrino connectors with the Log4j dependency\nIf you do a search in the Trino repository, you’ll notice two direct \ndependencies of the log4j dependency shows up in two of the connectors, Accumulo\nand Elasticsearch.\nAccumulo\nThe Accumulo connector depends on log4j 1.2.17, which although isn’t vulnerable\nto Log4Shell, has other vulnerabilities. These vulnerabilities do not apply to \nhow we’ve used the loggers in the connector code. To be clear, despite the small\nuse of this logger in the Accumulo connector, there is still no threat even if \nyou are using it. We are working on removing\nthe uses of this log4j library to avoid any confusion in an upcoming release.\nElasticsearch\nThe Elasticsearch connector did have an affected dependency \nthat was recently removed.\nLog4j was not being used in the connector. So despite the existence of the \ndependency in the Elasticsearch connector, there is no direct use of the \nvulnerable library.\nAvoiding future introduction of Log4Shell\nWe take security seriously on the Trino project, as it provides a single point \nof access to your data sources. We’re taking precautionary measures to protect \nagainst the vulnerability from creeping its way into future versions. In version\n366, we’re removing that dependency and adding a dedicated rule\nto the build process to ban log4j as a direct dependency.\nWhat should you do?\nRest assured that there is no vulnerability in your Trino cluster.\nIf you’ve created your own plugin with one of the affected log4j libraries, \nyou should upgrade as quickly as possible to 2.15.0 or higher.\nIn the coming weeks, upgrade to the 366 release at your convenience.\nWe know there can be a lot of concern when vulnerabilities come up. We wish you\nall the best of luck while you work hard to mitigate the risk of exploits in \nyour systems. If you have any questions, reach out on the Trino Slack."
author: "Brian Olsen"
contentHtml: "<div>\n<article>\n  <div><p>In the last few days we had a surge of folks in our community reaching out with\nconcerns over the <a target=\"_blank\" href=\"https://www.lunasec.io/docs/blog/log4j-zero-day/\">Log4Shell exploit</a>\n(<a target=\"_blank\" href=\"https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228\">CVE-2021-44228</a>),\nand we want to inform you that <strong>Trino is not affected</strong>. Trino does not use log4j\nin the core engine or runtime classes. There are some connectors that include \nthe log4j dependency from client dependencies, but are either not used or are \nnot versions affected by the Log4Shell vulnerability. Regular security reviews, \nincluding code and dependency analysis, are part of the regular development \nprocess. As we learn more we will update the code to keep vulnerabilities out of\nthe code.</p>\n<p>\n <img src=\"https://trino.io/assets/blog/log4shell/log4shell.jpeg\">\n</p>\n<!--more-->\n<h2 id=\"trino-connectors-with-the-log4j-dependency\">\n    Trino connectors with the Log4j dependency <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/13/log4shell-does-not-affect-trino.html#trino-connectors-with-the-log4j-dependency\">#</a>\n</h2>\n<p>If you do a search in the Trino repository, you’ll notice two direct \ndependencies of the log4j dependency shows up in two of the connectors, Accumulo\nand Elasticsearch.</p>\n<h3 id=\"accumulo\">\n    Accumulo <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/13/log4shell-does-not-affect-trino.html#accumulo\">#</a>\n</h3>\n<p>The Accumulo connector depends on log4j 1.2.17, which although isn’t vulnerable\nto Log4Shell, has other vulnerabilities. These vulnerabilities do not apply to \nhow we’ve used the loggers in the connector code. To be clear, despite the small\nuse of this logger in the Accumulo connector, there is still no threat even if \nyou are using it. We are <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/8781\">working on removing</a>\nthe uses of this log4j library to avoid any confusion in an upcoming release.</p>\n<h3 id=\"elasticsearch\">\n    Elasticsearch <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/13/log4shell-does-not-affect-trino.html#elasticsearch\">#</a>\n</h3>\n<p>The Elasticsearch connector did have an affected dependency \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/commit/2018a94253d48cfdce283538855ee65950f9be3d\">that was recently removed</a>.\nLog4j was not being used in the connector. So despite the existence of the \ndependency in the Elasticsearch connector, there is no direct use of the \nvulnerable library.</p>\n<h2 id=\"avoiding-future-introduction-of-log4shell\">\n    Avoiding future introduction of Log4Shell <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/13/log4shell-does-not-affect-trino.html#avoiding-future-introduction-of-log4shell\">#</a>\n</h2>\n<p>We take security seriously on the Trino project, as it provides a single point \nof access to your data sources. We’re taking precautionary measures to protect \nagainst the vulnerability from creeping its way into future versions. In version\n366, we’re removing that dependency and <a target=\"_blank\" href=\"https://github.com/trinodb/trino/commit/10ba96c63ed3875d9dcca335e49bc73f5c0a6a8c\">adding a dedicated rule</a>\nto the build process to ban log4j as a direct dependency.</p>\n<h2 id=\"what-should-you-do\">\n    What should you do? <a target=\"_blank\" href=\"https://trino.io/blog/2021/12/13/log4shell-does-not-affect-trino.html#what-should-you-do\">#</a>\n</h2>\n<ol>\n  <li>\n    <p>Rest assured that there is no vulnerability in your Trino cluster.</p>\n  </li>\n  <li>\n    <p>If you’ve created your own plugin with one of the affected log4j libraries, \nyou should upgrade as quickly as possible to 2.15.0 or higher.</p>\n  </li>\n  <li>\n    <p>In the coming weeks, upgrade to the 366 release at your convenience.</p>\n  </li>\n</ol>\n<p>We know there can be a lot of concern when vulnerabilities come up. We wish you\nall the best of luck while you work hard to mitigate the risk of exploits in \nyour systems. If you have any questions, reach out on the <a target=\"_blank\" href=\"https://trino.io/slack\">Trino Slack</a>.</p>\n  </div>\n</article>\n</div>"
---

In the last few days we had a surge of folks in our community reaching out with
concerns over the Log4Shell exploit
(CVE-2021-44228),
and we want to inform you that Trino is not affected. Trino does not use log4j
in the core engine or runtime classes. There are some connectors that include 
the log4j dependency from client dependencies, but are either not used or are 
not versions affected by the Log4Shell vulnerability. Regular security reviews, 
including code and dependency analysis, are part of the regular development 
process. As we learn more we will update the code to keep vulnerabilities out of
the code.
Trino connectors with the Log4j dependency
If you do a search in the Trino repository, you’ll notice two direct 
dependencies of the log4j dependency shows up in two of the connectors, Accumulo
and Elasticsearch.
Accumulo
The Accumulo connector depends on log4j 1.2.17, which although isn’t vulnerable
to Log4Shell, has other vulnerabilities. These vulnerabilities do not apply to 
how we’ve used the loggers in the connector code. To be clear, despite the small
use of this logger in the Accumulo connector, there is still no threat even if 
you are using it. We are working on removing
the uses of this log4j library to avoid any confusion in an upcoming release.
Elasticsearch
The Elasticsearch connector did have an affected dependency 
that was recently removed.
Log4j was not being used in the connector. So despite the existence of the 
dependency in the Elasticsearch connector, there is no direct use of the 
vulnerable library.
Avoiding future introduction of Log4Shell
We take security seriously on the Trino project, as it provides a single point 
of access to your data sources. We’re taking precautionary measures to protect 
against the vulnerability from creeping its way into future versions. In version
366, we’re removing that dependency and adding a dedicated rule
to the build process to ban log4j as a direct dependency.
What should you do?
Rest assured that there is no vulnerability in your Trino cluster.
If you’ve created your own plugin with one of the affected log4j libraries, 
you should upgrade as quickly as possible to 2.15.0 or higher.
In the coming weeks, upgrade to the 366 release at your convenience.
We know there can be a lot of concern when vulnerabilities come up. We wish you
all the best of luck while you work hard to mitigate the risk of exploits in 
your systems. If you have any questions, reach out on the Trino Slack.
