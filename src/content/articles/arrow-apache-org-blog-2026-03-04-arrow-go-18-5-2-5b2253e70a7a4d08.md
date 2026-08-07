---
title: "Apache Arrow Go 18.5.2 Release"
link: "https://arrow.apache.org/blog/2026/03/04/arrow-go-18.5.2/"
guid: "https://arrow.apache.org/blog/2026/03/04/arrow-go-18.5.2/"
pubDate: "2026-03-04T05:00:00.000Z"
site_name: "Apache Arrow"
site_feed: "https://arrow.apache.org/feed.xml"
category: "Data"
summary: "The Apache Arrow team is pleased to announce the v18.5.2 release of Apache Arrow Go.\nThis patch release covers 16 commits from 6 distinct contributors.\nContributors\n\n$ git shortlog -sn v18.5.1..v18.5.2\n    11\tMatt Topol\n     2\tdaniel-adam-tfs\n     1\tEvan Todd\n     1\tRusty Conover\n     1\tStas Spiridonov\n     1\tWilliam\n\n\nChangelog\nWhat's Changed\nchore: bump parquet-testing submodule by @zeroshade in #633\nfix(arrow/array): handle empty binary values correctly in BinaryBuilder by @zeroshade in #634\ntest(arrow/array): add test to binary builder by @zeroshade in #636\nfix(parquet): decryption of V2 data pages by @daniel-adam-tfs in #596\nperf(arrow): Reduce the amount of allocated objects by @spiridonov in #645\nfix(parquet/file): regression with decompressing data by @zeroshade in #652\nfix(arrow/compute): take on record/array with nested struct by @zeroshade in #653\nfix(parquet/file): write large string values by @zeroshade in #655\nci: ensure extra GC cycle for flaky tests by @zeroshade in #661\nfix(arrow/array): handle exponent notation for unmarshal int by @zeroshade in #662\nfix(flight/flightsql/driver): fix time.Time params by @etodd in #666\nfix(parquet): bss encoding and tests on big endian systems by @daniel-adam-tfs in #663\nfix(parquet/pqarrow): selective column reading of complex map column by @zeroshade in #668\nfeat(arrow/ipc): support custom_metadata on RecordBatch messages by @rustyconover in #669\nfeat: Support setting IPC options in FlightSQL call options by @peasee in #674\nchore(dev/release): embed hash of source tarball into email by @zeroshade in #675\nchore(arrow): bump PkgVersion to 18.5.2 by @zeroshade in #676\nNew Contributors\n@spiridonov made their first contribution in #645\n@etodd made their first contribution in #666\n@rustyconover made their first contribution in #669\n@peasee made their first contribution in #674\nFull Changelog: https://github.com/apache/arrow-go/compare/v18.5.1...v18.5.2"
author: "pmc"
contentHtml: "<!--\n\n-->\n<p>The Apache Arrow team is pleased to announce the v18.5.2 release of Apache Arrow Go.\nThis patch release covers 16 commits from 6 distinct contributors.</p>\n<h2>Contributors</h2>\n<div class=\"language-console highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code data-lang=\"console\"><span class=\"gp\">$</span><span class=\"w\"> </span>git shortlog <span class=\"nt\">-sn</span> v18.5.1..v18.5.2\n<span class=\"go\">    11\tMatt Topol\n     2\tdaniel-adam-tfs\n     1\tEvan Todd\n     1\tRusty Conover\n     1\tStas Spiridonov\n     1\tWilliam\n</span></code></pre></div></div>\n<h2>Changelog</h2>\n<h3>What's Changed</h3>\n<ul>\n<li>chore: bump parquet-testing submodule by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/633\">#633</a></li>\n<li>fix(arrow/array): handle empty binary values correctly in BinaryBuilder by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/634\">#634</a></li>\n<li>test(arrow/array): add test to binary builder by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/636\">#636</a></li>\n<li>fix(parquet): decryption of V2 data pages by @daniel-adam-tfs in <a href=\"https://github.com/apache/arrow-go/pull/596\">#596</a></li>\n<li>perf(arrow): Reduce the amount of allocated objects by @spiridonov in <a href=\"https://github.com/apache/arrow-go/pull/645\">#645</a></li>\n<li>fix(parquet/file): regression with decompressing data by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/652\">#652</a></li>\n<li>fix(arrow/compute): take on record/array with nested struct by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/653\">#653</a></li>\n<li>fix(parquet/file): write large string values by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/655\">#655</a></li>\n<li>ci: ensure extra GC cycle for flaky tests by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/661\">#661</a></li>\n<li>fix(arrow/array): handle exponent notation for unmarshal int by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/662\">#662</a></li>\n<li>fix(flight/flightsql/driver): fix <code>time.Time</code> params by @etodd in <a href=\"https://github.com/apache/arrow-go/pull/666\">#666</a></li>\n<li>fix(parquet): bss encoding and tests on big endian systems by @daniel-adam-tfs in <a href=\"https://github.com/apache/arrow-go/pull/663\">#663</a></li>\n<li>fix(parquet/pqarrow): selective column reading of complex map column by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/668\">#668</a></li>\n<li>feat(arrow/ipc): support custom_metadata on RecordBatch messages by @rustyconover in <a href=\"https://github.com/apache/arrow-go/pull/669\">#669</a></li>\n<li>feat: Support setting IPC options in FlightSQL call options by @peasee in <a href=\"https://github.com/apache/arrow-go/pull/674\">#674</a></li>\n<li>chore(dev/release): embed hash of source tarball into email by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/675\">#675</a></li>\n<li>chore(arrow): bump PkgVersion to 18.5.2 by @zeroshade in <a href=\"https://github.com/apache/arrow-go/pull/676\">#676</a></li>\n</ul>\n<h3>New Contributors</h3>\n<ul>\n<li>@spiridonov made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/645\">#645</a></li>\n<li>@etodd made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/666\">#666</a></li>\n<li>@rustyconover made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/669\">#669</a></li>\n<li>@peasee made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/674\">#674</a></li>\n</ul>\n<p><strong>Full Changelog</strong>: <a href=\"https://github.com/apache/arrow-go/compare/v18.5.1...v18.5.2\">https://github.com/apache/arrow-go/compare/v18.5.1...v18.5.2</a></p>"
---

The Apache Arrow team is pleased to announce the v18.5.2 release of Apache Arrow Go.
This patch release covers 16 commits from 6 distinct contributors.
Contributors

$ git shortlog -sn v18.5.1..v18.5.2
    11	Matt Topol
     2	daniel-adam-tfs
     1	Evan Todd
     1	Rusty Conover
     1	Stas Spiridonov
     1	William


Changelog
What's Changed
chore: bump parquet-testing submodule by @zeroshade in #633
fix(arrow/array): handle empty binary values correctly in BinaryBuilder by @zeroshade in #634
test(arrow/array): add test to binary builder by @zeroshade in #636
fix(parquet): decryption of V2 data pages by @daniel-adam-tfs in #596
perf(arrow): Reduce the amount of allocated objects by @spiridonov in #645
fix(parquet/file): regression with decompressing data by @zeroshade in #652
fix(arrow/compute): take on record/array with nested struct by @zeroshade in #653
fix(parquet/file): write large string values by @zeroshade in #655
ci: ensure extra GC cycle for flaky tests by @zeroshade in #661
fix(arrow/array): handle exponent notation for unmarshal int by @zeroshade in #662
fix(flight/flightsql/driver): fix time.Time params by @etodd in #666
fix(parquet): bss encoding and tests on big endian systems by @daniel-adam-tfs in #663
fix(parquet/pqarrow): selective column reading of complex map column by @zeroshade in #668
feat(arrow/ipc): support custom_metadata on RecordBatch messages by @rustyconover in #669
feat: Support setting IPC options in FlightSQL call options by @peasee in #674
chore(dev/release): embed hash of source tarball into email by @zeroshade in #675
chore(arrow): bump PkgVersion to 18.5.2 by @zeroshade in #676
New Contributors
@spiridonov made their first contribution in #645
@etodd made their first contribution in #666
@rustyconover made their first contribution in #669
@peasee made their first contribution in #674
Full Changelog: https://github.com/apache/arrow-go/compare/v18.5.1...v18.5.2
