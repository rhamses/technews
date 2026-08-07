---
title: "New Conversion from cgroup v1 CPU Shares to v2 CPU Weight"
link: "https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/"
guid: "https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/"
pubDate: "2026-01-30T16:00:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "I'm excited to announce the implementation of an improved conversion formula\nfrom cgroup v1 CPU shares to cgroup v2 CPU weight. This enhancement addresses\ncritical issues with CPU priority allocation for Kubernetes workloads when\nrunning on systems with cgroup v2.\nBackground\nKubernetes was originally designed with cgroup v1 in mind, where CPU shares\nwere derived from a container's CPU requests using the following formula:\n$$cpu.shares = milliCPU \\times \\frac{1024}{1000}$$\nNote that the value 1024 in this formula is the default cpu.shares value\nin cgroup v1, and is unrelated to millicores. For example, a container\nrequesting 1 CPU (1000m) would get (cpu.shares = 1000 \\times 1024 / 1000 = 1024),\nand a container requesting 100m would get (cpu.shares = 100 \\times 1024 / 1000 = 102).\nAfter a while, cgroup v1 started being replaced by its successor,\ncgroup v2. In cgroup v2, the concept of CPU shares (which ranges from 2 to\n262144, or from 2¹ to 2¹⁸) was replaced with CPU weight (which ranges from\n[1, 10000], or 10⁰ to 10⁴).\nWith the transition to cgroup v2,\nKEP-2254\nintroduced a conversion formula to map cgroup v1 CPU shares to cgroup v2 CPU\nweight. The conversion formula was defined as: cpu.weight = (1 + ((cpu.shares - 2) * 9999) / 262142)\nThis formula linearly maps values from [2¹, 2¹⁸] to [10⁰, 10⁴].\n\nWhile this approach is simple, the linear mapping imposes a few significant\nproblems and impacts both performance and configuration granularity.\nProblems with previous conversion formula\nThe current conversion formula creates two major issues:\n1. Reduced priority against non-Kubernetes workloads\nIn cgroup v1, the default value for CPU shares is 1024, meaning a container\nrequesting 1 CPU has equal priority with system processes that live outside\nof Kubernetes' scope.\nHowever, in cgroup v2, the default CPU weight is 100, but the current\nformula converts 1 CPU (1000m) to only ≈39 weight - less than 40% of the\ndefault.\nExample:\nContainer requesting 1 CPU (1000m)\ncgroup v1: cpu.shares = 1024 (equal to default)\ncgroup v2 (current): cpu.weight = 39 (much lower than default 100)\nThis means that after moving to cgroup v2, Kubernetes (or OCI) workloads would\nde-facto reduce their CPU priority against non-Kubernetes processes. The\nproblem can be severe for setups with many system daemons that run\noutside of Kubernetes' scope and expect Kubernetes workloads to have\npriority, especially in situations of resource starvation.\n2. Unmanageable granularity\nThe current formula produces very low values for small CPU requests,\nlimiting the ability to create sub-cgroups within containers for\nfine-grained resource distribution (which will possibly be much easier moving\nforward, see KEP #5474 for more info).\nExample:\nContainer requesting 100m CPU\ncgroup v1: cpu.shares = 102\ncgroup v2 (current): cpu.weight = 4 (too low for sub-cgroup\nconfiguration)\nWith cgroup v1, requesting 100m CPU which led to 102 CPU shares was manageable\nin the sense that sub-cgroups could have been created inside the main\ncontainer, assigning fine-grained CPU priorities for different groups of\nprocesses. With cgroup v2 however, having 4 shares is very hard to\ndistribute between sub-cgroups since it's not granular enough.\nWith plans to allow writable cgroups for unprivileged containers,\nthis becomes even\nmore relevant.\nNew conversion formula\nDescription\nThe new formula is more complicated, but does a much better job mapping\nbetween cgroup v1 CPU shares and cgroup v2 CPU weight:\n$$cpu.weight = \\lceil 10^{(L^{2}/612 + 125L/612 - 7/34)} \\rceil, \\text{ where: } L = \\log_2(cpu.shares)$$\nThe idea is that this is a quadratic function to cross the following values:\n(2, 1): The minimum values for both ranges.\n(1024, 100): The default values for both ranges.\n(262144, 10000): The maximum values for both ranges.\nVisually, the new function looks as follows:\n\nAnd if you zoom in to the important part:\n\nThe new formula is \"close to linear\", yet it is carefully designed to\nmap the ranges in a clever way so the three important points above would\ncross.\nHow it solves the problems\n\n\nBetter priority alignment:\nA container requesting 1 CPU (1000m) will now get a cpu.weight = 102. This\nvalue is close to cgroup v2's default 100.\nThis restores the intended priority relationship between Kubernetes\nworkloads and system processes.\nImproved granularity:\nA container requesting 100m CPU will get cpu.weight = 17, (see\nhere).\nEnables better fine-grained resource distribution within containers.\nAdoption and integration\nThis change was implemented at the OCI layer.\nIn other words, this is not implemented in Kubernetes itself; therefore the\nadoption of the new conversion formula depends solely on the OCI runtime\nadoption.\nFor example:\nrunc: The new formula is enabled from version 1.3.2.\ncrun: The new formula is enabled from version 1.23.\nImpact on existing deployments\nImportant: Some consumers may be affected if they assume the older linear conversion formula.\nApplications or monitoring tools that directly calculate expected CPU weight values based on the\nprevious formula may need updates to account for the new quadratic conversion.\nThis is particularly relevant for:\nCustom resource management tools that predict CPU weight values.\nMonitoring systems that validate or expect specific weight values.\nApplications that programmatically set or verify CPU weight values.\nAlso note that reversing the conversion from cpu.weight back to milliCPU\nwill not always yield the exact original value. There are two sources of\ninformation loss: the milliCPU to cpu.shares conversion involves integer\ntruncation (e.g. 100m becomes 102 shares, not 102.4), and more significantly,\nthe shares-to-weight mapping is many-to-one (e.g. milliCPU values 90\nthrough 109 all map to cpu.weight = 17). Tools that need precise CPU\nrequest values should read them directly from the pod spec rather than\nderiving them from cgroup parameters.\nThe Kubernetes project recommends testing the new conversion formula in non-production\nenvironments before upgrading OCI runtimes to ensure compatibility with existing tooling.\nWhere can I learn more?\nFor those interested in this enhancement:\nKubernetes GitHub Issue #131216 - Detailed technical\nanalysis and examples, including discussions and reasoning for choosing the\nabove formula.\nKEP-2254: cgroup v2 -\nOriginal cgroup v2 implementation in Kubernetes.\nKubernetes cgroup documentation -\nCurrent resource management guidance.\nHow do I get involved?\nFor those interested in getting involved with Kubernetes node-level\nfeatures, join the Kubernetes Node Special Interest Group.\nWe always welcome new contributors and diverse perspectives on resource management\nchallenges."
contentHtml: "<p>I'm excited to announce the implementation of an improved conversion formula\nfrom cgroup v1 CPU shares to cgroup v2 CPU weight. This enhancement addresses\ncritical issues with CPU priority allocation for Kubernetes workloads when\nrunning on systems with cgroup v2.</p>\n<h2 id=\"background\">Background<a class=\"td-heading-self-link\" href=\"#background\" aria-label=\"Heading self-link\"></a></h2><p>Kubernetes was originally designed with cgroup v1 in mind, where CPU shares\nwere derived from a container's CPU requests using the following formula:</p>\n<div class=\"math\">$$cpu.shares = milliCPU \\times \\frac{1024}{1000}$$</div><p>Note that the value 1024 in this formula is the default <code>cpu.shares</code> value\nin cgroup v1, and is unrelated to millicores. For example, a container\nrequesting 1 CPU (1000m) would get (cpu.shares = 1000 \\times 1024 / 1000 = 1024),\nand a container requesting 100m would get (cpu.shares = 100 \\times 1024 / 1000 = 102).</p>\n<p>After a while, cgroup v1 started being replaced by its successor,\ncgroup v2. In cgroup v2, the concept of CPU shares (which ranges from 2 to\n262144, or from 2¹ to 2¹⁸) was replaced with CPU weight (which ranges from\n[1, 10000], or 10⁰ to 10⁴).</p>\n<p>With the transition to cgroup v2,\n<a href=\"https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2254-cgroup-v2\">KEP-2254</a>\nintroduced a conversion formula to map cgroup v1 CPU shares to cgroup v2 CPU\nweight. The conversion formula was defined as: <code>cpu.weight = (1 + ((cpu.shares - 2) * 9999) / 262142)</code></p>\n<p>This formula linearly maps values from [2¹, 2¹⁸] to [10⁰, 10⁴].</p>\n<p><img src=\"https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/linear-conversion.png\" alt=\"Linear conversion formula\" title=\"formula\"></p>\n<p>While this approach is simple, the linear mapping imposes a few significant\nproblems and impacts both performance and configuration granularity.</p>\n<h2 id=\"problems-with-previous-conversion-formula\">Problems with previous conversion formula<a class=\"td-heading-self-link\" href=\"#problems-with-previous-conversion-formula\" aria-label=\"Heading self-link\"></a></h2><p>The current conversion formula creates two major issues:</p>\n<h3 id=\"1-reduced-priority-against-non-kubernetes-workloads\">1. Reduced priority against non-Kubernetes workloads<a class=\"td-heading-self-link\" href=\"#1-reduced-priority-against-non-kubernetes-workloads\" aria-label=\"Heading self-link\"></a></h3><p>In cgroup v1, the default value for CPU shares is <code>1024</code>, meaning a container\nrequesting 1 CPU has equal priority with system processes that live outside\nof Kubernetes' scope.\nHowever, in cgroup v2, the default CPU weight is <code>100</code>, but the current\nformula converts 1 CPU (1000m) to only <code>≈39</code> weight - less than 40% of the\ndefault.</p>\n<p><strong>Example:</strong></p>\n<ul>\n<li>Container requesting 1 CPU (1000m)</li>\n<li>cgroup v1: <code>cpu.shares = 1024</code> (equal to default)</li>\n<li>cgroup v2 (current): <code>cpu.weight = 39</code> (much lower than default 100)</li>\n</ul>\n<p>This means that after moving to cgroup v2, Kubernetes (or OCI) workloads would\nde-facto reduce their CPU priority against non-Kubernetes processes. The\nproblem can be severe for setups with many system daemons that run\noutside of Kubernetes' scope and expect Kubernetes workloads to have\npriority, especially in situations of resource starvation.</p>\n<h3 id=\"2-unmanageable-granularity\">2. Unmanageable granularity<a class=\"td-heading-self-link\" href=\"#2-unmanageable-granularity\" aria-label=\"Heading self-link\"></a></h3><p>The current formula produces very low values for small CPU requests,\nlimiting the ability to create sub-cgroups within containers for\nfine-grained resource distribution (which will possibly be much easier moving\nforward, see <a href=\"https://github.com/kubernetes/enhancements/issues/5474\">KEP #5474</a> for more info).</p>\n<p><strong>Example:</strong></p>\n<ul>\n<li>Container requesting 100m CPU</li>\n<li>cgroup v1: <code>cpu.shares = 102</code></li>\n<li>cgroup v2 (current): <code>cpu.weight = 4</code> (too low for sub-cgroup\nconfiguration)</li>\n</ul>\n<p>With cgroup v1, requesting 100m CPU which led to 102 CPU shares was manageable\nin the sense that sub-cgroups could have been created inside the main\ncontainer, assigning fine-grained CPU priorities for different groups of\nprocesses. With cgroup v2 however, having 4 shares is very hard to\ndistribute between sub-cgroups since it's not granular enough.</p>\n<p>With plans to allow <a href=\"https://github.com/kubernetes/enhancements/issues/5474\">writable cgroups for unprivileged containers</a>,\nthis becomes even\nmore relevant.</p>\n<h2 id=\"new-conversion-formula\">New conversion formula<a class=\"td-heading-self-link\" href=\"#new-conversion-formula\" aria-label=\"Heading self-link\"></a></h2><h3 id=\"description\">Description<a class=\"td-heading-self-link\" href=\"#description\" aria-label=\"Heading self-link\"></a></h3><p>The new formula is more complicated, but does a much better job mapping\nbetween cgroup v1 CPU shares and cgroup v2 CPU weight:</p>\n<div class=\"math\">$$cpu.weight = \\lceil 10^{(L^{2}/612 + 125L/612 - 7/34)} \\rceil, \\text{ where: } L = \\log_2(cpu.shares)$$</div><p>The idea is that this is a quadratic function to cross the following values:</p>\n<ul>\n<li>(2, 1): The minimum values for both ranges.</li>\n<li>(1024, 100): The default values for both ranges.</li>\n<li>(262144, 10000): The maximum values for both ranges.</li>\n</ul>\n<p>Visually, the new function looks as follows:</p>\n<p><img src=\"https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/new-conversion-formula.png\" alt=\"2025-10-25-new-cgroup-v1-to-v2-conversion-formula-new-conversion.png\"></p>\n<p>And if you zoom in to the important part:</p>\n<p><img src=\"https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/new-conversion-formula-zoom.png\" alt=\"2025-10-25-new-cgroup-v1-to-v2-conversion-formula-new-conversion-zoom.png\"></p>\n<p>The new formula is &quot;close to linear&quot;, yet it is carefully designed to\nmap the ranges in a clever way so the three important points above would\ncross.</p>\n<h3 id=\"how-it-solves-the-problems\">How it solves the problems<a class=\"td-heading-self-link\" href=\"#how-it-solves-the-problems\" aria-label=\"Heading self-link\"></a></h3><ol>\n<li>\n<p><strong>Better priority alignment:</strong></p>\n<ul>\n<li>A container requesting 1 CPU (1000m) will now get a <code>cpu.weight = 102</code>. This\nvalue is close to cgroup v2's default 100.\nThis restores the intended priority relationship between Kubernetes\nworkloads and system processes.</li>\n</ul>\n</li>\n<li>\n<p><strong>Improved granularity:</strong></p>\n<ul>\n<li>A container requesting 100m CPU will get <code>cpu.weight = 17</code>, (see\n<a href=\"https://go.dev/play/p/sLlAfCg54Eg\">here</a>).\nEnables better fine-grained resource distribution within containers.</li>\n</ul>\n</li>\n</ol>\n<h2 id=\"adoption-and-integration\">Adoption and integration<a class=\"td-heading-self-link\" href=\"#adoption-and-integration\" aria-label=\"Heading self-link\"></a></h2><p>This change was implemented at the OCI layer.\nIn other words, this is not implemented in Kubernetes itself; therefore the\nadoption of the new conversion formula depends solely on the OCI runtime\nadoption.</p>\n<p>For example:</p>\n<ul>\n<li>runc: The new formula is enabled from version <a href=\"https://github.com/opencontainers/runc/releases/tag/v1.3.2\">1.3.2</a>.</li>\n<li>crun: The new formula is enabled from version <a href=\"https://github.com/containers/crun/releases/tag/1.23\">1.23</a>.</li>\n</ul>\n<h3 id=\"impact-on-existing-deployments\">Impact on existing deployments<a class=\"td-heading-self-link\" href=\"#impact-on-existing-deployments\" aria-label=\"Heading self-link\"></a></h3><p><strong>Important:</strong> Some consumers may be affected if they assume the older linear conversion formula.\nApplications or monitoring tools that directly calculate expected CPU weight values based on the\nprevious formula may need updates to account for the new quadratic conversion.\nThis is particularly relevant for:</p>\n<ul>\n<li>Custom resource management tools that predict CPU weight values.</li>\n<li>Monitoring systems that validate or expect specific weight values.</li>\n<li>Applications that programmatically set or verify CPU weight values.</li>\n</ul>\n<p>Also note that reversing the conversion from <code>cpu.weight</code> back to milliCPU\nwill not always yield the exact original value. There are two sources of\ninformation loss: the milliCPU to <code>cpu.shares</code> conversion involves integer\ntruncation (e.g. 100m becomes 102 shares, not 102.4), and more significantly,\nthe shares-to-weight mapping is many-to-one (e.g. milliCPU values 90\nthrough 109 all map to <code>cpu.weight = 17</code>). Tools that need precise CPU\nrequest values should read them directly from the pod spec rather than\nderiving them from cgroup parameters.</p>\n<p>The Kubernetes project recommends testing the new conversion formula in non-production\nenvironments before upgrading OCI runtimes to ensure compatibility with existing tooling.</p>\n<h2 id=\"where-can-i-learn-more\">Where can I learn more?<a class=\"td-heading-self-link\" href=\"#where-can-i-learn-more\" aria-label=\"Heading self-link\"></a></h2><p>For those interested in this enhancement:</p>\n<ul>\n<li><a href=\"https://github.com/kubernetes/kubernetes/issues/131216\">Kubernetes GitHub Issue #131216</a> - Detailed technical\nanalysis and examples, including discussions and reasoning for choosing the\nabove formula.</li>\n<li><a href=\"https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2254-cgroup-v2\">KEP-2254: cgroup v2</a> -\nOriginal cgroup v2 implementation in Kubernetes.</li>\n<li><a href=\"https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/\">Kubernetes cgroup documentation</a> -\nCurrent resource management guidance.</li>\n</ul>\n<h2 id=\"how-do-i-get-involved\">How do I get involved?<a class=\"td-heading-self-link\" href=\"#how-do-i-get-involved\" aria-label=\"Heading self-link\"></a></h2><p>For those interested in getting involved with Kubernetes node-level\nfeatures, join the <a href=\"https://github.com/kubernetes/community/tree/master/sig-node\">Kubernetes Node Special Interest Group</a>.\nWe always welcome new contributors and diverse perspectives on resource management\nchallenges.</p>"
---

I'm excited to announce the implementation of an improved conversion formula
from cgroup v1 CPU shares to cgroup v2 CPU weight. This enhancement addresses
critical issues with CPU priority allocation for Kubernetes workloads when
running on systems with cgroup v2.
Background
Kubernetes was originally designed with cgroup v1 in mind, where CPU shares
were derived from a container's CPU requests using the following formula:
$$cpu.shares = milliCPU \times \frac{1024}{1000}$$
Note that the value 1024 in this formula is the default cpu.shares value
in cgroup v1, and is unrelated to millicores. For example, a container
requesting 1 CPU (1000m) would get (cpu.shares = 1000 \times 1024 / 1000 = 1024),
and a container requesting 100m would get (cpu.shares = 100 \times 1024 / 1000 = 102).
After a while, cgroup v1 started being replaced by its successor,
cgroup v2. In cgroup v2, the concept of CPU shares (which ranges from 2 to
262144, or from 2¹ to 2¹⁸) was replaced with CPU weight (which ranges from
[1, 10000], or 10⁰ to 10⁴).
With the transition to cgroup v2,
KEP-2254
introduced a conversion formula to map cgroup v1 CPU shares to cgroup v2 CPU
weight. The conversion formula was defined as: cpu.weight = (1 + ((cpu.shares - 2) * 9999) / 262142)
This formula linearly maps values from [2¹, 2¹⁸] to [10⁰, 10⁴].

While this approach is simple, the linear mapping imposes a few significant
problems and impacts both performance and configuration granularity.
Problems with previous conversion formula
The current conversion formula creates two major issues:
1. Reduced priority against non-Kubernetes workloads
In cgroup v1, the default value for CPU shares is 1024, meaning a container
requesting 1 CPU has equal priority with system processes that live outside
of Kubernetes' scope.
However, in cgroup v2, the default CPU weight is 100, but the current
formula converts 1 CPU (1000m) to only ≈39 weight - less than 40% of the
default.
Example:
Container requesting 1 CPU (1000m)
cgroup v1: cpu.shares = 1024 (equal to default)
cgroup v2 (current): cpu.weight = 39 (much lower than default 100)
This means that after moving to cgroup v2, Kubernetes (or OCI) workloads would
de-facto reduce their CPU priority against non-Kubernetes processes. The
problem can be severe for setups with many system daemons that run
outside of Kubernetes' scope and expect Kubernetes workloads to have
priority, especially in situations of resource starvation.
2. Unmanageable granularity
The current formula produces very low values for small CPU requests,
limiting the ability to create sub-cgroups within containers for
fine-grained resource distribution (which will possibly be much easier moving
forward, see KEP #5474 for more info).
Example:
Container requesting 100m CPU
cgroup v1: cpu.shares = 102
cgroup v2 (current): cpu.weight = 4 (too low for sub-cgroup
configuration)
With cgroup v1, requesting 100m CPU which led to 102 CPU shares was manageable
in the sense that sub-cgroups could have been created inside the main
container, assigning fine-grained CPU priorities for different groups of
processes. With cgroup v2 however, having 4 shares is very hard to
distribute between sub-cgroups since it's not granular enough.
With plans to allow writable cgroups for unprivileged containers,
this becomes even
more relevant.
New conversion formula
Description
The new formula is more complicated, but does a much better job mapping
between cgroup v1 CPU shares and cgroup v2 CPU weight:
$$cpu.weight = \lceil 10^{(L^{2}/612 + 125L/612 - 7/34)} \rceil, \text{ where: } L = \log_2(cpu.shares)$$
The idea is that this is a quadratic function to cross the following values:
(2, 1): The minimum values for both ranges.
(1024, 100): The default values for both ranges.
(262144, 10000): The maximum values for both ranges.
Visually, the new function looks as follows:

And if you zoom in to the important part:

The new formula is "close to linear", yet it is carefully designed to
map the ranges in a clever way so the three important points above would
cross.
How it solves the problems


Better priority alignment:
A container requesting 1 CPU (1000m) will now get a cpu.weight = 102. This
value is close to cgroup v2's default 100.
This restores the intended priority relationship between Kubernetes
workloads and system processes.
Improved granularity:
A container requesting 100m CPU will get cpu.weight = 17, (see
here).
Enables better fine-grained resource distribution within containers.
Adoption and integration
This change was implemented at the OCI layer.
In other words, this is not implemented in Kubernetes itself; therefore the
adoption of the new conversion formula depends solely on the OCI runtime
adoption.
For example:
runc: The new formula is enabled from version 1.3.2.
crun: The new formula is enabled from version 1.23.
Impact on existing deployments
Important: Some consumers may be affected if they assume the older linear conversion formula.
Applications or monitoring tools that directly calculate expected CPU weight values based on the
previous formula may need updates to account for the new quadratic conversion.
This is particularly relevant for:
Custom resource management tools that predict CPU weight values.
Monitoring systems that validate or expect specific weight values.
Applications that programmatically set or verify CPU weight values.
Also note that reversing the conversion from cpu.weight back to milliCPU
will not always yield the exact original value. There are two sources of
information loss: the milliCPU to cpu.shares conversion involves integer
truncation (e.g. 100m becomes 102 shares, not 102.4), and more significantly,
the shares-to-weight mapping is many-to-one (e.g. milliCPU values 90
through 109 all map to cpu.weight = 17). Tools that need precise CPU
request values should read them directly from the pod spec rather than
deriving them from cgroup parameters.
The Kubernetes project recommends testing the new conversion formula in non-production
environments before upgrading OCI runtimes to ensure compatibility with existing tooling.
Where can I learn more?
For those interested in this enhancement:
Kubernetes GitHub Issue #131216 - Detailed technical
analysis and examples, including discussions and reasoning for choosing the
above formula.
KEP-2254: cgroup v2 -
Original cgroup v2 implementation in Kubernetes.
Kubernetes cgroup documentation -
Current resource management guidance.
How do I get involved?
For those interested in getting involved with Kubernetes node-level
features, join the Kubernetes Node Special Interest Group.
We always welcome new contributors and diverse perspectives on resource management
challenges.
