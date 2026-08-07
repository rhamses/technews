---
title: "Trino Summit 2022 will be legendary"
link: "https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html"
guid: "https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html"
pubDate: "2022-09-22T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Commander Bun Bun is back and this year we have an exciting lineup of speakers.\nTopics range from architectures like data mesh and data lakehouse, to running\nTrino at scale with fault-tolerant execution, and query federation. This \nconference is free and takes place on November 10th. The summit is a hybrid\nevent for in-person and virtual attendance. Find out more details below!\nRegister for the summit\nThis year’s Trino Summit will be hosted at the Commonwealth Club in San \nFrancisco, CA. In-person registration is limited to 250 seats so make sure you\nregister quickly before spots run out!\n\n\nTrino Summit 2022 teaser\nGet ready to federate them all this year! Many times when folks think of Trino,\ntheir first instinct is to consider the data lake use case where it replaces\nHive or other data lakehouse query engines. However, this summit will also drill\ninto the lesser discussed query federation use case. Federate ‘em all!\nAnnouncing the first sessions and speakers\nWe have a full roster planned but here is a glance at a few full confirmed\nsessions. Stay tuned for future blog posts as we announce more session as they\nare confirmed!\nState of Trino keynote\nHear the latest on the state of the open source Trino project. Trino\nis the award-winning MPP SQL query engine. In this session, Trino creators\ndiscuss the latest features that have landed in the last year, the roadmap for\nthe year ahead, and community growth highlights.\nMartin Traverso, Co-Creator of Trino and CTO, Starburst\nDain Sundstrom, Co-Creator of Trino and CTO, Starburst\nDavid Phillips, Co-Creator of Trino and CTO, Starburst\nTrino for large scale ETL at Lyft\nAt Lyft, we are processing petabytes of data daily through Trino\nfor various use cases. A single query can execute as long as 4 hours with\nterabytes of memory reserved. There are quite many challenges to operate Trino\nETL at such a scale: how to make all queries as performant as possible with low\nfailures rates; how should we define clusters, routing groups and resource\ngroups for changing volume across a day; how to keep commitment to user SLOs\nduring unexpected spikes, etc.\nWe’ll share what we’ve done with our config tunings, large query/user\nidentifications, autoscaling and fault tolerant features to execute Trino at\nsuch a scale. We’ll also share our upcoming challenges and plans to move steps\nfurther with Trino adoption across the company.\nCharles Song, Senior Software Engineer at Lyft\nRewriting history: Migrating petabytes of data to Apache Iceberg using Trino\nDataset interoperability between data platform components continues to\nbe a difficult hurdle to overcome. This short coming often results in siloed\ndata and frustrated users. Although open table formats like Apache Iceberg aim\nto break down these silos by providing a consistent and scalable table\nabstraction, migrating your pre-existing data archive to a new format can still\nbe daunting. This talk will outline challenges we faced when rewriting petabytes\nof Shopify’s data into Iceberg table format using the Trino engine. A rapidly\nevolving landscape, I will highlight recent contributions to Trino’s Iceberg\nintegration that made our work possible while also illustrating how we designed\nour system to scale. Topics will include: what to consider when designing your\nmigration strategy, how we optimized Trino’s write performance and how to\nrecover from corrupt table states. Finally, I will compare the query performance\nof old and migrated datasets using Shopify’s datasets as benchmarks.\nMarc Laforet, Senior Data Engineer at Shopify\nFederating them all on Starburst Galaxy!\nYou’ve federated them all on Trino, but to beat the elite four at\nIndigo Plateau, every data trainer needs help. In this talk, I will cover how\nStarburst Galaxy is the fastest path to query federation and cover a demo that\ntrainers can follow later. We’ll also cover cool features like schema discovery\nand fault-tolerance execution. The queries we’ll run will be with Pokémon data\nso that you don’t have to witness yet another taxi cab or iris data set.\nMonica Miller, Developer Advocate at Starburst*\nUsing Trino with Apache Airflow for (almost) all your data problems\nTrino is incredibly effective at enabling users to extract insights\nquickly and effectively from large amount of data located in dispersed and\nheterogeneous federated data systems. However, some business data problems are\nmore complex than interactive analytics use cases, and are best broken down into\na sequence of interdependent steps, a.k.a. a workflow. For these use cases,\ndedicated software is often required in order to schedule and manage these\nprocesses with a principled approach. In this session, we will look at how we\ncan leverage Apache Airflow to orchestrate Trino queries into complex workflows\nthat solve practical batch processing problems, all the while avoiding the use\nof repetitive, redundant data movement.\nPhilippe Gagnon, Solutions Architect at Astronomer\nConclusion\nStay tuned for new developments in upcoming blog posts, don’t forget to\nregister, and always, federate them\nall!"
author: "Brian Olsen, Dain Sundstrom"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/trino-summit-2022/summit-logo.png\">\n    </p>\n    <p>Commander Bun Bun is back and this year we have an exciting lineup of speakers.\nTopics range from architectures like data mesh and data lakehouse, to running\nTrino at scale with fault-tolerant execution, and query federation. This \nconference is free and takes place on November 10th. The summit is a hybrid\nevent for in-person and virtual attendance. Find out more details below!</p>\n<!--more-->\n<h2 id=\"register-for-the-summit\">\n    Register for the summit <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#register-for-the-summit\">#</a>\n</h2>\n<p>This year’s Trino Summit will be hosted at the Commonwealth Club in San \nFrancisco, CA. In-person registration is limited to 250 seats so make sure you\nregister quickly before spots run out!</p>\n<h3 id=\"trino-summit-2022-teaser\">\n    Trino Summit 2022 teaser <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#trino-summit-2022-teaser\">#</a>\n</h3>\n<p>Get ready to federate them all this year! Many times when folks think of Trino,\ntheir first instinct is to consider the data lake use case where it replaces\nHive or other data lakehouse query engines. However, this summit will also drill\ninto the lesser discussed query federation use case. Federate ‘em all!</p>\n\n<h2 id=\"announcing-the-first-sessions-and-speakers\">\n    Announcing the first sessions and speakers <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#announcing-the-first-sessions-and-speakers\">#</a>\n</h2>\n<p>We have a full roster planned but here is a glance at a few full confirmed\nsessions. Stay tuned for future blog posts as we announce more session as they\nare confirmed!</p>\n<h3 id=\"state-of-trino-keynote\">\n    State of Trino keynote <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#state-of-trino-keynote\">#</a>\n</h3>\n<p>Hear the latest on the state of the open source Trino project. Trino\nis the award-winning MPP SQL query engine. In this session, Trino creators\ndiscuss the latest features that have landed in the last year, the roadmap for\nthe year ahead, and community growth highlights.</p>\n<ul>\n  <li>\n    <p><em>Martin Traverso, Co-Creator of Trino and CTO, Starburst</em></p>\n  </li>\n  <li>\n    <p><em>Dain Sundstrom, Co-Creator of Trino and CTO, Starburst</em></p>\n  </li>\n  <li>\n    <p><em>David Phillips, Co-Creator of Trino and CTO, Starburst</em></p>\n  </li>\n</ul>\n<h3 id=\"trino-for-large-scale-etl-at-lyft\">\n    Trino for large scale ETL at Lyft <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#trino-for-large-scale-etl-at-lyft\">#</a>\n</h3>\n<p>At Lyft, we are processing petabytes of data daily through Trino\nfor various use cases. A single query can execute as long as 4 hours with\nterabytes of memory reserved. There are quite many challenges to operate Trino\nETL at such a scale: how to make all queries as performant as possible with low\nfailures rates; how should we define clusters, routing groups and resource\ngroups for changing volume across a day; how to keep commitment to user SLOs\nduring unexpected spikes, etc.</p>\n<p>We’ll share what we’ve done with our config tunings, large query/user\nidentifications, autoscaling and fault tolerant features to execute Trino at\nsuch a scale. We’ll also share our upcoming challenges and plans to move steps\nfurther with Trino adoption across the company.</p>\n<ul>\n  <li><em>Charles Song, Senior Software Engineer at Lyft</em></li>\n</ul>\n<h3 id=\"rewriting-history-migrating-petabytes-of-data-to-apache-iceberg-using-trino\">\n    Rewriting history: Migrating petabytes of data to Apache Iceberg using Trino <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#rewriting-history-migrating-petabytes-of-data-to-apache-iceberg-using-trino\">#</a>\n</h3>\n<p>Dataset interoperability between data platform components continues to\nbe a difficult hurdle to overcome. This short coming often results in siloed\ndata and frustrated users. Although open table formats like Apache Iceberg aim\nto break down these silos by providing a consistent and scalable table\nabstraction, migrating your pre-existing data archive to a new format can still\nbe daunting. This talk will outline challenges we faced when rewriting petabytes\nof Shopify’s data into Iceberg table format using the Trino engine. A rapidly\nevolving landscape, I will highlight recent contributions to Trino’s Iceberg\nintegration that made our work possible while also illustrating how we designed\nour system to scale. Topics will include: what to consider when designing your\nmigration strategy, how we optimized Trino’s write performance and how to\nrecover from corrupt table states. Finally, I will compare the query performance\nof old and migrated datasets using Shopify’s datasets as benchmarks.</p>\n<ul>\n  <li><em>Marc Laforet, Senior Data Engineer at Shopify</em></li>\n</ul>\n<h3 id=\"federating-them-all-on-starburst-galaxy\">\n    Federating them all on Starburst Galaxy! <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#federating-them-all-on-starburst-galaxy\">#</a>\n</h3>\n<p>You’ve federated them all on Trino, but to beat the elite four at\nIndigo Plateau, every data trainer needs help. In this talk, I will cover how\nStarburst Galaxy is the fastest path to query federation and cover a demo that\ntrainers can follow later. We’ll also cover cool features like schema discovery\nand fault-tolerance execution. The queries we’ll run will be with Pokémon data\nso that you don’t have to witness yet another taxi cab or iris data set.</p>\n<ul>\n  <li>Monica Miller, Developer Advocate at Starburst*</li>\n</ul>\n<h3 id=\"using-trino-with-apache-airflow-for-almost-all-your-data-problems\">\n    Using Trino with Apache Airflow for (almost) all your data problems <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#using-trino-with-apache-airflow-for-almost-all-your-data-problems\">#</a>\n</h3>\n<p>Trino is incredibly effective at enabling users to extract insights\nquickly and effectively from large amount of data located in dispersed and\nheterogeneous federated data systems. However, some business data problems are\nmore complex than interactive analytics use cases, and are best broken down into\na sequence of interdependent steps, a.k.a. a workflow. For these use cases,\ndedicated software is often required in order to schedule and manage these\nprocesses with a principled approach. In this session, we will look at how we\ncan leverage Apache Airflow to orchestrate Trino queries into complex workflows\nthat solve practical batch processing problems, all the while avoiding the use\nof repetitive, redundant data movement.</p>\n<ul>\n  <li><em>Philippe Gagnon, Solutions Architect at Astronomer</em></li>\n</ul>\n<h2 id=\"conclusion\">\n    Conclusion <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/22/trino-summit-2022-teaser.html#conclusion\">#</a>\n</h2>\n<p>Stay tuned for new developments in upcoming blog posts, don’t forget to\n<a target=\"_blank\" href=\"https://www.starburst.io/info/trinosummit/\">register</a>, and always, federate them\nall!</p>\n  </div>\n</article>\n</div>"
---

Commander Bun Bun is back and this year we have an exciting lineup of speakers.
Topics range from architectures like data mesh and data lakehouse, to running
Trino at scale with fault-tolerant execution, and query federation. This 
conference is free and takes place on November 10th. The summit is a hybrid
event for in-person and virtual attendance. Find out more details below!
Register for the summit
This year’s Trino Summit will be hosted at the Commonwealth Club in San 
Francisco, CA. In-person registration is limited to 250 seats so make sure you
register quickly before spots run out!


Trino Summit 2022 teaser
Get ready to federate them all this year! Many times when folks think of Trino,
their first instinct is to consider the data lake use case where it replaces
Hive or other data lakehouse query engines. However, this summit will also drill
into the lesser discussed query federation use case. Federate ‘em all!
Announcing the first sessions and speakers
We have a full roster planned but here is a glance at a few full confirmed
sessions. Stay tuned for future blog posts as we announce more session as they
are confirmed!
State of Trino keynote
Hear the latest on the state of the open source Trino project. Trino
is the award-winning MPP SQL query engine. In this session, Trino creators
discuss the latest features that have landed in the last year, the roadmap for
the year ahead, and community growth highlights.
Martin Traverso, Co-Creator of Trino and CTO, Starburst
Dain Sundstrom, Co-Creator of Trino and CTO, Starburst
David Phillips, Co-Creator of Trino and CTO, Starburst
Trino for large scale ETL at Lyft
At Lyft, we are processing petabytes of data daily through Trino
for various use cases. A single query can execute as long as 4 hours with
terabytes of memory reserved. There are quite many challenges to operate Trino
ETL at such a scale: how to make all queries as performant as possible with low
failures rates; how should we define clusters, routing groups and resource
groups for changing volume across a day; how to keep commitment to user SLOs
during unexpected spikes, etc.
We’ll share what we’ve done with our config tunings, large query/user
identifications, autoscaling and fault tolerant features to execute Trino at
such a scale. We’ll also share our upcoming challenges and plans to move steps
further with Trino adoption across the company.
Charles Song, Senior Software Engineer at Lyft
Rewriting history: Migrating petabytes of data to Apache Iceberg using Trino
Dataset interoperability between data platform components continues to
be a difficult hurdle to overcome. This short coming often results in siloed
data and frustrated users. Although open table formats like Apache Iceberg aim
to break down these silos by providing a consistent and scalable table
abstraction, migrating your pre-existing data archive to a new format can still
be daunting. This talk will outline challenges we faced when rewriting petabytes
of Shopify’s data into Iceberg table format using the Trino engine. A rapidly
evolving landscape, I will highlight recent contributions to Trino’s Iceberg
integration that made our work possible while also illustrating how we designed
our system to scale. Topics will include: what to consider when designing your
migration strategy, how we optimized Trino’s write performance and how to
recover from corrupt table states. Finally, I will compare the query performance
of old and migrated datasets using Shopify’s datasets as benchmarks.
Marc Laforet, Senior Data Engineer at Shopify
Federating them all on Starburst Galaxy!
You’ve federated them all on Trino, but to beat the elite four at
Indigo Plateau, every data trainer needs help. In this talk, I will cover how
Starburst Galaxy is the fastest path to query federation and cover a demo that
trainers can follow later. We’ll also cover cool features like schema discovery
and fault-tolerance execution. The queries we’ll run will be with Pokémon data
so that you don’t have to witness yet another taxi cab or iris data set.
Monica Miller, Developer Advocate at Starburst*
Using Trino with Apache Airflow for (almost) all your data problems
Trino is incredibly effective at enabling users to extract insights
quickly and effectively from large amount of data located in dispersed and
heterogeneous federated data systems. However, some business data problems are
more complex than interactive analytics use cases, and are best broken down into
a sequence of interdependent steps, a.k.a. a workflow. For these use cases,
dedicated software is often required in order to schedule and manage these
processes with a principled approach. In this session, we will look at how we
can leverage Apache Airflow to orchestrate Trino queries into complex workflows
that solve practical batch processing problems, all the while avoiding the use
of repetitive, redundant data movement.
Philippe Gagnon, Solutions Architect at Astronomer
Conclusion
Stay tuned for new developments in upcoming blog posts, don’t forget to
register, and always, federate them
all!
