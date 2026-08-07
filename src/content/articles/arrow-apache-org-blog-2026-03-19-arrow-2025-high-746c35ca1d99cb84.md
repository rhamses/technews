---
title: "Community Highlights 2025"
link: "https://arrow.apache.org/blog/2026/03/19/arrow-2025-highlights/"
guid: "https://arrow.apache.org/blog/2026/03/19/arrow-2025-highlights/"
pubDate: "2026-03-19T04:00:00.000Z"
site_name: "Apache Arrow"
site_feed: "https://arrow.apache.org/feed.xml"
category: "Data"
summary: "As you may have read in a previous blog post 1, the Apache Arrow project\nrecently turned 10 years old. We are grateful to everyone who helped us\nachieve this milestone, and we wanted to celebrate the community's\naccomplishments, by publishing our community highlights from 2025.\nWe were inspired by the research by Dr Cat Hicks et al 2, who found\nthat concrete evidence of progress and accomplishments is instrumental\nto motivation and collaboration in developer teams. We think the same\nshould hold for open source.\nNew contributors\nIt has been great to see many new contributors joining the project\nin the past year, with over 300 such individuals observed across the main\nApache Arrow language implementations.\nNumber of new contributors per repository.\n  \n    \nRepository/Implementation\n      Number of new contributors\n    \narrow\n      125\n    \narrow-rs\n      132\n    \narrow-java\n      28\n    \narrow-go\n      35\n    \nWorth highlighting is alinaliBQ who\nhas been very active on the C++ Flight SQL ODBC Driver work together\nwith justing-bq.\nAntoinePrv has done a huge amount of\nwork on the C++ Parquet implementation and andishgar\nin the C++ Statistics area.\nrmnskb got involved with PyArrow in\nEuroPython sprints and has contributed multiple PRs since then. On the\nsame event paddyroddy also started with\nhis first contribution and helped on the Python packaging side further on.\nsdf-jkl, liamzwbao,\nfriendlymatthew, and\nklion26 helped drive early Variant\nfunctionality in the Rust Parquet implementation and contributed a number\nof follow-up improvements.\njecsand838 drove major improvements to the\nRust arrow-avro crate, work highlighted in the\nIntroducing Arrow Avro\nblog post.\nNotable New Contributors in apache/arrow for 2025.\n  \n    \nAuthor\n      Number of prs\n      Number of line changes (+ and -)\n    \nalinaliBQ\n      36\n      15754\n    \nandishgar\n      19\n      2926\n    \nAntoinePrv\n      8\n      79257\n    \nrmnskb\n      7\n      550\n    \njusting-bq\n      4\n      12607\n    \nNotable New Contributors in apache/arrow-rs for 2025.\n  \n    \nAuthor\n      Number of prs\n      Number of line changes (+ and -)\n    \nscovich\n      50\n      21006\n    \njecsand838\n      38\n      26753\n    \nfriendlymatthew\n      33\n      7203\n    \nsdf-jkl\n      4\n      388\n    \nrambleraptor\n      4\n      333\n    \nNotable New Contributors in apache/arrow-go for 2025.\n  \n    \nAuthor\n      Number of prs\n      Number of line changes (+ and -)\n    \nMandukhai-Alimaa\n      6\n      1392\n    \nhamilton-earthscope\n      5\n      2998\n    \nRelease, Packaging and CI\nA lot of work has been done around the Continuous Integration and\nDeveloper Tools area. Ensuring a project with the reach of Arrow is properly working\nrequires validation on a huge matrix of operating systems, architectures, libraries,\nversions. Needless to say that maintenance work has tremendous importance for the\nhealth of the project and the positive contributor experience.\nThe most active contributors in the main repository are the ones contributing\nheavily on those areas while also providing the most review capacity. Shout out\nto kou and raulcd for\ntaking such good care of the project and devoting countless hours so that everything\nruns smoothly.\nNotable contributions worth mentioning are enhanced release automation and\nreproducible builds for sources, migrating remaining AppVeyor and Azure jobs\nto GitHub actions, improving dev experience with more pre-commit checks instead\nof custom made linting tools.\nMoving some implementations out of the main repository (apache/arrow on GitHub)\nhelped with easier releases and maintenance of the main repository and also of\nseparate language implementations. The current apache/arrow repo now holds the format\nspecification, C++ implementation together with all the bindings to it (Python, R, Ruby\nand C GLib). Other languages now live in their own apache/ repos namely\napache/arrow-java,\napache/arrow-js,\napache/arrow-rs,\napache/arrow-go,\napache/arrow-nanoarrow,\napache/arrow-dotnet and\napache/arrow-swift.\nNotable Contributors in apache/arrow for 2025.\n  \n    \nAuthor\n      Number of prs\n      Number of line changes (+ and -)\n    \nkou\n      221\n      141015\n    \nAntoinePrv\n      8\n      79257\n    \nraulcd\n      110\n      46645\n    \npitrou\n      101\n      36585\n    \njbonofre\n      1\n      20061\n    \nNotable Components in apache/arrow for 2025.\n  \n    \nComponent label\n      Number of merged prs\n      Number of line changes (+ and -)\n    \nParquet\n      100\n      103828\n    \nC++\n      387\n      82744\n    \nFlightRPC\n      43\n      52659\n    \nCI\n      237\n      42249\n    \nRuby\n      74\n      20676\n    \nMigration of infrastructure from Voltron Data\nAs Voltron Data has wound down its operations in 2025, the Arrow project\nhad to migrate benchmarking infrastructure and nightly report from\nVoltron-managed services to an Arrow-managed AWS account. This work has been\ndriven by rok.\nClosing of Stale issues\nthisisnic was working on closing of stale\nissues in the apache/arrow repository which helped surfacing important\nissues that were overlooked or forgotten.\nCode contributions\nC++ implementation\nCommunity support for maintenance and development of the Acero C++\nis continuing with multiple bigger contributions in 2025 done by\npitrou and zanmato1984.\nMany kernels have been moved from the integrated compute module into\na separate, optional package for improvement of modularity and distribution\nsize when optional compute functionality is not being used. The work has\nbeen done by raulcd.\nArrow C++ Parquet implementation\nThere have been multiple contributions to fix and improve fuzzing\nsupport for Parquet. Fuzzing work is led by pitrou\nwho is also one of the most active members of the community guiding other\ndevelopers and supporting us with abundant review capacity.\nMultiple newer types have also been supported in the last year,\nnamely: VARIANT, UUID, GEOMETRY and GEOGRAPHY contributed\nby neilechao and\npaleolimbot.\nAn important feature added has also been Content-Defined Chunking\nwhich improves deduplication of Parquet files with mostly identical\ncontents, by choosing data page boundaries based on actual contents\nrather than a number of values 3. This work has been done by\nkszucs.\nThere have been improvements in the Parquet encryption support for\nmost of the releases in the last year. These efforts have been\ndriven mostly by EnricoMi,\npitrou, adamreeve\nand kapoisu.\nPyArrow\nA lot of work has been put into adding type annotations. It all\nstarted in July at EuroPython sprints and the code is now ready to be\nreviewed and merged. Some more review capacity will be needed to get\nthis over the finish line. The work has been championed by\nrok.\nRust\nArrow Rust community invested heavily in the Rust parquet reader for\nwhich they created several blog posts 4, 5. The work has been\nchampioned by alamb and\netseidl.\nNotable Components in apache/arrow-rs for 2025.\n  \n    \ncomponent\n      merged_prs\n      line_changes\n    \nparquet\n      333\n      140958\n    \narrow\n      436\n      76590\n    \nparquet-variant\n      125\n      41832\n    \napi-change\n      59\n      33938\n    \narrow-avro\n      48\n      29487\n    \nJava\nThe biggest changes in apache/arrow-java for 2025 have been connected\nto Flight and Avro components plus Sphinx support due to the Java\nimplementation being moved into a separate Apache repository.\nContributors involved in the above are lidavidm\nand martin-traverse.\nGo\nThere has been a lot of work related to new variant type in the\nParquet implementation done in apache/arrow-go all by\nzeroshade.\nNoticeable emphasis was also visible on performance-focused PRs leading to\nthe addition of row seeking, bloom filter reading/writing, and reduction of\nallocations in the Parquet library along with significant optimization work\nin the compute.Take kernels. Shout out to pixelherodev\nand hamilton-earthscope for the\nemphasis they placed on improving performance.\nNotable Components in apache/arrow-go for 2025.\n  \n    \ncomponent\n      merged_prs\n      line_changes\n    \nparquet\n      34\n      27056\n    \narrow\n      33\n      14235\n    \nNanoarrow\nBigger work in nanoarrow include Decimal32/64 and ListView/LargeListView support,\nLZ4 and ZSTD decompression in the IPC reader, and broader packaging via Conan, Homebrew,\nand vcpkg. Contributors driving most above are paleolimbot\nand WillAyd.\nArrow Summit 25\nOne last thing to highlight would be our first Arrow Summit 25 that\nwas held in Paris in October 2025. The event was a great success and\nit brought users, contributors and maintainers together. It\ndefinitely was a highlight of the year for many of us. Thanks to\nraulcd and pitrou\nfor organizing the event.\nThank you!\nWe would like to thank every single contributor to Apache Arrow for\nbeing a part of this great community and project! Hope this blog\npost helps to validate all the work you have done and motivates us\nto continue collaborating and growing together!\nThe Notebooks with the analysis for this blog post can be found\nin 6.\nNote not all language implementations are mentioned. Some due to being\nmoved into a separate repository in 2025 resulting in missing information\nfor large amount of merged pull requests. Others due to having lower\nnumber of bigger contributions in the past year.\nApache Arrow is 10 years old 🎉 ↩\nDeveloper Thriving: Four Sociocognitive Factors That Create Resilient Productivity on Software Teams ↩\nParquet Content-Defined Chunking ↩\nA Practical Dive Into Late Materialization in arrow-rs Parquet Reads ↩\n3x-9x Faster Apache Parquet Footer Metadata Using a Custom Thrift Parser in Rust ↩\narrow-maintenance/explorations ↩"
author: "pmc"
contentHtml: "<!--\n\n-->\n<p>As you may have read in a previous blog post <sup class=\"footnote-ref\"><a href=\"#fn1\" id=\"fnref1\">1</a></sup>, the Apache Arrow project\nrecently turned 10 years old. We are grateful to everyone who helped us\nachieve this milestone, and we wanted to celebrate the community's\naccomplishments, by publishing our community highlights from 2025.</p>\n<p>We were inspired by the research by Dr Cat Hicks et al <sup class=\"footnote-ref\"><a href=\"#fn2\" id=\"fnref2\">2</a></sup>, who found\nthat concrete evidence of progress and accomplishments is instrumental\nto motivation and collaboration in developer teams. We think the same\nshould hold for open source.</p>\n<hr />\n<h2>New contributors</h2>\n<p>It has been great to see many new contributors joining the project\nin the past year, with over 300 such individuals observed across the main\nApache Arrow language implementations.</p>\n<table class=\"table\">\n  <caption>Number of new contributors per repository.</caption>\n  <thead style=\"background-color: #e9ecef\">\n    <tr>\n      <th>Repository/Implementation</th>\n      <th>Number of new contributors</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>arrow</td>\n      <td>125</td>\n    </tr>\n    <tr>\n      <td>arrow-rs</td>\n      <td>132</td>\n    </tr>\n    <tr>\n      <td>arrow-java</td>\n      <td>28</td>\n    </tr>\n    <tr>\n      <td>arrow-go</td>\n      <td>35</td>\n    </tr>\n  </tbody>\n</table>\n<p>Worth highlighting is <a href=\"https://github.com/alinaliBQ\">alinaliBQ</a> who\nhas been very active on the C++ Flight SQL ODBC Driver work together\nwith <a href=\"https://github.com/justing-bq\">justing-bq</a>.</p>\n<p><a href=\"https://github.com/AntoinePrv\">AntoinePrv</a> has done a huge amount of\nwork on the C++ Parquet implementation and <a href=\"https://github.com/andishgar\">andishgar</a>\nin the C++ Statistics area.</p>\n<p><a href=\"https://github.com/rmnskb\">rmnskb</a> got involved with PyArrow in\nEuroPython sprints and has contributed multiple PRs since then. On the\nsame event <a href=\"https://github.com/paddyroddy\">paddyroddy</a> also started with\nhis first contribution and helped on the Python packaging side further on.</p>\n<p><a href=\"https://github.com/sdf-jkl\">sdf-jkl</a>, <a href=\"https://github.com/liamzwbao\">liamzwbao</a>,\n<a href=\"https://github.com/friendlymatthew\">friendlymatthew</a>, and\n<a href=\"https://github.com/klion26\">klion26</a> helped drive early Variant\nfunctionality in the Rust Parquet implementation and contributed a number\nof follow-up improvements.</p>\n<p><a href=\"https://github.com/jecsand838\">jecsand838</a> drove major improvements to the\nRust <code>arrow-avro</code> crate, work highlighted in the\n<a href=\"https://arrow.apache.org/blog/2025/10/23/introducing-arrow-avro/\">Introducing Arrow Avro</a>\nblog post.</p>\n<table class=\"table\">\n  <caption>Notable New Contributors in apache/arrow for 2025.</caption>\n  <thead style=\"background-color: #e9ecef\">\n    <tr>\n      <th>Author</th>\n      <th>Number of prs</th>\n      <th>Number of line changes (+ and -)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>alinaliBQ</td>\n      <td>36</td>\n      <td>15754</td>\n    </tr>\n    <tr>\n      <td>andishgar</td>\n      <td>19</td>\n      <td>2926</td>\n    </tr>\n    <tr>\n      <td>AntoinePrv</td>\n      <td>8</td>\n      <td>79257</td>\n    </tr>\n    <tr>\n      <td>rmnskb</td>\n      <td>7</td>\n      <td>550</td>\n    </tr>\n    <tr>\n      <td>justing-bq</td>\n      <td>4</td>\n      <td>12607</td>\n    </tr>\n  </tbody>\n</table>\n<table class=\"table\">\n  <caption>Notable New Contributors in apache/arrow-rs for 2025.</caption>\n  <thead style=\"background-color: #e9ecef\">\n    <tr>\n      <th>Author</th>\n      <th>Number of prs</th>\n      <th>Number of line changes (+ and -)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>scovich</td>\n      <td>50</td>\n      <td>21006</td>\n    </tr>\n    <tr>\n      <td>jecsand838</td>\n      <td>38</td>\n      <td>26753</td>\n    </tr>\n    <tr>\n      <td>friendlymatthew</td>\n      <td>33</td>\n      <td>7203</td>\n    </tr>\n    <tr>\n      <td>sdf-jkl</td>\n      <td>4</td>\n      <td>388</td>\n    </tr>\n    <tr>\n      <td>rambleraptor</td>\n      <td>4</td>\n      <td>333</td>\n    </tr>\n  </tbody>\n</table>\n<table class=\"table\">\n  <caption>Notable New Contributors in apache/arrow-go for 2025.</caption>\n  <thead style=\"background-color: #e9ecef\">\n    <tr>\n      <th>Author</th>\n      <th>Number of prs</th>\n      <th>Number of line changes (+ and -)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Mandukhai-Alimaa</td>\n      <td>6</td>\n      <td>1392</td>\n    </tr>\n    <tr>\n      <td>hamilton-earthscope</td>\n      <td>5</td>\n      <td>2998</td>\n    </tr>\n  </tbody>\n</table>\n<h2>Release, Packaging and CI</h2>\n<p>A lot of work has been done around the Continuous Integration and\nDeveloper Tools area. Ensuring a project with the reach of Arrow is properly working\nrequires validation on a huge matrix of operating systems, architectures, libraries,\nversions. Needless to say that maintenance work has tremendous importance for the\nhealth of the project and the positive contributor experience.</p>\n<p>The most active contributors in the main repository are the ones contributing\nheavily on those areas while also providing the most review capacity. Shout out\nto <a href=\"https://github.com/kou\">kou</a> and <a href=\"https://github.com/raulcd\">raulcd</a> for\ntaking such good care of the project and devoting countless hours so that everything\nruns smoothly.</p>\n<p>Notable contributions worth mentioning are enhanced release automation and\nreproducible builds for sources, migrating remaining AppVeyor and Azure jobs\nto GitHub actions, improving dev experience with more pre-commit checks instead\nof custom made linting tools.</p>\n<p>Moving some implementations out of the main repository (apache/arrow on GitHub)\nhelped with easier releases and maintenance of the main repository and also of\nseparate language implementations. The current apache/arrow repo now holds the format\nspecification, C++ implementation together with all the bindings to it (Python, R, Ruby\nand C GLib). Other languages now live in their own apache/ repos namely\n<a href=\"https://github.com/apache/arrow-java\">apache/arrow-java</a>,\n<a href=\"https://github.com/apache/arrow-js\">apache/arrow-js</a>,\n<a href=\"https://github.com/apache/arrow-rs\">apache/arrow-rs</a>,\n<a href=\"https://github.com/apache/arrow-go\">apache/arrow-go</a>,\n<a href=\"https://github.com/apache/arrow-nanoarrow\">apache/arrow-nanoarrow</a>,\n<a href=\"https://github.com/apache/arrow-dotnet\">apache/arrow-dotnet</a> and\n<a href=\"https://github.com/apache/arrow-swift\">apache/arrow-swift</a>.</p>\n<table class=\"table\">\n  <caption>Notable Contributors in apache/arrow for 2025.</caption>\n  <thead style=\"background-color: #e9ecef\">\n    <tr>\n      <th>Author</th>\n      <th>Number of prs</th>\n      <th>Number of line changes (+ and -)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>kou</td>\n      <td>221</td>\n      <td>141015</td>\n    </tr>\n    <tr>\n      <td>AntoinePrv</td>\n      <td>8</td>\n      <td>79257</td>\n    </tr>\n    <tr>\n      <td>raulcd</td>\n      <td>110</td>\n      <td>46645</td>\n    </tr>\n    <tr>\n      <td>pitrou</td>\n      <td>101</td>\n      <td>36585</td>\n    </tr>\n    <tr>\n      <td>jbonofre</td>\n      <td>1</td>\n      <td>20061</td>\n    </tr>\n  </tbody>\n</table>\n<table class=\"table\">\n  <caption>Notable Components in apache/arrow for 2025.</caption>\n  <thead style=\"background-color: #e9ecef\">\n    <tr>\n      <th>Component label</th>\n      <th>Number of merged prs</th>\n      <th>Number of line changes (+ and -)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Parquet</td>\n      <td>100</td>\n      <td>103828</td>\n    </tr>\n    <tr>\n      <td>C++</td>\n      <td>387</td>\n      <td>82744</td>\n    </tr>\n    <tr>\n      <td>FlightRPC</td>\n      <td>43</td>\n      <td>52659</td>\n    </tr>\n    <tr>\n      <td>CI</td>\n      <td>237</td>\n      <td>42249</td>\n    </tr>\n    <tr>\n      <td>Ruby</td>\n      <td>74</td>\n      <td>20676</td>\n    </tr>\n  </tbody>\n</table>\n<h2>Migration of infrastructure from Voltron Data</h2>\n<p>As Voltron Data has wound down its operations in 2025, the Arrow project\nhad to migrate benchmarking infrastructure and nightly report from\nVoltron-managed services to an Arrow-managed AWS account. This work has been\ndriven by <a href=\"https://github.com/rok\">rok</a>.</p>\n<h2>Closing of Stale issues</h2>\n<p><a href=\"https://github.com/thisisnic\">thisisnic</a> was working on closing of stale\nissues in the apache/arrow repository which helped surfacing important\nissues that were overlooked or forgotten.</p>\n<h2>Code contributions</h2>\n<h3>C++ implementation</h3>\n<p>Community support for maintenance and development of the Acero C++\nis continuing with multiple bigger contributions in 2025 done by\n<a href=\"https://github.com/pitrou\">pitrou</a> and <a href=\"https://github.com/zanmato1984\">zanmato1984</a>.</p>\n<p>Many kernels have been moved from the integrated compute module into\na separate, optional package for improvement of modularity and distribution\nsize when optional compute functionality is not being used. The work has\nbeen done by <a href=\"https://github.com/raulcd\">raulcd</a>.</p>\n<h3>Arrow C++ Parquet implementation</h3>\n<p>There have been multiple contributions to fix and improve fuzzing\nsupport for Parquet. Fuzzing work is led by <a href=\"https://github.com/pitrou\">pitrou</a>\nwho is also one of the most active members of the community guiding other\ndevelopers and supporting us with abundant review capacity.</p>\n<p>Multiple newer types have also been supported in the last year,\nnamely: VARIANT, UUID, GEOMETRY and GEOGRAPHY contributed\nby <a href=\"https://github.com/neilechao\">neilechao</a> and\n<a href=\"https://github.com/paleolimbot\">paleolimbot</a>.</p>\n<p>An important feature added has also been Content-Defined Chunking\nwhich improves deduplication of Parquet files with mostly identical\ncontents, by choosing data page boundaries based on actual contents\nrather than a number of values <sup class=\"footnote-ref\"><a href=\"#fn3\" id=\"fnref3\">3</a></sup>. This work has been done by\n<a href=\"https://github.com/kszucs\">kszucs</a>.</p>\n<p>There have been improvements in the Parquet encryption support for\nmost of the releases in the last year. These efforts have been\ndriven mostly by <a href=\"https://github.com/EnricoMi\">EnricoMi</a>,\n<a href=\"https://github.com/pitrou\">pitrou</a>, <a href=\"https://github.com/adamreeve\">adamreeve</a>\nand <a href=\"https://github.com/kapoisu\">kapoisu</a>.</p>\n<h3>PyArrow</h3>\n<p>A lot of work has been put into adding type annotations. It all\nstarted in July at EuroPython sprints and the code is now ready to be\nreviewed and merged. Some more review capacity will be needed to get\nthis over the finish line. The work has been championed by\n<a href=\"https://github.com/rok\">rok</a>.</p>\n<h3>Rust</h3>\n<p>Arrow Rust community invested heavily in the Rust parquet reader for\nwhich they created several blog posts <sup class=\"footnote-ref\"><a href=\"#fn4\" id=\"fnref4\">4</a></sup>, <sup class=\"footnote-ref\"><a href=\"#fn5\" id=\"fnref5\">5</a></sup>. The work has been\nchampioned by <a href=\"https://github.com/alamb\">alamb</a> and\n<a href=\"https://github.com/etseidl\">etseidl</a>.</p>\n<table class=\"table\">\n  <caption>Notable Components in apache/arrow-rs for 2025.</caption>\n  <thead style=\"background-color: #e9ecef\">\n    <tr>\n      <th>component</th>\n      <th>merged_prs</th>\n      <th>line_changes</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>parquet</td>\n      <td>333</td>\n      <td>140958</td>\n    </tr>\n    <tr>\n      <td>arrow</td>\n      <td>436</td>\n      <td>76590</td>\n    </tr>\n    <tr>\n      <td>parquet-variant</td>\n      <td>125</td>\n      <td>41832</td>\n    </tr>\n    <tr>\n      <td>api-change</td>\n      <td>59</td>\n      <td>33938</td>\n    </tr>\n    <tr>\n      <td>arrow-avro</td>\n      <td>48</td>\n      <td>29487</td>\n    </tr>\n  </tbody>\n</table>\n<h3>Java</h3>\n<p>The biggest changes in apache/arrow-java for 2025 have been connected\nto Flight and Avro components plus Sphinx support due to the Java\nimplementation being moved into a separate Apache repository.\nContributors involved in the above are <a href=\"https://github.com/lidavidm\">lidavidm</a>\nand <a href=\"https://github.com/martin-traverse\">martin-traverse</a>.</p>\n<h3>Go</h3>\n<p>There has been a lot of work related to new variant type in the\nParquet implementation done in apache/arrow-go all by\n<a href=\"https://github.com/zeroshade\">zeroshade</a>.</p>\n<p>Noticeable emphasis was also visible on performance-focused PRs leading to\nthe addition of row seeking, bloom filter reading/writing, and reduction of\nallocations in the Parquet library along with significant optimization work\nin the <code>compute.Take</code> kernels. Shout out to <a href=\"https://github.com/pixelherodev\">pixelherodev</a>\nand <a href=\"https://github.com/hamilton-earthscope\">hamilton-earthscope</a> for the\nemphasis they placed on improving performance.</p>\n<table class=\"table\">\n  <caption>Notable Components in apache/arrow-go for 2025.</caption>\n  <thead style=\"background-color: #e9ecef\">\n    <tr>\n      <th>component</th>\n      <th>merged_prs</th>\n      <th>line_changes</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>parquet</td>\n      <td>34</td>\n      <td>27056</td>\n    </tr>\n    <tr>\n      <td>arrow</td>\n      <td>33</td>\n      <td>14235</td>\n    </tr>\n  </tbody>\n</table>\n<h3>Nanoarrow</h3>\n<p>Bigger work in nanoarrow include Decimal32/64 and ListView/LargeListView support,\nLZ4 and ZSTD decompression in the IPC reader, and broader packaging via Conan, Homebrew,\nand vcpkg. Contributors driving most above are <a href=\"https://github.com/paleolimbot\">paleolimbot</a>\nand <a href=\"https://github.com/WillAyd\">WillAyd</a>.</p>\n<hr />\n<h2>Arrow Summit 25</h2>\n<p>One last thing to highlight would be our first Arrow Summit 25 that\nwas held in Paris in October 2025. The event was a great success and\nit brought users, contributors and maintainers together. It\ndefinitely was a highlight of the year for many of us. Thanks to\n<a href=\"https://github.com/raulcd\">raulcd</a> and <a href=\"https://github.com/pitrou\">pitrou</a>\nfor organizing the event.</p>\n<img src=\"/img/arrow_summit.jpeg\" alt=\"Arrow Summit 25 group picture\" width=\"100%\">\n<hr />\n<h2>Thank you!</h2>\n<p>We would like to thank every single contributor to Apache Arrow for\nbeing a part of this great community and project! Hope this blog\npost helps to validate all the work you have done and motivates us\nto continue collaborating and growing together!</p>\n<hr />\n<br>\n<p>The Notebooks with the analysis for this blog post can be found\nin <sup class=\"footnote-ref\"><a href=\"#fn6\" id=\"fnref6\">6</a></sup>.</p>\n<p>Note not all language implementations are mentioned. Some due to being\nmoved into a separate repository in 2025 resulting in missing information\nfor large amount of merged pull requests. Others due to having lower\nnumber of bigger contributions in the past year.</p>\n<hr />\n<section class=\"footnotes\">\n<ol>\n<li id=\"fn1\">\n<p><a href=\"https://arrow.apache.org/blog/2026/02/12/arrow-anniversary/\">Apache Arrow is 10 years old 🎉</a> <a href=\"#fnref1\" class=\"footnote-backref\">↩</a></p>\n</li>\n<li id=\"fn2\">\n<p><a href=\"https://ieeexplore.ieee.org/abstract/document/10491133\">Developer Thriving: Four Sociocognitive Factors That Create Resilient Productivity on Software Teams</a> <a href=\"#fnref2\" class=\"footnote-backref\">↩</a></p>\n</li>\n<li id=\"fn3\">\n<p><a href=\"https://huggingface.co/blog/parquet-cdc\">Parquet Content-Defined Chunking</a> <a href=\"#fnref3\" class=\"footnote-backref\">↩</a></p>\n</li>\n<li id=\"fn4\">\n<p><a href=\"https://arrow.apache.org/blog/2025/12/11/parquet-late-materialization-deep-dive/\">A Practical Dive Into Late Materialization in arrow-rs Parquet Reads</a> <a href=\"#fnref4\" class=\"footnote-backref\">↩</a></p>\n</li>\n<li id=\"fn5\">\n<p><a href=\"https://arrow.apache.org/blog/2025/10/23/rust-parquet-metadata/\">3x-9x Faster Apache Parquet Footer Metadata Using a Custom Thrift Parser in Rust</a> <a href=\"#fnref5\" class=\"footnote-backref\">↩</a></p>\n</li>\n<li id=\"fn6\">\n<p><a href=\"https://github.com/arrow-maintenance/explorations/tree/main/yearly_highlights\">arrow-maintenance/explorations</a> <a href=\"#fnref6\" class=\"footnote-backref\">↩</a></p>\n</li>\n</ol>\n</section>"
---

As you may have read in a previous blog post 1, the Apache Arrow project
recently turned 10 years old. We are grateful to everyone who helped us
achieve this milestone, and we wanted to celebrate the community's
accomplishments, by publishing our community highlights from 2025.
We were inspired by the research by Dr Cat Hicks et al 2, who found
that concrete evidence of progress and accomplishments is instrumental
to motivation and collaboration in developer teams. We think the same
should hold for open source.
New contributors
It has been great to see many new contributors joining the project
in the past year, with over 300 such individuals observed across the main
Apache Arrow language implementations.
Number of new contributors per repository.
  
    
Repository/Implementation
      Number of new contributors
    
arrow
      125
    
arrow-rs
      132
    
arrow-java
      28
    
arrow-go
      35
    
Worth highlighting is alinaliBQ who
has been very active on the C++ Flight SQL ODBC Driver work together
with justing-bq.
AntoinePrv has done a huge amount of
work on the C++ Parquet implementation and andishgar
in the C++ Statistics area.
rmnskb got involved with PyArrow in
EuroPython sprints and has contributed multiple PRs since then. On the
same event paddyroddy also started with
his first contribution and helped on the Python packaging side further on.
sdf-jkl, liamzwbao,
friendlymatthew, and
klion26 helped drive early Variant
functionality in the Rust Parquet implementation and contributed a number
of follow-up improvements.
jecsand838 drove major improvements to the
Rust arrow-avro crate, work highlighted in the
Introducing Arrow Avro
blog post.
Notable New Contributors in apache/arrow for 2025.
  
    
Author
      Number of prs
      Number of line changes (+ and -)
    
alinaliBQ
      36
      15754
    
andishgar
      19
      2926
    
AntoinePrv
      8
      79257
    
rmnskb
      7
      550
    
justing-bq
      4
      12607
    
Notable New Contributors in apache/arrow-rs for 2025.
  
    
Author
      Number of prs
      Number of line changes (+ and -)
    
scovich
      50
      21006
    
jecsand838
      38
      26753
    
friendlymatthew
      33
      7203
    
sdf-jkl
      4
      388
    
rambleraptor
      4
      333
    
Notable New Contributors in apache/arrow-go for 2025.
  
    
Author
      Number of prs
      Number of line changes (+ and -)
    
Mandukhai-Alimaa
      6
      1392
    
hamilton-earthscope
      5
      2998
    
Release, Packaging and CI
A lot of work has been done around the Continuous Integration and
Developer Tools area. Ensuring a project with the reach of Arrow is properly working
requires validation on a huge matrix of operating systems, architectures, libraries,
versions. Needless to say that maintenance work has tremendous importance for the
health of the project and the positive contributor experience.
The most active contributors in the main repository are the ones contributing
heavily on those areas while also providing the most review capacity. Shout out
to kou and raulcd for
taking such good care of the project and devoting countless hours so that everything
runs smoothly.
Notable contributions worth mentioning are enhanced release automation and
reproducible builds for sources, migrating remaining AppVeyor and Azure jobs
to GitHub actions, improving dev experience with more pre-commit checks instead
of custom made linting tools.
Moving some implementations out of the main repository (apache/arrow on GitHub)
helped with easier releases and maintenance of the main repository and also of
separate language implementations. The current apache/arrow repo now holds the format
specification, C++ implementation together with all the bindings to it (Python, R, Ruby
and C GLib). Other languages now live in their own apache/ repos namely
apache/arrow-java,
apache/arrow-js,
apache/arrow-rs,
apache/arrow-go,
apache/arrow-nanoarrow,
apache/arrow-dotnet and
apache/arrow-swift.
Notable Contributors in apache/arrow for 2025.
  
    
Author
      Number of prs
      Number of line changes (+ and -)
    
kou
      221
      141015
    
AntoinePrv
      8
      79257
    
raulcd
      110
      46645
    
pitrou
      101
      36585
    
jbonofre
      1
      20061
    
Notable Components in apache/arrow for 2025.
  
    
Component label
      Number of merged prs
      Number of line changes (+ and -)
    
Parquet
      100
      103828
    
C++
      387
      82744
    
FlightRPC
      43
      52659
    
CI
      237
      42249
    
Ruby
      74
      20676
    
Migration of infrastructure from Voltron Data
As Voltron Data has wound down its operations in 2025, the Arrow project
had to migrate benchmarking infrastructure and nightly report from
Voltron-managed services to an Arrow-managed AWS account. This work has been
driven by rok.
Closing of Stale issues
thisisnic was working on closing of stale
issues in the apache/arrow repository which helped surfacing important
issues that were overlooked or forgotten.
Code contributions
C++ implementation
Community support for maintenance and development of the Acero C++
is continuing with multiple bigger contributions in 2025 done by
pitrou and zanmato1984.
Many kernels have been moved from the integrated compute module into
a separate, optional package for improvement of modularity and distribution
size when optional compute functionality is not being used. The work has
been done by raulcd.
Arrow C++ Parquet implementation
There have been multiple contributions to fix and improve fuzzing
support for Parquet. Fuzzing work is led by pitrou
who is also one of the most active members of the community guiding other
developers and supporting us with abundant review capacity.
Multiple newer types have also been supported in the last year,
namely: VARIANT, UUID, GEOMETRY and GEOGRAPHY contributed
by neilechao and
paleolimbot.
An important feature added has also been Content-Defined Chunking
which improves deduplication of Parquet files with mostly identical
contents, by choosing data page boundaries based on actual contents
rather than a number of values 3. This work has been done by
kszucs.
There have been improvements in the Parquet encryption support for
most of the releases in the last year. These efforts have been
driven mostly by EnricoMi,
pitrou, adamreeve
and kapoisu.
PyArrow
A lot of work has been put into adding type annotations. It all
started in July at EuroPython sprints and the code is now ready to be
reviewed and merged. Some more review capacity will be needed to get
this over the finish line. The work has been championed by
rok.
Rust
Arrow Rust community invested heavily in the Rust parquet reader for
which they created several blog posts 4, 5. The work has been
championed by alamb and
etseidl.
Notable Components in apache/arrow-rs for 2025.
  
    
component
      merged_prs
      line_changes
    
parquet
      333
      140958
    
arrow
      436
      76590
    
parquet-variant
      125
      41832
    
api-change
      59
      33938
    
arrow-avro
      48
      29487
    
Java
The biggest changes in apache/arrow-java for 2025 have been connected
to Flight and Avro components plus Sphinx support due to the Java
implementation being moved into a separate Apache repository.
Contributors involved in the above are lidavidm
and martin-traverse.
Go
There has been a lot of work related to new variant type in the
Parquet implementation done in apache/arrow-go all by
zeroshade.
Noticeable emphasis was also visible on performance-focused PRs leading to
the addition of row seeking, bloom filter reading/writing, and reduction of
allocations in the Parquet library along with significant optimization work
in the compute.Take kernels. Shout out to pixelherodev
and hamilton-earthscope for the
emphasis they placed on improving performance.
Notable Components in apache/arrow-go for 2025.
  
    
component
      merged_prs
      line_changes
    
parquet
      34
      27056
    
arrow
      33
      14235
    
Nanoarrow
Bigger work in nanoarrow include Decimal32/64 and ListView/LargeListView support,
LZ4 and ZSTD decompression in the IPC reader, and broader packaging via Conan, Homebrew,
and vcpkg. Contributors driving most above are paleolimbot
and WillAyd.
Arrow Summit 25
One last thing to highlight would be our first Arrow Summit 25 that
was held in Paris in October 2025. The event was a great success and
it brought users, contributors and maintainers together. It
definitely was a highlight of the year for many of us. Thanks to
raulcd and pitrou
for organizing the event.
Thank you!
We would like to thank every single contributor to Apache Arrow for
being a part of this great community and project! Hope this blog
post helps to validate all the work you have done and motivates us
to continue collaborating and growing together!
The Notebooks with the analysis for this blog post can be found
in 6.
Note not all language implementations are mentioned. Some due to being
moved into a separate repository in 2025 resulting in missing information
for large amount of merged pull requests. Others due to having lower
number of bigger contributions in the past year.
Apache Arrow is 10 years old 🎉 ↩
Developer Thriving: Four Sociocognitive Factors That Create Resilient Productivity on Software Teams ↩
Parquet Content-Defined Chunking ↩
A Practical Dive Into Late Materialization in arrow-rs Parquet Reads ↩
3x-9x Faster Apache Parquet Footer Metadata Using a Custom Thrift Parser in Rust ↩
arrow-maintenance/explorations ↩
