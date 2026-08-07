---
title: "Blazing ahead with 22"
link: "https://trino.io/blog/2024/03/13/java-22.html"
guid: "https://trino.io/blog/2024/03/13/java-22.html"
pubDate: "2024-03-13T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "It was not that long ago that we first announced support for Java 21, and subsequently made it a build and runtime\nrequirement with Trino 436.\nSince then, the codebase received some significant improvements in readability,\nand we have also seen better performance. However, innovation in Trino and Java\nis not holding still, on the contrary - it’s accelerating. On the Java\ncommunity side, Java 22 is just about to be released, and we think it is time\nto drive innovation in Trino even further. Trino is going to use and require\nJava 22 soon!\nBackground and motivation\nThe planned move to use and require Java 22 for build and runtime of Trino is\ndriven by numerous aspects:\nTake advantage of performance and runtime improvements of the new JVM version.\nUse the newly available language features to further improve readability and\nmaintenance aspects of the codebase.\nEnable the use of further performance improvements for Trino under the umbrella\nof Project Hummingbird.\nAttract and motivate more contributors for Trino as an opportunity to work\nwith a modern Java stack on a cutting edge, complex application and work with\nthe relevant language features and APIs.\nSpeaking about APIs and new features, let’s look at a list of JDK Enhancement\nProposals (JEPs) that we are actively looking at. Specifically we plan to\nexperiment, and adopt any non-preview JEPs where we see benefits. We also plan\nto submit any issues and problems we encounter back upstream to the Java\ncommunity:\nRegion Pinning for G1 (JEP 423)\nForeign Function & Memory API (JEP 454)\nUnnamed Variables and Patterns (JEP 456)\nClass File API in preview (JEP 457)\nString Templates in second preview (JEP 459)\nVector API in 7th incubator (JEP 460)\nStructured Concurrency in second preview  (JEP 462)\nScoped Values in second preview  (JEP 464)\nMany of these API’s allow us to further modernize the feature set of Trino and\nadapt it to current hardware and compute power realities. Specifically we can\ncontinue with our commitment to the Java ecosystem and avoid many of the\ncomplexities and pitfalls of JNI - the traditional, now legacy integrations with\nnative code and specific hardware features.\nAnother aspect some of you might wonder about is the move from a Java LTS\nversion to a Java STS release – from “long term support” to “short term\nsupport”. So far Trino was using Java 8, Java 11, Java 17, and then Java 21 as\nrequirements. Since all of them are LTS releases, some of you might have\nconcluded that we have a policy of only using Java LTS versions. That is not the\ncase, it is only a coincidence.\nWe always thrived to use up to date source code, dependencies, runtime\nenvironments, and so forth. The benefits, including better performance,\navailable and included bug fixes, reduced need for backports, less security\nissues, and support for modern language features, development environments, and\ntooling, always far outweighed the effort of staying up to date.\nWe are now finally at the long planned status where we can move quick enough as\na project to use latest tools, dependencies, and Java releases and keep\niterating on our frequent releases. And that is exactly what we are doing for\nthe benefit of everyone contributing to Trino and using Trino. Java 22 now. And\nthen later this year we can move to Java 23, and next year to 24 and 25.\nSo what are we specifically doing now?\nCurrent status and plans\nJava 22 is scheduled to ship in March 2024. The various JDK distribution\nbinary packages will become available shortly after the official release.\nEarly access source and binaries are already available, and our continuous\nintegration builds already use such an EA build successfully.\nOverall the transition is going well. Our plan is to follow the same approach as\nour switch to Java 21:\nEnsure everything works with Java 22.\nChange the container image to use Java 22.\nCut a release and get community feedback from testing with the container.\nAdjust to any feedback and available improvements for a few releases.\nSwitch the requirement for build and runtime to Java 22.\nCut another release and celebrate.\nAnd then the real fun starts all over. We can update code, libraries, and start\nworking with the new APIs. Timing on all the work depends on obstacles we find\non the way and how we progress with removing them.\nWe use the Java 22 tracking\nissue and the linked issues and\npull requests to manage progress, discuss next steps, and work with the\ncommunity.\nFeel free to chime in there or find us on the #dev\nchannel on the Trino community\nSlack.\nJoin us in this exciting next step for Trino.\nUpdate from 8 May 2024:\nThe release of Trino 447\nincludes the switch to Java 22 as a requirement for running Trino."
author: "Manfred Moser, Martin Traverso, Dain Sundstrom, David Phillips"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/images/logos/java-duke-22.png\">\n    </p>\n    <p>It was not that long ago that we <a target=\"_blank\" href=\"https://trino.io/blog/2023/11/03/java-21\">first announced support for Java 21</a>, and subsequently made it a build and runtime\nrequirement with <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-436.html\">Trino 436</a>.</p>\n<p>Since then, the codebase received some significant improvements in readability,\nand we have also seen better performance. However, innovation in Trino and Java\nis not holding still, on the contrary - it’s accelerating. On the Java\ncommunity side, Java 22 is just about to be released, and we think it is time\nto drive innovation in Trino even further. Trino is going to use and require\nJava 22 soon!</p>\n<!--more-->\n<h2 id=\"background-and-motivation\">\n    Background and motivation <a target=\"_blank\" href=\"https://trino.io/blog/2024/03/13/java-22.html#background-and-motivation\">#</a>\n</h2>\n<p>The planned move to use and require Java 22 for build and runtime of Trino is\ndriven by numerous aspects:</p>\n<ul>\n  <li>Take advantage of performance and runtime improvements of the new JVM version.</li>\n  <li>Use the newly available language features to further improve readability and\nmaintenance aspects of the codebase.</li>\n  <li>Enable the use of further performance improvements for Trino under the umbrella\nof <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/14237\">Project Hummingbird</a>.</li>\n  <li>Attract and motivate more contributors for Trino as an opportunity to work\nwith a modern Java stack on a cutting edge, complex application and work with\nthe relevant language features and APIs.</li>\n</ul>\n<p>Speaking about APIs and new features, let’s look at a list of JDK Enhancement\nProposals (JEPs) that we are actively looking at. Specifically we plan to\nexperiment, and adopt any non-preview JEPs where we see benefits. We also plan\nto submit any issues and problems we encounter back upstream to the Java\ncommunity:</p>\n<ul>\n  <li>Region Pinning for G1 (<a target=\"_blank\" href=\"https://openjdk.org/jeps/423\">JEP 423</a>)</li>\n  <li>Foreign Function &amp; Memory API (<a target=\"_blank\" href=\"https://openjdk.org/jeps/454\">JEP 454</a>)</li>\n  <li>Unnamed Variables and Patterns (<a target=\"_blank\" href=\"https://openjdk.org/jeps/456\">JEP 456</a>)</li>\n  <li>Class File API in preview (<a target=\"_blank\" href=\"https://openjdk.org/jeps/457\">JEP 457</a>)</li>\n  <li>String Templates in second preview (<a target=\"_blank\" href=\"https://openjdk.org/jeps/459\">JEP 459</a>)</li>\n  <li>Vector API in 7th incubator (<a target=\"_blank\" href=\"https://openjdk.org/jeps/460\">JEP 460</a>)</li>\n  <li>Structured Concurrency in second preview  (<a target=\"_blank\" href=\"https://openjdk.org/jeps/462\">JEP 462</a>)</li>\n  <li>Scoped Values in second preview  (<a target=\"_blank\" href=\"https://openjdk.org/jeps/464\">JEP 464</a>)</li>\n</ul>\n<p>Many of these API’s allow us to further modernize the feature set of Trino and\nadapt it to current hardware and compute power realities. Specifically we can\ncontinue with our commitment to the Java ecosystem and avoid many of the\ncomplexities and pitfalls of JNI - the traditional, now legacy integrations with\nnative code and specific hardware features.</p>\n<p>Another aspect some of you might wonder about is the move from a Java LTS\nversion to a Java STS release – from “long term support” to “short term\nsupport”. So far Trino was using Java 8, Java 11, Java 17, and then Java 21 as\nrequirements. Since all of them are LTS releases, some of you might have\nconcluded that we have a policy of only using Java LTS versions. That is not the\ncase, it is only a coincidence.</p>\n<p>We always thrived to use up to date source code, dependencies, runtime\nenvironments, and so forth. The benefits, including better performance,\navailable and included bug fixes, reduced need for backports, less security\nissues, and support for modern language features, development environments, and\ntooling, always far outweighed the effort of staying up to date.</p>\n<p>We are now finally at the long planned status where we can move quick enough as\na project to use latest tools, dependencies, and Java releases and keep\niterating on our frequent releases. And that is exactly what we are doing for\nthe benefit of everyone contributing to Trino and using Trino. Java 22 now. And\nthen later this year we can move to Java 23, and next year to 24 and 25.</p>\n<p>So what are we specifically doing now?</p>\n<h2 id=\"current-status-and-plans\">\n    Current status and plans <a target=\"_blank\" href=\"https://trino.io/blog/2024/03/13/java-22.html#current-status-and-plans\">#</a>\n</h2>\n<p>Java 22 is scheduled to ship in March 2024. The various JDK distribution\nbinary packages will become available shortly after the official release.</p>\n<p>Early access source and binaries are already available, and our continuous\nintegration builds already use such an EA build successfully.</p>\n<p>Overall the transition is going well. Our plan is to follow the same approach as\nour switch to Java 21:</p>\n<ul>\n  <li>Ensure everything works with Java 22.</li>\n  <li>Change the container image to use Java 22.</li>\n  <li>Cut a release and get community feedback from testing with the container.</li>\n  <li>Adjust to any feedback and available improvements for a few releases.</li>\n  <li>Switch the requirement for build and runtime to Java 22.</li>\n  <li>Cut another release and celebrate.</li>\n</ul>\n<p>And then the real fun starts all over. We can update code, libraries, and start\nworking with the new APIs. Timing on all the work depends on obstacles we find\non the way and how we progress with removing them.</p>\n<p>We use the <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/20980\">Java 22 tracking\nissue</a> and the linked issues and\npull requests to manage progress, discuss next steps, and work with the\ncommunity.</p>\n<p>Feel free to chime in there or find us on the <a target=\"_blank\" href=\"https://trinodb.slack.com/archives/CP1MUNEUX\">#dev\nchannel</a> on the <a target=\"_blank\" href=\"https://trino.io/slack\">Trino community\nSlack</a>.</p>\n<p>Join us in this exciting next step for Trino.</p>\n<blockquote>\n  <p><strong>Update from 8 May 2024:</strong>\nThe release of <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-447.html\">Trino 447</a>\nincludes the switch to Java 22 as a requirement for running Trino.</p>\n</blockquote>\n  </div>\n</article>\n</div>"
---

It was not that long ago that we first announced support for Java 21, and subsequently made it a build and runtime
requirement with Trino 436.
Since then, the codebase received some significant improvements in readability,
and we have also seen better performance. However, innovation in Trino and Java
is not holding still, on the contrary - it’s accelerating. On the Java
community side, Java 22 is just about to be released, and we think it is time
to drive innovation in Trino even further. Trino is going to use and require
Java 22 soon!
Background and motivation
The planned move to use and require Java 22 for build and runtime of Trino is
driven by numerous aspects:
Take advantage of performance and runtime improvements of the new JVM version.
Use the newly available language features to further improve readability and
maintenance aspects of the codebase.
Enable the use of further performance improvements for Trino under the umbrella
of Project Hummingbird.
Attract and motivate more contributors for Trino as an opportunity to work
with a modern Java stack on a cutting edge, complex application and work with
the relevant language features and APIs.
Speaking about APIs and new features, let’s look at a list of JDK Enhancement
Proposals (JEPs) that we are actively looking at. Specifically we plan to
experiment, and adopt any non-preview JEPs where we see benefits. We also plan
to submit any issues and problems we encounter back upstream to the Java
community:
Region Pinning for G1 (JEP 423)
Foreign Function & Memory API (JEP 454)
Unnamed Variables and Patterns (JEP 456)
Class File API in preview (JEP 457)
String Templates in second preview (JEP 459)
Vector API in 7th incubator (JEP 460)
Structured Concurrency in second preview  (JEP 462)
Scoped Values in second preview  (JEP 464)
Many of these API’s allow us to further modernize the feature set of Trino and
adapt it to current hardware and compute power realities. Specifically we can
continue with our commitment to the Java ecosystem and avoid many of the
complexities and pitfalls of JNI - the traditional, now legacy integrations with
native code and specific hardware features.
Another aspect some of you might wonder about is the move from a Java LTS
version to a Java STS release – from “long term support” to “short term
support”. So far Trino was using Java 8, Java 11, Java 17, and then Java 21 as
requirements. Since all of them are LTS releases, some of you might have
concluded that we have a policy of only using Java LTS versions. That is not the
case, it is only a coincidence.
We always thrived to use up to date source code, dependencies, runtime
environments, and so forth. The benefits, including better performance,
available and included bug fixes, reduced need for backports, less security
issues, and support for modern language features, development environments, and
tooling, always far outweighed the effort of staying up to date.
We are now finally at the long planned status where we can move quick enough as
a project to use latest tools, dependencies, and Java releases and keep
iterating on our frequent releases. And that is exactly what we are doing for
the benefit of everyone contributing to Trino and using Trino. Java 22 now. And
then later this year we can move to Java 23, and next year to 24 and 25.
So what are we specifically doing now?
Current status and plans
Java 22 is scheduled to ship in March 2024. The various JDK distribution
binary packages will become available shortly after the official release.
Early access source and binaries are already available, and our continuous
integration builds already use such an EA build successfully.
Overall the transition is going well. Our plan is to follow the same approach as
our switch to Java 21:
Ensure everything works with Java 22.
Change the container image to use Java 22.
Cut a release and get community feedback from testing with the container.
Adjust to any feedback and available improvements for a few releases.
Switch the requirement for build and runtime to Java 22.
Cut another release and celebrate.
And then the real fun starts all over. We can update code, libraries, and start
working with the new APIs. Timing on all the work depends on obstacles we find
on the way and how we progress with removing them.
We use the Java 22 tracking
issue and the linked issues and
pull requests to manage progress, discuss next steps, and work with the
community.
Feel free to chime in there or find us on the #dev
channel on the Trino community
Slack.
Join us in this exciting next step for Trino.
Update from 8 May 2024:
The release of Trino 447
includes the switch to Java 22 as a requirement for running Trino.
