---
title: "Trino charms Python"
link: "https://trino.io/blog/2022/09/20/python-progress.html"
guid: "https://trino.io/blog/2022/09/20/python-progress.html"
pubDate: "2022-09-20T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Wow, have we ever come a long way with Python support for Trino. It feels like\nages ago that we talked about DB-API, trino-python-client, SQLAlchemy, Apache\nSuperset, and more in Trino Community Broadcast episode\n12. More recently we talked about dbt in\nepisode 21 and episode\n30, but there is so much more for Pythonistas,\nPythonians, Python programmers, and simply users of Python-powered tools.\nWhere are we now\nPython usage shows up with nearly every Trino deployment these days, and we had\nsome really great developments for you all recent months:\nStarburst has really ramped up the contributions to\nthe foundation of a lot of Python tools connecting to Trino. The\ntrino-python-client receives\nimprovements regularly and is definitely a first-class client at the same\nlevel as the JDBC driver or the CLI.\ndbt Labs and Starburst have worked hard on\nlaunching and improving the dbt-trino\nproject and enabling automated\ndata transformation flows.\nApache Airflow use cases are abound and the\nintegration is improving\nApache Superset and\nPreset continue to add features and treat Trino as a\nmajor data source and integration, and we should probably have another Trino\nCommunity Broadcast episode to see that all in action.\nAirbyte was demoed at Cinco de Trino and is widely used by companies such as\nLyft.\nAnd of course there are well-known usages such as notebooks everywhere, on your\nworkstation, in your company, and out in the cloud. But is there more? There\nmust be!\nWhat else could we do\nAll of these developments are great for our users. I want to encourage you all\nto try these tools and learn how amazing they are with Trino. At the same time\nit feels like there got to be even more. The Python ecosystem is so large, and\nthere are probably dozens of use cases we never heard about, have not\nconsidered, or dreamed about in our wildest dreams.\nOn the other hand I am sure there are still problems with these tools and\nintegrations. What is an edge case for us, might be a daily task for you. What\nwe consider hard and complicated, might be just what you have to deal with\nanyway. And in the spirit of constant improvement, we really want to fix these\nthings and make it all amazing. But we need your help.\nLet us know what you think\nThis is now your opportunity to tell us what need to make your Trino and Python\nexperience better.\n\n\nConclusion\nTrino, Python, and all the tools in the ecosystem go from strength to strength.\nWith your help we want to supercharge the tooling to hero levels. With your help\nand input we can do it.\nJoin us in the python-client on Trino slack,\nand don’t forget to answer that survey.\nThanks, and see you at the Trino Summit 2022.\nManfred, Brian, and Dain"
author: "Manfred Moser, Brian Zhan, Dain Sundstrom"
contentHtml: "<p>Wow, have we ever come a long way with Python support for Trino. It feels like\nages ago that we talked about DB-API, trino-python-client, SQLAlchemy, Apache\nSuperset, and more in <a href=\"https://trino.io/episodes/12.html\">Trino Community Broadcast episode\n12</a>. More recently we talked about dbt in\n<a href=\"https://trino.io/episodes/21.html\">episode 21</a> and <a href=\"https://trino.io/episodes/30.html\">episode\n30</a>, but there is so much more for Pythonistas,\nPythonians, Python programmers, and simply users of Python-powered tools.</p>\n\n<!--more-->\n\n<h2 id=\"where-are-we-now\">Where are we now</h2>\n\n<p>Python usage shows up with nearly every Trino deployment these days, and we had\nsome really great developments for you all recent months:</p>\n\n<ul>\n  <li><a href=\"http://www.starburst.io\">Starburst</a> has really ramped up the contributions to\nthe foundation of a lot of Python tools connecting to Trino. The\n<a href=\"https://github.com/trinodb/trino-python-client\">trino-python-client</a> receives\nimprovements regularly and is definitely a first-class client at the same\nlevel as the JDBC driver or the CLI.</li>\n  <li><a href=\"https://www.getdbt.com/\">dbt Labs</a> and Starburst have worked hard on\nlaunching and improving the <a href=\"https://github.com/starburstdata/dbt-trino\">dbt-trino\nproject</a> and enabling automated\ndata transformation flows.</li>\n  <li><a href=\"https://airflow.apache.org/\">Apache Airflow</a> use cases are abound and the\n<a href=\"/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html\">integration is improving</a></li>\n  <li><a href=\"https://superset.apache.org/\">Apache Superset</a> and\n<a href=\"https://preset.io/\">Preset</a> continue to add features and treat Trino as a\nmajor data source and integration, and we should probably have another Trino\nCommunity Broadcast episode to see that all in action.</li>\n  <li><a href=\"https://airbyte.com/\">Airbyte</a> was <a href=\"/blog/2022/05/17/cinco-de-trino-recap.html\">demoed at Cinco de Trino</a> and is <a href=\"/blog/2022/05/24/an-opinionated-guide-to-consolidating-our-data.html\">widely used by companies such as\nLyft</a>.</li>\n</ul>\n\n<p>And of course there are well-known usages such as notebooks everywhere, on your\nworkstation, in your company, and out in the cloud. But is there more? There\nmust be!</p>\n\n<h2 id=\"what-else-could-we-do\">What else could we do</h2>\n\n<p>All of these developments are great for our users. I want to encourage you all\nto try these tools and learn how amazing they are with Trino. At the same time\nit feels like there got to be even more. The Python ecosystem is so large, and\nthere are probably dozens of use cases we never heard about, have not\nconsidered, or dreamed about in our wildest dreams.</p>\n\n<p>On the other hand I am sure there are still problems with these tools and\nintegrations. What is an edge case for us, might be a daily task for you. What\nwe consider hard and complicated, might be just what you have to deal with\nanyway. And in the spirit of constant improvement, we really want to fix these\nthings and make it all amazing. But we need your help.</p>\n\n<h2 id=\"let-us-know-what-you-think\">Let us know what you think</h2>\n\n<p>This is now your opportunity to tell us what need to make your Trino and Python\nexperience better.</p>\n\n<div class=\"card-deck spacer-30\">\n    <a class=\"btn btn-pink\" href=\"https://forms.gle/4bzMPZxby6E4xKm98\" target=\"_blank\">\n        Help Trino and Python\n    </a>\n</div>\n<div class=\"spacer-30\"></div>\n\n<h2 id=\"conclusion\">Conclusion</h2>\n\n<p>Trino, Python, and all the tools in the ecosystem go from strength to strength.\nWith your help we want to supercharge the tooling to hero levels. With your help\nand input we can do it.</p>\n\n<p>Join us in the <code class=\"language-plaintext highlighter-rouge\">python-client</code> on <a href=\"https://trino.io/community.html\">Trino slack</a>,\nand don’t forget to <a href=\"https://forms.gle/4bzMPZxby6E4xKm98\">answer that survey</a>.</p>\n\n<p>Thanks, and see you at the <a href=\"/blog/2022/06/30/trino-summit-call-for-speakers.html\">Trino Summit 2022</a>.</p>\n\n<p><em>Manfred, Brian, and Dain</em></p>"
---

Wow, have we ever come a long way with Python support for Trino. It feels like
ages ago that we talked about DB-API, trino-python-client, SQLAlchemy, Apache
Superset, and more in Trino Community Broadcast episode
12. More recently we talked about dbt in
episode 21 and episode
30, but there is so much more for Pythonistas,
Pythonians, Python programmers, and simply users of Python-powered tools.
Where are we now
Python usage shows up with nearly every Trino deployment these days, and we had
some really great developments for you all recent months:
Starburst has really ramped up the contributions to
the foundation of a lot of Python tools connecting to Trino. The
trino-python-client receives
improvements regularly and is definitely a first-class client at the same
level as the JDBC driver or the CLI.
dbt Labs and Starburst have worked hard on
launching and improving the dbt-trino
project and enabling automated
data transformation flows.
Apache Airflow use cases are abound and the
integration is improving
Apache Superset and
Preset continue to add features and treat Trino as a
major data source and integration, and we should probably have another Trino
Community Broadcast episode to see that all in action.
Airbyte was demoed at Cinco de Trino and is widely used by companies such as
Lyft.
And of course there are well-known usages such as notebooks everywhere, on your
workstation, in your company, and out in the cloud. But is there more? There
must be!
What else could we do
All of these developments are great for our users. I want to encourage you all
to try these tools and learn how amazing they are with Trino. At the same time
it feels like there got to be even more. The Python ecosystem is so large, and
there are probably dozens of use cases we never heard about, have not
considered, or dreamed about in our wildest dreams.
On the other hand I am sure there are still problems with these tools and
integrations. What is an edge case for us, might be a daily task for you. What
we consider hard and complicated, might be just what you have to deal with
anyway. And in the spirit of constant improvement, we really want to fix these
things and make it all amazing. But we need your help.
Let us know what you think
This is now your opportunity to tell us what need to make your Trino and Python
experience better.


Conclusion
Trino, Python, and all the tools in the ecosystem go from strength to strength.
With your help we want to supercharge the tooling to hero levels. With your help
and input we can do it.
Join us in the python-client on Trino slack,
and don’t forget to answer that survey.
Thanks, and see you at the Trino Summit 2022.
Manfred, Brian, and Dain
