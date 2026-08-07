---
title: "The Invisible Rewrite: Modernizing the Kubernetes Image Promoter"
link: "https://kubernetes.io/blog/2026/03/17/image-promoter-rewrite/"
guid: "https://kubernetes.io/blog/2026/03/17/image-promoter-rewrite/"
pubDate: "2026-03-17T00:00:00.000Z"
site_name: "Kubernetes"
site_feed: "https://kubernetes.io/feed.xml"
category: "Infra"
summary: "Every container image you pull from registry.k8s.io got there through\nkpromo, the Kubernetes image\npromoter. It copies images from staging registries to\nproduction, signs them with cosign, replicates\nsignatures across more than 20 regional mirrors, and generates\nSLSA provenance attestations. If this tool breaks, no\nKubernetes release ships. Over the past few weeks, we rewrote its core from\nscratch, deleted 20% of the codebase, made it dramatically faster, and\nnobody noticed. That was the whole point.\nA bit of history\nThe image promoter started in late 2018 as an internal Google project by\nLinus Arver. The goal was simple: replace the\nmanual, Googler-gated process of copying container images into k8s.gcr.io with\na community-owned, GitOps-based workflow. Push to a staging registry, open a PR\nwith a YAML manifest, get it reviewed and merged, and automation handles the\nrest. KEP-1734\nformalized this proposal.\nIn early 2019, the code moved to kubernetes-sigs/k8s-container-image-promoter\nand grew quickly. Over the next few years,\nStephen Augustus consolidated multiple tools\n(cip, gh2gcs, krel promote-images, promobot-files) into a single CLI\ncalled kpromo. The repository was renamed to\npromo-tools.\nAdolfo Garcia Veytia (Puerco) added cosign signing\nand SBOM support. Tyler Ferrara built\nvulnerability scanning. Carlos Panato kept the project in a healthy and\nreleasable state. 42 contributors made about 3,500 commits across more than 60 releases.\nIt worked. But by 2025 the codebase carried the weight of seven years of\nincremental additions from multiple SIGs and subprojects. The README\nsaid it plainly:\nyou will see duplicated code, multiple techniques for accomplishing the same\nthing, and several TODOs.\nThe problems we needed to solve\nProduction promotion jobs for Kubernetes core images regularly took over 30\nminutes and frequently failed with rate limit errors. The core promotion logic\nhad grown into a monolith that was\nhard to extend\nand difficult to test, making new features like provenance or vulnerability\nscanning painful to add.\nOn the SIG Release roadmap,\ntwo work items had been sitting for a while: \"Rewrite artifact promoter\" and\n\"Make artifact validation more robust\". We had discussed these at SIG Release\nmeetings and KubeCons, and the open research spikes on\nproject board #171 captured\neight questions that needed answers before we could move forward.\nOne issue to answer them all\nIn February 2026, we opened issue #1701\n(\"Rewrite artifact promoter pipeline\") and answered all eight spikes in a single\ntracking issue. The rewrite was deliberately phased so that each step could be\nreviewed, merged, and validated independently. Here is what we did:\nPhase 1: Rate Limiting (#1702).\nRewrote rate limiting to properly throttle all registry operations with adaptive\nbackoff.\nPhase 2: Interfaces (#1704).\nPut registry and auth operations behind clean interfaces so they can be swapped\nout and tested independently.\nPhase 3: Pipeline Engine (#1705).\nBuilt a pipeline engine that runs promotion as a sequence of distinct phases\ninstead of one large function.\nPhase 4: Provenance (#1706).\nAdded SLSA provenance verification for staging images.\nPhase 5: Scanner and SBOMs (#1709).\nAdded vulnerability scanning and SBOM support. Flipped the default to the new\npipeline engine. At this point we cut\nv4.2.0 and let it\nsoak in production before continuing.\nPhase 6: Split Signing from Replication (#1713).\nSeparated image signing from signature replication into their own pipeline\nphases, eliminating the rate limit contention that caused most production\nfailures.\nPhase 7: Remove Legacy Pipeline (#1712).\nDeleted the old code path entirely.\nPhase 8: Remove Legacy Dependencies (#1716).\nDeleted the audit subsystem, deprecated tools, and e2e test infrastructure.\nPhase 9: Delete the Monolith (#1718).\nRemoved the old monolithic core and its supporting packages. Thousands of lines\ndeleted across phases 7 through 9.\nEach phase shipped independently.\nv4.3.0 followed\nthe next day with the legacy code fully removed.\nWith the new architecture in place, a series of follow-up improvements landed:\nparallelized registry reads\n(#1736),\nretry logic for all network operations\n(#1742),\nper-request timeouts to prevent pipeline hangs\n(#1763),\nHTTP connection reuse\n(#1759),\nlocal registry integration tests\n(#1746),\nthe removal of deprecated credential file support\n(#1758),\na rework of attestation handling to use cosign's OCI APIs and the removal of\ndeprecated SBOM support\n(#1764),\nand a dedicated promotion record predicate type registered with the\nin-toto attestation framework\n(#1767).\nThese would have been much harder to land without the clean separation the\nrewrite provided.\nv4.4.0\nshipped all of these improvements and enabled provenance generation and\nverification by default.\nThe new pipeline\nThe promotion pipeline now has seven clearly separated phases:\ngraph LR\nSetup --> Plan --> Provenance --> Validate --> Promote --> Sign --> Attest\nPhase\nWhat it does\n\n\n\n\nSetup\nValidate options, prewarm TUF cache.\n\n\nPlan\nParse manifests, read registries, compute which images need promotion.\n\n\nProvenance\nVerify SLSA attestations on staging images.\n\n\nValidate\nCheck cosign signatures, exit here for dry runs.\n\n\nPromote\nCopy images server-side, preserving digests.\n\n\nSign\nSign promoted images with keyless cosign.\n\n\nAttest\nGenerate promotion provenance attestations using a dedicated in-toto predicate type.\n\n\n\nPhases run sequentially, so each one gets exclusive access to the full rate\nlimit budget. No more contention. Signature replication to mirror registries is\nno longer part of this pipeline and runs as a\ndedicated periodic Prow job\ninstead.\nMaking it fast\nWith the architecture in place, we turned to performance.\nParallel registry reads (#1736):\nThe plan phase reads 1,350 registries. We parallelized this and the plan phase\ndropped from about 20 minutes to about 2 minutes.\nTwo-phase tag listing (#1761):\nInstead of checking all 46,000 image groups across more than 20 mirrors, we first check\nonly the source repositories. About 57% of images have no signatures at all\nbecause they were promoted before signing was enabled. We skip those entirely,\ncutting API calls roughly in half.\nSource check before replication (#1727):\nBefore iterating all mirrors for a given image, we check if the signature\nexists on the primary registry first. In steady state where most signatures are\nalready replicated, this reduced the work from about 17 hours to about 15\nminutes.\nPer-request timeouts (#1763):\nWe observed intermittent hangs where a stalled connection blocked the pipeline\nfor over 9 hours. Every network operation now has its own timeout and transient\nfailures are retried automatically.\nConnection reuse (#1759):\nWe started reusing HTTP connections and auth state across operations, eliminating\nredundant token negotiations. This closed a\nlong-standing request\nfrom 2023.\nBy the numbers\nHere is what the rewrite looks like in aggregate.\nOver 40 PRs merged, 3 releases shipped (v4.2.0, v4.3.0, v4.4.0)\nOver 10,000 lines added and over 16,000 lines deleted, a net reduction\nof about 5,000 lines (20% smaller codebase)\nPerformance drastically improved across the board\nRobustness improved with retry logic, per-request timeouts, and adaptive rate limiting\n19 long-standing issues closed\nThe codebase shrank by a fifth while gaining provenance attestations, a pipeline\nengine, vulnerability scanning integration, parallelized operations, retry\nlogic, integration tests against local registries, and a standalone signature\nreplication mode.\nNo user-facing changes\nThis was a hard requirement. The kpromo cip command accepts the same flags and\nreads the same YAML manifests. The\npost-k8sio-image-promo\nProw job continued working throughout. The promotion manifests in\nkubernetes/k8s.io did not change. Nobody\nhad to update their workflows or configuration.\nWe caught two regressions early in production. One (#1731)\ncaused a registry key mismatch that made every image appear as \"lost\" so that\nnothing was promoted. Another (#1733)\nset the default thread count to zero, blocking all goroutines. Both were fixed\nwithin hours. The phased release strategy (v4.2.0 with the new engine, v4.3.0\nwith legacy code removed) gave us a clear rollback path that we fortunately\nnever needed.\nWhat comes next\nSignature replication across all mirror registries remains the most expensive\npart of the promotion cycle. Issue #1762\nproposes eliminating it entirely by having\narcheio (the registry.k8s.io\nredirect service) route signature tag requests to a single canonical upstream\ninstead of per-region backends. Another option would be to move signing closer\nto the registry infrastructure itself. Both approaches need further discussion\nwith the SIG Release and infrastructure teams, but either one would remove\nthousands of API calls per promotion cycle and simplify the codebase even\nfurther.\nThank you\nThis project has been a community effort spanning seven years. Thank you to\nLinus,\nStephen,\nAdolfo,\nCarlos,\nBen,\nMarko,\nLauri,\nTyler,\nArnaud, and many others who contributed\ncode, reviews, and planning over the years. The SIG Release and Release\nEngineering communities provided the context, the discussions, and the patience\nfor a rewrite of infrastructure that every Kubernetes release depends on.\nIf you want to get involved, join us in\n#release-management on the\nKubernetes Slack or check out the\nrepository."
contentHtml: "<p>Every container image you pull from <code>registry.k8s.io</code> got there through\n<a href=\"https://github.com/kubernetes-sigs/promo-tools\"><code>kpromo</code></a>, the Kubernetes image\npromoter. It copies images from staging registries to\nproduction, signs them with <a href=\"https://sigstore.dev\">cosign</a>, replicates\nsignatures across more than 20 regional mirrors, and generates\n<a href=\"https://slsa.dev\">SLSA</a> provenance attestations. If this tool breaks, no\nKubernetes release ships. Over the past few weeks, we rewrote its core from\nscratch, deleted 20% of the codebase, made it dramatically faster, and\nnobody noticed. That was the whole point.</p>\n<h2 id=\"a-bit-of-history\">A bit of history<a class=\"td-heading-self-link\" href=\"#a-bit-of-history\" aria-label=\"Heading self-link\"></a></h2><p>The image promoter started in late 2018 as an internal Google project by\n<a href=\"https://github.com/listx\">Linus Arver</a>. The goal was simple: replace the\nmanual, Googler-gated process of copying container images into <code>k8s.gcr.io</code> with\na community-owned, GitOps-based workflow. Push to a staging registry, open a PR\nwith a YAML manifest, get it reviewed and merged, and automation handles the\nrest. <a href=\"https://github.com/kubernetes/enhancements/blob/master/keps/sig-release/1734-k8s-image-promoter/README.md\">KEP-1734</a>\nformalized this proposal.</p>\n<p>In early 2019, the code moved to <code>kubernetes-sigs/k8s-container-image-promoter</code>\nand grew quickly. Over the next few years,\n<a href=\"https://github.com/justaugustus\">Stephen Augustus</a> consolidated multiple tools\n(<code>cip</code>, <code>gh2gcs</code>, <code>krel promote-images</code>, <code>promobot-files</code>) into a single CLI\ncalled <code>kpromo</code>. The repository was renamed to\n<a href=\"https://github.com/kubernetes-sigs/promo-tools\"><code>promo-tools</code></a>.\n<a href=\"https://github.com/puerco\">Adolfo Garcia Veytia (Puerco)</a> added cosign signing\nand SBOM support. <a href=\"https://github.com/tylerferrara\">Tyler Ferrara</a> built\nvulnerability scanning. <a href=\"https://github.com/cpanato\">Carlos Panato</a> kept the project in a healthy and\nreleasable state. 42 contributors made about 3,500 commits across more than 60 releases.</p>\n<p>It worked. But by 2025 the codebase carried the weight of seven years of\nincremental additions from multiple SIGs and subprojects. The README\n<a href=\"https://github.com/kubernetes-sigs/promo-tools/blob/7b6d515b78aadd617c8060a223786f8e57aa061f/README.md#disclaimer\">said it plainly</a>:\nyou will see duplicated code, multiple techniques for accomplishing the same\nthing, and several TODOs.</p>\n<h2 id=\"the-problems-we-needed-to-solve\">The problems we needed to solve<a class=\"td-heading-self-link\" href=\"#the-problems-we-needed-to-solve\" aria-label=\"Heading self-link\"></a></h2><p>Production promotion jobs for Kubernetes core images regularly took over 30\nminutes and frequently failed with rate limit errors. The core promotion logic\nhad grown into a monolith that was\n<a href=\"https://github.com/kubernetes-sigs/promo-tools/issues/1177\">hard to extend</a>\nand difficult to test, making new features like provenance or vulnerability\nscanning painful to add.</p>\n<p>On the <a href=\"https://github.com/kubernetes/sig-release/blob/master/roadmap.md\">SIG Release roadmap</a>,\ntwo work items had been sitting for a while: &quot;Rewrite artifact promoter&quot; and\n&quot;Make artifact validation more robust&quot;. We had discussed these at SIG Release\nmeetings and KubeCons, and the open research spikes on\n<a href=\"https://github.com/orgs/kubernetes/projects/171\">project board #171</a> captured\neight questions that needed answers before we could move forward.</p>\n<h2 id=\"one-issue-to-answer-them-all\">One issue to answer them all<a class=\"td-heading-self-link\" href=\"#one-issue-to-answer-them-all\" aria-label=\"Heading self-link\"></a></h2><p>In February 2026, we opened <a href=\"https://github.com/kubernetes-sigs/promo-tools/issues/1701\">issue #1701</a>\n(&quot;Rewrite artifact promoter pipeline&quot;) and answered all eight spikes in a single\ntracking issue. The rewrite was deliberately phased so that each step could be\nreviewed, merged, and validated independently. Here is what we did:</p>\n<p><strong>Phase 1: Rate Limiting</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1702\">#1702</a>).\nRewrote rate limiting to properly throttle all registry operations with adaptive\nbackoff.</p>\n<p><strong>Phase 2: Interfaces</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1704\">#1704</a>).\nPut registry and auth operations behind clean interfaces so they can be swapped\nout and tested independently.</p>\n<p><strong>Phase 3: Pipeline Engine</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1705\">#1705</a>).\nBuilt a pipeline engine that runs promotion as a sequence of distinct phases\ninstead of one large function.</p>\n<p><strong>Phase 4: Provenance</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1706\">#1706</a>).\nAdded SLSA provenance verification for staging images.</p>\n<p><strong>Phase 5: Scanner and SBOMs</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1709\">#1709</a>).\nAdded vulnerability scanning and SBOM support. Flipped the default to the new\npipeline engine. At this point we cut\n<a href=\"https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.2.0\">v4.2.0</a> and let it\nsoak in production before continuing.</p>\n<p><strong>Phase 6: Split Signing from Replication</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1713\">#1713</a>).\nSeparated image signing from signature replication into their own pipeline\nphases, eliminating the rate limit contention that caused most production\nfailures.</p>\n<p><strong>Phase 7: Remove Legacy Pipeline</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1712\">#1712</a>).\nDeleted the old code path entirely.</p>\n<p><strong>Phase 8: Remove Legacy Dependencies</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1716\">#1716</a>).\nDeleted the audit subsystem, deprecated tools, and e2e test infrastructure.</p>\n<p><strong>Phase 9: Delete the Monolith</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1718\">#1718</a>).\nRemoved the old monolithic core and its supporting packages. Thousands of lines\ndeleted across phases 7 through 9.</p>\n<p>Each phase shipped independently.\n<a href=\"https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.3.0\">v4.3.0</a> followed\nthe next day with the legacy code fully removed.</p>\n<p>With the new architecture in place, a series of follow-up improvements landed:\nparallelized registry reads\n(<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1736\">#1736</a>),\nretry logic for all network operations\n(<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1742\">#1742</a>),\nper-request timeouts to prevent pipeline hangs\n(<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1763\">#1763</a>),\nHTTP connection reuse\n(<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1759\">#1759</a>),\nlocal registry integration tests\n(<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1746\">#1746</a>),\nthe removal of deprecated credential file support\n(<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1758\">#1758</a>),\na rework of attestation handling to use cosign's OCI APIs and the removal of\ndeprecated SBOM support\n(<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1764\">#1764</a>),\nand a dedicated promotion record predicate type registered with the\n<a href=\"https://github.com/in-toto/attestation\">in-toto attestation framework</a>\n(<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1767\">#1767</a>).\nThese would have been much harder to land without the clean separation the\nrewrite provided.\n<a href=\"https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.4.0\">v4.4.0</a>\nshipped all of these improvements and enabled provenance generation and\nverification by default.</p>\n<h2 id=\"the-new-pipeline\">The new pipeline<a class=\"td-heading-self-link\" href=\"#the-new-pipeline\" aria-label=\"Heading self-link\"></a></h2><p>The promotion pipeline now has seven clearly separated phases:</p>\n<pre class=\"mermaid\">graph LR\nSetup --&gt; Plan --&gt; Provenance --&gt; Validate --&gt; Promote --&gt; Sign --&gt; Attest</pre>\n<table>\n<thead>\n<tr>\n<th>Phase</th>\n<th>What it does</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><strong>Setup</strong></td>\n<td>Validate options, prewarm TUF cache.</td>\n</tr>\n<tr>\n<td><strong>Plan</strong></td>\n<td>Parse manifests, read registries, compute which images need promotion.</td>\n</tr>\n<tr>\n<td><strong>Provenance</strong></td>\n<td>Verify SLSA attestations on staging images.</td>\n</tr>\n<tr>\n<td><strong>Validate</strong></td>\n<td>Check cosign signatures, exit here for dry runs.</td>\n</tr>\n<tr>\n<td><strong>Promote</strong></td>\n<td>Copy images server-side, preserving digests.</td>\n</tr>\n<tr>\n<td><strong>Sign</strong></td>\n<td>Sign promoted images with keyless cosign.</td>\n</tr>\n<tr>\n<td><strong>Attest</strong></td>\n<td>Generate promotion provenance attestations using a dedicated <a href=\"https://in-toto.io\">in-toto</a> predicate type.</td>\n</tr>\n</tbody>\n</table>\n<p>Phases run sequentially, so each one gets exclusive access to the full rate\nlimit budget. No more contention. Signature replication to mirror registries is\nno longer part of this pipeline and runs as a\n<a href=\"https://prow.k8s.io/?job=ci-k8sio-image-signature-replication\">dedicated periodic Prow job</a>\ninstead.</p>\n<h2 id=\"making-it-fast\">Making it fast<a class=\"td-heading-self-link\" href=\"#making-it-fast\" aria-label=\"Heading self-link\"></a></h2><p>With the architecture in place, we turned to performance.</p>\n<p><strong>Parallel registry reads</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1736\">#1736</a>):\nThe plan phase reads 1,350 registries. We parallelized this and the plan phase\ndropped from about 20 minutes to about 2 minutes.</p>\n<p><strong>Two-phase tag listing</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1761\">#1761</a>):\nInstead of checking all 46,000 image groups across more than 20 mirrors, we first check\nonly the source repositories. About 57% of images have no signatures at all\nbecause they were promoted before signing was enabled. We skip those entirely,\ncutting API calls roughly in half.</p>\n<p><strong>Source check before replication</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1727\">#1727</a>):\nBefore iterating all mirrors for a given image, we check if the signature\nexists on the primary registry first. In steady state where most signatures are\nalready replicated, this reduced the work from about 17 hours to about 15\nminutes.</p>\n<p><strong>Per-request timeouts</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1763\">#1763</a>):\nWe observed intermittent hangs where a stalled connection blocked the pipeline\nfor over 9 hours. Every network operation now has its own timeout and transient\nfailures are retried automatically.</p>\n<p><strong>Connection reuse</strong> (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1759\">#1759</a>):\nWe started reusing HTTP connections and auth state across operations, eliminating\nredundant token negotiations. This closed a\n<a href=\"https://github.com/kubernetes-sigs/promo-tools/issues/842\">long-standing request</a>\nfrom 2023.</p>\n<h2 id=\"by-the-numbers\">By the numbers<a class=\"td-heading-self-link\" href=\"#by-the-numbers\" aria-label=\"Heading self-link\"></a></h2><p>Here is what the rewrite looks like in aggregate.</p>\n<ul>\n<li>Over 40 PRs merged, 3 releases shipped (<a href=\"https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.2.0\">v4.2.0</a>, <a href=\"https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.3.0\">v4.3.0</a>, <a href=\"https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.4.0\">v4.4.0</a>)</li>\n<li>Over 10,000 lines added and over 16,000 lines deleted, a net reduction\nof about 5,000 lines (20% smaller codebase)</li>\n<li>Performance drastically improved across the board</li>\n<li>Robustness improved with retry logic, per-request timeouts, and adaptive rate limiting</li>\n<li>19 long-standing issues closed</li>\n</ul>\n<p>The codebase shrank by a fifth while gaining provenance attestations, a pipeline\nengine, vulnerability scanning integration, parallelized operations, retry\nlogic, integration tests against local registries, and a standalone signature\nreplication mode.</p>\n<h2 id=\"no-user-facing-changes\">No user-facing changes<a class=\"td-heading-self-link\" href=\"#no-user-facing-changes\" aria-label=\"Heading self-link\"></a></h2><p>This was a hard requirement. The <code>kpromo cip</code> command accepts the same flags and\nreads the same YAML manifests. The\n<a href=\"https://prow.k8s.io/?job=post-k8sio-image-promo\"><code>post-k8sio-image-promo</code></a>\nProw job continued working throughout. The promotion manifests in\n<a href=\"https://github.com/kubernetes/k8s.io\">kubernetes/k8s.io</a> did not change. Nobody\nhad to update their workflows or configuration.</p>\n<p>We caught two regressions early in production. One (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1731\">#1731</a>)\ncaused a registry key mismatch that made every image appear as &quot;lost&quot; so that\nnothing was promoted. Another (<a href=\"https://github.com/kubernetes-sigs/promo-tools/pull/1733\">#1733</a>)\nset the default thread count to zero, blocking all goroutines. Both were fixed\nwithin hours. The phased release strategy (<a href=\"https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.2.0\">v4.2.0</a> with the new engine, <a href=\"https://github.com/kubernetes-sigs/promo-tools/releases/tag/v4.3.0\">v4.3.0</a>\nwith legacy code removed) gave us a clear rollback path that we fortunately\nnever needed.</p>\n<h2 id=\"what-comes-next\">What comes next<a class=\"td-heading-self-link\" href=\"#what-comes-next\" aria-label=\"Heading self-link\"></a></h2><p>Signature replication across all mirror registries remains the most expensive\npart of the promotion cycle. <a href=\"https://github.com/kubernetes-sigs/promo-tools/issues/1762\">Issue #1762</a>\nproposes eliminating it entirely by having\n<a href=\"https://github.com/kubernetes/registry.k8s.io\">archeio</a> (the <code>registry.k8s.io</code>\nredirect service) route signature tag requests to a single canonical upstream\ninstead of per-region backends. Another option would be to move signing closer\nto the registry infrastructure itself. Both approaches need further discussion\nwith the SIG Release and infrastructure teams, but either one would remove\nthousands of API calls per promotion cycle and simplify the codebase even\nfurther.</p>\n<h2 id=\"thank-you\">Thank you<a class=\"td-heading-self-link\" href=\"#thank-you\" aria-label=\"Heading self-link\"></a></h2><p>This project has been a community effort spanning seven years. Thank you to\n<a href=\"https://github.com/listx\">Linus</a>,\n<a href=\"https://github.com/justaugustus\">Stephen</a>,\n<a href=\"https://github.com/puerco\">Adolfo</a>,\n<a href=\"https://github.com/cpanato\">Carlos</a>,\n<a href=\"https://github.com/BenTheElder\">Ben</a>,\n<a href=\"https://github.com/xmudrii\">Marko</a>,\n<a href=\"https://github.com/lasomethingsomething\">Lauri</a>,\n<a href=\"https://github.com/tylerferrara\">Tyler</a>,\n<a href=\"https://github.com/ameukam\">Arnaud</a>, and many others who contributed\ncode, reviews, and planning over the years. The SIG Release and Release\nEngineering communities provided the context, the discussions, and the patience\nfor a rewrite of infrastructure that every Kubernetes release depends on.</p>\n<p>If you want to get involved, join us in\n<a href=\"https://kubernetes.slack.com/archives/C2C40FMNF\"><code>#release-management</code></a> on the\nKubernetes Slack or check out the\n<a href=\"https://github.com/kubernetes-sigs/promo-tools\">repository</a>.</p>"
---

Every container image you pull from registry.k8s.io got there through
kpromo, the Kubernetes image
promoter. It copies images from staging registries to
production, signs them with cosign, replicates
signatures across more than 20 regional mirrors, and generates
SLSA provenance attestations. If this tool breaks, no
Kubernetes release ships. Over the past few weeks, we rewrote its core from
scratch, deleted 20% of the codebase, made it dramatically faster, and
nobody noticed. That was the whole point.
A bit of history
The image promoter started in late 2018 as an internal Google project by
Linus Arver. The goal was simple: replace the
manual, Googler-gated process of copying container images into k8s.gcr.io with
a community-owned, GitOps-based workflow. Push to a staging registry, open a PR
with a YAML manifest, get it reviewed and merged, and automation handles the
rest. KEP-1734
formalized this proposal.
In early 2019, the code moved to kubernetes-sigs/k8s-container-image-promoter
and grew quickly. Over the next few years,
Stephen Augustus consolidated multiple tools
(cip, gh2gcs, krel promote-images, promobot-files) into a single CLI
called kpromo. The repository was renamed to
promo-tools.
Adolfo Garcia Veytia (Puerco) added cosign signing
and SBOM support. Tyler Ferrara built
vulnerability scanning. Carlos Panato kept the project in a healthy and
releasable state. 42 contributors made about 3,500 commits across more than 60 releases.
It worked. But by 2025 the codebase carried the weight of seven years of
incremental additions from multiple SIGs and subprojects. The README
said it plainly:
you will see duplicated code, multiple techniques for accomplishing the same
thing, and several TODOs.
The problems we needed to solve
Production promotion jobs for Kubernetes core images regularly took over 30
minutes and frequently failed with rate limit errors. The core promotion logic
had grown into a monolith that was
hard to extend
and difficult to test, making new features like provenance or vulnerability
scanning painful to add.
On the SIG Release roadmap,
two work items had been sitting for a while: "Rewrite artifact promoter" and
"Make artifact validation more robust". We had discussed these at SIG Release
meetings and KubeCons, and the open research spikes on
project board #171 captured
eight questions that needed answers before we could move forward.
One issue to answer them all
In February 2026, we opened issue #1701
("Rewrite artifact promoter pipeline") and answered all eight spikes in a single
tracking issue. The rewrite was deliberately phased so that each step could be
reviewed, merged, and validated independently. Here is what we did:
Phase 1: Rate Limiting (#1702).
Rewrote rate limiting to properly throttle all registry operations with adaptive
backoff.
Phase 2: Interfaces (#1704).
Put registry and auth operations behind clean interfaces so they can be swapped
out and tested independently.
Phase 3: Pipeline Engine (#1705).
Built a pipeline engine that runs promotion as a sequence of distinct phases
instead of one large function.
Phase 4: Provenance (#1706).
Added SLSA provenance verification for staging images.
Phase 5: Scanner and SBOMs (#1709).
Added vulnerability scanning and SBOM support. Flipped the default to the new
pipeline engine. At this point we cut
v4.2.0 and let it
soak in production before continuing.
Phase 6: Split Signing from Replication (#1713).
Separated image signing from signature replication into their own pipeline
phases, eliminating the rate limit contention that caused most production
failures.
Phase 7: Remove Legacy Pipeline (#1712).
Deleted the old code path entirely.
Phase 8: Remove Legacy Dependencies (#1716).
Deleted the audit subsystem, deprecated tools, and e2e test infrastructure.
Phase 9: Delete the Monolith (#1718).
Removed the old monolithic core and its supporting packages. Thousands of lines
deleted across phases 7 through 9.
Each phase shipped independently.
v4.3.0 followed
the next day with the legacy code fully removed.
With the new architecture in place, a series of follow-up improvements landed:
parallelized registry reads
(#1736),
retry logic for all network operations
(#1742),
per-request timeouts to prevent pipeline hangs
(#1763),
HTTP connection reuse
(#1759),
local registry integration tests
(#1746),
the removal of deprecated credential file support
(#1758),
a rework of attestation handling to use cosign's OCI APIs and the removal of
deprecated SBOM support
(#1764),
and a dedicated promotion record predicate type registered with the
in-toto attestation framework
(#1767).
These would have been much harder to land without the clean separation the
rewrite provided.
v4.4.0
shipped all of these improvements and enabled provenance generation and
verification by default.
The new pipeline
The promotion pipeline now has seven clearly separated phases:
graph LR
Setup --> Plan --> Provenance --> Validate --> Promote --> Sign --> Attest
Phase
What it does




Setup
Validate options, prewarm TUF cache.


Plan
Parse manifests, read registries, compute which images need promotion.


Provenance
Verify SLSA attestations on staging images.


Validate
Check cosign signatures, exit here for dry runs.


Promote
Copy images server-side, preserving digests.


Sign
Sign promoted images with keyless cosign.


Attest
Generate promotion provenance attestations using a dedicated in-toto predicate type.



Phases run sequentially, so each one gets exclusive access to the full rate
limit budget. No more contention. Signature replication to mirror registries is
no longer part of this pipeline and runs as a
dedicated periodic Prow job
instead.
Making it fast
With the architecture in place, we turned to performance.
Parallel registry reads (#1736):
The plan phase reads 1,350 registries. We parallelized this and the plan phase
dropped from about 20 minutes to about 2 minutes.
Two-phase tag listing (#1761):
Instead of checking all 46,000 image groups across more than 20 mirrors, we first check
only the source repositories. About 57% of images have no signatures at all
because they were promoted before signing was enabled. We skip those entirely,
cutting API calls roughly in half.
Source check before replication (#1727):
Before iterating all mirrors for a given image, we check if the signature
exists on the primary registry first. In steady state where most signatures are
already replicated, this reduced the work from about 17 hours to about 15
minutes.
Per-request timeouts (#1763):
We observed intermittent hangs where a stalled connection blocked the pipeline
for over 9 hours. Every network operation now has its own timeout and transient
failures are retried automatically.
Connection reuse (#1759):
We started reusing HTTP connections and auth state across operations, eliminating
redundant token negotiations. This closed a
long-standing request
from 2023.
By the numbers
Here is what the rewrite looks like in aggregate.
Over 40 PRs merged, 3 releases shipped (v4.2.0, v4.3.0, v4.4.0)
Over 10,000 lines added and over 16,000 lines deleted, a net reduction
of about 5,000 lines (20% smaller codebase)
Performance drastically improved across the board
Robustness improved with retry logic, per-request timeouts, and adaptive rate limiting
19 long-standing issues closed
The codebase shrank by a fifth while gaining provenance attestations, a pipeline
engine, vulnerability scanning integration, parallelized operations, retry
logic, integration tests against local registries, and a standalone signature
replication mode.
No user-facing changes
This was a hard requirement. The kpromo cip command accepts the same flags and
reads the same YAML manifests. The
post-k8sio-image-promo
Prow job continued working throughout. The promotion manifests in
kubernetes/k8s.io did not change. Nobody
had to update their workflows or configuration.
We caught two regressions early in production. One (#1731)
caused a registry key mismatch that made every image appear as "lost" so that
nothing was promoted. Another (#1733)
set the default thread count to zero, blocking all goroutines. Both were fixed
within hours. The phased release strategy (v4.2.0 with the new engine, v4.3.0
with legacy code removed) gave us a clear rollback path that we fortunately
never needed.
What comes next
Signature replication across all mirror registries remains the most expensive
part of the promotion cycle. Issue #1762
proposes eliminating it entirely by having
archeio (the registry.k8s.io
redirect service) route signature tag requests to a single canonical upstream
instead of per-region backends. Another option would be to move signing closer
to the registry infrastructure itself. Both approaches need further discussion
with the SIG Release and infrastructure teams, but either one would remove
thousands of API calls per promotion cycle and simplify the codebase even
further.
Thank you
This project has been a community effort spanning seven years. Thank you to
Linus,
Stephen,
Adolfo,
Carlos,
Ben,
Marko,
Lauri,
Tyler,
Arnaud, and many others who contributed
code, reviews, and planning over the years. The SIG Release and Release
Engineering communities provided the context, the discussions, and the patience
for a rewrite of infrastructure that every Kubernetes release depends on.
If you want to get involved, join us in
#release-management on the
Kubernetes Slack or check out the
repository.
