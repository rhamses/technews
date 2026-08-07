---
title: "Trino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec"
link: "https://trino.io/blog/2021/07/30/iceberg-concurrency-snapshots-spec.html"
guid: "https://trino.io/blog/2021/07/30/iceberg-concurrency-snapshots-spec.html"
pubDate: "2021-07-30T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Welcome to the Trino on ice series, covering the details around how the Iceberg\ntable format works with the Trino query engine. The examples build on each\nprevious post, so it’s recommended to read the posts sequentially and reference\nthem as needed later. Here are links to the posts in this series:\nTrino on ice I: A gentle introduction to Iceberg\nTrino on ice II: In-place table evolution and cloud compatibility with Iceberg\nTrino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec\nTrino on ice IV: Deep dive into Iceberg internals\nIn the last two blog posts, we’ve covered a lot of cool feature improvements of\nIceberg over the Hive model. I recommend you take a look at those if you haven’t\nyet. We introduced concepts and issues that table formats address. This blog \ncloses up the overview of Iceberg features by discussing the concurrency model\nIceberg uses to ensure data integrity, how to use snapshots via Trino, and the\nIceberg Specification.\nConcurrency Model\nSome issues with the Hive model are the distinct locations where the metadata is\nstored and where the data files are stored. Having your data and metadata split\nup like this is a recipe for disaster when trying to apply updates to both\nservices atomically.\n\nA very common problem with Hive is that if a writing process failed during\ninsertion, many times you would find the data written to file storage, but the\nmetastore writes failed to occur. Or conversely, the metastore writes were\nsuccessful, but the data failed to finish writing to file storage due to a \nnetwork or file IO failure. There’s a good \nTrino Community Broadcast episode that talks\nabout a function in Trino that exists to resolve these issues by syncing the\nmetastore and file storage. You can watch \na simulation of this error\non that episode.\nAside from having issues due to the split state in the system, there are many \nother issues that stem from the file system itself. In the case of HDFS, \ndepending on the specific filesystem implementation you are using, you may have\ndifferent atomicity guarantees for various file systems and their operations,\nsuch as creating, deleting, and renaming files and directories. HDFS isn’t the\nonly troublemaker here. Other than Amazon S3’s \nrecent announcement of strong consistency in their S3 service,\nmost object storage systems only offer eventual consistency that may not show\nthe latest files immediately after writes. Despite storage systems showing more\nprogress towards offering better performance and guarantees, these systems still\noffer no reliable locking mechanism.\nIceberg addresses all of these issues in a multitude of ways. One of the primary\nways Iceberg introduces transactional guarantees is by storing the metadata in\nthe same datastore as the data itself. This simplifies handling commit failures\ndown to rolling back on one system rather than trying to coordinate a rollback\nacross two systems like in Hive. Writers independently write their metadata and\nattempt to perform their operations, needing no coordination with other writers.\nThe only time the writers coordinate is when they attempt to perform a commit of\ntheir operations. In order to do a commit, they perform a lock of the current\nsnapshot record in a database. This concurrency model where writers eagerly do\nthe work upfront is called optimistic concurrency control.\nCurrently, in Trino, this method still uses the Hive metastore to perform the\nlock-and-swap operation necessary to coordinate the final commits. Iceberg \ncreator, Ryan Blue, \ncovers this lock-and-swap mechanism and\nhow the metastore can be replaced with alternate locking methods. In the event\nthat two writers attempt to commit at the same time,\nthe writer that first acquires the lock successfully commits by swapping its\nsnapshot as the current snapshot, while the second writer will retry to apply\nits changes again. The second writer should have no problem with this, assuming\nthere are no conflicting changes between the two snapshots.\n\nThis works similarly to a git workflow where the main branch is the locked\nresource, and two developers try to commit their changes at the same time. The\nfirst developer’s changes may conflict with the second developer’s changes. The\nsecond developer is then forced to rebase or merge the first developer’s code\nwith their changes before commiting to the main branch again. The same logic\napplies to merging data files. Currently, Iceberg clients use a\ncopy-on-write mechanism\nthat makes a new file out of the merged data in the next snapshot. This enables\naccurate time traveling and preserves previous split versions of the files. At\nthe time of writing, upserts via MERGE INTO syntax are not supported in Trino,\nbut \nthis is in active development.\nUPDATE: Since the original writing of this post, the \nMERGE syntax exists as of version 393.\nOne of the great benefits of tracking each individual change that gets written\nto Iceberg is that you are given a view of the data at every point in time. This\nenables a really cool feature that I mentioned earlier called time travel.\nSnapshots and Time Travel\nTo showcase snapshots, it’s best to go over a few examples drawing from the\nevent table we \ncreated in the previous blog posts.\nThis time we’ll only be working with the Iceberg table, as this capability is\nnot available in Hive. Snapshots allow you to have an immutable set of your data\nat a given time. They are automatically created on every append or removal of\ndata. One thing to note is that for now, they do not store the state of your\nmetadata.\nSay that you have created your events table and inserted the three initial rows\nas we did previously. Let’s look at the data we get back and see how to check\nthe existing snapshots in Trino:\n\nSELECT level, message\nFROM iceberg.logging.events;\n\n\nResult:\nlevel\n      message\n    \nERROR\n      Double oh noes\n    \nWARN\n      Maybeh oh noes?\n    \nERROR\n      Oh noes\n    \nTo query the snapshots, all you need is to use the $ operator appended to the\nend of the table name, and add the hidden table, snapshots:\n\nSELECT snapshot_id, parent_id, operation\nFROM iceberg.logging.“events$snapshots”;\n\n\nResult:\nsnapshot_id\n      parent_id\n      operation\n    \n7620328658793169607\n       \n      append\n    \n2115743741823353537\n      7620328658793169607\n      append\n    \nLet’s take a look at the manifest list files that are associated with each \nsnapshot ID. You can tell which file belongs to which snapshot based on the \nsnapshot ID embedded in the filename:\n\nSELECT manifest_list\nFROM iceberg.logging.“events$snapshots”;\n\n\nResult:\nshapshots\n    \ns3a://iceberg/logging.db/events/metadata/snap-7620328658793169607-1-cc857d89-1c07-4087-bdbc-2144a814dae2.avro\n    \ns3a://iceberg/logging.db/events/metadata/snap-2115743741823353537-1-4cb458be-7152-4e99-8db7-b2dda52c556c.avro\n    \nNow, let’s insert another row to the table:\n\nINSERT INTO iceberg.logging.events\nVALUES\n(\n‘INFO’,\ntimestamp ‘2021-04-02 00:00:11.1122222’,\n‘It is all good’,\nARRAY [‘Just updating you!’]\n);\n\n\nLet’s check the snapshot table again:\n\nSELECT snapshot_id, parent_id, operation\nFROM iceberg.logging.“events$snapshots”;\n\n\nResult:\nsnapshot_id\n      parent_id\n      operation\n    \n7620328658793169607\n       \n      append\n    \n2115743741823353537\n      7620328658793169607\n      append\n    \n7030511368881343137\n      2115743741823353537\n      append\n    \nLet’s also verify that our row was added:\n\nSELECT level, message\nFROM iceberg.logging.events;\n\n\nResult:\nlevel\n      message\n    \nERROR\n      Oh noes\n    \nINFO\n      It is all good\n    \nERROR\n      Double oh noes\n    \nWARN\n      Maybeh oh noes?\n    \nSince Iceberg is already tracking the list of files added and removed at each\nsnapshot, it would make sense that you can travel back and forth between these\ndifferent views into the system, right? This concept is called time traveling.\nYou need to specify which snapshot you would like to read from and you will see\nthe view of the data at that timestamp. In Trino, you need to use the @\noperator, followed by the snapshot you wish to read from:\n\nSELECT level, message\nFROM iceberg.logging.“events@2115743741823353537”;\n\n\nResult:\nlevel\n      message\n    \nERROR\n      Double oh noes\n    \nWARN\n      Maybeh oh noes?\n    \nERROR\n      Oh noes\n    \nIf you determine there is some issue with your data, you can always roll back to\nthe previous state permanently as well. In Trino we have a function called\nrollback_to_snapshot to move the table state to another snapshot:\n\nCALL system.rollback_to_snapshot(‘logging’, ‘events’, 2115743741823353537);\n\n\nNow that we have rolled back, observe what happens when we query the events\ntable with:\n\nSELECT level, message\nFROM iceberg.logging.events;\n\n\nResult:\nlevel\n      message\n    \nERROR\n      Double oh noes\n    \nWARN\n      Maybeh oh noes?\n    \nERROR\n      Oh noes\n    \nNotice the INFO row is still missing even though we query the table without\nspecifying a snapshot id. Now just because we rolled back, doesn’t mean we’ve\nlost the snapshot we just rolled back from. In fact, we can roll forward, or as\nI like to call it, \nback to the future! In\nTrino, you use the same function call but with a predecessor of the existing\nsnapshot:\n\nCALL system.rollback_to_snapshot(‘logging’, ‘events’, 7030511368881343137)\n\n\nAnd now we should be able to query the table again and see the INFO row \nreturn:\n\nSELECT level, message\nFROM iceberg.logging.events;\n\n\nResult:\nlevel\n      message\n    \nERROR\n      Oh noes\n    \nINFO\n      It is all good\n    \nERROR\n      Double oh noes\n    \nWARN\n      Maybeh oh noes?\n    \nAs expected, the INFO row returns when you roll back to the future.\nHaving snapshots not only provides you with a level of immutability that is key\nto the eventual consistency model, but gives you a rich set of features to\nversion and move between different versions of your data like a git repository.\nIceberg Specification\nPerhaps saving the best for last, the benefit of using Iceberg is the community\nthat surrounds it, and the support you receive. It can be daunting to have to\nchoose a project that replaces something so core to your architecture. While\nHive has so many drawbacks, one of the things keeping many companies locked in\nis the fear of the unknown. How do you know which table format to choose? Are\nthere unknown data corruption issues that I’m about to take on? What if this\ndoesn’t scale like it promises on the label? It is worth noting that \nalternative table formats are also emerging in this space \nand we encourage you to investigate these for your own use cases. When sitting\ndown with Iceberg creator, Ryan Blue, \ncomparing Iceberg to other table formats, \nhe claims the community’s greatest strength is their ability to look forward.\nThey intentionally broke compatibility with Hive to enable them to provide a\nricher level of features. Unlike Hive, the Iceberg project explained their\nthinking in a spec.\nThe strongest argument I can see for Iceberg is that it has a \nspecification. This is something that has\nlargely been missing from Hive and shows a real maturity in how the Iceberg\ncommunity has approached the issue. On the Trino project, we think standards are\nimportant. We adhere to many of them ourselves, such as the ANSI SQL syntax, and\nexposing the client through a JDBC connection. By creating a standard around\nthis, you’re no longer tied to any particular technology, not even Iceberg\nitself. You are adhering to a standard that will hopefully become the de facto\nstandard over a decade or two, much like Hive did. Having the standard in clear\nwriting invites multiple communities to the table and brings even more use \ncases. Doing so improves the standards and therefore the technologies that\nimplement them.\nThe previous three blog posts of this series covered the features and massive\nbenefits from using this novel table format. The following post will dive deeper\nand discuss more about how Iceberg achieves some of this functionality, with an\noverview into some of the internals and metadata layouts. In the meantime, feel\nfree to try \nTrino on Ice(berg)."
author: "Brian Olsen"
contentHtml: "<div>\n<article>\n  <div><p>\n <img src=\"https://www.starburst.io/assets/blog/trino-on-ice/trino-iceberg.png\">\n</p>\n<p>Welcome to the Trino on ice series, covering the details around how the Iceberg\ntable format works with the Trino query engine. The examples build on each\nprevious post, so it’s recommended to read the posts sequentially and reference\nthem as needed later. Here are links to the posts in this series:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/05/03/a-gentle-introduction-to-iceberg\">Trino on ice I: A gentle introduction to Iceberg</a></li>\n  <li><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/07/12/in-place-table-evolution-and-cloud-compatibility-with-iceberg\">Trino on ice II: In-place table evolution and cloud compatibility with Iceberg</a></li>\n  <li><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/07/30/iceberg-concurrency-snapshots-spec\">Trino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec</a></li>\n  <li><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/08/12/deep-dive-into-iceberg-internals\">Trino on ice IV: Deep dive into Iceberg internals</a></li>\n</ul>\n<p>In the last two blog posts, we’ve covered a lot of cool feature improvements of\nIceberg over the Hive model. I recommend you take a look at those if you haven’t\nyet. We introduced concepts and issues that table formats address. This blog \ncloses up the overview of Iceberg features by discussing the concurrency model\nIceberg uses to ensure data integrity, how to use snapshots via Trino, and the\n<a target=\"_blank\" href=\"https://iceberg.apache.org/spec/\">Iceberg Specification</a>.</p>\n<!--more-->\n<p>Some issues with the Hive model are the distinct locations where the metadata is\nstored and where the data files are stored. Having your data and metadata split\nup like this is a recipe for disaster when trying to apply updates to both\nservices atomically.</p>\n<p><img src=\"https://www.starburst.io/assets/blog/trino-on-ice/iceberg-metadata.png\" alt=\"Iceberg metadata diagram of runtime, and file storage\"></p>\n<p>A very common problem with Hive is that if a writing process failed during\ninsertion, many times you would find the data written to file storage, but the\nmetastore writes failed to occur. Or conversely, the metastore writes were\nsuccessful, but the data failed to finish writing to file storage due to a \nnetwork or file IO failure. There’s a good \n<a target=\"_blank\" href=\"https://trino.io/episodes/5\">Trino Community Broadcast episode</a> that talks\nabout a function in Trino that exists to resolve these issues by syncing the\nmetastore and file storage. You can watch \n<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=OXyJFZSsX5w&t=2097s\">a simulation of this error</a>\non that episode.</p>\n<p>Aside from having issues due to the split state in the system, there are many \nother issues that stem from the file system itself. In the case of HDFS, \ndepending on the specific filesystem implementation you are using, you may have\n<a target=\"_blank\" href=\"https://hadoop.apache.org/docs/stable/hadoop-project-dist/hadoop-common/filesystem/introduction.html#Core_Expectations_of_a_Hadoop_Compatible_FileSystem\">different atomicity guarantees for various file systems and their operations</a>,\nsuch as creating, deleting, and renaming files and directories. HDFS isn’t the\nonly troublemaker here. Other than Amazon S3’s \n<a target=\"_blank\" href=\"https://aws.amazon.com/about-aws/whats-new/2020/12/amazon-s3-now-delivers-strong-read-after-write-consistency-automatically-for-all-applications/\">recent announcement of strong consistency in their S3 service,</a>\nmost object storage systems only offer <em>eventual</em> consistency that may not show\nthe latest files immediately after writes. Despite storage systems showing more\nprogress towards offering better performance and guarantees, these systems still\noffer no reliable locking mechanism.</p>\n<p>Iceberg addresses all of these issues in a multitude of ways. One of the primary\nways Iceberg introduces transactional guarantees is by storing the metadata in\nthe same datastore as the data itself. This simplifies handling commit failures\ndown to rolling back on one system rather than trying to coordinate a rollback\nacross two systems like in Hive. Writers independently write their metadata and\nattempt to perform their operations, needing no coordination with other writers.\nThe only time the writers coordinate is when they attempt to perform a commit of\ntheir operations. In order to do a commit, they perform a lock of the current\nsnapshot record in a database. This concurrency model where writers eagerly do\nthe work upfront is called <strong><em>optimistic concurrency control</em></strong>.</p>\n<p>Currently, in Trino, this method still uses the Hive metastore to perform the\nlock-and-swap operation necessary to coordinate the final commits. Iceberg \ncreator, <a target=\"_blank\" href=\"https://www.linkedin.com/in/rdblue/\">Ryan Blue</a>, \n<a target=\"_blank\" href=\"https://youtu.be/-iIY2sOFBRc?t=1351\">covers this lock-and-swap mechanism</a> and\nhow the metastore can be replaced with alternate locking methods. In the event\nthat <a target=\"_blank\" href=\"https://iceberg.apache.org/reliability/#concurrent-write-operations\">two writers attempt to commit at the same time</a>,\nthe writer that first acquires the lock successfully commits by swapping its\nsnapshot as the current snapshot, while the second writer will retry to apply\nits changes again. The second writer should have no problem with this, assuming\nthere are no conflicting changes between the two snapshots.</p>\n<p><img src=\"https://www.starburst.io/assets/blog/trino-on-ice/iceberg-files.png\" alt=\"\"></p>\n<p>This works similarly to a git workflow where the main branch is the locked\nresource, and two developers try to commit their changes at the same time. The\nfirst developer’s changes may conflict with the second developer’s changes. The\nsecond developer is then forced to rebase or merge the first developer’s code\nwith their changes before commiting to the main branch again. The same logic\napplies to merging data files. Currently, Iceberg clients use a\n<a target=\"_blank\" href=\"https://iceberg.apache.org/reliability/#concurrent-write-operations\">copy-on-write mechanism</a>\nthat makes a new file out of the merged data in the next snapshot. This enables\naccurate time traveling and preserves previous split versions of the files. At\nthe time of writing, upserts via <code>MERGE INTO</code> syntax are not supported in Trino,\nbut \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues/7708\">this is in active development</a>.\n<strong><em>UPDATE:</em></strong> Since the original writing of this post, the \n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/7933\"><code>MERGE</code> syntax exists as of version 393</a>.</p>\n<p>One of the great benefits of tracking each individual change that gets written\nto Iceberg is that you are given a view of the data at every point in time. This\nenables a really cool feature that I mentioned earlier called <strong><em>time travel</em></strong>.</p>\n<h2 id=\"snapshots-and-time-travel\">\n    Snapshots and Time Travel <a target=\"_blank\" href=\"https://www.starburst.io/blog/trino-on-ice-iii-iceberg-concurrency-model-snapshots-and-the-iceberg-spec/#snapshots-and-time-travel\">#</a>\n</h2>\n<p>To showcase snapshots, it’s best to go over a few examples drawing from the\nevent table we \n<a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/05/03/a-gentle-introduction-to-iceberg\">created in the previous blog posts</a>.\nThis time we’ll only be working with the Iceberg table, as this capability is\nnot available in Hive. Snapshots allow you to have an immutable set of your data\nat a given time. They are automatically created on every append or removal of\ndata. One thing to note is that for now, they do not store the state of your\nmetadata.</p>\n<p>Say that you have created your events table and inserted the three initial rows\nas we did previously. Let’s look at the data we get back and see how to check\nthe existing snapshots in Trino:</p>\n<div><pre><code>SELECT level, message\nFROM iceberg.logging.events;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>level</th>\n      <th>message</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ERROR</td>\n      <td>Double oh noes</td>\n    </tr>\n    <tr>\n      <td>WARN</td>\n      <td>Maybeh oh noes?</td>\n    </tr>\n    <tr>\n      <td>ERROR</td>\n      <td>Oh noes</td>\n    </tr>\n  </tbody>\n</table>\n<p>To query the snapshots, all you need is to use the $ operator appended to the\nend of the table name, and add the hidden table, <code>snapshots</code>:</p>\n<div><pre><code>SELECT snapshot_id, parent_id, operation\nFROM iceberg.logging.“events$snapshots”;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>snapshot_id</th>\n      <th>parent_id</th>\n      <th>operation</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>7620328658793169607</td>\n      <td>&#160;</td>\n      <td>append</td>\n    </tr>\n    <tr>\n      <td>2115743741823353537</td>\n      <td>7620328658793169607</td>\n      <td>append</td>\n    </tr>\n  </tbody>\n</table>\n<p>Let’s take a look at the manifest list files that are associated with each \nsnapshot ID. You can tell which file belongs to which snapshot based on the \nsnapshot ID embedded in the filename:</p>\n<div><pre><code>SELECT manifest_list\nFROM iceberg.logging.“events$snapshots”;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>shapshots</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>s3a://iceberg/logging.db/events/metadata/snap-7620328658793169607-1-cc857d89-1c07-4087-bdbc-2144a814dae2.avro</td>\n    </tr>\n    <tr>\n      <td>s3a://iceberg/logging.db/events/metadata/snap-2115743741823353537-1-4cb458be-7152-4e99-8db7-b2dda52c556c.avro</td>\n    </tr>\n  </tbody>\n</table>\n<p>Now, let’s insert another row to the table:</p>\n<div><pre><code>INSERT INTO iceberg.logging.events\nVALUES\n(\n‘INFO’,\ntimestamp ‘2021-04-02 00:00:11.1122222’,\n‘It is all good’,\nARRAY [‘Just updating you!’]\n);\n</code></pre></div>\n<p>Let’s check the snapshot table again:</p>\n<div><pre><code>SELECT snapshot_id, parent_id, operation\nFROM iceberg.logging.“events$snapshots”;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>snapshot_id</th>\n      <th>parent_id</th>\n      <th>operation</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>7620328658793169607</td>\n      <td>&#160;</td>\n      <td>append</td>\n    </tr>\n    <tr>\n      <td>2115743741823353537</td>\n      <td>7620328658793169607</td>\n      <td>append</td>\n    </tr>\n    <tr>\n      <td>7030511368881343137</td>\n      <td>2115743741823353537</td>\n      <td>append</td>\n    </tr>\n  </tbody>\n</table>\n<p>Let’s also verify that our row was added:</p>\n<div><pre><code>SELECT level, message\nFROM iceberg.logging.events;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>level</th>\n      <th>message</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ERROR</td>\n      <td>Oh noes</td>\n    </tr>\n    <tr>\n      <td>INFO</td>\n      <td>It is all good</td>\n    </tr>\n    <tr>\n      <td>ERROR</td>\n      <td>Double oh noes</td>\n    </tr>\n    <tr>\n      <td>WARN</td>\n      <td>Maybeh oh noes?</td>\n    </tr>\n  </tbody>\n</table>\n<p>Since Iceberg is already tracking the list of files added and removed at each\nsnapshot, it would make sense that you can travel back and forth between these\ndifferent views into the system, right? This concept is called time traveling.\nYou need to specify which snapshot you would like to read from and you will see\nthe view of the data at that timestamp. In Trino, you need to use the <code>@</code>\noperator, followed by the snapshot you wish to read from:</p>\n<div><pre><code>SELECT level, message\nFROM iceberg.logging.“events@2115743741823353537”;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>level</th>\n      <th>message</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ERROR</td>\n      <td>Double oh noes</td>\n    </tr>\n    <tr>\n      <td>WARN</td>\n      <td>Maybeh oh noes?</td>\n    </tr>\n    <tr>\n      <td>ERROR</td>\n      <td>Oh noes</td>\n    </tr>\n  </tbody>\n</table>\n<p>If you determine there is some issue with your data, you can always roll back to\nthe previous state permanently as well. In Trino we have a function called\n<code>rollback_to_snapshot</code> to move the table state to another snapshot:</p>\n<div><pre><code>CALL system.rollback_to_snapshot(‘logging’, ‘events’, 2115743741823353537);\n</code></pre></div>\n<p>Now that we have rolled back, observe what happens when we query the events\ntable with:</p>\n<div><pre><code>SELECT level, message\nFROM iceberg.logging.events;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>level</th>\n      <th>message</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ERROR</td>\n      <td>Double oh noes</td>\n    </tr>\n    <tr>\n      <td>WARN</td>\n      <td>Maybeh oh noes?</td>\n    </tr>\n    <tr>\n      <td>ERROR</td>\n      <td>Oh noes</td>\n    </tr>\n  </tbody>\n</table>\n<p>Notice the <code>INFO</code> row is still missing even though we query the table without\nspecifying a snapshot id. Now just because we rolled back, doesn’t mean we’ve\nlost the snapshot we just rolled back from. In fact, we can roll forward, or as\nI like to call it, \n<a target=\"_blank\" href=\"https://en.wikipedia.org/wiki/Back_to_the_Future\">back to the future</a>! In\nTrino, you use the same function call but with a predecessor of the existing\nsnapshot:</p>\n<div><pre><code>CALL system.rollback_to_snapshot(‘logging’, ‘events’, 7030511368881343137)\n</code></pre></div>\n<p>And now we should be able to query the table again and see the <code>INFO</code> row \nreturn:</p>\n<div><pre><code>SELECT level, message\nFROM iceberg.logging.events;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>level</th>\n      <th>message</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>ERROR</td>\n      <td>Oh noes</td>\n    </tr>\n    <tr>\n      <td>INFO</td>\n      <td>It is all good</td>\n    </tr>\n    <tr>\n      <td>ERROR</td>\n      <td>Double oh noes</td>\n    </tr>\n    <tr>\n      <td>WARN</td>\n      <td>Maybeh oh noes?</td>\n    </tr>\n  </tbody>\n</table>\n<p>As expected, the INFO row returns when you roll back to the future.</p>\n<p>Having snapshots not only provides you with a level of immutability that is key\nto the eventual consistency model, but gives you a rich set of features to\nversion and move between different versions of your data like a git repository.</p>\n<h2 id=\"iceberg-specification\">\n    Iceberg Specification <a target=\"_blank\" href=\"https://www.starburst.io/blog/trino-on-ice-iii-iceberg-concurrency-model-snapshots-and-the-iceberg-spec/#iceberg-specification\">#</a>\n</h2>\n<p>Perhaps saving the best for last, the benefit of using Iceberg is the community\nthat surrounds it, and the support you receive. It can be daunting to have to\nchoose a project that replaces something so core to your architecture. While\nHive has so many drawbacks, one of the things keeping many companies locked in\nis the fear of the unknown. How do you know which table format to choose? Are\nthere unknown data corruption issues that I’m about to take on? What if this\ndoesn’t scale like it promises on the label? It is worth noting that \n<a target=\"_blank\" href=\"https://lakefs.io/hudi-iceberg-and-delta-lake-data-lake-table-formats-compared/\">alternative table formats are also emerging in this space</a> \nand we encourage you to investigate these for your own use cases. When sitting\ndown with Iceberg creator, Ryan Blue, \n<a target=\"_blank\" href=\"https://www.twitch.tv/videos/989098630\">comparing Iceberg to other table formats</a>, \nhe claims the community’s greatest strength is their ability to look forward.\nThey intentionally broke compatibility with Hive to enable them to provide a\nricher level of features. Unlike Hive, the Iceberg project explained their\nthinking in a spec.</p>\n<p>The strongest argument I can see for Iceberg is that it has a \n<a target=\"_blank\" href=\"https://iceberg.apache.org/spec/\">specification</a>. This is something that has\nlargely been missing from Hive and shows a real maturity in how the Iceberg\ncommunity has approached the issue. On the Trino project, we think standards are\nimportant. We adhere to many of them ourselves, such as the ANSI SQL syntax, and\nexposing the client through a JDBC connection. By creating a standard around\nthis, you’re no longer tied to any particular technology, not even Iceberg\nitself. You are adhering to a standard that will hopefully become the de facto\nstandard over a decade or two, much like Hive did. Having the standard in clear\nwriting invites multiple communities to the table and brings even more use \ncases. Doing so improves the standards and therefore the technologies that\nimplement them.</p>\n<p>The previous three blog posts of this series covered the features and massive\nbenefits from using this novel table format. The following post will dive deeper\nand discuss more about how Iceberg achieves some of this functionality, with an\noverview into some of the internals and metadata layouts. In the meantime, feel\nfree to try \n<a target=\"_blank\" href=\"https://github.com/bitsondatadev/trino-getting-started/tree/main/iceberg/trino-iceberg-minio\">Trino on Ice(berg)</a>.</p>\n  </div>\n</article>\n</div>"
---

Welcome to the Trino on ice series, covering the details around how the Iceberg
table format works with the Trino query engine. The examples build on each
previous post, so it’s recommended to read the posts sequentially and reference
them as needed later. Here are links to the posts in this series:
Trino on ice I: A gentle introduction to Iceberg
Trino on ice II: In-place table evolution and cloud compatibility with Iceberg
Trino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec
Trino on ice IV: Deep dive into Iceberg internals
In the last two blog posts, we’ve covered a lot of cool feature improvements of
Iceberg over the Hive model. I recommend you take a look at those if you haven’t
yet. We introduced concepts and issues that table formats address. This blog 
closes up the overview of Iceberg features by discussing the concurrency model
Iceberg uses to ensure data integrity, how to use snapshots via Trino, and the
Iceberg Specification.
Concurrency Model
Some issues with the Hive model are the distinct locations where the metadata is
stored and where the data files are stored. Having your data and metadata split
up like this is a recipe for disaster when trying to apply updates to both
services atomically.

A very common problem with Hive is that if a writing process failed during
insertion, many times you would find the data written to file storage, but the
metastore writes failed to occur. Or conversely, the metastore writes were
successful, but the data failed to finish writing to file storage due to a 
network or file IO failure. There’s a good 
Trino Community Broadcast episode that talks
about a function in Trino that exists to resolve these issues by syncing the
metastore and file storage. You can watch 
a simulation of this error
on that episode.
Aside from having issues due to the split state in the system, there are many 
other issues that stem from the file system itself. In the case of HDFS, 
depending on the specific filesystem implementation you are using, you may have
different atomicity guarantees for various file systems and their operations,
such as creating, deleting, and renaming files and directories. HDFS isn’t the
only troublemaker here. Other than Amazon S3’s 
recent announcement of strong consistency in their S3 service,
most object storage systems only offer eventual consistency that may not show
the latest files immediately after writes. Despite storage systems showing more
progress towards offering better performance and guarantees, these systems still
offer no reliable locking mechanism.
Iceberg addresses all of these issues in a multitude of ways. One of the primary
ways Iceberg introduces transactional guarantees is by storing the metadata in
the same datastore as the data itself. This simplifies handling commit failures
down to rolling back on one system rather than trying to coordinate a rollback
across two systems like in Hive. Writers independently write their metadata and
attempt to perform their operations, needing no coordination with other writers.
The only time the writers coordinate is when they attempt to perform a commit of
their operations. In order to do a commit, they perform a lock of the current
snapshot record in a database. This concurrency model where writers eagerly do
the work upfront is called optimistic concurrency control.
Currently, in Trino, this method still uses the Hive metastore to perform the
lock-and-swap operation necessary to coordinate the final commits. Iceberg 
creator, Ryan Blue, 
covers this lock-and-swap mechanism and
how the metastore can be replaced with alternate locking methods. In the event
that two writers attempt to commit at the same time,
the writer that first acquires the lock successfully commits by swapping its
snapshot as the current snapshot, while the second writer will retry to apply
its changes again. The second writer should have no problem with this, assuming
there are no conflicting changes between the two snapshots.

This works similarly to a git workflow where the main branch is the locked
resource, and two developers try to commit their changes at the same time. The
first developer’s changes may conflict with the second developer’s changes. The
second developer is then forced to rebase or merge the first developer’s code
with their changes before commiting to the main branch again. The same logic
applies to merging data files. Currently, Iceberg clients use a
copy-on-write mechanism
that makes a new file out of the merged data in the next snapshot. This enables
accurate time traveling and preserves previous split versions of the files. At
the time of writing, upserts via MERGE INTO syntax are not supported in Trino,
but 
this is in active development.
UPDATE: Since the original writing of this post, the 
MERGE syntax exists as of version 393.
One of the great benefits of tracking each individual change that gets written
to Iceberg is that you are given a view of the data at every point in time. This
enables a really cool feature that I mentioned earlier called time travel.
Snapshots and Time Travel
To showcase snapshots, it’s best to go over a few examples drawing from the
event table we 
created in the previous blog posts.
This time we’ll only be working with the Iceberg table, as this capability is
not available in Hive. Snapshots allow you to have an immutable set of your data
at a given time. They are automatically created on every append or removal of
data. One thing to note is that for now, they do not store the state of your
metadata.
Say that you have created your events table and inserted the three initial rows
as we did previously. Let’s look at the data we get back and see how to check
the existing snapshots in Trino:

SELECT level, message
FROM iceberg.logging.events;


Result:
level
      message
    
ERROR
      Double oh noes
    
WARN
      Maybeh oh noes?
    
ERROR
      Oh noes
    
To query the snapshots, all you need is to use the $ operator appended to the
end of the table name, and add the hidden table, snapshots:

SELECT snapshot_id, parent_id, operation
FROM iceberg.logging.“events$snapshots”;


Result:
snapshot_id
      parent_id
      operation
    
7620328658793169607
       
      append
    
2115743741823353537
      7620328658793169607
      append
    
Let’s take a look at the manifest list files that are associated with each 
snapshot ID. You can tell which file belongs to which snapshot based on the 
snapshot ID embedded in the filename:

SELECT manifest_list
FROM iceberg.logging.“events$snapshots”;


Result:
shapshots
    
s3a://iceberg/logging.db/events/metadata/snap-7620328658793169607-1-cc857d89-1c07-4087-bdbc-2144a814dae2.avro
    
s3a://iceberg/logging.db/events/metadata/snap-2115743741823353537-1-4cb458be-7152-4e99-8db7-b2dda52c556c.avro
    
Now, let’s insert another row to the table:

INSERT INTO iceberg.logging.events
VALUES
(
‘INFO’,
timestamp ‘2021-04-02 00:00:11.1122222’,
‘It is all good’,
ARRAY [‘Just updating you!’]
);


Let’s check the snapshot table again:

SELECT snapshot_id, parent_id, operation
FROM iceberg.logging.“events$snapshots”;


Result:
snapshot_id
      parent_id
      operation
    
7620328658793169607
       
      append
    
2115743741823353537
      7620328658793169607
      append
    
7030511368881343137
      2115743741823353537
      append
    
Let’s also verify that our row was added:

SELECT level, message
FROM iceberg.logging.events;


Result:
level
      message
    
ERROR
      Oh noes
    
INFO
      It is all good
    
ERROR
      Double oh noes
    
WARN
      Maybeh oh noes?
    
Since Iceberg is already tracking the list of files added and removed at each
snapshot, it would make sense that you can travel back and forth between these
different views into the system, right? This concept is called time traveling.
You need to specify which snapshot you would like to read from and you will see
the view of the data at that timestamp. In Trino, you need to use the @
operator, followed by the snapshot you wish to read from:

SELECT level, message
FROM iceberg.logging.“events@2115743741823353537”;


Result:
level
      message
    
ERROR
      Double oh noes
    
WARN
      Maybeh oh noes?
    
ERROR
      Oh noes
    
If you determine there is some issue with your data, you can always roll back to
the previous state permanently as well. In Trino we have a function called
rollback_to_snapshot to move the table state to another snapshot:

CALL system.rollback_to_snapshot(‘logging’, ‘events’, 2115743741823353537);


Now that we have rolled back, observe what happens when we query the events
table with:

SELECT level, message
FROM iceberg.logging.events;


Result:
level
      message
    
ERROR
      Double oh noes
    
WARN
      Maybeh oh noes?
    
ERROR
      Oh noes
    
Notice the INFO row is still missing even though we query the table without
specifying a snapshot id. Now just because we rolled back, doesn’t mean we’ve
lost the snapshot we just rolled back from. In fact, we can roll forward, or as
I like to call it, 
back to the future! In
Trino, you use the same function call but with a predecessor of the existing
snapshot:

CALL system.rollback_to_snapshot(‘logging’, ‘events’, 7030511368881343137)


And now we should be able to query the table again and see the INFO row 
return:

SELECT level, message
FROM iceberg.logging.events;


Result:
level
      message
    
ERROR
      Oh noes
    
INFO
      It is all good
    
ERROR
      Double oh noes
    
WARN
      Maybeh oh noes?
    
As expected, the INFO row returns when you roll back to the future.
Having snapshots not only provides you with a level of immutability that is key
to the eventual consistency model, but gives you a rich set of features to
version and move between different versions of your data like a git repository.
Iceberg Specification
Perhaps saving the best for last, the benefit of using Iceberg is the community
that surrounds it, and the support you receive. It can be daunting to have to
choose a project that replaces something so core to your architecture. While
Hive has so many drawbacks, one of the things keeping many companies locked in
is the fear of the unknown. How do you know which table format to choose? Are
there unknown data corruption issues that I’m about to take on? What if this
doesn’t scale like it promises on the label? It is worth noting that 
alternative table formats are also emerging in this space 
and we encourage you to investigate these for your own use cases. When sitting
down with Iceberg creator, Ryan Blue, 
comparing Iceberg to other table formats, 
he claims the community’s greatest strength is their ability to look forward.
They intentionally broke compatibility with Hive to enable them to provide a
richer level of features. Unlike Hive, the Iceberg project explained their
thinking in a spec.
The strongest argument I can see for Iceberg is that it has a 
specification. This is something that has
largely been missing from Hive and shows a real maturity in how the Iceberg
community has approached the issue. On the Trino project, we think standards are
important. We adhere to many of them ourselves, such as the ANSI SQL syntax, and
exposing the client through a JDBC connection. By creating a standard around
this, you’re no longer tied to any particular technology, not even Iceberg
itself. You are adhering to a standard that will hopefully become the de facto
standard over a decade or two, much like Hive did. Having the standard in clear
writing invites multiple communities to the table and brings even more use 
cases. Doing so improves the standards and therefore the technologies that
implement them.
The previous three blog posts of this series covered the features and massive
benefits from using this novel table format. The following post will dive deeper
and discuss more about how Iceberg achieves some of this functionality, with an
overview into some of the internals and metadata layouts. In the meantime, feel
free to try 
Trino on Ice(berg).
