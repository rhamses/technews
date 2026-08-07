---
title: "Trino's tenth birthday celebration recap"
link: "https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html"
guid: "https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html"
pubDate: "2022-09-12T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "What an exciting month we had in August! August marked the ten-year birthday of\nthe Trino project. Don’t worry if you missed all the excitment as we’ve\ncondensed it all in this post.\nBlog posts\nWe felt it necessary to chronicle the larger events that happened in the last\ndecade of the project through the lens of where we are today.\nWhy leaving Facebook/Meta was the best thing we could do for the Trino Community\nA decade of query engine innovation\nHappy tenth birthday Trino!\nWe shared these posts on HackerNews and the Facebook and the query innovation \nposts both hit the front page. This resulted in one of the largest amount of \npage views on the Trino website in a given day - more than 25k views!\n\nTrino ten-year timeline video\nAnother way we celebrated was creating an epic ten-year montage video that\nchronicles the incredible journey starting with the Presto project’s humble\nbeginnings, and how it evolved into the success that Trino is today:\nBirthday celebration with the creators of Trino\nTo cap things off last month, we hosted a meetup with the creators to reflect\non the last ten years, laugh and listen to some stories from the early days,\ntalk about the exciting features currently launching, and speculate on the next\nten years of Trino. Here are some highlights you missed:\nAdding dynamic catalogs\nDain discusses what dynamic catalogs could look like in Trino. Currently, to add\ncatalogs in Trino, you need to add the new catalog configuration file and then\nrestart Trino. With dynamic catalogs, you can add and remove these catalogs at\nruntime with no restart required. There is still no guarantee of exactly when\nthis feature would arrive, but some of the foundations are currently being \nadded.  \n Dain dives into this a bit\nmore in this clip\nVectorization and performance\nAs more marketing around vectorized databases has come up recently many have\nasked if Trino will be following the trend. This question comes up at an\ninteresting time as \nTrino now requires Java 17 to run. Java 17\ncomes with a lot of capabilities to vectorize, and while we are excited to start\nlooking into these capabilities, simply updating workloads to use vectorization\ndoesn’t pack the performance punch that many would expect it to. The answer is\nmore complex:\nDo modern workloads benefit from vectorization? \n\nSee Martin’s answer to this\nIs there a benefit to vectorization over Java’s auto-vectorization?\n\nSometimes, but Dain elaborates on when\nIf not vectorization, what type of performance improvements does Trino focus on?\n\nMartin and Dain list some simple but impactful ones\nThe debate around query time optimization versus runtime adaption.\n\nWhich should you optimize first?\nPolymorphic table functions\nOne feature that is top-of-mind for everyone in the Trino project are\npolymorphic table functions\nor simply “table functions” as Dain prefers to call them.\nWhat is a table function?\n\nDavid and Dain discuss standard and polymorphic table functions\nCould we rewrite the Google Sheets connector\nas a table function?.\n\nDavid and Dain discuss how this would work\nWhy table functions are so incredibly powerful.\n\nEric and Dain talk about why PTFs are a game changer\nIf you want to learn more about polymorphic table functions, check out the\nrecent Trino Community Broadcast episode that\ncovers the potential of these functions in much more detail.\nThe early days of Presto and Trino\nWe wanted to get some insight into what the early days of the project looked\nlike, and how Martin, Dain, David, and Eric began the daunting task of designing\nand building a distributed query engine from scratch. Some of the discussions\nwere interesting while others were downright hilarious. Here are some steps you\ncan take to write your own query engine, at least if you want to do it the way\nthe Trino creators did it:\nLook up a bunch of research papers to see how others are doing this 📑.\n  \n  Video\n    \nSide note: Papers tend to be highly aspirational and skip important fundamentals.\n\nVideo\nAddress the real challenges of making a query engine.\n  \n  Video\nTake your initial version and just throw it away 😂🗑🚮.\n  \n  Video\nExpand outside the initial use cases by learning from other companies and\n  building community 👥.\n  \n  Video\nCause a brownout\n  on the Facebook network 📉.\n  \n  Video\nRealize the system you replaced was actually faster in some cases, but\n  for all the wrong reasons ❌🙅.\n  \n  Video\nAfter a lot of the initial work was done, Presto was deployed at Facebook and\nsoon after open sourced. From here, we know that the velocity of the project\npicked up and once the project was independent of Facebook, the features took\noff even more. While everything may seem calculated in hindsight, it was a lot\nof hard work to grow the community and adoption around Presto and now Trino.\nThe creators knew they were making a project that would be utilized outside the\nwalls of Facebook, but\n  they could never have \nanticipated the sheer scale of adoption Trino would see.\nConclusion\nWe hope you enjoyed all the fun we had celebrating these first ten years of the\nTrino project. We are thrilled to think of what the following decades will\nbring. We’d like to leave you with closing thoughts from Dain:"
author: "Brian Olsen"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/trino-tenth-birthday/creators.jpeg\">\n    </p>\n    <p>What an exciting month we had in August! August marked the ten-year birthday of\nthe Trino project. Don’t worry if you missed all the excitment as we’ve\ncondensed it all in this post.</p>\n<!--more-->\n<h2 id=\"blog-posts\">\n    Blog posts <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html#blog-posts\">#</a>\n</h2>\n<p>We felt it necessary to chronicle the larger events that happened in the last\ndecade of the project through the lens of where we are today.</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2022/08/02/leaving-facebook-meta-best-for-trino\">Why leaving Facebook/Meta was the best thing we could do for the Trino Community</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2022/08/04/decade-innovation\">A decade of query engine innovation</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2022/08/08/trino-tenth-birthday\">Happy tenth birthday Trino!</a></li>\n</ul>\n<p>We shared these posts on HackerNews and the Facebook and the query innovation \nposts both hit the front page. This resulted in one of the largest amount of \npage views on the Trino website in a given day - more than 25k views!</p>\n<p><img src=\"https://trino.io/assets/blog/trino-tenth-birthday/hn-top.png\" alt=\"\"></p>\n<h2 id=\"trino-ten-year-timeline-video\">\n    Trino ten-year timeline video <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html#trino-ten-year-timeline-video\">#</a>\n</h2>\n<p>Another way we celebrated was creating an epic ten-year montage video that\nchronicles the incredible journey starting with the Presto project’s humble\nbeginnings, and how it evolved into the success that Trino is today:</p>\n\n<h2 id=\"birthday-celebration-with-the-creators-of-trino\">\n    Birthday celebration with the creators of Trino <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html#birthday-celebration-with-the-creators-of-trino\">#</a>\n</h2>\n<p>To cap things off last month, we hosted a meetup with the creators to reflect\non the last ten years, laugh and listen to some stories from the early days,\ntalk about the exciting features currently launching, and speculate on the next\nten years of Trino. Here are some highlights you missed:</p>\n<h3 id=\"adding-dynamic-catalogs\">\n    Adding dynamic catalogs <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html#adding-dynamic-catalogs\">#</a>\n</h3>\n<p>Dain discusses what dynamic catalogs could look like in Trino. Currently, to add\ncatalogs in Trino, you need to add the new catalog configuration file and then\nrestart Trino. With dynamic catalogs, you can add and remove these catalogs at\nruntime with no restart required. There is still no guarantee of exactly when\nthis feature would arrive, but some of the foundations are currently being \nadded. <a href=\"https://www.youtube.com/clip/UgkxkYmwM6gmw9-GceMUb5IxqIKm0qNXt3fY\" target=\"_blank\"> \n<i></i> Dain dives into this a bit\nmore in this clip</a></p>\n<h3 id=\"vectorization-and-performance\">\n    Vectorization and performance <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html#vectorization-and-performance\">#</a>\n</h3>\n<p>As more marketing around vectorized databases has come up recently many have\nasked if Trino will be following the trend. This question comes up at an\ninteresting time as \n<a target=\"_blank\" href=\"https://trino.io/episodes/36\">Trino now requires Java 17 to run</a>. Java 17\ncomes with a lot of capabilities to vectorize, and while we are excited to start\nlooking into these capabilities, simply updating workloads to use vectorization\ndoesn’t pack the performance punch that many would expect it to. The answer is\nmore complex:</p>\n<ul>\n  <li>Do modern workloads benefit from vectorization? \n<a href=\"https://www.youtube.com/clip/UgkxmPAur8thP_D-_GpCcg-sqprEAqwWdyck\" target=\"_blank\"><i></i>\nSee Martin’s answer to this</a></li>\n  <li>Is there a benefit to vectorization over Java’s auto-vectorization?\n<a href=\"https://www.youtube.com/clip/Ugkx1AKbq0jQyZhOH4MKNf3LO4i9kZAmLqpJ\" target=\"_blank\"><i></i>\nSometimes, but Dain elaborates on when</a></li>\n  <li>If not vectorization, what type of performance improvements does Trino focus on?\n<a href=\"https://www.youtube.com/clip/UgkxQwDYDS6evVJelNVjWAgrIhzg_Q-cAEyq\" target=\"_blank\"><i></i>\nMartin and Dain list some simple but impactful ones</a></li>\n  <li>The debate around query time optimization versus runtime adaption.\n<a href=\"https://www.youtube.com/clip/Ugkxt5ryTBP-EPEEo_OOcW2PKvNiJkj5n8UR\" target=\"_blank\"><i></i>\nWhich should you optimize first?</a></li>\n</ul>\n<h3 id=\"polymorphic-table-functions\">\n    Polymorphic table functions <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html#polymorphic-table-functions\">#</a>\n</h3>\n<p>One feature that is top-of-mind for everyone in the Trino project are\n<a target=\"_blank\" href=\"https://trino.io/blog/2022/07/22/polymorphic-table-functions\">polymorphic table functions</a>\nor simply “table functions” as Dain prefers to call them.</p>\n<ul>\n  <li>What is a table function?\n<a href=\"https://www.youtube.com/clip/Ugkx62IKgPd_v9eGBaPUHP2hyaRkWSXh8w8h\" target=\"_blank\"><i></i>\nDavid and Dain discuss standard and polymorphic table functions</a></li>\n  <li>Could we rewrite the <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/googlesheets\">Google Sheets connector</a>\nas a table function?.\n<a href=\"https://www.youtube.com/clip/UgkxKIhplQHgEULQkSrjKs4M5w8oNdQMJaoL\" target=\"_blank\"><i></i>\nDavid and Dain discuss how this would work</a></li>\n  <li>Why table functions are so incredibly powerful.\n<a href=\"https://www.youtube.com/clip/UgkxQcokpdgPjiuMKMC5-3HwHvlbmZjxAvxe\" target=\"_blank\"><i></i>\nEric and Dain talk about why PTFs are a game changer</a></li>\n</ul>\n<p>If you want to learn more about polymorphic table functions, check out the\nrecent <a target=\"_blank\" href=\"https://trino.io/episodes/38\">Trino Community Broadcast episode</a> that\ncovers the potential of these functions in much more detail.</p>\n<h3 id=\"the-early-days-of-presto-and-trino\">\n    The early days of Presto and Trino <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html#the-early-days-of-presto-and-trino\">#</a>\n</h3>\n<p>We wanted to get some insight into what the early days of the project looked\nlike, and how Martin, Dain, David, and Eric began the daunting task of designing\nand building a distributed query engine from scratch. Some of the discussions\nwere interesting while others were downright hilarious. Here are some steps you\ncan take to write your own query engine, at least if you want to do it the way\nthe Trino creators did it:</p>\n<ol>\n  <li>Look up a bunch of research papers to see how others are doing this 📑.\n  <a href=\"https://www.youtube.com/clip/gkxGjPYZRx8rhtAndyho7AZgsM4e9wG9Jt4\" target=\"_blank\"><i></i>\n  Video</a>\n    <ul>\n      <li>Side note: Papers tend to be highly aspirational and skip important fundamentals.\n<a href=\"https://www.youtube.com/clip/Ugkx6Hqe5iglsTgrR9hVo9U3ITi8LSxxMu4U\" target=\"_blank\"><i></i>\nVideo</a></li>\n    </ul>\n  </li>\n  <li>Address the real challenges of making a query engine.\n  <a href=\"https://www.youtube.com/clip/Ugkx57PezuXyRWHrxxxoLaKni6jqFZ-StwY-\" target=\"_blank\"><i></i>\n  Video</a></li>\n  <li>Take your initial version and just throw it away 😂🗑🚮.\n  <a href=\"https://www.youtube.com/clip/UgkxJz7zve36QJZZDdtC3S29vI-Ak1jRifAH\" target=\"_blank\"><i></i>\n  Video</a></li>\n  <li>Expand outside the initial use cases by learning from other companies and\n  building community 👥.\n  <a href=\"https://www.youtube.com/clip/UgkxQrBl0BzOrjvwDcEN4KAAyqehcRUc1tsf\" target=\"_blank\"><i></i>\n  Video</a></li>\n  <li>Cause a <a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Brownout_(software_engineering)\">brownout</a>\n  on the Facebook network 📉.\n  <a href=\"https://www.youtube.com/clip/Ugkx6SyQTFgwX_kdeH018VGt2pMUbldvuKtC\" target=\"_blank\"><i></i>\n  Video</a></li>\n  <li>Realize the system you replaced was actually faster in some cases, but\n  for all the wrong reasons ❌🙅.\n  <a href=\"https://www.youtube.com/clip/UgkxTqBY2nMAALn-OkglE5DT9dHlBuC18qf8\" target=\"_blank\"><i></i>\n  Video</a></li>\n</ol>\n<p>After a lot of the initial work was done, Presto was deployed at Facebook and\nsoon after open sourced. From here, we know that the velocity of the project\npicked up and once the project was independent of Facebook, the features took\noff even more. While everything may seem calculated in hindsight, it was a lot\nof hard work to grow the community and adoption around Presto and now Trino.\nThe creators knew they were making a project that would be utilized outside the\nwalls of Facebook, but\n<a href=\"https://www.youtube.com/clip/Ugkxh2J-1bi1rUoBpuld_FAuXYZgz2bvqPPx\" target=\"_blank\"><i></i>  they could never have \nanticipated the sheer scale of adoption Trino would see</a>.</p>\n<h2 id=\"conclusion\">\n    Conclusion <a target=\"_blank\" href=\"https://trino.io/blog/2022/09/12/tenth-birthday-celebration-recap.html#conclusion\">#</a>\n</h2>\n<p>We hope you enjoyed all the fun we had celebrating these first ten years of the\nTrino project. We are thrilled to think of what the following decades will\nbring. We’d like to leave you with closing thoughts from Dain:</p>\n\n  </div>\n</article>\n</div>"
---

What an exciting month we had in August! August marked the ten-year birthday of
the Trino project. Don’t worry if you missed all the excitment as we’ve
condensed it all in this post.
Blog posts
We felt it necessary to chronicle the larger events that happened in the last
decade of the project through the lens of where we are today.
Why leaving Facebook/Meta was the best thing we could do for the Trino Community
A decade of query engine innovation
Happy tenth birthday Trino!
We shared these posts on HackerNews and the Facebook and the query innovation 
posts both hit the front page. This resulted in one of the largest amount of 
page views on the Trino website in a given day - more than 25k views!

Trino ten-year timeline video
Another way we celebrated was creating an epic ten-year montage video that
chronicles the incredible journey starting with the Presto project’s humble
beginnings, and how it evolved into the success that Trino is today:
Birthday celebration with the creators of Trino
To cap things off last month, we hosted a meetup with the creators to reflect
on the last ten years, laugh and listen to some stories from the early days,
talk about the exciting features currently launching, and speculate on the next
ten years of Trino. Here are some highlights you missed:
Adding dynamic catalogs
Dain discusses what dynamic catalogs could look like in Trino. Currently, to add
catalogs in Trino, you need to add the new catalog configuration file and then
restart Trino. With dynamic catalogs, you can add and remove these catalogs at
runtime with no restart required. There is still no guarantee of exactly when
this feature would arrive, but some of the foundations are currently being 
added.  
 Dain dives into this a bit
more in this clip
Vectorization and performance
As more marketing around vectorized databases has come up recently many have
asked if Trino will be following the trend. This question comes up at an
interesting time as 
Trino now requires Java 17 to run. Java 17
comes with a lot of capabilities to vectorize, and while we are excited to start
looking into these capabilities, simply updating workloads to use vectorization
doesn’t pack the performance punch that many would expect it to. The answer is
more complex:
Do modern workloads benefit from vectorization? 

See Martin’s answer to this
Is there a benefit to vectorization over Java’s auto-vectorization?

Sometimes, but Dain elaborates on when
If not vectorization, what type of performance improvements does Trino focus on?

Martin and Dain list some simple but impactful ones
The debate around query time optimization versus runtime adaption.

Which should you optimize first?
Polymorphic table functions
One feature that is top-of-mind for everyone in the Trino project are
polymorphic table functions
or simply “table functions” as Dain prefers to call them.
What is a table function?

David and Dain discuss standard and polymorphic table functions
Could we rewrite the Google Sheets connector
as a table function?.

David and Dain discuss how this would work
Why table functions are so incredibly powerful.

Eric and Dain talk about why PTFs are a game changer
If you want to learn more about polymorphic table functions, check out the
recent Trino Community Broadcast episode that
covers the potential of these functions in much more detail.
The early days of Presto and Trino
We wanted to get some insight into what the early days of the project looked
like, and how Martin, Dain, David, and Eric began the daunting task of designing
and building a distributed query engine from scratch. Some of the discussions
were interesting while others were downright hilarious. Here are some steps you
can take to write your own query engine, at least if you want to do it the way
the Trino creators did it:
Look up a bunch of research papers to see how others are doing this 📑.
  
  Video
    
Side note: Papers tend to be highly aspirational and skip important fundamentals.

Video
Address the real challenges of making a query engine.
  
  Video
Take your initial version and just throw it away 😂🗑🚮.
  
  Video
Expand outside the initial use cases by learning from other companies and
  building community 👥.
  
  Video
Cause a brownout
  on the Facebook network 📉.
  
  Video
Realize the system you replaced was actually faster in some cases, but
  for all the wrong reasons ❌🙅.
  
  Video
After a lot of the initial work was done, Presto was deployed at Facebook and
soon after open sourced. From here, we know that the velocity of the project
picked up and once the project was independent of Facebook, the features took
off even more. While everything may seem calculated in hindsight, it was a lot
of hard work to grow the community and adoption around Presto and now Trino.
The creators knew they were making a project that would be utilized outside the
walls of Facebook, but
  they could never have 
anticipated the sheer scale of adoption Trino would see.
Conclusion
We hope you enjoyed all the fun we had celebrating these first ten years of the
Trino project. We are thrilled to think of what the following decades will
bring. We’d like to leave you with closing thoughts from Dain:
