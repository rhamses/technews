---
title: "Ibis: Because SQL is everywhere and so is Python"
link: "https://trino.io/blog/2023/07/03/trino-fest-2023-ibis.html"
guid: "https://trino.io/blog/2023/07/03/trino-fest-2023-ibis.html"
pubDate: "2023-07-03T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "The PyData stack has been described as “unreasonably effective,” empowering its\nusers to glean insights and analyze moderate amounts of data with a high level\nof flexibility and excellent visualization. The large-scale, production data\nstack using a query engine like Trino sits on the other side of the world,\ncapable of handling petabytes and exabytes, but perhaps not integrating as\nseamlessly with the Python ecosystem as one would hope. SQL has been a means of\nbridging this gap, but we’ve now got an exciting solution to bridge it even\nbetter: Ibis.\n\n\n\n\n  Check out the slides!\n\nA major problem with bridging the gap between Python and SQL engines has been\nthe lack of standardization in SQL. Though Trino prides itself on being\nANSI-compliant and many other SQL dialects strive to be similar, the reality is\nthat every SQL engine is different, and a complicated SQL query will error out\nor return different results based on what engine you’re using. So if you want to\nconvert some Python code to SQL, the question is… which SQL? If you’re doing\nyour data analysis in Python because you prefer to use it, spending time\nscratching your head and trying to work out a SQL conversion can be frustrating,\ntime-consuming, and painful. But SQL is everywhere, and for large, performant,\nefficient queries, you may need a SQL engine like Trino.\nEnter Ibis, a lightweight Python library for “data wrangling.” It can easily\nconvert your Python code into SQL queries for 16 different engines, including\nTrino. With Ibis, you can leverage the ease of writing Python code with the\npower and performance of running queries in Trino, getting the best of both\nworlds in both the Python and SQL ecosystems. Want to learn more? Check out\nthe Ibis project website, give the talk a listen,\nand tune into the Trino Community Broadcast on July 6th, where we’ll be going\ninto even more detail about Ibis.\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Phillip Cloud, Cole Bowden"
contentHtml: "<p>The PyData stack has been described as “unreasonably effective,” empowering its\nusers to glean insights and analyze moderate amounts of data with a high level\nof flexibility and excellent visualization. The large-scale, production data\nstack using a query engine like Trino sits on the other side of the world,\ncapable of handling petabytes and exabytes, but perhaps not integrating as\nseamlessly with the Python ecosystem as one would hope. SQL has been a means of\nbridging this gap, but we’ve now got an exciting solution to bridge it even\nbetter: Ibis.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-fest-2023/TrinoFest2023Ibis.pdf\">\n  Check out the slides!\n</a></p>\n\n<p>A major problem with bridging the gap between Python and SQL engines has been\nthe lack of standardization in SQL. Though Trino prides itself on being\nANSI-compliant and many other SQL dialects strive to be similar, the reality is\nthat every SQL engine is different, and a complicated SQL query will error out\nor return different results based on what engine you’re using. So if you want to\nconvert some Python code to SQL, the question is… which SQL? If you’re doing\nyour data analysis in Python because you prefer to use it, spending time\nscratching your head and trying to work out a SQL conversion can be frustrating,\ntime-consuming, and painful. But SQL is everywhere, and for large, performant,\nefficient queries, you may need a SQL engine like Trino.</p>\n\n<p>Enter Ibis, a lightweight Python library for “data wrangling.” It can easily\nconvert your Python code into SQL queries for 16 different engines, including\nTrino. With Ibis, you can leverage the ease of writing Python code with the\npower and performance of running queries in Trino, getting the best of both\nworlds in both the Python and SQL ecosystems. Want to learn more? Check out\n<a href=\"https://ibis-project.org/\">the Ibis project website</a>, give the talk a listen,\nand tune into the Trino Community Broadcast on July 6th, where we’ll be going\ninto even more detail about Ibis.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

The PyData stack has been described as “unreasonably effective,” empowering its
users to glean insights and analyze moderate amounts of data with a high level
of flexibility and excellent visualization. The large-scale, production data
stack using a query engine like Trino sits on the other side of the world,
capable of handling petabytes and exabytes, but perhaps not integrating as
seamlessly with the Python ecosystem as one would hope. SQL has been a means of
bridging this gap, but we’ve now got an exciting solution to bridge it even
better: Ibis.




  Check out the slides!

A major problem with bridging the gap between Python and SQL engines has been
the lack of standardization in SQL. Though Trino prides itself on being
ANSI-compliant and many other SQL dialects strive to be similar, the reality is
that every SQL engine is different, and a complicated SQL query will error out
or return different results based on what engine you’re using. So if you want to
convert some Python code to SQL, the question is… which SQL? If you’re doing
your data analysis in Python because you prefer to use it, spending time
scratching your head and trying to work out a SQL conversion can be frustrating,
time-consuming, and painful. But SQL is everywhere, and for large, performant,
efficient queries, you may need a SQL engine like Trino.
Enter Ibis, a lightweight Python library for “data wrangling.” It can easily
convert your Python code into SQL queries for 16 different engines, including
Trino. With Ibis, you can leverage the ease of writing Python code with the
power and performance of running queries in Trino, getting the best of both
worlds in both the Python and SQL ecosystems. Want to learn more? Check out
the Ibis project website, give the talk a listen,
and tune into the Trino Community Broadcast on July 6th, where we’ll be going
into even more detail about Ibis.
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
