---
title: "Introducing the Cluster API plugin for Headlamp"
link: "https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/"
guid: "https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/"
pubDate: "2026-06-25T22:00:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "Headlamp is an open-source, extensible Kubernetes SIG UI\nproject designed to let you explore, manage, and debug cluster resources directly\nfrom a browser.\nCluster API (CAPI) is a Kubernetes sub-project\nthat brings declarative, Kubernetes-style APIs to cluster lifecycle management. It\nlets platform teams provision, upgrade, and manage the lifecycle of Kubernetes\nclusters using standard Kubernetes objects stored and reconciled in a management\ncluster.\nManaging Cluster API resources has historically required raw kubectl commands and\ndeep familiarity with ownership hierarchies. The Headlamp Cluster API plugin brings\nvisual clarity, faster debugging, and simplified operations for platform teams,\ndirectly inside Headlamp.\nWhat this plugin provides\nThe Cluster API plugin adds a dedicated Cluster API section to Headlamp and brings\nfull visibility into core CAPI resources through consistent list and detail views.\nFeature\nDescription\n\n\n\n\nCluster overview\nView clusters with live control plane and worker replica status.\n\n\nMachine visibility\nInspect MachineDeployments, MachineSets, Machines, and MachinePools with status and conditions.\n\n\nCluster API dashboard\nGet a centralized view of Cluster API resource health, active condition issues, provider information, and remediation guidance.\n\n\nControl plane monitoring\nTrack KubeadmControlPlane replicas, versions, and associated Machines.\n\n\nScale from the UI\nScale MachineDeployments and MachineSets directly from Headlamp.\n\n\nOwned resource hierarchy\nTrace relationships between clusters, deployments, sets, and machines.\n\n\nKubeadmConfig inspection\nView bootstrap configs, files, kubelet args, and join/init settings.\n\n\nTopology awareness\nAutomatically detect and label ClusterClass-managed resources.\n\n\nMap view\nVisualize Cluster, Control Plane, and Worker relationships.\n\n\nDynamic API versioning\nSupports both v1beta1 and v1beta2 Cluster API versions.\n\n\nPrometheus metrics\nView live metrics from the Headlamp Prometheus plugin inline on Cluster API resource detail pages.\n\n\n\nA tour of the plugin\nThe Headlamp Cluster API plugin brings core Cluster API resources into a consistent,\nvisual interface inside Headlamp. Here are some of the key views included in the\nfirst release.\nCluster API dashboard\nThe dashboard provides a centralized view of Cluster API resources and their\nhealth across a management cluster.\n\nThe overview summarizes the status of clusters, Machines, MachineDeployments,\nMachinePools, MachineSets, and control planes. It also highlights active\ncondition issues, provider information, and configuration template counts to\nhelp operators quickly identify degraded or unhealthy resources.\n\nSelecting a cluster opens a detailed health view showing control plane and\nworker status, machine information, infrastructure details, and resource\nconditions. When issues are detected, the dashboard provides remediation\nguidance and diagnostic commands to assist with troubleshooting.\nBring full Cluster API visibility into Headlamp\nThe cluster list view shows all Cluster resources in the management cluster,\nincluding control plane and worker replica status. This gives you an at-a-glance\nunderstanding of overall cluster health.\n\nThe cluster detail view provides resource status, conditions, infrastructure\nreferences, control plane references, and related Machines on a single page.\n\n\nExplore Cluster API resources in a visual interface\nDedicated views are available for MachineDeployments, MachineSets, Machines, and\nMachinePools. These pages surface replica counts, ownership relationships, provider\nIDs, versions, and conditions to support day-to-day operations and debugging.\n\nScale workloads directly from Headlamp\nMachineDeployments and MachineSets include a built-in Scale action, allowing you to\nadjust replica counts directly from Headlamp without using terminal commands.\nFor topology-managed clusters, the plugin also indicates when scaling should be\nperformed at the Cluster level.\n\n\nInspect bootstrap configuration without raw YAML\nBootstrap configurations can be viewed in a structured format, including inline\nfiles, kubelet arguments, extra volumes, and join or init settings. This removes\nthe need to inspect raw YAML or secrets manually.\n\nVisualize cluster relationships with map view\nA visual map view displays the relationships between Cluster, control plane, and\nworker resources. It offers a faster way to understand ownership hierarchies and\noverall cluster structure.\n\nPrometheus metrics integration\nThe Cluster API plugin integrates with the\nHeadlamp Prometheus plugin\nto surface metrics directly inside Cluster API resource detail pages.\nWhen the Prometheus plugin is installed and configured, metrics are embedded inline\non the detail pages for Clusters, MachineDeployments, MachineSets, and Machines.\nYou can view resource health and performance data alongside status conditions and\nownership relationships, without switching to a separate dashboard.\nThis makes it easier to correlate infrastructure state with live metrics during\ndebugging or day-to-day cluster operations, all from within Headlamp.\n\nHow to use\nSee the\nplugins/cluster-api/README.md\nfor installation and usage instructions.\nDeveloped during LFX Mentorship\nThis plugin was developed as part of the CNCF LFX Mentorship program under the\nHeadlamp project. The mentorship provided an opportunity to work closely with the\nHeadlamp community while building features to improve the Cluster API management\nexperience.\nThe focus was not only on implementing features but also on understanding real-world\nusability challenges around Cluster API operations. Discussions with mentors and\ncommunity members helped shape the plugin's direction, improve the user experience,\nand prioritize features most useful to platform teams.\nThe mentorship also provided valuable experience contributing to large open-source\nprojects: collaborating with maintainers, participating in design discussions,\nhandling release feedback, and iterating on features based on community input.\nWork on the plugin is ongoing, with additional improvements and features planned\nbeyond the initial Alpha release.\nFeedback and questions\nThis is an Alpha release, and community feedback directly shapes what comes next.\nBug reports: Open an issue\nFeature requests: Start a discussion\nContributing: PRs are welcome\nKubernetes Slack: Join the #headlamp channel for questions and discussion"
contentHtml: "<div><p><a target=\"_blank\" href=\"https://headlamp.dev/\">Headlamp</a> is an open-source, extensible Kubernetes SIG UI\nproject designed to let you explore, manage, and debug cluster resources directly\nfrom a browser.</p><p><a target=\"_blank\" href=\"https://cluster-api.sigs.k8s.io/\">Cluster API (CAPI)</a> is a Kubernetes sub-project\nthat brings declarative, Kubernetes-style APIs to cluster lifecycle management. It\nlets platform teams provision, upgrade, and manage the lifecycle of Kubernetes\nclusters using standard Kubernetes objects stored and reconciled in a management\ncluster.</p><p>Managing Cluster API resources has historically required raw <code>kubectl</code> commands and\ndeep familiarity with ownership hierarchies. The Headlamp Cluster API plugin brings\nvisual clarity, faster debugging, and simplified operations for platform teams,\ndirectly inside Headlamp.</p><h2 id=\"what-this-plugin-provides\">What this plugin provides<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#what-this-plugin-provides\"></a></h2><p>The Cluster API plugin adds a dedicated Cluster API section to Headlamp and brings\nfull visibility into core CAPI resources through consistent list and detail views.</p><table><thead><tr><th>Feature</th><th>Description</th></tr></thead><tbody><tr><td><strong>Cluster overview</strong></td><td>View clusters with live control plane and worker replica status.</td></tr><tr><td><strong>Machine visibility</strong></td><td>Inspect MachineDeployments, MachineSets, Machines, and MachinePools with status and conditions.</td></tr><tr><td><strong>Cluster API dashboard</strong></td><td>Get a centralized view of Cluster API resource health, active condition issues, provider information, and remediation guidance.</td></tr><tr><td><strong>Control plane monitoring</strong></td><td>Track KubeadmControlPlane replicas, versions, and associated Machines.</td></tr><tr><td><strong>Scale from the UI</strong></td><td>Scale MachineDeployments and MachineSets directly from Headlamp.</td></tr><tr><td><strong>Owned resource hierarchy</strong></td><td>Trace relationships between clusters, deployments, sets, and machines.</td></tr><tr><td><strong>KubeadmConfig inspection</strong></td><td>View bootstrap configs, files, kubelet args, and join/init settings.</td></tr><tr><td><strong>Topology awareness</strong></td><td>Automatically detect and label ClusterClass-managed resources.</td></tr><tr><td><strong>Map view</strong></td><td>Visualize Cluster, Control Plane, and Worker relationships.</td></tr><tr><td><strong>Dynamic API versioning</strong></td><td>Supports both v1beta1 and v1beta2 Cluster API versions.</td></tr><tr><td><strong>Prometheus metrics</strong></td><td>View live metrics from the <a target=\"_blank\" href=\"https://github.com/headlamp-k8s/plugins/tree/main/prometheus\">Headlamp Prometheus plugin</a> inline on Cluster API resource detail pages.</td></tr></tbody></table><h2 id=\"a-tour-of-the-plugin\">A tour of the plugin<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#a-tour-of-the-plugin\"></a></h2><p>The Headlamp Cluster API plugin brings core Cluster API resources into a consistent,\nvisual interface inside Headlamp. Here are some of the key views included in the\nfirst release.</p><h3 id=\"cluster-api-dashboard\">Cluster API dashboard<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#cluster-api-dashboard\"></a></h3><p>The dashboard provides a centralized view of Cluster API resources and their\nhealth across a management cluster.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/cluster-api-dashboard.png\" alt=\"Cluster API dashboard showing overall resource health\"></p><p>The overview summarizes the status of clusters, Machines, MachineDeployments,\nMachinePools, MachineSets, and control planes. It also highlights active\ncondition issues, provider information, and configuration template counts to\nhelp operators quickly identify degraded or unhealthy resources.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/cluster-health-cards.png\" alt=\"Cluster details and remediation guidance\"></p><p>Selecting a cluster opens a detailed health view showing control plane and\nworker status, machine information, infrastructure details, and resource\nconditions. When issues are detected, the dashboard provides remediation\nguidance and diagnostic commands to assist with troubleshooting.</p><h3 id=\"bring-full-cluster-api-visibility-into-headlamp\">Bring full Cluster API visibility into Headlamp<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#bring-full-cluster-api-visibility-into-headlamp\"></a></h3><p>The cluster list view shows all Cluster resources in the management cluster,\nincluding control plane and worker replica status. This gives you an at-a-glance\nunderstanding of overall cluster health.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/cluster-list-view.png\" alt=\"Cluster list view showing control plane and worker replica status\"></p><p>The cluster detail view provides resource status, conditions, infrastructure\nreferences, control plane references, and related Machines on a single page.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/cluster-detail-overview.png\" alt=\"Cluster detail view showing resource status and conditions\"></p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/cluster-detail-machines.png\" alt=\"Cluster detail view showing related machines\"></p><h3 id=\"explore-cluster-api-resources-in-a-visual-interface\">Explore Cluster API resources in a visual interface<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#explore-cluster-api-resources-in-a-visual-interface\"></a></h3><p>Dedicated views are available for MachineDeployments, MachineSets, Machines, and\nMachinePools. These pages surface replica counts, ownership relationships, provider\nIDs, versions, and conditions to support day-to-day operations and debugging.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/machine-resources-view.png\" alt=\"MachineDeployment list view showing replica counts, ownership, and conditions\"></p><h3 id=\"scale-workloads-directly-from-headlamp\">Scale workloads directly from Headlamp<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#scale-workloads-directly-from-headlamp\"></a></h3><p>MachineDeployments and MachineSets include a built-in Scale action, allowing you to\nadjust replica counts directly from Headlamp without using terminal commands.</p><p>For topology-managed clusters, the plugin also indicates when scaling should be\nperformed at the Cluster level.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/scale-machine-deployments.png\" alt=\"Scale dialog for a MachineDeployment\"></p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/scale-machine-sets.png\" alt=\"Topology-managed cluster showing scaling guidance at the Cluster level\"></p><h3 id=\"inspect-bootstrap-configuration-without-raw-yaml\">Inspect bootstrap configuration without raw YAML<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#inspect-bootstrap-configuration-without-raw-yaml\"></a></h3><p>Bootstrap configurations can be viewed in a structured format, including inline\nfiles, kubelet arguments, extra volumes, and join or init settings. This removes\nthe need to inspect raw YAML or secrets manually.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/bootstrap-config-view.png\" alt=\"KubeadmConfig detail view showing bootstrap configuration in structured format\"></p><h3 id=\"visualize-cluster-relationships-with-map-view\">Visualize cluster relationships with map view<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#visualize-cluster-relationships-with-map-view\"></a></h3><p>A visual map view displays the relationships between Cluster, control plane, and\nworker resources. It offers a faster way to understand ownership hierarchies and\noverall cluster structure.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/topology-map-view.png\" alt=\"Map view showing Cluster, Control Plane, and Worker resource relationships\"></p><h3 id=\"prometheus-metrics-integration\">Prometheus metrics integration<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#prometheus-metrics-integration\"></a></h3><p>The Cluster API plugin integrates with the\n<a target=\"_blank\" href=\"https://github.com/headlamp-k8s/plugins/tree/main/prometheus\">Headlamp Prometheus plugin</a>\nto surface metrics directly inside Cluster API resource detail pages.</p><p>When the Prometheus plugin is installed and configured, metrics are embedded inline\non the detail pages for Clusters, MachineDeployments, MachineSets, and Machines.\nYou can view resource health and performance data alongside status conditions and\nownership relationships, without switching to a separate dashboard.</p><p>This makes it easier to correlate infrastructure state with live metrics during\ndebugging or day-to-day cluster operations, all from within Headlamp.</p><p><img src=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/prometheus-metrics-view.png\" alt=\"Prometheus metrics embedded inline on a Cluster detail page\"></p><h2 id=\"how-to-use\">How to use<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#how-to-use\"></a></h2><p>See the\n<a target=\"_blank\" href=\"https://github.com/headlamp-k8s/plugins/blob/main/cluster-api/README.md\"><code>plugins/cluster-api/README.md</code></a>\nfor installation and usage instructions.</p><h2 id=\"developed-during-lfx-mentorship\">Developed during LFX Mentorship<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#developed-during-lfx-mentorship\"></a></h2><p>This plugin was developed as part of the CNCF LFX Mentorship program under the\nHeadlamp project. The mentorship provided an opportunity to work closely with the\nHeadlamp community while building features to improve the Cluster API management\nexperience.</p><p>The focus was not only on implementing features but also on understanding real-world\nusability challenges around Cluster API operations. Discussions with mentors and\ncommunity members helped shape the plugin's direction, improve the user experience,\nand prioritize features most useful to platform teams.</p><p>The mentorship also provided valuable experience contributing to large open-source\nprojects: collaborating with maintainers, participating in design discussions,\nhandling release feedback, and iterating on features based on community input.</p><p>Work on the plugin is ongoing, with additional improvements and features planned\nbeyond the initial Alpha release.</p><h2 id=\"feedback-and-questions\">Feedback and questions<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/#feedback-and-questions\"></a></h2><p>This is an Alpha release, and community feedback directly shapes what comes next.</p><ul><li><strong>Bug reports:</strong> <a target=\"_blank\" href=\"https://github.com/kubernetes-sigs/headlamp/issues\">Open an issue</a></li><li><strong>Feature requests:</strong> <a target=\"_blank\" href=\"https://github.com/kubernetes-sigs/headlamp/discussions\">Start a discussion</a></li><li><strong>Contributing:</strong> <a target=\"_blank\" href=\"https://github.com/kubernetes-sigs/headlamp/pulls\">PRs are welcome</a></li><li><strong>Kubernetes Slack:</strong> <a target=\"_blank\" href=\"https://slack.k8s.io/\">Join the #headlamp channel</a> for questions and discussion</li></ul></div>"
---

Headlamp is an open-source, extensible Kubernetes SIG UI
project designed to let you explore, manage, and debug cluster resources directly
from a browser.
Cluster API (CAPI) is a Kubernetes sub-project
that brings declarative, Kubernetes-style APIs to cluster lifecycle management. It
lets platform teams provision, upgrade, and manage the lifecycle of Kubernetes
clusters using standard Kubernetes objects stored and reconciled in a management
cluster.
Managing Cluster API resources has historically required raw kubectl commands and
deep familiarity with ownership hierarchies. The Headlamp Cluster API plugin brings
visual clarity, faster debugging, and simplified operations for platform teams,
directly inside Headlamp.
What this plugin provides
The Cluster API plugin adds a dedicated Cluster API section to Headlamp and brings
full visibility into core CAPI resources through consistent list and detail views.
Feature
Description




Cluster overview
View clusters with live control plane and worker replica status.


Machine visibility
Inspect MachineDeployments, MachineSets, Machines, and MachinePools with status and conditions.


Cluster API dashboard
Get a centralized view of Cluster API resource health, active condition issues, provider information, and remediation guidance.


Control plane monitoring
Track KubeadmControlPlane replicas, versions, and associated Machines.


Scale from the UI
Scale MachineDeployments and MachineSets directly from Headlamp.


Owned resource hierarchy
Trace relationships between clusters, deployments, sets, and machines.


KubeadmConfig inspection
View bootstrap configs, files, kubelet args, and join/init settings.


Topology awareness
Automatically detect and label ClusterClass-managed resources.


Map view
Visualize Cluster, Control Plane, and Worker relationships.


Dynamic API versioning
Supports both v1beta1 and v1beta2 Cluster API versions.


Prometheus metrics
View live metrics from the Headlamp Prometheus plugin inline on Cluster API resource detail pages.



A tour of the plugin
The Headlamp Cluster API plugin brings core Cluster API resources into a consistent,
visual interface inside Headlamp. Here are some of the key views included in the
first release.
Cluster API dashboard
The dashboard provides a centralized view of Cluster API resources and their
health across a management cluster.

The overview summarizes the status of clusters, Machines, MachineDeployments,
MachinePools, MachineSets, and control planes. It also highlights active
condition issues, provider information, and configuration template counts to
help operators quickly identify degraded or unhealthy resources.

Selecting a cluster opens a detailed health view showing control plane and
worker status, machine information, infrastructure details, and resource
conditions. When issues are detected, the dashboard provides remediation
guidance and diagnostic commands to assist with troubleshooting.
Bring full Cluster API visibility into Headlamp
The cluster list view shows all Cluster resources in the management cluster,
including control plane and worker replica status. This gives you an at-a-glance
understanding of overall cluster health.

The cluster detail view provides resource status, conditions, infrastructure
references, control plane references, and related Machines on a single page.


Explore Cluster API resources in a visual interface
Dedicated views are available for MachineDeployments, MachineSets, Machines, and
MachinePools. These pages surface replica counts, ownership relationships, provider
IDs, versions, and conditions to support day-to-day operations and debugging.

Scale workloads directly from Headlamp
MachineDeployments and MachineSets include a built-in Scale action, allowing you to
adjust replica counts directly from Headlamp without using terminal commands.
For topology-managed clusters, the plugin also indicates when scaling should be
performed at the Cluster level.


Inspect bootstrap configuration without raw YAML
Bootstrap configurations can be viewed in a structured format, including inline
files, kubelet arguments, extra volumes, and join or init settings. This removes
the need to inspect raw YAML or secrets manually.

Visualize cluster relationships with map view
A visual map view displays the relationships between Cluster, control plane, and
worker resources. It offers a faster way to understand ownership hierarchies and
overall cluster structure.

Prometheus metrics integration
The Cluster API plugin integrates with the
Headlamp Prometheus plugin
to surface metrics directly inside Cluster API resource detail pages.
When the Prometheus plugin is installed and configured, metrics are embedded inline
on the detail pages for Clusters, MachineDeployments, MachineSets, and Machines.
You can view resource health and performance data alongside status conditions and
ownership relationships, without switching to a separate dashboard.
This makes it easier to correlate infrastructure state with live metrics during
debugging or day-to-day cluster operations, all from within Headlamp.

How to use
See the
plugins/cluster-api/README.md
for installation and usage instructions.
Developed during LFX Mentorship
This plugin was developed as part of the CNCF LFX Mentorship program under the
Headlamp project. The mentorship provided an opportunity to work closely with the
Headlamp community while building features to improve the Cluster API management
experience.
The focus was not only on implementing features but also on understanding real-world
usability challenges around Cluster API operations. Discussions with mentors and
community members helped shape the plugin's direction, improve the user experience,
and prioritize features most useful to platform teams.
The mentorship also provided valuable experience contributing to large open-source
projects: collaborating with maintainers, participating in design discussions,
handling release feedback, and iterating on features based on community input.
Work on the plugin is ongoing, with additional improvements and features planned
beyond the initial Alpha release.
Feedback and questions
This is an Alpha release, and community feedback directly shapes what comes next.
Bug reports: Open an issue
Feature requests: Start a discussion
Contributing: PRs are welcome
Kubernetes Slack: Join the #headlamp channel for questions and discussion
