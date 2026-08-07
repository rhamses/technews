---
title: "Open Policy Agent for Trino arrived"
link: "https://trino.io/blog/2024/02/06/opa-arrived.html"
guid: "https://trino.io/blog/2024/02/06/opa-arrived.html"
pubDate: "2024-02-06T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Trino now ships with an access control integration using the popular and widely\nused Open Policy Agent (OPA) from the Cloud Native\nComputing Foundation. The release of Trino\n438 marks an important\nmilestone of the effort towards this integration.\nCollaboration and history\nOpen Policy Agent was first released in 2016 and has gained more and more\npopularity in the ecosystem of cloud native applications and beyond.\nInitial efforts for an integration with Trino started at Bloomberg, Stackable,\nRaft, and other places separately and sometimes in parallel, with only partial\ncollaboration. You might have first heard about it in August 2022 in the Trino\nCommunity Broadcast episode 39 with a team from\nRaft as guests.\nUsage and experience with OPA grew. In the end, Pablo Arteaga from\nBloomberg and Sebastian Bernauer and Sönke\nLiebau from Stackable had the initiative to start a\npull request to Trino. Their persistence and collaboration led them through many\nreview comments, update commits, and even a second PR, to submit a talk and\neventually present at Trino Summit 2023 about the Open Policy Agent access\ncontrol with Trino and their motivation to move from Apache Ranger to OPA.\nOPA at Trino Summit 2023\nThe presentation from Pablo and Sönke titled “Trino OPA authorizer - An open\nsource love story” received a lot of interest from the audience at the event and\non YouTube since then. They detailed the architectural differences of using\nRanger and OPA. Sönke detailed the usage of OPA in the Stackable platform and\nhow it enables a single access control platform to apply across many systems.\nThey discussed their collaboration on the pull request, and Pablo showed a\nmigration path from Ranger, and a full demo of OPA with Trino.\n\n\n\nThey also made the slide deck available for your\nreference.\nEdward Morgan and Bhaarat Sharma from Raft also\npresented Avoiding pitfalls with query federation in data\nlakehouses at Trino Summit, and\ndetailed their OPA usage in their Data Fabric platform. It combines Delta Lake,\nTrino, Apache Kafka, and Open Policy Agent (OPA) into a robust lakehouse data\nplatform. They talked about access control in Trino overall and how important it\nis for their customers, including the US Department of Defense. Their\npresentation also included a demo of OPA with Trino.\n\n\n\nOPA on the way to Trino\nPablo and Sebastian continued their efforts on the pull\nrequest after Trino Summit. They\nworked successfully with Dain on the code review and necessary changes, and\nhelped Manfred with the documentation.\nFinally, with the release of Trino 438, the Open Policy Agent access\ncontrol is available\nto all Trino users.\nThe community is already taking notice with follow up pull requests for further\nimprovements and blog posts such as Enhancing Security and Observability in\nTrino with Open Policy Agent and\nOpenTelemetry\nfrom Isa Inalcik.\nBenefits of OPA\nThe arrival of OPA support for Trino marks an important step. OPA is a mature\nand widely used access control system. Its\necosystem includes many\nintegrations, user interfaces, development tools, and other resources.\nOPA is a very flexible authorization system, making it an ideal match for Trino.\nTrino deployments are often part of a diverse data platform, spanning a variety\n of interconnected data sources, pipelines, client tools and applications.\nTrino users now have an alternative to the file-based access\ncontrol from the Trino project itself, the effort to support your own Ranger\nintegration, or the use of commercial offerings for access control.\nWhat’s next\nWe reached another milestone but we are not done yet. Specifically for OPA, we\nare looking at the following next tasks:\nGet more features from various older, private forks converted into pull\nrequests to Trino so everyone can benefit.\nUpdate the documentation with more practical advice and tips.\nProvide further resources for running OPA with Trino, writing rego scripts,\nand helping the community.\nImplementation of row level filtering and column masking, based on the\ndraft from Pablo\nSpecial thanks go to everyone participating so far. Consider this an open\ninvitation to join the effort.\nPing me on Slack directly or find us in #opa-dev.\nManfred"
author: "Manfred Moser"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/images/logos/opa-small.png\">\n    </p>\n    <p>Trino now ships with an access control integration using the popular and widely\nused <a target=\"_blank\" href=\"https://www.openpolicyagent.org/\">Open Policy Agent (OPA)</a> from the Cloud Native\nComputing Foundation. The release of <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-438.html\">Trino\n438</a> marks an important\nmilestone of the effort towards this integration.</p>\n<!--more-->\n<h2 id=\"collaboration-and-history\">\n    Collaboration and history <a target=\"_blank\" href=\"https://trino.io/blog/2024/02/06/opa-arrived.html#collaboration-and-history\">#</a>\n</h2>\n<p>Open Policy Agent was first released in 2016 and has gained more and more\npopularity in the ecosystem of cloud native applications and beyond.</p>\n<p>Initial efforts for an integration with Trino started at Bloomberg, Stackable,\nRaft, and other places separately and sometimes in parallel, with only partial\ncollaboration. You might have first heard about it in August 2022 in the <a target=\"_blank\" href=\"https://trino.io/episodes/39\">Trino\nCommunity Broadcast episode 39</a> with a team from\nRaft as guests.</p>\n<p>Usage and experience with OPA grew. In the end, Pablo Arteaga from\n<a target=\"_blank\" href=\"https://www.techatbloomberg.com/\">Bloomberg</a> and Sebastian Bernauer and Sönke\nLiebau from <a target=\"_blank\" href=\"https://stackable.tech/\">Stackable</a> had the initiative to start a\npull request to Trino. Their persistence and collaboration led them through many\nreview comments, update commits, and even a second PR, to submit a talk and\neventually present at Trino Summit 2023 about the Open Policy Agent access\ncontrol with Trino and their motivation to move from Apache Ranger to OPA.</p>\n<h2 id=\"opa-at-trino-summit-2023\">\n    OPA at Trino Summit 2023 <a target=\"_blank\" href=\"https://trino.io/blog/2024/02/06/opa-arrived.html#opa-at-trino-summit-2023\">#</a>\n</h2>\n<p>The presentation from Pablo and Sönke titled “Trino OPA authorizer - An open\nsource love story” received a lot of interest from the audience at the event and\non YouTube since then. They detailed the architectural differences of using\nRanger and OPA. Sönke detailed the usage of OPA in the Stackable platform and\nhow it enables a single access control platform to apply across many systems.\nThey discussed their collaboration on the pull request, and Pablo showed a\nmigration path from Ranger, and a full demo of OPA with Trino.</p>\n<p>\n    \n</p>\n<p>They also made the <a target=\"_blank\" href=\"https://trino.io/assets/blog/trino-summit-2023/opa-trino.pdf\">slide deck available for your\nreference</a>.</p>\n<p>Edward Morgan and Bhaarat Sharma from <a target=\"_blank\" href=\"https://teamraft.com/\">Raft</a> also\npresented <a target=\"_blank\" href=\"https://www.youtube.com/watch?v=6KspMwCbOfI\">Avoiding pitfalls with query federation in data\nlakehouses</a> at Trino Summit, and\ndetailed their OPA usage in their Data Fabric platform. It combines Delta Lake,\nTrino, Apache Kafka, and Open Policy Agent (OPA) into a robust lakehouse data\nplatform. They talked about access control in Trino overall and how important it\nis for their customers, including the US Department of Defense. Their\npresentation also included a demo of OPA with Trino.</p>\n<p>\n    \n</p>\n<h2 id=\"opa-on-the-way-to-trino\">\n    OPA on the way to Trino <a target=\"_blank\" href=\"https://trino.io/blog/2024/02/06/opa-arrived.html#opa-on-the-way-to-trino\">#</a>\n</h2>\n<p>Pablo and Sebastian continued their efforts on the <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/19532\">pull\nrequest</a> after Trino Summit. They\nworked successfully with Dain on the code review and necessary changes, and\nhelped Manfred with the documentation.</p>\n<p>Finally, with the release of Trino 438, the <a target=\"_blank\" href=\"https://trino.io/docs/current/security/opa-access-control.html\">Open Policy Agent access\ncontrol</a> is available\nto all Trino users.</p>\n<p>The community is already taking notice with follow up pull requests for further\nimprovements and blog posts such as <a target=\"_blank\" href=\"https://www.linkedin.com/pulse/enhancing-security-observability-trino-open-policy-agent-isa-inalcik-zhl9e/\">Enhancing Security and Observability in\nTrino with Open Policy Agent and\nOpenTelemetry</a>\nfrom Isa Inalcik.</p>\n<h2 id=\"benefits-of-opa\">\n    Benefits of OPA <a target=\"_blank\" href=\"https://trino.io/blog/2024/02/06/opa-arrived.html#benefits-of-opa\">#</a>\n</h2>\n<p>The arrival of OPA support for Trino marks an important step. OPA is a mature\nand widely used access control system. Its\n<a target=\"_blank\" href=\"https://www.openpolicyagent.org/ecosystem/\">ecosystem</a> includes many\nintegrations, user interfaces, development tools, and other resources.</p>\n<p>OPA is a very flexible authorization system, making it an ideal match for Trino.\nTrino deployments are often part of a diverse data platform, spanning a variety\n of interconnected data sources, pipelines, client tools and applications.</p>\n<p>Trino users now have an alternative to the file-based access\ncontrol from the Trino project itself, the effort to support your own Ranger\nintegration, or the use of commercial offerings for access control.</p>\n<h2 id=\"whats-next\">\n    What’s next <a target=\"_blank\" href=\"https://trino.io/blog/2024/02/06/opa-arrived.html#whats-next\">#</a>\n</h2>\n<p>We reached another milestone but we are not done yet. Specifically for OPA, we\nare looking at the following next tasks:</p>\n<ul>\n  <li>Get more features from various older, private forks converted into pull\nrequests to Trino so everyone can benefit.</li>\n  <li>Update the documentation with more practical advice and tips.</li>\n  <li>Provide further resources for running OPA with Trino, writing rego scripts,\nand helping the community.</li>\n  <li>Implementation of row level filtering and column masking, based on the\n<a target=\"_blank\" href=\"https://github.com/bloomberg/trino/pull/16\">draft</a> from Pablo</li>\n</ul>\n<p>Special thanks go to everyone participating so far. Consider this an open\ninvitation to join the effort.</p>\n<p>Ping me on Slack directly or find us in #opa-dev.</p>\n<p><em>Manfred</em></p>\n  </div>\n</article>\n</div>"
---

Trino now ships with an access control integration using the popular and widely
used Open Policy Agent (OPA) from the Cloud Native
Computing Foundation. The release of Trino
438 marks an important
milestone of the effort towards this integration.
Collaboration and history
Open Policy Agent was first released in 2016 and has gained more and more
popularity in the ecosystem of cloud native applications and beyond.
Initial efforts for an integration with Trino started at Bloomberg, Stackable,
Raft, and other places separately and sometimes in parallel, with only partial
collaboration. You might have first heard about it in August 2022 in the Trino
Community Broadcast episode 39 with a team from
Raft as guests.
Usage and experience with OPA grew. In the end, Pablo Arteaga from
Bloomberg and Sebastian Bernauer and Sönke
Liebau from Stackable had the initiative to start a
pull request to Trino. Their persistence and collaboration led them through many
review comments, update commits, and even a second PR, to submit a talk and
eventually present at Trino Summit 2023 about the Open Policy Agent access
control with Trino and their motivation to move from Apache Ranger to OPA.
OPA at Trino Summit 2023
The presentation from Pablo and Sönke titled “Trino OPA authorizer - An open
source love story” received a lot of interest from the audience at the event and
on YouTube since then. They detailed the architectural differences of using
Ranger and OPA. Sönke detailed the usage of OPA in the Stackable platform and
how it enables a single access control platform to apply across many systems.
They discussed their collaboration on the pull request, and Pablo showed a
migration path from Ranger, and a full demo of OPA with Trino.



They also made the slide deck available for your
reference.
Edward Morgan and Bhaarat Sharma from Raft also
presented Avoiding pitfalls with query federation in data
lakehouses at Trino Summit, and
detailed their OPA usage in their Data Fabric platform. It combines Delta Lake,
Trino, Apache Kafka, and Open Policy Agent (OPA) into a robust lakehouse data
platform. They talked about access control in Trino overall and how important it
is for their customers, including the US Department of Defense. Their
presentation also included a demo of OPA with Trino.



OPA on the way to Trino
Pablo and Sebastian continued their efforts on the pull
request after Trino Summit. They
worked successfully with Dain on the code review and necessary changes, and
helped Manfred with the documentation.
Finally, with the release of Trino 438, the Open Policy Agent access
control is available
to all Trino users.
The community is already taking notice with follow up pull requests for further
improvements and blog posts such as Enhancing Security and Observability in
Trino with Open Policy Agent and
OpenTelemetry
from Isa Inalcik.
Benefits of OPA
The arrival of OPA support for Trino marks an important step. OPA is a mature
and widely used access control system. Its
ecosystem includes many
integrations, user interfaces, development tools, and other resources.
OPA is a very flexible authorization system, making it an ideal match for Trino.
Trino deployments are often part of a diverse data platform, spanning a variety
 of interconnected data sources, pipelines, client tools and applications.
Trino users now have an alternative to the file-based access
control from the Trino project itself, the effort to support your own Ranger
integration, or the use of commercial offerings for access control.
What’s next
We reached another milestone but we are not done yet. Specifically for OPA, we
are looking at the following next tasks:
Get more features from various older, private forks converted into pull
requests to Trino so everyone can benefit.
Update the documentation with more practical advice and tips.
Provide further resources for running OPA with Trino, writing rego scripts,
and helping the community.
Implementation of row level filtering and column masking, based on the
draft from Pablo
Special thanks go to everyone participating so far. Consider this an open
invitation to join the effort.
Ping me on Slack directly or find us in #opa-dev.
Manfred
