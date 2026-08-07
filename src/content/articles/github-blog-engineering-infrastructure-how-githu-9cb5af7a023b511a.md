---
title: "How GitHub uses eBPF to improve deployment safety"
link: "https://github.blog/engineering/infrastructure/how-github-uses-ebpf-to-improve-deployment-safety/"
guid: "https://github.blog/engineering/infrastructure/how-github-uses-ebpf-to-improve-deployment-safety/"
pubDate: "2026-04-16T16:00:00.000Z"
site_name: "GitHub Engineering"
site_feed: "https://github.blog/engineering.atom"
category: "Engineering"
summary: "Did you know that, at GitHub, we host all of our own source code on github.com? We do this because we’re our own biggest customer—testing out changes internally before they go to users. However, there’s one downside: If github.com were ever to go down, we wouldn’t be able to access our own source code.\nThis is what you’d call a very simple circular dependency: to deploy GitHub, we needed GitHub. If GitHub is down, then we wouldn’t be able to deploy something to fix it. We mitigate this by maintaining a mirror of our code for fixing forward and built assets for rolling back.\nSo we’re done, right? Problem solved? Nope, there are more circular dependencies to consider. For example, how do you stop a deployment script introducing a circular dependency of its own on an internal service or downloading a binary from GitHub?\nWhen we started to design our new host-based deployment system, we evaluated some new approaches to prevent deployment code from creating circular dependencies. We found that using eBPF, we could selectively monitor and block those calls. In this blog post, we’ll take you through our findings and show how you can get started writing your own eBPF programs.\nTypes of circular dependencies\nLet’s start by looking at the types of circular dependencies through a hypothetical scenario.\nSuppose a MySQL outage occurs, which causes GitHub to be unable to serve release data from repositories. To resolve the incident, we need to roll out a configuration change to the stateful MySQL nodes that are impacted. This configuration change is applied by executing a deploy script on each node.\nNow, let’s look at the different types of circular dependencies that could impact GitHub during this scenario.\nDirect dependency: The MySQL deploy script attempts to pull the latest release of an open source tool from GitHub. Since GitHub can’t serve the release data (due to the outage), the script can’t complete.  \n\n\n\n\n\nHidden dependencies: The MySQL deploy script uses a servicing tool that is already present on the machine’s disk. However, when the tool runs, it checks GitHub to see if an update is available. If it’s unable to contact GitHub (due to the outage), the script may fail or hang, depending on how the tool handles the error when checking for updates.\n\n\n\n\n\nTransient dependencies: The MySQL deploy script calls, via an API, another internal service (for example, a migrations service), which in turn attempts to fetch the latest release of an open source tool from GitHub to use the new binary. The failure propagates back to the deploy script.\n\n\n\n\nHow do you solve these circular dependencies?\nUntil recently, the onus has been on every team who that owns stateful hosts to review their deployment scripts and identify circular dependencies.\nIn practice, however, many dependencies aren’t identified until an incident occurs, which can delay recovery.\nThe obvious route would be to block access to github.com from the machines to validate that the system can deploy without it. But these hosts are stateful and serve customer traffic even during rolling deploys, drains, or restarts. Blocking github.com entirely would impact their ability to handle production requests.\nThis is where we started to look at eBPF, which lets you load custom programs into the Linux kernel and hook into core system primitives like networking.\nWe were particularly interested in the BPF_PROG_TYPE_CGROUP_SKB program type because it lets you hook network egress from a particular cGroup.\nA cGroup is a Linux primitive (used heavily by Docker but not limited to it) that enforces resource limits and isolation for sets of processes. You can create a cGroup, configure it, and move processes into it—no Docker required.\nThis started to look very promising. Could we create a cGroup, place only the deployment script inside it, and then limit the outbound network access of only that script? It certainly looked possible, so we started to build a proof of concept.\nBuilding out per-process conditional network filtering with eBPF\nWe started on a proof of concept in go that used the cilium/ebpf library.\nebpf-go is a pure-Go library to read, modify, and load eBPF programs and attach them to various hooks in the Linux kernel.\nIt massively simplifies the process of authoring, building, and running programs that use eBPF. For example, to hook the BPF_PROG_TYPE_CGROUP_SKB program type, we can do this as follows: 👇\n//go:generate go tool bpf2go -tags linux bpf cgroup_skb.c -- -I../headers \n\n \n\nfunc main() { \n\n   // Load pre-compiled programs and maps into the kernel. \n\n   objs := bpfObjects{} \n\n   if err := loadBpfObjects(&objs, nil); err != nil { \n\n       log.Fatalf(\"loading objects: %v\", err) \n\n   } \n\n   defer objs.Close() \n\n \n\n   // Link the count_egress_packets program to the cgroup. \n\n   l, err := link.AttachCgroup(link.CgroupOptions{ \n\n       Path:    \"/sys/fs/cgroup/system.slice\", \n\n       Attach:  ebpf.AttachCGroupInetEgress, \n\n       Program: objs.CountEgressPackets, \n\n   }) \n\n   if err != nil { \n\n       log.Fatal(err) \n\n   } \n\n   defer l.Close() \n\n \n\n   log.Println(\"Counting packets...\") \n\n \n\n   // Read loop reporting the total amount of times the kernel \n\n   // function was entered, once per second. \n\n   ticker := time.NewTicker(1 * time.Second) \n\n   defer ticker.Stop() \n\n \n\n   for range ticker.C { \n\n       var value uint64 \n\n       if err := objs.PktCount.Lookup(uint32(0), &value); err != nil { \n\n           log.Fatalf(\"reading map: %v\", err) \n\n       } \n\n       log.Printf(\"number of packets: %d\\n\", value) \n\n   } \n\n} \n\n\n\n\nWith the eBPF program:\n//go:build ignore \n\n \n\n#include \"common.h\" \n\n \n\nchar __license[] SEC(\"license\") = \"Dual MIT/GPL\"; \n\n \n\nstruct { \n\n   __uint(type, BPF_MAP_TYPE_ARRAY); \n\n   __type(key, u32); \n\n   __type(value, u64); \n\n   __uint(max_entries, 1); \n\n} pkt_count SEC(\".maps\"); \n\n \n\nSEC(\"cgroup_skb/egress\") \n\nint count_egress_packets(struct __sk_buff *skb) { \n\n   u32 key      = 0; \n\n   u64 init_val = 1; \n\n \n\n   u64 *count = bpf_map_lookup_elem(&pkt_count, &key); \n\n   if (!count) { \n\n       bpf_map_update_elem(&pkt_count, &key, &init_val, BPF_ANY); \n\n       return 1; \n\n   } \n\n   __sync_fetch_and_add(count, 1); \n\n \n\n   return 1; \n\n} \n\n\n\n\nThe //go:generate line handles compiling the eBPF C code and auto-generating the bpfObjects struct, which allows us to attach and interact with the program. This means a simple go build is all you need. 🥳\n(cilium/ebpf has a great set of examples to get started. Review the full code from above).\nThere was still a missing piece though: CGROUP_SKB operates on IP addresses. Given the breadth of GitHub’s systems and rate of change, keeping an up-to-date block IP list would be very hard.\nCould we use more eBPF to create a DNS-based blocked list? Yes, it turns out we could.\nAn eBPF program type of BPF_PROG_TYPE_CGROUP_SOCK_ADDR allows you to hook syscalls to create sockets and change the destination IP.\nHere is a simplified example where we rewrite any connect4 syscall targeting DNS (Port 53) to localhost:53.\ncgroupLink, err := link.AttachCgroup(link.CgroupOptions{ \n\n       Path:    cgroup.Name(), \n\n       Attach:  ebpf.AttachCGroupInet4Connect, \n\n       Program: obj.Connect4, \n\n   }) \n\n   if err != nil { \n\n       return nil, fmt.Errorf(\"attaching eBPF program Connect4 to cgroup: %w\", err) \n\n   } \n\n\n\n\n/* This is the hexadecimal representation of 127.0.0.1 address */ \n\nconst __u32 ADDRESS_LOCALHOST_NETBYTEORDER = bpf_htonl(0x7f000001); \n\n \n\nSEC(\"cgroup/connect4\") \n\nint connect4(struct bpf_sock_addr *ctx) { \n\n __be32 original_ip = ctx->user_ip4; \n\n __u16 original_port = bpf_ntohs(ctx->user_port); \n\n \n\n if (ctx->user_port == bpf_htons(53)) { \n\n   /* For DNS Query (*:53) rewire service to backend \n\n    * 127.0.0.1:const_dns_proxy_port */ \n\n   ctx->user_ip4 = const_mitm_proxy_address; \n\n   ctx->user_port = bpf_htons(const_dns_proxy_port); \n\n } \n\n \n\n return 1; \n\n} \n\n\n\n\nWe used this to intercept DNS queries from the cGroup and forward them to a userspace DNS proxy we run.\nNow, any DNS queries initiated by the deployment script are routed through our DNS proxy. Our proxy evaluates each requested domain against our block list and uses eBPF Maps to communicate with the CGROUP_SKB program, allowing or denying the request accordingly.\nIf you’d like to dig into the code, here’s an early proof of concept we put together. Our current implementation has progressed since then, but this should serve as a good intro.\nLike any fun project, the deeper we got, the more we realized we could do.\nFor example, could we correlate blocked DNS requests back to the specific command or process that triggered them, so teams could more easily debug and fix issues? Yes, we can!\nInside the BPF_PROG_TYPE_CGROUP_SKB program type, we have the skb_buff from which we can pull the DNS transaction ID and also capture the Process ID (PID) that initiated the request. We place this information into another eBPF Map tracking DNS Transaction ID -> Process ID.\nHere is a simplified version of the eBPF code (see this PoC code for full example):\n  __u32 pid = bpf_get_current_pid_tgid() >> 32; \n\n     __u16 skb_read_offset = sizeof(struct iphdr) + sizeof(struct udphdr); \n\n     __u16 dns_transaction_id = \n\n         get_transaction_id_from_dns_header(skb, skb_read_offset); \n\n \n\n     if (pid && dns_transaction_id != 0) { \n\n       bpf_map_update_elem(&dns_transaction_id_to_pid, &dns_transaction_id, \n\n                           pid, BPF_ANY); \n\n     } \n\n\n\n\nAs we’re redirecting all DNS calls to our userspace DNS proxy, we can look at the transaction ID of each request, find the domain being resolved, and lookup in the eBPF Map to see which process made the request. By reading /proc/{PID}/cmdline, we can even extract the full command line that triggered the request.\nThen we can output a log line with all the information:\n> WARN DNS BLOCKED reason=FromDNSRequest blocked=true blockedAt=dns domain=github.com. pid=266767 cmd=\"curl github.com \" firewallMethod=blocklist\n\n\n\n\nWith that, we’re done.\nWe can now:\nConditionally block domains that would cause circular dependencies from deployment scripts.\nInform the owning team which command triggered the blocked request.\nProvide an audit list of all domains contacted during a deployment.\nUse the cGroups to enforce CPU and memory limits on deploy scripts, preventing runaway resource usage from impacting workloads.\nWhat’s next?\nOur new circular dependency detection process is live after a six-month rollout.\nNow, if a team accidentally adds a problematic dependency, or if an existing binary tool we use takes a new dependency, the tooling will detect that problem and flag it to the team.\nThe net result is a more stable GitHub and faster mean time to recovery during incidents (due to the removal of these circular dependencies).\nAre there ways for circular dependencies to still trip things up? You bet—and we’ll look to improve the tool as we discover them.\nWant to dive in?\nHas this piqued your interest in what you might be able to do with eBPF?\nGet started by having a look through the examples in cilium/ebpf and the great documentation on the docs.ebpf.io site.\nIf you’re not quite ready to start writing your own eBPF tools, try open source tools powered by eBPF, like bpftrace for deep tracing or ptcpdump to get TCP dumps with container-level metadata.\n\nThe post How GitHub uses eBPF to improve deployment safety appeared first on The GitHub Blog."
author: "Lawrence Gripper"
contentHtml: "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\" \"http://www.w3.org/TR/REC-html40/loose.dtd\">\n<html><body><p class=\"wp-block-paragraph\">Did you know that, at GitHub, we host all of our own source code on <a href=\"http://github.com\">github.com</a>? We do this because we&rsquo;re our own biggest customer&mdash;testing out changes internally before they go to users. However, there&rsquo;s one downside: If github.com were ever to go down, we wouldn&rsquo;t be able to access our own source code.</p>\n\n\n\n<p class=\"wp-block-paragraph\">This is what you&rsquo;d call a very simple circular dependency: to deploy GitHub, we needed GitHub. If GitHub is down, then we wouldn&rsquo;t be able to deploy something to fix it. We mitigate this by maintaining a mirror of our code for fixing forward and built assets for rolling back.</p>\n\n\n\n<p class=\"wp-block-paragraph\">So we&rsquo;re done, right? Problem solved? Nope, there are more circular dependencies to consider. For example, how do you stop a deployment script introducing a circular dependency of its own on an internal service or downloading a binary from GitHub?</p>\n\n\n\n<p class=\"wp-block-paragraph\">When we started to design our new host-based deployment system, we evaluated some new approaches to prevent deployment code from creating circular dependencies. We found that using eBPF, we could selectively monitor and block those calls. In this blog post, we&rsquo;ll take you through our findings and show how you can get started writing your own eBPF programs.</p>\n\n\n\n<h2 class=\"wp-block-heading\" id=\"h-types-of-circular-dependencies\">Types of circular dependencies</h2>\n\n\n\n<p class=\"wp-block-paragraph\">Let&rsquo;s start by looking at the types of circular dependencies through a hypothetical scenario.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Suppose a MySQL outage occurs, which causes GitHub to be unable to serve <code>release</code> data from repositories. To resolve the incident, we need to roll out a configuration change to the stateful MySQL nodes that are impacted. This configuration change is applied by executing a deploy script on each node.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Now, let&rsquo;s look at the different types of circular dependencies that could impact GitHub during this scenario.</p>\n\n\n\n<ol start=\"1\" class=\"wp-block-list\">\n<li><strong>Direct dependency</strong>: The MySQL deploy script attempts to pull the latest release of an&nbsp;open source&nbsp;tool from GitHub. Since GitHub&nbsp;can&rsquo;t&nbsp;serve the release data (due to the outage), the script&nbsp;can&rsquo;t&nbsp;complete.&nbsp;&nbsp;</li>\n</ol>\n\n\n\n<figure class=\"wp-block-image size-full\"><img data-recalc-dims=\"1\" loading=\"lazy\" decoding=\"async\" width=\"1433\" height=\"194\" src=\"https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.24-PM.png?resize=1433%2C194\" alt=\"Diagram showing a MySQL deploy script fails after attempting to pull the latest release of an&nbsp;open&nbsp;source&nbsp;tool from GitHub.\" class=\"wp-image-95085\" srcset=\"https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.24-PM.png?w=1433 1433w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.24-PM.png?w=300 300w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.24-PM.png?w=768 768w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.24-PM.png?w=1024 1024w\" sizes=\"auto, (max-width: 1000px) 100vw, 1000px\" /></figure>\n\n\n\n<ol start=\"2\" class=\"wp-block-list\">\n<li><strong>Hidden dependencies</strong>: The MySQL deploy script uses a servicing tool that is already present on the machine&rsquo;s disk. However, when the tool runs, it checks GitHub to see if an update is available. If it&rsquo;s unable to contact GitHub (due to the outage), the script may fail or hang, depending on how the tool handles the error when checking for updates.</li>\n</ol>\n\n\n\n<figure class=\"wp-block-image size-full\"><img data-recalc-dims=\"1\" loading=\"lazy\" decoding=\"async\" width=\"1439\" height=\"363\" src=\"https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.34-PM.png?resize=1439%2C363\" alt=\"Diagram showing a script failing after being unable to contact GitHub (due to the outage).\" class=\"wp-image-95086\" srcset=\"https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.34-PM.png?w=1439 1439w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.34-PM.png?w=300 300w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.34-PM.png?w=768 768w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.34-PM.png?w=1024 1024w\" sizes=\"auto, (max-width: 1000px) 100vw, 1000px\" /></figure>\n\n\n\n<ol start=\"3\" class=\"wp-block-list\">\n<li><strong>Transient dependencies</strong>: The MySQL deploy script calls, via an API, another internal service (for example, a migrations service), which in turn attempts to fetch the latest release of an open source tool from GitHub to use the new binary. The failure propagates back to the deploy script.</li>\n</ol>\n\n\n\n<figure class=\"wp-block-image size-full\"><img data-recalc-dims=\"1\" loading=\"lazy\" decoding=\"async\" width=\"1450\" height=\"202\" src=\"https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.41-PM.png?resize=1450%2C202\" alt=\"Diagram showing a MySQL deploy script calling, via an API, another internal service, which in turn attempts to fetch the latest release of an open source tool from GitHub to use the new binary. The failure propagates back to the deploy script.\" class=\"wp-image-95088\" srcset=\"https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.41-PM.png?w=1450 1450w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.41-PM.png?w=300 300w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.41-PM.png?w=768 768w, https://github.blog/wp-content/uploads/2026/04/Screenshot-2026-04-06-at-6.36.41-PM.png?w=1024 1024w\" sizes=\"auto, (max-width: 1000px) 100vw, 1000px\" /></figure>\n\n\n\n<h2 class=\"wp-block-heading\" id=\"h-how-do-you-solve-these-circular-dependencies\">How do you solve these circular dependencies?</h2>\n\n\n\n<p class=\"wp-block-paragraph\">Until recently, the onus has been on every team who that owns stateful hosts to review their deployment scripts and identify circular dependencies.</p>\n\n\n\n<p class=\"wp-block-paragraph\">In practice, however, many dependencies aren&rsquo;t identified until an incident occurs, which can delay recovery.</p>\n\n\n\n<p class=\"wp-block-paragraph\">The obvious route would be to block access to github.com from the machines to validate that the system can deploy without it. But these hosts are stateful and serve customer traffic even during rolling deploys, drains, or restarts. Blocking github.com entirely would impact their ability to handle production requests.</p>\n\n\n\n<p class=\"wp-block-paragraph\">This is where we started to look at eBPF, which lets you load custom programs into the Linux kernel and hook into core system primitives like networking.</p>\n\n\n\n<p class=\"wp-block-paragraph\">We were particularly interested in the <a href=\"https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_CGROUP_SKB/\"><code>BPF_PROG_TYPE_CGROUP_SKB</code> program type</a> because it lets you hook network egress from a particular cGroup.</p>\n\n\n\n<p class=\"wp-block-paragraph\">A <a href=\"https://en.wikipedia.org/wiki/Cgroups\">cGroup</a> is a Linux primitive (used heavily by Docker but not limited to it) that enforces resource limits and isolation for sets of processes. You can create a cGroup, configure it, and move processes into it&mdash;no Docker required.</p>\n\n\n\n<p class=\"wp-block-paragraph\">This started to look very promising. Could we create a cGroup, place only the deployment script inside it, and then limit the outbound network access of only that script? It certainly looked possible, so we started to build a proof of concept.</p>\n\n\n\n<h2 class=\"wp-block-heading\" id=\"h-building-out-per-process-conditional-network-filtering-with-ebpf\">Building out per-process conditional network filtering with eBPF</h2>\n\n\n\n<p class=\"wp-block-paragraph\">We started on a proof of concept in <code>go</code> that used the <code><a href=\"https://github.com/cilium/ebpf\">cilium/ebpf</a></code> library.</p>\n\n\n\n<p class=\"wp-block-paragraph\">ebpf-go is a pure-Go library to read, modify, and load eBPF programs and attach them to various hooks in the Linux kernel.</p>\n\n\n\n<p class=\"wp-block-paragraph\">It massively simplifies the process of authoring, building, and running programs that use eBPF. For example, to hook the <a href=\"https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_CGROUP_SKB/\"><code>BPF_PROG_TYPE_CGROUP_SKB</code> program type</a>, we can do this as follows: &#128071;</p>\n\n\n<div class=\"wp-block-code-wrapper\">\n<pre class=\"wp-block-code\"><code>//go:generate go tool bpf2go -tags linux bpf cgroup_skb.c -- -I../headers \n\n \n\nfunc main() { \n\n   // Load pre-compiled programs and maps into the kernel. \n\n   objs := bpfObjects{} \n\n   if err := loadBpfObjects(&amp;objs, nil); err != nil { \n\n       log.Fatalf(\"loading objects: %v\", err) \n\n   } \n\n   defer objs.Close() \n\n \n\n   // Link the count_egress_packets program to the cgroup. \n\n   l, err := link.AttachCgroup(link.CgroupOptions{ \n\n       Path:    \"/sys/fs/cgroup/system.slice\", \n\n       Attach:  ebpf.AttachCGroupInetEgress, \n\n       Program: objs.CountEgressPackets, \n\n   }) \n\n   if err != nil { \n\n       log.Fatal(err) \n\n   } \n\n   defer l.Close() \n\n \n\n   log.Println(\"Counting packets...\") \n\n \n\n   // Read loop reporting the total amount of times the kernel \n\n   // function was entered, once per second. \n\n   ticker := time.NewTicker(1 * time.Second) \n\n   defer ticker.Stop() \n\n \n\n   for range ticker.C { \n\n       var value uint64 \n\n       if err := objs.PktCount.Lookup(uint32(0), &amp;value); err != nil { \n\n           log.Fatalf(\"reading map: %v\", err) \n\n       } \n\n       log.Printf(\"number of packets: %d\\n\", value) \n\n   } \n\n} </code></pre>\n<clipboard-copy aria-label=\"Copy\" class=\"code-copy-btn\" data-copy-feedback=\"Copied!\" value='//go:generate go tool bpf2go -tags linux bpf cgroup_skb.c -- -I../headers \n\n \n\nfunc main() { \n\n   // Load pre-compiled programs and maps into the kernel. \n\n   objs := bpfObjects{} \n\n   if err := loadBpfObjects(&amp;objs, nil); err != nil { \n\n       log.Fatalf(\"loading objects: %v\", err) \n\n   } \n\n   defer objs.Close() \n\n \n\n   // Link the count_egress_packets program to the cgroup. \n\n   l, err := link.AttachCgroup(link.CgroupOptions{ \n\n       Path:    \"/sys/fs/cgroup/system.slice\", \n\n       Attach:  ebpf.AttachCGroupInetEgress, \n\n       Program: objs.CountEgressPackets, \n\n   }) \n\n   if err != nil { \n\n       log.Fatal(err) \n\n   } \n\n   defer l.Close() \n\n \n\n   log.Println(\"Counting packets...\") \n\n \n\n   // Read loop reporting the total amount of times the kernel \n\n   // function was entered, once per second. \n\n   ticker := time.NewTicker(1 * time.Second) \n\n   defer ticker.Stop() \n\n \n\n   for range ticker.C { \n\n       var value uint64 \n\n       if err := objs.PktCount.Lookup(uint32(0), &amp;value); err != nil { \n\n           log.Fatalf(\"reading map: %v\", err) \n\n       } \n\n       log.Printf(\"number of packets: %d\\n\", value) \n\n   } \n\n}' tabindex=\"0\" role=\"button\"><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-copy js-clipboard-copy-icon\"><path d=\"M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z\"></path><path d=\"M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z\"></path></svg><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-check js-clipboard-check-icon\"><path d=\"M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z\"></path></svg></clipboard-copy></div>\n\n\n<p class=\"wp-block-paragraph\">With the eBPF program:</p>\n\n\n<div class=\"wp-block-code-wrapper\">\n<pre class=\"wp-block-code\"><code>//go:build ignore \n\n \n\n#include \"common.h\" \n\n \n\nchar __license[] SEC(\"license\") = \"Dual MIT/GPL\"; \n\n \n\nstruct { \n\n   __uint(type, BPF_MAP_TYPE_ARRAY); \n\n   __type(key, u32); \n\n   __type(value, u64); \n\n   __uint(max_entries, 1); \n\n} pkt_count SEC(\".maps\"); \n\n \n\nSEC(\"cgroup_skb/egress\") \n\nint count_egress_packets(struct __sk_buff *skb) { \n\n   u32 key      = 0; \n\n   u64 init_val = 1; \n\n \n\n   u64 *count = bpf_map_lookup_elem(&amp;pkt_count, &amp;key); \n\n   if (!count) { \n\n       bpf_map_update_elem(&amp;pkt_count, &amp;key, &amp;init_val, BPF_ANY); \n\n       return 1; \n\n   } \n\n   __sync_fetch_and_add(count, 1); \n\n \n\n   return 1; \n\n} </code></pre>\n<clipboard-copy aria-label=\"Copy\" class=\"code-copy-btn\" data-copy-feedback=\"Copied!\" value='//go:build ignore \n\n \n\n#include \"common.h\" \n\n \n\nchar __license[] SEC(\"license\") = \"Dual MIT/GPL\"; \n\n \n\nstruct { \n\n   __uint(type, BPF_MAP_TYPE_ARRAY); \n\n   __type(key, u32); \n\n   __type(value, u64); \n\n   __uint(max_entries, 1); \n\n} pkt_count SEC(\".maps\"); \n\n \n\nSEC(\"cgroup_skb/egress\") \n\nint count_egress_packets(struct __sk_buff *skb) { \n\n   u32 key      = 0; \n\n   u64 init_val = 1; \n\n \n\n   u64 *count = bpf_map_lookup_elem(&amp;pkt_count, &amp;key); \n\n   if (!count) { \n\n       bpf_map_update_elem(&amp;pkt_count, &amp;key, &amp;init_val, BPF_ANY); \n\n       return 1; \n\n   } \n\n   __sync_fetch_and_add(count, 1); \n\n \n\n   return 1; \n\n}' tabindex=\"0\" role=\"button\"><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-copy js-clipboard-copy-icon\"><path d=\"M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z\"></path><path d=\"M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z\"></path></svg><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-check js-clipboard-check-icon\"><path d=\"M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z\"></path></svg></clipboard-copy></div>\n\n\n<p class=\"wp-block-paragraph\">The <code>//go:generate</code> line handles compiling the eBPF C code and auto-generating the <code>bpfObjects</code> struct, which allows us to attach and interact with the program. This means a simple <code>go build</code> is all you need. &#129395;</p>\n\n\n\n<p class=\"wp-block-paragraph\">(<code>cilium/ebpf</code> has a great set of examples to get started. <a href=\"https://github.com/cilium/ebpf/tree/main/examples/cgroup_skb\">Review the full code from above</a>).</p>\n\n\n\n<p class=\"wp-block-paragraph\">There was still a missing piece though: <code>CGROUP_SKB</code> operates on IP addresses. Given the breadth of GitHub&rsquo;s systems and rate of change, keeping an up-to-date block IP list would be very hard.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Could we use more eBPF to create a DNS-based blocked list? Yes, it turns out we could.</p>\n\n\n\n<p class=\"wp-block-paragraph\">An eBPF <a href=\"https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_CGROUP_SOCK_ADDR/\">program type of <code>BPF_PROG_TYPE_CGROUP_SOCK_ADDR</code></a> allows you to hook syscalls to create sockets <strong>and change the destination IP</strong>.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Here is a simplified example where we rewrite any <code>connect4</code> syscall targeting DNS (Port 53) to <code>localhost:53</code>.</p>\n\n\n<div class=\"wp-block-code-wrapper\">\n<pre class=\"wp-block-code\"><code>cgroupLink, err := link.AttachCgroup(link.CgroupOptions{ \n\n       Path:    cgroup.Name(), \n\n       Attach:  ebpf.AttachCGroupInet4Connect, \n\n       Program: obj.Connect4, \n\n   }) \n\n   if err != nil { \n\n       return nil, fmt.Errorf(\"attaching eBPF program Connect4 to cgroup: %w\", err) \n\n   } </code></pre>\n<clipboard-copy aria-label=\"Copy\" class=\"code-copy-btn\" data-copy-feedback=\"Copied!\" value='cgroupLink, err := link.AttachCgroup(link.CgroupOptions{ \n\n       Path:    cgroup.Name(), \n\n       Attach:  ebpf.AttachCGroupInet4Connect, \n\n       Program: obj.Connect4, \n\n   }) \n\n   if err != nil { \n\n       return nil, fmt.Errorf(\"attaching eBPF program Connect4 to cgroup: %w\", err) \n\n   }' tabindex=\"0\" role=\"button\"><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-copy js-clipboard-copy-icon\"><path d=\"M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z\"></path><path d=\"M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z\"></path></svg><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-check js-clipboard-check-icon\"><path d=\"M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z\"></path></svg></clipboard-copy></div>\n\n<div class=\"wp-block-code-wrapper\">\n<pre class=\"wp-block-code\"><code>/* This is the hexadecimal representation of 127.0.0.1 address */ \n\nconst __u32 ADDRESS_LOCALHOST_NETBYTEORDER = bpf_htonl(0x7f000001); \n\n \n\nSEC(\"cgroup/connect4\") \n\nint connect4(struct bpf_sock_addr *ctx) { \n\n __be32 original_ip = ctx-&gt;user_ip4; \n\n __u16 original_port = bpf_ntohs(ctx-&gt;user_port); \n\n \n\n if (ctx-&gt;user_port == bpf_htons(53)) { \n\n   /* For DNS Query (*:53) rewire service to backend \n\n    * 127.0.0.1:const_dns_proxy_port */ \n\n   ctx-&gt;user_ip4 = const_mitm_proxy_address; \n\n   ctx-&gt;user_port = bpf_htons(const_dns_proxy_port); \n\n } \n\n \n\n return 1; \n\n} </code></pre>\n<clipboard-copy aria-label=\"Copy\" class=\"code-copy-btn\" data-copy-feedback=\"Copied!\" value='/* This is the hexadecimal representation of 127.0.0.1 address */ \n\nconst __u32 ADDRESS_LOCALHOST_NETBYTEORDER = bpf_htonl(0x7f000001); \n\n \n\nSEC(\"cgroup/connect4\") \n\nint connect4(struct bpf_sock_addr *ctx) { \n\n __be32 original_ip = ctx-&gt;user_ip4; \n\n __u16 original_port = bpf_ntohs(ctx-&gt;user_port); \n\n \n\n if (ctx-&gt;user_port == bpf_htons(53)) { \n\n   /* For DNS Query (*:53) rewire service to backend \n\n    * 127.0.0.1:const_dns_proxy_port */ \n\n   ctx-&gt;user_ip4 = const_mitm_proxy_address; \n\n   ctx-&gt;user_port = bpf_htons(const_dns_proxy_port); \n\n } \n\n \n\n return 1; \n\n}' tabindex=\"0\" role=\"button\"><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-copy js-clipboard-copy-icon\"><path d=\"M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z\"></path><path d=\"M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z\"></path></svg><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-check js-clipboard-check-icon\"><path d=\"M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z\"></path></svg></clipboard-copy></div>\n\n\n<p class=\"wp-block-paragraph\">We used this to intercept DNS queries from the cGroup and forward them to a userspace DNS proxy we run.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Now, any DNS queries initiated by the deployment script are routed through our DNS proxy. Our proxy evaluates each requested domain against our block list and uses <a href=\"https://docs.ebpf.io/linux/concepts/maps/\">eBPF Maps</a> to communicate with the <code>CGROUP_SKB</code> program, allowing or denying the request accordingly.</p>\n\n\n\n<p class=\"wp-block-paragraph\">If you&rsquo;d like to dig into the code, here&rsquo;s <a href=\"https://github.com/lawrencegripper/ebpf-cgroup-firewall/\">an early proof of concept</a> we put together. Our current implementation has progressed since then, but this should serve as a good intro.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Like any fun project, the deeper we got, the more we realized we could do.</p>\n\n\n\n<p class=\"wp-block-paragraph\">For example, could we correlate blocked DNS requests back to the specific command or process that triggered them, so teams could more easily debug and fix issues? Yes, we can!</p>\n\n\n\n<p class=\"wp-block-paragraph\">Inside the <a href=\"https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_CGROUP_SKB/\"><code>BPF_PROG_TYPE_CGROUP_SKB</code> program type</a>, we have <a href=\"https://docs.ebpf.io/linux/program-context/__sk_buff/\">the <code>skb_buff</code></a> from which we can pull the <a href=\"https://beta.computer-networking.info/syllabus/default/protocols/dns.html\">DNS transaction ID</a> and also <a href=\"https://docs.ebpf.io/linux/helper-function/bpf_get_current_pid_tgid/\">capture the Process ID</a> (PID) that initiated the request. We place this information into another eBPF Map tracking <code>DNS Transaction ID -&gt; Process ID</code>.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Here is a simplified version of the eBPF code (see this <a href=\"https://github.com/lawrencegripper/ebpf-cgroup-firewall/blob/main/pkg/ebpf/bpf.c#L338-L360\">PoC code</a> for full example):</p>\n\n\n<div class=\"wp-block-code-wrapper\">\n<pre class=\"wp-block-code\"><code>  __u32 pid = bpf_get_current_pid_tgid() &gt;&gt; 32; \n\n     __u16 skb_read_offset = sizeof(struct iphdr) + sizeof(struct udphdr); \n\n     __u16 dns_transaction_id = \n\n         get_transaction_id_from_dns_header(skb, skb_read_offset); \n\n \n\n     if (pid &amp;&amp; dns_transaction_id != 0) { \n\n       bpf_map_update_elem(&amp;dns_transaction_id_to_pid, &amp;dns_transaction_id, \n\n                           pid, BPF_ANY); \n\n     } </code></pre>\n<clipboard-copy aria-label=\"Copy\" class=\"code-copy-btn\" data-copy-feedback=\"Copied!\" value=\"__u32 pid = bpf_get_current_pid_tgid() &gt;&gt; 32; \n\n     __u16 skb_read_offset = sizeof(struct iphdr) + sizeof(struct udphdr); \n\n     __u16 dns_transaction_id = \n\n         get_transaction_id_from_dns_header(skb, skb_read_offset); \n\n \n\n     if (pid &amp;&amp; dns_transaction_id != 0) { \n\n       bpf_map_update_elem(&amp;dns_transaction_id_to_pid, &amp;dns_transaction_id, \n\n                           pid, BPF_ANY); \n\n     }\" tabindex=\"0\" role=\"button\"><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-copy js-clipboard-copy-icon\"><path d=\"M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z\"></path><path d=\"M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z\"></path></svg><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-check js-clipboard-check-icon\"><path d=\"M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z\"></path></svg></clipboard-copy></div>\n\n\n<p class=\"wp-block-paragraph\">As we&rsquo;re redirecting all DNS calls to our userspace DNS proxy, we can look at the transaction ID of each request, find the domain being resolved, and lookup in the eBPF Map to see which process made the request. By reading <code>/proc/{PID}/cmdline</code>, we can even extract the full command line that triggered the request.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Then we can output a log line with all the information:</p>\n\n\n<div class=\"wp-block-code-wrapper\">\n<pre class=\"wp-block-code\"><code>&gt; WARN DNS BLOCKED reason=FromDNSRequest blocked=true blockedAt=dns domain=github.com. pid=266767 cmd=\"curl github.com \" firewallMethod=blocklist</code></pre>\n<clipboard-copy aria-label=\"Copy\" class=\"code-copy-btn\" data-copy-feedback=\"Copied!\" value='&gt; WARN DNS BLOCKED reason=FromDNSRequest blocked=true blockedAt=dns domain=github.com. pid=266767 cmd=\"curl github.com \" firewallMethod=blocklist' tabindex=\"0\" role=\"button\"><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-copy js-clipboard-copy-icon\"><path d=\"M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z\"></path><path d=\"M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z\"></path></svg><svg aria-hidden=\"true\" height=\"16\" viewbox=\"0 0 16 16\" version=\"1.1\" width=\"16\" class=\"octicon octicon-check js-clipboard-check-icon\"><path d=\"M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z\"></path></svg></clipboard-copy></div>\n\n\n<p class=\"wp-block-paragraph\">With that, we&rsquo;re done.</p>\n\n\n\n<p class=\"wp-block-paragraph\">We can now:</p>\n\n\n\n<ul class=\"wp-block-list\">\n<li>Conditionally block domains that would cause circular dependencies from deployment scripts.</li>\n\n\n\n<li>Inform the owning team which command triggered the blocked request.</li>\n\n\n\n<li>Provide an audit list of all domains contacted during a deployment.</li>\n\n\n\n<li>Use the cGroups to enforce CPU and memory limits on deploy scripts, preventing runaway resource usage from impacting workloads.</li>\n</ul>\n\n\n\n<h2 class=\"wp-block-heading\" id=\"h-what-s-next\">What&rsquo;s next?</h2>\n\n\n\n<p class=\"wp-block-paragraph\">Our new circular dependency detection process is live after a six-month rollout.</p>\n\n\n\n<p class=\"wp-block-paragraph\">Now, if a team accidentally adds a problematic dependency, or if an existing binary tool we use takes a new dependency, the tooling will detect that problem and flag it to the team.</p>\n\n\n\n<p class=\"wp-block-paragraph\">The net result is a more stable GitHub and faster mean time to recovery during incidents (due to the removal of these circular dependencies).</p>\n\n\n\n<p class=\"wp-block-paragraph\">Are there ways for circular dependencies to still trip things up? You bet&mdash;and we&rsquo;ll look to improve the tool as we discover them.</p>\n\n\n\n<h2 class=\"wp-block-heading\" id=\"h-want-to-dive-in\">Want to dive in?</h2>\n\n\n\n<p class=\"wp-block-paragraph\">Has this piqued your interest in what you might be able to do with eBPF?</p>\n\n\n\n<p class=\"wp-block-paragraph\">Get started by having a look through the examples in <a href=\"https://github.com/cilium/ebpf/tree/main/examples\">cilium/ebpf</a> and the great documentation on the <a href=\"http://docs.ebpf.io\">docs.ebpf.io</a> site.</p>\n\n\n\n<p class=\"wp-block-paragraph\">If you&rsquo;re not quite ready to start writing your own eBPF tools, try open source tools powered by eBPF, like <a href=\"https://bpftrace.org/tutorial-one-liners#lesson-3-file-opens\">bpftrace for deep tracing</a> or <a href=\"https://github.com/mozillazg/ptcpdump\">ptcpdump to get TCP dumps</a> with container-level metadata.</p>\n</body></html>\n<p>The post <a href=\"https://github.blog/engineering/infrastructure/how-github-uses-ebpf-to-improve-deployment-safety/\">How GitHub uses eBPF to improve deployment safety</a> appeared first on <a href=\"https://github.blog\">The GitHub Blog</a>.</p>"
---

Did you know that, at GitHub, we host all of our own source code on github.com? We do this because we’re our own biggest customer—testing out changes internally before they go to users. However, there’s one downside: If github.com were ever to go down, we wouldn’t be able to access our own source code.
This is what you’d call a very simple circular dependency: to deploy GitHub, we needed GitHub. If GitHub is down, then we wouldn’t be able to deploy something to fix it. We mitigate this by maintaining a mirror of our code for fixing forward and built assets for rolling back.
So we’re done, right? Problem solved? Nope, there are more circular dependencies to consider. For example, how do you stop a deployment script introducing a circular dependency of its own on an internal service or downloading a binary from GitHub?
When we started to design our new host-based deployment system, we evaluated some new approaches to prevent deployment code from creating circular dependencies. We found that using eBPF, we could selectively monitor and block those calls. In this blog post, we’ll take you through our findings and show how you can get started writing your own eBPF programs.
Types of circular dependencies
Let’s start by looking at the types of circular dependencies through a hypothetical scenario.
Suppose a MySQL outage occurs, which causes GitHub to be unable to serve release data from repositories. To resolve the incident, we need to roll out a configuration change to the stateful MySQL nodes that are impacted. This configuration change is applied by executing a deploy script on each node.
Now, let’s look at the different types of circular dependencies that could impact GitHub during this scenario.
Direct dependency: The MySQL deploy script attempts to pull the latest release of an open source tool from GitHub. Since GitHub can’t serve the release data (due to the outage), the script can’t complete.  





Hidden dependencies: The MySQL deploy script uses a servicing tool that is already present on the machine’s disk. However, when the tool runs, it checks GitHub to see if an update is available. If it’s unable to contact GitHub (due to the outage), the script may fail or hang, depending on how the tool handles the error when checking for updates.





Transient dependencies: The MySQL deploy script calls, via an API, another internal service (for example, a migrations service), which in turn attempts to fetch the latest release of an open source tool from GitHub to use the new binary. The failure propagates back to the deploy script.




How do you solve these circular dependencies?
Until recently, the onus has been on every team who that owns stateful hosts to review their deployment scripts and identify circular dependencies.
In practice, however, many dependencies aren’t identified until an incident occurs, which can delay recovery.
The obvious route would be to block access to github.com from the machines to validate that the system can deploy without it. But these hosts are stateful and serve customer traffic even during rolling deploys, drains, or restarts. Blocking github.com entirely would impact their ability to handle production requests.
This is where we started to look at eBPF, which lets you load custom programs into the Linux kernel and hook into core system primitives like networking.
We were particularly interested in the BPF_PROG_TYPE_CGROUP_SKB program type because it lets you hook network egress from a particular cGroup.
A cGroup is a Linux primitive (used heavily by Docker but not limited to it) that enforces resource limits and isolation for sets of processes. You can create a cGroup, configure it, and move processes into it—no Docker required.
This started to look very promising. Could we create a cGroup, place only the deployment script inside it, and then limit the outbound network access of only that script? It certainly looked possible, so we started to build a proof of concept.
Building out per-process conditional network filtering with eBPF
We started on a proof of concept in go that used the cilium/ebpf library.
ebpf-go is a pure-Go library to read, modify, and load eBPF programs and attach them to various hooks in the Linux kernel.
It massively simplifies the process of authoring, building, and running programs that use eBPF. For example, to hook the BPF_PROG_TYPE_CGROUP_SKB program type, we can do this as follows: 👇
//go:generate go tool bpf2go -tags linux bpf cgroup_skb.c -- -I../headers 

 

func main() { 

   // Load pre-compiled programs and maps into the kernel. 

   objs := bpfObjects{} 

   if err := loadBpfObjects(&objs, nil); err != nil { 

       log.Fatalf("loading objects: %v", err) 

   } 

   defer objs.Close() 

 

   // Link the count_egress_packets program to the cgroup. 

   l, err := link.AttachCgroup(link.CgroupOptions{ 

       Path:    "/sys/fs/cgroup/system.slice", 

       Attach:  ebpf.AttachCGroupInetEgress, 

       Program: objs.CountEgressPackets, 

   }) 

   if err != nil { 

       log.Fatal(err) 

   } 

   defer l.Close() 

 

   log.Println("Counting packets...") 

 

   // Read loop reporting the total amount of times the kernel 

   // function was entered, once per second. 

   ticker := time.NewTicker(1 * time.Second) 

   defer ticker.Stop() 

 

   for range ticker.C { 

       var value uint64 

       if err := objs.PktCount.Lookup(uint32(0), &value); err != nil { 

           log.Fatalf("reading map: %v", err) 

       } 

       log.Printf("number of packets: %d\n", value) 

   } 

} 




With the eBPF program:
//go:build ignore 

 

#include "common.h" 

 

char __license[] SEC("license") = "Dual MIT/GPL"; 

 

struct { 

   __uint(type, BPF_MAP_TYPE_ARRAY); 

   __type(key, u32); 

   __type(value, u64); 

   __uint(max_entries, 1); 

} pkt_count SEC(".maps"); 

 

SEC("cgroup_skb/egress") 

int count_egress_packets(struct __sk_buff *skb) { 

   u32 key      = 0; 

   u64 init_val = 1; 

 

   u64 *count = bpf_map_lookup_elem(&pkt_count, &key); 

   if (!count) { 

       bpf_map_update_elem(&pkt_count, &key, &init_val, BPF_ANY); 

       return 1; 

   } 

   __sync_fetch_and_add(count, 1); 

 

   return 1; 

} 




The //go:generate line handles compiling the eBPF C code and auto-generating the bpfObjects struct, which allows us to attach and interact with the program. This means a simple go build is all you need. 🥳
(cilium/ebpf has a great set of examples to get started. Review the full code from above).
There was still a missing piece though: CGROUP_SKB operates on IP addresses. Given the breadth of GitHub’s systems and rate of change, keeping an up-to-date block IP list would be very hard.
Could we use more eBPF to create a DNS-based blocked list? Yes, it turns out we could.
An eBPF program type of BPF_PROG_TYPE_CGROUP_SOCK_ADDR allows you to hook syscalls to create sockets and change the destination IP.
Here is a simplified example where we rewrite any connect4 syscall targeting DNS (Port 53) to localhost:53.
cgroupLink, err := link.AttachCgroup(link.CgroupOptions{ 

       Path:    cgroup.Name(), 

       Attach:  ebpf.AttachCGroupInet4Connect, 

       Program: obj.Connect4, 

   }) 

   if err != nil { 

       return nil, fmt.Errorf("attaching eBPF program Connect4 to cgroup: %w", err) 

   } 




/* This is the hexadecimal representation of 127.0.0.1 address */ 

const __u32 ADDRESS_LOCALHOST_NETBYTEORDER = bpf_htonl(0x7f000001); 

 

SEC("cgroup/connect4") 

int connect4(struct bpf_sock_addr *ctx) { 

 __be32 original_ip = ctx->user_ip4; 

 __u16 original_port = bpf_ntohs(ctx->user_port); 

 

 if (ctx->user_port == bpf_htons(53)) { 

   /* For DNS Query (*:53) rewire service to backend 

    * 127.0.0.1:const_dns_proxy_port */ 

   ctx->user_ip4 = const_mitm_proxy_address; 

   ctx->user_port = bpf_htons(const_dns_proxy_port); 

 } 

 

 return 1; 

} 




We used this to intercept DNS queries from the cGroup and forward them to a userspace DNS proxy we run.
Now, any DNS queries initiated by the deployment script are routed through our DNS proxy. Our proxy evaluates each requested domain against our block list and uses eBPF Maps to communicate with the CGROUP_SKB program, allowing or denying the request accordingly.
If you’d like to dig into the code, here’s an early proof of concept we put together. Our current implementation has progressed since then, but this should serve as a good intro.
Like any fun project, the deeper we got, the more we realized we could do.
For example, could we correlate blocked DNS requests back to the specific command or process that triggered them, so teams could more easily debug and fix issues? Yes, we can!
Inside the BPF_PROG_TYPE_CGROUP_SKB program type, we have the skb_buff from which we can pull the DNS transaction ID and also capture the Process ID (PID) that initiated the request. We place this information into another eBPF Map tracking DNS Transaction ID -> Process ID.
Here is a simplified version of the eBPF code (see this PoC code for full example):
  __u32 pid = bpf_get_current_pid_tgid() >> 32; 

     __u16 skb_read_offset = sizeof(struct iphdr) + sizeof(struct udphdr); 

     __u16 dns_transaction_id = 

         get_transaction_id_from_dns_header(skb, skb_read_offset); 

 

     if (pid && dns_transaction_id != 0) { 

       bpf_map_update_elem(&dns_transaction_id_to_pid, &dns_transaction_id, 

                           pid, BPF_ANY); 

     } 




As we’re redirecting all DNS calls to our userspace DNS proxy, we can look at the transaction ID of each request, find the domain being resolved, and lookup in the eBPF Map to see which process made the request. By reading /proc/{PID}/cmdline, we can even extract the full command line that triggered the request.
Then we can output a log line with all the information:
> WARN DNS BLOCKED reason=FromDNSRequest blocked=true blockedAt=dns domain=github.com. pid=266767 cmd="curl github.com " firewallMethod=blocklist




With that, we’re done.
We can now:
Conditionally block domains that would cause circular dependencies from deployment scripts.
Inform the owning team which command triggered the blocked request.
Provide an audit list of all domains contacted during a deployment.
Use the cGroups to enforce CPU and memory limits on deploy scripts, preventing runaway resource usage from impacting workloads.
What’s next?
Our new circular dependency detection process is live after a six-month rollout.
Now, if a team accidentally adds a problematic dependency, or if an existing binary tool we use takes a new dependency, the tooling will detect that problem and flag it to the team.
The net result is a more stable GitHub and faster mean time to recovery during incidents (due to the removal of these circular dependencies).
Are there ways for circular dependencies to still trip things up? You bet—and we’ll look to improve the tool as we discover them.
Want to dive in?
Has this piqued your interest in what you might be able to do with eBPF?
Get started by having a look through the examples in cilium/ebpf and the great documentation on the docs.ebpf.io site.
If you’re not quite ready to start writing your own eBPF tools, try open source tools powered by eBPF, like bpftrace for deep tracing or ptcpdump to get TCP dumps with container-level metadata.

The post How GitHub uses eBPF to improve deployment safety appeared first on The GitHub Blog.
