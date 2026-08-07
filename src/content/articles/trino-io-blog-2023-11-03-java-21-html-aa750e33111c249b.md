---
title: "Trino is moving to Java 21"
link: "https://trino.io/blog/2023/11/03/java-21.html"
guid: "https://trino.io/blog/2023/11/03/java-21.html"
pubDate: "2023-11-03T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "We’re excited to announce that as of version 432, Trino can run with Java 21. In\nfact, the Trino Docker image uses Java 21 now. We have done upgrades to newer\nJava LTS versions successfully before when we upgraded to Java 11 and then Java\n17 with Trino 390. Each\ntime the improvements to the JVM runtime, the garbage collectors, the involved\nlibraries, and the dependencies resulted in performance gains that came nearly\nfor free.\nAnd each time we were able to take advantage of new language constructs and\nstandard libraries to improve the codebase for all contributors and maintainers\nof the project.\nNow it is time to do it again.\nIn September, Java 21 was\nreleased as the\nnewest long-term support version. The consolidated release\nnotes are\ntruly impressive when it comes to breath and depth of improvements throughout\nthe runtime, the standard libraries, the included tools, and the overall system.\nJava 21 provides numerous great opportunities to improve Trino. Even without\nmany code changes, the performance benefits can have a significant impact on the\ncost of running a Trino cluster.\nTaking it one step further, and into the codebase and used libraries, we are\nable to move our performance work to the next level. Project\nHummingbird, our performance\nfine-tuning initiative, is buzzing already. Dain Sundstrom shipped some great improvements recently again. Just\nlike with our Java 17 upgrade, Mateusz Gajewski\nhas been of critical importance to pull all the necessary changes together.\nWith the Trino 432\nrelease we have now\nmade the next big step. The Trino Docker image was changed to use the Eclipse\nTemurin distribution of Java 21. We\nhave been running our test suites with Java 21 for quite some time and all looks\ngood. With this release, you are now able to easily test Trino with Java 21.\nJust use the Docker container in your deployment or testing with your own\npipeline or with the Trino Helm charts. The\nnew version 0.14.0 of the chart already uses the right JVM configuration and\nTrino 432 by default.\nOur plan is to make Java 21 the required runtime and move towards adopting the\nnew language features and libraries. However, before we do that, we want your\ninput. Are you ready to move to Java 21 for Trino? Did you do some testing with\nit already? Are there any issue you encounters? We want to know all about your\nexperience. Find us on the Trino community chat and ping us in the #dev\nchannel. Or leave comments in our\nJava 21 tracking issue.\nWe want to hear from you. Any input and feedback is welcome.\nUpdate from 11 Jan 2024:\nThe release of Trino 436\nincludes the switch to Java 21 as a requirement for running Trino."
author: "Manfred Moser"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/images/logos/java-duke-21.png\">\n    </p>\n    <p>We’re excited to announce that as of version 432, Trino can run with Java 21. In\nfact, the Trino Docker image uses Java 21 now. We have done upgrades to newer\nJava LTS versions successfully before when we upgraded to Java 11 and then <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/14/trino-updates-to-java-17\">Java\n17 with Trino 390</a>. Each\ntime the improvements to the JVM runtime, the garbage collectors, the involved\nlibraries, and the dependencies resulted in performance gains that came nearly\nfor free.</p>\n<p>And each time we were able to take advantage of new language constructs and\nstandard libraries to improve the codebase for all contributors and maintainers\nof the project.</p>\n<p>Now it is time to do it again.</p>\n<!--more-->\n<p>In September, <a target=\"_blank\" href=\"https://blogs.oracle.com/java/post/the-arrival-of-java-21\">Java 21 was\nreleased</a> as the\nnewest long-term support version. The <a target=\"_blank\" href=\"https://www.oracle.com/java/technologies/javase/21all-relnotes.html\">consolidated release\nnotes</a> are\ntruly impressive when it comes to breath and depth of improvements throughout\nthe runtime, the standard libraries, the included tools, and the overall system.</p>\n<p>Java 21 provides numerous great opportunities to improve Trino. Even without\nmany code changes, the performance benefits can have a significant impact on the\ncost of running a Trino cluster.</p>\n<p>Taking it one step further, and into the codebase and used libraries, we are\nable to move our performance work to the next level. <a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/14237\">Project\nHummingbird</a>, our performance\nfine-tuning initiative, is buzzing already. <a target=\"_blank\" href=\"https://github.com/dain\">Dain Sundstrom</a> shipped some great improvements recently again. Just\nlike with our Java 17 upgrade, <a target=\"_blank\" href=\"https://github.com/wendigo\">Mateusz Gajewski</a>\nhas been of critical importance to pull all the necessary changes together.</p>\n<p>With the <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-432.html\">Trino 432\nrelease</a> we have now\nmade the next big step. The Trino Docker image was changed to use the <a target=\"_blank\" href=\"https://adoptium.net/temurin/releases/\">Eclipse\nTemurin</a> distribution of Java 21. We\nhave been running our test suites with Java 21 for quite some time and all looks\ngood. With this release, you are now able to easily test Trino with Java 21.\nJust use the Docker container in your deployment or testing with your own\npipeline or with the <a target=\"_blank\" href=\"https://github.com/trinodb/charts\">Trino Helm charts</a>. The\nnew version 0.14.0 of the chart already uses the right JVM configuration and\nTrino 432 by default.</p>\n<p>Our plan is to make Java 21 the required runtime and move towards adopting the\nnew language features and libraries. However, before we do that, we want your\ninput. Are you ready to move to Java 21 for Trino? Did you do some testing with\nit already? Are there any issue you encounters? We want to know all about your\nexperience. Find us on the Trino community chat and ping us in the <a target=\"_blank\" href=\"https://trinodb.slack.com/archives/CP1MUNEUX\">#dev\nchannel</a>. Or leave comments in our\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/17017\">Java 21 tracking issue</a>.</p>\n<p>We want to hear from you. Any input and feedback is welcome.</p>\n<blockquote>\n  <p><strong>Update from 11 Jan 2024:</strong>\nThe release of <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-436.html\">Trino 436</a>\nincludes the switch to Java 21 as a requirement for running Trino.</p>\n</blockquote>\n  </div>\n</article>\n</div>"
---

We’re excited to announce that as of version 432, Trino can run with Java 21. In
fact, the Trino Docker image uses Java 21 now. We have done upgrades to newer
Java LTS versions successfully before when we upgraded to Java 11 and then Java
17 with Trino 390. Each
time the improvements to the JVM runtime, the garbage collectors, the involved
libraries, and the dependencies resulted in performance gains that came nearly
for free.
And each time we were able to take advantage of new language constructs and
standard libraries to improve the codebase for all contributors and maintainers
of the project.
Now it is time to do it again.
In September, Java 21 was
released as the
newest long-term support version. The consolidated release
notes are
truly impressive when it comes to breath and depth of improvements throughout
the runtime, the standard libraries, the included tools, and the overall system.
Java 21 provides numerous great opportunities to improve Trino. Even without
many code changes, the performance benefits can have a significant impact on the
cost of running a Trino cluster.
Taking it one step further, and into the codebase and used libraries, we are
able to move our performance work to the next level. Project
Hummingbird, our performance
fine-tuning initiative, is buzzing already. Dain Sundstrom shipped some great improvements recently again. Just
like with our Java 17 upgrade, Mateusz Gajewski
has been of critical importance to pull all the necessary changes together.
With the Trino 432
release we have now
made the next big step. The Trino Docker image was changed to use the Eclipse
Temurin distribution of Java 21. We
have been running our test suites with Java 21 for quite some time and all looks
good. With this release, you are now able to easily test Trino with Java 21.
Just use the Docker container in your deployment or testing with your own
pipeline or with the Trino Helm charts. The
new version 0.14.0 of the chart already uses the right JVM configuration and
Trino 432 by default.
Our plan is to make Java 21 the required runtime and move towards adopting the
new language features and libraries. However, before we do that, we want your
input. Are you ready to move to Java 21 for Trino? Did you do some testing with
it already? Are there any issue you encounters? We want to know all about your
experience. Find us on the Trino community chat and ping us in the #dev
channel. Or leave comments in our
Java 21 tracking issue.
We want to hear from you. Any input and feedback is welcome.
Update from 11 Jan 2024:
The release of Trino 436
includes the switch to Java 21 as a requirement for running Trino.
