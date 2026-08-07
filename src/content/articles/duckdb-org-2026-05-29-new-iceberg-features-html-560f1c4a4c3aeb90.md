---
title: "New DuckDB-Iceberg Features in v1.5.3"
link: "https://duckdb.org/2026/05/29/new-iceberg-features.html"
guid: "https://duckdb.org/2026/05/29/new-iceberg-features.html"
pubDate: "2026-05-29T00:00:00.000Z"
site_name: "DuckDB"
site_feed: "https://duckdb.org/feed.xml"
category: "Data"
summary: "Despite the work required to develop the features needed for DuckLake v1.0 and Quack, the DuckLabs team is still hard at work on the DuckDB-Iceberg extension.\nIn this blog post, we will demonstrate some of the features that are available in DuckDB v1.5.3. Many of these features were earmarked for a future release in our last Iceberg-themed blog post “Writes in DuckDB-Iceberg” – you can think of this post as “Part 2” to that blog post.\nGetting Started\nTo experiment with the new DuckDB-Iceberg features, you will need to connect to your favorite Iceberg REST Catalog. There are many ways to do so: please have a look at the Connecting to REST Catalogs page, which has instructions for catalogs such as Apache Polaris and Lakekeeper. If you would like to connect to Amazon S3 Tables, please consult the Connecting to S3 Tables page. In any case, your ATTACH command will look something like this:\n\nATTACH 'warehouse_name' AS my_datalake (\n    TYPE iceberg,\n    other options\n);\n\n\nMERGE INTO Support\nDuckDB's MERGE INTO statement is the recommended way to express upserts when the target table does not have a primary key – which is the case for all lakehouse formats.\nWith v1.5.3, MERGE INTO is now fully supported against Iceberg tables. You can apply a change set to an Iceberg table in a single statement, deciding per row whether to insert, update or delete.\nLet's take this table for example:\n\nCREATE TABLE my_datalake.default.people (\n    id INTEGER,\n    name VARCHAR,\n    salary FLOAT\n);\nINSERT INTO my_datalake.default.people\n    VALUES (1, 'John', 92_000.0), (2, 'Anna', 100_000.0);\n\n\n\n┌───────┬─────────┬──────────┐\n│  id   │  name   │  salary  │\n│ int32 │ varchar │  float   │\n├───────┼─────────┼──────────┤\n│     1 │ John    │  92000.0 │\n│     2 │ Anna    │ 100000.0 │\n└───────┴─────────┴──────────┘\n\n\nLet's run an update on this table with two records, one increasing person 1's salary and another adding a new person with id 3.\n\nMERGE INTO my_datalake.default.people AS target\n    USING (\n        FROM (VALUES\n            (1, 'John', 105_000.0),\n            (3, 'Sarah', 95_000.0)\n        ) t(id, name, salary)\n    ) AS upserts\n    ON (upserts.id = target.id)\n    WHEN MATCHED THEN UPDATE\n    WHEN NOT MATCHED THEN INSERT;\n\n\nWhen querying the result, we get the following:\n\nSELECT *\nFROM my_datalake.default.people\nORDER BY id;\n\n\n\n┌───────┬─────────┬──────────┐\n│  id   │  name   │  salary  │\n│ int32 │ varchar │  float   │\n├───────┼─────────┼──────────┤\n│     1 │ John    │ 105000.0 │\n│     2 │ Anna    │ 100000.0 │\n│     3 │ Sarah   │  95000.0 │\n└───────┴─────────┴──────────┘\n\n\nYou can also combine matched and unmatched branches with WHEN MATCHED THEN DELETE to express a delete set in the same statement. As with UPDATE and DELETE, MERGE INTO uses merge-on-read semantics and writes positional deletes to the Iceberg table.\nALTER TABLE Support\nIn DuckDB v1.4's Iceberg extension, the lack of schema evolution of Iceberg tables was a documented limitation.\nIn v1.5.3, the ALTER TABLE statement is now supported against Iceberg tables, covering the most common schema-evolution operations.\n\n-- Create the table\nCREATE TABLE my_datalake.default.simple_table AS\n    FROM (VALUES\n        (1, 'Andy'),\n        (2, 'Bob'),\n        (3, 'Claire'),\n        (4, 'Mr. Duck')) t(col1, col2);\n\n-- Rename the table\nALTER TABLE my_datalake.default.simple_table\n    RENAME TO renamed_table;\n\n-- Add a column\nALTER TABLE my_datalake.default.renamed_table\n    ADD COLUMN col3 DOUBLE;\n\n-- Rename a column\nALTER TABLE my_datalake.default.renamed_table\n    RENAME COLUMN col2 TO name;\n\n-- Drop a column\nALTER TABLE my_datalake.default.renamed_table\n    DROP COLUMN col3;\n\n-- Set the format-version\nALTER TABLE my_datalake.default.renamed_table\n    SET ('format-version' = 3);\n\n\nIf we query the table after the schema changes, we get the following:\n\nSELECT *\nFROM my_datalake.default.renamed_table\nORDER BY col1;\n\n\n\n┌───────┬──────────┐\n│ col1  │   name   │\n│ int32 │ varchar  │\n├───────┼──────────┤\n│     1 │ Andy     │\n│     2 │ Bob      │\n│     3 │ Claire   │\n│     4 │ Mr. Duck │\n└───────┴──────────┘\n\n\nIn the background, each ALTER TABLE statement updates the current-schema-id of the Iceberg table. The changes are visible to other Iceberg-aware engines the next time they query the LoadTableInformation endpoint. Iceberg schema evolution is metadata-only, so no data files are rewritten.\ntruncate and bucket Support\nThe Iceberg specification defines several partition transforms that determine how data files are laid out on disk. In v1.5.3, DuckDB-Iceberg supports creating, inserting into, and updating tables that use the bucket and truncate partition transforms.\nThe bucket(N, col) transform hashes the column's value into N buckets, which is useful when you want stable partitioning on a high-cardinality column. truncate(W, col) groups rows by the first W characters (or by the column's value rounded down to a multiple of W for numeric columns), which is useful for prefix-based partitioning.\n\nCREATE TABLE my_datalake.default.events (\n    event_id BIGINT,\n    user_id BIGINT,\n    country VARCHAR,\n    payload VARCHAR\n)\nPARTITIONED BY (bucket(16, user_id), truncate(2, country));\n\nINSERT INTO my_datalake.default.events\n    VALUES\n        (1, 1001, 'United States', 'click'),\n        (2, 1002, 'United Kingdom', 'view'),\n        (3, 1003, 'Germany', 'click'),\n        (4, 1004, 'Netherlands', 'view');\n\n\nYou can inspect the resulting data files to verify the partitioning:\n\nSELECT file_path, record_count\nFROM iceberg_metadata(my_datalake.default.events)\nWHERE content = 'EXISTING';\n\n\nUpdates and deletes against bucket- and truncate-partitioned tables are also supported, using positional deletes under merge-on-read semantics.\nIceberg Schema Properties\nIceberg catalogs allow arbitrary key-value properties to be attached at the schema (namespace) level. These properties are typically used to record ownership, descriptions, default storage locations, or any other metadata that applies to every table in a schema.\niceberg_schema_properties\nset_iceberg_schema_properties\nremove_iceberg_schema_properties\nYou can use them as follows:\n\n-- to set schema properties\nCALL set_iceberg_schema_properties(my_datalake.default, {\n    'owner': 'analytics-team',\n    'description': 'Default analytics schema'\n});\n-- to read schema properties\nSELECT * FROM iceberg_schema_properties(my_datalake.default);\n\n\n\n┌─────────────┬──────────────────────────┐\n│     key     │          value           │\n│   varchar   │         varchar          │\n├─────────────┼──────────────────────────┤\n│ owner       │ analytics-team           │\n│ description │ Default analytics schema │\n└─────────────┴──────────────────────────┘\n\n\n\n-- to remove schema properties\nCALL remove_iceberg_schema_properties(\n    my_datalake.default,\n    ['description']\n);\n\n\nSchema properties are written through the Iceberg REST Catalog, so any other Iceberg-aware engine attached to the same catalog will see the updates immediately. The returned value is the number of remaining schema properties.\nV3 Support\nThe Iceberg v3 specification introduces several new features that DuckDB-Iceberg now supports for both reads and writes:\nVARIANT and TIMESTAMP_NS data types\nSchema-level default values for columns\nBinary deletion vectors\nRow lineage tracking\nThe biggest change in practice is binary deletion vectors. In v2 tables, DuckDB-Iceberg writes positional deletes as Parquet files; in v3 tables, the same information is encoded as a much more compact binary deletion vector (Puffin file). DuckDB picks the right format automatically based on the table's format-version.\nYou can create a v3 table by setting the format-version table property at creation time:\n\nCREATE TABLE my_datalake.default.v3_table\nWITH ('format-version' = 3) AS\n    FROM (VALUES\n        (1, {'kind': 'click', 'x': 10}::VARIANT, TIMESTAMP_NS '2026-05-20 12:00:00.123456789'),\n        (2, {'kind': 'view'}::VARIANT, TIMESTAMP_NS '2026-05-20 12:00:00.987654321')\n    ) t(id, payload, event_time);\n\n-- Deletes against a v3 table are written as binary deletion vectors\nDELETE FROM my_datalake.default.v3_table\nWHERE id = 1;\n\nSELECT * FROM my_datalake.default.v3_table;\n\n\n\n┌───────┬──────────────────┬───────────────────────────────┐\n│  id   │     payload      │          event_time           │\n│ int32 │     variant      │         timestamp_ns          │\n├───────┼──────────────────┼───────────────────────────────┤\n│     2 │ {\"kind\": \"view\"} │ 2026-05-20 12:00:00.987654321 │\n└───────┴──────────────────┴───────────────────────────────┘\n\n\nLooking at the metadata for the table confirms that the delete was written as a deletion vector rather than as a positional-delete Parquet file:\n\nSELECT manifest_content, content, file_format\nFROM iceberg_metadata(my_datalake.default.v3_table);\n\n\n\n┌──────────────────┬──────────────────┬─────────────┐\n│ manifest_content │     content      │ file_format │\n│     varchar      │     varchar      │   varchar   │\n├──────────────────┼──────────────────┼─────────────┤\n│ DATA             │ EXISTING         │ parquet     │\n│ DELETE           │ POSITION_DELETES │ puffin      │\n└──────────────────┴──────────────────┴─────────────┘\n\n\nThe Geography type and Unknown type are not yet supported in DuckDB-Iceberg; we are planning to add those in DuckDB v2.0.0.\nConclusion and Future Work\nWith these features, DuckDB-Iceberg has closed many of the gaps called out in the previous blog post: partitioned writes, schema evolution, MERGE INTO, and many Iceberg v3 features are now available. There is still more to come, and as always, if you would like to see a specific feature prioritized, please reach out to us in the DuckDB-Iceberg GitHub repository or get in touch with our engineers."
author: "Tom Ebergen, Thijs Bruineman"
contentHtml: "<div>\n\t\t\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t\t\t\t<p><span>Tom Ebergen, Thijs Bruineman</span></p><p><span>2026-05-29</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>·</span>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span>5 min</span>\n\t\t\t\t\t\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p><em>TL;DR: DuckDB-Iceberg now has a number of new features supporting Iceberg Tables and Iceberg REST Catalogs: <code>MERGE INTO</code>, <code>ALTER TABLE</code>, partition transforms, V3 support, and others!</em></p>\n\t\t\t\t\t\t\t\t<p>Despite the work required to develop the features needed for DuckLake v1.0 and Quack, the DuckLabs team is still hard at work on the <a target=\"_blank\" href=\"https://duckdb.org/docs/current/core_extensions/iceberg/overview.html\">DuckDB-Iceberg extension</a>.\nIn this blog post, we will demonstrate some of the features that are available in <a target=\"_blank\" href=\"https://duckdb.org/2026/05/20/announcing-duckdb-153.html\">DuckDB v1.5.3</a>. Many of these features were earmarked for a future release in our last Iceberg-themed blog post <a target=\"_blank\" href=\"https://duckdb.org/2025/11/28/iceberg-writes-in-duckdb.html\">“Writes in DuckDB-Iceberg”</a> – you can think of this post as “Part 2” to that blog post.</p>\n      <h2 id=\"getting-started\">\n        <a target=\"_blank\" href=\"https://duckdb.org/2026/05/29/new-iceberg-features.html#getting-started\">Getting Started</a>\n      </h2>\n<p>To experiment with the new DuckDB-Iceberg features, you will need to connect to your favorite Iceberg REST Catalog. There are many ways to do so: please have a look at the <a target=\"_blank\" href=\"https://duckdb.org/docs/current/core_extensions/iceberg/catalogs.html\">Connecting to REST Catalogs page</a>, which has instructions for catalogs such as <a target=\"_blank\" href=\"https://polaris.apache.org/\">Apache Polaris</a> and <a target=\"_blank\" href=\"https://lakekeeper.io/\">Lakekeeper</a>. If you would like to connect to <a target=\"_blank\" href=\"https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables.html\">Amazon S3 Tables</a>, please consult the <a target=\"_blank\" href=\"https://duckdb.org/docs/current/core_extensions/iceberg/catalogs.html#amazon-s3-tables\">Connecting to S3 Tables page</a>. In any case, your <code>ATTACH</code> command will look something like this:</p>\n<div><pre><code><span>ATTACH</span> <span>'</span><span>warehouse_name</span><span>'</span> <span>AS</span> <span>my_datalake</span> <span>(</span>\n    <span>TYPE</span> <span>iceberg</span><span>,</span>\n    <span>other options</span>\n<span>);</span>\n</code></pre></div>\n      <h2 id=\"merge-into-support\">\n        <a target=\"_blank\" href=\"https://duckdb.org/2026/05/29/new-iceberg-features.html#merge-into-support\"><code>MERGE INTO</code> Support</a>\n      </h2>\n<p>DuckDB's <a target=\"_blank\" href=\"https://duckdb.org/docs/current/sql/statements/merge_into.html\"><code>MERGE INTO</code></a> statement is the recommended way to express upserts when the target table does not have a primary key – which is the case for all <a target=\"_blank\" href=\"https://duckdb.org/docs/current/lakehouse_formats.html\">lakehouse formats</a>.\nWith v1.5.3, <code>MERGE INTO</code> is now fully supported against Iceberg tables. You can apply a change set to an Iceberg table in a single statement, deciding per row whether to insert, update or delete.</p>\n<p>Let's take this table for example:</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>my_datalake.default.people</span> <span>(</span>\n    <span>id</span> <span>INTEGER</span><span>,</span>\n    <span>name</span> <span>VARCHAR</span><span>,</span>\n    <span>salary</span> <span>FLOAT</span>\n<span>);</span>\n<span>INSERT</span> <span>INTO</span> <span>my_datalake.default.people</span>\n    <span>VALUES</span> <span>(</span><span>1</span><span>,</span> <span>'John'</span><span>,</span> <span>92_000.0</span><span>),</span> <span>(</span><span>2</span><span>,</span> <span>'Anna'</span><span>,</span> <span>100_000.0</span><span>);</span>\n</code></pre></div>\n<div><pre><code>┌───────┬─────────┬──────────┐\n│  id   │  name   │  salary  │\n│ int32 │ varchar │  float   │\n├───────┼─────────┼──────────┤\n│     1 │ John    │  92000.0 │\n│     2 │ Anna    │ 100000.0 │\n└───────┴─────────┴──────────┘\n</code></pre></div>\n<p>Let's run an update on this table with two records, one increasing person 1's salary and another adding a new person with id 3.</p>\n<div><pre><code><span>MERGE</span> <span>INTO</span> <span>my_datalake.default.people</span> <span>AS</span> <span>target</span>\n    <span>USING</span> <span>(</span>\n        <span>FROM</span> <span>(</span><span>VALUES</span>\n            <span>(</span><span>1</span><span>,</span> <span>'John'</span><span>,</span> <span>105_000.0</span><span>),</span>\n            <span>(</span><span>3</span><span>,</span> <span>'Sarah'</span><span>,</span> <span>95_000.0</span><span>)</span>\n        <span>)</span> <span>t</span><span>(</span><span>id</span><span>,</span> <span>name</span><span>,</span> <span>salary</span><span>)</span>\n    <span>)</span> <span>AS</span> <span>upserts</span>\n    <span>ON</span> <span>(</span><span>upserts.id</span> <span>=</span> <span>target.id</span><span>)</span>\n    <span>WHEN</span> <span>MATCHED</span> <span>THEN</span> <span>UPDATE</span>\n    <span>WHEN</span> <span>NOT</span> <span>MATCHED</span> <span>THEN</span> <span>INSERT</span><span>;</span>\n</code></pre></div>\n<p>When querying the result, we get the following:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>my_datalake.default.people</span>\n<span>ORDER</span> <span>BY</span> <span>id</span><span>;</span>\n</code></pre></div>\n<div><pre><code>┌───────┬─────────┬──────────┐\n│  id   │  name   │  salary  │\n│ int32 │ varchar │  float   │\n├───────┼─────────┼──────────┤\n│     1 │ John    │ 105000.0 │\n│     2 │ Anna    │ 100000.0 │\n│     3 │ Sarah   │  95000.0 │\n└───────┴─────────┴──────────┘\n</code></pre></div>\n<p>You can also combine matched and unmatched branches with <code>WHEN MATCHED THEN DELETE</code> to express a delete set in the same statement. As with <code>UPDATE</code> and <code>DELETE</code>, <code>MERGE INTO</code> uses merge-on-read semantics and writes positional deletes to the Iceberg table.</p>\n      <h2 id=\"alter-table-support\">\n        <a target=\"_blank\" href=\"https://duckdb.org/2026/05/29/new-iceberg-features.html#alter-table-support\"><code>ALTER TABLE</code> Support</a>\n      </h2>\n<p>In DuckDB v1.4's Iceberg extension, the lack of schema evolution of Iceberg tables was a <a target=\"_blank\" href=\"https://duckdb.org/docs/lts/core_extensions/iceberg/iceberg_rest_catalogs.html#unsupported-operations\">documented limitation</a>.\nIn v1.5.3, the <code>ALTER TABLE</code> statement is now supported against Iceberg tables, covering the most common schema-evolution operations.</p>\n<div><pre><code><span>-- Create the table</span>\n<span>CREATE</span> <span>TABLE</span> <span>my_datalake.default.simple_table</span> <span>AS</span>\n    <span>FROM</span> <span>(</span><span>VALUES</span>\n        <span>(</span><span>1</span><span>,</span> <span>'Andy'</span><span>),</span>\n        <span>(</span><span>2</span><span>,</span> <span>'Bob'</span><span>),</span>\n        <span>(</span><span>3</span><span>,</span> <span>'Claire'</span><span>),</span>\n        <span>(</span><span>4</span><span>,</span> <span>'Mr. Duck'</span><span>))</span> <span>t</span><span>(</span><span>col1</span><span>,</span> <span>col2</span><span>);</span>\n<span>-- Rename the table</span>\n<span>ALTER</span> <span>TABLE</span> <span>my_datalake.default.simple_table</span>\n    <span>RENAME</span> <span>TO</span> <span>renamed_table</span><span>;</span>\n<span>-- Add a column</span>\n<span>ALTER</span> <span>TABLE</span> <span>my_datalake.default.renamed_table</span>\n    <span>ADD</span> <span>COLUMN</span> <span>col3</span> <span>DOUBLE</span><span>;</span>\n<span>-- Rename a column</span>\n<span>ALTER</span> <span>TABLE</span> <span>my_datalake.default.renamed_table</span>\n    <span>RENAME</span> <span>COLUMN</span> <span>col2</span> <span>TO</span> <span>name</span><span>;</span>\n<span>-- Drop a column</span>\n<span>ALTER</span> <span>TABLE</span> <span>my_datalake.default.renamed_table</span>\n    <span>DROP</span> <span>COLUMN</span> <span>col3</span><span>;</span>\n<span>-- Set the format-version</span>\n<span>ALTER</span> <span>TABLE</span> <span>my_datalake.default.renamed_table</span>\n    <span>SET</span> <span>(</span><span>'format-version'</span> <span>=</span> <span>3</span><span>);</span>\n</code></pre></div>\n<p>If we query the table after the schema changes, we get the following:</p>\n<div><pre><code><span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>my_datalake.default.renamed_table</span>\n<span>ORDER</span> <span>BY</span> <span>col1</span><span>;</span>\n</code></pre></div>\n<div><pre><code>┌───────┬──────────┐\n│ col1  │   name   │\n│ int32 │ varchar  │\n├───────┼──────────┤\n│     1 │ Andy     │\n│     2 │ Bob      │\n│     3 │ Claire   │\n│     4 │ Mr. Duck │\n└───────┴──────────┘\n</code></pre></div>\n<p>In the background, each <code>ALTER TABLE</code> statement updates the <code>current-schema-id</code> of the Iceberg table. The changes are visible to other Iceberg-aware engines the next time they query the <code>LoadTableInformation</code> endpoint. Iceberg schema evolution is metadata-only, so no data files are rewritten.</p>\n      <h2 id=\"truncate-and-bucket-support\">\n        <a target=\"_blank\" href=\"https://duckdb.org/2026/05/29/new-iceberg-features.html#truncate-and-bucket-support\"><code>truncate</code> and <code>bucket</code> Support</a>\n      </h2>\n<p>The Iceberg specification defines several <a target=\"_blank\" href=\"https://iceberg.apache.org/spec/#partition-transforms\">partition transforms</a> that determine how data files are laid out on disk. In v1.5.3, DuckDB-Iceberg supports creating, inserting into, and updating tables that use the <code>bucket</code> and <code>truncate</code> partition transforms.</p>\n<p>The <code>bucket(N, col)</code> transform hashes the column's value into <code>N</code> buckets, which is useful when you want stable partitioning on a high-cardinality column. <code>truncate(W, col)</code> groups rows by the first <code>W</code> characters (or by the column's value rounded down to a multiple of <code>W</code> for numeric columns), which is useful for prefix-based partitioning.</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>my_datalake.default.events</span> <span>(</span>\n    <span>event_id</span> <span>BIGINT</span><span>,</span>\n    <span>user_id</span> <span>BIGINT</span><span>,</span>\n    <span>country</span> <span>VARCHAR</span><span>,</span>\n    <span>payload</span> <span>VARCHAR</span>\n<span>)</span>\n<span>PARTITIONED</span> <span>BY</span> <span>(</span><span>bucket</span><span>(</span><span>16</span><span>,</span> <span>user_id</span><span>),</span> <span>truncate</span><span>(</span><span>2</span><span>,</span> <span>country</span><span>));</span>\n<span>INSERT</span> <span>INTO</span> <span>my_datalake.default.events</span>\n    <span>VALUES</span>\n        <span>(</span><span>1</span><span>,</span> <span>1001</span><span>,</span> <span>'United States'</span><span>,</span> <span>'click'</span><span>),</span>\n        <span>(</span><span>2</span><span>,</span> <span>1002</span><span>,</span> <span>'United Kingdom'</span><span>,</span> <span>'view'</span><span>),</span>\n        <span>(</span><span>3</span><span>,</span> <span>1003</span><span>,</span> <span>'Germany'</span><span>,</span> <span>'click'</span><span>),</span>\n        <span>(</span><span>4</span><span>,</span> <span>1004</span><span>,</span> <span>'Netherlands'</span><span>,</span> <span>'view'</span><span>);</span>\n</code></pre></div>\n<p>You can inspect the resulting data files to verify the partitioning:</p>\n<div><pre><code><span>SELECT</span> <span>file_path</span><span>,</span> <span>record_count</span>\n<span>FROM</span> <span>iceberg_metadata</span><span>(</span><span>my_datalake.default.events</span><span>)</span>\n<span>WHERE</span> <span>content</span> <span>=</span> <span>'EXISTING'</span><span>;</span>\n</code></pre></div>\n<p>Updates and deletes against bucket- and truncate-partitioned tables are also supported, using positional deletes under merge-on-read semantics.</p>\n      <h2 id=\"iceberg-schema-properties\">\n        <a target=\"_blank\" href=\"https://duckdb.org/2026/05/29/new-iceberg-features.html#iceberg-schema-properties\">Iceberg Schema Properties</a>\n      </h2>\n<p>Iceberg catalogs allow arbitrary key-value <a target=\"_blank\" href=\"https://iceberg.apache.org/spec/#namespaces\">properties</a> to be attached at the schema (namespace) level. These properties are typically used to record ownership, descriptions, default storage locations, or any other metadata that applies to every table in a schema.</p>\n<ul>\n  <li><code>iceberg_schema_properties</code></li>\n  <li><code>set_iceberg_schema_properties</code></li>\n  <li><code>remove_iceberg_schema_properties</code></li>\n</ul>\n<p>You can use them as follows:</p>\n<div><pre><code><span>-- to set schema properties</span>\n<span>CALL</span> <span>set_iceberg_schema_properties</span><span>(</span><span>my_datalake.default</span><span>,</span> <span>{</span>\n    <span>'owner'</span><span>:</span> <span>'analytics-team'</span><span>,</span>\n    <span>'description'</span><span>:</span> <span>'Default analytics schema'</span>\n<span>});</span>\n<span>-- to read schema properties</span>\n<span>SELECT</span> <span>*</span> <span>FROM</span> <span>iceberg_schema_properties</span><span>(</span><span>my_datalake.default</span><span>);</span>\n</code></pre></div>\n<div><pre><code>┌─────────────┬──────────────────────────┐\n│     key     │          value           │\n│   varchar   │         varchar          │\n├─────────────┼──────────────────────────┤\n│ owner       │ analytics-team           │\n│ description │ Default analytics schema │\n└─────────────┴──────────────────────────┘\n</code></pre></div>\n<div><pre><code><span>-- to remove schema properties</span>\n<span>CALL</span> <span>remove_iceberg_schema_properties</span><span>(</span>\n    <span>my_datalake.default</span><span>,</span>\n    <span>[</span><span>'description'</span><span>]</span>\n<span>);</span>\n</code></pre></div>\n<p>Schema properties are written through the Iceberg REST Catalog, so any other Iceberg-aware engine attached to the same catalog will see the updates immediately. The returned value is the number of remaining schema properties.</p>\n      <h2 id=\"v3-support\">\n        <a target=\"_blank\" href=\"https://duckdb.org/2026/05/29/new-iceberg-features.html#v3-support\">V3 Support</a>\n      </h2>\n<p>The <a target=\"_blank\" href=\"https://iceberg.apache.org/spec/#version-3\">Iceberg v3 specification</a> introduces several new features that DuckDB-Iceberg now supports for both reads and writes:</p>\n<ul>\n  <li><code>VARIANT</code> and <code>TIMESTAMP_NS</code> data types</li>\n  <li>Schema-level <a target=\"_blank\" href=\"https://iceberg.apache.org/spec/#default-values\">default values</a> for columns</li>\n  <li>Binary deletion vectors</li>\n  <li>Row lineage tracking</li>\n</ul>\n<p>The biggest change in practice is binary deletion vectors. In v2 tables, DuckDB-Iceberg writes positional deletes as Parquet files; in v3 tables, the same information is encoded as a much more compact binary deletion vector (<a target=\"_blank\" href=\"https://iceberg.apache.org/puffin-spec/\">Puffin file</a>). DuckDB picks the right format automatically based on the table's <code>format-version</code>.</p>\n<p>You can create a v3 table by setting the <code>format-version</code> table property at creation time:</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>my_datalake.default.v3_table</span>\n<span>WITH</span> <span>(</span><span>'format-version'</span> <span>=</span> <span>3</span><span>)</span> <span>AS</span>\n    <span>FROM</span> <span>(</span><span>VALUES</span>\n        <span>(</span><span>1</span><span>,</span> <span>{</span><span>'kind'</span><span>:</span> <span>'click'</span><span>,</span> <span>'x'</span><span>:</span> <span>10</span><span>}::</span><span>VARIANT</span><span>,</span> <span>TIMESTAMP_NS</span> <span>'2026-05-20 12:00:00.123456789'</span><span>),</span>\n        <span>(</span><span>2</span><span>,</span> <span>{</span><span>'kind'</span><span>:</span> <span>'view'</span><span>}::</span><span>VARIANT</span><span>,</span> <span>TIMESTAMP_NS</span> <span>'2026-05-20 12:00:00.987654321'</span><span>)</span>\n    <span>)</span> <span>t</span><span>(</span><span>id</span><span>,</span> <span>payload</span><span>,</span> <span>event_time</span><span>);</span>\n<span>-- Deletes against a v3 table are written as binary deletion vectors</span>\n<span>DELETE</span> <span>FROM</span> <span>my_datalake.default.v3_table</span>\n<span>WHERE</span> <span>id</span> <span>=</span> <span>1</span><span>;</span>\n<span>SELECT</span> <span>*</span> <span>FROM</span> <span>my_datalake.default.v3_table</span><span>;</span>\n</code></pre></div>\n<div><pre><code>┌───────┬──────────────────┬───────────────────────────────┐\n│  id   │     payload      │          event_time           │\n│ int32 │     variant      │         timestamp_ns          │\n├───────┼──────────────────┼───────────────────────────────┤\n│     2 │ {\"kind\": \"view\"} │ 2026-05-20 12:00:00.987654321 │\n└───────┴──────────────────┴───────────────────────────────┘\n</code></pre></div>\n<p>Looking at the metadata for the table confirms that the delete was written as a deletion vector rather than as a positional-delete Parquet file:</p>\n<div><pre><code><span>SELECT</span> <span>manifest_content</span><span>,</span> <span>content</span><span>,</span> <span>file_format</span>\n<span>FROM</span> <span>iceberg_metadata</span><span>(</span><span>my_datalake.default.v3_table</span><span>);</span>\n</code></pre></div>\n<div><pre><code>┌──────────────────┬──────────────────┬─────────────┐\n│ manifest_content │     content      │ file_format │\n│     varchar      │     varchar      │   varchar   │\n├──────────────────┼──────────────────┼─────────────┤\n│ DATA             │ EXISTING         │ parquet     │\n│ DELETE           │ POSITION_DELETES │ puffin      │\n└──────────────────┴──────────────────┴─────────────┘\n</code></pre></div>\n<blockquote>\n  <p>The Geography type and Unknown type are not yet supported in DuckDB-Iceberg; we are planning to add those in DuckDB v2.0.0.</p>\n</blockquote>\n      <h2 id=\"conclusion-and-future-work\">\n        <a target=\"_blank\" href=\"https://duckdb.org/2026/05/29/new-iceberg-features.html#conclusion-and-future-work\">Conclusion and Future Work</a>\n      </h2>\n<p>With these features, DuckDB-Iceberg has closed many of the gaps called out in the <a target=\"_blank\" href=\"https://duckdb.org/2025/11/28/iceberg-writes-in-duckdb.html\">previous blog post</a>: partitioned writes, schema evolution, <code>MERGE INTO</code>, and many Iceberg v3 features are now available. There is still more to come, and as always, if you would like to see a specific feature prioritized, please reach out to us in the <a target=\"_blank\" href=\"https://github.com/duckdb/duckdb-iceberg\">DuckDB-Iceberg GitHub repository</a> or <a target=\"_blank\" href=\"https://ducklabs.com/contact/\">get in touch</a> with our engineers.</p>\n\t\t\t\t\t\t\t</div><div>\n\t\t<h2>\n\t\t\t\tRecent Posts\n\t\t</h2>\n\t\t<div>\n<div>\n\t<p><img src=\"https://duckdb.org/images/blog/thumbs/github-40k-stars.svg\" alt=\"Thank You for 40 000 Stars on GitHub\">\n\t</p>\n\t<div>\n\t\t<h3>Thank You for 40&#160;000 Stars on GitHub</h3>\n\t\t\t<div>\n\t\t\t\t\t<svg />\n\t\t\t\t<p><span>The DuckDB team</span></p>\n\t\t\t</div>\n\t</div>\n</div>\n<div>\n\t<p><img src=\"https://duckdb.org/images/blog/thumbs/async.svg\" alt=\"Asynchronous I/O in DuckDB: Work, Thread, Work\">\n\t</p>\n\t<div>\n\t\t<h3>Asynchronous I/O in DuckDB: Work, Thread, Work</h3>\n\t\t\t<div>\n\t\t\t\t\t<p><img src=\"https://duckdb.org/images/blog/authors/pedro_holanda.jpg\" alt=\"\"></p><p><span>Pedro Holanda</span></p>\n\t\t\t</div>\n\t</div>\n</div>\n<div>\n\t<p><img src=\"https://duckdb.org/images/blog/thumbs/duckdb-release-1-5-5.svg\" alt=\"Announcing DuckDB 1.5.5\">\n\t</p>\n\t<div>\n\t\t<h3>Announcing DuckDB 1.5.5</h3>\n\t\t\t<div>\n\t\t\t\t\t<svg />\n\t\t\t\t<p><span>The DuckDB team</span></p>\n\t\t\t</div>\n\t</div>\n</div>\n\t\t</div>\n\t\t<a target=\"_blank\" href=\"https://duckdb.org/news/\">\n\t\t\tAll blog posts <svg />\n\t\t</a>\n\t</div>"
---

Despite the work required to develop the features needed for DuckLake v1.0 and Quack, the DuckLabs team is still hard at work on the DuckDB-Iceberg extension.
In this blog post, we will demonstrate some of the features that are available in DuckDB v1.5.3. Many of these features were earmarked for a future release in our last Iceberg-themed blog post “Writes in DuckDB-Iceberg” – you can think of this post as “Part 2” to that blog post.
Getting Started
To experiment with the new DuckDB-Iceberg features, you will need to connect to your favorite Iceberg REST Catalog. There are many ways to do so: please have a look at the Connecting to REST Catalogs page, which has instructions for catalogs such as Apache Polaris and Lakekeeper. If you would like to connect to Amazon S3 Tables, please consult the Connecting to S3 Tables page. In any case, your ATTACH command will look something like this:

ATTACH 'warehouse_name' AS my_datalake (
    TYPE iceberg,
    other options
);


MERGE INTO Support
DuckDB's MERGE INTO statement is the recommended way to express upserts when the target table does not have a primary key – which is the case for all lakehouse formats.
With v1.5.3, MERGE INTO is now fully supported against Iceberg tables. You can apply a change set to an Iceberg table in a single statement, deciding per row whether to insert, update or delete.
Let's take this table for example:

CREATE TABLE my_datalake.default.people (
    id INTEGER,
    name VARCHAR,
    salary FLOAT
);
INSERT INTO my_datalake.default.people
    VALUES (1, 'John', 92_000.0), (2, 'Anna', 100_000.0);



┌───────┬─────────┬──────────┐
│  id   │  name   │  salary  │
│ int32 │ varchar │  float   │
├───────┼─────────┼──────────┤
│     1 │ John    │  92000.0 │
│     2 │ Anna    │ 100000.0 │
└───────┴─────────┴──────────┘


Let's run an update on this table with two records, one increasing person 1's salary and another adding a new person with id 3.

MERGE INTO my_datalake.default.people AS target
    USING (
        FROM (VALUES
            (1, 'John', 105_000.0),
            (3, 'Sarah', 95_000.0)
        ) t(id, name, salary)
    ) AS upserts
    ON (upserts.id = target.id)
    WHEN MATCHED THEN UPDATE
    WHEN NOT MATCHED THEN INSERT;


When querying the result, we get the following:

SELECT *
FROM my_datalake.default.people
ORDER BY id;



┌───────┬─────────┬──────────┐
│  id   │  name   │  salary  │
│ int32 │ varchar │  float   │
├───────┼─────────┼──────────┤
│     1 │ John    │ 105000.0 │
│     2 │ Anna    │ 100000.0 │
│     3 │ Sarah   │  95000.0 │
└───────┴─────────┴──────────┘


You can also combine matched and unmatched branches with WHEN MATCHED THEN DELETE to express a delete set in the same statement. As with UPDATE and DELETE, MERGE INTO uses merge-on-read semantics and writes positional deletes to the Iceberg table.
ALTER TABLE Support
In DuckDB v1.4's Iceberg extension, the lack of schema evolution of Iceberg tables was a documented limitation.
In v1.5.3, the ALTER TABLE statement is now supported against Iceberg tables, covering the most common schema-evolution operations.

-- Create the table
CREATE TABLE my_datalake.default.simple_table AS
    FROM (VALUES
        (1, 'Andy'),
        (2, 'Bob'),
        (3, 'Claire'),
        (4, 'Mr. Duck')) t(col1, col2);

-- Rename the table
ALTER TABLE my_datalake.default.simple_table
    RENAME TO renamed_table;

-- Add a column
ALTER TABLE my_datalake.default.renamed_table
    ADD COLUMN col3 DOUBLE;

-- Rename a column
ALTER TABLE my_datalake.default.renamed_table
    RENAME COLUMN col2 TO name;

-- Drop a column
ALTER TABLE my_datalake.default.renamed_table
    DROP COLUMN col3;

-- Set the format-version
ALTER TABLE my_datalake.default.renamed_table
    SET ('format-version' = 3);


If we query the table after the schema changes, we get the following:

SELECT *
FROM my_datalake.default.renamed_table
ORDER BY col1;



┌───────┬──────────┐
│ col1  │   name   │
│ int32 │ varchar  │
├───────┼──────────┤
│     1 │ Andy     │
│     2 │ Bob      │
│     3 │ Claire   │
│     4 │ Mr. Duck │
└───────┴──────────┘


In the background, each ALTER TABLE statement updates the current-schema-id of the Iceberg table. The changes are visible to other Iceberg-aware engines the next time they query the LoadTableInformation endpoint. Iceberg schema evolution is metadata-only, so no data files are rewritten.
truncate and bucket Support
The Iceberg specification defines several partition transforms that determine how data files are laid out on disk. In v1.5.3, DuckDB-Iceberg supports creating, inserting into, and updating tables that use the bucket and truncate partition transforms.
The bucket(N, col) transform hashes the column's value into N buckets, which is useful when you want stable partitioning on a high-cardinality column. truncate(W, col) groups rows by the first W characters (or by the column's value rounded down to a multiple of W for numeric columns), which is useful for prefix-based partitioning.

CREATE TABLE my_datalake.default.events (
    event_id BIGINT,
    user_id BIGINT,
    country VARCHAR,
    payload VARCHAR
)
PARTITIONED BY (bucket(16, user_id), truncate(2, country));

INSERT INTO my_datalake.default.events
    VALUES
        (1, 1001, 'United States', 'click'),
        (2, 1002, 'United Kingdom', 'view'),
        (3, 1003, 'Germany', 'click'),
        (4, 1004, 'Netherlands', 'view');


You can inspect the resulting data files to verify the partitioning:

SELECT file_path, record_count
FROM iceberg_metadata(my_datalake.default.events)
WHERE content = 'EXISTING';


Updates and deletes against bucket- and truncate-partitioned tables are also supported, using positional deletes under merge-on-read semantics.
Iceberg Schema Properties
Iceberg catalogs allow arbitrary key-value properties to be attached at the schema (namespace) level. These properties are typically used to record ownership, descriptions, default storage locations, or any other metadata that applies to every table in a schema.
iceberg_schema_properties
set_iceberg_schema_properties
remove_iceberg_schema_properties
You can use them as follows:

-- to set schema properties
CALL set_iceberg_schema_properties(my_datalake.default, {
    'owner': 'analytics-team',
    'description': 'Default analytics schema'
});
-- to read schema properties
SELECT * FROM iceberg_schema_properties(my_datalake.default);



┌─────────────┬──────────────────────────┐
│     key     │          value           │
│   varchar   │         varchar          │
├─────────────┼──────────────────────────┤
│ owner       │ analytics-team           │
│ description │ Default analytics schema │
└─────────────┴──────────────────────────┘



-- to remove schema properties
CALL remove_iceberg_schema_properties(
    my_datalake.default,
    ['description']
);


Schema properties are written through the Iceberg REST Catalog, so any other Iceberg-aware engine attached to the same catalog will see the updates immediately. The returned value is the number of remaining schema properties.
V3 Support
The Iceberg v3 specification introduces several new features that DuckDB-Iceberg now supports for both reads and writes:
VARIANT and TIMESTAMP_NS data types
Schema-level default values for columns
Binary deletion vectors
Row lineage tracking
The biggest change in practice is binary deletion vectors. In v2 tables, DuckDB-Iceberg writes positional deletes as Parquet files; in v3 tables, the same information is encoded as a much more compact binary deletion vector (Puffin file). DuckDB picks the right format automatically based on the table's format-version.
You can create a v3 table by setting the format-version table property at creation time:

CREATE TABLE my_datalake.default.v3_table
WITH ('format-version' = 3) AS
    FROM (VALUES
        (1, {'kind': 'click', 'x': 10}::VARIANT, TIMESTAMP_NS '2026-05-20 12:00:00.123456789'),
        (2, {'kind': 'view'}::VARIANT, TIMESTAMP_NS '2026-05-20 12:00:00.987654321')
    ) t(id, payload, event_time);

-- Deletes against a v3 table are written as binary deletion vectors
DELETE FROM my_datalake.default.v3_table
WHERE id = 1;

SELECT * FROM my_datalake.default.v3_table;



┌───────┬──────────────────┬───────────────────────────────┐
│  id   │     payload      │          event_time           │
│ int32 │     variant      │         timestamp_ns          │
├───────┼──────────────────┼───────────────────────────────┤
│     2 │ {"kind": "view"} │ 2026-05-20 12:00:00.987654321 │
└───────┴──────────────────┴───────────────────────────────┘


Looking at the metadata for the table confirms that the delete was written as a deletion vector rather than as a positional-delete Parquet file:

SELECT manifest_content, content, file_format
FROM iceberg_metadata(my_datalake.default.v3_table);



┌──────────────────┬──────────────────┬─────────────┐
│ manifest_content │     content      │ file_format │
│     varchar      │     varchar      │   varchar   │
├──────────────────┼──────────────────┼─────────────┤
│ DATA             │ EXISTING         │ parquet     │
│ DELETE           │ POSITION_DELETES │ puffin      │
└──────────────────┴──────────────────┴─────────────┘


The Geography type and Unknown type are not yet supported in DuckDB-Iceberg; we are planning to add those in DuckDB v2.0.0.
Conclusion and Future Work
With these features, DuckDB-Iceberg has closed many of the gaps called out in the previous blog post: partitioned writes, schema evolution, MERGE INTO, and many Iceberg v3 features are now available. There is still more to come, and as always, if you would like to see a specific feature prioritized, please reach out to us in the DuckDB-Iceberg GitHub repository or get in touch with our engineers.
