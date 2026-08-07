---
title: "Trino and Javascript?! YES!"
link: "https://trino.io/blog/2024/11/18/javascript.html"
guid: "https://trino.io/blog/2024/11/18/javascript.html"
pubDate: "2024-11-18T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Trino is written in Java. Trino contributors and maintainers are often veterans\nin the Java ecosystem and community, and Trino is very modern when it comes to\nJava. For example, Trino now requires the latest Java version and actively uses\nnew features.\nWhen it comes to JavaScript however, the story is a bit more complicated. Of\ncourse, JavaScript is commonly used in the Trino ecosystem and codebase. Let’s\nlook at some of the specifics.\nClient driver and applications\nClient applications that allow users to submit queries to Trino, and then\nreceive the results are written in numerous languages. Trino has good support\nfor many of them.\nThanks to the collaboration with Filipe Regadas\nand the contribution of his JavaScript client driver to the Trino community, we\nnow have an official\ntrino-js-client project. After his\ninitial donation we have applied numerous improvements and recently cut our\nfirst release.\nThe client is already used in the VisualCode\nsupport, the Emacs\nsupport, the example project discussed\nin Trino Community Broadcast episode 63,\nand numerous other applications.\nAnd we have big plans as well:\nAdd support for more authentication methods supported in Trino\nImprove documentation and example projects\nAdd support for the new spooling client protocol from Trino\nTest with Trino Gateway and adjust as needed\nWhile this project is a great addition for many users of Trino and their custom\nweb applications, there are numerous other usages of JavaScript in the project.\nUser interfaces\nWeb-based user interfaces are one important use of JavaScript. Trino includes\nthe Trino Web UI and\nthe ongoing effort to replace it with a more modern and feature rich UI -\ncurrently called the Preview\nUI. It was\ninspired by the replacement of the legacy UI for Trino\nGateway with a new UI based on\ncurrent tools and libraries.\nAll three user interfaces require constant work in terms of upkeep to current\nlibraries, bug fixes, and addition of new features.\nOther projects\nBeyond the user interfaces we also provide a plugin for\nGrafana that is mostly written in\nJavascript, and there might be more projects on the way.\nWhat’s next?\nThe skills and experience needed for all these JavaScript-based efforts are\ndifferent enough to ensure that there are developers out there who can help in\nthese efforts without knowing much about Trino and Java.\nIf that is you, we want to hear from you. And if you are also knowledgable in\nTrino, Java, and many other things, and also interested to help on the\nJavaScript stuff, we also want to hear from you. There is always more stuff we\nwant to get done and we need your help.\nSo have a look at the codebase that interests you the most, chat with us on\nTrino Slack, join an upcoming Trino contributor\ncall and Trino Summit, and let me know if you would be\ninterested in a regular Trino JavaScript call - for example monthly?\nAnd if you don’t want to code in Java or JavaScript? Well, you can help us write\ndocumentation in Markdown,\nwork on the Python client, the\nGo client, or maybe even\ncontribute a client we don’t even have yet.\nIn all cases, we look forward to your help."
author: "Manfred Moser"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/images/logos/javascript-small.png\">\n    </p>\n    <p>Trino is written in Java. Trino contributors and maintainers are often veterans\nin the Java ecosystem and community, and Trino is very modern when it comes to\nJava. For example, Trino now requires the latest Java version and actively uses\nnew features.</p>\n<p>When it comes to JavaScript however, the story is a bit more complicated. Of\ncourse, JavaScript is commonly used in the Trino ecosystem and codebase. Let’s\nlook at some of the specifics.</p>\n<!--more-->\n<h2 id=\"client-driver-and-applications\">\n    Client driver and applications <a target=\"_blank\" href=\"https://trino.io/blog/2024/11/18/javascript.html#client-driver-and-applications\">#</a>\n</h2>\n<p>Client applications that allow users to submit queries to Trino, and then\nreceive the results are written in numerous languages. Trino has good support\nfor <a target=\"_blank\" href=\"https://trino.io/ecosystem/#clients\">many of them</a>.</p>\n<p>Thanks to the collaboration with <a target=\"_blank\" href=\"https://github.com/regadas\">Filipe Regadas</a>\nand the contribution of his JavaScript client driver to the Trino community, we\nnow have an official\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino-js-client\">trino-js-client</a> project. After his\ninitial donation we have applied numerous improvements and recently cut our\nfirst release.</p>\n<p>The client is already used in the <a target=\"_blank\" href=\"https://trino.io/ecosystem/client#vscode\">VisualCode\nsupport</a>, the <a target=\"_blank\" href=\"https://trino.io/ecosystem/client#emacs\">Emacs\nsupport</a>, the example project discussed\nin <a target=\"_blank\" href=\"https://trino.io/episodes/63\">Trino Community Broadcast episode 63</a>,\nand numerous other applications.</p>\n<p>And we have big plans as well:</p>\n<ul>\n  <li>Add support for more authentication methods supported in Trino</li>\n  <li>Improve documentation and example projects</li>\n  <li>Add support for the new spooling client protocol from Trino</li>\n  <li>Test with Trino Gateway and adjust as needed</li>\n</ul>\n<p>While this project is a great addition for many users of Trino and their custom\nweb applications, there are numerous other usages of JavaScript in the project.</p>\n<h2 id=\"user-interfaces\">\n    User interfaces <a target=\"_blank\" href=\"https://trino.io/blog/2024/11/18/javascript.html#user-interfaces\">#</a>\n</h2>\n<p>Web-based user interfaces are one important use of JavaScript. Trino includes\nthe <a target=\"_blank\" href=\"https://trino.io/docs/current/admin/web-interface.html\">Trino Web UI</a> and\nthe ongoing effort to replace it with a more modern and feature rich UI -\ncurrently called the <a target=\"_blank\" href=\"https://trino.io/docs/current/admin/preview-web-interface.html\">Preview\nUI</a>. It was\ninspired by the replacement of the legacy UI for <a target=\"_blank\" href=\"https://trinodb.github.io/trino-gateway/\">Trino\nGateway</a> with a new UI based on\ncurrent tools and libraries.</p>\n<p>All three user interfaces require constant work in terms of upkeep to current\nlibraries, bug fixes, and addition of new features.</p>\n<h2 id=\"other-projects\">\n    Other projects <a target=\"_blank\" href=\"https://trino.io/blog/2024/11/18/javascript.html#other-projects\">#</a>\n</h2>\n<p>Beyond the user interfaces we also provide a <a target=\"_blank\" href=\"https://github.com/trinodb/grafana-trino\">plugin for\nGrafana</a> that is mostly written in\nJavascript, and there might be more projects on the way.</p>\n<h2 id=\"whats-next\">\n    What’s next? <a target=\"_blank\" href=\"https://trino.io/blog/2024/11/18/javascript.html#whats-next\">#</a>\n</h2>\n<p>The skills and experience needed for all these JavaScript-based efforts are\ndifferent enough to ensure that there are developers out there who can help in\nthese efforts without knowing much about Trino and Java.</p>\n<p>If that is you, we want to hear from you. And if you are also knowledgable in\nTrino, Java, and many other things, and also interested to help on the\nJavaScript stuff, we also want to hear from you. There is always more stuff we\nwant to get done and we need your help.</p>\n<p>So have a look at the codebase that interests you the most, chat with us on\n<a target=\"_blank\" href=\"https://trino.io/slack\">Trino Slack</a>, join an <a target=\"_blank\" href=\"https://trino.io/community#events\">upcoming Trino contributor\ncall</a> and <a target=\"_blank\" href=\"https://trino.io/blog/2024/10/17/trino-summit-2024-tease\">Trino Summit</a>, and let me know if you would be\ninterested in a regular Trino JavaScript call - for example monthly?</p>\n<p>And if you don’t want to code in Java or JavaScript? Well, you can help us write\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/tree/master/docs\">documentation in Markdown</a>,\nwork on the <a target=\"_blank\" href=\"https://github.com/trinodb/trino-python-client\">Python client</a>, the\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino-go-client\">Go client</a>, or maybe even\ncontribute a client we don’t even have yet.</p>\n<p>In all cases, we look forward to your help.</p>\n  </div>\n</article>\n</div>"
---

Trino is written in Java. Trino contributors and maintainers are often veterans
in the Java ecosystem and community, and Trino is very modern when it comes to
Java. For example, Trino now requires the latest Java version and actively uses
new features.
When it comes to JavaScript however, the story is a bit more complicated. Of
course, JavaScript is commonly used in the Trino ecosystem and codebase. Let’s
look at some of the specifics.
Client driver and applications
Client applications that allow users to submit queries to Trino, and then
receive the results are written in numerous languages. Trino has good support
for many of them.
Thanks to the collaboration with Filipe Regadas
and the contribution of his JavaScript client driver to the Trino community, we
now have an official
trino-js-client project. After his
initial donation we have applied numerous improvements and recently cut our
first release.
The client is already used in the VisualCode
support, the Emacs
support, the example project discussed
in Trino Community Broadcast episode 63,
and numerous other applications.
And we have big plans as well:
Add support for more authentication methods supported in Trino
Improve documentation and example projects
Add support for the new spooling client protocol from Trino
Test with Trino Gateway and adjust as needed
While this project is a great addition for many users of Trino and their custom
web applications, there are numerous other usages of JavaScript in the project.
User interfaces
Web-based user interfaces are one important use of JavaScript. Trino includes
the Trino Web UI and
the ongoing effort to replace it with a more modern and feature rich UI -
currently called the Preview
UI. It was
inspired by the replacement of the legacy UI for Trino
Gateway with a new UI based on
current tools and libraries.
All three user interfaces require constant work in terms of upkeep to current
libraries, bug fixes, and addition of new features.
Other projects
Beyond the user interfaces we also provide a plugin for
Grafana that is mostly written in
Javascript, and there might be more projects on the way.
What’s next?
The skills and experience needed for all these JavaScript-based efforts are
different enough to ensure that there are developers out there who can help in
these efforts without knowing much about Trino and Java.
If that is you, we want to hear from you. And if you are also knowledgable in
Trino, Java, and many other things, and also interested to help on the
JavaScript stuff, we also want to hear from you. There is always more stuff we
want to get done and we need your help.
So have a look at the codebase that interests you the most, chat with us on
Trino Slack, join an upcoming Trino contributor
call and Trino Summit, and let me know if you would be
interested in a regular Trino JavaScript call - for example monthly?
And if you don’t want to code in Java or JavaScript? Well, you can help us write
documentation in Markdown,
work on the Python client, the
Go client, or maybe even
contribute a client we don’t even have yet.
In all cases, we look forward to your help.
