---
title: "Building A Modern Data Stack for QazAI"
link: "https://trino.io/blog/2022/06/08/building-a-modern-data-stack-for-qaz-ai.html"
guid: "https://trino.io/blog/2022/06/08/building-a-modern-data-stack-for-qaz-ai.html"
pubDate: "2022-06-08T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "At QazAI, we build data lakes as a service for companies.  In the original\narchitecture, we get raw data in S3, transform the S3 data with Hive, and then\ndelivered the data to business units via our datamart built on Clickhouse (for optimal delivery speeds). Over time, we were dragged down by the slower speeds and high costs of running Hive, and started shopping for a faster and cheaper open source engine to do our ETL data transformations.\nThis diagram shows our existing stack. The big problem to solve was that the\nHadoop cluster was extremely inefficient. This leads to slow queries, and up\nto 10x higher costs.\nLike many others, I was initially drawn to Trino to run analytics over Hive\ntables because of its speed, but found many other advantages as well. Key among\nthem are the following characteristics.\nSpeed\nQueries ran 10 to 100 times faster, compared to our old stack. It was fantastic,\nsimply beyond our expectations.\nStandard SQL\nStandard SQL dialect that everyone already knew. Data analysts loved getting to\nuse a dialect they were already familiar with.\nFederated analytics\nAbility to connect with other databases and run federated queries. After I had\nconnected all the available data sources, I showed the results to the data\nanalysts. They were simply amazed, some were shocked when the ‘join’ operation\nbetween the tables of various databases had been completed successfully. To\nemphasize - this saved days of work.  You could join data from other data\nsources straight away, avoiding the need to create a staging layer in the data\nwarehouse.\nSimplicity of setup\nTrino just works out of the box. This is what makes it great. As open source\nusers, we’re used to going through a complicated software setup process. But\nwith Trino, there’s no need to deploy anything else. You simply install packages\nfrom the open source repository, and things work. It’s magical. To top that off,\nTrino feels like a commercial product with its detailed documentation and active\nSlack community that is willing to help you out on everything.\nExploring Trino as an option for ETL\nA great number of connectors, standard SQL, high processing speed - all these\nadvantages raise an obvious question: ‘Why not use Trino for ETL processes as\nwell?\nAt QazAI, the key blocker to using Trino for ETL was that Trino doesn’t have\nfault tolerance. As a result, our pipelines did not have reliable landing times,\nand required a lot of manual monitoring.\nThis is precisely what made Project Tardigrade so exciting for us. Proving that\nTrino is indeed a true community-driven project, Trino community members have\nembarked on the Tardigrade project. The main feature of this technology is the\nability to divide the query into phases, and restart the failed phases. We’ve\nbeen running tests to explore this. The ETL pipeline on Trino running on 5 bare\nmetal nodes is 20 times faster compared to ETL running on the stack consisting\nof Sqoop, HDFS, Hive, and custom Python scripts.\nTesting Trino for ETL\nLet’s play a bit with the rental database called DVD.\nFor instance, we create the database shown above in PostgreSQL and work with the rental table.\nFirst, we move the table from PostgreSQL to our warehouse in HDFS and Hive.\n\nCREATE TABLE hive.test.dvd_rental  \nWITH (format = 'PARQUET')\nAS (SELECT \n\trental_id,\n\tcast(rental_date AS timestamp) AS rental_date,\n\tinventory_id,\n\tcast(customer_id AS integer) AS customer_id,\n\tcast(return_date AS timestamp) AS return_date,\n\tcast(staff_id AS integer) AS staff_id,\n\tcast(last_update AS timestamp) AS last_update \nFROM postgresqldvd.public.rental)\n\n\nNow we perform the same operation but we use the table of Iceberg format on S3 with hidden partitioning.\n\nCREATE TABLE iceberg2.ice.dvd_rental  \nWITH (partitioning = ARRAY['month(rental_date)', 'bucket(inventory_id, 10)'],\n    format = 'PARQUET')\nAS (SELECT \n\trental_id,\n\trental_date,\n\tinventory_id,\n\tcast(customer_id AS integer) AS customer_id,\n\treturn_date,\n\tcast(staff_id AS integer) AS staff_id,\n\tlast_update \nFROM postgresqldvd.public.rental)\n\n\nNow we perform the same operation:\n\nCREATE TABLE hive.test.dvd_staff\nWITH (format = 'PARQUET')\nAS (SELECT \n\tstaff_id,\n\tfirst_name,\n\tlast_name,\n\tcast(address_id AS integer) AS address_id,\n\temail,\n\tcast(store_id AS integer) AS store_id,\n\tactive,\n\tusername,\n\tpassword,\n\tcast(last_update AS timestamp) AS last_update,\n\tpicture\nFROM postgresqldvd.public.staff)\n\nCREATE TABLE hive.test.dvd_customer\nWITH (format = 'PARQUET')\nAS (SELECT \n\tcustomer_id,\n\tcast(store_id AS integer) AS store_id,\n\tfirst_name,\n\tlast_name,\n\temail,\n\tcast(address_id AS integer) AS address_id,\n\tactivebool,\n\tcreate_date,\n\tcast(last_update AS timestamp) AS last_update,\n\tactive\nFROM postgresqldvd.public.customer)\n\n\nGreat. What if there is a need to enrich the data with the employees’ and\nclients’ names? To do this, we create a table, move it to the\ncore layer, and then apply denormalization.\nHere we move the measurements table.\n\nCREATE TABLE hive.test.dvd_staff\nWITH (format = 'PARQUET')\nAS (SELECT \n\tstaff_id,\n\tfirst_name,\n\tlast_name,\n\tcast(address_id AS integer) AS address_id,\n\temail,\n\tcast(store_id AS integer) AS store_id,\n\tactive,\n\tusername,\n\tpassword,\n\tcast(last_update AS timestamp) AS last_update,\n\tpicture\nFROM postgresqldvd.public.staff)\n\nCREATE TABLE hive.test.dvd_customer\nWITH (format = 'PARQUET')\nAS (SELECT \n\tcustomer_id,\n\tcast(store_id AS integer) AS store_id,\n\tfirst_name,\n\tlast_name,\n\temail,\n\tcast(address_id AS integer) AS address_id,\n\tactivebool,\n\tcreate_date,\n\tcast(last_update AS timestamp) AS last_update,\n\tactive\nFROM postgresqldvd.public.customer)\n\n\nLet’s union the Staff and Customers tables.\n\nCREATE TABLE hive.test.dvd_core_rental\nWITH (format = 'PARQUET')\nAS (SELECT\n\trental_id,\n\trental_date,\n\tinventory_id,\n\tcst.first_name AS customer_name, --cast(customer_id as integer) as customer_id,\n\tcst.last_name AS customer_lastname,\n\tcast(return_date AS timestamp) AS return_date,\n\tstf.first_name AS staff_name, --cast(staff_id as integer) as staff_id,\n\tstf.last_name AS staff_lastname,\n\trnt.last_update\nFROM hive.test.dvd_rental rnt\nLEFT JOIN hive.test.dvd_customer cst ON rnt.customer_id = cst.customer_id\nLEFT JOIN hive.test.dvd_staff stf ON rnt.staff_id = stf.staff_id)\n\n\nIf this table is required by data analysts, then we can easily move it to the data mart (the Clickhouse layer we use to deliver data to end users).\n\nCREATE TABLE clickhouse.default.rental_analysis_table\n(\n\trental_id integer NOT NULL,\n\trental_date date,\n\tinventory_id integer,\n\tcustomer_name varchar NOT NULL, \n\tcustomer_lastname varchar NOT NULL,\n\treturn_date date,\n\tstaff_name varchar,\n\tstaff_lastname varchar,\n\tlast_update date   \n)\nWITH (engine = 'MergeTree',\n    order_by = ARRAY['customer_name', 'customer_lastname']);\n\n\nA simple insert/select query and nothing more.\n\nINSERT INTO clickhouse.default.rental_analysis_table\nSELECT * FROM hive.test.dvd_core_rental\n\n\nAlternatively we can easily move the datamart to Clickhouse directly from PostgreSQL without intermediate data layers.\n\nINSERT INTO clickhouse.default.rental_analysis_table\nSELECT\n\trental_id,\n\trental_date,\n\tinventory_id,\n\tcst.first_name AS customer_name, \n\tcst.last_name AS customer_lastname,\n\tcast(return_date AS timestamp) AS return_date,\n\tstf.first_name AS staff_name, \n\tstf.last_name AS staff_lastname,\n\trnt.last_update\nFROM postgresqldvd.public.rental rnt\nLEFT JOIN postgresqldvd.public.customer cst ON rnt.customer_id = cst.customer_id\nLEFT JOIN postgresqldvd.public.staff stf ON rnt.staff_id = stf.staff_i\n\n\nGreat.\nOne may suggest that this sample dataset is a small one with only 16 000 rows.\nThe production ETL is mostly run over huge tables containing millions or\nbillions of rows.  Let’s test. We work with the tpch database with the scaling\nfactor 3000.\nFor testing, we consider three tables: lineitem (18 billion rows),\norders (450 million rows) and partsupp (2.4 billion rows).\n\nCREATE TABLE iceberg2.ice.tpch_sf3000_customer –(450 M)\nWITH (format = 'ORC')\nAS\nSELECT *\nFROM tpch.sf3000.customer\n\nCREATE TABLE iceberg2.ice.tpch_sf3000_lineitem –(18 B)\nWITH (format = 'ORC')\nAS\nSELECT *\nFROM tpch.sf3000.lineitem\n\nCREATE TABLE iceberg2.ice.tpch_sf3000_partsupp –(2,4 B)\nWITH (format = 'ORC')\nAS\nSELECT *\nFROM tpch.sf3000.partsupp\n\n\nThen, we try to join all three of these tables as it is shown in the ER diagram.\nLet’s make it more challenging by turning off one of the workers, which should\nresult in a query failure. To enable the automatic query rerun of the failed one\nwe set retry_policy=QUERY in config. properties.\n\nCREATE TABLE iceberg2.ice.tpch_sf3000_lineitem_joined \nWITH (format = 'ORC')\nAS\nSELECT litem.orderkey ,\n\tlitem.partkey ,\n\tlitem.suppkey ,\n\tlitem.linenumber ,\n\tlitem.quantity ,\n\tlitem.extendedprice ,\n\tlitem.discount ,\n\tlitem.tax ,\n\tlitem.returnflag ,\n\tlitem.linestatus ,\n\tlitem.shipdate ,\n\tlitem.commitdate ,\n\tlitem.receiptdate ,\n\tlitem.shipinstruct ,\n\tlitem.shipmode ,\n\tlitem.comment,\n\tpsupp.availqty ,\n\tpsupp.supplycost ,\n\tord.shippriority ,\n\tord.totalprice \nFROM iceberg2.ice.tpch_sf100000_lineitem litem\nLEFT JOIN iceberg2.ice.tpch_sf100000_partsupp psupp ON litem.partkey = psupp.partkey and litem.suppkey = psupp.suppkey \nLEFT JOIN iceberg2.ice.tpch_sf100000_orders ord ON litem.orderkey = ord.orderkey \n\n\nThe query has been completed in 4 hours. Also, at query processing, worker 22\nhas been turned off. The query has been automatically started over and completed\nsuccessfully. At the query processing, three tables have been joined (the\ntriple join): 18 billion rows x 2.4 billion rows x 450 million rows.\nThis experiment gave us the confidence to move forward in our plans to rebuild\nour architecture with Trino in order to perform analytical and transformational\nmanipulations upon data directly in S3, which will allow us to exclude HDFS and\nHive interference in these processes.\nAs a result we will achieve faster pipelines.\nA huge thanks to the Trino development team and the Trino community for an\nexcellent product, which I enjoy using and allows me to go beyond conventional\nusage patterns.\nIf you are looking for help building your data warehouse, or if you’re\ninterested in joining us at QazAI, feel free to reach out to me at Baurzhan Kuspayev on the Trino Slack.\nNote from Trino community: We welcome blog submissions from the community. If you have blog ideas, please send a message in the #dev chat. We will mail you Trino swag as a token of appreciation for successful submissions. Trino Slack.\nDiscuss on Reddit\nDiscuss On Hacker News"
author: "Baurzhan Kuspayev"
contentHtml: "<div>\n<article>\n  <div><p>At QazAI, we build data lakes as a service for companies.  In the original\narchitecture, we get raw data in S3, transform the S3 data with Hive, and then\ndelivered the data to business units via our datamart built on Clickhouse (for optimal delivery speeds). Over time, we were dragged down by the slower speeds and high costs of running Hive, and started shopping for a faster and cheaper open source engine to do our ETL data transformations.</p>\n<!--more-->\n<p>\n   <img src=\"https://trino.io/assets/blog/qaz-ai-modern-data-stack/old-architecture.png\">\n</p>\n<p>This diagram shows our existing stack. The big problem to solve was that the\nHadoop cluster was extremely inefficient. This leads to slow queries, and up\nto 10x higher costs.</p>\n<p>Like many others, I was initially drawn to Trino to run analytics over Hive\ntables because of its speed, but found many other advantages as well. Key among\nthem are the following characteristics.</p>\n<h2 id=\"speed\">\n    Speed <a target=\"_blank\" href=\"https://trino.io/blog/2022/06/08/building-a-modern-data-stack-for-qaz-ai.html#speed\">#</a>\n</h2>\n<p>Queries ran 10 to 100 times faster, compared to our old stack. It was fantastic,\nsimply beyond our expectations.</p>\n<h2 id=\"standard-sql\">\n    Standard SQL <a target=\"_blank\" href=\"https://trino.io/blog/2022/06/08/building-a-modern-data-stack-for-qaz-ai.html#standard-sql\">#</a>\n</h2>\n<p>Standard SQL dialect that everyone already knew. Data analysts loved getting to\nuse a dialect they were already familiar with.</p>\n<h2 id=\"federated-analytics\">\n    Federated analytics <a target=\"_blank\" href=\"https://trino.io/blog/2022/06/08/building-a-modern-data-stack-for-qaz-ai.html#federated-analytics\">#</a>\n</h2>\n<p>Ability to connect with other databases and run federated queries. After I had\nconnected all the available data sources, I showed the results to the data\nanalysts. They were simply amazed, some were shocked when the ‘join’ operation\nbetween the tables of various databases had been completed successfully. To\nemphasize - this saved days of work.  You could join data from other data\nsources straight away, avoiding the need to create a staging layer in the data\nwarehouse.</p>\n<h2 id=\"simplicity-of-setup\">\n    Simplicity of setup <a target=\"_blank\" href=\"https://trino.io/blog/2022/06/08/building-a-modern-data-stack-for-qaz-ai.html#simplicity-of-setup\">#</a>\n</h2>\n<p>Trino just works out of the box. This is what makes it great. As open source\nusers, we’re used to going through a complicated software setup process. But\nwith Trino, there’s no need to deploy anything else. You simply install packages\nfrom the open source repository, and things work. It’s magical. To top that off,\nTrino feels like a commercial product with its detailed documentation and active\nSlack community that is willing to help you out on everything.</p>\n<h2 id=\"exploring-trino-as-an-option-for-etl\">\n    Exploring Trino as an option for ETL <a target=\"_blank\" href=\"https://trino.io/blog/2022/06/08/building-a-modern-data-stack-for-qaz-ai.html#exploring-trino-as-an-option-for-etl\">#</a>\n</h2>\n<p>A great number of connectors, standard SQL, high processing speed - all these\nadvantages raise an obvious question: ‘Why not use Trino for ETL processes as\nwell?</p>\n<p>At QazAI, the key blocker to using Trino for ETL was that Trino doesn’t have\nfault tolerance. As a result, our pipelines did not have reliable landing times,\nand required a lot of manual monitoring.</p>\n<p>This is precisely what made Project Tardigrade so exciting for us. Proving that\nTrino is indeed a true community-driven project, Trino community members have\nembarked on the Tardigrade project. The main feature of this technology is the\nability to divide the query into phases, and restart the failed phases. We’ve\nbeen running tests to explore this. The ETL pipeline on Trino running on 5 bare\nmetal nodes is 20 times faster compared to ETL running on the stack consisting\nof Sqoop, HDFS, Hive, and custom Python scripts.</p>\n<h2 id=\"testing-trino-for-etl\">\n    Testing Trino for ETL <a target=\"_blank\" href=\"https://trino.io/blog/2022/06/08/building-a-modern-data-stack-for-qaz-ai.html#testing-trino-for-etl\">#</a>\n</h2>\n<p>Let’s play a bit with the rental database called DVD.</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/qaz-ai-modern-data-stack/rentaldb-schema.png\">\n</p>\n<p>For instance, we create the database shown above in PostgreSQL and work with the <em>rental</em> table.</p>\n<p>First, we move the table from PostgreSQL to our warehouse in HDFS and Hive.</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_rental</span>  \n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'PARQUET'</span><span>)</span>\n<span>AS</span> <span>(</span><span>SELECT</span> \n\t<span>rental_id</span><span>,</span>\n\t<span>cast</span><span>(</span><span>rental_date</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>rental_date</span><span>,</span>\n\t<span>inventory_id</span><span>,</span>\n\t<span>cast</span><span>(</span><span>customer_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>customer_id</span><span>,</span>\n\t<span>cast</span><span>(</span><span>return_date</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>return_date</span><span>,</span>\n\t<span>cast</span><span>(</span><span>staff_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>staff_id</span><span>,</span>\n\t<span>cast</span><span>(</span><span>last_update</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>last_update</span> \n<span>FROM</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>rental</span><span>)</span>\n</code></pre></div>\n<p>Now we perform the same operation but we use the table of Iceberg format on S3 with hidden partitioning.</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>iceberg2</span><span>.</span><span>ice</span><span>.</span><span>dvd_rental</span>  \n<span>WITH</span> <span>(</span><span>partitioning</span> <span>=</span> <span>ARRAY</span><span>[</span><span>'month(rental_date)'</span><span>,</span> <span>'bucket(inventory_id, 10)'</span><span>],</span>\n    <span>format</span> <span>=</span> <span>'PARQUET'</span><span>)</span>\n<span>AS</span> <span>(</span><span>SELECT</span> \n\t<span>rental_id</span><span>,</span>\n\t<span>rental_date</span><span>,</span>\n\t<span>inventory_id</span><span>,</span>\n\t<span>cast</span><span>(</span><span>customer_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>customer_id</span><span>,</span>\n\t<span>return_date</span><span>,</span>\n\t<span>cast</span><span>(</span><span>staff_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>staff_id</span><span>,</span>\n\t<span>last_update</span> \n<span>FROM</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>rental</span><span>)</span>\n</code></pre></div>\n<p>Now we perform the same operation:</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_staff</span>\n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'PARQUET'</span><span>)</span>\n<span>AS</span> <span>(</span><span>SELECT</span> \n\t<span>staff_id</span><span>,</span>\n\t<span>first_name</span><span>,</span>\n\t<span>last_name</span><span>,</span>\n\t<span>cast</span><span>(</span><span>address_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>address_id</span><span>,</span>\n\t<span>email</span><span>,</span>\n\t<span>cast</span><span>(</span><span>store_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>store_id</span><span>,</span>\n\t<span>active</span><span>,</span>\n\t<span>username</span><span>,</span>\n\t<span>password</span><span>,</span>\n\t<span>cast</span><span>(</span><span>last_update</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>last_update</span><span>,</span>\n\t<span>picture</span>\n<span>FROM</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>staff</span><span>)</span>\n<span>CREATE</span> <span>TABLE</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_customer</span>\n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'PARQUET'</span><span>)</span>\n<span>AS</span> <span>(</span><span>SELECT</span> \n\t<span>customer_id</span><span>,</span>\n\t<span>cast</span><span>(</span><span>store_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>store_id</span><span>,</span>\n\t<span>first_name</span><span>,</span>\n\t<span>last_name</span><span>,</span>\n\t<span>email</span><span>,</span>\n\t<span>cast</span><span>(</span><span>address_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>address_id</span><span>,</span>\n\t<span>activebool</span><span>,</span>\n\t<span>create_date</span><span>,</span>\n\t<span>cast</span><span>(</span><span>last_update</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>last_update</span><span>,</span>\n\t<span>active</span>\n<span>FROM</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>customer</span><span>)</span>\n</code></pre></div>\n<p>Great. What if there is a need to enrich the data with the employees’ and\nclients’ names? To do this, we create a table, move it to the\ncore layer, and then apply denormalization.</p>\n<p>Here we move the measurements table.</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_staff</span>\n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'PARQUET'</span><span>)</span>\n<span>AS</span> <span>(</span><span>SELECT</span> \n\t<span>staff_id</span><span>,</span>\n\t<span>first_name</span><span>,</span>\n\t<span>last_name</span><span>,</span>\n\t<span>cast</span><span>(</span><span>address_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>address_id</span><span>,</span>\n\t<span>email</span><span>,</span>\n\t<span>cast</span><span>(</span><span>store_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>store_id</span><span>,</span>\n\t<span>active</span><span>,</span>\n\t<span>username</span><span>,</span>\n\t<span>password</span><span>,</span>\n\t<span>cast</span><span>(</span><span>last_update</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>last_update</span><span>,</span>\n\t<span>picture</span>\n<span>FROM</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>staff</span><span>)</span>\n<span>CREATE</span> <span>TABLE</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_customer</span>\n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'PARQUET'</span><span>)</span>\n<span>AS</span> <span>(</span><span>SELECT</span> \n\t<span>customer_id</span><span>,</span>\n\t<span>cast</span><span>(</span><span>store_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>store_id</span><span>,</span>\n\t<span>first_name</span><span>,</span>\n\t<span>last_name</span><span>,</span>\n\t<span>email</span><span>,</span>\n\t<span>cast</span><span>(</span><span>address_id</span> <span>AS</span> <span>integer</span><span>)</span> <span>AS</span> <span>address_id</span><span>,</span>\n\t<span>activebool</span><span>,</span>\n\t<span>create_date</span><span>,</span>\n\t<span>cast</span><span>(</span><span>last_update</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>last_update</span><span>,</span>\n\t<span>active</span>\n<span>FROM</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>customer</span><span>)</span>\n</code></pre></div>\n<p>Let’s union the Staff and Customers tables.</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_core_rental</span>\n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'PARQUET'</span><span>)</span>\n<span>AS</span> <span>(</span><span>SELECT</span>\n\t<span>rental_id</span><span>,</span>\n\t<span>rental_date</span><span>,</span>\n\t<span>inventory_id</span><span>,</span>\n\t<span>cst</span><span>.</span><span>first_name</span> <span>AS</span> <span>customer_name</span><span>,</span> <span>--cast(customer_id as integer) as customer_id,</span>\n\t<span>cst</span><span>.</span><span>last_name</span> <span>AS</span> <span>customer_lastname</span><span>,</span>\n\t<span>cast</span><span>(</span><span>return_date</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>return_date</span><span>,</span>\n\t<span>stf</span><span>.</span><span>first_name</span> <span>AS</span> <span>staff_name</span><span>,</span> <span>--cast(staff_id as integer) as staff_id,</span>\n\t<span>stf</span><span>.</span><span>last_name</span> <span>AS</span> <span>staff_lastname</span><span>,</span>\n\t<span>rnt</span><span>.</span><span>last_update</span>\n<span>FROM</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_rental</span> <span>rnt</span>\n<span>LEFT</span> <span>JOIN</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_customer</span> <span>cst</span> <span>ON</span> <span>rnt</span><span>.</span><span>customer_id</span> <span>=</span> <span>cst</span><span>.</span><span>customer_id</span>\n<span>LEFT</span> <span>JOIN</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_staff</span> <span>stf</span> <span>ON</span> <span>rnt</span><span>.</span><span>staff_id</span> <span>=</span> <span>stf</span><span>.</span><span>staff_id</span><span>)</span>\n</code></pre></div>\n<p>If this table is required by data analysts, then we can easily move it to the data mart (the Clickhouse layer we use to deliver data to end users).</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>clickhouse</span><span>.</span><span>default</span><span>.</span><span>rental_analysis_table</span>\n<span>(</span>\n\t<span>rental_id</span> <span>integer</span> <span>NOT</span> <span>NULL</span><span>,</span>\n\t<span>rental_date</span> <span>date</span><span>,</span>\n\t<span>inventory_id</span> <span>integer</span><span>,</span>\n\t<span>customer_name</span> <span>varchar</span> <span>NOT</span> <span>NULL</span><span>,</span> \n\t<span>customer_lastname</span> <span>varchar</span> <span>NOT</span> <span>NULL</span><span>,</span>\n\t<span>return_date</span> <span>date</span><span>,</span>\n\t<span>staff_name</span> <span>varchar</span><span>,</span>\n\t<span>staff_lastname</span> <span>varchar</span><span>,</span>\n\t<span>last_update</span> <span>date</span>   \n<span>)</span>\n<span>WITH</span> <span>(</span><span>engine</span> <span>=</span> <span>'MergeTree'</span><span>,</span>\n    <span>order_by</span> <span>=</span> <span>ARRAY</span><span>[</span><span>'customer_name'</span><span>,</span> <span>'customer_lastname'</span><span>]);</span>\n</code></pre></div>\n<p>A simple insert/select query and nothing more.</p>\n<div><pre><code><span>INSERT</span> <span>INTO</span> <span>clickhouse</span><span>.</span><span>default</span><span>.</span><span>rental_analysis_table</span>\n<span>SELECT</span> <span>*</span> <span>FROM</span> <span>hive</span><span>.</span><span>test</span><span>.</span><span>dvd_core_rental</span>\n</code></pre></div>\n<p>Alternatively we can easily move the datamart to Clickhouse directly from PostgreSQL without intermediate data layers.</p>\n<div><pre><code><span>INSERT</span> <span>INTO</span> <span>clickhouse</span><span>.</span><span>default</span><span>.</span><span>rental_analysis_table</span>\n<span>SELECT</span>\n\t<span>rental_id</span><span>,</span>\n\t<span>rental_date</span><span>,</span>\n\t<span>inventory_id</span><span>,</span>\n\t<span>cst</span><span>.</span><span>first_name</span> <span>AS</span> <span>customer_name</span><span>,</span> \n\t<span>cst</span><span>.</span><span>last_name</span> <span>AS</span> <span>customer_lastname</span><span>,</span>\n\t<span>cast</span><span>(</span><span>return_date</span> <span>AS</span> <span>timestamp</span><span>)</span> <span>AS</span> <span>return_date</span><span>,</span>\n\t<span>stf</span><span>.</span><span>first_name</span> <span>AS</span> <span>staff_name</span><span>,</span> \n\t<span>stf</span><span>.</span><span>last_name</span> <span>AS</span> <span>staff_lastname</span><span>,</span>\n\t<span>rnt</span><span>.</span><span>last_update</span>\n<span>FROM</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>rental</span> <span>rnt</span>\n<span>LEFT</span> <span>JOIN</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>customer</span> <span>cst</span> <span>ON</span> <span>rnt</span><span>.</span><span>customer_id</span> <span>=</span> <span>cst</span><span>.</span><span>customer_id</span>\n<span>LEFT</span> <span>JOIN</span> <span>postgresqldvd</span><span>.</span><span>public</span><span>.</span><span>staff</span> <span>stf</span> <span>ON</span> <span>rnt</span><span>.</span><span>staff_id</span> <span>=</span> <span>stf</span><span>.</span><span>staff_i</span>\n</code></pre></div>\n<p>Great.</p>\n<p>One may suggest that this sample dataset is a small one with only 16 000 rows.\nThe production ETL is mostly run over huge tables containing millions or\nbillions of rows.  Let’s test. We work with the <em>tpch</em> database with the scaling\nfactor 3000.</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/qaz-ai-modern-data-stack/tpch-schema.png\">\n</p>\n<p>For testing, we consider three tables: <em>lineitem</em> (18 billion rows),\n<em>orders</em> (450 million rows) and <em>partsupp</em> (2.4 billion rows).</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>iceberg2</span><span>.</span><span>ice</span><span>.</span><span>tpch_sf3000_customer</span> <span>–</span><span>(</span><span>450</span> <span>M</span><span>)</span>\n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'ORC'</span><span>)</span>\n<span>AS</span>\n<span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>tpch</span><span>.</span><span>sf3000</span><span>.</span><span>customer</span>\n<span>CREATE</span> <span>TABLE</span> <span>iceberg2</span><span>.</span><span>ice</span><span>.</span><span>tpch_sf3000_lineitem</span> <span>–</span><span>(</span><span>18</span> <span>B</span><span>)</span>\n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'ORC'</span><span>)</span>\n<span>AS</span>\n<span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>tpch</span><span>.</span><span>sf3000</span><span>.</span><span>lineitem</span>\n<span>CREATE</span> <span>TABLE</span> <span>iceberg2</span><span>.</span><span>ice</span><span>.</span><span>tpch_sf3000_partsupp</span> <span>–</span><span>(</span><span>2</span><span>,</span><span>4</span> <span>B</span><span>)</span>\n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'ORC'</span><span>)</span>\n<span>AS</span>\n<span>SELECT</span> <span>*</span>\n<span>FROM</span> <span>tpch</span><span>.</span><span>sf3000</span><span>.</span><span>partsupp</span>\n</code></pre></div>\n<p>Then, we try to join all three of these tables as it is shown in the ER diagram.\nLet’s make it more challenging by turning off one of the workers, which should\nresult in a query failure. To enable the automatic query rerun of the failed one\nwe set <code>retry_policy=QUERY</code> in <code>config. properties</code>.</p>\n<div><pre><code><span>CREATE</span> <span>TABLE</span> <span>iceberg2</span><span>.</span><span>ice</span><span>.</span><span>tpch_sf3000_lineitem_joined</span> \n<span>WITH</span> <span>(</span><span>format</span> <span>=</span> <span>'ORC'</span><span>)</span>\n<span>AS</span>\n<span>SELECT</span> <span>litem</span><span>.</span><span>orderkey</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>partkey</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>suppkey</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>linenumber</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>quantity</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>extendedprice</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>discount</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>tax</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>returnflag</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>linestatus</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>shipdate</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>commitdate</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>receiptdate</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>shipinstruct</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>shipmode</span> <span>,</span>\n\t<span>litem</span><span>.</span><span>comment</span><span>,</span>\n\t<span>psupp</span><span>.</span><span>availqty</span> <span>,</span>\n\t<span>psupp</span><span>.</span><span>supplycost</span> <span>,</span>\n\t<span>ord</span><span>.</span><span>shippriority</span> <span>,</span>\n\t<span>ord</span><span>.</span><span>totalprice</span> \n<span>FROM</span> <span>iceberg2</span><span>.</span><span>ice</span><span>.</span><span>tpch_sf100000_lineitem</span> <span>litem</span>\n<span>LEFT</span> <span>JOIN</span> <span>iceberg2</span><span>.</span><span>ice</span><span>.</span><span>tpch_sf100000_partsupp</span> <span>psupp</span> <span>ON</span> <span>litem</span><span>.</span><span>partkey</span> <span>=</span> <span>psupp</span><span>.</span><span>partkey</span> <span>and</span> <span>litem</span><span>.</span><span>suppkey</span> <span>=</span> <span>psupp</span><span>.</span><span>suppkey</span> \n<span>LEFT</span> <span>JOIN</span> <span>iceberg2</span><span>.</span><span>ice</span><span>.</span><span>tpch_sf100000_orders</span> <span>ord</span> <span>ON</span> <span>litem</span><span>.</span><span>orderkey</span> <span>=</span> <span>ord</span><span>.</span><span>orderkey</span> \n</code></pre></div>\n<p>The query has been completed in 4 hours. Also, at query processing, worker 22\nhas been turned off. The query has been automatically started over and completed\nsuccessfully. At the query processing, three tables have been joined (<em>the\ntriple join</em>): 18 billion rows x 2.4 billion rows x 450 million rows.</p>\n<p>This experiment gave us the confidence to move forward in our plans to rebuild\nour architecture with Trino in order to perform analytical and transformational\nmanipulations upon data directly in S3, which will allow us to exclude HDFS and\nHive interference in these processes.</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/qaz-ai-modern-data-stack/new-architecture.png\">\n</p>\n<p>As a result we will achieve faster pipelines.</p>\n<p>A huge thanks to the Trino development team and the Trino community for an\nexcellent product, which I enjoy using and allows me to go beyond conventional\nusage patterns.</p>\n<p>If you are looking for help building your data warehouse, or if you’re\ninterested in joining us at QazAI, feel free to reach out to me at Baurzhan Kuspayev on the <a target=\"_blank\" href=\"https://join.slack.com/t/trinodb/shared_invite/zt-1aek3l6bn-ZMsvFZJqP1ULx5pU17WP1Q\">Trino Slack</a>.</p>\n<p><em>Note from Trino community</em>: We welcome blog submissions from the community. If you have blog ideas, please send a message in the #dev chat. We will mail you Trino swag as a token of appreciation for successful submissions. <a target=\"_blank\" href=\"https://join.slack.com/t/trinodb/shared_invite/zt-1aek3l6bn-ZMsvFZJqP1ULx5pU17WP1Q\">Trino Slack</a>.</p>\n<p><a target=\"_blank\" href=\"https://cutt.ly/qaz-ai-trino-reddit\">Discuss on Reddit</a></p>\n<p><a target=\"_blank\" href=\"https://news.ycombinator.com/item?id=31672725\">Discuss On Hacker News</a></p>\n  </div>\n</article>\n</div>"
---

At QazAI, we build data lakes as a service for companies.  In the original
architecture, we get raw data in S3, transform the S3 data with Hive, and then
delivered the data to business units via our datamart built on Clickhouse (for optimal delivery speeds). Over time, we were dragged down by the slower speeds and high costs of running Hive, and started shopping for a faster and cheaper open source engine to do our ETL data transformations.
This diagram shows our existing stack. The big problem to solve was that the
Hadoop cluster was extremely inefficient. This leads to slow queries, and up
to 10x higher costs.
Like many others, I was initially drawn to Trino to run analytics over Hive
tables because of its speed, but found many other advantages as well. Key among
them are the following characteristics.
Speed
Queries ran 10 to 100 times faster, compared to our old stack. It was fantastic,
simply beyond our expectations.
Standard SQL
Standard SQL dialect that everyone already knew. Data analysts loved getting to
use a dialect they were already familiar with.
Federated analytics
Ability to connect with other databases and run federated queries. After I had
connected all the available data sources, I showed the results to the data
analysts. They were simply amazed, some were shocked when the ‘join’ operation
between the tables of various databases had been completed successfully. To
emphasize - this saved days of work.  You could join data from other data
sources straight away, avoiding the need to create a staging layer in the data
warehouse.
Simplicity of setup
Trino just works out of the box. This is what makes it great. As open source
users, we’re used to going through a complicated software setup process. But
with Trino, there’s no need to deploy anything else. You simply install packages
from the open source repository, and things work. It’s magical. To top that off,
Trino feels like a commercial product with its detailed documentation and active
Slack community that is willing to help you out on everything.
Exploring Trino as an option for ETL
A great number of connectors, standard SQL, high processing speed - all these
advantages raise an obvious question: ‘Why not use Trino for ETL processes as
well?
At QazAI, the key blocker to using Trino for ETL was that Trino doesn’t have
fault tolerance. As a result, our pipelines did not have reliable landing times,
and required a lot of manual monitoring.
This is precisely what made Project Tardigrade so exciting for us. Proving that
Trino is indeed a true community-driven project, Trino community members have
embarked on the Tardigrade project. The main feature of this technology is the
ability to divide the query into phases, and restart the failed phases. We’ve
been running tests to explore this. The ETL pipeline on Trino running on 5 bare
metal nodes is 20 times faster compared to ETL running on the stack consisting
of Sqoop, HDFS, Hive, and custom Python scripts.
Testing Trino for ETL
Let’s play a bit with the rental database called DVD.
For instance, we create the database shown above in PostgreSQL and work with the rental table.
First, we move the table from PostgreSQL to our warehouse in HDFS and Hive.

CREATE TABLE hive.test.dvd_rental  
WITH (format = 'PARQUET')
AS (SELECT 
	rental_id,
	cast(rental_date AS timestamp) AS rental_date,
	inventory_id,
	cast(customer_id AS integer) AS customer_id,
	cast(return_date AS timestamp) AS return_date,
	cast(staff_id AS integer) AS staff_id,
	cast(last_update AS timestamp) AS last_update 
FROM postgresqldvd.public.rental)


Now we perform the same operation but we use the table of Iceberg format on S3 with hidden partitioning.

CREATE TABLE iceberg2.ice.dvd_rental  
WITH (partitioning = ARRAY['month(rental_date)', 'bucket(inventory_id, 10)'],
    format = 'PARQUET')
AS (SELECT 
	rental_id,
	rental_date,
	inventory_id,
	cast(customer_id AS integer) AS customer_id,
	return_date,
	cast(staff_id AS integer) AS staff_id,
	last_update 
FROM postgresqldvd.public.rental)


Now we perform the same operation:

CREATE TABLE hive.test.dvd_staff
WITH (format = 'PARQUET')
AS (SELECT 
	staff_id,
	first_name,
	last_name,
	cast(address_id AS integer) AS address_id,
	email,
	cast(store_id AS integer) AS store_id,
	active,
	username,
	password,
	cast(last_update AS timestamp) AS last_update,
	picture
FROM postgresqldvd.public.staff)

CREATE TABLE hive.test.dvd_customer
WITH (format = 'PARQUET')
AS (SELECT 
	customer_id,
	cast(store_id AS integer) AS store_id,
	first_name,
	last_name,
	email,
	cast(address_id AS integer) AS address_id,
	activebool,
	create_date,
	cast(last_update AS timestamp) AS last_update,
	active
FROM postgresqldvd.public.customer)


Great. What if there is a need to enrich the data with the employees’ and
clients’ names? To do this, we create a table, move it to the
core layer, and then apply denormalization.
Here we move the measurements table.

CREATE TABLE hive.test.dvd_staff
WITH (format = 'PARQUET')
AS (SELECT 
	staff_id,
	first_name,
	last_name,
	cast(address_id AS integer) AS address_id,
	email,
	cast(store_id AS integer) AS store_id,
	active,
	username,
	password,
	cast(last_update AS timestamp) AS last_update,
	picture
FROM postgresqldvd.public.staff)

CREATE TABLE hive.test.dvd_customer
WITH (format = 'PARQUET')
AS (SELECT 
	customer_id,
	cast(store_id AS integer) AS store_id,
	first_name,
	last_name,
	email,
	cast(address_id AS integer) AS address_id,
	activebool,
	create_date,
	cast(last_update AS timestamp) AS last_update,
	active
FROM postgresqldvd.public.customer)


Let’s union the Staff and Customers tables.

CREATE TABLE hive.test.dvd_core_rental
WITH (format = 'PARQUET')
AS (SELECT
	rental_id,
	rental_date,
	inventory_id,
	cst.first_name AS customer_name, --cast(customer_id as integer) as customer_id,
	cst.last_name AS customer_lastname,
	cast(return_date AS timestamp) AS return_date,
	stf.first_name AS staff_name, --cast(staff_id as integer) as staff_id,
	stf.last_name AS staff_lastname,
	rnt.last_update
FROM hive.test.dvd_rental rnt
LEFT JOIN hive.test.dvd_customer cst ON rnt.customer_id = cst.customer_id
LEFT JOIN hive.test.dvd_staff stf ON rnt.staff_id = stf.staff_id)


If this table is required by data analysts, then we can easily move it to the data mart (the Clickhouse layer we use to deliver data to end users).

CREATE TABLE clickhouse.default.rental_analysis_table
(
	rental_id integer NOT NULL,
	rental_date date,
	inventory_id integer,
	customer_name varchar NOT NULL, 
	customer_lastname varchar NOT NULL,
	return_date date,
	staff_name varchar,
	staff_lastname varchar,
	last_update date   
)
WITH (engine = 'MergeTree',
    order_by = ARRAY['customer_name', 'customer_lastname']);


A simple insert/select query and nothing more.

INSERT INTO clickhouse.default.rental_analysis_table
SELECT * FROM hive.test.dvd_core_rental


Alternatively we can easily move the datamart to Clickhouse directly from PostgreSQL without intermediate data layers.

INSERT INTO clickhouse.default.rental_analysis_table
SELECT
	rental_id,
	rental_date,
	inventory_id,
	cst.first_name AS customer_name, 
	cst.last_name AS customer_lastname,
	cast(return_date AS timestamp) AS return_date,
	stf.first_name AS staff_name, 
	stf.last_name AS staff_lastname,
	rnt.last_update
FROM postgresqldvd.public.rental rnt
LEFT JOIN postgresqldvd.public.customer cst ON rnt.customer_id = cst.customer_id
LEFT JOIN postgresqldvd.public.staff stf ON rnt.staff_id = stf.staff_i


Great.
One may suggest that this sample dataset is a small one with only 16 000 rows.
The production ETL is mostly run over huge tables containing millions or
billions of rows.  Let’s test. We work with the tpch database with the scaling
factor 3000.
For testing, we consider three tables: lineitem (18 billion rows),
orders (450 million rows) and partsupp (2.4 billion rows).

CREATE TABLE iceberg2.ice.tpch_sf3000_customer –(450 M)
WITH (format = 'ORC')
AS
SELECT *
FROM tpch.sf3000.customer

CREATE TABLE iceberg2.ice.tpch_sf3000_lineitem –(18 B)
WITH (format = 'ORC')
AS
SELECT *
FROM tpch.sf3000.lineitem

CREATE TABLE iceberg2.ice.tpch_sf3000_partsupp –(2,4 B)
WITH (format = 'ORC')
AS
SELECT *
FROM tpch.sf3000.partsupp


Then, we try to join all three of these tables as it is shown in the ER diagram.
Let’s make it more challenging by turning off one of the workers, which should
result in a query failure. To enable the automatic query rerun of the failed one
we set retry_policy=QUERY in config. properties.

CREATE TABLE iceberg2.ice.tpch_sf3000_lineitem_joined 
WITH (format = 'ORC')
AS
SELECT litem.orderkey ,
	litem.partkey ,
	litem.suppkey ,
	litem.linenumber ,
	litem.quantity ,
	litem.extendedprice ,
	litem.discount ,
	litem.tax ,
	litem.returnflag ,
	litem.linestatus ,
	litem.shipdate ,
	litem.commitdate ,
	litem.receiptdate ,
	litem.shipinstruct ,
	litem.shipmode ,
	litem.comment,
	psupp.availqty ,
	psupp.supplycost ,
	ord.shippriority ,
	ord.totalprice 
FROM iceberg2.ice.tpch_sf100000_lineitem litem
LEFT JOIN iceberg2.ice.tpch_sf100000_partsupp psupp ON litem.partkey = psupp.partkey and litem.suppkey = psupp.suppkey 
LEFT JOIN iceberg2.ice.tpch_sf100000_orders ord ON litem.orderkey = ord.orderkey 


The query has been completed in 4 hours. Also, at query processing, worker 22
has been turned off. The query has been automatically started over and completed
successfully. At the query processing, three tables have been joined (the
triple join): 18 billion rows x 2.4 billion rows x 450 million rows.
This experiment gave us the confidence to move forward in our plans to rebuild
our architecture with Trino in order to perform analytical and transformational
manipulations upon data directly in S3, which will allow us to exclude HDFS and
Hive interference in these processes.
As a result we will achieve faster pipelines.
A huge thanks to the Trino development team and the Trino community for an
excellent product, which I enjoy using and allows me to go beyond conventional
usage patterns.
If you are looking for help building your data warehouse, or if you’re
interested in joining us at QazAI, feel free to reach out to me at Baurzhan Kuspayev on the Trino Slack.
Note from Trino community: We welcome blog submissions from the community. If you have blog ideas, please send a message in the #dev chat. We will mail you Trino swag as a token of appreciation for successful submissions. Trino Slack.
Discuss on Reddit
Discuss On Hacker News
