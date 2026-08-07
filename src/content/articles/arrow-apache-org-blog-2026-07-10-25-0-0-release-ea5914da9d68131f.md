---
title: "Apache Arrow 25.0.0 Release"
link: "https://arrow.apache.org/blog/2026/07/10/25.0.0-release/"
guid: "https://arrow.apache.org/blog/2026/07/10/25.0.0-release/"
pubDate: "2026-07-10T04:00:00.000Z"
site_name: "Apache Arrow"
site_feed: "https://arrow.apache.org/feed.xml"
category: "Data"
summary: "The Apache Arrow team is pleased to announce the 25.0.0 release. This release\ncovers over 3 months of development work and includes 222 resolved\nissues on 268 distinct commits from 66 distinct\ncontributors. See the Install Page to\nlearn how to get the libraries for your platform.\nThe release notes below are not exhaustive and only expose selected highlights\nof the release. Many other bugfixes and improvements have been made: we refer\nyou to the complete changelog.\nFormat Notes\nWe clarified that variadic buffers exported over the C Data Interface could be\nnull (GH-50255). Consumers of the C Data Interface must be ready to handle them.\nArrow Flight RPC Notes\nThe Flight SQL protocol was amended to let servers explicitly inform clients whether a prepared statement contains a result set or not (GH-49497).\nProgress was made on the ODBC driver for Flight SQL, but we are not yet distributing packages for end users at this time.\nC++ Notes\nCSV\nA new option default_column_type disables type inference for all columns, including\nthose not listed in the column_types mapping (GH-47663).\nCompute\nA new hypot compute function calculates Euclidean norms without the avoidable\noverflow of a naive implementation\n(GH-50198).\nComparison functions have been upgraded to support StringView and BinaryView inputs\n(GH-49964).\nSort functions and their siblings (rank, select-k) now allow configuring per-key\nnull placement, so as to emulate SQL constructs such as\nORDER BY i NULLS FIRST, j NULLS LAST (GH-46926).\nRank functions now correctly distinguish NaNs from null values in floating-point\narrays (GH-45193).\nThe count function now accounts for logical nulls in run-end-encoded arrays (GH-49908).\nFile Systems\nThe FileSystemFactory interface, used for dynamically-initialized filesystem\nimplementations, now allows passing a set of key-value pairs in addition to a\nURI. This allows to pass sensitive initialization data, such as credentials,\nwithout leaking them in the URI (GH-50044).\nIPC\nWe made the IPC reader stricter in a number of places, which could reject\ninvalid IPC streams or files that would previously appear to read successfully\n(#49897, #50235).\nParquet\nWhen writing a Parquet file with bloom filters enabled, bloom filters are\nautomatically \"folded\" so as to match the configured fpp (the max false positive\nrate) according to the actual cardinality of the data used for the filter.\nThis can provide size savings, especially with the conservative default\ncardinality estimate (GH-50008).\nBloom filters can be faster on some platforms thanks to vectorization (GH-50030).\nIt is now possible to read and write ListView data from/to Parquet (GH-50160).\nMiscellaneous C++ changes\nOn ARM64 platforms, Arrow C++ now supports dynamically dispatching to SVE-optimized\nroutines on compatible CPUs (GH-49756). Previously, dynamic dispatch was only supported\non x86 platforms.\nRuntime CPU detection now uses xsimd instead of home-grown detection functions\n(GH-49940).\nThe ChunkedArray class has a new method ComputeLogicalNullCount, mirroring\nthe existing methods of the same name on Array and ArrayData classes (GH-50261).\nThe Table class has a new method ToTensor complementing the existing method\nof the same on the RecordBatch class (GH-41870). Both methods convert from the\ncolumnar format to a contiguous two-dimensional array.\nLinux Packaging Notes\nThe release dropped support for Debian bookworm GH-50200 due to\nthe distribution reaching End Of Life.\nWe added Reproducible Builds support for the Debian Linux Packages GH-49988.\nPython Notes\nCompatibility notes\nFeather reader and writer is deprecated in favour of the Arrow IPC API\nGH-49232.\nNew features\nhypot compute kernel is added to Arrow compute module and accessible\nin PyArrow GH-50197.\npa.OSFile now accepts open file descriptor (int parameter) besides\nthe str path GH-49751.\nConversion from a list of individual numpy.ndarrays to a FixedShapeTensor\nis added GH-49644.\ncreate_encryption_properties and create_decryption_properties methods\nare added to the parquet API using Arrow C++ FileEncryptionPropertiesBuilder\nand FileDecryptionPropertiesBuilder GH-47435.\nConversion of Table to Tensor has been implemented in Arrow C++ and can also\nbe used in Python bindings GH-40062.\ndefault_column_type option is added to csv.ConvertOptions which sets a\ndefault column type for all columns and can be combined with column_types\nGH-22232.\nOther improvements\nExtension types are supported in pyarrow.parquet.read_schema\nGH-48254\nDefault values for Parquet pre_buffer are made consistent\nGH-49923.\nRelevant bug fixes\ncount compute kernel bug for sliced union arrays is fixed\nGH-50113.\nhash_any/hash_all compute kernel bug is fixed for sliced\nboolean arrays GH-50043.\nTable.from_pylist on ExtensionType column with list_ storage\ncrash when values exceed int32 offsets is fixed GH-50012.\nBug causing Use-After-Free on PyList_SetItem in SparseCSFTensorToNdarray\nis fixed GH-49917.\nTimezone drop when converting tz-aware pandas Categorical is fixed\nGH-49875.\n_export_to_c segmentation fault for binary_view array is fixed by\nfixing cast kernels so all-inline view arrays do not keep a null variadic\nbuffer slot GH-49740.\nreplace_with_mask crash when null type inputs are used is\nfixed GH-47447.\nSegmentation fault when using sort_indices for temporal types\nis fixed GH-47252\nIndex level is bumped if pandas dataframe already contains __index_level_i__\ncolumn GH-46179.\nSpecial handling for single-file paths passed to ParquetDataset\nconstructor is restored, fixing merge error in pyarrow.parquet.read_table\nGH-43574.\nOther\nAnnotations are withhold from Python wheels until they are complete\nGH-49831.\nPyBuffer and NumPyBuffer destructors are protected against interpreter\nfinalization GH-49942.\nDocumentation updates in GH-50227\nand GH-20403.\nTests for regular replace_with_mask kernel usage are added\nGH-50072.\nHypothesis timezones test strategy now includes fixed offsets GH-31318.\nR Notes\nBreaking changes\nArrow uint64 types are now always converted to R double (numeric) vectors, regardless of the values. Previously, small uint64 values were converted to R integer, which could cause inconsistent types within list columns when different list elements had different value ranges (#50339).\nNew features\nField objects now support field-level metadata via $metadata and $with_metadata() (@max-romagnoli, #33390).\nParquet files now support list-columns of ordered factors (ordered dictionaries) (#49689).\nMinor improvements and fixes\nArray$create() now gives a clearer error message when given a POSIXct object with an invalid timezone (#40886).\nDictionary arrays with large_string value types now convert correctly to R factors (#39603).\nopen_dataset() now gives a clearer error message when providing a mix of readr and Arrow options (@Rich-T-kid, #33420).\nread_parquet() no longer triggers a C++ alignment warning from the Acero source node (#46178).\nSchema metadata partial matching on $metadata$r no longer errors when other metadata keys start with “r” (#50163).\nto_arrow() now preserves group_by() when converting from a dbplyr lazy table (#40640).\nwrite_parquet() now correctly validates that max_rows_per_group is a positive number (#40742).\nStale S3 connections no longer cause a segfault during garbage collection (#50009).\nSpurious “Invalid metadata$r” warnings are no longer emitted when reading files with custom schema metadata (#48712).\nInstallation\nThe R package now builds under r-universe/r-wasm (#49981).\nRuby and C GLib Notes\nAdded fallback data type for unknown extension type: GH-49969\nRuby\nAdded RecordBatch#merge: GH-50175\nEnsuring zero-initializing all rb_memory_view_t members for rb_memory_view_get(): GH-50234\nC GLib\nNo C GLib only notes.\nJava, JavaScript, Go, .NET, Swift and Rust Notes\nThe Java, JavaScript, Go, .NET, Swift and Rust projects have moved to separate\nrepositories outside the main Arrow monorepo.\nFor notes on the latest release of the Java\nimplementation, see the latest Arrow\nJava changelog.\nFor notes on the latest release of the JavaScript\nimplementation, see the latest Arrow\nJavaScript changelog.\nFor notes on the latest release of the Rust\nimplementation see the latest Arrow Rust\nchangelog.\nFor notes on the latest release of the Go\nimplementation, see the latest Arrow Go\nchangelog.\nFor notes on the latest release of the .NET\nimplementation, see the latest Arrow  .NET changelog.\nFor notes on the latest release of the Swift implementation, see the latest Arrow Swift changelog."
author: "pmc"
contentHtml: "<!--\n\n-->\n<p>The Apache Arrow team is pleased to announce the 25.0.0 release. This release\ncovers over 3 months of development work and includes <a href=\"https://github.com/apache/arrow/milestone/74?closed=1\"><strong>222 resolved\nissues</strong></a> on <a href=\"/release/25.0.0.html#contributors\"><strong>268 distinct commits</strong></a> from <a href=\"/release/25.0.0.html#contributors\"><strong>66 distinct\ncontributors</strong></a>. See the <a href=\"https://arrow.apache.org/install/\">Install Page</a> to\nlearn how to get the libraries for your platform.</p>\n<p>The release notes below are not exhaustive and only expose selected highlights\nof the release. Many other bugfixes and improvements have been made: we refer\nyou to the <a href=\"/release/25.0.0.html#changelog\">complete changelog</a>.</p>\n<h2>Format Notes</h2>\n<p>We clarified that variadic buffers exported over the C Data Interface could be\nnull (<a href=\"https://github.com/apache/arrow/pull/50255\">GH-50255</a>). Consumers of the C Data Interface must be ready to handle them.</p>\n<h2>Arrow Flight RPC Notes</h2>\n<p>The Flight SQL protocol was amended to let servers explicitly inform clients whether a prepared statement contains a result set or not (<a href=\"https://github.com/apache/arrow/issues/49497\">GH-49497</a>).</p>\n<p>Progress was made on the ODBC driver for Flight SQL, but we are not yet distributing packages for end users at this time.</p>\n<h2>C++ Notes</h2>\n<h3>CSV</h3>\n<p>A new option <code>default_column_type</code> disables type inference for all columns, including\nthose not listed in the <code>column_types</code> mapping (<a href=\"https://github.com/apache/arrow/pull/47663\">GH-47663</a>).</p>\n<h3>Compute</h3>\n<p>A new <code>hypot</code> compute function calculates Euclidean norms without the avoidable\noverflow of a naive implementation\n(<a href=\"https://github.com/apache/arrow/pull/50198\">GH-50198</a>).</p>\n<p>Comparison functions have been upgraded to support StringView and BinaryView inputs\n(<a href=\"https://github.com/apache/arrow/pull/49964\">GH-49964</a>).</p>\n<p>Sort functions and their siblings (rank, select-k) now allow configuring per-key\nnull placement, so as to emulate SQL constructs such as\n<code>ORDER BY i NULLS FIRST, j NULLS LAST</code> (<a href=\"https://github.com/apache/arrow/pull/46926\">GH-46926</a>).</p>\n<p>Rank functions now correctly distinguish NaNs from null values in floating-point\narrays (<a href=\"https://github.com/apache/arrow/pull/45193\">GH-45193</a>).</p>\n<p>The <code>count</code> function now accounts for logical nulls in run-end-encoded arrays (<a href=\"https://github.com/apache/arrow/pull/49908\">GH-49908</a>).</p>\n<h3>File Systems</h3>\n<p>The <code>FileSystemFactory</code> interface, used for dynamically-initialized filesystem\nimplementations, now allows passing a set of key-value pairs in addition to a\nURI. This allows to pass sensitive initialization data, such as credentials,\nwithout leaking them in the URI (<a href=\"https://github.com/apache/arrow/pull/50044\">GH-50044</a>).</p>\n<h3>IPC</h3>\n<p>We made the IPC reader stricter in a number of places, which could reject\ninvalid IPC streams or files that would previously appear to read successfully\n(#49897, #50235).</p>\n<h3>Parquet</h3>\n<p>When writing a Parquet file with bloom filters enabled, bloom filters are\nautomatically &quot;folded&quot; so as to match the configured fpp (the max false positive\nrate) according to the actual cardinality of the data used for the filter.\nThis can provide size savings, especially with the conservative default\ncardinality estimate (<a href=\"https://github.com/apache/arrow/pull/50008\">GH-50008</a>).</p>\n<p>Bloom filters can be faster on some platforms thanks to vectorization (<a href=\"https://github.com/apache/arrow/pull/50030\">GH-50030</a>).</p>\n<p>It is now possible to read and write ListView data from/to Parquet (<a href=\"https://github.com/apache/arrow/pull/50160\">GH-50160</a>).</p>\n<h3>Miscellaneous C++ changes</h3>\n<p>On ARM64 platforms, Arrow C++ now supports dynamically dispatching to SVE-optimized\nroutines on compatible CPUs (<a href=\"https://github.com/apache/arrow/pull/49756\">GH-49756</a>). Previously, dynamic dispatch was only supported\non x86 platforms.</p>\n<p>Runtime CPU detection now uses xsimd instead of home-grown detection functions\n(<a href=\"https://github.com/apache/arrow/pull/49940\">GH-49940</a>).</p>\n<p>The <code>ChunkedArray</code> class has a new method <code>ComputeLogicalNullCount</code>, mirroring\nthe existing methods of the same name on <code>Array</code> and <code>ArrayData</code> classes (<a href=\"https://github.com/apache/arrow/pull/50261\">GH-50261</a>).</p>\n<p>The <code>Table</code> class has a new method <code>ToTensor</code> complementing the existing method\nof the same on the <code>RecordBatch</code> class (<a href=\"https://github.com/apache/arrow/pull/41870\">GH-41870</a>). Both methods convert from the\ncolumnar format to a contiguous two-dimensional array.</p>\n<h2>Linux Packaging Notes</h2>\n<p>The release dropped support for Debian bookworm <a href=\"https://github.com/apache/arrow/issues/50200\">GH-50200</a> due to\nthe distribution reaching End Of Life.</p>\n<p>We added Reproducible Builds support for the Debian Linux Packages <a href=\"https://github.com/apache/arrow/issues/49988\">GH-49988</a>.</p>\n<h2>Python Notes</h2>\n<h3>Compatibility notes</h3>\n<ul>\n<li>Feather reader and writer is deprecated in favour of the Arrow IPC API\n<a href=\"https://github.com/apache/arrow/issues/49232\">GH-49232</a>.</li>\n</ul>\n<h3>New features</h3>\n<ul>\n<li><code>hypot</code> compute kernel is added to Arrow compute module and accessible\nin PyArrow <a href=\"https://github.com/apache/arrow/issues/50197\">GH-50197</a>.</li>\n<li><code>pa.OSFile</code> now accepts open file descriptor (<code>int</code> parameter) besides\nthe <code>str</code> path <a href=\"https://github.com/apache/arrow/issues/49751\">GH-49751</a>.</li>\n<li>Conversion from a list of individual <code>numpy.ndarrays</code> to a <code>FixedShapeTensor</code>\nis added <a href=\"https://github.com/apache/arrow/issues/49644\">GH-49644</a>.</li>\n<li><code>create_encryption_properties</code> and <code>create_decryption_properties</code> methods\nare added to the parquet API using Arrow C++ <code>FileEncryptionPropertiesBuilder</code>\nand <code>FileDecryptionPropertiesBuilder</code> <a href=\"https://github.com/apache/arrow/issues/47435\">GH-47435</a>.</li>\n<li>Conversion of Table to Tensor has been implemented in Arrow C++ and can also\nbe used in Python bindings <a href=\"https://github.com/apache/arrow/issues/40062\">GH-40062</a>.</li>\n<li><code>default_column_type</code> option is added to <code>csv.ConvertOptions</code> which sets a\ndefault column type for all columns and can be combined with <code>column_types</code>\n<a href=\"https://github.com/apache/arrow/issues/22232\">GH-22232</a>.</li>\n</ul>\n<h3>Other improvements</h3>\n<ul>\n<li>Extension types are supported in <code>pyarrow.parquet.read_schema</code>\n<a href=\"https://github.com/apache/arrow/issues/48254\">GH-48254</a></li>\n<li>Default values for Parquet <code>pre_buffer</code> are made consistent\n<a href=\"https://github.com/apache/arrow/issues/49923\">GH-49923</a>.</li>\n</ul>\n<h3>Relevant bug fixes</h3>\n<ul>\n<li><code>count</code> compute kernel bug for sliced union arrays is fixed\n<a href=\"https://github.com/apache/arrow/issues/50113\">GH-50113</a>.</li>\n<li><code>hash_any/hash_all</code> compute kernel bug is fixed for sliced\nboolean arrays <a href=\"https://github.com/apache/arrow/issues/50043\">GH-50043</a>.</li>\n<li><code>Table.from_pylist</code> on <code>ExtensionType</code> column with <code>list_</code> storage\ncrash when values exceed int32 offsets is fixed <a href=\"https://github.com/apache/arrow/issues/50012\">GH-50012</a>.</li>\n<li>Bug causing Use-After-Free on <code>PyList_SetItem</code> in <code>SparseCSFTensorToNdarray</code>\nis fixed <a href=\"https://github.com/apache/arrow/issues/49917\">GH-49917</a>.</li>\n<li>Timezone drop when converting tz-aware pandas Categorical is fixed\n<a href=\"https://github.com/apache/arrow/issues/49875\">GH-49875</a>.</li>\n<li><code>_export_to_c</code> segmentation fault for <code>binary_view</code> array is fixed by\nfixing cast kernels so all-inline view arrays do not keep a null variadic\nbuffer slot <a href=\"https://github.com/apache/arrow/issues/49740\">GH-49740</a>.</li>\n<li><code>replace_with_mask</code> crash when null type inputs are used is\nfixed <a href=\"https://github.com/apache/arrow/issues/47447\">GH-47447</a>.</li>\n<li>Segmentation fault when using <code>sort_indices</code> for temporal types\nis fixed <a href=\"https://github.com/apache/arrow/issues/47252\">GH-47252</a></li>\n<li>Index level is bumped if pandas dataframe already contains <code>__index_level_i__</code>\ncolumn <a href=\"https://github.com/apache/arrow/issues/46179\">GH-46179</a>.</li>\n<li>Special handling for single-file paths passed to <code>ParquetDataset</code>\nconstructor is restored, fixing merge error in <code>pyarrow.parquet.read_table</code>\n<a href=\"https://github.com/apache/arrow/issues/43574\">GH-43574</a>.</li>\n</ul>\n<h3>Other</h3>\n<ul>\n<li>Annotations are withhold from Python wheels until they are complete\n<a href=\"https://github.com/apache/arrow/issues/49831\">GH-49831</a>.</li>\n<li>PyBuffer and NumPyBuffer destructors are protected against interpreter\nfinalization <a href=\"https://github.com/apache/arrow/issues/49942\">GH-49942</a>.</li>\n<li>Documentation updates in <a href=\"https://github.com/apache/arrow/issues/50227\">GH-50227</a>\nand <a href=\"https://github.com/apache/arrow/issues/20403\">GH-20403</a>.</li>\n<li>Tests for regular <code>replace_with_mask</code> kernel usage are added\n<a href=\"https://github.com/apache/arrow/issues/50072\">GH-50072</a>.</li>\n<li>Hypothesis timezones test strategy now includes fixed offsets <a href=\"https://github.com/apache/arrow/issues/31318\">GH-31318</a>.</li>\n</ul>\n<h2>R Notes</h2>\n<h3>Breaking changes</h3>\n<ul>\n<li>Arrow uint64 types are now always converted to R double (numeric) vectors, regardless of the values. Previously, small uint64 values were converted to R integer, which could cause inconsistent types within list columns when different list elements had different value ranges (#50339).</li>\n</ul>\n<h3>New features</h3>\n<ul>\n<li>Field objects now support field-level metadata via $metadata and $with_metadata() (@max-romagnoli, #33390).</li>\n<li>Parquet files now support list-columns of ordered factors (ordered dictionaries) (#49689).</li>\n</ul>\n<h3>Minor improvements and fixes</h3>\n<ul>\n<li>Array$create() now gives a clearer error message when given a POSIXct object with an invalid timezone (#40886).</li>\n<li>Dictionary arrays with large_string value types now convert correctly to R factors (#39603).</li>\n<li>open_dataset() now gives a clearer error message when providing a mix of readr and Arrow options (@Rich-T-kid, #33420).</li>\n<li>read_parquet() no longer triggers a C++ alignment warning from the Acero source node (#46178).</li>\n<li>Schema metadata partial matching on $metadata$r no longer errors when other metadata keys start with “r” (#50163).</li>\n<li>to_arrow() now preserves group_by() when converting from a dbplyr lazy table (#40640).</li>\n<li>write_parquet() now correctly validates that max_rows_per_group is a positive number (#40742).</li>\n<li>Stale S3 connections no longer cause a segfault during garbage collection (#50009).</li>\n<li>Spurious “Invalid metadata$r” warnings are no longer emitted when reading files with custom schema metadata (#48712).</li>\n</ul>\n<h3>Installation</h3>\n<ul>\n<li>The R package now builds under r-universe/r-wasm (#49981).</li>\n</ul>\n<h2>Ruby and C GLib Notes</h2>\n<ul>\n<li>Added fallback data type for unknown extension type: <a href=\"https://github.com/apache/arrow/pull/49969\">GH-49969</a></li>\n</ul>\n<h3>Ruby</h3>\n<ul>\n<li>Added <code>RecordBatch#merge</code>: <a href=\"https://github.com/apache/arrow/pull/50175\">GH-50175</a></li>\n<li>Ensuring zero-initializing all <code>rb_memory_view_t</code> members for <code>rb_memory_view_get()</code>: <a href=\"https://github.com/apache/arrow/pull/50234\">GH-50234</a></li>\n</ul>\n<h3>C GLib</h3>\n<p>No C GLib only notes.</p>\n<h2>Java, JavaScript, Go, .NET, Swift and Rust Notes</h2>\n<p>The Java, JavaScript, Go, .NET, Swift and Rust projects have moved to separate\nrepositories outside the main Arrow <a href=\"https://github.com/apache/arrow\">monorepo</a>.</p>\n<ul>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-java\">Java\nimplementation</a>, see the latest <a href=\"https://github.com/apache/arrow-java/releases\">Arrow\nJava changelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-js\">JavaScript\nimplementation</a>, see the latest <a href=\"https://github.com/apache/arrow-js/releases\">Arrow\nJavaScript changelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-rs\">Rust\nimplementation</a> see the latest <a href=\"https://github.com/apache/arrow-rs/blob/main/CHANGELOG.md\">Arrow Rust\nchangelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-go\">Go\nimplementation</a>, see the latest <a href=\"https://github.com/apache/arrow-go/releases\">Arrow Go\nchangelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-dotnet\">.NET\nimplementation</a>, see the latest <a href=\"https://github.com/apache/arrow-dotnet/releases\">Arrow  .NET changelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-swift\">Swift implementation</a>, see the latest <a href=\"https://github.com/apache/arrow-swift/releases\">Arrow Swift changelog</a>.</li>\n</ul>"
---

The Apache Arrow team is pleased to announce the 25.0.0 release. This release
covers over 3 months of development work and includes 222 resolved
issues on 268 distinct commits from 66 distinct
contributors. See the Install Page to
learn how to get the libraries for your platform.
The release notes below are not exhaustive and only expose selected highlights
of the release. Many other bugfixes and improvements have been made: we refer
you to the complete changelog.
Format Notes
We clarified that variadic buffers exported over the C Data Interface could be
null (GH-50255). Consumers of the C Data Interface must be ready to handle them.
Arrow Flight RPC Notes
The Flight SQL protocol was amended to let servers explicitly inform clients whether a prepared statement contains a result set or not (GH-49497).
Progress was made on the ODBC driver for Flight SQL, but we are not yet distributing packages for end users at this time.
C++ Notes
CSV
A new option default_column_type disables type inference for all columns, including
those not listed in the column_types mapping (GH-47663).
Compute
A new hypot compute function calculates Euclidean norms without the avoidable
overflow of a naive implementation
(GH-50198).
Comparison functions have been upgraded to support StringView and BinaryView inputs
(GH-49964).
Sort functions and their siblings (rank, select-k) now allow configuring per-key
null placement, so as to emulate SQL constructs such as
ORDER BY i NULLS FIRST, j NULLS LAST (GH-46926).
Rank functions now correctly distinguish NaNs from null values in floating-point
arrays (GH-45193).
The count function now accounts for logical nulls in run-end-encoded arrays (GH-49908).
File Systems
The FileSystemFactory interface, used for dynamically-initialized filesystem
implementations, now allows passing a set of key-value pairs in addition to a
URI. This allows to pass sensitive initialization data, such as credentials,
without leaking them in the URI (GH-50044).
IPC
We made the IPC reader stricter in a number of places, which could reject
invalid IPC streams or files that would previously appear to read successfully
(#49897, #50235).
Parquet
When writing a Parquet file with bloom filters enabled, bloom filters are
automatically "folded" so as to match the configured fpp (the max false positive
rate) according to the actual cardinality of the data used for the filter.
This can provide size savings, especially with the conservative default
cardinality estimate (GH-50008).
Bloom filters can be faster on some platforms thanks to vectorization (GH-50030).
It is now possible to read and write ListView data from/to Parquet (GH-50160).
Miscellaneous C++ changes
On ARM64 platforms, Arrow C++ now supports dynamically dispatching to SVE-optimized
routines on compatible CPUs (GH-49756). Previously, dynamic dispatch was only supported
on x86 platforms.
Runtime CPU detection now uses xsimd instead of home-grown detection functions
(GH-49940).
The ChunkedArray class has a new method ComputeLogicalNullCount, mirroring
the existing methods of the same name on Array and ArrayData classes (GH-50261).
The Table class has a new method ToTensor complementing the existing method
of the same on the RecordBatch class (GH-41870). Both methods convert from the
columnar format to a contiguous two-dimensional array.
Linux Packaging Notes
The release dropped support for Debian bookworm GH-50200 due to
the distribution reaching End Of Life.
We added Reproducible Builds support for the Debian Linux Packages GH-49988.
Python Notes
Compatibility notes
Feather reader and writer is deprecated in favour of the Arrow IPC API
GH-49232.
New features
hypot compute kernel is added to Arrow compute module and accessible
in PyArrow GH-50197.
pa.OSFile now accepts open file descriptor (int parameter) besides
the str path GH-49751.
Conversion from a list of individual numpy.ndarrays to a FixedShapeTensor
is added GH-49644.
create_encryption_properties and create_decryption_properties methods
are added to the parquet API using Arrow C++ FileEncryptionPropertiesBuilder
and FileDecryptionPropertiesBuilder GH-47435.
Conversion of Table to Tensor has been implemented in Arrow C++ and can also
be used in Python bindings GH-40062.
default_column_type option is added to csv.ConvertOptions which sets a
default column type for all columns and can be combined with column_types
GH-22232.
Other improvements
Extension types are supported in pyarrow.parquet.read_schema
GH-48254
Default values for Parquet pre_buffer are made consistent
GH-49923.
Relevant bug fixes
count compute kernel bug for sliced union arrays is fixed
GH-50113.
hash_any/hash_all compute kernel bug is fixed for sliced
boolean arrays GH-50043.
Table.from_pylist on ExtensionType column with list_ storage
crash when values exceed int32 offsets is fixed GH-50012.
Bug causing Use-After-Free on PyList_SetItem in SparseCSFTensorToNdarray
is fixed GH-49917.
Timezone drop when converting tz-aware pandas Categorical is fixed
GH-49875.
_export_to_c segmentation fault for binary_view array is fixed by
fixing cast kernels so all-inline view arrays do not keep a null variadic
buffer slot GH-49740.
replace_with_mask crash when null type inputs are used is
fixed GH-47447.
Segmentation fault when using sort_indices for temporal types
is fixed GH-47252
Index level is bumped if pandas dataframe already contains __index_level_i__
column GH-46179.
Special handling for single-file paths passed to ParquetDataset
constructor is restored, fixing merge error in pyarrow.parquet.read_table
GH-43574.
Other
Annotations are withhold from Python wheels until they are complete
GH-49831.
PyBuffer and NumPyBuffer destructors are protected against interpreter
finalization GH-49942.
Documentation updates in GH-50227
and GH-20403.
Tests for regular replace_with_mask kernel usage are added
GH-50072.
Hypothesis timezones test strategy now includes fixed offsets GH-31318.
R Notes
Breaking changes
Arrow uint64 types are now always converted to R double (numeric) vectors, regardless of the values. Previously, small uint64 values were converted to R integer, which could cause inconsistent types within list columns when different list elements had different value ranges (#50339).
New features
Field objects now support field-level metadata via $metadata and $with_metadata() (@max-romagnoli, #33390).
Parquet files now support list-columns of ordered factors (ordered dictionaries) (#49689).
Minor improvements and fixes
Array$create() now gives a clearer error message when given a POSIXct object with an invalid timezone (#40886).
Dictionary arrays with large_string value types now convert correctly to R factors (#39603).
open_dataset() now gives a clearer error message when providing a mix of readr and Arrow options (@Rich-T-kid, #33420).
read_parquet() no longer triggers a C++ alignment warning from the Acero source node (#46178).
Schema metadata partial matching on $metadata$r no longer errors when other metadata keys start with “r” (#50163).
to_arrow() now preserves group_by() when converting from a dbplyr lazy table (#40640).
write_parquet() now correctly validates that max_rows_per_group is a positive number (#40742).
Stale S3 connections no longer cause a segfault during garbage collection (#50009).
Spurious “Invalid metadata$r” warnings are no longer emitted when reading files with custom schema metadata (#48712).
Installation
The R package now builds under r-universe/r-wasm (#49981).
Ruby and C GLib Notes
Added fallback data type for unknown extension type: GH-49969
Ruby
Added RecordBatch#merge: GH-50175
Ensuring zero-initializing all rb_memory_view_t members for rb_memory_view_get(): GH-50234
C GLib
No C GLib only notes.
Java, JavaScript, Go, .NET, Swift and Rust Notes
The Java, JavaScript, Go, .NET, Swift and Rust projects have moved to separate
repositories outside the main Arrow monorepo.
For notes on the latest release of the Java
implementation, see the latest Arrow
Java changelog.
For notes on the latest release of the JavaScript
implementation, see the latest Arrow
JavaScript changelog.
For notes on the latest release of the Rust
implementation see the latest Arrow Rust
changelog.
For notes on the latest release of the Go
implementation, see the latest Arrow Go
changelog.
For notes on the latest release of the .NET
implementation, see the latest Arrow  .NET changelog.
For notes on the latest release of the Swift implementation, see the latest Arrow Swift changelog.
