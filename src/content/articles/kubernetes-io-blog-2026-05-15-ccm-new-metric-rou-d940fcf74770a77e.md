---
title: "Kubernetes v1.36: New Metric for Route Sync in the Cloud Controller Manager"
link: "https://kubernetes.io/blog/2026/05/15/ccm-new-metric-route-sync-total/"
guid: "https://kubernetes.io/blog/2026/05/15/ccm-new-metric-route-sync-total/"
pubDate: "2026-05-15T18:35:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "This article was originally published with the wrong date. It was later republished, dated the 15th of\nMay 2026.\nKubernetes v1.36 introduces a new alpha counter metric route_controller_route_sync_total\nto the Cloud Controller Manager (CCM) route controller implementation at\nk8s.io/cloud-provider. This metric\nincrements each time routes are synced with the cloud provider.\nA/B testing watch-based route reconciliation\nThis metric was added to help operators validate the\nCloudControllerManagerWatchBasedRoutesReconciliation feature gate introduced in\nKubernetes v1.35.\nThat feature gate switches the route controller from a fixed-interval loop to a watch-based\napproach that only reconciles when nodes actually change. This reduces unnecessary API calls\nto the infrastructure provider, lowering pressure on rate-limited APIs and allowing operators\nto make more efficient use of their available quota.\nTo A/B test this, compare route_controller_route_sync_total with the feature gate\ndisabled (default) versus enabled. In clusters where node changes are infrequent, you should\nsee a significant drop in the sync rate with the feature gate turned on.\nExample: expected behavior\nWith the feature gate disabled (the default fixed-interval loop), the counter increments\nsteadily regardless of whether any node changes occurred:\n# After 10 minutes with no node changes\nroute_controller_route_sync_total 60\n# After 20 minutes, still no node changes\nroute_controller_route_sync_total 120\n\nWith the feature gate enabled (watch-based reconciliation), the counter only increments\nwhen nodes are actually added, removed, or updated:\n# After 10 minutes with no node changes\nroute_controller_route_sync_total 1\n# After 20 minutes, still no node changes — counter unchanged\nroute_controller_route_sync_total 1\n# A new node joins the cluster — counter increments\nroute_controller_route_sync_total 2\n\nThe difference is especially visible in stable clusters where nodes rarely change.\nWhere can I give feedback?\nIf you have feedback, feel free to reach out through any of the following channels:\nThe #sig-cloud-provider channel on Kubernetes Slack\nThe KEP-5237 issue on GitHub\nThe SIG Cloud Provider community page for other communication channels\nHow can I learn more?\nFor more details, refer to KEP-5237."
contentHtml: "<div><p><em>This article was originally published with the wrong date. It was later republished, dated the 15th of\nMay 2026.</em></p><p>Kubernetes v1.36 introduces a new alpha counter metric <code>route_controller_route_sync_total</code>\nto the Cloud Controller Manager (CCM) route controller implementation at\n<a target=\"_blank\" href=\"https://github.com/kubernetes/cloud-provider\"><code>k8s.io/cloud-provider</code></a>. This metric\nincrements each time routes are synced with the cloud provider.</p><h2 id=\"a-b-testing-watch-based-route-reconciliation\">A/B testing watch-based route reconciliation<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/15/ccm-new-metric-route-sync-total/#a-b-testing-watch-based-route-reconciliation\"></a></h2><p>This metric was added to help operators validate the\n<code>CloudControllerManagerWatchBasedRoutesReconciliation</code> feature gate introduced in\n<a target=\"_blank\" href=\"https://kubernetes.io/blog/2025/12/30/kubernetes-v1-35-watch-based-route-reconciliation-in-ccm/\">Kubernetes v1.35</a>.\nThat feature gate switches the route controller from a fixed-interval loop to a watch-based\napproach that only reconciles when nodes actually change. This reduces unnecessary API calls\nto the infrastructure provider, lowering pressure on rate-limited APIs and allowing operators\nto make more efficient use of their available quota.</p><p>To A/B test this, compare <code>route_controller_route_sync_total</code> with the feature gate\ndisabled (default) versus enabled. In clusters where node changes are infrequent, you should\nsee a significant drop in the sync rate with the feature gate turned on.</p><h3 id=\"example-expected-behavior\">Example: expected behavior<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/15/ccm-new-metric-route-sync-total/#example-expected-behavior\"></a></h3><p><strong>With the feature gate disabled</strong> (the default fixed-interval loop), the counter increments\nsteadily regardless of whether any node changes occurred:</p><pre><code># After 10 minutes with no node changes\nroute_controller_route_sync_total 60\n# After 20 minutes, still no node changes\nroute_controller_route_sync_total 120\n</code></pre><p><strong>With the feature gate enabled</strong> (watch-based reconciliation), the counter only increments\nwhen nodes are actually added, removed, or updated:</p><pre><code># After 10 minutes with no node changes\nroute_controller_route_sync_total 1\n# After 20 minutes, still no node changes — counter unchanged\nroute_controller_route_sync_total 1\n# A new node joins the cluster — counter increments\nroute_controller_route_sync_total 2\n</code></pre><p>The difference is especially visible in stable clusters where nodes rarely change.</p><h2 id=\"where-can-i-give-feedback\">Where can I give feedback?<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/15/ccm-new-metric-route-sync-total/#where-can-i-give-feedback\"></a></h2><p>If you have feedback, feel free to reach out through any of the following channels:</p><ul><li>The <a target=\"_blank\" href=\"https://kubernetes.slack.com/messages/sig-cloud-provider\">#sig-cloud-provider</a> channel on <a target=\"_blank\" href=\"https://slack.k8s.io/\">Kubernetes Slack</a></li><li>The <a target=\"_blank\" href=\"https://kep.k8s.io/5237\">KEP-5237 issue</a> on GitHub</li><li>The <a target=\"_blank\" href=\"https://github.com/kubernetes/community/tree/05223ecbd2d6f960edb40684dc83d053d49f8b68/sig-cloud-provider\">SIG Cloud Provider community page</a> for other communication channels</li></ul><h2 id=\"how-can-i-learn-more\">How can I learn more?<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/15/ccm-new-metric-route-sync-total/#how-can-i-learn-more\"></a></h2><p>For more details, refer to <a target=\"_blank\" href=\"https://kep.k8s.io/5237\">KEP-5237</a>.</p></div>"
---

This article was originally published with the wrong date. It was later republished, dated the 15th of
May 2026.
Kubernetes v1.36 introduces a new alpha counter metric route_controller_route_sync_total
to the Cloud Controller Manager (CCM) route controller implementation at
k8s.io/cloud-provider. This metric
increments each time routes are synced with the cloud provider.
A/B testing watch-based route reconciliation
This metric was added to help operators validate the
CloudControllerManagerWatchBasedRoutesReconciliation feature gate introduced in
Kubernetes v1.35.
That feature gate switches the route controller from a fixed-interval loop to a watch-based
approach that only reconciles when nodes actually change. This reduces unnecessary API calls
to the infrastructure provider, lowering pressure on rate-limited APIs and allowing operators
to make more efficient use of their available quota.
To A/B test this, compare route_controller_route_sync_total with the feature gate
disabled (default) versus enabled. In clusters where node changes are infrequent, you should
see a significant drop in the sync rate with the feature gate turned on.
Example: expected behavior
With the feature gate disabled (the default fixed-interval loop), the counter increments
steadily regardless of whether any node changes occurred:
# After 10 minutes with no node changes
route_controller_route_sync_total 60
# After 20 minutes, still no node changes
route_controller_route_sync_total 120

With the feature gate enabled (watch-based reconciliation), the counter only increments
when nodes are actually added, removed, or updated:
# After 10 minutes with no node changes
route_controller_route_sync_total 1
# After 20 minutes, still no node changes — counter unchanged
route_controller_route_sync_total 1
# A new node joins the cluster — counter increments
route_controller_route_sync_total 2

The difference is especially visible in stable clusters where nodes rarely change.
Where can I give feedback?
If you have feedback, feel free to reach out through any of the following channels:
The #sig-cloud-provider channel on Kubernetes Slack
The KEP-5237 issue on GitHub
The SIG Cloud Provider community page for other communication channels
How can I learn more?
For more details, refer to KEP-5237.
