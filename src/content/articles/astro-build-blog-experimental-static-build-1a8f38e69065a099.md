---
title: "Scaling Astro to 10,000+ Pages"
link: "https://astro.build/blog/experimental-static-build/"
guid: "https://astro.build/blog/experimental-static-build/"
pubDate: "2022-01-25T00:00:00.000Z"
site_name: "Astro"
site_feed: "https://astro.build/rss.xml"
category: "Web"
summary: "A new experimental flag in Astro build enables building sites with tens of thousands of pages."
contentHtml: "<article>\n<p>Astro is about to get a lot faster! Our new build optimization process is ready to try out in Astro today:</p>\n<div><figure><figcaption></figcaption><pre><code><div><p><span>astro</span><span> </span><span>build</span><span> </span><span>--experimental-static-build</span></p></div></code></pre></figure></div>\n<p>Our new build system can scale to tens, or even hundreds, of thousands of pages. If you hang out in our <a target=\"_blank\" href=\"https://astro.build/chat/\">Discord</a> or pay attention to recent releases you might have seen a lot of discussion about a “static build”. Our new implementation of <code>astro build</code> does 2 things:</p>\n<ul>\n<li>Improves build times by up to 75%.</li>\n<li>Lowers memory usage when building very large sites (10,000+ pages).</li>\n</ul>\n<p>This new build works by first building an SSR version of your app and then rendering each page to HTML. Because the site is pre-optimized it can render each page in parallel and will never run out of memory.</p>\n<p>If you are a current Astro user please try out this new build by passing the flag in your <code>build</code> script.</p>\n<p>This build approach will remain flagged for the next few releases until we iron out any issues, at which point we plan to promote it to be the default <code>astro build</code> command. Please help us by reporting issues you encounter, either in the <a target=\"_blank\" href=\"https://astro.build/chat/\">Discord</a> or by filing an <a target=\"_blank\" href=\"https://github.com/withastro/astro/issues/new/choose\">issue</a>.</p></article>"
---

A new experimental flag in Astro build enables building sites with tens of thousands of pages.
