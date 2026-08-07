---
title: "Zero-cost reporting"
link: "https://trino.io/blog/2023/06/28/trino-fest-2023-starburst-recap.html"
guid: "https://trino.io/blog/2023/06/28/trino-fest-2023-starburst-recap.html"
pubDate: "2023-06-28T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Let’s say you have some data. Maybe it’s in a spreadsheet, a CSV file, a\nrelational database, or multiple terabytes of data in an S3 bucket. You need\nto run SQL queries on this data, and you’d like to share those results with your\nteammates, coworkers, and partner teams, but you want to do it in a way that\nallows everyone to view those results on-demand, on the web, and with the latest\nresults without the need for any manual effort on your part.\n\n\n\nRecap\nThere are a lot of tools that might be able to do this for you, but whatever you\nchoose, you’ll need to spend time or money to set it up, and you don’t want to\nspend a lot. With so many options, there’s the possibility of getting stuck in\nanalysis paralysis, and trying to find the best way forward may leave you\nstymied. Jan Waś from Starburst has a suggestion: keep it simple with Trino,\nplaintext files, Git, and GitHub actions, and you can set it all up for free.\nTo start, why put results into plaintext files? With markdown, files are both\nhuman-legible and machine-readable. By saving queries in normal files, it’s easy\nto see and edit those queries. You can commit your queries and results to Git,\nand then you can push them to a service like GitHub, where those files will be\neven more readable thanks to the web UI. Then, once on GitHub, you can use the\npower of actions to re-run the queries, update your results on a schedule, and\nkeep things up to date for teammates to view via GitHub Pages. Sound neat? Check\nout the talk to see how Jan does it!\nShare this session\nIf you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Jan Waś, Cole Bowden"
contentHtml: "<p>Let’s say you have some data. Maybe it’s in a spreadsheet, a CSV file, a\nrelational database, or multiple terabytes of data in an S3 bucket. You need\nto run SQL queries on this data, and you’d like to share those results with your\nteammates, coworkers, and partner teams, but you want to do it in a way that\nallows everyone to view those results on-demand, on the web, and with the latest\nresults without the need for any manual effort on your part.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>There are a lot of tools that might be able to do this for you, but whatever you\nchoose, you’ll need to spend time or money to set it up, and you don’t want to\nspend a lot. With so many options, there’s the possibility of getting stuck in\nanalysis paralysis, and trying to find the best way forward may leave you\nstymied. Jan Waś from Starburst has a suggestion: keep it simple with Trino,\nplaintext files, Git, and GitHub actions, and you can set it all up for free.</p>\n\n<p>To start, why put results into plaintext files? With markdown, files are both\nhuman-legible and machine-readable. By saving queries in normal files, it’s easy\nto see and edit those queries. You can commit your queries and results to Git,\nand then you can push them to a service like GitHub, where those files will be\neven more readable thanks to the web UI. Then, once on GitHub, you can use the\npower of actions to re-run the queries, update your results on a schedule, and\nkeep things up to date for teammates to view via GitHub Pages. Sound neat? Check\nout the talk to see how Jan does it!</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on Twitter,\nReddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>"
---

Let’s say you have some data. Maybe it’s in a spreadsheet, a CSV file, a
relational database, or multiple terabytes of data in an S3 bucket. You need
to run SQL queries on this data, and you’d like to share those results with your
teammates, coworkers, and partner teams, but you want to do it in a way that
allows everyone to view those results on-demand, on the web, and with the latest
results without the need for any manual effort on your part.



Recap
There are a lot of tools that might be able to do this for you, but whatever you
choose, you’ll need to spend time or money to set it up, and you don’t want to
spend a lot. With so many options, there’s the possibility of getting stuck in
analysis paralysis, and trying to find the best way forward may leave you
stymied. Jan Waś from Starburst has a suggestion: keep it simple with Trino,
plaintext files, Git, and GitHub actions, and you can set it all up for free.
To start, why put results into plaintext files? With markdown, files are both
human-legible and machine-readable. By saving queries in normal files, it’s easy
to see and edit those queries. You can commit your queries and results to Git,
and then you can push them to a service like GitHub, where those files will be
even more readable thanks to the web UI. Then, once on GitHub, you can use the
power of actions to re-run the queries, update your results on a schedule, and
keep things up to date for teammates to view via GitHub Pages. Sound neat? Check
out the talk to see how Jan does it!
Share this session
If you thought this talk was interesting, consider sharing this on Twitter,
Reddit, LinkedIn, HackerNews or anywhere on the web. If you think Trino is awesome,
give us a 🌟 on GitHub !
