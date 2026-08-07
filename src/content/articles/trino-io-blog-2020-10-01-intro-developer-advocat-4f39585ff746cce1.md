---
title: "Hello I'm Brian, Presto Developer Advocate"
link: "https://trino.io/blog/2020/10/01/intro-developer-advocate.html"
guid: "https://trino.io/blog/2020/10/01/intro-developer-advocate.html"
pubDate: "2020-10-01T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Hello, Presto nation!\nMy name is Brian, and I’m a new developer advocate working at Starburst. Let me \ngive you a little background on how I got here, and cover how my role can help\nthe Presto community.\n\nMy career in computation and databases started in the military. As luck would\nhave it, I worked on a big data team as my first job out of college! I was in a\nHive shop that dealt with the typical outdated runtime and slow query\nturnaround. Eventually, our architect introduced us to Presto as an alternative.\nI worked with him to start testing and moving our existing use cases built on\nHive to use Presto. We also used Elasticsearch and had a few cases that needed\nto perform joins and unions over the datasets in both Elasticsearch and Hive.\nThere were a few use cases that were not going to immediately be transferable\nwithout some modification to the Presto Elasticsearch connector.\nJoining the Presto community\nThe first modification was adding support for Elasticsearch array \ntypes, and the second was, \nsupport for nested types. My \nfirst interaction with the Presto community was incredible! As a serial\nopen-source attempter, I always wanted to get invested in an open-source\nproject. I had started pull requests in various projects. Sometimes I ran into \nunpleasant maintainers, in other cases the rules were daunting or too confusing\nto start. I created a pull request only to have it sit there with no\ncommunication as to why it wasn’t accepted or even looked at. However, when I\nfirst joined Slack, I searched to see if there was already a\ndiscussion about array types in the history. I ran into a discussion between \nDain and Martin about this \nissue. I\nconversed with Martin, who was incredibly polite and willing to take time to \ndiscuss how this should be implemented.\nContributing\nWhen I actually pulled the code, I saw how well written and maintained it was\ncompared to many open-source projects I had seen in the past. I made a few\nchanges, wrote a test around my use case, and signed a CLA agreement. After a\ncouple of weeks, my pull request was merged and I had finally contributed to an\nopen-source project. After that interaction, and seeing the code, I wanted to do\nmore. I really saw something special with this community.\nWhile many Presto contributors are doing amazing work contributing code, I\nnoticed there were some holes in other areas of the community that needed to be\nfilled. I started answering questions on Slack, LinkedIn, and Twitter and I\nplanned out a Udemy course for Presto. The initial \nvideo I piloted is about tuning the memory\nconfiguration of Presto.\nBecoming a developer advocate\nAround this time I got into contact with some folks at Starburst about joining \nthem to work with the community and Presto full-time! As I joined, we hadn’t\nfigured out what my exact role was at Starburst. Eventually, we decided I would\nbest serve as a developer advocate. What I’ve come to find is this role is \naiming to do exactly what I set out to do before I joined. As a developer\nadvocate, I serve the community and act as a liaison between Starburst and the\nPresto community. Up until this time, that responsibility has been unofficially\nshared by many of the maintainers of Presto. I am here to simply take some of\nthat responsibility from them and focus all of my efforts on community growth\nand health.\nThe health of a community is difficult to define and is generally\nsubject to various signals that we can observe. These signals include an\nincrease in helpful interactions within the community, new members joining the\ncommunity, members who are actively engaging in the community, diversity of the\ncommunity, and more. If we start by focusing on making the community successful,\nthe success of the project will follow. Keeping the goal in mind that co-creator\nDavid Phillips mentions:\nThis is the type of project that we look at Postgres as the inspiration. \nPostgres started in the eighties, it became a SQL system in the nineties, and\nit’s still in active use and active development today. We say we want Presto\nto have the same kind of history. - David Phillips\nNext Steps\nMy first goal is to create a larger set of free learning materials, that expand\nupon my initial goals when planning for my Udemy course. I recently started a\nshow with Manfred Moser called the Presto Community Broadcast. The show landing \npage is here and contains all the information about the show\nschedule and where to find new and old episodes. This helps as we can use any\nrelevant material we create on this show for future teaching or blogs. We want\nthese live sessions to be interactive, and look forward to your feedback to\nunderstand if our efforts are actually helping, or if you have ideas to improve\nthe show. This show, along with blogs, documentation, and interactive tutorials\nare how I initially intend to fill some common questions that are received\nthrough our Slack and Stack \nOverflow channels. Another\ngoal of adding these materials is to attract new members to the community. Not\nall the material may be super relevant to the existing members of the community,\nbut this makes the community much more viable for newer members.\nOutside of providing new learning materials, your feedback helps us to\nunderstand common problems and allows us to fix them. This feedback will aid us\nin focusing on issues commonly voiced within the community but somehow get lost\nin translation. This could be improving the Presto code itself, or it could be\nmaking the documentation better, or to address common confusion, even if the\nconfusion comes from a force outside of the Presto community.\nFor example, I recently wrote a \nblog about\nsome shady benchmarketing practices that were painting Presto in a bad light. \nThe goal here was to make fun of the wildly bogus claims brought against Presto \nand the community. What better way to do that than to write a nerdy Justin\nBieber parody?\n\n\n\nWhile I have hopefully convinced you all of my mission here. I can’t accomplish\nany of this in a vacuum. The whole point of my work starts and ends with all of\nyou. I look forward to speaking with and one day post COVID-19, meeting you all\nat meetups and conferences. For now virtual meetups and the Presto Community\nBroadcast are a great start. If you have ideas or want to reach out to introduce\nyourself, you can find me on \nSlack or Twitter.\nThanks for reading this and being a part of this community. One last thing to\ntell you about myself, I’m a sucker for cheesy sign-offs so…\nFor fast data at resto, Presto is the besto!"
author: "Brian Olsen"
contentHtml: "<p>Hello, Presto nation!</p>\n\n<p>My name is Brian, and I’m a new developer advocate working at Starburst. Let me \ngive you a little background on how I got here, and cover how my role can help\nthe Presto community.</p>\n\n<p><img src=\"/assets/blog/developer-advocate/brian.jpg\" alt=\"\" /></p>\n\n<!--more-->\n\n<p>My career in computation and databases started in the military. As luck would\nhave it, I worked on a big data team as my first job out of college! I was in a\nHive shop that dealt with the typical outdated runtime and slow query\nturnaround. Eventually, our architect introduced us to Presto as an alternative.\nI worked with him to start testing and moving our existing use cases built on\nHive to use Presto. We also used Elasticsearch and had a few cases that needed\nto perform joins and unions over the datasets in both Elasticsearch and Hive.\nThere were a few use cases that were not going to immediately be transferable\nwithout some modification to the Presto Elasticsearch connector.</p>\n\n<h2 id=\"joining-the-presto-community\">Joining the Presto community</h2>\n\n<p>The first modification was <a href=\"https://github.com/trinodb/trino/issues/2441\">adding support for Elasticsearch array \ntypes</a>, and the second was, \n<a href=\"https://github.com/trinodb/trino/issues/754\">support for nested types</a>. My \nfirst interaction with the Presto community was incredible! As a serial\nopen-source attempter, I always wanted to get invested in an open-source\nproject. I had started pull requests in various projects. Sometimes I ran into \nunpleasant maintainers, in other cases the rules were daunting or too confusing\nto start. I created a pull request only to have it sit there with no\ncommunication as to why it wasn’t accepted or even looked at. However, when I\nfirst joined <a href=\"/slack.html\">Slack</a>, I searched to see if there was already a\ndiscussion about array types in the history. I ran into <a href=\"https://trinodb.slack.com/archives/CP1MUNEUX/p1570064139005900\">a discussion between \nDain and Martin about this \nissue</a>. I\nconversed with Martin, who was incredibly polite and willing to take time to \ndiscuss how this should be implemented.</p>\n\n<h2 id=\"contributing\">Contributing</h2>\n\n<p>When I actually pulled the code, I saw how well written and maintained it was\ncompared to many open-source projects I had seen in the past. I made a few\nchanges, wrote a test around my use case, and signed a CLA agreement. After a\ncouple of weeks, my pull request was merged and I had finally contributed to an\nopen-source project. After that interaction, and seeing the code, I wanted to do\nmore. I really saw something special with this community.</p>\n\n<p>While many Presto contributors are doing amazing work contributing code, I\nnoticed there were some holes in other areas of the community that needed to be\nfilled. I started answering questions on Slack, LinkedIn, and Twitter and I\nplanned out a Udemy course for Presto. The <a href=\"https://youtu.be/RPaG0Gu2I6c\">initial \nvideo</a> I piloted is about tuning the memory\nconfiguration of Presto.</p>\n\n<h2 id=\"becoming-a-developer-advocate\">Becoming a developer advocate</h2>\n\n<p>Around this time I got into contact with some folks at Starburst about joining \nthem to work with the community and Presto full-time! As I joined, we hadn’t\nfigured out what my exact role was at Starburst. Eventually, we decided I would\nbest serve as a developer advocate. What I’ve come to find is this role is \naiming to do exactly what I set out to do before I joined. As a developer\nadvocate, I serve the community and act as a liaison between Starburst and the\nPresto community. Up until this time, that responsibility has been unofficially\nshared by many of the maintainers of Presto. I am here to simply take some of\nthat responsibility from them and focus all of my efforts on community growth\nand health.</p>\n\n<p>The health of a community is difficult to define and is generally\nsubject to various signals that we can observe. These signals include an\nincrease in helpful interactions within the community, new members joining the\ncommunity, members who are actively engaging in the community, diversity of the\ncommunity, and more. If we start by focusing on making the community successful,\nthe success of the project will follow. Keeping the goal in mind that co-creator\nDavid Phillips mentions:</p>\n\n<blockquote>\n  <p>This is the type of project that we look at Postgres as the inspiration. \nPostgres started in the eighties, it became a SQL system in the nineties, and\nit’s still in active use and active development today. We say we want Presto\nto have the same kind of history. - David Phillips</p>\n</blockquote>\n\n<h2 id=\"next-steps\">Next Steps</h2>\n\n<p>My first goal is to create a larger set of free learning materials, that expand\nupon my initial goals when planning for my Udemy course. I recently started a\nshow with Manfred Moser called the Presto Community Broadcast. The show landing \npage is <a href=\"/broadcast.html\">here</a> and contains all the information about the show\nschedule and where to find new and old episodes. This helps as we can use any\nrelevant material we create on this show for future teaching or blogs. We want\nthese live sessions to be interactive, and look forward to your feedback to\nunderstand if our efforts are actually helping, or if you have ideas to improve\nthe show. This show, along with blogs, documentation, and interactive tutorials\nare how I initially intend to fill some common questions that are received\nthrough our <a href=\"/slack.html\">Slack</a> and <a href=\"https://stackoverflow.com/questions/tagged/presto\">Stack \nOverflow</a> channels. Another\ngoal of adding these materials is to attract new members to the community. Not\nall the material may be super relevant to the existing members of the community,\nbut this makes the community much more viable for newer members.</p>\n\n<p>Outside of providing new learning materials, your feedback helps us to\nunderstand common problems and allows us to fix them. This feedback will aid us\nin focusing on issues commonly voiced within the community but somehow get lost\nin translation. This could be improving the Presto code itself, or it could be\nmaking the documentation better, or to address common confusion, even if the\nconfusion comes from a force outside of the Presto community.</p>\n\n<p>For example, I recently <a href=\"https://bitsondata.dev/what-is-benchmarketing-and-why-is-it-bad/\">wrote a \nblog</a> about\nsome shady benchmarketing practices that were painting Presto in a bad light. \nThe goal here was to make fun of the wildly bogus claims brought against Presto \nand the community. What better way to do that than to write a nerdy Justin\nBieber parody?</p>\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p>While I have hopefully convinced you all of my mission here. I can’t accomplish\nany of this in a vacuum. The whole point of my work starts and ends with all of\nyou. I look forward to speaking with and one day post COVID-19, meeting you all\nat meetups and conferences. For now virtual meetups and the Presto Community\nBroadcast are a great start. If you have ideas or want to reach out to introduce\nyourself, you can find me on \n<a href=\"/slack.html\">Slack</a> or <a href=\"https://twitter.com/bitsondatadev\">Twitter</a>.</p>\n\n<p>Thanks for reading this and being a part of this community. One last thing to\ntell you about myself, I’m a sucker for cheesy sign-offs so…</p>\n\n<p><em>For fast data at resto, Presto is the besto!</em></p>"
---

Hello, Presto nation!
My name is Brian, and I’m a new developer advocate working at Starburst. Let me 
give you a little background on how I got here, and cover how my role can help
the Presto community.

My career in computation and databases started in the military. As luck would
have it, I worked on a big data team as my first job out of college! I was in a
Hive shop that dealt with the typical outdated runtime and slow query
turnaround. Eventually, our architect introduced us to Presto as an alternative.
I worked with him to start testing and moving our existing use cases built on
Hive to use Presto. We also used Elasticsearch and had a few cases that needed
to perform joins and unions over the datasets in both Elasticsearch and Hive.
There were a few use cases that were not going to immediately be transferable
without some modification to the Presto Elasticsearch connector.
Joining the Presto community
The first modification was adding support for Elasticsearch array 
types, and the second was, 
support for nested types. My 
first interaction with the Presto community was incredible! As a serial
open-source attempter, I always wanted to get invested in an open-source
project. I had started pull requests in various projects. Sometimes I ran into 
unpleasant maintainers, in other cases the rules were daunting or too confusing
to start. I created a pull request only to have it sit there with no
communication as to why it wasn’t accepted or even looked at. However, when I
first joined Slack, I searched to see if there was already a
discussion about array types in the history. I ran into a discussion between 
Dain and Martin about this 
issue. I
conversed with Martin, who was incredibly polite and willing to take time to 
discuss how this should be implemented.
Contributing
When I actually pulled the code, I saw how well written and maintained it was
compared to many open-source projects I had seen in the past. I made a few
changes, wrote a test around my use case, and signed a CLA agreement. After a
couple of weeks, my pull request was merged and I had finally contributed to an
open-source project. After that interaction, and seeing the code, I wanted to do
more. I really saw something special with this community.
While many Presto contributors are doing amazing work contributing code, I
noticed there were some holes in other areas of the community that needed to be
filled. I started answering questions on Slack, LinkedIn, and Twitter and I
planned out a Udemy course for Presto. The initial 
video I piloted is about tuning the memory
configuration of Presto.
Becoming a developer advocate
Around this time I got into contact with some folks at Starburst about joining 
them to work with the community and Presto full-time! As I joined, we hadn’t
figured out what my exact role was at Starburst. Eventually, we decided I would
best serve as a developer advocate. What I’ve come to find is this role is 
aiming to do exactly what I set out to do before I joined. As a developer
advocate, I serve the community and act as a liaison between Starburst and the
Presto community. Up until this time, that responsibility has been unofficially
shared by many of the maintainers of Presto. I am here to simply take some of
that responsibility from them and focus all of my efforts on community growth
and health.
The health of a community is difficult to define and is generally
subject to various signals that we can observe. These signals include an
increase in helpful interactions within the community, new members joining the
community, members who are actively engaging in the community, diversity of the
community, and more. If we start by focusing on making the community successful,
the success of the project will follow. Keeping the goal in mind that co-creator
David Phillips mentions:
This is the type of project that we look at Postgres as the inspiration. 
Postgres started in the eighties, it became a SQL system in the nineties, and
it’s still in active use and active development today. We say we want Presto
to have the same kind of history. - David Phillips
Next Steps
My first goal is to create a larger set of free learning materials, that expand
upon my initial goals when planning for my Udemy course. I recently started a
show with Manfred Moser called the Presto Community Broadcast. The show landing 
page is here and contains all the information about the show
schedule and where to find new and old episodes. This helps as we can use any
relevant material we create on this show for future teaching or blogs. We want
these live sessions to be interactive, and look forward to your feedback to
understand if our efforts are actually helping, or if you have ideas to improve
the show. This show, along with blogs, documentation, and interactive tutorials
are how I initially intend to fill some common questions that are received
through our Slack and Stack 
Overflow channels. Another
goal of adding these materials is to attract new members to the community. Not
all the material may be super relevant to the existing members of the community,
but this makes the community much more viable for newer members.
Outside of providing new learning materials, your feedback helps us to
understand common problems and allows us to fix them. This feedback will aid us
in focusing on issues commonly voiced within the community but somehow get lost
in translation. This could be improving the Presto code itself, or it could be
making the documentation better, or to address common confusion, even if the
confusion comes from a force outside of the Presto community.
For example, I recently wrote a 
blog about
some shady benchmarketing practices that were painting Presto in a bad light. 
The goal here was to make fun of the wildly bogus claims brought against Presto 
and the community. What better way to do that than to write a nerdy Justin
Bieber parody?



While I have hopefully convinced you all of my mission here. I can’t accomplish
any of this in a vacuum. The whole point of my work starts and ends with all of
you. I look forward to speaking with and one day post COVID-19, meeting you all
at meetups and conferences. For now virtual meetups and the Presto Community
Broadcast are a great start. If you have ideas or want to reach out to introduce
yourself, you can find me on 
Slack or Twitter.
Thanks for reading this and being a part of this community. One last thing to
tell you about myself, I’m a sucker for cheesy sign-offs so…
For fast data at resto, Presto is the besto!
