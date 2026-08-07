---
title: "Make your Trino data pipelines production ready with Great Expectations"
link: "https://trino.io/blog/2022/08/24/data-pipelines-production-ready-great-expectations.html"
guid: "https://trino.io/blog/2022/08/24/data-pipelines-production-ready-great-expectations.html"
pubDate: "2022-08-24T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "An important aspect of a good data pipeline is ensuring data quality. \nYou need to verify that the data is what you’re expecting it to be at any given\nstate. Great Expectations is an open source\ntool created in Python that allows you to write detailed tests called\nexpectations\nagainst your data. Users write these expectations to run validations against the\ndata as it enters your system. These expectations are expressed as methods in\nPython, and stored in JSON and YAML files. One great advantage of expectations \nis the human readable documentation that results from these tests. As you roll\nout different versions of the code, you get alerted to any unexpected changes\nand have version-specific generated documentation for what changed. Let’s learn\nhow to write expectations on tables in Trino!\nThe need for data quality\nManaging data pipelines is not for the faint of heart. Nodes fail, you run\nout of memory, bursty traffic causes abnormal behavior, and that’s just the tip\nof the iceberg. Lots of Trino community members build sophisticated\ndata pipelines and data applications using Trino. Building data pipelines in\nTrino became more common with the addition of a\nfault-tolerant execution mode to\nsafeguard against failures when executing long-running and \nresource-intensive queries.\nAside from all the infrastructure problems that concern data teams, another\ncategory of problems that have been the silent problem for quite some time is\ndata quality. Faulty data comes in, which can either cause data pipelines to\nfail, or it can possibly go unnoticed and cause inaccurate downstream reporting. \nKnowledge is scattered among domain experts, technical experts, and the code and\ndata itself. Maintenance becomes time-consuming and expensive. Documentation\ngets out of date and unreliable. This is why using data quality checks using\nlibraries like Great Expectations is so important when writing ETL applications.\nImprove data quality in Trino with Great Expectations\nAs data quality moves to the forefront of the Trino community, the Great\nExpectations and Trino communities have partnered to do some events together:\nTrino meetup to discuss Great Expectations\nGreat Expectations meetup to discuss Trino.\nSuperconductive joined this year’s mini Trino \nSummit event \nCinco de Trino\nto showcase using \nmanaged solutions for Great Expectations and Trino.\nToday, we’re walking through a demo that showcases a scenario with Trino running\nas the datalake query engine with multiple phases of data transformations on \nsome Pokemon data sets. At each phase, we need to validate that the data is in\nthe correct schema, counts, and various other factors to validate. We use Trino\nwith Hive table with CSV for ingest and then move to Iceberg table for the\nstructure and consume tables. This is one of the great uses of Trino in that you\ncan operate using any of the popular table formats.\nTrino and Great Expectations demo\nIn this scenario, we’re going to ingest Pokemon pokedex data and Pokemon Go \nspawn location data which lands as raw CSV files in our data lake. We then use\nTrino’s Hive catalog to read the data from the landing files, clean up, and \noptimize that raw data into more performant ORC files in the structure tables.\n\nThe last step is to join and transform the spawn data and pokedex data into a\nsingle table that is cleaned and ready to be utilized by a data analyst, data\nscientist, or other data consumer. Every area of the pipeline where the data is\ntransformed opens up a liability. The state can go from good to bad when\ninfrastructure fails or is updated as newer versions of the pipeline roll out.\nThis is where adding Great Expectations is crucial.\nNow that you have a better understanding of the scenario, feel free to watch the\nvideo, and try running it yourself!\n \n\n\nTry this Trino demo yourself »\nConclusion\nWhile data quality has always been a requirement, the standards for it increase\nas the complexity of data lakes increase. It is a necessity that improves the\ntrust that data consumers have in the data. Dive into the \nGreat Expectations documentation\nto learn more about the existing Trino support. If you run into any issues while\nrunning the demo, reach out on Slack and let us \nknow!"
author: "Brian Olsen, Brian Zhan"
contentHtml: "<p>An important aspect of a good data pipeline is ensuring data quality. \nYou need to verify that the data is what you’re expecting it to be at any given\nstate. <a href=\"https://greatexpectations.io/\">Great Expectations</a> is an open source\ntool created in Python that allows you to write detailed tests called\n<a href=\"https://docs.greatexpectations.io/docs/terms/expectation/\">expectations</a>\nagainst your data. Users write these expectations to run validations against the\ndata as it enters your system. These expectations are expressed as methods in\nPython, and stored in JSON and YAML files. One great advantage of expectations \nis the human readable documentation that results from these tests. As you roll\nout different versions of the code, you get alerted to any unexpected changes\nand have version-specific generated documentation for what changed. Let’s learn\nhow to write expectations on tables in Trino!</p>\n\n<!--more-->\n\n<h2 id=\"the-need-for-data-quality\">The need for data quality</h2>\n\n<p>Managing data pipelines is not for the faint of heart. Nodes fail, you run\nout of memory, bursty traffic causes abnormal behavior, and that’s just the tip\nof the iceberg. Lots of Trino community members build sophisticated\ndata pipelines and data applications using Trino. Building data pipelines in\nTrino became more common with the addition of a\n<a href=\"/blog/2022/05/05/tardigrade-launch.html\">fault-tolerant execution mode</a> to\nsafeguard against failures when executing long-running and \nresource-intensive queries.</p>\n\n<p>Aside from all the infrastructure problems that concern data teams, another\ncategory of problems that have been the silent problem for quite some time is\ndata quality. Faulty data comes in, which can either cause data pipelines to\nfail, or it can possibly go unnoticed and cause inaccurate downstream reporting. \nKnowledge is scattered among domain experts, technical experts, and the code and\ndata itself. Maintenance becomes time-consuming and expensive. Documentation\ngets out of date and unreliable. This is why using data quality checks using\nlibraries like Great Expectations is so important when writing ETL applications.</p>\n\n<h2 id=\"improve-data-quality-in-trino-with-great-expectations\">Improve data quality in Trino with Great Expectations</h2>\n\n<p>As data quality moves to the forefront of the Trino community, the Great\nExpectations and Trino communities have partnered to do some events together:</p>\n<ul>\n  <li><a href=\"https://www.youtube.com/watch?v=pcqAOq3O3Ts&amp;list=PLFnr63che7wZij92ynF_egatbsrH7by7T&amp;index=3\">Trino meetup to discuss Great Expectations</a></li>\n  <li><a href=\"https://www.youtube.com/watch?v=4SieRmibb0U\">Great Expectations meetup to discuss Trino</a>.</li>\n  <li><a href=\"https://superconductive.ai/\">Superconductive</a> joined this year’s mini Trino \nSummit event \n<a href=\"https://www.youtube.com/watch?v=kfJ63DNbAuI&amp;list=PLFnr63che7wYDHjUsmp43THLmAlqPDHlM\">Cinco de Trino</a>\nto showcase using \n<a href=\"https://www.youtube.com/watch?v=9HE6LawCHP8&amp;list=PLFnr63che7wYDHjUsmp43THLmAlqPDHlM&amp;index=7\">managed solutions for Great Expectations and Trino</a>.</li>\n</ul>\n\n<p>Today, we’re walking through a demo that showcases a scenario with Trino running\nas the datalake query engine with multiple phases of data transformations on \nsome Pokemon data sets. At each phase, we need to validate that the data is in\nthe correct schema, counts, and various other factors to validate. We use Trino\nwith Hive table with CSV for ingest and then move to Iceberg table for the\nstructure and consume tables. This is one of the great uses of Trino in that you\ncan operate using any of the popular table formats.</p>\n\n<h2 id=\"trino-and-great-expectations-demo\">Trino and Great Expectations demo</h2>\n\n<p>In this scenario, we’re going to ingest Pokemon pokedex data and Pokemon Go \nspawn location data which lands as raw CSV files in our data lake. We then use\nTrino’s Hive catalog to read the data from the landing files, clean up, and \noptimize that raw data into more performant ORC files in the structure tables.</p>\n\n<p><img src=\"/assets/blog/data-pipelines-production-ready-great-expectations/trino-ge-lakehouse.svg\" alt=\"\" /></p>\n\n<p>The last step is to join and transform the spawn data and pokedex data into a\nsingle table that is cleaned and ready to be utilized by a data analyst, data\nscientist, or other data consumer. Every area of the pipeline where the data is\ntransformed opens up a liability. The state can go from good to bad when\ninfrastructure fails or is updated as newer versions of the pipeline roll out.\nThis is where adding Great Expectations is crucial.</p>\n\n<p>Now that you have a better understanding of the scenario, feel free to watch the\nvideo, and try running it yourself!</p>\n\n\n\n<p><a class=\"btn btn-pink btn-md waves-effect waves-light\" href=\"https://github.com/bitsondatadev/trino-datalake/blob/main/tutorials/expecting-greatness-from-trino.md\">Try this Trino demo yourself »</a></p>\n\n<h2 id=\"conclusion\">Conclusion</h2>\n\n<p>While data quality has always been a requirement, the standards for it increase\nas the complexity of data lakes increase. It is a necessity that improves the\ntrust that data consumers have in the data. Dive into the \n<a href=\"https://docs.greatexpectations.io/docs/guides/connecting_to_your_data/database/trino/\">Great Expectations documentation</a>\nto learn more about the existing Trino support. If you run into any issues while\nrunning the demo, reach out on <a href=\"/slack.html\">Slack</a> and let us \nknow!</p>"
---

An important aspect of a good data pipeline is ensuring data quality. 
You need to verify that the data is what you’re expecting it to be at any given
state. Great Expectations is an open source
tool created in Python that allows you to write detailed tests called
expectations
against your data. Users write these expectations to run validations against the
data as it enters your system. These expectations are expressed as methods in
Python, and stored in JSON and YAML files. One great advantage of expectations 
is the human readable documentation that results from these tests. As you roll
out different versions of the code, you get alerted to any unexpected changes
and have version-specific generated documentation for what changed. Let’s learn
how to write expectations on tables in Trino!
The need for data quality
Managing data pipelines is not for the faint of heart. Nodes fail, you run
out of memory, bursty traffic causes abnormal behavior, and that’s just the tip
of the iceberg. Lots of Trino community members build sophisticated
data pipelines and data applications using Trino. Building data pipelines in
Trino became more common with the addition of a
fault-tolerant execution mode to
safeguard against failures when executing long-running and 
resource-intensive queries.
Aside from all the infrastructure problems that concern data teams, another
category of problems that have been the silent problem for quite some time is
data quality. Faulty data comes in, which can either cause data pipelines to
fail, or it can possibly go unnoticed and cause inaccurate downstream reporting. 
Knowledge is scattered among domain experts, technical experts, and the code and
data itself. Maintenance becomes time-consuming and expensive. Documentation
gets out of date and unreliable. This is why using data quality checks using
libraries like Great Expectations is so important when writing ETL applications.
Improve data quality in Trino with Great Expectations
As data quality moves to the forefront of the Trino community, the Great
Expectations and Trino communities have partnered to do some events together:
Trino meetup to discuss Great Expectations
Great Expectations meetup to discuss Trino.
Superconductive joined this year’s mini Trino 
Summit event 
Cinco de Trino
to showcase using 
managed solutions for Great Expectations and Trino.
Today, we’re walking through a demo that showcases a scenario with Trino running
as the datalake query engine with multiple phases of data transformations on 
some Pokemon data sets. At each phase, we need to validate that the data is in
the correct schema, counts, and various other factors to validate. We use Trino
with Hive table with CSV for ingest and then move to Iceberg table for the
structure and consume tables. This is one of the great uses of Trino in that you
can operate using any of the popular table formats.
Trino and Great Expectations demo
In this scenario, we’re going to ingest Pokemon pokedex data and Pokemon Go 
spawn location data which lands as raw CSV files in our data lake. We then use
Trino’s Hive catalog to read the data from the landing files, clean up, and 
optimize that raw data into more performant ORC files in the structure tables.

The last step is to join and transform the spawn data and pokedex data into a
single table that is cleaned and ready to be utilized by a data analyst, data
scientist, or other data consumer. Every area of the pipeline where the data is
transformed opens up a liability. The state can go from good to bad when
infrastructure fails or is updated as newer versions of the pipeline roll out.
This is where adding Great Expectations is crucial.
Now that you have a better understanding of the scenario, feel free to watch the
video, and try running it yourself!
 


Try this Trino demo yourself »
Conclusion
While data quality has always been a requirement, the standards for it increase
as the complexity of data lakes increase. It is a necessity that improves the
trust that data consumers have in the data. Dive into the 
Great Expectations documentation
to learn more about the existing Trino support. If you run into any issues while
running the demo, reach out on Slack and let us 
know!
