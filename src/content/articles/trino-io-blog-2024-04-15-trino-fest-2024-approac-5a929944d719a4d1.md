---
title: "A sneak peek of Trino Fest 2024"
link: "https://trino.io/blog/2024/04/15/trino-fest-2024-approaches.html"
guid: "https://trino.io/blog/2024/04/15/trino-fest-2024-approaches.html"
pubDate: "2024-04-15T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Trino Fest is drawing ever closer. Commander Bun Bun has been hard at work\nbehind the scenes arranging the schedule and making sure that Trino’s trip to\nBoston is going to be a great one. In case you missed it,\nwe announced Trino Fest\na couple months ago, and if you have missed it, make sure to go register to\nattend! All our speakers will be in person in downtown Boston on the 13th of\nJune, with plenty of opportunities for networking and a happy hour event at the\nend of the day. But if you can’t make the trip to enjoy the lovely New England\nsummer, we’ll also be live-streaming the event, and you can register to join us\nvirtually.\n\n\nStill on the fence, though? Read on for a preview of our speaker lineup and\nbrief summaries of their talks. Keep in mind this also isn’t the full lineup,\nand we’ll follow up soon with the last few talks that round out the schedule.\nA brief word from our sponsors…\nThank you to our sponsors for making this event happen…\nAnd now onto what you’re waiting for: a preview of most of the talks coming to\nTrino Fest this year!\nLakehouses\nIt’s no secret that using Trino as part of your lakehouse has become one of its\nmajor use cases in the past few years. We’re excited to say that at Trino Fest,\nwe’ll have representation for each of the modern big three table formats:\nIceberg, Delta Lake, and Hudi.\nIceberg\nApache Iceberg will be covered twice: Amogh\nJahagirdar from Tabular will be diving into the world of\nIceberg views and how they can be leveraged to coordinate across different query\nlanguages and dialects. Amit Gilad from Cloudinary\nwill be covering the story of migrating out of Snowflake to the wonderful world\nof open table formats and Iceberg.\nDelta Lake\nMarius Grama, a Trino contributor at Starburst,\nwill be going into detail on the history, development, and improvements to the\nDelta Lake connector. With\ntime travel for the Delta Lake connector\nlanding in Trino 445, it’s one of the most exciting areas for development in\nopen source Trino, and there’s some interesting stories that Marius is excited\nto share with the community.\nHudi\nRounding out data lakes, Ethan Guo from Onehouse\nwill be diving into Trino’s Hudi connector, giving\nan update on what’s landed lately to improve performance and functionality.\nHe’ll also give a preview of what’s coming soon. The features are flying in, and\nif you’re a current or prospective user of Hudi with Trino, you won’t want to\nmiss out.\nData takes\nOf course, there’s more to Trino than querying data lakes, and there’s a wide\nvariety of talks to discuss the other activities going on within the Trino\ncommunity.\nSmall scale\nBen Jeter at Executive Homes, who gave\na talk at Trino Fest last year\nwhile at Datto, is back to discuss running Trino at a\nmore moderate scale than that we’re used to hearing about in the Trino space.\nForget petabytes and exabytes, and welcome a tiny cluster querying thousands,\nnot millions, of records that still derives huge value from Trino. It’s a great\nplaybook for smaller startups and enterprises who still need robust, flexible,\nperformant analytics.\nMaximizing performance\nJonas Kylling from Dune will be detailing how they’ve\nmanaged to optimize Trino and squeeze out every ounce of performance to reduce\nquery costs and runtimes. That includes leveraging the new Alluxio-based file\nsystem caching, emulating various cluster sizes to avoid expensive idle cluster\ntime, and storing, sampling, and filtering query results to avoid re-executing\nqueries.\nQuery intelligence\nMarton Bod and Vinitha Gankidi from Apple bring insights to query intelligence.\nThey’ll demonstrate how Apple has understood when their clusters are most\nutilized and who’s using them, enabling slicing and dicing along different\ndimensions. Having a query intelligence dataset can be used for real-time\ncluster dashboarding, self-service troubleshooting, and automatic generation of\nrecommendations for users, all of which can empower Trino to be better than\never.\nAnd more!\nOf course, Trino’s own Martin Traverso will be giving a keynote on the latest\nand greatest in the project, covering everything big that’s landed since Trino\nSummit, as well as a glimpse at the roadmap for the project in the coming few\nmonths. Several other big talks are falling into place that we can’t announce\njust yet, so stay tuned for more info as the event draws nearer.\nTrino contributor congregation\nThe day after Trino Fest, we’ll also be hosting an in-person meetup for\nTrino contributors and engineers to catch up, discuss the Trino roadmap, and\nengage directly with the maintainers in-person. It’s a great opportunity to put\nfaces and voices to those GitHub handles, align on the big ideas or tricky PRs\nthat have been moving slowly, and find more ways to get involved in Trino\ndevelopment. If you’re interested in attending, message Manfred Moser or Cole\nBowden on the Trino Slack, and we’ll get you added to\nthe attendee list and share more details."
author: "Cole Bowden"
contentHtml: "<p>Trino Fest is drawing ever closer. Commander Bun Bun has been hard at work\nbehind the scenes arranging the schedule and making sure that Trino’s trip to\nBoston is going to be a great one. In case you missed it,\n<a href=\"/blog/2024/02/20/announcing-trino-fest-2024.html\">we announced Trino Fest</a>\na couple months ago, and if you <em>have</em> missed it, make sure to go register to\nattend! All our speakers will be in person in downtown Boston on the 13th of\nJune, with plenty of opportunities for networking and a happy hour event at the\nend of the day. But if you can’t make the trip to enjoy the lovely New England\nsummer, we’ll also be live-streaming the event, and you can register to join us\nvirtually.</p>\n\n<div class=\"card-deck spacer-30\">\n    <a class=\"btn btn-orange\" href=\"http://www.starburst.io/info/trino-fest-2024?utm_medium=trino&amp;utm_source=website&amp;utm_campaign=Global-FY25-Q2-EV-Trino-Fest-2024&amp;utm_content=Blog-2\">\n        Register to attend!\n    </a>\n</div>\n<div class=\"spacer-30\"></div>\n\n<p>Still on the fence, though? Read on for a preview of our speaker lineup and\nbrief summaries of their talks. Keep in mind this also isn’t the full lineup,\nand we’ll follow up soon with the last few talks that round out the schedule.</p>\n\n<!--more-->\n\n<h2 id=\"a-brief-word-from-our-sponsors\">A brief word from our sponsors…</h2>\n\n<p>Thank you to our sponsors for making this event happen…</p>\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm\">\n      <a href=\"https://www.starburst.io/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/starburst-small.png\" title=\"Starburst, event host and organizer\" />\n      </a>\n    </div>\n    <div class=\"col-sm\">\n      <a href=\"https://www.onehouse.ai/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/onehouse-small.png\" title=\"Onehouse, event sponsor\" />\n      </a>\n    </div>\n    <div class=\"col-sm\">\n      <a href=\"https://www.startree.ai/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/startree-small.png\" title=\"Startree, event sponsor\" />\n      </a>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-sm\">\n      <a href=\"https://www.alluxio.io/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/alluxio-small.png\" title=\"Alluxio, event sponsor\" />\n      </a>\n    </div>\n    <div class=\"col-sm\">\n      <a href=\"https://cloudinary.com/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/cloudinary-small.png\" title=\"Cloudinary, event sponsor\" />\n      </a>\n    </div>\n    <div class=\"col-sm\">\n      <a href=\"https://www.upsolver.com/\" target=\"_blank\">\n        <img src=\"https://trino.io/assets/images/logos/upsolver-small.png\" title=\"Upsolver, event sponsor\" />\n      </a>\n    </div>\n  </div>\n</div>\n\n<p>And now onto what you’re waiting for: a preview of most of the talks coming to\nTrino Fest this year!</p>\n\n<h2 id=\"lakehouses\">Lakehouses</h2>\n\n<p>It’s no secret that using Trino as part of your lakehouse has become one of its\nmajor use cases in the past few years. We’re excited to say that at Trino Fest,\nwe’ll have representation for each of the modern big three table formats:\nIceberg, Delta Lake, and Hudi.</p>\n\n<h3 id=\"iceberg\">Iceberg</h3>\n\n<p><a href=\"https://iceberg.apache.org/\">Apache Iceberg</a> will be covered twice: Amogh\nJahagirdar from <a href=\"https://tabular.io/\">Tabular</a> will be diving into the world of\nIceberg views and how they can be leveraged to coordinate across different query\nlanguages and dialects. Amit Gilad from <a href=\"https://cloudinary.com/\">Cloudinary</a>\nwill be covering the story of migrating out of Snowflake to the wonderful world\nof open table formats and Iceberg.</p>\n\n<h3 id=\"delta-lake\">Delta Lake</h3>\n\n<p>Marius Grama, a Trino contributor at <a href=\"https://www.starburst.io/\">Starburst</a>,\nwill be going into detail on the history, development, and improvements to the\n<a href=\"https://delta.io/\">Delta Lake</a> connector. With\n<a href=\"/blog/2024/04/11/time-travel-delta-lake.html\">time travel for the Delta Lake connector</a>\nlanding in Trino 445, it’s one of the most exciting areas for development in\nopen source Trino, and there’s some interesting stories that Marius is excited\nto share with the community.</p>\n\n<h3 id=\"hudi\">Hudi</h3>\n\n<p>Rounding out data lakes, Ethan Guo from <a href=\"https://www.onehouse.ai/\">Onehouse</a>\nwill be diving into Trino’s <a href=\"https://hudi.apache.org/\">Hudi</a> connector, giving\nan update on what’s landed lately to improve performance and functionality.\nHe’ll also give a preview of what’s coming soon. The features are flying in, and\nif you’re a current or prospective user of Hudi with Trino, you won’t want to\nmiss out.</p>\n\n<h2 id=\"data-takes\">Data takes</h2>\n\n<p>Of course, there’s more to Trino than querying data lakes, and there’s a wide\nvariety of talks to discuss the other activities going on within the Trino\ncommunity.</p>\n\n<h3 id=\"small-scale\">Small scale</h3>\n\n<p>Ben Jeter at <a href=\"https://www.executivehomes.com/\">Executive Homes</a>, who gave\n<a href=\"/blog/2023/07/25/trino-fest-2023-datto.html\">a talk at Trino Fest last year</a>\nwhile at <a href=\"https://www.datto.com/\">Datto</a>, is back to discuss running Trino at a\nmore moderate scale than that we’re used to hearing about in the Trino space.\nForget petabytes and exabytes, and welcome a tiny cluster querying thousands,\nnot millions, of records that still derives huge value from Trino. It’s a great\nplaybook for smaller startups and enterprises who still need robust, flexible,\nperformant analytics.</p>\n\n<h3 id=\"maximizing-performance\">Maximizing performance</h3>\n\n<p>Jonas Kylling from <a href=\"https://dune.com/about\">Dune</a> will be detailing how they’ve\nmanaged to optimize Trino and squeeze out every ounce of performance to reduce\nquery costs and runtimes. That includes leveraging the new Alluxio-based file\nsystem caching, emulating various cluster sizes to avoid expensive idle cluster\ntime, and storing, sampling, and filtering query results to avoid re-executing\nqueries.</p>\n\n<h3 id=\"query-intelligence\">Query intelligence</h3>\n\n<p>Marton Bod and Vinitha Gankidi from Apple bring insights to query intelligence.\nThey’ll demonstrate how Apple has understood when their clusters are most\nutilized and who’s using them, enabling slicing and dicing along different\ndimensions. Having a query intelligence dataset can be used for real-time\ncluster dashboarding, self-service troubleshooting, and automatic generation of\nrecommendations for users, all of which can empower Trino to be better than\never.</p>\n\n<h2 id=\"and-more\">And more!</h2>\n\n<p>Of course, Trino’s own Martin Traverso will be giving a keynote on the latest\nand greatest in the project, covering everything big that’s landed since Trino\nSummit, as well as a glimpse at the roadmap for the project in the coming few\nmonths. Several other big talks are falling into place that we can’t announce\njust yet, so stay tuned for more info as the event draws nearer.</p>\n\n<h2 id=\"trino-contributor-congregation\">Trino contributor congregation</h2>\n\n<p>The day after Trino Fest, we’ll also be hosting an in-person meetup for\nTrino contributors and engineers to catch up, discuss the Trino roadmap, and\nengage directly with the maintainers in-person. It’s a great opportunity to put\nfaces and voices to those GitHub handles, align on the big ideas or tricky PRs\nthat have been moving slowly, and find more ways to get involved in Trino\ndevelopment. If you’re interested in attending, message Manfred Moser or Cole\nBowden on the <a href=\"https://trino.io/slack.html\">Trino Slack</a>, and we’ll get you added to\nthe attendee list and share more details.</p>"
---

Trino Fest is drawing ever closer. Commander Bun Bun has been hard at work
behind the scenes arranging the schedule and making sure that Trino’s trip to
Boston is going to be a great one. In case you missed it,
we announced Trino Fest
a couple months ago, and if you have missed it, make sure to go register to
attend! All our speakers will be in person in downtown Boston on the 13th of
June, with plenty of opportunities for networking and a happy hour event at the
end of the day. But if you can’t make the trip to enjoy the lovely New England
summer, we’ll also be live-streaming the event, and you can register to join us
virtually.


Still on the fence, though? Read on for a preview of our speaker lineup and
brief summaries of their talks. Keep in mind this also isn’t the full lineup,
and we’ll follow up soon with the last few talks that round out the schedule.
A brief word from our sponsors…
Thank you to our sponsors for making this event happen…
And now onto what you’re waiting for: a preview of most of the talks coming to
Trino Fest this year!
Lakehouses
It’s no secret that using Trino as part of your lakehouse has become one of its
major use cases in the past few years. We’re excited to say that at Trino Fest,
we’ll have representation for each of the modern big three table formats:
Iceberg, Delta Lake, and Hudi.
Iceberg
Apache Iceberg will be covered twice: Amogh
Jahagirdar from Tabular will be diving into the world of
Iceberg views and how they can be leveraged to coordinate across different query
languages and dialects. Amit Gilad from Cloudinary
will be covering the story of migrating out of Snowflake to the wonderful world
of open table formats and Iceberg.
Delta Lake
Marius Grama, a Trino contributor at Starburst,
will be going into detail on the history, development, and improvements to the
Delta Lake connector. With
time travel for the Delta Lake connector
landing in Trino 445, it’s one of the most exciting areas for development in
open source Trino, and there’s some interesting stories that Marius is excited
to share with the community.
Hudi
Rounding out data lakes, Ethan Guo from Onehouse
will be diving into Trino’s Hudi connector, giving
an update on what’s landed lately to improve performance and functionality.
He’ll also give a preview of what’s coming soon. The features are flying in, and
if you’re a current or prospective user of Hudi with Trino, you won’t want to
miss out.
Data takes
Of course, there’s more to Trino than querying data lakes, and there’s a wide
variety of talks to discuss the other activities going on within the Trino
community.
Small scale
Ben Jeter at Executive Homes, who gave
a talk at Trino Fest last year
while at Datto, is back to discuss running Trino at a
more moderate scale than that we’re used to hearing about in the Trino space.
Forget petabytes and exabytes, and welcome a tiny cluster querying thousands,
not millions, of records that still derives huge value from Trino. It’s a great
playbook for smaller startups and enterprises who still need robust, flexible,
performant analytics.
Maximizing performance
Jonas Kylling from Dune will be detailing how they’ve
managed to optimize Trino and squeeze out every ounce of performance to reduce
query costs and runtimes. That includes leveraging the new Alluxio-based file
system caching, emulating various cluster sizes to avoid expensive idle cluster
time, and storing, sampling, and filtering query results to avoid re-executing
queries.
Query intelligence
Marton Bod and Vinitha Gankidi from Apple bring insights to query intelligence.
They’ll demonstrate how Apple has understood when their clusters are most
utilized and who’s using them, enabling slicing and dicing along different
dimensions. Having a query intelligence dataset can be used for real-time
cluster dashboarding, self-service troubleshooting, and automatic generation of
recommendations for users, all of which can empower Trino to be better than
ever.
And more!
Of course, Trino’s own Martin Traverso will be giving a keynote on the latest
and greatest in the project, covering everything big that’s landed since Trino
Summit, as well as a glimpse at the roadmap for the project in the coming few
months. Several other big talks are falling into place that we can’t announce
just yet, so stay tuned for more info as the event draws nearer.
Trino contributor congregation
The day after Trino Fest, we’ll also be hosting an in-person meetup for
Trino contributors and engineers to catch up, discuss the Trino roadmap, and
engage directly with the maintainers in-person. It’s a great opportunity to put
faces and voices to those GitHub handles, align on the big ideas or tricky PRs
that have been moving slowly, and find more ways to get involved in Trino
development. If you’re interested in attending, message Manfred Moser or Cole
Bowden on the Trino Slack, and we’ll get you added to
the attendee list and share more details.
