---
title: "Delta Lake 0.6.1 Released"
link: "https://delta.io/blog/2020-05-26-delta-lake-0-6-1-released/"
guid: "https://delta.io/blog/2020-05-26-delta-lake-0-6-1-released/"
pubDate: "2020-05-26T00:00:00.000Z"
site_name: "Delta Lake"
site_feed: "https://delta.io/rss.xml"
category: "Data"
summary: "We are excited to announce the release of Delta Lake 0.6.1, which fixes a few critical bugs in merge operation and operation metrics. If you are using version 0.6.0, it is strongly recommended that you upgrade to version 0.6.1."
contentHtml: "<div>        \n    <div>       </div>     <div>  <h2 id=\"key-features\">Key features</h2>\n<p>We are excited to announce the release of Delta Lake 0.6.1, which fixes a few critical bugs in merge operation and operation metrics. If you are using version 0.6.0, it is strongly recommended that you upgrade to version 0.6.1. The details of the fixed bugs are as follows:</p>\n<ul>\n<li><strong>Invalid MERGE INTO AnalysisExceptions (<a target=\"_blank\" href=\"https://github.com/delta-io/delta/issues/419\">#419</a>)</strong>&#160;- A couple of bugs related to merge operation were causing analysis errors in 0.6.0 on previously supported merge queries.\n<ul>\n<li>Fixing one of these bugs required reverting a minor change to the DeltaTable 0.6.0 API. In 0.6.1 (similar to 0.5.0), if the table’s schema has changed since the creation of the DeltaTable instance DeltaTable.toDF() does not return a DataFrame with the latest schema. In such scenarios, you must recreate the DeltaTable instance for it to recognize the latest schema.</li>\n<li>Incorrect operations metrics in history&#160;- 0.6.0 reported an incorrect number of rows processed during Update and Delete. This is fixed in 0.6.1.</li>\n</ul>\n</li>\n</ul>\n<h2 id=\"credits\">Credits</h2>\n<p>Alan Jin, Jose Torres, Rahul Mahadev, Tathagata Das</p>\n<p>Thank you for your contributions.</p>\n<p>Visit the&#160;<a target=\"_blank\" href=\"https://github.com/delta-io/delta/releases/tag/v0.6.1\">release notes</a> to learn more about the release.</p>  </div>        </div>"
---

We are excited to announce the release of Delta Lake 0.6.1, which fixes a few critical bugs in merge operation and operation metrics. If you are using version 0.6.0, it is strongly recommended that you upgrade to version 0.6.1.
