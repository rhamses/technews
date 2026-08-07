---
title: "An opinionated guide to consolidating our data"
link: "https://trino.io/blog/2022/05/24/an-opinionated-guide-to-consolidating-our-data.html"
guid: "https://trino.io/blog/2022/05/24/an-opinionated-guide-to-consolidating-our-data.html"
pubDate: "2022-05-24T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Maximizing your experience with zero choices.\nI’m publishing this blog post in partnership with the Trino community to go\nalong a lightning talk I’m giving for their event, Cinco de Trino. This article\nwas originally published on Abhi’s Medium\nsite\n“My data is all over the place and attempting to analyze or query it is not\nonly time consuming and expensive, but also emotionally taxing.”\nMaybe you haven’t heard those exact words before, but data consolidation is a\nreal problem. It is common for organizations to have correlated data stored in\nvarious silos or APIs. Performing consistent operations across these various\ndata sources requires understanding both architecture and surgery, skills that\nyou may not have picked up as a data practitioner. If you’re part of the Trino\ncommunity and are reading this post, you’ve likely encountered unperformant\nqueries due to unconsolidated data.\nIn the past, the data engineering world was not graced with the same level of\nlove and tooling as other communities, so we were\nexpected to make do with whatever came our way. In order to perform the wildly\nbasic task of moving our data around, we were asked to tithe large sums of money\nto the closed-source ELT overlords.\nSo where does that leave us? Thankfully things have changed, so here’s how you\ncan move all your data to a central location for free (well, minus the\ninfrastructure costs) while making few architectural choices.\nThe tool\nYou don’t have too many choices for FOSS ELT/ETL.\nAirbyte has been recently making waves as the main\ncontender for open-source ELT. As of writing this article, it’s only been around\nfor about two years, during which its established itself as one of the fastest\ngrowing startups in existence. It requires three terminal commands to deploy and\nis managed entirely through a UI, so it’s operable by many. It also supports\nsyncing your data incrementally, so you don’t need to resync existing data when\nyou want to sync new data. It is relatively new, so some of the polish that\ncomes with an established project is not there yet. Think of it like a\nprecocious child.\nYou could use Meltano to take advantage of the large\nSinger connector ecosystem, but it’s more complicated\nto set up and is more of a holistic ops platform, which may be excessive for\nyour use case.\nYou could also use this esoteric project called KETL that is only available at\nthis sketchy SourceForge link. But\nmaybe don’t do that.\nFor consolidating your data, use Airbyte. It’s straightforward to setup,\nrequires minor configuration, and has tightly scoped responsibilities.\nThe destination\nLet’s use a data lake. Its unstructured nature leaves more flexibility for\npurpose and we’ll assume that our data has not been processed or filtered yet.\nData warehouses are more expensive, require more upkeep, and benefit from the\nETL paradigm as opposed to ELT. Airbyte is an ELT tool focused mostly on the EL\nbit, which makes it easier to use with the unstructured data lakes.\nAdditionally, S3 supports query engines such as Trino, which will allow us to\nquery and analyze our data once its been consolidated. Trino also functions as a\npowerful data lake transformation engine, so if you’re on the fence due to data\nmalleability, this might help bring you over.\nWe could use Azure Blob Storage or GCS, but for this tutorial, I’ll be keeping\nit simple with Amazon S3. If you’ve set up an S3 bucket and IAM, skip the next\nparagraph.\nCreate a S3 bucket with default settings and grab an access key from IAM. To do\nthis, head to the top right of the screen in the AWS Management Console where it\nsays your email provider and then click on Security Credentials. Click\nCreate New Access Key and save that information for later.\nThe deployment\nToday, we’ll be deploying Airbyte locally on a workstation. Alternatively, you\ncan deploy it on your own infrastructure, but this requires managing networking\nand security, which is unpalatable for a quick demonstration. If you want your\nsyncs to continue running in perpetuity, you’ll want to deploy Airbyte\nexternally to your machine. For a guide to deploying Airbyte on EC2 click\nhere. For a guide to\ndeploying Airbyte on Kubernetes, click\nhere.\nTo begin, install Docker and\ndocker-compose on your workstation.\nThen clone the repository and spin up Airbyte with docker-compose.\n\ngit clone git@github.com:airbytehq/airbyte.git\ncd airbyte\ndocker-compose up\n\n\nOnce you see the following banner, you’re good to go.\nThe data sources\nHead over to localhost:8000 on your machine, complete the sign-up flow, and\nyou’ll be greeted with an onboarding workflow. We’re going to skip this workflow\nto emulate a traditional usage of Airbyte. Click on the Sources tab in the left\nsidebar and click on +New Source. This is where we’ll be setting up all of our\ndisparate data sources.\nSearch for your data sources in the drop down and fill out the required\nconfiguration. If you’re having trouble setting up a particular data source,\nhead to the Airbyte docs. There’s a dedicated page\nfor every connector; for example, this is the setup\nguide for\nthe Google Analytics source. If you’re just testing Airbyte out, use the PokeAPI\nsource, as it lets you sync dummy data with no authentication. If your required\ndata source doesn’t exist, you can request it\nhere or build it yourself by heading\nhere (isn’t open-source\ngreat?)\nOnce you have all of your data sources set up, it will look something like this.\nNow we just need to set up our connection to S3 and we are good to go.\nThe destination (again)\nHead over to the Destinations tab in the left sidebar and follow the same\nprocess for setting up our connection to S3. Click on +New Destination and\nsearch for S3. Then fill out the configuration for your bucket. We’ll now use\nthat access key that we generated earlier!\nFor output format, I recommend using Parquet for analytics purposes. It’s a\ncolumnar storage\nformat,\nwhich is optimized for reads. JSON, CSV, and Avro are supported, but will be\nless performant on read.\nThe connection\nFinally, head over to the Connections tab in the sidebar and click +New\nConnection. You will need to do this process for each data source that you\nhave set up. Select any existing source and click your S3 Destination that you\nset up from the drop down. I failed to set up a connection with my GitHub\nsource, so I navigated to the Airbyte Troubleshooting Discourse and filed an\nissue. Response times are really fast there, so I’ll likely be able to resolve\nthis within a day or two.\nYou will then be greeted with the following connection setup page. For most\nanalytics jobs, syncing more frequently than every 24 hours is expensive and\noverkill, so stick with the default. For sources that support it, click on the\nsync mode in the streams table to use the Incremental / Append sync mode.\nThis ensures that every time you sync, Airbyte will check for new data and only\npull in data that you haven’t synced before.\nOnce you hit Set up connection, Airbyte will run your first sync! You can\nclick into your connection to get access to the sync logs, replication settings,\nand transformation settings if supported.\nChecking our S3 bucket, we can see that our data has successfully reached! If\nyou’re just testing things out, you’re done.\nThe analysis\nNow that you’ve set up your data pipelines, if you want to run transformation\njobs, Trino enables that use case well — Lyft, Pinterest, and Shopify have all\ndone this to great success. There’s also a dbt-trino\nplugin managed by the folks over at\nStarburst. Alternatively, you could also accomplish this using S3 Object\nLambda\nif you want to stay within the AWS landscape when possible.\nOnce your data is in a queryable state, you can now use\nTrino or your favorite\nquery engine to your heart’s content! If you want to get started with querying\nthese heterogenous data sources using Trino, here’s a getting-started\nguide on how to do that. Finally,\njoin the Airbyte and\nTrino communities to find more about how\nothers are consolidating and querying their data."
author: "Abhi Vaidyanatha"
contentHtml: "<h2 id=\"maximizing-your-experience-with-zero-choices\">Maximizing your experience with zero choices.</h2>\n\n<p><em>I’m publishing this blog post in partnership with the Trino community to go\nalong a lightning talk I’m giving for their event, Cinco de Trino. This article\nwas originally published <a href=\"https://abhi-vaidyanatha.medium.com/an-opinionated-guide-to-consolidating-your-data-b09386b2b9b5\">on Abhi’s Medium\nsite</a></em></p>\n\n<blockquote>\n  <p>“My data is all over the place and attempting to analyze or query it is not\nonly time consuming and expensive, but also emotionally taxing.”</p>\n</blockquote>\n\n<!--more-->\n\n<p>Maybe you haven’t heard those exact words before, but data consolidation is a\nreal problem. It is common for organizations to have correlated data stored in\nvarious silos or APIs. Performing consistent operations across these various\ndata sources requires understanding both architecture and surgery, skills that\nyou may not have picked up as a data practitioner. If you’re part of the Trino\ncommunity and are reading this post, you’ve likely encountered unperformant\nqueries due to unconsolidated data.</p>\n\n<p>In the past, the data engineering world was not graced with the same level of\nlove and <a href=\"https://tailwindcss.com/\">tooling</a> as other communities, so we were\nexpected to make do with whatever came our way. In order to perform the wildly\nbasic task of moving our data around, we were asked to tithe large sums of money\nto the closed-source ELT overlords.</p>\n\n<p>So where does that leave us? Thankfully things have changed, so here’s how you\ncan move all your data to a central location for free (well, minus the\ninfrastructure costs) while making few architectural choices.</p>\n\n<h2 id=\"the-tool\">The tool</h2>\n<p>You don’t have too many choices for FOSS ELT/ETL.</p>\n\n<p><a href=\"https://airbyte.com/\">Airbyte</a> has been recently making waves as the main\ncontender for open-source ELT. As of writing this article, it’s only been around\nfor about two years, during which its established itself as one of the fastest\ngrowing startups in existence. It requires three terminal commands to deploy and\nis managed entirely through a UI, so it’s operable by many. It also supports\nsyncing your data incrementally, so you don’t need to resync existing data when\nyou want to sync new data. It is relatively new, so some of the polish that\ncomes with an established project is not there yet. Think of it like a\nprecocious child.</p>\n\n<p>You could use <a href=\"https://meltano.com/\">Meltano</a> to take advantage of the large\n<a href=\"https://www.singer.io/\">Singer</a> connector ecosystem, but it’s more complicated\nto set up and is more of a holistic ops platform, which may be excessive for\nyour use case.</p>\n\n<p>You could also use this esoteric project called KETL that is only available at\nthis sketchy SourceForge <a href=\"https://sourceforge.net/projects/ketl/\">link</a>. But\nmaybe don’t do that.</p>\n\n<p>For consolidating your data, use Airbyte. It’s straightforward to setup,\nrequires minor configuration, and has tightly scoped responsibilities.</p>\n\n<p align=\"center\">\n   <img align=\"center\" width=\"50%\" src=\"https://miro.medium.com/max/640/1*zqLMo7P3o_HG7EJ2E1dbpg.png\" />\n</p>\n\n<h2 id=\"the-destination\">The destination</h2>\n\n<p>Let’s use a data lake. Its unstructured nature leaves more flexibility for\npurpose and we’ll assume that our data has not been processed or filtered yet.</p>\n\n<p>Data warehouses are more expensive, require more upkeep, and benefit from the\nETL paradigm as opposed to ELT. Airbyte is an ELT tool focused mostly on the EL\nbit, which makes it easier to use with the unstructured data lakes.</p>\n\n<p>Additionally, S3 supports query engines such as Trino, which will allow us to\nquery and analyze our data once its been consolidated. Trino also functions as a\npowerful data lake transformation engine, so if you’re on the fence due to data\nmalleability, this might help bring you over.</p>\n\n<p>We could use Azure Blob Storage or GCS, but for this tutorial, I’ll be keeping\nit simple with Amazon S3. If you’ve set up an S3 bucket and IAM, skip the next\nparagraph.</p>\n\n<p>Create a S3 bucket with default settings and grab an access key from IAM. To do\nthis, head to the top right of the screen in the AWS Management Console where it\nsays your email provider and then click on <strong>Security Credentials</strong>. Click\n<strong>Create New Access Key</strong> and save that information for later.</p>\n\n<p align=\"center\">\n   <img align=\"center\" width=\"50%\" src=\"https://miro.medium.com/max/1202/1*mYeldXLcvi7iPBDZ1GKEug.png\" />\n</p>\n\n<h2 id=\"the-deployment\">The deployment</h2>\n\n<p>Today, we’ll be deploying Airbyte locally on a workstation. Alternatively, you\ncan deploy it on your own infrastructure, but this requires managing networking\nand security, which is unpalatable for a quick demonstration. If you want your\nsyncs to continue running in perpetuity, you’ll want to deploy Airbyte\nexternally to your machine. For a guide to deploying Airbyte on EC2 click\n<a href=\"https://docs.airbyte.com/deploying-airbyte/on-aws-ec2\">here</a>. For a guide to\ndeploying Airbyte on Kubernetes, click\n<a href=\"https://docs.airbyte.com/deploying-airbyte/on-plural\">here</a>.</p>\n\n<p>To begin, install <a href=\"https://www.docker.com/products/docker-desktop/\">Docker</a> and\ndocker-compose on your workstation.</p>\n\n<p>Then clone the repository and spin up Airbyte with docker-compose.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>git clone git@github.com:airbytehq/airbyte.git\ncd airbyte\ndocker-compose up\n</code></pre></div></div>\n\n<p>Once you see the following banner, you’re good to go.</p>\n\n<p align=\"center\">\n   <img align=\"center\" width=\"50%\" src=\"https://miro.medium.com/max/1148/1*7Fg7Vwi5vgkg94SYRuACLQ.png\" />\n</p>\n\n<h2 id=\"the-data-sources\">The data sources</h2>\n\n<p>Head over to localhost:8000 on your machine, complete the sign-up flow, and\nyou’ll be greeted with an onboarding workflow. We’re going to skip this workflow\nto emulate a traditional usage of Airbyte. Click on the Sources tab in the left\nsidebar and click on +New Source. This is where we’ll be setting up all of our\ndisparate data sources.</p>\n\n<p>Search for your data sources in the drop down and fill out the required\nconfiguration. If you’re having trouble setting up a particular data source,\nhead to the <a href=\"https://docs.airbyte.com/\">Airbyte docs</a>. There’s a dedicated page\nfor every connector; for example, this is the <a href=\"https://docs.airbyte.com/integrations/sources/google-analytics-v4\">setup\nguide</a> for\nthe Google Analytics source. If you’re just testing Airbyte out, use the PokeAPI\nsource, as it lets you sync dummy data with no authentication. If your required\ndata source doesn’t exist, you can request it\n<a href=\"https://airbyte.com/connector-requests\">here</a> or build it yourself by heading\n<a href=\"https://docs.airbyte.com/connector-development/\">here</a> (isn’t open-source\ngreat?)</p>\n\n<p>Once you have all of your data sources set up, it will look something like this.</p>\n\n<p align=\"center\">\n   <img align=\"center\" width=\"50%\" src=\"https://miro.medium.com/max/1400/1*6_sNtdhFKkSnicyqe2Hhmg.png\" />\n</p>\n\n<p>Now we just need to set up our connection to S3 and we are good to go.</p>\n\n<h2 id=\"the-destination-again\">The destination (again)</h2>\n\n<p>Head over to the <em>Destinations</em> tab in the left sidebar and follow the same\nprocess for setting up our connection to S3. Click on <em>+New Destination</em> and\nsearch for S3. Then fill out the configuration for your bucket. We’ll now use\nthat access key that we generated earlier!</p>\n\n<p align=\"center\">\n   <img align=\"center\" width=\"50%\" src=\"https://miro.medium.com/max/1400/1*24LRs9-dB7l35DgsXU6pqQ.png\" />\n</p>\n\n<p>For output format, I recommend using Parquet for analytics purposes. It’s a\n<a href=\"https://www.qubole.com/tech-blog/columnar-format-in-data-lakes-for-dummies/\">columnar storage\nformat</a>,\nwhich is optimized for reads. JSON, CSV, and Avro are supported, but will be\nless performant on read.</p>\n\n<p align=\"center\">\n   <img align=\"center\" width=\"50%\" src=\"https://miro.medium.com/max/1400/1*tVw2sbTLYDlHpKB97M7cKg.png\" />\n</p>\n\n<h2 id=\"the-connection\">The connection</h2>\n\n<p>Finally, head over to the <strong>Connections</strong> tab in the sidebar and click <strong>+New\nConnection</strong>. You will need to do this process for each data source that you\nhave set up. Select any existing source and click your S3 Destination that you\nset up from the drop down. I failed to set up a connection with my GitHub\nsource, so I navigated to the Airbyte Troubleshooting Discourse and filed an\nissue. Response times are really fast there, so I’ll likely be able to resolve\nthis within a day or two.</p>\n\n<p>You will then be greeted with the following connection setup page. For most\nanalytics jobs, syncing more frequently than every 24 hours is expensive and\noverkill, so stick with the default. For sources that support it, click on the\nsync mode in the streams table to use the <strong>Incremental / Append</strong> sync mode.\nThis ensures that every time you sync, Airbyte will check for new data and only\npull in data that you haven’t synced before.</p>\n\n<p align=\"center\">\n   <img align=\"center\" width=\"50%\" src=\"https://miro.medium.com/max/1400/1*FZyFWtb3P4sqO77p-WZjAw.png\" />\n</p>\n\n<p>Once you hit <strong>Set up connection</strong>, Airbyte will run your first sync! You can\nclick into your connection to get access to the sync logs, replication settings,\nand transformation settings if supported.</p>\n\n<p>Checking our S3 bucket, we can see that our data has successfully reached! If\nyou’re just testing things out, you’re done.</p>\n\n<p align=\"center\">\n   <img align=\"center\" width=\"50%\" src=\"https://miro.medium.com/max/1400/1*qrEc7u2hiUUZv4TO5qOv6A.png\" />\n</p>\n\n<h2 id=\"the-analysis\">The analysis</h2>\n\n<p>Now that you’ve set up your data pipelines, if you want to run transformation\njobs, Trino enables that use case well — Lyft, Pinterest, and Shopify have all\ndone this to great success. There’s also a <a href=\"https://github.com/starburstdata/dbt-trino\">dbt-trino\nplugin</a> managed by the folks over at\nStarburst. Alternatively, you could also accomplish this using <a href=\"https://docs.aws.amazon.com/AmazonS3/latest/userguide/tutorial-s3-object-lambda-uppercase.html\">S3 Object\nLambda</a>\nif you want to stay within the AWS landscape when possible.</p>\n\n<p>Once your data is in a queryable state, you can now use\n<a href=\"https://trino.io/docs/current/connector/hive-s3.html\">Trino</a> or your favorite\nquery engine to your heart’s content! If you want to get started with querying\nthese heterogenous data sources using Trino, here’s a <a href=\"https://janakiev.com/blog/presto-trino-s3/\">getting-started\nguide</a> on how to do that. Finally,\njoin the <a href=\"https://airbyte.com/community\">Airbyte</a> and\n<a href=\"https://trino.io/community.html\">Trino</a> communities to find more about how\nothers are consolidating and querying their data.</p>"
---

Maximizing your experience with zero choices.
I’m publishing this blog post in partnership with the Trino community to go
along a lightning talk I’m giving for their event, Cinco de Trino. This article
was originally published on Abhi’s Medium
site
“My data is all over the place and attempting to analyze or query it is not
only time consuming and expensive, but also emotionally taxing.”
Maybe you haven’t heard those exact words before, but data consolidation is a
real problem. It is common for organizations to have correlated data stored in
various silos or APIs. Performing consistent operations across these various
data sources requires understanding both architecture and surgery, skills that
you may not have picked up as a data practitioner. If you’re part of the Trino
community and are reading this post, you’ve likely encountered unperformant
queries due to unconsolidated data.
In the past, the data engineering world was not graced with the same level of
love and tooling as other communities, so we were
expected to make do with whatever came our way. In order to perform the wildly
basic task of moving our data around, we were asked to tithe large sums of money
to the closed-source ELT overlords.
So where does that leave us? Thankfully things have changed, so here’s how you
can move all your data to a central location for free (well, minus the
infrastructure costs) while making few architectural choices.
The tool
You don’t have too many choices for FOSS ELT/ETL.
Airbyte has been recently making waves as the main
contender for open-source ELT. As of writing this article, it’s only been around
for about two years, during which its established itself as one of the fastest
growing startups in existence. It requires three terminal commands to deploy and
is managed entirely through a UI, so it’s operable by many. It also supports
syncing your data incrementally, so you don’t need to resync existing data when
you want to sync new data. It is relatively new, so some of the polish that
comes with an established project is not there yet. Think of it like a
precocious child.
You could use Meltano to take advantage of the large
Singer connector ecosystem, but it’s more complicated
to set up and is more of a holistic ops platform, which may be excessive for
your use case.
You could also use this esoteric project called KETL that is only available at
this sketchy SourceForge link. But
maybe don’t do that.
For consolidating your data, use Airbyte. It’s straightforward to setup,
requires minor configuration, and has tightly scoped responsibilities.
The destination
Let’s use a data lake. Its unstructured nature leaves more flexibility for
purpose and we’ll assume that our data has not been processed or filtered yet.
Data warehouses are more expensive, require more upkeep, and benefit from the
ETL paradigm as opposed to ELT. Airbyte is an ELT tool focused mostly on the EL
bit, which makes it easier to use with the unstructured data lakes.
Additionally, S3 supports query engines such as Trino, which will allow us to
query and analyze our data once its been consolidated. Trino also functions as a
powerful data lake transformation engine, so if you’re on the fence due to data
malleability, this might help bring you over.
We could use Azure Blob Storage or GCS, but for this tutorial, I’ll be keeping
it simple with Amazon S3. If you’ve set up an S3 bucket and IAM, skip the next
paragraph.
Create a S3 bucket with default settings and grab an access key from IAM. To do
this, head to the top right of the screen in the AWS Management Console where it
says your email provider and then click on Security Credentials. Click
Create New Access Key and save that information for later.
The deployment
Today, we’ll be deploying Airbyte locally on a workstation. Alternatively, you
can deploy it on your own infrastructure, but this requires managing networking
and security, which is unpalatable for a quick demonstration. If you want your
syncs to continue running in perpetuity, you’ll want to deploy Airbyte
externally to your machine. For a guide to deploying Airbyte on EC2 click
here. For a guide to
deploying Airbyte on Kubernetes, click
here.
To begin, install Docker and
docker-compose on your workstation.
Then clone the repository and spin up Airbyte with docker-compose.

git clone git@github.com:airbytehq/airbyte.git
cd airbyte
docker-compose up


Once you see the following banner, you’re good to go.
The data sources
Head over to localhost:8000 on your machine, complete the sign-up flow, and
you’ll be greeted with an onboarding workflow. We’re going to skip this workflow
to emulate a traditional usage of Airbyte. Click on the Sources tab in the left
sidebar and click on +New Source. This is where we’ll be setting up all of our
disparate data sources.
Search for your data sources in the drop down and fill out the required
configuration. If you’re having trouble setting up a particular data source,
head to the Airbyte docs. There’s a dedicated page
for every connector; for example, this is the setup
guide for
the Google Analytics source. If you’re just testing Airbyte out, use the PokeAPI
source, as it lets you sync dummy data with no authentication. If your required
data source doesn’t exist, you can request it
here or build it yourself by heading
here (isn’t open-source
great?)
Once you have all of your data sources set up, it will look something like this.
Now we just need to set up our connection to S3 and we are good to go.
The destination (again)
Head over to the Destinations tab in the left sidebar and follow the same
process for setting up our connection to S3. Click on +New Destination and
search for S3. Then fill out the configuration for your bucket. We’ll now use
that access key that we generated earlier!
For output format, I recommend using Parquet for analytics purposes. It’s a
columnar storage
format,
which is optimized for reads. JSON, CSV, and Avro are supported, but will be
less performant on read.
The connection
Finally, head over to the Connections tab in the sidebar and click +New
Connection. You will need to do this process for each data source that you
have set up. Select any existing source and click your S3 Destination that you
set up from the drop down. I failed to set up a connection with my GitHub
source, so I navigated to the Airbyte Troubleshooting Discourse and filed an
issue. Response times are really fast there, so I’ll likely be able to resolve
this within a day or two.
You will then be greeted with the following connection setup page. For most
analytics jobs, syncing more frequently than every 24 hours is expensive and
overkill, so stick with the default. For sources that support it, click on the
sync mode in the streams table to use the Incremental / Append sync mode.
This ensures that every time you sync, Airbyte will check for new data and only
pull in data that you haven’t synced before.
Once you hit Set up connection, Airbyte will run your first sync! You can
click into your connection to get access to the sync logs, replication settings,
and transformation settings if supported.
Checking our S3 bucket, we can see that our data has successfully reached! If
you’re just testing things out, you’re done.
The analysis
Now that you’ve set up your data pipelines, if you want to run transformation
jobs, Trino enables that use case well — Lyft, Pinterest, and Shopify have all
done this to great success. There’s also a dbt-trino
plugin managed by the folks over at
Starburst. Alternatively, you could also accomplish this using S3 Object
Lambda
if you want to stay within the AWS landscape when possible.
Once your data is in a queryable state, you can now use
Trino or your favorite
query engine to your heart’s content! If you want to get started with querying
these heterogenous data sources using Trino, here’s a getting-started
guide on how to do that. Finally,
join the Airbyte and
Trino communities to find more about how
others are consolidating and querying their data.
