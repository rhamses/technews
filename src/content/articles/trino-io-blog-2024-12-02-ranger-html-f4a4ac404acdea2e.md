---
title: "The long journey to Apache Ranger"
link: "https://trino.io/blog/2024/12/02/ranger.html"
guid: "https://trino.io/blog/2024/12/02/ranger.html"
pubDate: "2024-12-02T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Apache Ranger has\narrived! With the new Trino\n466 you all get another\njam-packed release of Trino awesomeness. One of the goodies is a new plugin for\naccess control for your data with Apache Ranger, and it has gone through a long\nstory to get here.\nApache Ranger has a long history and wide adoption as an access control system\nfor data lakes using Hadoop and Hive. Since Trino brings fast analytics to this\nspace, and also supports modern data lakehouses and other data sources, Apache\nRanger is a natural fit for access control on a Trino-powered data platform.\nThe beginnings\nApache Ranger has been in use with Trino for a long time - in fact there are\nearly,\nrudimentary pull requests from\n2019 that implemented some support. And even before then, various hacks existed.\nIn 2020, a plugin for PrestoSQL was added to Apache Ranger. Aakash Nand blogged\nabout Integrating Trino and Apache\nRanger\nin 2021 to adjust for the changes to Trino. Jeff Xu followed up with\nIntegrating Trino and Apache Ranger in a Kerberos-secured enterprise\nenvironment\nin 2022, followed quickly by the addition of the Trino support to the Apache\nRanger repository.\nTesting and container images\nHowever that was only half of the needed support. The Trino project moves very\nfast with nearly weekly releases, so the best approach is to have the supporting\nplugin in Trino directly so every release includes the relevant updates. Erik\nAnderson created a more mature plugin that was in\nproduction use for quite a while for Trino. His pull request from July\n2022 included great background\nreasoning for having the plugin in Trino. One of the issues that Erik solved for\nthe Trino project is testing. Trino plugins require the availability of a\ncontainer image for testing whatever integration. Apache Ranger did still not\nship a container in 2022, but thanks to the lobbying efforts of Erik this\nchanged and a container image became available over the months.\nA long sprint\nUnfortunately, focus changed and while the PR from Erik existed and was useful,\nit never made it to merge due to waning priorities. That changed when Madhan\nNeethiraj from the Apache Ranger project stepped\nup and created new PR in July 2024.\nWe knew this could be another shot at it, and it would require a lot of work to\nget it done, since we put a high focus on quality so that we can maintain the\nTrino codebase for the long run. Monitoring all PRs regularly I (Manfred\nMoser) noticed it and jumped in with first help.\nErik and other interested users chimed in.\nlozbrown and Manfred helped with documentation\nand getting other developers interested. The heavy technical reviews and lots of\nguidance came from Krzysztof Sobolewski and\nGrzegorz Kokosiński.\nDuring the whole process, Madhan had to react to comments, update the code, and\nalso regularly rebase his PR to adjust for the constantly changing Trino\ncodebase in the master branch. Starburst recognized Madhan’s effort and\nfeatured him as Starburst Trino\nChampion. Interestingly,\nthe container image ended up not being used for testing, however it will be\ncrucially important for many users deploying Apache Ranger on Kubernetes anyway.\nNearly 400 comments and over four months later we all got to celebrate. The\nTrino maintainer Grzegorz took on the responsibility and merged the PR. Yuya\nEbihara and Martin\nTraverso followed up with\nminor\ncleanups, and we finally shipped\nthe plugin as part of Trino\n466.\nA huge congratulations and thank you goes out to everyone involved.\nNow it is your turn to have a look at the\ndocumentation,\nlearn more about Trino and Apache Ranger, and maybe even proceed to help us\nimprove the integration.\nNext steps\nBeyond our celebration, more tasks are waiting for all of us:\nTest it out in your usage and migrate from any old or custom versions.\nHelp us improve the\ndocumentation\nsignificantly to allow easier adoption.\nWork with lozbrown on adding support to the Helm chart.\nCheck out the codebase and help us fix bugs and add features.\nAnd last, but not least - join us all to celebrate Trino at the upcoming Trino\nSummit 2024 for two days of amazing sessions and interaction with your peers\nfrom the Trino community\nand the Trino Contributor Call for\nmore open community chat and discussion."
author: "Manfred Moser"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/images/logos/apache-ranger.png\">\n    </p>\n    <p><a target=\"_blank\" href=\"https://trino.io/ecosystem/add-on#apache-ranger\">Apache Ranger</a> has\narrived! With the new <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-466.html\">Trino\n466</a> you all get another\njam-packed release of Trino awesomeness. One of the goodies is a new plugin for\naccess control for your data with Apache Ranger, and it has gone through a long\nstory to get here.</p>\n<p>Apache Ranger has a long history and wide adoption as an access control system\nfor data lakes using Hadoop and Hive. Since Trino brings fast analytics to this\nspace, and also supports modern data lakehouses and other data sources, Apache\nRanger is a natural fit for access control on a Trino-powered data platform.</p>\n<!--more-->\n<h2 id=\"the-beginnings\">\n    The beginnings <a target=\"_blank\" href=\"https://trino.io/blog/2024/12/02/ranger.html#the-beginnings\">#</a>\n</h2>\n<p>Apache Ranger has been in use with Trino for a long time - in fact there are\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/244\">early</a>,\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/1069\">rudimentary</a> pull requests from\n2019 that implemented some support. And even before then, various hacks existed.\nIn 2020, a plugin for PrestoSQL was added to Apache Ranger. Aakash Nand blogged\nabout <a target=\"_blank\" href=\"https://towardsdatascience.com/integrating-trino-and-apache-ranger-b808f6b96ad8\">Integrating Trino and Apache\nRanger</a>\nin 2021 to adjust for the changes to Trino. Jeff Xu followed up with\n<a target=\"_blank\" href=\"https://medium.com/@jeff.xu.z/integrating-trino-and-apache-ranger-in-a-kerberos-secured-enterprise-environment-997c95cd10e9\">Integrating Trino and Apache Ranger in a Kerberos-secured enterprise\nenvironment</a>\nin 2022, followed quickly by the addition of the Trino support to the Apache\nRanger repository.</p>\n<h2 id=\"testing-and-container-images\">\n    Testing and container images <a target=\"_blank\" href=\"https://trino.io/blog/2024/12/02/ranger.html#testing-and-container-images\">#</a>\n</h2>\n<p>However that was only half of the needed support. The Trino project moves very\nfast with nearly weekly releases, so the best approach is to have the supporting\nplugin in Trino directly so every release includes the relevant updates. <a target=\"_blank\" href=\"https://github.com/dprophet\">Erik\nAnderson</a> created a more mature plugin that was in\nproduction use for quite a while for Trino. His <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/13297\">pull request from July\n2022</a> included great background\nreasoning for having the plugin in Trino. One of the issues that Erik solved for\nthe Trino project is testing. Trino plugins require the availability of a\ncontainer image for testing whatever integration. Apache Ranger did still not\nship a container in 2022, but thanks to the lobbying efforts of Erik this\nchanged and a container image became available over the months.</p>\n<h2 id=\"a-long-sprint\">\n    A long sprint <a target=\"_blank\" href=\"https://trino.io/blog/2024/12/02/ranger.html#a-long-sprint\">#</a>\n</h2>\n<p>Unfortunately, focus changed and while the PR from Erik existed and was useful,\nit never made it to merge due to waning priorities. That changed when <a target=\"_blank\" href=\"https://github.com/mneethiraj\">Madhan\nNeethiraj</a> from the Apache Ranger project stepped\nup and created <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/22675\">new PR</a> in July 2024.</p>\n<p>We knew this could be another shot at it, and it would require a lot of work to\nget it done, since we put a high focus on quality so that we can maintain the\nTrino codebase for the long run. Monitoring all PRs regularly <a target=\"_blank\" href=\"https://github.com/mosabua\">I (Manfred\nMoser)</a> noticed it and jumped in with first help.</p>\n<p>Erik and other interested users chimed in.\n<a target=\"_blank\" href=\"https://github.com/lozbrown\">lozbrown</a> and Manfred helped with documentation\nand getting other developers interested. The heavy technical reviews and lots of\nguidance came from <a target=\"_blank\" href=\"https://github.com/ksobolew\">Krzysztof Sobolewski</a> and\n<a target=\"_blank\" href=\"https://github.com/kokosing\">Grzegorz Kokosiński</a>.</p>\n<p>During the whole process, Madhan had to react to comments, update the code, and\nalso regularly rebase his PR to adjust for the constantly changing Trino\ncodebase in the master branch. Starburst recognized Madhan’s effort and\n<a target=\"_blank\" href=\"https://www.starburst.io/community/trino-champions/\">featured him as Starburst Trino\nChampion</a>. Interestingly,\nthe container image ended up not being used for testing, however it will be\ncrucially important for many users deploying Apache Ranger on Kubernetes anyway.\nNearly 400 comments and over four months later we all got to celebrate. The\nTrino maintainer Grzegorz took on the responsibility and merged the PR. <a target=\"_blank\" href=\"https://github.com/ebyhr\">Yuya\nEbihara</a> and <a target=\"_blank\" href=\"https://github.com/martint\">Martin\nTraverso</a> followed up with\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/24238\">minor</a>\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/24252\">cleanups</a>, and we finally shipped\nthe plugin as part of <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-466.html\">Trino\n466</a>.</p>\n<blockquote>\n  <p><strong>A huge congratulations and thank you goes out to everyone involved.</strong></p>\n</blockquote>\n<p>Now it is your turn to have a look at the\n<a target=\"_blank\" href=\"https://trino.io/docs/current/security/apache-ranger-access-control.html\">documentation</a>,\nlearn more about Trino and Apache Ranger, and maybe even proceed to help us\nimprove the integration.</p>\n<h2 id=\"next-steps\">\n    Next steps <a target=\"_blank\" href=\"https://trino.io/blog/2024/12/02/ranger.html#next-steps\">#</a>\n</h2>\n<p>Beyond our celebration, more tasks are waiting for all of us:</p>\n<ul>\n  <li>Test it out in your usage and migrate from any old or custom versions.</li>\n  <li>Help us improve the\n<a target=\"_blank\" href=\"https://trino.io/docs/current/security/apache-ranger-access-control.html\">documentation</a>\nsignificantly to allow easier adoption.</li>\n  <li>Work with lozbrown on adding support to the <a target=\"_blank\" href=\"https://github.com/trinodb/charts\">Helm chart</a>.</li>\n  <li>Check out the codebase and help us fix bugs and add features.</li>\n</ul>\n<p>And last, but not least - join us all to celebrate Trino at the upcoming <a target=\"_blank\" href=\"https://trino.io/blog/2024/11/22/trino-summit-2024-lineup\">Trino\nSummit 2024 for two days of amazing sessions and interaction with your peers\nfrom the Trino community</a>\nand the <a target=\"_blank\" href=\"https://trino.io/community#events\">Trino Contributor Call</a> for\nmore open community chat and discussion.</p>\n  </div>\n</article>\n</div>"
---

Apache Ranger has
arrived! With the new Trino
466 you all get another
jam-packed release of Trino awesomeness. One of the goodies is a new plugin for
access control for your data with Apache Ranger, and it has gone through a long
story to get here.
Apache Ranger has a long history and wide adoption as an access control system
for data lakes using Hadoop and Hive. Since Trino brings fast analytics to this
space, and also supports modern data lakehouses and other data sources, Apache
Ranger is a natural fit for access control on a Trino-powered data platform.
The beginnings
Apache Ranger has been in use with Trino for a long time - in fact there are
early,
rudimentary pull requests from
2019 that implemented some support. And even before then, various hacks existed.
In 2020, a plugin for PrestoSQL was added to Apache Ranger. Aakash Nand blogged
about Integrating Trino and Apache
Ranger
in 2021 to adjust for the changes to Trino. Jeff Xu followed up with
Integrating Trino and Apache Ranger in a Kerberos-secured enterprise
environment
in 2022, followed quickly by the addition of the Trino support to the Apache
Ranger repository.
Testing and container images
However that was only half of the needed support. The Trino project moves very
fast with nearly weekly releases, so the best approach is to have the supporting
plugin in Trino directly so every release includes the relevant updates. Erik
Anderson created a more mature plugin that was in
production use for quite a while for Trino. His pull request from July
2022 included great background
reasoning for having the plugin in Trino. One of the issues that Erik solved for
the Trino project is testing. Trino plugins require the availability of a
container image for testing whatever integration. Apache Ranger did still not
ship a container in 2022, but thanks to the lobbying efforts of Erik this
changed and a container image became available over the months.
A long sprint
Unfortunately, focus changed and while the PR from Erik existed and was useful,
it never made it to merge due to waning priorities. That changed when Madhan
Neethiraj from the Apache Ranger project stepped
up and created new PR in July 2024.
We knew this could be another shot at it, and it would require a lot of work to
get it done, since we put a high focus on quality so that we can maintain the
Trino codebase for the long run. Monitoring all PRs regularly I (Manfred
Moser) noticed it and jumped in with first help.
Erik and other interested users chimed in.
lozbrown and Manfred helped with documentation
and getting other developers interested. The heavy technical reviews and lots of
guidance came from Krzysztof Sobolewski and
Grzegorz Kokosiński.
During the whole process, Madhan had to react to comments, update the code, and
also regularly rebase his PR to adjust for the constantly changing Trino
codebase in the master branch. Starburst recognized Madhan’s effort and
featured him as Starburst Trino
Champion. Interestingly,
the container image ended up not being used for testing, however it will be
crucially important for many users deploying Apache Ranger on Kubernetes anyway.
Nearly 400 comments and over four months later we all got to celebrate. The
Trino maintainer Grzegorz took on the responsibility and merged the PR. Yuya
Ebihara and Martin
Traverso followed up with
minor
cleanups, and we finally shipped
the plugin as part of Trino
466.
A huge congratulations and thank you goes out to everyone involved.
Now it is your turn to have a look at the
documentation,
learn more about Trino and Apache Ranger, and maybe even proceed to help us
improve the integration.
Next steps
Beyond our celebration, more tasks are waiting for all of us:
Test it out in your usage and migrate from any old or custom versions.
Help us improve the
documentation
significantly to allow easier adoption.
Work with lozbrown on adding support to the Helm chart.
Check out the codebase and help us fix bugs and add features.
And last, but not least - join us all to celebrate Trino at the upcoming Trino
Summit 2024 for two days of amazing sessions and interaction with your peers
from the Trino community
and the Trino Contributor Call for
more open community chat and discussion.
