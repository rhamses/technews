---
title: "Twenty four"
link: "https://trino.io/blog/2025/03/03/java-24.html"
guid: "https://trino.io/blog/2025/03/03/java-24.html"
pubDate: "2025-03-03T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Six month ago we adopted Java 23 as requirement, following our standard procedure to upgrade with each Java version as soon\nas it becomes available. This allows us to take advantage of all the great\nimprovement each release brings. The upgrade to 23 was pretty easy since the\nchanges from 22 to 23 were not that big. The story turns out to be a bit\ndifferent now with our upgrade to Java 24.\nJava 24 features\nWe have been planning and working towards the\nupgrade consistently since the\n23 bump in September. Java 24 is set to be released in March 2025 and the list\nof changes is quite significant:\nJEP 450 Compact Object Headers (Experimental)\nJEP 472 Prepare to Restrict the Use of JNI\nJEP 475 Late Barrier Expansion for G1\nJEP 478 Key Derivation Function API (Preview)\nJEP 483 Ahead-of-Time Class Loading & Linking\nJEP 484 Class-File API\nJEP 485 Stream Gatherers\nJEP 486 Permanently Disable the Security Manager\nJEP 487 Scoped Values (Fourth Preview)\nJEP 488 Primitive Types in Patterns, instanceof, and switch (Second Preview)\nJEP 489 Vector API (Ninth Incubator)\nJEP 490 ZGC: Remove the Non-Generational Mode\nJEP 491 Synchronize Virtual Threads without Pinning\nJEP 492 Flexible Constructor Bodies (Third Preview)\nJEP 494 Module Import Declarations (Second Preview)\nJEP 495 Simple Source Files and Instance Main Methods (Fourth Preview)\nJEP 496 Quantum-Resistant Module-Lattice-Based Key Encapsulation Mechanism\nJEP 497 Quantum-Resistant Module-Lattice-Based Digital Signature Algorithm\nJEP 498 Warn upon Use of Memory-Access Methods in sun.misc.Unsafe\nJEP 499 Structured Concurrency (Fourth Preview)\nThe list of new features is also quite large. You can find more details\nin the release notes and each\nindividual JEP.\nTrino perspective\nFrom a Trino perspective we want to specifically take advantage of performance\nimprovements to MemorySegment (mismatch, copy, fill), “JEP 491 Synchronize\nVirtual Threads without Pinning” and “JEP 475 Late Barrier Expansion for G1”. On\nthe other hand JEP 486 Permanently Disable the Security\nManager turned out to be the most impactful.\nSince Trino and its connectors have a large footprint of dependencies there was\na high chance that some projects as not keeping up with the security manager\nremoval, although it was first deprecated with Java 17 in 2021.\nAt this stage the Kafka, Kudu, and Phoenix connectors are affected. The Kafka\nproject is planning to make a new compatible release available in time and we\nwill adopt that version.\nThe Kudu and Phoenix connectors however will be removed, since it is not\npossible to use them with Java 24 as requirement. Both connectors are not\nheavily used in our community as we learned from our communication with numerous\nusers, integrators, and the results from our user survey. We are tracking progress for each removal in the\nissues #24419 Phoenix connector\nand #24417 Kudu connector. If\neither of these communities ends up supporting Java 24, or a newer version as\nrequired by Trino, in the future, we can potentially add the connectors back in\nif community members contribute updated versions.\nRelease plans\nIn terms of shipping the changes we follow our established pattern:\nClean up codebase and get it ready, specifically this include the removal of\nthe Kudu and Phoenix connectors.\nCut a release that is completely ready to be used with Java 24, but does not\nyet make it a hard requirement\nAllow for community testing and feedback using Java 24.\nIntroduce Java 24 as hard requirement in another release.\nAdopt Java 24 features and bring the benefits to our users with following\nreleases.\nAs you see, there is a bunch of work waiting, we we better back to it. As usual,\nif you have questions or comments, chime in on the relevant issue or chat with\nus on Trino Slack in the core-dev\nchannel."
author: "Manfred Moser, Mateusz Gajewski"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/coffee-24.png\">\n    </p>\n    <p>Six month ago <a target=\"_blank\" href=\"https://trino.io/blog/2024/09/17/java-23\">we adopted Java 23 as requirement</a>, following our standard procedure to upgrade with each Java version as soon\nas it becomes available. This allows us to take advantage of all the great\nimprovement each release brings. The upgrade to 23 was pretty easy since the\nchanges from 22 to 23 were not that big. The story turns out to be a bit\ndifferent now with our upgrade to Java 24.</p>\n<!--more-->\n<h2 id=\"java-24-features\">\n    Java 24 features <a target=\"_blank\" href=\"https://trino.io/blog/2025/03/03/java-24.html#java-24-features\">#</a>\n</h2>\n<p>We have been <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/23498\">planning and working towards the\nupgrade</a> consistently since the\n23 bump in September. Java 24 is set to be released in March 2025 and the list\nof changes is quite significant:</p>\n<ul>\n  <li>JEP 450 Compact Object Headers (Experimental)</li>\n  <li>JEP 472 Prepare to Restrict the Use of JNI</li>\n  <li>JEP 475 Late Barrier Expansion for G1</li>\n  <li>JEP 478 Key Derivation Function API (Preview)</li>\n  <li>JEP 483 Ahead-of-Time Class Loading &amp; Linking</li>\n  <li>JEP 484 Class-File API</li>\n  <li>JEP 485 Stream Gatherers</li>\n  <li>JEP 486 Permanently Disable the Security Manager</li>\n  <li>JEP 487 Scoped Values (Fourth Preview)</li>\n  <li>JEP 488 Primitive Types in Patterns, instanceof, and switch (Second Preview)</li>\n  <li>JEP 489 Vector API (Ninth Incubator)</li>\n  <li>JEP 490 ZGC: Remove the Non-Generational Mode</li>\n  <li>JEP 491 Synchronize Virtual Threads without Pinning</li>\n  <li>JEP 492 Flexible Constructor Bodies (Third Preview)</li>\n  <li>JEP 494 Module Import Declarations (Second Preview)</li>\n  <li>JEP 495 Simple Source Files and Instance Main Methods (Fourth Preview)</li>\n  <li>JEP 496 Quantum-Resistant Module-Lattice-Based Key Encapsulation Mechanism</li>\n  <li>JEP 497 Quantum-Resistant Module-Lattice-Based Digital Signature Algorithm</li>\n  <li>JEP 498 Warn upon Use of Memory-Access Methods in sun.misc.Unsafe</li>\n  <li>JEP 499 Structured Concurrency (Fourth Preview)</li>\n</ul>\n<p>The list of new features is also quite large. You can find more details\nin the <a target=\"_blank\" href=\"https://jdk.java.net/24/release-notes\">release notes</a> and each\nindividual JEP.</p>\n<h2 id=\"trino-perspective\">\n    Trino perspective <a target=\"_blank\" href=\"https://trino.io/blog/2025/03/03/java-24.html#trino-perspective\">#</a>\n</h2>\n<p>From a Trino perspective we want to specifically take advantage of performance\nimprovements to MemorySegment (mismatch, copy, fill), “JEP 491 Synchronize\nVirtual Threads without Pinning” and “JEP 475 Late Barrier Expansion for G1”. On\nthe other hand <a target=\"_blank\" href=\"https://openjdk.org/jeps/486\">JEP 486 Permanently Disable the Security\nManager</a> turned out to be the most impactful.</p>\n<p>Since Trino and its connectors have a large footprint of dependencies there was\na high chance that some projects as not keeping up with the security manager\nremoval, although it was first deprecated with Java 17 in 2021.</p>\n<p>At this stage the Kafka, Kudu, and Phoenix connectors are affected. The Kafka\nproject is planning to make a new compatible release available in time and we\nwill adopt that version.</p>\n<p>The Kudu and Phoenix connectors however will be removed, since it is not\npossible to use them with Java 24 as requirement. Both connectors are not\nheavily used in our community as we learned from our communication with numerous\nusers, integrators, and the results from our <a target=\"_blank\" href=\"https://trino.io/blog/2025/01/07/2024-and-beyond\">user survey</a>. We are tracking progress for each removal in the\nissues <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/24419\">#24419 Phoenix connector</a>\nand <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/24417\">#24417 Kudu connector</a>. If\neither of these communities ends up supporting Java 24, or a newer version as\nrequired by Trino, in the future, we can potentially add the connectors back in\nif community members contribute updated versions.</p>\n<h2 id=\"release-plans\">\n    Release plans <a target=\"_blank\" href=\"https://trino.io/blog/2025/03/03/java-24.html#release-plans\">#</a>\n</h2>\n<p>In terms of shipping the changes we follow our established pattern:</p>\n<ul>\n  <li>Clean up codebase and get it ready, specifically this include the removal of\nthe Kudu and Phoenix connectors.</li>\n  <li>Cut a release that is completely ready to be used with Java 24, but does not\nyet make it a hard requirement</li>\n  <li>Allow for community testing and feedback using Java 24.</li>\n  <li>Introduce Java 24 as hard requirement in another release.</li>\n  <li>Adopt Java 24 features and bring the benefits to our users with following\nreleases.</li>\n</ul>\n<p>As you see, there is a bunch of work waiting, we we better back to it. As usual,\nif you have questions or comments, chime in on the relevant issue or chat with\nus on <a target=\"_blank\" href=\"https://trino.io/slack\">Trino Slack</a> in the <a target=\"_blank\" href=\"https://trinodb.slack.com/messages/C07ABNN828M\">core-dev\nchannel</a>.</p>\n  </div>\n</article>\n</div>"
---

Six month ago we adopted Java 23 as requirement, following our standard procedure to upgrade with each Java version as soon
as it becomes available. This allows us to take advantage of all the great
improvement each release brings. The upgrade to 23 was pretty easy since the
changes from 22 to 23 were not that big. The story turns out to be a bit
different now with our upgrade to Java 24.
Java 24 features
We have been planning and working towards the
upgrade consistently since the
23 bump in September. Java 24 is set to be released in March 2025 and the list
of changes is quite significant:
JEP 450 Compact Object Headers (Experimental)
JEP 472 Prepare to Restrict the Use of JNI
JEP 475 Late Barrier Expansion for G1
JEP 478 Key Derivation Function API (Preview)
JEP 483 Ahead-of-Time Class Loading & Linking
JEP 484 Class-File API
JEP 485 Stream Gatherers
JEP 486 Permanently Disable the Security Manager
JEP 487 Scoped Values (Fourth Preview)
JEP 488 Primitive Types in Patterns, instanceof, and switch (Second Preview)
JEP 489 Vector API (Ninth Incubator)
JEP 490 ZGC: Remove the Non-Generational Mode
JEP 491 Synchronize Virtual Threads without Pinning
JEP 492 Flexible Constructor Bodies (Third Preview)
JEP 494 Module Import Declarations (Second Preview)
JEP 495 Simple Source Files and Instance Main Methods (Fourth Preview)
JEP 496 Quantum-Resistant Module-Lattice-Based Key Encapsulation Mechanism
JEP 497 Quantum-Resistant Module-Lattice-Based Digital Signature Algorithm
JEP 498 Warn upon Use of Memory-Access Methods in sun.misc.Unsafe
JEP 499 Structured Concurrency (Fourth Preview)
The list of new features is also quite large. You can find more details
in the release notes and each
individual JEP.
Trino perspective
From a Trino perspective we want to specifically take advantage of performance
improvements to MemorySegment (mismatch, copy, fill), “JEP 491 Synchronize
Virtual Threads without Pinning” and “JEP 475 Late Barrier Expansion for G1”. On
the other hand JEP 486 Permanently Disable the Security
Manager turned out to be the most impactful.
Since Trino and its connectors have a large footprint of dependencies there was
a high chance that some projects as not keeping up with the security manager
removal, although it was first deprecated with Java 17 in 2021.
At this stage the Kafka, Kudu, and Phoenix connectors are affected. The Kafka
project is planning to make a new compatible release available in time and we
will adopt that version.
The Kudu and Phoenix connectors however will be removed, since it is not
possible to use them with Java 24 as requirement. Both connectors are not
heavily used in our community as we learned from our communication with numerous
users, integrators, and the results from our user survey. We are tracking progress for each removal in the
issues #24419 Phoenix connector
and #24417 Kudu connector. If
either of these communities ends up supporting Java 24, or a newer version as
required by Trino, in the future, we can potentially add the connectors back in
if community members contribute updated versions.
Release plans
In terms of shipping the changes we follow our established pattern:
Clean up codebase and get it ready, specifically this include the removal of
the Kudu and Phoenix connectors.
Cut a release that is completely ready to be used with Java 24, but does not
yet make it a hard requirement
Allow for community testing and feedback using Java 24.
Introduce Java 24 as hard requirement in another release.
Adopt Java 24 features and bring the benefits to our users with following
releases.
As you see, there is a bunch of work waiting, we we better back to it. As usual,
if you have questions or comments, chime in on the relevant issue or chat with
us on Trino Slack in the core-dev
channel.
