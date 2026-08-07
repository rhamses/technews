---
title: "A Kubernetes operator for Trino?"
link: "https://trino.io/blog/2024/10/10/operator.html"
guid: "https://trino.io/blog/2024/10/10/operator.html"
pubDate: "2024-10-10T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Trino is deployed everywhere – on-premise, in private data centers, in the cloud\nwith hosting providers, on bare metal servers, on virtual machines, and with\ncontainers. With all these options for deployments, a Kubernetes-based platform\nwith a container emerged as the most widely used approach.\nThe Trino project caters for this usage with our container\nimages for every\nrelease and our Helm chart. However we keep\nhearing from people who want to use a Kubernetes operator…\nExisting operators\nWe know that various companies have Kubernetes operators developed internally,\nand we also know that open source ones exist, for example:\ntrino-operator from\nStackable with integration in\ntrino-lb\nCharmed Trino K8s Operator from Canonical\nIdeally these separate efforts can combine their work, and create a great\noperator in the Trino project that is closely aligned with Trino itself, and\nalso suitable for future integration with Trino Gateway. In fact, the Trino\nGateway is a good example where different parties came together and considerably\ninnovated together. Hopefully we can achieve the same with the operator. It can\nstill be expandable and modular to suite for specific needs on different\nplatforms and for different users.\nWe also know that this is a long standing community wish from the\nissue and various discussions with\nusers.\nDiscussing next steps\nHowever there are some complications such as choice of programming language or\ncommitment to help within the Trino project as subproject maintainer. We kicked\noff some of these discussion in the past at Trino contributor meetings, and hope\nthat now is a good time to continue.\nTo that end we are arranging a community meeting:\nVirtual video call\n30th of October 2024\n8:00 PDT / 11:00 EDT / 15:00 GMT / 16:00 CET\nInvite available from Manfred on Trino Slack or via email:\n\nWe will also post connection details on the #kubernetes channel and we are\ncollecting related discussion points on\nour contributor meeting page.\nLooking forward to a great discussion."
author: "Manfred Moser, Martin Traverso"
contentHtml: "<p>Trino is deployed everywhere – on-premise, in private data centers, in the cloud\nwith hosting providers, on bare metal servers, on virtual machines, and with\ncontainers. With all these options for deployments, a Kubernetes-based platform\nwith a container emerged as the most widely used approach.</p>\n\n<p>The Trino project caters for this usage with our <a href=\"/docs/current/installation/containers.html\">container\nimages</a> for every\nrelease and our <a href=\"https://github.com/trinodb/charts\">Helm chart</a>. However we keep\nhearing from people who want to use a Kubernetes operator…</p>\n\n<!--more-->\n\n<h2 id=\"existing-operators\">Existing operators</h2>\n\n<p>We know that various companies have Kubernetes operators developed internally,\nand we also know that open source ones exist, for example:</p>\n\n<ul>\n  <li><a href=\"https://github.com/stackabletech/trino-operator\">trino-operator</a> from\nStackable with integration in\n<a href=\"https://github.com/stackabletech/trino-lb\">trino-lb</a></li>\n  <li><a href=\"https://charmhub.io/trino-k8s\">Charmed Trino K8s Operator</a> from Canonical</li>\n</ul>\n\n<p>Ideally these separate efforts can combine their work, and create a great\noperator in the Trino project that is closely aligned with Trino itself, and\nalso suitable for future integration with Trino Gateway. In fact, the Trino\nGateway is a good example where different parties came together and considerably\ninnovated together. Hopefully we can achieve the same with the operator. It can\nstill be expandable and modular to suite for specific needs on different\nplatforms and for different users.</p>\n\n<p>We also know that this is <a href=\"https://github.com/trinodb/trino/issues/396\">a long standing community wish from the\nissue</a> and various discussions with\nusers.</p>\n\n<h2 id=\"discussing-next-steps\">Discussing next steps</h2>\n\n<p>However there are some complications such as choice of programming language or\ncommitment to help within the Trino project as subproject maintainer. We kicked\noff some of these discussion in the past at Trino contributor meetings, and hope\nthat now is a good time to continue.</p>\n\n<p>To that end we are arranging a community meeting:</p>\n\n<ul>\n  <li>Virtual video call</li>\n  <li>30th of October 2024</li>\n  <li>8:00 PDT / 11:00 EDT / 15:00 GMT / 16:00 CET</li>\n  <li>Invite available from Manfred on Trino Slack or via email:</li>\n</ul>\n\n<div class=\"card-deck spacer-30\">\n    <a class=\"btn btn-pink\" href=\"mailto:manfred@starburst.io?subject=trino-k8s-operator\">\n        Tell Manfred you want to join\n    </a>\n</div>\n<p><br /></p>\n\n<p>We will also post connection details on the #kubernetes channel and we are\ncollecting related discussion points on\n<a href=\"https://github.com/trinodb/trino/wiki/Contributor-meetings#trino-kubernetes-operator-discussion-30-oct-2024\">our contributor meeting page</a>.</p>\n\n<p>Looking forward to a great discussion.</p>"
---

Trino is deployed everywhere – on-premise, in private data centers, in the cloud
with hosting providers, on bare metal servers, on virtual machines, and with
containers. With all these options for deployments, a Kubernetes-based platform
with a container emerged as the most widely used approach.
The Trino project caters for this usage with our container
images for every
release and our Helm chart. However we keep
hearing from people who want to use a Kubernetes operator…
Existing operators
We know that various companies have Kubernetes operators developed internally,
and we also know that open source ones exist, for example:
trino-operator from
Stackable with integration in
trino-lb
Charmed Trino K8s Operator from Canonical
Ideally these separate efforts can combine their work, and create a great
operator in the Trino project that is closely aligned with Trino itself, and
also suitable for future integration with Trino Gateway. In fact, the Trino
Gateway is a good example where different parties came together and considerably
innovated together. Hopefully we can achieve the same with the operator. It can
still be expandable and modular to suite for specific needs on different
platforms and for different users.
We also know that this is a long standing community wish from the
issue and various discussions with
users.
Discussing next steps
However there are some complications such as choice of programming language or
commitment to help within the Trino project as subproject maintainer. We kicked
off some of these discussion in the past at Trino contributor meetings, and hope
that now is a good time to continue.
To that end we are arranging a community meeting:
Virtual video call
30th of October 2024
8:00 PDT / 11:00 EDT / 15:00 GMT / 16:00 CET
Invite available from Manfred on Trino Slack or via email:

We will also post connection details on the #kubernetes channel and we are
collecting related discussion points on
our contributor meeting page.
Looking forward to a great discussion.
