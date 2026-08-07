---
title: "Apache Arrow nanoarrow 0.8.0 Release"
link: "https://arrow.apache.org/blog/2026/02/24/nanoarrow-0.8.0-release/"
guid: "https://arrow.apache.org/blog/2026/02/24/nanoarrow-0.8.0-release/"
pubDate: "2026-02-24T05:00:00.000Z"
site_name: "Apache Arrow"
site_feed: "https://arrow.apache.org/feed.xml"
category: "Data"
summary: "The Apache Arrow team is pleased to announce the 0.8.0 release of\nApache Arrow nanoarrow. This release consists of 28 resolved GitHub issues from\n10 contributors.\nRelease Highlights\nSupport for building String View arrays by buffer\nLZ4 decompression support in IPC reader\nSupport for Conan\nSupport for Hombrew\nSee the\nChangelog\nfor a detailed list of contributions to this release.\nFeatures\nString Views By Buffer\nThe C library in general supports two methods for producing or consuming arrays: most\nusers use the builder pattern (e.g., ArrowArrayAppendString()); however, the \"build\nby buffer\" pattern can be effective when using nanoarrow with a higher level runtime\nlike C++, Rust, Python, or R, all of which have mechanisms to build buffers already.\nThe C library supports this with ArrowArraySetBuffer(); however, there was no way\nto reserve and/or set variadic buffers for string view arrays. In nanoarrow 0.8.0,\nthe array builder API fully supports both mechanisms for building string view arrays.\nLZ4 Decompression Support\nThe Arrow IPC reader included in the nanoarrow C library supports most features\nof the Arrow IPC format; however, decompression support for the LZ4 codec was missing\nwhich made the library and its bindings unusable for some common use cases. In 0.8.0,\ndecompression for the LZ4 codec was added to the C library.\nUsers of the C library will need to configure CMake with -DNANOARROW_IPC_WITH_LZ4=ON\nand -DNANOARROW_IPC=ON to use CMake-resolved LZ4; however, client libraries\ncan also use an existing ZSTD or LZ4 implementation using callbacks just like in 0.7.0.\nnanoarrow on Conan\nThe nanoarrow C library can now be installed using the\nConan C/C++ Package Manager!\nCMake projects can now use find_package(nanoarrow) when using a Conan-enabled\ntoolchain after adding the nanoarrow dependency to conanfile.txt.\nThanks to @wgtmac for contributing the recipe!\nnanoarrow on Homebrew\nThe nanoarrow C library can now be installed using\nHomebrew!\n\nbrew install nanoarrow\n\n\nCMake projects can then use find_package(nanoarrow) when using Homebrew-provided\ncmake and allows other vcpkg ports to use nanoarrow as a dependency.\nThanks to @ankane for contributing the formula!\nContributors\nThis release consists of contributions from 12 contributors in addition\nto the invaluable advice and support of the Apache Arrow community.\n\n$ git shortlog -sn apache-arrow-nanoarrow-0.8.0.dev..apache-arrow-nanoarrow-0.8.0-rc0\n    23  Dewey Dunnington\n     2  Bryce Mecum\n     2  Dirk Eddelbuettel\n     1  Even Rouault\n     1  Kevin Liu\n     1  Michael Chirico\n     1  Namit Kewat\n     1  Nyall Dawson\n     1  Sutou Kouhei\n     1  William Ayd"
author: "pmc"
contentHtml: "<!--\n\n-->\n<p>The Apache Arrow team is pleased to announce the 0.8.0 release of\nApache Arrow nanoarrow. This release consists of 28 resolved GitHub issues from\n10 contributors.</p>\n<h2>Release Highlights</h2>\n<ul>\n<li>Support for building String View arrays by buffer</li>\n<li>LZ4 decompression support in IPC reader</li>\n<li>Support for Conan</li>\n<li>Support for Hombrew</li>\n</ul>\n<p>See the\n<a href=\"https://github.com/apache/arrow-nanoarrow/blob/apache-arrow-nanoarrow-0.8.0/CHANGELOG.md\">Changelog</a>\nfor a detailed list of contributions to this release.</p>\n<h2>Features</h2>\n<h3>String Views By Buffer</h3>\n<p>The C library in general supports two methods for producing or consuming arrays: most\nusers use the builder pattern (e.g., <code>ArrowArrayAppendString()</code>); however, the &quot;build\nby buffer&quot; pattern can be effective when using nanoarrow with a higher level runtime\nlike C++, Rust, Python, or R, all of which have mechanisms to build buffers already.\nThe C library supports this with <code>ArrowArraySetBuffer()</code>; however, there was no way\nto reserve and/or set variadic buffers for string view arrays. In nanoarrow 0.8.0,\nthe array builder API fully supports both mechanisms for building string view arrays.</p>\n<h3>LZ4 Decompression Support</h3>\n<p>The Arrow IPC reader included in the nanoarrow C library supports most features\nof the Arrow IPC format; however, decompression support for the LZ4 codec was missing\nwhich made the library and its bindings unusable for some common use cases. In 0.8.0,\ndecompression for the LZ4 codec was added to the C library.</p>\n<p>Users of the C library will need to configure CMake with <code>-DNANOARROW_IPC_WITH_LZ4=ON</code>\nand <code>-DNANOARROW_IPC=ON</code> to use CMake-resolved LZ4; however, client libraries\ncan also use an existing ZSTD or LZ4 implementation using callbacks just like in 0.7.0.</p>\n<h3>nanoarrow on Conan</h3>\n<p>The nanoarrow C library can now be installed using the\n<a href=\"https://conan.io/center/recipes/nanoarrow\">Conan</a> C/C++ Package Manager!\nCMake projects can now use <code>find_package(nanoarrow)</code> when using a Conan-enabled\ntoolchain after adding the nanoarrow dependency to <code>conanfile.txt</code>.</p>\n<p>Thanks to <a href=\"https://github.com/wgtmac\">@wgtmac</a> for contributing the recipe!</p>\n<h3>nanoarrow on Homebrew</h3>\n<p>The nanoarrow C library can now be installed using\n<a href=\"https://formulae.brew.sh/formula/nanoarrow\">Homebrew</a>!</p>\n<div class=\"language-shell highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code data-lang=\"shell\">brew <span class=\"nb\">install </span>nanoarrow\n</code></pre></div></div>\n<p>CMake projects can then use <code>find_package(nanoarrow)</code> when using Homebrew-provided\ncmake and allows other vcpkg ports to use nanoarrow as a dependency.</p>\n<p>Thanks to <a href=\"https://github.com/ankane\">@ankane</a> for contributing the formula!</p>\n<h2>Contributors</h2>\n<p>This release consists of contributions from 12 contributors in addition\nto the invaluable advice and support of the Apache Arrow community.</p>\n<div class=\"language-console highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code data-lang=\"console\"><span class=\"gp\">$</span><span class=\"w\"> </span>git shortlog <span class=\"nt\">-sn</span> apache-arrow-nanoarrow-0.8.0.dev..apache-arrow-nanoarrow-0.8.0-rc0\n<span class=\"go\">    23  Dewey Dunnington\n     2  Bryce Mecum\n     2  Dirk Eddelbuettel\n     1  Even Rouault\n     1  Kevin Liu\n     1  Michael Chirico\n     1  Namit Kewat\n     1  Nyall Dawson\n     1  Sutou Kouhei\n     1  William Ayd\n</span></code></pre></div></div>"
---

The Apache Arrow team is pleased to announce the 0.8.0 release of
Apache Arrow nanoarrow. This release consists of 28 resolved GitHub issues from
10 contributors.
Release Highlights
Support for building String View arrays by buffer
LZ4 decompression support in IPC reader
Support for Conan
Support for Hombrew
See the
Changelog
for a detailed list of contributions to this release.
Features
String Views By Buffer
The C library in general supports two methods for producing or consuming arrays: most
users use the builder pattern (e.g., ArrowArrayAppendString()); however, the "build
by buffer" pattern can be effective when using nanoarrow with a higher level runtime
like C++, Rust, Python, or R, all of which have mechanisms to build buffers already.
The C library supports this with ArrowArraySetBuffer(); however, there was no way
to reserve and/or set variadic buffers for string view arrays. In nanoarrow 0.8.0,
the array builder API fully supports both mechanisms for building string view arrays.
LZ4 Decompression Support
The Arrow IPC reader included in the nanoarrow C library supports most features
of the Arrow IPC format; however, decompression support for the LZ4 codec was missing
which made the library and its bindings unusable for some common use cases. In 0.8.0,
decompression for the LZ4 codec was added to the C library.
Users of the C library will need to configure CMake with -DNANOARROW_IPC_WITH_LZ4=ON
and -DNANOARROW_IPC=ON to use CMake-resolved LZ4; however, client libraries
can also use an existing ZSTD or LZ4 implementation using callbacks just like in 0.7.0.
nanoarrow on Conan
The nanoarrow C library can now be installed using the
Conan C/C++ Package Manager!
CMake projects can now use find_package(nanoarrow) when using a Conan-enabled
toolchain after adding the nanoarrow dependency to conanfile.txt.
Thanks to @wgtmac for contributing the recipe!
nanoarrow on Homebrew
The nanoarrow C library can now be installed using
Homebrew!

brew install nanoarrow


CMake projects can then use find_package(nanoarrow) when using Homebrew-provided
cmake and allows other vcpkg ports to use nanoarrow as a dependency.
Thanks to @ankane for contributing the formula!
Contributors
This release consists of contributions from 12 contributors in addition
to the invaluable advice and support of the Apache Arrow community.

$ git shortlog -sn apache-arrow-nanoarrow-0.8.0.dev..apache-arrow-nanoarrow-0.8.0-rc0
    23  Dewey Dunnington
     2  Bryce Mecum
     2  Dirk Eddelbuettel
     1  Even Rouault
     1  Kevin Liu
     1  Michael Chirico
     1  Namit Kewat
     1  Nyall Dawson
     1  Sutou Kouhei
     1  William Ayd
