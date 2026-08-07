---
title: "JVM challenges in production"
link: "https://trino.io/blog/2021/10/06/jvm-issues-at-comcast.html"
guid: "https://trino.io/blog/2021/10/06/jvm-issues-at-comcast.html"
pubDate: "2021-10-06T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "At Comcast, we have a large on-premise Trino cluster. It enables us to extract\ninsights from data no matter where it resides, and prepares the company for a\nmore cloud-centric future. Recently, however, we experienced and overcame\nchallenges related to the Java virtual machine (JVM). We wanted to share what\nwe encountered and learned in hopes that it might be useful for the Trino\ncommunity.\nJIT recompilation\nSome users complained that nightly reports were taking far too long to\ncomplete. Queries that ran for six hours made very little progress.\nFirst, we looked at the queries involved in these nightly reports. We\nnoticed that all these queries involved two particular tables. In this post,\nlet’s call them table A and table B.\nOur initial suspicion was that there could be an issue with the table data in\nHDFS. Thus, we tried to reproduce the performance problem by using queries that\nperformed simple scans against these tables.\nWe tried a simple table scan with no filters, range filter on a partitioned\ncolumn, etc.,  ran these queries multiple times and execution times were\nconsistent. This ruled out a potential problem with HDFS.\nNext, we took a closer look  at the portion of the slow running queries\ninvolving table A, and came up with the simplest possible query that could\ndemonstrate the problem. We discovered that the following query did not exhibit\nthe performance problem:\n\nSELECT\n count(a.c1)\nFROM\n hive.schema1.A a, hive.schema2.B da\nWHERE\n a.day_id = da.date_id\n AND a.day_id BETWEEN '2021-03-22' AND '2021-04-21'\n\n\nBut adding a predicate, a.c2 = '4 (Success)', caused the performance problem\nto appear:\n\nSELECT\n count(a.c1)\nFROM\n hive.schema1.A a, hive.schema2.date_dim da\nWHERE\n a.day_id = da.date_id\n AND a.day_id BETWEEN '2021-03-22' AND '2021-04-21'\n AND a.c2 = '4 (Success)'\n\n\nWe narrowed the problem down to the Scan/Filter/Project operator using the\noutput of EXPLAIN ANALYZE from Trino. For the query that performed as\nexpected, this stage had the following CPU stats:\n\nCPU: 2.39h, Scheduled: 4.47h, Input: 17434967615 rows (357.47GB)\n\n\nFor the version of the query with the additional predicate, a.c2 = '4 (Success)',\nthat exhibited the performance problem, the same stage has the following CPU\nstats:\n\nCPU: 3.73d, Scheduled: 48.01d, Input: 17052985227 rows (413.98GB)\n\n\nThis shows that for roughly the equivalent amount of data, Trino used\nsignificantly more CPU (3.73 days to 2.39 hours!!). Our next step was to\ndetermine possible reasons.\nWe generated a few jstack\nand Java flight recorder (JFR) profiles of the Trino Java process from\none of the worker nodes while the scan stage was running. After analyzing these\nprofiles, we found no obvious problem. Trino performed as expected.\nNext, we looked at the list of tasks in the web UI to see what the distribution\nof CPU times for each stage was:\n\nSome workers have tasks that only use up a few minutes of CPU time and others\nhave tasks that use up to 2 hours of CPU time! Different query runs would show\nthis would happen to different workers so it was not a problem with any one\nindividual worker.\nWe discussed this with Starburst engineer, Piotr Findeisen,\nand came to the conclusion that this could potentially be an issue with JVM\ncode deoptimization. After re-compiling a method a certain number of times,\nthe JVM refuses to do so any more and will run the method in interpreted\nmode, which is much slower.\nThe evidence for this is what we highlighted above: that the CPU used by the\nsame tasks on different workers vary by a factor of approximately 30. This is\nthe typical difference for compiled versus interpreted code, according to\nPiotr’s experience at Starburst.\nThe following JVM options were added to the Trino jvm.config file to help\nwith this issue:\n-XX:PerMethodRecompilationCutoff=10000\n-XX:PerBytecodeRecompilationCutoff=10000\nThese settings increased the recompilation cutoff limit. They are now also\nincluded in the default jvm.config settings that ship with Trino since the\n348 release.\nSince we have been running Trino in production for some time, we did not have\nthese settings in our jvm.config.\nInitial results\nExecution time observed  with the JVM options in place was 4 minutes and 51\nseconds. The CPU stats for the scan/filter/project stage for this query now\nlook like:\n\nCPU: 3.22h, Scheduled: 7.21h, Input: 17631445897 rows (428.03GB)\n\n\nThe CPU used by individual tasks is much more uniform:\n\nCode cache\nWe noticed that the cluster’s overall CPU utilization decreased after the\ncluster was up for a few days, and there would be a few workers where tasks\nwere running slow.\nWhen looking at these workers with slow running tasks, we found that CPU usage\nwas very high:\n\n[root@worker-node log]# uptime\n 21:36:57 up 20 days, 20:39,  1 user,  load average: 149.92, 152.83, 144.82\n[root@worker-node log]#\n\n\nWe also noticed all these workers had messages like this in the launcher.log\nfile:\n\n[219756.210s][warning][codecache] Try increasing the code heap size using -XX:ProfiledCodeHeapSize=\nOpenJDK 64-Bit Server VM warning: CodeHeap 'profiled nmethods' is full. Compiler has been disabled.\nOpenJDK 64-Bit Server VM warning: Try increasing the code heap size using -XX:ProfiledCodeHeapSize=\nCodeHeap 'non-profiled nmethods': size=258436Kb used=235661Kb max_used=257882Kb free=22774Kb\n bounds [0x00007f466f980000, 0x00007f467f5e1000, 0x00007f467f5e1000]\nCodeHeap 'profiled nmethods': size=258432Kb used=207330Kb max_used=216383Kb free=51101Kb\n bounds [0x00007f465fd20000, 0x00007f466f980000, 0x00007f466f980000]\nCodeHeap 'non-nmethods': size=7420Kb used=1881Kb max_used=3766Kb free=5538Kb\n bounds [0x00007f465f5e1000, 0x00007f465fab1000, 0x00007f465fd20000]\n total_blobs=64220 nmethods=62699 adapters=1432\n compilation: disabled (not enough contiguous free space left)\n              stopped_count=4, restarted_count=3\n full_count=3\n\n\nOnce the code cache is full, the JVM won’t compile any additional code until\nspace is freed.\nWe were running with the -XX:ReservedCodeCacheSize JVM option set to 512M.\nTo see what’s taking up space in the code cache, we used jcmd:\n\njcmd <TRINO_PID> Compiler.CodeHeap_Analytics\n\n\nWe ran this at various intervals so we could compare how the code cache changed\nover time.\n30 of the top 48 non-profiled methods were PagesHashStrategy, which are\ngenerated per-query. These can’t be removed from the cache until the query is\ncompleted, so the amount of cache needed is going to be relative to the\nconcurrency. We have a very busy cluster with significant concurrency at our\nbusiest times.\nNext, we set -XX:ReservedCodeCacheSize to 2G to see how that would help. We\nhave not seen the code cache fill while the cluster has been running since\nincreasing the size to 2GB. We can also monitor the size of the code cache over\ntime using JMX. One query that can be used if you have the JMX catalog enabled\non your cluster is:\n\nSELECT\n    node,\n    regexp_extract(usage, 'max=(-?\\d*)', 1) as max,\n    regexp_extract(usage, 'used=(-?\\d*)', 1) AS used\nFROM\n  jmx.current.\"java.lang:name=codeheap 'non-profiled nmethods',type=memorypool\"\nORDER BY used DESC\n\n\nOff heap memory usage\nOne final JVM issue we noticed in our production cluster was that off-heap\nmemory on some workers grew to be quite large. We allocate approximately 85%\nof the physical memory on our workers for the JVM heap. Recently, we received\nalerts from our monitoring systems that memory consumption on our workers got\ndangerously close to the physical limit on the machines.\nWe noticed some memory related issues from the Alluxio client in the Trino\nworker logs on machines generating these high memory alerts. Upon further\ninvestigation, we noticed that Trino was running with the open source version\nof the Alluxio client. Trino ships with version 2.4.0 of the Alluxio client. We\nare an Alluxio customer and use it in our environment.\nAfter discussing with Alluxio, they suggested we upgrade to version 2.4.1 of\ntheir Enterprise client which includes a fix for an off-heap memory leak bug.\nAfter upgrading to the Alluxio Enterprise client, the off-heap memory usage\nbecame a lot more stable.\nSummary\nThis post outlined some of the JVM issues we encountered while running Trino in\nproduction. Many of these issues we only hit in our production environment and\nwere difficult to replicate outside of it. Thus, we wanted to write up our \nexperience with the hopes of helping other Trino users in the future!"
author: "Sajumon Joseph, David Leach, Bryan Aller, Pavan Madhineni, Lavanya Ragothaman, Pratap Moturi, Pádraig O'Sullivan (Starburst)"
contentHtml: "<div>\n<article>\n  <div><p>At Comcast, we have a large on-premise Trino cluster. It enables us to extract\ninsights from data no matter where it resides, and prepares the company for a\nmore cloud-centric future. Recently, however, we experienced and overcame\nchallenges related to the Java virtual machine (JVM). We wanted to share what\nwe encountered and learned in hopes that it might be useful for the Trino\ncommunity.</p>\n<!--more-->\n<h2 id=\"jit-recompilation\">\n    JIT recompilation <a target=\"_blank\" href=\"https://trino.io/blog/2021/10/06/jvm-issues-at-comcast.html#jit-recompilation\">#</a>\n</h2>\n<p>Some users complained that nightly reports were taking far too long to\ncomplete. Queries that ran for six hours made very little progress.</p>\n<p>First, we looked at the queries involved in these nightly reports. We\nnoticed that all these queries involved two particular tables. In this post,\nlet’s call them table A and table B.</p>\n<p>Our initial suspicion was that there could be an issue with the table data in\nHDFS. Thus, we tried to reproduce the performance problem by using queries that\nperformed simple scans against these tables.</p>\n<p>We tried a simple table scan with no filters, range filter on a partitioned\ncolumn, etc.,  ran these queries multiple times and execution times were\nconsistent. This ruled out a potential problem with HDFS.</p>\n<p>Next, we took a closer look  at the portion of the slow running queries\ninvolving table A, and came up with the simplest possible query that could\ndemonstrate the problem. We discovered that the following query did not exhibit\nthe performance problem:</p>\n<div><pre><code>SELECT\n count(a.c1)\nFROM\n hive.schema1.A a, hive.schema2.B da\nWHERE\n a.day_id = da.date_id\n AND a.day_id BETWEEN '2021-03-22' AND '2021-04-21'\n</code></pre></div>\n<p>But adding a predicate, <code>a.c2 = '4 (Success)'</code>, caused the performance problem\nto appear:</p>\n<div><pre><code>SELECT\n count(a.c1)\nFROM\n hive.schema1.A a, hive.schema2.date_dim da\nWHERE\n a.day_id = da.date_id\n AND a.day_id BETWEEN '2021-03-22' AND '2021-04-21'\n AND a.c2 = '4 (Success)'\n</code></pre></div>\n<p>We narrowed the problem down to the <code>Scan/Filter/Project</code> operator using the\noutput of <code>EXPLAIN ANALYZE</code> from Trino. For the query that performed as\nexpected, this stage had the following CPU stats:</p>\n<div><pre><code>CPU: 2.39h, Scheduled: 4.47h, Input: 17434967615 rows (357.47GB)\n</code></pre></div>\n<p>For the version of the query with the additional predicate, <code>a.c2 = '4 (Success)'</code>,\nthat exhibited the performance problem, the same stage has the following CPU\nstats:</p>\n<div><pre><code>CPU: 3.73d, Scheduled: 48.01d, Input: 17052985227 rows (413.98GB)\n</code></pre></div>\n<p>This shows that for roughly the equivalent amount of data, Trino used\nsignificantly more CPU (3.73 days to 2.39 hours!!). Our next step was to\ndetermine possible reasons.</p>\n<p>We generated a few <a target=\"_blank\" href=\"https://docs.oracle.com/javase/7/docs/technotes/tools/share/jstack.html\">jstack</a>\nand Java flight recorder (JFR) profiles of the Trino Java process from\none of the worker nodes while the scan stage was running. After analyzing these\nprofiles, we found no obvious problem. Trino performed as expected.</p>\n<p>Next, we looked at the list of tasks in the web UI to see what the distribution\nof CPU times for each stage was:</p>\n<p><img src=\"https://trino.io/assets/blog/jvm-issues-at-comcast/web_ui_before.png\" alt=\"\"></p>\n<p>Some workers have tasks that only use up a few minutes of CPU time and others\nhave tasks that use up to 2 hours of CPU time! Different query runs would show\nthis would happen to different workers so it was not a problem with any one\nindividual worker.</p>\n<p>We discussed this with Starburst engineer, <a target=\"_blank\" href=\"https://github.com/findepi\">Piotr Findeisen</a>,\nand came to the conclusion that this could potentially be an issue with JVM\ncode deoptimization. After re-compiling a method a certain number of times,\nthe JVM refuses to do so any more and will run the method in interpreted\nmode, which is much slower.</p>\n<p>The evidence for this is what we highlighted above: that the CPU used by the\nsame tasks on different workers vary by a factor of approximately 30. This is\nthe typical difference for compiled versus interpreted code, according to\nPiotr’s experience at Starburst.</p>\n<p>The following JVM options were added to the Trino <code>jvm.config</code> file to help\nwith this issue:</p>\n<ul>\n  <li><code>-XX:PerMethodRecompilationCutoff=10000</code></li>\n  <li><code>-XX:PerBytecodeRecompilationCutoff=10000</code></li>\n</ul>\n<p>These settings increased the recompilation cutoff limit. They are now also\nincluded in the default <code>jvm.config</code> settings that ship with Trino since the\n348 release.</p>\n<p>Since we have been running Trino in production for some time, we did not have\nthese settings in our <code>jvm.config</code>.</p>\n<h3 id=\"initial-results\">\n    Initial results <a target=\"_blank\" href=\"https://trino.io/blog/2021/10/06/jvm-issues-at-comcast.html#initial-results\">#</a>\n</h3>\n<p>Execution time observed  with the JVM options in place was 4 minutes and 51\nseconds. The CPU stats for the scan/filter/project stage for this query now\nlook like:</p>\n<div><pre><code>CPU: 3.22h, Scheduled: 7.21h, Input: 17631445897 rows (428.03GB)\n</code></pre></div>\n<p>The CPU used by individual tasks is much more uniform:</p>\n<p><img src=\"https://trino.io/assets/blog/jvm-issues-at-comcast/web_ui_after.png\" alt=\"\"></p>\n<h2 id=\"code-cache\">\n    Code cache <a target=\"_blank\" href=\"https://trino.io/blog/2021/10/06/jvm-issues-at-comcast.html#code-cache\">#</a>\n</h2>\n<p>We noticed that the cluster’s overall CPU utilization decreased after the\ncluster was up for a few days, and there would be a few workers where tasks\nwere running slow.</p>\n<p>When looking at these workers with slow running tasks, we found that CPU usage\nwas very high:</p>\n<div><pre><code>[root@worker-node log]# uptime\n 21:36:57 up 20 days, 20:39,  1 user,  load average: 149.92, 152.83, 144.82\n[root@worker-node log]#\n</code></pre></div>\n<p>We also noticed all these workers had messages like this in the <code>launcher.log</code>\nfile:</p>\n<div><pre><code>[219756.210s][warning][codecache] Try increasing the code heap size using -XX:ProfiledCodeHeapSize=\nOpenJDK 64-Bit Server VM warning: CodeHeap 'profiled nmethods' is full. Compiler has been disabled.\nOpenJDK 64-Bit Server VM warning: Try increasing the code heap size using -XX:ProfiledCodeHeapSize=\nCodeHeap 'non-profiled nmethods': size=258436Kb used=235661Kb max_used=257882Kb free=22774Kb\n bounds [0x00007f466f980000, 0x00007f467f5e1000, 0x00007f467f5e1000]\nCodeHeap 'profiled nmethods': size=258432Kb used=207330Kb max_used=216383Kb free=51101Kb\n bounds [0x00007f465fd20000, 0x00007f466f980000, 0x00007f466f980000]\nCodeHeap 'non-nmethods': size=7420Kb used=1881Kb max_used=3766Kb free=5538Kb\n bounds [0x00007f465f5e1000, 0x00007f465fab1000, 0x00007f465fd20000]\n total_blobs=64220 nmethods=62699 adapters=1432\n compilation: disabled (not enough contiguous free space left)\n              stopped_count=4, restarted_count=3\n full_count=3\n</code></pre></div>\n<p>Once the code cache is full, the JVM won’t compile any additional code until\nspace is freed.</p>\n<p>We were running with the <code>-XX:ReservedCodeCacheSize</code> JVM option set to 512M.\nTo see what’s taking up space in the code cache, we used jcmd:</p>\n<div><pre><code>jcmd &lt;TRINO_PID&gt; Compiler.CodeHeap_Analytics\n</code></pre></div>\n<p>We ran this at various intervals so we could compare how the code cache changed\nover time.</p>\n<p>30 of the top 48 non-profiled methods were <code>PagesHashStrategy</code>, which are\ngenerated per-query. These can’t be removed from the cache until the query is\ncompleted, so the amount of cache needed is going to be relative to the\nconcurrency. We have a very busy cluster with significant concurrency at our\nbusiest times.</p>\n<p>Next, we set <code>-XX:ReservedCodeCacheSize</code> to 2G to see how that would help. We\nhave not seen the code cache fill while the cluster has been running since\nincreasing the size to 2GB. We can also monitor the size of the code cache over\ntime using JMX. One query that can be used if you have the JMX catalog enabled\non your cluster is:</p>\n<div><pre><code>SELECT\n    node,\n    regexp_extract(usage, 'max=(-?\\d*)', 1) as max,\n    regexp_extract(usage, 'used=(-?\\d*)', 1) AS used\nFROM\n  jmx.current.\"java.lang:name=codeheap 'non-profiled nmethods',type=memorypool\"\nORDER BY used DESC\n</code></pre></div>\n<h2 id=\"off-heap-memory-usage\">\n    Off heap memory usage <a target=\"_blank\" href=\"https://trino.io/blog/2021/10/06/jvm-issues-at-comcast.html#off-heap-memory-usage\">#</a>\n</h2>\n<p>One final JVM issue we noticed in our production cluster was that off-heap\nmemory on some workers grew to be quite large. We allocate approximately 85%\nof the physical memory on our workers for the JVM heap. Recently, we received\nalerts from our monitoring systems that memory consumption on our workers got\ndangerously close to the physical limit on the machines.</p>\n<p>We noticed some memory related issues from the Alluxio client in the Trino\nworker logs on machines generating these high memory alerts. Upon further\ninvestigation, we noticed that Trino was running with the open source version\nof the Alluxio client. Trino ships with version 2.4.0 of the Alluxio client. We\nare an Alluxio customer and use it in our environment.</p>\n<p>After discussing with Alluxio, they suggested we upgrade to version 2.4.1 of\ntheir Enterprise client which includes a fix for an off-heap memory leak bug.\nAfter upgrading to the Alluxio Enterprise client, the off-heap memory usage\nbecame a lot more stable.</p>\n<h2 id=\"summary\">\n    Summary <a target=\"_blank\" href=\"https://trino.io/blog/2021/10/06/jvm-issues-at-comcast.html#summary\">#</a>\n</h2>\n<p>This post outlined some of the JVM issues we encountered while running Trino in\nproduction. Many of these issues we only hit in our production environment and\nwere difficult to replicate outside of it. Thus, we wanted to write up our \nexperience with the hopes of helping other Trino users in the future!</p>\n  </div>\n</article>\n</div>"
---

At Comcast, we have a large on-premise Trino cluster. It enables us to extract
insights from data no matter where it resides, and prepares the company for a
more cloud-centric future. Recently, however, we experienced and overcame
challenges related to the Java virtual machine (JVM). We wanted to share what
we encountered and learned in hopes that it might be useful for the Trino
community.
JIT recompilation
Some users complained that nightly reports were taking far too long to
complete. Queries that ran for six hours made very little progress.
First, we looked at the queries involved in these nightly reports. We
noticed that all these queries involved two particular tables. In this post,
let’s call them table A and table B.
Our initial suspicion was that there could be an issue with the table data in
HDFS. Thus, we tried to reproduce the performance problem by using queries that
performed simple scans against these tables.
We tried a simple table scan with no filters, range filter on a partitioned
column, etc.,  ran these queries multiple times and execution times were
consistent. This ruled out a potential problem with HDFS.
Next, we took a closer look  at the portion of the slow running queries
involving table A, and came up with the simplest possible query that could
demonstrate the problem. We discovered that the following query did not exhibit
the performance problem:

SELECT
 count(a.c1)
FROM
 hive.schema1.A a, hive.schema2.B da
WHERE
 a.day_id = da.date_id
 AND a.day_id BETWEEN '2021-03-22' AND '2021-04-21'


But adding a predicate, a.c2 = '4 (Success)', caused the performance problem
to appear:

SELECT
 count(a.c1)
FROM
 hive.schema1.A a, hive.schema2.date_dim da
WHERE
 a.day_id = da.date_id
 AND a.day_id BETWEEN '2021-03-22' AND '2021-04-21'
 AND a.c2 = '4 (Success)'


We narrowed the problem down to the Scan/Filter/Project operator using the
output of EXPLAIN ANALYZE from Trino. For the query that performed as
expected, this stage had the following CPU stats:

CPU: 2.39h, Scheduled: 4.47h, Input: 17434967615 rows (357.47GB)


For the version of the query with the additional predicate, a.c2 = '4 (Success)',
that exhibited the performance problem, the same stage has the following CPU
stats:

CPU: 3.73d, Scheduled: 48.01d, Input: 17052985227 rows (413.98GB)


This shows that for roughly the equivalent amount of data, Trino used
significantly more CPU (3.73 days to 2.39 hours!!). Our next step was to
determine possible reasons.
We generated a few jstack
and Java flight recorder (JFR) profiles of the Trino Java process from
one of the worker nodes while the scan stage was running. After analyzing these
profiles, we found no obvious problem. Trino performed as expected.
Next, we looked at the list of tasks in the web UI to see what the distribution
of CPU times for each stage was:

Some workers have tasks that only use up a few minutes of CPU time and others
have tasks that use up to 2 hours of CPU time! Different query runs would show
this would happen to different workers so it was not a problem with any one
individual worker.
We discussed this with Starburst engineer, Piotr Findeisen,
and came to the conclusion that this could potentially be an issue with JVM
code deoptimization. After re-compiling a method a certain number of times,
the JVM refuses to do so any more and will run the method in interpreted
mode, which is much slower.
The evidence for this is what we highlighted above: that the CPU used by the
same tasks on different workers vary by a factor of approximately 30. This is
the typical difference for compiled versus interpreted code, according to
Piotr’s experience at Starburst.
The following JVM options were added to the Trino jvm.config file to help
with this issue:
-XX:PerMethodRecompilationCutoff=10000
-XX:PerBytecodeRecompilationCutoff=10000
These settings increased the recompilation cutoff limit. They are now also
included in the default jvm.config settings that ship with Trino since the
348 release.
Since we have been running Trino in production for some time, we did not have
these settings in our jvm.config.
Initial results
Execution time observed  with the JVM options in place was 4 minutes and 51
seconds. The CPU stats for the scan/filter/project stage for this query now
look like:

CPU: 3.22h, Scheduled: 7.21h, Input: 17631445897 rows (428.03GB)


The CPU used by individual tasks is much more uniform:

Code cache
We noticed that the cluster’s overall CPU utilization decreased after the
cluster was up for a few days, and there would be a few workers where tasks
were running slow.
When looking at these workers with slow running tasks, we found that CPU usage
was very high:

[root@worker-node log]# uptime
 21:36:57 up 20 days, 20:39,  1 user,  load average: 149.92, 152.83, 144.82
[root@worker-node log]#


We also noticed all these workers had messages like this in the launcher.log
file:

[219756.210s][warning][codecache] Try increasing the code heap size using -XX:ProfiledCodeHeapSize=
OpenJDK 64-Bit Server VM warning: CodeHeap 'profiled nmethods' is full. Compiler has been disabled.
OpenJDK 64-Bit Server VM warning: Try increasing the code heap size using -XX:ProfiledCodeHeapSize=
CodeHeap 'non-profiled nmethods': size=258436Kb used=235661Kb max_used=257882Kb free=22774Kb
 bounds [0x00007f466f980000, 0x00007f467f5e1000, 0x00007f467f5e1000]
CodeHeap 'profiled nmethods': size=258432Kb used=207330Kb max_used=216383Kb free=51101Kb
 bounds [0x00007f465fd20000, 0x00007f466f980000, 0x00007f466f980000]
CodeHeap 'non-nmethods': size=7420Kb used=1881Kb max_used=3766Kb free=5538Kb
 bounds [0x00007f465f5e1000, 0x00007f465fab1000, 0x00007f465fd20000]
 total_blobs=64220 nmethods=62699 adapters=1432
 compilation: disabled (not enough contiguous free space left)
              stopped_count=4, restarted_count=3
 full_count=3


Once the code cache is full, the JVM won’t compile any additional code until
space is freed.
We were running with the -XX:ReservedCodeCacheSize JVM option set to 512M.
To see what’s taking up space in the code cache, we used jcmd:

jcmd <TRINO_PID> Compiler.CodeHeap_Analytics


We ran this at various intervals so we could compare how the code cache changed
over time.
30 of the top 48 non-profiled methods were PagesHashStrategy, which are
generated per-query. These can’t be removed from the cache until the query is
completed, so the amount of cache needed is going to be relative to the
concurrency. We have a very busy cluster with significant concurrency at our
busiest times.
Next, we set -XX:ReservedCodeCacheSize to 2G to see how that would help. We
have not seen the code cache fill while the cluster has been running since
increasing the size to 2GB. We can also monitor the size of the code cache over
time using JMX. One query that can be used if you have the JMX catalog enabled
on your cluster is:

SELECT
    node,
    regexp_extract(usage, 'max=(-?\d*)', 1) as max,
    regexp_extract(usage, 'used=(-?\d*)', 1) AS used
FROM
  jmx.current."java.lang:name=codeheap 'non-profiled nmethods',type=memorypool"
ORDER BY used DESC


Off heap memory usage
One final JVM issue we noticed in our production cluster was that off-heap
memory on some workers grew to be quite large. We allocate approximately 85%
of the physical memory on our workers for the JVM heap. Recently, we received
alerts from our monitoring systems that memory consumption on our workers got
dangerously close to the physical limit on the machines.
We noticed some memory related issues from the Alluxio client in the Trino
worker logs on machines generating these high memory alerts. Upon further
investigation, we noticed that Trino was running with the open source version
of the Alluxio client. Trino ships with version 2.4.0 of the Alluxio client. We
are an Alluxio customer and use it in our environment.
After discussing with Alluxio, they suggested we upgrade to version 2.4.1 of
their Enterprise client which includes a fix for an off-heap memory leak bug.
After upgrading to the Alluxio Enterprise client, the off-heap memory usage
became a lot more stable.
Summary
This post outlined some of the JVM issues we encountered while running Trino in
production. Many of these issues we only hit in our production environment and
were difficult to replicate outside of it. Thus, we wanted to write up our 
experience with the hopes of helping other Trino users in the future!
