---
title: "Trino updates to Java 17"
link: "https://trino.io/blog/2022/07/14/trino-updates-to-java-17.html"
guid: "https://trino.io/blog/2022/07/14/trino-updates-to-java-17.html"
pubDate: "2022-07-14T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "You’ve already read the title, and it’s exciting news - as of Trino version 390,\nwhich releases today, Trino has officially been updated from Java 11 to Java 17.\nThis has a few implications, the most important of which is that if you aren’t\nrunning the Docker image (which automatically comes with the correct version of\nJava) and you’ve been running Trino on Java 16 or older, you’ll need to update\nJava to run Trino versions 390 and later. It’s also worth mentioning that newer\nversions of Java, such as Java 18 or 19, are not supported - they might work,\nbut they haven’t been tested or benchmarked - Java 17 is the new, recommended\nversion for Trino.\nThe reason this change is exciting is that using a new and better version of\nJava will make Trino better, too! This initial change is an update to the\nruntime version, or what the Trino engine uses while it runs. Because the Java\nlanguage performs slightly better on the whole with this update, you may see\nsome small, across-the-board performance improvements when switching from Java\n11 to Java 17. So when you’ve got the time, we strongly recommend making the\nupgrade!\nThe plan is to update the build to Java 17 a few weeks from now, which will also\nallow us to use Java 17 APIs and the changes to the language in Trino code. With\nnew language features, there are more tools in the development toolkit, and\nit’ll allow us to write cleaner and better code moving forwards.\nThis upgrade has been in the works for a while and been a long time coming, so\nif you want to learn more about the specifics, one of the best places to check\nthat out is the Trino Community Broadcast. Updating to Java 17 was the focus of\nepisode 36, and we also talked about it\npreviously in episode 35. If you want to\ncheck out the code changes that made this happen, you can view\nthe tracking issue on Github for\nmore information.\nAnd finally, we want to give a shoutout to Mateusz Gajewski\nfor all the hard work in driving this change."
author: "Cole Bowden"
contentHtml: "<div>\n<article>\n  <div><p>You’ve already read the title, and it’s exciting news - as of Trino version 390,\nwhich releases today, Trino has officially been updated from Java 11 to Java 17.\nThis has a few implications, the most important of which is that if you aren’t\nrunning the Docker image (which automatically comes with the correct version of\nJava) and you’ve been running Trino on Java 16 or older, you’ll need to update\nJava to run Trino versions 390 and later. It’s also worth mentioning that newer\nversions of Java, such as Java 18 or 19, are not supported - they might work,\nbut they haven’t been tested or benchmarked - Java 17 is the new, recommended\nversion for Trino.</p>\n<!--more-->\n<p>The reason this change is exciting is that using a new and better version of\nJava will make Trino better, too! This initial change is an update to the\nruntime version, or what the Trino engine uses while it runs. Because the Java\nlanguage performs slightly better on the whole with this update, you may see\nsome small, across-the-board performance improvements when switching from Java\n11 to Java 17. So when you’ve got the time, we strongly recommend making the\nupgrade!</p>\n<p>The plan is to update the build to Java 17 a few weeks from now, which will also\nallow us to use Java 17 APIs and the changes to the language in Trino code. With\nnew language features, there are more tools in the development toolkit, and\nit’ll allow us to write cleaner and better code moving forwards.</p>\n<p>This upgrade has been in the works for a while and been a long time coming, so\nif you want to learn more about the specifics, one of the best places to check\nthat out is the Trino Community Broadcast. Updating to Java 17 was the focus of\n<a target=\"_blank\" href=\"https://trino.io/episodes/36\">episode 36</a>, and we also talked about it\npreviously in <a target=\"_blank\" href=\"https://trino.io/episodes/35\">episode 35</a>. If you want to\ncheck out the code changes that made this happen, you can view\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/9876\">the tracking issue on Github</a> for\nmore information.</p>\n<p>And finally, we want to give a shoutout to <a target=\"_blank\" href=\"https://github.com/wendigo\">Mateusz Gajewski</a>\nfor all the hard work in driving this change.</p>\n  </div>\n</article>\n</div>"
---

You’ve already read the title, and it’s exciting news - as of Trino version 390,
which releases today, Trino has officially been updated from Java 11 to Java 17.
This has a few implications, the most important of which is that if you aren’t
running the Docker image (which automatically comes with the correct version of
Java) and you’ve been running Trino on Java 16 or older, you’ll need to update
Java to run Trino versions 390 and later. It’s also worth mentioning that newer
versions of Java, such as Java 18 or 19, are not supported - they might work,
but they haven’t been tested or benchmarked - Java 17 is the new, recommended
version for Trino.
The reason this change is exciting is that using a new and better version of
Java will make Trino better, too! This initial change is an update to the
runtime version, or what the Trino engine uses while it runs. Because the Java
language performs slightly better on the whole with this update, you may see
some small, across-the-board performance improvements when switching from Java
11 to Java 17. So when you’ve got the time, we strongly recommend making the
upgrade!
The plan is to update the build to Java 17 a few weeks from now, which will also
allow us to use Java 17 APIs and the changes to the language in Trino code. With
new language features, there are more tools in the development toolkit, and
it’ll allow us to write cleaner and better code moving forwards.
This upgrade has been in the works for a while and been a long time coming, so
if you want to learn more about the specifics, one of the best places to check
that out is the Trino Community Broadcast. Updating to Java 17 was the focus of
episode 36, and we also talked about it
previously in episode 35. If you want to
check out the code changes that made this happen, you can view
the tracking issue on Github for
more information.
And finally, we want to give a shoutout to Mateusz Gajewski
for all the hard work in driving this change.
