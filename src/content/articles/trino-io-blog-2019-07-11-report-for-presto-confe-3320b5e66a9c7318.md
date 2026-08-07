---
title: "A Report of First Ever Presto Conference Tokyo"
link: "https://trino.io/blog/2019/07/11/report-for-presto-conference-tokyo.html"
guid: "https://trino.io/blog/2019/07/11/report-for-presto-conference-tokyo.html"
pubDate: "2019-07-11T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Nowadays, Presto is getting much attraction from the various kind of companies all around \nthe world. Japan is not an exception. Many companies are using Presto as their primary data \nprocessing engine.\nTo keep in touch with each other among the community members in Japan, we have just held the \nfirst ever Presto conference in Tokyo with welcoming Presto creators, Dain Sundstrom, \nMartin Traverso and David Phillips. \nThe conference was hosted at the Tokyo office of Arm Treasure Data. \nThis article is the summary of the conference aiming to convey the excitement in the room.\n\nPresto: Current and Future\nFirst of all, Presto creators introduced their work in these days and software foundation \nlaunched in the last year. They covered the following changes and enhancements achieved by \nthe community recently.\nPresto Software Foundation\nNew Connectors\n    \nPhoenix\nElasticsearch\nApache Ranger\nAttendees can also learn several plans that will happen shortly.\nThe plan to support more complex pushdown to connectors\nCase-sensitive identifier\nTimestamp semantics\nDynamic filtering\nConnectors such as Iceberg, Kinesis, Druid.\nCoordinator high availability\nReading The Source Code of Presto\nTo make attendees get used to the technical talk about Presto in the conference, \nLeo provided a guide for walking around the source code of \nPresto code. Since the Presto source code repository is enormous, it must be helpful as \na leader to help developers explore the forest of the codebase.\n  \n  Reading The Source Code of Presto  from Taro L. Saito \nPresto At Arm Treasure Data\nThen Kai (it’s me) provides an overview of how Arm Treasure \nData uses Presto in their service. Presto is heavily used to support many enterprise use \ncases, including IoT data analysis, and it is becoming the hub component processing high \nthroughput workload from many kinds of clients such as Spark, ODBC and JDBC.\n  \n  Presto At Arm Treasure Data - 2019 Updates  from Taro L. Saito \nLarge Scale Migration from Hive to Presto in Yahoo! JAPAN\nWe could learn how hard to migrate large scale workload from Hive to Presto from the \npresentation given by Star from Yahoo! Japan. Quite a few people \nseem to be interested in the tool they have created to convert HiveQL into Presto SQL. They might \nhave faced the same type of challenges.\n  \n  Large scale migration fromHive to Presto at Yahoo! JAPAN  from Yahoo!デベロッパーネットワーク \nPresto At LINE\nLINE is the biggest company providing the mobile communication tool in Japan (say WhatsApp in Japan). \nWataru Yukawa, Yuya Ebihara gave us how \nthey can improve their platform with collaborating with the community. We could find difficulty \nand challenge primarily provoked by the dependencies on other Hadoop ecosystems such as HDFS and Spark.\n  \n  Presto conferencetokyo2019  from wyukawa  \nOne notable thing in the session was the question about the discussion of how to make the error \nmessage excellent provided by Presto. David and creators are genuinely caring about the error message \nshown by the system. To reduce the time consumed to deal with the inquiry about the error, improving \nthe error message is one of the best options. That’s the primary reason to maintain the error message \neasy to understand.\nQ&A Session\nAt the end of the conference, attendees got a chance to freely ask Presto creators about a bunch of \ntopics not only Presto technical thing but also their working style, or thoughts. Here is a part of \nthe list of Q&A talked at the conference.\nQ: What do you expect most from Japan community?\nConsidering the communication in the Israel community, gaining the diversity of the use case will make \nPresto better. We are expecting that kind of diversity. Japan surely has a unique community to solve \nthe difficulty. Having a Japanese slack channel might be a good idea to help each other :)\nQ: How do you review the pull request code? How to keep the quality of the code review process?\nCode review difficulty depends on the complexity of PR itself. We use IntelliJ extensively to read \nthe code base. There are mainly two things to keep the code review quality. One is that involving \nthe actual code review will make you a good reviewer. Another thing is automating minor checks \nsuch as code style. These things are helpful to keep the code review process functional.\nMake it readable is the most important thing in the Presto codebase.\nDo not use the abbreviation and slang because not everyone can understand these words at a glance\nWrite comment -> Write code -> Delete comment. That is the process to make the code readable itself.\nQ: SQL on Everything approach vs. pursuing the performance. Which direction should Presto move forward?\nIt depends on the community decision. However, along with the discussion with several companies \nin the community, even not a single company does not show much concern about the performance of Presto.\nWrap Up\nThis conference was the first ever Presto conference inviting the Presto creators in Tokyo. We were\nable to have an exciting discussion with the community developers and creators. One of the great \nthings we could find in the conference was the enthusiasm of creators to make Presto usable \nby every developer. They are genuinely caring about the error message checked by users, code \nquality read by developers. Thanks to this type of good usability from the viewpoint of both \nusers and developers, Presto keeps gaining attraction from the community.\nThat was a great time to have many conversations with the community members. We really appreciate \ndevelopers in the community and creators. Thank you so much for coming to the conference and see \nyou next time!\nReference\nPresto Conference Tokyo 2019\nReading The Source Code of Presto\nPresto At Arm Treasure Data - 2019 Updates\nLarge Scale Migration from Hive to Presto in Yahoo! JAPAN\nPresto At LINE"
author: "Kai Sasaki, Arm Treasure Data"
contentHtml: "<p>Nowadays, Presto is getting much attraction from the various kind of companies all around \nthe world. Japan is not an exception. Many companies are using Presto as their primary data \nprocessing engine.</p>\n\n<p>To keep in touch with each other among the community members in Japan, we have just held the \nfirst ever Presto conference in Tokyo with welcoming Presto creators, <a href=\"https://github.com/dain\">Dain Sundstrom</a>, \n<a href=\"https://github.com/martint\">Martin Traverso</a> and <a href=\"https://github.com/electrum\">David Phillips</a>. \nThe conference was hosted at the Tokyo office of <a href=\"https://www.treasuredata.com/\">Arm Treasure Data</a>. \nThis article is the summary of the conference aiming to convey the excitement in the room.</p>\n\n<p><img src=\"/assets/blog/presto-conference-tokyo/overall-view.jpg\" alt=\"\" /></p>\n\n<!--more-->\n\n<h1 id=\"presto-current-and-future\">Presto: Current and Future</h1>\n\n<p>First of all, Presto creators introduced their work in these days and software foundation \nlaunched in the last year. They covered the following changes and enhancements achieved by \nthe community recently.</p>\n\n<ul>\n  <li>Presto Software Foundation</li>\n  <li>New Connectors\n    <ul>\n      <li>Phoenix</li>\n      <li>Elasticsearch</li>\n      <li>Apache Ranger</li>\n    </ul>\n  </li>\n</ul>\n\n<p>Attendees can also learn several plans that will happen shortly.</p>\n\n<ul>\n  <li>The plan to support more complex pushdown to connectors</li>\n  <li>Case-sensitive identifier</li>\n  <li>Timestamp semantics</li>\n  <li>Dynamic filtering</li>\n  <li>Connectors such as Iceberg, Kinesis, Druid.</li>\n  <li>Coordinator high availability</li>\n</ul>\n\n<h1 id=\"reading-the-source-code-of-presto\">Reading The Source Code of Presto</h1>\n\n<p>To make attendees get used to the technical talk about Presto in the conference, \n<a href=\"https://github.com/xerial\">Leo</a> provided a guide for walking around the source code of \nPresto code. Since the Presto source code repository is enormous, it must be helpful as \na leader to help developers explore the forest of the codebase.</p>\n\n<div style=\"text-align: center;\">\n <div style=\"margin-bottom:5px\"> <strong> <a href=\"//www.slideshare.net/taroleo/reading-the-source-code-of-presto\" title=\"Reading The Source Code of Presto\" target=\"_blank\">Reading The Source Code of Presto</a> </strong> from <strong><a href=\"https://www.slideshare.net/taroleo\" target=\"_blank\">Taro L. Saito</a></strong> </div>\n</div>\n\n<h1 id=\"presto-at-arm-treasure-data\">Presto At Arm Treasure Data</h1>\n\n<p>Then <a href=\"https://github.com/Lewuathe\">Kai</a> (it’s me) provides an overview of how Arm Treasure \nData uses Presto in their service. Presto is heavily used to support many enterprise use \ncases, including IoT data analysis, and it is becoming the hub component processing high \nthroughput workload from many kinds of clients such as Spark, ODBC and JDBC.</p>\n\n<div style=\"text-align: center;\">\n <div style=\"margin-bottom:5px\"> <strong> <a href=\"//www.slideshare.net/taroleo/presto-at-arm-treasure-data-2019-updates\" title=\"Presto At Arm Treasure Data - 2019 Updates\" target=\"_blank\">Presto At Arm Treasure Data - 2019 Updates</a> </strong> from <strong><a href=\"https://www.slideshare.net/taroleo\" target=\"_blank\">Taro L. Saito</a></strong> </div>\n</div>\n\n<h1 id=\"large-scale-migration-from-hive-to-presto-in-yahoo-japan\">Large Scale Migration from Hive to Presto in Yahoo! JAPAN</h1>\n\n<p>We could learn how hard to migrate large scale workload from Hive to Presto from the \npresentation given by <a href=\"https://github.com/oneonestar\">Star</a> from Yahoo! Japan. Quite a few people \nseem to be interested in the tool they have created to convert HiveQL into Presto SQL. They might \nhave faced the same type of challenges.</p>\n\n<div style=\"text-align: center;\">\n <div style=\"margin-bottom:5px\"> <strong> <a href=\"//www.slideshare.net/techblogyahoo/large-scale-migration-fromhive-to-presto-at-yahoo-japan\" title=\"Large scale migration fromHive to Presto at Yahoo! JAPAN\" target=\"_blank\">Large scale migration fromHive to Presto at Yahoo! JAPAN</a> </strong> from <strong><a href=\"https://www.slideshare.net/techblogyahoo\" target=\"_blank\">Yahoo!デベロッパーネットワーク</a></strong> </div>\n</div>\n\n<h1 id=\"presto-at-line\">Presto At LINE</h1>\n\n<p>LINE is the biggest company providing the mobile communication tool in Japan (say WhatsApp in Japan). \n<a href=\"https://github.com/wyukawa\">Wataru Yukawa</a>, <a href=\"https://github.com/ebyhr\">Yuya Ebihara</a> gave us how \nthey can improve their platform with collaborating with the community. We could find difficulty \nand challenge primarily provoked by the dependencies on other Hadoop ecosystems such as HDFS and Spark.</p>\n\n<div style=\"text-align: center;\">\n <div style=\"margin-bottom:5px\"> <strong> <a href=\"//www.slideshare.net/wyukawa/presto-conferencetokyo2019\" title=\"Presto conferencetokyo2019\" target=\"_blank\">Presto conferencetokyo2019</a> </strong> from <strong><a href=\"https://www.slideshare.net/wyukawa\" target=\"_blank\">wyukawa </a></strong> </div>\n</div>\n\n<p>One notable thing in the session was the question about the discussion of how to make the error \nmessage excellent provided by Presto. David and creators are genuinely caring about the error message \nshown by the system. To reduce the time consumed to deal with the inquiry about the error, improving \nthe error message is one of the best options. That’s the primary reason to maintain the error message \neasy to understand.</p>\n\n<h1 id=\"qa-session\">Q&amp;A Session</h1>\n\n<p>At the end of the conference, attendees got a chance to freely ask Presto creators about a bunch of \ntopics not only Presto technical thing but also their working style, or thoughts. Here is a part of \nthe list of Q&amp;A talked at the conference.</p>\n\n<p>Q: What do you expect most from Japan community?</p>\n<blockquote>\n  <p>Considering the communication in the Israel community, gaining the diversity of the use case will make \nPresto better. We are expecting that kind of diversity. Japan surely has a unique community to solve \nthe difficulty. Having a Japanese slack channel might be a good idea to help each other :)</p>\n</blockquote>\n\n<p>Q: How do you review the pull request code? How to keep the quality of the code review process?</p>\n<blockquote>\n  <p>Code review difficulty depends on the complexity of PR itself. We use IntelliJ extensively to read \nthe code base. There are mainly two things to keep the code review quality. One is that involving \nthe actual code review will make you a good reviewer. Another thing is automating minor checks \nsuch as code style. These things are helpful to keep the code review process functional.</p>\n</blockquote>\n\n<blockquote>\n  <p>Make it readable is the most important thing in the Presto codebase.</p>\n  <ul>\n    <li>Do not use the abbreviation and slang because not everyone can understand these words at a glance</li>\n    <li>Write comment -&gt; Write code -&gt; Delete comment. That is the process to make the code readable itself.</li>\n  </ul>\n</blockquote>\n\n<p>Q: SQL on Everything approach vs. pursuing the performance. Which direction should Presto move forward?</p>\n<blockquote>\n  <p>It depends on the community decision. However, along with the discussion with several companies \nin the community, even not a single company does not show much concern about the performance of Presto.</p>\n</blockquote>\n\n<h1 id=\"wrap-up\">Wrap Up</h1>\n\n<p>This conference was the first ever Presto conference inviting the Presto creators in Tokyo. We were\nable to have an exciting discussion with the community developers and creators. One of the great \nthings we could find in the conference was the enthusiasm of creators to make Presto usable \nby every developer. They are genuinely caring about the error message checked by users, code \nquality read by developers. Thanks to this type of good usability from the viewpoint of both \nusers and developers, Presto keeps gaining attraction from the community.</p>\n\n<p>That was a great time to have many conversations with the community members. We really appreciate \ndevelopers in the community and creators. Thank you so much for coming to the conference and see \nyou next time!</p>\n\n<h1 id=\"reference\">Reference</h1>\n\n<ul>\n  <li><a href=\"https://techplay.jp/event/733772\">Presto Conference Tokyo 2019</a></li>\n  <li><a href=\"https://www.slideshare.net/taroleo/reading-the-source-code-of-presto\">Reading The Source Code of Presto</a></li>\n  <li><a href=\"https://www.slideshare.net/taroleo/presto-at-arm-treasure-data-2019-updates\">Presto At Arm Treasure Data - 2019 Updates</a></li>\n  <li><a href=\"https://www.slideshare.net/techblogyahoo/large-scale-migration-fromhive-to-presto-at-yahoo-japan\">Large Scale Migration from Hive to Presto in Yahoo! JAPAN</a></li>\n  <li><a href=\"https://www.slideshare.net/wyukawa/presto-conferencetokyo2019\">Presto At LINE</a></li>\n</ul>"
---

Nowadays, Presto is getting much attraction from the various kind of companies all around 
the world. Japan is not an exception. Many companies are using Presto as their primary data 
processing engine.
To keep in touch with each other among the community members in Japan, we have just held the 
first ever Presto conference in Tokyo with welcoming Presto creators, Dain Sundstrom, 
Martin Traverso and David Phillips. 
The conference was hosted at the Tokyo office of Arm Treasure Data. 
This article is the summary of the conference aiming to convey the excitement in the room.

Presto: Current and Future
First of all, Presto creators introduced their work in these days and software foundation 
launched in the last year. They covered the following changes and enhancements achieved by 
the community recently.
Presto Software Foundation
New Connectors
    
Phoenix
Elasticsearch
Apache Ranger
Attendees can also learn several plans that will happen shortly.
The plan to support more complex pushdown to connectors
Case-sensitive identifier
Timestamp semantics
Dynamic filtering
Connectors such as Iceberg, Kinesis, Druid.
Coordinator high availability
Reading The Source Code of Presto
To make attendees get used to the technical talk about Presto in the conference, 
Leo provided a guide for walking around the source code of 
Presto code. Since the Presto source code repository is enormous, it must be helpful as 
a leader to help developers explore the forest of the codebase.
  
  Reading The Source Code of Presto  from Taro L. Saito 
Presto At Arm Treasure Data
Then Kai (it’s me) provides an overview of how Arm Treasure 
Data uses Presto in their service. Presto is heavily used to support many enterprise use 
cases, including IoT data analysis, and it is becoming the hub component processing high 
throughput workload from many kinds of clients such as Spark, ODBC and JDBC.
  
  Presto At Arm Treasure Data - 2019 Updates  from Taro L. Saito 
Large Scale Migration from Hive to Presto in Yahoo! JAPAN
We could learn how hard to migrate large scale workload from Hive to Presto from the 
presentation given by Star from Yahoo! Japan. Quite a few people 
seem to be interested in the tool they have created to convert HiveQL into Presto SQL. They might 
have faced the same type of challenges.
  
  Large scale migration fromHive to Presto at Yahoo! JAPAN  from Yahoo!デベロッパーネットワーク 
Presto At LINE
LINE is the biggest company providing the mobile communication tool in Japan (say WhatsApp in Japan). 
Wataru Yukawa, Yuya Ebihara gave us how 
they can improve their platform with collaborating with the community. We could find difficulty 
and challenge primarily provoked by the dependencies on other Hadoop ecosystems such as HDFS and Spark.
  
  Presto conferencetokyo2019  from wyukawa  
One notable thing in the session was the question about the discussion of how to make the error 
message excellent provided by Presto. David and creators are genuinely caring about the error message 
shown by the system. To reduce the time consumed to deal with the inquiry about the error, improving 
the error message is one of the best options. That’s the primary reason to maintain the error message 
easy to understand.
Q&A Session
At the end of the conference, attendees got a chance to freely ask Presto creators about a bunch of 
topics not only Presto technical thing but also their working style, or thoughts. Here is a part of 
the list of Q&A talked at the conference.
Q: What do you expect most from Japan community?
Considering the communication in the Israel community, gaining the diversity of the use case will make 
Presto better. We are expecting that kind of diversity. Japan surely has a unique community to solve 
the difficulty. Having a Japanese slack channel might be a good idea to help each other :)
Q: How do you review the pull request code? How to keep the quality of the code review process?
Code review difficulty depends on the complexity of PR itself. We use IntelliJ extensively to read 
the code base. There are mainly two things to keep the code review quality. One is that involving 
the actual code review will make you a good reviewer. Another thing is automating minor checks 
such as code style. These things are helpful to keep the code review process functional.
Make it readable is the most important thing in the Presto codebase.
Do not use the abbreviation and slang because not everyone can understand these words at a glance
Write comment -> Write code -> Delete comment. That is the process to make the code readable itself.
Q: SQL on Everything approach vs. pursuing the performance. Which direction should Presto move forward?
It depends on the community decision. However, along with the discussion with several companies 
in the community, even not a single company does not show much concern about the performance of Presto.
Wrap Up
This conference was the first ever Presto conference inviting the Presto creators in Tokyo. We were
able to have an exciting discussion with the community developers and creators. One of the great 
things we could find in the conference was the enthusiasm of creators to make Presto usable 
by every developer. They are genuinely caring about the error message checked by users, code 
quality read by developers. Thanks to this type of good usability from the viewpoint of both 
users and developers, Presto keeps gaining attraction from the community.
That was a great time to have many conversations with the community members. We really appreciate 
developers in the community and creators. Thank you so much for coming to the conference and see 
you next time!
Reference
Presto Conference Tokyo 2019
Reading The Source Code of Presto
Presto At Arm Treasure Data - 2019 Updates
Large Scale Migration from Hive to Presto in Yahoo! JAPAN
Presto At LINE
