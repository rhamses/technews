---
title: "Using Trino with Apache Airflow for (almost) all your data problems"
link: "https://trino.io/blog/2022/12/21/trino-summit-2022-astronomer-recap.html"
guid: "https://trino.io/blog/2022/12/21/trino-summit-2022-astronomer-recap.html"
pubDate: "2022-12-21T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "As we close in on the final talks from Trino Summit 2022, this next talk dives into how to set up\nTrino for batch processing. Trino has historically been well-known for\nfacilitating fast adhoc analytics queries as opposed to long-running, resource\nintensive batch/ETL queries. This is due to the fact that Trino kills queries\nthat run out of resources in order to prioritize faster query execution. Earlier\nthis year, Trino added features to better support batch queries with a new \nfault-tolerant execution mode.\nThis mode backs up intermediate data during execution time, allowing Trino to\nrestart individual query tasks on failure rather than a query stage or the query\nitself.\nBatch queries don’t typically involve human intervention and run asynchronously.\nThese tasks may depend on each other and have a complex workflow. This talk\ndescribes how to orchestrate this complexity using Airflow’s new Trino\nintegration to run Trino batch queries to solve (almost) all your data problems.\n\n\n\n\n  Check out the slides!\n\nRecap\nIn this talk, we’re going to hear from Philippe, a Trino contributor and\nSolutions Architect at Astronomer, the company building a SaaS product around\nApache Airflow. Philippe describes a fictional trading scenario that initially\nfollows a traditional warehousing approach to storing data. This architecture\nhas data sources that are queried and submitted as raw data into a centralized\nwarehouse. Within the warehouse itself, the raw data is transformed into data\nready to be consumed.\nThis model enforces centralization, in which one team runs the platform and\nbuilds the integration between producers and consumers. This team focuses on the\naspects of the data platform which further separates them from the business use\ncase. As source databases evolve, the central data team must keep up with these\nchanges. As the data consumers that rely on the data infrastructure grow, this\nteam commonly becomes a bottleneck.\nTrino allows you to move the queries as close as possible to the federated data\nsources, removing the labor-intensive process of moving data into stages\nbefore ingesting it into a central warehouse. This doesn’t mean that data\nmovement is no longer a necessity, but the necessity shifts from an availability\nconcern to a performance and scalability concern.\nWithout investing into more resources, your data professionals are able to work\nclosely with producers and stakeholders with a shared understanding of the\ndomain. This increases data literacy and data availability throughout your\norganization.\nTrino is not only for fast adhoc analytics with a human in the loop, but now \nprovides a fault-tolerant execution mode that enables it to run resource\nintensive batch jobs. This, paired with the federation capabilities, make Trino\nable to ingest any data that can be represented in a tabular format. Users can\nimplement user-defined functions and run transformations using SQL without\ninvolving intermediate systems.\nTo run Trino batch queries at scale requires building complex interdependencies\nbetween different tasks and often needs monitoring if there are any failures\nthat occur. This configuration also demands reactive automation to handle the\nfailing instances. Apache Airflow is an open-source platform for developing,\nscheduling, and monitoring batch-oriented workflows on systems like Trino,\nperfectly complementing the challenges of handling these intensive queries at \nscale.\nEven before introducing fault-tolerant execution mode, Trino was already being\nused to run batch queries at scale.\nIn these scenarios, Trino and a tool like Airflow already work well together\nbecause these jobs will take time and likely nobody wants to wait around to run\nthe pipeline components in sequence. The reason why fault-tolerant execution\nmode brings the Trino and Airflow combination to the forefront, is due to the\nanticipation of Trino being adopted as a batch query engine tool as the learning\ncurve to run ETL jobs on Trino becomes as trivial as other tools in the space.\nPhilippe dives into building out basic Airflow jobs to run over Trino and\nintroduces the concept of a directed acyclic graph (DAG). He then dives into\nmultiple useful features that help break down large jobs into manageable tasks,\nand jobs that can adjust the schedule based on runtime execution. Sharded job \ncreation splits large batch jobs into smaller tasks that can easily be retried.\nDynamic task mapping splits jobs into smaller tasks based on data observed at\nruntime. Finally, a new features called data aware scheduling can schedule tasks\nbased on interdependencies between datasets.\nTo get started with Trino in Apache Airflow, check out the\nAirflow Trino provider documentation.\nShare this session\nIf you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to https://trino.io/blog/2022/12/21/trino-summit-2022-astronomer-recap.html. If you think Trino is awesome, \ngive us a 🌟 on GitHub !"
author: "Philippe Gagnon, Brian Olsen"
contentHtml: "<p>As we close in on the final talks from <a href=\"/blog/2022/11/21/trino-summit-2022-recap.html\">Trino Summit 2022</a>, this next talk dives into how to set up\nTrino for batch processing. Trino has historically been well-known for\nfacilitating fast adhoc analytics queries as opposed to long-running, resource\nintensive batch/ETL queries. This is due to the fact that Trino kills queries\nthat run out of resources in order to prioritize faster query execution. Earlier\nthis year, Trino added features to better support batch queries with a new \n<a href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html\">fault-tolerant execution mode</a>.\nThis mode backs up intermediate data during execution time, allowing Trino to\nrestart individual query tasks on failure rather than a query stage or the query\nitself.</p>\n\n<p>Batch queries don’t typically involve human intervention and run asynchronously.\nThese tasks may depend on each other and have a complex workflow. This talk\ndescribes how to orchestrate this complexity using Airflow’s new Trino\nintegration to run Trino batch queries to solve (almost) all your data problems.</p>\n\n<!--more-->\n\n<div class=\"video-responsive\">\n    \n</div>\n\n<p><a class=\"btn btn-pink btn-md\" target=\"_blank\" href=\"/assets/blog/trino-summit-2022/Trino@Astronomer.pdf\">\n  Check out the slides!\n</a></p>\n\n<h2 id=\"recap\">Recap</h2>\n\n<p>In this talk, we’re going to hear from Philippe, a Trino contributor and\nSolutions Architect at Astronomer, the company building a SaaS product around\nApache Airflow. Philippe describes a fictional trading scenario that initially\nfollows a traditional warehousing approach to storing data. This architecture\nhas data sources that are queried and submitted as raw data into a centralized\nwarehouse. Within the warehouse itself, the raw data is transformed into data\nready to be consumed.</p>\n\n<p>This model enforces centralization, in which one team runs the platform and\nbuilds the integration between producers and consumers. This team focuses on the\naspects of the data platform which further separates them from the business use\ncase. As source databases evolve, the central data team must keep up with these\nchanges. As the data consumers that rely on the data infrastructure grow, this\nteam commonly becomes a bottleneck.</p>\n\n<p>Trino allows you to move the queries as close as possible to the federated data\nsources, removing the labor-intensive process of moving data into stages\nbefore ingesting it into a central warehouse. This doesn’t mean that data\nmovement is no longer a necessity, but the necessity shifts from an availability\nconcern to a performance and scalability concern.</p>\n\n<p>Without investing into more resources, your data professionals are able to work\nclosely with producers and stakeholders with a shared understanding of the\ndomain. This increases data literacy and data availability throughout your\norganization.</p>\n\n<p>Trino is not only for fast adhoc analytics with a human in the loop, but now \nprovides a fault-tolerant execution mode that enables it to run resource\nintensive batch jobs. This, paired with the federation capabilities, make Trino\nable to ingest any data that can be represented in a tabular format. Users can\nimplement user-defined functions and run transformations using SQL without\ninvolving intermediate systems.</p>\n\n<p>To run Trino batch queries at scale requires building complex interdependencies\nbetween different tasks and often needs monitoring if there are any failures\nthat occur. This configuration also demands reactive automation to handle the\nfailing instances. Apache Airflow is an open-source platform for developing,\nscheduling, and monitoring batch-oriented workflows on systems like Trino,\nperfectly complementing the challenges of handling these intensive queries at \nscale.</p>\n\n<p>Even before introducing fault-tolerant execution mode, <a href=\"https://engineering.salesforce.com/how-to-etl-at-petabyte-scale-with-trino-5fe8ac134e36/\">Trino was already being\nused to run batch queries at scale</a>.\nIn these scenarios, Trino and a tool like Airflow already work well together\nbecause these jobs will take time and likely nobody wants to wait around to run\nthe pipeline components in sequence. The reason why fault-tolerant execution\nmode brings the Trino and Airflow combination to the forefront, is due to the\nanticipation of Trino being adopted as a batch query engine tool as the learning\ncurve to run ETL jobs on Trino becomes as trivial as other tools in the space.</p>\n\n<p>Philippe dives into building out basic Airflow jobs to run over Trino and\nintroduces the concept of a directed acyclic graph (DAG). He then dives into\nmultiple useful features that help break down large jobs into manageable tasks,\nand jobs that can adjust the schedule based on runtime execution. Sharded job \ncreation splits large batch jobs into smaller tasks that can easily be retried.\nDynamic task mapping splits jobs into smaller tasks based on data observed at\nruntime. Finally, a new features called data aware scheduling can schedule tasks\nbased on interdependencies between datasets.</p>\n\n<p>To get started with Trino in Apache Airflow, check out the\n<a href=\"https://airflow.apache.org/docs/apache-airflow-providers-trino/stable/index.html\">Airflow Trino provider documentation</a>.</p>\n\n<h2 id=\"share-this-session\">Share this session</h2>\n\n<p>If you thought this talk was interesting, please consider sharing this on\nTwitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social\ncard and link to <a href=\"https://trino.io/blog/2022/12/21/trino-summit-2022-astronomer-recap.html\">https://trino.io/blog/2022/12/21/trino-summit-2022-astronomer-recap.html</a>. If you think Trino is awesome, \n<a href=\"https://github.com/trinodb/trino\">give us a 🌟 on GitHub <i class=\"fab fa-github\"></i></a>!</p>\n\n<p><img src=\"/assets/blog/trino-summit-2022/astronomer-social.png\" /></p>"
---

As we close in on the final talks from Trino Summit 2022, this next talk dives into how to set up
Trino for batch processing. Trino has historically been well-known for
facilitating fast adhoc analytics queries as opposed to long-running, resource
intensive batch/ETL queries. This is due to the fact that Trino kills queries
that run out of resources in order to prioritize faster query execution. Earlier
this year, Trino added features to better support batch queries with a new 
fault-tolerant execution mode.
This mode backs up intermediate data during execution time, allowing Trino to
restart individual query tasks on failure rather than a query stage or the query
itself.
Batch queries don’t typically involve human intervention and run asynchronously.
These tasks may depend on each other and have a complex workflow. This talk
describes how to orchestrate this complexity using Airflow’s new Trino
integration to run Trino batch queries to solve (almost) all your data problems.




  Check out the slides!

Recap
In this talk, we’re going to hear from Philippe, a Trino contributor and
Solutions Architect at Astronomer, the company building a SaaS product around
Apache Airflow. Philippe describes a fictional trading scenario that initially
follows a traditional warehousing approach to storing data. This architecture
has data sources that are queried and submitted as raw data into a centralized
warehouse. Within the warehouse itself, the raw data is transformed into data
ready to be consumed.
This model enforces centralization, in which one team runs the platform and
builds the integration between producers and consumers. This team focuses on the
aspects of the data platform which further separates them from the business use
case. As source databases evolve, the central data team must keep up with these
changes. As the data consumers that rely on the data infrastructure grow, this
team commonly becomes a bottleneck.
Trino allows you to move the queries as close as possible to the federated data
sources, removing the labor-intensive process of moving data into stages
before ingesting it into a central warehouse. This doesn’t mean that data
movement is no longer a necessity, but the necessity shifts from an availability
concern to a performance and scalability concern.
Without investing into more resources, your data professionals are able to work
closely with producers and stakeholders with a shared understanding of the
domain. This increases data literacy and data availability throughout your
organization.
Trino is not only for fast adhoc analytics with a human in the loop, but now 
provides a fault-tolerant execution mode that enables it to run resource
intensive batch jobs. This, paired with the federation capabilities, make Trino
able to ingest any data that can be represented in a tabular format. Users can
implement user-defined functions and run transformations using SQL without
involving intermediate systems.
To run Trino batch queries at scale requires building complex interdependencies
between different tasks and often needs monitoring if there are any failures
that occur. This configuration also demands reactive automation to handle the
failing instances. Apache Airflow is an open-source platform for developing,
scheduling, and monitoring batch-oriented workflows on systems like Trino,
perfectly complementing the challenges of handling these intensive queries at 
scale.
Even before introducing fault-tolerant execution mode, Trino was already being
used to run batch queries at scale.
In these scenarios, Trino and a tool like Airflow already work well together
because these jobs will take time and likely nobody wants to wait around to run
the pipeline components in sequence. The reason why fault-tolerant execution
mode brings the Trino and Airflow combination to the forefront, is due to the
anticipation of Trino being adopted as a batch query engine tool as the learning
curve to run ETL jobs on Trino becomes as trivial as other tools in the space.
Philippe dives into building out basic Airflow jobs to run over Trino and
introduces the concept of a directed acyclic graph (DAG). He then dives into
multiple useful features that help break down large jobs into manageable tasks,
and jobs that can adjust the schedule based on runtime execution. Sharded job 
creation splits large batch jobs into smaller tasks that can easily be retried.
Dynamic task mapping splits jobs into smaller tasks based on data observed at
runtime. Finally, a new features called data aware scheduling can schedule tasks
based on interdependencies between datasets.
To get started with Trino in Apache Airflow, check out the
Airflow Trino provider documentation.
Share this session
If you thought this talk was interesting, please consider sharing this on
Twitter, Reddit, LinkedIn, HackerNews or anywhere on the web. Use the social
card and link to https://trino.io/blog/2022/12/21/trino-summit-2022-astronomer-recap.html. If you think Trino is awesome, 
give us a 🌟 on GitHub !
