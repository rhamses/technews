---
title: "Share your best Trino SQL routine"
link: "https://trino.io/blog/2023/11/09/routines.html"
guid: "https://trino.io/blog/2023/11/09/routines.html"
pubDate: "2023-11-09T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "We want to see the best SQL routines\nyou can write, feature them as examples in the\ndocumentation, and send you\nsome goodies as a reward!\nWith the recent Trino 431\nrelease we shipped a\nfeature that has been awaited by many Trino users for a long, long time. SQL\nroutines are an easy way to define our\nown procedural, custom functions. All users on your Trino instance can then use\nthat function in their queries and enjoy the new feature to simplify their\nqueries.\nThe new process of writing a routine in your client tool in SQL can be used as\nalternative to the old way of having to create a custom plugin in Java,\ncompiling it, and getting the binary deployed in your cluster. The time it takes\nto use a function has gone from hours to minutes and a few commands!\nOur documentation includes details for all the supported statements:\nBEGIN\nCASE\nDECLARE\nFUNCTION\nIF\nITERATE\nLEAVE\nLOOP\nREPEAT\nRETURN\nSET\nWHILE\nWith the memory connector and the Hive connector supporting routine storage, you\ncan use CREATE FUNCTION and DROP FUNCTION, so that everyone using the\ncluster has access to your routines.\nThe unit tests and our examples\ndocumentation contain a\nnumber of routines that scratch the surface of what is possible. Now, we are\nlooking for you to help us improve the documentation and maybe even find some\nbugs. So here is what we are asking from you:\nUpgrade your Trino cluster, CLI, and other clients to 431 or newer. Support in\nclient tools may vary.\nLearn from the documentation and write your own routines.\nSend us your best SQL routine.\n    \nCreate a pull request to add to the examples in the\ndocumentation\nwith a new section, and request a review from Manfred\n(mosabua)\nAlternatively, email the details and submit a\nCLA separately.\nExplain the use case, what the routine does, and maybe also how it works.\nInclude the full statement for the CREATE FUNCTION definition and an example\ninvocation.\nAdd any necessary tables or data so we can test the function.\nReach out to us on the Trino community Slack,\nif you need any help.\nWe plan to present submissions at Trino Summit 2023, write a blog post, add them to\nthe documentation, and Starburst will send a cool\nreward for the ten best entries.\nAlso, if you have more great Trino usage to talk about and share, we would love\nto see your speaker proposal for Trino\nSummit.\nWe look forward to seeing many great submissions from you all.\nSee you at Trino Summit 2023, and don’t forget to\nregister.\nMartin, Dain, David, and Manfred"
author: "Martin Traverso, Dain Sundstrom, David Phillips, Manfred Moser"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/trino-sql-routine.png\">\n    </p>\n    <p>We want to see the best <a target=\"_blank\" href=\"https://trino.io/docs/current/routines.html\">SQL routines</a>\nyou can write, feature them as <a target=\"_blank\" href=\"https://trino.io/docs/current/routines/examples.html\">examples in the\ndocumentation</a>, and send you\nsome goodies as a reward!</p>\n<!--more-->\n<p>With the recent <a target=\"_blank\" href=\"https://trino.io/docs/current/release/release-431.html\">Trino 431\nrelease</a> we shipped a\nfeature that has been awaited by many Trino users for a long, long time. <a target=\"_blank\" href=\"https://trino.io/docs/current/routines.html\">SQL\nroutines</a> are an easy way to define our\nown procedural, custom functions. All users on your Trino instance can then use\nthat function in their queries and enjoy the new feature to simplify their\nqueries.</p>\n<p>The new process of writing a routine in your client tool in SQL can be used as\nalternative to the old way of having to create a custom plugin in Java,\ncompiling it, and getting the binary deployed in your cluster. The time it takes\nto use a function has gone from hours to minutes and a few commands!</p>\n<p>Our documentation includes details for all the supported statements:</p>\n<ul>\n  <li><code>BEGIN</code></li>\n  <li><code>CASE</code></li>\n  <li><code>DECLARE</code></li>\n  <li><code>FUNCTION</code></li>\n  <li><code>IF</code></li>\n  <li><code>ITERATE</code></li>\n  <li><code>LEAVE</code></li>\n  <li><code>LOOP</code></li>\n  <li><code>REPEAT</code></li>\n  <li><code>RETURN</code></li>\n  <li><code>SET</code></li>\n  <li><code>WHILE</code></li>\n</ul>\n<p>With the memory connector and the Hive connector supporting routine storage, you\ncan use <code>CREATE FUNCTION</code> and <code>DROP FUNCTION</code>, so that everyone using the\ncluster has access to your routines.</p>\n<p>The unit tests and our <a target=\"_blank\" href=\"https://trino.io/docs/current/routines/examples.html\">examples\ndocumentation</a> contain a\nnumber of routines that scratch the surface of what is possible. Now, we are\nlooking for you to help us improve the documentation and maybe even find some\nbugs. So here is what we are asking from you:</p>\n<ul>\n  <li>Upgrade your Trino cluster, CLI, and other clients to 431 or newer. Support in\nclient tools may vary.</li>\n  <li>Learn from the documentation and write your own routines.</li>\n  <li>Send us your best SQL routine.\n    <ul>\n      <li>Create a pull request to add to the <a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/master/docs/src/main/sphinx/routines/examples.md\">examples in the\ndocumentation</a>\nwith a new section, and request a review from <a target=\"_blank\" href=\"https://github.com/mosabua\">Manfred\n(mosabua)</a></li>\n      <li>Alternatively, <a target=\"_blank\" href=\"https://trino.io/cdn-cgi/l/email-protection#a3cec2cdc5d1c6c7e3d0d7c2d1c1d6d1d0d78dcacc\">email the details</a> and submit a\n<a target=\"_blank\" href=\"https://github.com/trinodb/cla\">CLA</a> separately.</li>\n    </ul>\n  </li>\n  <li>Explain the use case, what the routine does, and maybe also how it works.</li>\n  <li>Include the full statement for the <code>CREATE FUNCTION</code> definition and an example\ninvocation.</li>\n  <li>Add any necessary tables or data so we can test the function.</li>\n  <li>Reach out to us on the <a target=\"_blank\" href=\"https://trino.io/slack\">Trino community Slack</a>,\nif you need any help.</li>\n</ul>\n<p>We plan to present submissions at <a target=\"_blank\" href=\"https://trino.io/blog/2023/09/14/trino-summit-2023-announcement\">Trino Summit 2023</a>, write a blog post, add them to\nthe documentation, and <a target=\"_blank\" href=\"https://www.starburst.io/\">Starburst</a> will send a cool\nreward for the ten best entries.</p>\n<p>Also, if you have more great Trino usage to talk about and share, we would love\nto see your <a target=\"_blank\" href=\"https://sessionize.com/trino-summit-2023/\">speaker proposal for Trino\nSummit</a>.</p>\n<p>We look forward to seeing many great submissions from you all.</p>\n<p>See you at Trino Summit 2023, and don’t forget to\n<a target=\"_blank\" href=\"https://www.starburst.io/info/trinosummit2023/?utm_source=trino&utm_medium=website&utm_campaign=NORAM-FY24-Q4-EV-Trino-Summit-2023&utm_content=blog-1\">register</a>.</p>\n<p><em>Martin, Dain, David, and Manfred</em></p>\n  </div>\n</article>\n</div>"
---

We want to see the best SQL routines
you can write, feature them as examples in the
documentation, and send you
some goodies as a reward!
With the recent Trino 431
release we shipped a
feature that has been awaited by many Trino users for a long, long time. SQL
routines are an easy way to define our
own procedural, custom functions. All users on your Trino instance can then use
that function in their queries and enjoy the new feature to simplify their
queries.
The new process of writing a routine in your client tool in SQL can be used as
alternative to the old way of having to create a custom plugin in Java,
compiling it, and getting the binary deployed in your cluster. The time it takes
to use a function has gone from hours to minutes and a few commands!
Our documentation includes details for all the supported statements:
BEGIN
CASE
DECLARE
FUNCTION
IF
ITERATE
LEAVE
LOOP
REPEAT
RETURN
SET
WHILE
With the memory connector and the Hive connector supporting routine storage, you
can use CREATE FUNCTION and DROP FUNCTION, so that everyone using the
cluster has access to your routines.
The unit tests and our examples
documentation contain a
number of routines that scratch the surface of what is possible. Now, we are
looking for you to help us improve the documentation and maybe even find some
bugs. So here is what we are asking from you:
Upgrade your Trino cluster, CLI, and other clients to 431 or newer. Support in
client tools may vary.
Learn from the documentation and write your own routines.
Send us your best SQL routine.
    
Create a pull request to add to the examples in the
documentation
with a new section, and request a review from Manfred
(mosabua)
Alternatively, email the details and submit a
CLA separately.
Explain the use case, what the routine does, and maybe also how it works.
Include the full statement for the CREATE FUNCTION definition and an example
invocation.
Add any necessary tables or data so we can test the function.
Reach out to us on the Trino community Slack,
if you need any help.
We plan to present submissions at Trino Summit 2023, write a blog post, add them to
the documentation, and Starburst will send a cool
reward for the ten best entries.
Also, if you have more great Trino usage to talk about and share, we would love
to see your speaker proposal for Trino
Summit.
We look forward to seeing many great submissions from you all.
See you at Trino Summit 2023, and don’t forget to
register.
Martin, Dain, David, and Manfred
