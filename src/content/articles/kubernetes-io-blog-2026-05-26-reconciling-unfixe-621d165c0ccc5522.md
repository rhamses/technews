---
title: "Reconciling the Past: Correcting Records for Unfixed Kubernetes CVEs"
link: "https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/"
guid: "https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/"
pubDate: "2026-05-26T17:30:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "The Kubernetes project relies on transparency to empower cluster administrators and security\nresearchers. One important way we do that is by publishing CVE records into the Common\nVulnerabilities and Exposures database. As part of our ongoing effort to mature the official\nKubernetes CVE Feed, we have identified\nsome discrepancies. CVE records for a few older, unfixed issues incorrectly include a\nfixed version field.\nThe Kubernetes Security Response Committee (SRC) will correct the affected CVE records on June 1, 2026.\nThis may result in vulnerability scanners identifying these vulnerabilities in places where\nthey were previously not detected.\nTo help reduce confusion, this post provides a technical update on three vulnerabilities that\nwere disclosed in previous years but remain unfixed: CVE-2020-8561, CVE-2020-8562,\nand CVE-2021-25740.\nWhy we are updating these records now\nWhile these vulnerabilities have been public for several years, the recent work to generate\nofficial Open Source Vulnerabilities (OSV) files revealed that their corresponding CVE records\ndid not accurately reflect their status. Specifically, some records suggested a fixed version\nexisted, when in reality, these issues are architectural design trade-offs that cannot be\nfully remediated through code without breaking fundamental Kubernetes functionality.\nCorrecting these records is vital for the community for:\nAutomation Fidelity: Modern vulnerability scanners depend on precise version ranges. Inaccurate fixed tags lead to false negatives, giving users a false sense of security.\nRisk Documentation: By formalizing these as unfixed, we ensure that platform providers and administrators are aware of the persistent need for administrative mitigations.\nFor completeness, we should also mention that\nCVE-2020-8554 is an unfixed CVE with a\ncorrect CVE record stating that it affects all versions. That record will also be updated to\nuse a more-standardized version number format.\nTechnical analysis of unfixed architectural risks\nThe following vulnerabilities will not be fixed by the Kubernetes project. GitHub issues remain\nthe best reference for the technical mechanics of these flaws.\nCVE-2020-8561: Webhook redirect in kube-apiserver\n\nSeverity: Medium (4.1).\nThe Issue: The kube-apiserver follows HTTP redirects when communicating with admission webhooks.\nAn actor capable of configuring an AdmissionWebhookConfiguration can redirect API server requests to internal, private networks.\nWhy it remains unfixed: Restricting this behavior would require breaking the standard HTTP client behavior\nthat many legitimate integrations rely on.\nMitigation: Set the API server log level to less than 10 (to prevent logging response bodies) and disable\ndynamic profiling (--profiling=false) to prevent unauthorized log-level changes.\nCVE-2020-8562: Proxy bypass via DNS TOCTOU\n\nSeverity: Low (3.1).\nThe Issue: A Time-of-Check to Time-of-Use (TOCTOU) race condition in the API server proxy allows users\nto bypass IP restrictions. The system performs a DNS check to validate an IP, but then performs a second\nresolution for the actual connection, which an attacker can manipulate.\nWhy it remains unfixed: Fixing this requires pinning resolved IPs in a way that breaks complex\nsplit-horizon DNS or dynamic IP environments.\nMitigation: Use a local DNS caching server like dnsmasq for the API server and configure min-cache-ttl\nto enforce consistent responses between the check and the connection.\nCVE-2021-25740: Cross-namespace forwarding via Endpoints\n\nSeverity: Low (3.1).\nThe Issue: A design flaw in the Endpoints and EndpointSlice API objects allows users to manually specify\nIP addresses, which can be used to point a LoadBalancer or Ingress toward backends in other namespaces.\nWhy it remains unfixed: This is a fundamental feature of the Endpoints API used by many networking tools\nand operators.\nMitigation: Restrict write access to Endpoints (legacy) and EndpointSlices. Since Kubernetes 1.22,\nKubernetes RBAC authorization mode no longer includes those permissions in the default edit and admin\nClusterRoles. That removal applies to clusters created using Kubernetes v1.22; for clusters upgraded from\nolder versions, administrators should manually audit and reconcile the system:aggregate-to-edit ClusterRole.\nNote:\nOn June 1, 2026, these CVE records will be updated to correctly reflect the fact that all versions are affected.\nYou may see them begin to appear in vulnerability scanner results.\nRequired actions for administrators\nThe Kubernetes project recommends a secure by configuration approach to manage these persistent risks:\nVulnerability\nAction item\nSeverity score (Rating)\nCommand / configuration\n\n\n\n\nCVE-2020-8561\nRestrict Log Verbosity\n4.1 (Medium)\nEnsure --v is set to < 10 and --profiling=false.\n\n\nCVE-2020-8562\nEnforce DNS Consistency\n3.1 (Low)\nDeploy dnsmasq or a similar caching resolver on control plane nodes.\n\n\nCVE-2021-25740\nHardened RBAC\n3.1 (Low)\nkubectl auth reconcile to remove Endpoints write access from broad roles.\n\n\n\nThe RBAC action for CVE-2021-25740 applies when your cluster uses RBAC authorization mode,\nwhich is the default for clusters created with standard Kubernetes tooling. Administrators\nshould independently test and validate these configurations in a non-production environment,\nassessing the architectural risks against their specific threat model and risk tolerance.\nConclusion: maturity through transparency\nThe effort to reconcile these records is a sign of a maturing security ecosystem. By moving away\nfrom the \"patch-only\" mindset and accurately documenting architectural debt, the Kubernetes\nproject provides the community with the high-fidelity data needed to secure modern cloud\nnative infrastructure.\nWe would like to thank the security researchers—QiQi Xu, Javier Provecho, and others—who\nidentified these risks, and the SIG Security Tooling contributors who continue to refine our\nofficial feeds. Special shoutout to Rory McCune for sharing information around these CVEs\nthrough his blog posts.\nUpdate 2026/06/01: Today, the Kubernetes SRC has updated the CVE records for CVE-2020-8554, CVE-2020-8561, CVE-2020-8562, and CVE-2021-25740."
contentHtml: "<div><p>By <b><a target=\"_blank\" href=\"https://github.com/PushkarJ\">Pushkar Joglekar</a> (Broadcom / SIG Security), <a target=\"_blank\" href=\"https://github.com/tabbysable\">Tabitha Sable</a> (Datadog / K8s Security Response Committee / SIG Security)</b> |\n</p><p>The Kubernetes project relies on transparency to empower cluster administrators and security\nresearchers. One important way we do that is by publishing CVE records into the Common\nVulnerabilities and Exposures database. As part of our ongoing effort to mature the official\n<a target=\"_blank\" href=\"https://kubernetes.io/docs/reference/issues-security/official-cve-feed/\">Kubernetes CVE Feed</a>, we have identified\nsome discrepancies. CVE records for a few older, unfixed issues incorrectly include a\n<em>fixed version</em> field.</p><p>The Kubernetes Security Response Committee (SRC) will correct the affected CVE records on June 1, 2026.\nThis may result in vulnerability scanners identifying these vulnerabilities in places where\nthey were previously not detected.</p><p>To help reduce confusion, this post provides a technical update on three vulnerabilities that\nwere disclosed in previous years but remain unfixed: <strong>CVE-2020-8561</strong>, <strong>CVE-2020-8562</strong>,\nand <strong>CVE-2021-25740</strong>.</p><h2 id=\"why-we-are-updating-these-records-now\">Why we are updating these records now<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/#why-we-are-updating-these-records-now\"></a></h2><p>While these vulnerabilities have been public for several years, the recent work to generate\nofficial Open Source Vulnerabilities (OSV) files revealed that their corresponding CVE records\ndid not accurately reflect their status. Specifically, some records suggested a <em>fixed</em> version\nexisted, when in reality, these issues are architectural design trade-offs that cannot be\nfully remediated through code without breaking fundamental Kubernetes functionality.</p><p>Correcting these records is vital for the community for:</p><ul><li><strong>Automation Fidelity</strong>: Modern vulnerability scanners depend on precise version ranges. Inaccurate <em>fixed</em> tags lead to false negatives, giving users a false sense of security.</li><li><strong>Risk Documentation</strong>: By formalizing these as <em>unfixed</em>, we ensure that platform providers and administrators are aware of the persistent need for administrative mitigations.</li></ul><p>For completeness, we should also mention that\n<a target=\"_blank\" href=\"https://www.cve.org/cverecord?id=CVE-2020-8554\">CVE-2020-8554</a> is an unfixed CVE with a\ncorrect CVE record stating that it affects all versions. That record will also be updated to\nuse a more-standardized version number format.</p><h2 id=\"technical-analysis-of-unfixed-architectural-risks\">Technical analysis of unfixed architectural risks<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/#technical-analysis-of-unfixed-architectural-risks\"></a></h2><p>The following vulnerabilities will not be fixed by the Kubernetes project. GitHub issues remain\nthe best reference for the technical mechanics of these flaws.</p><h3 id=\"cve-2020-8561-webhook-redirect-in-kube-apiserver\"><a target=\"_blank\" href=\"https://github.com/kubernetes/kubernetes/issues/104720\">CVE-2020-8561</a>: Webhook redirect in kube-apiserver<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/#cve-2020-8561-webhook-redirect-in-kube-apiserver\"></a></h3><ul><li><strong>Severity</strong>: Medium (4.1).</li><li><strong>The Issue</strong>: The kube-apiserver follows HTTP redirects when communicating with admission webhooks.\nAn actor capable of configuring an AdmissionWebhookConfiguration can redirect API server requests to internal, private networks.</li><li><strong>Why it remains unfixed</strong>: Restricting this behavior would require breaking the standard HTTP client behavior\nthat many legitimate integrations rely on.</li><li><strong>Mitigation</strong>: Set the API server log level to less than 10 (to prevent logging response bodies) and disable\ndynamic profiling (<code>--profiling=false</code>) to prevent unauthorized log-level changes.</li></ul><h3 id=\"cve-2020-8562-proxy-bypass-via-dns-toctou\"><a target=\"_blank\" href=\"https://github.com/kubernetes/kubernetes/issues/101493\">CVE-2020-8562</a>: Proxy bypass via DNS TOCTOU<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/#cve-2020-8562-proxy-bypass-via-dns-toctou\"></a></h3><ul><li><strong>Severity</strong>: Low (3.1).</li><li><strong>The Issue</strong>: A Time-of-Check to Time-of-Use (TOCTOU) race condition in the API server proxy allows users\nto bypass IP restrictions. The system performs a DNS check to validate an IP, but then performs a second\nresolution for the actual connection, which an attacker can manipulate.</li><li><strong>Why it remains unfixed</strong>: Fixing this requires pinning resolved IPs in a way that breaks complex\nsplit-horizon DNS or dynamic IP environments.</li><li><strong>Mitigation</strong>: Use a local DNS caching server like dnsmasq for the API server and configure <code>min-cache-ttl</code>\nto enforce consistent responses between the check and the connection.</li></ul><h3 id=\"cve-2021-25740-cross-namespace-forwarding-via-endpoints\"><a target=\"_blank\" href=\"https://github.com/kubernetes/kubernetes/issues/103675\">CVE-2021-25740</a>: Cross-namespace forwarding via Endpoints<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/#cve-2021-25740-cross-namespace-forwarding-via-endpoints\"></a></h3><ul><li><strong>Severity</strong>: Low (3.1).</li><li><strong>The Issue</strong>: A design flaw in the Endpoints and EndpointSlice API objects allows users to manually specify\nIP addresses, which can be used to point a LoadBalancer or Ingress toward backends in other namespaces.</li><li><strong>Why it remains unfixed</strong>: This is a fundamental feature of the Endpoints API used by many networking tools\nand operators.</li><li><strong>Mitigation</strong>: Restrict write access to Endpoints (legacy) and EndpointSlices. Since Kubernetes 1.22,\nKubernetes RBAC authorization mode no longer includes those permissions in the default <em>edit</em> and <em>admin</em>\nClusterRoles. That removal applies to clusters created using Kubernetes v1.22; for clusters upgraded from\nolder versions, administrators should manually audit and reconcile the <code>system:aggregate-to-edit</code> ClusterRole.</li></ul><div><h4>Note:</h4><p>On June 1, 2026, these CVE records will be updated to correctly reflect the fact that all versions are affected.\nYou may see them begin to appear in vulnerability scanner results.</p></div><h2 id=\"required-actions-for-administrators\">Required actions for administrators<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/#required-actions-for-administrators\"></a></h2><p>The Kubernetes project recommends a <em>secure by configuration</em> approach to manage these persistent risks:</p><table><thead><tr><th>Vulnerability</th><th>Action item</th><th>Severity score (Rating)</th><th>Command / configuration</th></tr></thead><tbody><tr><td><strong>CVE-2020-8561</strong></td><td>Restrict Log Verbosity</td><td>4.1 (Medium)</td><td>Ensure <code>--v</code> is set to <code>&lt; 10</code> and <code>--profiling=false</code>.</td></tr><tr><td><strong>CVE-2020-8562</strong></td><td>Enforce DNS Consistency</td><td>3.1 (Low)</td><td>Deploy dnsmasq or a similar caching resolver on control plane nodes.</td></tr><tr><td><strong>CVE-2021-25740</strong></td><td>Hardened RBAC</td><td>3.1 (Low)</td><td><code>kubectl auth reconcile</code> to remove Endpoints write access from broad roles.</td></tr></tbody></table><p>The RBAC action for CVE-2021-25740 applies when your cluster uses RBAC authorization mode,\nwhich is the default for clusters created with standard Kubernetes tooling. Administrators\nshould independently test and validate these configurations in a non-production environment,\nassessing the architectural risks against their specific threat model and risk tolerance.</p><h2 id=\"conclusion-maturity-through-transparency\">Conclusion: maturity through transparency<a target=\"_blank\" href=\"https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/#conclusion-maturity-through-transparency\"></a></h2><p>The effort to reconcile these records is a sign of a maturing security ecosystem. By moving away\nfrom the \"patch-only\" mindset and accurately documenting architectural debt, the Kubernetes\nproject provides the community with the high-fidelity data needed to secure modern cloud\nnative infrastructure.</p><p>We would like to thank the security researchers—QiQi Xu, Javier Provecho, and others—who\nidentified these risks, and the SIG Security Tooling contributors who continue to refine our\nofficial feeds. Special shoutout to Rory McCune for sharing information around these CVEs\nthrough his blog posts.</p><p><em>Update 2026/06/01: Today, the Kubernetes SRC has updated the CVE records for CVE-2020-8554, CVE-2020-8561, CVE-2020-8562, and CVE-2021-25740.</em></p></div>"
---

The Kubernetes project relies on transparency to empower cluster administrators and security
researchers. One important way we do that is by publishing CVE records into the Common
Vulnerabilities and Exposures database. As part of our ongoing effort to mature the official
Kubernetes CVE Feed, we have identified
some discrepancies. CVE records for a few older, unfixed issues incorrectly include a
fixed version field.
The Kubernetes Security Response Committee (SRC) will correct the affected CVE records on June 1, 2026.
This may result in vulnerability scanners identifying these vulnerabilities in places where
they were previously not detected.
To help reduce confusion, this post provides a technical update on three vulnerabilities that
were disclosed in previous years but remain unfixed: CVE-2020-8561, CVE-2020-8562,
and CVE-2021-25740.
Why we are updating these records now
While these vulnerabilities have been public for several years, the recent work to generate
official Open Source Vulnerabilities (OSV) files revealed that their corresponding CVE records
did not accurately reflect their status. Specifically, some records suggested a fixed version
existed, when in reality, these issues are architectural design trade-offs that cannot be
fully remediated through code without breaking fundamental Kubernetes functionality.
Correcting these records is vital for the community for:
Automation Fidelity: Modern vulnerability scanners depend on precise version ranges. Inaccurate fixed tags lead to false negatives, giving users a false sense of security.
Risk Documentation: By formalizing these as unfixed, we ensure that platform providers and administrators are aware of the persistent need for administrative mitigations.
For completeness, we should also mention that
CVE-2020-8554 is an unfixed CVE with a
correct CVE record stating that it affects all versions. That record will also be updated to
use a more-standardized version number format.
Technical analysis of unfixed architectural risks
The following vulnerabilities will not be fixed by the Kubernetes project. GitHub issues remain
the best reference for the technical mechanics of these flaws.
CVE-2020-8561: Webhook redirect in kube-apiserver

Severity: Medium (4.1).
The Issue: The kube-apiserver follows HTTP redirects when communicating with admission webhooks.
An actor capable of configuring an AdmissionWebhookConfiguration can redirect API server requests to internal, private networks.
Why it remains unfixed: Restricting this behavior would require breaking the standard HTTP client behavior
that many legitimate integrations rely on.
Mitigation: Set the API server log level to less than 10 (to prevent logging response bodies) and disable
dynamic profiling (--profiling=false) to prevent unauthorized log-level changes.
CVE-2020-8562: Proxy bypass via DNS TOCTOU

Severity: Low (3.1).
The Issue: A Time-of-Check to Time-of-Use (TOCTOU) race condition in the API server proxy allows users
to bypass IP restrictions. The system performs a DNS check to validate an IP, but then performs a second
resolution for the actual connection, which an attacker can manipulate.
Why it remains unfixed: Fixing this requires pinning resolved IPs in a way that breaks complex
split-horizon DNS or dynamic IP environments.
Mitigation: Use a local DNS caching server like dnsmasq for the API server and configure min-cache-ttl
to enforce consistent responses between the check and the connection.
CVE-2021-25740: Cross-namespace forwarding via Endpoints

Severity: Low (3.1).
The Issue: A design flaw in the Endpoints and EndpointSlice API objects allows users to manually specify
IP addresses, which can be used to point a LoadBalancer or Ingress toward backends in other namespaces.
Why it remains unfixed: This is a fundamental feature of the Endpoints API used by many networking tools
and operators.
Mitigation: Restrict write access to Endpoints (legacy) and EndpointSlices. Since Kubernetes 1.22,
Kubernetes RBAC authorization mode no longer includes those permissions in the default edit and admin
ClusterRoles. That removal applies to clusters created using Kubernetes v1.22; for clusters upgraded from
older versions, administrators should manually audit and reconcile the system:aggregate-to-edit ClusterRole.
Note:
On June 1, 2026, these CVE records will be updated to correctly reflect the fact that all versions are affected.
You may see them begin to appear in vulnerability scanner results.
Required actions for administrators
The Kubernetes project recommends a secure by configuration approach to manage these persistent risks:
Vulnerability
Action item
Severity score (Rating)
Command / configuration




CVE-2020-8561
Restrict Log Verbosity
4.1 (Medium)
Ensure --v is set to < 10 and --profiling=false.


CVE-2020-8562
Enforce DNS Consistency
3.1 (Low)
Deploy dnsmasq or a similar caching resolver on control plane nodes.


CVE-2021-25740
Hardened RBAC
3.1 (Low)
kubectl auth reconcile to remove Endpoints write access from broad roles.



The RBAC action for CVE-2021-25740 applies when your cluster uses RBAC authorization mode,
which is the default for clusters created with standard Kubernetes tooling. Administrators
should independently test and validate these configurations in a non-production environment,
assessing the architectural risks against their specific threat model and risk tolerance.
Conclusion: maturity through transparency
The effort to reconcile these records is a sign of a maturing security ecosystem. By moving away
from the "patch-only" mindset and accurately documenting architectural debt, the Kubernetes
project provides the community with the high-fidelity data needed to secure modern cloud
native infrastructure.
We would like to thank the security researchers—QiQi Xu, Javier Provecho, and others—who
identified these risks, and the SIG Security Tooling contributors who continue to refine our
official feeds. Special shoutout to Rory McCune for sharing information around these CVEs
through his blog posts.
Update 2026/06/01: Today, the Kubernetes SRC has updated the CVE records for CVE-2020-8554, CVE-2020-8561, CVE-2020-8562, and CVE-2021-25740.
