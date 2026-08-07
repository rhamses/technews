---
title: "plRuby"
link: "https://www.postgresql.org/about/news/plruby-3349/"
guid: "https://www.postgresql.org/about/news/plruby-3349/"
pubDate: "2026-07-31T00:00:00.000Z"
site_name: "PostgreSQL"
site_feed: "https://www.postgresql.org/news.rss"
category: "Infra"
summary: "PL/Ruby is a procedural-language handler that lets you write database functions\nin Ruby, stored and executed inside PostgreSQL. You get the expressiveness\nof Ruby and its standard library with the full power of a native PostgreSQL\nfunction: plain functions, set-returning functions, triggers, event triggers,\nand procedures with transaction control.\n```sql\nCREATE EXTENSION plruby;\nCREATE FUNCTION hello(text) RETURNS text LANGUAGE plruby AS $$\n    \"Hello, #{args[0]}!\"\n$$;\nSELECT hello('world');   -- Hello, world!\n```\n[!NOTE]\nPL/Ruby embeds an MRI Ruby interpreter in the backend. It targets PostgreSQL\n11-18 and Ruby 3.x, installs as a first-class CREATE EXTENSION, and\nmirrors the feature set of PL/php with a large set of PL/Perl- and\nPL/Tcl-inspired capabilities.\nFeatures\n| Scalars, arrays, composites | Arguments arrive as native Ruby values: Integer, Float, true/false, String, nested Array, and composite/record types as Hash. |\n| Set-returning functions | RETURNS SETOF / RETURNS TABLE with return_next. |\n| Triggers | Row & statement triggers via $_TD \n|Event triggers | Back CREATE EVENT TRIGGER with RETURNS event_trigger. |\n|Database access (SPI) | spi_exec, spi_fetch_row, spi_processed, spi_status, spi_rewind, and result column metadata (spi_colnames / spi_coltypes / spi_coltypmods). |\n|Cursor streaming | spi_query (block or handle), spi_fetchrow, spi_cursor_close, Cursor#each. Consume large results without materializing them. |\n|Prepared statements | spi_prepare / spi_exec_prepared / spi_query_prepared / spi_freeplan. |\n|Transaction control | spi_commit / spi_rollback in procedures, plus subtransaction blocks. |\n| Utilities | quote_literal / quote_nullable / quote_ident, elog, session-shared $_SHARED, and per-function $_SD. |\n| Session setup | Anonymous DO blocks, plruby_modules autoloading, and a plruby.start_proc hook. |\n| Transforms | jsonb_plruby, hstore_plruby, and ltree_plruby: functions declared TRANSFORM FOR TYPE exchange native Ruby Hashes/Arrays with jsonb, hstore, and ltree. |\nSee the language reference for the full API, the\ncookbook for tested recipes, and the\nPL/Perl and PL/Tcl\ncomparisons for feature-by-feature detail.\nExamples\nA set-returning function\n```sql\nCREATE FUNCTION squares(lim integer)\nRETURNS TABLE(n integer, square integer) LANGUAGE plruby AS $$\n    (1..lim).each do |i|\n        n = i\n        square = i * i\n        return_next\n    end\n$$;\nSELECT * FROM squares(3);   -- (1,1), (2,4), (3,9)\n```\nQuerying the database with a prepared plan\nsql\nCREATE FUNCTION lookup(int) RETURNS text LANGUAGE plruby AS $$\n    plan = spi_prepare('select name from things where id = $1', 'int4')\n    row  = spi_fetch_row(spi_exec_prepared(plan, args[0]))\n    spi_freeplan(plan)\n    row['name']\n$$;\nA row trigger that transforms data\nsql\nCREATE FUNCTION uppercase_name() RETURNS trigger LANGUAGE plruby AS $$\n    $_TD['new']['name'] = $_TD['new']['name'].upcase\n    'MODIFY'\n$$;\nRequirements\nPostgreSQL 11 or newer (tested on 11-18; 18 recommended), with the server\n  development files that provide pg_config.\nRuby 3.x built as a shared library (ENABLE_SHARED=yes) with development\n  headers. On Debian/Ubuntu, install ruby-dev.\nInstallation\nsh\nmake\nsudo make install\nThen, in a database:\nsql\nCREATE EXTENSION plruby;\nSee INSTALL for details, and run the regression suite with\nmake installcheck.\nSecurity\n[!WARNING]\nPL/Ruby is an untrusted language. Ruby 3.0 and later have no sandbox\n($SAFE and object tainting were removed in Ruby 3.0), so a PL/Ruby function\ncan do anything the PostgreSQL server's operating-system user can: read and\nwrite files, open network connections, run shell commands, and so on.\nThe language is created without the TRUSTED attribute, so only superusers\ncan install the extension or create PL/Ruby functions. Grant that ability only\nto roles you would trust with the server's OS account.\nDocumentation\nLanguage reference\nCookbook: tested recipes\nPerformance benchmarks\nFeature comparison: PL/Ruby vs PL/php vs PL/Perl vs PL/Tcl\nPL/Ruby vs PL/Perl\nPL/Ruby vs PL/Tcl\nWhy PL/Ruby embeds CRuby (MRI), not mruby\nLicense\nPL/Ruby is licensed under the MIT License; see LICENSE."
contentHtml: "<div>\n<p>Posted on <strong>2026-07-31</strong> by Command Prompt, Inc</p>\n<p><span><i></i> Related Open Source</span>\n</p>\n<p>PL/Ruby is a procedural-language handler that lets you write database functions\nin <strong>Ruby</strong>, stored and executed inside PostgreSQL. You get the expressiveness\nof Ruby and its standard library with the full power of a native PostgreSQL\nfunction: plain functions, set-returning functions, triggers, event triggers,\nand procedures with transaction control.</p>\n<p>```sql\nCREATE EXTENSION plruby;</p>\n<p>CREATE FUNCTION hello(text) RETURNS text LANGUAGE plruby AS $$\n    \"Hello, #{args[0]}!\"\n$$;</p>\n<p>SELECT hello('world');   -- Hello, world!\n```</p>\n<blockquote>\n<p>[!NOTE]\nPL/Ruby embeds an MRI Ruby interpreter in the backend. It targets <strong>PostgreSQL\n11-18</strong> and <strong>Ruby 3.x</strong>, installs as a first-class <code>CREATE EXTENSION</code>, and\nmirrors the feature set of PL/php with a large set of PL/Perl- and\nPL/Tcl-inspired capabilities.</p>\n</blockquote>\n<hr>\n<h2>Features</h2>\n<p>| <strong>Scalars, arrays, composites</strong> | Arguments arrive as native Ruby values: <code>Integer</code>, <code>Float</code>, <code>true</code>/<code>false</code>, <code>String</code>, nested <code>Array</code>, and composite/record types as <code>Hash</code>. |</p>\n<p>| <strong>Set-returning functions</strong> | <code>RETURNS SETOF</code> / <code>RETURNS TABLE</code> with <code>return_next</code>. |</p>\n<p>| <strong>Triggers</strong> | Row &amp; statement triggers via <code>$_TD</code> </p>\n<p>|<strong>Event triggers</strong> | Back <code>CREATE EVENT TRIGGER</code> with <code>RETURNS event_trigger</code>. |</p>\n<p>|<strong>Database access (SPI)</strong> | <code>spi_exec</code>, <code>spi_fetch_row</code>, <code>spi_processed</code>, <code>spi_status</code>, <code>spi_rewind</code>, and result column metadata (<code>spi_colnames</code> / <code>spi_coltypes</code> / <code>spi_coltypmods</code>). |</p>\n<p>|<strong>Cursor streaming</strong> | <code>spi_query</code> (block or handle), <code>spi_fetchrow</code>, <code>spi_cursor_close</code>, <code>Cursor#each</code>. Consume large results without materializing them. |</p>\n<p>|<strong>Prepared statements</strong> | <code>spi_prepare</code> / <code>spi_exec_prepared</code> / <code>spi_query_prepared</code> / <code>spi_freeplan</code>. |</p>\n<p>|<strong>Transaction control</strong> | <code>spi_commit</code> / <code>spi_rollback</code> in procedures, plus <code>subtransaction</code> blocks. |</p>\n<p>| <strong>Utilities</strong> | <code>quote_literal</code> / <code>quote_nullable</code> / <code>quote_ident</code>, <code>elog</code>, session-shared <code>$_SHARED</code>, and per-function <code>$_SD</code>. |</p>\n<p>| <strong>Session setup</strong> | Anonymous <code>DO</code> blocks, <code>plruby_modules</code> autoloading, and a <code>plruby.start_proc</code> hook. |</p>\n<p>| <strong>Transforms</strong> | <code>jsonb_plruby</code>, <code>hstore_plruby</code>, and <code>ltree_plruby</code>: functions declared <code>TRANSFORM FOR TYPE</code> exchange native Ruby Hashes/Arrays with <code>jsonb</code>, <code>hstore</code>, and <code>ltree</code>. |</p>\n<p>See the <a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/plruby.md\"><strong>language reference</strong></a> for the full API, the\n<a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/cookbook.md\"><strong>cookbook</strong></a> for tested recipes, and the\n<a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/plperl-comparison.md\">PL/Perl</a> and <a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/\">PL/Tcl</a>\ncomparisons for feature-by-feature detail.</p>\n<h2>Examples</h2>\n<p><strong>A set-returning function</strong></p>\n<p>```sql\nCREATE FUNCTION squares(lim integer)\nRETURNS TABLE(n integer, square integer) LANGUAGE plruby AS $$\n    (1..lim).each do |i|\n        n = i\n        square = i * i\n        return_next\n    end\n$$;</p>\n<p>SELECT * FROM squares(3);   -- (1,1), (2,4), (3,9)\n```</p>\n<p><strong>Querying the database with a prepared plan</strong></p>\n<p><code>sql\nCREATE FUNCTION lookup(int) RETURNS text LANGUAGE plruby AS $$\n    plan = spi_prepare('select name from things where id = $1', 'int4')\n    row  = spi_fetch_row(spi_exec_prepared(plan, args[0]))\n    spi_freeplan(plan)\n    row['name']\n$$;</code></p>\n<p><strong>A row trigger that transforms data</strong></p>\n<p><code>sql\nCREATE FUNCTION uppercase_name() RETURNS trigger LANGUAGE plruby AS $$\n    $_TD['new']['name'] = $_TD['new']['name'].upcase\n    'MODIFY'\n$$;</code></p>\n<h2>Requirements</h2>\n<ul>\n<li><strong>PostgreSQL 11 or newer</strong> (tested on 11-18; 18 recommended), with the server\n  development files that provide <code>pg_config</code>.</li>\n<li><strong>Ruby 3.x</strong> built as a shared library (<code>ENABLE_SHARED=yes</code>) with development\n  headers. On Debian/Ubuntu, install <code>ruby-dev</code>.</li>\n</ul>\n<h2>Installation</h2>\n<p><code>sh\nmake\nsudo make install</code></p>\n<p>Then, in a database:</p>\n<p><code>sql\nCREATE EXTENSION plruby;</code></p>\n<p>See <a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/INSTALL\"><strong>INSTALL</strong></a> for details, and run the regression suite with\n<code>make installcheck</code>.</p>\n<h2>Security</h2>\n<blockquote>\n<p>[!WARNING]\n<strong>PL/Ruby is an untrusted language.</strong> Ruby 3.0 and later have no sandbox\n(<code>$SAFE</code> and object tainting were removed in Ruby 3.0), so a PL/Ruby function\ncan do anything the PostgreSQL server's operating-system user can: read and\nwrite files, open network connections, run shell commands, and so on.</p>\n</blockquote>\n<p>The language is created <strong>without</strong> the <code>TRUSTED</code> attribute, so only superusers\ncan install the extension or create PL/Ruby functions. Grant that ability only\nto roles you would trust with the server's OS account.</p>\n<h2>Documentation</h2>\n<ul>\n<li><a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/plruby.md\">Language reference</a></li>\n<li><a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/cookbook.md\">Cookbook: tested recipes</a></li>\n<li><a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/benchmark.md\">Performance benchmarks</a></li>\n<li><a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/comparison.md\">Feature comparison: PL/Ruby vs PL/php vs PL/Perl vs PL/Tcl</a></li>\n<li><a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/plperl-comparison.md\">PL/Ruby vs PL/Perl</a></li>\n<li><a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/pltcl-comparison.md\">PL/Ruby vs PL/Tcl</a></li>\n<li><a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/doc/why-not-mruby.md\">Why PL/Ruby embeds CRuby (MRI), not mruby</a></li>\n</ul>\n<h2>License</h2>\n<p>PL/Ruby is licensed under the <strong>MIT License</strong>; see <a target=\"_blank\" href=\"https://github.com/commandprompt/plruby/blob/master/LICENSE\">LICENSE</a>.</p>\n      </div>"
---

PL/Ruby is a procedural-language handler that lets you write database functions
in Ruby, stored and executed inside PostgreSQL. You get the expressiveness
of Ruby and its standard library with the full power of a native PostgreSQL
function: plain functions, set-returning functions, triggers, event triggers,
and procedures with transaction control.
```sql
CREATE EXTENSION plruby;
CREATE FUNCTION hello(text) RETURNS text LANGUAGE plruby AS $$
    "Hello, #{args[0]}!"
$$;
SELECT hello('world');   -- Hello, world!
```
[!NOTE]
PL/Ruby embeds an MRI Ruby interpreter in the backend. It targets PostgreSQL
11-18 and Ruby 3.x, installs as a first-class CREATE EXTENSION, and
mirrors the feature set of PL/php with a large set of PL/Perl- and
PL/Tcl-inspired capabilities.
Features
| Scalars, arrays, composites | Arguments arrive as native Ruby values: Integer, Float, true/false, String, nested Array, and composite/record types as Hash. |
| Set-returning functions | RETURNS SETOF / RETURNS TABLE with return_next. |
| Triggers | Row & statement triggers via $_TD 
|Event triggers | Back CREATE EVENT TRIGGER with RETURNS event_trigger. |
|Database access (SPI) | spi_exec, spi_fetch_row, spi_processed, spi_status, spi_rewind, and result column metadata (spi_colnames / spi_coltypes / spi_coltypmods). |
|Cursor streaming | spi_query (block or handle), spi_fetchrow, spi_cursor_close, Cursor#each. Consume large results without materializing them. |
|Prepared statements | spi_prepare / spi_exec_prepared / spi_query_prepared / spi_freeplan. |
|Transaction control | spi_commit / spi_rollback in procedures, plus subtransaction blocks. |
| Utilities | quote_literal / quote_nullable / quote_ident, elog, session-shared $_SHARED, and per-function $_SD. |
| Session setup | Anonymous DO blocks, plruby_modules autoloading, and a plruby.start_proc hook. |
| Transforms | jsonb_plruby, hstore_plruby, and ltree_plruby: functions declared TRANSFORM FOR TYPE exchange native Ruby Hashes/Arrays with jsonb, hstore, and ltree. |
See the language reference for the full API, the
cookbook for tested recipes, and the
PL/Perl and PL/Tcl
comparisons for feature-by-feature detail.
Examples
A set-returning function
```sql
CREATE FUNCTION squares(lim integer)
RETURNS TABLE(n integer, square integer) LANGUAGE plruby AS $$
    (1..lim).each do |i|
        n = i
        square = i * i
        return_next
    end
$$;
SELECT * FROM squares(3);   -- (1,1), (2,4), (3,9)
```
Querying the database with a prepared plan
sql
CREATE FUNCTION lookup(int) RETURNS text LANGUAGE plruby AS $$
    plan = spi_prepare('select name from things where id = $1', 'int4')
    row  = spi_fetch_row(spi_exec_prepared(plan, args[0]))
    spi_freeplan(plan)
    row['name']
$$;
A row trigger that transforms data
sql
CREATE FUNCTION uppercase_name() RETURNS trigger LANGUAGE plruby AS $$
    $_TD['new']['name'] = $_TD['new']['name'].upcase
    'MODIFY'
$$;
Requirements
PostgreSQL 11 or newer (tested on 11-18; 18 recommended), with the server
  development files that provide pg_config.
Ruby 3.x built as a shared library (ENABLE_SHARED=yes) with development
  headers. On Debian/Ubuntu, install ruby-dev.
Installation
sh
make
sudo make install
Then, in a database:
sql
CREATE EXTENSION plruby;
See INSTALL for details, and run the regression suite with
make installcheck.
Security
[!WARNING]
PL/Ruby is an untrusted language. Ruby 3.0 and later have no sandbox
($SAFE and object tainting were removed in Ruby 3.0), so a PL/Ruby function
can do anything the PostgreSQL server's operating-system user can: read and
write files, open network connections, run shell commands, and so on.
The language is created without the TRUSTED attribute, so only superusers
can install the extension or create PL/Ruby functions. Grant that ability only
to roles you would trust with the server's OS account.
Documentation
Language reference
Cookbook: tested recipes
Performance benchmarks
Feature comparison: PL/Ruby vs PL/php vs PL/Perl vs PL/Tcl
PL/Ruby vs PL/Perl
PL/Ruby vs PL/Tcl
Why PL/Ruby embeds CRuby (MRI), not mruby
License
PL/Ruby is licensed under the MIT License; see LICENSE.
