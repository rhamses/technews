---
title: "Improved Hive Bucketing"
link: "https://trino.io/blog/2019/05/29/improved-hive-bucketing.html"
guid: "https://trino.io/blog/2019/05/29/improved-hive-bucketing.html"
pubDate: "2019-05-29T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Presto 312\nadds support for the more flexible bucketing introduced in recent\nversions of Hive. Specifically, it allows any number of files per bucket,\nincluding zero. This allows inserting data into an existing partition without\nhaving to rewrite the entire partition, and improves the performance of\nwrites by not requiring the creation of files for empty buckets.\nHive bucketing overview\nHive bucketing is a simple form of hash partitioning. A table is bucketed\non one or more columns with a fixed number of hash buckets. For example,\na table definition in Presto syntax looks like this:\n\nCREATE TABLE page_views (\n  user_id bigint,\n  page_url varchar,\n  dt date\n)\nWITH (\n  partitioned_by = ARRAY['dt'],\n  bucketed_by = ARRAY['user_id'],\n  bucket_count = 50\n)\n\n\nThe bucketing happens within each partition of the table (or across the entire\ntable if it is not partitioned). In the above example, the table is partitioned\nby date and is declared to have 50 buckets using the user ID column. This\nmeans that the table will have 50 buckets for each date. The assigned bucket\nfor each row is determined by hashing the user ID value. This means that all\nuser IDs with the same value will go into the same bucket.\nOriginal Hive bucketing\nOriginally, Hive required exactly one file per bucket. The files were named\nsuch that the bucket number was implicit based on the file’s position within\nthe lexicographic ordering of the file names. For example, the following list\nof files represent buckets 0 to 2, respectively:\n\n00000_0\n00001_0\n00002_0\n\n\n\nfile0\nfile3\nfile5\n\n\n\nbucketA\nbucketB\nbucketD\n\n\nThe file names are meaningless aside from their ordering with respect to the\nother file names.\nWhat’s the problem?\nThe original Hive bucketing scheme has a couple of problems:\nInserting data into the table by adding additional files is not possible.\nInstead, an insert operation requires rewriting all of the existing files,\nwhich can be quite expensive.\nIf the data is sparse, some of the buckets might be empty, but because there\nmust be a file for every bucket, the writer must create an empty file for\neach bucket. Some file formats, such as ORC, support zero-byte files as empty\nfiles. Other formats require writing a file with a valid header and footer.\nCreating these files adds latency to the write operation, and storing these\ntiny files is inefficient for file systems like HDFS which are designed for\nlarge files.\nImproved Hive bucketing\nNewer versions of Hive support a bucketing scheme where the bucket number is\nincluded in the file name. This is the same naming scheme that Hive has always\nused, thus it is backwards compatible with existing data. The naming convention\nhas the bucket number as the start of the file name, and requires that the\nnumber starts with a 0.\nThe following list of files shows what data written by Hive might look like for\na table with a bucket count of 4:\n\n000000_0            # bucket 0\n000000_0_copy_1     # bucket 0\n000000_0_copy_2     # bucket 0\n000001_0            # bucket 1\n000001_0_copy_1     # bucket 1\n000003_0            # bucket 3\n\n\nWe can see that there are multiple files for buckets 0 and 1, one file for\nbucket 3, and no files for bucket 2.\nUnfortunately, Presto used a different naming convention that was valid\naccording to the lexicographical ordering requirement, but not the newer\nexplicit numbering convention. File names written by Presto used to look\nlike this:\n\n20180102_030405_00641_x1y2z_bucket-00234\n\n\nThe 20180102_030405_00641_x1y2z value at the start of the file name\nis the Presto query ID for the query that wrote the data. This is followed\nby bucket- plus the padded bucket number. Presto now writes file names\nthat match the new Hive naming convention, with the bucket number at the\nthe start and the query ID at the end:\n\n000234_0_20180102_030405_00641_x1y2z\n\n\nWhen reading bucketed tables, Presto supports both the new Hive convention\nand the old Presto convention. Additionally, it still supports the original\nHive scheme when the files do not match either of the naming conventions,\nkeeping the requirement that there must be exactly one file per bucket.\nSkipping empty buckets for faster writes\nNow that Hive and Presto no longer require files for empty buckets, Presto\ndoes not need to create them. They are still created by default for\ncompatibility with earlier versions of Hive, Presto, and other tools, but\nwe expect to disable it in a future release, making writes faster by default.\nOr you may choose to disable them now if that works for your environment.\nThis is controlled by the hive.create-empty-bucket-files configuration\nproperty or the create_empty_bucket_files session property."
author: "David Phillips"
contentHtml: "<p><a href=\"https://trino.io/docs/current/release/release-312.html\">Presto 312</a>\nadds support for the more flexible bucketing introduced in recent\nversions of Hive. Specifically, it allows any number of files per bucket,\nincluding zero. This allows inserting data into an existing partition without\nhaving to rewrite the entire partition, and improves the performance of\nwrites by not requiring the creation of files for empty buckets.</p>\n\n<h1 id=\"hive-bucketing-overview\">Hive bucketing overview</h1>\n\n<p>Hive bucketing is a simple form of hash partitioning. A table is bucketed\non one or more columns with a fixed number of hash buckets. For example,\na table definition in Presto syntax looks like this:</p>\n\n<div class=\"language-sql highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code><span class=\"k\">CREATE</span> <span class=\"k\">TABLE</span> <span class=\"n\">page_views</span> <span class=\"p\">(</span>\n  <span class=\"n\">user_id</span> <span class=\"nb\">bigint</span><span class=\"p\">,</span>\n  <span class=\"n\">page_url</span> <span class=\"nb\">varchar</span><span class=\"p\">,</span>\n  <span class=\"n\">dt</span> <span class=\"nb\">date</span>\n<span class=\"p\">)</span>\n<span class=\"k\">WITH</span> <span class=\"p\">(</span>\n  <span class=\"n\">partitioned_by</span> <span class=\"o\">=</span> <span class=\"n\">ARRAY</span><span class=\"p\">[</span><span class=\"s1\">'dt'</span><span class=\"p\">],</span>\n  <span class=\"n\">bucketed_by</span> <span class=\"o\">=</span> <span class=\"n\">ARRAY</span><span class=\"p\">[</span><span class=\"s1\">'user_id'</span><span class=\"p\">],</span>\n  <span class=\"n\">bucket_count</span> <span class=\"o\">=</span> <span class=\"mi\">50</span>\n<span class=\"p\">)</span>\n</code></pre></div></div>\n\n<p>The bucketing happens within each partition of the table (or across the entire\ntable if it is not partitioned). In the above example, the table is partitioned\nby date and is declared to have <code class=\"language-plaintext highlighter-rouge\">50</code> buckets using the user ID column. This\nmeans that the table will have <code class=\"language-plaintext highlighter-rouge\">50</code> buckets for each date. The assigned bucket\nfor each row is determined by hashing the user ID value. This means that all\nuser IDs with the same value will go into the same bucket.</p>\n\n<h1 id=\"original-hive-bucketing\">Original Hive bucketing</h1>\n\n<p>Originally, Hive required exactly one file per bucket. The files were named\nsuch that the bucket number was implicit based on the file’s position within\nthe lexicographic ordering of the file names. For example, the following list\nof files represent buckets <code class=\"language-plaintext highlighter-rouge\">0</code> to <code class=\"language-plaintext highlighter-rouge\">2</code>, respectively:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>00000_0\n00001_0\n00002_0\n</code></pre></div></div>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>file0\nfile3\nfile5\n</code></pre></div></div>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>bucketA\nbucketB\nbucketD\n</code></pre></div></div>\n\n<p>The file names are meaningless aside from their ordering with respect to the\nother file names.</p>\n\n<h1 id=\"whats-the-problem\">What’s the problem?</h1>\n\n<p>The original Hive bucketing scheme has a couple of problems:</p>\n\n<ul>\n  <li>\n    <p>Inserting data into the table by adding additional files is not possible.\nInstead, an insert operation requires rewriting all of the existing files,\nwhich can be quite expensive.</p>\n  </li>\n  <li>\n    <p>If the data is sparse, some of the buckets might be empty, but because there\nmust be a file for every bucket, the writer must create an empty file for\neach bucket. Some file formats, such as ORC, support zero-byte files as empty\nfiles. Other formats require writing a file with a valid header and footer.\nCreating these files adds latency to the write operation, and storing these\ntiny files is inefficient for file systems like HDFS which are designed for\nlarge files.</p>\n  </li>\n</ul>\n\n<h1 id=\"improved-hive-bucketing\">Improved Hive bucketing</h1>\n\n<p>Newer versions of Hive support a bucketing scheme where the bucket number is\nincluded in the file name. This is the same naming scheme that Hive has always\nused, thus it is backwards compatible with existing data. The naming convention\nhas the bucket number as the start of the file name, and requires that the\nnumber starts with a <code class=\"language-plaintext highlighter-rouge\">0</code>.</p>\n\n<p>The following list of files shows what data written by Hive might look like for\na table with a bucket count of <code class=\"language-plaintext highlighter-rouge\">4</code>:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>000000_0            # bucket 0\n000000_0_copy_1     # bucket 0\n000000_0_copy_2     # bucket 0\n000001_0            # bucket 1\n000001_0_copy_1     # bucket 1\n000003_0            # bucket 3\n</code></pre></div></div>\n\n<p>We can see that there are multiple files for buckets <code class=\"language-plaintext highlighter-rouge\">0</code> and <code class=\"language-plaintext highlighter-rouge\">1</code>, one file for\nbucket <code class=\"language-plaintext highlighter-rouge\">3</code>, and no files for bucket <code class=\"language-plaintext highlighter-rouge\">2</code>.</p>\n\n<p>Unfortunately, Presto used a different naming convention that was valid\naccording to the lexicographical ordering requirement, but not the newer\nexplicit numbering convention. File names written by Presto used to look\nlike this:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>20180102_030405_00641_x1y2z_bucket-00234\n</code></pre></div></div>\n\n<p>The <code class=\"language-plaintext highlighter-rouge\">20180102_030405_00641_x1y2z</code> value at the start of the file name\nis the Presto query ID for the query that wrote the data. This is followed\nby <code class=\"language-plaintext highlighter-rouge\">bucket-</code> plus the padded bucket number. Presto now writes file names\nthat match the new Hive naming convention, with the bucket number at the\nthe start and the query ID at the end:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>000234_0_20180102_030405_00641_x1y2z\n</code></pre></div></div>\n\n<p>When reading bucketed tables, Presto supports both the new Hive convention\nand the old Presto convention. Additionally, it still supports the original\nHive scheme when the files do not match either of the naming conventions,\nkeeping the requirement that there must be exactly one file per bucket.</p>\n\n<h1 id=\"skipping-empty-buckets-for-faster-writes\">Skipping empty buckets for faster writes</h1>\n\n<p>Now that Hive and Presto no longer require files for empty buckets, Presto\ndoes not need to create them. They are still created by default for\ncompatibility with earlier versions of Hive, Presto, and other tools, but\nwe expect to disable it in a future release, making writes faster by default.\nOr you may choose to disable them now if that works for your environment.\nThis is controlled by the <code class=\"language-plaintext highlighter-rouge\">hive.create-empty-bucket-files</code> configuration\nproperty or the <code class=\"language-plaintext highlighter-rouge\">create_empty_bucket_files</code> session property.</p>"
---

Presto 312
adds support for the more flexible bucketing introduced in recent
versions of Hive. Specifically, it allows any number of files per bucket,
including zero. This allows inserting data into an existing partition without
having to rewrite the entire partition, and improves the performance of
writes by not requiring the creation of files for empty buckets.
Hive bucketing overview
Hive bucketing is a simple form of hash partitioning. A table is bucketed
on one or more columns with a fixed number of hash buckets. For example,
a table definition in Presto syntax looks like this:

CREATE TABLE page_views (
  user_id bigint,
  page_url varchar,
  dt date
)
WITH (
  partitioned_by = ARRAY['dt'],
  bucketed_by = ARRAY['user_id'],
  bucket_count = 50
)


The bucketing happens within each partition of the table (or across the entire
table if it is not partitioned). In the above example, the table is partitioned
by date and is declared to have 50 buckets using the user ID column. This
means that the table will have 50 buckets for each date. The assigned bucket
for each row is determined by hashing the user ID value. This means that all
user IDs with the same value will go into the same bucket.
Original Hive bucketing
Originally, Hive required exactly one file per bucket. The files were named
such that the bucket number was implicit based on the file’s position within
the lexicographic ordering of the file names. For example, the following list
of files represent buckets 0 to 2, respectively:

00000_0
00001_0
00002_0



file0
file3
file5



bucketA
bucketB
bucketD


The file names are meaningless aside from their ordering with respect to the
other file names.
What’s the problem?
The original Hive bucketing scheme has a couple of problems:
Inserting data into the table by adding additional files is not possible.
Instead, an insert operation requires rewriting all of the existing files,
which can be quite expensive.
If the data is sparse, some of the buckets might be empty, but because there
must be a file for every bucket, the writer must create an empty file for
each bucket. Some file formats, such as ORC, support zero-byte files as empty
files. Other formats require writing a file with a valid header and footer.
Creating these files adds latency to the write operation, and storing these
tiny files is inefficient for file systems like HDFS which are designed for
large files.
Improved Hive bucketing
Newer versions of Hive support a bucketing scheme where the bucket number is
included in the file name. This is the same naming scheme that Hive has always
used, thus it is backwards compatible with existing data. The naming convention
has the bucket number as the start of the file name, and requires that the
number starts with a 0.
The following list of files shows what data written by Hive might look like for
a table with a bucket count of 4:

000000_0            # bucket 0
000000_0_copy_1     # bucket 0
000000_0_copy_2     # bucket 0
000001_0            # bucket 1
000001_0_copy_1     # bucket 1
000003_0            # bucket 3


We can see that there are multiple files for buckets 0 and 1, one file for
bucket 3, and no files for bucket 2.
Unfortunately, Presto used a different naming convention that was valid
according to the lexicographical ordering requirement, but not the newer
explicit numbering convention. File names written by Presto used to look
like this:

20180102_030405_00641_x1y2z_bucket-00234


The 20180102_030405_00641_x1y2z value at the start of the file name
is the Presto query ID for the query that wrote the data. This is followed
by bucket- plus the padded bucket number. Presto now writes file names
that match the new Hive naming convention, with the bucket number at the
the start and the query ID at the end:

000234_0_20180102_030405_00641_x1y2z


When reading bucketed tables, Presto supports both the new Hive convention
and the old Presto convention. Additionally, it still supports the original
Hive scheme when the files do not match either of the naming conventions,
keeping the requirement that there must be exactly one file per bucket.
Skipping empty buckets for faster writes
Now that Hive and Presto no longer require files for empty buckets, Presto
does not need to create them. They are still created by default for
compatibility with earlier versions of Hive, Presto, and other tools, but
we expect to disable it in a future release, making writes faster by default.
Or you may choose to disable them now if that works for your environment.
This is controlled by the hive.create-empty-bucket-files configuration
property or the create_empty_bucket_files session property.
