---
title: "Kubernetes v1.36: Mutable Pod Resources for Suspended Jobs (beta)"
link: "https://kubernetes.io/blog/2026/04/27/kubernetes-v1-36-mutable-pod-resources-for-suspended-jobs/"
guid: "https://kubernetes.io/blog/2026/04/27/kubernetes-v1-36-mutable-pod-resources-for-suspended-jobs/"
pubDate: "2026-04-27T18:35:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "Kubernetes v1.36 promotes the ability to modify container resource requests and limits\nin the pod template of a suspended Job to beta. First introduced as alpha in v1.35, this\nfeature allows queue controllers and cluster administrators to adjust CPU, memory, GPU,\nand extended resource specifications on a Job while it is suspended, before it starts\nor resumes running.\nWhy mutable pod resources for suspended Jobs?\nBatch and machine learning workloads often have resource requirements that are not\nprecisely known at Job creation time. The optimal resource allocation depends on\ncurrent cluster capacity, queue priorities, and the availability of specialized hardware\nlike GPUs.\nBefore this feature, resource requirements in a Job's pod template were immutable once set.\nIf a queue controller like Kueue determined that a suspended\nJob should run with different resources, the only option was to delete and recreate the Job,\nlosing any associated metadata, status, or history. This feature also provides a way\nto let a specific Job instance for a CronJob progress slowly with reduced resources,\nrather than outright failing to run if the cluster is heavily loaded.\nConsider a machine learning training Job initially requesting 4 GPUs:\napiVersion: batch/v1\nkind: Job\nmetadata:\n name: training-job-example-abcd123\n labels:\n app.kubernetes.io/name: trainer\nspec:\n suspend: true\n template:\n metadata:\n annotations:\n kubernetes.io/description: \"ML training, ID abcd123\"\n spec:\n containers:\n - name: trainer\n image: example-registry.example.com/training:2026-04-23T150405.678\n resources:\n requests:\n cpu: \"8\"\n memory: \"32Gi\"\n example-hardware-vendor.com/gpu: \"4\"\n limits:\n cpu: \"8\"\n memory: \"32Gi\"\n example-hardware-vendor.com/gpu: \"4\"\n restartPolicy: Never\n\n\nA queue controller managing cluster resources might determine that only 2 GPUs\nare available. With this feature, the controller can update the Job's resource\nrequests before resuming it:\napiVersion: batch/v1\nkind: Job\nmetadata:\n name: training-job-example-abcd123\n labels:\n app.kubernetes.io/name: trainer\nspec:\n suspend: true\n template:\n metadata:\n annotations:\n kubernetes.io/description: \"ML training, ID abcd123\"\n spec:\n containers:\n - name: trainer\n image: example-registry.example.com/training:2026-04-23T150405.678\n resources:\n requests:\n cpu: \"4\"\n memory: \"16Gi\"\n example-hardware-vendor.com/gpu: \"2\"\n limits:\n cpu: \"4\"\n memory: \"16Gi\"\n example-hardware-vendor.com/gpu: \"2\"\n restartPolicy: Never\n\n\nOnce the resources are updated, the controller resumes the Job by setting\nspec.suspend to false, and the new Pods are created with the adjusted\nresource specifications.\nHow it works\nThe Kubernetes API server relaxes the immutability constraint on pod template\nresource fields specifically for suspended Jobs. No new API types have been introduced;\nthe existing Job and pod template structures accommodate the change through\nrelaxed validation.\nThe mutable fields are:\nspec.template.spec.containers[*].resources.requests\nspec.template.spec.containers[*].resources.limits\nspec.template.spec.initContainers[*].resources.requests\nspec.template.spec.initContainers[*].resources.limits\nResource updates are permitted when the following conditions are met:\nThe Job has spec.suspend set to true.\nFor a Job that was previously running and then suspended, all active\nPods must have terminated (status.active equals 0) before resource\nmutations are accepted.\nStandard resource validation still applies. For example, resource limits\nmust be greater than or equal to requests, and extended resources must be\nspecified as whole numbers where required.\nWhat's new in beta\nWith the promotion to beta in Kubernetes v1.36, the\nMutablePodResourcesForSuspendedJobs feature gate is enabled by default.\nThis means clusters running v1.36 can use this feature without any additional\nconfiguration on the API server.\nTry it out\nIf your cluster is running Kubernetes v1.36 or later, this feature is available\nby default. For v1.35 clusters, enable the MutablePodResourcesForSuspendedJobs\nfeature gate on\nthe kube-apiserver.\nYou can test it by creating a suspended Job, updating its container resources\nusing kubectl edit or a controller, and then resuming the Job:\n# Create a suspended Job\nkubectl apply -f my-job.yaml --server-side\n\n# Edit the resource requests\nkubectl edit job training-job-example-abcd123\n\n# Resume the Job\nkubectl patch job training-job-example-abcd123 -p '{\"spec\":{\"suspend\":false}}'\n\n\nConsiderations\nRunning Jobs that are suspended\nIf you suspend a Job that was already running, you must wait for all of that Job's active\nPods to terminate before modifying resources. The API server rejects resource\nmutations while status.active is greater than zero. This prevents inconsistency\nbetween running Pods and the updated pod template.\nPod replacement policy\nWhen using this feature with Jobs that may have failed Pods, consider setting\npodReplacementPolicy: Failed. This ensures that replacement Pods are only\ncreated after the previous Pods have fully terminated, preventing resource\ncontention from overlapping Pods.\nResourceClaims\nDynamic Resource Allocation (DRA) resourceClaimTemplates remain immutable.\nIf your workload uses DRA, you must recreate the claim templates separately\nto match any resource changes.\nGetting involved\nThis feature was developed by SIG Apps\nThis feature was developed by SIG Apps\nwith input from WG Batch. Both groups welcome feedback\nas the feature progresses toward stable.\nYou can reach out through:\nSlack channel #sig-apps.\nSlack channel #wg-batch.\nThe KEP-5440 tracking issue."
contentHtml: "<p>Kubernetes v1.36 promotes the ability to modify container resource requests and limits\nin the pod template of a suspended Job to beta. First introduced as alpha in v1.35, this\nfeature allows queue controllers and cluster administrators to adjust CPU, memory, GPU,\nand extended resource specifications on a Job while it is suspended, before it starts\nor resumes running.</p>\n<h2 id=\"why-mutable-pod-resources-for-suspended-jobs\">Why mutable pod resources for suspended Jobs?<a class=\"td-heading-self-link\" href=\"#why-mutable-pod-resources-for-suspended-jobs\" aria-label=\"Heading self-link\"></a></h2><p>Batch and machine learning workloads often have resource requirements that are not\nprecisely known at Job creation time. The optimal resource allocation depends on\ncurrent cluster capacity, queue priorities, and the availability of specialized hardware\nlike GPUs.</p>\n<p>Before this feature, resource requirements in a Job's pod template were immutable once set.\nIf a queue controller like <a href=\"https://kueue.sigs.k8s.io/\">Kueue</a> determined that a suspended\nJob should run with different resources, the only option was to delete and recreate the Job,\nlosing any associated metadata, status, or history. This feature also provides a way\nto let a specific Job instance for a CronJob progress slowly with reduced resources,\nrather than outright failing to run if the cluster is heavily loaded.</p>\n<p>Consider a machine learning training Job initially requesting 4 GPUs:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">batch/v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">Job</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">training-job-example-abcd123</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">labels</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">app.kubernetes.io/name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">trainer</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">suspend</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"kc\">true</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">template</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">annotations</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">kubernetes.io/description</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;ML training, ID abcd123&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">containers</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span>- <span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">trainer</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">image</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">example-registry.example.com/training:2026-04-23T150405.678</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">resources</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">requests</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">cpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;8&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">memory</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;32Gi&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">example-hardware-vendor.com/gpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;4&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">limits</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">cpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;8&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">memory</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;32Gi&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">example-hardware-vendor.com/gpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;4&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">restartPolicy</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">Never</span><span class=\"w\">\n</span></span></span></code></pre></div><p>A queue controller managing cluster resources might determine that only 2 GPUs\nare available. With this feature, the controller can update the Job's resource\nrequests before resuming it:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">batch/v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">Job</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">training-job-example-abcd123</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">labels</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">app.kubernetes.io/name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">trainer</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">suspend</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"kc\">true</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">template</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">annotations</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">kubernetes.io/description</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;ML training, ID abcd123&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">containers</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span>- <span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">trainer</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">image</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">example-registry.example.com/training:2026-04-23T150405.678</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">resources</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">requests</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">cpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;4&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">memory</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;16Gi&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">example-hardware-vendor.com/gpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;2&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">limits</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">cpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;4&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">memory</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;16Gi&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">example-hardware-vendor.com/gpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;2&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">restartPolicy</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">Never</span><span class=\"w\">\n</span></span></span></code></pre></div><p>Once the resources are updated, the controller resumes the Job by setting\n<code>spec.suspend</code> to <code>false</code>, and the new Pods are created with the adjusted\nresource specifications.</p>\n<h2 id=\"how-it-works\">How it works<a class=\"td-heading-self-link\" href=\"#how-it-works\" aria-label=\"Heading self-link\"></a></h2><p>The Kubernetes API server relaxes the immutability constraint on pod template\nresource fields specifically for suspended Jobs. No new API types have been introduced;\nthe existing Job and pod template structures accommodate the change through\nrelaxed validation.</p>\n<p>The mutable fields are:</p>\n<ul>\n<li><code>spec.template.spec.containers[*].resources.requests</code></li>\n<li><code>spec.template.spec.containers[*].resources.limits</code></li>\n<li><code>spec.template.spec.initContainers[*].resources.requests</code></li>\n<li><code>spec.template.spec.initContainers[*].resources.limits</code></li>\n</ul>\n<p>Resource updates are permitted when the following conditions are met:</p>\n<ol>\n<li>The Job has <code>spec.suspend</code> set to <code>true</code>.</li>\n<li>For a Job that was previously running and then suspended, all active\nPods must have terminated (<code>status.active</code> equals 0) before resource\nmutations are accepted.</li>\n</ol>\n<p>Standard resource validation still applies. For example, resource limits\nmust be greater than or equal to requests, and extended resources must be\nspecified as whole numbers where required.</p>\n<h2 id=\"what-s-new-in-beta\">What's new in beta<a class=\"td-heading-self-link\" href=\"#what-s-new-in-beta\" aria-label=\"Heading self-link\"></a></h2><p>With the promotion to beta in Kubernetes v1.36, the\n<code>MutablePodResourcesForSuspendedJobs</code> feature gate is enabled by default.\nThis means clusters running v1.36 can use this feature without any additional\nconfiguration on the API server.</p>\n<h2 id=\"try-it-out\">Try it out<a class=\"td-heading-self-link\" href=\"#try-it-out\" aria-label=\"Heading self-link\"></a></h2><p>If your cluster is running Kubernetes v1.36 or later, this feature is available\nby default. For v1.35 clusters, enable the <code>MutablePodResourcesForSuspendedJobs</code>\n<a href=\"https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/\">feature gate</a> on\nthe <code>kube-apiserver</code>.</p>\n<p>You can test it by creating a suspended Job, updating its container resources\nusing <code>kubectl edit</code> or a controller, and then resuming the Job:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\"><span class=\"c1\"># Create a suspended Job</span>\n</span></span><span class=\"line\"><span class=\"cl\">kubectl apply -f my-job.yaml --server-side\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"c1\"># Edit the resource requests</span>\n</span></span><span class=\"line\"><span class=\"cl\">kubectl edit job training-job-example-abcd123\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"c1\"># Resume the Job</span>\n</span></span><span class=\"line\"><span class=\"cl\">kubectl patch job training-job-example-abcd123 -p <span class=\"s1\">&#39;{&#34;spec&#34;:{&#34;suspend&#34;:false}}&#39;</span>\n</span></span></code></pre></div><h2 id=\"considerations\">Considerations<a class=\"td-heading-self-link\" href=\"#considerations\" aria-label=\"Heading self-link\"></a></h2><h3 id=\"running-jobs-that-are-suspended\">Running Jobs that are suspended<a class=\"td-heading-self-link\" href=\"#running-jobs-that-are-suspended\" aria-label=\"Heading self-link\"></a></h3><p>If you suspend a Job that was already running, you must wait for <strong>all</strong> of that Job's active\nPods to terminate before modifying resources. The API server rejects resource\nmutations while <code>status.active</code> is greater than zero. This prevents inconsistency\nbetween running Pods and the updated pod template.</p>\n<h3 id=\"pod-replacement-policy\">Pod replacement policy<a class=\"td-heading-self-link\" href=\"#pod-replacement-policy\" aria-label=\"Heading self-link\"></a></h3><p>When using this feature with Jobs that may have failed Pods, consider setting\n<code>podReplacementPolicy: Failed</code>. This ensures that replacement Pods are only\ncreated after the previous Pods have fully terminated, preventing resource\ncontention from overlapping Pods.</p>\n<h3 id=\"resourceclaims\">ResourceClaims<a class=\"td-heading-self-link\" href=\"#resourceclaims\" aria-label=\"Heading self-link\"></a></h3><p>Dynamic Resource Allocation (DRA) <code>resourceClaimTemplates</code> remain immutable.\nIf your workload uses DRA, you must recreate the claim templates separately\nto match any resource changes.</p>\n<h2 id=\"getting-involved\">Getting involved<a class=\"td-heading-self-link\" href=\"#getting-involved\" aria-label=\"Heading self-link\"></a></h2><p>This feature was developed by <a href=\"https://github.com/kubernetes/community/tree/master/sig-apps\">SIG Apps</a>\nThis feature was developed by <a href=\"https://www.kubernetes.dev/community/community-groups/sigs/apps/\">SIG Apps</a>\nwith input from <a href=\"https://www.kubernetes.dev/community/community-groups/wg/batch/\">WG Batch</a>. Both groups welcome feedback\nas the feature progresses toward stable.</p>\n<p>You can reach out through:</p>\n<ul>\n<li>Slack channel <a href=\"https://kubernetes.slack.com/archives/C18NZM5K9\">#sig-apps</a>.</li>\n<li>Slack channel <a href=\"https://kubernetes.slack.com/archives/C032ZE66A2X\">#wg-batch</a>.</li>\n<li>The <a href=\"https://kep.k8s.io/5440\">KEP-5440</a> tracking issue.</li>\n</ul>"
---

Kubernetes v1.36 promotes the ability to modify container resource requests and limits
in the pod template of a suspended Job to beta. First introduced as alpha in v1.35, this
feature allows queue controllers and cluster administrators to adjust CPU, memory, GPU,
and extended resource specifications on a Job while it is suspended, before it starts
or resumes running.
Why mutable pod resources for suspended Jobs?
Batch and machine learning workloads often have resource requirements that are not
precisely known at Job creation time. The optimal resource allocation depends on
current cluster capacity, queue priorities, and the availability of specialized hardware
like GPUs.
Before this feature, resource requirements in a Job's pod template were immutable once set.
If a queue controller like Kueue determined that a suspended
Job should run with different resources, the only option was to delete and recreate the Job,
losing any associated metadata, status, or history. This feature also provides a way
to let a specific Job instance for a CronJob progress slowly with reduced resources,
rather than outright failing to run if the cluster is heavily loaded.
Consider a machine learning training Job initially requesting 4 GPUs:
apiVersion: batch/v1
kind: Job
metadata:
 name: training-job-example-abcd123
 labels:
 app.kubernetes.io/name: trainer
spec:
 suspend: true
 template:
 metadata:
 annotations:
 kubernetes.io/description: "ML training, ID abcd123"
 spec:
 containers:
 - name: trainer
 image: example-registry.example.com/training:2026-04-23T150405.678
 resources:
 requests:
 cpu: "8"
 memory: "32Gi"
 example-hardware-vendor.com/gpu: "4"
 limits:
 cpu: "8"
 memory: "32Gi"
 example-hardware-vendor.com/gpu: "4"
 restartPolicy: Never


A queue controller managing cluster resources might determine that only 2 GPUs
are available. With this feature, the controller can update the Job's resource
requests before resuming it:
apiVersion: batch/v1
kind: Job
metadata:
 name: training-job-example-abcd123
 labels:
 app.kubernetes.io/name: trainer
spec:
 suspend: true
 template:
 metadata:
 annotations:
 kubernetes.io/description: "ML training, ID abcd123"
 spec:
 containers:
 - name: trainer
 image: example-registry.example.com/training:2026-04-23T150405.678
 resources:
 requests:
 cpu: "4"
 memory: "16Gi"
 example-hardware-vendor.com/gpu: "2"
 limits:
 cpu: "4"
 memory: "16Gi"
 example-hardware-vendor.com/gpu: "2"
 restartPolicy: Never


Once the resources are updated, the controller resumes the Job by setting
spec.suspend to false, and the new Pods are created with the adjusted
resource specifications.
How it works
The Kubernetes API server relaxes the immutability constraint on pod template
resource fields specifically for suspended Jobs. No new API types have been introduced;
the existing Job and pod template structures accommodate the change through
relaxed validation.
The mutable fields are:
spec.template.spec.containers[*].resources.requests
spec.template.spec.containers[*].resources.limits
spec.template.spec.initContainers[*].resources.requests
spec.template.spec.initContainers[*].resources.limits
Resource updates are permitted when the following conditions are met:
The Job has spec.suspend set to true.
For a Job that was previously running and then suspended, all active
Pods must have terminated (status.active equals 0) before resource
mutations are accepted.
Standard resource validation still applies. For example, resource limits
must be greater than or equal to requests, and extended resources must be
specified as whole numbers where required.
What's new in beta
With the promotion to beta in Kubernetes v1.36, the
MutablePodResourcesForSuspendedJobs feature gate is enabled by default.
This means clusters running v1.36 can use this feature without any additional
configuration on the API server.
Try it out
If your cluster is running Kubernetes v1.36 or later, this feature is available
by default. For v1.35 clusters, enable the MutablePodResourcesForSuspendedJobs
feature gate on
the kube-apiserver.
You can test it by creating a suspended Job, updating its container resources
using kubectl edit or a controller, and then resuming the Job:
# Create a suspended Job
kubectl apply -f my-job.yaml --server-side

# Edit the resource requests
kubectl edit job training-job-example-abcd123

# Resume the Job
kubectl patch job training-job-example-abcd123 -p '{"spec":{"suspend":false}}'


Considerations
Running Jobs that are suspended
If you suspend a Job that was already running, you must wait for all of that Job's active
Pods to terminate before modifying resources. The API server rejects resource
mutations while status.active is greater than zero. This prevents inconsistency
between running Pods and the updated pod template.
Pod replacement policy
When using this feature with Jobs that may have failed Pods, consider setting
podReplacementPolicy: Failed. This ensures that replacement Pods are only
created after the previous Pods have fully terminated, preventing resource
contention from overlapping Pods.
ResourceClaims
Dynamic Resource Allocation (DRA) resourceClaimTemplates remain immutable.
If your workload uses DRA, you must recreate the claim templates separately
to match any resource changes.
Getting involved
This feature was developed by SIG Apps
This feature was developed by SIG Apps
with input from WG Batch. Both groups welcome feedback
as the feature progresses toward stable.
You can reach out through:
Slack channel #sig-apps.
Slack channel #wg-batch.
The KEP-5440 tracking issue.
