---
title: "Kubernetes v1.36: Server-Side Sharded List and Watch"
link: "https://kubernetes.io/blog/2026/05/06/kubernetes-v1-36-server-side-sharded-list-and-watch/"
guid: "https://kubernetes.io/blog/2026/05/06/kubernetes-v1-36-server-side-sharded-list-and-watch/"
pubDate: "2026-05-06T18:35:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "As Kubernetes clusters grow to tens of thousands of nodes, controllers that watch\nhigh-cardinality resources like Pods face a scaling wall. Every replica of a\nhorizontally scaled controller receives the full stream of events from the API\nserver, paying the CPU, memory, and network cost to deserialize everything, only\nto discard the objects it is not responsible for. Scaling out the controller\ndoes not reduce per-replica cost; it multiplies it.\nKubernetes v1.36 introduces server-side sharded list and watch as an alpha\nfeature (KEP-5866).\nWith this feature enabled, the API server filters events at the source so that\neach controller replica receives only the slice of the resource collection it\nowns.\nThe problem with client-side sharding\nSome controllers, such as kube-state-metrics,\nalready support horizontal sharding. Each replica is assigned a portion of the\nkeyspace and discards objects that do not belong to it. While this works\nfunctionally, it does not reduce the volume of data flowing from the API server:\nN replicas x full event stream: every replica deserializes and processes\nevery event, then throws away what it does not need.\nNetwork bandwidth scales with replicas, not with shard size.\nCPU spent on deserialization is wasted for the discarded fraction.\nServer-side sharded list and watch solves this by moving the filtering upstream\ninto the API server. Each replica tells the API server which hash range it owns,\nand the API server only sends matching events.\nHow it works\nThe feature adds a shardSelector field to ListOptions. Clients specify a\nhash range using the shardRange() function:\nshardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')\n\nThe API server computes a deterministic 64-bit\nFNV-1a\nhash of the specified field and returns only objects whose hash falls within the\nrange [start, end). This applies to both list responses and watch event\nstreams. The hash function produces the same result across all API server\ninstances, so the feature is safe to use with multiple API server replicas.\nCurrently supported field paths are object.metadata.uid and\nobject.metadata.namespace.\nUsing sharded watches in controllers\nControllers typically use informers to list and watch resources. To shard the\nworkload, each replica injects the shardSelector into the ListOptions used\nby its informers via WithTweakListOptions:\nimport (\n metav1 \"k8s.io/apimachinery/pkg/apis/meta/v1\"\n \"k8s.io/client-go/informers\"\n)\n\nshardSelector := \"shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')\"\n\nfactory := informers.NewSharedInformerFactoryWithOptions(client, resyncPeriod,\n informers.WithTweakListOptions(func(opts *metav1.ListOptions) {\n opts.ShardSelector = shardSelector\n }),\n)\n\n\nFor a 2-replica deployment, the selectors split the hash space in half:\n// Replica 0: lower half of the hash space\n\"shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')\"\n\n// Replica 1: upper half of the hash space\n\"shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')\"\n\n\nA single replica can also cover non-contiguous ranges using ||:\n\"shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') || \" +\n \"shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')\"\n\n\nVerifying server support\nWhen the API server honors a shard selector, the list response includes a\nshardInfo field in the response metadata that echoes back the applied\nselector:\n{\n \"kind\": \"PodList\",\n \"apiVersion\": \"v1\",\n \"metadata\": {\n \"resourceVersion\": \"10245\",\n \"shardInfo\": {\n \"selector\": \"shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')\"\n }\n },\n \"items\": [...]\n}\n\n\nIf shardInfo is absent, the server did not honor the shard selector and the\nclient received the complete, unfiltered collection. In this case, the client\nshould be prepared to handle the full result set, for example by applying\nclient-side filtering to discard objects outside its assigned shard range.\nGetting involved\nThis feature is in alpha and requires enabling the ShardedListAndWatch feature\ngate on the API server. We are looking for feedback from controller authors and\noperators running large clusters.\nKEP-5866: Server-Side Sharded List and Watch\nAPI Concepts: Sharded list and watch\nSIG API Machinery\nIf you have questions or feedback, join the #sig-api-machinery channel on\nKubernetes Slack."
contentHtml: "<p>As Kubernetes clusters grow to tens of thousands of nodes, controllers that watch\nhigh-cardinality resources like Pods face a scaling wall. Every replica of a\nhorizontally scaled controller receives the full stream of events from the API\nserver, paying the CPU, memory, and network cost to deserialize everything, only\nto discard the objects it is not responsible for. Scaling out the controller\ndoes not reduce per-replica cost; it multiplies it.</p>\n<p>Kubernetes v1.36 introduces <strong>server-side sharded list and watch</strong> as an alpha\nfeature (<a href=\"https://github.com/kubernetes/enhancements/issues/5866\">KEP-5866</a>).\nWith this feature enabled, the API server filters events at the source so that\neach controller replica receives only the slice of the resource collection it\nowns.</p>\n<h2 id=\"the-problem-with-client-side-sharding\">The problem with client-side sharding<a class=\"td-heading-self-link\" href=\"#the-problem-with-client-side-sharding\" aria-label=\"Heading self-link\"></a></h2><p>Some controllers, such as <a href=\"https://github.com/kubernetes/kube-state-metrics\">kube-state-metrics</a>,\nalready support horizontal sharding. Each replica is assigned a portion of the\nkeyspace and discards objects that do not belong to it. While this works\nfunctionally, it does not reduce the volume of data flowing from the API server:</p>\n<ul>\n<li><strong>N replicas x full event stream</strong>: every replica deserializes and processes\nevery event, then throws away what it does not need.</li>\n<li><strong>Network bandwidth scales with replicas</strong>, not with shard size.</li>\n<li><strong>CPU spent on deserialization</strong> is wasted for the discarded fraction.</li>\n</ul>\n<p>Server-side sharded list and watch solves this by moving the filtering upstream\ninto the API server. Each replica tells the API server which hash range it owns,\nand the API server only sends matching events.</p>\n<h2 id=\"how-it-works\">How it works<a class=\"td-heading-self-link\" href=\"#how-it-works\" aria-label=\"Heading self-link\"></a></h2><p>The feature adds a <code>shardSelector</code> field to <code>ListOptions</code>. Clients specify a\nhash range using the <code>shardRange()</code> function:</p>\n<pre tabindex=\"0\"><code>shardRange(object.metadata.uid, &#39;0x0000000000000000&#39;, &#39;0x8000000000000000&#39;)\n</code></pre><p>The API server computes a deterministic 64-bit\n<a href=\"https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function\">FNV-1a</a>\nhash of the specified field and returns only objects whose hash falls within the\nrange <code>[start, end)</code>. This applies to both list responses and watch event\nstreams. The hash function produces the same result across all API server\ninstances, so the feature is safe to use with multiple API server replicas.</p>\n<p>Currently supported field paths are <code>object.metadata.uid</code> and\n<code>object.metadata.namespace</code>.</p>\n<h2 id=\"using-sharded-watches-in-controllers\">Using sharded watches in controllers<a class=\"td-heading-self-link\" href=\"#using-sharded-watches-in-controllers\" aria-label=\"Heading self-link\"></a></h2><p>Controllers typically use informers to list and watch resources. To shard the\nworkload, each replica injects the <code>shardSelector</code> into the <code>ListOptions</code> used\nby its informers via <code>WithTweakListOptions</code>:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-go\" data-lang=\"go\"><span class=\"line\"><span class=\"cl\"><span class=\"kn\">import</span> <span class=\"p\">(</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">metav1</span> <span class=\"s\">&#34;k8s.io/apimachinery/pkg/apis/meta/v1&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"s\">&#34;k8s.io/client-go/informers&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"nx\">shardSelector</span> <span class=\"o\">:=</span> <span class=\"s\">&#34;shardRange(object.metadata.uid, &#39;0x0000000000000000&#39;, &#39;0x8000000000000000&#39;)&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"nx\">factory</span> <span class=\"o\">:=</span> <span class=\"nx\">informers</span><span class=\"p\">.</span><span class=\"nf\">NewSharedInformerFactoryWithOptions</span><span class=\"p\">(</span><span class=\"nx\">client</span><span class=\"p\">,</span> <span class=\"nx\">resyncPeriod</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">informers</span><span class=\"p\">.</span><span class=\"nf\">WithTweakListOptions</span><span class=\"p\">(</span><span class=\"kd\">func</span><span class=\"p\">(</span><span class=\"nx\">opts</span> <span class=\"o\">*</span><span class=\"nx\">metav1</span><span class=\"p\">.</span><span class=\"nx\">ListOptions</span><span class=\"p\">)</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">opts</span><span class=\"p\">.</span><span class=\"nx\">ShardSelector</span> <span class=\"p\">=</span> <span class=\"nx\">shardSelector</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">}),</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">)</span>\n</span></span></code></pre></div><p>For a 2-replica deployment, the selectors split the hash space in half:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-go\" data-lang=\"go\"><span class=\"line\"><span class=\"cl\"><span class=\"c1\">// Replica 0: lower half of the hash space</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"s\">&#34;shardRange(object.metadata.uid, &#39;0x0000000000000000&#39;, &#39;0x8000000000000000&#39;)&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"c1\">// Replica 1: upper half of the hash space</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"s\">&#34;shardRange(object.metadata.uid, &#39;0x8000000000000000&#39;, &#39;0x10000000000000000&#39;)&#34;</span>\n</span></span></code></pre></div><p>A single replica can also cover non-contiguous ranges using <code>||</code>:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-go\" data-lang=\"go\"><span class=\"line\"><span class=\"cl\"><span class=\"s\">&#34;shardRange(object.metadata.uid, &#39;0x0000000000000000&#39;, &#39;0x4000000000000000&#39;) || &#34;</span> <span class=\"o\">+</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"s\">&#34;shardRange(object.metadata.uid, &#39;0x8000000000000000&#39;, &#39;0xc000000000000000&#39;)&#34;</span>\n</span></span></code></pre></div><h2 id=\"verifying-server-support\">Verifying server support<a class=\"td-heading-self-link\" href=\"#verifying-server-support\" aria-label=\"Heading self-link\"></a></h2><p>When the API server honors a shard selector, the list response includes a\n<code>shardInfo</code> field in the response metadata that echoes back the applied\nselector:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-json\" data-lang=\"json\"><span class=\"line\"><span class=\"cl\"><span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nt\">&#34;kind&#34;</span><span class=\"p\">:</span> <span class=\"s2\">&#34;PodList&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nt\">&#34;apiVersion&#34;</span><span class=\"p\">:</span> <span class=\"s2\">&#34;v1&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nt\">&#34;metadata&#34;</span><span class=\"p\">:</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nt\">&#34;resourceVersion&#34;</span><span class=\"p\">:</span> <span class=\"s2\">&#34;10245&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nt\">&#34;shardInfo&#34;</span><span class=\"p\">:</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nt\">&#34;selector&#34;</span><span class=\"p\">:</span> <span class=\"s2\">&#34;shardRange(object.metadata.uid, &#39;0x0000000000000000&#39;, &#39;0x8000000000000000&#39;)&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">}</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">},</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nt\">&#34;items&#34;</span><span class=\"p\">:</span> <span class=\"p\">[</span><span class=\"err\">...</span><span class=\"p\">]</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">}</span>\n</span></span></code></pre></div><p>If <code>shardInfo</code> is absent, the server did not honor the shard selector and the\nclient received the complete, unfiltered collection. In this case, the client\nshould be prepared to handle the full result set, for example by applying\nclient-side filtering to discard objects outside its assigned shard range.</p>\n<h2 id=\"getting-involved\">Getting involved<a class=\"td-heading-self-link\" href=\"#getting-involved\" aria-label=\"Heading self-link\"></a></h2><p>This feature is in alpha and requires enabling the <code>ShardedListAndWatch</code> feature\ngate on the API server. We are looking for feedback from controller authors and\noperators running large clusters.</p>\n<ul>\n<li><a href=\"https://github.com/kubernetes/enhancements/issues/5866\">KEP-5866: Server-Side Sharded List and Watch</a></li>\n<li><a href=\"https://kubernetes.io/docs/reference/using-api/api-concepts/#sharded-list-and-watch\">API Concepts: Sharded list and watch</a></li>\n<li><a href=\"https://github.com/kubernetes/community/tree/master/sig-api-machinery\">SIG API Machinery</a></li>\n</ul>\n<p>If you have questions or feedback, join the <code>#sig-api-machinery</code> channel on\n<a href=\"https://slack.k8s.io/\">Kubernetes Slack</a>.</p>"
---

As Kubernetes clusters grow to tens of thousands of nodes, controllers that watch
high-cardinality resources like Pods face a scaling wall. Every replica of a
horizontally scaled controller receives the full stream of events from the API
server, paying the CPU, memory, and network cost to deserialize everything, only
to discard the objects it is not responsible for. Scaling out the controller
does not reduce per-replica cost; it multiplies it.
Kubernetes v1.36 introduces server-side sharded list and watch as an alpha
feature (KEP-5866).
With this feature enabled, the API server filters events at the source so that
each controller replica receives only the slice of the resource collection it
owns.
The problem with client-side sharding
Some controllers, such as kube-state-metrics,
already support horizontal sharding. Each replica is assigned a portion of the
keyspace and discards objects that do not belong to it. While this works
functionally, it does not reduce the volume of data flowing from the API server:
N replicas x full event stream: every replica deserializes and processes
every event, then throws away what it does not need.
Network bandwidth scales with replicas, not with shard size.
CPU spent on deserialization is wasted for the discarded fraction.
Server-side sharded list and watch solves this by moving the filtering upstream
into the API server. Each replica tells the API server which hash range it owns,
and the API server only sends matching events.
How it works
The feature adds a shardSelector field to ListOptions. Clients specify a
hash range using the shardRange() function:
shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')

The API server computes a deterministic 64-bit
FNV-1a
hash of the specified field and returns only objects whose hash falls within the
range [start, end). This applies to both list responses and watch event
streams. The hash function produces the same result across all API server
instances, so the feature is safe to use with multiple API server replicas.
Currently supported field paths are object.metadata.uid and
object.metadata.namespace.
Using sharded watches in controllers
Controllers typically use informers to list and watch resources. To shard the
workload, each replica injects the shardSelector into the ListOptions used
by its informers via WithTweakListOptions:
import (
 metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
 "k8s.io/client-go/informers"
)

shardSelector := "shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')"

factory := informers.NewSharedInformerFactoryWithOptions(client, resyncPeriod,
 informers.WithTweakListOptions(func(opts *metav1.ListOptions) {
 opts.ShardSelector = shardSelector
 }),
)


For a 2-replica deployment, the selectors split the hash space in half:
// Replica 0: lower half of the hash space
"shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')"

// Replica 1: upper half of the hash space
"shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')"


A single replica can also cover non-contiguous ranges using ||:
"shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000') || " +
 "shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')"


Verifying server support
When the API server honors a shard selector, the list response includes a
shardInfo field in the response metadata that echoes back the applied
selector:
{
 "kind": "PodList",
 "apiVersion": "v1",
 "metadata": {
 "resourceVersion": "10245",
 "shardInfo": {
 "selector": "shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')"
 }
 },
 "items": [...]
}


If shardInfo is absent, the server did not honor the shard selector and the
client received the complete, unfiltered collection. In this case, the client
should be prepared to handle the full result set, for example by applying
client-side filtering to discard objects outside its assigned shard range.
Getting involved
This feature is in alpha and requires enabling the ShardedListAndWatch feature
gate on the API server. We are looking for feedback from controller authors and
operators running large clusters.
KEP-5866: Server-Side Sharded List and Watch
API Concepts: Sharded list and watch
SIG API Machinery
If you have questions or feedback, join the #sig-api-machinery channel on
Kubernetes Slack.
