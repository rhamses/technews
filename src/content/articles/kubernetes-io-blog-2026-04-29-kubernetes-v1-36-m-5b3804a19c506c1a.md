---
title: "Kubernetes v1.36: Tiered Memory Protection with Memory QoS"
link: "https://kubernetes.io/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/"
guid: "https://kubernetes.io/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/"
pubDate: "2026-04-29T18:35:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "On behalf of SIG Node, we are pleased to announce updates to the Memory QoS\nfeature (alpha) in Kubernetes v1.36. Memory QoS uses the cgroup v2 memory\ncontroller to give the kernel better guidance on how to treat container memory.\nIt was first introduced in v1.22 and updated in v1.27. In Kubernetes v1.36, we're introducing: opt-in memory reservation, tiered\nprotection by QoS class, observability metrics, and kernel-version warning for memory.high.\nWhat's new in v1.36\nOpt-in memory reservation with memoryReservationPolicy\nv1.36 separates throttling from reservation. Enabling the feature gate turns on\nmemory.high throttling (the kubelet sets memory.high based on\nmemoryThrottlingFactor, default 0.9), but memory reservation is now controlled\nby a separate kubelet configuration field:\nNone (default): no memory.min or memory.low is written. Throttling\nvia memory.high still works.\nTieredReservation: the kubelet writes tiered memory protection based on the Pod's\nQoS class:\nGuaranteed Pods get hard protection via memory.min. For example, a\nGuaranteed Pod requesting 512 MiB of memory results in:\n$ cat /sys/fs/cgroup/kubepods.slice/kubepods-pod6a4f2e3b_1c9d_4a5e_8f7b_2d3e4f5a6b7c.slice/memory.min\n536870912\n\nThe kernel will not reclaim this memory under any circumstances. If it cannot\nhonor the guarantee, it invokes the OOM killer on other processes to free pages.\nBurstable Pods get soft protection via memory.low. For the same 512 MiB\nrequest on a Burstable Pod:\n$ cat /sys/fs/cgroup/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod8b3c7d2e_4f5a_6b7c_9d1e_3f4a5b6c7d8e.slice/memory.low\n536870912\n\nThe kernel avoids reclaiming this memory under normal pressure, but may reclaim\nit if the alternative is a system-wide OOM.\nBestEffort Pods get neither memory.min nor memory.low. Their memory\nremains fully reclaimable.\nComparison with v1.27 behavior\nIn earlier versions, enabling the MemoryQoS feature gate immediately set memory.min for every container with a memory request. memory.min is a hard reservation that the kernel will not reclaim, regardless of memory pressure.\nConsider a node with 8 GiB of RAM where Burstable Pod requests total 7 GiB. In earlier versions, that 7 GiB would be locked as memory.min, leaving little headroom for the kernel, system daemons, or BestEffort workloads and increasing the risk of OOM kills.\nWith v1.36 tiered reservation, those Burstable requests map to memory.low instead of memory.min. Under normal pressure, the kernel still protects that memory, but under extreme pressure it can reclaim part of it to avoid system-wide OOM. Only Guaranteed Pods use memory.min, which keeps hard reservation lower.\nWith memoryReservationPolicy in v1.36, you can enable throttling first, observe workload behavior, and opt into reservation when your node has enough headroom.\nObservability metrics\nTwo alpha-stability metrics are exposed on the kubelet /metrics endpoint:\nMetric\nDescription\n\n\n\n\nkubelet_memory_qos_node_memory_min_bytes\nTotal memory.min across Guaranteed Pods\n\n\nkubelet_memory_qos_node_memory_low_bytes\nTotal memory.low across Burstable Pods\n\n\n\nThese are useful for capacity planning. If kubelet_memory_qos_node_memory_min_bytes\nis creeping toward your node's physical memory, you know hard reservation is\ngetting tight.\n$ curl -sk https://localhost:10250/metrics | grep memory_qos\n# HELP kubelet_memory_qos_node_memory_min_bytes [ALPHA] Total memory.min in bytes for Guaranteed pods\nkubelet_memory_qos_node_memory_min_bytes 5.36870912e+08\n# HELP kubelet_memory_qos_node_memory_low_bytes [ALPHA] Total memory.low in bytes for Burstable pods\nkubelet_memory_qos_node_memory_low_bytes 2.147483648e+09\n\nKernel version check\nOn kernels older than 5.9, memory.high throttling can trigger the\nkernel livelock issue. The bug was fixed\nin kernel 5.9. In v1.36, when the feature gate is enabled, the kubelet checks the\nkernel version at startup and logs a warning if it is below 5.9. The feature\ncontinues to work — this is informational, not a hard block.\nHow Kubernetes maps Memory QoS to cgroup v2\nMemory QoS uses four cgroup v2 memory controller interfaces:\nmemory.max: hard memory limit — unchanged from previous versions\nmemory.min: hard memory protection — with TieredReservation, set only for Guaranteed Pods\nmemory.low: soft memory protection — set for Burstable Pods with TieredReservation\nmemory.high: memory throttling threshold — unchanged from previous versions\nThe following table shows how Kubernetes container resources map to cgroup v2\ninterfaces when memoryReservationPolicy: TieredReservation is configured.\nWith the default memoryReservationPolicy: None, no memory.min or\nmemory.low values are set.\nQoS Class\nmemory.min\nmemory.low\nmemory.high\nmemory.max\n\n\nGuaranteed\nSet to requests.memory\n(hard protection)\nNot set\nNot set\n(requests == limits, so throttling is not useful)\nSet to limits.memory\n\n\nBurstable\nNot set\nSet to requests.memory\n(soft protection)\nCalculated based on\nformula with throttling factor\nSet to limits.memory\n(if specified)\n\n\nBestEffort\nNot set\nNot set\nCalculated based on\nnode allocatable memory\nNot set\n\n\nCgroup hierarchy\ncgroup v2 requires that a parent cgroup's memory protection is at least as\nlarge as the sum of its children's. The kubelet maintains this by setting\nmemory.min on the kubepods root cgroup to the sum of all Guaranteed and\nBurstable Pod memory requests, and memory.low on the Burstable QoS cgroup\nto the sum of all Burstable Pod memory requests. This way the kernel can\nenforce the per-container and per-pod protection values correctly.\nThe kubelet manages pod-level and QoS-class cgroups directly using the runc\nlibcontainer library, while container-level cgroups are managed by the\ncontainer runtime (containerd or CRI-O).\nHow do I use it?\nPrerequisites\n\nKubernetes v1.36 or later\nLinux with cgroup v2. Kernel 5.9 or higher is recommended — earlier kernels\nwork but may experience the livelock issue. You can verify cgroup v2 is\nactive by running mount | grep cgroup2.\nA container runtime that supports cgroup v2 (containerd 1.6+, CRI-O 1.22+)\nConfiguration\nTo enable Memory QoS with tiered protection:\napiVersion: kubelet.config.k8s.io/v1beta1\nkind: KubeletConfiguration\nfeatureGates:\n MemoryQoS: true\nmemoryReservationPolicy: TieredReservation # Options: None (default), TieredReservation\nmemoryThrottlingFactor: 0.9 # Optional: default is 0.9\n\n\nIf you want memory.high throttling without memory protection, omit\nmemoryReservationPolicy or set it to None:\napiVersion: kubelet.config.k8s.io/v1beta1\nkind: KubeletConfiguration\nfeatureGates:\n MemoryQoS: true\nmemoryReservationPolicy: None  # This is the default\n\n\nHow can I learn more?\n\nKEP-2570: Memory QoS\nPod Quality of Service Classes\nManaging Resources for Containers\nKubernetes cgroups v2 support\nLinux kernel cgroups v2 documentation\nGetting involved\nThis feature is driven by SIG Node.\nIf you are interested in contributing or have feedback, you can find us on\nSlack (#sig-node), the\nmailing list,\nor at the regular\nSIG Node meetings.\nPlease file bugs at kubernetes/kubernetes\nand enhancement proposals at\nkubernetes/enhancements."
contentHtml: "<p>On behalf of SIG Node, we are pleased to announce updates to the Memory QoS\nfeature (alpha) in Kubernetes v1.36. Memory QoS uses the cgroup v2 memory\ncontroller to give the kernel better guidance on how to treat container memory.\nIt was first introduced in v1.22 and updated in v1.27. In Kubernetes v1.36, we're introducing: opt-in memory reservation, tiered\nprotection by QoS class, observability metrics, and kernel-version warning for <code>memory.high</code>.</p>\n<h2 id=\"what-s-new-in-v1-36\">What's new in v1.36<a class=\"td-heading-self-link\" href=\"#what-s-new-in-v1-36\" aria-label=\"Heading self-link\"></a></h2><h3 id=\"opt-in-memory-reservation-with-memoryreservationpolicy\">Opt-in memory reservation with <code>memoryReservationPolicy</code><a class=\"td-heading-self-link\" href=\"#opt-in-memory-reservation-with-memoryreservationpolicy\" aria-label=\"Heading self-link\"></a></h3><p>v1.36 separates throttling from reservation. Enabling the feature gate turns on\n<code>memory.high</code> throttling (the kubelet sets <code>memory.high</code> based on\n<code>memoryThrottlingFactor</code>, default 0.9), but memory reservation is now controlled\nby a separate kubelet configuration field:</p>\n<ul>\n<li><strong><code>None</code></strong> (default): no <code>memory.min</code> or <code>memory.low</code> is written. Throttling\nvia <code>memory.high</code> still works.</li>\n<li><strong><code>TieredReservation</code></strong>: the kubelet writes tiered memory protection based on the Pod's\n<a href=\"https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/\">QoS class</a>:</li>\n</ul>\n<p><strong>Guaranteed</strong> Pods get hard protection via <code>memory.min</code>. For example, a\nGuaranteed Pod requesting 512 MiB of memory results in:</p>\n<pre tabindex=\"0\"><code class=\"language-none\" data-lang=\"none\">$ cat /sys/fs/cgroup/kubepods.slice/kubepods-pod6a4f2e3b_1c9d_4a5e_8f7b_2d3e4f5a6b7c.slice/memory.min\n536870912\n</code></pre><p>The kernel will not reclaim this memory under any circumstances. If it cannot\nhonor the guarantee, it invokes the OOM killer on other processes to free pages.</p>\n<p><strong>Burstable</strong> Pods get soft protection via <code>memory.low</code>. For the same 512 MiB\nrequest on a Burstable Pod:</p>\n<pre tabindex=\"0\"><code class=\"language-none\" data-lang=\"none\">$ cat /sys/fs/cgroup/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod8b3c7d2e_4f5a_6b7c_9d1e_3f4a5b6c7d8e.slice/memory.low\n536870912\n</code></pre><p>The kernel avoids reclaiming this memory under normal pressure, but may reclaim\nit if the alternative is a system-wide OOM.</p>\n<p><strong>BestEffort</strong> Pods get neither <code>memory.min</code> nor <code>memory.low</code>. Their memory\nremains fully reclaimable.</p>\n<h4 id=\"comparison-with-v1-27-behavior\">Comparison with v1.27 behavior<a class=\"td-heading-self-link\" href=\"#comparison-with-v1-27-behavior\" aria-label=\"Heading self-link\"></a></h4><p>In earlier versions, enabling the MemoryQoS feature gate immediately set <code>memory.min</code> for every container with a memory request. <code>memory.min</code> is a hard reservation that the kernel will not reclaim, regardless of memory pressure.</p>\n<p>Consider a node with 8 GiB of RAM where Burstable Pod requests total 7 GiB. In earlier versions, that 7 GiB would be locked as <code>memory.min</code>, leaving little headroom for the kernel, system daemons, or BestEffort workloads and increasing the risk of OOM kills.</p>\n<p>With v1.36 tiered reservation, those Burstable requests map to <code>memory.low</code> instead of <code>memory.min</code>. Under normal pressure, the kernel still protects that memory, but under extreme pressure it can reclaim part of it to avoid system-wide OOM. Only Guaranteed Pods use <code>memory.min</code>, which keeps hard reservation lower.</p>\n<p>With <code>memoryReservationPolicy</code> in v1.36, you can enable throttling first, observe workload behavior, and opt into reservation when your node has enough headroom.</p>\n<h3 id=\"observability-metrics\">Observability metrics<a class=\"td-heading-self-link\" href=\"#observability-metrics\" aria-label=\"Heading self-link\"></a></h3><p>Two alpha-stability metrics are exposed on the kubelet <code>/metrics</code> endpoint:</p>\n<table>\n<thead>\n<tr>\n<th>Metric</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>kubelet_memory_qos_node_memory_min_bytes</code></td>\n<td>Total <code>memory.min</code> across Guaranteed Pods</td>\n</tr>\n<tr>\n<td><code>kubelet_memory_qos_node_memory_low_bytes</code></td>\n<td>Total <code>memory.low</code> across Burstable Pods</td>\n</tr>\n</tbody>\n</table>\n<p>These are useful for capacity planning. If <code>kubelet_memory_qos_node_memory_min_bytes</code>\nis creeping toward your node's physical memory, you know hard reservation is\ngetting tight.</p>\n<pre tabindex=\"0\"><code class=\"language-none\" data-lang=\"none\">$ curl -sk https://localhost:10250/metrics | grep memory_qos\n# HELP kubelet_memory_qos_node_memory_min_bytes [ALPHA] Total memory.min in bytes for Guaranteed pods\nkubelet_memory_qos_node_memory_min_bytes 5.36870912e+08\n# HELP kubelet_memory_qos_node_memory_low_bytes [ALPHA] Total memory.low in bytes for Burstable pods\nkubelet_memory_qos_node_memory_low_bytes 2.147483648e+09\n</code></pre><h3 id=\"kernel-version-check\">Kernel version check<a class=\"td-heading-self-link\" href=\"#kernel-version-check\" aria-label=\"Heading self-link\"></a></h3><p>On kernels older than 5.9, <code>memory.high</code> throttling can trigger the\n<a href=\"https://lore.kernel.org/all/a4e23b59e9ef499b575ae73a8120ee089b7d3373.1594640214.git.chris@chrisdown.name/\">kernel livelock</a> issue. The bug was fixed\nin kernel 5.9. In v1.36, when the feature gate is enabled, the kubelet checks the\nkernel version at startup and logs a warning if it is below 5.9. The feature\ncontinues to work — this is informational, not a hard block.</p>\n<h3 id=\"how-kubernetes-maps-memory-qos-to-cgroup-v2\">How Kubernetes maps Memory QoS to cgroup v2<a class=\"td-heading-self-link\" href=\"#how-kubernetes-maps-memory-qos-to-cgroup-v2\" aria-label=\"Heading self-link\"></a></h3><p>Memory QoS uses four cgroup v2 memory controller interfaces:</p>\n<ul>\n<li><strong><code>memory.max</code></strong>: hard memory limit — unchanged from previous versions</li>\n<li><strong><code>memory.min</code></strong>: hard memory protection — with <code>TieredReservation</code>, set only for Guaranteed Pods</li>\n<li><strong><code>memory.low</code></strong>: soft memory protection — set for Burstable Pods with <code>TieredReservation</code></li>\n<li><strong><code>memory.high</code></strong>: memory throttling threshold — unchanged from previous versions</li>\n</ul>\n<p>The following table shows how Kubernetes container resources map to cgroup v2\ninterfaces when <code>memoryReservationPolicy: TieredReservation</code> is configured.\nWith the default <code>memoryReservationPolicy: None</code>, no <code>memory.min</code> or\n<code>memory.low</code> values are set.</p>\n<table>\n<tr>\n<th>QoS Class</th>\n<th><tt>memory.min</tt></th>\n<th><tt>memory.low</tt></th>\n<th><tt>memory.high</tt></th>\n<th><tt>memory.max</tt></th>\n</tr>\n<tr>\n<td><b>Guaranteed</b></td>\n<td>Set to <code>requests.memory</code><br>(hard protection)</td>\n<td>Not set</td>\n<td>Not set<br>(requests == limits, so throttling is not useful)</td>\n<td>Set to <code>limits.memory</code></td>\n</tr>\n<tr>\n<td><b>Burstable</b></td>\n<td>Not set</td>\n<td>Set to <code>requests.memory</code><br>(soft protection)</td>\n<td>Calculated based on<br>formula with throttling factor</td>\n<td>Set to <code>limits.memory</code><br>(if specified)</td>\n</tr>\n<tr>\n<td><b>BestEffort</b></td>\n<td>Not set</td>\n<td>Not set</td>\n<td>Calculated based on<br>node allocatable memory</td>\n<td>Not set</td>\n</tr>\n</table>\n<h3 id=\"cgroup-hierarchy\">Cgroup hierarchy<a class=\"td-heading-self-link\" href=\"#cgroup-hierarchy\" aria-label=\"Heading self-link\"></a></h3><p>cgroup v2 requires that a parent cgroup's memory protection is at least as\nlarge as the sum of its children's. The kubelet maintains this by setting\n<code>memory.min</code> on the kubepods root cgroup to the sum of all Guaranteed and\nBurstable Pod memory requests, and <code>memory.low</code> on the Burstable QoS cgroup\nto the sum of all Burstable Pod memory requests. This way the kernel can\nenforce the per-container and per-pod protection values correctly.</p>\n<p>The kubelet manages pod-level and QoS-class cgroups directly using the runc\nlibcontainer library, while container-level cgroups are managed by the\ncontainer runtime (containerd or CRI-O).</p>\n<h2 id=\"how-do-i-use-it\">How do I use it?<a class=\"td-heading-self-link\" href=\"#how-do-i-use-it\" aria-label=\"Heading self-link\"></a></h2><h3 id=\"prerequisites\">Prerequisites<a class=\"td-heading-self-link\" href=\"#prerequisites\" aria-label=\"Heading self-link\"></a></h3><ol>\n<li>Kubernetes v1.36 or later</li>\n<li>Linux with cgroup v2. Kernel 5.9 or higher is recommended — earlier kernels\nwork but may experience the livelock issue. You can verify cgroup v2 is\nactive by running <code>mount | grep cgroup2</code>.</li>\n<li>A container runtime that supports cgroup v2 (containerd 1.6+, CRI-O 1.22+)</li>\n</ol>\n<h3 id=\"configuration\">Configuration<a class=\"td-heading-self-link\" href=\"#configuration\" aria-label=\"Heading self-link\"></a></h3><p>To enable Memory QoS with tiered protection:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">kubelet.config.k8s.io/v1beta1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">KubeletConfiguration</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">featureGates</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">MemoryQoS</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"kc\">true</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">memoryReservationPolicy: TieredReservation # Options</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">None (default), TieredReservation</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">memoryThrottlingFactor: 0.9 # Optional</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">default is 0.9</span><span class=\"w\">\n</span></span></span></code></pre></div><p>If you want <code>memory.high</code> throttling without memory protection, omit\n<code>memoryReservationPolicy</code> or set it to <code>None</code>:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">kubelet.config.k8s.io/v1beta1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">KubeletConfiguration</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">featureGates</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">MemoryQoS</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"kc\">true</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">memoryReservationPolicy</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">None </span><span class=\"w\"> </span><span class=\"c\"># This is the default</span><span class=\"w\">\n</span></span></span></code></pre></div><h2 id=\"how-can-i-learn-more\">How can I learn more?<a class=\"td-heading-self-link\" href=\"#how-can-i-learn-more\" aria-label=\"Heading self-link\"></a></h2><ul>\n<li><a href=\"https://kep.k8s.io/2570\">KEP-2570: Memory QoS</a></li>\n<li><a href=\"https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/\">Pod Quality of Service Classes</a></li>\n<li><a href=\"https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/\">Managing Resources for Containers</a></li>\n<li><a href=\"https://kubernetes.io/docs/concepts/architecture/cgroups/\">Kubernetes cgroups v2 support</a></li>\n<li><a href=\"https://docs.kernel.org/admin-guide/cgroup-v2.html\">Linux kernel cgroups v2 documentation</a></li>\n</ul>\n<h2 id=\"getting-involved\">Getting involved<a class=\"td-heading-self-link\" href=\"#getting-involved\" aria-label=\"Heading self-link\"></a></h2><p>This feature is driven by <a href=\"https://github.com/kubernetes/community/tree/master/sig-node\">SIG Node</a>.\nIf you are interested in contributing or have feedback, you can find us on\n<a href=\"https://kubernetes.slack.com/messages/sig-node\">Slack</a> (#sig-node), the\n<a href=\"https://groups.google.com/forum/#!forum/kubernetes-sig-node\">mailing list</a>,\nor at the regular\n<a href=\"https://github.com/kubernetes/community/tree/master/sig-node#meetings\">SIG Node meetings</a>.\nPlease file bugs at <a href=\"https://github.com/kubernetes/kubernetes/issues\">kubernetes/kubernetes</a>\nand enhancement proposals at\n<a href=\"https://github.com/kubernetes/enhancements/issues/2570\">kubernetes/enhancements</a>.</p>"
---

On behalf of SIG Node, we are pleased to announce updates to the Memory QoS
feature (alpha) in Kubernetes v1.36. Memory QoS uses the cgroup v2 memory
controller to give the kernel better guidance on how to treat container memory.
It was first introduced in v1.22 and updated in v1.27. In Kubernetes v1.36, we're introducing: opt-in memory reservation, tiered
protection by QoS class, observability metrics, and kernel-version warning for memory.high.
What's new in v1.36
Opt-in memory reservation with memoryReservationPolicy
v1.36 separates throttling from reservation. Enabling the feature gate turns on
memory.high throttling (the kubelet sets memory.high based on
memoryThrottlingFactor, default 0.9), but memory reservation is now controlled
by a separate kubelet configuration field:
None (default): no memory.min or memory.low is written. Throttling
via memory.high still works.
TieredReservation: the kubelet writes tiered memory protection based on the Pod's
QoS class:
Guaranteed Pods get hard protection via memory.min. For example, a
Guaranteed Pod requesting 512 MiB of memory results in:
$ cat /sys/fs/cgroup/kubepods.slice/kubepods-pod6a4f2e3b_1c9d_4a5e_8f7b_2d3e4f5a6b7c.slice/memory.min
536870912

The kernel will not reclaim this memory under any circumstances. If it cannot
honor the guarantee, it invokes the OOM killer on other processes to free pages.
Burstable Pods get soft protection via memory.low. For the same 512 MiB
request on a Burstable Pod:
$ cat /sys/fs/cgroup/kubepods.slice/kubepods-burstable.slice/kubepods-burstable-pod8b3c7d2e_4f5a_6b7c_9d1e_3f4a5b6c7d8e.slice/memory.low
536870912

The kernel avoids reclaiming this memory under normal pressure, but may reclaim
it if the alternative is a system-wide OOM.
BestEffort Pods get neither memory.min nor memory.low. Their memory
remains fully reclaimable.
Comparison with v1.27 behavior
In earlier versions, enabling the MemoryQoS feature gate immediately set memory.min for every container with a memory request. memory.min is a hard reservation that the kernel will not reclaim, regardless of memory pressure.
Consider a node with 8 GiB of RAM where Burstable Pod requests total 7 GiB. In earlier versions, that 7 GiB would be locked as memory.min, leaving little headroom for the kernel, system daemons, or BestEffort workloads and increasing the risk of OOM kills.
With v1.36 tiered reservation, those Burstable requests map to memory.low instead of memory.min. Under normal pressure, the kernel still protects that memory, but under extreme pressure it can reclaim part of it to avoid system-wide OOM. Only Guaranteed Pods use memory.min, which keeps hard reservation lower.
With memoryReservationPolicy in v1.36, you can enable throttling first, observe workload behavior, and opt into reservation when your node has enough headroom.
Observability metrics
Two alpha-stability metrics are exposed on the kubelet /metrics endpoint:
Metric
Description




kubelet_memory_qos_node_memory_min_bytes
Total memory.min across Guaranteed Pods


kubelet_memory_qos_node_memory_low_bytes
Total memory.low across Burstable Pods



These are useful for capacity planning. If kubelet_memory_qos_node_memory_min_bytes
is creeping toward your node's physical memory, you know hard reservation is
getting tight.
$ curl -sk https://localhost:10250/metrics | grep memory_qos
# HELP kubelet_memory_qos_node_memory_min_bytes [ALPHA] Total memory.min in bytes for Guaranteed pods
kubelet_memory_qos_node_memory_min_bytes 5.36870912e+08
# HELP kubelet_memory_qos_node_memory_low_bytes [ALPHA] Total memory.low in bytes for Burstable pods
kubelet_memory_qos_node_memory_low_bytes 2.147483648e+09

Kernel version check
On kernels older than 5.9, memory.high throttling can trigger the
kernel livelock issue. The bug was fixed
in kernel 5.9. In v1.36, when the feature gate is enabled, the kubelet checks the
kernel version at startup and logs a warning if it is below 5.9. The feature
continues to work — this is informational, not a hard block.
How Kubernetes maps Memory QoS to cgroup v2
Memory QoS uses four cgroup v2 memory controller interfaces:
memory.max: hard memory limit — unchanged from previous versions
memory.min: hard memory protection — with TieredReservation, set only for Guaranteed Pods
memory.low: soft memory protection — set for Burstable Pods with TieredReservation
memory.high: memory throttling threshold — unchanged from previous versions
The following table shows how Kubernetes container resources map to cgroup v2
interfaces when memoryReservationPolicy: TieredReservation is configured.
With the default memoryReservationPolicy: None, no memory.min or
memory.low values are set.
QoS Class
memory.min
memory.low
memory.high
memory.max


Guaranteed
Set to requests.memory
(hard protection)
Not set
Not set
(requests == limits, so throttling is not useful)
Set to limits.memory


Burstable
Not set
Set to requests.memory
(soft protection)
Calculated based on
formula with throttling factor
Set to limits.memory
(if specified)


BestEffort
Not set
Not set
Calculated based on
node allocatable memory
Not set


Cgroup hierarchy
cgroup v2 requires that a parent cgroup's memory protection is at least as
large as the sum of its children's. The kubelet maintains this by setting
memory.min on the kubepods root cgroup to the sum of all Guaranteed and
Burstable Pod memory requests, and memory.low on the Burstable QoS cgroup
to the sum of all Burstable Pod memory requests. This way the kernel can
enforce the per-container and per-pod protection values correctly.
The kubelet manages pod-level and QoS-class cgroups directly using the runc
libcontainer library, while container-level cgroups are managed by the
container runtime (containerd or CRI-O).
How do I use it?
Prerequisites

Kubernetes v1.36 or later
Linux with cgroup v2. Kernel 5.9 or higher is recommended — earlier kernels
work but may experience the livelock issue. You can verify cgroup v2 is
active by running mount | grep cgroup2.
A container runtime that supports cgroup v2 (containerd 1.6+, CRI-O 1.22+)
Configuration
To enable Memory QoS with tiered protection:
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
 MemoryQoS: true
memoryReservationPolicy: TieredReservation # Options: None (default), TieredReservation
memoryThrottlingFactor: 0.9 # Optional: default is 0.9


If you want memory.high throttling without memory protection, omit
memoryReservationPolicy or set it to None:
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
 MemoryQoS: true
memoryReservationPolicy: None  # This is the default


How can I learn more?

KEP-2570: Memory QoS
Pod Quality of Service Classes
Managing Resources for Containers
Kubernetes cgroups v2 support
Linux kernel cgroups v2 documentation
Getting involved
This feature is driven by SIG Node.
If you are interested in contributing or have feedback, you can find us on
Slack (#sig-node), the
mailing list,
or at the regular
SIG Node meetings.
Please file bugs at kubernetes/kubernetes
and enhancement proposals at
kubernetes/enhancements.
