---
title: "Core Principles and Design Practices of OLAP Engines"
link: "https://trino.io/blog/2025/03/27/olap-principles-book.html"
guid: "https://trino.io/blog/2025/03/27/olap-principles-book.html"
pubDate: "2025-03-27T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Yiteng Xu and Yingju Gao are proudly announcing the new book “Core Principle and\nDesign Practices of OLAP Engines” from China Machine Press. This is great news\nfor the Trino community, since the book is based on the open source project\nTrino, specifically Trino 350. It took more than four years for the two authors\nto finish writing. All concepts and details are explained with Trino falvor and\ngeneralized to all OLAP engines. Let us walk throught the chapters and you will\nfind out the two author dive deep into the source code layer and bring you so\nmany treasures.\nAuthor introduction\nYiteng (Ivan) Xu: is a data security engineer and\nis currently utilizing Trino, Spark, and Calcite for SQL analysis. His work\nencompasses various scenarios, including data warehouse metrics, SQL\nauto-rewriting, SQL purpose detection, and the development of SQL-based\nPurpose-Aware Access Control System.\nYingju (Gary) Gao is an Apache Seatunnel PMC\nmember and the lead of the time series database team. He currently serves as the\ntechnical lead for the observability-engine team, and is responsible for\nbuilding the ecosystem for observability data, including metrics, trace, log,\nand event data, providing a high-performance, high-throughput data pipeline from\ningestion to consumption, storage, querying, and data warehousing. Additionally,\nhe oversees metrics stability, multi-tenant access, and user requirement\nintegration.\nBoth authors are passionate about sharing their technical knowledge. They have\ndelved deep into source code and excel in technical writing, breaking down\ncomplex underlying principles into a linear and comprehensible format for\nreaders. They firmly believe that sharing is a virtue and are committed to\ncontinuing their technical contributions.\nSo now it is time to get the book, or read on for a walk through of the content:\nWalk through\nLet’s have a look at the different chapters in a high-level walk through.\nPart 1: Background knowledge\nChapter 1: Introduce the concept of OLAP (Online Analytical Processing),\nprovide comparsion among different engines like Trino, Impala, Doris and others.\nChapter 2: Provides a comprehensive introduction to the Trino engine,\ncovering its principles, architecture, enterprise use cases, compilation, and\nexecution. It also compares Trino with the Presto project and introduces the\nSQL statements that are referenced throughout the book.\nPart 2: Core principles\nChapter 3: Offers an overview of the distributed SQL query process, serving\nas a high-level introduction to the subsequent chapters.\nChapter 4: Begins with the generation of query execution plans, including\nthe transformation of SQL into abstract syntax trees, semantic analysis, and the\ncreation of initial logical plans. It then delves into the theoretical knowledge\nof optimizers and the overall framework of the Trino optimizer.\nPart 3: Classic SQL\nChapter 5: Explains the generation and optimization of execution plans for\nSQL statements involving only TableScan, Filter, and Project operations,\nalong with their scheduling and execution processes.\nChapter 6: Focuses on SQL statements with Limit and Sort operations,\ndetailing the generation and optimization of execution plans, as well as their\nscheduling and execution.\nChapter 7: Introduces the basic principles of aggregate queries. It then\ncovers the generation and optimization of execution plans for grouped and\nnon-grouped aggregate SQL statements, along with their scheduling and execution\nprocesses.\nChapter 8: Discusses SQL statements with count distinct and multiple\naggregate operations, explaining the generation and optimization of execution\nplans, as well as their scheduling and execution. This includes the\nScatter-Gather model and MarkDistinct optimization. Finally, a complex SQL\nstatement is used to tie together the concepts from Chapters 5 to 8.\nPart 4: Data exchange mechanism\nChapter 9: Introduces the overall concept of data exchange mechanisms and\nhow data exchange is incorporated during the query optimization phase via the\nAddExchanges optimizer, along with the design principles for scheduling and\nexecution.\nChapter 10: Explains how tasks establish connections during the query\nscheduling phase and the mechanisms for upstream and downstream data flow during\nexecution. It also covers the principles of intra-task data exchange, RPC\ninteraction mechanisms, and analyzes backpressure, Limit semantics, and\nout-of-order request handling.\nPart 5: Plugin mechanisms and connectors\nChapter 11: Begins with an introduction to Trino’s plugin system and SPI\nmechanism, including plugin loading and JVM’s class loading principles. It then\ndissects connectors, covering metadata modules, read modules, pushdown\noptimization, and providing in-depth insights into connector design.\nChapter 12: Uses the example-http connector to help readers understand\nconnector design and implements a simple data source using Python’s Flask\nframework.\nPart 6: Function principles and development\nChapter 13: Provides an overview of Trino’s function system, including\nfunction types, lifecycle, and several function development methods. It delves\ninto the data structures and annotations related to functions and explains the\nfunction registration and parsing process during semantic analysis.\nChapter 14: Focuses on how to write a udf in practice. It covers\nannotation-based development methods for scalar functions, as well as low-level\ndevelopment methods using codeGen or methodHandle APIs. For aggregate\nfunctions, it introduces annotation-based development methods and low-level\nmethods where developers handle serialization and state on their own.\nWhy Trino?\nIn 2020, one of the authors, Yiteng Xu, encountered a scenario at work where\ndata needed to be read from two Hive instances, each modified by different\ninternal teams. The company’s infrastructure team attempted a simple solution by\nregistering virtual tables and using MapReduce for federated queries. However,\nthis approach proved inadequate for the agile analysis needs of data analysts,\nwith complex queries taking nearly 12 hours to complete. One mistake per SQL\nmeant an entire day was wasted.\nLater, another team researched and adopted Presto (before Trino became\nindependent). By adapting the Hive engine at the connector level, they enabled\nfederated queries across the two Hive instances without data migration or\nextensive code changes. Users only needed to be aware of a catalog prefix,\nmaking the process incredibly convenient. The author later had the opportunity\nto participate in the project and developed a strong interest in its source\ncode. The elegance of the open-source project, its plugin design, and the inner\nworkings of connectors and Airlift framework sparked a deep curiosity, leading\nthe author on a journey of source code exploration. As the PrestoSQL project was\nmore active and receptive to developer feedback, the author chose to continue\nfollowing the Trino project when it emerged in late 2020.\nGet your copy\nNow it is time for you to get your copy of Core Principles and Design Practices of OLAP Engines:\n\n\n    \n        Get the book from dangdang.com\n    \n    \n        Get the book from jd.com"
author: "Yiteng Xu, Yingju Gao, Manfred Moser"
contentHtml: "<p>Yiteng Xu and Yingju Gao are proudly announcing the new book “Core Principle and\nDesign Practices of OLAP Engines” from China Machine Press. This is great news\nfor the Trino community, since the book is based on the open source project\nTrino, specifically Trino 350. It took more than four years for the two authors\nto finish writing. All concepts and details are explained with Trino falvor and\ngeneralized to all OLAP engines. Let us walk throught the chapters and you will\nfind out the two author dive deep into the source code layer and bring you so\nmany treasures.</p>\n\n<!--more-->\n\n<h2 id=\"author-introduction\">Author introduction</h2>\n\n<p><a href=\"https://github.com/medsmeds\">Yiteng (Ivan) Xu</a>: is a data security engineer and\nis currently utilizing Trino, Spark, and Calcite for SQL analysis. His work\nencompasses various scenarios, including data warehouse metrics, SQL\nauto-rewriting, SQL purpose detection, and the development of SQL-based\nPurpose-Aware Access Control System.</p>\n\n<p><a href=\"https://github.com/garyelephant\">Yingju (Gary) Gao</a> is an Apache Seatunnel PMC\nmember and the lead of the time series database team. He currently serves as the\ntechnical lead for the observability-engine team, and is responsible for\nbuilding the ecosystem for observability data, including metrics, trace, log,\nand event data, providing a high-performance, high-throughput data pipeline from\ningestion to consumption, storage, querying, and data warehousing. Additionally,\nhe oversees metrics stability, multi-tenant access, and user requirement\nintegration.</p>\n\n<p>Both authors are passionate about sharing their technical knowledge. They have\ndelved deep into source code and excel in technical writing, breaking down\ncomplex underlying principles into a linear and comprehensible format for\nreaders. They firmly believe that sharing is a virtue and are committed to\ncontinuing their technical contributions.</p>\n\n<p>So now it is time to get the book, or read on for a walk through of the content:</p>\n\n<div class=\"card-deck spacer-30\">\n    <a class=\"btn btn-pink\" target=\"_blank\" href=\"https://product.dangdang.com/11974653727.html\">\n        Get the book from dangdang.com\n    </a>\n    <a class=\"btn btn-pink\" target=\"_blank\" href=\"https://item.m.jd.com/product/10136949561522.html\">\n        Get the book from jd.com\n    </a>\n</div>\n\n<h2 id=\"walk-through\">Walk through</h2>\n\n<p>Let’s have a look at the different chapters in a high-level walk through.</p>\n\n<h3 id=\"part-1-background-knowledge\">Part 1: Background knowledge</h3>\n\n<p><strong>Chapter 1</strong>: Introduce the concept of OLAP (Online Analytical Processing),\nprovide comparsion among different engines like Trino, Impala, Doris and others.</p>\n\n<p><strong>Chapter 2</strong>: Provides a comprehensive introduction to the Trino engine,\ncovering its principles, architecture, enterprise use cases, compilation, and\nexecution. It also compares Trino with the Presto project and introduces the\nSQL statements that are referenced throughout the book.</p>\n\n<h3 id=\"part-2-core-principles\">Part 2: Core principles</h3>\n\n<p><strong>Chapter 3</strong>: Offers an overview of the distributed SQL query process, serving\nas a high-level introduction to the subsequent chapters.</p>\n\n<p><strong>Chapter 4</strong>: Begins with the generation of query execution plans, including\nthe transformation of SQL into abstract syntax trees, semantic analysis, and the\ncreation of initial logical plans. It then delves into the theoretical knowledge\nof optimizers and the overall framework of the Trino optimizer.</p>\n\n<h3 id=\"part-3-classic-sql\">Part 3: Classic SQL</h3>\n\n<p><strong>Chapter 5</strong>: Explains the generation and optimization of execution plans for\nSQL statements involving only <code class=\"language-plaintext highlighter-rouge\">TableScan</code>, <code class=\"language-plaintext highlighter-rouge\">Filter</code>, and <code class=\"language-plaintext highlighter-rouge\">Project</code> operations,\nalong with their scheduling and execution processes.</p>\n\n<p><strong>Chapter 6</strong>: Focuses on SQL statements with <code class=\"language-plaintext highlighter-rouge\">Limit</code> and <code class=\"language-plaintext highlighter-rouge\">Sort</code> operations,\ndetailing the generation and optimization of execution plans, as well as their\nscheduling and execution.</p>\n\n<p><strong>Chapter 7</strong>: Introduces the basic principles of aggregate queries. It then\ncovers the generation and optimization of execution plans for grouped and\nnon-grouped aggregate SQL statements, along with their scheduling and execution\nprocesses.</p>\n\n<p><strong>Chapter 8</strong>: Discusses SQL statements with count distinct and multiple\naggregate operations, explaining the generation and optimization of execution\nplans, as well as their scheduling and execution. This includes the\n<code class=\"language-plaintext highlighter-rouge\">Scatter-Gather</code> model and <code class=\"language-plaintext highlighter-rouge\">MarkDistinct</code> optimization. Finally, a complex SQL\nstatement is used to tie together the concepts from Chapters 5 to 8.</p>\n\n<h3 id=\"part-4-data-exchange-mechanism\">Part 4: Data exchange mechanism</h3>\n\n<p><strong>Chapter 9</strong>: Introduces the overall concept of data exchange mechanisms and\nhow data exchange is incorporated during the query optimization phase via the\n<code class=\"language-plaintext highlighter-rouge\">AddExchanges</code> optimizer, along with the design principles for scheduling and\nexecution.</p>\n\n<p><strong>Chapter 10</strong>: Explains how tasks establish connections during the query\nscheduling phase and the mechanisms for upstream and downstream data flow during\nexecution. It also covers the principles of intra-task data exchange, RPC\ninteraction mechanisms, and analyzes backpressure, Limit semantics, and\nout-of-order request handling.</p>\n\n<h3 id=\"part-5-plugin-mechanisms-and-connectors\">Part 5: Plugin mechanisms and connectors</h3>\n\n<p><strong>Chapter 11</strong>: Begins with an introduction to Trino’s plugin system and SPI\nmechanism, including plugin loading and JVM’s class loading principles. It then\ndissects connectors, covering metadata modules, read modules, pushdown\noptimization, and providing in-depth insights into connector design.</p>\n\n<p><strong>Chapter 12</strong>: Uses the example-http connector to help readers understand\nconnector design and implements a simple data source using Python’s Flask\nframework.</p>\n\n<h3 id=\"part-6-function-principles-and-development\">Part 6: Function principles and development</h3>\n\n<p><strong>Chapter 13</strong>: Provides an overview of Trino’s function system, including\nfunction types, lifecycle, and several function development methods. It delves\ninto the data structures and annotations related to functions and explains the\nfunction registration and parsing process during semantic analysis.</p>\n\n<p><strong>Chapter 14</strong>: Focuses on how to write a udf in practice. It covers\nannotation-based development methods for scalar functions, as well as low-level\ndevelopment methods using <code class=\"language-plaintext highlighter-rouge\">codeGen</code> or <code class=\"language-plaintext highlighter-rouge\">methodHandle</code> APIs. For aggregate\nfunctions, it introduces annotation-based development methods and low-level\nmethods where developers handle serialization and state on their own.</p>\n\n<h3 id=\"why-trino\">Why Trino?</h3>\n\n<p>In 2020, one of the authors, Yiteng Xu, encountered a scenario at work where\ndata needed to be read from two Hive instances, each modified by different\ninternal teams. The company’s infrastructure team attempted a simple solution by\nregistering virtual tables and using MapReduce for federated queries. However,\nthis approach proved inadequate for the agile analysis needs of data analysts,\nwith complex queries taking nearly 12 hours to complete. One mistake per SQL\nmeant an entire day was wasted.</p>\n\n<p>Later, another team researched and adopted Presto (before Trino became\nindependent). By adapting the Hive engine at the connector level, they enabled\nfederated queries across the two Hive instances without data migration or\nextensive code changes. Users only needed to be aware of a catalog prefix,\nmaking the process incredibly convenient. The author later had the opportunity\nto participate in the project and developed a strong interest in its source\ncode. The elegance of the open-source project, its plugin design, and the inner\nworkings of connectors and Airlift framework sparked a deep curiosity, leading\nthe author on a journey of source code exploration. As the PrestoSQL project was\nmore active and receptive to developer feedback, the author chose to continue\nfollowing the Trino project when it emerged in late 2020.</p>\n\n<h2 id=\"get-your-copy\">Get your copy</h2>\n\n<p>Now it is time for you to get your copy of <strong>Core Principles and Design Practices of OLAP Engines</strong>:</p>\n\n<div class=\"card-deck spacer-30\">\n    <a class=\"btn btn-pink\" target=\"_blank\" href=\"https://product.dangdang.com/11974653727.html\">\n        Get the book from dangdang.com\n    </a>\n    <a class=\"btn btn-pink\" target=\"_blank\" href=\"https://item.m.jd.com/product/10136949561522.html\">\n        Get the book from jd.com\n    </a>\n</div>"
---

Yiteng Xu and Yingju Gao are proudly announcing the new book “Core Principle and
Design Practices of OLAP Engines” from China Machine Press. This is great news
for the Trino community, since the book is based on the open source project
Trino, specifically Trino 350. It took more than four years for the two authors
to finish writing. All concepts and details are explained with Trino falvor and
generalized to all OLAP engines. Let us walk throught the chapters and you will
find out the two author dive deep into the source code layer and bring you so
many treasures.
Author introduction
Yiteng (Ivan) Xu: is a data security engineer and
is currently utilizing Trino, Spark, and Calcite for SQL analysis. His work
encompasses various scenarios, including data warehouse metrics, SQL
auto-rewriting, SQL purpose detection, and the development of SQL-based
Purpose-Aware Access Control System.
Yingju (Gary) Gao is an Apache Seatunnel PMC
member and the lead of the time series database team. He currently serves as the
technical lead for the observability-engine team, and is responsible for
building the ecosystem for observability data, including metrics, trace, log,
and event data, providing a high-performance, high-throughput data pipeline from
ingestion to consumption, storage, querying, and data warehousing. Additionally,
he oversees metrics stability, multi-tenant access, and user requirement
integration.
Both authors are passionate about sharing their technical knowledge. They have
delved deep into source code and excel in technical writing, breaking down
complex underlying principles into a linear and comprehensible format for
readers. They firmly believe that sharing is a virtue and are committed to
continuing their technical contributions.
So now it is time to get the book, or read on for a walk through of the content:
Walk through
Let’s have a look at the different chapters in a high-level walk through.
Part 1: Background knowledge
Chapter 1: Introduce the concept of OLAP (Online Analytical Processing),
provide comparsion among different engines like Trino, Impala, Doris and others.
Chapter 2: Provides a comprehensive introduction to the Trino engine,
covering its principles, architecture, enterprise use cases, compilation, and
execution. It also compares Trino with the Presto project and introduces the
SQL statements that are referenced throughout the book.
Part 2: Core principles
Chapter 3: Offers an overview of the distributed SQL query process, serving
as a high-level introduction to the subsequent chapters.
Chapter 4: Begins with the generation of query execution plans, including
the transformation of SQL into abstract syntax trees, semantic analysis, and the
creation of initial logical plans. It then delves into the theoretical knowledge
of optimizers and the overall framework of the Trino optimizer.
Part 3: Classic SQL
Chapter 5: Explains the generation and optimization of execution plans for
SQL statements involving only TableScan, Filter, and Project operations,
along with their scheduling and execution processes.
Chapter 6: Focuses on SQL statements with Limit and Sort operations,
detailing the generation and optimization of execution plans, as well as their
scheduling and execution.
Chapter 7: Introduces the basic principles of aggregate queries. It then
covers the generation and optimization of execution plans for grouped and
non-grouped aggregate SQL statements, along with their scheduling and execution
processes.
Chapter 8: Discusses SQL statements with count distinct and multiple
aggregate operations, explaining the generation and optimization of execution
plans, as well as their scheduling and execution. This includes the
Scatter-Gather model and MarkDistinct optimization. Finally, a complex SQL
statement is used to tie together the concepts from Chapters 5 to 8.
Part 4: Data exchange mechanism
Chapter 9: Introduces the overall concept of data exchange mechanisms and
how data exchange is incorporated during the query optimization phase via the
AddExchanges optimizer, along with the design principles for scheduling and
execution.
Chapter 10: Explains how tasks establish connections during the query
scheduling phase and the mechanisms for upstream and downstream data flow during
execution. It also covers the principles of intra-task data exchange, RPC
interaction mechanisms, and analyzes backpressure, Limit semantics, and
out-of-order request handling.
Part 5: Plugin mechanisms and connectors
Chapter 11: Begins with an introduction to Trino’s plugin system and SPI
mechanism, including plugin loading and JVM’s class loading principles. It then
dissects connectors, covering metadata modules, read modules, pushdown
optimization, and providing in-depth insights into connector design.
Chapter 12: Uses the example-http connector to help readers understand
connector design and implements a simple data source using Python’s Flask
framework.
Part 6: Function principles and development
Chapter 13: Provides an overview of Trino’s function system, including
function types, lifecycle, and several function development methods. It delves
into the data structures and annotations related to functions and explains the
function registration and parsing process during semantic analysis.
Chapter 14: Focuses on how to write a udf in practice. It covers
annotation-based development methods for scalar functions, as well as low-level
development methods using codeGen or methodHandle APIs. For aggregate
functions, it introduces annotation-based development methods and low-level
methods where developers handle serialization and state on their own.
Why Trino?
In 2020, one of the authors, Yiteng Xu, encountered a scenario at work where
data needed to be read from two Hive instances, each modified by different
internal teams. The company’s infrastructure team attempted a simple solution by
registering virtual tables and using MapReduce for federated queries. However,
this approach proved inadequate for the agile analysis needs of data analysts,
with complex queries taking nearly 12 hours to complete. One mistake per SQL
meant an entire day was wasted.
Later, another team researched and adopted Presto (before Trino became
independent). By adapting the Hive engine at the connector level, they enabled
federated queries across the two Hive instances without data migration or
extensive code changes. Users only needed to be aware of a catalog prefix,
making the process incredibly convenient. The author later had the opportunity
to participate in the project and developed a strong interest in its source
code. The elegance of the open-source project, its plugin design, and the inner
workings of connectors and Airlift framework sparked a deep curiosity, leading
the author on a journey of source code exploration. As the PrestoSQL project was
more active and receptive to developer feedback, the author chose to continue
following the Trino project when it emerged in late 2020.
Get your copy
Now it is time for you to get your copy of Core Principles and Design Practices of OLAP Engines:


    
        Get the book from dangdang.com
    
    
        Get the book from jd.com
