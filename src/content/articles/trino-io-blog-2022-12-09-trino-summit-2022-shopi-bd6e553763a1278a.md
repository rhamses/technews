---
title: "Rewriting History: Migrating petabytes of data to Apache Iceberg using Trino"
link: "https://trino.io/blog/2022/12/09/trino-summit-2022-shopify-recap.html"
guid: "https://trino.io/blog/2022/12/09/trino-summit-2022-shopify-recap.html"
pubDate: "2022-12-09T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Rolling right along with another one of our Trino Summit 2022 recap posts, we’re excited to bring you the engaging\ntalk from Marc Laforet at Shopify. He talked about the ordeal (or, if you look\nat it in a positive light, the privilege) of migrating petabytes of data from\nHive to Iceberg table formats with the help of Trino. With details on why\nShopify chose to move to Iceberg, the various migration strategies that were\nconsidered, and the ultimate process of moving all that data while the Trino\nIceberg connector was still in active development, it’s an insightful talk that\nyou don’t want to miss.\n\n\n\n\n  Check out the slides!\n\nRecap\nAlong with many other Trino users, it should come as no surprise that Shopify\nhas a lot of data to work with. First-party data comes in from a few different\nsources, and there’s a mountain of modelled data to go along with it. In\nShopify’s case, one of the issues was that some data sets were built on top of\ncustom table formats. On top of that, the architecture wasn’t scaled with a\ncareful plan in mind, leading to limited interoperability of datasets among\nvarious tools. With data scientists unable to unify data across different tools\nand storages, it was time for a change.\nWhen you’ve got tons of data that isn’t currently in one place, what’s the fix?\nCreate a central lakehouse for all the data to be accessible from, a\nsingle-service portal that could serve all users’ needs. The first question was\nwhich table format to use, and if the title of the blog post didn’t already give\nit away, they chose to go with Apache Iceberg. It was an easy, central vision\nto work towards: all data in a centralized lakehouse stored in Iceberg, then\nqueryable by Trino.\nHaving a plan and putting that plan into action are two different things,\nthough. When nothing is already in Iceberg, moving it all there is a migration\non the scale of thousands of tables and petabytes of data. In Marc’s words from\nthe talk, once Shopify committed to the migration and invested resources into\nit, the realization was, “crap, now I have to build it.” Even worse, because the\nold data was primarily in gzipped JSON format, it all needed to be rewritten…\nand so it was.\nThen, enter Trino! With new Iceberg-based tables, Trino was identified as the\nright tool for the job to process all that data. This wasn’t without snags, as\nthe migration happened while the Iceberg connector was still being aggressively\nworked on and developed. There were a few different incidents where Shopify hit\na snag or an issue, and an update or bugfix to Trino’s Iceberg connector solved\nthose problems in a matter of days or weeks.\nThe result of all of this? Some incredible benchmark results. Large tables saw a\n96% reduction in planning time, a 96% reduction in cumulative user memory, and a\n95% reduction in query execution time. That’s the difference between thousands\nof terabytes of memory to under 100, and a query that would take an hour to run\nonly taking three minutes. For the absolute largest table at Shopify, some\nqueries saw a 99.9% reduction in execution time. Yes, that number is real.\nMoral of the story? If you find yourself using an old Hive table with outdated\nfile formats, lamenting the resources you need and the time it takes, the\ndecision is easy. Migrate to Iceberg with Trino. Shopify has shown us the way,\nand the full talk has plenty of useful advice for how to best go about it.\nShare this session\nIf you thought this talk was interesting, consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/12/09/trino-summit-2022-shopify-recap.html. If you think Trino is awesome,\ngive us a 🌟 on GitHub !"
author: "Marc Laforet, Cole Bowden"
contentHtml: "<p>Rolling right along with another one of <a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">our Trino Summit 2022 recap posts</a>, we’re excited to bring you the engaging\ntalk from Marc Laforet at Shopify. He talked about the ordeal (or, if you look\nat it in a positive light, the privilege) of migrating petabytes of data from\nHive to Iceberg table formats with the help of Trino. With details on why\nShopify chose to move to Iceberg, the various migration strategies that were\nconsidered, and the ultimate process of moving all that data while the Trino\nIceberg connector was still in active development, it’s an insightful talk that\nyou don’t want to miss.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-summit-2022/Shopify@Trino.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>Along with many other Trino users, it should come as no surprise that Shopify\nhas a lot of data to work with. First-party data comes in from a few different\nsources, and there’s a mountain of modelled data to go along with it. In\nShopify’s case, one of the issues was that some data sets were built on top of\ncustom table formats. On top of that, the architecture wasn’t scaled with a\ncareful plan in mind, leading to limited interoperability of datasets among\nvarious tools. With data scientists unable to unify data across different tools\nand storages, it was time for a change.</p>\n\n<p>When you’ve got tons of data that isn’t currently in one place, what’s the fix?\nCreate a central lakehouse for all the data to be accessible from, a\nsingle-service portal that could serve all users’ needs. The first question was\nwhich table format to use, and if the title of the blog post didn’t already give\nit away, they chose to go with Apache Iceberg. It was an easy, central vision\nto work towards: all data in a centralized lakehouse stored in Iceberg, then\nqueryable by Trino.</p>\n\n<p>Having a plan and putting that plan into action are two different things,\nthough. When nothing is already in Iceberg, moving it all there is a migration\non the scale of thousands of tables and petabytes of data. In Marc’s words from\nthe talk, once Shopify committed to the migration and invested resources into\nit, the realization was, “crap, now I have to build it.” Even worse, because the\nold data was primarily in gzipped JSON format, it all needed to be rewritten…\nand so it was.</p>\n\n<p>Then, enter Trino! With new Iceberg-based tables, Trino was identified as the\nright tool for the job to process all that data. This wasn’t without snags, as\nthe migration happened while the Iceberg connector was still being aggressively\nworked on and developed. There were a few different incidents where Shopify hit\na snag or an issue, and an update or bugfix to Trino’s Iceberg connector solved\nthose problems in a matter of days or weeks.</p>\n\n<p>The result of all of this? Some incredible benchmark results. Large tables saw a\n96% reduction in planning time, a 96% reduction in cumulative user memory, and a\n95% reduction in query execution time. That’s the difference between thousands\nof terabytes of memory to under 100, and a query that would take an hour to run\nonly taking three minutes. For the absolute largest table at Shopify, some\nqueries saw a 99.9% reduction in execution time. Yes, that number is real.</p>\n\n<p>Moral of the story? If you find yourself using an old Hive table with outdated\nfile formats, lamenting the resources you need and the time it takes, the\ndecision is easy. Migrate to Iceberg with Trino. Shopify has shown us the way,\nand the full talk has plenty of useful advice for how to best go about it.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/12/09/trino-summit-2022-shopify-recap.html\">https://trino.io/blog/2022/12/09/trino-summit-2022-shopify-recap.html</a>. If you think Trino is awesome,\n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/shopify-social.png\" /></p>"
---

Rolling right along with another one of our Trino Summit 2022 recap posts, we’re excited to bring you the engaging
talk from Marc Laforet at Shopify. He talked about the ordeal (or, if you look
at it in a positive light, the privilege) of migrating petabytes of data from
Hive to Iceberg table formats with the help of Trino. With details on why
Shopify chose to move to Iceberg, the various migration strategies that were
considered, and the ultimate process of moving all that data while the Trino
Iceberg connector was still in active development, it’s an insightful talk that
you don’t want to miss.




  Check out the slides!

Recap
Along with many other Trino users, it should come as no surprise that Shopify
has a lot of data to work with. First-party data comes in from a few different
sources, and there’s a mountain of modelled data to go along with it. In
Shopify’s case, one of the issues was that some data sets were built on top of
custom table formats. On top of that, the architecture wasn’t scaled with a
careful plan in mind, leading to limited interoperability of datasets among
various tools. With data scientists unable to unify data across different tools
and storages, it was time for a change.
When you’ve got tons of data that isn’t currently in one place, what’s the fix?
Create a central lakehouse for all the data to be accessible from, a
single-service portal that could serve all users’ needs. The first question was
which table format to use, and if the title of the blog post didn’t already give
it away, they chose to go with Apache Iceberg. It was an easy, central vision
to work towards: all data in a centralized lakehouse stored in Iceberg, then
queryable by Trino.
Having a plan and putting that plan into action are two different things,
though. When nothing is already in Iceberg, moving it all there is a migration
on the scale of thousands of tables and petabytes of data. In Marc’s words from
the talk, once Shopify committed to the migration and invested resources into
it, the realization was, “crap, now I have to build it.” Even worse, because the
old data was primarily in gzipped JSON format, it all needed to be rewritten…
and so it was.
Then, enter Trino! With new Iceberg-based tables, Trino was identified as the
right tool for the job to process all that data. This wasn’t without snags, as
the migration happened while the Iceberg connector was still being aggressively
worked on and developed. There were a few different incidents where Shopify hit
a snag or an issue, and an update or bugfix to Trino’s Iceberg connector solved
those problems in a matter of days or weeks.
The result of all of this? Some incredible benchmark results. Large tables saw a
96% reduction in planning time, a 96% reduction in cumulative user memory, and a
95% reduction in query execution time. That’s the difference between thousands
of terabytes of memory to under 100, and a query that would take an hour to run
only taking three minutes. For the absolute largest table at Shopify, some
queries saw a 99.9% reduction in execution time. Yes, that number is real.
Moral of the story? If you find yourself using an old Hive table with outdated
file formats, lamenting the resources you need and the time it takes, the
decision is easy. Migrate to Iceberg with Trino. Shopify has shown us the way,
and the full talk has plenty of useful advice for how to best go about it.
Share this session
If you thought this talk was interesting, consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/12/09/trino-summit-2022-shopify-recap.html. If you think Trino is awesome,
give us a 🌟 on GitHub !
