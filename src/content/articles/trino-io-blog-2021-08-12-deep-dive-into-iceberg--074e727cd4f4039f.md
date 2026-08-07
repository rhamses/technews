---
title: "Trino on ice IV: Deep dive into Iceberg internals"
link: "https://trino.io/blog/2021/08/12/deep-dive-into-iceberg-internals.html"
guid: "https://trino.io/blog/2021/08/12/deep-dive-into-iceberg-internals.html"
pubDate: "2021-08-12T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Welcome to the Trino on ice series, covering the details around how the Iceberg\ntable format works with the Trino query engine. The examples build on each\nprevious post, so it’s recommended to read the posts sequentially and reference\nthem as needed later. Here are links to the posts in this series:\nTrino on ice I: A gentle introduction to Iceberg\nTrino on ice II: In-place table evolution and cloud compatibility with Iceberg\nTrino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec\nTrino on ice IV: Deep dive into Iceberg internals\nSo far, this series has covered some very interesting user level concepts of the\nIceberg model, and how you can take advantage of them using the Trino query \nengine. This blog post dives into some implementation details of Iceberg by \ndissecting some files that result from various operations carried out using \nTrino. To dissect you must use some surgical instrumentation, namely Trino, Avro\ntools, the MinIO client tool and Iceberg’s core library. It’s useful to dissect\nhow these files work, not only to help understand how Iceberg works, but also to\naid in troubleshooting issues, should you have any issues during ingestion or\nquerying of your Iceberg table. I like to think of this type of debugging much\nlike a fun game of operation, and you’re looking to see what causes the red\nerrors to fly by on your screen.\n\nUnderstanding Iceberg metadata\nIceberg can use any compatible metastore, but for Trino, it only supports the \nHive metastore and AWS Glue similar to the Hive connector. This is because there\nis already a vast amount of testing and support for using the Hive metastore in\nTrino. Likewise, many Trino use cases that currently use data lakes already use\nthe Hive connector and therefore the Hive metastore. This makes it convenient to\nhave as the leading supported use case as existing users can easily migrate\nbetween Hive to Iceberg tables. Since there is no indication of which connector\nis actually executed in the diagram of the Hive connector architecture, it\nserves as a diagram that can be used for both Hive and Iceberg. The only\ndifference is the connector used, but if you create a table in Hive, you can \nview the same table in Iceberg.\n\nTo recap the steps taken from the first three blogs; the first blog created an\nevents table, while the first two blogs ran two insert statements. The first\ninsert contained three records, while the second insert contained a single\nrecord.\n\nUp until this point, the state of the files in MinIO haven’t really been shown\nexcept some of the manifest list pointers from the snapshot in the third blog\npost. Using the MinIO client tool,\nyou can list files that Iceberg generated through all these operations and then\ntry to understand what purpose they are serving.\n\n% mc tree -f local/\nlocal/\n└─ iceberg\n   └─ logging.db\n      └─ events\n         ├─ data\n         │  ├─ event_time_day=2021-04-01\n         │  │  ├─ 51eb1ea6-266b-490f-8bca-c63391f02d10.orc\n         │  │  └─ cbcf052d-240d-4881-8a68-2bbc0f7e5233.orc\n         │  └─ event_time_day=2021-04-02\n         │     └─ b012ec20-bbdd-47f5-89d3-57b9e32ea9eb.orc\n         └─ metadata\n            ├─ 00000-c5cfaab4-f82f-4351-b2a5-bd0e241f84bc.metadata.json\n            ├─ 00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json\n            ├─ 00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json\n            ├─ 23cc980c-9570-42ed-85cf-8658fda2727d-m0.avro\n            ├─ 92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro\n            ├─ snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro\n            ├─ snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro\n            └─ snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro\n\n\nThere are a lot of files here, but here are a couple of patterns that you\ncan observe with these files.\nFirst, the top two directories are named data and metadata.\n/<bucket>/<database>/<table>/data//<bucket>/<database>/<table>/metadata/\nAs you might expect, data contains the actual ORC files split by partition.\nThis is akin to what you would see in a Hive table data directory. What is\nreally of interest here is the metadata directory. There are specifically\nthree patterns of files you’ll find here.\n/<bucket>/<database>/<table>/metadata/<file-id>.avro/<bucket>/<database>/<table>/metadata/snap-<snapshot-id>-<version>-<file-id>.avro\n/<bucket>/<database>/<table>/metadata/<version>-<commit-UUID>.metadata.json\nIceberg has a persistent tree structure that manages various snapshots of the\ndata that are created for every mutation of the data. This enables not only a\nconcurrency model that supports serializable isolation, but also cool features\nlike time travel across a linear progression of snapshots.\n\nThis tree structure contains two types of Avro files, manifest lists and\nmanifest files. Manifest list files contain pointers to various manifest files\nand the manifest files themselves point to various data files. This post starts\nout by covering these manifest files, and later covers the table metadata files\nthat are suffixed by .metadata.json.\nThe last blog covered\nthe command in Trino that shows the snapshot information that is stored in the\nmetastore. Here is that command and its output again for your review.\n\nSELECT manifest_list \nFROM iceberg.logging.\"events$snapshots\";\n\n\nResult:\nsnapshots\n    \ns3a://iceberg/logging.db/events/metadata/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro\n    \ns3a://iceberg/logging.db/events/metadata/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro\n    \ns3a://iceberg/logging.db/events/metadata/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro\n    \nYou’ll notice that the manifest list returns the Avro files prefixed with\nsnap- are returned. These files are directly correlated with the snapshot\nrecord stored in the metastore. According to the diagram above, snapshots are\nrecords in the metastore that contain the url of the manifest list in the Avro\nfile. Avro files are binary files and not something you can just open up in a\ntext editor to read. Using the \navro-tools.jar tool\ndistributed by the \nApache Avro project,\nyou can actually inspect the contents of this file to get a better understanding\nof how it is used by Iceberg.\nThe first snapshot is generated on the creation of the events table. Upon\ninspecting this file, you notice that the file is empty. The output is an\nempty line that the jq JSON command line utility removes on pretty printing\nthe JSON that is returned, which is just a newline. This snapshot represents an\nempty state of the table upon creation. To investigate the snapshots you need to\ndownload the files to your local filesystem. Let’s move them to the home \ndirectory:\n\n% java -jar  ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro | jq .\n\n\nResult (is empty):\n\n\n\n\nThe second snapshot is a little more interesting and actually shows us the \ncontents of a manifest list.\n\n% java -jar  ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro | jq .\n\n\nResult:\n\n{\n   \"manifest_path\":\"s3a://iceberg/logging.db/events/metadata/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro\",\n   \"manifest_length\":6114,\n   \"partition_spec_id\":0,\n   \"added_snapshot_id\":{\n      \"long\":2720489016575682000\n   },\n   \"added_data_files_count\":{\n      \"int\":2\n   },\n   \"existing_data_files_count\":{\n      \"int\":0\n   },\n   \"deleted_data_files_count\":{\n      \"int\":0\n   },\n   \"partitions\":{\n      \"array\":[\n         {\n            \"contains_null\":false,\n            \"lower_bound\":{\n               \"bytes\":\"\\u001eI\\u0000\\u0000\"\n            },\n            \"upper_bound\":{\n               \"bytes\":\"\\u001fI\\u0000\\u0000\"\n            }\n         }\n      ]\n   },\n   \"added_rows_count\":{\n      \"long\":3\n   },\n   \"existing_rows_count\":{\n      \"long\":0\n   },\n   \"deleted_rows_count\":{\n      \"long\":0\n   }\n}\n\n\nTo understand each of the values in each of these rows, you can refer to the \nIceberg \nspecification in the manifest list file section.\nInstead of covering these exhaustively, let’s focus on a few key fields. Below\nare the fields, and their definition according to the specification.\nmanifest_path - Location of the manifest file.\npartition_spec_id - ID of a partition spec used to write the manifest; must\nbe listed in table metadata partition-specs.\nadded_snapshot_id - ID of the snapshot where the manifest file was added.\npartitions - A list of field summaries for each partition field in the spec.\nEach field in the list corresponds to a field in the manifest file’s partition\nspec.\nadded_rows_count - Number of rows in all files in the manifest that have\nstatus ADDED, when null this is assumed to be non-zero.\nAs mentioned above, manifest lists hold references to various manifest files.\nThese manifest paths are the pointers in the persistent tree that tells any\nclient using Iceberg where to find all of the manifest files associated with a\nparticular snapshot. To traverse this tree, you can look over the different\nmanifest paths to find all the manifest files associated with the particular\nsnapshot you want to traverse. Partition spec ids are helpful to know the\ncurrent partition specification which are stored in the table metadata in the\nmetastore. This references where to find the spec in the metastore. Added\nsnapshot ids tells you which snapshot is associated with the manifest list.\nPartitions hold some high level partition bound information to make for faster\nquerying. If a query is looking for a particular value, it only traverses the\nmanifest files where the query values fall within the range of the file values.\nFinally, you get a few metrics like the number of changed rows and data files,\none of which is the count of added rows. The first operation consisted of three\nrows inserts and the second operation was the insertion of one row. Using the\nrow counts you can easily determine which manifest file belongs to which\noperation.\nThe following command shows the final snapshot after both operations executed\nand filters out only the fields pointed out above.\n\n% java -jar  ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro | jq '. | {manifest_path: .manifest_path, partition_spec_id: .partition_spec_id, added_snapshot_id: .added_snapshot_id, partitions: .partitions, added_rows_count: .added_rows_count }'\n\n\nResult:\n\n{\n   \"manifest_path\":\"s3a://iceberg/logging.db/events/metadata/23cc980c-9570-42ed-85cf-8658fda2727d-m0.avro\",\n   \"partition_spec_id\":0,\n   \"added_snapshot_id\":{\n      \"long\":4564366177504223700\n   },\n   \"partitions\":{\n      \"array\":[\n         {\n            \"contains_null\":false,\n            \"lower_bound\":{\n               \"bytes\":\"\\u001eI\\u0000\\u0000\"\n            },\n            \"upper_bound\":{\n               \"bytes\":\"\\u001eI\\u0000\\u0000\"\n            }\n         }\n      ]\n   },\n   \"added_rows_count\":{\n      \"long\":1\n   }\n}\n{\n   \"manifest_path\":\"s3a://iceberg/logging.db/events/metadata/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro\",\n   \"partition_spec_id\":0,\n   \"added_snapshot_id\":{\n      \"long\":2720489016575682000\n   },\n   \"partitions\":{\n      \"array\":[\n         {\n            \"contains_null\":false,\n            \"lower_bound\":{\n               \"bytes\":\"\\u001eI\\u0000\\u0000\"\n            },\n            \"upper_bound\":{\n               \"bytes\":\"\\u001fI\\u0000\\u0000\"\n            }\n         }\n      ]\n   },\n   \"added_rows_count\":{\n      \"long\":3\n   }\n}\n\n\nIn the listing of the manifest file related to the last snapshot, you notice the\nfirst operation where three rows were inserted is contained in the manifest file\nin the second JSON object. You can determine this from the snapshot id, as well\nas, the number of rows that were added in the operation. The first JSON object\ncontains the last operation that inserted a single row. So the most recent\noperations are listed in reverse commit order.\nThe next command does the same listing of the file that you ran with the\nmanifest list, except you run this on the manifest files themselves to expose\ntheir contents and discuss them. To begin with, you run the command to show the\ncontents of the manifest file associated with the insertion of three rows.\n\n% java -jar  ~/avro-tools-1.10.0.jar tojson ~/Desktop/avro_files/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro | jq .\n\n\nResult:\n\n{\n   \"status\":1,\n   \"snapshot_id\":{\n      \"long\":2720489016575682000\n   },\n   \"data_file\":{\n      \"file_path\":\"s3a://iceberg/logging.db/events/data/event_time_day=2021-04-01/51eb1ea6-266b-490f-8bca-c63391f02d10.orc\",\n      \"file_format\":\"ORC\",\n      \"partition\":{\n         \"event_time_day\":{\n            \"int\":18718\n         }\n      },\n      \"record_count\":1,\n      \"file_size_in_bytes\":870,\n      \"block_size_in_bytes\":67108864,\n      \"column_sizes\":null,\n      \"value_counts\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":1\n            },\n            {\n               \"key\":2,\n               \"value\":1\n            },\n            {\n               \"key\":3,\n               \"value\":1\n            },\n            {\n               \"key\":4,\n               \"value\":1\n            }\n         ]\n      },\n      \"null_value_counts\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":0\n            },\n            {\n               \"key\":2,\n               \"value\":0\n            },\n            {\n               \"key\":3,\n               \"value\":0\n            },\n            {\n               \"key\":4,\n               \"value\":0\n            }\n         ]\n      },\n      \"nan_value_counts\":null,\n      \"lower_bounds\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":\"ERROR\"\n            },\n            {\n               \"key\":3,\n               \"value\":\"Oh noes\"\n            }\n         ]\n      },\n      \"upper_bounds\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":\"ERROR\"\n            },\n            {\n               \"key\":3,\n               \"value\":\"Oh noes\"\n            }\n         ]\n      },\n      \"key_metadata\":null,\n      \"split_offsets\":null\n   }\n}\n{\n   \"status\":1,\n   \"snapshot_id\":{\n      \"long\":2720489016575682000\n   },\n   \"data_file\":{\n      \"file_path\":\"s3a://iceberg/logging.db/events/data/event_time_day=2021-04-02/b012ec20-bbdd-47f5-89d3-57b9e32ea9eb.orc\",\n      \"file_format\":\"ORC\",\n      \"partition\":{\n         \"event_time_day\":{\n            \"int\":18719\n         }\n      },\n      \"record_count\":2,\n      \"file_size_in_bytes\":1084,\n      \"block_size_in_bytes\":67108864,\n      \"column_sizes\":null,\n      \"value_counts\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":2\n            },\n            {\n               \"key\":2,\n               \"value\":2\n            },\n            {\n               \"key\":3,\n               \"value\":2\n            },\n            {\n               \"key\":4,\n               \"value\":2\n            }\n         ]\n      },\n      \"null_value_counts\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":0\n            },\n            {\n               \"key\":2,\n               \"value\":0\n            },\n            {\n               \"key\":3,\n               \"value\":0\n            },\n            {\n               \"key\":4,\n               \"value\":0\n            }\n         ]\n      },\n      \"nan_value_counts\":null,\n      \"lower_bounds\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":\"ERROR\"\n            },\n            {\n               \"key\":3,\n               \"value\":\"Double oh noes\"\n            }\n         ]\n      },\n      \"upper_bounds\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":\"WARN\"\n            },\n            {\n               \"key\":3,\n               \"value\":\"Maybeh oh noes?\"\n            }\n         ]\n      },\n      \"key_metadata\":null,\n      \"split_offsets\":null\n   }\n}\n\n\nNow this is a very big output, but in summary, there’s really not too much to\nthese files. As before, there is a \nManifest section in the Iceberg spec\nthat details what each of these fields means. Here are the important fields:\nsnapshot_id - Snapshot id where the file was added, or deleted if status is\ntwo. Inherited when null.\ndata_file - Field containing metadata about the data files pertaining to the\nmanifest file, such as file path, partition tuple, metrics, etc…\ndata_file.file_path - Full URI for the file with FS scheme.\ndata_file.partition - Partition data tuple, schema based on the partition\nspec.\ndata_file.record_count - Number of records in the data file.\ndata_file.*_count - Multiple fields that contain a map from column id to \nnumber of values, null, nan counts in the file. These can be used to quickly \nfilter out unnecessary get operations.\ndata_file.*_bounds - Multiple fields that contain a map from column id to\nlower or upper bound in the column serialized as binary. Each value must be less\nthan or equal to all non-null, non-NaN values in the column for the file.\nEach data file struct contains a partition and data file that it maps to. These\nfiles only be scanned and returned if the criteria for the query is met when \nchecking all of the count, bounds, and other statistics that are recorded in the\nfile. Ideally only files that contain data relevant to the query should be\nscanned at all. Having information like the record count may also help in the\nquery planning process to determine splits and other information. This\nparticular optimization hasn’t been completed yet as planning typically happens\nbefore traversal of the files. It is still in ongoing discussion and\nis discussed a bit by Iceberg creator Ryan Blue in a recent meetup.\nIf this is something you are interested in, keep posted on the Slack channel and\nreleases as the Trino Iceberg connector progresses in this area.\nAs mentioned above, the last set of files that you find in the metadata\ndirectory which are suffixed with .metadata.json. These files at baseline are\na bit strange as they aren’t stored in the Avro format, but instead the JSON\nformat. This is because they are not part of the persistent tree structure.\nThese files are essentially a copy of the table metadata that is stored in the\nmetastore. You can find the fields for the table metadata listed\nin the Iceberg specification.\nThese tables are typically stored persistently in a metasture much like the Hive\nmetastore but could easily be replaced by any datastore that can support \nan atomic swap (check-and-put) operation\nrequired for Iceberg to support the optimistic concurrency operation.\nThe naming of the table metadata includes a table version and UUID: \n<table-version>-<UUID>.metadata.json. To commit a new metadata version, which\njust adds 1 to the current version number, the writer performs these steps:\nIt creates a new table metadata file using the current metadata.\nIt writes the new table metadata to a file following the naming with the next\nversion number.\nIt requests the metastore swap the table’s metadata pointer from the old\nlocation to the new location.\nIf the swap succeeds, the commit succeeded. The new file is now the \n current metadata.\nIf the swap fails, another writer has already created their own. The\n current writer goes back to step 1.\nIf you want to see where this is stored in the Hive metastore, you can reference\nthe TABLE_PARAMS table. At the time of writing, this is the only method of\nusing the metastore that is supported by the Trino Iceberg connector.\n\nSELECT PARAM_KEY, PARAM_VALUEFROM metastore.TABLE_PARAMS;\n\n\nResult:\nPARAM_KEY                \n      PARAM_VALUE                                                                                     \n    \nEXTERNAL                 \n      TRUE                                                                                            \n    \nmetadata_location        \n      s3a://iceberg/logging.db/events/metadata/00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json\n    \nnumFiles                 \n      2                                                                                               \n    \nprevious_metadata_location\n      s3a://iceberg/logging.db/events/metadata/00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json\n    \ntable_type               \n      iceberg                                                                                         \n    \ntotalSize                \n      5323                                                                                            \n    \ntransient_lastDdlTime    \n      1622865672                                                                                      \n    \nSo as you can see, the metastore is saying the current metadata location is the\n00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json file. Now you can\ndive in to see the table metadata that is being used by the Iceberg connector.\n\n% cat ~/Desktop/avro_files/00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json\n\n\nResult:\n\n{\n   \"format-version\":1,\n   \"table-uuid\":\"32e3c271-84a9-4be5-9342-2148c878227a\",\n   \"location\":\"s3a://iceberg/logging.db/events\",\n   \"last-updated-ms\":1622865686323,\n   \"last-column-id\":5,\n   \"schema\":{\n      \"type\":\"struct\",\n      \"fields\":[\n         {\n            \"id\":1,\n            \"name\":\"level\",\n            \"required\":false,\n            \"type\":\"string\"\n         },\n         {\n            \"id\":2,\n            \"name\":\"event_time\",\n            \"required\":false,\n            \"type\":\"timestamp\"\n         },\n         {\n            \"id\":3,\n            \"name\":\"message\",\n            \"required\":false,\n            \"type\":\"string\"\n         },\n         {\n            \"id\":4,\n            \"name\":\"call_stack\",\n            \"required\":false,\n            \"type\":{\n               \"type\":\"list\",\n               \"element-id\":5,\n               \"element\":\"string\",\n               \"element-required\":false\n            }\n         }\n      ]\n   },\n   \"partition-spec\":[\n      {\n         \"name\":\"event_time_day\",\n         \"transform\":\"day\",\n         \"source-id\":2,\n         \"field-id\":1000\n      }\n   ],\n   \"default-spec-id\":0,\n   \"partition-specs\":[\n      {\n         \"spec-id\":0,\n         \"fields\":[\n            {\n               \"name\":\"event_time_day\",\n               \"transform\":\"day\",\n               \"source-id\":2,\n               \"field-id\":1000\n            }\n         ]\n      }\n   ],\n   \"default-sort-order-id\":0,\n   \"sort-orders\":[\n      {\n         \"order-id\":0,\n         \"fields\":[\n            \n         ]\n      }\n   ],\n   \"properties\":{\n      \"write.format.default\":\"ORC\"\n   },\n   \"current-snapshot-id\":4564366177504223943,\n   \"snapshots\":[\n      {\n         \"snapshot-id\":6967685587675910019,\n         \"timestamp-ms\":1622865672882,\n         \"summary\":{\n            \"operation\":\"append\",\n            \"changed-partition-count\":\"0\",\n            \"total-records\":\"0\",\n            \"total-data-files\":\"0\",\n            \"total-delete-files\":\"0\",\n            \"total-position-deletes\":\"0\",\n            \"total-equality-deletes\":\"0\"\n         },\n         \"manifest-list\":\"s3a://iceberg/logging.db/events/metadata/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro\"\n      },\n      {\n         \"snapshot-id\":2720489016575682283,\n         \"parent-snapshot-id\":6967685587675910019,\n         \"timestamp-ms\":1622865680419,\n         \"summary\":{\n            \"operation\":\"append\",\n            \"added-data-files\":\"2\",\n            \"added-records\":\"3\",\n            \"added-files-size\":\"1954\",\n            \"changed-partition-count\":\"2\",\n            \"total-records\":\"3\",\n            \"total-data-files\":\"2\",\n            \"total-delete-files\":\"0\",\n            \"total-position-deletes\":\"0\",\n            \"total-equality-deletes\":\"0\"\n         },\n         \"manifest-list\":\"s3a://iceberg/logging.db/events/metadata/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro\"\n      },\n      {\n         \"snapshot-id\":4564366177504223943,\n         \"parent-snapshot-id\":2720489016575682283,\n         \"timestamp-ms\":1622865686278,\n         \"summary\":{\n            \"operation\":\"append\",\n            \"added-data-files\":\"1\",\n            \"added-records\":\"1\",\n            \"added-files-size\":\"746\",\n            \"changed-partition-count\":\"1\",\n            \"total-records\":\"4\",\n            \"total-data-files\":\"3\",\n            \"total-delete-files\":\"0\",\n            \"total-position-deletes\":\"0\",\n            \"total-equality-deletes\":\"0\"\n         },\n         \"manifest-list\":\"s3a://iceberg/logging.db/events/metadata/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro\"\n      }\n   ],\n   \"snapshot-log\":[\n      {\n         \"timestamp-ms\":1622865672882,\n         \"snapshot-id\":6967685587675910019\n      },\n      {\n         \"timestamp-ms\":1622865680419,\n         \"snapshot-id\":2720489016575682283\n      },\n      {\n         \"timestamp-ms\":1622865686278,\n         \"snapshot-id\":4564366177504223943\n      }\n   ],\n   \"metadata-log\":[\n      {\n         \"timestamp-ms\":1622865672894,\n         \"metadata-file\":\"s3a://iceberg/logging.db/events/metadata/00000-c5cfaab4-f82f-4351-b2a5-bd0e241f84bc.metadata.json\"\n      },\n      {\n         \"timestamp-ms\":1622865680524,\n         \"metadata-file\":\"s3a://iceberg/logging.db/events/metadata/00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json\"\n      }\n   ]\n}\n\n\nAs you can see, these JSON files can quickly grow as you perform different\nupdates on your table. This file contains a pointer to all of the snapshots and\nmanifest list files, much like the output you found from looking at the\nsnapshots in the table. A really important piece to note is the schema is stored\nhere. This is what Trino uses for validation on inserts and reads. As you may\nexpect, there is the root location of the table itself, as well as a unique\ntable identifier. The final part I’d like to note about this file is the\npartition-spec and partition-specs fields. The partition-spec field holds the\ncurrent partition spec, while the partition-specs is an array that can hold a\nlist of all partition specs that have existed for this table. As pointed out\nearlier, you can have many different manifest files that use different partition\nspecs. That wraps up all of the metadata file types you can expect to see in\nIceberg!\nThis post wraps up the Trino on ice series. Hopefully these blog posts serve as\na helpful initial dialogue about what is expected to grow as a vital portion of\nan open data lakehouse stack. What are you waiting for? Come join the fun and\nhelp us implement some of the missing features or instead go ahead and try \nTrino on Ice(berg)\nyourself!"
author: "Brian Olsen"
contentHtml: "<div>\n<article>\n  <div><p>\n <img src=\"https://www.starburst.io/assets/blog/trino-on-ice/trino-iceberg.png\">\n</p>\n<p>Welcome to the Trino on ice series, covering the details around how the Iceberg\ntable format works with the Trino query engine. The examples build on each\nprevious post, so it’s recommended to read the posts sequentially and reference\nthem as needed later. Here are links to the posts in this series:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/05/03/a-gentle-introduction-to-iceberg\">Trino on ice I: A gentle introduction to Iceberg</a></li>\n  <li><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/07/12/in-place-table-evolution-and-cloud-compatibility-with-iceberg\">Trino on ice II: In-place table evolution and cloud compatibility with Iceberg</a></li>\n  <li><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/07/30/iceberg-concurrency-snapshots-spec\">Trino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec</a></li>\n  <li><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/08/12/deep-dive-into-iceberg-internals\">Trino on ice IV: Deep dive into Iceberg internals</a></li>\n</ul>\n<p>So far, this series has covered some very interesting user level concepts of the\nIceberg model, and how you can take advantage of them using the Trino query \nengine. This blog post dives into some implementation details of Iceberg by \ndissecting some files that result from various operations carried out using \nTrino. To dissect you must use some surgical instrumentation, namely Trino, Avro\ntools, the MinIO client tool and Iceberg’s core library. It’s useful to dissect\nhow these files work, not only to help understand how Iceberg works, but also to\naid in troubleshooting issues, should you have any issues during ingestion or\nquerying of your Iceberg table. I like to think of this type of debugging much\nlike a fun game of operation, and you’re looking to see what causes the red\nerrors to fly by on your screen.</p>\n<!--more-->\n<p><img src=\"https://www.starburst.io/assets/blog/trino-on-ice/operation.gif\" alt=\"\"></p>\n<p>Iceberg can use any compatible metastore, but for Trino, it only supports the \nHive metastore and AWS Glue similar to the Hive connector. This is because there\nis already a vast amount of testing and support for using the Hive metastore in\nTrino. Likewise, many Trino use cases that currently use data lakes already use\nthe Hive connector and therefore the Hive metastore. This makes it convenient to\nhave as the leading supported use case as existing users can easily migrate\nbetween Hive to Iceberg tables. Since there is no indication of which connector\nis actually executed in the diagram of the Hive connector architecture, it\nserves as a diagram that can be used for both Hive and Iceberg. The only\ndifference is the connector used, but if you create a table in Hive, you can \nview the same table in Iceberg.</p>\n<p><img src=\"https://www.starburst.io/assets/blog/trino-on-ice/iceberg-metadata.png\" alt=\"\"></p>\n<p>To recap the steps taken from the first three blogs; the first blog created an\nevents table, while the first two blogs ran two insert statements. The first\ninsert contained three records, while the second insert contained a single\nrecord.</p>\n<p><img src=\"https://www.starburst.io/assets/blog/trino-on-ice/iceberg-snapshot-files.png\" alt=\"\"></p>\n<p>Up until this point, the state of the files in MinIO haven’t really been shown\nexcept some of the manifest list pointers from the snapshot in the third blog\npost. Using the <a target=\"_blank\" href=\"https://docs.min.io/minio/baremetal/reference/minio-cli/minio-mc.html\">MinIO client tool</a>,\nyou can list files that Iceberg generated through all these operations and then\ntry to understand what purpose they are serving.</p>\n<div><pre><code>% mc tree -f local/\nlocal/\n└─ iceberg\n&#160;&#160;&#160;└─ logging.db\n&#160;&#160;&#160;&#160;&#160;&#160;└─ events\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;├─ data\n &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;│&#160; ├─ event_time_day=2021-04-01\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;│&#160; │&#160; ├─ 51eb1ea6-266b-490f-8bca-c63391f02d10.orc\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;│&#160; │&#160; └─ cbcf052d-240d-4881-8a68-2bbc0f7e5233.orc\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;│&#160; └─ event_time_day=2021-04-02\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;│ &#160; &#160; └─ b012ec20-bbdd-47f5-89d3-57b9e32ea9eb.orc\n&#160;&#160;&#160;&#160;&#160; &#160;&#160;&#160;└─ metadata\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;├─ 00000-c5cfaab4-f82f-4351-b2a5-bd0e241f84bc.metadata.json\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;├─ 00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;├─ 00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;├─ 23cc980c-9570-42ed-85cf-8658fda2727d-m0.avro\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;├─ 92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;├─ snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;├─ snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro\n&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;└─ snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro\n</code></pre></div>\n<p>There are a lot of files here, but here are a couple of patterns that you\ncan observe with these files.</p>\n<p>First, the top two directories are named <code>data</code> and <code>metadata</code>.</p>\n<p><code>/&lt;bucket&gt;/&lt;database&gt;/&lt;table&gt;/data//&lt;bucket&gt;/&lt;database&gt;/&lt;table&gt;/metadata/</code></p>\n<p>As you might expect, <code>data</code> contains the actual ORC files split by partition.\nThis is akin to what you would see in a Hive table <code>data</code> directory. What is\nreally of interest here is the <code>metadata</code> directory. There are specifically\nthree patterns of files you’ll find here.</p>\n<p><code>/&lt;bucket&gt;/&lt;database&gt;/&lt;table&gt;/metadata/&lt;file-id&gt;.avro/&lt;bucket&gt;/&lt;database&gt;/&lt;table&gt;/metadata/snap-&lt;snapshot-id&gt;-&lt;version&gt;-&lt;file-id&gt;.avro</code></p>\n<p><code>/&lt;bucket&gt;/&lt;database&gt;/&lt;table&gt;/metadata/&lt;version&gt;-&lt;commit-UUID&gt;.metadata.json</code></p>\n<p>Iceberg has a persistent tree structure that manages various snapshots of the\ndata that are created for every mutation of the data. This enables not only a\nconcurrency model that supports serializable isolation, but also cool features\nlike time travel across a linear progression of snapshots.</p>\n<p><img src=\"https://www.starburst.io/assets/blog/trino-on-ice/iceberg-metastore-files.png\" alt=\"\"></p>\n<p>This tree structure contains two types of Avro files, manifest lists and\nmanifest files. Manifest list files contain pointers to various manifest files\nand the manifest files themselves point to various data files. This post starts\nout by covering these manifest files, and later covers the table metadata files\nthat are suffixed by <code>.metadata.json</code>.</p>\n<p><a target=\"_blank\" href=\"https://www.starburst.io/blog/2021/07/30/iceberg-concurrency-snapshots-spec\">The last blog covered</a>\nthe command in Trino that shows the snapshot information that is stored in the\nmetastore. Here is that command and its output again for your review.</p>\n<div><pre><code>SELECT&#160;manifest_list&#160;\nFROM&#160;iceberg.logging.\"events$snapshots\";\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>snapshots</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>s3a://iceberg/logging.db/events/metadata/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro</td>\n    </tr>\n    <tr>\n      <td>s3a://iceberg/logging.db/events/metadata/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro</td>\n    </tr>\n    <tr>\n      <td>s3a://iceberg/logging.db/events/metadata/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro</td>\n    </tr>\n  </tbody>\n</table>\n<p>You’ll notice that the manifest list returns the Avro files prefixed with\n<code>snap-</code> are returned. These files are directly correlated with the snapshot\nrecord stored in the metastore. According to the diagram above, snapshots are\nrecords in the metastore that contain the url of the manifest list in the Avro\nfile. Avro files are binary files and not something you can just open up in a\ntext editor to read. Using the \n<a target=\"_blank\" href=\"https://downloads.apache.org/avro/avro-1.10.2/java/avro-tools-1.10.2.jar\">avro-tools.jar tool</a>\ndistributed by the \n<a target=\"_blank\" href=\"https://avro.apache.org/docs/current/index.html\">Apache Avro project</a>,\nyou can actually inspect the contents of this file to get a better understanding\nof how it is used by Iceberg.</p>\n<p>The first snapshot is generated on the creation of the events table. Upon\ninspecting this file, you notice that the file is empty. The output is an\nempty line that the <code>jq</code> JSON command line utility removes on pretty printing\nthe JSON that is returned, which is just a newline. This snapshot represents an\nempty state of the table upon creation. To investigate the snapshots you need to\ndownload the files to your local filesystem. Let’s move them to the home \ndirectory:</p>\n<div><pre><code>% java -jar&#160; ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro | jq .\n</code></pre></div>\n<p>Result (is empty):</p>\n<p>The second snapshot is a little more interesting and actually shows us the \ncontents of a manifest list.</p>\n<div><pre><code>% java -jar&#160; ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro | jq .\n</code></pre></div>\n<p>Result:</p>\n<div><pre><code>{\n   \"manifest_path\":\"s3a://iceberg/logging.db/events/metadata/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro\",\n   \"manifest_length\":6114,\n   \"partition_spec_id\":0,\n   \"added_snapshot_id\":{\n      \"long\":2720489016575682000\n   },\n   \"added_data_files_count\":{\n      \"int\":2\n   },\n   \"existing_data_files_count\":{\n      \"int\":0\n   },\n   \"deleted_data_files_count\":{\n      \"int\":0\n   },\n   \"partitions\":{\n      \"array\":[\n         {\n            \"contains_null\":false,\n            \"lower_bound\":{\n               \"bytes\":\"\\u001eI\\u0000\\u0000\"\n            },\n            \"upper_bound\":{\n               \"bytes\":\"\\u001fI\\u0000\\u0000\"\n            }\n         }\n      ]\n   },\n   \"added_rows_count\":{\n      \"long\":3\n   },\n   \"existing_rows_count\":{\n      \"long\":0\n   },\n   \"deleted_rows_count\":{\n      \"long\":0\n   }\n}\n</code></pre></div>\n<p>To understand each of the values in each of these rows, you can refer to the \nIceberg \n<a target=\"_blank\" href=\"https://iceberg.apache.org/spec/#manifest-lists\">specification in the manifest list file section</a>.\nInstead of covering these exhaustively, let’s focus on a few key fields. Below\nare the fields, and their definition according to the specification.</p>\n<ul>\n  <li><code>manifest_path</code> - Location of the manifest file.</li>\n  <li><code>partition_spec_id</code> - ID of a partition spec used to write the manifest; must\nbe listed in table metadata partition-specs.</li>\n  <li><code>added_snapshot_id</code> - ID of the snapshot where the manifest file was added.</li>\n  <li><code>partitions</code> - A list of field summaries for each partition field in the spec.\nEach field in the list corresponds to a field in the manifest file’s partition\nspec.</li>\n  <li><code>added_rows_count</code> - Number of rows in all files in the manifest that have\nstatus ADDED, when null this is assumed to be non-zero.</li>\n</ul>\n<p>As mentioned above, manifest lists hold references to various manifest files.\nThese manifest paths are the pointers in the persistent tree that tells any\nclient using Iceberg where to find all of the manifest files associated with a\nparticular snapshot. To traverse this tree, you can look over the different\nmanifest paths to find all the manifest files associated with the particular\nsnapshot you want to traverse. Partition spec ids are helpful to know the\ncurrent partition specification which are stored in the table metadata in the\nmetastore. This references where to find the spec in the metastore. Added\nsnapshot ids tells you which snapshot is associated with the manifest list.\nPartitions hold some high level partition bound information to make for faster\nquerying. If a query is looking for a particular value, it only traverses the\nmanifest files where the query values fall within the range of the file values.\nFinally, you get a few metrics like the number of changed rows and data files,\none of which is the count of added rows. The first operation consisted of three\nrows inserts and the second operation was the insertion of one row. Using the\nrow counts you can easily determine which manifest file belongs to which\noperation.</p>\n<p>The following command shows the final snapshot after both operations executed\nand filters out only the fields pointed out above.</p>\n<div><pre><code>% java -jar&#160; ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro | jq&#160;'. | {manifest_path: .manifest_path, partition_spec_id: .partition_spec_id, added_snapshot_id: .added_snapshot_id, partitions: .partitions, added_rows_count: .added_rows_count }'\n</code></pre></div>\n<p>Result:</p>\n<div><pre><code>{\n   \"manifest_path\":\"s3a://iceberg/logging.db/events/metadata/23cc980c-9570-42ed-85cf-8658fda2727d-m0.avro\",\n   \"partition_spec_id\":0,\n   \"added_snapshot_id\":{\n      \"long\":4564366177504223700\n   },\n   \"partitions\":{\n      \"array\":[\n         {\n            \"contains_null\":false,\n            \"lower_bound\":{\n               \"bytes\":\"\\u001eI\\u0000\\u0000\"\n            },\n            \"upper_bound\":{\n               \"bytes\":\"\\u001eI\\u0000\\u0000\"\n            }\n         }\n      ]\n   },\n   \"added_rows_count\":{\n      \"long\":1\n   }\n}\n{\n   \"manifest_path\":\"s3a://iceberg/logging.db/events/metadata/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro\",\n   \"partition_spec_id\":0,\n   \"added_snapshot_id\":{\n      \"long\":2720489016575682000\n   },\n   \"partitions\":{\n      \"array\":[\n         {\n            \"contains_null\":false,\n            \"lower_bound\":{\n               \"bytes\":\"\\u001eI\\u0000\\u0000\"\n            },\n            \"upper_bound\":{\n               \"bytes\":\"\\u001fI\\u0000\\u0000\"\n            }\n         }\n      ]\n   },\n   \"added_rows_count\":{\n      \"long\":3\n   }\n}\n</code></pre></div>\n<p>In the listing of the manifest file related to the last snapshot, you notice the\nfirst operation where three rows were inserted is contained in the manifest file\nin the second JSON object. You can determine this from the snapshot id, as well\nas, the number of rows that were added in the operation. The first JSON object\ncontains the last operation that inserted a single row. So the most recent\noperations are listed in reverse commit order.</p>\n<p>The next command does the same listing of the file that you ran with the\nmanifest list, except you run this on the manifest files themselves to expose\ntheir contents and discuss them. To begin with, you run the command to show the\ncontents of the manifest file associated with the insertion of three rows.</p>\n<div><pre><code>% java -jar&#160; ~/avro-tools-1.10.0.jar tojson ~/Desktop/avro_files/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro | jq .\n</code></pre></div>\n<p>Result:</p>\n<div><pre><code>{\n   \"status\":1,\n   \"snapshot_id\":{\n      \"long\":2720489016575682000\n   },\n   \"data_file\":{\n      \"file_path\":\"s3a://iceberg/logging.db/events/data/event_time_day=2021-04-01/51eb1ea6-266b-490f-8bca-c63391f02d10.orc\",\n      \"file_format\":\"ORC\",\n      \"partition\":{\n         \"event_time_day\":{\n            \"int\":18718\n         }\n      },\n      \"record_count\":1,\n      \"file_size_in_bytes\":870,\n      \"block_size_in_bytes\":67108864,\n      \"column_sizes\":null,\n      \"value_counts\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":1\n            },\n            {\n               \"key\":2,\n               \"value\":1\n            },\n            {\n               \"key\":3,\n               \"value\":1\n            },\n            {\n               \"key\":4,\n               \"value\":1\n            }\n         ]\n      },\n      \"null_value_counts\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":0\n            },\n            {\n               \"key\":2,\n               \"value\":0\n            },\n            {\n               \"key\":3,\n               \"value\":0\n            },\n            {\n               \"key\":4,\n               \"value\":0\n            }\n         ]\n      },\n      \"nan_value_counts\":null,\n      \"lower_bounds\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":\"ERROR\"\n            },\n            {\n               \"key\":3,\n               \"value\":\"Oh noes\"\n            }\n         ]\n      },\n      \"upper_bounds\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":\"ERROR\"\n            },\n            {\n               \"key\":3,\n               \"value\":\"Oh noes\"\n            }\n         ]\n      },\n      \"key_metadata\":null,\n      \"split_offsets\":null\n   }\n}\n{\n   \"status\":1,\n   \"snapshot_id\":{\n      \"long\":2720489016575682000\n   },\n   \"data_file\":{\n      \"file_path\":\"s3a://iceberg/logging.db/events/data/event_time_day=2021-04-02/b012ec20-bbdd-47f5-89d3-57b9e32ea9eb.orc\",\n      \"file_format\":\"ORC\",\n      \"partition\":{\n         \"event_time_day\":{\n            \"int\":18719\n         }\n      },\n      \"record_count\":2,\n      \"file_size_in_bytes\":1084,\n      \"block_size_in_bytes\":67108864,\n      \"column_sizes\":null,\n      \"value_counts\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":2\n            },\n            {\n               \"key\":2,\n               \"value\":2\n            },\n            {\n               \"key\":3,\n               \"value\":2\n            },\n            {\n               \"key\":4,\n               \"value\":2\n            }\n         ]\n      },\n      \"null_value_counts\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":0\n            },\n            {\n               \"key\":2,\n               \"value\":0\n            },\n            {\n               \"key\":3,\n               \"value\":0\n            },\n            {\n               \"key\":4,\n               \"value\":0\n            }\n         ]\n      },\n      \"nan_value_counts\":null,\n      \"lower_bounds\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":\"ERROR\"\n            },\n            {\n               \"key\":3,\n               \"value\":\"Double oh noes\"\n            }\n         ]\n      },\n      \"upper_bounds\":{\n         \"array\":[\n            {\n               \"key\":1,\n               \"value\":\"WARN\"\n            },\n            {\n               \"key\":3,\n               \"value\":\"Maybeh oh noes?\"\n            }\n         ]\n      },\n      \"key_metadata\":null,\n      \"split_offsets\":null\n   }\n}\n</code></pre></div>\n<p>Now this is a very big output, but in summary, there’s really not too much to\nthese files. As before, there is a \n<a target=\"_blank\" href=\"https://iceberg.apache.org/spec/#manifests\">Manifest section in the Iceberg spec</a>\nthat details what each of these fields means. Here are the important fields:</p>\n<ul>\n  <li><code>snapshot_id</code> - Snapshot id where the file was added, or deleted if status is\ntwo. Inherited when null.</li>\n  <li><code>data_file</code> - Field containing metadata about the data files pertaining to the\nmanifest file, such as file path, partition tuple, metrics, etc…</li>\n  <li><code>data_file.file_path</code> - Full URI for the file with FS scheme.</li>\n  <li><code>data_file.partition</code> - Partition data tuple, schema based on the partition\nspec.</li>\n  <li><code>data_file.record_count</code> - Number of records in the data file.</li>\n  <li><code>data_file.*_count</code> - Multiple fields that contain a map from column id to \nnumber of values, null, nan counts in the file. These can be used to quickly \nfilter out unnecessary get operations.</li>\n  <li><code>data_file.*_bounds</code> - Multiple fields that contain a map from column id to\nlower or upper bound in the column serialized as binary. Each value must be less\nthan or equal to all non-null, non-NaN values in the column for the file.</li>\n</ul>\n<p>Each data file struct contains a partition and data file that it maps to. These\nfiles only be scanned and returned if the criteria for the query is met when \nchecking all of the count, bounds, and other statistics that are recorded in the\nfile. Ideally only files that contain data relevant to the query should be\nscanned at all. Having information like the record count may also help in the\nquery planning process to determine splits and other information. This\nparticular optimization hasn’t been completed yet as planning typically happens\nbefore traversal of the files. It is still in ongoing discussion and\n<a target=\"_blank\" href=\"https://youtu.be/ifXpOn0NJWk?t=2132\">is discussed a bit by Iceberg creator Ryan Blue in a recent meetup</a>.\nIf this is something you are interested in, keep posted on the Slack channel and\nreleases as the Trino Iceberg connector progresses in this area.</p>\n<p>As mentioned above, the last set of files that you find in the metadata\ndirectory which are suffixed with <code>.metadata.json</code>. These files at baseline are\na bit strange as they aren’t stored in the Avro format, but instead the JSON\nformat. This is because they are not part of the persistent tree structure.\nThese files are essentially a copy of the table metadata that is stored in the\nmetastore. You can find the fields for the table metadata listed\n<a target=\"_blank\" href=\"https://iceberg.apache.org/spec/#table-metadata-fields\">in the Iceberg specification</a>.\nThese tables are typically stored persistently in a metasture much like the Hive\nmetastore but could easily be replaced by any datastore that can support \n<a target=\"_blank\" href=\"https://iceberg.apache.org/spec/#metastore-tables\">an atomic swap (check-and-put) operation</a>\nrequired for Iceberg to support the optimistic concurrency operation.</p>\n<p>The naming of the table metadata includes a table version and UUID: \n<code>&lt;table-version&gt;-&lt;UUID&gt;.metadata.json</code>. To commit a new metadata version, which\njust adds 1 to the current version number, the writer performs these steps:</p>\n<ol>\n  <li>It creates a new table metadata file using the current metadata.</li>\n  <li>It writes the new table metadata to a file following the naming with the next\nversion number.</li>\n  <li>\n    <p>It requests the metastore swap the table’s metadata pointer from the old\nlocation to the new location.</p>\n    <ol>\n      <li>If the swap succeeds, the commit succeeded. The new file is now the \n current metadata.</li>\n      <li>If the swap fails, another writer has already created their own. The\n current writer goes back to step 1.</li>\n    </ol>\n  </li>\n</ol>\n<p>If you want to see where this is stored in the Hive metastore, you can reference\nthe <code>TABLE_PARAMS</code> table. At the time of writing, this is the only method of\nusing the metastore that is supported by the Trino Iceberg connector.</p>\n<div><pre><code>SELECT&#160;PARAM_KEY, PARAM_VALUEFROM&#160;metastore.TABLE_PARAMS;\n</code></pre></div>\n<p>Result:</p>\n<table>\n  <thead>\n    <tr>\n      <th>PARAM_KEY &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</th>\n      <th>PARAM_VALUE&#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>EXTERNAL&#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n      <td>TRUE &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n    </tr>\n    <tr>\n      <td>metadata_location &#160; &#160; &#160; &#160;</td>\n      <td>s3a://iceberg/logging.db/events/metadata/00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json</td>\n    </tr>\n    <tr>\n      <td>numFiles&#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n      <td>2&#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n    </tr>\n    <tr>\n      <td>previous_metadata_location</td>\n      <td>s3a://iceberg/logging.db/events/metadata/00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json</td>\n    </tr>\n    <tr>\n      <td>table_type&#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n      <td>iceberg&#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n    </tr>\n    <tr>\n      <td>totalSize &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n      <td>5323 &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n    </tr>\n    <tr>\n      <td>transient_lastDdlTime &#160; &#160;</td>\n      <td>1622865672 &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160; &#160;</td>\n    </tr>\n  </tbody>\n</table>\n<p>So as you can see, the metastore is saying the current metadata location is the\n<code>00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json</code> file. Now you can\ndive in to see the table metadata that is being used by the Iceberg connector.</p>\n<div><pre><code>% cat ~/Desktop/avro_files/00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json\n</code></pre></div>\n<p>Result:</p>\n<div><pre><code>{\n   \"format-version\":1,\n   \"table-uuid\":\"32e3c271-84a9-4be5-9342-2148c878227a\",\n   \"location\":\"s3a://iceberg/logging.db/events\",\n   \"last-updated-ms\":1622865686323,\n   \"last-column-id\":5,\n   \"schema\":{\n      \"type\":\"struct\",\n      \"fields\":[\n         {\n            \"id\":1,\n            \"name\":\"level\",\n            \"required\":false,\n            \"type\":\"string\"\n         },\n         {\n            \"id\":2,\n            \"name\":\"event_time\",\n            \"required\":false,\n            \"type\":\"timestamp\"\n         },\n         {\n            \"id\":3,\n            \"name\":\"message\",\n            \"required\":false,\n            \"type\":\"string\"\n         },\n         {\n            \"id\":4,\n            \"name\":\"call_stack\",\n            \"required\":false,\n            \"type\":{\n               \"type\":\"list\",\n               \"element-id\":5,\n               \"element\":\"string\",\n               \"element-required\":false\n            }\n         }\n      ]\n   },\n   \"partition-spec\":[\n      {\n         \"name\":\"event_time_day\",\n         \"transform\":\"day\",\n         \"source-id\":2,\n         \"field-id\":1000\n      }\n   ],\n   \"default-spec-id\":0,\n   \"partition-specs\":[\n      {\n         \"spec-id\":0,\n         \"fields\":[\n            {\n               \"name\":\"event_time_day\",\n               \"transform\":\"day\",\n               \"source-id\":2,\n               \"field-id\":1000\n            }\n         ]\n      }\n   ],\n   \"default-sort-order-id\":0,\n   \"sort-orders\":[\n      {\n         \"order-id\":0,\n         \"fields\":[\n         ]\n      }\n   ],\n   \"properties\":{\n      \"write.format.default\":\"ORC\"\n   },\n   \"current-snapshot-id\":4564366177504223943,\n   \"snapshots\":[\n      {\n         \"snapshot-id\":6967685587675910019,\n         \"timestamp-ms\":1622865672882,\n         \"summary\":{\n            \"operation\":\"append\",\n            \"changed-partition-count\":\"0\",\n            \"total-records\":\"0\",\n            \"total-data-files\":\"0\",\n            \"total-delete-files\":\"0\",\n            \"total-position-deletes\":\"0\",\n            \"total-equality-deletes\":\"0\"\n         },\n         \"manifest-list\":\"s3a://iceberg/logging.db/events/metadata/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro\"\n      },\n      {\n         \"snapshot-id\":2720489016575682283,\n         \"parent-snapshot-id\":6967685587675910019,\n         \"timestamp-ms\":1622865680419,\n         \"summary\":{\n            \"operation\":\"append\",\n            \"added-data-files\":\"2\",\n            \"added-records\":\"3\",\n            \"added-files-size\":\"1954\",\n            \"changed-partition-count\":\"2\",\n            \"total-records\":\"3\",\n            \"total-data-files\":\"2\",\n            \"total-delete-files\":\"0\",\n            \"total-position-deletes\":\"0\",\n            \"total-equality-deletes\":\"0\"\n         },\n         \"manifest-list\":\"s3a://iceberg/logging.db/events/metadata/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro\"\n      },\n      {\n         \"snapshot-id\":4564366177504223943,\n         \"parent-snapshot-id\":2720489016575682283,\n         \"timestamp-ms\":1622865686278,\n         \"summary\":{\n            \"operation\":\"append\",\n            \"added-data-files\":\"1\",\n            \"added-records\":\"1\",\n            \"added-files-size\":\"746\",\n            \"changed-partition-count\":\"1\",\n            \"total-records\":\"4\",\n            \"total-data-files\":\"3\",\n            \"total-delete-files\":\"0\",\n            \"total-position-deletes\":\"0\",\n            \"total-equality-deletes\":\"0\"\n         },\n         \"manifest-list\":\"s3a://iceberg/logging.db/events/metadata/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro\"\n      }\n   ],\n   \"snapshot-log\":[\n      {\n         \"timestamp-ms\":1622865672882,\n         \"snapshot-id\":6967685587675910019\n      },\n      {\n         \"timestamp-ms\":1622865680419,\n         \"snapshot-id\":2720489016575682283\n      },\n      {\n         \"timestamp-ms\":1622865686278,\n         \"snapshot-id\":4564366177504223943\n      }\n   ],\n   \"metadata-log\":[\n      {\n         \"timestamp-ms\":1622865672894,\n         \"metadata-file\":\"s3a://iceberg/logging.db/events/metadata/00000-c5cfaab4-f82f-4351-b2a5-bd0e241f84bc.metadata.json\"\n      },\n      {\n         \"timestamp-ms\":1622865680524,\n         \"metadata-file\":\"s3a://iceberg/logging.db/events/metadata/00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json\"\n      }\n   ]\n}\n</code></pre></div>\n<p>As you can see, these JSON files can quickly grow as you perform different\nupdates on your table. This file contains a pointer to all of the snapshots and\nmanifest list files, much like the output you found from looking at the\nsnapshots in the table. A really important piece to note is the schema is stored\nhere. This is what Trino uses for validation on inserts and reads. As you may\nexpect, there is the root location of the table itself, as well as a unique\ntable identifier. The final part I’d like to note about this file is the\npartition-spec and partition-specs fields. The partition-spec field holds the\ncurrent partition spec, while the partition-specs is an array that can hold a\nlist of all partition specs that have existed for this table. As pointed out\nearlier, you can have many different manifest files that use different partition\nspecs. That wraps up all of the metadata file types you can expect to see in\nIceberg!</p>\n<p>This post wraps up the Trino on ice series. Hopefully these blog posts serve as\na helpful initial dialogue about what is expected to grow as a vital portion of\nan open data lakehouse stack. What are you waiting for? Come join the fun and\nhelp us implement some of the missing features or instead go ahead and try \n<a target=\"_blank\" href=\"https://github.com/bitsondatadev/trino-getting-started/tree/main/iceberg/trino-iceberg-minio\">Trino on Ice(berg)</a>\nyourself!</p>\n  </div>\n</article>\n</div>"
---

Welcome to the Trino on ice series, covering the details around how the Iceberg
table format works with the Trino query engine. The examples build on each
previous post, so it’s recommended to read the posts sequentially and reference
them as needed later. Here are links to the posts in this series:
Trino on ice I: A gentle introduction to Iceberg
Trino on ice II: In-place table evolution and cloud compatibility with Iceberg
Trino on ice III: Iceberg concurrency model, snapshots, and the Iceberg spec
Trino on ice IV: Deep dive into Iceberg internals
So far, this series has covered some very interesting user level concepts of the
Iceberg model, and how you can take advantage of them using the Trino query 
engine. This blog post dives into some implementation details of Iceberg by 
dissecting some files that result from various operations carried out using 
Trino. To dissect you must use some surgical instrumentation, namely Trino, Avro
tools, the MinIO client tool and Iceberg’s core library. It’s useful to dissect
how these files work, not only to help understand how Iceberg works, but also to
aid in troubleshooting issues, should you have any issues during ingestion or
querying of your Iceberg table. I like to think of this type of debugging much
like a fun game of operation, and you’re looking to see what causes the red
errors to fly by on your screen.

Understanding Iceberg metadata
Iceberg can use any compatible metastore, but for Trino, it only supports the 
Hive metastore and AWS Glue similar to the Hive connector. This is because there
is already a vast amount of testing and support for using the Hive metastore in
Trino. Likewise, many Trino use cases that currently use data lakes already use
the Hive connector and therefore the Hive metastore. This makes it convenient to
have as the leading supported use case as existing users can easily migrate
between Hive to Iceberg tables. Since there is no indication of which connector
is actually executed in the diagram of the Hive connector architecture, it
serves as a diagram that can be used for both Hive and Iceberg. The only
difference is the connector used, but if you create a table in Hive, you can 
view the same table in Iceberg.

To recap the steps taken from the first three blogs; the first blog created an
events table, while the first two blogs ran two insert statements. The first
insert contained three records, while the second insert contained a single
record.

Up until this point, the state of the files in MinIO haven’t really been shown
except some of the manifest list pointers from the snapshot in the third blog
post. Using the MinIO client tool,
you can list files that Iceberg generated through all these operations and then
try to understand what purpose they are serving.

% mc tree -f local/
local/
└─ iceberg
   └─ logging.db
      └─ events
         ├─ data
         │  ├─ event_time_day=2021-04-01
         │  │  ├─ 51eb1ea6-266b-490f-8bca-c63391f02d10.orc
         │  │  └─ cbcf052d-240d-4881-8a68-2bbc0f7e5233.orc
         │  └─ event_time_day=2021-04-02
         │     └─ b012ec20-bbdd-47f5-89d3-57b9e32ea9eb.orc
         └─ metadata
            ├─ 00000-c5cfaab4-f82f-4351-b2a5-bd0e241f84bc.metadata.json
            ├─ 00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json
            ├─ 00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json
            ├─ 23cc980c-9570-42ed-85cf-8658fda2727d-m0.avro
            ├─ 92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro
            ├─ snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro
            ├─ snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro
            └─ snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro


There are a lot of files here, but here are a couple of patterns that you
can observe with these files.
First, the top two directories are named data and metadata.
/<bucket>/<database>/<table>/data//<bucket>/<database>/<table>/metadata/
As you might expect, data contains the actual ORC files split by partition.
This is akin to what you would see in a Hive table data directory. What is
really of interest here is the metadata directory. There are specifically
three patterns of files you’ll find here.
/<bucket>/<database>/<table>/metadata/<file-id>.avro/<bucket>/<database>/<table>/metadata/snap-<snapshot-id>-<version>-<file-id>.avro
/<bucket>/<database>/<table>/metadata/<version>-<commit-UUID>.metadata.json
Iceberg has a persistent tree structure that manages various snapshots of the
data that are created for every mutation of the data. This enables not only a
concurrency model that supports serializable isolation, but also cool features
like time travel across a linear progression of snapshots.

This tree structure contains two types of Avro files, manifest lists and
manifest files. Manifest list files contain pointers to various manifest files
and the manifest files themselves point to various data files. This post starts
out by covering these manifest files, and later covers the table metadata files
that are suffixed by .metadata.json.
The last blog covered
the command in Trino that shows the snapshot information that is stored in the
metastore. Here is that command and its output again for your review.

SELECT manifest_list 
FROM iceberg.logging."events$snapshots";


Result:
snapshots
    
s3a://iceberg/logging.db/events/metadata/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro
    
s3a://iceberg/logging.db/events/metadata/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro
    
s3a://iceberg/logging.db/events/metadata/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro
    
You’ll notice that the manifest list returns the Avro files prefixed with
snap- are returned. These files are directly correlated with the snapshot
record stored in the metastore. According to the diagram above, snapshots are
records in the metastore that contain the url of the manifest list in the Avro
file. Avro files are binary files and not something you can just open up in a
text editor to read. Using the 
avro-tools.jar tool
distributed by the 
Apache Avro project,
you can actually inspect the contents of this file to get a better understanding
of how it is used by Iceberg.
The first snapshot is generated on the creation of the events table. Upon
inspecting this file, you notice that the file is empty. The output is an
empty line that the jq JSON command line utility removes on pretty printing
the JSON that is returned, which is just a newline. This snapshot represents an
empty state of the table upon creation. To investigate the snapshots you need to
download the files to your local filesystem. Let’s move them to the home 
directory:

% java -jar  ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro | jq .


Result (is empty):




The second snapshot is a little more interesting and actually shows us the 
contents of a manifest list.

% java -jar  ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro | jq .


Result:

{
   "manifest_path":"s3a://iceberg/logging.db/events/metadata/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro",
   "manifest_length":6114,
   "partition_spec_id":0,
   "added_snapshot_id":{
      "long":2720489016575682000
   },
   "added_data_files_count":{
      "int":2
   },
   "existing_data_files_count":{
      "int":0
   },
   "deleted_data_files_count":{
      "int":0
   },
   "partitions":{
      "array":[
         {
            "contains_null":false,
            "lower_bound":{
               "bytes":"\u001eI\u0000\u0000"
            },
            "upper_bound":{
               "bytes":"\u001fI\u0000\u0000"
            }
         }
      ]
   },
   "added_rows_count":{
      "long":3
   },
   "existing_rows_count":{
      "long":0
   },
   "deleted_rows_count":{
      "long":0
   }
}


To understand each of the values in each of these rows, you can refer to the 
Iceberg 
specification in the manifest list file section.
Instead of covering these exhaustively, let’s focus on a few key fields. Below
are the fields, and their definition according to the specification.
manifest_path - Location of the manifest file.
partition_spec_id - ID of a partition spec used to write the manifest; must
be listed in table metadata partition-specs.
added_snapshot_id - ID of the snapshot where the manifest file was added.
partitions - A list of field summaries for each partition field in the spec.
Each field in the list corresponds to a field in the manifest file’s partition
spec.
added_rows_count - Number of rows in all files in the manifest that have
status ADDED, when null this is assumed to be non-zero.
As mentioned above, manifest lists hold references to various manifest files.
These manifest paths are the pointers in the persistent tree that tells any
client using Iceberg where to find all of the manifest files associated with a
particular snapshot. To traverse this tree, you can look over the different
manifest paths to find all the manifest files associated with the particular
snapshot you want to traverse. Partition spec ids are helpful to know the
current partition specification which are stored in the table metadata in the
metastore. This references where to find the spec in the metastore. Added
snapshot ids tells you which snapshot is associated with the manifest list.
Partitions hold some high level partition bound information to make for faster
querying. If a query is looking for a particular value, it only traverses the
manifest files where the query values fall within the range of the file values.
Finally, you get a few metrics like the number of changed rows and data files,
one of which is the count of added rows. The first operation consisted of three
rows inserts and the second operation was the insertion of one row. Using the
row counts you can easily determine which manifest file belongs to which
operation.
The following command shows the final snapshot after both operations executed
and filters out only the fields pointed out above.

% java -jar  ~/Desktop/avro_files/avro-tools-1.10.0.jar tojson ~/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro | jq '. | {manifest_path: .manifest_path, partition_spec_id: .partition_spec_id, added_snapshot_id: .added_snapshot_id, partitions: .partitions, added_rows_count: .added_rows_count }'


Result:

{
   "manifest_path":"s3a://iceberg/logging.db/events/metadata/23cc980c-9570-42ed-85cf-8658fda2727d-m0.avro",
   "partition_spec_id":0,
   "added_snapshot_id":{
      "long":4564366177504223700
   },
   "partitions":{
      "array":[
         {
            "contains_null":false,
            "lower_bound":{
               "bytes":"\u001eI\u0000\u0000"
            },
            "upper_bound":{
               "bytes":"\u001eI\u0000\u0000"
            }
         }
      ]
   },
   "added_rows_count":{
      "long":1
   }
}
{
   "manifest_path":"s3a://iceberg/logging.db/events/metadata/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro",
   "partition_spec_id":0,
   "added_snapshot_id":{
      "long":2720489016575682000
   },
   "partitions":{
      "array":[
         {
            "contains_null":false,
            "lower_bound":{
               "bytes":"\u001eI\u0000\u0000"
            },
            "upper_bound":{
               "bytes":"\u001fI\u0000\u0000"
            }
         }
      ]
   },
   "added_rows_count":{
      "long":3
   }
}


In the listing of the manifest file related to the last snapshot, you notice the
first operation where three rows were inserted is contained in the manifest file
in the second JSON object. You can determine this from the snapshot id, as well
as, the number of rows that were added in the operation. The first JSON object
contains the last operation that inserted a single row. So the most recent
operations are listed in reverse commit order.
The next command does the same listing of the file that you ran with the
manifest list, except you run this on the manifest files themselves to expose
their contents and discuss them. To begin with, you run the command to show the
contents of the manifest file associated with the insertion of three rows.

% java -jar  ~/avro-tools-1.10.0.jar tojson ~/Desktop/avro_files/92382234-a4a6-4a1b-bc9b-24839472c2f6-m0.avro | jq .


Result:

{
   "status":1,
   "snapshot_id":{
      "long":2720489016575682000
   },
   "data_file":{
      "file_path":"s3a://iceberg/logging.db/events/data/event_time_day=2021-04-01/51eb1ea6-266b-490f-8bca-c63391f02d10.orc",
      "file_format":"ORC",
      "partition":{
         "event_time_day":{
            "int":18718
         }
      },
      "record_count":1,
      "file_size_in_bytes":870,
      "block_size_in_bytes":67108864,
      "column_sizes":null,
      "value_counts":{
         "array":[
            {
               "key":1,
               "value":1
            },
            {
               "key":2,
               "value":1
            },
            {
               "key":3,
               "value":1
            },
            {
               "key":4,
               "value":1
            }
         ]
      },
      "null_value_counts":{
         "array":[
            {
               "key":1,
               "value":0
            },
            {
               "key":2,
               "value":0
            },
            {
               "key":3,
               "value":0
            },
            {
               "key":4,
               "value":0
            }
         ]
      },
      "nan_value_counts":null,
      "lower_bounds":{
         "array":[
            {
               "key":1,
               "value":"ERROR"
            },
            {
               "key":3,
               "value":"Oh noes"
            }
         ]
      },
      "upper_bounds":{
         "array":[
            {
               "key":1,
               "value":"ERROR"
            },
            {
               "key":3,
               "value":"Oh noes"
            }
         ]
      },
      "key_metadata":null,
      "split_offsets":null
   }
}
{
   "status":1,
   "snapshot_id":{
      "long":2720489016575682000
   },
   "data_file":{
      "file_path":"s3a://iceberg/logging.db/events/data/event_time_day=2021-04-02/b012ec20-bbdd-47f5-89d3-57b9e32ea9eb.orc",
      "file_format":"ORC",
      "partition":{
         "event_time_day":{
            "int":18719
         }
      },
      "record_count":2,
      "file_size_in_bytes":1084,
      "block_size_in_bytes":67108864,
      "column_sizes":null,
      "value_counts":{
         "array":[
            {
               "key":1,
               "value":2
            },
            {
               "key":2,
               "value":2
            },
            {
               "key":3,
               "value":2
            },
            {
               "key":4,
               "value":2
            }
         ]
      },
      "null_value_counts":{
         "array":[
            {
               "key":1,
               "value":0
            },
            {
               "key":2,
               "value":0
            },
            {
               "key":3,
               "value":0
            },
            {
               "key":4,
               "value":0
            }
         ]
      },
      "nan_value_counts":null,
      "lower_bounds":{
         "array":[
            {
               "key":1,
               "value":"ERROR"
            },
            {
               "key":3,
               "value":"Double oh noes"
            }
         ]
      },
      "upper_bounds":{
         "array":[
            {
               "key":1,
               "value":"WARN"
            },
            {
               "key":3,
               "value":"Maybeh oh noes?"
            }
         ]
      },
      "key_metadata":null,
      "split_offsets":null
   }
}


Now this is a very big output, but in summary, there’s really not too much to
these files. As before, there is a 
Manifest section in the Iceberg spec
that details what each of these fields means. Here are the important fields:
snapshot_id - Snapshot id where the file was added, or deleted if status is
two. Inherited when null.
data_file - Field containing metadata about the data files pertaining to the
manifest file, such as file path, partition tuple, metrics, etc…
data_file.file_path - Full URI for the file with FS scheme.
data_file.partition - Partition data tuple, schema based on the partition
spec.
data_file.record_count - Number of records in the data file.
data_file.*_count - Multiple fields that contain a map from column id to 
number of values, null, nan counts in the file. These can be used to quickly 
filter out unnecessary get operations.
data_file.*_bounds - Multiple fields that contain a map from column id to
lower or upper bound in the column serialized as binary. Each value must be less
than or equal to all non-null, non-NaN values in the column for the file.
Each data file struct contains a partition and data file that it maps to. These
files only be scanned and returned if the criteria for the query is met when 
checking all of the count, bounds, and other statistics that are recorded in the
file. Ideally only files that contain data relevant to the query should be
scanned at all. Having information like the record count may also help in the
query planning process to determine splits and other information. This
particular optimization hasn’t been completed yet as planning typically happens
before traversal of the files. It is still in ongoing discussion and
is discussed a bit by Iceberg creator Ryan Blue in a recent meetup.
If this is something you are interested in, keep posted on the Slack channel and
releases as the Trino Iceberg connector progresses in this area.
As mentioned above, the last set of files that you find in the metadata
directory which are suffixed with .metadata.json. These files at baseline are
a bit strange as they aren’t stored in the Avro format, but instead the JSON
format. This is because they are not part of the persistent tree structure.
These files are essentially a copy of the table metadata that is stored in the
metastore. You can find the fields for the table metadata listed
in the Iceberg specification.
These tables are typically stored persistently in a metasture much like the Hive
metastore but could easily be replaced by any datastore that can support 
an atomic swap (check-and-put) operation
required for Iceberg to support the optimistic concurrency operation.
The naming of the table metadata includes a table version and UUID: 
<table-version>-<UUID>.metadata.json. To commit a new metadata version, which
just adds 1 to the current version number, the writer performs these steps:
It creates a new table metadata file using the current metadata.
It writes the new table metadata to a file following the naming with the next
version number.
It requests the metastore swap the table’s metadata pointer from the old
location to the new location.
If the swap succeeds, the commit succeeded. The new file is now the 
 current metadata.
If the swap fails, another writer has already created their own. The
 current writer goes back to step 1.
If you want to see where this is stored in the Hive metastore, you can reference
the TABLE_PARAMS table. At the time of writing, this is the only method of
using the metastore that is supported by the Trino Iceberg connector.

SELECT PARAM_KEY, PARAM_VALUEFROM metastore.TABLE_PARAMS;


Result:
PARAM_KEY                
      PARAM_VALUE                                                                                     
    
EXTERNAL                 
      TRUE                                                                                            
    
metadata_location        
      s3a://iceberg/logging.db/events/metadata/00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json
    
numFiles                 
      2                                                                                               
    
previous_metadata_location
      s3a://iceberg/logging.db/events/metadata/00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json
    
table_type               
      iceberg                                                                                         
    
totalSize                
      5323                                                                                            
    
transient_lastDdlTime    
      1622865672                                                                                      
    
So as you can see, the metastore is saying the current metadata location is the
00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json file. Now you can
dive in to see the table metadata that is being used by the Iceberg connector.

% cat ~/Desktop/avro_files/00002-33d69acc-94cb-44bc-b2a1-71120e749d9a.metadata.json


Result:

{
   "format-version":1,
   "table-uuid":"32e3c271-84a9-4be5-9342-2148c878227a",
   "location":"s3a://iceberg/logging.db/events",
   "last-updated-ms":1622865686323,
   "last-column-id":5,
   "schema":{
      "type":"struct",
      "fields":[
         {
            "id":1,
            "name":"level",
            "required":false,
            "type":"string"
         },
         {
            "id":2,
            "name":"event_time",
            "required":false,
            "type":"timestamp"
         },
         {
            "id":3,
            "name":"message",
            "required":false,
            "type":"string"
         },
         {
            "id":4,
            "name":"call_stack",
            "required":false,
            "type":{
               "type":"list",
               "element-id":5,
               "element":"string",
               "element-required":false
            }
         }
      ]
   },
   "partition-spec":[
      {
         "name":"event_time_day",
         "transform":"day",
         "source-id":2,
         "field-id":1000
      }
   ],
   "default-spec-id":0,
   "partition-specs":[
      {
         "spec-id":0,
         "fields":[
            {
               "name":"event_time_day",
               "transform":"day",
               "source-id":2,
               "field-id":1000
            }
         ]
      }
   ],
   "default-sort-order-id":0,
   "sort-orders":[
      {
         "order-id":0,
         "fields":[
            
         ]
      }
   ],
   "properties":{
      "write.format.default":"ORC"
   },
   "current-snapshot-id":4564366177504223943,
   "snapshots":[
      {
         "snapshot-id":6967685587675910019,
         "timestamp-ms":1622865672882,
         "summary":{
            "operation":"append",
            "changed-partition-count":"0",
            "total-records":"0",
            "total-data-files":"0",
            "total-delete-files":"0",
            "total-position-deletes":"0",
            "total-equality-deletes":"0"
         },
         "manifest-list":"s3a://iceberg/logging.db/events/metadata/snap-6967685587675910019-1-bcbe9133-c51c-42a9-9c73-f5b745702cb0.avro"
      },
      {
         "snapshot-id":2720489016575682283,
         "parent-snapshot-id":6967685587675910019,
         "timestamp-ms":1622865680419,
         "summary":{
            "operation":"append",
            "added-data-files":"2",
            "added-records":"3",
            "added-files-size":"1954",
            "changed-partition-count":"2",
            "total-records":"3",
            "total-data-files":"2",
            "total-delete-files":"0",
            "total-position-deletes":"0",
            "total-equality-deletes":"0"
         },
         "manifest-list":"s3a://iceberg/logging.db/events/metadata/snap-2720489016575682283-1-92382234-a4a6-4a1b-bc9b-24839472c2f6.avro"
      },
      {
         "snapshot-id":4564366177504223943,
         "parent-snapshot-id":2720489016575682283,
         "timestamp-ms":1622865686278,
         "summary":{
            "operation":"append",
            "added-data-files":"1",
            "added-records":"1",
            "added-files-size":"746",
            "changed-partition-count":"1",
            "total-records":"4",
            "total-data-files":"3",
            "total-delete-files":"0",
            "total-position-deletes":"0",
            "total-equality-deletes":"0"
         },
         "manifest-list":"s3a://iceberg/logging.db/events/metadata/snap-4564366177504223943-1-23cc980c-9570-42ed-85cf-8658fda2727d.avro"
      }
   ],
   "snapshot-log":[
      {
         "timestamp-ms":1622865672882,
         "snapshot-id":6967685587675910019
      },
      {
         "timestamp-ms":1622865680419,
         "snapshot-id":2720489016575682283
      },
      {
         "timestamp-ms":1622865686278,
         "snapshot-id":4564366177504223943
      }
   ],
   "metadata-log":[
      {
         "timestamp-ms":1622865672894,
         "metadata-file":"s3a://iceberg/logging.db/events/metadata/00000-c5cfaab4-f82f-4351-b2a5-bd0e241f84bc.metadata.json"
      },
      {
         "timestamp-ms":1622865680524,
         "metadata-file":"s3a://iceberg/logging.db/events/metadata/00001-27c8c2d1-fdbb-429d-9263-3654d818250e.metadata.json"
      }
   ]
}


As you can see, these JSON files can quickly grow as you perform different
updates on your table. This file contains a pointer to all of the snapshots and
manifest list files, much like the output you found from looking at the
snapshots in the table. A really important piece to note is the schema is stored
here. This is what Trino uses for validation on inserts and reads. As you may
expect, there is the root location of the table itself, as well as a unique
table identifier. The final part I’d like to note about this file is the
partition-spec and partition-specs fields. The partition-spec field holds the
current partition spec, while the partition-specs is an array that can hold a
list of all partition specs that have existed for this table. As pointed out
earlier, you can have many different manifest files that use different partition
specs. That wraps up all of the metadata file types you can expect to see in
Iceberg!
This post wraps up the Trino on ice series. Hopefully these blog posts serve as
a helpful initial dialogue about what is expected to grow as a vital portion of
an open data lakehouse stack. What are you waiting for? Come join the fun and
help us implement some of the missing features or instead go ahead and try 
Trino on Ice(berg)
yourself!
