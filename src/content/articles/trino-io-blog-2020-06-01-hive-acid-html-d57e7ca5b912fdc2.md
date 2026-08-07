---
title: "Hive ACID and transactional tables' support in Presto"
link: "https://trino.io/blog/2020/06/01/hive-acid.html"
guid: "https://trino.io/blog/2020/06/01/hive-acid.html"
pubDate: "2020-06-01T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Hive ACID and transactional tables are supported in Presto since the 331\nrelease. Hive ACID support is an important step towards GDPR/CCPA compliance,\nand also towards Hive 3 support as certain distributions\nof Hive 3 create transactional tables by default.\nIn this blog post we cover the concepts of Hive ACID and transactional\ntables along with the changes done in Presto to support them. We also cover the\nperformance tests on this integration and look at the future plans for this\nfeature.\nHow to use Hive ACID and transactional tables in Presto\nHive transactional tables are readable in Presto without any need to tweak\nconfigs, you only need to take care of these requirements:\nUse Presto version 331 or higher\nUse Hive 3 Metastore Server. Presto does not support Hive transactional\ntables created with Hive before version 3.\nNote that Presto cannot create or write to Hive transactional tables yet. You\ncan create and write to Hive transactional tables via\nHive\nor via Spark with Hive ACID Data Source plugin and\nuse Presto to read these tables.\nWhat is Hive ACID and Hive transactional tables\nHive transactional tables are the tables in Hive that provide ACID semantics.\nThis excerpt from\nHive documentation\ncovers ACID traits well:\n“ACID stands for four traits of database transactions:\nAtomicity (an operation either succeeds completely or fails,\nit does not leave partial data), Consistency (once an application performs an\noperation the results of that operation are visible to it in every subsequent\noperation), Isolation (an incomplete operation by one user does not cause\nunexpected side effects for other users), and Durability (once an operation is\ncomplete it will be preserved even in the face of machine or system failure).\nThese traits have long been expected of database systems as part of their\ntransaction functionality.“\nNeed for Hive ACID and transactional tables\nIn any organisation, there is always a need to update or delete existing entries\nin tables e.g., a user writes or updates the review for an item purchased a\nweek back or a transaction status is changed after a day, etc..\nWith regulations like GDPR/CCPA updates/deletes become even more frequent as the\nusers can ask the organisation to delete the data on them, and organisations are\nobligated to fulfill these requests.\nThe standard practice to update data has been to overwrite the partition or\ntable with the updated data but this is inefficient and unreliable. It takes a\nlot of resources to overwrite all of the existing data to update a few entries,\nbut more importantly there are issues around isolation when reads on old data\nare going on and the overwrite starts deleting that data. To solve these issues\nseveral solutions have been developed, many of them are covered\nin this blog post,\nand Hive ACID is one of them.\nConcepts of Hive ACID and transactional tables\nSeveral concepts like transactions, WriteIds, deltas, locks, etc. are added in\nHive to achieve ACID semantics. To understand the changes done in Presto to\nsupport Hive ACID and transactional tables, covered in the next section, it is\nimportant to understand these concepts first. So let’s look at them in detail.\nTypes of Hive transactional tables\nThere are two types of Hive transactional tables: Insert-Only transactional\ntables and CRUD transactional tables.\nFollowing table compares the two:\nType of transactional table\n      Hive DML Operations Supported\n      Input Formats supported\n      Synthetic columns in file?\n      Additional Table Properties\n    \nInsert-Only Transactional Tables\n      INSERT\n      All input formats\n      No\n      'transactional'='true', 'transactional_properties'='insert_only'\n    \nCRUD Transactional Tables\n      INSERT, UPDATE, DELETE\n      ORC\n      Yes\n      'transactional'='true'\n    \nHive Transactions\nHive transactional tables should be accessed under Hive Transactions only. Note that\nthese transactions are different from Presto transactions and are managed by\nHive. Running DML queries under separate transactions helps in atomicity. Each\ntransaction is independent and when rolled back will not have any impact on the\nstate of the table.\nWriteIds\nDML queries under a transaction write to a unique location under partition/table\ndescribed in detail later in “New Sub-Directories” section. This location is derived\nby WriteId allocated to the transaction. This provides Isolation of DML queries\nand such queries can run in parallel, whenever they can, without interfering\nwith each other.\nValid WriteIds\nRead queries under a transaction get a list of valid WriteIds that belong to the\ntransactions which were successfully committed. This ensures Consistency by\nmaking results of committed transactions available to all the future\ntransactions and also provides Isolation as DML and read queries can run in\nparallel with read queries not reading partial data written by DML queries.\nNew Sub-Directories\nResults of a DML queries are written to a unique location derived from WriteId\nof the transaction. These unique locations are delta directories under\npartition/table location. Apart from the WriteId, this unique location is made\nup of the DML operation and depending on the operation type there can be two\ntypes of delta directories:\nDelete Delta Directory: This delta directory is created for results of\nDELETE statements and is named delete_delta_<writeId>_<writeId> under\npartition/table location.\nDelta Directory: This type is created for the results of INSERT statements\nand is named delta_<writeId>_<writeId> under partition/table location.\nApart from delta directories, there is another sub-directory that is now added\ncalled “Base directory” and is named as base_<writeId> under partition/table\nlocation. This type of directory is created by INSERT OVERWRITE TABLE query or\nby major compaction which is described later.\nThe following animation shows how these new sub-directories are created in the\nfilesystem along with transaction management at metastore with different\nqueries:\n\nRowID\nTo uniquely identify each row in the table, a synthetic rowId is created and\nadded to each row. RowIds are added to CRUD transactional tables only because it\nis used in case of DELETE statements only. When a DELETE is performed, the\nrowIds of the rows that it would delete are written into the delete_delta\ndirectory and subsequents reads will read all but these rows.\nRowId is made of 5 entries today: operation, originalTransaction, bucket,\nrowId, currentTransaction but operation and currentTransaction fields\nare redundant now.\nRowId is added in the root STRUCT of ORC and hence the schema of ORC files is\ndifferent from the schema defined in the table, e.g.:\nSchema of CRUD transactional Hive Table:\n\nn_nationkey : int,\nn_name : string,\nn_regionkey : int,\nn_comment : string\n\n\nSchema of ORC file for this table:\n\nstruct {\n    operation : int,\n    originalTransaction : bigint,\n    bucket : int,\n    rowId : bigint,\n    currentTransaction : bigint,\n    row : struct {\n        n_nationkey : int,\n        n_name : string,\n        n_regionkey : int,\n        n_comment : string\n    }\n}\n\n\nNote that one level of nesting of table schema, like the inner struct above, is\napplicable to flat Hive tables too. The two level nesting of data columns is\nadded for Orc files of CRUD transactional tables to keep rowId columns isolated\nfrom data columns.\nCompactions\nThe working described above with delta and delete_delta directories for each\ntransaction makes the DML queries execute fast but have\nthe following impact on read queries:\nMany delta directories with small data in each directory will slow down\nexecution of read queries. This is a known problem around\nsmall files where engines end up spending more time opening files than actually\nprocessing the data.\nCross referencing all delete_delta directories to remove all deleted rows\nslows down the reads.\nTo solve these problems, Hive compacts delta directories asynchronously at two\nlevels:\nMinor Compaction: This compaction combines active delta directories into one\ndelta directory and active delete_delta directories into one delete_delta\ndirectory thereby decreasing the number of small files. Limiting scope of this\ncompaction to combining only delta directories keeps it fast. Minor compaction\nis automatically triggered as soon as active delta directories count reaches\n10 (configurable). This compaction creates new delta directories like\ndelta_<start_write_id>_<end_write_id> where [start_write_id, end_write_id]\ngives the range of existing delta directories that we compacted. Similar naming\nconvention is used for delete_delta directory.\nMajor Compaction: Minor compaction does not work on merging base, delta and\ndelete_delta directories as that requires rewriting of data with only the\nnon-deleted rows, hence time consuming. This work is handled by a separate, less\nfrequent and longer running, compaction called Major compaction. Major\ncompaction is triggered when the total size of delta directories reaches\n10% (configurable) of the base directory size. This compaction creates a new\nBase directory.\nLocks\nHive uses shared locks to control what operations can run in parallel on\npartition/table. For example, DML queries take a write-lock on partitions they\nare modifying while read queries take a read-lock on partitions they are\nreading. The read-locks taken by read queries prevents Hive from cleaning up the\ndelta directories that have been compacted while they are being read by the\nquery.\nChanges in Presto to support Hive ACID and transactional ables\nAt high level, there are changes at two places in Presto to support Hive ACID\nand transactional tables: In split generation logic that runs in coordinator and\nin ORC reader that is used in workers.\nSplit generation\nHive ACID State is setup in SemiTransactionalHiveMetastore.beginQuery,\nonly for Hive transactional tables:\n    \nA new Hive transaction is opened per Query\nA shared read-lock is obtained from Metastore server for the partitions\n read in the query\nA Heartbeat mechanism is set up to inform the Metastore server about\n liveliness periodically. Frequency of heartbeats is figured out from the\n Metastore server but can be overridden with hive.transaction-heartbeat-interval\n property.\nBackgroundSplitLoader is set up with valid WriteIds for the partitions as\nprovided by Metastore server\nBackgroundSplitLoader.loadPartitions is called in an Executor to create\nsplits for each partition:\n    \nACID sub-directories: base, delta and delete_delta directories are\n figured out by listing the partition location\nDeleteDeltaLocations, a registry of delete_delta directories, is\n created. It contains minimal information through which delete_delta\n directory paths can be recreated at workers.\nHiveSplits are created with each location of base and delta directories.\n Each HiveSplit contains the DeleteDeltaLocations\nIf the table is Insert-Only transactional table then\n DeleteDeltaLocations is empty and the HiveSplit is same as the HiveSplit\n on flat/non-transactional Hive table\nReading Hive transactional data in workers\nThe HiveSplit generated during the split generation phase make their way to\nworker nodes where OrcPageSourceFactory is used to create PageSource for\nTableScan operator.\nInsert-Only transactional tables are read in the same way a non-transactional\ntables are read, OrcPageSource is created for their splits which reads the\ndata for the split and makes it available to TableScanOperator\nCRUD transactional tables need special handling during reads because the file\nschema does not match the table for them due to the synthetic RowId column added\nwhich introduces additional Struct nesting as mentioned earlier:\n    \nRowId columns are added to the list of columns to be read from file\nORC reader is setup by accessing column name from the file instead of\n using the column indexes from table schema, equivalent to forcing\n hive.orc.use-column-names=true for CRUD transactional tables\nOrcRecordReader is created for the ORC file of the split\nOrcDeletedRows is created for delete_delta locations, if any.\nOrcPageSouce is created that returns rows from OrcRecordReader\n which are not present in OrcDeletedRows. This cross referencing of deleted\n rows is done lazily for each Block of the Page only when that Block is\n needed to be read from the PageSource. This works well with the lazy\n materialization logic of Presto to skip over Blocks if a predicate does not\n apply to the Page at all.\nPerformance numbers\nEach Insert on Hive transactional table can create additional splits for delta\ndirectories and each delete can create delete_delta directories that adds\nadditional work of cross referencing deleted rows while reading the split. To\nmeasure the impact of these operations on reads from Presto we ran the following\nperformance tests where multiple Hive transactional tables are created with\nvarying number of Insert and Delete operations and runtime of different\nread-focused Presto queries were recorded:\nTable Type\n      Description\n      delta directories\n      delete_delta directories\n    \nFlat\n      TPCDS store_sales scale 3000 table, 8.6B rows\n      0\n      0\n    \nOnly Base\n      Hive transactional store_sales scale 3000 table: 8.6B rows\n      0\n      0\n    \nBase + 1-Delete\n      Derived from “Only Base” with rows having customer_id=100 deleted by 1 DELETE query: 347 deleted entries\n      0\n      1\n    \nBase + 1-Delete + 1-Insert\n      Derived from “Base + 1 Delete” with deleted rows added back by 1 INSERT query: 347 deleted entries + 347 inserted entries\n      1\n      1\n    \nBase + 5-Deletes\n      Derived from “Only Base” with rows for 5 customer_ids deleted by 5 DELETE queries: 1355 rows deleted\n      0\n      5\n    \nBase + 5-Deletes + 5-Inserts\n      Derived from “Base + 1 Delete” with deleted rows added back by 5 INSERT queries: 1355 deleted entries + 1355 inserted entries\n      5\n      5\n    \nFollowing is the result of these tests, ran on a cluster with 5 c3.4xlarge\nmachines on AWS:\n\nIt was seen that there is an impact of deleted rows on read performance, which\nis expected as the work for the reader increases in this case. But with\npredicates in place, this impact was reduced as the amount of data to be read\ngoes down.\nOngoing and Future work\nThere has been ongoing work on the Hive ACID integration and some improvements\nare planned in future, notably:\nBucketed Hive transactional table support has been added (#1591)\nSupport for original files is in progress (#2930),\nthis will allow Presto to read the Hive tables that were converted to\ntransactional table at some point after having non-transactional data\nWrite support will be taken up in future (#1956)\nThere is ongoing work on Hive side for ACID on Parquet format. Once that\nlands, Presto’s implementation will be extended to support Parquet too.\nAcknowledgements and Conclusion\nThanks to the folks who helped out in the development of this feature:\nAbhishek Somani provided\ncontinuous guidance on internals of Hive ACID,\nDain helped out with simplifying\nORC reader and along with Piotr\nhelped in code refinement and with multiple rounds of reviews.\nWhile we continue development on this feature to get full fledged support\nincluding writes, you can start using it on Hive transactional tables which do\nnot have files in flat format. If you have such tables and want to use Presto\nwith them then you can apply this fix\nto your Presto installation or you can trigger a  major compaction on all\npartitions to migrate full table into CRUD transactional table format."
author: "Shubham Tagra, Qubole"
contentHtml: "<p>Hive ACID and transactional tables are supported in Presto since the 331\nrelease. Hive ACID support is an important step towards GDPR/CCPA compliance,\nand also towards Hive 3 support as <a href=\"https://docs.cloudera.com/HDPDocuments/HDP3/HDP-3.1.0/hive-overview/content/hive_upgrade_changes.html\">certain distributions</a>\nof Hive 3 create transactional tables by default.</p>\n\n<p>In this blog post we cover the concepts of Hive ACID and transactional\ntables along with the changes done in Presto to support them. We also cover the\nperformance tests on this integration and look at the future plans for this\nfeature.</p>\n\n<!--more-->\n\n<h1 id=\"how-to-use-hive-acid-and-transactional-tables-in-presto\">How to use Hive ACID and transactional tables in Presto</h1>\n\n<p>Hive transactional tables are readable in Presto without any need to tweak\nconfigs, you only need to take care of these requirements:</p>\n\n<ol>\n  <li>Use Presto version 331 or higher</li>\n  <li>Use Hive 3 Metastore Server. Presto does not support Hive transactional\ntables created with Hive before version 3.</li>\n</ol>\n\n<p>Note that Presto cannot create or write to Hive transactional tables yet. You\ncan create and write to Hive transactional tables via\n<a href=\"https://cwiki.apache.org/confluence/display/Hive/Hive+Transactions\">Hive</a>\nor via Spark with <a href=\"https://github.com/qubole/spark-acid\">Hive ACID Data Source plugin</a> and\nuse Presto to read these tables.</p>\n\n<h1 id=\"what-is-hive-acid-and-hive-transactional-tables\">What is Hive ACID and Hive transactional tables</h1>\n<p>Hive transactional tables are the tables in Hive that provide ACID semantics.\nThis excerpt from\n<a href=\"https://cwiki.apache.org/confluence/display/Hive/Hive+Transactions\">Hive documentation</a>\ncovers ACID traits well:</p>\n<blockquote>\n  <p>“ACID stands for four traits of database transactions:\nAtomicity (an operation either succeeds completely or fails,\nit does not leave partial data), Consistency (once an application performs an\noperation the results of that operation are visible to it in every subsequent\noperation), Isolation (an incomplete operation by one user does not cause\nunexpected side effects for other users), and Durability (once an operation is\ncomplete it will be preserved even in the face of machine or system failure).\nThese traits have long been expected of database systems as part of their\ntransaction functionality.“</p>\n</blockquote>\n\n<h1 id=\"need-for-hive-acid-and-transactional-tables\">Need for Hive ACID and transactional tables</h1>\n<p>In any organisation, there is always a need to update or delete existing entries\nin tables e.g., a user writes or updates the review for an item purchased a\nweek back or a transaction status is changed after a day, etc..\nWith regulations like GDPR/CCPA updates/deletes become even more frequent as the\nusers can ask the organisation to delete the data on them, and organisations are\nobligated to fulfill these requests.</p>\n\n<p>The standard practice to update data has been to overwrite the partition or\ntable with the updated data but this is inefficient and unreliable. It takes a\nlot of resources to overwrite all of the existing data to update a few entries,\nbut more importantly there are issues around isolation when reads on old data\nare going on and the overwrite starts deleting that data. To solve these issues\nseveral solutions have been developed, many of them are covered\n<a href=\"https://www.qubole.com/blog/qubole-open-sources-multi-engine-support-for-updates-and-deletes-in-data-lakes/\">in this blog post</a>,\nand Hive ACID is one of them.</p>\n\n<h1 id=\"concepts-of-hive-acid-and-transactional-tables\">Concepts of Hive ACID and transactional tables</h1>\n\n<p>Several concepts like transactions, WriteIds, deltas, locks, etc. are added in\nHive to achieve ACID semantics. To understand the changes done in Presto to\nsupport Hive ACID and transactional tables, covered in the next section, it is\nimportant to understand these concepts first. So let’s look at them in detail.</p>\n\n<h2 id=\"types-of-hive-transactional-tables\">Types of Hive transactional tables</h2>\n<p>There are two types of Hive transactional tables: Insert-Only transactional\ntables and CRUD transactional tables.\nFollowing table compares the two:</p>\n\n<table>\n  <thead>\n    <tr>\n      <th style=\"text-align: center\">Type of transactional table</th>\n      <th style=\"text-align: center\">Hive DML Operations Supported</th>\n      <th style=\"text-align: center\">Input Formats supported</th>\n      <th style=\"text-align: center\">Synthetic columns in file?</th>\n      <th style=\"text-align: center\">Additional Table Properties</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style=\"text-align: center\">Insert-Only Transactional Tables</td>\n      <td style=\"text-align: center\">INSERT</td>\n      <td style=\"text-align: center\">All input formats</td>\n      <td style=\"text-align: center\">No</td>\n      <td style=\"text-align: center\"><code class=\"language-plaintext highlighter-rouge\">'transactional'='true'</code>, <code class=\"language-plaintext highlighter-rouge\">'transactional_properties'='insert_only'</code></td>\n    </tr>\n    <tr>\n      <td style=\"text-align: center\">CRUD Transactional Tables</td>\n      <td style=\"text-align: center\">INSERT, UPDATE, DELETE</td>\n      <td style=\"text-align: center\">ORC</td>\n      <td style=\"text-align: center\">Yes</td>\n      <td style=\"text-align: center\"><code class=\"language-plaintext highlighter-rouge\">'transactional'='true'</code></td>\n    </tr>\n  </tbody>\n</table>\n\n<h2 id=\"hive-transactions\">Hive Transactions</h2>\n<p>Hive transactional tables should be accessed under Hive Transactions only. Note that\nthese transactions are different from Presto transactions and are managed by\nHive. Running DML queries under separate transactions helps in atomicity. Each\ntransaction is independent and when rolled back will not have any impact on the\nstate of the table.</p>\n\n<h2 id=\"writeids\">WriteIds</h2>\n<p>DML queries under a transaction write to a unique location under partition/table\ndescribed in detail later in “New Sub-Directories” section. This location is derived\nby WriteId allocated to the transaction. This provides Isolation of DML queries\nand such queries can run in parallel, whenever they can, without interfering\nwith each other.</p>\n\n<h2 id=\"valid-writeids\">Valid WriteIds</h2>\n<p>Read queries under a transaction get a list of valid WriteIds that belong to the\ntransactions which were successfully committed. This ensures Consistency by\nmaking results of committed transactions available to all the future\ntransactions and also provides Isolation as DML and read queries can run in\nparallel with read queries not reading partial data written by DML queries.</p>\n\n<h2 id=\"new-sub-directories\">New Sub-Directories</h2>\n<p>Results of a DML queries are written to a unique location derived from WriteId\nof the transaction. These unique locations are delta directories under\npartition/table location. Apart from the WriteId, this unique location is made\nup of the DML operation and depending on the operation type there can be two\ntypes of delta directories:</p>\n<ol>\n  <li>Delete Delta Directory: This delta directory is created for results of\nDELETE statements and is named <code class=\"language-plaintext highlighter-rouge\">delete_delta_&lt;writeId&gt;_&lt;writeId&gt;</code> under\npartition/table location.</li>\n  <li>Delta Directory: This type is created for the results of INSERT statements\nand is named <code class=\"language-plaintext highlighter-rouge\">delta_&lt;writeId&gt;_&lt;writeId&gt;</code> under partition/table location.</li>\n</ol>\n\n<p>Apart from delta directories, there is another sub-directory that is now added\ncalled “Base directory” and is named as <code class=\"language-plaintext highlighter-rouge\">base_&lt;writeId&gt;</code> under partition/table\nlocation. This type of directory is created by INSERT OVERWRITE TABLE query or\nby major compaction which is described later.</p>\n\n<p>The following animation shows how these new sub-directories are created in the\nfilesystem along with transaction management at metastore with different\nqueries:\n<img src=\"/assets/blog/hive-acid/directories.gif\" alt=\"\" /></p>\n\n<h2 id=\"rowid\">RowID</h2>\n<p>To uniquely identify each row in the table, a synthetic rowId is created and\nadded to each row. RowIds are added to CRUD transactional tables only because it\nis used in case of DELETE statements only. When a DELETE is performed, the\nrowIds of the rows that it would delete are written into the <code class=\"language-plaintext highlighter-rouge\">delete_delta</code>\ndirectory and subsequents reads will read all but these rows.</p>\n\n<p>RowId is made of 5 entries today: <code class=\"language-plaintext highlighter-rouge\">operation</code>, <code class=\"language-plaintext highlighter-rouge\">originalTransaction</code>, <code class=\"language-plaintext highlighter-rouge\">bucket</code>,\n<code class=\"language-plaintext highlighter-rouge\">rowId</code>, <code class=\"language-plaintext highlighter-rouge\">currentTransaction</code> but <code class=\"language-plaintext highlighter-rouge\">operation</code> and <code class=\"language-plaintext highlighter-rouge\">currentTransaction</code> fields\nare redundant now.\nRowId is added in the root STRUCT of ORC and hence the schema of ORC files is\ndifferent from the schema defined in the table, e.g.:</p>\n\n<p>Schema of CRUD transactional Hive Table:</p>\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>n_nationkey : int,\nn_name : string,\nn_regionkey : int,\nn_comment : string\n</code></pre></div></div>\n\n<p>Schema of ORC file for this table:</p>\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>struct {\n    operation : int,\n    originalTransaction : bigint,\n    bucket : int,\n    rowId : bigint,\n    currentTransaction : bigint,\n    row : struct {\n        n_nationkey : int,\n        n_name : string,\n        n_regionkey : int,\n        n_comment : string\n    }\n}\n</code></pre></div></div>\n\n<p>Note that one level of nesting of table schema, like the inner struct above, is\napplicable to flat Hive tables too. The two level nesting of data columns is\nadded for Orc files of CRUD transactional tables to keep rowId columns isolated\nfrom data columns.</p>\n\n<h2 id=\"compactions\">Compactions</h2>\n<p>The working described above with <code class=\"language-plaintext highlighter-rouge\">delta</code> and <code class=\"language-plaintext highlighter-rouge\">delete_delta</code> directories for each\ntransaction makes the DML queries execute fast but have\nthe following impact on read queries:</p>\n<ol>\n  <li>Many delta directories with small data in each directory will slow down\nexecution of read queries. This is a known problem around\nsmall files where engines end up spending more time opening files than actually\nprocessing the data.</li>\n  <li>Cross referencing all <code class=\"language-plaintext highlighter-rouge\">delete_delta</code> directories to remove all deleted rows\nslows down the reads.</li>\n</ol>\n\n<p>To solve these problems, Hive compacts delta directories asynchronously at two\nlevels:</p>\n<ol>\n  <li>Minor Compaction: This compaction combines active <code class=\"language-plaintext highlighter-rouge\">delta</code> directories into one\n<code class=\"language-plaintext highlighter-rouge\">delta</code> directory and active <code class=\"language-plaintext highlighter-rouge\">delete_delta</code> directories into one <code class=\"language-plaintext highlighter-rouge\">delete_delta</code>\ndirectory thereby decreasing the number of small files. Limiting scope of this\ncompaction to combining only <code class=\"language-plaintext highlighter-rouge\">delta</code> directories keeps it fast. Minor compaction\nis automatically triggered as soon as active delta directories count reaches\n10 (configurable). This compaction creates new delta directories like\n<code class=\"language-plaintext highlighter-rouge\">delta_&lt;start_write_id&gt;_&lt;end_write_id&gt;</code> where [start_write_id, end_write_id]\ngives the range of existing delta directories that we compacted. Similar naming\nconvention is used for <code class=\"language-plaintext highlighter-rouge\">delete_delta</code> directory.</li>\n  <li>Major Compaction: Minor compaction does not work on merging base, <code class=\"language-plaintext highlighter-rouge\">delta</code> and\n<code class=\"language-plaintext highlighter-rouge\">delete_delta</code> directories as that requires rewriting of data with only the\nnon-deleted rows, hence time consuming. This work is handled by a separate, less\nfrequent and longer running, compaction called Major compaction. Major\ncompaction is triggered when the total size of delta directories reaches\n10% (configurable) of the base directory size. This compaction creates a new\nBase directory.</li>\n</ol>\n\n<h2 id=\"locks\">Locks</h2>\n<p>Hive uses shared locks to control what operations can run in parallel on\npartition/table. For example, DML queries take a write-lock on partitions they\nare modifying while read queries take a read-lock on partitions they are\nreading. The read-locks taken by read queries prevents Hive from cleaning up the\ndelta directories that have been compacted while they are being read by the\nquery.</p>\n\n<h1 id=\"changes-in-presto-to-support-hive-acid-and-transactional-ables\">Changes in Presto to support Hive ACID and transactional ables</h1>\n\n<p>At high level, there are changes at two places in Presto to support Hive ACID\nand transactional tables: In split generation logic that runs in coordinator and\nin ORC reader that is used in workers.</p>\n\n<h2 id=\"split-generation\">Split generation</h2>\n\n<ol>\n  <li>Hive ACID State is setup in <code class=\"language-plaintext highlighter-rouge\">SemiTransactionalHiveMetastore.beginQuery</code>,\nonly for Hive transactional tables:\n    <ol>\n      <li>A new Hive transaction is opened per Query</li>\n      <li>A shared read-lock is obtained from Metastore server for the partitions\n read in the query</li>\n      <li>A Heartbeat mechanism is set up to inform the Metastore server about\n liveliness periodically. Frequency of heartbeats is figured out from the\n Metastore server but can be overridden with <code class=\"language-plaintext highlighter-rouge\">hive.transaction-heartbeat-interval</code>\n property.</li>\n    </ol>\n  </li>\n  <li><code class=\"language-plaintext highlighter-rouge\">BackgroundSplitLoader</code> is set up with valid WriteIds for the partitions as\nprovided by Metastore server</li>\n  <li><code class=\"language-plaintext highlighter-rouge\">BackgroundSplitLoader.loadPartitions</code> is called in an Executor to create\nsplits for each partition:\n    <ol>\n      <li>ACID sub-directories: <code class=\"language-plaintext highlighter-rouge\">base</code>, <code class=\"language-plaintext highlighter-rouge\">delta</code> and <code class=\"language-plaintext highlighter-rouge\">delete_delta</code> directories are\n figured out by listing the partition location</li>\n      <li><code class=\"language-plaintext highlighter-rouge\">DeleteDeltaLocations</code>, a registry of <code class=\"language-plaintext highlighter-rouge\">delete_delta</code> directories, is\n created. It contains minimal information through which <code class=\"language-plaintext highlighter-rouge\">delete_delta</code>\n directory paths can be recreated at workers.</li>\n      <li>HiveSplits are created with each location of base and delta directories.\n Each HiveSplit contains the <code class=\"language-plaintext highlighter-rouge\">DeleteDeltaLocations</code></li>\n      <li>If the table is Insert-Only transactional table then\n <code class=\"language-plaintext highlighter-rouge\">DeleteDeltaLocations</code> is empty and the HiveSplit is same as the HiveSplit\n on flat/non-transactional Hive table</li>\n    </ol>\n  </li>\n</ol>\n\n<h2 id=\"reading-hive-transactional-data-in-workers\">Reading Hive transactional data in workers</h2>\n\n<p>The HiveSplit generated during the split generation phase make their way to\nworker nodes where OrcPageSourceFactory is used to create PageSource for\nTableScan operator.</p>\n<ol>\n  <li>Insert-Only transactional tables are read in the same way a non-transactional\ntables are read, <code class=\"language-plaintext highlighter-rouge\">OrcPageSource</code> is created for their splits which reads the\ndata for the split and makes it available to TableScanOperator</li>\n  <li>CRUD transactional tables need special handling during reads because the file\nschema does not match the table for them due to the synthetic RowId column added\nwhich introduces additional Struct nesting as mentioned earlier:\n    <ol>\n      <li>RowId columns are added to the list of columns to be read from file</li>\n      <li>ORC reader is setup by accessing column name from the file instead of\n using the column indexes from table schema, equivalent to forcing\n <code class=\"language-plaintext highlighter-rouge\">hive.orc.use-column-names=true</code> for CRUD transactional tables</li>\n      <li><code class=\"language-plaintext highlighter-rouge\">OrcRecordReader</code> is created for the ORC file of the split</li>\n      <li><code class=\"language-plaintext highlighter-rouge\">OrcDeletedRows</code> is created for <code class=\"language-plaintext highlighter-rouge\">delete_delta</code> locations, if any.</li>\n      <li><code class=\"language-plaintext highlighter-rouge\">OrcPageSouce</code> is created that returns rows from <code class=\"language-plaintext highlighter-rouge\">OrcRecordReader</code>\n which are not present in <code class=\"language-plaintext highlighter-rouge\">OrcDeletedRows</code>. This cross referencing of deleted\n rows is done lazily for each <code class=\"language-plaintext highlighter-rouge\">Block</code> of the <code class=\"language-plaintext highlighter-rouge\">Page</code> only when that <code class=\"language-plaintext highlighter-rouge\">Block</code> is\n needed to be read from the PageSource. This works well with the lazy\n materialization logic of Presto to skip over Blocks if a predicate does not\n apply to the <code class=\"language-plaintext highlighter-rouge\">Page</code> at all.</li>\n    </ol>\n  </li>\n</ol>\n\n<h1 id=\"performance-numbers\">Performance numbers</h1>\n<p>Each Insert on Hive transactional table can create additional splits for <code class=\"language-plaintext highlighter-rouge\">delta</code>\ndirectories and each delete can create <code class=\"language-plaintext highlighter-rouge\">delete_delta</code> directories that adds\nadditional work of cross referencing deleted rows while reading the split. To\nmeasure the impact of these operations on reads from Presto we ran the following\nperformance tests where multiple Hive transactional tables are created with\nvarying number of Insert and Delete operations and runtime of different\nread-focused Presto queries were recorded:</p>\n\n<table>\n  <thead>\n    <tr>\n      <th style=\"text-align: center\">Table Type</th>\n      <th style=\"text-align: center\">Description</th>\n      <th style=\"text-align: center\">delta directories</th>\n      <th style=\"text-align: center\">delete_delta directories</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style=\"text-align: center\">Flat</td>\n      <td style=\"text-align: center\">TPCDS store_sales scale 3000 table, 8.6B rows</td>\n      <td style=\"text-align: center\">0</td>\n      <td style=\"text-align: center\">0</td>\n    </tr>\n    <tr>\n      <td style=\"text-align: center\">Only Base</td>\n      <td style=\"text-align: center\">Hive transactional store_sales scale 3000 table: 8.6B rows</td>\n      <td style=\"text-align: center\">0</td>\n      <td style=\"text-align: center\">0</td>\n    </tr>\n    <tr>\n      <td style=\"text-align: center\">Base + 1-Delete</td>\n      <td style=\"text-align: center\">Derived from “Only Base” with rows having customer_id=100 deleted by 1 DELETE query: 347 deleted entries</td>\n      <td style=\"text-align: center\">0</td>\n      <td style=\"text-align: center\">1</td>\n    </tr>\n    <tr>\n      <td style=\"text-align: center\">Base + 1-Delete + 1-Insert</td>\n      <td style=\"text-align: center\">Derived from “Base + 1 Delete” with deleted rows added back by 1 INSERT query: 347 deleted entries + 347 inserted entries</td>\n      <td style=\"text-align: center\">1</td>\n      <td style=\"text-align: center\">1</td>\n    </tr>\n    <tr>\n      <td style=\"text-align: center\">Base + 5-Deletes</td>\n      <td style=\"text-align: center\">Derived from “Only Base” with rows for 5 customer_ids deleted by 5 DELETE queries: 1355 rows deleted</td>\n      <td style=\"text-align: center\">0</td>\n      <td style=\"text-align: center\">5</td>\n    </tr>\n    <tr>\n      <td style=\"text-align: center\">Base + 5-Deletes + 5-Inserts</td>\n      <td style=\"text-align: center\">Derived from “Base + 1 Delete” with deleted rows added back by 5 INSERT queries: 1355 deleted entries + 1355 inserted entries</td>\n      <td style=\"text-align: center\">5</td>\n      <td style=\"text-align: center\">5</td>\n    </tr>\n  </tbody>\n</table>\n\n<p>Following is the result of these tests, ran on a cluster with 5 c3.4xlarge\nmachines on AWS:\n<img src=\"/assets/blog/hive-acid/perf.png\" alt=\"\" /></p>\n\n<p>It was seen that there is an impact of deleted rows on read performance, which\nis expected as the work for the reader increases in this case. But with\npredicates in place, this impact was reduced as the amount of data to be read\ngoes down.</p>\n\n<h1 id=\"ongoing-and-future-work\">Ongoing and Future work</h1>\n<p>There has been ongoing work on the Hive ACID integration and some improvements\nare planned in future, notably:</p>\n<ul>\n  <li>Bucketed Hive transactional table support has been added (<a href=\"https://github.com/trinodb/trino/pull/1591\">#1591</a>)</li>\n  <li>Support for original files is in progress (<a href=\"https://github.com/trinodb/trino/pull/2930\">#2930</a>),\nthis will allow Presto to read the Hive tables that were converted to\ntransactional table at some point after having non-transactional data</li>\n  <li>Write support will be taken up in future (<a href=\"https://github.com/trinodb/trino/issues/1956\">#1956</a>)</li>\n  <li>There is ongoing work on Hive side for ACID on Parquet format. Once that\nlands, Presto’s implementation will be extended to support Parquet too.</li>\n</ul>\n\n<h1 id=\"acknowledgements-and-conclusion\">Acknowledgements and Conclusion</h1>\n<p>Thanks to the folks who helped out in the development of this feature:\n<a href=\"https://www.linkedin.com/in/abhishek-somani-a946aa1b\">Abhishek Somani</a> provided\ncontinuous guidance on internals of Hive ACID,\n<a href=\"https://www.linkedin.com/in/dainsundstrom\">Dain</a> helped out with simplifying\nORC reader and along with <a href=\"https://www.linkedin.com/in/piotrfindeisen/\">Piotr</a>\nhelped in code refinement and with multiple rounds of reviews.</p>\n\n<p>While we continue development on this feature to get full fledged support\nincluding writes, you can start using it on Hive transactional tables which do\nnot have files in flat format. If you have such tables and want to use Presto\nwith them then you can apply <a href=\"https://github.com/trinodb/trino/pull/2930\">this fix</a>\nto your Presto installation or you can trigger a  major compaction on all\npartitions to migrate full table into CRUD transactional table format.</p>"
---

Hive ACID and transactional tables are supported in Presto since the 331
release. Hive ACID support is an important step towards GDPR/CCPA compliance,
and also towards Hive 3 support as certain distributions
of Hive 3 create transactional tables by default.
In this blog post we cover the concepts of Hive ACID and transactional
tables along with the changes done in Presto to support them. We also cover the
performance tests on this integration and look at the future plans for this
feature.
How to use Hive ACID and transactional tables in Presto
Hive transactional tables are readable in Presto without any need to tweak
configs, you only need to take care of these requirements:
Use Presto version 331 or higher
Use Hive 3 Metastore Server. Presto does not support Hive transactional
tables created with Hive before version 3.
Note that Presto cannot create or write to Hive transactional tables yet. You
can create and write to Hive transactional tables via
Hive
or via Spark with Hive ACID Data Source plugin and
use Presto to read these tables.
What is Hive ACID and Hive transactional tables
Hive transactional tables are the tables in Hive that provide ACID semantics.
This excerpt from
Hive documentation
covers ACID traits well:
“ACID stands for four traits of database transactions:
Atomicity (an operation either succeeds completely or fails,
it does not leave partial data), Consistency (once an application performs an
operation the results of that operation are visible to it in every subsequent
operation), Isolation (an incomplete operation by one user does not cause
unexpected side effects for other users), and Durability (once an operation is
complete it will be preserved even in the face of machine or system failure).
These traits have long been expected of database systems as part of their
transaction functionality.“
Need for Hive ACID and transactional tables
In any organisation, there is always a need to update or delete existing entries
in tables e.g., a user writes or updates the review for an item purchased a
week back or a transaction status is changed after a day, etc..
With regulations like GDPR/CCPA updates/deletes become even more frequent as the
users can ask the organisation to delete the data on them, and organisations are
obligated to fulfill these requests.
The standard practice to update data has been to overwrite the partition or
table with the updated data but this is inefficient and unreliable. It takes a
lot of resources to overwrite all of the existing data to update a few entries,
but more importantly there are issues around isolation when reads on old data
are going on and the overwrite starts deleting that data. To solve these issues
several solutions have been developed, many of them are covered
in this blog post,
and Hive ACID is one of them.
Concepts of Hive ACID and transactional tables
Several concepts like transactions, WriteIds, deltas, locks, etc. are added in
Hive to achieve ACID semantics. To understand the changes done in Presto to
support Hive ACID and transactional tables, covered in the next section, it is
important to understand these concepts first. So let’s look at them in detail.
Types of Hive transactional tables
There are two types of Hive transactional tables: Insert-Only transactional
tables and CRUD transactional tables.
Following table compares the two:
Type of transactional table
      Hive DML Operations Supported
      Input Formats supported
      Synthetic columns in file?
      Additional Table Properties
    
Insert-Only Transactional Tables
      INSERT
      All input formats
      No
      'transactional'='true', 'transactional_properties'='insert_only'
    
CRUD Transactional Tables
      INSERT, UPDATE, DELETE
      ORC
      Yes
      'transactional'='true'
    
Hive Transactions
Hive transactional tables should be accessed under Hive Transactions only. Note that
these transactions are different from Presto transactions and are managed by
Hive. Running DML queries under separate transactions helps in atomicity. Each
transaction is independent and when rolled back will not have any impact on the
state of the table.
WriteIds
DML queries under a transaction write to a unique location under partition/table
described in detail later in “New Sub-Directories” section. This location is derived
by WriteId allocated to the transaction. This provides Isolation of DML queries
and such queries can run in parallel, whenever they can, without interfering
with each other.
Valid WriteIds
Read queries under a transaction get a list of valid WriteIds that belong to the
transactions which were successfully committed. This ensures Consistency by
making results of committed transactions available to all the future
transactions and also provides Isolation as DML and read queries can run in
parallel with read queries not reading partial data written by DML queries.
New Sub-Directories
Results of a DML queries are written to a unique location derived from WriteId
of the transaction. These unique locations are delta directories under
partition/table location. Apart from the WriteId, this unique location is made
up of the DML operation and depending on the operation type there can be two
types of delta directories:
Delete Delta Directory: This delta directory is created for results of
DELETE statements and is named delete_delta_<writeId>_<writeId> under
partition/table location.
Delta Directory: This type is created for the results of INSERT statements
and is named delta_<writeId>_<writeId> under partition/table location.
Apart from delta directories, there is another sub-directory that is now added
called “Base directory” and is named as base_<writeId> under partition/table
location. This type of directory is created by INSERT OVERWRITE TABLE query or
by major compaction which is described later.
The following animation shows how these new sub-directories are created in the
filesystem along with transaction management at metastore with different
queries:

RowID
To uniquely identify each row in the table, a synthetic rowId is created and
added to each row. RowIds are added to CRUD transactional tables only because it
is used in case of DELETE statements only. When a DELETE is performed, the
rowIds of the rows that it would delete are written into the delete_delta
directory and subsequents reads will read all but these rows.
RowId is made of 5 entries today: operation, originalTransaction, bucket,
rowId, currentTransaction but operation and currentTransaction fields
are redundant now.
RowId is added in the root STRUCT of ORC and hence the schema of ORC files is
different from the schema defined in the table, e.g.:
Schema of CRUD transactional Hive Table:

n_nationkey : int,
n_name : string,
n_regionkey : int,
n_comment : string


Schema of ORC file for this table:

struct {
    operation : int,
    originalTransaction : bigint,
    bucket : int,
    rowId : bigint,
    currentTransaction : bigint,
    row : struct {
        n_nationkey : int,
        n_name : string,
        n_regionkey : int,
        n_comment : string
    }
}


Note that one level of nesting of table schema, like the inner struct above, is
applicable to flat Hive tables too. The two level nesting of data columns is
added for Orc files of CRUD transactional tables to keep rowId columns isolated
from data columns.
Compactions
The working described above with delta and delete_delta directories for each
transaction makes the DML queries execute fast but have
the following impact on read queries:
Many delta directories with small data in each directory will slow down
execution of read queries. This is a known problem around
small files where engines end up spending more time opening files than actually
processing the data.
Cross referencing all delete_delta directories to remove all deleted rows
slows down the reads.
To solve these problems, Hive compacts delta directories asynchronously at two
levels:
Minor Compaction: This compaction combines active delta directories into one
delta directory and active delete_delta directories into one delete_delta
directory thereby decreasing the number of small files. Limiting scope of this
compaction to combining only delta directories keeps it fast. Minor compaction
is automatically triggered as soon as active delta directories count reaches
10 (configurable). This compaction creates new delta directories like
delta_<start_write_id>_<end_write_id> where [start_write_id, end_write_id]
gives the range of existing delta directories that we compacted. Similar naming
convention is used for delete_delta directory.
Major Compaction: Minor compaction does not work on merging base, delta and
delete_delta directories as that requires rewriting of data with only the
non-deleted rows, hence time consuming. This work is handled by a separate, less
frequent and longer running, compaction called Major compaction. Major
compaction is triggered when the total size of delta directories reaches
10% (configurable) of the base directory size. This compaction creates a new
Base directory.
Locks
Hive uses shared locks to control what operations can run in parallel on
partition/table. For example, DML queries take a write-lock on partitions they
are modifying while read queries take a read-lock on partitions they are
reading. The read-locks taken by read queries prevents Hive from cleaning up the
delta directories that have been compacted while they are being read by the
query.
Changes in Presto to support Hive ACID and transactional ables
At high level, there are changes at two places in Presto to support Hive ACID
and transactional tables: In split generation logic that runs in coordinator and
in ORC reader that is used in workers.
Split generation
Hive ACID State is setup in SemiTransactionalHiveMetastore.beginQuery,
only for Hive transactional tables:
    
A new Hive transaction is opened per Query
A shared read-lock is obtained from Metastore server for the partitions
 read in the query
A Heartbeat mechanism is set up to inform the Metastore server about
 liveliness periodically. Frequency of heartbeats is figured out from the
 Metastore server but can be overridden with hive.transaction-heartbeat-interval
 property.
BackgroundSplitLoader is set up with valid WriteIds for the partitions as
provided by Metastore server
BackgroundSplitLoader.loadPartitions is called in an Executor to create
splits for each partition:
    
ACID sub-directories: base, delta and delete_delta directories are
 figured out by listing the partition location
DeleteDeltaLocations, a registry of delete_delta directories, is
 created. It contains minimal information through which delete_delta
 directory paths can be recreated at workers.
HiveSplits are created with each location of base and delta directories.
 Each HiveSplit contains the DeleteDeltaLocations
If the table is Insert-Only transactional table then
 DeleteDeltaLocations is empty and the HiveSplit is same as the HiveSplit
 on flat/non-transactional Hive table
Reading Hive transactional data in workers
The HiveSplit generated during the split generation phase make their way to
worker nodes where OrcPageSourceFactory is used to create PageSource for
TableScan operator.
Insert-Only transactional tables are read in the same way a non-transactional
tables are read, OrcPageSource is created for their splits which reads the
data for the split and makes it available to TableScanOperator
CRUD transactional tables need special handling during reads because the file
schema does not match the table for them due to the synthetic RowId column added
which introduces additional Struct nesting as mentioned earlier:
    
RowId columns are added to the list of columns to be read from file
ORC reader is setup by accessing column name from the file instead of
 using the column indexes from table schema, equivalent to forcing
 hive.orc.use-column-names=true for CRUD transactional tables
OrcRecordReader is created for the ORC file of the split
OrcDeletedRows is created for delete_delta locations, if any.
OrcPageSouce is created that returns rows from OrcRecordReader
 which are not present in OrcDeletedRows. This cross referencing of deleted
 rows is done lazily for each Block of the Page only when that Block is
 needed to be read from the PageSource. This works well with the lazy
 materialization logic of Presto to skip over Blocks if a predicate does not
 apply to the Page at all.
Performance numbers
Each Insert on Hive transactional table can create additional splits for delta
directories and each delete can create delete_delta directories that adds
additional work of cross referencing deleted rows while reading the split. To
measure the impact of these operations on reads from Presto we ran the following
performance tests where multiple Hive transactional tables are created with
varying number of Insert and Delete operations and runtime of different
read-focused Presto queries were recorded:
Table Type
      Description
      delta directories
      delete_delta directories
    
Flat
      TPCDS store_sales scale 3000 table, 8.6B rows
      0
      0
    
Only Base
      Hive transactional store_sales scale 3000 table: 8.6B rows
      0
      0
    
Base + 1-Delete
      Derived from “Only Base” with rows having customer_id=100 deleted by 1 DELETE query: 347 deleted entries
      0
      1
    
Base + 1-Delete + 1-Insert
      Derived from “Base + 1 Delete” with deleted rows added back by 1 INSERT query: 347 deleted entries + 347 inserted entries
      1
      1
    
Base + 5-Deletes
      Derived from “Only Base” with rows for 5 customer_ids deleted by 5 DELETE queries: 1355 rows deleted
      0
      5
    
Base + 5-Deletes + 5-Inserts
      Derived from “Base + 1 Delete” with deleted rows added back by 5 INSERT queries: 1355 deleted entries + 1355 inserted entries
      5
      5
    
Following is the result of these tests, ran on a cluster with 5 c3.4xlarge
machines on AWS:

It was seen that there is an impact of deleted rows on read performance, which
is expected as the work for the reader increases in this case. But with
predicates in place, this impact was reduced as the amount of data to be read
goes down.
Ongoing and Future work
There has been ongoing work on the Hive ACID integration and some improvements
are planned in future, notably:
Bucketed Hive transactional table support has been added (#1591)
Support for original files is in progress (#2930),
this will allow Presto to read the Hive tables that were converted to
transactional table at some point after having non-transactional data
Write support will be taken up in future (#1956)
There is ongoing work on Hive side for ACID on Parquet format. Once that
lands, Presto’s implementation will be extended to support Parquet too.
Acknowledgements and Conclusion
Thanks to the folks who helped out in the development of this feature:
Abhishek Somani provided
continuous guidance on internals of Hive ACID,
Dain helped out with simplifying
ORC reader and along with Piotr
helped in code refinement and with multiple rounds of reviews.
While we continue development on this feature to get full fledged support
including writes, you can start using it on Hive transactional tables which do
not have files in flat format. If you have such tables and want to use Presto
with them then you can apply this fix
to your Presto installation or you can trigger a  major compaction on all
partitions to migrate full table into CRUD transactional table format.
