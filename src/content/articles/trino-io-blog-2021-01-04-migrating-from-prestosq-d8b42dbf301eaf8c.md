---
title: "Migrating from PrestoSQL to Trino"
link: "https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html"
guid: "https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html"
pubDate: "2021-01-04T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "As we previously announced, we’re\nrebranding Presto SQL as Trino.\nNow comes the hard part: migrating to the new version of the software.\nWe just released the first version,\nTrino 351,\nwhich uses the name Trino everywhere, both internally and externally.\nUnfortunately, there are some unavoidable compatibility aspects that\nadministrators of Trino need to know about. We hope this post makes the\ntransition as smooth as possible.\nThings that haven’t changed\nLet’s start with the good news. For end users running queries against Trino,\neverything should be the same. There are no changes to the SQL language,\nSQL functions, session properties, etc.\nUsers now see Trino in error messages, a different logo in the web UI,\nand error stack traces have a different package name, but otherwise they\nwon’t know that anything has changed. All of their views, reports,\nor other stored queries will work as before.\nSimilarly for administrators, except for a few things noted in the\nTrino 351 release notes,\nall the configuration properties are the same.\nClient protocol compatiblity\nThe client protocol is how clients, such as the\nCLI or\nJDBC driver,\ntalk to Trino. It uses standard HTTP as the underlying communications\nprotocol, with some custom HTTP headers to communicate values\nto and from Trino. Unfortunately, those header names started with\nX-Presto- and thus had to be changed to X-Trino-.\nThe Trino CLI and JDBC driver send the new headers, so they are\nonly compatible with Trino versions 351 and newer. Users should\nwait to upgrade the CLI or JDBC driver until the Trino servers they\ntalk to have been upgraded.\nOut of the box, the Trino server does not work with older clients.\nHowever, in order to support a graceful transition, you can allow the\nserver to support older clients by adding a configuration property:\n\nprotocol.v1.alternate-header-name=Presto\n\n\nWe recommend using version 350 of CLI and JDBC driver as the transition version.\nIt has all the newest features such as variable precision timestamps,\nhas been tested with a range of older server versions, and is the last\nversion to support older servers.\nJDBC driver\nThe URL prefix for the JDBC driver now starts with jdbc:trino: instead\nof jdbc:presto:. This means that any client applications using the\nJDBC driver need to update their connection configuration. The old\nprefix is still supported, but will be removed in a future release.\nThe class name of the driver is now io.trino.jdbc.TrinoDriver. This is\nof no concern to most users, as the driver is normally accessed via the\nstandard JDBC auto-discovery mechanism based on the URL. As with the URL prefix,\nthe old name is still supported, but will be removed in a future release.\nServer RPM\nThe name of the RPM has changed, so it is treated as a different RPM, and\nthus you cannot simply upgrade from the old version to the new version.\nAll of the directories for the RPM that contained the name presto now\nuse trino instead. You likely want to uninstall the old RPM, rename\nthe config and log directories, then install the new RPM.\nDocker image\nThe Trino Docker image is now\npublished as trinodb/trino. The supported configuration directory is\nnow /etc/trino. The CLI is now named trino instead of presto.\nJMX MBean naming\nTrino runs on the JVM, which has the JMX framework as a standard way to expose\nsystem and application metrics. Trino exposes a huge number of JMX metrics for\nadministrators to monitor their clusters. You might be using these metrics\nvia your monitoring system, or perhaps you are accessing them in SQL via the\nTrino JMX connector.\nThe metrics for Trino server now start with trino instead of presto. You\nmight need to update this name in your monitoring system, or you can revert\nto the old name:\n\njmx.base-name=presto\n\n\nSimilarly, the metrics for the Elasticsearch, Hive, Iceberg, Raptor, and Thrift\nconnectors now start with trino.plugin instead of presto.plugin. Again,\nyou might need to update these names in your monitoring system, or you can\nrevert to the old name. For example, for the Hive connector:\n\njmx.base-name=presto.plugin.hive\n\n\nThrift connector\nThe Thrift connector had many\nbackwards incompatible changes\nto both the Thrift service interface and the configuration properties. You need\nupdate all of your implementations of the Thrift service used by the connector.\nSPI\nIf you have any custom plugins for Trino, such as connectors or functions,\nthese need to be updated. The package name is now io.trino.spi, and a\nfew classes were renamed:\nPrestoException to TrinoException\nPrestoPrincipal to TrinoPrincipal\nPrestoWarning to TrinoWarning\nThere are no functional changes, so all you should need to do is update\nyour imports and rename the references to the above class names.\nMigration guide\nNow that you understand what is different and what you need to change,\nyou can start thinking about the list of steps needed to perform the\nmigration. The following is a rough plan for upgrading your environment.\nStep 1: Prepare to deploy the new version\nLet users know the name is changing, so they are not surprised by the logo changes in the UI.\nMake sure that users are using recent client versions. Ideally, upgrade them all to\nversion 350, as mentioned above. You can check the HTTP request logs for the coordinator\nto see what client versions are in use.\nUpdate your server configuration with protocol.v1.alternate-header-name=Presto\nto allow supporting all of your existing Presto clients.\nIf you are using the RPM, have a plan to deal with the new RPM name\nand the trino directory names.\nIf you are using Docker, use the new image name, make sure your configuration will\nbe mounted using the trino path name, and remember that the CLI is now named trino.\nUpdate any custom plugins to use the new SPI.\nCheck if you have anything using JMX to monitor your clusters, and decide if you will\nupdate them to the new names or set a Trino config to revert to the old names.\nStep 2: Upgrade your servers to Trino 351+\nUpgrade development and staging servers.\nUpgrade production servers. If you have multiple clusters, you can do them one\nat a time, and verify everything is working before moving on to the next one.\nStep 3: Upgrade clients\nUpgrade all clients including the CLI, JDBC driver, Python, etc., to the Trino versions.\nUpdate any applications using JDBC to use the new jdbc:trino: connection URL prefix.\nStep 4: Cleanup\nRemove the protocol.v1.alternate-header-name configuration property.\nIf you configured Trino to use the old JMX names, convert your monitoring system\nto use the new JMX names and remove the fallback configs.\nGetting help\nWe’re here to help! If you run into any issues while upgrading, or having any\nquestions or concerns, ask on Slack."
author: "David Phillips, Dain Sundstrom"
contentHtml: "<div>\n<article>\n  <div><p>As we previously announced, we’re\n<a target=\"_blank\" href=\"https://trino.io/blog/2020/12/27/announcing-trino\">rebranding Presto SQL as Trino</a>.\nNow comes the hard part: migrating to the new version of the software.\nWe just released the first version,\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-351.html\">Trino 351</a>,\nwhich uses the name Trino everywhere, both internally and externally.\nUnfortunately, there are some unavoidable compatibility aspects that\nadministrators of Trino need to know about. We hope this post makes the\ntransition as smooth as possible.</p>\n<!--more-->\n<h2 id=\"things-that-havent-changed\">\n    Things that haven’t changed <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#things-that-havent-changed\">#</a>\n</h2>\n<p>Let’s start with the good news. For end users running queries against Trino,\neverything should be the same. There are no changes to the SQL language,\nSQL functions, session properties, etc.</p>\n<p>Users now see <em>Trino</em> in error messages, a different logo in the web UI,\nand error stack traces have a different package name, but otherwise they\nwon’t know that anything has changed. All of their views, reports,\nor other stored queries will work as before.</p>\n<p>Similarly for administrators, except for a few things noted in the\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-351.html\">Trino 351 release notes</a>,\nall the configuration properties are the same.</p>\n<h2 id=\"client-protocol-compatiblity\">\n    Client protocol compatiblity <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#client-protocol-compatiblity\">#</a>\n</h2>\n<p>The client protocol is how clients, such as the\n<a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/docs/current/client/cli.html\">CLI</a> or\n<a target=\"_blank\" href=\"https://trino.io/docs/current/client/jdbc.html\">JDBC driver</a>,\ntalk to Trino. It uses standard HTTP as the underlying communications\nprotocol, with some custom HTTP headers to communicate values\nto and from Trino. Unfortunately, those header names started with\n<code>X-Presto-</code> and thus had to be changed to <code>X-Trino-</code>.</p>\n<p>The Trino CLI and JDBC driver send the new headers, so they are\n<strong>only compatible with Trino versions 351 and newer</strong>. Users should\nwait to upgrade the CLI or JDBC driver until the Trino servers they\ntalk to have been upgraded.</p>\n<p>Out of the box, the Trino server does not work with older clients.\nHowever, in order to support a graceful transition, you can allow the\nserver to support older clients by adding a configuration property:</p>\n<div><pre><code>protocol.v1.alternate-header-name=Presto\n</code></pre></div>\n<p><strong>We recommend using version 350 of CLI and JDBC driver as the transition version</strong>.\nIt has all the newest features such as variable precision timestamps,\nhas been tested with a range of older server versions, and is the last\nversion to support older servers.</p>\n<h2 id=\"jdbc-driver\">\n    JDBC driver <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#jdbc-driver\">#</a>\n</h2>\n<p>The URL prefix for the JDBC driver now starts with <code>jdbc:trino:</code> instead\nof <code>jdbc:presto:</code>. This means that any client applications using the\nJDBC driver need to update their connection configuration. The old\nprefix is still supported, but will be removed in a future release.</p>\n<p>The class name of the driver is now <code>io.trino.jdbc.TrinoDriver</code>. This is\nof no concern to most users, as the driver is normally accessed via the\nstandard JDBC auto-discovery mechanism based on the URL. As with the URL prefix,\nthe old name is still supported, but will be removed in a future release.</p>\n<h2 id=\"server-rpm\">\n    Server RPM <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#server-rpm\">#</a>\n</h2>\n<p>The name of the RPM has changed, so it is treated as a different RPM, and\nthus you cannot simply upgrade from the old version to the new version.\nAll of the directories for the RPM that contained the name <code>presto</code> now\nuse <code>trino</code> instead. You likely want to uninstall the old RPM, rename\nthe config and log directories, then install the new RPM.</p>\n<h2 id=\"docker-image\">\n    Docker image <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#docker-image\">#</a>\n</h2>\n<p>The <a target=\"_blank\" href=\"https://hub.docker.com/r/trinodb/trino\">Trino Docker image</a> is now\npublished as <code>trinodb/trino</code>. The supported configuration directory is\nnow <code>/etc/trino</code>. The CLI is now named <code>trino</code> instead of <code>presto</code>.</p>\n<h2 id=\"jmx-mbean-naming\">\n    JMX MBean naming <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#jmx-mbean-naming\">#</a>\n</h2>\n<p>Trino runs on the JVM, which has the JMX framework as a standard way to expose\nsystem and application metrics. Trino exposes a huge number of JMX metrics for\nadministrators to monitor their clusters. You might be using these metrics\nvia your monitoring system, or perhaps you are accessing them in SQL via the\nTrino <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/jmx.html\">JMX connector</a>.</p>\n<p>The metrics for Trino server now start with <code>trino</code> instead of <code>presto</code>. You\nmight need to update this name in your monitoring system, or you can revert\nto the old name:</p>\n<div><pre><code>jmx.base-name=presto\n</code></pre></div>\n<p>Similarly, the metrics for the Elasticsearch, Hive, Iceberg, Raptor, and Thrift\nconnectors now start with <code>trino.plugin</code> instead of <code>presto.plugin</code>. Again,\nyou might need to update these names in your monitoring system, or you can\nrevert to the old name. For example, for the Hive connector:</p>\n<div><pre><code>jmx.base-name=presto.plugin.hive\n</code></pre></div>\n<h2 id=\"thrift-connector\">\n    Thrift connector <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#thrift-connector\">#</a>\n</h2>\n<p>The <a target=\"_blank\" href=\"https://trino.io/docs/current/connector/thrift.html\">Thrift connector</a> had many\n<a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-351.html#thrift-connector-changes\">backwards incompatible changes</a>\nto both the Thrift service interface and the configuration properties. You need\nupdate all of your implementations of the Thrift service used by the connector.</p>\n<h2 id=\"spi\">\n    SPI <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#spi\">#</a>\n</h2>\n<p>If you have any custom plugins for Trino, such as connectors or functions,\nthese need to be updated. The package name is now <code>io.trino.spi</code>, and a\nfew classes were renamed:</p>\n<ul>\n  <li><code>PrestoException</code> to <code>TrinoException</code></li>\n  <li><code>PrestoPrincipal</code> to <code>TrinoPrincipal</code></li>\n  <li><code>PrestoWarning</code> to <code>TrinoWarning</code></li>\n</ul>\n<p>There are no functional changes, so all you should need to do is update\nyour imports and rename the references to the above class names.</p>\n<h2 id=\"migration-guide\">\n    Migration guide <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#migration-guide\">#</a>\n</h2>\n<p>Now that you understand what is different and what you need to change,\nyou can start thinking about the list of steps needed to perform the\nmigration. The following is a rough plan for upgrading your environment.</p>\n<p><strong>Step 1: Prepare to deploy the new version</strong></p>\n<ul>\n  <li>Let users know the name is changing, so they are not surprised by the logo changes in the UI.</li>\n  <li>Make sure that users are using recent client versions. Ideally, upgrade them all to\nversion 350, as mentioned above. You can check the HTTP request logs for the coordinator\nto see what client versions are in use.</li>\n  <li>Update your server configuration with <code>protocol.v1.alternate-header-name=Presto</code>\nto allow supporting all of your existing Presto clients.</li>\n  <li>If you are using the RPM, have a plan to deal with the new RPM name\nand the <code>trino</code> directory names.</li>\n  <li>If you are using Docker, use the new image name, make sure your configuration will\nbe mounted using the <code>trino</code> path name, and remember that the CLI is now named <code>trino</code>.</li>\n  <li>Update any custom plugins to use the new SPI.</li>\n  <li>Check if you have anything using JMX to monitor your clusters, and decide if you will\nupdate them to the new names or set a Trino config to revert to the old names.</li>\n</ul>\n<p><strong>Step 2: Upgrade your servers to Trino 351+</strong></p>\n<ul>\n  <li>Upgrade development and staging servers.</li>\n  <li>Upgrade production servers. If you have multiple clusters, you can do them one\nat a time, and verify everything is working before moving on to the next one.</li>\n</ul>\n<p><strong>Step 3: Upgrade clients</strong></p>\n<ul>\n  <li>Upgrade all clients including the CLI, JDBC driver, Python, etc., to the Trino versions.</li>\n  <li>Update any applications using JDBC to use the new <code>jdbc:trino:</code> connection URL prefix.</li>\n</ul>\n<p><strong>Step 4: Cleanup</strong></p>\n<ul>\n  <li>Remove the <code>protocol.v1.alternate-header-name</code> configuration property.</li>\n  <li>If you configured Trino to use the old JMX names, convert your monitoring system\nto use the new JMX names and remove the fallback configs.</li>\n</ul>\n<h2 id=\"getting-help\">\n    Getting help <a target=\"_blank\" href=\"https://trino.io/blog/2021/01/04/migrating-from-prestosql-to-trino.html#getting-help\">#</a>\n</h2>\n<p>We’re here to help! If you run into any issues while upgrading, or having any\nquestions or concerns, <a target=\"_blank\" href=\"https://trino.io/slack\">ask on Slack</a>.</p>\n  </div>\n</article>\n</div>"
---

As we previously announced, we’re
rebranding Presto SQL as Trino.
Now comes the hard part: migrating to the new version of the software.
We just released the first version,
Trino 351,
which uses the name Trino everywhere, both internally and externally.
Unfortunately, there are some unavoidable compatibility aspects that
administrators of Trino need to know about. We hope this post makes the
transition as smooth as possible.
Things that haven’t changed
Let’s start with the good news. For end users running queries against Trino,
everything should be the same. There are no changes to the SQL language,
SQL functions, session properties, etc.
Users now see Trino in error messages, a different logo in the web UI,
and error stack traces have a different package name, but otherwise they
won’t know that anything has changed. All of their views, reports,
or other stored queries will work as before.
Similarly for administrators, except for a few things noted in the
Trino 351 release notes,
all the configuration properties are the same.
Client protocol compatiblity
The client protocol is how clients, such as the
CLI or
JDBC driver,
talk to Trino. It uses standard HTTP as the underlying communications
protocol, with some custom HTTP headers to communicate values
to and from Trino. Unfortunately, those header names started with
X-Presto- and thus had to be changed to X-Trino-.
The Trino CLI and JDBC driver send the new headers, so they are
only compatible with Trino versions 351 and newer. Users should
wait to upgrade the CLI or JDBC driver until the Trino servers they
talk to have been upgraded.
Out of the box, the Trino server does not work with older clients.
However, in order to support a graceful transition, you can allow the
server to support older clients by adding a configuration property:

protocol.v1.alternate-header-name=Presto


We recommend using version 350 of CLI and JDBC driver as the transition version.
It has all the newest features such as variable precision timestamps,
has been tested with a range of older server versions, and is the last
version to support older servers.
JDBC driver
The URL prefix for the JDBC driver now starts with jdbc:trino: instead
of jdbc:presto:. This means that any client applications using the
JDBC driver need to update their connection configuration. The old
prefix is still supported, but will be removed in a future release.
The class name of the driver is now io.trino.jdbc.TrinoDriver. This is
of no concern to most users, as the driver is normally accessed via the
standard JDBC auto-discovery mechanism based on the URL. As with the URL prefix,
the old name is still supported, but will be removed in a future release.
Server RPM
The name of the RPM has changed, so it is treated as a different RPM, and
thus you cannot simply upgrade from the old version to the new version.
All of the directories for the RPM that contained the name presto now
use trino instead. You likely want to uninstall the old RPM, rename
the config and log directories, then install the new RPM.
Docker image
The Trino Docker image is now
published as trinodb/trino. The supported configuration directory is
now /etc/trino. The CLI is now named trino instead of presto.
JMX MBean naming
Trino runs on the JVM, which has the JMX framework as a standard way to expose
system and application metrics. Trino exposes a huge number of JMX metrics for
administrators to monitor their clusters. You might be using these metrics
via your monitoring system, or perhaps you are accessing them in SQL via the
Trino JMX connector.
The metrics for Trino server now start with trino instead of presto. You
might need to update this name in your monitoring system, or you can revert
to the old name:

jmx.base-name=presto


Similarly, the metrics for the Elasticsearch, Hive, Iceberg, Raptor, and Thrift
connectors now start with trino.plugin instead of presto.plugin. Again,
you might need to update these names in your monitoring system, or you can
revert to the old name. For example, for the Hive connector:

jmx.base-name=presto.plugin.hive


Thrift connector
The Thrift connector had many
backwards incompatible changes
to both the Thrift service interface and the configuration properties. You need
update all of your implementations of the Thrift service used by the connector.
SPI
If you have any custom plugins for Trino, such as connectors or functions,
these need to be updated. The package name is now io.trino.spi, and a
few classes were renamed:
PrestoException to TrinoException
PrestoPrincipal to TrinoPrincipal
PrestoWarning to TrinoWarning
There are no functional changes, so all you should need to do is update
your imports and rename the references to the above class names.
Migration guide
Now that you understand what is different and what you need to change,
you can start thinking about the list of steps needed to perform the
migration. The following is a rough plan for upgrading your environment.
Step 1: Prepare to deploy the new version
Let users know the name is changing, so they are not surprised by the logo changes in the UI.
Make sure that users are using recent client versions. Ideally, upgrade them all to
version 350, as mentioned above. You can check the HTTP request logs for the coordinator
to see what client versions are in use.
Update your server configuration with protocol.v1.alternate-header-name=Presto
to allow supporting all of your existing Presto clients.
If you are using the RPM, have a plan to deal with the new RPM name
and the trino directory names.
If you are using Docker, use the new image name, make sure your configuration will
be mounted using the trino path name, and remember that the CLI is now named trino.
Update any custom plugins to use the new SPI.
Check if you have anything using JMX to monitor your clusters, and decide if you will
update them to the new names or set a Trino config to revert to the old names.
Step 2: Upgrade your servers to Trino 351+
Upgrade development and staging servers.
Upgrade production servers. If you have multiple clusters, you can do them one
at a time, and verify everything is working before moving on to the next one.
Step 3: Upgrade clients
Upgrade all clients including the CLI, JDBC driver, Python, etc., to the Trino versions.
Update any applications using JDBC to use the new jdbc:trino: connection URL prefix.
Step 4: Cleanup
Remove the protocol.v1.alternate-header-name configuration property.
If you configured Trino to use the old JMX names, convert your monitoring system
to use the new JMX names and remove the fallback configs.
Getting help
We’re here to help! If you run into any issues while upgrading, or having any
questions or concerns, ask on Slack.
