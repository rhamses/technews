---
title: "Project Tardigrade delivers ETL at Trino speeds to early users"
link: "https://trino.io/blog/2022/05/05/tardigrade-launch.html"
guid: "https://trino.io/blog/2022/05/05/tardigrade-launch.html"
pubDate: "2022-05-05T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "After six months of challenging work on Project Tardigrade, we are ready to\nlaunch. With the project we improved the user experience of running resource\nintensive queries that are common in the Extract, Transform, Load (ETL) and\nbatch processing space. It required some significant and fascinating\nengineering to get us to the current status. The latest Trino release includes\nall the work from Project Tardigrade. Read on to learn how it all works, and\nhow to enable the fault-tolerant execution in Trino.\nWhat is Project Tardigrade?\nWhat we love most about Trino is that you get fast query speeds, and you can\niterate fast with intuitive error messages, interactive experience, and query\nfederation.\nOne of the big problems that persisted a long time is that configuring, tuning,\nand managing Trino for long-running ETL workloads is very difficult. Following\nare just some of the problems you have to deal with:\nReliable landing times: Queries that run for hours can fail. Restarting\nthem from scratch wastes resources and makes it hard for you to meet\nyour completion time requirements.\nCost-efficient clusters: Trino queries that need terabytes of distributed\nmemory require extremely large clusters due to the lack of iterative\nexecution.\nConcurrency: Multiple independent clients may submit their queries\nconcurrently. Due to the lack of available resources at a certain moment some\nof these queries may need to be killed and restarted from zero after a\nwhile. This makes the landing time even more unpredictable.\nStructuring your workload\nto avoid these problems can be done by a team of experts. But that is not\naccessible to most Trino users.\nThe goal of Project Tardigrade is to provide an “out of the box” solution for the\nproblems mentioned above. We’ve designed a new\nfault-tolerant execution architecture\nthat allows us to implement an advanced resource-aware scheduling with granular\nretries.\nFollowing are some of the benefits and results:\nWhen your long-running queries experience a failure, they don’t have to start\nfrom scratch.\nWhen queries require more memory than currently available in the cluster\nthey are still able to succeed.\nWhen multiple queries are submitted concurrently they are able to share\nresources in a fair way, and make steady progress.\nTrino does all the hard work of allocating, configuring, and maintaining query\nprocessing behind the scenes. Instead of spending time tuning Trino clusters to\nmatch your workload requirements, or reorganizing your workload to match your\nTrino cluster capabilities, you can spend your time on analytics and delivering\nbusiness value. And most importantly, your heart won’t skip a beat when you\nwake up in the morning wondering whether that query landed on time.\nWhat did we test so far?\nSince there’s no publicly available testing query set for ETL use cases, we\nhandcrafted more than a hundred ETL-like queries based on the\nTPC-H\nand\nTPC-DS\ndatasets.\nTo simulate real world settings, we deployed a cluster\nconfigured for fault-tolerant execution\nof 15 m5.8xlarge nodes and repeatedly executed thousands of queries over\ndatasets of different sizes (10GB / 1TB / 10TB). The queries were\nexecuted sequentially as well as with concurrency factors of 5, 10, and 20.\nFailure recovery capabilities were tested by crashing a random node in a\ncluster every couple of minutes while streaming a live workload.\nTo validate new resource management capabilities we submitted all 22\nTPC-H\nbased queries simultaneously with fault-tolerant execution enabled and disabled.\nWith fault-tolerant execution disabled only two of them succeeded, while the \nremaining twenty queries failed with resource-related issues, such as\nrunning out of memory. With fault tolerant execution enabled all of the\nqueries succeeded with no issues.\nHow do I enable fault-tolerant execution?\nFault-tolerant execution can only be enabled for an entire cluster.\nIn general, we recommend splitting your long-running ETL queries and\nshort-running interactive workloads and use cases to run on different cluster.\nThis ensures that long running ETL queries do not impact interactive workloads\nand cause a bad user experience. Also note that any short-running,\ninteractive queries on a fault-tolerant cluster may experience higher latencies\ndue to the checkpoint mechanism.\n1. Add an S3 bucket for checkpointing\nFirst you need to create an S3 bucket for spooling. We recommend configuring a\nbucket lifecycle rule to automatically expire abandoned objects in the event of\na node crash. You can configure these rules using the \ns3api \nwhich is included in the tutorial below.\n\n{\n    \"Rules\": [\n        {\n            \"Expiration\": {\n                \"Days\": 1\n            },\n            \"ID\": \"Expire\",\n            \"Filter\": {},\n            \"Status\": \"Enabled\",\n            \"NoncurrentVersionExpiration\": {\n                \"NoncurrentDays\": 1\n            },\n            \"AbortIncompleteMultipartUpload\": {\n                \"DaysAfterInitiation\": 1\n            }\n        }\n    ]\n}\n\n\n2. Configure the Trino exchange manager\nSecond you need to configure exchange manager. Add a the file \nexchange-manager.properties in the etc folder of your Trino installation on\nthe coordinator and all workers with the following content:\n\nexchange-manager.name=filesystem\nexchange.base-directories=s3://<bucket-name>\nexchange.s3.region=us-east-1\nexchange.s3.aws-access-key=<access-key>\nexchange.s3.aws-secret-key=<secret-key>\n\n\n3. Enable task level retries\nLastly, you need to configure and enable task level retries by adding the\nfollowing properties to config.properties:\n\nretry-policy=TASK\nquery.hash-partition-count=50\n\n\nNote: more than 50 partitions is currently not supported by the filesystem\nexchange implementation.\n4. Optional recommended settings\nIt is also recommended to enable compression to reduce the amount of data spooled\non S3 (exchange.compression-enabled=true) as well as reduce the low memory\nkiller delay to allow the resource manager to unblock nodes running short on memory\nfaster (query.low-memory-killer.delay=0s). Additionally, we recommend enabling\nautomatic writer scaling to optimize output file size for tables created with\nTrino (scale-writers=true).\nTo increase overall throughput and reduce resource-related task retries, we\nrecommend adjusting the concurrency settings based on the hardware\nconfiguration you have chosen.\nFollowing are the settings for the hardware used in our testing (32 vCPUs,\n128GB memory and 10Gbit/s network):\n\ntask.concurrency=8\ntask.writer-count=4\nfault-tolerant-execution-target-task-input-size=4GB\nfault-tolerant-execution-target-task-split-count=64\nfault-tolerant-execution-task-memory=5GB\n\n\nBy default Trino is configured to wait up to five minutes for task to recover\nbefore considering it lost and rescheduling. This timeout\ncan be increased or reduced as necessary by adjusting the\nquery.remote-task.max-error-duration configuration property. For example:\nquery.remote-task.max-error-duration=1m\nDeploying on AWS with Helm and Kubernetes\nTo test out Tardigrade features, you need at least a cluster with a dedicated\ncoordinator and two workers for a minimal level of parallelism and performance.\nThe quickest and easiest way to provide all of these specifications we mentioned\nabove is by using the\nTrino helm chart with a\nprovided values.yml below and deploying a cluster to the AWS EKS cloud\nservice. If you are not familiar with deploying Trino on Kubernetes, we\nrecommend you take a look at the Trino Community Broadcast episodes covering\nlocal Trino on Kubernetes and\ndeploying Trino on EKS.\n\n\nTry Project Tardigrade Yourself »\nClosing notes\nProject Tardigrade has been a great success for us already. We learned a lot\nand significantly improved Trino. Now we are really ready to share this with\nyou all, and look forward to fix anything you find. We really want you to push\nthe limits, and let us know what you find.\nIf running fast batch jobs on the fastest state-of-the-art query engine \ninterests you, consider playing around with the tutorial above and giving us \nyour feedback. You can reach us on the #project-tardigrade \nchannel in our Slack.\nIf you would like to write about your experience and results, or become a\ncontributor, also let us know on the #project-tardigrade\nchannel. We are happy to send you Tardigrade swag as a thank you.\nThanks for reading and learning with us today. Happy Querying!\nDiscuss on Reddit\nDiscuss On Hacker News"
author: "Andrii Rosa, Brian Olsen, Brian Zhan, Lukasz Osipiuk, Martin Traverso, Zebing Lin"
contentHtml: "<div>\n<article>\n  <div><p>After six months of challenging work on Project Tardigrade, we are ready to\nlaunch. With the project we improved the user experience of running resource\nintensive queries that are common in the Extract, Transform, Load (ETL) and\nbatch processing space. It required some significant and fascinating\nengineering to get us to the current status. The latest Trino release includes\nall the work from Project Tardigrade. Read on to learn how it all works, and\nhow to enable the fault-tolerant execution in Trino.</p>\n<p>\n    <img src=\"https://trino.io/assets/blog/tardigrade-launch/tardigrade-logo.png\">\n</p>\n<!--more-->\n<h2 id=\"what-is-project-tardigrade\">\n    What is Project Tardigrade? <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#what-is-project-tardigrade\">#</a>\n</h2>\n<p>What we love most about Trino is that you get fast query speeds, and you can\niterate fast with intuitive error messages, interactive experience, and query\nfederation.</p>\n<p>One of the big problems that persisted a long time is that configuring, tuning,\nand managing Trino for long-running ETL workloads is very difficult. Following\nare just some of the problems you have to deal with:</p>\n<ul>\n  <li><em>Reliable landing times:</em> Queries that run for hours can fail. Restarting\nthem from scratch wastes resources and makes it hard for you to meet\nyour completion time requirements.</li>\n  <li><em>Cost-efficient clusters:</em> Trino queries that need terabytes of distributed\nmemory require extremely large clusters due to the lack of iterative\nexecution.</li>\n  <li><em>Concurrency:</em> Multiple independent clients may submit their queries\nconcurrently. Due to the lack of available resources at a certain moment some\nof these queries may need to be killed and restarted from zero after a\nwhile. This makes the landing time even more unpredictable.</li>\n</ul>\n<p><a target=\"_blank\" href=\"https://engineering.salesforce.com/how-to-etl-at-petabyte-scale-with-trino-5fe8ac134e36\">Structuring your workload</a>\nto avoid these problems can be done by a team of experts. But that is not\naccessible to most Trino users.</p>\n<p>The goal of Project Tardigrade is to provide an “out of the box” solution for the\nproblems mentioned above. We’ve designed a new\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/wiki/Fault-Tolerant-Execution\">fault-tolerant execution architecture</a>\nthat allows us to implement an advanced resource-aware scheduling with granular\nretries.</p>\n<p>Following are some of the benefits and results:</p>\n<ul>\n  <li>When your long-running queries experience a failure, they don’t have to start\nfrom scratch.</li>\n  <li>When queries require more memory than currently available in the cluster\nthey are still able to succeed.</li>\n  <li>When multiple queries are submitted concurrently they are able to share\nresources in a fair way, and make steady progress.</li>\n</ul>\n<p>Trino does all the hard work of allocating, configuring, and maintaining query\nprocessing behind the scenes. Instead of spending time tuning Trino clusters to\nmatch your workload requirements, or reorganizing your workload to match your\nTrino cluster capabilities, you can spend your time on analytics and delivering\nbusiness value. And most importantly, your heart won’t skip a beat when you\nwake up in the morning wondering whether that query landed on time.</p>\n<h2 id=\"what-did-we-test-so-far\">\n    What did we test so far? <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#what-did-we-test-so-far\">#</a>\n</h2>\n<p>Since there’s no publicly available testing query set for ETL use cases, we\nhandcrafted more than a hundred ETL-like queries based on the\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino-verifier-queries/tree/main/src/main/resources/queries/tpch/etl\">TPC-H</a>\nand\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino-verifier-queries/tree/main/src/main/resources/queries/tpcds/etl\">TPC-DS</a>\ndatasets.</p>\n<p>To simulate real world settings, we deployed a cluster\n<a target=\"_blank\" href=\"https://trino.io/docs/current/admin/fault-tolerant-execution.html\">configured for fault-tolerant execution</a>\nof 15 <code>m5.8xlarge</code> nodes and repeatedly executed thousands of queries over\ndatasets of different sizes (<code>10GB</code> / <code>1TB</code> / <code>10TB</code>). The queries were\nexecuted sequentially as well as with concurrency factors of 5, 10, and 20.\nFailure recovery capabilities were tested by crashing a random node in a\ncluster every couple of minutes while streaming a live workload.</p>\n<p>To validate new resource management capabilities we submitted all 22\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino-verifier-queries/tree/main/src/main/resources/queries/tpch/etl\">TPC-H</a>\nbased queries simultaneously with fault-tolerant execution enabled and disabled.\nWith fault-tolerant execution disabled only two of them succeeded, while the \nremaining twenty queries failed with resource-related issues, such as\nrunning out of memory. With fault tolerant execution enabled all of the\nqueries succeeded with no issues.</p>\n<h2 id=\"how-do-i-enable-fault-tolerant-execution\">\n    How do I enable fault-tolerant execution? <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#how-do-i-enable-fault-tolerant-execution\">#</a>\n</h2>\n<p>Fault-tolerant execution can only be enabled for an entire cluster.</p>\n<p>In general, we recommend splitting your long-running ETL queries and\nshort-running interactive workloads and use cases to run on different cluster.\nThis ensures that long running ETL queries do not impact interactive workloads\nand cause a bad user experience. Also note that any short-running,\ninteractive queries on a fault-tolerant cluster may experience higher latencies\ndue to the checkpoint mechanism.</p>\n<h3 id=\"1-add-an-s3-bucket-for-checkpointing\">\n    1. Add an S3 bucket for checkpointing <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#1-add-an-s3-bucket-for-checkpointing\">#</a>\n</h3>\n<p>First you need to create an S3 bucket for spooling. We recommend configuring a\nbucket lifecycle rule to automatically expire abandoned objects in the event of\na node crash. You can configure these rules using the \n<a target=\"_blank\" href=\"https://docs.aws.amazon.com/cli/latest/reference/s3api/put-bucket-lifecycle-configuration.html\">s3api</a> \nwhich is included in the tutorial below.</p>\n<div><pre><code>{\n    \"Rules\": [\n        {\n            \"Expiration\": {\n                \"Days\": 1\n            },\n            \"ID\": \"Expire\",\n            \"Filter\": {},\n            \"Status\": \"Enabled\",\n            \"NoncurrentVersionExpiration\": {\n                \"NoncurrentDays\": 1\n            },\n            \"AbortIncompleteMultipartUpload\": {\n                \"DaysAfterInitiation\": 1\n            }\n        }\n    ]\n}\n</code></pre></div>\n<h3 id=\"2-configure-the-trino-exchange-manager\">\n    2. Configure the Trino exchange manager <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#2-configure-the-trino-exchange-manager\">#</a>\n</h3>\n<p>Second you need to configure exchange manager. Add a the file \n<code>exchange-manager.properties</code> in the <code>etc</code> folder of your Trino installation on\nthe coordinator and all workers with the following content:</p>\n<div><pre><code>exchange-manager.name=filesystem\nexchange.base-directories=s3://&lt;bucket-name&gt;\nexchange.s3.region=us-east-1\nexchange.s3.aws-access-key=&lt;access-key&gt;\nexchange.s3.aws-secret-key=&lt;secret-key&gt;\n</code></pre></div>\n<h3 id=\"3-enable-task-level-retries\">\n    3. Enable task level retries <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#3-enable-task-level-retries\">#</a>\n</h3>\n<p>Lastly, you need to configure and enable task level retries by adding the\nfollowing properties to <code>config.properties</code>:</p>\n<div><pre><code>retry-policy=TASK\nquery.hash-partition-count=50\n</code></pre></div>\n<p>Note: more than 50 partitions is currently not supported by the filesystem\nexchange implementation.</p>\n<h3 id=\"4-optional-recommended-settings\">\n    4. Optional recommended settings <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#4-optional-recommended-settings\">#</a>\n</h3>\n<p>It is also recommended to enable compression to reduce the amount of data spooled\non S3 (<code>exchange.compression-enabled=true</code>) as well as reduce the low memory\nkiller delay to allow the resource manager to unblock nodes running short on memory\nfaster (<code>query.low-memory-killer.delay=0s</code>). Additionally, we recommend enabling\nautomatic writer scaling to optimize output file size for tables created with\nTrino (<code>scale-writers=true</code>).</p>\n<p>To increase overall throughput and reduce resource-related task retries, we\nrecommend adjusting the concurrency settings based on the hardware\nconfiguration you have chosen.</p>\n<p>Following are the settings for the hardware used in our testing (<code>32</code> vCPUs,\n<code>128GB</code> memory and <code>10Gbit/s</code> network):</p>\n<div><pre><code>task.concurrency=8\ntask.writer-count=4\nfault-tolerant-execution-target-task-input-size=4GB\nfault-tolerant-execution-target-task-split-count=64\nfault-tolerant-execution-task-memory=5GB\n</code></pre></div>\n<p>By default Trino is configured to wait up to five minutes for task to recover\nbefore considering it lost and rescheduling. This timeout\ncan be increased or reduced as necessary by adjusting the\n<code>query.remote-task.max-error-duration</code> configuration property. For example:\n<code>query.remote-task.max-error-duration=1m</code></p>\n<h2 id=\"deploying-on-aws-with-helm-and-kubernetes\">\n    Deploying on AWS with Helm and Kubernetes <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#deploying-on-aws-with-helm-and-kubernetes\">#</a>\n</h2>\n<p>To test out Tardigrade features, you need at least a cluster with a dedicated\ncoordinator and two workers for a minimal level of parallelism and performance.\nThe quickest and easiest way to provide all of these specifications we mentioned\nabove is by using the\n<a target=\"_blank\" href=\"https://artifacthub.io/packages/helm/trino/trino\">Trino helm chart</a> with a\nprovided <code>values.yml</code> below and deploying a cluster to the AWS EKS cloud\nservice. If you are not familiar with deploying Trino on Kubernetes, we\nrecommend you take a look at the Trino Community Broadcast episodes covering\n<a target=\"_blank\" href=\"https://trino.io/episodes/24\">local Trino on Kubernetes</a> and\n<a target=\"_blank\" href=\"https://trino.io/episodes/31\">deploying Trino on EKS</a>.</p>\n\n<p><a target=\"_blank\" href=\"https://github.com/bitsondatadev/trino-getting-started/tree/main/kubernetes/tardigrade-eks\">Try Project Tardigrade Yourself&#160;»</a></p>\n<h2 id=\"closing-notes\">\n    Closing notes <a target=\"_blank\" href=\"https://trino.io/blog/2022/05/05/tardigrade-launch.html#closing-notes\">#</a>\n</h2>\n<p>Project Tardigrade has been a great success for us already. We learned a lot\nand significantly improved Trino. Now we are really ready to share this with\nyou all, and look forward to fix anything you find. We really want you to push\nthe limits, and let us know what you find.</p>\n<p>If running fast batch jobs on the fastest state-of-the-art query engine \ninterests you, consider playing around with the tutorial above and giving us \nyour feedback. You can reach us on the <a target=\"_blank\" href=\"https://bit.ly/3IFlNXy\">#project-tardigrade</a> \nchannel in our <a target=\"_blank\" href=\"https://trino.io/slack\">Slack</a>.</p>\n<p>If you would like to write about your experience and results, or become a\ncontributor, also let us know on the <a target=\"_blank\" href=\"https://bit.ly/3IFlNXy\">#project-tardigrade</a>\nchannel. We are happy to send you Tardigrade swag as a thank you.</p>\n<p>Thanks for reading and learning with us today. Happy Querying!</p>\n<p><a target=\"_blank\" href=\"https://www.reddit.com/r/dataengineering/comments/uj2aez/etl_at_trino_speeds_and_a_stepbystep_tutorial_on/\">Discuss on Reddit</a></p>\n<p><a target=\"_blank\" href=\"https://news.ycombinator.com/item?id=31276058\">Discuss On Hacker News</a></p>\n  </div>\n</article>\n</div>"
---

After six months of challenging work on Project Tardigrade, we are ready to
launch. With the project we improved the user experience of running resource
intensive queries that are common in the Extract, Transform, Load (ETL) and
batch processing space. It required some significant and fascinating
engineering to get us to the current status. The latest Trino release includes
all the work from Project Tardigrade. Read on to learn how it all works, and
how to enable the fault-tolerant execution in Trino.
What is Project Tardigrade?
What we love most about Trino is that you get fast query speeds, and you can
iterate fast with intuitive error messages, interactive experience, and query
federation.
One of the big problems that persisted a long time is that configuring, tuning,
and managing Trino for long-running ETL workloads is very difficult. Following
are just some of the problems you have to deal with:
Reliable landing times: Queries that run for hours can fail. Restarting
them from scratch wastes resources and makes it hard for you to meet
your completion time requirements.
Cost-efficient clusters: Trino queries that need terabytes of distributed
memory require extremely large clusters due to the lack of iterative
execution.
Concurrency: Multiple independent clients may submit their queries
concurrently. Due to the lack of available resources at a certain moment some
of these queries may need to be killed and restarted from zero after a
while. This makes the landing time even more unpredictable.
Structuring your workload
to avoid these problems can be done by a team of experts. But that is not
accessible to most Trino users.
The goal of Project Tardigrade is to provide an “out of the box” solution for the
problems mentioned above. We’ve designed a new
fault-tolerant execution architecture
that allows us to implement an advanced resource-aware scheduling with granular
retries.
Following are some of the benefits and results:
When your long-running queries experience a failure, they don’t have to start
from scratch.
When queries require more memory than currently available in the cluster
they are still able to succeed.
When multiple queries are submitted concurrently they are able to share
resources in a fair way, and make steady progress.
Trino does all the hard work of allocating, configuring, and maintaining query
processing behind the scenes. Instead of spending time tuning Trino clusters to
match your workload requirements, or reorganizing your workload to match your
Trino cluster capabilities, you can spend your time on analytics and delivering
business value. And most importantly, your heart won’t skip a beat when you
wake up in the morning wondering whether that query landed on time.
What did we test so far?
Since there’s no publicly available testing query set for ETL use cases, we
handcrafted more than a hundred ETL-like queries based on the
TPC-H
and
TPC-DS
datasets.
To simulate real world settings, we deployed a cluster
configured for fault-tolerant execution
of 15 m5.8xlarge nodes and repeatedly executed thousands of queries over
datasets of different sizes (10GB / 1TB / 10TB). The queries were
executed sequentially as well as with concurrency factors of 5, 10, and 20.
Failure recovery capabilities were tested by crashing a random node in a
cluster every couple of minutes while streaming a live workload.
To validate new resource management capabilities we submitted all 22
TPC-H
based queries simultaneously with fault-tolerant execution enabled and disabled.
With fault-tolerant execution disabled only two of them succeeded, while the 
remaining twenty queries failed with resource-related issues, such as
running out of memory. With fault tolerant execution enabled all of the
queries succeeded with no issues.
How do I enable fault-tolerant execution?
Fault-tolerant execution can only be enabled for an entire cluster.
In general, we recommend splitting your long-running ETL queries and
short-running interactive workloads and use cases to run on different cluster.
This ensures that long running ETL queries do not impact interactive workloads
and cause a bad user experience. Also note that any short-running,
interactive queries on a fault-tolerant cluster may experience higher latencies
due to the checkpoint mechanism.
1. Add an S3 bucket for checkpointing
First you need to create an S3 bucket for spooling. We recommend configuring a
bucket lifecycle rule to automatically expire abandoned objects in the event of
a node crash. You can configure these rules using the 
s3api 
which is included in the tutorial below.

{
    "Rules": [
        {
            "Expiration": {
                "Days": 1
            },
            "ID": "Expire",
            "Filter": {},
            "Status": "Enabled",
            "NoncurrentVersionExpiration": {
                "NoncurrentDays": 1
            },
            "AbortIncompleteMultipartUpload": {
                "DaysAfterInitiation": 1
            }
        }
    ]
}


2. Configure the Trino exchange manager
Second you need to configure exchange manager. Add a the file 
exchange-manager.properties in the etc folder of your Trino installation on
the coordinator and all workers with the following content:

exchange-manager.name=filesystem
exchange.base-directories=s3://<bucket-name>
exchange.s3.region=us-east-1
exchange.s3.aws-access-key=<access-key>
exchange.s3.aws-secret-key=<secret-key>


3. Enable task level retries
Lastly, you need to configure and enable task level retries by adding the
following properties to config.properties:

retry-policy=TASK
query.hash-partition-count=50


Note: more than 50 partitions is currently not supported by the filesystem
exchange implementation.
4. Optional recommended settings
It is also recommended to enable compression to reduce the amount of data spooled
on S3 (exchange.compression-enabled=true) as well as reduce the low memory
killer delay to allow the resource manager to unblock nodes running short on memory
faster (query.low-memory-killer.delay=0s). Additionally, we recommend enabling
automatic writer scaling to optimize output file size for tables created with
Trino (scale-writers=true).
To increase overall throughput and reduce resource-related task retries, we
recommend adjusting the concurrency settings based on the hardware
configuration you have chosen.
Following are the settings for the hardware used in our testing (32 vCPUs,
128GB memory and 10Gbit/s network):

task.concurrency=8
task.writer-count=4
fault-tolerant-execution-target-task-input-size=4GB
fault-tolerant-execution-target-task-split-count=64
fault-tolerant-execution-task-memory=5GB


By default Trino is configured to wait up to five minutes for task to recover
before considering it lost and rescheduling. This timeout
can be increased or reduced as necessary by adjusting the
query.remote-task.max-error-duration configuration property. For example:
query.remote-task.max-error-duration=1m
Deploying on AWS with Helm and Kubernetes
To test out Tardigrade features, you need at least a cluster with a dedicated
coordinator and two workers for a minimal level of parallelism and performance.
The quickest and easiest way to provide all of these specifications we mentioned
above is by using the
Trino helm chart with a
provided values.yml below and deploying a cluster to the AWS EKS cloud
service. If you are not familiar with deploying Trino on Kubernetes, we
recommend you take a look at the Trino Community Broadcast episodes covering
local Trino on Kubernetes and
deploying Trino on EKS.


Try Project Tardigrade Yourself »
Closing notes
Project Tardigrade has been a great success for us already. We learned a lot
and significantly improved Trino. Now we are really ready to share this with
you all, and look forward to fix anything you find. We really want you to push
the limits, and let us know what you find.
If running fast batch jobs on the fastest state-of-the-art query engine 
interests you, consider playing around with the tutorial above and giving us 
your feedback. You can reach us on the #project-tardigrade 
channel in our Slack.
If you would like to write about your experience and results, or become a
contributor, also let us know on the #project-tardigrade
channel. We are happy to send you Tardigrade swag as a thank you.
Thanks for reading and learning with us today. Happy Querying!
Discuss on Reddit
Discuss On Hacker News
