---
title: "Kubernetes Dashboard to Headlamp: A Step-by-Step Guide"
link: "https://kubernetes.io/blog/2026/07/13/kubernetes-dashboard-to-headlamp/"
guid: "https://kubernetes.io/blog/2026/07/13/kubernetes-dashboard-to-headlamp/"
pubDate: "2026-07-13T18:00:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "1. Before you start: know what is changing\nKubernetes Dashboard and Headlamp both show what is running in a cluster, but they work differently. When Headlamp runs on the desktop, it uses your existing kubeconfig to connect to one or more clusters and can be extended with plugins. When Headlamp runs inside a cluster, it uses a Kubernetes ServiceAccount to access the API and follow RBAC rules. Kubernetes Dashboard, in contrast, only runs in-cluster and always relies on service account tokens. Understanding these models early helps you choose the right setup and permissions.\n1.1 How Kubernetes Dashboard works\nDashboard is a web app that runs inside your cluster.\nYou install it in the cluster, often with Helm.\nYou usually run one Dashboard per cluster.\nYou often reach it with kubectl port-forward or an ingress.\nYou log in with a Bearer token. That token is often from a service account.\nIt includes forms that help you create resources.\nIt leans on tables and lists for navigation.\nIt feels like this: a UI that lives with the cluster.\n1.2 How Headlamp works\nHeadlamp acts more like a Kubernetes client with a UI.\nIt can run on your desktop or in a cluster.\nIt reads your kubeconfig, like kubectl does.\nIt can show more than one cluster in one place.\nIt favors YAML when you create or change resources.\nIt includes list views and a visual map.\nYou can add features with plugins.\nHeadlamp is a UI that follows your identity, not your cluster.\n1.3 What stays the same\nMany workflows will feel familiar:\nBrowse workloads and resources\nFilter by namespace\nInspect YAML, events, and status\nView logs\nTake actions your RBAC allows\n1.4 What changes\nA few things will feel different:\nLogin shifts from pasted tokens to kubeconfig (and sometimes SSO).\nCreation shifts from forms to \"apply YAML.\"\nMulti-cluster becomes normal, not a special case.\nThe map view helps you see how resources connect.\n2. Pre-migration checklist\nThis checklist helps you avoid surprises during the switch. It makes sure Headlamp can use the same identity and permissions you already trust in Kubernetes. It also gives you a quick way to prove the migration worked before you turn off Dashboard.\n2.1 Write down what you use today\nList the basics:\nWhich clusters you use (dev, staging, prod)\nWhich namespaces you touch most\nWhat you do most often (view, edit, scale, delete, debug)\nHow you access Dashboard today (port-forward or ingress)\nHow you log in (service account token, and which RBAC bindings)\nThis is your baseline.\n2.2 Check that kubeconfig works\nHeadlamp uses kubeconfig, especially on desktop. Make sure yours works before you install anything.\nRun:\nkubectl config current-context\n\n\nThen try:\nkubectl get nodes\n\n\nIf you cannot list nodes, test in a namespace you can access:\nkubectl get pods -n <namespace>\n\n\nIf these work, Headlamp can use the same identity and RBAC.\n2.3 Pick a rollout plan\nThere is no need to rush. Most teams choose one of these:\nParallel rollout (recommended)\nInstall Headlamp\nLet people try it\nKeep Dashboard for a short time\nRemove Dashboard after the team is ready\nCutover\nInstall Headlamp\nSwitch docs and links\nRemove Dashboard soon after\nParallel rollout is safer for shared clusters.\n2.4 Decide where Headlamp will run\nYou can use either option. Many teams use both.\nDesktop\nUses your kubeconfig\nUses no cluster resources\nNo port-forward needed\nMulti-cluster works out of the box\nIn-cluster\nWorks well for shared, browser access\nCan be managed like other cluster apps\nOften paired with ingress and SSO\n2.5 Note optional dependencies\nThese are common. You can handle them later.\nmetrics-server (for CPU and memory graphs)\ningress (for an in-cluster URL)\nOIDC / SSO (for browser sign-in)\ncleanup of old Dashboard service accounts and RBAC\n3. Choose where Headlamp will run (desktop or in-cluster)\nHeadlamp can run on your desktop or inside a cluster. Both work well, but they fit different needs. Desktop is the fastest way to start because it uses your kubeconfig and does not run in the cluster. In-cluster is best when you need a shared URL and want the platform team to manage upgrades and access.\nOption A: Desktop (user-managed)\nDesktop Headlamp runs on each user's machine. It reads the same kubeconfig you use with kubectl. This keeps access tied to each user's identity and RBAC.\nWhy teams pick it\nNo in-cluster service to deploy or expose.\nIt uses no cluster CPU or memory.\nIt uses your kubeconfig and RBAC.\nIt works with many clusters in one app.\nYou do not need port-forward for day-to-day use.\nOption B: In-cluster (best for shared access)\nIn-cluster Headlamp is installed as a Kubernetes workload (often via Helm). This lets cluster admins manage it like other in-cluster apps.\nCluster admins manage install, upgrades, and configuration through the Helm chart and standard Kubernetes tooling.\nAdmins control ingress and can set up OIDC login for shared access.\nIt supports shared use in team environments.\n4. Install Headlamp (desktop and in-cluster)\nThis section gets Headlamp running. Follow the path you chose in Section 3.\n4.1 Desktop install (fastest way to start)\nInstall Headlamp on your machine. Then open it like any other app. Headlamp reads your kubeconfig and uses the same identity and RBAC rules as kubectl.\nWindows\nInstall with WinGet:\nwinget install headlamp\n\n\nOr with Chocolatey:\nchoco install headlamp\n\n\nmacOS\nInstall with Homebrew:\nbrew install --cask headlamp\n\n\nLinux\nInstall with Flatpak (Flathub):\nflatpak install flathub io.kinvolk.Headlamp\n\n\nQuick check\nLaunch Headlamp.\nConfirm you can see a cluster context.\nOpen a namespace you can access and confirm you can list workloads. Headlamp will only show actions your RBAC allows.\n4.2 In-cluster install (shared access)\nUse this path when you want a shared UI that the platform team can manage. Headlamp supports in-cluster deployment with Helm or a YAML manifest.\nInstall with Helm\nAdd the repo and update:\nhelm repo add headlamp https://kubernetes-sigs.github.io/headlamp/\nhelm repo update\n\n\nCreate a namespace (example):\nkubectl create namespace headlamp\n\n\nInstall the chart:\nhelm install headlamp headlamp/headlamp --namespace headlamp\n\n\nInstall with a YAML manifest (optional)\nHeadlamp also provides a YAML manifest you can apply and then adjust to your needs.\nCheck the install\nConfirm the pod is running:\nkubectl get pods -n headlamp\n\n\nConfirm the service exists:\nkubectl get svc -n headlamp\n\n\nAccess it (two common ways)\nQuick test with port-forward\nThis is the fastest way to verify the service works:\nkubectl port-forward -n headlamp svc/headlamp 8080:80\n\n\nThen open: http://localhost:8080\nShared access with ingress\nIf you want a stable URL, expose the service through your ingress controller. Your exact ingress YAML depends on your setup. Headlamp's OIDC callback URL is your public URL plus /oidc-callback, so ingress and TLS settings matter.\n4.3 Updating Headlamp\nUpdates depend on how you installed Headlamp. Package managers upgrade in place. DMG or EXE installs update by reinstalling the newer download.\nmacOS\nIf you installed with Homebrew, run:\nbrew upgrade headlamp\n\n\nIf you installed from a DMG, download the newest DMG and drag Headlamp into /Applications, replacing the old version. DMG installs do not auto upgrade.\nWindows\nIf you installed with WinGet, run:\nwinget upgrade headlamp\n\n\nIf you installed with Chocolatey, run:\nchoco upgrade headlamp\n\n\nIf you installed from the EXE, download the newest installer and run it again. EXE installs do not auto upgrade.\nLinux\nIf you installed with Flatpak, run:\nflatpak update io.kinvolk.Headlamp\n\n\nIf you installed with AppImage, download the newest AppImage and run that file instead.\nIf you installed with a tarball, download the newest tarball, extract it, and run the new headlamp binary.\n4.4 Notes for in-cluster access (keep it safe)\nTreat an in-cluster UI like any other cluster-facing service. Use TLS, lock down who can reach it, and rely on Kubernetes auth and RBAC to control what users can do.\n5. Authentication and RBAC\nHeadlamp uses the Kubernetes API the same way kubectl does. Your cluster still decides who can do what. Headlamp only shows actions your identity is allowed to take.\nThis section covers two setups: desktop and in-cluster.\n5.1 Desktop: use kubeconfig\nOn desktop, Headlamp reads your kubeconfig and uses the same credentials you use with kubectl. There is no separate token login flow to manage.\nStep 1: Confirm your kubeconfig works\nRun:\nkubectl config current-context\n\n\nThen test access:\nkubectl get nodes\n\n\nIf you cannot list nodes, test a namespace you can access:\nkubectl get pods -n <namespace>\n\n\nIf these commands work, your kubeconfig and credentials are valid for Headlamp too.\nStep 2: Point Headlamp at the right kubeconfig (if needed)\nHeadlamp can use the default kubeconfig path. It can also use a custom file path. You can set KUBECONFIG to choose a specific file.\nExample:\nKUBECONFIG=/path/to/config headlamp\n\n\nYou can also use more than one kubeconfig file at once. On Unix systems, separate paths with :. On Windows, separate paths with ;.\nWhat to expect in the UI\nHeadlamp adapts to your RBAC permissions. If you do not have permission to edit or delete a resource, Headlamp will not offer those actions.\n5.2 In-cluster: shared access needs a sign-in plan\nIn-cluster Headlamp is shared by many users. You need a clear plan for sign-in and access. Headlamp supports OpenID Connect (OIDC) for a \"Sign in\" flow.\nYou will usually choose one of these patterns:\nA. Configure Headlamp with OIDC (built-in).\nB. Put an auth layer in front of Headlamp (common in enterprises).\nA. Built-in OIDC (Headlamp)\nTo use OIDC, Headlamp needs:\nClient ID\nClient secret\nIssuer URL\n(Optional) scopes\nYour OIDC provider must also allow Headlamp's callback URL. The callback is your Headlamp URL plus:\n/oidc-callback\nExample:\nhttps://headlamp.example.com/oidc-callback\nIngress note\nIf Headlamp is behind an ingress or load balancer, make sure it forwards X-Forwarded-Proto. If it does not, Headlamp may generate an http callback URL instead of https. That can break login.\nB. Auth layer in front of Headlamp\nSome teams protect Headlamp with an identity-aware proxy or a platform auth system. This keeps sign-in consistent across tools. Headlamp docs include an example using OpenUnison, which can deploy Headlamp with hardened defaults and integrate with identity providers.\n5.3 RBAC: keep it least privilege\nKubernetes security starts with API authentication and authorization (RBAC). Headlamp respects those rules.\nPractical guidance:\nStart with the lowest permissions that still let users do their job.\nIf Dashboard used a high-privilege service account token, plan to remove or tighten that access after the move.\nFor in-cluster, treat the UI like any other endpoint. Use TLS and limit network access.\n5.4 Quick troubleshooting\nDesktop: \"I do not see my cluster\"\nYour kubeconfig may not be in the default location. Point Headlamp to the file with KUBECONFIG or a file path.\nIn-cluster: \"OIDC login fails after redirect\"\nConfirm your provider allows https://YOUR_URL/oidc-callback. If you use ingress, make sure it forwards X-Forwarded-Proto.\n6. Manage multiple clusters\nKubernetes Dashboard is usually tied to one cluster at a time. Headlamp is built for multi-cluster work. It is a client that follows your kubeconfig, not a single cluster install. That means you can keep one UI open and switch clusters as you work.\nClusters come from your kubeconfig\nHeadlamp reads clusters from your kubeconfig files. That means the clusters you can access with kubectl can also show up in Headlamp.\nSwitch clusters in the UI\nOnce Headlamp loads your kubeconfig, you can switch clusters using the cluster selector. This makes it easier to move between dev, staging, and prod without changing tools.\nOptional: use more than one kubeconfig file\nIf you keep separate kubeconfig files, you can load them together. Headlamp supports multiple kubeconfig paths in KUBECONFIG.\nUnix/macOS/Linux (: separator):\nKUBECONFIG=~/.kube/dev:~/.kube/prod headlamp\n\n\nWindows (; separator):\n$env:KUBECONFIG=\"$HOME\\.kube\\dev;$HOME\\.kube\\prod\"\n\n\nOptional: add a cluster from inside Headlamp\nYou can also add clusters by loading additional kubeconfig files from the UI.\nPermissions stay the same\nMulti-cluster does not change security rules. Each cluster still enforces its own RBAC. Headlamp shows only what your identity can do in the selected cluster.\n7. Navigate and understand resources\nIf you used Kubernetes Dashboard, this part will feel familiar. Headlamp keeps the same core resource views, but makes it easier to move around and understand what is connected.\nFind resources in familiar places\nHeadlamp groups resources in a way that maps closely to Dashboard:\nWorkloads for Pods, Deployments, StatefulSets, and Jobs\nNetwork for Services and Ingress\nStorage for PersistentVolumes and Claims\nConfiguration for ConfigMaps and Secrets\nNodes for cluster infrastructure\nYou can filter by namespace at the top of the UI, just like in Dashboard.\nInspect and edit resources\nFrom any list, you can click into a resource to see details:\nStatus and conditions\nEvents\nLabels and annotations\nThe full YAML definition\nIf your RBAC allows it, you can edit YAML directly from the UI. If it does not, Headlamp shows the resource as read-only. This matches how kubectl behaves.\nUse search and filters to move faster\nHeadlamp adds faster search and filtering across lists. This helps when clusters or namespaces get large. You can narrow views without jumping between pages.\nUnderstand relationships with Map View\nDashboard mostly shows resources as lists. Headlamp also includes a Map View.\nMap View shows how resources relate to each other:\nDeployments\nReplicaSets\nPods\nServices\nThis helps when you are troubleshooting. Instead of clicking through several pages, you can see the connections at once. You can spot missing links or broken relationships faster.\nWhen to use lists vs Map View\n\nUse lists when you know what resource you are looking for.\nUse Map View when you are trying to understand why something is not working.\nBoth views work on the same data. You are just choosing how much context you want at that moment.\n8. Deploy applications with YAML\nThis is the biggest change for most Kubernetes Dashboard users. Dashboard relied on forms. Headlamp relies on manifests. The goal is not to slow you down. It is to align the UI with how Kubernetes is usually run in practice.\nFrom forms to manifests\nIn Kubernetes Dashboard, you often deployed an app by filling in a form:\ncontainer image\nreplicas\nservice type\nHeadlamp does not include the same wizard. Instead, it lets you apply YAML directly from the UI.\nThis matches how most teams deploy today:\nmanifests live in Git\nCI/CD applies them\nHelm or GitOps tools manage changes\nHeadlamp fits into that flow rather than replacing it.\nCreate resources using YAML\nTo deploy an application in Headlamp:\nSelect a cluster and namespace.\nClick Create.\nPaste or upload a YAML manifest.\nReview it.\nClick Apply.\nThe resource appears immediately in the UI.\nIf the manifest is not valid, Headlamp shows the same errors you would see from the Kubernetes API.\nGenerate YAML the easy way\nIf you miss the Dashboard wizard, you can still generate YAML quickly.\nFor example:\nkubectl create deployment nginx \\\n --image=nginx \\\n --dry-run=client \\\n -o yaml > nginx.yaml\n\n\nYou can edit the file if needed, then paste it into Headlamp and apply it.\nThis gives you a repeatable manifest instead of an object created only through a UI.\nWhat if you use Helm or GitOps?\nThat works well with Headlamp.\nInstall with Helm as usual.\nDeploy with GitOps pipelines as usual.\nUse Headlamp to view, inspect, and debug what is running.\nHeadlamp does not replace those tools. It gives you visibility into what they create.\nWhat to expect compared to Dashboard\n\nYou will not see a multi-step deploy form.\nYou will work more with YAML.\nYou gain clarity about what is actually applied to the cluster.\nThe same manifest can be reused in CI, Git, or other tools.\n9. Deploy and debug workloads\nOne of the main reasons people used Kubernetes Dashboard was day-to-day debugging. Headlamp covers the same tasks and adds a few useful upgrades.\nView logs\nYou can view pod logs directly in the UI.\nTo check logs:\nOpen Workloads.\nSelect Pods.\nClick a pod.\nOpen the Logs tab.\nIf the pod has more than one container, you can switch between containers. Logs stream live, which helps during rollouts or active incidents.\nExec into running pods\nHeadlamp also lets you open a shell inside a container.\nFrom a pod view:\nOpen the pod actions menu.\nChoose Terminal or Exec.\nThis opens an interactive session inside the container. It replaces the need to switch back to the terminal for quick checks.\nThis action follows RBAC rules. If you cannot run kubectl exec, Headlamp will not allow it either.\nCheck metrics and resource usage\nHeadlamp can show CPU and memory usage for pods and nodes. This works the same way it did in Dashboard.\nA few things to know:\nMetrics require metrics-server to be installed in the cluster.\nIf metrics are missing, Headlamp shows a clear notice.\nOnce metrics are available, usage appears on pod and node views.\nThis makes it easy to answer simple questions:\nIs this pod using too much memory?\nIs a node under pressure?\nView events when something goes wrong\nEvents are often the fastest way to understand failures.\nIn Headlamp, you can:\nView events on resource detail pages.\nSee warnings and errors tied to pods, nodes, or deployments.\nThis is often the first place to look when a workload is stuck or crashes.\nHow this compares to Dashboard\nWhat stays the same:\nLog viewing\nEvent inspection\nRBAC-aware actions\nWhat improves:\nBuilt-in exec sessions\nClearer layout and filtering\nFewer context switches between UI and CLI\n10. Remove Kubernetes Dashboard\nAfter Headlamp is working and your team is comfortable using it, you can remove Kubernetes Dashboard. This is the final cleanup step.\nRemoving Dashboard reduces clutter and avoids keeping unused access paths around.\nConfirm Headlamp covers your needs\nBefore uninstalling anything, make sure:\nUsers can access the clusters they need in Headlamp.\nCommon tasks work:\n\nbrowse resources\ndeploy with YAML\nview logs and events\nexec into pods (if allowed)\nRBAC behaves as expected for different roles.\nOnce these checks pass, you are ready to remove Dashboard.\nUninstall the Dashboard\nIf you installed Kubernetes Dashboard with Helm, remove it with:\nhelm uninstall kubernetes-dashboard -n kubernetes-dashboard\n\n\nIf Dashboard was installed by a manifest or addon, remove it using the same method you used to install it.\nAfter removal, confirm the resources are gone:\nkubectl get pods -n kubernetes-dashboard\n\n\nClean up access artifacts (recommended)\nMany Dashboard setups used dedicated service accounts and cluster-wide roles.\nReview and remove anything that was created only for Dashboard access, such as:\nservice accounts\nrole bindings or cluster role bindings\nold documentation that points users to Dashboard URLs or port-forward commands\nThis reduces long-lived credentials and unused permissions.\nCommunicate the change\nMake sure your team knows:\nHeadlamp is now the primary Kubernetes UI.\nHow to access it (desktop or URL).\nWhere to go for help if something feels different.\n11. Post-migration checklist\nThis final checklist helps you confirm the migration is complete. It gives you confidence that Headlamp is working as expected and that nothing important was left behind.\nAccess and visibility\n\n Headlamp opens without errors.\n Users can access the correct clusters.\n Namespace filtering works as expected.\n Multi-cluster switching behaves correctly.\nAuthentication and RBAC\n\n Desktop users access clusters using kubeconfig.\n In-cluster users can sign in using the chosen auth method.\n Users only see actions their RBAC allows.\n No unexpected permission errors appear during normal use.\nCore workflows\n\n Resources load under Workloads, Network, and Configuration.\n YAML can be viewed and edited where permissions allow.\n Applications can be deployed using Create and YAML.\n Logs load correctly for running pods.\n Exec works for users who are allowed to use it.\n Metrics appear if metrics-server is installed.\nOperational confidence\n\n Teams can troubleshoot without switching tools.\n Map View helps explain relationships during debugging.\n Platform or DevOps teams know how Headlamp is installed and managed.\nCleanup confirmation\n\n Kubernetes Dashboard is no longer running.\n Dashboard-only service accounts and RBAC bindings are removed.\n Internal docs no longer reference Dashboard URLs or port-forward commands.\nTeam alignment\n\n The team knows Headlamp is the default Kubernetes UI.\n Onboarding docs point new users to Headlamp.\n There is a clear path for feedback or questions.\nYou've now completed the move from Kubernetes Dashboard to Headlamp. Your team can use the same Kubernetes access model, work across clusters, and rely on workflows that match how Kubernetes is used today. From here, Headlamp becomes your default UI, whether on the desktop or in shared environments. As your needs grow, you can keep using it as-is or extend it with plugins and new views over time.\nIf you want to help shape what comes next, join the Headlamp community and contribute at headlamp.dev."
contentHtml: "<h2 id=\"1-before-you-start-know-what-is-changing\">1. Before you start: know what is changing<a class=\"td-heading-self-link\" href=\"#1-before-you-start-know-what-is-changing\" aria-label=\"Heading self-link\"></a></h2><p>Kubernetes Dashboard and Headlamp both show what is running in a cluster, but they work differently. When Headlamp runs on the desktop, it uses your existing kubeconfig to connect to one or more clusters and can be extended with plugins. When Headlamp runs inside a cluster, it uses a Kubernetes ServiceAccount to access the API and follow RBAC rules. Kubernetes Dashboard, in contrast, only runs in-cluster and always relies on service account tokens. Understanding these models early helps you choose the right setup and permissions.</p>\n<h3 id=\"1-1-how-kubernetes-dashboard-works\">1.1 How Kubernetes Dashboard works<a class=\"td-heading-self-link\" href=\"#1-1-how-kubernetes-dashboard-works\" aria-label=\"Heading self-link\"></a></h3><p>Dashboard is a web app that runs inside your cluster.</p>\n<ul>\n<li>You install it in the cluster, often with Helm.</li>\n<li>You usually run one Dashboard per cluster.</li>\n<li>You often reach it with <code>kubectl port-forward</code> or an ingress.</li>\n<li>You log in with a Bearer token. That token is often from a service account.</li>\n<li>It includes forms that help you create resources.</li>\n<li>It leans on tables and lists for navigation.</li>\n</ul>\n<p>It feels like this: a UI that lives with the cluster.</p>\n<h3 id=\"1-2-how-headlamp-works\">1.2 How Headlamp works<a class=\"td-heading-self-link\" href=\"#1-2-how-headlamp-works\" aria-label=\"Heading self-link\"></a></h3><p>Headlamp acts more like a Kubernetes client with a UI.</p>\n<ul>\n<li>It can run on your desktop or in a cluster.</li>\n<li>It reads your kubeconfig, like kubectl does.</li>\n<li>It can show more than one cluster in one place.</li>\n<li>It favors YAML when you create or change resources.</li>\n<li>It includes list views and a visual map.</li>\n<li>You can add features with plugins.</li>\n</ul>\n<p>Headlamp is a UI that follows your identity, not your cluster.</p>\n<h3 id=\"1-3-what-stays-the-same\">1.3 What stays the same<a class=\"td-heading-self-link\" href=\"#1-3-what-stays-the-same\" aria-label=\"Heading self-link\"></a></h3><p>Many workflows will feel familiar:</p>\n<ul>\n<li>Browse workloads and resources</li>\n<li>Filter by namespace</li>\n<li>Inspect YAML, events, and status</li>\n<li>View logs</li>\n<li>Take actions your RBAC allows</li>\n</ul>\n<h3 id=\"1-4-what-changes\">1.4 What changes<a class=\"td-heading-self-link\" href=\"#1-4-what-changes\" aria-label=\"Heading self-link\"></a></h3><p>A few things will feel different:</p>\n<ul>\n<li>Login shifts from pasted tokens to kubeconfig (and sometimes SSO).</li>\n<li>Creation shifts from forms to &quot;apply YAML.&quot;</li>\n<li>Multi-cluster becomes normal, not a special case.</li>\n<li>The map view helps you see how resources connect.</li>\n</ul>\n<h2 id=\"2-pre-migration-checklist\">2. Pre-migration checklist<a class=\"td-heading-self-link\" href=\"#2-pre-migration-checklist\" aria-label=\"Heading self-link\"></a></h2><p>This checklist helps you avoid surprises during the switch. It makes sure Headlamp can use the same identity and permissions you already trust in Kubernetes. It also gives you a quick way to prove the migration worked before you turn off Dashboard.</p>\n<h3 id=\"2-1-write-down-what-you-use-today\">2.1 Write down what you use today<a class=\"td-heading-self-link\" href=\"#2-1-write-down-what-you-use-today\" aria-label=\"Heading self-link\"></a></h3><p>List the basics:</p>\n<ul>\n<li>Which clusters you use (dev, staging, prod)</li>\n<li>Which namespaces you touch most</li>\n<li>What you do most often (view, edit, scale, delete, debug)</li>\n<li>How you access Dashboard today (port-forward or ingress)</li>\n<li>How you log in (service account token, and which RBAC bindings)</li>\n</ul>\n<p>This is your baseline.</p>\n<h3 id=\"2-2-check-that-kubeconfig-works\">2.2 Check that kubeconfig works<a class=\"td-heading-self-link\" href=\"#2-2-check-that-kubeconfig-works\" aria-label=\"Heading self-link\"></a></h3><p>Headlamp uses kubeconfig, especially on desktop. Make sure yours works before you install anything.</p>\n<p>Run:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl config current-context\n</span></span></code></pre></div><p>Then try:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl get nodes\n</span></span></code></pre></div><p>If you cannot list nodes, test in a namespace you can access:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl get pods -n &lt;namespace&gt;\n</span></span></code></pre></div><p>If these work, Headlamp can use the same identity and RBAC.</p>\n<h3 id=\"2-3-pick-a-rollout-plan\">2.3 Pick a rollout plan<a class=\"td-heading-self-link\" href=\"#2-3-pick-a-rollout-plan\" aria-label=\"Heading self-link\"></a></h3><p>There is no need to rush. Most teams choose one of these:</p>\n<p><strong>Parallel rollout (recommended)</strong></p>\n<ul>\n<li>Install Headlamp</li>\n<li>Let people try it</li>\n<li>Keep Dashboard for a short time</li>\n<li>Remove Dashboard after the team is ready</li>\n</ul>\n<p><strong>Cutover</strong></p>\n<ul>\n<li>Install Headlamp</li>\n<li>Switch docs and links</li>\n<li>Remove Dashboard soon after</li>\n</ul>\n<p>Parallel rollout is safer for shared clusters.</p>\n<h3 id=\"2-4-decide-where-headlamp-will-run\">2.4 Decide where Headlamp will run<a class=\"td-heading-self-link\" href=\"#2-4-decide-where-headlamp-will-run\" aria-label=\"Heading self-link\"></a></h3><p>You can use either option. Many teams use both.</p>\n<p><strong>Desktop</strong></p>\n<ul>\n<li>Uses your kubeconfig</li>\n<li>Uses no cluster resources</li>\n<li>No port-forward needed</li>\n<li>Multi-cluster works out of the box</li>\n</ul>\n<p><strong>In-cluster</strong></p>\n<ul>\n<li>Works well for shared, browser access</li>\n<li>Can be managed like other cluster apps</li>\n<li>Often paired with ingress and SSO</li>\n</ul>\n<h3 id=\"2-5-note-optional-dependencies\">2.5 Note optional dependencies<a class=\"td-heading-self-link\" href=\"#2-5-note-optional-dependencies\" aria-label=\"Heading self-link\"></a></h3><p>These are common. You can handle them later.</p>\n<ul>\n<li><code>metrics-server</code> (for CPU and memory graphs)</li>\n<li>ingress (for an in-cluster URL)</li>\n<li>OIDC / SSO (for browser sign-in)</li>\n<li>cleanup of old Dashboard service accounts and RBAC</li>\n</ul>\n<h2 id=\"3-choose-where-headlamp-will-run-desktop-or-in-cluster\">3. Choose where Headlamp will run (desktop or in-cluster)<a class=\"td-heading-self-link\" href=\"#3-choose-where-headlamp-will-run-desktop-or-in-cluster\" aria-label=\"Heading self-link\"></a></h2><p>Headlamp can run on your desktop or inside a cluster. Both work well, but they fit different needs. Desktop is the fastest way to start because it uses your kubeconfig and does not run in the cluster. In-cluster is best when you need a shared URL and want the platform team to manage upgrades and access.</p>\n<h3 id=\"option-a-desktop-user-managed\">Option A: Desktop (user-managed)<a class=\"td-heading-self-link\" href=\"#option-a-desktop-user-managed\" aria-label=\"Heading self-link\"></a></h3><p>Desktop Headlamp runs on each user's machine. It reads the same kubeconfig you use with kubectl. This keeps access tied to each user's identity and RBAC.</p>\n<p><strong>Why teams pick it</strong></p>\n<ul>\n<li>No in-cluster service to deploy or expose.</li>\n<li>It uses no cluster CPU or memory.</li>\n<li>It uses your kubeconfig and RBAC.</li>\n<li>It works with many clusters in one app.</li>\n<li>You do not need port-forward for day-to-day use.</li>\n</ul>\n<h3 id=\"option-b-in-cluster-best-for-shared-access\">Option B: In-cluster (best for shared access)<a class=\"td-heading-self-link\" href=\"#option-b-in-cluster-best-for-shared-access\" aria-label=\"Heading self-link\"></a></h3><p>In-cluster Headlamp is installed as a Kubernetes workload (often via Helm). This lets cluster admins manage it like other in-cluster apps.</p>\n<ul>\n<li>Cluster admins manage install, upgrades, and configuration through the Helm chart and standard Kubernetes tooling.</li>\n<li>Admins control ingress and can set up OIDC login for shared access.</li>\n<li>It supports shared use in team environments.</li>\n</ul>\n<h2 id=\"4-install-headlamp-desktop-and-in-cluster\">4. Install Headlamp (desktop and in-cluster)<a class=\"td-heading-self-link\" href=\"#4-install-headlamp-desktop-and-in-cluster\" aria-label=\"Heading self-link\"></a></h2><p>This section gets Headlamp running. Follow the path you chose in Section 3.</p>\n<h3 id=\"4-1-desktop-install-fastest-way-to-start\">4.1 Desktop install (fastest way to start)<a class=\"td-heading-self-link\" href=\"#4-1-desktop-install-fastest-way-to-start\" aria-label=\"Heading self-link\"></a></h3><p>Install Headlamp on your machine. Then open it like any other app. Headlamp reads your kubeconfig and uses the same identity and RBAC rules as kubectl.</p>\n<p><strong>Windows</strong></p>\n<p>Install with WinGet:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">winget install headlamp\n</span></span></code></pre></div><p>Or with Chocolatey:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">choco install headlamp\n</span></span></code></pre></div><p><strong>macOS</strong></p>\n<p>Install with Homebrew:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">brew install --cask headlamp\n</span></span></code></pre></div><p><strong>Linux</strong></p>\n<p>Install with Flatpak (Flathub):</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">flatpak install flathub io.kinvolk.Headlamp\n</span></span></code></pre></div><p><strong>Quick check</strong></p>\n<ol>\n<li>Launch Headlamp.</li>\n<li>Confirm you can see a cluster context.</li>\n<li>Open a namespace you can access and confirm you can list workloads. Headlamp will only show actions your RBAC allows.</li>\n</ol>\n<h3 id=\"4-2-in-cluster-install-shared-access\">4.2 In-cluster install (shared access)<a class=\"td-heading-self-link\" href=\"#4-2-in-cluster-install-shared-access\" aria-label=\"Heading self-link\"></a></h3><p>Use this path when you want a shared UI that the platform team can manage. Headlamp supports in-cluster deployment with Helm or a YAML manifest.</p>\n<p><strong>Install with Helm</strong></p>\n<p>Add the repo and update:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">helm repo add headlamp https://kubernetes-sigs.github.io/headlamp/\n</span></span><span class=\"line\"><span class=\"cl\">helm repo update\n</span></span></code></pre></div><p>Create a namespace (example):</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl create namespace headlamp\n</span></span></code></pre></div><p>Install the chart:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">helm install headlamp headlamp/headlamp --namespace headlamp\n</span></span></code></pre></div><p><strong>Install with a YAML manifest (optional)</strong></p>\n<p>Headlamp also provides a YAML manifest you can apply and then adjust to your needs.</p>\n<p><strong>Check the install</strong></p>\n<p>Confirm the pod is running:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl get pods -n headlamp\n</span></span></code></pre></div><p>Confirm the service exists:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl get svc -n headlamp\n</span></span></code></pre></div><p><strong>Access it (two common ways)</strong></p>\n<p><em>Quick test with port-forward</em></p>\n<p>This is the fastest way to verify the service works:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl port-forward -n headlamp svc/headlamp 8080:80\n</span></span></code></pre></div><p>Then open: http://localhost:8080</p>\n<p><em>Shared access with ingress</em></p>\n<p>If you want a stable URL, expose the service through your ingress controller. Your exact ingress YAML depends on your setup. Headlamp's OIDC callback URL is your public URL plus <code>/oidc-callback</code>, so ingress and TLS settings matter.</p>\n<h3 id=\"4-3-updating-headlamp\">4.3 Updating Headlamp<a class=\"td-heading-self-link\" href=\"#4-3-updating-headlamp\" aria-label=\"Heading self-link\"></a></h3><p>Updates depend on how you installed Headlamp. Package managers upgrade in place. DMG or EXE installs update by reinstalling the newer download.</p>\n<p><strong>macOS</strong></p>\n<p>If you installed with Homebrew, run:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">brew upgrade headlamp\n</span></span></code></pre></div><p>If you installed from a DMG, download the newest DMG and drag Headlamp into <code>/Applications</code>, replacing the old version. DMG installs do not auto upgrade.</p>\n<p><strong>Windows</strong></p>\n<p>If you installed with WinGet, run:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">winget upgrade headlamp\n</span></span></code></pre></div><p>If you installed with Chocolatey, run:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">choco upgrade headlamp\n</span></span></code></pre></div><p>If you installed from the EXE, download the newest installer and run it again. EXE installs do not auto upgrade.</p>\n<p><strong>Linux</strong></p>\n<p>If you installed with Flatpak, run:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">flatpak update io.kinvolk.Headlamp\n</span></span></code></pre></div><p>If you installed with AppImage, download the newest AppImage and run that file instead.</p>\n<p>If you installed with a tarball, download the newest tarball, extract it, and run the new headlamp binary.</p>\n<h3 id=\"4-4-notes-for-in-cluster-access-keep-it-safe\">4.4 Notes for in-cluster access (keep it safe)<a class=\"td-heading-self-link\" href=\"#4-4-notes-for-in-cluster-access-keep-it-safe\" aria-label=\"Heading self-link\"></a></h3><p>Treat an in-cluster UI like any other cluster-facing service. Use TLS, lock down who can reach it, and rely on Kubernetes auth and RBAC to control what users can do.</p>\n<h2 id=\"5-authentication-and-rbac\">5. Authentication and RBAC<a class=\"td-heading-self-link\" href=\"#5-authentication-and-rbac\" aria-label=\"Heading self-link\"></a></h2><p>Headlamp uses the Kubernetes API the same way kubectl does. Your cluster still decides who can do what. Headlamp only shows actions your identity is allowed to take.</p>\n<p>This section covers two setups: desktop and in-cluster.</p>\n<h3 id=\"5-1-desktop-use-kubeconfig\">5.1 Desktop: use kubeconfig<a class=\"td-heading-self-link\" href=\"#5-1-desktop-use-kubeconfig\" aria-label=\"Heading self-link\"></a></h3><p>On desktop, Headlamp reads your kubeconfig and uses the same credentials you use with kubectl. There is no separate token login flow to manage.</p>\n<p><strong>Step 1: Confirm your kubeconfig works</strong></p>\n<p>Run:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl config current-context\n</span></span></code></pre></div><p>Then test access:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl get nodes\n</span></span></code></pre></div><p>If you cannot list nodes, test a namespace you can access:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl get pods -n &lt;namespace&gt;\n</span></span></code></pre></div><p>If these commands work, your kubeconfig and credentials are valid for Headlamp too.</p>\n<p><strong>Step 2: Point Headlamp at the right kubeconfig (if needed)</strong></p>\n<p>Headlamp can use the default kubeconfig path. It can also use a custom file path. You can set <code>KUBECONFIG</code> to choose a specific file.</p>\n<p>Example:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\"><span class=\"nv\">KUBECONFIG</span><span class=\"o\">=</span>/path/to/config headlamp\n</span></span></code></pre></div><p>You can also use more than one kubeconfig file at once. On Unix systems, separate paths with <code>:</code>. On Windows, separate paths with <code>;</code>.</p>\n<p><strong>What to expect in the UI</strong></p>\n<p>Headlamp adapts to your RBAC permissions. If you do not have permission to edit or delete a resource, Headlamp will not offer those actions.</p>\n<h3 id=\"5-2-in-cluster-shared-access-needs-a-sign-in-plan\">5.2 In-cluster: shared access needs a sign-in plan<a class=\"td-heading-self-link\" href=\"#5-2-in-cluster-shared-access-needs-a-sign-in-plan\" aria-label=\"Heading self-link\"></a></h3><p>In-cluster Headlamp is shared by many users. You need a clear plan for sign-in and access. Headlamp supports OpenID Connect (OIDC) for a &quot;Sign in&quot; flow.</p>\n<p>You will usually choose one of these patterns:</p>\n<ul>\n<li><strong>A.</strong> Configure Headlamp with OIDC (built-in).</li>\n<li><strong>B.</strong> Put an auth layer in front of Headlamp (common in enterprises).</li>\n</ul>\n<p><strong>A. Built-in OIDC (Headlamp)</strong></p>\n<p>To use OIDC, Headlamp needs:</p>\n<ul>\n<li>Client ID</li>\n<li>Client secret</li>\n<li>Issuer URL</li>\n<li>(Optional) scopes</li>\n</ul>\n<p>Your OIDC provider must also allow Headlamp's callback URL. The callback is your Headlamp URL plus:</p>\n<ul>\n<li><code>/oidc-callback</code></li>\n</ul>\n<p>Example:</p>\n<ul>\n<li><code>https://headlamp.example.com/oidc-callback</code></li>\n</ul>\n<p><strong>Ingress note</strong></p>\n<p>If Headlamp is behind an ingress or load balancer, make sure it forwards <code>X-Forwarded-Proto</code>. If it does not, Headlamp may generate an <code>http</code> callback URL instead of <code>https</code>. That can break login.</p>\n<p><strong>B. Auth layer in front of Headlamp</strong></p>\n<p>Some teams protect Headlamp with an identity-aware proxy or a platform auth system. This keeps sign-in consistent across tools. Headlamp docs include an example using OpenUnison, which can deploy Headlamp with hardened defaults and integrate with identity providers.</p>\n<h3 id=\"5-3-rbac-keep-it-least-privilege\">5.3 RBAC: keep it least privilege<a class=\"td-heading-self-link\" href=\"#5-3-rbac-keep-it-least-privilege\" aria-label=\"Heading self-link\"></a></h3><p>Kubernetes security starts with API authentication and authorization (RBAC). Headlamp respects those rules.</p>\n<p>Practical guidance:</p>\n<ul>\n<li>Start with the lowest permissions that still let users do their job.</li>\n<li>If Dashboard used a high-privilege service account token, plan to remove or tighten that access after the move.</li>\n<li>For in-cluster, treat the UI like any other endpoint. Use TLS and limit network access.</li>\n</ul>\n<h3 id=\"5-4-quick-troubleshooting\">5.4 Quick troubleshooting<a class=\"td-heading-self-link\" href=\"#5-4-quick-troubleshooting\" aria-label=\"Heading self-link\"></a></h3><p><strong>Desktop: &quot;I do not see my cluster&quot;</strong></p>\n<p>Your kubeconfig may not be in the default location. Point Headlamp to the file with <code>KUBECONFIG</code> or a file path.</p>\n<p><strong>In-cluster: &quot;OIDC login fails after redirect&quot;</strong></p>\n<p>Confirm your provider allows <code>https://YOUR_URL/oidc-callback</code>. If you use ingress, make sure it forwards <code>X-Forwarded-Proto</code>.</p>\n<h2 id=\"6-manage-multiple-clusters\">6. Manage multiple clusters<a class=\"td-heading-self-link\" href=\"#6-manage-multiple-clusters\" aria-label=\"Heading self-link\"></a></h2><p>Kubernetes Dashboard is usually tied to one cluster at a time. Headlamp is built for multi-cluster work. It is a client that follows your kubeconfig, not a single cluster install. That means you can keep one UI open and switch clusters as you work.</p>\n<h3 id=\"clusters-come-from-your-kubeconfig\">Clusters come from your kubeconfig<a class=\"td-heading-self-link\" href=\"#clusters-come-from-your-kubeconfig\" aria-label=\"Heading self-link\"></a></h3><p>Headlamp reads clusters from your kubeconfig files. That means the clusters you can access with kubectl can also show up in Headlamp.</p>\n<h3 id=\"switch-clusters-in-the-ui\">Switch clusters in the UI<a class=\"td-heading-self-link\" href=\"#switch-clusters-in-the-ui\" aria-label=\"Heading self-link\"></a></h3><p>Once Headlamp loads your kubeconfig, you can switch clusters using the cluster selector. This makes it easier to move between dev, staging, and prod without changing tools.</p>\n<h3 id=\"optional-use-more-than-one-kubeconfig-file\">Optional: use more than one kubeconfig file<a class=\"td-heading-self-link\" href=\"#optional-use-more-than-one-kubeconfig-file\" aria-label=\"Heading self-link\"></a></h3><p>If you keep separate kubeconfig files, you can load them together. Headlamp supports multiple kubeconfig paths in <code>KUBECONFIG</code>.</p>\n<p>Unix/macOS/Linux (<code>:</code> separator):</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\"><span class=\"nv\">KUBECONFIG</span><span class=\"o\">=</span>~/.kube/dev:~/.kube/prod headlamp\n</span></span></code></pre></div><p>Windows (<code>;</code> separator):</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-powershell\" data-lang=\"powershell\"><span class=\"line\"><span class=\"cl\"><span class=\"nv\">$env:KUBECONFIG</span><span class=\"p\">=</span><span class=\"s2\">&#34;</span><span class=\"nv\">$HOME</span><span class=\"s2\">\\.kube\\dev;</span><span class=\"nv\">$HOME</span><span class=\"s2\">\\.kube\\prod&#34;</span>\n</span></span></code></pre></div><h3 id=\"optional-add-a-cluster-from-inside-headlamp\">Optional: add a cluster from inside Headlamp<a class=\"td-heading-self-link\" href=\"#optional-add-a-cluster-from-inside-headlamp\" aria-label=\"Heading self-link\"></a></h3><p>You can also add clusters by loading additional kubeconfig files from the UI.</p>\n<h3 id=\"permissions-stay-the-same\">Permissions stay the same<a class=\"td-heading-self-link\" href=\"#permissions-stay-the-same\" aria-label=\"Heading self-link\"></a></h3><p>Multi-cluster does not change security rules. Each cluster still enforces its own RBAC. Headlamp shows only what your identity can do in the selected cluster.</p>\n<h2 id=\"7-navigate-and-understand-resources\">7. Navigate and understand resources<a class=\"td-heading-self-link\" href=\"#7-navigate-and-understand-resources\" aria-label=\"Heading self-link\"></a></h2><p>If you used Kubernetes Dashboard, this part will feel familiar. Headlamp keeps the same core resource views, but makes it easier to move around and understand what is connected.</p>\n<h3 id=\"find-resources-in-familiar-places\">Find resources in familiar places<a class=\"td-heading-self-link\" href=\"#find-resources-in-familiar-places\" aria-label=\"Heading self-link\"></a></h3><p>Headlamp groups resources in a way that maps closely to Dashboard:</p>\n<ul>\n<li><strong>Workloads</strong> for Pods, Deployments, StatefulSets, and Jobs</li>\n<li><strong>Network</strong> for Services and Ingress</li>\n<li><strong>Storage</strong> for PersistentVolumes and Claims</li>\n<li><strong>Configuration</strong> for ConfigMaps and Secrets</li>\n<li><strong>Nodes</strong> for cluster infrastructure</li>\n</ul>\n<p>You can filter by namespace at the top of the UI, just like in Dashboard.</p>\n<h3 id=\"inspect-and-edit-resources\">Inspect and edit resources<a class=\"td-heading-self-link\" href=\"#inspect-and-edit-resources\" aria-label=\"Heading self-link\"></a></h3><p>From any list, you can click into a resource to see details:</p>\n<ul>\n<li>Status and conditions</li>\n<li>Events</li>\n<li>Labels and annotations</li>\n<li>The full YAML definition</li>\n</ul>\n<p>If your RBAC allows it, you can edit YAML directly from the UI. If it does not, Headlamp shows the resource as read-only. This matches how kubectl behaves.</p>\n<h3 id=\"use-search-and-filters-to-move-faster\">Use search and filters to move faster<a class=\"td-heading-self-link\" href=\"#use-search-and-filters-to-move-faster\" aria-label=\"Heading self-link\"></a></h3><p>Headlamp adds faster search and filtering across lists. This helps when clusters or namespaces get large. You can narrow views without jumping between pages.</p>\n<h3 id=\"understand-relationships-with-map-view\">Understand relationships with Map View<a class=\"td-heading-self-link\" href=\"#understand-relationships-with-map-view\" aria-label=\"Heading self-link\"></a></h3><p>Dashboard mostly shows resources as lists. Headlamp also includes a Map View.</p>\n<p>Map View shows how resources relate to each other:</p>\n<ul>\n<li>Deployments</li>\n<li>ReplicaSets</li>\n<li>Pods</li>\n<li>Services</li>\n</ul>\n<p>This helps when you are troubleshooting. Instead of clicking through several pages, you can see the connections at once. You can spot missing links or broken relationships faster.</p>\n<h3 id=\"when-to-use-lists-vs-map-view\">When to use lists vs Map View<a class=\"td-heading-self-link\" href=\"#when-to-use-lists-vs-map-view\" aria-label=\"Heading self-link\"></a></h3><ul>\n<li>Use <strong>lists</strong> when you know what resource you are looking for.</li>\n<li>Use <strong>Map View</strong> when you are trying to understand why something is not working.</li>\n</ul>\n<p>Both views work on the same data. You are just choosing how much context you want at that moment.</p>\n<h2 id=\"8-deploy-applications-with-yaml\">8. Deploy applications with YAML<a class=\"td-heading-self-link\" href=\"#8-deploy-applications-with-yaml\" aria-label=\"Heading self-link\"></a></h2><p>This is the biggest change for most Kubernetes Dashboard users. Dashboard relied on forms. Headlamp relies on manifests. The goal is not to slow you down. It is to align the UI with how Kubernetes is usually run in practice.</p>\n<h3 id=\"from-forms-to-manifests\">From forms to manifests<a class=\"td-heading-self-link\" href=\"#from-forms-to-manifests\" aria-label=\"Heading self-link\"></a></h3><p>In Kubernetes Dashboard, you often deployed an app by filling in a form:</p>\n<ul>\n<li>container image</li>\n<li>replicas</li>\n<li>service type</li>\n</ul>\n<p>Headlamp does not include the same wizard. Instead, it lets you apply YAML directly from the UI.</p>\n<p>This matches how most teams deploy today:</p>\n<ul>\n<li>manifests live in Git</li>\n<li>CI/CD applies them</li>\n<li>Helm or GitOps tools manage changes</li>\n</ul>\n<p>Headlamp fits into that flow rather than replacing it.</p>\n<h3 id=\"create-resources-using-yaml\">Create resources using YAML<a class=\"td-heading-self-link\" href=\"#create-resources-using-yaml\" aria-label=\"Heading self-link\"></a></h3><p>To deploy an application in Headlamp:</p>\n<ol>\n<li>Select a cluster and namespace.</li>\n<li>Click <strong>Create</strong>.</li>\n<li>Paste or upload a YAML manifest.</li>\n<li>Review it.</li>\n<li>Click <strong>Apply</strong>.</li>\n</ol>\n<img src=\"./create-highlight.png\" alt=\"Create button highlight\" style=\"display: block; margin-bottom: 0.5em;\" />\n<p>The resource appears immediately in the UI.</p>\n<p>If the manifest is not valid, Headlamp shows the same errors you would see from the Kubernetes API.</p>\n<h3 id=\"generate-yaml-the-easy-way\">Generate YAML the easy way<a class=\"td-heading-self-link\" href=\"#generate-yaml-the-easy-way\" aria-label=\"Heading self-link\"></a></h3><p>If you miss the Dashboard wizard, you can still generate YAML quickly.</p>\n<p>For example:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl create deployment nginx <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --image<span class=\"o\">=</span>nginx <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> --dry-run<span class=\"o\">=</span>client <span class=\"se\">\\\n</span></span></span><span class=\"line\"><span class=\"cl\"><span class=\"se\"></span> -o yaml &gt; nginx.yaml\n</span></span></code></pre></div><p>You can edit the file if needed, then paste it into Headlamp and apply it.</p>\n<p>This gives you a repeatable manifest instead of an object created only through a UI.</p>\n<h3 id=\"what-if-you-use-helm-or-gitops\">What if you use Helm or GitOps?<a class=\"td-heading-self-link\" href=\"#what-if-you-use-helm-or-gitops\" aria-label=\"Heading self-link\"></a></h3><p>That works well with Headlamp.</p>\n<ul>\n<li>Install with Helm as usual.</li>\n<li>Deploy with GitOps pipelines as usual.</li>\n<li>Use Headlamp to view, inspect, and debug what is running.</li>\n</ul>\n<p>Headlamp does not replace those tools. It gives you visibility into what they create.</p>\n<h3 id=\"what-to-expect-compared-to-dashboard\">What to expect compared to Dashboard<a class=\"td-heading-self-link\" href=\"#what-to-expect-compared-to-dashboard\" aria-label=\"Heading self-link\"></a></h3><ul>\n<li>You will not see a multi-step deploy form.</li>\n<li>You will work more with YAML.</li>\n<li>You gain clarity about what is actually applied to the cluster.</li>\n<li>The same manifest can be reused in CI, Git, or other tools.</li>\n</ul>\n<h2 id=\"9-deploy-and-debug-workloads\">9. Deploy and debug workloads<a class=\"td-heading-self-link\" href=\"#9-deploy-and-debug-workloads\" aria-label=\"Heading self-link\"></a></h2><p>One of the main reasons people used Kubernetes Dashboard was day-to-day debugging. Headlamp covers the same tasks and adds a few useful upgrades.</p>\n<h3 id=\"view-logs\">View logs<a class=\"td-heading-self-link\" href=\"#view-logs\" aria-label=\"Heading self-link\"></a></h3><p>You can view pod logs directly in the UI.</p>\n<p>To check logs:</p>\n<ol>\n<li>Open <strong>Workloads</strong>.</li>\n<li>Select <strong>Pods</strong>.</li>\n<li>Click a pod.</li>\n<li>Open the <strong>Logs</strong> tab.</li>\n</ol>\n<img src=\"./workloads.png\" alt=\"Workloads view\" style=\"display: block; margin-bottom: 0.5em;\" />\n<p>If the pod has more than one container, you can switch between containers. Logs stream live, which helps during rollouts or active incidents.</p>\n<h3 id=\"exec-into-running-pods\">Exec into running pods<a class=\"td-heading-self-link\" href=\"#exec-into-running-pods\" aria-label=\"Heading self-link\"></a></h3><p>Headlamp also lets you open a shell inside a container.</p>\n<p>From a pod view:</p>\n<ul>\n<li>Open the pod actions menu.</li>\n<li>Choose <strong>Terminal</strong> or <strong>Exec</strong>.</li>\n</ul>\n<p>This opens an interactive session inside the container. It replaces the need to switch back to the terminal for quick checks.</p>\n<p>This action follows RBAC rules. If you cannot run <code>kubectl exec</code>, Headlamp will not allow it either.</p>\n<h3 id=\"check-metrics-and-resource-usage\">Check metrics and resource usage<a class=\"td-heading-self-link\" href=\"#check-metrics-and-resource-usage\" aria-label=\"Heading self-link\"></a></h3><p>Headlamp can show CPU and memory usage for pods and nodes. This works the same way it did in Dashboard.</p>\n<p>A few things to know:</p>\n<ul>\n<li>Metrics require <code>metrics-server</code> to be installed in the cluster.</li>\n<li>If metrics are missing, Headlamp shows a clear notice.</li>\n<li>Once metrics are available, usage appears on pod and node views.</li>\n</ul>\n<p>This makes it easy to answer simple questions:</p>\n<ul>\n<li>Is this pod using too much memory?</li>\n<li>Is a node under pressure?</li>\n</ul>\n<h3 id=\"view-events-when-something-goes-wrong\">View events when something goes wrong<a class=\"td-heading-self-link\" href=\"#view-events-when-something-goes-wrong\" aria-label=\"Heading self-link\"></a></h3><p>Events are often the fastest way to understand failures.</p>\n<p>In Headlamp, you can:</p>\n<ul>\n<li>View events on resource detail pages.</li>\n<li>See warnings and errors tied to pods, nodes, or deployments.</li>\n</ul>\n<p>This is often the first place to look when a workload is stuck or crashes.</p>\n<h3 id=\"how-this-compares-to-dashboard\">How this compares to Dashboard<a class=\"td-heading-self-link\" href=\"#how-this-compares-to-dashboard\" aria-label=\"Heading self-link\"></a></h3><p><strong>What stays the same:</strong></p>\n<ul>\n<li>Log viewing</li>\n<li>Event inspection</li>\n<li>RBAC-aware actions</li>\n</ul>\n<p><strong>What improves:</strong></p>\n<ul>\n<li>Built-in exec sessions</li>\n<li>Clearer layout and filtering</li>\n<li>Fewer context switches between UI and CLI</li>\n</ul>\n<h2 id=\"10-remove-kubernetes-dashboard\">10. Remove Kubernetes Dashboard<a class=\"td-heading-self-link\" href=\"#10-remove-kubernetes-dashboard\" aria-label=\"Heading self-link\"></a></h2><p>After Headlamp is working and your team is comfortable using it, you can remove Kubernetes Dashboard. This is the final cleanup step.</p>\n<p>Removing Dashboard reduces clutter and avoids keeping unused access paths around.</p>\n<h3 id=\"confirm-headlamp-covers-your-needs\">Confirm Headlamp covers your needs<a class=\"td-heading-self-link\" href=\"#confirm-headlamp-covers-your-needs\" aria-label=\"Heading self-link\"></a></h3><p>Before uninstalling anything, make sure:</p>\n<ul>\n<li>Users can access the clusters they need in Headlamp.</li>\n<li>Common tasks work:\n<ul>\n<li>browse resources</li>\n<li>deploy with YAML</li>\n<li>view logs and events</li>\n<li>exec into pods (if allowed)</li>\n</ul>\n</li>\n<li>RBAC behaves as expected for different roles.</li>\n</ul>\n<p>Once these checks pass, you are ready to remove Dashboard.</p>\n<h3 id=\"uninstall-the-dashboard\">Uninstall the Dashboard<a class=\"td-heading-self-link\" href=\"#uninstall-the-dashboard\" aria-label=\"Heading self-link\"></a></h3><p>If you installed Kubernetes Dashboard with Helm, remove it with:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">helm uninstall kubernetes-dashboard -n kubernetes-dashboard\n</span></span></code></pre></div><p>If Dashboard was installed by a manifest or addon, remove it using the same method you used to install it.</p>\n<p>After removal, confirm the resources are gone:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-shell\" data-lang=\"shell\"><span class=\"line\"><span class=\"cl\">kubectl get pods -n kubernetes-dashboard\n</span></span></code></pre></div><h3 id=\"clean-up-access-artifacts-recommended\">Clean up access artifacts (recommended)<a class=\"td-heading-self-link\" href=\"#clean-up-access-artifacts-recommended\" aria-label=\"Heading self-link\"></a></h3><p>Many Dashboard setups used dedicated service accounts and cluster-wide roles.</p>\n<p>Review and remove anything that was created only for Dashboard access, such as:</p>\n<ul>\n<li>service accounts</li>\n<li>role bindings or cluster role bindings</li>\n<li>old documentation that points users to Dashboard URLs or port-forward commands</li>\n</ul>\n<p>This reduces long-lived credentials and unused permissions.</p>\n<h3 id=\"communicate-the-change\">Communicate the change<a class=\"td-heading-self-link\" href=\"#communicate-the-change\" aria-label=\"Heading self-link\"></a></h3><p>Make sure your team knows:</p>\n<ul>\n<li>Headlamp is now the primary Kubernetes UI.</li>\n<li>How to access it (desktop or URL).</li>\n<li>Where to go for help if something feels different.</li>\n</ul>\n<h2 id=\"11-post-migration-checklist\">11. Post-migration checklist<a class=\"td-heading-self-link\" href=\"#11-post-migration-checklist\" aria-label=\"Heading self-link\"></a></h2><p>This final checklist helps you confirm the migration is complete. It gives you confidence that Headlamp is working as expected and that nothing important was left behind.</p>\n<h3 id=\"access-and-visibility\">Access and visibility<a class=\"td-heading-self-link\" href=\"#access-and-visibility\" aria-label=\"Heading self-link\"></a></h3><ul>\n<li><input disabled=\"\" type=\"checkbox\"> Headlamp opens without errors.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Users can access the correct clusters.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Namespace filtering works as expected.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Multi-cluster switching behaves correctly.</li>\n</ul>\n<h3 id=\"authentication-and-rbac\">Authentication and RBAC<a class=\"td-heading-self-link\" href=\"#authentication-and-rbac\" aria-label=\"Heading self-link\"></a></h3><ul>\n<li><input disabled=\"\" type=\"checkbox\"> Desktop users access clusters using kubeconfig.</li>\n<li><input disabled=\"\" type=\"checkbox\"> In-cluster users can sign in using the chosen auth method.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Users only see actions their RBAC allows.</li>\n<li><input disabled=\"\" type=\"checkbox\"> No unexpected permission errors appear during normal use.</li>\n</ul>\n<h3 id=\"core-workflows\">Core workflows<a class=\"td-heading-self-link\" href=\"#core-workflows\" aria-label=\"Heading self-link\"></a></h3><ul>\n<li><input disabled=\"\" type=\"checkbox\"> Resources load under Workloads, Network, and Configuration.</li>\n<li><input disabled=\"\" type=\"checkbox\"> YAML can be viewed and edited where permissions allow.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Applications can be deployed using Create and YAML.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Logs load correctly for running pods.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Exec works for users who are allowed to use it.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Metrics appear if metrics-server is installed.</li>\n</ul>\n<h3 id=\"operational-confidence\">Operational confidence<a class=\"td-heading-self-link\" href=\"#operational-confidence\" aria-label=\"Heading self-link\"></a></h3><ul>\n<li><input disabled=\"\" type=\"checkbox\"> Teams can troubleshoot without switching tools.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Map View helps explain relationships during debugging.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Platform or DevOps teams know how Headlamp is installed and managed.</li>\n</ul>\n<h3 id=\"cleanup-confirmation\">Cleanup confirmation<a class=\"td-heading-self-link\" href=\"#cleanup-confirmation\" aria-label=\"Heading self-link\"></a></h3><ul>\n<li><input disabled=\"\" type=\"checkbox\"> Kubernetes Dashboard is no longer running.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Dashboard-only service accounts and RBAC bindings are removed.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Internal docs no longer reference Dashboard URLs or port-forward commands.</li>\n</ul>\n<h3 id=\"team-alignment\">Team alignment<a class=\"td-heading-self-link\" href=\"#team-alignment\" aria-label=\"Heading self-link\"></a></h3><ul>\n<li><input disabled=\"\" type=\"checkbox\"> The team knows Headlamp is the default Kubernetes UI.</li>\n<li><input disabled=\"\" type=\"checkbox\"> Onboarding docs point new users to Headlamp.</li>\n<li><input disabled=\"\" type=\"checkbox\"> There is a clear path for feedback or questions.</li>\n</ul>\n<p>You've now completed the move from Kubernetes Dashboard to Headlamp. Your team can use the same Kubernetes access model, work across clusters, and rely on workflows that match how Kubernetes is used today. From here, Headlamp becomes your default UI, whether on the desktop or in shared environments. As your needs grow, you can keep using it as-is or extend it with plugins and new views over time.</p>\n<p>If you want to help shape what comes next, join the Headlamp community and contribute at <a href=\"https://headlamp.dev\">headlamp.dev</a>.</p>"
---

1. Before you start: know what is changing
Kubernetes Dashboard and Headlamp both show what is running in a cluster, but they work differently. When Headlamp runs on the desktop, it uses your existing kubeconfig to connect to one or more clusters and can be extended with plugins. When Headlamp runs inside a cluster, it uses a Kubernetes ServiceAccount to access the API and follow RBAC rules. Kubernetes Dashboard, in contrast, only runs in-cluster and always relies on service account tokens. Understanding these models early helps you choose the right setup and permissions.
1.1 How Kubernetes Dashboard works
Dashboard is a web app that runs inside your cluster.
You install it in the cluster, often with Helm.
You usually run one Dashboard per cluster.
You often reach it with kubectl port-forward or an ingress.
You log in with a Bearer token. That token is often from a service account.
It includes forms that help you create resources.
It leans on tables and lists for navigation.
It feels like this: a UI that lives with the cluster.
1.2 How Headlamp works
Headlamp acts more like a Kubernetes client with a UI.
It can run on your desktop or in a cluster.
It reads your kubeconfig, like kubectl does.
It can show more than one cluster in one place.
It favors YAML when you create or change resources.
It includes list views and a visual map.
You can add features with plugins.
Headlamp is a UI that follows your identity, not your cluster.
1.3 What stays the same
Many workflows will feel familiar:
Browse workloads and resources
Filter by namespace
Inspect YAML, events, and status
View logs
Take actions your RBAC allows
1.4 What changes
A few things will feel different:
Login shifts from pasted tokens to kubeconfig (and sometimes SSO).
Creation shifts from forms to "apply YAML."
Multi-cluster becomes normal, not a special case.
The map view helps you see how resources connect.
2. Pre-migration checklist
This checklist helps you avoid surprises during the switch. It makes sure Headlamp can use the same identity and permissions you already trust in Kubernetes. It also gives you a quick way to prove the migration worked before you turn off Dashboard.
2.1 Write down what you use today
List the basics:
Which clusters you use (dev, staging, prod)
Which namespaces you touch most
What you do most often (view, edit, scale, delete, debug)
How you access Dashboard today (port-forward or ingress)
How you log in (service account token, and which RBAC bindings)
This is your baseline.
2.2 Check that kubeconfig works
Headlamp uses kubeconfig, especially on desktop. Make sure yours works before you install anything.
Run:
kubectl config current-context


Then try:
kubectl get nodes


If you cannot list nodes, test in a namespace you can access:
kubectl get pods -n <namespace>


If these work, Headlamp can use the same identity and RBAC.
2.3 Pick a rollout plan
There is no need to rush. Most teams choose one of these:
Parallel rollout (recommended)
Install Headlamp
Let people try it
Keep Dashboard for a short time
Remove Dashboard after the team is ready
Cutover
Install Headlamp
Switch docs and links
Remove Dashboard soon after
Parallel rollout is safer for shared clusters.
2.4 Decide where Headlamp will run
You can use either option. Many teams use both.
Desktop
Uses your kubeconfig
Uses no cluster resources
No port-forward needed
Multi-cluster works out of the box
In-cluster
Works well for shared, browser access
Can be managed like other cluster apps
Often paired with ingress and SSO
2.5 Note optional dependencies
These are common. You can handle them later.
metrics-server (for CPU and memory graphs)
ingress (for an in-cluster URL)
OIDC / SSO (for browser sign-in)
cleanup of old Dashboard service accounts and RBAC
3. Choose where Headlamp will run (desktop or in-cluster)
Headlamp can run on your desktop or inside a cluster. Both work well, but they fit different needs. Desktop is the fastest way to start because it uses your kubeconfig and does not run in the cluster. In-cluster is best when you need a shared URL and want the platform team to manage upgrades and access.
Option A: Desktop (user-managed)
Desktop Headlamp runs on each user's machine. It reads the same kubeconfig you use with kubectl. This keeps access tied to each user's identity and RBAC.
Why teams pick it
No in-cluster service to deploy or expose.
It uses no cluster CPU or memory.
It uses your kubeconfig and RBAC.
It works with many clusters in one app.
You do not need port-forward for day-to-day use.
Option B: In-cluster (best for shared access)
In-cluster Headlamp is installed as a Kubernetes workload (often via Helm). This lets cluster admins manage it like other in-cluster apps.
Cluster admins manage install, upgrades, and configuration through the Helm chart and standard Kubernetes tooling.
Admins control ingress and can set up OIDC login for shared access.
It supports shared use in team environments.
4. Install Headlamp (desktop and in-cluster)
This section gets Headlamp running. Follow the path you chose in Section 3.
4.1 Desktop install (fastest way to start)
Install Headlamp on your machine. Then open it like any other app. Headlamp reads your kubeconfig and uses the same identity and RBAC rules as kubectl.
Windows
Install with WinGet:
winget install headlamp


Or with Chocolatey:
choco install headlamp


macOS
Install with Homebrew:
brew install --cask headlamp


Linux
Install with Flatpak (Flathub):
flatpak install flathub io.kinvolk.Headlamp


Quick check
Launch Headlamp.
Confirm you can see a cluster context.
Open a namespace you can access and confirm you can list workloads. Headlamp will only show actions your RBAC allows.
4.2 In-cluster install (shared access)
Use this path when you want a shared UI that the platform team can manage. Headlamp supports in-cluster deployment with Helm or a YAML manifest.
Install with Helm
Add the repo and update:
helm repo add headlamp https://kubernetes-sigs.github.io/headlamp/
helm repo update


Create a namespace (example):
kubectl create namespace headlamp


Install the chart:
helm install headlamp headlamp/headlamp --namespace headlamp


Install with a YAML manifest (optional)
Headlamp also provides a YAML manifest you can apply and then adjust to your needs.
Check the install
Confirm the pod is running:
kubectl get pods -n headlamp


Confirm the service exists:
kubectl get svc -n headlamp


Access it (two common ways)
Quick test with port-forward
This is the fastest way to verify the service works:
kubectl port-forward -n headlamp svc/headlamp 8080:80


Then open: http://localhost:8080
Shared access with ingress
If you want a stable URL, expose the service through your ingress controller. Your exact ingress YAML depends on your setup. Headlamp's OIDC callback URL is your public URL plus /oidc-callback, so ingress and TLS settings matter.
4.3 Updating Headlamp
Updates depend on how you installed Headlamp. Package managers upgrade in place. DMG or EXE installs update by reinstalling the newer download.
macOS
If you installed with Homebrew, run:
brew upgrade headlamp


If you installed from a DMG, download the newest DMG and drag Headlamp into /Applications, replacing the old version. DMG installs do not auto upgrade.
Windows
If you installed with WinGet, run:
winget upgrade headlamp


If you installed with Chocolatey, run:
choco upgrade headlamp


If you installed from the EXE, download the newest installer and run it again. EXE installs do not auto upgrade.
Linux
If you installed with Flatpak, run:
flatpak update io.kinvolk.Headlamp


If you installed with AppImage, download the newest AppImage and run that file instead.
If you installed with a tarball, download the newest tarball, extract it, and run the new headlamp binary.
4.4 Notes for in-cluster access (keep it safe)
Treat an in-cluster UI like any other cluster-facing service. Use TLS, lock down who can reach it, and rely on Kubernetes auth and RBAC to control what users can do.
5. Authentication and RBAC
Headlamp uses the Kubernetes API the same way kubectl does. Your cluster still decides who can do what. Headlamp only shows actions your identity is allowed to take.
This section covers two setups: desktop and in-cluster.
5.1 Desktop: use kubeconfig
On desktop, Headlamp reads your kubeconfig and uses the same credentials you use with kubectl. There is no separate token login flow to manage.
Step 1: Confirm your kubeconfig works
Run:
kubectl config current-context


Then test access:
kubectl get nodes


If you cannot list nodes, test a namespace you can access:
kubectl get pods -n <namespace>


If these commands work, your kubeconfig and credentials are valid for Headlamp too.
Step 2: Point Headlamp at the right kubeconfig (if needed)
Headlamp can use the default kubeconfig path. It can also use a custom file path. You can set KUBECONFIG to choose a specific file.
Example:
KUBECONFIG=/path/to/config headlamp


You can also use more than one kubeconfig file at once. On Unix systems, separate paths with :. On Windows, separate paths with ;.
What to expect in the UI
Headlamp adapts to your RBAC permissions. If you do not have permission to edit or delete a resource, Headlamp will not offer those actions.
5.2 In-cluster: shared access needs a sign-in plan
In-cluster Headlamp is shared by many users. You need a clear plan for sign-in and access. Headlamp supports OpenID Connect (OIDC) for a "Sign in" flow.
You will usually choose one of these patterns:
A. Configure Headlamp with OIDC (built-in).
B. Put an auth layer in front of Headlamp (common in enterprises).
A. Built-in OIDC (Headlamp)
To use OIDC, Headlamp needs:
Client ID
Client secret
Issuer URL
(Optional) scopes
Your OIDC provider must also allow Headlamp's callback URL. The callback is your Headlamp URL plus:
/oidc-callback
Example:
https://headlamp.example.com/oidc-callback
Ingress note
If Headlamp is behind an ingress or load balancer, make sure it forwards X-Forwarded-Proto. If it does not, Headlamp may generate an http callback URL instead of https. That can break login.
B. Auth layer in front of Headlamp
Some teams protect Headlamp with an identity-aware proxy or a platform auth system. This keeps sign-in consistent across tools. Headlamp docs include an example using OpenUnison, which can deploy Headlamp with hardened defaults and integrate with identity providers.
5.3 RBAC: keep it least privilege
Kubernetes security starts with API authentication and authorization (RBAC). Headlamp respects those rules.
Practical guidance:
Start with the lowest permissions that still let users do their job.
If Dashboard used a high-privilege service account token, plan to remove or tighten that access after the move.
For in-cluster, treat the UI like any other endpoint. Use TLS and limit network access.
5.4 Quick troubleshooting
Desktop: "I do not see my cluster"
Your kubeconfig may not be in the default location. Point Headlamp to the file with KUBECONFIG or a file path.
In-cluster: "OIDC login fails after redirect"
Confirm your provider allows https://YOUR_URL/oidc-callback. If you use ingress, make sure it forwards X-Forwarded-Proto.
6. Manage multiple clusters
Kubernetes Dashboard is usually tied to one cluster at a time. Headlamp is built for multi-cluster work. It is a client that follows your kubeconfig, not a single cluster install. That means you can keep one UI open and switch clusters as you work.
Clusters come from your kubeconfig
Headlamp reads clusters from your kubeconfig files. That means the clusters you can access with kubectl can also show up in Headlamp.
Switch clusters in the UI
Once Headlamp loads your kubeconfig, you can switch clusters using the cluster selector. This makes it easier to move between dev, staging, and prod without changing tools.
Optional: use more than one kubeconfig file
If you keep separate kubeconfig files, you can load them together. Headlamp supports multiple kubeconfig paths in KUBECONFIG.
Unix/macOS/Linux (: separator):
KUBECONFIG=~/.kube/dev:~/.kube/prod headlamp


Windows (; separator):
$env:KUBECONFIG="$HOME\.kube\dev;$HOME\.kube\prod"


Optional: add a cluster from inside Headlamp
You can also add clusters by loading additional kubeconfig files from the UI.
Permissions stay the same
Multi-cluster does not change security rules. Each cluster still enforces its own RBAC. Headlamp shows only what your identity can do in the selected cluster.
7. Navigate and understand resources
If you used Kubernetes Dashboard, this part will feel familiar. Headlamp keeps the same core resource views, but makes it easier to move around and understand what is connected.
Find resources in familiar places
Headlamp groups resources in a way that maps closely to Dashboard:
Workloads for Pods, Deployments, StatefulSets, and Jobs
Network for Services and Ingress
Storage for PersistentVolumes and Claims
Configuration for ConfigMaps and Secrets
Nodes for cluster infrastructure
You can filter by namespace at the top of the UI, just like in Dashboard.
Inspect and edit resources
From any list, you can click into a resource to see details:
Status and conditions
Events
Labels and annotations
The full YAML definition
If your RBAC allows it, you can edit YAML directly from the UI. If it does not, Headlamp shows the resource as read-only. This matches how kubectl behaves.
Use search and filters to move faster
Headlamp adds faster search and filtering across lists. This helps when clusters or namespaces get large. You can narrow views without jumping between pages.
Understand relationships with Map View
Dashboard mostly shows resources as lists. Headlamp also includes a Map View.
Map View shows how resources relate to each other:
Deployments
ReplicaSets
Pods
Services
This helps when you are troubleshooting. Instead of clicking through several pages, you can see the connections at once. You can spot missing links or broken relationships faster.
When to use lists vs Map View

Use lists when you know what resource you are looking for.
Use Map View when you are trying to understand why something is not working.
Both views work on the same data. You are just choosing how much context you want at that moment.
8. Deploy applications with YAML
This is the biggest change for most Kubernetes Dashboard users. Dashboard relied on forms. Headlamp relies on manifests. The goal is not to slow you down. It is to align the UI with how Kubernetes is usually run in practice.
From forms to manifests
In Kubernetes Dashboard, you often deployed an app by filling in a form:
container image
replicas
service type
Headlamp does not include the same wizard. Instead, it lets you apply YAML directly from the UI.
This matches how most teams deploy today:
manifests live in Git
CI/CD applies them
Helm or GitOps tools manage changes
Headlamp fits into that flow rather than replacing it.
Create resources using YAML
To deploy an application in Headlamp:
Select a cluster and namespace.
Click Create.
Paste or upload a YAML manifest.
Review it.
Click Apply.
The resource appears immediately in the UI.
If the manifest is not valid, Headlamp shows the same errors you would see from the Kubernetes API.
Generate YAML the easy way
If you miss the Dashboard wizard, you can still generate YAML quickly.
For example:
kubectl create deployment nginx \
 --image=nginx \
 --dry-run=client \
 -o yaml > nginx.yaml


You can edit the file if needed, then paste it into Headlamp and apply it.
This gives you a repeatable manifest instead of an object created only through a UI.
What if you use Helm or GitOps?
That works well with Headlamp.
Install with Helm as usual.
Deploy with GitOps pipelines as usual.
Use Headlamp to view, inspect, and debug what is running.
Headlamp does not replace those tools. It gives you visibility into what they create.
What to expect compared to Dashboard

You will not see a multi-step deploy form.
You will work more with YAML.
You gain clarity about what is actually applied to the cluster.
The same manifest can be reused in CI, Git, or other tools.
9. Deploy and debug workloads
One of the main reasons people used Kubernetes Dashboard was day-to-day debugging. Headlamp covers the same tasks and adds a few useful upgrades.
View logs
You can view pod logs directly in the UI.
To check logs:
Open Workloads.
Select Pods.
Click a pod.
Open the Logs tab.
If the pod has more than one container, you can switch between containers. Logs stream live, which helps during rollouts or active incidents.
Exec into running pods
Headlamp also lets you open a shell inside a container.
From a pod view:
Open the pod actions menu.
Choose Terminal or Exec.
This opens an interactive session inside the container. It replaces the need to switch back to the terminal for quick checks.
This action follows RBAC rules. If you cannot run kubectl exec, Headlamp will not allow it either.
Check metrics and resource usage
Headlamp can show CPU and memory usage for pods and nodes. This works the same way it did in Dashboard.
A few things to know:
Metrics require metrics-server to be installed in the cluster.
If metrics are missing, Headlamp shows a clear notice.
Once metrics are available, usage appears on pod and node views.
This makes it easy to answer simple questions:
Is this pod using too much memory?
Is a node under pressure?
View events when something goes wrong
Events are often the fastest way to understand failures.
In Headlamp, you can:
View events on resource detail pages.
See warnings and errors tied to pods, nodes, or deployments.
This is often the first place to look when a workload is stuck or crashes.
How this compares to Dashboard
What stays the same:
Log viewing
Event inspection
RBAC-aware actions
What improves:
Built-in exec sessions
Clearer layout and filtering
Fewer context switches between UI and CLI
10. Remove Kubernetes Dashboard
After Headlamp is working and your team is comfortable using it, you can remove Kubernetes Dashboard. This is the final cleanup step.
Removing Dashboard reduces clutter and avoids keeping unused access paths around.
Confirm Headlamp covers your needs
Before uninstalling anything, make sure:
Users can access the clusters they need in Headlamp.
Common tasks work:

browse resources
deploy with YAML
view logs and events
exec into pods (if allowed)
RBAC behaves as expected for different roles.
Once these checks pass, you are ready to remove Dashboard.
Uninstall the Dashboard
If you installed Kubernetes Dashboard with Helm, remove it with:
helm uninstall kubernetes-dashboard -n kubernetes-dashboard


If Dashboard was installed by a manifest or addon, remove it using the same method you used to install it.
After removal, confirm the resources are gone:
kubectl get pods -n kubernetes-dashboard


Clean up access artifacts (recommended)
Many Dashboard setups used dedicated service accounts and cluster-wide roles.
Review and remove anything that was created only for Dashboard access, such as:
service accounts
role bindings or cluster role bindings
old documentation that points users to Dashboard URLs or port-forward commands
This reduces long-lived credentials and unused permissions.
Communicate the change
Make sure your team knows:
Headlamp is now the primary Kubernetes UI.
How to access it (desktop or URL).
Where to go for help if something feels different.
11. Post-migration checklist
This final checklist helps you confirm the migration is complete. It gives you confidence that Headlamp is working as expected and that nothing important was left behind.
Access and visibility

 Headlamp opens without errors.
 Users can access the correct clusters.
 Namespace filtering works as expected.
 Multi-cluster switching behaves correctly.
Authentication and RBAC

 Desktop users access clusters using kubeconfig.
 In-cluster users can sign in using the chosen auth method.
 Users only see actions their RBAC allows.
 No unexpected permission errors appear during normal use.
Core workflows

 Resources load under Workloads, Network, and Configuration.
 YAML can be viewed and edited where permissions allow.
 Applications can be deployed using Create and YAML.
 Logs load correctly for running pods.
 Exec works for users who are allowed to use it.
 Metrics appear if metrics-server is installed.
Operational confidence

 Teams can troubleshoot without switching tools.
 Map View helps explain relationships during debugging.
 Platform or DevOps teams know how Headlamp is installed and managed.
Cleanup confirmation

 Kubernetes Dashboard is no longer running.
 Dashboard-only service accounts and RBAC bindings are removed.
 Internal docs no longer reference Dashboard URLs or port-forward commands.
Team alignment

 The team knows Headlamp is the default Kubernetes UI.
 Onboarding docs point new users to Headlamp.
 There is a clear path for feedback or questions.
You've now completed the move from Kubernetes Dashboard to Headlamp. Your team can use the same Kubernetes access model, work across clusters, and rely on workflows that match how Kubernetes is used today. From here, Headlamp becomes your default UI, whether on the desktop or in shared environments. As your needs grow, you can keep using it as-is or extend it with plugins and new views over time.
If you want to help shape what comes next, join the Headlamp community and contribute at headlamp.dev.
