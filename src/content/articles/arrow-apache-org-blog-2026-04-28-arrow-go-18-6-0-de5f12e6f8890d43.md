---
title: "Apache Arrow Go 18.6.0 Release"
link: "https://arrow.apache.org/blog/2026/04/28/arrow-go-18.6.0/"
guid: "https://arrow.apache.org/blog/2026/04/28/arrow-go-18.6.0/"
pubDate: "2026-04-28T04:00:00.000Z"
site_name: "Apache Arrow"
site_feed: "https://arrow.apache.org/feed.xml"
category: "Data"
summary: "The Apache Arrow team is pleased to announce the v18.6.0 release of Apache Arrow Go.\nThis minor release covers 46 commits from 16 distinct contributors.\nContributors\n\n$ git shortlog -sn v18.5.2..v18.6.0\n    25\tMatt Topol\n     6\tSebastiaan van Stijn\n     2\tDima Kuznetsov\n     2\tWillem Jan\n     1\tAlex\n     1\tAlex Normand\n     1\tAndrei Tserakhau\n     1\tBen Bellick\n     1\tDavid Li\n     1\tHarrison Crosse\n     1\tKaren Li\n     1\tLucas Valente\n     1\tjunyan-ling\n     1\tstarpact\n     1\twjywbs\n     1\twwarner-inf\n\n\nHighlights\nArrow\nFeatures\ncompute package now has Sorting functions #749\nBrand new array/arreflect package for round-trip reflection between Arrow and Go types/structs #771\nBug Fixes\nRoute QueryContext for flightsql through active transactions #692\nCorrectly set nullbility for Avro list type #709\nFix data race and memory leak in is_in kernel #712\nFix cdata handling colons in values #761\nPerformance Improvements\nImproved take kernel performance (20-30% gains for 99% of cases) #702\nOptimize the ARM64 NEON min/max assembly #748\nParquet\nBug Fixes\nFixed Decimal256 sign extension #711\nStrip the repetition_type from the root SchemaElement during serialization #723\nNormalized the element name in stored ARROW:schema #746\nPerformance Improvements\nAvoid double bool bitmap conversion #707\nImprove zstd pool memory usage (14x less memory!) #717\nOptimized stats and bloom filters for boolean columns (76% less memory, more than twice as fast) #715\nVectorized bool unpack (~4x throughput) #735, #731\nEliminated per-value allocation in delta bit-pack decoder (>4x faster decoding) #730\nNew Contributors\n@junyan-ling made their first contribution in #689\n@wjywbs made their first contribution in #692\n@dimakuz made their first contribution in #711\n@starpact made their first contribution in #708\n@laskoviymishka made their first contribution in #712\n@hcrosse made their first contribution in #723\n@wwarner-inf made their first contribution in #726\n@alexandre-normand made their first contribution in #728\n@benbellick made their first contribution in #754\n@thaJeztah made their first contribution in #762\n@kli19 made their first contribution in #757\n@serramatutu made their first contribution in #758\nFull Changelog: https://github.com/apache/arrow-go/compare/v18.5.2...v18.6.0"
author: "pmc"
contentHtml: "<!--\n\n-->\n<p>The Apache Arrow team is pleased to announce the v18.6.0 release of Apache Arrow Go.\nThis minor release covers 46 commits from 16 distinct contributors.</p>\n<h2>Contributors</h2>\n<div class=\"language-console highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code data-lang=\"console\"><span class=\"gp\">$</span><span class=\"w\"> </span>git shortlog <span class=\"nt\">-sn</span> v18.5.2..v18.6.0\n<span class=\"go\">    25\tMatt Topol\n     6\tSebastiaan van Stijn\n     2\tDima Kuznetsov\n     2\tWillem Jan\n     1\tAlex\n     1\tAlex Normand\n     1\tAndrei Tserakhau\n     1\tBen Bellick\n     1\tDavid Li\n     1\tHarrison Crosse\n     1\tKaren Li\n     1\tLucas Valente\n     1\tjunyan-ling\n     1\tstarpact\n     1\twjywbs\n     1\twwarner-inf\n</span></code></pre></div></div>\n<h2>Highlights</h2>\n<h3>Arrow</h3>\n<h4>Features</h4>\n<ul>\n<li>compute package now has Sorting functions <a href=\"https://github.com/apache/arrow-go/pull/749\">#749</a></li>\n<li>Brand new <code>array/arreflect</code> package for round-trip reflection between Arrow and Go types/structs <a href=\"https://github.com/apache/arrow-go/pull/771\">#771</a></li>\n</ul>\n<h4>Bug Fixes</h4>\n<ul>\n<li>Route QueryContext for flightsql through active transactions <a href=\"https://github.com/apache/arrow-go/pull/692\">#692</a></li>\n<li>Correctly set nullbility for Avro list type <a href=\"https://github.com/apache/arrow-go/pull/709\">#709</a></li>\n<li>Fix data race and memory leak in is_in kernel <a href=\"https://github.com/apache/arrow-go/pull/712\">#712</a></li>\n<li>Fix cdata handling colons in values <a href=\"https://github.com/apache/arrow-go/pull/761\">#761</a></li>\n</ul>\n<h4>Performance Improvements</h4>\n<ul>\n<li>Improved take kernel performance (20-30% gains for 99% of cases) <a href=\"https://github.com/apache/arrow-go/pull/702\">#702</a></li>\n<li>Optimize the ARM64 NEON min/max assembly <a href=\"https://github.com/apache/arrow-go/pull/748\">#748</a></li>\n</ul>\n<h3>Parquet</h3>\n<h4>Bug Fixes</h4>\n<ul>\n<li>Fixed Decimal256 sign extension <a href=\"https://github.com/apache/arrow-go/pull/711\">#711</a></li>\n<li>Strip the repetition_type from the root SchemaElement during serialization <a href=\"https://github.com/apache/arrow-go/pull/723\">#723</a></li>\n<li>Normalized the element name in stored ARROW:schema <a href=\"https://github.com/apache/arrow-go/pull/746\">#746</a></li>\n</ul>\n<h4>Performance Improvements</h4>\n<ul>\n<li>Avoid double bool bitmap conversion <a href=\"https://github.com/apache/arrow-go/pull/707\">#707</a></li>\n<li>Improve zstd pool memory usage (14x less memory!) <a href=\"https://github.com/apache/arrow-go/pull/717\">#717</a></li>\n<li>Optimized stats and bloom filters for boolean columns (76% less memory, more than twice as fast) <a href=\"https://github.com/apache/arrow-go/pull/715\">#715</a></li>\n<li>Vectorized bool unpack (~4x throughput) <a href=\"https://github.com/apache/arrow-go/pull/735\">#735</a>, <a href=\"https://github.com/apache/arrow-go/pull/731\">#731</a></li>\n<li>Eliminated per-value allocation in delta bit-pack decoder (&gt;4x faster decoding) <a href=\"https://github.com/apache/arrow-go/pull/730\">#730</a></li>\n</ul>\n<h3>New Contributors</h3>\n<ul>\n<li>@junyan-ling made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/689\">#689</a></li>\n<li>@wjywbs made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/692\">#692</a></li>\n<li>@dimakuz made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/711\">#711</a></li>\n<li>@starpact made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/708\">#708</a></li>\n<li>@laskoviymishka made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/712\">#712</a></li>\n<li>@hcrosse made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/723\">#723</a></li>\n<li>@wwarner-inf made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/726\">#726</a></li>\n<li>@alexandre-normand made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/728\">#728</a></li>\n<li>@benbellick made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/754\">#754</a></li>\n<li>@thaJeztah made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/762\">#762</a></li>\n<li>@kli19 made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/757\">#757</a></li>\n<li>@serramatutu made their first contribution in <a href=\"https://github.com/apache/arrow-go/pull/758\">#758</a></li>\n</ul>\n<p><strong>Full Changelog</strong>: <a href=\"https://github.com/apache/arrow-go/compare/v18.5.2...v18.6.0\">https://github.com/apache/arrow-go/compare/v18.5.2...v18.6.0</a></p>"
---

The Apache Arrow team is pleased to announce the v18.6.0 release of Apache Arrow Go.
This minor release covers 46 commits from 16 distinct contributors.
Contributors

$ git shortlog -sn v18.5.2..v18.6.0
    25	Matt Topol
     6	Sebastiaan van Stijn
     2	Dima Kuznetsov
     2	Willem Jan
     1	Alex
     1	Alex Normand
     1	Andrei Tserakhau
     1	Ben Bellick
     1	David Li
     1	Harrison Crosse
     1	Karen Li
     1	Lucas Valente
     1	junyan-ling
     1	starpact
     1	wjywbs
     1	wwarner-inf


Highlights
Arrow
Features
compute package now has Sorting functions #749
Brand new array/arreflect package for round-trip reflection between Arrow and Go types/structs #771
Bug Fixes
Route QueryContext for flightsql through active transactions #692
Correctly set nullbility for Avro list type #709
Fix data race and memory leak in is_in kernel #712
Fix cdata handling colons in values #761
Performance Improvements
Improved take kernel performance (20-30% gains for 99% of cases) #702
Optimize the ARM64 NEON min/max assembly #748
Parquet
Bug Fixes
Fixed Decimal256 sign extension #711
Strip the repetition_type from the root SchemaElement during serialization #723
Normalized the element name in stored ARROW:schema #746
Performance Improvements
Avoid double bool bitmap conversion #707
Improve zstd pool memory usage (14x less memory!) #717
Optimized stats and bloom filters for boolean columns (76% less memory, more than twice as fast) #715
Vectorized bool unpack (~4x throughput) #735, #731
Eliminated per-value allocation in delta bit-pack decoder (>4x faster decoding) #730
New Contributors
@junyan-ling made their first contribution in #689
@wjywbs made their first contribution in #692
@dimakuz made their first contribution in #711
@starpact made their first contribution in #708
@laskoviymishka made their first contribution in #712
@hcrosse made their first contribution in #723
@wwarner-inf made their first contribution in #726
@alexandre-normand made their first contribution in #728
@benbellick made their first contribution in #754
@thaJeztah made their first contribution in #762
@kli19 made their first contribution in #757
@serramatutu made their first contribution in #758
Full Changelog: https://github.com/apache/arrow-go/compare/v18.5.2...v18.6.0
