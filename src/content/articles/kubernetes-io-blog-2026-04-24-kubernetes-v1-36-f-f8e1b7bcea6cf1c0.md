---
title: "Kubernetes v1.36: Fine-Grained Kubelet API Authorization Graduates to GA"
link: "https://kubernetes.io/blog/2026/04/24/kubernetes-v1-36-fine-grained-kubelet-authorization-ga/"
guid: "https://kubernetes.io/blog/2026/04/24/kubernetes-v1-36-fine-grained-kubelet-authorization-ga/"
pubDate: "2026-04-24T18:35:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "On behalf of Kubernetes SIG Auth and SIG Node, we are pleased to announce the\ngraduation of fine-grained kubelet API authorization to General Availability\n(GA) in Kubernetes v1.36!\nThe KubeletFineGrainedAuthz feature gate was introduced as an opt-in alpha\nfeature in Kubernetes v1.32, then graduated to beta (enabled by default) in\nv1.33. Now, the feature is generally available and the feature gate is locked\nto enabled. This feature enables more precise, least-privilege access control\nover the kubelet's HTTPS API, replacing the need to grant the overly broad\nnodes/proxy permission for common monitoring and observability use cases.\nMotivation: the nodes/proxy problem\nThe kubelet exposes an HTTPS endpoint with several APIs that give access to data\nof varying sensitivity, including pod listings, node metrics, container logs,\nand, critically, the ability to execute commands inside running containers.\nPrior to this feature, kubelet authorization used a coarse-grained model. When\nwebhook authorization was enabled, almost all kubelet API paths were mapped to a\nsingle nodes/proxy subresource. This meant that any workload needing to read\nmetrics or health status from the kubelet required nodes/proxy permission,\nthe same permission that also grants the ability to execute arbitrary commands\nin any container running on the node.\nWhat's wrong with that?\nGranting nodes/proxy to monitoring agents, log collectors, or health-checking\ntools violates the principle of least privilege. If any of those workloads were\ncompromised, an attacker would gain the ability to run commands in every\ncontainer on the node. The nodes/proxy permission is effectively a node-level\nsuperuser capability, and granting it broadly dramatically increases the blast\nradius of a security incident.\nThis problem has been well understood in the community for years (see\nkubernetes/kubernetes#83465),\nand was the driving motivation behind this enhancement KEP-2862.\nThe nodes/proxy GET WebSocket RCE risk\nThe situation is more severe than it might appear at first glance. Security\nresearchers demonstrated in early 2026\nthat nodes/proxy GET alone, which is the minimal read-only permission routinely\ngranted to monitoring tools, can be abused to execute commands in any pod on\nreachable nodes.\nThe root cause is a mismatch between how WebSocket connections work and how the\nkubelet maps HTTP methods to RBAC verbs. The\nWebSocket protocol (RFC 6455)\nrequires an HTTP GET request for the initial connection handshake. The kubelet\nmaps this GET to the RBAC get verb and authorizes the request without\nperforming a secondary check to confirm that CREATE permission is also present\nfor the write operation that follows. Using a WebSocket client like websocat,\nan attacker can reach the kubelet's /exec endpoint directly on port 10250 and\nexecute arbitrary commands:\nwebsocat --insecure \\\n --header \"Authorization: Bearer $TOKEN\" \\\n --protocol v4.channel.k8s.io \\\n \"wss://$NODE_IP:10250/exec/default/nginx/nginx?output=1&error=1&command=id\"\n\nuid=0(root) gid=0(root) groups=0(root)\n\n\nFine-grained kubelet authorization: how it works\nWith KubeletFineGrainedAuthz, the kubelet now performs an additional, more\nspecific authorization check before falling back to the nodes/proxy\nsubresource. Several commonly used kubelet API paths are mapped to their own\ndedicated subresources:\nkubelet API\nResource\nSubresource\n\n\n\n\n/stats/*\nnodes\nstats\n\n\n/metrics/*\nnodes\nmetrics\n\n\n/logs/*\nnodes\nlog\n\n\n/pods\nnodes\npods, proxy\n\n\n/runningPods/\nnodes\npods, proxy\n\n\n/healthz\nnodes\nhealthz, proxy\n\n\n/configz\nnodes\nconfigz, proxy\n\n\n/spec/*\nnodes\nspec\n\n\n/checkpoint/*\nnodes\ncheckpoint\n\n\nall others\nnodes\nproxy\n\n\n\nFor the endpoints that now have fine-grained subresources (/pods,\n/runningPods/, /healthz, /configz), the kubelet first sends a\nSubjectAccessReview for the specific subresource. If that check succeeds, the\nrequest is authorized. If it fails, the kubelet retries with the coarse-grained\nnodes/proxy subresource for backward compatibility.\nThis dual-check approach ensures a smooth migration path. Existing workloads\nwith nodes/proxy permissions continue to work, while new deployments can adopt\nleast-privilege access from day one.\nWhat this means in practice\nConsider a Prometheus node exporter or a monitoring DaemonSet that needs to\nscrape /metrics from the kubelet. Previously, you would need an RBAC\nClusterRole like this:\n# Old approach: overly broad\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n name: monitoring-agent\nrules:\n- apiGroups: [\"\"]\n resources: [\"nodes/proxy\"]\n verbs: [\"get\"]\n\n\nThis grants the monitoring agent far more access than it needs. With\nfine-grained authorization, you can now scope the permissions precisely:\n# New approach: least privilege\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n name: monitoring-agent\nrules:\n- apiGroups: [\"\"]\n resources: [\"nodes/metrics\", \"nodes/stats\"]\n verbs: [\"get\"]\n\n\nThe monitoring agent can now read metrics and stats from the kubelet without\never being able to execute commands in containers.\nUpdated system:kubelet-api-admin ClusterRole\nWhen RBAC authorization is enabled, the built-in system:kubelet-api-admin\nClusterRole is automatically updated to include permissions for all the new\nfine-grained subresources. This ensures that cluster administrators who already\nuse this role, including the API server's kubelet client, continue to have\nfull access without any manual configuration changes.\nThe role now includes permissions for:\nnodes/proxy\nnodes/stats\nnodes/metrics\nnodes/log\nnodes/spec\nnodes/checkpoint\nnodes/configz\nnodes/healthz\nnodes/pods\nUpgrade considerations\nBecause the kubelet performs a dual authorization check (fine-grained first,\nthen falling back to nodes/proxy), upgrading to v1.36 should be seamless for\nmost clusters:\nExisting workloads with nodes/proxy permissions continue to work without\nchanges. The fallback to nodes/proxy ensures backward compatibility.\nThe API server always has nodes/proxy permissions via\nsystem:kubelet-api-admin, so kube-apiserver-to-kubelet communication is\nunaffected regardless of feature gate state.\nMixed-version clusters are handled gracefully. If a kubelet supports\nfine-grained authorization but the API server does not (or vice versa),\nnodes/proxy permissions serve as the fallback.\nVerifying the feature is enabled\nYou can confirm that the feature is active on a given node by checking the\nkubelet metrics endpoint. Since the metrics endpoint on port 10250 requires\nauthorization, you'll first need to create appropriate RBAC bindings for the pod\nor ServiceAccount making the request.\nStep 1: Create a ServiceAccount and ClusterRole\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n name: kubelet-metrics-checker\n namespace: default\n---\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRole\nmetadata:\n name: kubelet-metrics-reader\nrules:\n- apiGroups: [\"\"]\n resources: [\"nodes/metrics\"]\n verbs: [\"get\"]\n\n\nStep 2: Bind the ClusterRole to the ServiceAccount\napiVersion: rbac.authorization.k8s.io/v1\nkind: ClusterRoleBinding\nmetadata:\n name: kubelet-metrics-checker\nsubjects:\n- kind: ServiceAccount\n name: kubelet-metrics-checker\n namespace: default\nroleRef:\n kind: ClusterRole\n name: kubelet-metrics-reader\n apiGroup: rbac.authorization.k8s.io\n\n\nApply both manifests:\nkubectl apply -f serviceaccount.yaml\nkubectl apply -f clusterrole.yaml\nkubectl apply -f clusterrolebinding.yaml\n\n\nStep 3: Run a pod with the ServiceAccount and check the feature flag\nkubectl run kubelet-check \\\n --image=curlimages/curl \\\n --serviceaccount=kubelet-metrics-checker \\\n --restart=Never \\\n --rm -it \\\n -- sh\n\n\nThen from within the pod, retrieve the node IP and query the metrics endpoint:\n# Get the token\nTOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)\n\n# Query the kubelet metrics and filter for the feature gate\ncurl -sk \\\n --header \"Authorization: Bearer $TOKEN\" \\\n https://$NODE_IP:10250/metrics \\\n | grep kubernetes_feature_enabled \\\n | grep KubeletFineGrainedAuthz\n\n\nIf the feature is enabled, you should see output like:\nkubernetes_feature_enabled{name=\"KubeletFineGrainedAuthz\",stage=\"GA\"} 1\n\n\nNote: Replace $NODE_IP with the IP address of the node you want to check.\nYou can retrieve node IPs with kubectl get nodes -o wide.\n\nThe journey from alpha to GA\n\n\n\nRelease\nStage\nDetails\n\n\n\n\nv1.32\nAlpha\nFeature gate KubeletFineGrainedAuthz introduced, disabled by default\n\n\nv1.33\nBeta\nEnabled by default; fine-grained checks for /pods, /runningPods/, /healthz, /configz\n\n\nv1.36\nGA\nFeature gate locked to enabled; fine-grained kubelet authorization is always active\n\n\n\nWhat's next?\nWith fine-grained kubelet authorization now GA, the Kubernetes community can\nbegin recommending and eventually enforcing the use of specific subresources\ninstead of nodes/proxy for monitoring and observability workloads. The urgency\nof this migration is underscored by\nresearch showing that nodes/proxy GET can be abused for unlogged remote code execution via the WebSocket protocol. This risk is present in the default RBAC\nconfigurations of dozens of widely deployed Helm charts. Over time, we expect:\nEcosystem adoption: Monitoring tools like Prometheus, Datadog agents, and\nother DaemonSets can update their default RBAC configurations to use\nnodes/metrics, nodes/stats, and nodes/pods instead of nodes/proxy. This\ndirectly eliminates the WebSocket RCE attack surface for those workloads.\nPolicy enforcement: Admission controllers and policy engines can flag or\nreject RBAC bindings that grant nodes/proxy when fine-grained alternatives\nexist, helping organizations adopt least-privilege access at scale.\nDeprecation path: As adoption grows, nodes/proxy may eventually be\ndeprecated for monitoring use cases, further reducing the attack surface of\nKubernetes clusters.\nGetting involved\nThis enhancement was driven by SIG Auth and SIG Node. If you are interested in\ncontributing to the security and authorization features of Kubernetes, please\njoin us:\nSIG Auth\nSIG Node\nSlack: #sig-auth and #sig-node\nKEP-2862: Fine-Grained Kubelet API Authorization\nWe look forward to hearing your feedback and experiences with this feature!"
contentHtml: "<p>On behalf of Kubernetes SIG Auth and SIG Node, we are pleased to announce the\ngraduation of fine-grained <code>kubelet</code> API authorization to General Availability\n(GA) in Kubernetes v1.36!</p>\n<p>The <code>KubeletFineGrainedAuthz</code> feature gate was introduced as an opt-in alpha\nfeature in Kubernetes v1.32, then graduated to beta (enabled by default) in\nv1.33. Now, the feature is generally available and the feature gate is locked\nto enabled. This feature enables more precise, least-privilege access control\nover the <code>kubelet</code>'s HTTPS API, replacing the need to grant the overly broad\n<code>nodes/proxy</code> permission for common monitoring and observability use cases.</p>\n<h2 id=\"motivation-the-nodes-proxy-problem\">Motivation: the <code>nodes/proxy</code> problem<a class=\"td-heading-self-link\" href=\"#motivation-the-nodes-proxy-problem\" aria-label=\"Heading self-link\"></a></h2><p>The <code>kubelet</code> exposes an HTTPS endpoint with several APIs that give access to data\nof varying sensitivity, including pod listings, node metrics, container logs,\nand, critically, the ability to execute commands inside running containers.</p>\n<p>Prior to this feature, <code>kubelet</code> authorization used a coarse-grained model. When\nwebhook authorization was enabled, almost all <code>kubelet</code> API paths were mapped to a\nsingle <code>nodes/proxy</code> subresource. This meant that any workload needing to read\nmetrics or health status from the <code>kubelet</code> required <code>nodes/proxy</code> permission,\nthe same permission that also grants the ability to execute arbitrary commands\nin any container running on the node.</p>\n<h3 id=\"what-s-wrong-with-that\">What's wrong with that?<a class=\"td-heading-self-link\" href=\"#what-s-wrong-with-that\" aria-label=\"Heading self-link\"></a></h3><p>Granting <code>nodes/proxy</code> to monitoring agents, log collectors, or health-checking\ntools violates the principle of least privilege. If any of those workloads were\ncompromised, an attacker would gain the ability to run commands in every\ncontainer on the node. The <code>nodes/proxy</code> permission is effectively a node-level\nsuperuser capability, and granting it broadly dramatically increases the blast\nradius of a security incident.</p>\n<p>This problem has been well understood in the community for years (see\n<a href=\"https://github.com/kubernetes/kubernetes/issues/83465\">kubernetes/kubernetes#83465</a>),\nand was the driving motivation behind this enhancement <a href=\"https://kep.k8s.io/2862\">KEP-2862</a>.</p>\n<h3 id=\"the-nodes-proxy-get-websocket-rce-risk\">The <code>nodes/proxy GET</code> WebSocket RCE risk<a class=\"td-heading-self-link\" href=\"#the-nodes-proxy-get-websocket-rce-risk\" aria-label=\"Heading self-link\"></a></h3><p>The situation is more severe than it might appear at first glance. Security\nresearchers <a href=\"https://grahamhelton.com/blog/nodes-proxy-rce\">demonstrated in early 2026</a>\nthat <code>nodes/proxy GET</code> alone, which is the minimal read-only permission routinely\ngranted to monitoring tools, can be abused to execute commands in any pod on\nreachable nodes.</p>\n<p>The root cause is a mismatch between how WebSocket connections work and how the\n<code>kubelet</code> maps HTTP methods to RBAC verbs. The\n<a href=\"https://datatracker.ietf.org/doc/html/rfc6455#section-1.2\">WebSocket protocol (RFC 6455)</a>\nrequires an HTTP <code>GET</code> request for the initial connection handshake. The <code>kubelet</code>\nmaps this <code>GET</code> to the RBAC <code>get</code> verb and authorizes the request without\nperforming a secondary check to confirm that <code>CREATE</code> permission is also present\nfor the write operation that follows. Using a WebSocket client like <code>websocat</code>,\nan attacker can reach the <code>kubelet</code>'s <code>/exec</code> endpoint directly on port 10250 and\nexecute arbitrary commands:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">websocat --insecure <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --header <span class=\"s2\">&#34;Authorization: Bearer </span><span class=\"nv\">$TOKEN</span><span class=\"s2\">&#34;</span> <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --protocol v4.channel.k8s.io <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> <span class=\"s2\">&#34;wss://</span><span class=\"nv\">$NODE_IP</span><span class=\"s2\">:10250/exec/default/nginx/nginx?output=1&amp;error=1&amp;command=id&#34;</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"nv\">uid</span><span class=\"o\">=</span>0<span class=\"o\">(</span>root<span class=\"o\">)</span> <span class=\"nv\">gid</span><span class=\"o\">=</span>0<span class=\"o\">(</span>root<span class=\"o\">)</span> <span class=\"nv\">groups</span><span class=\"o\">=</span>0<span class=\"o\">(</span>root<span class=\"o\">)</span>\n</span></span></code></pre></div><h2 id=\"fine-grained-kubelet-authorization-how-it-works\">Fine-grained <code>kubelet</code> authorization: how it works<a class=\"td-heading-self-link\" href=\"#fine-grained-kubelet-authorization-how-it-works\" aria-label=\"Heading self-link\"></a></h2><p>With <code>KubeletFineGrainedAuthz</code>, the <code>kubelet</code> now performs an additional, more\nspecific authorization check before falling back to the <code>nodes/proxy</code>\nsubresource. Several commonly used <code>kubelet</code> API paths are mapped to their own\ndedicated subresources:</p>\n<table>\n<thead>\n<tr>\n<th><code>kubelet</code> API</th>\n<th>Resource</th>\n<th>Subresource</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>/stats/*</code></td>\n<td>nodes</td>\n<td>stats</td>\n</tr>\n<tr>\n<td><code>/metrics/*</code></td>\n<td>nodes</td>\n<td>metrics</td>\n</tr>\n<tr>\n<td><code>/logs/*</code></td>\n<td>nodes</td>\n<td>log</td>\n</tr>\n<tr>\n<td><code>/pods</code></td>\n<td>nodes</td>\n<td>pods, proxy</td>\n</tr>\n<tr>\n<td><code>/runningPods/</code></td>\n<td>nodes</td>\n<td>pods, proxy</td>\n</tr>\n<tr>\n<td><code>/healthz</code></td>\n<td>nodes</td>\n<td>healthz, proxy</td>\n</tr>\n<tr>\n<td><code>/configz</code></td>\n<td>nodes</td>\n<td>configz, proxy</td>\n</tr>\n<tr>\n<td><code>/spec/*</code></td>\n<td>nodes</td>\n<td>spec</td>\n</tr>\n<tr>\n<td><code>/checkpoint/*</code></td>\n<td>nodes</td>\n<td>checkpoint</td>\n</tr>\n<tr>\n<td>all others</td>\n<td>nodes</td>\n<td>proxy</td>\n</tr>\n</tbody>\n</table>\n<p>For the endpoints that now have fine-grained subresources (<code>/pods</code>,\n<code>/runningPods/</code>, <code>/healthz</code>, <code>/configz</code>), the <code>kubelet</code> first sends a\n<code>SubjectAccessReview</code> for the specific subresource. If that check succeeds, the\nrequest is authorized. If it fails, the <code>kubelet</code> retries with the coarse-grained\n<code>nodes/proxy</code> subresource for backward compatibility.</p>\n<p>This dual-check approach ensures a smooth migration path. Existing workloads\nwith <code>nodes/proxy</code> permissions continue to work, while new deployments can adopt\nleast-privilege access from day one.</p>\n<h2 id=\"what-this-means-in-practice\">What this means in practice<a class=\"td-heading-self-link\" href=\"#what-this-means-in-practice\" aria-label=\"Heading self-link\"></a></h2><p>Consider a Prometheus node exporter or a monitoring <code>DaemonSet</code> that needs to\nscrape <code>/metrics</code> from the <code>kubelet</code>. Previously, you would need an RBAC\n<code>ClusterRole</code> like this:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"c\"># Old approach: overly broad</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">rbac.authorization.k8s.io/v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">ClusterRole</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">monitoring-agent</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">rules</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span>- <span class=\"nt\">apiGroups</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">resources</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;nodes/proxy&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">verbs</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;get&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span></code></pre></div><p>This grants the monitoring agent far more access than it needs. With\nfine-grained authorization, you can now scope the permissions precisely:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"c\"># New approach: least privilege</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">rbac.authorization.k8s.io/v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">ClusterRole</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">monitoring-agent</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">rules</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span>- <span class=\"nt\">apiGroups</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">resources</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;nodes/metrics&#34;</span><span class=\"p\">,</span><span class=\"w\"> </span><span class=\"s2\">&#34;nodes/stats&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">verbs</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;get&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span></code></pre></div><p>The monitoring agent can now read metrics and stats from the <code>kubelet</code> without\never being able to execute commands in containers.</p>\n<h2 id=\"updated-system-kubelet-api-admin-clusterrole\">Updated <code>system:kubelet-api-admin</code> <code>ClusterRole</code><a class=\"td-heading-self-link\" href=\"#updated-system-kubelet-api-admin-clusterrole\" aria-label=\"Heading self-link\"></a></h2><p>When RBAC authorization is enabled, the built-in <code>system:kubelet-api-admin</code>\n<code>ClusterRole</code> is automatically updated to include permissions for all the new\nfine-grained subresources. This ensures that cluster administrators who already\nuse this role, including the API server's <code>kubelet</code> client, continue to have\nfull access without any manual configuration changes.</p>\n<p>The role now includes permissions for:</p>\n<ul>\n<li><code>nodes/proxy</code></li>\n<li><code>nodes/stats</code></li>\n<li><code>nodes/metrics</code></li>\n<li><code>nodes/log</code></li>\n<li><code>nodes/spec</code></li>\n<li><code>nodes/checkpoint</code></li>\n<li><code>nodes/configz</code></li>\n<li><code>nodes/healthz</code></li>\n<li><code>nodes/pods</code></li>\n</ul>\n<h2 id=\"upgrade-considerations\">Upgrade considerations<a class=\"td-heading-self-link\" href=\"#upgrade-considerations\" aria-label=\"Heading self-link\"></a></h2><p>Because the <code>kubelet</code> performs a dual authorization check (fine-grained first,\nthen falling back to <code>nodes/proxy</code>), upgrading to v1.36 should be seamless for\nmost clusters:</p>\n<ul>\n<li><strong>Existing workloads</strong> with <code>nodes/proxy</code> permissions continue to work without\nchanges. The fallback to <code>nodes/proxy</code> ensures backward compatibility.</li>\n<li><strong>The API server</strong> always has <code>nodes/proxy</code> permissions via\n<code>system:kubelet-api-admin</code>, so <code>kube-apiserver</code>-to-<code>kubelet</code> communication is\nunaffected regardless of feature gate state.</li>\n<li><strong>Mixed-version clusters</strong> are handled gracefully. If a <code>kubelet</code> supports\nfine-grained authorization but the API server does not (or vice versa),\n<code>nodes/proxy</code> permissions serve as the fallback.</li>\n</ul>\n<h2 id=\"verifying-the-feature-is-enabled\">Verifying the feature is enabled<a class=\"td-heading-self-link\" href=\"#verifying-the-feature-is-enabled\" aria-label=\"Heading self-link\"></a></h2><p>You can confirm that the feature is active on a given node by checking the\n<code>kubelet</code> metrics endpoint. Since the metrics endpoint on port 10250 requires\nauthorization, you'll first need to create appropriate RBAC bindings for the pod\nor <code>ServiceAccount</code> making the request.</p>\n<p><strong>Step 1: Create a <code>ServiceAccount</code> and <code>ClusterRole</code></strong></p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">ServiceAccount</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">kubelet-metrics-checker</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">namespace</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">default</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nn\">---</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">rbac.authorization.k8s.io/v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">ClusterRole</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">kubelet-metrics-reader</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">rules</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span>- <span class=\"nt\">apiGroups</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">resources</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;nodes/metrics&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">verbs</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"p\">[</span><span class=\"s2\">&#34;get&#34;</span><span class=\"p\">]</span><span class=\"w\">\n</span></span></span></code></pre></div><p><strong>Step 2: Bind the <code>ClusterRole</code> to the <code>ServiceAccount</code></strong></p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-yaml\" data-lang=\"yaml\"><span class=\"line\"><span class=\"cl\"><span class=\"nt\">apiVersion</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">rbac.authorization.k8s.io/v1</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">ClusterRoleBinding</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">metadata</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">kubelet-metrics-checker</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">subjects</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span>- <span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">ServiceAccount</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">kubelet-metrics-checker</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">namespace</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">default</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"></span><span class=\"nt\">roleRef</span><span class=\"p\">:</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">kind</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">ClusterRole</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">name</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">kubelet-metrics-reader</span><span class=\"w\">\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"w\"> </span><span class=\"nt\">apiGroup</span><span class=\"p\">:</span><span class=\"w\"> </span><span class=\"l\">rbac.authorization.k8s.io</span><span class=\"w\">\n</span></span></span></code></pre></div><p>Apply both manifests:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">kubectl apply -f serviceaccount.yaml\n</span></span><span class=\"line\"><span class=\"cl\">kubectl apply -f clusterrole.yaml\n</span></span><span class=\"line\"><span class=\"cl\">kubectl apply -f clusterrolebinding.yaml\n</span></span></code></pre></div><p><strong>Step 3: Run a pod with the <code>ServiceAccount</code> and check the feature flag</strong></p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">kubectl run kubelet-check <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --image<span class=\"o\">=</span>curlimages/curl <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --serviceaccount<span class=\"o\">=</span>kubelet-metrics-checker <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --restart<span class=\"o\">=</span>Never <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --rm -it <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> -- sh\n</span></span></code></pre></div><p>Then from within the pod, retrieve the node IP and query the metrics endpoint:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\"><span class=\"c1\"># Get the token</span>\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"nv\">TOKEN</span><span class=\"o\">=</span><span class=\"k\">$(</span>cat /var/run/secrets/kubernetes.io/serviceaccount/token<span class=\"k\">)</span>\n</span></span><span class=\"line\"><span class=\"cl\">\n</span></span><span class=\"line\"><span class=\"cl\"><span class=\"c1\"># Query the kubelet metrics and filter for the feature gate</span>\n</span></span><span class=\"line\"><span class=\"cl\">curl -sk <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --header <span class=\"s2\">&#34;Authorization: Bearer </span><span class=\"nv\">$TOKEN</span><span class=\"s2\">&#34;</span> <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> https://<span class=\"nv\">$NODE_IP</span>:10250/metrics <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> <span class=\"p\">|</span> grep kubernetes_feature_enabled <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> <span class=\"p\">|</span> grep KubeletFineGrainedAuthz\n</span></span></code></pre></div><p>If the feature is enabled, you should see output like:</p>\n<pre tabindex=\"0\"><code>kubernetes_feature_enabled{name=&#34;KubeletFineGrainedAuthz&#34;,stage=&#34;GA&#34;} 1\n</code></pre><blockquote>\n<p><strong>Note:</strong> Replace <code>$NODE_IP</code> with the IP address of the node you want to check.\nYou can retrieve node IPs with <code>kubectl get nodes -o wide</code>.</p></blockquote>\n<h2 id=\"the-journey-from-alpha-to-ga\">The journey from alpha to GA<a class=\"td-heading-self-link\" href=\"#the-journey-from-alpha-to-ga\" aria-label=\"Heading self-link\"></a></h2><table>\n<thead>\n<tr>\n<th>Release</th>\n<th>Stage</th>\n<th>Details</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>v1.32</td>\n<td>Alpha</td>\n<td>Feature gate <code>KubeletFineGrainedAuthz</code> introduced, disabled by default</td>\n</tr>\n<tr>\n<td>v1.33</td>\n<td>Beta</td>\n<td>Enabled by default; fine-grained checks for <code>/pods</code>, <code>/runningPods/</code>, <code>/healthz</code>, <code>/configz</code></td>\n</tr>\n<tr>\n<td>v1.36</td>\n<td>GA</td>\n<td>Feature gate locked to enabled; fine-grained <code>kubelet</code> authorization is always active</td>\n</tr>\n</tbody>\n</table>\n<h2 id=\"what-s-next\">What's next?<a class=\"td-heading-self-link\" href=\"#what-s-next\" aria-label=\"Heading self-link\"></a></h2><p>With fine-grained <code>kubelet</code> authorization now GA, the Kubernetes community can\nbegin recommending and eventually enforcing the use of specific subresources\ninstead of <code>nodes/proxy</code> for monitoring and observability workloads. The urgency\nof this migration is underscored by\n<a href=\"https://grahamhelton.com/blog/nodes-proxy-rce\">research showing that <code>nodes/proxy GET</code> can be abused for unlogged remote code execution</a> via the WebSocket protocol. This risk is present in the default RBAC\nconfigurations of dozens of widely deployed Helm charts. Over time, we expect:</p>\n<ul>\n<li><strong>Ecosystem adoption:</strong> Monitoring tools like Prometheus, Datadog agents, and\nother <code>DaemonSets</code> can update their default RBAC configurations to use\n<code>nodes/metrics</code>, <code>nodes/stats</code>, and <code>nodes/pods</code> instead of <code>nodes/proxy</code>. This\ndirectly eliminates the WebSocket RCE attack surface for those workloads.</li>\n<li><strong>Policy enforcement:</strong> Admission controllers and policy engines can flag or\nreject RBAC bindings that grant <code>nodes/proxy</code> when fine-grained alternatives\nexist, helping organizations adopt least-privilege access at scale.</li>\n<li><strong>Deprecation path:</strong> As adoption grows, <code>nodes/proxy</code> may eventually be\ndeprecated for monitoring use cases, further reducing the attack surface of\nKubernetes clusters.</li>\n</ul>\n<h2 id=\"getting-involved\">Getting involved<a class=\"td-heading-self-link\" href=\"#getting-involved\" aria-label=\"Heading self-link\"></a></h2><p>This enhancement was driven by SIG Auth and SIG Node. If you are interested in\ncontributing to the security and authorization features of Kubernetes, please\njoin us:</p>\n<ul>\n<li><a href=\"https://github.com/kubernetes/community/tree/master/sig-auth\">SIG Auth</a></li>\n<li><a href=\"https://github.com/kubernetes/community/tree/master/sig-node\">SIG Node</a></li>\n<li>Slack: <code>#sig-auth</code> and <code>#sig-node</code></li>\n<li><a href=\"https://github.com/kubernetes/enhancements/issues/2862\">KEP-2862: Fine-Grained Kubelet API Authorization</a></li>\n</ul>\n<p>We look forward to hearing your feedback and experiences with this feature!</p>"
---

On behalf of Kubernetes SIG Auth and SIG Node, we are pleased to announce the
graduation of fine-grained kubelet API authorization to General Availability
(GA) in Kubernetes v1.36!
The KubeletFineGrainedAuthz feature gate was introduced as an opt-in alpha
feature in Kubernetes v1.32, then graduated to beta (enabled by default) in
v1.33. Now, the feature is generally available and the feature gate is locked
to enabled. This feature enables more precise, least-privilege access control
over the kubelet's HTTPS API, replacing the need to grant the overly broad
nodes/proxy permission for common monitoring and observability use cases.
Motivation: the nodes/proxy problem
The kubelet exposes an HTTPS endpoint with several APIs that give access to data
of varying sensitivity, including pod listings, node metrics, container logs,
and, critically, the ability to execute commands inside running containers.
Prior to this feature, kubelet authorization used a coarse-grained model. When
webhook authorization was enabled, almost all kubelet API paths were mapped to a
single nodes/proxy subresource. This meant that any workload needing to read
metrics or health status from the kubelet required nodes/proxy permission,
the same permission that also grants the ability to execute arbitrary commands
in any container running on the node.
What's wrong with that?
Granting nodes/proxy to monitoring agents, log collectors, or health-checking
tools violates the principle of least privilege. If any of those workloads were
compromised, an attacker would gain the ability to run commands in every
container on the node. The nodes/proxy permission is effectively a node-level
superuser capability, and granting it broadly dramatically increases the blast
radius of a security incident.
This problem has been well understood in the community for years (see
kubernetes/kubernetes#83465),
and was the driving motivation behind this enhancement KEP-2862.
The nodes/proxy GET WebSocket RCE risk
The situation is more severe than it might appear at first glance. Security
researchers demonstrated in early 2026
that nodes/proxy GET alone, which is the minimal read-only permission routinely
granted to monitoring tools, can be abused to execute commands in any pod on
reachable nodes.
The root cause is a mismatch between how WebSocket connections work and how the
kubelet maps HTTP methods to RBAC verbs. The
WebSocket protocol (RFC 6455)
requires an HTTP GET request for the initial connection handshake. The kubelet
maps this GET to the RBAC get verb and authorizes the request without
performing a secondary check to confirm that CREATE permission is also present
for the write operation that follows. Using a WebSocket client like websocat,
an attacker can reach the kubelet's /exec endpoint directly on port 10250 and
execute arbitrary commands:
websocat --insecure \
 --header "Authorization: Bearer $TOKEN" \
 --protocol v4.channel.k8s.io \
 "wss://$NODE_IP:10250/exec/default/nginx/nginx?output=1&error=1&command=id"

uid=0(root) gid=0(root) groups=0(root)


Fine-grained kubelet authorization: how it works
With KubeletFineGrainedAuthz, the kubelet now performs an additional, more
specific authorization check before falling back to the nodes/proxy
subresource. Several commonly used kubelet API paths are mapped to their own
dedicated subresources:
kubelet API
Resource
Subresource




/stats/*
nodes
stats


/metrics/*
nodes
metrics


/logs/*
nodes
log


/pods
nodes
pods, proxy


/runningPods/
nodes
pods, proxy


/healthz
nodes
healthz, proxy


/configz
nodes
configz, proxy


/spec/*
nodes
spec


/checkpoint/*
nodes
checkpoint


all others
nodes
proxy



For the endpoints that now have fine-grained subresources (/pods,
/runningPods/, /healthz, /configz), the kubelet first sends a
SubjectAccessReview for the specific subresource. If that check succeeds, the
request is authorized. If it fails, the kubelet retries with the coarse-grained
nodes/proxy subresource for backward compatibility.
This dual-check approach ensures a smooth migration path. Existing workloads
with nodes/proxy permissions continue to work, while new deployments can adopt
least-privilege access from day one.
What this means in practice
Consider a Prometheus node exporter or a monitoring DaemonSet that needs to
scrape /metrics from the kubelet. Previously, you would need an RBAC
ClusterRole like this:
# Old approach: overly broad
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
 name: monitoring-agent
rules:
- apiGroups: [""]
 resources: ["nodes/proxy"]
 verbs: ["get"]


This grants the monitoring agent far more access than it needs. With
fine-grained authorization, you can now scope the permissions precisely:
# New approach: least privilege
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
 name: monitoring-agent
rules:
- apiGroups: [""]
 resources: ["nodes/metrics", "nodes/stats"]
 verbs: ["get"]


The monitoring agent can now read metrics and stats from the kubelet without
ever being able to execute commands in containers.
Updated system:kubelet-api-admin ClusterRole
When RBAC authorization is enabled, the built-in system:kubelet-api-admin
ClusterRole is automatically updated to include permissions for all the new
fine-grained subresources. This ensures that cluster administrators who already
use this role, including the API server's kubelet client, continue to have
full access without any manual configuration changes.
The role now includes permissions for:
nodes/proxy
nodes/stats
nodes/metrics
nodes/log
nodes/spec
nodes/checkpoint
nodes/configz
nodes/healthz
nodes/pods
Upgrade considerations
Because the kubelet performs a dual authorization check (fine-grained first,
then falling back to nodes/proxy), upgrading to v1.36 should be seamless for
most clusters:
Existing workloads with nodes/proxy permissions continue to work without
changes. The fallback to nodes/proxy ensures backward compatibility.
The API server always has nodes/proxy permissions via
system:kubelet-api-admin, so kube-apiserver-to-kubelet communication is
unaffected regardless of feature gate state.
Mixed-version clusters are handled gracefully. If a kubelet supports
fine-grained authorization but the API server does not (or vice versa),
nodes/proxy permissions serve as the fallback.
Verifying the feature is enabled
You can confirm that the feature is active on a given node by checking the
kubelet metrics endpoint. Since the metrics endpoint on port 10250 requires
authorization, you'll first need to create appropriate RBAC bindings for the pod
or ServiceAccount making the request.
Step 1: Create a ServiceAccount and ClusterRole
apiVersion: v1
kind: ServiceAccount
metadata:
 name: kubelet-metrics-checker
 namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
 name: kubelet-metrics-reader
rules:
- apiGroups: [""]
 resources: ["nodes/metrics"]
 verbs: ["get"]


Step 2: Bind the ClusterRole to the ServiceAccount
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
 name: kubelet-metrics-checker
subjects:
- kind: ServiceAccount
 name: kubelet-metrics-checker
 namespace: default
roleRef:
 kind: ClusterRole
 name: kubelet-metrics-reader
 apiGroup: rbac.authorization.k8s.io


Apply both manifests:
kubectl apply -f serviceaccount.yaml
kubectl apply -f clusterrole.yaml
kubectl apply -f clusterrolebinding.yaml


Step 3: Run a pod with the ServiceAccount and check the feature flag
kubectl run kubelet-check \
 --image=curlimages/curl \
 --serviceaccount=kubelet-metrics-checker \
 --restart=Never \
 --rm -it \
 -- sh


Then from within the pod, retrieve the node IP and query the metrics endpoint:
# Get the token
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)

# Query the kubelet metrics and filter for the feature gate
curl -sk \
 --header "Authorization: Bearer $TOKEN" \
 https://$NODE_IP:10250/metrics \
 | grep kubernetes_feature_enabled \
 | grep KubeletFineGrainedAuthz


If the feature is enabled, you should see output like:
kubernetes_feature_enabled{name="KubeletFineGrainedAuthz",stage="GA"} 1


Note: Replace $NODE_IP with the IP address of the node you want to check.
You can retrieve node IPs with kubectl get nodes -o wide.

The journey from alpha to GA



Release
Stage
Details




v1.32
Alpha
Feature gate KubeletFineGrainedAuthz introduced, disabled by default


v1.33
Beta
Enabled by default; fine-grained checks for /pods, /runningPods/, /healthz, /configz


v1.36
GA
Feature gate locked to enabled; fine-grained kubelet authorization is always active



What's next?
With fine-grained kubelet authorization now GA, the Kubernetes community can
begin recommending and eventually enforcing the use of specific subresources
instead of nodes/proxy for monitoring and observability workloads. The urgency
of this migration is underscored by
research showing that nodes/proxy GET can be abused for unlogged remote code execution via the WebSocket protocol. This risk is present in the default RBAC
configurations of dozens of widely deployed Helm charts. Over time, we expect:
Ecosystem adoption: Monitoring tools like Prometheus, Datadog agents, and
other DaemonSets can update their default RBAC configurations to use
nodes/metrics, nodes/stats, and nodes/pods instead of nodes/proxy. This
directly eliminates the WebSocket RCE attack surface for those workloads.
Policy enforcement: Admission controllers and policy engines can flag or
reject RBAC bindings that grant nodes/proxy when fine-grained alternatives
exist, helping organizations adopt least-privilege access at scale.
Deprecation path: As adoption grows, nodes/proxy may eventually be
deprecated for monitoring use cases, further reducing the attack surface of
Kubernetes clusters.
Getting involved
This enhancement was driven by SIG Auth and SIG Node. If you are interested in
contributing to the security and authorization features of Kubernetes, please
join us:
SIG Auth
SIG Node
Slack: #sig-auth and #sig-node
KEP-2862: Fine-Grained Kubelet API Authorization
We look forward to hearing your feedback and experiences with this feature!
