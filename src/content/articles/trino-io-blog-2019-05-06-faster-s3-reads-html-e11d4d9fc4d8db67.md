---
title: "Faster S3 Reads"
link: "https://trino.io/blog/2019/05/06/faster-s3-reads.html"
guid: "https://trino.io/blog/2019/05/06/faster-s3-reads.html"
pubDate: "2019-05-06T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Presto is known for working well with Amazon S3. We recently made an\nimprovement that greatly reduces network utilization and latency when\nreading ORC or Parquet data.\nThe problem\nThe improvement started with a question\nfrom Brenton Zillins\nat Stackpath\non our Slack workspace. He noticed\nthat the network traffic to Presto workers was many times larger than the\namount of input data reported by Presto for the query.\nAfter a lively discussion on the Slack channel, we found the cause. Parquet\nwould perform a positioned read against the S3 file system to ask for an\nexact byte range (start and end). However, the file system only implemented\nthe streaming API, so it would tell S3 about the starting location, but\nnot the end location. The file system would stop reading from the stream once\nit reached the requested end location, but substantial additional data could\nbe read from S3 due to various buffers in different parts of the system.\nThe streaming API has an additional problem. Establishing a new connection\nto S3 incurs latency, especially when using secure connections over TLS.\nThere is no way to abort a streaming request to S3, other than by closing\nthe connection, so the file system is forced to close connections after\nevery request, thus preventing the connection from being reused.\nThe fix\nWe solved this by implementing positioned reads in the S3 file system.\nPosition reads, which are the only types used by ORC and Parquet, work by\nasking S3 for the exact byte range required. These reads use the minimal\namount of network traffic and allow the connection to be reused.\nBrenton tested out the change and reported success:\nThis PR brought us from >1 GB/s object read rate to under 10 MB/s\nthe same query. Thank you.\nWhile this issue is obvious in retrospect, we are surprised that it took\nso long to find it, given that S3 is one of the most popular storage systems.\nThis is a great example of how the community makes everything better.\nBeing observant and reporting an issue can have a huge win for everyone.\nHow to get it\nThis improvement is in Presto 302+,\nso you will need to upgrade if you are using an earlier version."
author: "David Phillips"
contentHtml: "<div>\n<article>\n  <div><p>Presto is known for working well with Amazon S3. We recently made an\nimprovement that greatly reduces network utilization and latency when\nreading ORC or Parquet data.</p>\n<h2 id=\"the-problem\">\n    The problem <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/06/faster-s3-reads.html#the-problem\">#</a>\n</h2>\n<p>The improvement started with a question\nfrom <a target=\"_blank\" href=\"https://github.com/bzillins\">Brenton Zillins</a>\nat <a target=\"_blank\" href=\"https://www.stackpath.com/\">Stackpath</a>\non our <a target=\"_blank\" href=\"https://trino.io/slack\">Slack</a> workspace. He noticed\nthat the network traffic to Presto workers was many times larger than the\namount of input data reported by Presto for the query.</p>\n<p>After a lively discussion on the Slack channel, we found the cause. Parquet\nwould perform a positioned read against the S3 file system to ask for an\nexact byte range (start and end). However, the file system only implemented\nthe streaming API, so it would tell S3 about the starting location, but\nnot the end location. The file system would stop reading from the stream once\nit reached the requested end location, but substantial additional data could\nbe read from S3 due to various buffers in different parts of the system.</p>\n<p>The streaming API has an additional problem. Establishing a new connection\nto S3 incurs latency, especially when using secure connections over TLS.\nThere is no way to abort a streaming request to S3, other than by closing\nthe connection, so the file system is forced to close connections after\nevery request, thus preventing the connection from being reused.</p>\n<h2 id=\"the-fix\">\n    The fix <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/06/faster-s3-reads.html#the-fix\">#</a>\n</h2>\n<p>We solved this by implementing positioned reads in the S3 file system.\nPosition reads, which are the only types used by ORC and Parquet, work by\nasking S3 for the exact byte range required. These reads use the minimal\namount of network traffic and allow the connection to be reused.</p>\n<p>Brenton tested out the change and reported success:</p>\n<blockquote>\n  <p>This PR brought us from &gt;1 GB/s object read rate to under 10 MB/s\nthe same query. Thank you.</p>\n</blockquote>\n<p>While this issue is obvious in retrospect, we are surprised that it took\nso long to find it, given that S3 is one of the most popular storage systems.\nThis is a great example of how the community makes everything better.\nBeing observant and reporting an issue can have a huge win for everyone.</p>\n<h2 id=\"how-to-get-it\">\n    How to get it <a target=\"_blank\" href=\"https://trino.io/blog/2019/05/06/faster-s3-reads.html#how-to-get-it\">#</a>\n</h2>\n<p>This improvement is in <a target=\"_blank\" href=\"https://trino.io/download\">Presto 302+</a>,\nso you will need to upgrade if you are using an earlier version.</p>\n  </div>\n</article>\n</div>"
---

Presto is known for working well with Amazon S3. We recently made an
improvement that greatly reduces network utilization and latency when
reading ORC or Parquet data.
The problem
The improvement started with a question
from Brenton Zillins
at Stackpath
on our Slack workspace. He noticed
that the network traffic to Presto workers was many times larger than the
amount of input data reported by Presto for the query.
After a lively discussion on the Slack channel, we found the cause. Parquet
would perform a positioned read against the S3 file system to ask for an
exact byte range (start and end). However, the file system only implemented
the streaming API, so it would tell S3 about the starting location, but
not the end location. The file system would stop reading from the stream once
it reached the requested end location, but substantial additional data could
be read from S3 due to various buffers in different parts of the system.
The streaming API has an additional problem. Establishing a new connection
to S3 incurs latency, especially when using secure connections over TLS.
There is no way to abort a streaming request to S3, other than by closing
the connection, so the file system is forced to close connections after
every request, thus preventing the connection from being reused.
The fix
We solved this by implementing positioned reads in the S3 file system.
Position reads, which are the only types used by ORC and Parquet, work by
asking S3 for the exact byte range required. These reads use the minimal
amount of network traffic and allow the connection to be reused.
Brenton tested out the change and reported success:
This PR brought us from >1 GB/s object read rate to under 10 MB/s
the same query. Thank you.
While this issue is obvious in retrospect, we are surprised that it took
so long to find it, given that S3 is one of the most popular storage systems.
This is a great example of how the community makes everything better.
Being observant and reporting an issue can have a huge win for everyone.
How to get it
This improvement is in Presto 302+,
so you will need to upgrade if you are using an earlier version.
