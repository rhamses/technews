---
title: "Apache Arrow ADBC 24 (Libraries) Release"
link: "https://arrow.apache.org/blog/2026/07/28/adbc-24-release/"
guid: "https://arrow.apache.org/blog/2026/07/28/adbc-24-release/"
pubDate: "2026-07-28T04:00:00.000Z"
site_name: "Apache Arrow"
site_feed: "https://arrow.apache.org/feed.xml"
category: "Data"
summary: "The Apache Arrow team is pleased to announce the version 24 release of\nthe Apache Arrow ADBC libraries. This release includes 57\nresolved issues and 142 merged pull requests from\n28 distinct contributors.\nThis is a release of the libraries, which are at version 24.  The\nAPI specification is versioned separately and is at\nversion 1.1.0.\nThe subcomponents are versioned independently:\nC/C++/GLib/Go/Python/Ruby: 1.12.0\nC#: 0.24.0\nJava: 0.24.0\nJavaScript: 0.24.0\nR: 0.24.0\nRust: 0.24.0\nThe release notes below are not exhaustive and only expose selected\nhighlights of the release. Many other bugfixes and improvements have\nbeen made: we refer you to the complete changelog.\nRelease Highlights\nNote: we are planning to require C++20 starting from the next release. Also,\nwe will drop support for Python 3.10 no earlier than the release after next\ni.e. no earlier than release 26. Release 26 is expected in about 3-4 months\n(October~November 2026), and the EOL for Python 3.10 is October 2026.\nBreaking Changes and Deprecations\nDevelopment of the ADBC drivers for Apache DataFusion, BigQuery, Databricks,\nand Snowflake has moved to the ADBC Driver\nFoundry, an independent, community-maintained\nproject separate from Apache Arrow. The drivers remain available and continue\nto be developed there. No further releases of those drivers will come from\nthis project, but existing packages will remain available, possibly as\narchived listings. For background, see the ADBC documentation on driver\ndevelopment.\nCurrent driver locations and maintainer information are listed under\nDrivers.\nSimilarly, the experimental, incomplete support for Amazon Redshift in the\nPostgreSQL driver has been removed. A dedicated ADBC driver for Amazon\nRedshift is available from the\nADBC Driver Foundry.\nThe ADBC drivers for Apache Arrow Flight SQL, PostgreSQL, and SQLite continue\nto be maintained and released by this project.\nJava API definitions were narrowed so that close is only declared to throw\nAdbcException as a checked\nexception. (#4451)\nThe PostgreSQL driver now lazily initializes transactions to make it work\nbetter with connection\npools. (#4424)\nDocumentation\nThe documentation has been overhauled and is now organized around three common\ntasks: finding and installing\ndrivers, connecting\nthrough a client\nlibrary, and\ndeveloping a\ndriver.\n(#4525)\nThe revised docs emphasize ADBC's cross-language driver model: drivers are\ntypically distributed as shared libraries that can be used from any supported\nlanguage or client.\nA new Tools &\nIntegrations page\nhighlights tools and frameworks that integrate with ADBC. We welcome\ncontributions to add more integrations.\nA new Connection\nProfiles page shows\nhow to use reusable profiles to configure ADBC connections.\nThe docs also describe how most drivers now recognize URIs with schemes\nmatching their names, and how driver managers can use the scheme to resolve\nthe\ndriver\nwhen it is not otherwise specified.\nCore APIs & Client Libraries\nC# now has a native driver manager, allowing it to load drivers, manifests,\nand profiles (#4075,\n#4340,\n#4341,\n#4330). The core libraries\nare now compatible with AOT compilation, enabling drivers to be built as\nstandalone shared libaries\n(#4243,\n#4318).\nThe Go database/sql adapter now supports converting more Arrow types to Go\ntypes (#4416).\nThe Java core APIs now support a \"fluent\" style ingest API (#4466). Also,\nsupport for dynamically loading drivers for use in Java has been greatly\nexpanded and should now support all of the ADBC APIs and features expected of\na client library (#4452,\n#4211,\n#4411,\n#4202,\n#4359,\n#4212,\n#4263,\n#4229,\n#4203,\n#4361,\n#4362,\n#4249,\n#4250,\n#4398,\n#4397,\n#4423,\n#4395,\n#4396,\n#4391).\nThe JavaScript client library no longer requires the driver parameter and\ncan infer the driver to load based on the URI, or can accept a profile\n(#4357).\nThe R client library no longer requires the driver parameter and can infer\nthe driver to load based on the URI, or can accept a profile\n(#4535).\nSome tweaks have been made to the Rust core APIs to better support interop\nwith dynamically loaded drivers and make certain conventions clearer\n(#4427,\n#4510,\n#4350,\n#4141,\n#4181,\n#4473,\n#4469).\nDrivers\nThis project continues to maintain and release the ADBC drivers for Apache\nArrow Flight SQL, PostgreSQL, and SQLite. As mentioned above, the DataFusion,\nBigQuery, Databricks, and Snowflake drivers are now maintained in the ADBC\nDriver Foundry, alongside many others.\nThe Flight SQL driver now recognizes URIs with the flightsql:// scheme\n(#4488). It also has more\nsupport for logging and OpenTelemetry tracing\n(#4322,\n#4486).\nThe PostgreSQL driver now uses libpq version 18.4 (up from 16.9)\n(#4566). Several bugs have\nbeen fixed around handling of the NUMERIC type, and it has been optimized on\nplatforms where int128 is available (generally, platforms other than Windows)\n(#4536,\n#4499,\n#4523,\n#4498). GetObjects now\npopulates the xdbc_type_name field\n(#4457). JSON columns are\nnow returned with the arrow.json extension type\n(#4415), and ingesting into\nJSONB columns is now supported\n(#4505).\nThe SQLite driver now uses SQLite version 3.53.1 (up from 3.51.2)\n(#4566). It now recognizes\nURIs with the sqlite:// scheme\n(#4463).\n\nContributors\n\n$ git shortlog --perl-regexp --author='^((?!dependabot\\[bot\\]).*)$' -sn apache-arrow-adbc-23..apache-arrow-adbc-24\n    58\tDavid Li\n    16\tBryce Mecum\n    11\tFredrik Fornwall\n     7\tCurt Hagenlocher\n     7\teitsupi\n     6\tMandukhai Alimaa\n     5\tdavidhcoe\n     4\tMatt Topol\n     4\ttakuya kodama\n     3\tIan Cook\n     3\t복준수\n     2\tArtur Rakhmatulin\n     2\tAustin Bonander\n     2\tBruce Irschick\n     2\tDaniel_McBride\n     2\tEmil Sadek\n     1\tArnold Wakim\n     1\tAurélien Pupier\n     1\tDan Liu\n     1\tFelipe Oliveira Carvalho\n     1\tKent Wu\n     1\tNeal Richardson\n     1\tNir Portal\n     1\tPavel Agafonov\n     1\tRishav Rungta\n     1\tShubham Pandey\n     1\tmete\n     1\txinyu.lin\n\n\nRoadmap\nWe are working on the next revision of the API standard, focusing on missing\nfeatures (primarily metadata/catalog data). We welcome anyone interested in\ncontributing. Current progress can be found in the 1.2.0 specification\nmilestone.\nGetting Involved\nWe welcome questions and contributions from all interested.  Issues\ncan be filed on GitHub, and questions can be directed to GitHub\nor the Arrow mailing lists."
author: "pmc"
contentHtml: "<!--\n\n-->\n<p>The Apache Arrow team is pleased to announce the version 24 release of\nthe Apache Arrow ADBC libraries. This release includes <a href=\"https://github.com/apache/arrow-adbc/issues?q=is%3Aissue%20state%3Aclosed%20milestone%3A%22ADBC%20Libraries%2024%22\"><strong>57\nresolved issues</strong></a> and <a href=\"https://github.com/apache/arrow-adbc/pulls?q=is%3Apr%20state%3Aclosed%20milestone%3A%22ADBC%20Libraries%2024%22%20-author%3Aapp%2Fdependabot\"><strong>142 merged pull requests</strong></a> from\n<a href=\"#contributors\"><strong>28 distinct contributors</strong></a>.</p>\n<p>This is a release of the <strong>libraries</strong>, which are at version 24.  The\n<a href=\"https://arrow.apache.org/adbc/24/format/specification.html\"><strong>API specification</strong></a> is versioned separately and is at\nversion 1.1.0.</p>\n<p>The subcomponents are versioned independently:</p>\n<ul>\n<li>C/C++/GLib/Go/Python/Ruby: 1.12.0</li>\n<li>C#: 0.24.0</li>\n<li>Java: 0.24.0</li>\n<li> 0.24.0</li>\n<li>R: 0.24.0</li>\n<li>Rust: 0.24.0</li>\n</ul>\n<p>The release notes below are not exhaustive and only expose selected\nhighlights of the release. Many other bugfixes and improvements have\nbeen made: we refer you to the <a href=\"https://github.com/apache/arrow-adbc/blob/apache-arrow-adbc-24/CHANGELOG.md\">complete changelog</a>.</p>\n<h2>Release Highlights</h2>\n<p>Note: we are planning to require C++20 starting from the next release. Also,\nwe will drop support for Python 3.10 no earlier than the release after next\ni.e. no earlier than release 26. Release 26 is expected in about 3-4 months\n(October~November 2026), and the EOL for Python 3.10 is October 2026.</p>\n<h3>Breaking Changes and Deprecations</h3>\n<p>Development of the ADBC drivers for Apache DataFusion, BigQuery, Databricks,\nand Snowflake has moved to the <a href=\"https://adbc-drivers.org/\">ADBC Driver\nFoundry</a>, an independent, community-maintained\nproject separate from Apache Arrow. The drivers remain available and continue\nto be developed there. No further releases of those drivers will come from\nthis project, but existing packages will remain available, possibly as\narchived listings. For background, see <a href=\"https://arrow.apache.org/adbc/24/driver/authoring.html#why-the-driver-foundry-not-this-repository\">the ADBC documentation on driver\ndevelopment</a>.\nCurrent driver locations and maintainer information are listed under\n<a href=\"https://arrow.apache.org/adbc/24/driver/index.html\">Drivers</a>.</p>\n<p>Similarly, the experimental, incomplete support for Amazon Redshift in the\nPostgreSQL driver has been removed. A dedicated <a href=\"https://adbc-drivers.org/drivers/redshift/\">ADBC driver for Amazon\nRedshift</a> is available from the\nADBC Driver Foundry.</p>\n<p>The ADBC drivers for Apache Arrow Flight SQL, PostgreSQL, and SQLite continue\nto be maintained and released by this project.</p>\n<p>Java API definitions were narrowed so that <code>close</code> is only declared to throw\n<code>AdbcException</code> as a checked\nexception. (<a href=\"https://github.com/apache/arrow-adbc/pull/4451\">#4451</a>)</p>\n<p>The PostgreSQL driver now lazily initializes transactions to make it work\nbetter with connection\npools. (<a href=\"https://github.com/apache/arrow-adbc/pull/4424\">#4424</a>)</p>\n<h3>Documentation</h3>\n<p>The documentation has been overhauled and is now organized around three common\ntasks: <a href=\"https://arrow.apache.org/adbc/24/driver/index.html\">finding and installing\ndrivers</a>, <a href=\"https://arrow.apache.org/adbc/24/client_libraries.html\">connecting\nthrough a client\nlibrary</a>, and\n<a href=\"https://arrow.apache.org/adbc/24/driver/authoring.html\">developing a\ndriver</a>.\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4525\">#4525</a>)</p>\n<p>The revised docs emphasize ADBC's cross-language driver model: drivers are\ntypically distributed as shared libraries that can be used from any supported\nlanguage or client.</p>\n<p>A new <a href=\"https://arrow.apache.org/adbc/24/integrations.html\">Tools &amp;\nIntegrations</a> page\nhighlights tools and frameworks that integrate with ADBC. We welcome\ncontributions to add more integrations.</p>\n<p>A new <a href=\"https://arrow.apache.org/adbc/24/connection_profiles.html\">Connection\nProfiles</a> page shows\nhow to use reusable profiles to configure ADBC connections.</p>\n<p>The docs also describe how most drivers now recognize URIs with schemes\nmatching their names, and how <a href=\"https://arrow.apache.org/adbc/24/format/driver_manifests.html#resolving-a-driver-from-a-connection-uri\">driver managers can use the scheme to resolve\nthe\ndriver</a>\nwhen it is not otherwise specified.</p>\n<h3>Core APIs &amp; Client Libraries</h3>\n<p>C# now has a native driver manager, allowing it to load drivers, manifests,\nand profiles (<a href=\"https://github.com/apache/arrow-adbc/pull/4075\">#4075</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4340\">#4340</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4341\">#4341</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4330\">#4330</a>). The core libraries\nare now compatible with AOT compilation, enabling drivers to be built as\nstandalone shared libaries\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4243\">#4243</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4318\">#4318</a>).</p>\n<p>The Go <code>database/sql</code> adapter now supports converting more Arrow types to Go\ntypes (<a href=\"https://github.com/apache/arrow-adbc/pull/4416\">#4416</a>).</p>\n<p>The Java core APIs now support a &quot;fluent&quot; style ingest API (#4466). Also,\nsupport for dynamically loading drivers for use in Java has been greatly\nexpanded and should now support all of the ADBC APIs and features expected of\na client library (<a href=\"https://github.com/apache/arrow-adbc/pull/4452\">#4452</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4211\">#4211</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4411\">#4411</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4202\">#4202</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4359\">#4359</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4212\">#4212</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4263\">#4263</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4229\">#4229</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4203\">#4203</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4361\">#4361</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4362\">#4362</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4249\">#4249</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4250\">#4250</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4398\">#4398</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4397\">#4397</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4423\">#4423</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4395\">#4395</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4396\">#4396</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4391\">#4391</a>).</p>\n<p>The JavaScript client library no longer requires the <code>driver</code> parameter and\ncan infer the driver to load based on the URI, or can accept a profile\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4357\">#4357</a>).</p>\n<p>The R client library no longer requires the <code>driver</code> parameter and can infer\nthe driver to load based on the URI, or can accept a profile\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4535\">#4535</a>).</p>\n<p>Some tweaks have been made to the Rust core APIs to better support interop\nwith dynamically loaded drivers and make certain conventions clearer\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4427\">#4427</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4510\">#4510</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4350\">#4350</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4141\">#4141</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4181\">#4181</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4473\">#4473</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4469\">#4469</a>).</p>\n<h3>Drivers</h3>\n<p>This project continues to maintain and release the ADBC drivers for Apache\nArrow Flight SQL, PostgreSQL, and SQLite. As mentioned above, the DataFusion,\nBigQuery, Databricks, and Snowflake drivers are now maintained in the <a href=\"https://adbc-drivers.org/\">ADBC\nDriver Foundry</a>, alongside many others.</p>\n<p>The Flight SQL driver now recognizes URIs with the <code>flightsql://</code> scheme\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4488\">#4488</a>). It also has more\nsupport for logging and OpenTelemetry tracing\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4322\">#4322</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4486\">#4486</a>).</p>\n<p>The PostgreSQL driver now uses libpq version 18.4 (up from 16.9)\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4566\">#4566</a>). Several bugs have\nbeen fixed around handling of the NUMERIC type, and it has been optimized on\nplatforms where int128 is available (generally, platforms other than Windows)\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4536\">#4536</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4499\">#4499</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4523\">#4523</a>,\n<a href=\"https://github.com/apache/arrow-adbc/pull/4498\">#4498</a>). GetObjects now\npopulates the <code>xdbc_type_name</code> field\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4457\">#4457</a>). JSON columns are\nnow returned with the <code>arrow.json</code> extension type\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4415\">#4415</a>), and ingesting into\nJSONB columns is now supported\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4505\">#4505</a>).</p>\n<p>The SQLite driver now uses SQLite version 3.53.1 (up from 3.51.2)\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4566\">#4566</a>). It now recognizes\nURIs with the <code>sqlite://</code> scheme\n(<a href=\"https://github.com/apache/arrow-adbc/pull/4463\">#4463</a>).</p>\n<p><a id=\"contributors\"></a></p>\n<h2>Contributors</h2>\n<div class=\"highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>$ git shortlog --perl-regexp --author='^((?!dependabot\\[bot\\]).*)$' -sn apache-arrow-adbc-23..apache-arrow-adbc-24\n    58\tDavid Li\n    16\tBryce Mecum\n    11\tFredrik Fornwall\n     7\tCurt Hagenlocher\n     7\teitsupi\n     6\tMandukhai Alimaa\n     5\tdavidhcoe\n     4\tMatt Topol\n     4\ttakuya kodama\n     3\tIan Cook\n     3\t복준수\n     2\tArtur Rakhmatulin\n     2\tAustin Bonander\n     2\tBruce Irschick\n     2\tDaniel_McBride\n     2\tEmil Sadek\n     1\tArnold Wakim\n     1\tAurélien Pupier\n     1\tDan Liu\n     1\tFelipe Oliveira Carvalho\n     1\tKent Wu\n     1\tNeal Richardson\n     1\tNir Portal\n     1\tPavel Agafonov\n     1\tRishav Rungta\n     1\tShubham Pandey\n     1\tmete\n     1\txinyu.lin\n</code></pre></div></div>\n<h2>Roadmap</h2>\n<p>We are working on the next revision of the API standard, focusing on missing\nfeatures (primarily metadata/catalog data). We welcome anyone interested in\ncontributing. Current progress can be found in the <a href=\"https://github.com/apache/arrow-adbc/milestone/9\">1.2.0 specification\nmilestone</a>.</p>\n<h2>Getting Involved</h2>\n<p>We welcome questions and contributions from all interested.  Issues\ncan be filed on <a href=\"https://github.com/apache/arrow-adbc/issues\">GitHub</a>, and questions can be directed to GitHub\nor the <a href=\"/community/\">Arrow mailing lists</a>.</p>"
---

The Apache Arrow team is pleased to announce the version 24 release of
the Apache Arrow ADBC libraries. This release includes 57
resolved issues and 142 merged pull requests from
28 distinct contributors.
This is a release of the libraries, which are at version 24.  The
API specification is versioned separately and is at
version 1.1.0.
The subcomponents are versioned independently:
C/C++/GLib/Go/Python/Ruby: 1.12.0
C#: 0.24.0
Java: 0.24.0
JavaScript: 0.24.0
R: 0.24.0
Rust: 0.24.0
The release notes below are not exhaustive and only expose selected
highlights of the release. Many other bugfixes and improvements have
been made: we refer you to the complete changelog.
Release Highlights
Note: we are planning to require C++20 starting from the next release. Also,
we will drop support for Python 3.10 no earlier than the release after next
i.e. no earlier than release 26. Release 26 is expected in about 3-4 months
(October~November 2026), and the EOL for Python 3.10 is October 2026.
Breaking Changes and Deprecations
Development of the ADBC drivers for Apache DataFusion, BigQuery, Databricks,
and Snowflake has moved to the ADBC Driver
Foundry, an independent, community-maintained
project separate from Apache Arrow. The drivers remain available and continue
to be developed there. No further releases of those drivers will come from
this project, but existing packages will remain available, possibly as
archived listings. For background, see the ADBC documentation on driver
development.
Current driver locations and maintainer information are listed under
Drivers.
Similarly, the experimental, incomplete support for Amazon Redshift in the
PostgreSQL driver has been removed. A dedicated ADBC driver for Amazon
Redshift is available from the
ADBC Driver Foundry.
The ADBC drivers for Apache Arrow Flight SQL, PostgreSQL, and SQLite continue
to be maintained and released by this project.
Java API definitions were narrowed so that close is only declared to throw
AdbcException as a checked
exception. (#4451)
The PostgreSQL driver now lazily initializes transactions to make it work
better with connection
pools. (#4424)
Documentation
The documentation has been overhauled and is now organized around three common
tasks: finding and installing
drivers, connecting
through a client
library, and
developing a
driver.
(#4525)
The revised docs emphasize ADBC's cross-language driver model: drivers are
typically distributed as shared libraries that can be used from any supported
language or client.
A new Tools &
Integrations page
highlights tools and frameworks that integrate with ADBC. We welcome
contributions to add more integrations.
A new Connection
Profiles page shows
how to use reusable profiles to configure ADBC connections.
The docs also describe how most drivers now recognize URIs with schemes
matching their names, and how driver managers can use the scheme to resolve
the
driver
when it is not otherwise specified.
Core APIs & Client Libraries
C# now has a native driver manager, allowing it to load drivers, manifests,
and profiles (#4075,
#4340,
#4341,
#4330). The core libraries
are now compatible with AOT compilation, enabling drivers to be built as
standalone shared libaries
(#4243,
#4318).
The Go database/sql adapter now supports converting more Arrow types to Go
types (#4416).
The Java core APIs now support a "fluent" style ingest API (#4466). Also,
support for dynamically loading drivers for use in Java has been greatly
expanded and should now support all of the ADBC APIs and features expected of
a client library (#4452,
#4211,
#4411,
#4202,
#4359,
#4212,
#4263,
#4229,
#4203,
#4361,
#4362,
#4249,
#4250,
#4398,
#4397,
#4423,
#4395,
#4396,
#4391).
The JavaScript client library no longer requires the driver parameter and
can infer the driver to load based on the URI, or can accept a profile
(#4357).
The R client library no longer requires the driver parameter and can infer
the driver to load based on the URI, or can accept a profile
(#4535).
Some tweaks have been made to the Rust core APIs to better support interop
with dynamically loaded drivers and make certain conventions clearer
(#4427,
#4510,
#4350,
#4141,
#4181,
#4473,
#4469).
Drivers
This project continues to maintain and release the ADBC drivers for Apache
Arrow Flight SQL, PostgreSQL, and SQLite. As mentioned above, the DataFusion,
BigQuery, Databricks, and Snowflake drivers are now maintained in the ADBC
Driver Foundry, alongside many others.
The Flight SQL driver now recognizes URIs with the flightsql:// scheme
(#4488). It also has more
support for logging and OpenTelemetry tracing
(#4322,
#4486).
The PostgreSQL driver now uses libpq version 18.4 (up from 16.9)
(#4566). Several bugs have
been fixed around handling of the NUMERIC type, and it has been optimized on
platforms where int128 is available (generally, platforms other than Windows)
(#4536,
#4499,
#4523,
#4498). GetObjects now
populates the xdbc_type_name field
(#4457). JSON columns are
now returned with the arrow.json extension type
(#4415), and ingesting into
JSONB columns is now supported
(#4505).
The SQLite driver now uses SQLite version 3.53.1 (up from 3.51.2)
(#4566). It now recognizes
URIs with the sqlite:// scheme
(#4463).

Contributors

$ git shortlog --perl-regexp --author='^((?!dependabot\[bot\]).*)$' -sn apache-arrow-adbc-23..apache-arrow-adbc-24
    58	David Li
    16	Bryce Mecum
    11	Fredrik Fornwall
     7	Curt Hagenlocher
     7	eitsupi
     6	Mandukhai Alimaa
     5	davidhcoe
     4	Matt Topol
     4	takuya kodama
     3	Ian Cook
     3	복준수
     2	Artur Rakhmatulin
     2	Austin Bonander
     2	Bruce Irschick
     2	Daniel_McBride
     2	Emil Sadek
     1	Arnold Wakim
     1	Aurélien Pupier
     1	Dan Liu
     1	Felipe Oliveira Carvalho
     1	Kent Wu
     1	Neal Richardson
     1	Nir Portal
     1	Pavel Agafonov
     1	Rishav Rungta
     1	Shubham Pandey
     1	mete
     1	xinyu.lin


Roadmap
We are working on the next revision of the API standard, focusing on missing
features (primarily metadata/catalog data). We welcome anyone interested in
contributing. Current progress can be found in the 1.2.0 specification
milestone.
Getting Involved
We welcome questions and contributions from all interested.  Issues
can be filed on GitHub, and questions can be directed to GitHub
or the Arrow mailing lists.
