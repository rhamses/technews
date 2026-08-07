---
title: "CDC patterns in Apache Iceberg"
link: "https://trino.io/blog/2023/06/30/trino-fest-2023-apacheiceberg.html"
guid: "https://trino.io/blog/2023/06/30/trino-fest-2023-apacheiceberg.html"
pubDate: "2023-06-30T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Have you ever wanted to keep your data in a table and have an efficient way to\ninteract with them? Iceberg, an open standard table format, is\nexactly what you need. One of the great and unique features of the Iceberg\ntable format is its support for change data capture (CDC). Co-creator of\nApache Iceberg, Ryan Blue, presented at Trino Fest 2023 this past week detailing the CDC support\nand the trade-offs between different patterns that can be used for writing\nCDC streams into Iceberg tables.\n\n\n\n\n  Check out the slides!\n\nRecap\nTo begin, what is CDC and why should you use it? CDC is the idea that when\nrelational or transactional tables are modified, you emit an update stream.\nThis enables you to keep copies in sync by capturing changes to tables as\nthey happen. As Ryan states, “[CDC] is very lightweight on the source\ndatabase … rather than being super careful with what we run on the database,\nwhat we want to do is just make a copy of it very easily and maintain that\ncopy.” Ryan continues giving an example of a bank using a transactional table\nin Iceberg to offer some context on what’s going on.\nAlthough CDC has many advantages, there are also some problems that make it\ndifficult:\nLower latency means more work\nWrite amplification - the work necessary to balance the trade-offs between\nefficiency at write time and efficiency at read time\nBatch writes with double update and possible inconsistency\nRead requirements with the different types of deletes in a table\nWith these types of problems, the importance of the trade-offs between the\ndifferent patterns rise due to the need for utmost efficiency. The first\ntrade-offs that Ryan talks about are the storage trade-offs between using direct\nwrites and a change log table, which is considered the most important and often\noverlooked decision. The next trade-offs are in regards to the MERGE pattern’s\nchoice of lazy merge (merge-on-read) or eager merge (copy-on-write). In\naddition, the commit frequency trade-offs have different benefits depending on if you\nprefer it to be faster or slower. The change log pattern and MERGE pattern both\nhave benefits you may want, so Ryan suggests using a hybrid version of both that\nmay give you what you want from both patterns. With Iceberg, you have the choice and the\ndifferent CDC patterns can be supported for you to adjust your usage to your\nspecific needs. Check out the video and review the slides for more details!\nWant to read more about CDC? Check out some of Ryan Blue’s blog posts:\nHello, World of CDC! and CDC\nData Gremlins!\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Ryan Blue, Ryan Duan"
contentHtml: "<p>Have you ever wanted to keep your data in a table and have an efficient way to\ninteract with them? Iceberg, an open standard table format, is\nexactly what you need. One of the great and unique features of the Iceberg\ntable format is its support for change data capture (CDC). Co-creator of\nApache Iceberg, Ryan Blue, presented at <a href=\"/blog/2023/06/20/trino-fest-2023-recap.html\">Trino Fest 2023</a> this past week detailing the CDC support\nand the trade-offs between different patterns that can be used for writing\nCDC streams into Iceberg tables.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-fest-2023/TrinoFest2023Iceberg.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>To begin, what is CDC and why should you use it? CDC is the idea that when\nrelational or transactional tables are modified, you emit an update stream.\nThis enables you to keep copies in sync by capturing changes to tables as\nthey happen. As Ryan states, “[CDC] is very lightweight on the source\ndatabase … rather than being super careful with what we run on the database,\nwhat we want to do is just make a copy of it very easily and maintain that\ncopy.” Ryan continues giving an example of a bank using a transactional table\nin Iceberg to offer some context on what’s going on.</p>\n\n<p>Although CDC has many advantages, there are also some problems that make it\ndifficult:</p>\n\n<ul>\n  <li>Lower latency means more work</li>\n  <li>Write amplification - the work necessary to balance the trade-offs between\nefficiency at write time and efficiency at read time</li>\n  <li>Batch writes with double update and possible inconsistency</li>\n  <li>Read requirements with the different types of deletes in a table</li>\n</ul>\n\n<p>With these types of problems, the importance of the trade-offs between the\ndifferent patterns rise due to the need for utmost efficiency. The first\ntrade-offs that Ryan talks about are the storage trade-offs between using direct\nwrites and a change log table, which is considered the most important and often\noverlooked decision. The next trade-offs are in regards to the <code class=\"language-plaintext highlighter-rouge\">MERGE</code> pattern’s\nchoice of lazy merge (merge-on-read) or eager merge (copy-on-write). In\naddition, the commit frequency trade-offs have different benefits depending on if you\nprefer it to be faster or slower. The change log pattern and <code class=\"language-plaintext highlighter-rouge\">MERGE</code> pattern both\nhave benefits you may want, so Ryan suggests using a hybrid version of both that\nmay give you what you want from both patterns. With Iceberg, you have the choice and the\ndifferent CDC patterns can be supported for you to adjust your usage to your\nspecific needs. Check out the video and review the slides for more details!</p>\n\n<p>Want to read more about CDC? Check out some of Ryan Blue’s blog posts:\n<a href=\"https://tabular.io/blog/hello-world-of-cdc/\">Hello, World of CDC!</a> and <a href=\"https://tabular.io/blog/cdc-data-gremlins/\">CDC\nData Gremlins</a>!</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

Have you ever wanted to keep your data in a table and have an efficient way to
interact with them? Iceberg, an open standard table format, is
exactly what you need. One of the great and unique features of the Iceberg
table format is its support for change data capture (CDC). Co-creator of
Apache Iceberg, Ryan Blue, presented at Trino Fest 2023 this past week detailing the CDC support
and the trade-offs between different patterns that can be used for writing
CDC streams into Iceberg tables.




  Check out the slides!

Recap
To begin, what is CDC and why should you use it? CDC is the idea that when
relational or transactional tables are modified, you emit an update stream.
This enables you to keep copies in sync by capturing changes to tables as
they happen. As Ryan states, “[CDC] is very lightweight on the source
database … rather than being super careful with what we run on the database,
what we want to do is just make a copy of it very easily and maintain that
copy.” Ryan continues giving an example of a bank using a transactional table
in Iceberg to offer some context on what’s going on.
Although CDC has many advantages, there are also some problems that make it
difficult:
Lower latency means more work
Write amplification - the work necessary to balance the trade-offs between
efficiency at write time and efficiency at read time
Batch writes with double update and possible inconsistency
Read requirements with the different types of deletes in a table
With these types of problems, the importance of the trade-offs between the
different patterns rise due to the need for utmost efficiency. The first
trade-offs that Ryan talks about are the storage trade-offs between using direct
writes and a change log table, which is considered the most important and often
overlooked decision. The next trade-offs are in regards to the MERGE pattern’s
choice of lazy merge (merge-on-read) or eager merge (copy-on-write). In
addition, the commit frequency trade-offs have different benefits depending on if you
prefer it to be faster or slower. The change log pattern and MERGE pattern both
have benefits you may want, so Ryan suggests using a hybrid version of both that
may give you what you want from both patterns. With Iceberg, you have the choice and the
different CDC patterns can be supported for you to adjust your usage to your
specific needs. Check out the video and review the slides for more details!
Want to read more about CDC? Check out some of Ryan Blue’s blog posts:
Hello, World of CDC! and CDC
Data Gremlins!
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
