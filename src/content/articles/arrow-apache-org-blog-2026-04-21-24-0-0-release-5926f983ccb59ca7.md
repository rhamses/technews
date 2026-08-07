---
title: "Apache Arrow 24.0.0 Release"
link: "https://arrow.apache.org/blog/2026/04/21/24.0.0-release/"
guid: "https://arrow.apache.org/blog/2026/04/21/24.0.0-release/"
pubDate: "2026-04-21T04:00:00.000Z"
site_name: "Apache Arrow"
site_feed: "https://arrow.apache.org/feed.xml"
category: "Data"
summary: "The Apache Arrow team is pleased to announce the 24.0.0 release. This release\ncovers over 3 months of development work and includes 259 resolved\nissues on 325 distinct commits from 57 distinct\ncontributors. See the Install Page to\nlearn how to get the libraries for your platform.\nThe release notes below are not exhaustive and only expose selected highlights\nof the release. Many other bugfixes and improvements have been made: we refer\nyou to the complete changelog.\nCommunity\nWe recently published our Community Highlights for 2025, check those out.\nThanks everyone for your contributions and participation in the project!\nFormat Notes\nWe have written a project-wide Security Model\noutlining what users should expect when dealing with Arrow data, especially coming\nfrom untrusted sources GH-48868.\nArrow Flight RPC Notes\nThe ODBC driver is still a work-in-progress. The driver now builds on Linux, but currently no builds are distributed (for any platform) (GH-49463).\nIn C++, we have refactored serialization/deserialization to make low-level functionality accessible for advanced usage (GH-49548).\nC++ Notes\nIn addition to the aforementioned project-wide Security Model, we have written\na specific Security Model for Arrow C++\ncovering more concrete topics such as API usage and parameter validity GH-49274.\nCompute\nExtension Types\nThe canonical type VariableShapeTensor\nwas finally implemented GH-38007.\nParquet\nBreaking change: The Arrow extension type name for Parquet Variant columns\nused to be parquet.variant but has been changed to arrow.parquet.variant GH-49081.\nWhile Parquet C++ could only read unencrypted bloom filters, it now supports\nreading encrypted bloom filters as well GH-48334. In addition, it can also\nwrite bloom filters, though only unencrypted GH-34785.\nAn ambitious rewrite of the bit-unpacking utilities and optimizations has led to\nsignificant performance improvements on reading some Parquet columns, up to 50%\nfaster in some cases GH-48277. This rewrite is described in more detail\nin an accompanying blog post.\nThe performance of reading DELTA_BINARY_PACKED-encoded integers has been improved\nin some favorable cases GH-49266.\nMiscellaneous C++ changes\nWe have migrated to C++20 std::span, removing our home-grown implementation\nin arrow::util::span GH-48588.\nA bunch of previously deprecated APIs have been removed GH-49356.\nLinux Packaging Notes\nAdded support for Ubuntu 26.04, the next LTS GH-49341\nMATLAB Notes\nNo major notes for this release on MATLAB.\nPython Notes\nCompatibility notes\npyarrow.gandiva is deprecated and will be removed in a future version GH-49227\nNew features\nType annotations work is starting to be included (GH-49102 and\nGH-49452)\nBasic arithmetic on arrays and scalars is now supported GH-32007\nOptions to control writing of Parquet Bloom filters are added to parquet.write_table GH-49376\nOpenTelemetry is enabled in PyArrow wheels GH-49382\nAzureFileSystem is now included in the Windows wheels GH-44655\nOther improvements\nScikit-build-core is now used as the PyArrow build system GH-36411\nUUID objects are now inferred automatically in pa.scalar() and pa.array() without the need to\nspecify the type explicitly GH-48241\nConstructing an extension array via pa.array() from a list of extension-type scalars is now supported\nGH-48470\nThere have been some improvements in the documentation (GH-49278,\nGH-49269 and GH-28859)\nCSV and JSON options have improved repr/str methods GH-47389\nRelevant bug fixes\nSparseCOOTensor.__repr__ missing f-string prefix is now fixed GH-49108\nPickling SubTreeFileSystem(base_path, AzureFileSystem(...)) is fixed GH-49078\nCasting from StringArray to pandas 3.* when element is None is fixed GH-49002\nDictionary key order is now preserved when inferring struct type GH-40053\nDuplicate csv header when table batches start with empty is now fixed GH-36889\nR Notes\nNew Features\nA number of new dplyr bindings GH-49533, GH-49256, GH-49535 and GH-49534\nCompatibility notes\nArrow no longer builds with GCS enabled on CRAN to avoid failures in their build systems. If you would like a full-featured build of Arrow, we recommend installing from R-universe; see the Using cloud storage article in the docs for more information. GH-49067\nRelevant bug fixes\nto_arrow() now retains grouping GH-40640\nRuby and C GLib Notes\nFixed GC related problems.\nGArrowListArray: Added support for returning offset buffer.\nGArrowLargeListArray: Added support for returning offset buffer.\nGArrowUnionArray: Added support for returning fields.\nDeprecated Feather features.\nRuby\nWe've added pure Ruby Apache Arrow writer implementation to the\nred-arrow-format gem.\nWe've marked pure Ruby Apache Arrow reader implementation in the\nred-arrow-formatgem as stable because it passes integration tests\nwith other implementations. But it still has some missing features.\nThe red-arrow gem:\nAdd support for converting to raw Ruby objects of the following arrays:\n\nArrow::LargeBinaryArray\nArrow::LargeUTF8Array\nArrow::LargeListArray\nArrow::FixedSizeListArray\nArrow::DurationArray\nArrow::DictionaryArray with Arrow::LargeBinaryArray or\nArrow::LargeUTF8Array\nC GLib\nNo C GLib only notes.\nJava, JavaScript, Go, .NET, Swift and Rust Notes\nThe Java, JavaScript, Go, .NET, Swift and Rust projects have moved to separate\nrepositories outside the main Arrow monorepo.\nFor notes on the latest release of the Java\nimplementation, see the latest Arrow\nJava changelog.\nFor notes on the latest release of the JavaScript\nimplementation, see the latest Arrow\nJavaScript changelog.\nFor notes on the latest release of the Rust\nimplementation see the latest Arrow Rust\nchangelog.\nFor notes on the latest release of the Go\nimplementation, see the latest Arrow Go\nchangelog.\nFor notes on the latest release of the .NET\nimplementation, see the latest Arrow  .NET changelog.\nFor notes on the latest release of the Swift implementation, see the latest Arrow Swift changelog."
author: "pmc"
contentHtml: "<!--\n\n-->\n<p>The Apache Arrow team is pleased to announce the 24.0.0 release. This release\ncovers over 3 months of development work and includes <a href=\"https://github.com/apache/arrow/milestone/72?closed=1\"><strong>259 resolved\nissues</strong></a> on <a href=\"/release/24.0.0.html#contributors\"><strong>325 distinct commits</strong></a> from <a href=\"/release/24.0.0.html#contributors\"><strong>57 distinct\ncontributors</strong></a>. See the <a href=\"https://arrow.apache.org/install/\">Install Page</a> to\nlearn how to get the libraries for your platform.</p>\n<p>The release notes below are not exhaustive and only expose selected highlights\nof the release. Many other bugfixes and improvements have been made: we refer\nyou to the <a href=\"/release/24.0.0.html#changelog\">complete changelog</a>.</p>\n<h2>Community</h2>\n<p>We recently published our <a href=\"https://arrow.apache.org/blog/2026/03/19/arrow-2025-highlights/\">Community Highlights for 2025</a>, check those out.</p>\n<p>Thanks everyone for your contributions and participation in the project!</p>\n<h2>Format Notes</h2>\n<p>We have written a project-wide <a href=\"https://arrow.apache.org/docs/dev/format/Security.html\">Security Model</a>\noutlining what users should expect when dealing with Arrow data, especially coming\nfrom untrusted sources <a href=\"https://github.com/apache/arrow/issues/48868\">GH-48868</a>.</p>\n<h2>Arrow Flight RPC Notes</h2>\n<p>The ODBC driver is still a work-in-progress. The driver now builds on Linux, but currently no builds are distributed (for any platform) (<a href=\"https://github.com/apache/arrow/issues/49463\">GH-49463</a>).</p>\n<p>In C++, we have refactored serialization/deserialization to make low-level functionality accessible for advanced usage (<a href=\"https://github.com/apache/arrow/issues/49548\">GH-49548</a>).</p>\n<h2>C++ Notes</h2>\n<p>In addition to the aforementioned project-wide Security Model, we have written\na specific <a href=\"https://arrow.apache.org/docs/dev/cpp/security.html\">Security Model for Arrow C++</a>\ncovering more concrete topics such as API usage and parameter validity <a href=\"https://github.com/apache/arrow/issues/49274\">GH-49274</a>.</p>\n<h3>Compute</h3>\n<h3>Extension Types</h3>\n<p>The canonical type <a href=\"https://arrow.apache.org/docs/format/CanonicalExtensions.html#variable-shape-tensor\">VariableShapeTensor</a>\nwas finally implemented <a href=\"https://github.com/apache/arrow/issues/38007\">GH-38007</a>.</p>\n<h3>Parquet</h3>\n<p><strong>Breaking change:</strong> The Arrow extension type name for Parquet Variant columns\nused to be <code>parquet.variant</code> but has been changed to <code>arrow.parquet.variant</code> <a href=\"https://github.com/apache/arrow/issues/49081\">GH-49081</a>.</p>\n<p>While Parquet C++ could only read unencrypted bloom filters, it now supports\nreading encrypted bloom filters as well <a href=\"https://github.com/apache/arrow/issues/48334\">GH-48334</a>. In addition, it can also\nwrite bloom filters, though only unencrypted <a href=\"https://github.com/apache/arrow/issues/34785\">GH-34785</a>.</p>\n<p>An ambitious rewrite of the bit-unpacking utilities and optimizations has led to\nsignificant performance improvements on reading some Parquet columns, up to 50%\nfaster in some cases <a href=\"https://github.com/apache/arrow/issues/48277\">GH-48277</a>. This rewrite is described in more detail\nin an <a href=\"https://medium.com/@AntoineProuvost/faster-reads-for-apache-parquet-improving-integer-unpacking-f6e21ce49a85\">accompanying blog post</a>.</p>\n<p>The performance of reading DELTA_BINARY_PACKED-encoded integers has been improved\nin some favorable cases <a href=\"https://github.com/apache/arrow/issues/49266\">GH-49266</a>.</p>\n<h3>Miscellaneous C++ changes</h3>\n<p>We have migrated to C++20 <code>std::span</code>, removing our home-grown implementation\nin <code>arrow::util::span</code> <a href=\"https://github.com/apache/arrow/issues/48588\">GH-48588</a>.</p>\n<p>A bunch of previously deprecated APIs have been removed <a href=\"https://github.com/apache/arrow/issues/49356\">GH-49356</a>.</p>\n<h2>Linux Packaging Notes</h2>\n<p>Added support for Ubuntu 26.04, the next LTS <a href=\"https://github.com/apache/arrow/issues/49341\">GH-49341</a></p>\n<h2>MATLAB Notes</h2>\n<p>No major notes for this release on MATLAB.</p>\n<h2>Python Notes</h2>\n<h2>Compatibility notes</h2>\n<ul>\n<li><code>pyarrow.gandiva</code> is deprecated and will be removed in a future version <a href=\"https://github.com/apache/arrow/issues/49227\">GH-49227</a></li>\n</ul>\n<h2>New features</h2>\n<ul>\n<li>Type annotations work is starting to be included (<a href=\"https://github.com/apache/arrow/issues/49102\">GH-49102</a> and\n<a href=\"https://github.com/apache/arrow/issues/49452\">GH-49452</a>)</li>\n<li>Basic arithmetic on arrays and scalars is now supported <a href=\"https://github.com/apache/arrow/issues/32007\">GH-32007</a></li>\n<li>Options to control writing of Parquet Bloom filters are added to <code>parquet.write_table</code> <a href=\"https://github.com/apache/arrow/issues/49376\">GH-49376</a></li>\n<li>OpenTelemetry is enabled in PyArrow wheels <a href=\"https://github.com/apache/arrow/issues/49382\">GH-49382</a></li>\n<li>AzureFileSystem is now included in the Windows wheels <a href=\"https://github.com/apache/arrow/issues/44655\">GH-44655</a></li>\n</ul>\n<h2>Other improvements</h2>\n<ul>\n<li>Scikit-build-core is now used as the PyArrow build system <a href=\"https://github.com/apache/arrow/issues/36411\">GH-36411</a></li>\n<li><code>UUID</code> objects are now inferred automatically in <code>pa.scalar()</code> and <code>pa.array()</code> without the need to\nspecify the type explicitly <a href=\"https://github.com/apache/arrow/issues/48241\">GH-48241</a></li>\n<li>Constructing an extension array via <code>pa.array()</code> from a list of extension-type scalars is now supported\n<a href=\"https://github.com/apache/arrow/issues/48470\">GH-48470</a></li>\n<li>There have been some improvements in the documentation (<a href=\"https://github.com/apache/arrow/issues/49278\">GH-49278</a>,\n<a href=\"https://github.com/apache/arrow/issues/49269\">GH-49269</a> and <a href=\"https://github.com/apache/arrow/issues/28859\">GH-28859</a>)</li>\n<li>CSV and JSON options have improved repr/str methods <a href=\"https://github.com/apache/arrow/issues/47389\">GH-47389</a></li>\n</ul>\n<h2>Relevant bug fixes</h2>\n<ul>\n<li><code>SparseCOOTensor.__repr__</code> missing f-string prefix is now fixed <a href=\"https://github.com/apache/arrow/issues/49108\">GH-49108</a></li>\n<li>Pickling <code>SubTreeFileSystem(base_path, AzureFileSystem(...))</code> is fixed <a href=\"https://github.com/apache/arrow/issues/49078\">GH-49078</a></li>\n<li>Casting from <code>StringArray</code> to pandas 3.* when element is <code>None</code> is fixed <a href=\"https://github.com/apache/arrow/issues/49002\">GH-49002</a></li>\n<li>Dictionary key order is now preserved when inferring struct type <a href=\"https://github.com/apache/arrow/issues/40053\">GH-40053</a></li>\n<li>Duplicate csv header when table batches start with empty is now fixed <a href=\"https://github.com/apache/arrow/issues/36889\">GH-36889</a></li>\n</ul>\n<h2>R Notes</h2>\n<h3>New Features</h3>\n<ul>\n<li>A number of new <code>dplyr</code> bindings <a href=\"https://github.com/apache/arrow/issues/49533\">GH-49533</a>, <a href=\"https://github.com/apache/arrow/issues/49256\">GH-49256</a>, <a href=\"https://github.com/apache/arrow/issues/49535\">GH-49535</a> and <a href=\"https://github.com/apache/arrow/issues/49534\">GH-49534</a></li>\n</ul>\n<h3>Compatibility notes</h3>\n<ul>\n<li>Arrow no longer builds with GCS enabled on CRAN to avoid failures in their build systems. If you would like a full-featured build of Arrow, we recommend installing from R-universe; see <a href=\"https://arrow.apache.org/docs/r/articles/fs.html\">the Using cloud storage article in the docs</a> for more information. <a href=\"https://github.com/apache/arrow/issues/49067\">GH-49067</a></li>\n</ul>\n<h3>Relevant bug fixes</h3>\n<ul>\n<li><code>to_arrow()</code> now retains grouping <a href=\"https://github.com/apache/arrow/issues/40640\">GH-40640</a></li>\n</ul>\n<h2>Ruby and C GLib Notes</h2>\n<ul>\n<li>Fixed GC related problems.</li>\n<li><code>GArrowListArray</code>: Added support for returning offset buffer.</li>\n<li><code>GArrowLargeListArray</code>: Added support for returning offset buffer.</li>\n<li><code>GArrowUnionArray</code>: Added support for returning fields.</li>\n<li>Deprecated Feather features.</li>\n</ul>\n<h3>Ruby</h3>\n<p>We've added pure Ruby Apache Arrow writer implementation to the\n<code>red-arrow-format</code> gem.</p>\n<p>We've marked pure Ruby Apache Arrow reader implementation in the\n<code>red-arrow-format</code>gem as stable because it passes integration tests\nwith other implementations. But it still has some missing features.</p>\n<p>The <code>red-arrow</code> gem:</p>\n<ul>\n<li>Add support for converting to raw Ruby objects of the following arrays:\n<ul>\n<li><code>Arrow::LargeBinaryArray</code></li>\n<li><code>Arrow::LargeUTF8Array</code></li>\n<li><code>Arrow::LargeListArray</code></li>\n<li><code>Arrow::FixedSizeListArray</code></li>\n<li><code>Arrow::DurationArray</code></li>\n<li><code>Arrow::DictionaryArray</code> with <code>Arrow::LargeBinaryArray</code> or\n<code>Arrow::LargeUTF8Array</code></li>\n</ul>\n</li>\n</ul>\n<h3>C GLib</h3>\n<p>No C GLib only notes.</p>\n<h2>Java, JavaScript, Go, .NET, Swift and Rust Notes</h2>\n<p>The Java, JavaScript, Go, .NET, Swift and Rust projects have moved to separate\nrepositories outside the main Arrow <a href=\"https://github.com/apache/arrow\">monorepo</a>.</p>\n<ul>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-java\">Java\nimplementation</a>, see the latest <a href=\"https://github.com/apache/arrow-java/releases\">Arrow\nJava changelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-js\">JavaScript\nimplementation</a>, see the latest <a href=\"https://github.com/apache/arrow-js/releases\">Arrow\nJavaScript changelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-rs\">Rust\nimplementation</a> see the latest <a href=\"https://github.com/apache/arrow-rs/blob/main/CHANGELOG.md\">Arrow Rust\nchangelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-go\">Go\nimplementation</a>, see the latest <a href=\"https://github.com/apache/arrow-go/releases\">Arrow Go\nchangelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-dotnet\">.NET\nimplementation</a>, see the latest <a href=\"https://github.com/apache/arrow-dotnet/releases\">Arrow  .NET changelog</a>.</li>\n<li>For notes on the latest release of the <a href=\"https://github.com/apache/arrow-swift\">Swift implementation</a>, see the latest <a href=\"https://github.com/apache/arrow-swift/releases\">Arrow Swift changelog</a>.</li>\n</ul>"
---

The Apache Arrow team is pleased to announce the 24.0.0 release. This release
covers over 3 months of development work and includes 259 resolved
issues on 325 distinct commits from 57 distinct
contributors. See the Install Page to
learn how to get the libraries for your platform.
The release notes below are not exhaustive and only expose selected highlights
of the release. Many other bugfixes and improvements have been made: we refer
you to the complete changelog.
Community
We recently published our Community Highlights for 2025, check those out.
Thanks everyone for your contributions and participation in the project!
Format Notes
We have written a project-wide Security Model
outlining what users should expect when dealing with Arrow data, especially coming
from untrusted sources GH-48868.
Arrow Flight RPC Notes
The ODBC driver is still a work-in-progress. The driver now builds on Linux, but currently no builds are distributed (for any platform) (GH-49463).
In C++, we have refactored serialization/deserialization to make low-level functionality accessible for advanced usage (GH-49548).
C++ Notes
In addition to the aforementioned project-wide Security Model, we have written
a specific Security Model for Arrow C++
covering more concrete topics such as API usage and parameter validity GH-49274.
Compute
Extension Types
The canonical type VariableShapeTensor
was finally implemented GH-38007.
Parquet
Breaking change: The Arrow extension type name for Parquet Variant columns
used to be parquet.variant but has been changed to arrow.parquet.variant GH-49081.
While Parquet C++ could only read unencrypted bloom filters, it now supports
reading encrypted bloom filters as well GH-48334. In addition, it can also
write bloom filters, though only unencrypted GH-34785.
An ambitious rewrite of the bit-unpacking utilities and optimizations has led to
significant performance improvements on reading some Parquet columns, up to 50%
faster in some cases GH-48277. This rewrite is described in more detail
in an accompanying blog post.
The performance of reading DELTA_BINARY_PACKED-encoded integers has been improved
in some favorable cases GH-49266.
Miscellaneous C++ changes
We have migrated to C++20 std::span, removing our home-grown implementation
in arrow::util::span GH-48588.
A bunch of previously deprecated APIs have been removed GH-49356.
Linux Packaging Notes
Added support for Ubuntu 26.04, the next LTS GH-49341
MATLAB Notes
No major notes for this release on MATLAB.
Python Notes
Compatibility notes
pyarrow.gandiva is deprecated and will be removed in a future version GH-49227
New features
Type annotations work is starting to be included (GH-49102 and
GH-49452)
Basic arithmetic on arrays and scalars is now supported GH-32007
Options to control writing of Parquet Bloom filters are added to parquet.write_table GH-49376
OpenTelemetry is enabled in PyArrow wheels GH-49382
AzureFileSystem is now included in the Windows wheels GH-44655
Other improvements
Scikit-build-core is now used as the PyArrow build system GH-36411
UUID objects are now inferred automatically in pa.scalar() and pa.array() without the need to
specify the type explicitly GH-48241
Constructing an extension array via pa.array() from a list of extension-type scalars is now supported
GH-48470
There have been some improvements in the documentation (GH-49278,
GH-49269 and GH-28859)
CSV and JSON options have improved repr/str methods GH-47389
Relevant bug fixes
SparseCOOTensor.__repr__ missing f-string prefix is now fixed GH-49108
Pickling SubTreeFileSystem(base_path, AzureFileSystem(...)) is fixed GH-49078
Casting from StringArray to pandas 3.* when element is None is fixed GH-49002
Dictionary key order is now preserved when inferring struct type GH-40053
Duplicate csv header when table batches start with empty is now fixed GH-36889
R Notes
New Features
A number of new dplyr bindings GH-49533, GH-49256, GH-49535 and GH-49534
Compatibility notes
Arrow no longer builds with GCS enabled on CRAN to avoid failures in their build systems. If you would like a full-featured build of Arrow, we recommend installing from R-universe; see the Using cloud storage article in the docs for more information. GH-49067
Relevant bug fixes
to_arrow() now retains grouping GH-40640
Ruby and C GLib Notes
Fixed GC related problems.
GArrowListArray: Added support for returning offset buffer.
GArrowLargeListArray: Added support for returning offset buffer.
GArrowUnionArray: Added support for returning fields.
Deprecated Feather features.
Ruby
We've added pure Ruby Apache Arrow writer implementation to the
red-arrow-format gem.
We've marked pure Ruby Apache Arrow reader implementation in the
red-arrow-formatgem as stable because it passes integration tests
with other implementations. But it still has some missing features.
The red-arrow gem:
Add support for converting to raw Ruby objects of the following arrays:

Arrow::LargeBinaryArray
Arrow::LargeUTF8Array
Arrow::LargeListArray
Arrow::FixedSizeListArray
Arrow::DurationArray
Arrow::DictionaryArray with Arrow::LargeBinaryArray or
Arrow::LargeUTF8Array
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
