---
title: "Kubernetes v1.36: User Namespaces in Kubernetes are finally GA"
link: "https://kubernetes.io/blog/2026/04/23/kubernetes-v1-36-userns-ga/"
guid: "https://kubernetes.io/blog/2026/04/23/kubernetes-v1-36-userns-ga/"
pubDate: "2026-04-23T18:35:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "After several years of development, User Namespaces support in\nKubernetes reached General Availability (GA) with the v1.36 release.\nThis is a Linux-only feature.\nFor those of us working on low level container runtimes and rootless\ntechnologies, this has been a long awaited milestone. We finally\nreached the point where \"rootless\" security isolation can be used for\nKubernetes workloads.\nThis feature also enables a critical pattern: running workloads with\nprivileges and still being confined in the user namespace. When\nhostUsers: false is set, capabilities like CAP_NET_ADMIN become\nnamespaced, meaning they grant administrative power over container\nlocal resources without affecting the host. This effectively enables\nnew use cases that were not possible before without running a fully\nprivileged container.\nThe Problem with UID 0\nA process running as root inside a container is also seen from the\nkernel as root on the host. If an attacker manages to break out of\nthe container, whether through a kernel vulnerability or a\nmisconfigured mount, they are root on the host.\nWhile there are many security measures in place for running\ncontainers, these measures don't change the underlying identity of the\nprocess, it still has some \"parts\" of root.\nThe engine: ID-mapped mounts\nThe road to GA wasn't just about the Kubernetes API; it was about\nmaking the kernel work for us. In the early stages, one of the\nbiggest blockers was volume ownership. If you mapped a container to a\nhigh UID range, the Kubelet had to recursively chown every file in\nthe attached volume so the container could read/write them. For large\nvolumes, this was such an expensive operation that destroyed startup\nperformance.\nThe key enabler was ID-mapped mounts (introduced in Linux\n5.12 and refined in later versions). Instead of rewriting file\nownership on disk, the kernel remaps it at mount time.\nWhen a volume is mounted into a Pod with User Namespaces enabled, the\nkernel performs a transparent translation of the UIDs (user ids) and\nGIDs (group ids). To the container, the files appear owned by\nUID 0. On disk, file ownership is unchanged — no chown is needed.\nThis is an O(1) operation, instant and efficient.\nUsing it in Kubernetes v1.36\nUsing user namespaces is straightforward: all you need to do is set\nhostUsers: false in your Pod spec. No changes to your container\nimages, no complex configuration. The interface remains the same one\nintroduced during the Alpha phase. In the spec for a Pod (or PodTemplate), you explicitly\nopt-out of the host user namespace:\napiVersion: v1\nkind: Pod\nmetadata:\n name: isolated-workload\nspec:\n hostUsers: false\n containers:\n - name: app\n image: fedora:42\n securityContext:\n runAsUser: 0\n\n\nFor more details on how user namespaces work in practice and demos of\nCVEs rated HIGH mitigated, see the previous blog posts:\nUser Namespaces alpha,\nUser Namespaces stateful pods in alpha,\nUser Namespaces beta, and\nUser Namespaces enabled by default.\nGetting involved\nIf you're interested in user namespaces or want to contribute, here\nare some useful links:\nUser Namespaces documentation\nKEP-127: Support User Namespaces\nSIG Node\nAcknowledgments\nThis feature has been years in the making: the first KEP was opened\n10 years ago by other contributors, and we have been actively working\non it for the last 6 years. We'd like to thank everyone who\ncontributed across SIG Node, the container runtimes, and the Linux\nkernel. Special thanks to the reviewers and early adopters who helped\nshape the design through multiple alpha and beta cycles."
contentHtml: "<p>After several years of development, User Namespaces support in\nKubernetes reached General Availability (GA) with the v1.36 release.\nThis is a Linux-only feature.</p>\n<p>For those of us working on low level container runtimes and rootless\ntechnologies, this has been a long awaited milestone. We finally\nreached the point where &quot;rootless&quot; security isolation can be used for\nKubernetes workloads.</p>\n<p>This feature also enables a critical pattern: running workloads with\nprivileges and still being confined in the user namespace. When\n<code>hostUsers: false</code> is set, capabilities like <code>CAP_NET_ADMIN</code> become\n<strong>namespaced</strong>, meaning they grant administrative power over container\nlocal resources without affecting the host. This effectively enables\nnew use cases that were not possible before without running a fully\nprivileged container.</p>\n<h2 id=\"the-problem-with-uid-0\">The Problem with UID 0<a class=\"td-heading-self-link\" href=\"#the-problem-with-uid-0\" aria-label=\"Heading self-link\"></a></h2><p>A process running as root inside a container is also seen from the\nkernel as root on the host. If an attacker manages to break out of\nthe container, whether through a kernel vulnerability or a\nmisconfigured mount, they are root on the host.</p>\n<p>While there are many security measures in place for running\ncontainers, these measures don't change the underlying identity of the\nprocess, it still has some &quot;parts&quot; of root.</p>\n<h2 id=\"the-engine-id-mapped-mounts\">The engine: ID-mapped mounts<a class=\"td-heading-self-link\" href=\"#the-engine-id-mapped-mounts\" aria-label=\"Heading self-link\"></a></h2><p>The road to GA wasn't just about the Kubernetes API; it was about\nmaking the kernel work for us. In the early stages, one of the\nbiggest blockers was volume ownership. If you mapped a container to a\nhigh UID range, the Kubelet had to recursively <code>chown</code> every file in\nthe attached volume so the container could read/write them. For large\nvolumes, this was such an expensive operation that destroyed startup\nperformance.</p>\n<p>The key enabler was <em>ID-mapped mounts</em> (introduced in Linux\n5.12 and refined in later versions). Instead of rewriting file\nownership on disk, the kernel remaps it at mount time.</p>\n<p>When a volume is mounted into a Pod with User Namespaces enabled, the\nkernel performs a transparent translation of the UIDs (user ids) and\nGIDs (group ids). To the container, the files appear owned by\nUID 0. On disk, file ownership is unchanged — no <code>chown</code> is needed.\nThis is an <code>O(1)</code> operation, instant and efficient.</p>\n<h2 id=\"using-it-in-kubernetes-v1-36\">Using it in Kubernetes v1.36<a class=\"td-heading-self-link\" href=\"#using-it-in-kubernetes-v1-36\" aria-label=\"Heading self-link\"></a></h2><p>Using user namespaces is straightforward: all you need to do is set\n<code>hostUsers: false</code> in your Pod spec. No changes to your container\nimages, no complex configuration. The interface remains the same one\nintroduced during the Alpha phase. In the <code>spec</code> for a Pod (or PodTemplate), you explicitly\nopt-out of the host user namespace:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">Pod</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">isolated-workload</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">hostUsers</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"kc\">false</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">containers</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span>- <span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">app</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">image</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">fedora:42</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">securityContext</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">runAsUser</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"m\">0</span><span class=\"w\">\n</span></span></span></code></pre></div><p>For more details on how user namespaces work in practice and demos of\nCVEs rated HIGH mitigated, see the previous blog posts:\n<a href=\"https://kubernetes.io/blog/2022/10/03/userns-alpha/\">User Namespaces alpha</a>,\n<a href=\"https://kubernetes.io/blog/2023/09/13/userns-alpha/\">User Namespaces stateful pods in alpha</a>,\n<a href=\"https://kubernetes.io/blog/2024/04/22/userns-beta/\">User Namespaces beta</a>, and\n<a href=\"https://kubernetes.io/blog/2025/04/25/userns-enabled-by-default/\">User Namespaces enabled by default</a>.</p>\n<h2 id=\"getting-involved\">Getting involved<a class=\"td-heading-self-link\" href=\"#getting-involved\" aria-label=\"Heading self-link\"></a></h2><p>If you're interested in user namespaces or want to contribute, here\nare some useful links:</p>\n<ul>\n<li><a href=\"https://kubernetes.io/docs/concepts/workloads/pods/user-namespaces/\">User Namespaces documentation</a></li>\n<li><a href=\"https://kep.k8s.io/127\">KEP-127: Support User Namespaces</a></li>\n<li><a href=\"https://github.com/kubernetes/community/tree/master/sig-node\">SIG Node</a></li>\n</ul>\n<h2 id=\"acknowledgments\">Acknowledgments<a class=\"td-heading-self-link\" href=\"#acknowledgments\" aria-label=\"Heading self-link\"></a></h2><p>This feature has been years in the making: the first KEP was opened\n10 years ago by other contributors, and we have been actively working\non it for the last 6 years. We'd like to thank everyone who\ncontributed across SIG Node, the container runtimes, and the Linux\nkernel. Special thanks to the reviewers and early adopters who helped\nshape the design through multiple alpha and beta cycles.</p>"
---

After several years of development, User Namespaces support in
Kubernetes reached General Availability (GA) with the v1.36 release.
This is a Linux-only feature.
For those of us working on low level container runtimes and rootless
technologies, this has been a long awaited milestone. We finally
reached the point where "rootless" security isolation can be used for
Kubernetes workloads.
This feature also enables a critical pattern: running workloads with
privileges and still being confined in the user namespace. When
hostUsers: false is set, capabilities like CAP_NET_ADMIN become
namespaced, meaning they grant administrative power over container
local resources without affecting the host. This effectively enables
new use cases that were not possible before without running a fully
privileged container.
The Problem with UID 0
A process running as root inside a container is also seen from the
kernel as root on the host. If an attacker manages to break out of
the container, whether through a kernel vulnerability or a
misconfigured mount, they are root on the host.
While there are many security measures in place for running
containers, these measures don't change the underlying identity of the
process, it still has some "parts" of root.
The engine: ID-mapped mounts
The road to GA wasn't just about the Kubernetes API; it was about
making the kernel work for us. In the early stages, one of the
biggest blockers was volume ownership. If you mapped a container to a
high UID range, the Kubelet had to recursively chown every file in
the attached volume so the container could read/write them. For large
volumes, this was such an expensive operation that destroyed startup
performance.
The key enabler was ID-mapped mounts (introduced in Linux
5.12 and refined in later versions). Instead of rewriting file
ownership on disk, the kernel remaps it at mount time.
When a volume is mounted into a Pod with User Namespaces enabled, the
kernel performs a transparent translation of the UIDs (user ids) and
GIDs (group ids). To the container, the files appear owned by
UID 0. On disk, file ownership is unchanged — no chown is needed.
This is an O(1) operation, instant and efficient.
Using it in Kubernetes v1.36
Using user namespaces is straightforward: all you need to do is set
hostUsers: false in your Pod spec. No changes to your container
images, no complex configuration. The interface remains the same one
introduced during the Alpha phase. In the spec for a Pod (or PodTemplate), you explicitly
opt-out of the host user namespace:
apiVersion: v1
kind: Pod
metadata:
 name: isolated-workload
spec:
 hostUsers: false
 containers:
 - name: app
 image: fedora:42
 securityContext:
 runAsUser: 0


For more details on how user namespaces work in practice and demos of
CVEs rated HIGH mitigated, see the previous blog posts:
User Namespaces alpha,
User Namespaces stateful pods in alpha,
User Namespaces beta, and
User Namespaces enabled by default.
Getting involved
If you're interested in user namespaces or want to contribute, here
are some useful links:
User Namespaces documentation
KEP-127: Support User Namespaces
SIG Node
Acknowledgments
This feature has been years in the making: the first KEP was opened
10 years ago by other contributors, and we have been actively working
on it for the last 6 years. We'd like to thank everyone who
contributed across SIG Node, the container runtimes, and the Linux
kernel. Special thanks to the reviewers and early adopters who helped
shape the design through multiple alpha and beta cycles.
