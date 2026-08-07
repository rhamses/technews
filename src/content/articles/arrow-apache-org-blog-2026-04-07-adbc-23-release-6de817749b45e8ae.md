---
title: "Apache Arrow ADBC 23 (Libraries) Release"
link: "https://arrow.apache.org/blog/2026/04/07/adbc-23-release/"
guid: "https://arrow.apache.org/blog/2026/04/07/adbc-23-release/"
pubDate: "2026-04-07T04:00:00.000Z"
site_name: "Apache Arrow"
site_feed: "https://arrow.apache.org/feed.xml"
category: "Data"
summary: "The Apache Arrow team is pleased to announce the version 23 release of\nthe Apache Arrow ADBC libraries. This release includes 41\nresolved issues from 20 distinct contributors.\nThis is a release of the libraries, which are at version 23.  The\nAPI specification is versioned separately and is at\nversion 1.1.0.\nThe subcomponents are versioned independently:\nC/C++/GLib/Go/Python/Ruby: 1.11.0\nC#: 0.23.0\nJava: 0.23.0\nR: 0.23.0\nRust: 0.23.0\nThe release notes below are not exhaustive and only expose selected\nhighlights of the release. Many other bugfixes and improvements have\nbeen made: we refer you to the complete changelog.\nRelease Highlights\nA breaking change has been made to the Rust APIs (pre-1.0): returned\nRecordBatchReaders are now type-erased and boxed for caller flexibility;\nthis also fixes the returned reader lifetime accidentally being tied to input\nargument lifetimes (#3904).\nA driver manager for Node.js is now available from NPM\n(#4046,\n#4091,\n#4116,\n#4125, etc.).\nThe C++ and Rust driver managers now support connection\nprofiles\n(#3876,\n#3973,\n#4080,\n#4083 etc.). (Note that\nother bindings that use the C++ driver manager, including GLib/Ruby, Go, Java,\nPython, R, and so on, inherit this support.)\nThe Go APIs have added interfaces that always take a context.Context for\nconsistency, and to make sure context like telemetry traces propagate properly\n(#4009).\nThe Python driver manager has added specific parameters for using connection\nprofiles\nas well (#4078,\n#4118). Also, non-string\noption values are directly accepted for convenience\n(#4088). adbc_get_statistics\nhas been added (#4129).\nThe JNI bindings (allowing use of C/C++/Go/Rust/etc. drivers from Java) now\nsupport more functions (GetObjects, GetInfo, ExecuteSchema, etc.)\n(#3966,\n#3972,\n#4056).\nPackages are now being uploaded to\nHomebrew\n(#4131).\nPython wheels now require manylinux_2_28, up from manylinux2010, following\nPyArrow (#4146).  On macOS,\nmacOS 12 is now the minimum version due to upgrading to Go 1.25+ (including on\nconda-forge, where the packages previously pinned Go 1.24 to avoid this).\nThe PostgreSQL driver tries to reconcile Arrow NA arrays with PostgreSQL types\nwhen binding (#4098). Also,\na bug in conversion from Arrow decimals to PostgreSQL numerics has been fixed\n(#3787).\nThe SQLite driver now enables various optional features, like math functions\n(#4147).\nContributors\n\n$ git shortlog --perl-regexp --author='^((?!dependabot\\[bot\\]).*)$' -sn apache-arrow-adbc-22..apache-arrow-adbc-23\n    35\tDavid Li\n    12\tKent Wu\n    10\tMatt Topol\n     8\teitsupi\n     6\tBryce Mecum\n     5\tBruce Irschick\n     4\tMandukhai Alimaa\n     3\tEmil Sadek\n     3\tTornike Gurgenidze\n     2\tDewey Dunnington\n     2\tFelipe Oliveira Carvalho\n     2\teric-wang-1990\n     1\tCurt Hagenlocher\n     1\tIan Cook\n     1\tMadhavendra Rathore\n     1\tMila Page\n     1\tPavel Agafonov\n     1\tRoshan Banisetti\n     1\tdavidhcoe\n     1\toglego\n\n\nRoadmap\nWe are working on the next revision of the API standard, focusing on missing\nfeatures (primarily metadata/catalog data). We welcome anyone interested in\ncontributing. Current progress can be found in the 1.2.0 specification\nmilestone.\nGetting Involved\nWe welcome questions and contributions from all interested.  Issues\ncan be filed on GitHub, and questions can be directed to GitHub\nor the Arrow mailing lists."
author: "pmc"
contentHtml: "<!--\n\n-->\n<p>The Apache Arrow team is pleased to announce the version 23 release of\nthe Apache Arrow ADBC libraries. This release includes <a href=\"https://github.com/apache/arrow-adbc/milestone/27\"><strong>41\nresolved issues</strong></a> from <a href=\"#contributors\"><strong>20 distinct contributors</strong></a>.</p>\n<p>This is a release of the <strong>libraries</strong>, which are at version 23.  The\n<a href=\"https://arrow.apache.org/adbc/23/format/specification.html\"><strong>API specification</strong></a> is versioned separately and is at\nversion 1.1.0.</p>\n<p>The subcomponents are versioned independently:</p>\n<ul>\n<li>C/C++/GLib/Go/Python/Ruby: 1.11.0</li>\n<li>C#: 0.23.0</li>\n<li>Java: 0.23.0</li>\n<li>R: 0.23.0</li>\n<li>Rust: 0.23.0</li>\n</ul>\n<p>The release notes below are not exhaustive and only expose selected\nhighlights of the release. Many other bugfixes and improvements have\nbeen made: we refer you to the <a href=\"https://github.com/apache/arrow-adbc/blob/apache-arrow-adbc-23/CHANGELOG.md\">complete changelog</a>.</p>\n<h2>Release Highlights</h2>\n<p>A breaking change has been made to the Rust APIs (pre-1.0): returned\n<code>RecordBatchReader</code>s are now type-erased and boxed for caller flexibility;\nthis also fixes the returned reader lifetime accidentally being tied to input\nargument lifetimes (<a href=\"https://github.com/apache/arrow-adbc/pull/3904\">#3904</a>).</p>\n<p>A driver manager for Node.js is now available from NPM\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4046\">#4046</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4091\">#4091</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4116\">#4116</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4125\">#4125</a>, etc.).</p>\n<p>The C++ and Rust driver managers now support <a href=\"https://arrow.apache.org/adbc/current/format/connection_profiles.html\">connection\nprofiles</a>\n(<a href=\"https://github.com/apache/arrow-adbc/pull/3876\">#3876</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/3973\">#3973</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4080\">#4080</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4083\">#4083</a> etc.). (Note that\nother bindings that use the C++ driver manager, including GLib/Ruby, Go, Java,\nPython, R, and so on, inherit this support.)</p>\n<p>The Go APIs have added interfaces that always take a <code>context.Context</code> for\nconsistency, and to make sure context like telemetry traces propagate properly\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4009\">#4009</a>).</p>\n<p>The Python driver manager has added specific parameters for using <a href=\"https://arrow.apache.org/adbc/current/format/connection_profiles.html\">connection\nprofiles</a>\nas well (<a href=\"https://github.com/apache/arrow-adbc/pull/4078\">#4078</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4118\">#4118</a>). Also, non-string\noption values are directly accepted for convenience\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4088\">#4088</a>). <code>adbc_get_statistics</code>\nhas been added (<a href=\"https://github.com/apache/arrow-adbc/pull/4129\">#4129</a>).</p>\n<p>The JNI bindings (allowing use of C/C++/Go/Rust/etc. drivers from Java) now\nsupport more functions (GetObjects, GetInfo, ExecuteSchema, etc.)\n(<a href=\"https://github.com/apache/arrow-adbc/pull/3966\">#3966</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/3972\">#3972</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4056\">#4056</a>).</p>\n<p>Packages are now being uploaded to\n<a href=\"https://formulae.brew.sh/formula/apache-arrow-adbc\">Homebrew</a>\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4131\">#4131</a>).</p>\n<p>Python wheels now require <code>manylinux_2_28</code>, up from <code>manylinux2010</code>, following\nPyArrow (<a href=\"https://github.com/apache/arrow-adbc/pull/4146\">#4146</a>).  On macOS,\nmacOS 12 is now the minimum version due to upgrading to Go 1.25+ (including on\nconda-forge, where the packages previously pinned Go 1.24 to avoid this).</p>\n<p>The PostgreSQL driver tries to reconcile Arrow NA arrays with PostgreSQL types\nwhen binding (<a href=\"https://github.com/apache/arrow-adbc/pull/4098\">#4098</a>). Also,\na bug in conversion from Arrow decimals to PostgreSQL numerics has been fixed\n(<a href=\"https://github.com/apache/arrow-adbc/pull/3787\">#3787</a>).</p>\n<p>The SQLite driver now enables various optional features, like math functions\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4147\">#4147</a>).</p>\n<h2>Contributors</h2>\n<div class=\"highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>$ git shortlog --perl-regexp --author='^((?!dependabot\\[bot\\]).*)$' -sn apache-arrow-adbc-22..apache-arrow-adbc-23\n    35\tDavid Li\n    12\tKent Wu\n    10\tMatt Topol\n     8\teitsupi\n     6\tBryce Mecum\n     5\tBruce Irschick\n     4\tMandukhai Alimaa\n     3\tEmil Sadek\n     3\tTornike Gurgenidze\n     2\tDewey Dunnington\n     2\tFelipe Oliveira Carvalho\n     2\teric-wang-1990\n     1\tCurt Hagenlocher\n     1\tIan Cook\n     1\tMadhavendra Rathore\n     1\tMila Page\n     1\tPavel Agafonov\n     1\tRoshan Banisetti\n     1\tdavidhcoe\n     1\toglego\n</code></pre></div></div>\n<h2>Roadmap</h2>\n<p>We are working on the next revision of the API standard, focusing on missing\nfeatures (primarily metadata/catalog data). We welcome anyone interested in\ncontributing. Current progress can be found in the <a href=\"https://github.com/apache/arrow-adbc/milestone/9\">1.2.0 specification\nmilestone</a>.</p>\n<h2>Getting Involved</h2>\n<p>We welcome questions and contributions from all interested.  Issues\ncan be filed on <a href=\"https://github.com/apache/arrow-adbc/issues\">GitHub</a>, and questions can be directed to GitHub\nor the <a href=\"/community/\">Arrow mailing lists</a>.</p>"
---

The Apache Arrow team is pleased to announce the version 23 release of
the Apache Arrow ADBC libraries. This release includes 41
resolved issues from 20 distinct contributors.
This is a release of the libraries, which are at version 23.  The
API specification is versioned separately and is at
version 1.1.0.
The subcomponents are versioned independently:
C/C++/GLib/Go/Python/Ruby: 1.11.0
C#: 0.23.0
Java: 0.23.0
R: 0.23.0
Rust: 0.23.0
The release notes below are not exhaustive and only expose selected
highlights of the release. Many other bugfixes and improvements have
been made: we refer you to the complete changelog.
Release Highlights
A breaking change has been made to the Rust APIs (pre-1.0): returned
RecordBatchReaders are now type-erased and boxed for caller flexibility;
this also fixes the returned reader lifetime accidentally being tied to input
argument lifetimes (#3904).
A driver manager for Node.js is now available from NPM
(#4046,
#4091,
#4116,
#4125, etc.).
The C++ and Rust driver managers now support connection
profiles
(#3876,
#3973,
#4080,
#4083 etc.). (Note that
other bindings that use the C++ driver manager, including GLib/Ruby, Go, Java,
Python, R, and so on, inherit this support.)
The Go APIs have added interfaces that always take a context.Context for
consistency, and to make sure context like telemetry traces propagate properly
(#4009).
The Python driver manager has added specific parameters for using connection
profiles
as well (#4078,
#4118). Also, non-string
option values are directly accepted for convenience
(#4088). adbc_get_statistics
has been added (#4129).
The JNI bindings (allowing use of C/C++/Go/Rust/etc. drivers from Java) now
support more functions (GetObjects, GetInfo, ExecuteSchema, etc.)
(#3966,
#3972,
#4056).
Packages are now being uploaded to
Homebrew
(#4131).
Python wheels now require manylinux_2_28, up from manylinux2010, following
PyArrow (#4146).  On macOS,
macOS 12 is now the minimum version due to upgrading to Go 1.25+ (including on
conda-forge, where the packages previously pinned Go 1.24 to avoid this).
The PostgreSQL driver tries to reconcile Arrow NA arrays with PostgreSQL types
when binding (#4098). Also,
a bug in conversion from Arrow decimals to PostgreSQL numerics has been fixed
(#3787).
The SQLite driver now enables various optional features, like math functions
(#4147).
Contributors

$ git shortlog --perl-regexp --author='^((?!dependabot\[bot\]).*)$' -sn apache-arrow-adbc-22..apache-arrow-adbc-23
    35	David Li
    12	Kent Wu
    10	Matt Topol
     8	eitsupi
     6	Bryce Mecum
     5	Bruce Irschick
     4	Mandukhai Alimaa
     3	Emil Sadek
     3	Tornike Gurgenidze
     2	Dewey Dunnington
     2	Felipe Oliveira Carvalho
     2	eric-wang-1990
     1	Curt Hagenlocher
     1	Ian Cook
     1	Madhavendra Rathore
     1	Mila Page
     1	Pavel Agafonov
     1	Roshan Banisetti
     1	davidhcoe
     1	oglego


Roadmap
We are working on the next revision of the API standard, focusing on missing
features (primarily metadata/catalog data). We welcome anyone interested in
contributing. Current progress can be found in the 1.2.0 specification
milestone.
Getting Involved
We welcome questions and contributions from all interested.  Issues
can be filed on GitHub, and questions can be directed to GitHub
or the Arrow mailing lists.
