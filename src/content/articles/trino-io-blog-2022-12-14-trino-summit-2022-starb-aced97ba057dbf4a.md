---
title: "Federating them all on Starburst Galaxy"
link: "https://trino.io/blog/2022/12/14/trino-summit-2022-starburst-recap.html"
guid: "https://trino.io/blog/2022/12/14/trino-summit-2022-starburst-recap.html"
pubDate: "2022-12-14T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "As the Trino Summit 2022 recap post series continues on, I have been reading all the\nwonderful posts by our awesome speakers, facilitated by the Trino developer\nrelations team. Because I have a perpetual fear of missing out, I convinced them\nthat I should get in on the fun. For this latest installment in the series, I\nwill be recapping my very own Trino Summit talk. Basically, I’m ripping off\nBo Burnham’s comedy bit where he reacts to his own reaction video,\nblog style.\nIn this session, I demonstrate building a data lakehouse architecture with\nStarburst Galaxy, the\nfastest and easiest way to get up running with Trino.\nBefore I dive into the recap, I want to thank the Trino community for showing\nup. I am grateful that I was able to meet and learn from so many members of the\ncommunity in person.\n\n\n\nRecap\nThe premise of this example is that we have Pokémon Go data being ingested into\nS3, which contains each Pokémon’s encounter information. This includes the\ngeo-location data of where each Pokémon spawned, and how long the Pokémon could\nbe found at that location. What we don’t have is any\ninformation on that Pokemon’s abilities. That information is contained in the\nPokédex stored in MongoDB which I’ve cleverly nicknamed PokéMongoDB. It\nincludes data about all the Pokémon including type, legendary status,\ncatch rate, and more. To create meaningful insights from our data, we need\nto combine the incoming geo-location data with the static dimension CSV table\nlocated in MongoDB.\n\nTo do this, I build out a reporting structure in the data lake using\nStarburst Galaxy. The first step is to read the raw data stored in the land\nlayer, then clean and optimize that data into more performant ORC files in the\nstructure layer. Finally, I join the spawn data and Pokédex data together into a\nsingle table that is cleaned and ready to be utilized by a data consumer.\nNext I apply role-based access control capabilities within Starburst\nGalaxy, which provides the proper data governance so that data consumers only\nhave read permissions to that final table. I then create some visualizations to\nanalyze which Pokémon are common to spawn in the San Francisco area.\nI walk through all the setup required to put this data lakehouse architecture\ninto action including creating my catalogs, cluster, schemas, and tables. After\nincorporating open table formats, applying native security, and building\nout a reporting structure, I have confidence that my data lakehouse is built\nto last, and end up with some really cool final Pokémon graphs.\nHelpful links\nSign up for Starburst Galaxy\nRead the docs\nTry a\ntutorial for yourself\nRegister for Datanova\nShare this session\nIf you thought this talk was interesting, consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/12/14/trino-summit-2022-starburst-recap.html. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Monica Miller"
contentHtml: "<p>As the <a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">Trino Summit 2022 recap post series</a> continues on, I have been reading all the\nwonderful posts by our awesome speakers, facilitated by the Trino developer\nrelations team. Because I have a perpetual fear of missing out, I convinced them\nthat I should get in on the fun. For this latest installment in the series, I\nwill be recapping my very own Trino Summit talk. Basically, I’m ripping off\nBo Burnham’s comedy bit where he <a href=\"https://youtu.be/FZVMB8mrNO0?t=35\">reacts to his own reaction video</a>,\nblog style.</p>\n\n<p>In this session, I demonstrate building a data lakehouse architecture with\n<a href=\"https://www.starburst.io/platform/starburst-galaxy/\">Starburst Galaxy</a>, the\nfastest and easiest way to get up running with Trino.\nBefore I dive into the recap, I want to thank the Trino community for showing\nup. I am grateful that I was able to meet and learn from so many members of the\ncommunity in person.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>The premise of this example is that we have Pokémon Go data being ingested into\nS3, which contains each Pokémon’s encounter information. This includes the\ngeo-location data of where each Pokémon spawned, and how long the Pokémon could\nbe found at that location. What we don’t have is any\ninformation on that Pokemon’s abilities. That information is contained in the\nPokédex stored in MongoDB which I’ve cleverly nicknamed <strong>PokéMongoDB</strong>. It\nincludes data about all the Pokémon including type, legendary status,\ncatch rate, and more. To create meaningful insights from our data, we need\nto combine the incoming geo-location data with the static dimension CSV table\nlocated in MongoDB.</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/starburst-architecture.png\" /></p>\n\n<p>To do this, I build out a reporting structure in the data lake using\nStarburst Galaxy. The first step is to read the raw data stored in the land\nlayer, then clean and optimize that data into more performant ORC files in the\nstructure layer. Finally, I join the spawn data and Pokédex data together into a\nsingle table that is cleaned and ready to be utilized by a data consumer.\nNext I apply role-based access control capabilities within Starburst\nGalaxy, which provides the proper data governance so that data consumers only\nhave read permissions to that final table. I then create some visualizations to\nanalyze which Pokémon are common to spawn in the San Francisco area.</p>\n\n<p>I walk through all the setup required to put this data lakehouse architecture\ninto action including creating my catalogs, cluster, schemas, and tables. After\nincorporating open table formats, applying native security, and building\nout a reporting structure, I have confidence that my data lakehouse is built\nto last, and end up with some really cool final Pokémon graphs.</p>\n\n<h2 id=\"helpful-links\">Helpful links</h2>\n\n<ul>\n  <li>Sign up for <a href=\"https://www.starburst.io/platform/starburst-galaxy/start/\">Starburst Galaxy</a></li>\n  <li>Read the <a href=\"https://docs.starburst.io/starburst-galaxy/index.html\">docs</a></li>\n  <li>Try a\n<a href=\"https://docs.starburst.io/starburst-galaxy/tutorials/index.html\">tutorial</a> for yourself</li>\n  <li>Register for <a href=\"https://www.starburst.io/datanova/?utm_source=event&amp;utm_medium=datanova&amp;utm_campaign=[…]Event-Datanova-social-promo&amp;utm_content=trinosummitrecapblog\">Datanova</a></li>\n</ul>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/12/14/trino-summit-2022-starburst-recap.html\">https://trino.io/blog/2022/12/14/trino-summit-2022-starburst-recap.html</a>. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/starburst-social.jpg\" /></p>"
---

As the Trino Summit 2022 recap post series continues on, I have been reading all the
wonderful posts by our awesome speakers, facilitated by the Trino developer
relations team. Because I have a perpetual fear of missing out, I convinced them
that I should get in on the fun. For this latest installment in the series, I
will be recapping my very own Trino Summit talk. Basically, I’m ripping off
Bo Burnham’s comedy bit where he reacts to his own reaction video,
blog style.
In this session, I demonstrate building a data lakehouse architecture with
Starburst Galaxy, the
fastest and easiest way to get up running with Trino.
Before I dive into the recap, I want to thank the Trino community for showing
up. I am grateful that I was able to meet and learn from so many members of the
community in person.



Recap
The premise of this example is that we have Pokémon Go data being ingested into
S3, which contains each Pokémon’s encounter information. This includes the
geo-location data of where each Pokémon spawned, and how long the Pokémon could
be found at that location. What we don’t have is any
information on that Pokemon’s abilities. That information is contained in the
Pokédex stored in MongoDB which I’ve cleverly nicknamed PokéMongoDB. It
includes data about all the Pokémon including type, legendary status,
catch rate, and more. To create meaningful insights from our data, we need
to combine the incoming geo-location data with the static dimension CSV table
located in MongoDB.

To do this, I build out a reporting structure in the data lake using
Starburst Galaxy. The first step is to read the raw data stored in the land
layer, then clean and optimize that data into more performant ORC files in the
structure layer. Finally, I join the spawn data and Pokédex data together into a
single table that is cleaned and ready to be utilized by a data consumer.
Next I apply role-based access control capabilities within Starburst
Galaxy, which provides the proper data governance so that data consumers only
have read permissions to that final table. I then create some visualizations to
analyze which Pokémon are common to spawn in the San Francisco area.
I walk through all the setup required to put this data lakehouse architecture
into action including creating my catalogs, cluster, schemas, and tables. After
incorporating open table formats, applying native security, and building
out a reporting structure, I have confidence that my data lakehouse is built
to last, and end up with some really cool final Pokémon graphs.
Helpful links
Sign up for Starburst Galaxy
Read the docs
Try a
tutorial for yourself
Register for Datanova
Share this session
If you thought this talk was interesting, consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/12/14/trino-summit-2022-starburst-recap.html. If you think Trino is awesome,
give us a 🌟 on GitHub !
