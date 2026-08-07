---
title: "FugueSQL: Interoperable Python and Trino for interactive workloads"
link: "https://trino.io/blog/2023/07/27/trino-fest-2023-fugue-recap.html"
guid: "https://trino.io/blog/2023/07/27/trino-fest-2023-fugue-recap.html"
pubDate: "2023-07-27T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Fugue may be an unfamiliar name to those in the Trino ecosystem. It’s another\nPython tool, a programming model built to enhance interoperability between\nPython and SQL. On the Python side of things, it’s a wrapper around common tools\nlike pandas and Polars that convert code into SQL for high-performance,\nlarge-scale query execution. So why are we talking about it at Trino Fest?\nBecause Fugue recently launched an integration with Trino, enabling you to write\nPython code that can be converted to SQL to run on a high-powered Trino backend.\n\n\n\nThough Trino users are quite familiar with SQL, it does present some challenges.\nIterating on a SQL query and improving it can be difficult, and finding ways to\noptimize or speed things up can be a challenge that requires sophisticated\nexternal tools or working on hunches. Testing queries, especially incrementally,\nhas never been super easy, either. Compare that to Python, which does not have\nthose problems, but has issues of its own. Python, especially at scale, is not\nvery performant. So it’s natural to try to take the advantages of both, which is\nwhat Fugue is aiming to do.\nAfter that brief intro into Fugue, the rest of the talk consists of technical\ndemos of the many various things that you can do with Fugue. This includes\nsetting a query up, breaking it up into smaller parts, bringing it to pandas,\nand demonstrating extensions that are built into Fugue. With all of these\nintermediate steps, it becomes easier to unit test queries before sending them\ninto production, making sure that everything works as expected.\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Kevin Kho and Cole Bowden"
contentHtml: "<p>Fugue may be an unfamiliar name to those in the Trino ecosystem. It’s another\nPython tool, a programming model built to enhance interoperability between\nPython and SQL. On the Python side of things, it’s a wrapper around common tools\nlike pandas and Polars that convert code into SQL for high-performance,\nlarge-scale query execution. So why are we talking about it at Trino Fest?\nBecause Fugue recently launched an integration with Trino, enabling you to write\nPython code that can be converted to SQL to run on a high-powered Trino backend.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p>Though Trino users are quite familiar with SQL, it does present some challenges.\nIterating on a SQL query and improving it can be difficult, and finding ways to\noptimize or speed things up can be a challenge that requires sophisticated\nexternal tools or working on hunches. Testing queries, especially incrementally,\nhas never been super easy, either. Compare that to Python, which does not have\nthose problems, but has issues of its own. Python, especially at scale, is not\nvery performant. So it’s natural to try to take the advantages of both, which is\nwhat Fugue is aiming to do.</p>\n\n<p>After that brief intro into Fugue, the rest of the talk consists of technical\ndemos of the many various things that you can do with Fugue. This includes\nsetting a query up, breaking it up into smaller parts, bringing it to pandas,\nand demonstrating extensions that are built into Fugue. With all of these\nintermediate steps, it becomes easier to unit test queries before sending them\ninto production, making sure that everything works as expected.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

Fugue may be an unfamiliar name to those in the Trino ecosystem. It’s another
Python tool, a programming model built to enhance interoperability between
Python and SQL. On the Python side of things, it’s a wrapper around common tools
like pandas and Polars that convert code into SQL for high-performance,
large-scale query execution. So why are we talking about it at Trino Fest?
Because Fugue recently launched an integration with Trino, enabling you to write
Python code that can be converted to SQL to run on a high-powered Trino backend.



Though Trino users are quite familiar with SQL, it does present some challenges.
Iterating on a SQL query and improving it can be difficult, and finding ways to
optimize or speed things up can be a challenge that requires sophisticated
external tools or working on hunches. Testing queries, especially incrementally,
has never been super easy, either. Compare that to Python, which does not have
those problems, but has issues of its own. Python, especially at scale, is not
very performant. So it’s natural to try to take the advantages of both, which is
what Fugue is aiming to do.
After that brief intro into Fugue, the rest of the talk consists of technical
demos of the many various things that you can do with Fugue. This includes
setting a query up, breaking it up into smaller parts, bringing it to pandas,
and demonstrating extensions that are built into Fugue. With all of these
intermediate steps, it becomes easier to unit test queries before sending them
into production, making sure that everything works as expected.
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
