---
title: "Operating AI/ML Workloads on Kubernetes: A Headlamp Plugin for Kubeflow"
link: "https://kubernetes.io/blog/2026/07/13/introducing-headlamp-plugin-for-kubeflow/"
guid: "https://kubernetes.io/blog/2026/07/13/introducing-headlamp-plugin-for-kubeflow/"
pubDate: "2026-07-13T20:00:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "Kubernetes has quietly become the default platform for AI and machine learning. Whether you run notebook servers for data scientists, schedule distributed training jobs, tune hyperparameters, or orchestrate multi-step ML pipelines, those workloads increasingly land on a Kubernetes cluster. Kubeflow is one of the most popular ways to assemble that stack, and it does so the Kubernetes-native way: every capability is exposed as a Custom Resource Definition (CRD).\nThat design is a gift to cluster operators, because it means ML workloads can be observed and managed with the same primitives as everything else in the cluster. But in practice the specialized ML dashboards that ship with these platforms hide the Kubernetes layer underneath. When a notebook is stuck or a training run fails, the operator is often left dropping back to kubectl to find out what actually happened at the Pod level.\nThis post introduces the Headlamp Kubeflow plugin, which closes that gap by surfacing Kubeflow's custom resources directly inside a general-purpose Kubernetes UI. It is a worked example of a pattern any CRD-heavy platform can follow: meet operators where they already work, and show them the cluster-level truth.\nHeadlamp itself is an extensible Kubernetes web UI maintained under Kubernetes SIG UI and licensed under Apache 2.0. It runs as a desktop app or in-cluster, and its plugin system lets anyone add first-class views for custom resources.\nWhy operators need a different view\nPurpose-built ML dashboards help data scientists submit experiments, pipelines, and\nnotebooks. Cluster operators and site reliability engineers (SREs) troubleshoot the\nKubernetes resources underneath, and they ask different questions:\nWhy is a notebook stuck? Is it ImagePullBackOff, OOMKilled, or a Pod waiting on a PersistentVolumeClaim?\nWhich Run resources failed recently across namespaces?\nWhich parameter set does a Katib Experiment report as optimal?\nDo TrainJob resources reference the expected TrainingRuntime resources?\nWhich batch workloads are running, and what state does Kubernetes report?\nThe Headlamp Kubeflow plugin helps answer these questions by reading directly from\nthe Kubernetes API server. It shows Pod conditions, Kubernetes failure reasons, and\nresources across namespaces without requiring an intermediary ML service or\ndatabase.\nWhat the plugin covers\nKubeflow is modular, and teams often install only the components they need. The\nplugin discovers the Kubeflow API groups on a cluster and displays only the\ncorresponding sections.\nThe plugin supports the following component families and API resources:\nKubeflow components and API resources supported by the Headlamp plugin\n\n\nComponent\nPurpose\nAPI resources\n\n\n\n\nNotebooks\nProvides development environments such as Jupyter, VS Code, and RStudio\nNotebook, Profile, PodDefault\n\n\nPipelines\nDefines and tracks pipelines, versions, experiments, runs, and schedules\nPipeline, PipelineVersion, Run, RecurringRun, Experiment\n\n\nKatib\nAutomates hyperparameter tuning and neural architecture search\nExperiment, Trial, Suggestion\n\n\nTraining\nRuns distributed training workloads such as PyTorch and TensorFlow jobs\nTrainJob, TrainingRuntime, ClusterTrainingRuntime\n\n\nSpark\nRuns large-scale data processing with Apache Spark\nSparkApplication, ScheduledSparkApplication\n\n\n\nWhat you can see\nInspect notebook Pods\nThe Notebook detail view shows Pod conditions and their reason and message\nfields. It also shows CPU, memory, and GPU requests and limits; volume mounts and\ntheir backing types, such as PersistentVolumeClaim, ConfigMap, Secret, or\nemptyDir; environment variables that reference Secret or ConfigMap objects;\nsidecar containers; and node tolerations. This view consolidates information that\nwould otherwise require several kubectl describe commands.\nInspect hyperparameter tuning\nThe Katib views show the tuning algorithm, search space, every Trial with its live\nstatus, and the current best Trial with its metric values and parameter assignments.\nThey also show the early-stopping configuration and the number of Trial resources\nthat stopped early, so you can follow the search without leaving the cluster UI.\nInspect pipeline state without the backend database\nThe Pipelines views read Kubernetes API resources directly and do not query the\nKubeflow Pipelines API service or backend database. You can inspect stored pipeline\nstate even when that service is unavailable. The Pipeline detail view compares the\nlatest and previous PipelineVersion specifications in a side-by-side YAML diff. Run\nviews show state and duration, RecurringRun views show human-readable schedules, and\nthe artifacts view aggregates pipelineRoot values from recent Run resources.\nMap ML resources\nThe plugin registers a\nHeadlamp map source\nthat renders Notebook, Profile, PodDefault, Experiment, Pipeline, SparkApplication,\nand TrainJob resources as graph nodes. It draws edges between supported resources\nbased on .metadata.ownerReferences. Headlamp also shows inline summaries for these\nresource types when you hover over them.\nTry it\nThe\nKubeflow plugin README\nexplains installation and local-cluster setup, including a lightweight CRD-only path\nfor evaluation. Because the plugin discovers installed API groups, you can use it\nwith an existing modular Kubeflow installation or create an evaluation cluster with\nonly the CRDs and sample resources.\nApply the pattern to other platforms\nKubeflow illustrates a broader pattern. Platforms often model domain-specific\nworkflows with custom resources. Their dashboards focus on those workflows, while\nKubernetes operators also need the state of the underlying API resources and Pods.\nA CRD-driven plugin in a general Kubernetes UI can expose that state without making\noperators switch between unrelated tools.\nThe plugin uses the Apache 2.0 license and is developed under Kubernetes SIG UI. To\nreport a problem or contribute an improvement, use the Headlamp plugins repository's\nissue tracker or\npull requests."
contentHtml: "<p>Kubernetes has quietly become the default platform for AI and machine learning. Whether you run notebook servers for data scientists, schedule distributed training jobs, tune hyperparameters, or orchestrate multi-step ML pipelines, those workloads increasingly land on a Kubernetes cluster. <a href=\"https://www.kubeflow.org/\">Kubeflow</a> is one of the most popular ways to assemble that stack, and it does so the Kubernetes-native way: every capability is exposed as a Custom Resource Definition (CRD).</p>\n<p>That design is a gift to cluster operators, because it means ML workloads can be observed and managed with the same primitives as everything else in the cluster. But in practice the specialized ML dashboards that ship with these platforms hide the Kubernetes layer underneath. When a notebook is stuck or a training run fails, the operator is often left dropping back to <code>kubectl</code> to find out what actually happened at the Pod level.</p>\n<p>This post introduces the <strong>Headlamp Kubeflow plugin</strong>, which closes that gap by surfacing Kubeflow's custom resources directly inside a general-purpose Kubernetes UI. It is a worked example of a pattern any CRD-heavy platform can follow: meet operators where they already work, and show them the cluster-level truth.</p>\n<p>Headlamp itself is an extensible Kubernetes web UI maintained under <a href=\"https://github.com/kubernetes-sigs/headlamp\">Kubernetes SIG UI</a> and licensed under Apache 2.0. It runs as a desktop app or in-cluster, and its plugin system lets anyone add first-class views for custom resources.</p>\n<h2 id=\"why-operators-need-a-different-view\">Why operators need a different view<a class=\"td-heading-self-link\" href=\"#why-operators-need-a-different-view\" aria-label=\"Heading self-link\"></a></h2><p>Purpose-built ML dashboards help data scientists submit experiments, pipelines, and\nnotebooks. Cluster operators and site reliability engineers (SREs) troubleshoot the\nKubernetes resources underneath, and they ask different questions:</p>\n<ul>\n<li>Why is a notebook stuck? Is it <code>ImagePullBackOff</code>, <code>OOMKilled</code>, or a Pod waiting on a PersistentVolumeClaim?</li>\n<li>Which Run resources failed recently across namespaces?</li>\n<li>Which parameter set does a Katib Experiment report as optimal?</li>\n<li>Do TrainJob resources reference the expected TrainingRuntime resources?</li>\n<li>Which batch workloads are running, and what state does Kubernetes report?</li>\n</ul>\n<p>The Headlamp Kubeflow plugin helps answer these questions by reading directly from\nthe Kubernetes API server. It shows Pod conditions, Kubernetes failure reasons, and\nresources across namespaces without requiring an intermediary ML service or\ndatabase.</p>\n<h2 id=\"what-the-plugin-covers\">What the plugin covers<a class=\"td-heading-self-link\" href=\"#what-the-plugin-covers\" aria-label=\"Heading self-link\"></a></h2><p>Kubeflow is modular, and teams often install only the components they need. The\nplugin discovers the Kubeflow API groups on a cluster and displays only the\ncorresponding sections.</p>\n<p>The plugin supports the following component families and API resources:</p>\n<table><caption style=\"display: none;\">Kubeflow components and API resources supported by the Headlamp plugin</caption>\n<thead>\n<tr>\n<th style=\"text-align: left\">Component</th>\n<th style=\"text-align: left\">Purpose</th>\n<th style=\"text-align: left\">API resources</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td style=\"text-align: left\"><strong>Notebooks</strong></td>\n<td style=\"text-align: left\">Provides development environments such as Jupyter, VS Code, and RStudio</td>\n<td style=\"text-align: left\">Notebook, Profile, PodDefault</td>\n</tr>\n<tr>\n<td style=\"text-align: left\"><strong>Pipelines</strong></td>\n<td style=\"text-align: left\">Defines and tracks pipelines, versions, experiments, runs, and schedules</td>\n<td style=\"text-align: left\">Pipeline, PipelineVersion, Run, RecurringRun, Experiment</td>\n</tr>\n<tr>\n<td style=\"text-align: left\"><strong>Katib</strong></td>\n<td style=\"text-align: left\">Automates hyperparameter tuning and neural architecture search</td>\n<td style=\"text-align: left\">Experiment, Trial, Suggestion</td>\n</tr>\n<tr>\n<td style=\"text-align: left\"><strong>Training</strong></td>\n<td style=\"text-align: left\">Runs distributed training workloads such as PyTorch and TensorFlow jobs</td>\n<td style=\"text-align: left\">TrainJob, TrainingRuntime, ClusterTrainingRuntime</td>\n</tr>\n<tr>\n<td style=\"text-align: left\"><strong>Spark</strong></td>\n<td style=\"text-align: left\">Runs large-scale data processing with Apache Spark</td>\n<td style=\"text-align: left\">SparkApplication, ScheduledSparkApplication</td>\n</tr>\n</tbody>\n</table>\n<h2 id=\"what-you-can-see\">What you can see<a class=\"td-heading-self-link\" href=\"#what-you-can-see\" aria-label=\"Heading self-link\"></a></h2><h3 id=\"inspect-notebook-pods\">Inspect notebook Pods<a class=\"td-heading-self-link\" href=\"#inspect-notebook-pods\" aria-label=\"Heading self-link\"></a></h3><p>The Notebook detail view shows Pod conditions and their <code>reason</code> and <code>message</code>\nfields. It also shows CPU, memory, and GPU requests and limits; volume mounts and\ntheir backing types, such as PersistentVolumeClaim, ConfigMap, Secret, or\n<code>emptyDir</code>; environment variables that reference Secret or ConfigMap objects;\nsidecar containers; and node tolerations. This view consolidates information that\nwould otherwise require several <code>kubectl describe</code> commands.</p>\n<h3 id=\"inspect-hyperparameter-tuning\">Inspect hyperparameter tuning<a class=\"td-heading-self-link\" href=\"#inspect-hyperparameter-tuning\" aria-label=\"Heading self-link\"></a></h3><p>The Katib views show the tuning algorithm, search space, every Trial with its live\nstatus, and the current best Trial with its metric values and parameter assignments.\nThey also show the early-stopping configuration and the number of Trial resources\nthat stopped early, so you can follow the search without leaving the cluster UI.</p>\n<h3 id=\"inspect-pipeline-state-without-the-backend-database\">Inspect pipeline state without the backend database<a class=\"td-heading-self-link\" href=\"#inspect-pipeline-state-without-the-backend-database\" aria-label=\"Heading self-link\"></a></h3><p>The Pipelines views read Kubernetes API resources directly and do not query the\nKubeflow Pipelines API service or backend database. You can inspect stored pipeline\nstate even when that service is unavailable. The Pipeline detail view compares the\nlatest and previous PipelineVersion specifications in a side-by-side YAML diff. Run\nviews show state and duration, RecurringRun views show human-readable schedules, and\nthe artifacts view aggregates <code>pipelineRoot</code> values from recent Run resources.</p>\n<h3 id=\"map-ml-resources\">Map ML resources<a class=\"td-heading-self-link\" href=\"#map-ml-resources\" aria-label=\"Heading self-link\"></a></h3><p>The plugin registers a\n<a href=\"https://headlamp.dev/docs/latest/development/plugins/functionality/extending-the-map/\">Headlamp map source</a>\nthat renders Notebook, Profile, PodDefault, Experiment, Pipeline, SparkApplication,\nand TrainJob resources as graph nodes. It draws edges between supported resources\nbased on <code>.metadata.ownerReferences</code>. Headlamp also shows inline summaries for these\nresource types when you hover over them.</p>\n<h2 id=\"try-it\">Try it<a class=\"td-heading-self-link\" href=\"#try-it\" aria-label=\"Heading self-link\"></a></h2><p>The\n<a href=\"https://github.com/headlamp-k8s/plugins/blob/main/kubeflow/README.md\">Kubeflow plugin README</a>\nexplains installation and local-cluster setup, including a lightweight CRD-only path\nfor evaluation. Because the plugin discovers installed API groups, you can use it\nwith an existing modular Kubeflow installation or create an evaluation cluster with\nonly the CRDs and sample resources.</p>\n<h2 id=\"apply-the-pattern-to-other-platforms\">Apply the pattern to other platforms<a class=\"td-heading-self-link\" href=\"#apply-the-pattern-to-other-platforms\" aria-label=\"Heading self-link\"></a></h2><p>Kubeflow illustrates a broader pattern. Platforms often model domain-specific\nworkflows with custom resources. Their dashboards focus on those workflows, while\nKubernetes operators also need the state of the underlying API resources and Pods.\nA CRD-driven plugin in a general Kubernetes UI can expose that state without making\noperators switch between unrelated tools.</p>\n<p>The plugin uses the Apache 2.0 license and is developed under Kubernetes SIG UI. To\nreport a problem or contribute an improvement, use the Headlamp plugins repository's\n<a href=\"https://github.com/headlamp-k8s/plugins/issues\">issue tracker</a> or\n<a href=\"https://github.com/headlamp-k8s/plugins/pulls\">pull requests</a>.</p>"
---

Kubernetes has quietly become the default platform for AI and machine learning. Whether you run notebook servers for data scientists, schedule distributed training jobs, tune hyperparameters, or orchestrate multi-step ML pipelines, those workloads increasingly land on a Kubernetes cluster. Kubeflow is one of the most popular ways to assemble that stack, and it does so the Kubernetes-native way: every capability is exposed as a Custom Resource Definition (CRD).
That design is a gift to cluster operators, because it means ML workloads can be observed and managed with the same primitives as everything else in the cluster. But in practice the specialized ML dashboards that ship with these platforms hide the Kubernetes layer underneath. When a notebook is stuck or a training run fails, the operator is often left dropping back to kubectl to find out what actually happened at the Pod level.
This post introduces the Headlamp Kubeflow plugin, which closes that gap by surfacing Kubeflow's custom resources directly inside a general-purpose Kubernetes UI. It is a worked example of a pattern any CRD-heavy platform can follow: meet operators where they already work, and show them the cluster-level truth.
Headlamp itself is an extensible Kubernetes web UI maintained under Kubernetes SIG UI and licensed under Apache 2.0. It runs as a desktop app or in-cluster, and its plugin system lets anyone add first-class views for custom resources.
Why operators need a different view
Purpose-built ML dashboards help data scientists submit experiments, pipelines, and
notebooks. Cluster operators and site reliability engineers (SREs) troubleshoot the
Kubernetes resources underneath, and they ask different questions:
Why is a notebook stuck? Is it ImagePullBackOff, OOMKilled, or a Pod waiting on a PersistentVolumeClaim?
Which Run resources failed recently across namespaces?
Which parameter set does a Katib Experiment report as optimal?
Do TrainJob resources reference the expected TrainingRuntime resources?
Which batch workloads are running, and what state does Kubernetes report?
The Headlamp Kubeflow plugin helps answer these questions by reading directly from
the Kubernetes API server. It shows Pod conditions, Kubernetes failure reasons, and
resources across namespaces without requiring an intermediary ML service or
database.
What the plugin covers
Kubeflow is modular, and teams often install only the components they need. The
plugin discovers the Kubeflow API groups on a cluster and displays only the
corresponding sections.
The plugin supports the following component families and API resources:
Kubeflow components and API resources supported by the Headlamp plugin


Component
Purpose
API resources




Notebooks
Provides development environments such as Jupyter, VS Code, and RStudio
Notebook, Profile, PodDefault


Pipelines
Defines and tracks pipelines, versions, experiments, runs, and schedules
Pipeline, PipelineVersion, Run, RecurringRun, Experiment


Katib
Automates hyperparameter tuning and neural architecture search
Experiment, Trial, Suggestion


Training
Runs distributed training workloads such as PyTorch and TensorFlow jobs
TrainJob, TrainingRuntime, ClusterTrainingRuntime


Spark
Runs large-scale data processing with Apache Spark
SparkApplication, ScheduledSparkApplication



What you can see
Inspect notebook Pods
The Notebook detail view shows Pod conditions and their reason and message
fields. It also shows CPU, memory, and GPU requests and limits; volume mounts and
their backing types, such as PersistentVolumeClaim, ConfigMap, Secret, or
emptyDir; environment variables that reference Secret or ConfigMap objects;
sidecar containers; and node tolerations. This view consolidates information that
would otherwise require several kubectl describe commands.
Inspect hyperparameter tuning
The Katib views show the tuning algorithm, search space, every Trial with its live
status, and the current best Trial with its metric values and parameter assignments.
They also show the early-stopping configuration and the number of Trial resources
that stopped early, so you can follow the search without leaving the cluster UI.
Inspect pipeline state without the backend database
The Pipelines views read Kubernetes API resources directly and do not query the
Kubeflow Pipelines API service or backend database. You can inspect stored pipeline
state even when that service is unavailable. The Pipeline detail view compares the
latest and previous PipelineVersion specifications in a side-by-side YAML diff. Run
views show state and duration, RecurringRun views show human-readable schedules, and
the artifacts view aggregates pipelineRoot values from recent Run resources.
Map ML resources
The plugin registers a
Headlamp map source
that renders Notebook, Profile, PodDefault, Experiment, Pipeline, SparkApplication,
and TrainJob resources as graph nodes. It draws edges between supported resources
based on .metadata.ownerReferences. Headlamp also shows inline summaries for these
resource types when you hover over them.
Try it
The
Kubeflow plugin README
explains installation and local-cluster setup, including a lightweight CRD-only path
for evaluation. Because the plugin discovers installed API groups, you can use it
with an existing modular Kubeflow installation or create an evaluation cluster with
only the CRDs and sample resources.
Apply the pattern to other platforms
Kubeflow illustrates a broader pattern. Platforms often model domain-specific
workflows with custom resources. Their dashboards focus on those workflows, while
Kubernetes operators also need the state of the underlying API resources and Pods.
A CRD-driven plugin in a general Kubernetes UI can expose that state without making
operators switch between unrelated tools.
The plugin uses the Apache 2.0 license and is developed under Kubernetes SIG UI. To
report a problem or contribute an improvement, use the Headlamp plugins repository's
issue tracker or
pull requests.
