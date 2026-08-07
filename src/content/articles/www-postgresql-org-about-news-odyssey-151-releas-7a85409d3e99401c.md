---
title: "Odyssey 1.5.1 released"
link: "https://www.postgresql.org/about/news/odyssey-151-released-3348/"
guid: "https://www.postgresql.org/about/news/odyssey-151-released-3348/"
pubDate: "2026-07-14T00:00:00.000Z"
site_name: "PostgreSQL"
site_feed: "https://www.postgresql.org/news.rss"
category: "Infra"
summary: "We are excited to announce a new release of the Odyssey — advanced multi-threaded connection pooler for PostgreSQL and Apache Cloudberry.\nA lot of new small features have been implemented, alongside extended protocol support refactoring - many violations fixed, and\noverall performance of pipelining improved.\nNew features:\nsimple shared pools support\npool_pin_on_listen option for transaction pooling\nimprovements of balancing\ncpu_affinity support\nbuild with aws-lc support\nSSLKEYLOGFILE support\nsupport for queue time metrics: avg_wait_time / total_wait_time\npoll server on attach for transparent failed backends closing\nNOTICE with queue time via pool_notice_after_waiting_ms option\nserver_drop_on_cached_plan_error option\nimprovements of prometheus metrics exporter\nBug fixes\nrecheck pool size after server creation\nbetter cancel support: wait for PG to close the cancel-connection and fix race\nauth_query fixes\ncorrect Close support in Extended protocol\nDEALLOCATE ALL support\ncorrect COPY support in extended protocol\nMore on pages:\nrelease page on github\ndocumentation at pg-odyssey.tech\ncommunity links\nWe are already preparing the 1.5.2 with even more features and fixes, stay tuned! :)"
contentHtml: "<div>\n<p>Posted on <strong>2026-07-14</strong> by Yandex</p>\n<p><span><i></i> Related Open Source</span>\n</p>\n<p>We are excited to announce a new release of the Odyssey — advanced multi-threaded connection pooler for PostgreSQL and Apache Cloudberry.</p>\n<p>A lot of new small features have been implemented, alongside extended protocol support refactoring - many violations fixed, and\noverall performance of pipelining improved.</p>\n<h3>New features:</h3>\n<ul>\n<li>simple shared pools support</li>\n<li>pool_pin_on_listen option for transaction pooling</li>\n<li>improvements of balancing</li>\n<li>cpu_affinity support</li>\n<li>build with aws-lc support</li>\n<li>SSLKEYLOGFILE support</li>\n<li>support for queue time metrics: avg_wait_time / total_wait_time</li>\n<li>poll server on attach for transparent failed backends closing</li>\n<li>NOTICE with queue time via pool_notice_after_waiting_ms option</li>\n<li>server_drop_on_cached_plan_error option</li>\n<li>improvements of prometheus metrics exporter</li>\n</ul>\n<h3>Bug fixes</h3>\n<ul>\n<li>recheck pool size after server creation</li>\n<li>better cancel support: wait for PG to close the cancel-connection and fix race</li>\n<li>auth_query fixes</li>\n<li>correct Close support in Extended protocol</li>\n<li>DEALLOCATE ALL support</li>\n<li>correct COPY support in extended protocol</li>\n</ul>\n<p>More on pages:</p>\n<ul>\n<li><a target=\"_blank\" href=\"https://github.com/yandex/odyssey/releases/tag/v1.5.1\">release page on github</a></li>\n<li><a target=\"_blank\" href=\"https://pg-odyssey.tech/\">documentation at pg-odyssey.tech</a></li>\n<li><a target=\"_blank\" href=\"https://pg-odyssey.tech/about/community.html\">community links</a></li>\n</ul>\n<p>We are already preparing the 1.5.2 with even more features and fixes, stay tuned! :)</p>\n      </div>"
---

We are excited to announce a new release of the Odyssey — advanced multi-threaded connection pooler for PostgreSQL and Apache Cloudberry.
A lot of new small features have been implemented, alongside extended protocol support refactoring - many violations fixed, and
overall performance of pipelining improved.
New features:
simple shared pools support
pool_pin_on_listen option for transaction pooling
improvements of balancing
cpu_affinity support
build with aws-lc support
SSLKEYLOGFILE support
support for queue time metrics: avg_wait_time / total_wait_time
poll server on attach for transparent failed backends closing
NOTICE with queue time via pool_notice_after_waiting_ms option
server_drop_on_cached_plan_error option
improvements of prometheus metrics exporter
Bug fixes
recheck pool size after server creation
better cancel support: wait for PG to close the cancel-connection and fix race
auth_query fixes
correct Close support in Extended protocol
DEALLOCATE ALL support
correct COPY support in extended protocol
More on pages:
release page on github
documentation at pg-odyssey.tech
community links
We are already preparing the 1.5.2 with even more features and fixes, stay tuned! :)
