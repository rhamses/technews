---
title: "Trino 2023 wrapped"
link: "https://trino.io/blog/2024/01/19/trino-2023-wrapped.html"
guid: "https://trino.io/blog/2024/01/19/trino-2023-wrapped.html"
pubDate: "2024-01-19T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "If “Wrapped” is good enough for Spotify, \nit’s good enough for Trino, right? As we look forward to a bright 2024, we can\nalso take a moment to get sentimental, look back at everything we’ve\naccomplished, and reflect on the progress we’ve made. Commander Bun Bun has been\nhard at work, so if you haven’t been paying close attention to Trino or want an\nidea of all that went down in 2023, we’re happy to present you with an end of\nyear recap. We’ll be exploring what’s gone on in the community, on development,\nthe events we’ve hosted, and discuss the cool new features and technologies you\ncan use when you’re running Trino.\n\n\n\n2023 by the numbers\n64,288 views 👀 on YouTube\n5,872 hours watched ⌚on YouTube\n5,018 new commits 💻 in GitHub\n2,985 new stargazers ⭐ in GitHub\n2,494 pull requests merged ✅ in GitHub\n1,227 issues 📝 created in GitHub\n704 new subscribers 📺 in YouTube\n45 videos 🎥 uploaded to YouTube\n30 Trino 🚀 releases\n39 blog ✍️ posts\n10 Trino Community Broadcast ▶️ episodes\n2 Trino ⛰️ Summits\nWe’re excited to say that Trino continued to grow in 2023:\nGitHub stars increased by nearly 50% total and by 8% more than last year\nCommits increased by 7%\nSlack usage picked up dramatically\nYouTube viewership was up 7% despite a lack of Pokemon-themed musical content compared to 2022 (our bad)\n30 releases kept new versions of Trino coming out more than every other week.\nThanks in part to all that growth, it’s more important than ever to be on\nour Slack. If you’re a Trino user or community member and aren’t\nalready on there, you’re missing out! Make sure to join up for community\nannouncements, release statuses, the shared expertise of the entire Trino\ncommunity, and event-specific channels for discussion when we’re hosting things \nlike Trino Fest and Trino Summit. Speaking of those…\nTrino events\nOne of the best parts of being an open source community is that it’s easy to be\nexcited and connect with others about using such a cool piece of technology.\nWhether that’s bringing Trino to new users who can take advantage of it, or\nsharing our learnings with other Trino users to make the most, events are one of\nthe best ways to distribute that knowledge. So what were we up to this year?\nTrino Fest and Trino Summit\nTrino Fest and\nTrino Summit are\nbecoming mainstays on the Trino calendar each year, and 2023 was no different.\nFormerly “Cinco de Trino,” we ditched the Cinco de Mayo theme and went with the\nsimpler “Trino Fest” in June, opting to theme it around Commander Bun Bun’s Lake\nHouse Summer Camp, with a focus on integrating Trino with lakehouse and data\nlake architectures. Trino Summit only wrapped up a little over a month ago,\nrounding out the year and highlighting some amazing developments that we’ll be\ntalking about later in this blog post.\nTrino Fest has historically been the smaller event, but it did some catching up\nin 2023, as both Trino Fest and Trino Summit were made virtual and expanded to 2\ndays this year. Easier to attend than ever before, we reached a combined total\nof about 1,200 live attendees, with thousands more views on demand.\nThe lineups were packed with 34 talks across both events, featuring speakers\nfrom huge Trino users like Salesforce, Stripe, Apple, and Lyft, as well as from\nmajor Trino contributors like Starburst, Tabular, and Bloomberg. You can\nview recordings of every Trino Fest talk\nand every Trino Summit talk\non the Trino YouTube channel if you missed out.\nMeetups and international events\nOne of the more exciting developments was our a major event in Japan -\nTrino Conference Tokyo. \nA virtual event with four sessions, it brought Trino to a Japanese-speaking\naudience and further pushed our favorite query engine across language borders.\nOn top of that,\nStarburst co-hosted a Trino meetup in Bengaluru, \nand the community organized the first-ever Korean Trino meetup (pictured below).\n\nAnd last but not least,\nTrino, the Definitive Guide, 2nd Edition\nwas translated into Mandarin and Polish.\nThe Trino Gateway\nOne of the biggest announcements in the Trino community this year was\nthe launch of the Trino Gateway. A proxy and\nload-balancer, it’s a crucial piece of Trino infrastructure for organizations\nthat need more than one Trino cluster to suit their needs.\nWhy would you want more than one Trino cluster? Maybe you want one cluster with\nfault-tolerant execution enabled for ETL workloads and another cluster for\nspeedy ad-hoc analytics. Perhaps you have analysts performing wildly\ndifferently-sized queries, and high-volume compute-intensive queries are proving\nto be bad neighbors for lightweight and low-latency queries that shouldn’t take\nmore than milliseconds. Historically, users would have to manually manage\nswapping between clusters, establish a new connection, and try not to get a\nheadache in the process.\nEnter the Trino Gateway! By routing all of your Trino traffic automatically,\nit’s never been easier to manage, maintain, and query multiple Trino clusters at\nonce. Load balancing ensures that no one cluster gets overworked, and it’s the\nperfect way to stop large queries from getting in the way of the little guys.\nAdd in the fact that you can seamlessly shut down an individual cluster for\nupdates or maintenance while the Trino Gateway routes traffic elsewhere, and\nit’s easy to see why this is such a game-changer. We’re super excited for it to\nbe out there in the world, and we hope it makes running Trino at the largest\nscales simpler and faster than ever before.\nFor more information on the Trino Gateway, check out:\nThe announcement blog post\nThe quickstart guide\nThe main Trino Gateway repo\nNew features\nWith more development on Trino than ever before, there were obviously a ton of\nnew things being added to it. Let’s go over some of the biggest adds in 2023.\nSQL routines\nWhether you want to refer to them as SQL routines or as user-defined functions,\nthey’re a big deal. Fresh off the presses and only a few months old, they do\nexactly what you’d expect them to do: you, a user, can define and re-use your\nown functions! Define and use them inline as part of a query to make that query\ncleaner, easier, and simpler to understand. Or, if you’re really cooking, you\ncan run a query that defines the routine in the schema of the catalog. This\nallows other Trino users to access the same routine time and time again as part\nof their other queries. It’s a level of customization that we’ve never had\nbefore in Trino, and no longer do you need to write your own Java plugins to\ncreate and re-use functions that do exactly what you need them to do.\nIf you want to learn more about SQL routines, you can check\nout the introduction to SQL routines\nin our documentation, as well as\na video from our SQL training series\nand a few example routines which give a\ngood look at how they can be used.\nSchema evolution and dynamic catalogs\nWhile we’re providing more power, customization, and flexibility to Trino users,\nit’s also important to highlight just how much has been added this year to make\nit easier to adjust things on the fly.\nSchema evolution in Hive was a big addition, allowing you to alter columns’ data\ntypes, rename columns, and handle nested fields when dropping columns. Instead\nof needing to use the underlying database or modify it some other way and reboot\nTrino, Trino can handle the adjustments on the fly.\nBut if you don’t use Hive and are feeling left out, we’ve experimentally taken\nthings one step further in 2023, adding dynamic catalogs to Trino. Rather than\nadjusting your schema one column at a time, what about adding or dropping an\nentire catalog in one go? You can do that now. Though it’s currently still\nbleeding-edge and not ready for widespread use on your important production\ndata sources, we’re looking forward to improving it and making it resilient and\nstable in 2024.\nProject Hummingbird\nTrino has always been about squeezing out every ounce of performance that you\ncan get. Check out our release notes and\nyou’ll see that every version includes at least a couple performance\nimprovements. Over time, these performance improvements add up to a substantial\ngain, meaning that version-over-version, year-over-year, Trino is always getting\nfaster. Project Hummingbird was a concerted effort this year to take a look at\nthe core engine and make a number of architectural changes paired with small\nimprovements that would add up to something very substantial.\nThe GitHub issue tracking it\nlists a ton of work that’s been accomplished already, with a lot of that work\ndone in 2023. Though stay tuned for more, because that’s only scratching the\nsurface…\nLakehouse improvements\nWant to leverage the historical log of all actions taken on a table in Hudi? The\nnew $timeline system table has you covered. How about in Delta Lake? We’ve got\nthe table_changes function for that, and views were added there, too. Too many\nmetadata tables to list were added to Iceberg, along with the REST, JDBC, and\nNessie catalogs for metadata.\nJava 21!\nJava 21. It’s required to run version Trino versions 436 and later. With\nthe upgrade from Java 17 to 21\ncomes a ton of improvements that will make development on Trino easier and\nbetter than ever, which will in turn make it faster and smoother than ever.\nThough not as huge of a deal as our upgrade to Java 17 last year, expect to see\nthe benefits coming down the pipeline as the engineers working on Trino are able\nto take advantage of the latest and greatest features in Java.\nTrino ecosystem updates\nThere’s more to Trino than Trino itself! With community updates and other\ntechnologies integrating with Trino, the number of ways you can access and use\nTrino are always growing. And the number of people taking care of Trino is\ngrowing, too.\nPython clients\nTrino’s own Python client saw\nheavy development in 2023. It was updated to support SQLAlchemy 2.0 and had type\nsupport fully fleshed out, making it a robust, free, and open-source tool for\nrunning your Trino queries.\nElsewhere in the Python ecosystem, we heard from\nboth Fugue\nand Ibis at Trino Fest, two different Python\nclients that integrate Trino with Python in new ways. Fugue is a wrapper that\nhelps integrate with other Python tools and clients, and Ibis can help convert\nyour Python code into SQL queries, making it feasible to be a 100% Python-based\norganization that still leverages the speed and power of a SQL query engine like\nTrino. We had Phillip Cloud from Voltron Data on\nfor an episode of the Trino Community Broadcast to talk about\nIbis in even more detail.\nAnd other clients, too!\nAlso on the Trino Community Broadcast repping new client support for Trino in\n2023 were Dolphin Scheduler, PopSQL,\nand Coginiti. Dolphin Scheduler is a workflow orchestrator - and\nscheduler! - that can be used to routinely run and coordinate Trino queries.\nPopSQL is like Google Drive for SQL, providing a suite of collaborative tools\nfor editing and working on queries as a team, including synchronous query\nediting, storing query history, and a robust commenting and feedback system.\nCoginiti is a high-powered data workspace that connects to Trino among many\nother things, supporting a host of powerful features that make it easier to\nreuse code and snippets of queries, as well as featuring embedded variables to\nminimize redundancy. If you want to learn more about any of these clients, click\nin on the links above to check out the Trino Community Broadcast where we went\nin-depth with them!\nOh, and don’t forget\nthe Trino Typescript client, for when\nyou want to work at the beautiful intersection of web development and accessing\ntons of data.\nNew maintainers\nTrino saw three new maintainers added to its ranks this year:\nManfred Moser\nJames Petty\nMateusz Gajewski\nManfred even took the liberty of updating the website’s\nroles page to list out all our maintainers. Thank you to\nthem for their dedication to making Trino the best it can be, and\ncongratulations to them on their shiny maintainer titles!\nConclusion\n2022 had been the busiest year in Trino’s history,\nbut 2023 has managed to surpass it. If you’re interested in contributing to\nTrino, make sure to check it out on GitHub.\nEven if you’re not interested in contributing, give us a\nstar on GitHub, anyway! It’s been a great year for\nCommander Bun Bun, and we can’t wait to show you what 2024 has in store for\neveryone’s favorite data rabbit."
author: "Cole Bowden"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/2023-review/wrapped.png\">\n    </p>\n    <p>If <a target=\"_blank\" href=\"https://www.newsroom.spotify.com/2023-wrapped/\">“Wrapped” is good enough for Spotify</a>, \nit’s good enough for Trino, right? As we look forward to a bright 2024, we can\nalso take a moment to get sentimental, look back at everything we’ve\naccomplished, and reflect on the progress we’ve made. Commander Bun Bun has been\nhard at work, so if you haven’t been paying close attention to Trino or want an\nidea of all that went down in 2023, we’re happy to present you with an end of\nyear recap. We’ll be exploring what’s gone on in the community, on development,\nthe events we’ve hosted, and discuss the cool new features and technologies you\ncan use when you’re running Trino.</p>\n<!--more-->\n<p>\n    \n</p>\n<h2 id=\"2023-by-the-numbers\">\n    2023 by the numbers <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#2023-by-the-numbers\">#</a>\n</h2>\n<ul>\n  <li>64,288 views 👀 on YouTube</li>\n  <li>5,872 hours watched ⌚on YouTube</li>\n  <li>5,018 new commits 💻 in GitHub</li>\n  <li>2,985 new stargazers ⭐ in GitHub</li>\n  <li>2,494 pull requests merged ✅ in GitHub</li>\n  <li>1,227 issues 📝 created in GitHub</li>\n  <li>704 new subscribers 📺 in YouTube</li>\n  <li>45 videos 🎥 uploaded to YouTube</li>\n  <li>30 Trino 🚀 releases</li>\n  <li>39 blog ✍️ posts</li>\n  <li>10 Trino Community Broadcast ▶️ episodes</li>\n  <li>2 Trino ⛰️ Summits</li>\n</ul>\n<p>We’re excited to say that Trino continued to grow in 2023:</p>\n<ul>\n  <li>GitHub stars increased by nearly 50% total and by 8% more than last year</li>\n  <li>Commits increased by 7%</li>\n  <li>Slack usage picked up dramatically</li>\n  <li>YouTube viewership was up 7% despite a lack of Pokemon-themed musical content compared to 2022 (our bad)</li>\n  <li>30 releases kept new versions of Trino coming out more than every other week.</li>\n</ul>\n<p>Thanks in part to all that growth, it’s more important than ever to be on\n<a target=\"_blank\" href=\"https://trino.io/slack\">our Slack</a>. If you’re a Trino user or community member and aren’t\nalready on there, you’re missing out! Make sure to join up for community\nannouncements, release statuses, the shared expertise of the entire Trino\ncommunity, and event-specific channels for discussion when we’re hosting things \nlike Trino Fest and Trino Summit. Speaking of those…</p>\n<h2 id=\"trino-events\">\n    Trino events <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#trino-events\">#</a>\n</h2>\n<p>One of the best parts of being an open source community is that it’s easy to be\nexcited and connect with others about using such a cool piece of technology.\nWhether that’s bringing Trino to new users who can take advantage of it, or\nsharing our learnings with other Trino users to make the most, events are one of\nthe best ways to distribute that knowledge. So what were we up to this year?</p>\n<h3 id=\"trino-fest-and-trino-summit\">\n    Trino Fest and Trino Summit <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#trino-fest-and-trino-summit\">#</a>\n</h3>\n<p><a target=\"_blank\" href=\"https://trino.io/blog/2023/06/20/trino-fest-2023-recap\">Trino Fest</a> and\n<a target=\"_blank\" href=\"https://trino.io/blog/2023/12/18/trino-summit-recap\">Trino Summit</a> are\nbecoming mainstays on the Trino calendar each year, and 2023 was no different.\nFormerly “Cinco de Trino,” we ditched the Cinco de Mayo theme and went with the\nsimpler “Trino Fest” in June, opting to theme it around Commander Bun Bun’s Lake\nHouse Summer Camp, with a focus on integrating Trino with lakehouse and data\nlake architectures. Trino Summit only wrapped up a little over a month ago,\nrounding out the year and highlighting some amazing developments that we’ll be\ntalking about later in this blog post.</p>\n<p>Trino Fest has historically been the smaller event, but it did some catching up\nin 2023, as both Trino Fest and Trino Summit were made virtual and expanded to 2\ndays this year. Easier to attend than ever before, we reached a combined total\nof about 1,200 live attendees, with thousands more views on demand.</p>\n<p>The lineups were packed with 34 talks across both events, featuring speakers\nfrom huge Trino users like Salesforce, Stripe, Apple, and Lyft, as well as from\nmajor Trino contributors like Starburst, Tabular, and Bloomberg. You can\nview <a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PLFnr63che7wbBu_czq-SS9iVdQ4CIv2z1\">recordings of every Trino Fest talk</a>\nand <a target=\"_blank\" href=\"https://www.youtube.com/playlist?list=PLFnr63che7wYeJLUjUaEftCFfjymhgLcq\">every Trino Summit talk</a>\non the Trino YouTube channel if you missed out.</p>\n<h3 id=\"meetups-and-international-events\">\n    Meetups and international events <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#meetups-and-international-events\">#</a>\n</h3>\n<p>One of the more exciting developments was our a major event in Japan -\n<a target=\"_blank\" href=\"https://trino.io/blog/2023/10/11/a-report-about-trino-conference-tokyo-2023\">Trino Conference Tokyo</a>. \nA virtual event with four sessions, it brought Trino to a Japanese-speaking\naudience and further pushed our favorite query engine across language borders.\nOn top of that,\n<a target=\"_blank\" href=\"https://www.starburst.io/info/india-trino-meetup-miq/?utm_source=trino&utm_medium=slack&utm_campaign=APAC-FY24-Q4-CM-india-Meetup-at-MiQ-Digital\">Starburst co-hosted a Trino meetup in Bengaluru</a>, \nand the community organized the first-ever Korean Trino meetup (pictured below).</p>\n<p><img src=\"https://trino.io/assets/blog/2023-review/trino-kr-meetup.png\"></p>\n<p>And last but not least,\n<a target=\"_blank\" href=\"https://trino.io/trino-the-definitive-guide\">Trino, the Definitive Guide, 2nd Edition</a>\nwas translated into Mandarin and Polish.</p>\n<h2 id=\"the-trino-gateway\">\n    The Trino Gateway <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#the-trino-gateway\">#</a>\n</h2>\n<p>One of the biggest announcements in the Trino community this year was\nthe <a target=\"_blank\" href=\"https://trino.io/blog/2023/09/28/trino-gateway\">launch of the Trino Gateway</a>. A proxy and\nload-balancer, it’s a crucial piece of Trino infrastructure for organizations\nthat need more than one Trino cluster to suit their needs.</p>\n<p>Why would you want more than one Trino cluster? Maybe you want one cluster with\nfault-tolerant execution enabled for ETL workloads and another cluster for\nspeedy ad-hoc analytics. Perhaps you have analysts performing wildly\ndifferently-sized queries, and high-volume compute-intensive queries are proving\nto be bad neighbors for lightweight and low-latency queries that shouldn’t take\nmore than milliseconds. Historically, users would have to manually manage\nswapping between clusters, establish a new connection, and try not to get a\nheadache in the process.</p>\n<p>Enter the Trino Gateway! By routing all of your Trino traffic automatically,\nit’s never been easier to manage, maintain, and query multiple Trino clusters at\nonce. Load balancing ensures that no one cluster gets overworked, and it’s the\nperfect way to stop large queries from getting in the way of the little guys.\nAdd in the fact that you can seamlessly shut down an individual cluster for\nupdates or maintenance while the Trino Gateway routes traffic elsewhere, and\nit’s easy to see why this is such a game-changer. We’re super excited for it to\nbe out there in the world, and we hope it makes running Trino at the largest\nscales simpler and faster than ever before.</p>\n<p>For more information on the Trino Gateway, check out:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/blog/2023/09/28/trino-gateway\">The announcement blog post</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/trinodb/trino-gateway/blob/main/docs/quickstart.md\">The quickstart guide</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/trinodb/trino-gateway/tree/main\">The main Trino Gateway repo</a></li>\n</ul>\n<h2 id=\"new-features\">\n    New features <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#new-features\">#</a>\n</h2>\n<p>With more development on Trino than ever before, there were obviously a ton of\nnew things being added to it. Let’s go over some of the biggest adds in 2023.</p>\n<h3 id=\"sql-routines\">\n    SQL routines <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#sql-routines\">#</a>\n</h3>\n<p>Whether you want to refer to them as SQL routines or as user-defined functions,\nthey’re a big deal. Fresh off the presses and only a few months old, they do\nexactly what you’d expect them to do: you, a user, can define and re-use your\nown functions! Define and use them inline as part of a query to make that query\ncleaner, easier, and simpler to understand. Or, if you’re really cooking, you\ncan run a query that defines the routine in the schema of the catalog. This\nallows other Trino users to access the same routine time and time again as part\nof their other queries. It’s a level of customization that we’ve never had\nbefore in Trino, and no longer do you need to write your own Java plugins to\ncreate and re-use functions that do exactly what you need them to do.</p>\n<p>If you want to learn more about SQL routines, you can check\nout <a target=\"_blank\" href=\"https://trino.io/docs/current/routines/introduction.html\">the introduction to SQL routines</a>\nin our documentation, as well as\n<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=1siAYR6BzzY&list=PLFnr63che7wYzZoo5yyEF5R1QrOH6VRq3&index=4\">a video from our SQL training series</a>\nand a few <a target=\"_blank\" href=\"https://trino.io/docs/current/routines/examples.html\">example routines</a> which give a\ngood look at how they can be used.</p>\n<h3 id=\"schema-evolution-and-dynamic-catalogs\">\n    Schema evolution and dynamic catalogs <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#schema-evolution-and-dynamic-catalogs\">#</a>\n</h3>\n<p>While we’re providing more power, customization, and flexibility to Trino users,\nit’s also important to highlight just how much has been added this year to make\nit easier to adjust things on the fly.</p>\n<p>Schema evolution in Hive was a big addition, allowing you to alter columns’ data\ntypes, rename columns, and handle nested fields when dropping columns. Instead\nof needing to use the underlying database or modify it some other way and reboot\nTrino, Trino can handle the adjustments on the fly.</p>\n<p>But if you don’t use Hive and are feeling left out, we’ve experimentally taken\nthings one step further in 2023, adding dynamic catalogs to Trino. Rather than\nadjusting your schema one column at a time, what about adding or dropping an\nentire catalog in one go? You can do that now. Though it’s currently still\nbleeding-edge and not ready for widespread use on your important production\ndata sources, we’re looking forward to improving it and making it resilient and\nstable in 2024.</p>\n<h3 id=\"project-hummingbird\">\n    Project Hummingbird <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#project-hummingbird\">#</a>\n</h3>\n<p>Trino has always been about squeezing out every ounce of performance that you\ncan get. Check out our <a target=\"_blank\" href=\"https://trino.io/docs/current/release.html\">release notes</a> and\nyou’ll see that every version includes at least a couple performance\nimprovements. Over time, these performance improvements add up to a substantial\ngain, meaning that version-over-version, year-over-year, Trino is always getting\nfaster. Project Hummingbird was a concerted effort this year to take a look at\nthe core engine and make a number of architectural changes paired with small\nimprovements that would add up to something very substantial.\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/14237\">The GitHub issue tracking it</a>\nlists a ton of work that’s been accomplished already, with a lot of that work\ndone in 2023. Though stay tuned for more, because that’s only scratching the\nsurface…</p>\n<h3 id=\"lakehouse-improvements\">\n    Lakehouse improvements <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#lakehouse-improvements\">#</a>\n</h3>\n<p>Want to leverage the historical log of all actions taken on a table in Hudi? The\nnew <code>$timeline</code> system table has you covered. How about in Delta Lake? We’ve got\nthe <code>table_changes</code> function for that, and views were added there, too. Too many\nmetadata tables to list were added to Iceberg, along with the REST, JDBC, and\nNessie catalogs for metadata.</p>\n<h3 id=\"java-21\">\n    Java 21! <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#java-21\">#</a>\n</h3>\n<p>Java 21. It’s required to run version Trino versions 436 and later. With\n<a target=\"_blank\" href=\"https://trino.io/blog/2023/11/03/java-21\">the upgrade from Java 17 to 21</a>\ncomes a ton of improvements that will make development on Trino easier and\nbetter than ever, which will in turn make it faster and smoother than ever.\nThough not as huge of a deal as our upgrade to Java 17 last year, expect to see\nthe benefits coming down the pipeline as the engineers working on Trino are able\nto take advantage of the latest and greatest features in Java.</p>\n<h2 id=\"trino-ecosystem-updates\">\n    Trino ecosystem updates <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#trino-ecosystem-updates\">#</a>\n</h2>\n<p>There’s more to Trino than Trino itself! With community updates and other\ntechnologies integrating with Trino, the number of ways you can access and use\nTrino are always growing. And the number of people taking care of Trino is\ngrowing, too.</p>\n<h3 id=\"python-clients\">\n    Python clients <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#python-clients\">#</a>\n</h3>\n<p>Trino’s own <a target=\"_blank\" href=\"https://github.com/trinodb/trino-python-client\">Python client</a> saw\nheavy development in 2023. It was updated to support SQLAlchemy 2.0 and had type\nsupport fully fleshed out, making it a robust, free, and open-source tool for\nrunning your Trino queries.</p>\n<p>Elsewhere in the Python ecosystem, we heard from\nboth <a target=\"_blank\" href=\"https://youtu.be/aKhI1Phfn-o\">Fugue</a>\nand <a target=\"_blank\" href=\"https://youtu.be/JMUtPl-cMRc\">Ibis</a> at Trino Fest, two different Python\nclients that integrate Trino with Python in new ways. Fugue is a wrapper that\nhelps integrate with other Python tools and clients, and Ibis can help convert\nyour Python code into SQL queries, making it feasible to be a 100% Python-based\norganization that still leverages the speed and power of a SQL query engine like\nTrino. We had Phillip Cloud from Voltron Data on\nfor <a target=\"_blank\" href=\"https://trino.io/episodes/49\">an episode of the Trino Community Broadcast</a> to talk about\nIbis in even more detail.</p>\n<h3 id=\"and-other-clients-too\">\n    And other clients, too! <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#and-other-clients-too\">#</a>\n</h3>\n<p>Also on the Trino Community Broadcast repping new client support for Trino in\n2023 were <a target=\"_blank\" href=\"https://trino.io/episodes/45\">Dolphin Scheduler</a>, <a target=\"_blank\" href=\"https://trino.io/episodes/51\">PopSQL</a>,\nand <a target=\"_blank\" href=\"https://trino.io/episodes/53\">Coginiti</a>. Dolphin Scheduler is a workflow orchestrator - and\nscheduler! - that can be used to routinely run and coordinate Trino queries.\nPopSQL is like Google Drive for SQL, providing a suite of collaborative tools\nfor editing and working on queries as a team, including synchronous query\nediting, storing query history, and a robust commenting and feedback system.\nCoginiti is a high-powered data workspace that connects to Trino among many\nother things, supporting a host of powerful features that make it easier to\nreuse code and snippets of queries, as well as featuring embedded variables to\nminimize redundancy. If you want to learn more about any of these clients, click\nin on the links above to check out the Trino Community Broadcast where we went\nin-depth with them!</p>\n<p>Oh, and don’t forget\nthe <a target=\"_blank\" href=\"https://regadas.dev/trino-js-client/\">Trino Typescript client</a>, for when\nyou want to work at the beautiful intersection of web development and accessing\ntons of data.</p>\n<h3 id=\"new-maintainers\">\n    New maintainers <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#new-maintainers\">#</a>\n</h3>\n<p>Trino saw three new maintainers added to its ranks this year:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://github.com/mosabua\">Manfred Moser</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/pettyjamesm\">James Petty</a></li>\n  <li><a target=\"_blank\" href=\"https://github.com/wendigo\">Mateusz Gajewski</a></li>\n</ul>\n<p>Manfred even took the liberty of updating the website’s\n<a target=\"_blank\" href=\"https://trino.io/development/roles\">roles page</a> to list out all our maintainers. Thank you to\nthem for their dedication to making Trino the best it can be, and\ncongratulations to them on their shiny maintainer titles!</p>\n<h2 id=\"conclusion\">\n    Conclusion <a target=\"_blank\" href=\"https://trino.io/blog/2024/01/19/trino-2023-wrapped.html#conclusion\">#</a>\n</h2>\n<p><a target=\"_blank\" href=\"https://trino.io/blog/2023/01/10/trino-2022-the-rabbit-reflects\">2022 had been the busiest year in Trino’s history</a>,\nbut 2023 has managed to surpass it. If you’re interested in contributing to\nTrino, make sure to check it out on <a target=\"_blank\" href=\"https://github.com/trinodb/trino\">GitHub</a>.\nEven if you’re not interested in contributing, give us a\n<a target=\"_blank\" href=\"https://trino.io/star\">star</a> on GitHub, anyway! It’s been a great year for\nCommander Bun Bun, and we can’t wait to show you what 2024 has in store for\neveryone’s favorite data rabbit.</p>\n  </div>\n</article>\n</div>"
---

If “Wrapped” is good enough for Spotify, 
it’s good enough for Trino, right? As we look forward to a bright 2024, we can
also take a moment to get sentimental, look back at everything we’ve
accomplished, and reflect on the progress we’ve made. Commander Bun Bun has been
hard at work, so if you haven’t been paying close attention to Trino or want an
idea of all that went down in 2023, we’re happy to present you with an end of
year recap. We’ll be exploring what’s gone on in the community, on development,
the events we’ve hosted, and discuss the cool new features and technologies you
can use when you’re running Trino.



2023 by the numbers
64,288 views 👀 on YouTube
5,872 hours watched ⌚on YouTube
5,018 new commits 💻 in GitHub
2,985 new stargazers ⭐ in GitHub
2,494 pull requests merged ✅ in GitHub
1,227 issues 📝 created in GitHub
704 new subscribers 📺 in YouTube
45 videos 🎥 uploaded to YouTube
30 Trino 🚀 releases
39 blog ✍️ posts
10 Trino Community Broadcast ▶️ episodes
2 Trino ⛰️ Summits
We’re excited to say that Trino continued to grow in 2023:
GitHub stars increased by nearly 50% total and by 8% more than last year
Commits increased by 7%
Slack usage picked up dramatically
YouTube viewership was up 7% despite a lack of Pokemon-themed musical content compared to 2022 (our bad)
30 releases kept new versions of Trino coming out more than every other week.
Thanks in part to all that growth, it’s more important than ever to be on
our Slack. If you’re a Trino user or community member and aren’t
already on there, you’re missing out! Make sure to join up for community
announcements, release statuses, the shared expertise of the entire Trino
community, and event-specific channels for discussion when we’re hosting things 
like Trino Fest and Trino Summit. Speaking of those…
Trino events
One of the best parts of being an open source community is that it’s easy to be
excited and connect with others about using such a cool piece of technology.
Whether that’s bringing Trino to new users who can take advantage of it, or
sharing our learnings with other Trino users to make the most, events are one of
the best ways to distribute that knowledge. So what were we up to this year?
Trino Fest and Trino Summit
Trino Fest and
Trino Summit are
becoming mainstays on the Trino calendar each year, and 2023 was no different.
Formerly “Cinco de Trino,” we ditched the Cinco de Mayo theme and went with the
simpler “Trino Fest” in June, opting to theme it around Commander Bun Bun’s Lake
House Summer Camp, with a focus on integrating Trino with lakehouse and data
lake architectures. Trino Summit only wrapped up a little over a month ago,
rounding out the year and highlighting some amazing developments that we’ll be
talking about later in this blog post.
Trino Fest has historically been the smaller event, but it did some catching up
in 2023, as both Trino Fest and Trino Summit were made virtual and expanded to 2
days this year. Easier to attend than ever before, we reached a combined total
of about 1,200 live attendees, with thousands more views on demand.
The lineups were packed with 34 talks across both events, featuring speakers
from huge Trino users like Salesforce, Stripe, Apple, and Lyft, as well as from
major Trino contributors like Starburst, Tabular, and Bloomberg. You can
view recordings of every Trino Fest talk
and every Trino Summit talk
on the Trino YouTube channel if you missed out.
Meetups and international events
One of the more exciting developments was our a major event in Japan -
Trino Conference Tokyo. 
A virtual event with four sessions, it brought Trino to a Japanese-speaking
audience and further pushed our favorite query engine across language borders.
On top of that,
Starburst co-hosted a Trino meetup in Bengaluru, 
and the community organized the first-ever Korean Trino meetup (pictured below).

And last but not least,
Trino, the Definitive Guide, 2nd Edition
was translated into Mandarin and Polish.
The Trino Gateway
One of the biggest announcements in the Trino community this year was
the launch of the Trino Gateway. A proxy and
load-balancer, it’s a crucial piece of Trino infrastructure for organizations
that need more than one Trino cluster to suit their needs.
Why would you want more than one Trino cluster? Maybe you want one cluster with
fault-tolerant execution enabled for ETL workloads and another cluster for
speedy ad-hoc analytics. Perhaps you have analysts performing wildly
differently-sized queries, and high-volume compute-intensive queries are proving
to be bad neighbors for lightweight and low-latency queries that shouldn’t take
more than milliseconds. Historically, users would have to manually manage
swapping between clusters, establish a new connection, and try not to get a
headache in the process.
Enter the Trino Gateway! By routing all of your Trino traffic automatically,
it’s never been easier to manage, maintain, and query multiple Trino clusters at
once. Load balancing ensures that no one cluster gets overworked, and it’s the
perfect way to stop large queries from getting in the way of the little guys.
Add in the fact that you can seamlessly shut down an individual cluster for
updates or maintenance while the Trino Gateway routes traffic elsewhere, and
it’s easy to see why this is such a game-changer. We’re super excited for it to
be out there in the world, and we hope it makes running Trino at the largest
scales simpler and faster than ever before.
For more information on the Trino Gateway, check out:
The announcement blog post
The quickstart guide
The main Trino Gateway repo
New features
With more development on Trino than ever before, there were obviously a ton of
new things being added to it. Let’s go over some of the biggest adds in 2023.
SQL routines
Whether you want to refer to them as SQL routines or as user-defined functions,
they’re a big deal. Fresh off the presses and only a few months old, they do
exactly what you’d expect them to do: you, a user, can define and re-use your
own functions! Define and use them inline as part of a query to make that query
cleaner, easier, and simpler to understand. Or, if you’re really cooking, you
can run a query that defines the routine in the schema of the catalog. This
allows other Trino users to access the same routine time and time again as part
of their other queries. It’s a level of customization that we’ve never had
before in Trino, and no longer do you need to write your own Java plugins to
create and re-use functions that do exactly what you need them to do.
If you want to learn more about SQL routines, you can check
out the introduction to SQL routines
in our documentation, as well as
a video from our SQL training series
and a few example routines which give a
good look at how they can be used.
Schema evolution and dynamic catalogs
While we’re providing more power, customization, and flexibility to Trino users,
it’s also important to highlight just how much has been added this year to make
it easier to adjust things on the fly.
Schema evolution in Hive was a big addition, allowing you to alter columns’ data
types, rename columns, and handle nested fields when dropping columns. Instead
of needing to use the underlying database or modify it some other way and reboot
Trino, Trino can handle the adjustments on the fly.
But if you don’t use Hive and are feeling left out, we’ve experimentally taken
things one step further in 2023, adding dynamic catalogs to Trino. Rather than
adjusting your schema one column at a time, what about adding or dropping an
entire catalog in one go? You can do that now. Though it’s currently still
bleeding-edge and not ready for widespread use on your important production
data sources, we’re looking forward to improving it and making it resilient and
stable in 2024.
Project Hummingbird
Trino has always been about squeezing out every ounce of performance that you
can get. Check out our release notes and
you’ll see that every version includes at least a couple performance
improvements. Over time, these performance improvements add up to a substantial
gain, meaning that version-over-version, year-over-year, Trino is always getting
faster. Project Hummingbird was a concerted effort this year to take a look at
the core engine and make a number of architectural changes paired with small
improvements that would add up to something very substantial.
The GitHub issue tracking it
lists a ton of work that’s been accomplished already, with a lot of that work
done in 2023. Though stay tuned for more, because that’s only scratching the
surface…
Lakehouse improvements
Want to leverage the historical log of all actions taken on a table in Hudi? The
new $timeline system table has you covered. How about in Delta Lake? We’ve got
the table_changes function for that, and views were added there, too. Too many
metadata tables to list were added to Iceberg, along with the REST, JDBC, and
Nessie catalogs for metadata.
Java 21!
Java 21. It’s required to run version Trino versions 436 and later. With
the upgrade from Java 17 to 21
comes a ton of improvements that will make development on Trino easier and
better than ever, which will in turn make it faster and smoother than ever.
Though not as huge of a deal as our upgrade to Java 17 last year, expect to see
the benefits coming down the pipeline as the engineers working on Trino are able
to take advantage of the latest and greatest features in Java.
Trino ecosystem updates
There’s more to Trino than Trino itself! With community updates and other
technologies integrating with Trino, the number of ways you can access and use
Trino are always growing. And the number of people taking care of Trino is
growing, too.
Python clients
Trino’s own Python client saw
heavy development in 2023. It was updated to support SQLAlchemy 2.0 and had type
support fully fleshed out, making it a robust, free, and open-source tool for
running your Trino queries.
Elsewhere in the Python ecosystem, we heard from
both Fugue
and Ibis at Trino Fest, two different Python
clients that integrate Trino with Python in new ways. Fugue is a wrapper that
helps integrate with other Python tools and clients, and Ibis can help convert
your Python code into SQL queries, making it feasible to be a 100% Python-based
organization that still leverages the speed and power of a SQL query engine like
Trino. We had Phillip Cloud from Voltron Data on
for an episode of the Trino Community Broadcast to talk about
Ibis in even more detail.
And other clients, too!
Also on the Trino Community Broadcast repping new client support for Trino in
2023 were Dolphin Scheduler, PopSQL,
and Coginiti. Dolphin Scheduler is a workflow orchestrator - and
scheduler! - that can be used to routinely run and coordinate Trino queries.
PopSQL is like Google Drive for SQL, providing a suite of collaborative tools
for editing and working on queries as a team, including synchronous query
editing, storing query history, and a robust commenting and feedback system.
Coginiti is a high-powered data workspace that connects to Trino among many
other things, supporting a host of powerful features that make it easier to
reuse code and snippets of queries, as well as featuring embedded variables to
minimize redundancy. If you want to learn more about any of these clients, click
in on the links above to check out the Trino Community Broadcast where we went
in-depth with them!
Oh, and don’t forget
the Trino Typescript client, for when
you want to work at the beautiful intersection of web development and accessing
tons of data.
New maintainers
Trino saw three new maintainers added to its ranks this year:
Manfred Moser
James Petty
Mateusz Gajewski
Manfred even took the liberty of updating the website’s
roles page to list out all our maintainers. Thank you to
them for their dedication to making Trino the best it can be, and
congratulations to them on their shiny maintainer titles!
Conclusion
2022 had been the busiest year in Trino’s history,
but 2023 has managed to surpass it. If you’re interested in contributing to
Trino, make sure to check it out on GitHub.
Even if you’re not interested in contributing, give us a
star on GitHub, anyway! It’s been a great year for
Commander Bun Bun, and we can’t wait to show you what 2024 has in store for
everyone’s favorite data rabbit.
