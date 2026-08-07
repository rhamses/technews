---
title: "Cinco de Trino recap: Learn how to build an efficient data lake"
link: "https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html"
guid: "https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html"
pubDate: "2022-05-17T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "When Trino (formerly PrestoSQL) arrived on the scene almost 10 years ago, it\nimmediately became known as the much faster alternative to the data warehouse\nof big data, Apache Hive. The use cases that you, as the community, have built\nhad far exceeded anything we had imagined in complexity. Together we’ve made \nTrino not only the fastest way to interactively query large data sets, but also\na convenient way to run federated queries across data sources to make moving all\nthe data optional.\nAt Cinco de Trino, we came full circle back to the next iteration of analytics \narchitecture with the data lake.  This conference offers advice from industry \nthought leaders about how to use best lakehouse tools with Trino to manage that \ndata complexity. Hear from industry thought leaders like Martin Traverso \n(Trino), Dain Sundstrom (Trino), James Campbell (Great Expectations), Jeremy \nCohen (DBT Labs), Ryan Blue (Iceberg), Denny Lee (Delta Lake), Vinoth Chandar \n(Hudi). You can watch the talks on-demand on the \nCinco de Trino playlist.\nIn this post, I’d like to cover the key items from each talk you won’t want to \nmiss.\nKeynote: Trino as a data lakehouse\nTrino co-creator, Martin Traverso, covers where Trino fits into the data lake \nand brings you a sneak peak of the future of a Trino. Polymorphic Table \nFunctions, adaptive query planning, are some of the many exciting features \nMartin walks us through.\n\n\nProject Tardigrade\nIf you have one takeaway from the conference, let it be this: there’s a new way\nin town to get 60% cost savings on your Trino deployment. Cory Darby walks\nthrough how utilizing the fault-tolerant execution architecture has enabled\nBlueCat to auto-scale their Trino clusters, and run over spot instances, which \nyielded massive cost savings. Zebing Lin goes through how this happens behind\nthe scenes, and how you can run resource-intensive ETL jobs using failure \nrecovery delivered by the team behind Project Tardigrade.\n\n\nLearn more in the Project Tardigrade blog »\nTry Project Tardigrade Yourself »\nStarburst Galaxy lab\nStarburst Galaxy enables you to get Trino up and running rather than spending\nyour time focusing on the setup, scaling, and maintaining the infrastructure.\nTrino co-creator, Dain Sundstrom, walks you through a fun-filled lab that\ndemonstrates how to use Trino as a service solution, Starburst Galaxy, to\ngenerate database rankings by ingesting,\ncleaning, and analyzing Twitter and Stack Overflow data.\n\n\nEngineering data reliability with Great Expectations\nLet’s be honest: when we claim to have run “tests” for our data pipelines, we \nusually mean we checked that input !=NULL, or that the dashboard isn’t broken. \nJames Campbell showcases the Great Expectations connector for Trino. The\nGreat Expectations connector is officially launched as the new way to write\nexpectations (data quality checks) for your code.\nWhat excites us the most?\nThe ability to take advantage of far more sophisticated data quality tests\nthan what any of us would write.\nHaving a really awesome UI to manage expectations.\nThe data source view that makes it easy to dynamically test your custom\ndata quality checks against backends.\n\n\nBring your data into your data lake with Airbyte\nThe first step of doing any analytics is bringing your data into the data lake.\nIngestion engines are a gamechanger for centralizing your data in the data lake.\nUp until recently, there were no open software to choose from in this category.\nIn just 10 minutes, Abhi Vaidyanatha takes us through the journey of taking in \ndata from various places into your choice of data lake.\n\n\nRead Abhi’s article about Airbyte + Trino »\nTransforming your data with dbt\nEver had 300 lines of SQL in front of you, and wasted lots of time sifting \nthrough the code to find which part of the code to edit to check for duplicate \ncustomers?\nImagine having to update decimal precision used frequently throughout that SQL\nstatement? What we <3 the most about DBT is that data engineering becomes much \nmore like software engineering, where you code in a much more modular way. Along\nthe way, you get many benefits: the one we love the most? Data lineage graph and\nautomatic documentation. That’s stuff we always say is important, but never do.\nEven for dbt experts, there’s something new to learn. Jeremy Cohen goes through\nnew capabilities Trino brings to dbt, while showcasing cool features like\nmacros: a flexible alternative to SQL defined functions.\n\n\nCheck out Jeremy’s demo repo »\nChoosing the best data lakehouse format for you\nEver wonder about all the hype with the new table formats? Why is everyone \nchoosing Iceberg, Delta Lake, Hudi, over Hive? The founders of each of these \nmodern table formats showcase each of these table formats and let you be the\njudge of which format makes more sense to your architecture. Below are the \nhighlights:\nIceberg\nRyan Blue dives into important elements of your data lakehouse architecture that\naffect daily operations and slow down developer efficiency. He then covers how\nIceberg is the solution he realized to solve those issues.\nThe two special elements of Iceberg is that it intentionally breaks \ncompatibility with the Hive format to bring you features like same table \npartition and schema evolution. I’m the surface this may seem trivial as we’ve \nconditioned our minds to accepting the limitations of hive-like formats.\nThe second special element is that Iceberg also builds a community-driven \nspecification that enables anyone to build out the same calls to use Iceberg \nlibrary.\n\n\nDelta Lake\n90% of the time that our Trino data pipelines break, it was because someone \ncommitted a bad upstream change. With Delta Lake time travel (coming soon!), you\nwon’t need to spend a whole day pinpointing that bad change: just travel back in\ntime and identify which change that was. Denny Lee gives us a compelling \nargument for why users desire ACID guarantees in their data lakehouse and how\nDelta Lake solves for that.\nSimilar to Iceberg, Delta lake offers optimistic concurrency, which allows there\nto be multiple writers to the same Delta Lake table while maintaining ACID\nconstrains on the data.\n\n\nHudi [Coming Soon to Trino]\nThe coolest part of the talk? Open up a world of new possibilities with near \nreal-time analytics in Trino with Hudi. With Hudi, you get to serve real-time \nproduction systems, debug live issues, and more.\nVinoth Chandar showcasing the compelling use cases that drove innovation around\nHudi at Uber. He then covers how he views the architecture of data lakes and\nlakehouses are starting to merge and the implications this has on the open \nversus proprietary architectures.\n\n\nTouch, talk, and see your data with Tableau\nTableau is our favorite data visualization tool, and in this session, Vlad \nUsatin of Tableau shares how to use Tableau to directly visualize your Trino \ndata.\n\n\nThank you to all who attended or viewed, we hope to see you again at our\nupcoming events later this year. Continue the conversation in our \nTrino Slack."
author: "Brian Olsen, Brian Zhan"
contentHtml: "<div>\n<article>\n  <div><p>When Trino (formerly PrestoSQL) arrived on the scene almost 10 years ago, it\nimmediately became known as the much faster alternative to the data warehouse\nof big data, Apache Hive. The use cases that you, as the community, have built\nhad far exceeded anything we had imagined in complexity. Together we’ve made \nTrino not only the fastest way to interactively query large data sets, but also\na convenient way to run federated queries across data sources to make moving all\nthe data optional.</p>\n<p>At Cinco de Trino, we came full circle back to the next iteration of analytics \narchitecture with the data lake.  This conference offers advice from industry \nthought leaders about how to use best lakehouse tools with Trino to manage that \ndata complexity. Hear from industry thought leaders like Martin Traverso \n(Trino), Dain Sundstrom (Trino), James Campbell (Great Expectations), Jeremy \nCohen (DBT Labs), Ryan Blue (Iceberg), Denny Lee (Delta Lake), Vinoth Chandar \n(Hudi). You can watch the talks on-demand on the \n<a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PLFnr63che7wYDHjUsmp43THLmAlqPDHlM\">Cinco de Trino playlist</a>.</p>\n<p>In this post, I’d like to cover the key items from each talk you won’t want to \nmiss.</p>\n<!--more-->\n<h3 id=\"keynote-trino-as-a-data-lakehouse\">\n    Keynote: Trino as a data lakehouse <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#keynote-trino-as-a-data-lakehouse\">#</a>\n</h3>\n<p>Trino co-creator, Martin Traverso, covers where Trino fits into the data lake \nand brings you a sneak peak of the future of a Trino. Polymorphic Table \nFunctions, adaptive query planning, are some of the many exciting features \nMartin walks us through.</p>\n\n<h3 id=\"project-tardigrade\">\n    Project Tardigrade <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#project-tardigrade\">#</a>\n</h3>\n<p>If you have one takeaway from the conference, let it be this: there’s a new way\nin town to get 60% cost savings on your Trino deployment. Cory Darby walks\nthrough how utilizing the fault-tolerant execution architecture has enabled\nBlueCat to auto-scale their Trino clusters, and run over spot instances, which \nyielded massive cost savings. Zebing Lin goes through how this happens behind\nthe scenes, and how you can run resource-intensive ETL jobs using failure \nrecovery delivered by the team behind Project Tardigrade.</p>\n\n<p><a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch\">Learn more in the Project Tardigrade blog&#160;»</a></p>\n<p><a target=\"_blank\" href=\"https://github.com/bitsondatadev/trino-getting-started/tree/main/kubernetes/tardigrade-eks\">Try Project Tardigrade Yourself&#160;»</a></p>\n<h3 id=\"starburst-galaxy-lab\">\n    Starburst Galaxy lab <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#starburst-galaxy-lab\">#</a>\n</h3>\n<p>Starburst Galaxy enables you to get Trino up and running rather than spending\nyour time focusing on the setup, scaling, and maintaining the infrastructure.\nTrino co-creator, Dain Sundstrom, walks you through a fun-filled lab that\ndemonstrates how to use Trino as a service solution, Starburst Galaxy, to\ngenerate <a target=\"_blank\" href=\"https://db-engines.com/en/ranking\">database rankings</a> by ingesting,\ncleaning, and analyzing Twitter and Stack Overflow data.</p>\n\n<h3 id=\"engineering-data-reliability-with-great-expectations\">\n    Engineering data reliability with Great Expectations <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#engineering-data-reliability-with-great-expectations\">#</a>\n</h3>\n<p>Let’s be honest: when we claim to have run “tests” for our data pipelines, we \nusually mean we checked that <code>input !=NULL</code>, or that the dashboard isn’t broken. \nJames Campbell showcases the Great Expectations connector for Trino. The\nGreat Expectations connector is officially launched as the new way to write\nexpectations (data quality checks) for your code.</p>\n<p>What excites us the most?</p>\n<ol>\n  <li>The ability to take advantage of far more sophisticated data quality tests\nthan what any of us would write.</li>\n  <li>Having a really awesome UI to manage expectations.</li>\n  <li>The data source view that makes it easy to dynamically test your custom\ndata quality checks against backends.</li>\n</ol>\n\n<h3 id=\"bring-your-data-into-your-data-lake-with-airbyte\">\n    Bring your data into your data lake with Airbyte <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#bring-your-data-into-your-data-lake-with-airbyte\">#</a>\n</h3>\n<p>The first step of doing any analytics is bringing your data into the data lake.\nIngestion engines are a gamechanger for centralizing your data in the data lake.\nUp until recently, there were no open software to choose from in this category.\nIn just 10 minutes, Abhi Vaidyanatha takes us through the journey of taking in \ndata from various places into your choice of data lake.</p>\n\n<p><a target=\"_blank\" href=\"https://abhi-vaidyanatha.medium.com/an-opinionated-guide-to-consolidating-your-data-b09386b2b9b5\">Read Abhi’s article about Airbyte + Trino&#160;»</a></p>\n<h3 id=\"transforming-your-data-with-dbt\">\n    Transforming your data with dbt <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#transforming-your-data-with-dbt\">#</a>\n</h3>\n<p>Ever had 300 lines of SQL in front of you, and wasted lots of time sifting \nthrough the code to find which part of the code to edit to check for duplicate \ncustomers?</p>\n<p>Imagine having to update decimal precision used frequently throughout that SQL\nstatement? What we &lt;3 the most about DBT is that data engineering becomes much \nmore like software engineering, where you code in a much more modular way. Along\nthe way, you get many benefits: the one we love the most? Data lineage graph and\nautomatic documentation. That’s stuff we always say is important, but never do.</p>\n<p>Even for dbt experts, there’s something new to learn. Jeremy Cohen goes through\nnew capabilities Trino brings to dbt, while showcasing cool features like\nmacros: a flexible alternative to SQL defined functions.</p>\n\n<p><a target=\"_blank\" href=\"https://github.com/dbt-labs/trino-dbt-tpch-demo\">Check out Jeremy’s demo repo&#160;»</a></p>\n<h2 id=\"choosing-the-best-data-lakehouse-format-for-you\">\n    Choosing the best data lakehouse format for you <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#choosing-the-best-data-lakehouse-format-for-you\">#</a>\n</h2>\n<p>Ever wonder about all the hype with the new table formats? Why is everyone \nchoosing Iceberg, Delta Lake, Hudi, over Hive? The founders of each of these \nmodern table formats showcase each of these table formats and let you be the\njudge of which format makes more sense to your architecture. Below are the \nhighlights:</p>\n<h3 id=\"iceberg\">\n    Iceberg <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#iceberg\">#</a>\n</h3>\n<p>Ryan Blue dives into important elements of your data lakehouse architecture that\naffect daily operations and slow down developer efficiency. He then covers how\nIceberg is the solution he realized to solve those issues.</p>\n<p>The two special elements of Iceberg is that it intentionally breaks \ncompatibility with the Hive format to bring you features like same table \npartition and schema evolution. I’m the surface this may seem trivial as we’ve \nconditioned our minds to accepting the limitations of hive-like formats.</p>\n<p>The second special element is that Iceberg also builds a community-driven \nspecification that enables anyone to build out the same calls to use Iceberg \nlibrary.</p>\n\n<h3 id=\"delta-lake\">\n    Delta Lake <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#delta-lake\">#</a>\n</h3>\n<p>90% of the time that our Trino data pipelines break, it was because someone \ncommitted a bad upstream change. With Delta Lake time travel (coming soon!), you\nwon’t need to spend a whole day pinpointing that bad change: just travel back in\ntime and identify which change that was. Denny Lee gives us a compelling \nargument for why users desire ACID guarantees in their data lakehouse and how\nDelta Lake solves for that.</p>\n<p>Similar to Iceberg, Delta lake offers optimistic concurrency, which allows there\nto be multiple writers to the same Delta Lake table while maintaining ACID\nconstrains on the data.</p>\n\n<h3 id=\"hudi-coming-soon-to-trino\">\n    Hudi [Coming Soon to Trino] <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#hudi-coming-soon-to-trino\">#</a>\n</h3>\n<p>The coolest part of the talk? Open up a world of new possibilities with near \nreal-time analytics in Trino with Hudi. With Hudi, you get to serve real-time \nproduction systems, debug live issues, and more.</p>\n<p>Vinoth Chandar showcasing the compelling use cases that drove innovation around\nHudi at Uber. He then covers how he views the architecture of data lakes and\nlakehouses are starting to merge and the implications this has on the open \nversus proprietary architectures.</p>\n\n<h3 id=\"touch-talk-and-see-your-data-with-tableau\">\n    Touch, talk, and see your data with Tableau <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/17/cinco-de-trino-recap.html#touch-talk-and-see-your-data-with-tableau\">#</a>\n</h3>\n<p>Tableau is our favorite data visualization tool, and in this session, Vlad \nUsatin of Tableau shares how to use Tableau to directly visualize your Trino \ndata.</p>\n\n<p>Thank you to all who attended or viewed, we hope to see you again at our\nupcoming events later this year. Continue the conversation in our \n<a target=\"_blank\" href=\"https://join.slack.com/t/trinodb/shared_invite/zt-18acr4bvr-0DtaCwiLOrv1zetGnV_w~w\">Trino Slack</a>.</p>\n  </div>\n</article>\n</div>"
---

When Trino (formerly PrestoSQL) arrived on the scene almost 10 years ago, it
immediately became known as the much faster alternative to the data warehouse
of big data, Apache Hive. The use cases that you, as the community, have built
had far exceeded anything we had imagined in complexity. Together we’ve made 
Trino not only the fastest way to interactively query large data sets, but also
a convenient way to run federated queries across data sources to make moving all
the data optional.
At Cinco de Trino, we came full circle back to the next iteration of analytics 
architecture with the data lake.  This conference offers advice from industry 
thought leaders about how to use best lakehouse tools with Trino to manage that 
data complexity. Hear from industry thought leaders like Martin Traverso 
(Trino), Dain Sundstrom (Trino), James Campbell (Great Expectations), Jeremy 
Cohen (DBT Labs), Ryan Blue (Iceberg), Denny Lee (Delta Lake), Vinoth Chandar 
(Hudi). You can watch the talks on-demand on the 
Cinco de Trino playlist.
In this post, I’d like to cover the key items from each talk you won’t want to 
miss.
Keynote: Trino as a data lakehouse
Trino co-creator, Martin Traverso, covers where Trino fits into the data lake 
and brings you a sneak peak of the future of a Trino. Polymorphic Table 
Functions, adaptive query planning, are some of the many exciting features 
Martin walks us through.


Project Tardigrade
If you have one takeaway from the conference, let it be this: there’s a new way
in town to get 60% cost savings on your Trino deployment. Cory Darby walks
through how utilizing the fault-tolerant execution architecture has enabled
BlueCat to auto-scale their Trino clusters, and run over spot instances, which 
yielded massive cost savings. Zebing Lin goes through how this happens behind
the scenes, and how you can run resource-intensive ETL jobs using failure 
recovery delivered by the team behind Project Tardigrade.


Learn more in the Project Tardigrade blog »
Try Project Tardigrade Yourself »
Starburst Galaxy lab
Starburst Galaxy enables you to get Trino up and running rather than spending
your time focusing on the setup, scaling, and maintaining the infrastructure.
Trino co-creator, Dain Sundstrom, walks you through a fun-filled lab that
demonstrates how to use Trino as a service solution, Starburst Galaxy, to
generate database rankings by ingesting,
cleaning, and analyzing Twitter and Stack Overflow data.


Engineering data reliability with Great Expectations
Let’s be honest: when we claim to have run “tests” for our data pipelines, we 
usually mean we checked that input !=NULL, or that the dashboard isn’t broken. 
James Campbell showcases the Great Expectations connector for Trino. The
Great Expectations connector is officially launched as the new way to write
expectations (data quality checks) for your code.
What excites us the most?
The ability to take advantage of far more sophisticated data quality tests
than what any of us would write.
Having a really awesome UI to manage expectations.
The data source view that makes it easy to dynamically test your custom
data quality checks against backends.


Bring your data into your data lake with Airbyte
The first step of doing any analytics is bringing your data into the data lake.
Ingestion engines are a gamechanger for centralizing your data in the data lake.
Up until recently, there were no open software to choose from in this category.
In just 10 minutes, Abhi Vaidyanatha takes us through the journey of taking in 
data from various places into your choice of data lake.


Read Abhi’s article about Airbyte + Trino »
Transforming your data with dbt
Ever had 300 lines of SQL in front of you, and wasted lots of time sifting 
through the code to find which part of the code to edit to check for duplicate 
customers?
Imagine having to update decimal precision used frequently throughout that SQL
statement? What we <3 the most about DBT is that data engineering becomes much 
more like software engineering, where you code in a much more modular way. Along
the way, you get many benefits: the one we love the most? Data lineage graph and
automatic documentation. That’s stuff we always say is important, but never do.
Even for dbt experts, there’s something new to learn. Jeremy Cohen goes through
new capabilities Trino brings to dbt, while showcasing cool features like
macros: a flexible alternative to SQL defined functions.


Check out Jeremy’s demo repo »
Choosing the best data lakehouse format for you
Ever wonder about all the hype with the new table formats? Why is everyone 
choosing Iceberg, Delta Lake, Hudi, over Hive? The founders of each of these 
modern table formats showcase each of these table formats and let you be the
judge of which format makes more sense to your architecture. Below are the 
highlights:
Iceberg
Ryan Blue dives into important elements of your data lakehouse architecture that
affect daily operations and slow down developer efficiency. He then covers how
Iceberg is the solution he realized to solve those issues.
The two special elements of Iceberg is that it intentionally breaks 
compatibility with the Hive format to bring you features like same table 
partition and schema evolution. I’m the surface this may seem trivial as we’ve 
conditioned our minds to accepting the limitations of hive-like formats.
The second special element is that Iceberg also builds a community-driven 
specification that enables anyone to build out the same calls to use Iceberg 
library.


Delta Lake
90% of the time that our Trino data pipelines break, it was because someone 
committed a bad upstream change. With Delta Lake time travel (coming soon!), you
won’t need to spend a whole day pinpointing that bad change: just travel back in
time and identify which change that was. Denny Lee gives us a compelling 
argument for why users desire ACID guarantees in their data lakehouse and how
Delta Lake solves for that.
Similar to Iceberg, Delta lake offers optimistic concurrency, which allows there
to be multiple writers to the same Delta Lake table while maintaining ACID
constrains on the data.


Hudi [Coming Soon to Trino]
The coolest part of the talk? Open up a world of new possibilities with near 
real-time analytics in Trino with Hudi. With Hudi, you get to serve real-time 
production systems, debug live issues, and more.
Vinoth Chandar showcasing the compelling use cases that drove innovation around
Hudi at Uber. He then covers how he views the architecture of data lakes and
lakehouses are starting to merge and the implications this has on the open 
versus proprietary architectures.


Touch, talk, and see your data with Tableau
Tableau is our favorite data visualization tool, and in this session, Vlad 
Usatin of Tableau shares how to use Tableau to directly visualize your Trino 
data.


Thank you to all who attended or viewed, we hope to see you again at our
upcoming events later this year. Continue the conversation in our 
Trino Slack.
