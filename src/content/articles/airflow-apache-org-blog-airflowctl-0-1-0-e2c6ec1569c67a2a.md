---
title: "Apache Airflow CTL aka airflowctl 0.1.0"
link: "https://airflow.apache.org/blog/airflowctl-0.1.0/"
guid: "https://airflow.apache.org/blog/airflowctl-0.1.0/"
pubDate: "2025-10-15T00:00:00.000Z"
site_name: "Apache Airflow"
site_feed: "https://airflow.apache.org/blog/index.xml"
category: "Data"
summary: "We are thrilled to announce the first major release of airflowctl 0.1.0, the new secure, API-driven command-line interface (CLI) for Apache Airflow — built under AIP-81.\nThis release marks CLI to join the general posture on communicating through API. Airflow CLI joins the modern era of secure, auditable, and remote-first operations.\nDetails:\n📦 PyPI: https://pypi.org/project/apache-airflow-ctl/0.1.0/  \nRelease Notes: https://airflow.apache.org/docs/apache-airflow-ctl/stable/release_notes.html  \nSource Code: https://github.com/apache/airflow/tree/main/airflow-ctl\n🎯 What is airflowctl?\nairflowctl is a new command-line interface for Apache Airflow that interacts exclusively with the Airflow REST API.\nIt provides a secure, auditable, and consistent way to manage Airflow deployments — without direct access to the metadata database.\n🔄 Coexistence with Airflow CLI\nThe Airflow CLI will continue as intended, primarily for admin tasks such as running Airflow components (airflow api-server, airflow scheduler) or managing the metadata database (airflow db init).\nairflowctl focuses on operational commands that interact with Airflow resources via the API (airflowctl dagrun trigger, airflowctl connection create, etc.).\nWe defined the commands falls under two main categories:\nRemote Commands: Operations that can be provided via API (e.g., managing DAGs, connections, variables, triggering DAG runs) are now available in airflowctl and will be the recommended approach going forward.\nLocal/Admin Commands: Operations that manage Airflow components or the metadata database will remain in the Airflow CLI.\nOf course, in the current state they will both have the remote commands.\nWe are planning a zero-disruption migration path where Remote Commands will be gradually deprecated from the Airflow CLI as they achieve parity in airflowctl.\n🔒 Why airflowctl?\nUntil now, Airflow CLI connected directly to the metadata database, bypassing RBAC, authentication, and API logs.\nWhile convenient, this approach limited security, auditing, and remote management capabilities — especially for enterprise environments.\nairflowctl changes that by routing every command through the Airflow REST API, bringing:\nAuthentication & RBAC enforcement\nCentralized logging & audit trail\nSecure credential storage via Keyring\nRemote command execution with zero DB access\nConsistency with Airflow UI and API behaviors\n🚀 AIP-81: CLI Reimagined Through the API\nAIP-81 (“Enhanced Security in CLI via Integration of API”) defined a clear goal:\n“The CLI must be a first-class, secure client of the Airflow REST API — not a privileged database actor.”\n\nairflowctl is the direct realization of that vision.\nCore design principles:\nAll remote commands use the REST API\nRBAC and auth handled consistently via API layer\nPluggable auth mechanisms (basic auth, OAuth, token, etc.)\nSecure credential persistence through system keyring\nExtensible to new API endpoints as Airflow evolves\n⚙️ Getting Started\npip install apache-airflow-ctl\n\n\nOnce installed, you can connect your CLI to an Airflow instance:\nairflowctl auth login --url http://localhost:8080 --username admin --password admin\n\n\nThe password field is interactive by default. You can enter your password securely without echoing it on the terminal.\nUse the above command without specifying the password and run it.\nairflowctl auth login --url http://localhost:8080 --username admin --password\n\n\n🧩 Command Highlights\nHere’s a quick look at some of the most popular commands, now fully API-backed in airflowctl 0.1.0:\n🧩 Assets\n\n\n⚙️ Config\n\n🔑 Connections\n\n\n🎯 DAG Runs\nTrigger and inspect DAG runs securely through the API:\n\n\n🪣 Variables\n\n\nAll these commands — and many more — operate via Airflow’s public REST API, ensuring secure, logged, and RBAC-controlled execution.\n🔐 Key Security Features\n🔑 Keyring Integration\nNo more plaintext tokens or passwords.\nairflowctl uses your OS-level keyring (e.g., macOS Keychain, Windows Credential Manager, or Linux Secret Service) to store and retrieve authentication tokens securely.\n🧱 Role-Based Access Control\nEvery command is evaluated by Airflow’s RBAC system through the API — ensuring consistent authorization with the web UI and API clients.\n🕵️‍♀️ Auditing and Traceability\nAll CLI commands generate API logs and can be observed through standard audit mechanisms — closing a long-standing gap between the CLI and Airflow’s security model.\n📈 Roadmap Highlights\nairflowctl 0.1.0 is just the beginning. The foundation is in place for a fully unified, secure CLI experience.\n🧩 Coming Soon\nCompleteness of API coverage\nLive log streaming\nWorker management\nRemote debugging\nIncremental deprecation of legacy CLI commands\nOver time, the legacy airflow CLI will be incrementally deprecated as commands achieve API parity.\n🧭 Migration\nMigration requires mapping commands, updating authentication, and re-testing automation to ensure compatibility with the new API-backed architecture.\nBecause airflowctl mirrors the core CLI syntax, most workflows require minimal changes — primarily adjusting authentication and configuration.\nSide by side comparison:\nBefore\n          After\n      \n\n          \n      \n\n          \n      \n🙏 Community & Acknowledgments\nThis release is the result of extensive collaboration across the Apache Airflow community.\nMany thanks all who worked on AIP-81, the Airflow REST API, Authentication, and the airflowctl implementation.\nLeading Contributors\nSpecial thanks to leading contributors of airflowctl:\nAmar Prakash Pandey, Amogh Desai, Aritra Basu, Aryan Khurana, ayush3singh, Brent Bovenzi, Brunda10,\nBugra Ozturk, Daniel Standish, D. Ferruzzi, Deji Ibrahim, Elad Kalif, Ephraim Anierobi, GPK,\nGuan Ming(Wesley) Chiu, Hussein Awala, Jake Roach, Jarek Potiuk, Jed Cunningham, Jens Scheffler,\nJaejun Lee, Kalyan R, Karthikeyan Singaravelan, Kaxil Naik, Kevin Yang, Kiruban Kamaraj, LI,JHE-CHEN,\nPierre Jeambrun, Pratiksha, Sam Wheating, Tzu-ping Chung, Valentyn, Vincent, Wei Lee, Yeonguk,\nYunchi Pang, Zhen-Lun (Kevin) Hong\n✨ In Summary\nairflowctl 0.1.0 makes Airflow’s command line:\nBefore\n          After\n      \nDirect DB access\n          API-backed security\n      \nNo RBAC or audit\n          Centralized auth & logging\n      \nInconsistent behavior\n          Unified CLI + API experience\n      \nManual secrets\n          Keyring-secured credentials\n      \nSecurity first. API always. CLI reimagined.\nThe secure CLI foundation lays the groundwork for Airflow’s next generation. A unified, API-first platform for orchestration and operations."
author: "Apache Airflow"
contentHtml: "<p>We are thrilled to announce the first major release of <strong><code>airflowctl</code> 0.1.0</strong>, the new <strong>secure, API-driven command-line interface (CLI)</strong> for Apache Airflow — built under <a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-81&#43;Enhanced&#43;Security&#43;in&#43;CLI&#43;via&#43;Integration&#43;of&#43;API\"><strong>AIP-81</strong></a>.</p>\n<p>This release marks CLI to join the general posture on communicating through API. Airflow CLI joins the modern era of secure, auditable, and remote-first operations.</p>\n<p><strong>Details</strong>:</p>\n<p>📦 <strong>PyPI:</strong> <a href=\"https://pypi.org/project/apache-airflow-ctl/0.1.0/\">https://pypi.org/project/apache-airflow-ctl/0.1.0/</a>  <br>\n🛠️ <strong>Release Notes:</strong> <a href=\"https://airflow.apache.org/docs/apache-airflow-ctl/stable/release_notes.html\">https://airflow.apache.org/docs/apache-airflow-ctl/stable/release_notes.html</a>  <br>\n🪶 <strong>Source Code:</strong> <a href=\"https://github.com/apache/airflow/tree/main/airflow-ctl\">https://github.com/apache/airflow/tree/main/airflow-ctl</a></p>\n<h2 id=\"-what-is-airflowctl\">🎯 What is airflowctl?</h2>\n<p><code>airflowctl</code> is a new command-line interface for Apache Airflow that interacts exclusively with the Airflow REST API.\nIt provides a secure, auditable, and consistent way to manage Airflow deployments — without direct access to the metadata database.</p>\n<h2 id=\"-coexistence-with-airflow-cli\">🔄 Coexistence with Airflow CLI</h2>\n<p>The Airflow CLI will continue as intended, primarily for admin tasks such as running Airflow components (<code>airflow api-server</code>, <code>airflow scheduler</code>) or managing the metadata database (<code>airflow db init</code>).\n<code>airflowctl</code> focuses on operational commands that interact with Airflow resources via the API (<code>airflowctl dagrun trigger</code>, <code>airflowctl connection create</code>, etc.).</p>\n<p>We defined the commands falls under <strong>two main categories</strong>:</p>\n<ol>\n<li><strong>Remote Commands</strong>: Operations that can be provided via API (e.g., managing DAGs, connections, variables, triggering DAG runs) are now available in <code>airflowctl</code> and will be the recommended approach going forward.</li>\n<li><strong>Local/Admin Commands</strong>: Operations that manage Airflow components or the metadata database will remain in the Airflow CLI.</li>\n</ol>\n<p>Of course, in the current state they will both have the remote commands.\nWe are planning a zero-disruption migration path where <strong>Remote Commands</strong> will be gradually deprecated from the Airflow CLI as they achieve parity in <code>airflowctl</code>.</p>\n<h2 id=\"-why-airflowctl\">🔒 Why airflowctl?</h2>\n<p>Until now, Airflow CLI connected directly to the <strong>metadata database</strong>, bypassing RBAC, authentication, and API logs.\nWhile convenient, this approach limited <strong>security, auditing, and remote management</strong> capabilities — especially for enterprise environments.</p>\n<p><strong><code>airflowctl</code></strong> changes that by routing every command through the <strong>Airflow REST API</strong>, bringing:</p>\n<ul>\n<li><strong>Authentication &amp; RBAC enforcement</strong></li>\n<li><strong>Centralized logging &amp; audit trail</strong></li>\n<li><strong>Secure credential storage via Keyring</strong></li>\n<li><strong>Remote command execution with zero DB access</strong></li>\n<li><strong>Consistency with Airflow UI and API behaviors</strong></li>\n</ul>\n<h2 id=\"-aip-81-cli-reimagined-through-the-api\">🚀 AIP-81: CLI Reimagined Through the API</h2>\n<p><strong>AIP-81</strong> (“Enhanced Security in CLI via Integration of API”) defined a clear goal:</p>\n<blockquote>\n<p>“The CLI must be a first-class, secure client of the Airflow REST API — not a privileged database actor.”</p></blockquote>\n<p><code>airflowctl</code> is the direct realization of that vision.</p>\n<h3 id=\"core-design-principles\">Core design principles:</h3>\n<ul>\n<li><strong>All remote commands use the REST API</strong></li>\n<li><strong>RBAC and auth handled consistently via API layer</strong></li>\n<li><strong>Pluggable auth mechanisms</strong> (basic auth, OAuth, token, etc.)</li>\n<li><strong>Secure credential persistence</strong> through <strong>system keyring</strong></li>\n<li><strong>Extensible</strong> to new API endpoints as Airflow evolves</li>\n</ul>\n<h2 id=\"-getting-started\">⚙️ Getting Started</h2>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">pip install apache-airflow-ctl\n</span></span></code></pre></div><p>Once installed, you can connect your CLI to an Airflow instance:</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">airflowctl auth login --url http://localhost:8080 --username admin --password admin\n</span></span></code></pre></div><p>The password field is interactive by default. You can enter your password securely without echoing it on the terminal.\nUse the above command without specifying the password and run it.</p>\n<div class=\"highlight\"><pre tabindex=\"0\" class=\"chroma\"><code class=\"language-bash\" data-lang=\"bash\"><span class=\"line\"><span class=\"cl\">airflowctl auth login --url http://localhost:8080 --username admin --password\n</span></span></code></pre></div><h2 id=\"-command-highlights\">🧩 Command Highlights</h2>\n<p>Here’s a quick look at some of the most popular commands, now fully API-backed in airflowctl 0.1.0:</p>\n<h3 id=\"-assets\">🧩 Assets</h3>\n<p><img src=\"/blog/airflowctl-0.1.0/images/assets_create_event.gif\" alt=\"Assets Create Event\">\n<img src=\"/blog/airflowctl-0.1.0/images/assets_get.gif\" alt=\"Assets Get\"></p>\n<h3 id=\"-config\">⚙️ Config</h3>\n<p><img src=\"/blog/airflowctl-0.1.0/images/config_get.gif\" alt=\"Config Get\"></p>\n<h3 id=\"-connections\">🔑 Connections</h3>\n<p><img src=\"/blog/airflowctl-0.1.0/images/connections_create.gif\" alt=\"Connections Create\">\n<img src=\"/blog/airflowctl-0.1.0/images/connections_update.gif\" alt=\"Connections Update\"></p>\n<h3 id=\"-dag-runs\">🎯 DAG Runs</h3>\n<p>Trigger and inspect DAG runs securely through the API:</p>\n<p><img src=\"/blog/airflowctl-0.1.0/images/dagrun_list.gif\" alt=\"DagRun List\">\n<img src=\"/blog/airflowctl-0.1.0/images/dagrun_trigger.gif\" alt=\"DagRun Trigger\"></p>\n<h3 id=\"-variables\">🪣 Variables</h3>\n<p><img src=\"/blog/airflowctl-0.1.0/images/variables_export.gif\" alt=\"Variables Export\">\n<img src=\"/blog/airflowctl-0.1.0/images/variables_import.gif\" alt=\"Variables Import\"></p>\n<p>All these commands — and many more — operate via Airflow’s public REST API, ensuring secure, logged, and RBAC-controlled execution.</p>\n<h2 id=\"-key-security-features\">🔐 Key Security Features</h2>\n<h3 id=\"-keyring-integration\">🔑 Keyring Integration</h3>\n<p>No more plaintext tokens or passwords.\nairflowctl uses your OS-level keyring (e.g., macOS Keychain, Windows Credential Manager, or Linux Secret Service) to store and retrieve authentication tokens securely.</p>\n<h3 id=\"-role-based-access-control\">🧱 Role-Based Access Control</h3>\n<p>Every command is evaluated by Airflow’s RBAC system through the API — ensuring consistent authorization with the web UI and API clients.</p>\n<h3 id=\"-auditing-and-traceability\">🕵️‍♀️ Auditing and Traceability</h3>\n<p>All CLI commands generate API logs and can be observed through standard audit mechanisms — closing a long-standing gap between the CLI and Airflow’s security model.</p>\n<h2 id=\"-roadmap-highlights\">📈 Roadmap Highlights</h2>\n<p>airflowctl 0.1.0 is just the beginning. The foundation is in place for a fully unified, secure CLI experience.</p>\n<h3 id=\"-coming-soon\">🧩 Coming Soon</h3>\n<ul>\n<li>Completeness of API coverage</li>\n<li>Live log streaming</li>\n<li>Worker management</li>\n<li>Remote debugging</li>\n<li>Incremental deprecation of legacy CLI commands</li>\n<li>Over time, the legacy airflow CLI will be incrementally deprecated as commands achieve API parity.</li>\n</ul>\n<h2 id=\"-migration\">🧭 Migration</h2>\n<p>Migration requires mapping commands, updating authentication, and re-testing automation to ensure compatibility with the new API-backed architecture.\nBecause airflowctl mirrors the core CLI syntax, most workflows require minimal changes — primarily adjusting authentication and configuration.</p>\n<p>Side by side comparison:</p>\n<table>\n  <thead>\n      <tr>\n          <th>Before</th>\n          <th>After</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td><img src=\"/blog/airflowctl-0.1.0/images/pools_list_old.gif\" alt=\"pools_list_old.gif\"></td>\n          <td><img src=\"/blog/airflowctl-0.1.0/images/pools_list.gif\" alt=\"pools_list.gif\"></td>\n      </tr>\n      <tr>\n          <td><img src=\"/blog/airflowctl-0.1.0/images/variables_list_old.gif\" alt=\"variables_list_old.gif\"></td>\n          <td><img src=\"/blog/airflowctl-0.1.0/images/variables_list_yaml.gif\" alt=\"variables_list_yaml.gif\"></td>\n      </tr>\n  </tbody>\n</table>\n<h2 id=\"-community--acknowledgments\">🙏 Community &amp; Acknowledgments</h2>\n<p>This release is the result of extensive collaboration across the Apache Airflow community.\nMany thanks all who worked on AIP-81, the Airflow REST API, Authentication, and the airflowctl implementation.</p>\n<h2 id=\"leading-contributors\">Leading Contributors</h2>\n<p>Special thanks to leading contributors of <code>airflowctl</code>:\n<strong>Amar Prakash Pandey, Amogh Desai, Aritra Basu, Aryan Khurana, ayush3singh, Brent Bovenzi, Brunda10,\nBugra Ozturk, Daniel Standish, D. Ferruzzi, Deji Ibrahim, Elad Kalif, Ephraim Anierobi, GPK,\nGuan Ming(Wesley) Chiu, Hussein Awala, Jake Roach, Jarek Potiuk, Jed Cunningham, Jens Scheffler,\nJaejun Lee, Kalyan R, Karthikeyan Singaravelan, Kaxil Naik, Kevin Yang, Kiruban Kamaraj, LI,JHE-CHEN,\nPierre Jeambrun, Pratiksha, Sam Wheating, Tzu-ping Chung, Valentyn, Vincent, Wei Lee, Yeonguk,\nYunchi Pang, Zhen-Lun (Kevin) Hong</strong></p>\n<p>✨ In Summary</p>\n<p>airflowctl 0.1.0 makes Airflow’s command line:</p>\n<table>\n  <thead>\n      <tr>\n          <th>Before</th>\n          <th>After</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Direct DB access</td>\n          <td>API-backed security</td>\n      </tr>\n      <tr>\n          <td>No RBAC or audit</td>\n          <td>Centralized auth &amp; logging</td>\n      </tr>\n      <tr>\n          <td>Inconsistent behavior</td>\n          <td>Unified CLI + API experience</td>\n      </tr>\n      <tr>\n          <td>Manual secrets</td>\n          <td>Keyring-secured credentials</td>\n      </tr>\n  </tbody>\n</table>\n<p>Security first. API always. CLI reimagined.\nThe secure CLI foundation lays the groundwork for Airflow’s next generation. A unified, API-first platform for orchestration and operations.</p>"
---

We are thrilled to announce the first major release of airflowctl 0.1.0, the new secure, API-driven command-line interface (CLI) for Apache Airflow — built under AIP-81.
This release marks CLI to join the general posture on communicating through API. Airflow CLI joins the modern era of secure, auditable, and remote-first operations.
Details:
📦 PyPI: https://pypi.org/project/apache-airflow-ctl/0.1.0/  
Release Notes: https://airflow.apache.org/docs/apache-airflow-ctl/stable/release_notes.html  
Source Code: https://github.com/apache/airflow/tree/main/airflow-ctl
🎯 What is airflowctl?
airflowctl is a new command-line interface for Apache Airflow that interacts exclusively with the Airflow REST API.
It provides a secure, auditable, and consistent way to manage Airflow deployments — without direct access to the metadata database.
🔄 Coexistence with Airflow CLI
The Airflow CLI will continue as intended, primarily for admin tasks such as running Airflow components (airflow api-server, airflow scheduler) or managing the metadata database (airflow db init).
airflowctl focuses on operational commands that interact with Airflow resources via the API (airflowctl dagrun trigger, airflowctl connection create, etc.).
We defined the commands falls under two main categories:
Remote Commands: Operations that can be provided via API (e.g., managing DAGs, connections, variables, triggering DAG runs) are now available in airflowctl and will be the recommended approach going forward.
Local/Admin Commands: Operations that manage Airflow components or the metadata database will remain in the Airflow CLI.
Of course, in the current state they will both have the remote commands.
We are planning a zero-disruption migration path where Remote Commands will be gradually deprecated from the Airflow CLI as they achieve parity in airflowctl.
🔒 Why airflowctl?
Until now, Airflow CLI connected directly to the metadata database, bypassing RBAC, authentication, and API logs.
While convenient, this approach limited security, auditing, and remote management capabilities — especially for enterprise environments.
airflowctl changes that by routing every command through the Airflow REST API, bringing:
Authentication & RBAC enforcement
Centralized logging & audit trail
Secure credential storage via Keyring
Remote command execution with zero DB access
Consistency with Airflow UI and API behaviors
🚀 AIP-81: CLI Reimagined Through the API
AIP-81 (“Enhanced Security in CLI via Integration of API”) defined a clear goal:
“The CLI must be a first-class, secure client of the Airflow REST API — not a privileged database actor.”

airflowctl is the direct realization of that vision.
Core design principles:
All remote commands use the REST API
RBAC and auth handled consistently via API layer
Pluggable auth mechanisms (basic auth, OAuth, token, etc.)
Secure credential persistence through system keyring
Extensible to new API endpoints as Airflow evolves
⚙️ Getting Started
pip install apache-airflow-ctl


Once installed, you can connect your CLI to an Airflow instance:
airflowctl auth login --url http://localhost:8080 --username admin --password admin


The password field is interactive by default. You can enter your password securely without echoing it on the terminal.
Use the above command without specifying the password and run it.
airflowctl auth login --url http://localhost:8080 --username admin --password


🧩 Command Highlights
Here’s a quick look at some of the most popular commands, now fully API-backed in airflowctl 0.1.0:
🧩 Assets


⚙️ Config

🔑 Connections


🎯 DAG Runs
Trigger and inspect DAG runs securely through the API:


🪣 Variables


All these commands — and many more — operate via Airflow’s public REST API, ensuring secure, logged, and RBAC-controlled execution.
🔐 Key Security Features
🔑 Keyring Integration
No more plaintext tokens or passwords.
airflowctl uses your OS-level keyring (e.g., macOS Keychain, Windows Credential Manager, or Linux Secret Service) to store and retrieve authentication tokens securely.
🧱 Role-Based Access Control
Every command is evaluated by Airflow’s RBAC system through the API — ensuring consistent authorization with the web UI and API clients.
🕵️‍♀️ Auditing and Traceability
All CLI commands generate API logs and can be observed through standard audit mechanisms — closing a long-standing gap between the CLI and Airflow’s security model.
📈 Roadmap Highlights
airflowctl 0.1.0 is just the beginning. The foundation is in place for a fully unified, secure CLI experience.
🧩 Coming Soon
Completeness of API coverage
Live log streaming
Worker management
Remote debugging
Incremental deprecation of legacy CLI commands
Over time, the legacy airflow CLI will be incrementally deprecated as commands achieve API parity.
🧭 Migration
Migration requires mapping commands, updating authentication, and re-testing automation to ensure compatibility with the new API-backed architecture.
Because airflowctl mirrors the core CLI syntax, most workflows require minimal changes — primarily adjusting authentication and configuration.
Side by side comparison:
Before
          After
      

          
      

          
      
🙏 Community & Acknowledgments
This release is the result of extensive collaboration across the Apache Airflow community.
Many thanks all who worked on AIP-81, the Airflow REST API, Authentication, and the airflowctl implementation.
Leading Contributors
Special thanks to leading contributors of airflowctl:
Amar Prakash Pandey, Amogh Desai, Aritra Basu, Aryan Khurana, ayush3singh, Brent Bovenzi, Brunda10,
Bugra Ozturk, Daniel Standish, D. Ferruzzi, Deji Ibrahim, Elad Kalif, Ephraim Anierobi, GPK,
Guan Ming(Wesley) Chiu, Hussein Awala, Jake Roach, Jarek Potiuk, Jed Cunningham, Jens Scheffler,
Jaejun Lee, Kalyan R, Karthikeyan Singaravelan, Kaxil Naik, Kevin Yang, Kiruban Kamaraj, LI,JHE-CHEN,
Pierre Jeambrun, Pratiksha, Sam Wheating, Tzu-ping Chung, Valentyn, Vincent, Wei Lee, Yeonguk,
Yunchi Pang, Zhen-Lun (Kevin) Hong
✨ In Summary
airflowctl 0.1.0 makes Airflow’s command line:
Before
          After
      
Direct DB access
          API-backed security
      
No RBAC or audit
          Centralized auth & logging
      
Inconsistent behavior
          Unified CLI + API experience
      
Manual secrets
          Keyring-secured credentials
      
Security first. API always. CLI reimagined.
The secure CLI foundation lays the groundwork for Airflow’s next generation. A unified, API-first platform for orchestration and operations.
