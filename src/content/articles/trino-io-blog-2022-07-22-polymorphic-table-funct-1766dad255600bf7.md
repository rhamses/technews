---
title: "Diving into polymorphic table functions with Trino"
link: "https://trino.io/blog/2022/07/22/polymorphic-table-functions.html"
guid: "https://trino.io/blog/2022/07/22/polymorphic-table-functions.html"
pubDate: "2022-07-22T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "In the Trino community, we know that being the coolest query engine is a tough\njob. We boldly face the intricacies of the SQL standard to bring you the newest\nand most powerful features. Today, we proudly announce that as of release 381,\nTrino is on its way to full support for polymorphic table functions (PTFs).\nIn this blog post, we are explaining the concept of table functions and \nexploring how they can be leveraged. We also look at what we have already \nimplemented, and take a sneak peek into the future.\nDefinition time\nThere are several kinds of functions you can call in a SQL query: scalar\nfunctions, aggregate functions, and window functions. They might process the\ninput row by row (scalar) or all at once (aggregate). One thing they have in\ncommon is that they return scalar values. Table functions are different. They\nreturn tables. In a query, they can appear in any place where a table reference\nshows up such as a FROM clause:\n\nSELECT\n  *\nFROM\n  TABLE(my_table_function('foo'));\n\n\nYou can also use table functions in joins:\n\nSELECT\n  *\nFROM\n  TABLE(my_table_function('bar'))\nJOIN\n  TABLE(another_table_function(1, 2, 3))\nON true;\n\n\nPolymorphic table functions (PTFs) are a subset of table functions where the\nschema of the returned table is determined dynamically. The returned table\nschema can depend on the arguments you pass to the function.\nOK, but why are we so excited?\nWe are excited because this feature is a real game changer! Polymorphic table\nfunctions make SQL extensible, provide a framework for processing data in\npreviously impossible ways, and can act as a bridge between the Trino engine and\nexternal systems or resources you might need for processing your data.\nAdditionally, polymorphic table functions are standard SQL, and they are very\nconvenient to use.\nWhat is available in Trino today?\nSo far, we have added a framework for table functions which can be executed by\nthe connector. Although this is not the full PTF feature yet, we couldn’t wait\nto bring it to life. We added query pass-through table functions for JDBC-based\nconnectors and ElasticSearch. They mostly go by the name query, and they take\na single argument, that being the query text:\n\nSELECT\n  *\nFROM\n  TABLE(\n    postgresql.system.query(query =>\n        'SELECT\n          name\n        FROM\n          tpch.nation\n        WHERE\n          nationkey = 0'\n    )\n  );\n\n\nAnd this will return:\n\n  name\n---------\n ALGERIA\n(1 row)\n\n\nSomething you can’t notice from that example is that when you’re passing that\n“query” argument, it’s taking the entire query and having PostgreSQL execute it.\nWhatever connector you’re using, the query argument you pass needs to be written\nso that it works on the underlying database. On the opposite and more exciting\nside of that, if you have a legacy query specific to a database which has\nnon-standard SQL syntax and would be difficult to rewrite for Trino, now you can\npass that entire query down to the connector by wrapping it in the query\nfunction, skipping the need to migrate it.\nBesides PostgreSQL, the query table function has equivalent implementations\nfor Druid, MySQL, Oracle, Redshift, SQL Server, MariaDB, and SingleStore.\nElasticSearch has a similar function called raw_query. You can check out the\nTrino docs for each supported connector\nfor full details.\nBut while we’re here, another cool example to showcase is using query\npass-through to take advantage the MODEL clause in Oracle:\n\nSELECT\n  SUBSTR(country, 1, 20) country,\n  SUBSTR(product, 1, 15) product,\n  year,\n  sales\nFROM\n  TABLE(\n    oracle.system.query(\n      query => 'SELECT\n        *\n      FROM\n        sales_view\n      MODEL\n        RETURN UPDATED ROWS\n        MAIN\n          simple_model\n        PARTITION BY\n          country\n        MEASURES\n          sales\n        RULES\n          (sales['Bounce', 2001] = 1000,\n          sales['Bounce', 2002] = sales['Bounce', 2001] + sales['Bounce', 2000],\n          sales['Y Box', 2002] = sales['Y Box', 2001])\n      ORDER BY\n        country'\n    )\n  );\n\n\nYou can pass an entire query through to leverage a feature that isn’t a part of\nthe SQL standard, and with that MODEL clause, Oracle can do some fancy\nmultidimensional array processing for you right then and there, returning the\nresults as a table back into Trino. We don’t want to get too sidetracked delving\ninto the specifics of non-Trino tech, so if you want to learn more about what\nyou can do, check out the connectors you use, and see what cool possibilities\nare out there!\nWhat’s next?\nNow that we’ve discussed what PTFs are, how they work in Trino, and what they do\ntoday, it’s useful to look forward to what’s coming next. The next thing we’re\nworking on is adding the query function to BigQuery.\nBig ideas\nBeyond what’s currently planned, there’s a lot that polymorphic table functions\ncan do for us. One common function that engineers and analysts commonly request\nin Trino is PIVOT. This is a capability that dynamically groups different\nvalues of an input column and converts each value as a set of columns in the\noutput table. A potential use of PTFs would enable a PIVOT-like transformation\non data, which otherwise isn’t included in the standard SQL specification.\nAnother exciting potential is the ability to write scripts to transform or\ngenerate tables in popular languages like Python, Scala, or Javascript. These\ncan be used to add even more new capabilities that SQL is missing.\nLooking forward\nThe journey to full PTF support in Trino has just begun. A dedicated operator\nfor table functions is the next big thing. Right now, Trino can handle PTFs, but\nthey must be pushed down to the connector and executed there. The Trino engine\ndoes not yet know how to execute them. With an operator, the Trino engine will\nbe able to control and handle table function execution, and we will be able to\npass tables as arguments to table functions. This will unlock the full potential\nof PTFs in Trino, and empower Trino to solve a new class of problems and expand\nits potential for application in many new domains.\nIf you have any questions or ideas for table functions that you would find\nuseful, reach out to us on the Trino Slack, and\nwe would love to hear your thoughts and feedback. We’ll also be doing a Trino\nCommunity Broadcast on PTFs on July 28th @ 1pm EDT, so tune in then to have your\nquestions answered live!\nIf you want to learn more about how to implement PTFs, we are working on another\nblog post for you already.\nHappy querying!"
author: "Kasia Findeisen, Brian Olsen, and Cole Bowden"
contentHtml: "<div>\n<article>\n  <div><p>In the Trino community, we know that being the coolest query engine is a tough\njob. We boldly face the intricacies of the SQL standard to bring you the newest\nand most powerful features. Today, we proudly announce that as of release 381,\nTrino is on its way to full support for polymorphic table functions (PTFs).</p>\n<p>In this blog post, we are explaining the concept of table functions and \nexploring how they can be leveraged. We also look at what we have already \nimplemented, and take a sneak peek into the future.</p>\n<!--more-->\n<h3 id=\"definition-time\">\n    Definition time <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/22/polymorphic-table-functions.html#definition-time\">#</a>\n</h3>\n<p>There are several kinds of functions you can call in a SQL query: scalar\nfunctions, aggregate functions, and window functions. They might process the\ninput row by row (scalar) or all at once (aggregate). One thing they have in\ncommon is that they return scalar values. Table functions are different. They\nreturn tables. In a query, they can appear in any place where a table reference\nshows up such as a <code>FROM</code> clause:</p>\n<div><pre><code><span>SELECT</span>\n  <span>*</span>\n<span>FROM</span>\n  <span>TABLE</span><span>(</span><span>my_table_function</span><span>(</span><span>'foo'</span><span>));</span>\n</code></pre></div>\n<p>You can also use table functions in joins:</p>\n<div><pre><code><span>SELECT</span>\n  <span>*</span>\n<span>FROM</span>\n  <span>TABLE</span><span>(</span><span>my_table_function</span><span>(</span><span>'bar'</span><span>))</span>\n<span>JOIN</span>\n  <span>TABLE</span><span>(</span><span>another_table_function</span><span>(</span><span>1</span><span>,</span> <span>2</span><span>,</span> <span>3</span><span>))</span>\n<span>ON</span> <span>true</span><span>;</span>\n</code></pre></div>\n<p>Polymorphic table functions (PTFs) are a subset of table functions where the\nschema of the returned table is determined dynamically. The returned table\nschema can depend on the arguments you pass to the function.</p>\n<h3 id=\"ok-but-why-are-we-so-excited\">\n    OK, but why are we so excited? <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/22/polymorphic-table-functions.html#ok-but-why-are-we-so-excited\">#</a>\n</h3>\n<p>We are excited because this feature is a real game changer! Polymorphic table\nfunctions make SQL extensible, provide a framework for processing data in\npreviously impossible ways, and can act as a bridge between the Trino engine and\nexternal systems or resources you might need for processing your data.\nAdditionally, polymorphic table functions are standard SQL, and they are very\nconvenient to use.</p>\n<h3 id=\"what-is-available-in-trino-today\">\n    What is available in Trino today? <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/22/polymorphic-table-functions.html#what-is-available-in-trino-today\">#</a>\n</h3>\n<p>So far, we have added a framework for table functions which can be executed by\nthe connector. Although this is not the full PTF feature yet, we couldn’t wait\nto bring it to life. We added query pass-through table functions for JDBC-based\nconnectors and ElasticSearch. They mostly go by the name <code>query</code>, and they take\na single argument, that being the query text:</p>\n<div><pre><code><span>SELECT</span>\n  <span>*</span>\n<span>FROM</span>\n  <span>TABLE</span><span>(</span>\n    <span>postgresql</span><span>.</span><span>system</span><span>.</span><span>query</span><span>(</span><span>query</span> <span>=&gt;</span>\n        <span>'SELECT\n          name\n        FROM\n          tpch.nation\n        WHERE\n          nationkey = 0'</span>\n    <span>)</span>\n  <span>);</span>\n</code></pre></div>\n<p>And this will return:</p>\n<div><pre><code>  <span>name</span>\n<span>---------</span>\n <span>ALGERIA</span>\n<span>(</span><span>1</span> <span>row</span><span>)</span>\n</code></pre></div>\n<p>Something you can’t notice from that example is that when you’re passing that\n“query” argument, it’s taking the entire query and having PostgreSQL execute it.\nWhatever connector you’re using, the query argument you pass needs to be written\nso that it works on the underlying database. On the opposite and more exciting\nside of that, if you have a legacy query specific to a database which has\nnon-standard SQL syntax and would be difficult to rewrite for Trino, now you can\npass that entire query down to the connector by wrapping it in the <code>query</code>\nfunction, skipping the need to migrate it.</p>\n<p>Besides PostgreSQL, the <code>query</code> table function has equivalent implementations\nfor Druid, MySQL, Oracle, Redshift, SQL Server, MariaDB, and SingleStore.\nElasticSearch has a similar function called <code>raw_query</code>. You can check out the\n<a target=\"_blank\" href=\"https://trino.io/docs/current/connector.html\">Trino docs for each supported connector</a>\nfor full details.</p>\n<p>But while we’re here, another cool example to showcase is using query\npass-through to take advantage the <code>MODEL</code> clause in Oracle:</p>\n<div><pre><code><span>SELECT</span>\n  <span>SUBSTR</span><span>(</span><span>country</span><span>,</span> <span>1</span><span>,</span> <span>20</span><span>)</span> <span>country</span><span>,</span>\n  <span>SUBSTR</span><span>(</span><span>product</span><span>,</span> <span>1</span><span>,</span> <span>15</span><span>)</span> <span>product</span><span>,</span>\n  <span>year</span><span>,</span>\n  <span>sales</span>\n<span>FROM</span>\n  <span>TABLE</span><span>(</span>\n    <span>oracle</span><span>.</span><span>system</span><span>.</span><span>query</span><span>(</span>\n      <span>query</span> <span>=&gt;</span> <span>'SELECT\n        *\n      FROM\n        sales_view\n      MODEL\n        RETURN UPDATED ROWS\n        MAIN\n          simple_model\n        PARTITION BY\n          country\n        MEASURES\n          sales\n        RULES\n          (sales['</span><span>Bounce</span><span>', 2001] = 1000,\n          sales['</span><span>Bounce</span><span>', 2002] = sales['</span><span>Bounce</span><span>', 2001] + sales['</span><span>Bounce</span><span>', 2000],\n          sales['</span><span>Y</span> <span>Box</span><span>', 2002] = sales['</span><span>Y</span> <span>Box</span><span>', 2001])\n      ORDER BY\n        country'</span>\n    <span>)</span>\n  <span>);</span>\n</code></pre></div>\n<p>You can pass an entire query through to leverage a feature that isn’t a part of\nthe SQL standard, and with that <code>MODEL</code> clause, Oracle can do some fancy\nmultidimensional array processing for you right then and there, returning the\nresults as a table back into Trino. We don’t want to get too sidetracked delving\ninto the specifics of non-Trino tech, so if you want to learn more about what\nyou can do, check out the connectors you use, and see what cool possibilities\nare out there!</p>\n<h2 id=\"whats-next\">\n    What’s next? <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/22/polymorphic-table-functions.html#whats-next\">#</a>\n</h2>\n<p>Now that we’ve discussed what PTFs are, how they work in Trino, and what they do\ntoday, it’s useful to look forward to what’s coming next. The next thing we’re\nworking on is adding the <code>query</code> function to BigQuery.</p>\n<h3 id=\"big-ideas\">\n    Big ideas <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/22/polymorphic-table-functions.html#big-ideas\">#</a>\n</h3>\n<p>Beyond what’s currently planned, there’s a lot that polymorphic table functions\ncan do for us. One common function that engineers and analysts commonly request\nin Trino is <code>PIVOT</code>. This is a capability that dynamically groups different\nvalues of an input column and converts each value as a set of columns in the\noutput table. A potential use of PTFs would enable a PIVOT-like transformation\non data, which otherwise isn’t included in the standard SQL specification.</p>\n<p>Another exciting potential is the ability to write scripts to transform or\ngenerate tables in popular languages like Python, Scala, or Javascript. These\ncan be used to add even more new capabilities that SQL is missing.</p>\n<h3 id=\"looking-forward\">\n    Looking forward <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/22/polymorphic-table-functions.html#looking-forward\">#</a>\n</h3>\n<p>The journey to full PTF support in Trino has just begun. A dedicated operator\nfor table functions is the next big thing. Right now, Trino can handle PTFs, but\nthey must be pushed down to the connector and executed there. The Trino engine\ndoes not yet know how to execute them. With an operator, the Trino engine will\nbe able to control and handle table function execution, and we will be able to\npass tables as arguments to table functions. This will unlock the full potential\nof PTFs in Trino, and empower Trino to solve a new class of problems and expand\nits potential for application in many new domains.</p>\n<p>If you have any questions or ideas for table functions that you would find\nuseful, reach out to us on the <a target=\"_blank\" href=\"https://trino.io/slack\">Trino Slack</a>, and\nwe would love to hear your thoughts and feedback. We’ll also be doing a Trino\nCommunity Broadcast on PTFs on July 28th @ 1pm EDT, so tune in then to have your\nquestions answered live!</p>\n<p>If you want to learn more about how to implement PTFs, we are working on another\nblog post for you already.</p>\n<p>Happy querying!</p>\n  </div>\n</article>\n</div>"
---

In the Trino community, we know that being the coolest query engine is a tough
job. We boldly face the intricacies of the SQL standard to bring you the newest
and most powerful features. Today, we proudly announce that as of release 381,
Trino is on its way to full support for polymorphic table functions (PTFs).
In this blog post, we are explaining the concept of table functions and 
exploring how they can be leveraged. We also look at what we have already 
implemented, and take a sneak peek into the future.
Definition time
There are several kinds of functions you can call in a SQL query: scalar
functions, aggregate functions, and window functions. They might process the
input row by row (scalar) or all at once (aggregate). One thing they have in
common is that they return scalar values. Table functions are different. They
return tables. In a query, they can appear in any place where a table reference
shows up such as a FROM clause:

SELECT
  *
FROM
  TABLE(my_table_function('foo'));


You can also use table functions in joins:

SELECT
  *
FROM
  TABLE(my_table_function('bar'))
JOIN
  TABLE(another_table_function(1, 2, 3))
ON true;


Polymorphic table functions (PTFs) are a subset of table functions where the
schema of the returned table is determined dynamically. The returned table
schema can depend on the arguments you pass to the function.
OK, but why are we so excited?
We are excited because this feature is a real game changer! Polymorphic table
functions make SQL extensible, provide a framework for processing data in
previously impossible ways, and can act as a bridge between the Trino engine and
external systems or resources you might need for processing your data.
Additionally, polymorphic table functions are standard SQL, and they are very
convenient to use.
What is available in Trino today?
So far, we have added a framework for table functions which can be executed by
the connector. Although this is not the full PTF feature yet, we couldn’t wait
to bring it to life. We added query pass-through table functions for JDBC-based
connectors and ElasticSearch. They mostly go by the name query, and they take
a single argument, that being the query text:

SELECT
  *
FROM
  TABLE(
    postgresql.system.query(query =>
        'SELECT
          name
        FROM
          tpch.nation
        WHERE
          nationkey = 0'
    )
  );


And this will return:

  name
---------
 ALGERIA
(1 row)


Something you can’t notice from that example is that when you’re passing that
“query” argument, it’s taking the entire query and having PostgreSQL execute it.
Whatever connector you’re using, the query argument you pass needs to be written
so that it works on the underlying database. On the opposite and more exciting
side of that, if you have a legacy query specific to a database which has
non-standard SQL syntax and would be difficult to rewrite for Trino, now you can
pass that entire query down to the connector by wrapping it in the query
function, skipping the need to migrate it.
Besides PostgreSQL, the query table function has equivalent implementations
for Druid, MySQL, Oracle, Redshift, SQL Server, MariaDB, and SingleStore.
ElasticSearch has a similar function called raw_query. You can check out the
Trino docs for each supported connector
for full details.
But while we’re here, another cool example to showcase is using query
pass-through to take advantage the MODEL clause in Oracle:

SELECT
  SUBSTR(country, 1, 20) country,
  SUBSTR(product, 1, 15) product,
  year,
  sales
FROM
  TABLE(
    oracle.system.query(
      query => 'SELECT
        *
      FROM
        sales_view
      MODEL
        RETURN UPDATED ROWS
        MAIN
          simple_model
        PARTITION BY
          country
        MEASURES
          sales
        RULES
          (sales['Bounce', 2001] = 1000,
          sales['Bounce', 2002] = sales['Bounce', 2001] + sales['Bounce', 2000],
          sales['Y Box', 2002] = sales['Y Box', 2001])
      ORDER BY
        country'
    )
  );


You can pass an entire query through to leverage a feature that isn’t a part of
the SQL standard, and with that MODEL clause, Oracle can do some fancy
multidimensional array processing for you right then and there, returning the
results as a table back into Trino. We don’t want to get too sidetracked delving
into the specifics of non-Trino tech, so if you want to learn more about what
you can do, check out the connectors you use, and see what cool possibilities
are out there!
What’s next?
Now that we’ve discussed what PTFs are, how they work in Trino, and what they do
today, it’s useful to look forward to what’s coming next. The next thing we’re
working on is adding the query function to BigQuery.
Big ideas
Beyond what’s currently planned, there’s a lot that polymorphic table functions
can do for us. One common function that engineers and analysts commonly request
in Trino is PIVOT. This is a capability that dynamically groups different
values of an input column and converts each value as a set of columns in the
output table. A potential use of PTFs would enable a PIVOT-like transformation
on data, which otherwise isn’t included in the standard SQL specification.
Another exciting potential is the ability to write scripts to transform or
generate tables in popular languages like Python, Scala, or Javascript. These
can be used to add even more new capabilities that SQL is missing.
Looking forward
The journey to full PTF support in Trino has just begun. A dedicated operator
for table functions is the next big thing. Right now, Trino can handle PTFs, but
they must be pushed down to the connector and executed there. The Trino engine
does not yet know how to execute them. With an operator, the Trino engine will
be able to control and handle table function execution, and we will be able to
pass tables as arguments to table functions. This will unlock the full potential
of PTFs in Trino, and empower Trino to solve a new class of problems and expand
its potential for application in many new domains.
If you have any questions or ideas for table functions that you would find
useful, reach out to us on the Trino Slack, and
we would love to hear your thoughts and feedback. We’ll also be doing a Trino
Community Broadcast on PTFs on July 28th @ 1pm EDT, so tune in then to have your
questions answered live!
If you want to learn more about how to implement PTFs, we are working on another
blog post for you already.
Happy querying!
