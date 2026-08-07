---
title: "Building a Custom Metrics Exporter for Kubernetes"
link: "https://kubernetes.io/blog/2026/07/14/custom-metrics-exporter-kubernetes/"
guid: "https://kubernetes.io/blog/2026/07/14/custom-metrics-exporter-kubernetes/"
pubDate: "2026-07-14T18:00:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "Kubernetes ships with built-in awareness of CPU and memory, but most\nreal-world scaling decisions depend on signals that live entirely outside\nthat narrow window: how many messages are waiting in a queue, how long\nthe last batch job took, how many active WebSocket connections a pod is\nholding. When the built-in metrics are not enough, a metrics exporter\nbridges that gap.\nThis post walks through writing one from scratch, packaging it as a\ncontainer, and wiring it into a cluster so that Prometheus — and\nultimately the HorizontalPodAutoscaler — can consume it.\nWhat a metrics exporter actually does\nAn exporter is a small HTTP server with a single responsibility: expose\napplication state as text on a /metrics endpoint. Prometheus scrapes\nthat endpoint on a regular interval, stores the time-series data, and\nmakes it available for queries, alerts, and autoscaling rules.\nIn some cases you can instrument your application directly — embedding\nthe Prometheus client library and exposing /metrics from within the\nsame process — rather than running a separate exporter. A standalone\nexporter makes more sense when the data source is external to your\napplication or when you do not control the application code.\nThe format Prometheus expects is plain text — one metric per line, with\na name, optional labels, and a numeric value. Client libraries handle\nthe serialization for you, so in practice you only need to decide what\nto measure and call the right function when that value changes.\nChoosing what to measure\nBefore writing any code, it helps to decide what kind of signal you are\ndealing with. The Prometheus data model has three main types:\nCounters only ever increase. They are the right tool for totals:\nrequests served, jobs processed, errors encountered. Never use a\ncounter for a value that can go down.\nGauges represent a current snapshot of a value that can rise and\nfall freely. Queue depth, active connections, and cache size are all\ngauges.\nHistograms record the distribution of observed values, such as\nrequest latency. They let you calculate percentiles (p99, p50) rather\nthan just averages.\nOnce you know which type fits your signal, choose a name that follows\nthe convention <namespace>_<name>_<unit> in snake_case. A job\nprocessor might expose worker_jobs_processed_total (counter),\nworker_queue_depth (gauge), and worker_job_duration_seconds\n(histogram). Clear names save everyone debugging time later.\nSetting up the project\nThe Go Prometheus client is the most common choice for exporters in the\nKubernetes ecosystem, largely because the same library powers most of\nthe official Kubernetes components. Start by creating a module and\npulling in the dependency:\nmkdir my-exporter && cd my-exporter\ngo mod init example.com/my-exporter\ngo get github.com/prometheus/client_golang/prometheus\ngo get github.com/prometheus/client_golang/prometheus/promhttp\n\n\nRegistering metrics\nCreate main.go. The first thing to do is declare the metrics and\nregister them with Prometheus's default registry. Registration tells\nthe library that these metrics exist so they appear in the output even\nbefore the first observation is recorded:\npackage main\n\nimport (\n \"log\"\n \"net/http\"\n\n \"github.com/prometheus/client_golang/prometheus\"\n \"github.com/prometheus/client_golang/prometheus/promhttp\"\n)\n\nvar (\n jobsProcessed = prometheus.NewCounterVec(\n prometheus.CounterOpts{\n Name: \"worker_jobs_processed_total\",\n Help: \"Total number of jobs processed, partitioned by status.\",\n },\n []string{\"status\"},\n )\n\n queueDepth = prometheus.NewGauge(prometheus.GaugeOpts{\n Name: \"worker_queue_depth\",\n Help: \"Current number of jobs waiting in the queue.\",\n })\n\n jobDuration = prometheus.NewHistogram(prometheus.HistogramOpts{\n Name: \"worker_job_duration_seconds\",\n Help: \"Time spent processing a single job.\",\n Buckets: prometheus.DefBuckets,\n })\n)\n\nfunc init() {\n prometheus.MustRegister(jobsProcessed, queueDepth, jobDuration)\n}\n\n\nprometheus.MustRegister panics on a duplicate registration, which\nmakes misconfigurations obvious at startup rather than silently at\nruntime. If you are embedding this exporter inside a library that other\npackages will also instrument, prefer prometheus.Register and handle\nthe error yourself.\nCollecting real values\nWith the metrics registered, the next step is to keep them current.\nYou can either continually update the data as the data change, or run\nyour own internal refresh loop.\nThe pattern below shows a polling loop — a goroutine that periodically\nreads from whatever data source your application owns and updates the\nregistered metrics. Replace the simulated values with real calls to\nyour database, internal API, or message broker:\nimport (\n \"math/rand\"\n \"time\"\n)\n\nfunc collectMetrics() {\n for {\n // Replace these with real reads from your application.\n depth := float64(rand.Intn(50))\n queueDepth.Set(depth)\n\n start := time.Now()\n time.Sleep(time.Duration(rand.Intn(200)) * time.Millisecond)\n jobDuration.Observe(time.Since(start).Seconds())\n jobsProcessed.WithLabelValues(\"success\").Inc()\n\n time.Sleep(5 * time.Second)\n }\n}\n\n\nThe polling interval (here five seconds) should be shorter than\nPrometheus's scrape interval so that each scrape sees a fresh value.\nThe default scrape interval in most cluster deployments is fifteen\nseconds, which gives you comfortable headroom.\nExposing the endpoint\nWire the collection loop and the HTTP handler together in main. A\n/healthz path alongside /metrics gives Kubernetes a liveness probe\ntarget without exposing metric data on the health route:\nfunc main() {\n go collectMetrics()\n\n http.Handle(\"/metrics\", promhttp.Handler())\n http.HandleFunc(\"/healthz\", func(w http.ResponseWriter, r *http.Request) {\n w.WriteHeader(http.StatusOK)\n })\n\n log.Println(\"Listening on :8080\")\n if err := http.ListenAndServe(\":8080\", nil); err != nil {\n log.Fatalf(\"server error: %v\", err)\n }\n}\n\n\nVerify the output locally before building the image:\ngo run .\ncurl http://localhost:8080/metrics | grep worker_\n\n\nYou should see three # HELP and # TYPE blocks followed by the\ncurrent metric values. If those lines appear, the exporter is working\ncorrectly and is ready to be containerized.\nBuild a container image\nA multi-stage build keeps the final image small and avoids shipping a\nGo toolchain to production. The first stage compiles a statically linked\nbinary; the second stage copies only that binary into a minimal base.\nThe example below uses Docker, but the same pattern works with any\nOCI-compatible build tool such as Buildah or Podman:\nFROM golang:1.21-alpine AS builder\nWORKDIR /src\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /exporter .\n\nFROM gcr.io/distroless/static:nonroot\nCOPY --from=builder /exporter /exporter\nEXPOSE 8080\nENTRYPOINT [\"/exporter\"]\n\n\ndistroless/static:nonroot contains no shell, no package manager, and\nruns as a non-root user by default, which satisfies most cluster\nsecurity policies without extra configuration.\nBuild and push the image, replacing <registry> with your own registry\naddress:\ndocker build -t <registry>/my-exporter:v1.0.0 .\ndocker push <registry>/my-exporter:v1.0.0\n\n\n(Note: Using a CI/CD pipeline to automate this is generally a better pattern than running these commands manually.)\nDeploying to the cluster\nTwo manifests are enough to run the exporter: a Deployment that manages\nthe pod lifecycle, and a Service that gives Prometheus a stable address\nto scrape.\n(You might prefer to have Prometheus scrape from every Pod; if that makes\nsense for your use case, then it's OK to configure instead).\nThe examples below use the monitoring namespace, which is a common\nconvention when running Prometheus and related components together. Adjust\nthe namespace to match your own cluster setup.\nThe Deployment sets conservative resource limits appropriate for a\nlightweight sidecar-style process, and uses the /healthz route for\nits liveness probe:\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n name: my-exporter\n namespace: monitoring\n labels:\n app.kubernetes.io/name: my-exporter\nspec:\n replicas: 1\n selector:\n matchLabels:\n app.kubernetes.io/name: my-exporter\n template:\n metadata:\n labels:\n app.kubernetes.io/name: my-exporter\n spec:\n containers:\n - name: exporter\n image: <registry>/my-exporter:v1.0.0\n ports:\n - name: metrics\n containerPort: 8080\n livenessProbe:\n httpGet:\n path: /healthz\n port: 8080\n initialDelaySeconds: 5\n periodSeconds: 10\n resources:\n requests:\n cpu: 50m\n memory: 32Mi\n limits:\n cpu: 100m\n memory: 64Mi\n\n\nThe Service names the port metrics, which the ServiceMonitor in the\nnext section will reference by that name:\napiVersion: v1\nkind: Service\nmetadata:\n name: my-exporter\n namespace: monitoring\n labels:\n app.kubernetes.io/name: my-exporter\nspec:\n selector:\n app.kubernetes.io/name: my-exporter\n ports:\n - name: metrics\n port: 8080\n targetPort: metrics\n\n\nApply both:\nkubectl apply -f deployment.yaml -f service.yaml\n\n\nTelling Prometheus where to look\nHow you configure scraping depends on how Prometheus was installed.\nOption 1: Prometheus Operator (ServiceMonitor)\nIf you installed Prometheus using the\nPrometheus Operator\nor the kube-prometheus-stack Helm chart, the operator must be running\nin your cluster before you create a ServiceMonitor. The release label\nmust match the label selector configured on your Prometheus resource —\nkube-prometheus-stack is the default for a standard Helm install:\napiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n name: my-exporter\n namespace: monitoring\n labels:\n release: kube-prometheus-stack\nspec:\n selector:\n matchLabels:\n app.kubernetes.io/name: my-exporter\n endpoints:\n - port: metrics\n interval: 15s\n path: /metrics\n\n\nOption 2: Annotation-based discovery\nIf your Prometheus uses annotation-based pod discovery instead, you will\nneed a matching scrape_config rule in your Prometheus configuration —\ncheck with whoever manages your Prometheus installation to confirm it is\nin place.\nYou can add the following two annotations to the Pod template regardless\nof which scraping method you use. They are ignored by the Prometheus\nOperator but picked up automatically by annotation-based setups:\nannotations:\n prometheus.io/scrape: \"true\"\n prometheus.io/port: \"8080\" # omit if not using annotation-based discovery\n prometheus.io/path: \"/metrics\" # omit if not using annotation-based discovery\n\n\nIf you are unsure which setup your cluster uses, the ServiceMonitor\napproach is more explicit and easier to debug.\nVerifying the scrape\nPort-forward to the Prometheus service and open the targets page to\nconfirm the exporter has been discovered:\nkubectl port-forward svc/prometheus-operated 9090 -n monitoring\n\n\nNavigate to http://localhost:9090/targets. The my-exporter target\nshould appear with state UP. If it shows DOWN, check that the\nServiceMonitor's release label matches and that the pod is running:\nkubectl get pods -n monitoring -l app.kubernetes.io/name=my-exporter\nkubectl describe servicemonitor my-exporter -n monitoring\n\n\nOnce the target is healthy, run a quick query in the expression browser\nto confirm data is flowing:\nrate(worker_jobs_processed_total{status=\"success\"}[2m])\n\nA non-zero result here means the full pipeline is working: your\napplication is producing data, Prometheus is scraping it, and the\ntime-series are stored and queryable.\nWhat comes next\nA working exporter is the foundation, not the destination. The natural\nnext step is surfacing these metrics to the\nHorizontalPodAutoscaler\nso that your workload scales on the signals that actually drive load,\nnot just CPU. That requires a metrics adapter — the Prometheus Adapter\nis the most widely deployed option — which registers your custom metrics\nwith the Kubernetes Custom Metrics API. Once registered, any\nHorizontalPodAutoscaler in the cluster can reference worker_queue_depth\nor worker_jobs_processed_total directly in its metrics block.\nFor a walkthrough of that setup, see\nAutoscaling on multiple metrics and custom metrics.\nFor a catalog of ready-made exporters covering databases, message\nbrokers, and cloud services, the\nPrometheus exporters and integrations\npage is a good starting point."
contentHtml: "<p>Kubernetes ships with built-in awareness of CPU and memory, but most\nreal-world scaling decisions depend on signals that live entirely outside\nthat narrow window: how many messages are waiting in a queue, how long\nthe last batch job took, how many active WebSocket connections a pod is\nholding. When the built-in metrics are not enough, a <em>metrics exporter</em>\nbridges that gap.</p>\n<p>This post walks through writing one from scratch, packaging it as a\ncontainer, and wiring it into a cluster so that Prometheus — and\nultimately the <a href=\"https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/\">HorizontalPodAutoscaler</a> — can consume it.</p>\n<h2 id=\"what-a-metrics-exporter-actually-does\">What a metrics exporter actually does<a class=\"td-heading-self-link\" href=\"#what-a-metrics-exporter-actually-does\" aria-label=\"Heading self-link\"></a></h2><p>An exporter is a small HTTP server with a single responsibility: expose\napplication state as text on a <code>/metrics</code> endpoint. Prometheus <em>scrapes</em>\nthat endpoint on a regular interval, stores the time-series data, and\nmakes it available for queries, alerts, and autoscaling rules.</p>\n<p>In some cases you can instrument your application directly — embedding\nthe Prometheus client library and exposing <code>/metrics</code> from within the\nsame process — rather than running a separate exporter. A standalone\nexporter makes more sense when the data source is external to your\napplication or when you do not control the application code.</p>\n<p>The format Prometheus expects is plain text — one metric per line, with\na name, optional labels, and a numeric value. Client libraries handle\nthe serialization for you, so in practice you only need to decide what\nto measure and call the right function when that value changes.</p>\n<h2 id=\"choosing-what-to-measure\">Choosing what to measure<a class=\"td-heading-self-link\" href=\"#choosing-what-to-measure\" aria-label=\"Heading self-link\"></a></h2><p>Before writing any code, it helps to decide what kind of signal you are\ndealing with. The Prometheus data model has three main types:</p>\n<ul>\n<li>\n<p><em>Counters</em> only ever increase. They are the right tool for totals:\nrequests served, jobs processed, errors encountered. Never use a\ncounter for a value that can go down.</p>\n</li>\n<li>\n<p><em>Gauges</em> represent a current snapshot of a value that can rise and\nfall freely. Queue depth, active connections, and cache size are all\ngauges.</p>\n</li>\n<li>\n<p><em>Histograms</em> record the distribution of observed values, such as\nrequest latency. They let you calculate percentiles (p99, p50) rather\nthan just averages.</p>\n</li>\n</ul>\n<p>Once you know which type fits your signal, choose a name that follows\nthe convention <code>&lt;namespace&gt;_&lt;name&gt;_&lt;unit&gt;</code> in <code>snake_case</code>. A job\nprocessor might expose <code>worker_jobs_processed_total</code> (counter),\n<code>worker_queue_depth</code> (gauge), and <code>worker_job_duration_seconds</code>\n(histogram). Clear names save everyone debugging time later.</p>\n<h2 id=\"setting-up-the-project\">Setting up the project<a class=\"td-heading-self-link\" href=\"#setting-up-the-project\" aria-label=\"Heading self-link\"></a></h2><p>The Go Prometheus client is the most common choice for exporters in the\nKubernetes ecosystem, largely because the same library powers most of\nthe official Kubernetes components. Start by creating a module and\npulling in the dependency:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">mkdir my-exporter <span class=\"o\">&amp;&amp;</span> <span class=\"nb\">cd</span> my-exporter\n</span></span><span class=\"line\"><span class=\"cl\">go mod init example.com/my-exporter\n</span></span><span class=\"line\"><span class=\"cl\">go get github.com/prometheus/client_golang/prometheus\n</span></span><span class=\"line\"><span class=\"cl\">go get github.com/prometheus/client_golang/prometheus/promhttp\n</span></span></code></pre></div><h2 id=\"registering-metrics\">Registering metrics<a class=\"td-heading-self-link\" href=\"#registering-metrics\" aria-label=\"Heading self-link\"></a></h2><p>Create <code>main.go</code>. The first thing to do is declare the metrics and\nregister them with Prometheus's default registry. Registration tells\nthe library that these metrics exist so they appear in the output even\nbefore the first observation is recorded:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-go\" data-lang=\"go\"><span class=\"line\"><span class=\"cl\"><span class=\"kn\">package</span> <span class=\"nx\">main</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"kn\">import</span> <span class=\"p\">(</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"s\">&#34;log&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"s\">&#34;net/http&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"s\">&#34;github.com/prometheus/client_golang/prometheus&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"s\">&#34;github.com/prometheus/client_golang/prometheus/promhttp&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"kd\">var</span> <span class=\"p\">(</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">jobsProcessed</span> <span class=\"p\">=</span> <span class=\"nx\">prometheus</span><span class=\"p\">.</span><span class=\"nf\">NewCounterVec</span><span class=\"p\">(</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">prometheus</span><span class=\"p\">.</span><span class=\"nx\">CounterOpts</span><span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">Name</span><span class=\"p\">:</span> <span class=\"s\">&#34;worker_jobs_processed_total&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">Help</span><span class=\"p\">:</span> <span class=\"s\">&#34;Total number of jobs processed, partitioned by status.&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">},</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">[]</span><span class=\"kt\">string</span><span class=\"p\">{</span><span class=\"s\">&#34;status&#34;</span><span class=\"p\">},</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">queueDepth</span> <span class=\"p\">=</span> <span class=\"nx\">prometheus</span><span class=\"p\">.</span><span class=\"nf\">NewGauge</span><span class=\"p\">(</span><span class=\"nx\">prometheus</span><span class=\"p\">.</span><span class=\"nx\">GaugeOpts</span><span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">Name</span><span class=\"p\">:</span> <span class=\"s\">&#34;worker_queue_depth&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">Help</span><span class=\"p\">:</span> <span class=\"s\">&#34;Current number of jobs waiting in the queue.&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">})</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">jobDuration</span> <span class=\"p\">=</span> <span class=\"nx\">prometheus</span><span class=\"p\">.</span><span class=\"nf\">NewHistogram</span><span class=\"p\">(</span><span class=\"nx\">prometheus</span><span class=\"p\">.</span><span class=\"nx\">HistogramOpts</span><span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">Name</span><span class=\"p\">:</span> <span class=\"s\">&#34;worker_job_duration_seconds&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">Help</span><span class=\"p\">:</span> <span class=\"s\">&#34;Time spent processing a single job.&#34;</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">Buckets</span><span class=\"p\">:</span> <span class=\"nx\">prometheus</span><span class=\"p\">.</span><span class=\"nx\">DefBuckets</span><span class=\"p\">,</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">})</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"kd\">func</span> <span class=\"nf\">init</span><span class=\"p\">()</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">prometheus</span><span class=\"p\">.</span><span class=\"nf\">MustRegister</span><span class=\"p\">(</span><span class=\"nx\">jobsProcessed</span><span class=\"p\">,</span> <span class=\"nx\">queueDepth</span><span class=\"p\">,</span> <span class=\"nx\">jobDuration</span><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">}</span>\n</span></span></code></pre></div><p><code>prometheus.MustRegister</code> panics on a duplicate registration, which\nmakes misconfigurations obvious at startup rather than silently at\nruntime. If you are embedding this exporter inside a library that other\npackages will also instrument, prefer <code>prometheus.Register</code> and handle\nthe error yourself.</p>\n<h2 id=\"collecting-real-values\">Collecting real values<a class=\"td-heading-self-link\" href=\"#collecting-real-values\" aria-label=\"Heading self-link\"></a></h2><p>With the metrics registered, the next step is to keep them current.\nYou can either continually update the data as the data change, or run\nyour own internal refresh loop.\nThe pattern below shows a polling loop — a goroutine that periodically\nreads from whatever data source your application owns and updates the\nregistered metrics. Replace the simulated values with real calls to\nyour database, internal API, or message broker:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-go\" data-lang=\"go\"><span class=\"line\"><span class=\"cl\"><span class=\"kn\">import</span> <span class=\"p\">(</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"s\">&#34;math/rand&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"s\">&#34;time&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"kd\">func</span> <span class=\"nf\">collectMetrics</span><span class=\"p\">()</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"k\">for</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"c1\">// Replace these with real reads from your application.</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">depth</span> <span class=\"o\">:=</span> <span class=\"nb\">float64</span><span class=\"p\">(</span><span class=\"nx\">rand</span><span class=\"p\">.</span><span class=\"nf\">Intn</span><span class=\"p\">(</span><span class=\"mi\">50</span><span class=\"p\">))</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">queueDepth</span><span class=\"p\">.</span><span class=\"nf\">Set</span><span class=\"p\">(</span><span class=\"nx\">depth</span><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">start</span> <span class=\"o\">:=</span> <span class=\"nx\">time</span><span class=\"p\">.</span><span class=\"nf\">Now</span><span class=\"p\">()</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">time</span><span class=\"p\">.</span><span class=\"nf\">Sleep</span><span class=\"p\">(</span><span class=\"nx\">time</span><span class=\"p\">.</span><span class=\"nf\">Duration</span><span class=\"p\">(</span><span class=\"nx\">rand</span><span class=\"p\">.</span><span class=\"nf\">Intn</span><span class=\"p\">(</span><span class=\"mi\">200</span><span class=\"p\">))</span> <span class=\"o\">*</span> <span class=\"nx\">time</span><span class=\"p\">.</span><span class=\"nx\">Millisecond</span><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">jobDuration</span><span class=\"p\">.</span><span class=\"nf\">Observe</span><span class=\"p\">(</span><span class=\"nx\">time</span><span class=\"p\">.</span><span class=\"nf\">Since</span><span class=\"p\">(</span><span class=\"nx\">start</span><span class=\"p\">).</span><span class=\"nf\">Seconds</span><span class=\"p\">())</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">jobsProcessed</span><span class=\"p\">.</span><span class=\"nf\">WithLabelValues</span><span class=\"p\">(</span><span class=\"s\">&#34;success&#34;</span><span class=\"p\">).</span><span class=\"nf\">Inc</span><span class=\"p\">()</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">time</span><span class=\"p\">.</span><span class=\"nf\">Sleep</span><span class=\"p\">(</span><span class=\"mi\">5</span> <span class=\"o\">*</span> <span class=\"nx\">time</span><span class=\"p\">.</span><span class=\"nx\">Second</span><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">}</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">}</span>\n</span></span></code></pre></div><p>The polling interval (here five seconds) should be shorter than\nPrometheus's scrape interval so that each scrape sees a fresh value.\nThe default scrape interval in most cluster deployments is fifteen\nseconds, which gives you comfortable headroom.</p>\n<h2 id=\"exposing-the-endpoint\">Exposing the endpoint<a class=\"td-heading-self-link\" href=\"#exposing-the-endpoint\" aria-label=\"Heading self-link\"></a></h2><p>Wire the collection loop and the HTTP handler together in <code>main</code>. A\n<code>/healthz</code> path alongside <code>/metrics</code> gives Kubernetes a liveness probe\ntarget without exposing metric data on the health route:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-go\" data-lang=\"go\"><span class=\"line\"><span class=\"cl\"><span class=\"kd\">func</span> <span class=\"nf\">main</span><span class=\"p\">()</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"k\">go</span> <span class=\"nf\">collectMetrics</span><span class=\"p\">()</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">http</span><span class=\"p\">.</span><span class=\"nf\">Handle</span><span class=\"p\">(</span><span class=\"s\">&#34;/metrics&#34;</span><span class=\"p\">,</span> <span class=\"nx\">promhttp</span><span class=\"p\">.</span><span class=\"nf\">Handler</span><span class=\"p\">())</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">http</span><span class=\"p\">.</span><span class=\"nf\">HandleFunc</span><span class=\"p\">(</span><span class=\"s\">&#34;/healthz&#34;</span><span class=\"p\">,</span> <span class=\"kd\">func</span><span class=\"p\">(</span><span class=\"nx\">w</span> <span class=\"nx\">http</span><span class=\"p\">.</span><span class=\"nx\">ResponseWriter</span><span class=\"p\">,</span> <span class=\"nx\">r</span> <span class=\"o\">*</span><span class=\"nx\">http</span><span class=\"p\">.</span><span class=\"nx\">Request</span><span class=\"p\">)</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">w</span><span class=\"p\">.</span><span class=\"nf\">WriteHeader</span><span class=\"p\">(</span><span class=\"nx\">http</span><span class=\"p\">.</span><span class=\"nx\">StatusOK</span><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">})</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">log</span><span class=\"p\">.</span><span class=\"nf\">Println</span><span class=\"p\">(</span><span class=\"s\">&#34;Listening on :8080&#34;</span><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"k\">if</span> <span class=\"nx\">err</span> <span class=\"o\">:=</span> <span class=\"nx\">http</span><span class=\"p\">.</span><span class=\"nf\">ListenAndServe</span><span class=\"p\">(</span><span class=\"s\">&#34;:8080&#34;</span><span class=\"p\">,</span> <span class=\"kc\">nil</span><span class=\"p\">);</span> <span class=\"nx\">err</span> <span class=\"o\">!=</span> <span class=\"kc\">nil</span> <span class=\"p\">{</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"nx\">log</span><span class=\"p\">.</span><span class=\"nf\">Fatalf</span><span class=\"p\">(</span><span class=\"s\">&#34;server error: %v&#34;</span><span class=\"p\">,</span> <span class=\"nx\">err</span><span class=\"p\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\"> <span class=\"p\">}</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"p\">}</span>\n</span></span></code></pre></div><p>Verify the output locally before building the image:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">go run .\n</span></span><span class=\"line\"><span class=\"cl\">curl http://localhost:8080/metrics <span class=\"p\">|</span> grep worker_\n</span></span></code></pre></div><p>You should see three <code># HELP</code> and <code># TYPE</code> blocks followed by the\ncurrent metric values. If those lines appear, the exporter is working\ncorrectly and is ready to be containerized.</p>\n<h2 id=\"build-a-container-image\">Build a container image<a class=\"td-heading-self-link\" href=\"#build-a-container-image\" aria-label=\"Heading self-link\"></a></h2><p>A multi-stage build keeps the final image small and avoids shipping a\nGo toolchain to production. The first stage compiles a statically linked\nbinary; the second stage copies only that binary into a minimal base.\nThe example below uses Docker, but the same pattern works with any\nOCI-compatible build tool such as Buildah or Podman:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-dockerfile\" data-lang=\"dockerfile\"><span class=\"line\"><span class=\"cl\"><span class=\"k\">FROM</span><span class=\"s\"> golang:1.21-alpine AS builder</span><span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">WORKDIR</span><span class=\"s\"> /src</span><span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">COPY</span> go.mod go.sum ./<span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">RUN</span> go mod download<span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">COPY</span> . .<span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">RUN</span> <span class=\"nv\">CGO_ENABLED</span><span class=\"o\">=</span><span class=\"m\">0</span> go build -o /exporter .<span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">FROM</span><span class=\"s\"> gcr.io/distroless/static:nonroot</span><span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">COPY</span> --from<span class=\"o\">=</span>builder /exporter /exporter<span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">EXPOSE</span><span class=\"s\"> 8080</span><span class=\"err\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"err\"></span><span class=\"k\">ENTRYPOINT</span> <span class=\"p\">[</span><span class=\"s2\">&#34;/exporter&#34;</span><span class=\"p\">]</span><span class=\"err\">\n</span></span></span></code></pre></div><p><code>distroless/static:nonroot</code> contains no shell, no package manager, and\nruns as a non-root user by default, which satisfies most cluster\nsecurity policies without extra configuration.</p>\n<p>Build and push the image, replacing <code>&lt;registry&gt;</code> with your own registry\naddress:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">docker build -t &lt;registry&gt;/my-exporter:v1.0.0 .\n</span></span><span class=\"line\"><span class=\"cl\">docker push &lt;registry&gt;/my-exporter:v1.0.0\n</span></span></code></pre></div><p>(Note: Using a CI/CD pipeline to automate this is generally a better pattern than running these commands manually.)</p>\n<h2 id=\"deploying-to-the-cluster\">Deploying to the cluster<a class=\"td-heading-self-link\" href=\"#deploying-to-the-cluster\" aria-label=\"Heading self-link\"></a></h2><p>Two manifests are enough to run the exporter: a Deployment that manages\nthe pod lifecycle, and a Service that gives Prometheus a stable address\nto scrape.\n(You might prefer to have Prometheus scrape from every Pod; if that makes\nsense for your use case, then it's OK to configure instead).</p>\n<p>The examples below use the <code>monitoring</code> namespace, which is a common\nconvention when running Prometheus and related components together. Adjust\nthe namespace to match your own cluster setup.</p>\n<p>The Deployment sets conservative resource limits appropriate for a\nlightweight sidecar-style process, and uses the <code>/healthz</code> route for\nits liveness probe:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">apps/v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">Deployment</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">namespace</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">monitoring</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">labels</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">app.kubernetes.io/name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">replicas</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"m\">1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">selector</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">matchLabels</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">app.kubernetes.io/name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">template</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">labels</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">app.kubernetes.io/name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">containers</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span>- <span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">image</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">&lt;registry&gt;/my-exporter:v1.0.0</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">ports</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span>- <span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">metrics</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">containerPort</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"m\">8080</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">livenessProbe</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">httpGet</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">path</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">/healthz</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">port</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"m\">8080</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">initialDelaySeconds</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"m\">5</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">periodSeconds</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"m\">10</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">resources</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">requests</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">cpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">50m</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">memory</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">32Mi</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">limits</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">cpu</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">100m</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">memory</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">64Mi</span><span class=\"w\">\n</span></span></span></code></pre></div><p>The Service names the port <code>metrics</code>, which the ServiceMonitor in the\nnext section will reference by that name:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">Service</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">namespace</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">monitoring</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">labels</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">app.kubernetes.io/name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">selector</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">app.kubernetes.io/name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">ports</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span>- <span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">metrics</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">port</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"m\">8080</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">targetPort</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">metrics</span><span class=\"w\">\n</span></span></span></code></pre></div><p>Apply both:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">kubectl apply -f deployment.yaml -f service.yaml\n</span></span></code></pre></div><h2 id=\"telling-prometheus-where-to-look\">Telling Prometheus where to look<a class=\"td-heading-self-link\" href=\"#telling-prometheus-where-to-look\" aria-label=\"Heading self-link\"></a></h2><p>How you configure scraping depends on how Prometheus was installed.</p>\n<p><strong>Option 1: Prometheus Operator (ServiceMonitor)</strong></p>\n<p>If you installed Prometheus using the\n<a href=\"https://github.com/prometheus-operator/prometheus-operator\">Prometheus Operator</a>\nor the <code>kube-prometheus-stack</code> Helm chart, the operator must be running\nin your cluster before you create a ServiceMonitor. The <code>release</code> label\nmust match the label selector configured on your Prometheus resource —\n<code>kube-prometheus-stack</code> is the default for a standard Helm install:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">monitoring.coreos.com/v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">ServiceMonitor</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">namespace</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">monitoring</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">labels</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">release</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">kube-prometheus-stack</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">spec</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">selector</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">matchLabels</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">app.kubernetes.io/name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">my-exporter</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">endpoints</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span>- <span class=\"nt\">port</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">metrics</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">interval</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">15s</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">path</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">/metrics</span><span class=\"w\">\n</span></span></span></code></pre></div><p><strong>Option 2: Annotation-based discovery</strong></p>\n<p>If your Prometheus uses annotation-based pod discovery instead, you will\nneed a matching <code>scrape_config</code> rule in your Prometheus configuration —\ncheck with whoever manages your Prometheus installation to confirm it is\nin place.</p>\n<p>You can add the following two annotations to the Pod template regardless\nof which scraping method you use. They are ignored by the Prometheus\nOperator but picked up automatically by annotation-based setups:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">annotations</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">prometheus.io/scrape</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;true&#34;</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">prometheus.io/port</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;8080&#34;</span><span class=\"w\"> </span><span class=\"c\"># omit if not using annotation-based discovery</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">prometheus.io/path</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"s2\">&#34;/metrics&#34;</span><span class=\"w\"> </span><span class=\"c\"># omit if not using annotation-based discovery</span><span class=\"w\">\n</span></span></span></code></pre></div><p>If you are unsure which setup your cluster uses, the ServiceMonitor\napproach is more explicit and easier to debug.</p>\n<h2 id=\"verifying-the-scrape\">Verifying the scrape<a class=\"td-heading-self-link\" href=\"#verifying-the-scrape\" aria-label=\"Heading self-link\"></a></h2><p>Port-forward to the Prometheus service and open the targets page to\nconfirm the exporter has been discovered:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">kubectl port-forward svc/prometheus-operated <span class=\"m\">9090</span> -n monitoring\n</span></span></code></pre></div><p>Navigate to <code>http://localhost:9090/targets</code>. The <code>my-exporter</code> target\nshould appear with state <strong>UP</strong>. If it shows <strong>DOWN</strong>, check that the\nServiceMonitor's <code>release</code> label matches and that the pod is running:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">kubectl get pods -n monitoring -l app.kubernetes.io/name<span class=\"o\">=</span>my-exporter\n</span></span><span class=\"line\"><span class=\"cl\">kubectl describe servicemonitor my-exporter -n monitoring\n</span></span></code></pre></div><p>Once the target is healthy, run a quick query in the expression browser\nto confirm data is flowing:</p>\n<pre tabindex=\"0\"><code>rate(worker_jobs_processed_total{status=&#34;success&#34;}[2m])\n</code></pre><p>A non-zero result here means the full pipeline is working: your\napplication is producing data, Prometheus is scraping it, and the\ntime-series are stored and queryable.</p>\n<h2 id=\"what-comes-next\">What comes next<a class=\"td-heading-self-link\" href=\"#what-comes-next\" aria-label=\"Heading self-link\"></a></h2><p>A working exporter is the foundation, not the destination. The natural\nnext step is surfacing these metrics to the\n<a href=\"https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/\">HorizontalPodAutoscaler</a>\nso that your workload scales on the signals that actually drive load,\nnot just CPU. That requires a metrics adapter — the Prometheus Adapter\nis the most widely deployed option — which registers your custom metrics\nwith the Kubernetes Custom Metrics API. Once registered, any\nHorizontalPodAutoscaler in the cluster can reference <code>worker_queue_depth</code>\nor <code>worker_jobs_processed_total</code> directly in its <code>metrics</code> block.</p>\n<p>For a walkthrough of that setup, see\n<a href=\"https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics\">Autoscaling on multiple metrics and custom metrics</a>.\nFor a catalog of ready-made exporters covering databases, message\nbrokers, and cloud services, the\n<a href=\"https://prometheus.io/docs/instrumenting/exporters/\">Prometheus exporters and integrations</a>\npage is a good starting point.</p>"
---

Kubernetes ships with built-in awareness of CPU and memory, but most
real-world scaling decisions depend on signals that live entirely outside
that narrow window: how many messages are waiting in a queue, how long
the last batch job took, how many active WebSocket connections a pod is
holding. When the built-in metrics are not enough, a metrics exporter
bridges that gap.
This post walks through writing one from scratch, packaging it as a
container, and wiring it into a cluster so that Prometheus — and
ultimately the HorizontalPodAutoscaler — can consume it.
What a metrics exporter actually does
An exporter is a small HTTP server with a single responsibility: expose
application state as text on a /metrics endpoint. Prometheus scrapes
that endpoint on a regular interval, stores the time-series data, and
makes it available for queries, alerts, and autoscaling rules.
In some cases you can instrument your application directly — embedding
the Prometheus client library and exposing /metrics from within the
same process — rather than running a separate exporter. A standalone
exporter makes more sense when the data source is external to your
application or when you do not control the application code.
The format Prometheus expects is plain text — one metric per line, with
a name, optional labels, and a numeric value. Client libraries handle
the serialization for you, so in practice you only need to decide what
to measure and call the right function when that value changes.
Choosing what to measure
Before writing any code, it helps to decide what kind of signal you are
dealing with. The Prometheus data model has three main types:
Counters only ever increase. They are the right tool for totals:
requests served, jobs processed, errors encountered. Never use a
counter for a value that can go down.
Gauges represent a current snapshot of a value that can rise and
fall freely. Queue depth, active connections, and cache size are all
gauges.
Histograms record the distribution of observed values, such as
request latency. They let you calculate percentiles (p99, p50) rather
than just averages.
Once you know which type fits your signal, choose a name that follows
the convention <namespace>_<name>_<unit> in snake_case. A job
processor might expose worker_jobs_processed_total (counter),
worker_queue_depth (gauge), and worker_job_duration_seconds
(histogram). Clear names save everyone debugging time later.
Setting up the project
The Go Prometheus client is the most common choice for exporters in the
Kubernetes ecosystem, largely because the same library powers most of
the official Kubernetes components. Start by creating a module and
pulling in the dependency:
mkdir my-exporter && cd my-exporter
go mod init example.com/my-exporter
go get github.com/prometheus/client_golang/prometheus
go get github.com/prometheus/client_golang/prometheus/promhttp


Registering metrics
Create main.go. The first thing to do is declare the metrics and
register them with Prometheus's default registry. Registration tells
the library that these metrics exist so they appear in the output even
before the first observation is recorded:
package main

import (
 "log"
 "net/http"

 "github.com/prometheus/client_golang/prometheus"
 "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
 jobsProcessed = prometheus.NewCounterVec(
 prometheus.CounterOpts{
 Name: "worker_jobs_processed_total",
 Help: "Total number of jobs processed, partitioned by status.",
 },
 []string{"status"},
 )

 queueDepth = prometheus.NewGauge(prometheus.GaugeOpts{
 Name: "worker_queue_depth",
 Help: "Current number of jobs waiting in the queue.",
 })

 jobDuration = prometheus.NewHistogram(prometheus.HistogramOpts{
 Name: "worker_job_duration_seconds",
 Help: "Time spent processing a single job.",
 Buckets: prometheus.DefBuckets,
 })
)

func init() {
 prometheus.MustRegister(jobsProcessed, queueDepth, jobDuration)
}


prometheus.MustRegister panics on a duplicate registration, which
makes misconfigurations obvious at startup rather than silently at
runtime. If you are embedding this exporter inside a library that other
packages will also instrument, prefer prometheus.Register and handle
the error yourself.
Collecting real values
With the metrics registered, the next step is to keep them current.
You can either continually update the data as the data change, or run
your own internal refresh loop.
The pattern below shows a polling loop — a goroutine that periodically
reads from whatever data source your application owns and updates the
registered metrics. Replace the simulated values with real calls to
your database, internal API, or message broker:
import (
 "math/rand"
 "time"
)

func collectMetrics() {
 for {
 // Replace these with real reads from your application.
 depth := float64(rand.Intn(50))
 queueDepth.Set(depth)

 start := time.Now()
 time.Sleep(time.Duration(rand.Intn(200)) * time.Millisecond)
 jobDuration.Observe(time.Since(start).Seconds())
 jobsProcessed.WithLabelValues("success").Inc()

 time.Sleep(5 * time.Second)
 }
}


The polling interval (here five seconds) should be shorter than
Prometheus's scrape interval so that each scrape sees a fresh value.
The default scrape interval in most cluster deployments is fifteen
seconds, which gives you comfortable headroom.
Exposing the endpoint
Wire the collection loop and the HTTP handler together in main. A
/healthz path alongside /metrics gives Kubernetes a liveness probe
target without exposing metric data on the health route:
func main() {
 go collectMetrics()

 http.Handle("/metrics", promhttp.Handler())
 http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
 w.WriteHeader(http.StatusOK)
 })

 log.Println("Listening on :8080")
 if err := http.ListenAndServe(":8080", nil); err != nil {
 log.Fatalf("server error: %v", err)
 }
}


Verify the output locally before building the image:
go run .
curl http://localhost:8080/metrics | grep worker_


You should see three # HELP and # TYPE blocks followed by the
current metric values. If those lines appear, the exporter is working
correctly and is ready to be containerized.
Build a container image
A multi-stage build keeps the final image small and avoids shipping a
Go toolchain to production. The first stage compiles a statically linked
binary; the second stage copies only that binary into a minimal base.
The example below uses Docker, but the same pattern works with any
OCI-compatible build tool such as Buildah or Podman:
FROM golang:1.21-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /exporter .

FROM gcr.io/distroless/static:nonroot
COPY --from=builder /exporter /exporter
EXPOSE 8080
ENTRYPOINT ["/exporter"]


distroless/static:nonroot contains no shell, no package manager, and
runs as a non-root user by default, which satisfies most cluster
security policies without extra configuration.
Build and push the image, replacing <registry> with your own registry
address:
docker build -t <registry>/my-exporter:v1.0.0 .
docker push <registry>/my-exporter:v1.0.0


(Note: Using a CI/CD pipeline to automate this is generally a better pattern than running these commands manually.)
Deploying to the cluster
Two manifests are enough to run the exporter: a Deployment that manages
the pod lifecycle, and a Service that gives Prometheus a stable address
to scrape.
(You might prefer to have Prometheus scrape from every Pod; if that makes
sense for your use case, then it's OK to configure instead).
The examples below use the monitoring namespace, which is a common
convention when running Prometheus and related components together. Adjust
the namespace to match your own cluster setup.
The Deployment sets conservative resource limits appropriate for a
lightweight sidecar-style process, and uses the /healthz route for
its liveness probe:
apiVersion: apps/v1
kind: Deployment
metadata:
 name: my-exporter
 namespace: monitoring
 labels:
 app.kubernetes.io/name: my-exporter
spec:
 replicas: 1
 selector:
 matchLabels:
 app.kubernetes.io/name: my-exporter
 template:
 metadata:
 labels:
 app.kubernetes.io/name: my-exporter
 spec:
 containers:
 - name: exporter
 image: <registry>/my-exporter:v1.0.0
 ports:
 - name: metrics
 containerPort: 8080
 livenessProbe:
 httpGet:
 path: /healthz
 port: 8080
 initialDelaySeconds: 5
 periodSeconds: 10
 resources:
 requests:
 cpu: 50m
 memory: 32Mi
 limits:
 cpu: 100m
 memory: 64Mi


The Service names the port metrics, which the ServiceMonitor in the
next section will reference by that name:
apiVersion: v1
kind: Service
metadata:
 name: my-exporter
 namespace: monitoring
 labels:
 app.kubernetes.io/name: my-exporter
spec:
 selector:
 app.kubernetes.io/name: my-exporter
 ports:
 - name: metrics
 port: 8080
 targetPort: metrics


Apply both:
kubectl apply -f deployment.yaml -f service.yaml


Telling Prometheus where to look
How you configure scraping depends on how Prometheus was installed.
Option 1: Prometheus Operator (ServiceMonitor)
If you installed Prometheus using the
Prometheus Operator
or the kube-prometheus-stack Helm chart, the operator must be running
in your cluster before you create a ServiceMonitor. The release label
must match the label selector configured on your Prometheus resource —
kube-prometheus-stack is the default for a standard Helm install:
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
 name: my-exporter
 namespace: monitoring
 labels:
 release: kube-prometheus-stack
spec:
 selector:
 matchLabels:
 app.kubernetes.io/name: my-exporter
 endpoints:
 - port: metrics
 interval: 15s
 path: /metrics


Option 2: Annotation-based discovery
If your Prometheus uses annotation-based pod discovery instead, you will
need a matching scrape_config rule in your Prometheus configuration —
check with whoever manages your Prometheus installation to confirm it is
in place.
You can add the following two annotations to the Pod template regardless
of which scraping method you use. They are ignored by the Prometheus
Operator but picked up automatically by annotation-based setups:
annotations:
 prometheus.io/scrape: "true"
 prometheus.io/port: "8080" # omit if not using annotation-based discovery
 prometheus.io/path: "/metrics" # omit if not using annotation-based discovery


If you are unsure which setup your cluster uses, the ServiceMonitor
approach is more explicit and easier to debug.
Verifying the scrape
Port-forward to the Prometheus service and open the targets page to
confirm the exporter has been discovered:
kubectl port-forward svc/prometheus-operated 9090 -n monitoring


Navigate to http://localhost:9090/targets. The my-exporter target
should appear with state UP. If it shows DOWN, check that the
ServiceMonitor's release label matches and that the pod is running:
kubectl get pods -n monitoring -l app.kubernetes.io/name=my-exporter
kubectl describe servicemonitor my-exporter -n monitoring


Once the target is healthy, run a quick query in the expression browser
to confirm data is flowing:
rate(worker_jobs_processed_total{status="success"}[2m])

A non-zero result here means the full pipeline is working: your
application is producing data, Prometheus is scraping it, and the
time-series are stored and queryable.
What comes next
A working exporter is the foundation, not the destination. The natural
next step is surfacing these metrics to the
HorizontalPodAutoscaler
so that your workload scales on the signals that actually drive load,
not just CPU. That requires a metrics adapter — the Prometheus Adapter
is the most widely deployed option — which registers your custom metrics
with the Kubernetes Custom Metrics API. Once registered, any
HorizontalPodAutoscaler in the cluster can reference worker_queue_depth
or worker_jobs_processed_total directly in its metrics block.
For a walkthrough of that setup, see
Autoscaling on multiple metrics and custom metrics.
For a catalog of ready-made exporters covering databases, message
brokers, and cloud services, the
Prometheus exporters and integrations
page is a good starting point.
