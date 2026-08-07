---
title: "How to speed up LZ4 decompression in ClickHouse?"
link: "https://clickhouse.com/blog/how-to-speed-up-lz4-decompression-in-click-house"
guid: "https://clickhouse.com/blog/how-to-speed-up-lz4-decompression-in-click-house"
pubDate: "2019-06-25T00:00:00.000Z"
site_name: "ClickHouse"
site_feed: "https://clickhouse.com/rss.xml"
category: "Data"
summary: "Explore the reasons behind the prominence of the LZ_decompress_fast function and optimize your ClickHouse queries for enhanced efficiency. Read more here."
contentHtml: "<article><div><p>When you run queries in <a target=\"_blank\" href=\"https://clickhouse.com/\">ClickHouse</a>, you might notice that the profiler often shows the <code>LZ_decompress_fast</code> function near the top. What is going on? This question had us wondering how to choose the best compression algorithm.</p>\n<p>ClickHouse stores data in compressed form. When running queries, ClickHouse tries to do as little as possible, in order to conserve CPU resources. In many cases, all the potentially time-consuming computations are already well optimized, plus the user wrote a well thought-out query. Then all that's left to do is to perform decompression.</p>\n<p><a target=\"_blank\" href=\"https://habr.com/en/company/yandex/blog/457612/\">Read further</a></p></div></article>"
---

Explore the reasons behind the prominence of the LZ_decompress_fast function and optimize your ClickHouse queries for enhanced efficiency. Read more here.
