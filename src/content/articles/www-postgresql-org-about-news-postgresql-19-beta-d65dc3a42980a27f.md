---
title: "PostgreSQL 19 Beta 2 Released!"
link: "https://www.postgresql.org/about/news/postgresql-19-beta-2-released-3350/"
guid: "https://www.postgresql.org/about/news/postgresql-19-beta-2-released-3350/"
pubDate: "2026-07-16T00:00:00.000Z"
site_name: "PostgreSQL"
site_feed: "https://www.postgresql.org/news.rss"
category: "Infra"
summary: "The PostgreSQL Global Development Group announces that the second beta release of\nPostgreSQL 19 is now available for download.\nThis release contains PostgreSQL 19 feature previews ahead of general\navailability, though some details of the release can change during the beta\nperiod.\nYou can find information about all of the PostgreSQL 19 features and changes in\nthe release notes:\nhttps://www.postgresql.org/docs/19/release-19.html\nIn the spirit of the open source PostgreSQL community, we strongly encourage you\nto test the new features of PostgreSQL 19 on your systems to help us eliminate\nbugs and other issues. While we do not advise you to run beta versions in\nproduction environments, we encourage you to find ways to run your typical\napplication workloads against this beta release.\nYour testing and feedback help the community ensure that PostgreSQL 19\nupholds our standards of delivering a stable, reliable release of the\nworld's most advanced open source relational database. Please read more about\nour beta testing process and how\nyou can contribute:\nhttps://www.postgresql.org/developer/beta/\nUpgrading to PostgreSQL 19 Beta 2\nTo upgrade to PostgreSQL 19 Beta 2 from an earlier version of PostgreSQL,\nyou will need to use a strategy similar to upgrading between major versions of\nPostgreSQL (e.g. pg_upgrade or pg_dump / pg_restore). For more\ninformation, please visit the documentation section on\nupgrading.\nChanges Since Beta 1\nFixes and changes in PostgreSQL 19 Beta 2 include:\nFix a regression in vacuumdb --analyze-in-stages for partitioned tables.\nFix servicefile to show correct file after fallback to system file.\nFix tuple deformation optimization for virtual generated columns.\nAllow pg_createsubscriber to accept duplicate publication names.\nFix REPACK worker not being cleaned up on a FATAL exit.\nSeveral fixes for the new FOR PORTION OF temporal table syntax.\nFix race condition when logical decoding activation is concurrently\ninterrupted.\nDisallow negative values for max_retention_duration.\nFix md5_password_warnings for role and database settings.\nSeveral fixes for the new SQL/PGQ property graph feature.\nFix autovacuum's multixact-age score calculation, which could become infinite.\nRevert non-text output formats for pg_dumpall.\nFix locking for ALTER DOMAIN ... VALIDATE CONSTRAINT.\nFix how postgres_fdw handles imported foreign-table statistics.\nPlease see the release notes\nfor a complete list of new and changed features:\nhttps://www.postgresql.org/docs/19/release-19.html\nTesting for Bugs & Compatibility\nThe stability of each PostgreSQL release greatly depends on you, the community,\nto test the upcoming version with your workloads and testing tools to find bugs\nand regressions before the general availability of PostgreSQL 19. As this is a\nBeta, minor changes to database behaviors, feature details, and APIs are still\npossible. Your feedback and testing will help determine the final tweaks on the\nnew features, so please test in the near future. The quality of user testing\nhelps determine when we can make a final release.\nA list of open issues\nis publicly available in the PostgreSQL wiki.  You can\nreport bugs using this form on\nthe PostgreSQL website:\nhttps://www.postgresql.org/account/submitbug/\nBeta Schedule\nThis is the second beta release of version 19. The PostgreSQL Project will\nrelease additional betas as required for testing, followed by one or more\nrelease candidates, until the final release around September/October 2026. For further\ninformation please see the Beta Testing\npage.\nLinks\nDownload\nBeta Testing Information\nPostgreSQL 19 Beta Release Notes\nPostgreSQL 19 Open Issues\nSubmit a Bug\nDonate"
contentHtml: "<div>\n<p>Posted on <strong>2026-07-16</strong> by PostgreSQL Global Development Group</p>\n<p><span><i></i> PostgreSQL Project</span>\n</p>\n<p>The PostgreSQL Global Development Group announces that the second beta release of\nPostgreSQL 19 is now <a target=\"_blank\" href=\"https://www.postgresql.org/download/\">available for download</a>.\nThis release contains PostgreSQL 19 feature previews ahead of general\navailability, though some details of the release can change during the beta\nperiod.</p>\n<p>You can find information about all of the PostgreSQL 19 features and changes in\nthe <a target=\"_blank\" href=\"https://www.postgresql.org/docs/19/release-19.html\">release notes</a>:</p>\n<p><a target=\"_blank\" href=\"https://www.postgresql.org/docs/19/release-19.html\">https://www.postgresql.org/docs/19/release-19.html</a></p>\n<p>In the spirit of the open source PostgreSQL community, we strongly encourage you\nto test the new features of PostgreSQL 19 on your systems to help us eliminate\nbugs and other issues. While we do not advise you to run beta versions in\nproduction environments, we encourage you to find ways to run your typical\napplication workloads against this beta release.</p>\n<p>Your testing and feedback help the community ensure that PostgreSQL 19\nupholds our standards of delivering a stable, reliable release of the\nworld's most advanced open source relational database. Please read more about\nour <a target=\"_blank\" href=\"https://www.postgresql.org/developer/beta/\">beta testing process</a> and how\nyou can contribute:</p>\n<p><a target=\"_blank\" href=\"https://www.postgresql.org/developer/beta/\">https://www.postgresql.org/developer/beta/</a></p>\n<h2>Upgrading to PostgreSQL 19 Beta 2</h2>\n<p>To upgrade to PostgreSQL 19 Beta 2 from an earlier version of PostgreSQL,\nyou will need to use a strategy similar to upgrading between major versions of\nPostgreSQL (e.g. <code>pg_upgrade</code> or <code>pg_dump</code> / <code>pg_restore</code>). For more\ninformation, please visit the documentation section on\n<a target=\"_blank\" href=\"https://www.postgresql.org/docs/19/static/upgrading.html\">upgrading</a>.</p>\n<h2>Changes Since Beta 1</h2>\n<p>Fixes and changes in PostgreSQL 19 Beta 2 include:</p>\n<ul>\n<li>Fix a regression in <code>vacuumdb --analyze-in-stages</code> for partitioned tables.</li>\n<li>Fix <code>servicefile</code> to show correct file after fallback to system file.</li>\n<li>Fix tuple deformation optimization for virtual generated columns.</li>\n<li>Allow <code>pg_createsubscriber</code> to accept duplicate publication names.</li>\n<li>Fix <code>REPACK</code> worker not being cleaned up on a <code>FATAL</code> exit.</li>\n<li>Several fixes for the new <code>FOR PORTION OF</code> temporal table syntax.</li>\n<li>Fix race condition when logical decoding activation is concurrently\ninterrupted.</li>\n<li>Disallow negative values for <code>max_retention_duration</code>.</li>\n<li>Fix <code>md5_password_warnings</code> for role and database settings.</li>\n<li>Several fixes for the new SQL/PGQ property graph feature.</li>\n<li>Fix autovacuum's multixact-age score calculation, which could become infinite.</li>\n<li>Revert non-text output formats for <code>pg_dumpall</code>.</li>\n<li>Fix locking for <code>ALTER DOMAIN ... VALIDATE CONSTRAINT</code>.</li>\n<li>Fix how <code>postgres_fdw</code> handles imported foreign-table statistics.</li>\n</ul>\n<p>Please see the <a target=\"_blank\" href=\"https://www.postgresql.org/docs/19/release-19.html\">release notes</a>\nfor a complete list of new and changed features:</p>\n<p><a target=\"_blank\" href=\"https://www.postgresql.org/docs/19/release-19.html\">https://www.postgresql.org/docs/19/release-19.html</a></p>\n<h2>Testing for Bugs &amp; Compatibility</h2>\n<p>The stability of each PostgreSQL release greatly depends on you, the community,\nto test the upcoming version with your workloads and testing tools to find bugs\nand regressions before the general availability of PostgreSQL 19. As this is a\nBeta, minor changes to database behaviors, feature details, and APIs are still\npossible. Your feedback and testing will help determine the final tweaks on the\nnew features, so please test in the near future. The quality of user testing\nhelps determine when we can make a final release.</p>\n<p>A list of <a target=\"_blank\" href=\"https://wiki.postgresql.org/wiki/PostgreSQL_19_Open_Items\">open issues</a>\nis publicly available in the PostgreSQL wiki.  You can\n<a target=\"_blank\" href=\"https://www.postgresql.org/account/submitbug/\">report bugs</a> using this form on\nthe PostgreSQL website:</p>\n<p><a target=\"_blank\" href=\"https://www.postgresql.org/account/submitbug/\">https://www.postgresql.org/account/submitbug/</a></p>\n<h2>Beta Schedule</h2>\n<p>This is the second beta release of version 19. The PostgreSQL Project will\nrelease additional betas as required for testing, followed by one or more\nrelease candidates, until the final release around September/October 2026. For further\ninformation please see the <a target=\"_blank\" href=\"https://www.postgresql.org/developer/beta/\">Beta Testing</a>\npage.</p>\n<h2>Links</h2>\n<ul>\n<li><a target=\"_blank\" href=\"https://www.postgresql.org/download/\">Download</a></li>\n<li><a target=\"_blank\" href=\"https://www.postgresql.org/developer/beta/\">Beta Testing Information</a></li>\n<li><a target=\"_blank\" href=\"https://www.postgresql.org/docs/19/release-19.html\">PostgreSQL 19 Beta Release Notes</a></li>\n<li><a target=\"_blank\" href=\"https://wiki.postgresql.org/wiki/PostgreSQL_19_Open_Items\">PostgreSQL 19 Open Issues</a></li>\n<li><a target=\"_blank\" href=\"https://www.postgresql.org/account/submitbug/\">Submit a Bug</a></li>\n<li><a target=\"_blank\" href=\"https://www.postgresql.org/about/donate/\">Donate</a></li>\n</ul>\n      </div>"
---

The PostgreSQL Global Development Group announces that the second beta release of
PostgreSQL 19 is now available for download.
This release contains PostgreSQL 19 feature previews ahead of general
availability, though some details of the release can change during the beta
period.
You can find information about all of the PostgreSQL 19 features and changes in
the release notes:
https://www.postgresql.org/docs/19/release-19.html
In the spirit of the open source PostgreSQL community, we strongly encourage you
to test the new features of PostgreSQL 19 on your systems to help us eliminate
bugs and other issues. While we do not advise you to run beta versions in
production environments, we encourage you to find ways to run your typical
application workloads against this beta release.
Your testing and feedback help the community ensure that PostgreSQL 19
upholds our standards of delivering a stable, reliable release of the
world's most advanced open source relational database. Please read more about
our beta testing process and how
you can contribute:
https://www.postgresql.org/developer/beta/
Upgrading to PostgreSQL 19 Beta 2
To upgrade to PostgreSQL 19 Beta 2 from an earlier version of PostgreSQL,
you will need to use a strategy similar to upgrading between major versions of
PostgreSQL (e.g. pg_upgrade or pg_dump / pg_restore). For more
information, please visit the documentation section on
upgrading.
Changes Since Beta 1
Fixes and changes in PostgreSQL 19 Beta 2 include:
Fix a regression in vacuumdb --analyze-in-stages for partitioned tables.
Fix servicefile to show correct file after fallback to system file.
Fix tuple deformation optimization for virtual generated columns.
Allow pg_createsubscriber to accept duplicate publication names.
Fix REPACK worker not being cleaned up on a FATAL exit.
Several fixes for the new FOR PORTION OF temporal table syntax.
Fix race condition when logical decoding activation is concurrently
interrupted.
Disallow negative values for max_retention_duration.
Fix md5_password_warnings for role and database settings.
Several fixes for the new SQL/PGQ property graph feature.
Fix autovacuum's multixact-age score calculation, which could become infinite.
Revert non-text output formats for pg_dumpall.
Fix locking for ALTER DOMAIN ... VALIDATE CONSTRAINT.
Fix how postgres_fdw handles imported foreign-table statistics.
Please see the release notes
for a complete list of new and changed features:
https://www.postgresql.org/docs/19/release-19.html
Testing for Bugs & Compatibility
The stability of each PostgreSQL release greatly depends on you, the community,
to test the upcoming version with your workloads and testing tools to find bugs
and regressions before the general availability of PostgreSQL 19. As this is a
Beta, minor changes to database behaviors, feature details, and APIs are still
possible. Your feedback and testing will help determine the final tweaks on the
new features, so please test in the near future. The quality of user testing
helps determine when we can make a final release.
A list of open issues
is publicly available in the PostgreSQL wiki.  You can
report bugs using this form on
the PostgreSQL website:
https://www.postgresql.org/account/submitbug/
Beta Schedule
This is the second beta release of version 19. The PostgreSQL Project will
release additional betas as required for testing, followed by one or more
release candidates, until the final release around September/October 2026. For further
information please see the Beta Testing
page.
Links
Download
Beta Testing Information
PostgreSQL 19 Beta Release Notes
PostgreSQL 19 Open Issues
Submit a Bug
Donate
