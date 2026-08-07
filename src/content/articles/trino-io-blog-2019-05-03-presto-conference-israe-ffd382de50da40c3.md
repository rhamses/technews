---
title: "A review of the first international Presto Conference, Tel Aviv, April 2019"
link: "https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html"
guid: "https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html"
pubDate: "2019-05-03T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Community, noun: “A feeling of fellowship with others, as a result of sharing common attributes, interests, and goals”\n\nThe fun picture you see here was taken at the first lecture of the First international\nPresto summit in Israel last month.\nThe atmosphere in the room during the various presentations was unique. It’s as if you\ncould physically feel the brainpower of 250 engineers fascinated by technology in one room.\nWe would like to share with you a bit of the content that was discussed during\nthe conference. Enjoy the read and the videos!\nPresto Software Foundation presentation\n\nThe day started with Dain Sundstrom,\nMartin Traverso, and\nDavid Phillips, Presto founders\nwho gave us a great panoramic view on Presto Software Foundation,\npast, present, and future roadmap.\nThe Presto founders presented in their talk the following topics:\nPresto foundation creation\nORC improvements\nThe complex pushdown algorithm in details\nThe opensource roadmap strategy and more\n\nYou can find the entire video of the presentation here and the\nslides here.\nVarada presentation\nDavid Krakov, co-founder and CTO at Varada\nexplained how Varada is an example of how Presto can be leveraged to create a new innovative technology that\nallows interactive analytics on top of a data lakes extracted sets, or in other words Presto for apps.\nDavid presented the three axes of innovation that the Varada team created, to achieve an indexed big\ndata on a distributed platform:\nSSD and NVMeF distributed calculation\nAll dimensions are indexed in the ingest process\nSynchronization\nFully automated copy management directly connected to the raw data in the data lake.\n\nYou can find the video of the presentation here and the slides\nhere.\nWiX open sourcing Quix\nThe big announcement of the conference came from Valery Florov\nof Wix. As a web-scale data-driven company, with 150M users, Wix has more than 1000 users\nof Presto, and over 100K daily queries.\nAll those queries come through a unified front end for data discovery, transformation, and query: the Quix\nIDE. Quix is simultaneously:\nA notebook manager for users to write and share executable notes\nDataset explorer showing catalogs and metadata\nFeature-rich SQL query editor\nJob scheduler for ETL jobs\nWix has open-sourced most of Quix, available under an MIT license at https://github.com/wix-incubator/quix\n\nAs a Presto centric company Wix has developed few more exciting enhancements:\nHBase + Parquet interleaving to mix compacted historic data and latest 14 days\nOne SQL - a query rewriter that unifies usage of Presto and BigQuery to one SQL\nActiveDirectory data security layer to control access to data\nGoogle Drive integration - run Presto SQL directly on Google Sheets. This is one of the coolest connectors\nto be created and generated a lot of excitement. Can’t wait for Wix to open source this one as well!\nSee more in the video,\nslides,\nsource code.\nIronsource -  Analyzing data at a petabyte scale.\nIronsource is the ad network of choice for the gaming industry.  Supplying\nsolutions for application developers, customer engagement solutions and Ad monetization. Ironsource collects\nterabytes of events on a daily basis.\nIn his talk, Or Koren, head of the data team at Ironsource, shared\ntheir journey from terabyte scale to petabyte scale. In his talk Or showed how their entire interactive\nanalytics platform was rebuilt to be based on Presto, and the huge savings they got from it including new\nbusiness insights coming from their data science teams and the data analyst team.\n\n      \n    \nThe before and after slides that Or presented in a very clear way the reduction in cost and the increase\nin efficiency that the use of Presto brought to Ironsource.\nSee Or’s slides here and the\ntalk video.\nDatorama on mutable data at scale\nA charismatic presenter, Alexey Finkelstein from\nSalesforce Datorama had the room rolling with laughter more than once, and\non a topic of no laughter: managing mutable data with Presto.  Datorama provides a marketing intelligence\nplatform. It has 30,000 customers, who can interactively interact with 1.5PB of data available for interactive\nqueries.\nDatorama provides for that a “data lake as a service”, called a DatoLake. Files on data lakes by their nature\nare not transactionally updatable on a row level, but the users of Datorama require the ability to delete/update\n specific rows in a transactional manner.\n\nTo solve this Datorma has embarked on a journey. Based on partitioning the data by a version number (such as\n 20190101_009), and rebuilding a partition based on updates.  There were 3 attempts to the journey and\nlearning on each step:\nAt first, using an external Postgres metastore to store the versions, swapping in the metastore and using\nthat as part of a sub-query to Presto to use the correct version. This approach did not pushdown partition pruning.\nNext, moving the metastore query to happen before query generation, and be dynamically generate the right filter\nat each sub-query. This approach required two-pass processing for each query and did not support direct SQL to clients.\nAnd finally, swapping the partition in the Hive Metastore in a transactional manner directly in the Hive Metastore\ndatabase (MySQL), and refresh the Presto hive cache. With this approach, queries do not need to know about the\nversion change and full separation of the mutability logic from the query is achieved.\nSee much more details in the video, slides.\nVarada, Join Optimization and Dynamic filtering\nRoman Zeyde is Varada’s Presto architect. Roman has a unique\nalgorithmic background being a Talpiot graduate and an ex-Googler.\nRoman’s talk discussed a new approach to make Joins work faster. Varada will contribute Roman’s work on dynamic\nfiltering back to the community. Stay tuned :)\nThe talk went over the following major topics:\nPresto Cost Based Optimizer feature as a basis for Join optimization\nJoin optimzation strategies\nDynamic filtering in the application for join optimization\n\nRoman’s talk, slides.\nQ&A session\nThe event finished by an hour-long Q&A session led by Demi Ben-Ari, VP R&S at\nPanorays and co-founder of Big Things, an Israeli Meetup group having 5000 people listed,\nall fans of Big data technologies.\n\nSee you all in the Second international Presto Conference in Tel Aviv!"
author: "Ori Reshef, VP Product, Varada"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/Israel-2019/audience.jpg\">\n    </p>\n    <p><strong>Community</strong>, <em>noun</em>: “A feeling of fellowship with others, as a result of sharing common attributes, interests, and goals”</p>\n<p><img src=\"https://trino.io/assets/blog/Israel-2019/audience.jpg\" alt=\"\"></p>\n<p>The fun picture you see here was taken at the first lecture of the First international\nPresto summit in Israel last month.</p>\n<p>The atmosphere in the room during the various presentations was unique. It’s as if you\ncould physically feel the brainpower of 250 engineers fascinated by technology in one room.</p>\n<p>We would like to share with you a bit of the content that was discussed during\nthe conference. Enjoy the read and the videos!</p>\n<!--more-->\n<h2 id=\"presto-software-foundation-presentation\">\n    Presto Software Foundation presentation <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html#presto-software-foundation-presentation\">#</a>\n</h2>\n<p><img src=\"https://trino.io/assets/blog/Israel-2019/intro.jpg\" alt=\"\"></p>\n<p>The day started with <a target=\"_blank\" href=\"https://www.linkedin.com/in/dainsundstrom/\">Dain Sundstrom</a>,\n<a target=\"_blank\" href=\"https://www.linkedin.com/in/traversomartin/\">Martin Traverso</a>, and\n<a target=\"_blank\" href=\"https://www.linkedin.com/in/electrum/\">David Phillips</a>, Presto founders\nwho gave us a great panoramic view on <a target=\"_blank\" href=\"https://trino.io/foundation\">Presto Software Foundation</a>,\npast, present, and future roadmap.</p>\n<p>The Presto founders presented in their talk the following topics:</p>\n<ul>\n  <li>Presto foundation creation</li>\n  <li>ORC improvements</li>\n  <li>The complex pushdown algorithm in details</li>\n  <li>The opensource roadmap strategy and more</li>\n</ul>\n<p><img src=\"https://trino.io/assets/blog/Israel-2019/pushdown.jpg\" alt=\"\"></p>\n<p>You can find the entire video of the presentation <a target=\"_blank\" href=\"https://vimeo.com/331764101\">here</a> and the\nslides <a target=\"_blank\" href=\"https://www.slideshare.net/OriReshef/presto-summit-israel-201904\">here</a>.</p>\n<h2 id=\"varada-presentation\">\n    Varada presentation <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html#varada-presentation\">#</a>\n</h2>\n<p><a target=\"_blank\" href=\"https://www.linkedin.com/in/david-krakov/\">David Krakov</a>, co-founder and CTO at <a target=\"_blank\" href=\"https://varada.io/\">Varada</a>\nexplained how Varada is an example of how Presto can be leveraged to create a new innovative technology that\nallows interactive analytics on top of a data lakes extracted sets, or in other words Presto for apps.</p>\n<p>David presented the three axes of innovation that the Varada team created, to achieve an indexed big\ndata on a distributed platform:</p>\n<ul>\n  <li>SSD and NVMeF distributed calculation</li>\n  <li>All dimensions are indexed in the ingest process</li>\n  <li>Synchronization</li>\n  <li>Fully automated copy management directly connected to the raw data in the data lake.</li>\n</ul>\n<p><img src=\"https://trino.io/assets/blog/Israel-2019/varada1.png\" alt=\"\"></p>\n<p>You can find the video of the presentation <a target=\"_blank\" href=\"https://vimeo.com/331767154\">here</a> and the slides\n<a target=\"_blank\" href=\"https://www.slideshare.net/OriReshef/presto-for-apps-deck-varada-prestoconf\">here</a>.</p>\n<h2 id=\"wix-open-sourcing-quix\">\n    WiX open sourcing Quix <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html#wix-open-sourcing-quix\">#</a>\n</h2>\n<p>The big announcement of the conference came from <a target=\"_blank\" href=\"https://www.linkedin.com/in/valeryfrolov/\">Valery Florov</a>\nof <a target=\"_blank\" href=\"http://wix.com/\">Wix</a>. As a web-scale data-driven company, with 150M users, Wix has more than 1000 users\nof Presto, and over 100K daily queries.</p>\n<p>All those queries come through a unified front end for data discovery, transformation, and query: the Quix\nIDE. Quix is simultaneously:\nA notebook manager for users to write and share executable notes</p>\n<ul>\n  <li>Dataset explorer showing catalogs and metadata</li>\n  <li>Feature-rich SQL query editor</li>\n  <li>Job scheduler for ETL jobs</li>\n  <li>Wix has open-sourced most of Quix, available under an MIT license at https://github.com/wix-incubator/quix</li>\n</ul>\n<p><img src=\"https://trino.io/assets/blog/Israel-2019/wix.png\" alt=\"\"></p>\n<p>As a Presto centric company Wix has developed few more exciting enhancements:</p>\n<ul>\n  <li>HBase + Parquet interleaving to mix compacted historic data and latest 14 days</li>\n  <li>One SQL - a query rewriter that unifies usage of Presto and BigQuery to one SQL</li>\n  <li>ActiveDirectory data security layer to control access to data</li>\n  <li>Google Drive integration - run Presto SQL directly on Google Sheets. This is one of the coolest connectors\nto be created and generated a lot of excitement. Can’t wait for Wix to open source this one as well!</li>\n</ul>\n<p>See more in the <a target=\"_blank\" href=\"https://vimeo.com/331767442\">video</a>,\n<a target=\"_blank\" href=\"https://www.slideshare.net/OriReshef/quix-presto-ide-presto-summit-il\">slides</a>,\n<a target=\"_blank\" href=\"https://github.com/wix-incubator/quix\">source code</a>.</p>\n<h2 id=\"ironsource----analyzing-data-at-a-petabyte-scale\">\n    Ironsource -  Analyzing data at a petabyte scale. <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html#ironsource----analyzing-data-at-a-petabyte-scale\">#</a>\n</h2>\n<p><a target=\"_blank\" href=\"https://www.ironsrc.com/\">Ironsource</a> is the ad network of choice for the gaming industry.  Supplying\nsolutions for application developers, customer engagement solutions and Ad monetization. Ironsource collects\nterabytes of events on a daily basis.</p>\n<p>In his talk, <a target=\"_blank\" href=\"https://www.linkedin.com/in/korenor/\">Or Koren</a>, head of the data team at Ironsource, shared\ntheir journey from terabyte scale to petabyte scale. In his talk Or showed how their entire interactive\nanalytics platform was rebuilt to be based on Presto, and the huge savings they got from it including new\nbusiness insights coming from their data science teams and the data analyst team.</p>\n<p>The before and after slides that Or presented in a very clear way the reduction in cost and the increase\nin efficiency that the use of Presto brought to Ironsource.</p>\n<p>See Or’s slides <a target=\"_blank\" href=\"https://www.slideshare.net/OriReshef/data-analytics-at-a-petabyte-scale-final\">here</a> and the\ntalk <a target=\"_blank\" href=\"https://vimeo.com/333732300\">video</a>.</p>\n<h2 id=\"datorama-on-mutable-data-at-scale\">\n    Datorama on mutable data at scale <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html#datorama-on-mutable-data-at-scale\">#</a>\n</h2>\n<p>A charismatic presenter, <a target=\"_blank\" href=\"https://www.linkedin.com/in/afinkelstein/\">Alexey Finkelstein</a> from\n<a target=\"_blank\" href=\"https://datorama.com/\">Salesforce Datorama</a> had the room rolling with laughter more than once, and\non a topic of no laughter: managing mutable data with Presto.  Datorama provides a marketing intelligence\nplatform. It has 30,000 customers, who can interactively interact with 1.5PB of data available for interactive\nqueries.</p>\n<p>Datorama provides for that a “data lake as a service”, called a DatoLake. Files on data lakes by their nature\nare not transactionally updatable on a row level, but the users of Datorama require the ability to delete/update\n specific rows in a transactional manner.</p>\n<p><img src=\"https://trino.io/assets/blog/Israel-2019/datorama.png\" alt=\"\"></p>\n<p>To solve this Datorma has embarked on a journey. Based on partitioning the data by a version number (such as\n 20190101_<strong>009</strong>), and rebuilding a partition based on updates.  There were 3 attempts to the journey and\nlearning on each step:</p>\n<ul>\n  <li>At first, using an external Postgres metastore to store the versions, swapping in the metastore and using\nthat as part of a sub-query to Presto to use the correct version. This approach did not pushdown partition pruning.</li>\n  <li>Next, moving the metastore query to happen before query generation, and be dynamically generate the right filter\nat each sub-query. This approach required two-pass processing for each query and did not support direct SQL to clients.</li>\n  <li>And finally, swapping the partition in the Hive Metastore in a transactional manner directly in the Hive Metastore\ndatabase (MySQL), and refresh the Presto hive cache. With this approach, queries do not need to know about the\nversion change and full separation of the mutability logic from the query is achieved.</li>\n</ul>\n<p>See much more details in the <a target=\"_blank\" href=\"https://vimeo.com/333759030\">video</a>, <a target=\"_blank\" href=\"https://www.slideshare.net/OriReshef/mutable-data-scale\">slides</a>.</p>\n<h2 id=\"varada-join-optimization-and-dynamic-filtering\">\n    Varada, Join Optimization and Dynamic filtering <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html#varada-join-optimization-and-dynamic-filtering\">#</a>\n</h2>\n<p><a target=\"_blank\" href=\"https://www.linkedin.com/in/romanzeyde/\">Roman Zeyde</a> is Varada’s Presto architect. Roman has a unique\nalgorithmic background being a Talpiot graduate and an ex-Googler.</p>\n<p>Roman’s talk discussed a new approach to make Joins work faster. Varada will contribute Roman’s work on dynamic\nfiltering back to the community. Stay tuned :)</p>\n<p>The talk went over the following major topics:</p>\n<ul>\n  <li>Presto Cost Based Optimizer feature as a basis for Join optimization</li>\n  <li>Join optimzation strategies</li>\n  <li>Dynamic filtering in the application for join optimization</li>\n</ul>\n<p><img src=\"https://trino.io/assets/blog/Israel-2019/varada2.png\" alt=\"\"></p>\n<p>Roman’s <a target=\"_blank\" href=\"https://vimeo.com/331946107\">talk</a>, <a target=\"_blank\" href=\"https://www.slideshare.net/OriReshef/dynamic-filtering-for-presto-join-optimisation\">slides</a>.</p>\n<h2 id=\"qa-session\">\n    Q&amp;A session <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/03/Presto-Conference-Israel.html#qa-session\">#</a>\n</h2>\n<p>The event finished by an hour-long Q&amp;A session led by <a target=\"_blank\" href=\"https://www.linkedin.com/in/demibenari/\">Demi Ben-Ari</a>, VP R&amp;S at\n<a target=\"_blank\" href=\"https://www.panorays.com/\">Panorays</a> and co-founder of Big Things, an Israeli Meetup group having 5000 people listed,\nall fans of Big data technologies.</p>\n<p><img src=\"https://trino.io/assets/blog/Israel-2019/qa.jpg\" alt=\"\"></p>\n<p>See you all in the Second international Presto Conference in Tel Aviv!</p>\n  </div>\n</article>\n</div>"
---

Community, noun: “A feeling of fellowship with others, as a result of sharing common attributes, interests, and goals”

The fun picture you see here was taken at the first lecture of the First international
Presto summit in Israel last month.
The atmosphere in the room during the various presentations was unique. It’s as if you
could physically feel the brainpower of 250 engineers fascinated by technology in one room.
We would like to share with you a bit of the content that was discussed during
the conference. Enjoy the read and the videos!
Presto Software Foundation presentation

The day started with Dain Sundstrom,
Martin Traverso, and
David Phillips, Presto founders
who gave us a great panoramic view on Presto Software Foundation,
past, present, and future roadmap.
The Presto founders presented in their talk the following topics:
Presto foundation creation
ORC improvements
The complex pushdown algorithm in details
The opensource roadmap strategy and more

You can find the entire video of the presentation here and the
slides here.
Varada presentation
David Krakov, co-founder and CTO at Varada
explained how Varada is an example of how Presto can be leveraged to create a new innovative technology that
allows interactive analytics on top of a data lakes extracted sets, or in other words Presto for apps.
David presented the three axes of innovation that the Varada team created, to achieve an indexed big
data on a distributed platform:
SSD and NVMeF distributed calculation
All dimensions are indexed in the ingest process
Synchronization
Fully automated copy management directly connected to the raw data in the data lake.

You can find the video of the presentation here and the slides
here.
WiX open sourcing Quix
The big announcement of the conference came from Valery Florov
of Wix. As a web-scale data-driven company, with 150M users, Wix has more than 1000 users
of Presto, and over 100K daily queries.
All those queries come through a unified front end for data discovery, transformation, and query: the Quix
IDE. Quix is simultaneously:
A notebook manager for users to write and share executable notes
Dataset explorer showing catalogs and metadata
Feature-rich SQL query editor
Job scheduler for ETL jobs
Wix has open-sourced most of Quix, available under an MIT license at https://github.com/wix-incubator/quix

As a Presto centric company Wix has developed few more exciting enhancements:
HBase + Parquet interleaving to mix compacted historic data and latest 14 days
One SQL - a query rewriter that unifies usage of Presto and BigQuery to one SQL
ActiveDirectory data security layer to control access to data
Google Drive integration - run Presto SQL directly on Google Sheets. This is one of the coolest connectors
to be created and generated a lot of excitement. Can’t wait for Wix to open source this one as well!
See more in the video,
slides,
source code.
Ironsource -  Analyzing data at a petabyte scale.
Ironsource is the ad network of choice for the gaming industry.  Supplying
solutions for application developers, customer engagement solutions and Ad monetization. Ironsource collects
terabytes of events on a daily basis.
In his talk, Or Koren, head of the data team at Ironsource, shared
their journey from terabyte scale to petabyte scale. In his talk Or showed how their entire interactive
analytics platform was rebuilt to be based on Presto, and the huge savings they got from it including new
business insights coming from their data science teams and the data analyst team.

      
    
The before and after slides that Or presented in a very clear way the reduction in cost and the increase
in efficiency that the use of Presto brought to Ironsource.
See Or’s slides here and the
talk video.
Datorama on mutable data at scale
A charismatic presenter, Alexey Finkelstein from
Salesforce Datorama had the room rolling with laughter more than once, and
on a topic of no laughter: managing mutable data with Presto.  Datorama provides a marketing intelligence
platform. It has 30,000 customers, who can interactively interact with 1.5PB of data available for interactive
queries.
Datorama provides for that a “data lake as a service”, called a DatoLake. Files on data lakes by their nature
are not transactionally updatable on a row level, but the users of Datorama require the ability to delete/update
 specific rows in a transactional manner.

To solve this Datorma has embarked on a journey. Based on partitioning the data by a version number (such as
 20190101_009), and rebuilding a partition based on updates.  There were 3 attempts to the journey and
learning on each step:
At first, using an external Postgres metastore to store the versions, swapping in the metastore and using
that as part of a sub-query to Presto to use the correct version. This approach did not pushdown partition pruning.
Next, moving the metastore query to happen before query generation, and be dynamically generate the right filter
at each sub-query. This approach required two-pass processing for each query and did not support direct SQL to clients.
And finally, swapping the partition in the Hive Metastore in a transactional manner directly in the Hive Metastore
database (MySQL), and refresh the Presto hive cache. With this approach, queries do not need to know about the
version change and full separation of the mutability logic from the query is achieved.
See much more details in the video, slides.
Varada, Join Optimization and Dynamic filtering
Roman Zeyde is Varada’s Presto architect. Roman has a unique
algorithmic background being a Talpiot graduate and an ex-Googler.
Roman’s talk discussed a new approach to make Joins work faster. Varada will contribute Roman’s work on dynamic
filtering back to the community. Stay tuned :)
The talk went over the following major topics:
Presto Cost Based Optimizer feature as a basis for Join optimization
Join optimzation strategies
Dynamic filtering in the application for join optimization

Roman’s talk, slides.
Q&A session
The event finished by an hour-long Q&A session led by Demi Ben-Ari, VP R&S at
Panorays and co-founder of Big Things, an Israeli Meetup group having 5000 people listed,
all fans of Big data technologies.

See you all in the Second international Presto Conference in Tel Aviv!
