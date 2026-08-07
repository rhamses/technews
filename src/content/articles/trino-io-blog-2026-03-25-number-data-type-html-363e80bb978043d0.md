---
title: "Introducing the NUMBER data type"
link: "https://trino.io/blog/2026/03/25/number-data-type.html"
guid: "https://trino.io/blog/2026/03/25/number-data-type.html"
pubDate: "2026-03-25T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "One of Trino’s core strengths is breaking down data silos—enabling data\nengineers to query diverse data sources through a single SQL interface. However,\nwhen those sources use high-precision numeric types beyond Trino’s 38-digit\nDECIMAL limit, that promise breaks down. Users faced an impossible choice: skip\nthe columns entirely and lose access to critical data, or accept lossy rounding\nthat compromises data integrity.\nThis challenge required a new approach: a dedicated data type for high-precision,\nvariable-scale decimals.\nAdding a new built-in data type to Trino is exceptionally rare. The last time we\nintroduced a new type was the UUID type in May 2019—nearly seven years ago.\nTypes are fundamental building blocks that touch many parts of the system, from\nthe type registry, through coercion rules to connectors, functions, and the protocol.\nThey require careful design and long-term commitment.\nWith Trino 480, we’re excited to introduce the NUMBER type—a high-precision\ndecimal type that breaks down these data silos and enables seamless access to\nnumeric data across diverse database systems. This addition is particularly\npowerful for data engineers working with Oracle, PostgreSQL, MySQL, MariaDB, and\nSingleStore, which support numeric precision beyond the traditional 38-digit\nDECIMAL limit.\nLet’s explore why NUMBER matters, how it works, and how it will simplify your\ndata integration workflows.\nThe challenge: precision beyond 38 digits\nTrino’s DECIMAL type has long supported exact numeric values with precision up\nto 38 decimal digits, which covers the vast majority of use cases. However,\nmany database systems support higher precision:\nOracle NUMBER: when declared as NUMBER(p, s), precision must be in [1, 38] and\nscale in [-84, 127]. When declared as NUMBER without precision/scale, each value\ncan have different scale, and actual precision can reach 40 decimal digits. Oracle can\nstore values from 10^-130 to (but not including) 10^126.\nPostgreSQL NUMERIC: supports precision and scale in range from -1000 to 1000;\nsupports very high precision numbers with up to 131,072 digits before the decimal point.\nWhen declared without precision/scale constraints, each value can have different scale.\nMySQL, MariaDB, SingleStore DECIMAL: up to 65 digits of precision (scale 0-30)\nBefore Trino 480, accessing these high-precision numeric columns required\nchoosing between two unsatisfying options:\nSkip the columns entirely and lose access to potentially critical data.\nThis was the default behavior.\nAccept lossy conversions - Use decimal-mapping=ALLOW_OVERFLOW with\ndecimal-default-scale=S to force values into DECIMAL(38, S), losing precision\nthrough rounding and failing for numbers greater than or equal to 10^(38-S).\nFor example, with scale 10, values ≥ 10^28 would fail.\nNeither option is ideal for data federation and warehousing scenarios where\npreserving data fidelity is essential.\nEnter NUMBER: arbitrary-precision decimals in Trino\nThe NUMBER type solves this problem by supporting floating-point decimal numbers\nof high precision and flexible scale. In practice, NUMBER supports values with\nup to 200 digits of precision – far exceeding what most database workloads require.\nEach value can have a different scale, allowing for values as small as 10^-16000\n(or even smaller) and as large as 10^16000 (or even larger) within the same column.\nHere’s what NUMBER looks like in action:\n\n-- High-precision literal (50+ digits)\nSELECT NUMBER '3.1415926535897932384626433832795028841971693993751';\n\n\n\n 3.1415926535897932384626433832795028841971693993751\n\n\n\n-- Scientific notation with extreme precision\nSELECT NUMBER '12345678901234567890123456789012345678901234567890e30';\n\n\n\n 1.234567890123456789012345678901234567890123456789E+79\n\n\n\n-- Verify the type\nSELECT typeof(NUMBER '123.456');\n\n\n\n number\n\n\nSpecial values\nNUMBER also supports special values similar to IEEE 754 floating-point types:\n\nSELECT\n  NUMBER 'Infinity' as positive_infinity,\n  NUMBER '-Infinity' as negative_infinity,\n  NUMBER 'NaN' as not_a_number;\n\n\n\n positive_infinity | negative_infinity | not_a_number\n-------------------+-------------------+--------------\n +Infinity         | -Infinity         | NaN\n\n\nThese special values follow intuitive comparison and ordering semantics that\nfollow DOUBLE behavior. NaN compares as inequal to all values, including\nitself. Any comparison with NaN returns false. When sorting, values are\nordered as follows: -Infinity, all finite values, +Infinity followed by NaN.\nThe special values are particularly useful for handling edge cases in source data.\nIn particular, PostgreSQL’s NUMERIC type can represent NaN and Infinity, and\nthese values are now seamlessly mapped to NUMBER when queried through the PostgreSQL\nconnector.\nSeamless connector integration\nThe real power of NUMBER becomes apparent when querying external databases. Five\nconnectors now automatically map high-precision numeric types to NUMBER,\nrequiring no configuration changes:\nOracle connector\nOracle’s NUMBER type supports variable precision and scale. The Oracle connector\nnow maps:\nNUMBER(p, s) where p > 38 → Trino NUMBER\nNUMBER without precision/scale → Trino NUMBER\nNUMBER with extreme scale values → Trino NUMBER\n\n-- Query an Oracle table with high-precision columns\nSELECT order_id, unit_price, extended_price\nFROM oracle.sales.orders\nWHERE extended_price > NUMBER '1000000000000000000000000';\n\n\nPostgreSQL connector\nPostgreSQL’s NUMERIC type supports very high precision and even “unconstrained”\nprecision. The connector automatically handles:\nNUMERIC(p, s) where p > 38 → Trino NUMBER\nNUMERIC without precision/scale → Trino NUMBER\n\n-- Access PostgreSQL scientific data without precision loss\nSELECT measurement_id, precise_value -- a NUMERIC column\nFROM postgresql.lab.measurements\n\n\nMySQL, MariaDB, and SingleStore connectors\nThese MySQL-compatible databases support DECIMAL precision up to 65 digits. The\nconnectors now map:\nDECIMAL(p, s) where p > 38 → Trino NUMBER\n\n-- Join across different databases with high precision\nSELECT\n  m.account_id,\n  m.balance as mysql_balance,\n  o.balance as oracle_balance\nFROM mysql.banking.accounts m\nJOIN oracle.banking.accounts o ON m.account_id = o.account_id\nWHERE abs(m.balance - o.balance) > NUMBER '0.01';\n\n\nBackwards compatibility and migration\nThe NUMBER type integration is designed to be seamless and backward compatible:\nAutomatic mapping\nIf you previously relied on the default behavior (no decimal-mapping\nconfiguration), your queries now automatically use NUMBER for high-precision\ncolumns. No configuration changes needed.\nLegacy configurations still work\nIf you explicitly configured decimal-mapping=ALLOW_OVERFLOW or\ndecimal-mapping=STRICT, your existing configuration continues to work. The\nNUMBER mapping is disabled when these options are set, ensuring no surprises.\nHowever, the decimal-mapping configuration and related session properties\n(decimal_mapping, decimal_default_scale, decimal_rounding_mode) are now\ndeprecated and will be removed in a future Trino release. We recommend\nmigrating to NUMBER-based workflows:\nBefore (with lossy conversion):\n\n# catalog/postgresql.properties\nconnection-url=jdbc:postgresql://host:5432/database\nconnection-user=user\nconnection-password=password\ndecimal-mapping=ALLOW_OVERFLOW\ndecimal-default-scale=10\ndecimal-rounding-mode=HALF_UP\n\n\nAfter (lossless with NUMBER):\n\n# catalog/postgresql.properties\nconnection-url=jdbc:postgresql://host:5432/database\nconnection-user=user\nconnection-password=password\n# No decimal-mapping needed - NUMBER is used automatically!\n\n\nFor Oracle, if you previously used oracle.number.rounding-mode to handle\nhigh-precision NUMBER columns, you can now remove this configuration to enable\nnative NUMBER mapping.\nWorking with NUMBER\nType conversions\nNUMBER integrates naturally with Trino’s type system:\n\n-- Convert from other numeric types\nSELECT\n  CAST(DECIMAL '123.45' AS NUMBER) as from_decimal,\n  CAST(12345 AS NUMBER) as from_integer,\n  CAST(123.45e0 AS NUMBER) as from_double;\n\n\n\n from_decimal | from_integer | from_double\n--------------+--------------+-------------\n 123.45       | 12345        | 123.45\n\n\n\n-- Convert NUMBER to other types\nSELECT\n  CAST(NUMBER '123.456' AS BIGINT) as to_bigint,\n  CAST(NUMBER '123.456' AS DOUBLE) as to_double,\n  CAST(NUMBER '123.456' AS DECIMAL(10,2)) as to_decimal;\n\n\n\n to_bigint | to_double | to_decimal\n-----------+-----------+------------\n 123       | 123.456   | 123.46\n\n\nAggregate functions\nCommon aggregate functions work naturally with NUMBER:\n\n-- Aggregate high-precision values\nSELECT\n  department,\n  sum(revenue) as total_revenue,\n  avg(revenue) as average_revenue,\n  min(revenue) as min_revenue,\n  max(revenue) as max_revenue\nFROM oracle.sales.transactions\nGROUP BY department;\n\n\nCreating tables with NUMBER columns\nThe Oracle and PostgreSQL connectors support creating tables with NUMBER columns:\n\n-- Create a PostgreSQL table with NUMBER column\nCREATE TABLE postgresql.schema.measurements (\n  id BIGINT,\n  precise_value NUMBER\n);\n\n-- Create an Oracle table with NUMBER column\nCREATE TABLE oracle.schema.scientific_data (\n  experiment_id VARCHAR(50),\n  measurement NUMBER\n);\n\n\nTechnical characteristics and limitations\nWhile NUMBER provides high precision, it’s important to understand its\ncharacteristics:\nPrecision and scale\nTrino’s NUMBER type characteristics:\nSupported precision: currently 200 decimal digits.\nWhile we consider this an implementation detail that may change in future releases,\nit is unlikely that maximum precision will be decreased.\nScale range: -16,384 to 16,383\nVariable scale: each value can have a different scale, similar to\nPostgreSQL NUMERIC and Oracle NUMBER\nSpecial values: supports NaN, Infinity, and -Infinity\nComparison of decimal numeric types across database systems:\nDatabase\n      Max Precision\n      Scale Range\n      Variable Scale\n    \nOracle NUMBER(p, s)\n      38\n      -84 to 127\n      No\n    \nOracle NUMBER\n      40\n      Approximately -130 to 126\n      Yes\n    \nPostgreSQL NUMERIC(p, s)\n      38\n      -1000 to 1000\n      No\n    \nPostgreSQL NUMERIC\n      131,072\n      -1000 to 1000\n      Yes\n    \nMySQL/MariaDB/SingleStore DECIMAL\n      65\n      0 to 30\n      No\n    \nTrino DECIMAL\n      38\n      0 to 38\n      No\n    \nTrino NUMBER\n      200\n      -16,384 to 16,383\n      Yes\n    \nStorage and representation\nNUMBER uses a variable-width binary format optimized for flexibility:\n2-byte header encoding sign and scale\nVariable-length magnitude in big-endian format\nThe binary format is considered unstable and may evolve in future releases to\nenable optimizations and performance improvements\nThis flexibility allows Trino to improve NUMBER’s internal representation over\ntime without breaking connector compatibility.\nTrino SPI provides a stable API for connectors to read and write NUMBER values,\nabstracting away the internal format.\nPerformance considerations\nNUMBER uses Java’s BigDecimal for arithmetic operations, which provides exact\nprecision at the cost of being slower than fixed-precision types like BIGINT,\nDOUBLE or DECIMAL. For this reason, NUMBER is designed for scenarios where\nprecision is more important than computational speed:\nBest for: reading and storing high-precision data from source systems,\ndata federation, reporting, data warehousing\nNot optimal for: computational heavy-lifting, complex mathematical\noperations, high-performance analytics on numeric columns\nIf your workload involves extensive numeric computation, consider whether DECIMAL\n(for up to 38 digits), DOUBLE (for approximate arithmetic), or BIGINT (for\ninteger arithmetic) might be more appropriate.\nFunction support\nNUMBER supports essential operations:\nArithmetic: +, -, *, /\nAggregations: sum(), avg(), min(), max()\nRounding functions: abs(), sign(), ceiling(), floor(), truncate(),\nround()\nSpecial value checks: is_nan(), is_finite(), is_infinite()\nMany advanced mathematical functions (trigonometric, logarithmic, etc.)\ndo not work with NUMBER directly and require explicit type conversions to DOUBLE or DECIMAL.\nWhat’s next\nThe NUMBER type support will continue to evolve. Additional connectors are\nplanned for future releases:\nClickHouse: for Decimal256 type mapping\nApache Ignite: for high-precision numeric support\nWe’re also exploring performance optimizations and expanding function support\nbased on community feedback.\nGetting started\nNUMBER support is available now in Trino 480. To start using it:\nUpgrade to Trino 480 - NUMBER is available out of the box\nRemove deprecated configs - If you used decimal-mapping configurations,\nconsider removing them to enable automatic NUMBER mapping\nQuery your data - High-precision columns are now accessible without\nconfiguration\nFor detailed documentation, refer to:\nNUMBER type reference\nOracle connector documentation\nPostgreSQL connector documentation\nMySQL connector documentation\nMariaDB connector documentation\nSingleStore connector documentation\nHave questions or feedback? Join the discussion on the Trino community\nSlack in the #dev channel, or open an issue on\nGitHub.\nThe NUMBER type represents a significant milestone in Trino’s evolution,\neliminating precision loss barriers and making high-precision numeric data from\ndiverse sources readily accessible for analytics and reporting. We’re excited to\nsee how the community uses this powerful new capability!\n□"
author: "Piotr Findeisen, Starburst Data"
contentHtml: "<div>\n<article>\n  <div><p>One of Trino’s core strengths is breaking down data silos—enabling data\nengineers to query diverse data sources through a single SQL interface. However,\nwhen those sources use high-precision numeric types beyond Trino’s 38-digit\nDECIMAL limit, that promise breaks down. Users faced an impossible choice: skip\nthe columns entirely and lose access to critical data, or accept lossy rounding\nthat compromises data integrity.</p>\n<p>This challenge required a new approach: a dedicated data type for high-precision,\nvariable-scale decimals.</p>\n<!--more-->\n<p>Adding a new built-in data type to Trino is exceptionally rare. The last time we\nintroduced a new type was the UUID type in May 2019—nearly seven years ago.\nTypes are fundamental building blocks that touch many parts of the system, from\nthe type registry, through coercion rules to connectors, functions, and the protocol.\nThey require careful design and long-term commitment.</p>\n<p>With Trino 480, we’re excited to introduce the NUMBER type—a high-precision\ndecimal type that breaks down these data silos and enables seamless access to\nnumeric data across diverse database systems. This addition is particularly\npowerful for data engineers working with Oracle, PostgreSQL, MySQL, MariaDB, and\nSingleStore, which support numeric precision beyond the traditional 38-digit\nDECIMAL limit.</p>\n<p>Let’s explore why NUMBER matters, how it works, and how it will simplify your\ndata integration workflows.</p>\n<h2 id=\"the-challenge-precision-beyond-38-digits\">\n    The challenge: precision beyond 38 digits <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#the-challenge-precision-beyond-38-digits\">#</a>\n</h2>\n<p>Trino’s DECIMAL type has long supported exact numeric values with precision up\nto 38 decimal digits, which covers the vast majority of use cases. However,\nmany database systems support higher precision:</p>\n<ul>\n  <li><strong>Oracle NUMBER</strong>: when declared as <code>NUMBER(p, s)</code>, precision must be in [1, 38] and\nscale in [-84, 127]. When declared as <code>NUMBER</code> without precision/scale, each value\ncan have different scale, and actual precision can reach 40 decimal digits. Oracle can\nstore values from 10^-130 to (but not including) 10^126.</li>\n  <li><strong>PostgreSQL NUMERIC</strong>: supports precision and scale in range from -1000 to 1000;\nsupports very high precision numbers with up to 131,072 digits before the decimal point.\nWhen declared without precision/scale constraints, each value can have different scale.</li>\n  <li><strong>MySQL, MariaDB, SingleStore DECIMAL</strong>: up to 65 digits of precision (scale 0-30)</li>\n</ul>\n<p>Before Trino 480, accessing these high-precision numeric columns required\nchoosing between two unsatisfying options:</p>\n<ol>\n  <li><strong>Skip the columns entirely</strong> and lose access to potentially critical data.\nThis was the default behavior.</li>\n  <li><strong>Accept lossy conversions</strong> - Use <code>decimal-mapping=ALLOW_OVERFLOW</code> with\n<code>decimal-default-scale=S</code> to force values into <code>DECIMAL(38, S)</code>, losing precision\nthrough rounding and failing for numbers greater than or equal to 10^(38-S).\nFor example, with scale 10, values ≥ 10^28 would fail.</li>\n</ol>\n<p>Neither option is ideal for data federation and warehousing scenarios where\npreserving data fidelity is essential.</p>\n<h2 id=\"enter-number-arbitrary-precision-decimals-in-trino\">\n    Enter NUMBER: arbitrary-precision decimals in Trino <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#enter-number-arbitrary-precision-decimals-in-trino\">#</a>\n</h2>\n<p>The NUMBER type solves this problem by supporting floating-point decimal numbers\nof high precision and flexible scale. In practice, NUMBER supports values with\nup to 200 digits of precision – far exceeding what most database workloads require.\nEach value can have a different scale, allowing for values as small as 10^-16000\n(or even smaller) and as large as 10^16000 (or even larger) within the same column.</p>\n<p>Here’s what NUMBER looks like in action:</p>\n<div><pre><code><span>-- High-precision literal (50+ digits)</span>\n<span>SELECT</span> <span>NUMBER</span> <span>'3.1415926535897932384626433832795028841971693993751'</span><span>;</span>\n</code></pre></div>\n<div><pre><code> 3.1415926535897932384626433832795028841971693993751\n</code></pre></div>\n<div><pre><code><span>-- Scientific notation with extreme precision</span>\n<span>SELECT</span> <span>NUMBER</span> <span>'12345678901234567890123456789012345678901234567890e30'</span><span>;</span>\n</code></pre></div>\n<div><pre><code> 1.234567890123456789012345678901234567890123456789E+79\n</code></pre></div>\n<div><pre><code><span>-- Verify the type</span>\n<span>SELECT</span> <span>typeof</span><span>(</span><span>NUMBER</span> <span>'123.456'</span><span>);</span>\n</code></pre></div>\n<div><pre><code> number\n</code></pre></div>\n<h3 id=\"special-values\">\n    Special values <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#special-values\">#</a>\n</h3>\n<p>NUMBER also supports special values similar to IEEE 754 floating-point types:</p>\n<div><pre><code><span>SELECT</span>\n  <span>NUMBER</span> <span>'Infinity'</span> <span>as</span> <span>positive_infinity</span><span>,</span>\n  <span>NUMBER</span> <span>'-Infinity'</span> <span>as</span> <span>negative_infinity</span><span>,</span>\n  <span>NUMBER</span> <span>'NaN'</span> <span>as</span> <span>not_a_number</span><span>;</span>\n</code></pre></div>\n<div><pre><code> positive_infinity | negative_infinity | not_a_number\n-------------------+-------------------+--------------\n +Infinity         | -Infinity         | NaN\n</code></pre></div>\n<p>These special values follow intuitive comparison and ordering semantics that\nfollow DOUBLE behavior. <code>NaN</code> compares as inequal to all values, including\nitself. Any comparison with <code>NaN</code> returns false. When sorting, values are\nordered as follows: <code>-Infinity</code>, all finite values, <code>+Infinity</code> followed by <code>NaN</code>.</p>\n<p>The special values are particularly useful for handling edge cases in source data.\nIn particular, PostgreSQL’s NUMERIC type can represent <code>NaN</code> and <code>Infinity</code>, and\nthese values are now seamlessly mapped to NUMBER when queried through the PostgreSQL\nconnector.</p>\n<h2 id=\"seamless-connector-integration\">\n    Seamless connector integration <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#seamless-connector-integration\">#</a>\n</h2>\n<p>The real power of NUMBER becomes apparent when querying external databases. Five\nconnectors now automatically map high-precision numeric types to NUMBER,\nrequiring <strong>no configuration changes</strong>:</p>\n<h3 id=\"oracle-connector\">\n    Oracle connector <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#oracle-connector\">#</a>\n</h3>\n<p>Oracle’s NUMBER type supports variable precision and scale. The Oracle connector\nnow maps:</p>\n<ul>\n  <li><code>NUMBER(p, s)</code> where p &gt; 38 → Trino <code>NUMBER</code></li>\n  <li><code>NUMBER</code> without precision/scale → Trino <code>NUMBER</code></li>\n  <li><code>NUMBER</code> with extreme scale values → Trino <code>NUMBER</code></li>\n</ul>\n<div><pre><code><span>-- Query an Oracle table with high-precision columns</span>\n<span>SELECT</span> <span>order_id</span><span>,</span> <span>unit_price</span><span>,</span> <span>extended_price</span>\n<span>FROM</span> <span>oracle</span><span>.</span><span>sales</span><span>.</span><span>orders</span>\n<span>WHERE</span> <span>extended_price</span> <span>&gt;</span> <span>NUMBER</span> <span>'1000000000000000000000000'</span><span>;</span>\n</code></pre></div>\n<h3 id=\"postgresql-connector\">\n    PostgreSQL connector <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#postgresql-connector\">#</a>\n</h3>\n<p>PostgreSQL’s NUMERIC type supports very high precision and even “unconstrained”\nprecision. The connector automatically handles:</p>\n<ul>\n  <li><code>NUMERIC(p, s)</code> where p &gt; 38 → Trino <code>NUMBER</code></li>\n  <li><code>NUMERIC</code> without precision/scale → Trino <code>NUMBER</code></li>\n</ul>\n<div><pre><code><span>-- Access PostgreSQL scientific data without precision loss</span>\n<span>SELECT</span> <span>measurement_id</span><span>,</span> <span>precise_value</span> <span>-- a NUMERIC column</span>\n<span>FROM</span> <span>postgresql</span><span>.</span><span>lab</span><span>.</span><span>measurements</span>\n</code></pre></div>\n<h3 id=\"mysql-mariadb-and-singlestore-connectors\">\n    MySQL, MariaDB, and SingleStore connectors <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#mysql-mariadb-and-singlestore-connectors\">#</a>\n</h3>\n<p>These MySQL-compatible databases support DECIMAL precision up to 65 digits. The\nconnectors now map:</p>\n<ul>\n  <li><code>DECIMAL(p, s)</code> where p &gt; 38 → Trino <code>NUMBER</code></li>\n</ul>\n<div><pre><code><span>-- Join across different databases with high precision</span>\n<span>SELECT</span>\n  <span>m</span><span>.</span><span>account_id</span><span>,</span>\n  <span>m</span><span>.</span><span>balance</span> <span>as</span> <span>mysql_balance</span><span>,</span>\n  <span>o</span><span>.</span><span>balance</span> <span>as</span> <span>oracle_balance</span>\n<span>FROM</span> <span>mysql</span><span>.</span><span>banking</span><span>.</span><span>accounts</span> <span>m</span>\n<span>JOIN</span> <span>oracle</span><span>.</span><span>banking</span><span>.</span><span>accounts</span> <span>o</span> <span>ON</span> <span>m</span><span>.</span><span>account_id</span> <span>=</span> <span>o</span><span>.</span><span>account_id</span>\n<span>WHERE</span> <span>abs</span><span>(</span><span>m</span><span>.</span><span>balance</span> <span>-</span> <span>o</span><span>.</span><span>balance</span><span>)</span> <span>&gt;</span> <span>NUMBER</span> <span>'0.01'</span><span>;</span>\n</code></pre></div>\n<h2 id=\"backwards-compatibility-and-migration\">\n    Backwards compatibility and migration <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#backwards-compatibility-and-migration\">#</a>\n</h2>\n<p>The NUMBER type integration is designed to be seamless and backward compatible:</p>\n<h3 id=\"automatic-mapping\">\n    Automatic mapping <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#automatic-mapping\">#</a>\n</h3>\n<p>If you previously relied on the default behavior (no <code>decimal-mapping</code>\nconfiguration), your queries now automatically use NUMBER for high-precision\ncolumns. No configuration changes needed.</p>\n<h3 id=\"legacy-configurations-still-work\">\n    Legacy configurations still work <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#legacy-configurations-still-work\">#</a>\n</h3>\n<p>If you explicitly configured <code>decimal-mapping=ALLOW_OVERFLOW</code> or\n<code>decimal-mapping=STRICT</code>, your existing configuration continues to work. The\nNUMBER mapping is disabled when these options are set, ensuring no surprises.</p>\n<p>However, the <code>decimal-mapping</code> configuration and related session properties\n(<code>decimal_mapping</code>, <code>decimal_default_scale</code>, <code>decimal_rounding_mode</code>) are now\n<strong>deprecated</strong> and will be removed in a future Trino release. We recommend\nmigrating to NUMBER-based workflows:</p>\n<p><strong>Before (with lossy conversion):</strong></p>\n<div><pre><code><span># catalog/postgresql.properties\n</span><span>connection-url</span><span>=</span><span>jdbc:postgresql://host:5432/database</span>\n<span>connection-user</span><span>=</span><span>user</span>\n<span>connection-password</span><span>=</span><span>password</span>\n<span>decimal-mapping</span><span>=</span><span>ALLOW_OVERFLOW</span>\n<span>decimal-default-scale</span><span>=</span><span>10</span>\n<span>decimal-rounding-mode</span><span>=</span><span>HALF_UP</span>\n</code></pre></div>\n<p><strong>After (lossless with NUMBER):</strong></p>\n<div><pre><code><span># catalog/postgresql.properties\n</span><span>connection-url</span><span>=</span><span>jdbc:postgresql://host:5432/database</span>\n<span>connection-user</span><span>=</span><span>user</span>\n<span>connection-password</span><span>=</span><span>password</span>\n<span># No decimal-mapping needed - NUMBER is used automatically!\n</span></code></pre></div>\n<p>For Oracle, if you previously used <code>oracle.number.rounding-mode</code> to handle\nhigh-precision NUMBER columns, you can now remove this configuration to enable\nnative NUMBER mapping.</p>\n<h2 id=\"working-with-number\">\n    Working with NUMBER <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#working-with-number\">#</a>\n</h2>\n<h3 id=\"type-conversions\">\n    Type conversions <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#type-conversions\">#</a>\n</h3>\n<p>NUMBER integrates naturally with Trino’s type system:</p>\n<div><pre><code><span>-- Convert from other numeric types</span>\n<span>SELECT</span>\n  <span>CAST</span><span>(</span><span>DECIMAL</span> <span>'123.45'</span> <span>AS</span> <span>NUMBER</span><span>)</span> <span>as</span> <span>from_decimal</span><span>,</span>\n  <span>CAST</span><span>(</span><span>12345</span> <span>AS</span> <span>NUMBER</span><span>)</span> <span>as</span> <span>from_integer</span><span>,</span>\n  <span>CAST</span><span>(</span><span>123</span><span>.</span><span>45</span><span>e0</span> <span>AS</span> <span>NUMBER</span><span>)</span> <span>as</span> <span>from_double</span><span>;</span>\n</code></pre></div>\n<div><pre><code> from_decimal | from_integer | from_double\n--------------+--------------+-------------\n 123.45       | 12345        | 123.45\n</code></pre></div>\n<div><pre><code><span>-- Convert NUMBER to other types</span>\n<span>SELECT</span>\n  <span>CAST</span><span>(</span><span>NUMBER</span> <span>'123.456'</span> <span>AS</span> <span>BIGINT</span><span>)</span> <span>as</span> <span>to_bigint</span><span>,</span>\n  <span>CAST</span><span>(</span><span>NUMBER</span> <span>'123.456'</span> <span>AS</span> <span>DOUBLE</span><span>)</span> <span>as</span> <span>to_double</span><span>,</span>\n  <span>CAST</span><span>(</span><span>NUMBER</span> <span>'123.456'</span> <span>AS</span> <span>DECIMAL</span><span>(</span><span>10</span><span>,</span><span>2</span><span>))</span> <span>as</span> <span>to_decimal</span><span>;</span>\n</code></pre></div>\n<div><pre><code> to_bigint | to_double | to_decimal\n-----------+-----------+------------\n 123       | 123.456   | 123.46\n</code></pre></div>\n<h3 id=\"aggregate-functions\">\n    Aggregate functions <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#aggregate-functions\">#</a>\n</h3>\n<p>Common aggregate functions work naturally with NUMBER:</p>\n<div><pre><code><span>-- Aggregate high-precision values</span>\n<span>SELECT</span>\n  <span>department</span><span>,</span>\n  <span>sum</span><span>(</span><span>revenue</span><span>)</span> <span>as</span> <span>total_revenue</span><span>,</span>\n  <span>avg</span><span>(</span><span>revenue</span><span>)</span> <span>as</span> <span>average_revenue</span><span>,</span>\n  <span>min</span><span>(</span><span>revenue</span><span>)</span> <span>as</span> <span>min_revenue</span><span>,</span>\n  <span>max</span><span>(</span><span>revenue</span><span>)</span> <span>as</span> <span>max_revenue</span>\n<span>FROM</span> <span>oracle</span><span>.</span><span>sales</span><span>.</span><span>transactions</span>\n<span>GROUP</span> <span>BY</span> <span>department</span><span>;</span>\n</code></pre></div>\n<h3 id=\"creating-tables-with-number-columns\">\n    Creating tables with NUMBER columns <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#creating-tables-with-number-columns\">#</a>\n</h3>\n<p>The Oracle and PostgreSQL connectors support creating tables with NUMBER columns:</p>\n<div><pre><code><span>-- Create a PostgreSQL table with NUMBER column</span>\n<span>CREATE</span> <span>TABLE</span> <span>postgresql</span><span>.</span><span>schema</span><span>.</span><span>measurements</span> <span>(</span>\n  <span>id</span> <span>BIGINT</span><span>,</span>\n  <span>precise_value</span> <span>NUMBER</span>\n<span>);</span>\n<span>-- Create an Oracle table with NUMBER column</span>\n<span>CREATE</span> <span>TABLE</span> <span>oracle</span><span>.</span><span>schema</span><span>.</span><span>scientific_data</span> <span>(</span>\n  <span>experiment_id</span> <span>VARCHAR</span><span>(</span><span>50</span><span>),</span>\n  <span>measurement</span> <span>NUMBER</span>\n<span>);</span>\n</code></pre></div>\n<h2 id=\"technical-characteristics-and-limitations\">\n    Technical characteristics and limitations <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#technical-characteristics-and-limitations\">#</a>\n</h2>\n<p>While NUMBER provides high precision, it’s important to understand its\ncharacteristics:</p>\n<h3 id=\"precision-and-scale\">\n    Precision and scale <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#precision-and-scale\">#</a>\n</h3>\n<p>Trino’s NUMBER type characteristics:</p>\n<ul>\n  <li><strong>Supported precision</strong>: currently 200 decimal digits.\nWhile we consider this an implementation detail that may change in future releases,\nit is unlikely that maximum precision will be decreased.</li>\n  <li><strong>Scale range</strong>: -16,384 to 16,383</li>\n  <li><strong>Variable scale</strong>: each value can have a different scale, similar to\nPostgreSQL NUMERIC and Oracle NUMBER</li>\n  <li><strong>Special values</strong>: supports <code>NaN</code>, <code>Infinity</code>, and <code>-Infinity</code></li>\n</ul>\n<p>Comparison of decimal numeric types across database systems:</p>\n<table>\n  <thead>\n    <tr>\n      <th>Database</th>\n      <th>Max Precision</th>\n      <th>Scale Range</th>\n      <th>Variable Scale</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Oracle NUMBER(p, s)</td>\n      <td>38</td>\n      <td>-84 to 127</td>\n      <td>No</td>\n    </tr>\n    <tr>\n      <td>Oracle NUMBER</td>\n      <td>40</td>\n      <td>Approximately -130 to 126</td>\n      <td>Yes</td>\n    </tr>\n    <tr>\n      <td>PostgreSQL NUMERIC(p, s)</td>\n      <td>38</td>\n      <td>-1000 to 1000</td>\n      <td>No</td>\n    </tr>\n    <tr>\n      <td>PostgreSQL NUMERIC</td>\n      <td>131,072</td>\n      <td>-1000 to 1000</td>\n      <td>Yes</td>\n    </tr>\n    <tr>\n      <td>MySQL/MariaDB/SingleStore DECIMAL</td>\n      <td>65</td>\n      <td>0 to 30</td>\n      <td>No</td>\n    </tr>\n    <tr>\n      <td>Trino DECIMAL</td>\n      <td>38</td>\n      <td>0 to 38</td>\n      <td>No</td>\n    </tr>\n    <tr>\n      <td><strong>Trino NUMBER</strong></td>\n      <td><strong>200</strong></td>\n      <td><strong>-16,384 to 16,383</strong></td>\n      <td><strong>Yes</strong></td>\n    </tr>\n  </tbody>\n</table>\n<h3 id=\"storage-and-representation\">\n    Storage and representation <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#storage-and-representation\">#</a>\n</h3>\n<p>NUMBER uses a variable-width binary format optimized for flexibility:</p>\n<ul>\n  <li>2-byte header encoding sign and scale</li>\n  <li>Variable-length magnitude in big-endian format</li>\n  <li>The binary format is considered unstable and may evolve in future releases to\nenable optimizations and performance improvements</li>\n</ul>\n<p>This flexibility allows Trino to improve NUMBER’s internal representation over\ntime without breaking connector compatibility.\nTrino SPI provides a stable API for connectors to read and write NUMBER values,\nabstracting away the internal format.</p>\n<h3 id=\"performance-considerations\">\n    Performance considerations <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#performance-considerations\">#</a>\n</h3>\n<p>NUMBER uses Java’s BigDecimal for arithmetic operations, which provides exact\nprecision at the cost of being slower than fixed-precision types like BIGINT,\nDOUBLE or DECIMAL. For this reason, NUMBER is designed for scenarios where\nprecision is more important than computational speed:</p>\n<ul>\n  <li><strong>Best for</strong>: reading and storing high-precision data from source systems,\ndata federation, reporting, data warehousing</li>\n  <li><strong>Not optimal for</strong>: computational heavy-lifting, complex mathematical\noperations, high-performance analytics on numeric columns</li>\n</ul>\n<p>If your workload involves extensive numeric computation, consider whether DECIMAL\n(for up to 38 digits), DOUBLE (for approximate arithmetic), or BIGINT (for\ninteger arithmetic) might be more appropriate.</p>\n<h3 id=\"function-support\">\n    Function support <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#function-support\">#</a>\n</h3>\n<p>NUMBER supports essential operations:</p>\n<ul>\n  <li>Arithmetic: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code></li>\n  <li>Aggregations: <code>sum()</code>, <code>avg()</code>, <code>min()</code>, <code>max()</code></li>\n  <li>Rounding functions: <code>abs()</code>, <code>sign()</code>, <code>ceiling()</code>, <code>floor()</code>, <code>truncate()</code>,\n<code>round()</code></li>\n  <li>Special value checks: <code>is_nan()</code>, <code>is_finite()</code>, <code>is_infinite()</code></li>\n</ul>\n<p>Many advanced mathematical functions (trigonometric, logarithmic, etc.)\ndo not work with NUMBER directly and require explicit type conversions to DOUBLE or DECIMAL.</p>\n<h2 id=\"whats-next\">\n    What’s next <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#whats-next\">#</a>\n</h2>\n<p>The NUMBER type support will continue to evolve. Additional connectors are\nplanned for future releases:</p>\n<ul>\n  <li><strong>ClickHouse</strong>: for Decimal256 type mapping</li>\n  <li><strong>Apache Ignite</strong>: for high-precision numeric support</li>\n</ul>\n<p>We’re also exploring performance optimizations and expanding function support\nbased on community feedback.</p>\n<h2 id=\"getting-started\">\n    Getting started <a target=\"_blank\" href=\"https://trino.io/blog/2026/03/25/number-data-type.html#getting-started\">#</a>\n</h2>\n<p>NUMBER support is available now in Trino 480. To start using it:</p>\n<ol>\n  <li><strong>Upgrade to Trino 480</strong> - NUMBER is available out of the box</li>\n  <li><strong>Remove deprecated configs</strong> - If you used <code>decimal-mapping</code> configurations,\nconsider removing them to enable automatic NUMBER mapping</li>\n  <li><strong>Query your data</strong> - High-precision columns are now accessible without\nconfiguration</li>\n</ol>\n<p>For detailed documentation, refer to:</p>\n<ul>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/language/types.html\">NUMBER type reference</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/oracle.html\">Oracle connector documentation</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/postgresql.html\">PostgreSQL connector documentation</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/mysql.html\">MySQL connector documentation</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/mariadb.html\">MariaDB connector documentation</a></li>\n  <li><a target=\"_blank\" href=\"https://trino.io/docs/current/connector/singlestore.html\">SingleStore connector documentation</a></li>\n</ul>\n<p>Have questions or feedback? Join the discussion on the <a target=\"_blank\" href=\"https://trino.io/slack\">Trino community\nSlack</a> in the <code>#dev</code> channel, or open an issue on\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/issues\">GitHub</a>.</p>\n<p>The NUMBER type represents a significant milestone in Trino’s evolution,\neliminating precision loss barriers and making high-precision numeric data from\ndiverse sources readily accessible for analytics and reporting. We’re excited to\nsee how the community uses this powerful new capability!</p>\n<p>□</p>\n  </div>\n</article>\n</div>"
---

One of Trino’s core strengths is breaking down data silos—enabling data
engineers to query diverse data sources through a single SQL interface. However,
when those sources use high-precision numeric types beyond Trino’s 38-digit
DECIMAL limit, that promise breaks down. Users faced an impossible choice: skip
the columns entirely and lose access to critical data, or accept lossy rounding
that compromises data integrity.
This challenge required a new approach: a dedicated data type for high-precision,
variable-scale decimals.
Adding a new built-in data type to Trino is exceptionally rare. The last time we
introduced a new type was the UUID type in May 2019—nearly seven years ago.
Types are fundamental building blocks that touch many parts of the system, from
the type registry, through coercion rules to connectors, functions, and the protocol.
They require careful design and long-term commitment.
With Trino 480, we’re excited to introduce the NUMBER type—a high-precision
decimal type that breaks down these data silos and enables seamless access to
numeric data across diverse database systems. This addition is particularly
powerful for data engineers working with Oracle, PostgreSQL, MySQL, MariaDB, and
SingleStore, which support numeric precision beyond the traditional 38-digit
DECIMAL limit.
Let’s explore why NUMBER matters, how it works, and how it will simplify your
data integration workflows.
The challenge: precision beyond 38 digits
Trino’s DECIMAL type has long supported exact numeric values with precision up
to 38 decimal digits, which covers the vast majority of use cases. However,
many database systems support higher precision:
Oracle NUMBER: when declared as NUMBER(p, s), precision must be in [1, 38] and
scale in [-84, 127]. When declared as NUMBER without precision/scale, each value
can have different scale, and actual precision can reach 40 decimal digits. Oracle can
store values from 10^-130 to (but not including) 10^126.
PostgreSQL NUMERIC: supports precision and scale in range from -1000 to 1000;
supports very high precision numbers with up to 131,072 digits before the decimal point.
When declared without precision/scale constraints, each value can have different scale.
MySQL, MariaDB, SingleStore DECIMAL: up to 65 digits of precision (scale 0-30)
Before Trino 480, accessing these high-precision numeric columns required
choosing between two unsatisfying options:
Skip the columns entirely and lose access to potentially critical data.
This was the default behavior.
Accept lossy conversions - Use decimal-mapping=ALLOW_OVERFLOW with
decimal-default-scale=S to force values into DECIMAL(38, S), losing precision
through rounding and failing for numbers greater than or equal to 10^(38-S).
For example, with scale 10, values ≥ 10^28 would fail.
Neither option is ideal for data federation and warehousing scenarios where
preserving data fidelity is essential.
Enter NUMBER: arbitrary-precision decimals in Trino
The NUMBER type solves this problem by supporting floating-point decimal numbers
of high precision and flexible scale. In practice, NUMBER supports values with
up to 200 digits of precision – far exceeding what most database workloads require.
Each value can have a different scale, allowing for values as small as 10^-16000
(or even smaller) and as large as 10^16000 (or even larger) within the same column.
Here’s what NUMBER looks like in action:

-- High-precision literal (50+ digits)
SELECT NUMBER '3.1415926535897932384626433832795028841971693993751';



 3.1415926535897932384626433832795028841971693993751



-- Scientific notation with extreme precision
SELECT NUMBER '12345678901234567890123456789012345678901234567890e30';



 1.234567890123456789012345678901234567890123456789E+79



-- Verify the type
SELECT typeof(NUMBER '123.456');



 number


Special values
NUMBER also supports special values similar to IEEE 754 floating-point types:

SELECT
  NUMBER 'Infinity' as positive_infinity,
  NUMBER '-Infinity' as negative_infinity,
  NUMBER 'NaN' as not_a_number;



 positive_infinity | negative_infinity | not_a_number
-------------------+-------------------+--------------
 +Infinity         | -Infinity         | NaN


These special values follow intuitive comparison and ordering semantics that
follow DOUBLE behavior. NaN compares as inequal to all values, including
itself. Any comparison with NaN returns false. When sorting, values are
ordered as follows: -Infinity, all finite values, +Infinity followed by NaN.
The special values are particularly useful for handling edge cases in source data.
In particular, PostgreSQL’s NUMERIC type can represent NaN and Infinity, and
these values are now seamlessly mapped to NUMBER when queried through the PostgreSQL
connector.
Seamless connector integration
The real power of NUMBER becomes apparent when querying external databases. Five
connectors now automatically map high-precision numeric types to NUMBER,
requiring no configuration changes:
Oracle connector
Oracle’s NUMBER type supports variable precision and scale. The Oracle connector
now maps:
NUMBER(p, s) where p > 38 → Trino NUMBER
NUMBER without precision/scale → Trino NUMBER
NUMBER with extreme scale values → Trino NUMBER

-- Query an Oracle table with high-precision columns
SELECT order_id, unit_price, extended_price
FROM oracle.sales.orders
WHERE extended_price > NUMBER '1000000000000000000000000';


PostgreSQL connector
PostgreSQL’s NUMERIC type supports very high precision and even “unconstrained”
precision. The connector automatically handles:
NUMERIC(p, s) where p > 38 → Trino NUMBER
NUMERIC without precision/scale → Trino NUMBER

-- Access PostgreSQL scientific data without precision loss
SELECT measurement_id, precise_value -- a NUMERIC column
FROM postgresql.lab.measurements


MySQL, MariaDB, and SingleStore connectors
These MySQL-compatible databases support DECIMAL precision up to 65 digits. The
connectors now map:
DECIMAL(p, s) where p > 38 → Trino NUMBER

-- Join across different databases with high precision
SELECT
  m.account_id,
  m.balance as mysql_balance,
  o.balance as oracle_balance
FROM mysql.banking.accounts m
JOIN oracle.banking.accounts o ON m.account_id = o.account_id
WHERE abs(m.balance - o.balance) > NUMBER '0.01';


Backwards compatibility and migration
The NUMBER type integration is designed to be seamless and backward compatible:
Automatic mapping
If you previously relied on the default behavior (no decimal-mapping
configuration), your queries now automatically use NUMBER for high-precision
columns. No configuration changes needed.
Legacy configurations still work
If you explicitly configured decimal-mapping=ALLOW_OVERFLOW or
decimal-mapping=STRICT, your existing configuration continues to work. The
NUMBER mapping is disabled when these options are set, ensuring no surprises.
However, the decimal-mapping configuration and related session properties
(decimal_mapping, decimal_default_scale, decimal_rounding_mode) are now
deprecated and will be removed in a future Trino release. We recommend
migrating to NUMBER-based workflows:
Before (with lossy conversion):

# catalog/postgresql.properties
connection-url=jdbc:postgresql://host:5432/database
connection-user=user
connection-password=password
decimal-mapping=ALLOW_OVERFLOW
decimal-default-scale=10
decimal-rounding-mode=HALF_UP


After (lossless with NUMBER):

# catalog/postgresql.properties
connection-url=jdbc:postgresql://host:5432/database
connection-user=user
connection-password=password
# No decimal-mapping needed - NUMBER is used automatically!


For Oracle, if you previously used oracle.number.rounding-mode to handle
high-precision NUMBER columns, you can now remove this configuration to enable
native NUMBER mapping.
Working with NUMBER
Type conversions
NUMBER integrates naturally with Trino’s type system:

-- Convert from other numeric types
SELECT
  CAST(DECIMAL '123.45' AS NUMBER) as from_decimal,
  CAST(12345 AS NUMBER) as from_integer,
  CAST(123.45e0 AS NUMBER) as from_double;



 from_decimal | from_integer | from_double
--------------+--------------+-------------
 123.45       | 12345        | 123.45



-- Convert NUMBER to other types
SELECT
  CAST(NUMBER '123.456' AS BIGINT) as to_bigint,
  CAST(NUMBER '123.456' AS DOUBLE) as to_double,
  CAST(NUMBER '123.456' AS DECIMAL(10,2)) as to_decimal;



 to_bigint | to_double | to_decimal
-----------+-----------+------------
 123       | 123.456   | 123.46


Aggregate functions
Common aggregate functions work naturally with NUMBER:

-- Aggregate high-precision values
SELECT
  department,
  sum(revenue) as total_revenue,
  avg(revenue) as average_revenue,
  min(revenue) as min_revenue,
  max(revenue) as max_revenue
FROM oracle.sales.transactions
GROUP BY department;


Creating tables with NUMBER columns
The Oracle and PostgreSQL connectors support creating tables with NUMBER columns:

-- Create a PostgreSQL table with NUMBER column
CREATE TABLE postgresql.schema.measurements (
  id BIGINT,
  precise_value NUMBER
);

-- Create an Oracle table with NUMBER column
CREATE TABLE oracle.schema.scientific_data (
  experiment_id VARCHAR(50),
  measurement NUMBER
);


Technical characteristics and limitations
While NUMBER provides high precision, it’s important to understand its
characteristics:
Precision and scale
Trino’s NUMBER type characteristics:
Supported precision: currently 200 decimal digits.
While we consider this an implementation detail that may change in future releases,
it is unlikely that maximum precision will be decreased.
Scale range: -16,384 to 16,383
Variable scale: each value can have a different scale, similar to
PostgreSQL NUMERIC and Oracle NUMBER
Special values: supports NaN, Infinity, and -Infinity
Comparison of decimal numeric types across database systems:
Database
      Max Precision
      Scale Range
      Variable Scale
    
Oracle NUMBER(p, s)
      38
      -84 to 127
      No
    
Oracle NUMBER
      40
      Approximately -130 to 126
      Yes
    
PostgreSQL NUMERIC(p, s)
      38
      -1000 to 1000
      No
    
PostgreSQL NUMERIC
      131,072
      -1000 to 1000
      Yes
    
MySQL/MariaDB/SingleStore DECIMAL
      65
      0 to 30
      No
    
Trino DECIMAL
      38
      0 to 38
      No
    
Trino NUMBER
      200
      -16,384 to 16,383
      Yes
    
Storage and representation
NUMBER uses a variable-width binary format optimized for flexibility:
2-byte header encoding sign and scale
Variable-length magnitude in big-endian format
The binary format is considered unstable and may evolve in future releases to
enable optimizations and performance improvements
This flexibility allows Trino to improve NUMBER’s internal representation over
time without breaking connector compatibility.
Trino SPI provides a stable API for connectors to read and write NUMBER values,
abstracting away the internal format.
Performance considerations
NUMBER uses Java’s BigDecimal for arithmetic operations, which provides exact
precision at the cost of being slower than fixed-precision types like BIGINT,
DOUBLE or DECIMAL. For this reason, NUMBER is designed for scenarios where
precision is more important than computational speed:
Best for: reading and storing high-precision data from source systems,
data federation, reporting, data warehousing
Not optimal for: computational heavy-lifting, complex mathematical
operations, high-performance analytics on numeric columns
If your workload involves extensive numeric computation, consider whether DECIMAL
(for up to 38 digits), DOUBLE (for approximate arithmetic), or BIGINT (for
integer arithmetic) might be more appropriate.
Function support
NUMBER supports essential operations:
Arithmetic: +, -, *, /
Aggregations: sum(), avg(), min(), max()
Rounding functions: abs(), sign(), ceiling(), floor(), truncate(),
round()
Special value checks: is_nan(), is_finite(), is_infinite()
Many advanced mathematical functions (trigonometric, logarithmic, etc.)
do not work with NUMBER directly and require explicit type conversions to DOUBLE or DECIMAL.
What’s next
The NUMBER type support will continue to evolve. Additional connectors are
planned for future releases:
ClickHouse: for Decimal256 type mapping
Apache Ignite: for high-precision numeric support
We’re also exploring performance optimizations and expanding function support
based on community feedback.
Getting started
NUMBER support is available now in Trino 480. To start using it:
Upgrade to Trino 480 - NUMBER is available out of the box
Remove deprecated configs - If you used decimal-mapping configurations,
consider removing them to enable automatic NUMBER mapping
Query your data - High-precision columns are now accessible without
configuration
For detailed documentation, refer to:
NUMBER type reference
Oracle connector documentation
PostgreSQL connector documentation
MySQL connector documentation
MariaDB connector documentation
SingleStore connector documentation
Have questions or feedback? Join the discussion on the Trino community
Slack in the #dev channel, or open an issue on
GitHub.
The NUMBER type represents a significant milestone in Trino’s evolution,
eliminating precision loss barriers and making high-precision numeric data from
diverse sources readily accessible for analytics and reporting. We’re excited to
see how the community uses this powerful new capability!
□
