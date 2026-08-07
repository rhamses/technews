---
title: "Apache Airflow® 3 is Generally Available!"
link: "https://airflow.apache.org/blog/airflow-three-point-oh-is-here/"
guid: "https://airflow.apache.org/blog/airflow-three-point-oh-is-here/"
pubDate: "2025-04-22T00:00:00.000Z"
site_name: "Apache Airflow"
site_feed: "https://airflow.apache.org/blog/index.xml"
category: "Data"
summary: "We announced our intent to focus on Apache Airflow 3.0® as the next big milestone for the Airflow project at the Airflow Summit in September 2024. We are delighted to announce that Airflow 3.0 is now released!\nA Major Release, Four Years in the Making\nAirflow 3.0 is the biggest release in Airflow’s history—2.0 was released in 2020, and the last 4 years have seen incremental updates and releases every quarter with version 2.10 released in Q4 2024. With over 30 million monthly downloads (up over 30x since 2020) and 80,000 organizations (up from 25,000 in 2020) now using Airflow, we’ve seen an incredible growth in popularity since 2.0.\nOver the last four years, Airflow has grown to power business critical data workflows within organizations of all sizes. We have seen an exponential increase in the use cases for Airflow from its beginnings with ETL, ELT, and Reverse ETL, with over 30% of Airflow users using it for MLOps, and 10% using it for GenAI workflows. Airflow 3 is a response to this use case expansion and is the standard for data application development across the enterprise.\nHere are some highlights:\nAirflow 3 is significantly easier to use for data practitioners and incorporates their key requests for critical changes to Airflow. Early user reactions to features such as the new React based UI, DAG Versioning, and improved Backfill support have been incredibly positive. I was ecstatic to see the reaction from data engineers when I demonstrated this at a recent Airflow meetup.\nThe seamless UI transition of navigating between Asset-oriented workflows and Task-oriented workflows is beautiful. Once again, Airflow lets the developer choose how you want to develop and navigate without imposing any restrictions.\nIntroduction of Event Driven Scheduling enables Airflow to seamlessly integrate with messaging providers and react to events happening and data assets being updated outside of Airflow.\nThe big architecture change with the introduction of the Task Execution Interface and the Task SDKs, enable a stronger security model, including secure, scalable execution across multi-cloud, hybrid-cloud, and local data center deployments.\nThis is the result of 300+ developers within the Airflow community working together tirelessly for many months and I could not be more proud to be part of this wonderful team. Here are some more details of the release.\nHighly requested UX features\nDAG Versioning\nDAG Versioning has been the most requested feature within Airflow based on the annual Airflow survey. As implemented in Airflow 3, a DAG will run through to completion based on the version at start, even if a new version has been uploaded while this DAG was being run. All DAG runs in the UI are now associated with the version of the DAG as run including the Task structure, the code, the logs, and more.\nThis is described in two AIPs: Improve DAG history (AIP-65) , and DAG Bundles and Parsing (AIP-66).\n\nBackfills improvements\nAnother long-standing user request has been better support for backfills. Often discussed in the context of machine learning, backfills also apply to traditional ETL and ELT use cases.  In Airflow 3, backfills are run within the scheduler for improved control, scalability, and diagnostics. Backfills can now be started from the UI or API, and monitored within the UI.\nThis was defined as part of “Scheduler-managed backfills” (AIP-78), and an example screenshot is shown below:\n\nRun anywhere, at any time, in any Language\nRun anywhere, in any language\nA foundational goal of Airflow 3 is allowing execution in any environment, in any language. A key component of this is the Task Execution Interface (AIP-72), which enables the evolution of Airflow into a client-server architecture, which represents one of the most significant architectural shifts in Airflow’s history. This supports Celery, Kubernetes, and Local Executors, but also enables new capabilities. A component of this change is the API server which represents input for the Task Execution Interface. This foundational feature enables multi-cloud deployments and multi-language support in the form of the Task Execution API. The Airflow 3 release includes the Python TaskSDK which enables backward compatibility for existing DAGs. TaskSDKs for additional languages, starting with Golang will be released over the next few months.\nTo enable data pipelines to be run on edge devices, outside of the core data centers and clouds, the Edge Executor (AIP-69) is available as a provider package with Airflow 3. This is an incremental feature built on top of the Task Execution Interface. Initial incarnations have been released in experimental mode based on Airflow 2x and this executor has now evolved to leverage the Airflow 3 API Server.\nEvent-driven scheduling and Data Assets\nAirflow 3 represents a foundational jump in enabling Airflow to react to events happening outside of Airflow, including data assets being created or updated by external data systems. This was based on the evolution of Datasets into Data Assets and was broken out into several AIPs as detailed below, which are all part of the release.\nThe fundamental evolution of Datasets into Data Assets has been done as part of “Introducing Data Assets” (AIP-74). This introduces the concept of Watchers which is leveraged by other capabilities detailed below. A significant enhancement around Data Assets is the New Asset-Centric Syntax (AIP-75) for defining Assets easily with DAGs using the Python decorator syntax, which is part of this release.\nExternal event driven scheduling (AIP-82) is based on the foundational Data Assets work described above, specifically Watchers. The initial scope as defined in the AIP is complete and now incorporates a “Common Message Bus” interface. This release also includes an implementation of the above for AWS SQS as an “out of the box” integration, which demonstrates DAGs being triggered upon the arrival of a message in AWS SQS.\nInference execution and hyperparameter tuning\nMany ML and AI Engineers are already using Airflow for ML/AI Ops, especially for model training. However, there were challenges for Inference Execution. Enhancing Airflow for Inference Execution by adding support for non-data-interval-Dags (sorry, that’s a mouthful) is an important change. This work is covered as part of “Remove Execution date unique constraint from DAG run” (AIP-83)\nSecurity and usability improvements\nUI Modernization\nThe Airflow UI has been completely rewritten as part of Airflow 3 and incorporates a significantly improved user experience which seamlessly blends Asset-oriented workflows with Task-oriented workflows. This is a dramatic improvement which enables developers to author DAGs as they choose, without being opinionated about “a right way”.\n\nCheck out the screenshots in the docs for more.\nRecreating it to be based on React and the FastAPI has been a massive project and was broken out into several AIPs as detailed below.\nThe foundation for the new UI is the REST API and a set of internal APIs for UI Operations (AIP-84) both of which are now based on FastAPI. These APIs are served as part of the API Server described above as part of the Task Execution framework.\nThe Airflow 3.0 UI has been significantly improved and includes a streamlined user experience workflow encompassing both the Grid and Graph views. The interaction between DAGs and Assets are also more streamlined. User experience is always a work in progress and we very much appreciate your feedback. This is covered in great detail as part of the Modern Web Application proposal (AIP-38).\nAs part of this project, Flask AppBuilder has now been moved into a separate provider package and is no longer a part of the Core Airflow package. This enables an easier security and maintenance update process, while retaining backwards compatibility. This is documented as part of the “Remove Flask App Builder as a Core Dependency” proposal (AIP-79).\nSecurity\nA key benefit of the Task Execution Interface and the API server is Task Isolation. This has often been requested by Airflow enterprise deployments for a better security posture when an Airflow deployment is shared by multiple teams. Further security and authorization patterns can be developed on top of this foundation as more detailed requirements are uncovered.\nImproving the CLI and reducing the maintenance burden by having the CLI use the Airflow APIs, rather than direct access is an important evolution for Airflow. We have now split the core Airflow CLI into two parts, the first for local development and backwards compatibility and the second for remote access using the API. The second will be a new provider package called “airflowctl” which can be optionally installed along with Core Airflow. This is documented in more detail as part of the “Enhanced security in CLI via Integration of API” proposal (AIP-81).\nAn amazing community\nThis release could not have happened without the inspiration and technical leadership of key contributors who led the AIPs listed above. We thank them all here: Ash Berlin-Taylor, Brent Bovenzi, Bugra Ozturk, Constance Martineau, Daniel Standish, Jed Cunningham, Jens Scheffler, Kaxil Naik, Pierre Jeambrun, Vincent Beck, and Vikram Koka. We also wanted to thank Jarek Potiuk for the critical development infrastructure and packaging work and to Elad Kalif for shepherding all the key provider changes needed. We would like to recognize Wei Lee and Ankit Chaurasia for their work on the upgrade utilities to enable users to easily upgrade to Airflow 3.\nFinally, a huge shoutout to Jed Cunningham and Kaxil Naik for the critical part of release management!\nOver three hundred developers around the world have contributed to making this release a reality. We thank them all for their contributions. They are listed here in alphabetical order:\nAakcht\nAaron Chen\nAbhishek\nAdam Turner\nAdan\nAditya Yadav\nAdrian Lazar\nAdrian Perea\nAjit J Gupta\nAlbert Okiri\nAlex Waygood\nAlexander Millin\nAlteredOracle\nAmar Prakash Pandey\nAmir Mor\nAmogh Desai\nAmol Saini\nAnakin Skywalker Pactores\nAndor Markus\nAndre Miranda\nAndres Lowrie\nAndrew Arochukwu\nAndrew Stein\nAndrii Abramov\nAndrii Korotkov\nAndrii Yerko\nAnkit Chaurasia\nAnthony Lin\nAntony Southworth\nAritra Basu\nArjun Pathak\nArnel Jan Sarmiento\nArnout Engelen\nArtem Suslov\nArthur Braveheart\nArtour\nArtur Skarżyński\nArunav Gupta\nAryan Khurana\nAsh Berlin-Taylor\nAshKatzEm\nAutomationDev85\nAvihais12344\nAzhar Izzannada E\nBaitur Ulukbekov\nBalthazar Rouberol\nBartosz Jankiewicz\nBas\nBen Chen\nBenoit Perigaud\nBiswamitra Biswas\nBjorn Olsen\nBluefox9x5\nBohdan Udovenko\nBonnie Why\nBoris Morel\nBowrna\nBrent Bovenzi\nBugra Ozturk\nBłażej Tecław\nCastle Cheng\nChris Luedtke\nChristian Yarros\nChristos Bisias\nCollin McNulty\nComputer Network Investigation\nConstance Martineau\nD. Ferruzzi\nDShi\nDaniel Gellert\nDaniel Imberman\nDaniel Standish\nDaniel van der Ende\nDanish Amjad\nDanny Liu\nDavid Blain\nDerek\nDetlev V.\nDewen Kong\nSriraj Dheeraj Turaga\nDiogo Rodrigues\nDmitry Astankov\nDmitry Pustoshilov\nDominic Leung\nDong-yeong0\nDoug Guthrie\nDylan Melotik\nElad Kalif\nEldar Kasmamytov\nEphraim Anierobi\nEric\nEverton Seiei Arakaki\nFarhan\nFedor Kobak\nFelix Uellendall\nFred Thomsen\nFully.is(풀리)\nGPK\nGagan Bhullar\nGeonwoo Kim\nGlenboLake\nGopal Dirisala\nGregory Borodin\nGuan-Ming (Wesley) Chiu\nGuangyang Li\nGuillaume Lostis\nHari Selvarajan\nHassanAlahmed\nHojin Jun\nHoward Yoo\nHuanjie Guo\nHung\nHussein Awala\nHyunsoo Kang\nIan Buss\nIdris Adebisi\nIgor Kholopov\nIlaiGigi\nIndrale Dnyaneshwar\nJISHAN GARGACHARYA\nJaejun\nJake Ferriero\nJake Roach\nJakub Dardzinski\nJames Chaldecott\nJames Regan\nJarek Potiuk\nJasmin Patel\nJason\nJed Cunningham\nJeff Harrison\nJens Scheffler\nJianzhun Du\nJimmy McBroom\nJoao Amaral\nJoão Pedro M Miguel\nJoel Labes\nJoey Cumines\nJoffrey Bienvenu\nJohn Bampton\nJohn C. Merfeld\nJohnny1cyber\nJosé Joaquín Virtudes Castro\nJoseph Ang\nJoshuaXOng\nJosix\nJulian Maicher\nKacper Kulczak\nKacper Muda\nKalyan R\nKamil Breguła\nKaren Braganza\nKarthik Dulam\nKarthik Ravi\nKarthikeyan Singaravelan\nKaxil Naik\nKevin Allen\nKim\nKris\nKunal Bhattacharya\nLIU ZHE YOU\nLennox Stevenson\nLinh\nLorin Dawson\nLou ✨\nLucy Hu\nLukas Mikelionis\nLuyang Liu\nLyndon Fan\nM. Olcay Tercanlı\nMaciej Obuchowski\nMadison Swain-Bowden\nMaksim\nMarcelo Trylesinski\nMarcos Marx\nMaria\nMark Andreev\nMark H\nMatt Burke\nMatt Dupree\nMaxim Martynov\nMayuresh Kedari\nMehul Goyal\nMike\nMike Beckhusen\nMikhail Dengin\nMishchenkoYuriy\nMuhammad Hanif Mohamad Musa\nMyles Hollowed\nNarendra-Neerukonda\nNatsu\nNikita\nNiko Oliveira\nNishant Gupta\nNitesh Kumar Dubey Samsung\nNitochkin\nOleg Ovcharuk\nOleksandr Slynko\nOmkar P\nOwen Leung\nPandycool\nPankaj Koti\nPark Jiwon\nPavan Sharma\nPeng-Jui Wang\nPeter Debelak\nPhani Kumar\nPierre Jeambrun\nPo-Yu Hsieh\nPrajwal7842\nPratiksha\nPurna Chander\nRafa\nRahul Madan\nRahul Vats\nRamit Kataria\nRishabh Srivastava\nRushabh Garambha\nRyan Eakman\nRyan Hatter\nRytis Ulys\nSAI GANESH S\nSam Lendle\nSamLiaoP\nSaumil Patel\nSaurabhhB\nSean Gabriel Bayron\nSean Rose\nSebastian Daum\nSeonghwanLee\nShahar Epstein\nShahbaz Aamir\nShoaib UR Rehman\nShubham Raj\nSimon Sawicki\nSiva Kumar Edupuganti\nSneha Prabhu\nSooter Saalu\nSrabasti Banerjee\nStefan Keidel\nSteven Loria\nSteven Shidi Zhou\nStijn De Haes\nSuccess Moses\nTakawaAkirayo\nTamara Janina Fingerlin\nTamas Palinkas\nTatiana Al-Chueyr\nTopher Anderson\nTzu-ping Chung\nUsiel Riedl\nUtkarsh Sharma\nValentyn\nVenkat VJ\nVikram Koka\nVikram Medabalimi\nVikramaditya Gaonkar\nVincent\nVincent Kling\nVladaZakharova\nWaldemar Hummer\nWang Ran (汪然)\nWei Lee\nWojciech Szlachta\nWonseok Yang\nYeonguk Choo\nYohei Kishimoto\nYoungha, Park\nYuan Li\nZach Liu\nZhen-Lun (Kevin) Hong\nalthati\nambikagarg\natrbgithub\nawdavidson\ncodecae\ndan-js\ndarkag\ndavidfgcorreia\ndominikhei\nellisms\nenisnazif\nfritz-astronomer\ngaurav7261\ngeraj1010\ngot686-yandex\nharjeevan maan\nharry.shi\nhikaruhk\nhprassad\nipsatrivedi\njaejun\njj.lee\njonhspyro\nkanagaraj\nkandharvishnu\nleoguzman\nlucasmo\nluoyuliuyin\nmahdi alizadeh\nmajorosdonat\nmax\nmayankymailusfedu\nmichaeljs-c\nmorooshka\nninad-opsverse\nolegkachur-e\npaolomoriello\nperry2of5\npgvishnuram\nphi-friday\nrahulgoyal2987\nraphaelauv\nrgriffier\nrom sharon\nsaucoide\nsbock-slack\nsc-anssi\nseyoon-lim\nsimonprydden\nskandala23\nsonu4578\nsuyesh-amatya\nsvellaiyan\ntnk-ysk\nuzhastik\nvatsrahul1001\nvfeldsher\nxavipuerto\nxitep\nyangyulely\nyunchi\n鐘翊修\n김영준\nWhat’s Next\nWe’d love your feedback. Try out the release, open issues, file PRs, or just join the conversation on the Airflow dev list, Slack, and GitHub.\nLet’s build the future of data orchestration—together."
author: "Apache Airflow"
contentHtml: "<p>We announced our intent to focus on Apache Airflow 3.0® as the next big milestone for the Airflow project at the Airflow Summit in September 2024. We are delighted to announce that Airflow 3.0 is now released!</p>\n<h2 id=\"a-major-release-four-years-in-the-making\">A Major Release, Four Years in the Making</h2>\n<p>Airflow 3.0 is the biggest release in Airflow’s history—2.0 was released in 2020, and the last 4 years have seen incremental updates and releases every quarter with version 2.10 released in Q4 2024. With over 30 million monthly downloads (up over 30x since 2020) and 80,000 organizations (up from 25,000 in 2020) now using Airflow, we’ve seen an incredible growth in popularity since 2.0.</p>\n<p>Over the last four years, Airflow has grown to power business critical data workflows within organizations of all sizes. We have seen an exponential increase in the use cases for Airflow from its beginnings with ETL, ELT, and Reverse ETL, with over 30% of Airflow users using it for MLOps, and 10% using it for GenAI workflows. Airflow 3 is a response to this use case expansion and is the standard for data application development across the enterprise.</p>\n<p>Here are some highlights:</p>\n<ul>\n<li>\n<p>Airflow 3 is significantly easier to use for data practitioners and incorporates their key requests for critical changes to Airflow. Early user reactions to features such as the new React based UI, DAG Versioning, and improved Backfill support have been incredibly positive. I was ecstatic to see the reaction from data engineers when I demonstrated this at a recent Airflow meetup.</p>\n</li>\n<li>\n<p>The seamless UI transition of navigating between Asset-oriented workflows and Task-oriented workflows is beautiful. Once again, Airflow lets the developer choose how you want to develop and navigate without imposing any restrictions.</p>\n</li>\n<li>\n<p>Introduction of Event Driven Scheduling enables Airflow to seamlessly integrate with messaging providers and react to events happening and data assets being updated outside of Airflow.</p>\n</li>\n<li>\n<p>The big architecture change with the introduction of the Task Execution Interface and the Task SDKs, enable a stronger security model, including secure, scalable execution across multi-cloud, hybrid-cloud, and local data center deployments.</p>\n</li>\n</ul>\n<p>This is the result of 300+ developers within the Airflow community working together tirelessly for many months and I could not be more proud to be part of this wonderful team. Here are some more details of the release.</p>\n<h2 id=\"highly-requested-ux-features\">Highly requested UX features</h2>\n<h3 id=\"dag-versioning\">DAG Versioning</h3>\n<p>DAG Versioning has been the most requested feature within Airflow based on the annual Airflow survey. As implemented in Airflow 3, a DAG will run through to completion based on the version at start, even if a new version has been uploaded while this DAG was being run. All DAG runs in the UI are now associated with the version of the DAG as run including the Task structure, the code, the logs, and more.\nThis is described in two AIPs: Improve DAG history (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-65%3A&#43;Improve&#43;DAG&#43;history&#43;in&#43;UI\">AIP-65</a>) , and DAG Bundles and Parsing (<a href=\"https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=294816356\">AIP-66</a>).</p>\n<p><img src=\"/blog/airflow-three-point-oh-is-here/versioning_ui.gif\" alt=\"DAG Versioning UI\"></p>\n<h3 id=\"backfills-improvements\">Backfills improvements</h3>\n<p>Another long-standing user request has been better support for backfills. Often discussed in the context of machine learning, backfills also apply to traditional ETL and ELT use cases.  In Airflow 3, backfills are run within the scheduler for improved control, scalability, and diagnostics. Backfills can now be started from the UI or API, and monitored within the UI.</p>\n<p>This was defined as part of “Scheduler-managed backfills” (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-78&#43;Scheduler-managed&#43;backfill\">AIP-78</a>), and an example screenshot is shown below:</p>\n<p><img src=\"/blog/airflow-three-point-oh-is-here/backfill.png\" alt=\"Backfill UI\"></p>\n<h2 id=\"run-anywhere-at-any-time-in-any-language\">Run anywhere, at any time, in any Language</h2>\n<h3 id=\"run-anywhere-in-any-language\">Run anywhere, in any language</h3>\n<p>A foundational goal of Airflow 3 is allowing execution in any environment, in any language. A key component of this is the Task Execution Interface (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-72&#43;Task&#43;Execution&#43;Interface&#43;aka&#43;Task&#43;SDK\">AIP-72</a>), which enables the evolution of Airflow into a client-server architecture, which represents one of the most significant architectural shifts in Airflow’s history. This supports Celery, Kubernetes, and Local Executors, but also enables new capabilities. A component of this change is the API server which represents input for the Task Execution Interface. This foundational feature enables multi-cloud deployments and multi-language support in the form of the Task Execution API. The Airflow 3 release includes the Python TaskSDK which enables backward compatibility for existing DAGs. TaskSDKs for additional languages, starting with Golang will be released over the next few months.</p>\n<p>To enable data pipelines to be run on edge devices, outside of the core data centers and clouds, the Edge Executor (<a href=\"https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=301795932\">AIP-69</a>) is available as a provider package with Airflow 3. This is an incremental feature built on top of the Task Execution Interface. Initial incarnations have been released in experimental mode based on Airflow 2x and this executor has now evolved to leverage the Airflow 3 API Server.</p>\n<h3 id=\"event-driven-scheduling-and-data-assets\">Event-driven scheduling and Data Assets</h3>\n<p>Airflow 3 represents a foundational jump in enabling Airflow to react to events happening outside of Airflow, including data assets being created or updated by external data systems. This was based on the evolution of Datasets into Data Assets and was broken out into several AIPs as detailed below, which are all part of the release.</p>\n<p>The fundamental evolution of Datasets into Data Assets has been done as part of “Introducing Data Assets” (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-74&#43;Introducing&#43;Data&#43;Assets\">AIP-74</a>). This introduces the concept of Watchers which is leveraged by other capabilities detailed below. A significant enhancement around Data Assets is the New Asset-Centric Syntax (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-75&#43;New&#43;Asset-Centric&#43;Syntax\">AIP-75</a>) for defining Assets easily with DAGs using the Python decorator syntax, which is part of this release.</p>\n<p>External event driven scheduling (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-82&#43;External&#43;event&#43;driven&#43;scheduling&#43;in&#43;Airflow\">AIP-82</a>) is based on the foundational Data Assets work described above, specifically Watchers. The initial scope as defined in the AIP is complete and now incorporates a “Common Message Bus” interface. This release also includes an implementation of the above for AWS SQS as an “out of the box” integration, which demonstrates DAGs being triggered upon the arrival of a message in AWS SQS.</p>\n<h3 id=\"inference-execution-and-hyperparameter-tuning\">Inference execution and hyperparameter tuning</h3>\n<p>Many ML and AI Engineers are already using Airflow for ML/AI Ops, especially for model training. However, there were challenges for Inference Execution. Enhancing Airflow for Inference Execution by adding support for non-data-interval-Dags (sorry, that’s a mouthful) is an important change. This work is covered as part of “Remove Execution date unique constraint from DAG run” (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-83&#43;Remove&#43;Execution&#43;Date&#43;Unique&#43;Constraint&#43;from&#43;DAG&#43;Run\">AIP-83</a>)</p>\n<h2 id=\"security-and-usability-improvements\">Security and usability improvements</h2>\n<h3 id=\"ui-modernization\">UI Modernization</h3>\n<p>The Airflow UI has been completely rewritten as part of Airflow 3 and incorporates a significantly improved user experience which seamlessly blends Asset-oriented workflows with Task-oriented workflows. This is a dramatic improvement which enables developers to author DAGs as they choose, without being opinionated about “a right way”.</p>\n<p><img src=\"/blog/airflow-three-point-oh-is-here/airflow-3.0-ui.gif\" alt=\"Airflow 3.0’s new UI\"></p>\n<p>Check out <a href=\"http://airflow.apache.org/docs/apache-airflow/stable/ui.html\">the screenshots in the docs</a> for more.</p>\n<p>Recreating it to be based on React and the FastAPI has been a massive project and was broken out into several AIPs as detailed below.</p>\n<p>The foundation for the new UI is the REST API and a set of internal APIs for UI Operations (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-84&#43;UI&#43;REST&#43;API\">AIP-84</a>) both of which are now based on FastAPI. These APIs are served as part of the API Server described above as part of the Task Execution framework.</p>\n<p>The Airflow 3.0 UI has been significantly improved and includes a streamlined user experience workflow encompassing both the Grid and Graph views. The interaction between DAGs and Assets are also more streamlined. User experience is always a work in progress and we very much appreciate your feedback. This is covered in great detail as part of the Modern Web Application proposal (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-38&#43;Modern&#43;Web&#43;Application\">AIP-38</a>).</p>\n<p>As part of this project, Flask AppBuilder has now been moved into a separate provider package and is no longer a part of the Core Airflow package. This enables an easier security and maintenance update process, while retaining backwards compatibility. This is documented as part of the “Remove Flask App Builder as a Core Dependency” proposal (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-79%3A&#43;Remove&#43;Flask&#43;AppBuilder&#43;as&#43;Core&#43;dependency\">AIP-79</a>).</p>\n<h3 id=\"security\">Security</h3>\n<p>A key benefit of the Task Execution Interface and the API server is Task Isolation. This has often been requested by Airflow enterprise deployments for a better security posture when an Airflow deployment is shared by multiple teams. Further security and authorization patterns can be developed on top of this foundation as more detailed requirements are uncovered.</p>\n<p>Improving the CLI and reducing the maintenance burden by having the CLI use the Airflow APIs, rather than direct access is an important evolution for Airflow. We have now split the core Airflow CLI into two parts, the first for local development and backwards compatibility and the second for remote access using the API. The second will be a new provider package called “airflowctl” which can be optionally installed along with Core Airflow. This is documented in more detail as part of the “Enhanced security in CLI via Integration of API” proposal (<a href=\"https://cwiki.apache.org/confluence/display/AIRFLOW/AIP-81&#43;Enhanced&#43;Security&#43;in&#43;CLI&#43;via&#43;Integration&#43;of&#43;API\">AIP-81</a>).</p>\n<h2 id=\"an-amazing-community\">An amazing community</h2>\n<p>This release could not have happened without the inspiration and technical leadership of key contributors who led the AIPs listed above. We thank them all here: Ash Berlin-Taylor, Brent Bovenzi, Bugra Ozturk, Constance Martineau, Daniel Standish, Jed Cunningham, Jens Scheffler, Kaxil Naik, Pierre Jeambrun, Vincent Beck, and Vikram Koka. We also wanted to thank Jarek Potiuk for the critical development infrastructure and packaging work and to Elad Kalif for shepherding all the key provider changes needed. We would like to recognize Wei Lee and Ankit Chaurasia for their work on the upgrade utilities to enable users to easily upgrade to Airflow 3.</p>\n<p>Finally, a huge shoutout to Jed Cunningham and Kaxil Naik for the critical part of release management!</p>\n<p>Over three hundred developers around the world have contributed to making this release a reality. We thank them all for their contributions. They are listed here in alphabetical order:</p>\n<ul>\n<li>Aakcht</li>\n<li>Aaron Chen</li>\n<li>Abhishek</li>\n<li>Adam Turner</li>\n<li>Adan</li>\n<li>Aditya Yadav</li>\n<li>Adrian Lazar</li>\n<li>Adrian Perea</li>\n<li>Ajit J Gupta</li>\n<li>Albert Okiri</li>\n<li>Alex Waygood</li>\n<li>Alexander Millin</li>\n<li>AlteredOracle</li>\n<li>Amar Prakash Pandey</li>\n<li>Amir Mor</li>\n<li>Amogh Desai</li>\n<li>Amol Saini</li>\n<li>Anakin Skywalker Pactores</li>\n<li>Andor Markus</li>\n<li>Andre Miranda</li>\n<li>Andres Lowrie</li>\n<li>Andrew Arochukwu</li>\n<li>Andrew Stein</li>\n<li>Andrii Abramov</li>\n<li>Andrii Korotkov</li>\n<li>Andrii Yerko</li>\n<li>Ankit Chaurasia</li>\n<li>Anthony Lin</li>\n<li>Antony Southworth</li>\n<li>Aritra Basu</li>\n<li>Arjun Pathak</li>\n<li>Arnel Jan Sarmiento</li>\n<li>Arnout Engelen</li>\n<li>Artem Suslov</li>\n<li>Arthur Braveheart</li>\n<li>Artour</li>\n<li>Artur Skarżyński</li>\n<li>Arunav Gupta</li>\n<li>Aryan Khurana</li>\n<li>Ash Berlin-Taylor</li>\n<li>AshKatzEm</li>\n<li>AutomationDev85</li>\n<li>Avihais12344</li>\n<li>Azhar Izzannada E</li>\n<li>Baitur Ulukbekov</li>\n<li>Balthazar Rouberol</li>\n<li>Bartosz Jankiewicz</li>\n<li>Bas</li>\n<li>Ben Chen</li>\n<li>Benoit Perigaud</li>\n<li>Biswamitra Biswas</li>\n<li>Bjorn Olsen</li>\n<li>Bluefox9x5</li>\n<li>Bohdan Udovenko</li>\n<li>Bonnie Why</li>\n<li>Boris Morel</li>\n<li>Bowrna</li>\n<li>Brent Bovenzi</li>\n<li>Bugra Ozturk</li>\n<li>Błażej Tecław</li>\n<li>Castle Cheng</li>\n<li>Chris Luedtke</li>\n<li>Christian Yarros</li>\n<li>Christos Bisias</li>\n<li>Collin McNulty</li>\n<li>Computer Network Investigation</li>\n<li>Constance Martineau</li>\n<li>D. Ferruzzi</li>\n<li>DShi</li>\n<li>Daniel Gellert</li>\n<li>Daniel Imberman</li>\n<li>Daniel Standish</li>\n<li>Daniel van der Ende</li>\n<li>Danish Amjad</li>\n<li>Danny Liu</li>\n<li>David Blain</li>\n<li>Derek</li>\n<li>Detlev V.</li>\n<li>Dewen Kong</li>\n<li>Sriraj Dheeraj Turaga</li>\n<li>Diogo Rodrigues</li>\n<li>Dmitry Astankov</li>\n<li>Dmitry Pustoshilov</li>\n<li>Dominic Leung</li>\n<li>Dong-yeong0</li>\n<li>Doug Guthrie</li>\n<li>Dylan Melotik</li>\n<li>Elad Kalif</li>\n<li>Eldar Kasmamytov</li>\n<li>Ephraim Anierobi</li>\n<li>Eric</li>\n<li>Everton Seiei Arakaki</li>\n<li>Farhan</li>\n<li>Fedor Kobak</li>\n<li>Felix Uellendall</li>\n<li>Fred Thomsen</li>\n<li>Fully.is(풀리)</li>\n<li>GPK</li>\n<li>Gagan Bhullar</li>\n<li>Geonwoo Kim</li>\n<li>GlenboLake</li>\n<li>Gopal Dirisala</li>\n<li>Gregory Borodin</li>\n<li>Guan-Ming (Wesley) Chiu</li>\n<li>Guangyang Li</li>\n<li>Guillaume Lostis</li>\n<li>Hari Selvarajan</li>\n<li>HassanAlahmed</li>\n<li>Hojin Jun</li>\n<li>Howard Yoo</li>\n<li>Huanjie Guo</li>\n<li>Hung</li>\n<li>Hussein Awala</li>\n<li>Hyunsoo Kang</li>\n<li>Ian Buss</li>\n<li>Idris Adebisi</li>\n<li>Igor Kholopov</li>\n<li>IlaiGigi</li>\n<li>Indrale Dnyaneshwar</li>\n<li>JISHAN GARGACHARYA</li>\n<li>Jaejun</li>\n<li>Jake Ferriero</li>\n<li>Jake Roach</li>\n<li>Jakub Dardzinski</li>\n<li>James Chaldecott</li>\n<li>James Regan</li>\n<li>Jarek Potiuk</li>\n<li>Jasmin Patel</li>\n<li>Jason</li>\n<li>Jed Cunningham</li>\n<li>Jeff Harrison</li>\n<li>Jens Scheffler</li>\n<li>Jianzhun Du</li>\n<li>Jimmy McBroom</li>\n<li>Joao Amaral</li>\n<li>João Pedro M Miguel</li>\n<li>Joel Labes</li>\n<li>Joey Cumines</li>\n<li>Joffrey Bienvenu</li>\n<li>John Bampton</li>\n<li>John C. Merfeld</li>\n<li>Johnny1cyber</li>\n<li>José Joaquín Virtudes Castro</li>\n<li>Joseph Ang</li>\n<li>JoshuaXOng</li>\n<li>Josix</li>\n<li>Julian Maicher</li>\n<li>Kacper Kulczak</li>\n<li>Kacper Muda</li>\n<li>Kalyan R</li>\n<li>Kamil Breguła</li>\n<li>Karen Braganza</li>\n<li>Karthik Dulam</li>\n<li>Karthik Ravi</li>\n<li>Karthikeyan Singaravelan</li>\n<li>Kaxil Naik</li>\n<li>Kevin Allen</li>\n<li>Kim</li>\n<li>Kris</li>\n<li>Kunal Bhattacharya</li>\n<li>LIU ZHE YOU</li>\n<li>Lennox Stevenson</li>\n<li>Linh</li>\n<li>Lorin Dawson</li>\n<li>Lou ✨</li>\n<li>Lucy Hu</li>\n<li>Lukas Mikelionis</li>\n<li>Luyang Liu</li>\n<li>Lyndon Fan</li>\n<li>M. Olcay Tercanlı</li>\n<li>Maciej Obuchowski</li>\n<li>Madison Swain-Bowden</li>\n<li>Maksim</li>\n<li>Marcelo Trylesinski</li>\n<li>Marcos Marx</li>\n<li>Maria</li>\n<li>Mark Andreev</li>\n<li>Mark H</li>\n<li>Matt Burke</li>\n<li>Matt Dupree</li>\n<li>Maxim Martynov</li>\n<li>Mayuresh Kedari</li>\n<li>Mehul Goyal</li>\n<li>Mike</li>\n<li>Mike Beckhusen</li>\n<li>Mikhail Dengin</li>\n<li>MishchenkoYuriy</li>\n<li>Muhammad Hanif Mohamad Musa</li>\n<li>Myles Hollowed</li>\n<li>Narendra-Neerukonda</li>\n<li>Natsu</li>\n<li>Nikita</li>\n<li>Niko Oliveira</li>\n<li>Nishant Gupta</li>\n<li>Nitesh Kumar Dubey Samsung</li>\n<li>Nitochkin</li>\n<li>Oleg Ovcharuk</li>\n<li>Oleksandr Slynko</li>\n<li>Omkar P</li>\n<li>Owen Leung</li>\n<li>Pandycool</li>\n<li>Pankaj Koti</li>\n<li>Park Jiwon</li>\n<li>Pavan Sharma</li>\n<li>Peng-Jui Wang</li>\n<li>Peter Debelak</li>\n<li>Phani Kumar</li>\n<li>Pierre Jeambrun</li>\n<li>Po-Yu Hsieh</li>\n<li>Prajwal7842</li>\n<li>Pratiksha</li>\n<li>Purna Chander</li>\n<li>Rafa</li>\n<li>Rahul Madan</li>\n<li>Rahul Vats</li>\n<li>Ramit Kataria</li>\n<li>Rishabh Srivastava</li>\n<li>Rushabh Garambha</li>\n<li>Ryan Eakman</li>\n<li>Ryan Hatter</li>\n<li>Rytis Ulys</li>\n<li>SAI GANESH S</li>\n<li>Sam Lendle</li>\n<li>SamLiaoP</li>\n<li>Saumil Patel</li>\n<li>SaurabhhB</li>\n<li>Sean Gabriel Bayron</li>\n<li>Sean Rose</li>\n<li>Sebastian Daum</li>\n<li>SeonghwanLee</li>\n<li>Shahar Epstein</li>\n<li>Shahbaz Aamir</li>\n<li>Shoaib UR Rehman</li>\n<li>Shubham Raj</li>\n<li>Simon Sawicki</li>\n<li>Siva Kumar Edupuganti</li>\n<li>Sneha Prabhu</li>\n<li>Sooter Saalu</li>\n<li>Srabasti Banerjee</li>\n<li>Stefan Keidel</li>\n<li>Steven Loria</li>\n<li>Steven Shidi Zhou</li>\n<li>Stijn De Haes</li>\n<li>Success Moses</li>\n<li>TakawaAkirayo</li>\n<li>Tamara Janina Fingerlin</li>\n<li>Tamas Palinkas</li>\n<li>Tatiana Al-Chueyr</li>\n<li>Topher Anderson</li>\n<li>Tzu-ping Chung</li>\n<li>Usiel Riedl</li>\n<li>Utkarsh Sharma</li>\n<li>Valentyn</li>\n<li>Venkat VJ</li>\n<li>Vikram Koka</li>\n<li>Vikram Medabalimi</li>\n<li>Vikramaditya Gaonkar</li>\n<li>Vincent</li>\n<li>Vincent Kling</li>\n<li>VladaZakharova</li>\n<li>Waldemar Hummer</li>\n<li>Wang Ran (汪然)</li>\n<li>Wei Lee</li>\n<li>Wojciech Szlachta</li>\n<li>Wonseok Yang</li>\n<li>Yeonguk Choo</li>\n<li>Yohei Kishimoto</li>\n<li>Youngha, Park</li>\n<li>Yuan Li</li>\n<li>Zach Liu</li>\n<li>Zhen-Lun (Kevin) Hong</li>\n<li>althati</li>\n<li>ambikagarg</li>\n<li>atrbgithub</li>\n<li>awdavidson</li>\n<li>codecae</li>\n<li>dan-js</li>\n<li>darkag</li>\n<li>davidfgcorreia</li>\n<li>dominikhei</li>\n<li>ellisms</li>\n<li>enisnazif</li>\n<li>fritz-astronomer</li>\n<li>gaurav7261</li>\n<li>geraj1010</li>\n<li>got686-yandex</li>\n<li>harjeevan maan</li>\n<li>harry.shi</li>\n<li>hikaruhk</li>\n<li>hprassad</li>\n<li>ipsatrivedi</li>\n<li>jaejun</li>\n<li>jj.lee</li>\n<li>jonhspyro</li>\n<li>kanagaraj</li>\n<li>kandharvishnu</li>\n<li>leoguzman</li>\n<li>lucasmo</li>\n<li>luoyuliuyin</li>\n<li>mahdi alizadeh</li>\n<li>majorosdonat</li>\n<li>max</li>\n<li>mayankymailusfedu</li>\n<li>michaeljs-c</li>\n<li>morooshka</li>\n<li>ninad-opsverse</li>\n<li>olegkachur-e</li>\n<li>paolomoriello</li>\n<li>perry2of5</li>\n<li>pgvishnuram</li>\n<li>phi-friday</li>\n<li>rahulgoyal2987</li>\n<li>raphaelauv</li>\n<li>rgriffier</li>\n<li>rom sharon</li>\n<li>saucoide</li>\n<li>sbock-slack</li>\n<li>sc-anssi</li>\n<li>seyoon-lim</li>\n<li>simonprydden</li>\n<li>skandala23</li>\n<li>sonu4578</li>\n<li>suyesh-amatya</li>\n<li>svellaiyan</li>\n<li>tnk-ysk</li>\n<li>uzhastik</li>\n<li>vatsrahul1001</li>\n<li>vfeldsher</li>\n<li>xavipuerto</li>\n<li>xitep</li>\n<li>yangyulely</li>\n<li>yunchi</li>\n<li>鐘翊修</li>\n<li>김영준</li>\n</ul>\n<h2 id=\"whats-next\">What’s Next</h2>\n<p>We’d love your feedback. Try out the release, open issues, file PRs, or just join the conversation on the Airflow dev list, Slack, and GitHub.\nLet’s build the future of data orchestration—together.</p>"
---

We announced our intent to focus on Apache Airflow 3.0® as the next big milestone for the Airflow project at the Airflow Summit in September 2024. We are delighted to announce that Airflow 3.0 is now released!
A Major Release, Four Years in the Making
Airflow 3.0 is the biggest release in Airflow’s history—2.0 was released in 2020, and the last 4 years have seen incremental updates and releases every quarter with version 2.10 released in Q4 2024. With over 30 million monthly downloads (up over 30x since 2020) and 80,000 organizations (up from 25,000 in 2020) now using Airflow, we’ve seen an incredible growth in popularity since 2.0.
Over the last four years, Airflow has grown to power business critical data workflows within organizations of all sizes. We have seen an exponential increase in the use cases for Airflow from its beginnings with ETL, ELT, and Reverse ETL, with over 30% of Airflow users using it for MLOps, and 10% using it for GenAI workflows. Airflow 3 is a response to this use case expansion and is the standard for data application development across the enterprise.
Here are some highlights:
Airflow 3 is significantly easier to use for data practitioners and incorporates their key requests for critical changes to Airflow. Early user reactions to features such as the new React based UI, DAG Versioning, and improved Backfill support have been incredibly positive. I was ecstatic to see the reaction from data engineers when I demonstrated this at a recent Airflow meetup.
The seamless UI transition of navigating between Asset-oriented workflows and Task-oriented workflows is beautiful. Once again, Airflow lets the developer choose how you want to develop and navigate without imposing any restrictions.
Introduction of Event Driven Scheduling enables Airflow to seamlessly integrate with messaging providers and react to events happening and data assets being updated outside of Airflow.
The big architecture change with the introduction of the Task Execution Interface and the Task SDKs, enable a stronger security model, including secure, scalable execution across multi-cloud, hybrid-cloud, and local data center deployments.
This is the result of 300+ developers within the Airflow community working together tirelessly for many months and I could not be more proud to be part of this wonderful team. Here are some more details of the release.
Highly requested UX features
DAG Versioning
DAG Versioning has been the most requested feature within Airflow based on the annual Airflow survey. As implemented in Airflow 3, a DAG will run through to completion based on the version at start, even if a new version has been uploaded while this DAG was being run. All DAG runs in the UI are now associated with the version of the DAG as run including the Task structure, the code, the logs, and more.
This is described in two AIPs: Improve DAG history (AIP-65) , and DAG Bundles and Parsing (AIP-66).

Backfills improvements
Another long-standing user request has been better support for backfills. Often discussed in the context of machine learning, backfills also apply to traditional ETL and ELT use cases.  In Airflow 3, backfills are run within the scheduler for improved control, scalability, and diagnostics. Backfills can now be started from the UI or API, and monitored within the UI.
This was defined as part of “Scheduler-managed backfills” (AIP-78), and an example screenshot is shown below:

Run anywhere, at any time, in any Language
Run anywhere, in any language
A foundational goal of Airflow 3 is allowing execution in any environment, in any language. A key component of this is the Task Execution Interface (AIP-72), which enables the evolution of Airflow into a client-server architecture, which represents one of the most significant architectural shifts in Airflow’s history. This supports Celery, Kubernetes, and Local Executors, but also enables new capabilities. A component of this change is the API server which represents input for the Task Execution Interface. This foundational feature enables multi-cloud deployments and multi-language support in the form of the Task Execution API. The Airflow 3 release includes the Python TaskSDK which enables backward compatibility for existing DAGs. TaskSDKs for additional languages, starting with Golang will be released over the next few months.
To enable data pipelines to be run on edge devices, outside of the core data centers and clouds, the Edge Executor (AIP-69) is available as a provider package with Airflow 3. This is an incremental feature built on top of the Task Execution Interface. Initial incarnations have been released in experimental mode based on Airflow 2x and this executor has now evolved to leverage the Airflow 3 API Server.
Event-driven scheduling and Data Assets
Airflow 3 represents a foundational jump in enabling Airflow to react to events happening outside of Airflow, including data assets being created or updated by external data systems. This was based on the evolution of Datasets into Data Assets and was broken out into several AIPs as detailed below, which are all part of the release.
The fundamental evolution of Datasets into Data Assets has been done as part of “Introducing Data Assets” (AIP-74). This introduces the concept of Watchers which is leveraged by other capabilities detailed below. A significant enhancement around Data Assets is the New Asset-Centric Syntax (AIP-75) for defining Assets easily with DAGs using the Python decorator syntax, which is part of this release.
External event driven scheduling (AIP-82) is based on the foundational Data Assets work described above, specifically Watchers. The initial scope as defined in the AIP is complete and now incorporates a “Common Message Bus” interface. This release also includes an implementation of the above for AWS SQS as an “out of the box” integration, which demonstrates DAGs being triggered upon the arrival of a message in AWS SQS.
Inference execution and hyperparameter tuning
Many ML and AI Engineers are already using Airflow for ML/AI Ops, especially for model training. However, there were challenges for Inference Execution. Enhancing Airflow for Inference Execution by adding support for non-data-interval-Dags (sorry, that’s a mouthful) is an important change. This work is covered as part of “Remove Execution date unique constraint from DAG run” (AIP-83)
Security and usability improvements
UI Modernization
The Airflow UI has been completely rewritten as part of Airflow 3 and incorporates a significantly improved user experience which seamlessly blends Asset-oriented workflows with Task-oriented workflows. This is a dramatic improvement which enables developers to author DAGs as they choose, without being opinionated about “a right way”.

Check out the screenshots in the docs for more.
Recreating it to be based on React and the FastAPI has been a massive project and was broken out into several AIPs as detailed below.
The foundation for the new UI is the REST API and a set of internal APIs for UI Operations (AIP-84) both of which are now based on FastAPI. These APIs are served as part of the API Server described above as part of the Task Execution framework.
The Airflow 3.0 UI has been significantly improved and includes a streamlined user experience workflow encompassing both the Grid and Graph views. The interaction between DAGs and Assets are also more streamlined. User experience is always a work in progress and we very much appreciate your feedback. This is covered in great detail as part of the Modern Web Application proposal (AIP-38).
As part of this project, Flask AppBuilder has now been moved into a separate provider package and is no longer a part of the Core Airflow package. This enables an easier security and maintenance update process, while retaining backwards compatibility. This is documented as part of the “Remove Flask App Builder as a Core Dependency” proposal (AIP-79).
Security
A key benefit of the Task Execution Interface and the API server is Task Isolation. This has often been requested by Airflow enterprise deployments for a better security posture when an Airflow deployment is shared by multiple teams. Further security and authorization patterns can be developed on top of this foundation as more detailed requirements are uncovered.
Improving the CLI and reducing the maintenance burden by having the CLI use the Airflow APIs, rather than direct access is an important evolution for Airflow. We have now split the core Airflow CLI into two parts, the first for local development and backwards compatibility and the second for remote access using the API. The second will be a new provider package called “airflowctl” which can be optionally installed along with Core Airflow. This is documented in more detail as part of the “Enhanced security in CLI via Integration of API” proposal (AIP-81).
An amazing community
This release could not have happened without the inspiration and technical leadership of key contributors who led the AIPs listed above. We thank them all here: Ash Berlin-Taylor, Brent Bovenzi, Bugra Ozturk, Constance Martineau, Daniel Standish, Jed Cunningham, Jens Scheffler, Kaxil Naik, Pierre Jeambrun, Vincent Beck, and Vikram Koka. We also wanted to thank Jarek Potiuk for the critical development infrastructure and packaging work and to Elad Kalif for shepherding all the key provider changes needed. We would like to recognize Wei Lee and Ankit Chaurasia for their work on the upgrade utilities to enable users to easily upgrade to Airflow 3.
Finally, a huge shoutout to Jed Cunningham and Kaxil Naik for the critical part of release management!
Over three hundred developers around the world have contributed to making this release a reality. We thank them all for their contributions. They are listed here in alphabetical order:
Aakcht
Aaron Chen
Abhishek
Adam Turner
Adan
Aditya Yadav
Adrian Lazar
Adrian Perea
Ajit J Gupta
Albert Okiri
Alex Waygood
Alexander Millin
AlteredOracle
Amar Prakash Pandey
Amir Mor
Amogh Desai
Amol Saini
Anakin Skywalker Pactores
Andor Markus
Andre Miranda
Andres Lowrie
Andrew Arochukwu
Andrew Stein
Andrii Abramov
Andrii Korotkov
Andrii Yerko
Ankit Chaurasia
Anthony Lin
Antony Southworth
Aritra Basu
Arjun Pathak
Arnel Jan Sarmiento
Arnout Engelen
Artem Suslov
Arthur Braveheart
Artour
Artur Skarżyński
Arunav Gupta
Aryan Khurana
Ash Berlin-Taylor
AshKatzEm
AutomationDev85
Avihais12344
Azhar Izzannada E
Baitur Ulukbekov
Balthazar Rouberol
Bartosz Jankiewicz
Bas
Ben Chen
Benoit Perigaud
Biswamitra Biswas
Bjorn Olsen
Bluefox9x5
Bohdan Udovenko
Bonnie Why
Boris Morel
Bowrna
Brent Bovenzi
Bugra Ozturk
Błażej Tecław
Castle Cheng
Chris Luedtke
Christian Yarros
Christos Bisias
Collin McNulty
Computer Network Investigation
Constance Martineau
D. Ferruzzi
DShi
Daniel Gellert
Daniel Imberman
Daniel Standish
Daniel van der Ende
Danish Amjad
Danny Liu
David Blain
Derek
Detlev V.
Dewen Kong
Sriraj Dheeraj Turaga
Diogo Rodrigues
Dmitry Astankov
Dmitry Pustoshilov
Dominic Leung
Dong-yeong0
Doug Guthrie
Dylan Melotik
Elad Kalif
Eldar Kasmamytov
Ephraim Anierobi
Eric
Everton Seiei Arakaki
Farhan
Fedor Kobak
Felix Uellendall
Fred Thomsen
Fully.is(풀리)
GPK
Gagan Bhullar
Geonwoo Kim
GlenboLake
Gopal Dirisala
Gregory Borodin
Guan-Ming (Wesley) Chiu
Guangyang Li
Guillaume Lostis
Hari Selvarajan
HassanAlahmed
Hojin Jun
Howard Yoo
Huanjie Guo
Hung
Hussein Awala
Hyunsoo Kang
Ian Buss
Idris Adebisi
Igor Kholopov
IlaiGigi
Indrale Dnyaneshwar
JISHAN GARGACHARYA
Jaejun
Jake Ferriero
Jake Roach
Jakub Dardzinski
James Chaldecott
James Regan
Jarek Potiuk
Jasmin Patel
Jason
Jed Cunningham
Jeff Harrison
Jens Scheffler
Jianzhun Du
Jimmy McBroom
Joao Amaral
João Pedro M Miguel
Joel Labes
Joey Cumines
Joffrey Bienvenu
John Bampton
John C. Merfeld
Johnny1cyber
José Joaquín Virtudes Castro
Joseph Ang
JoshuaXOng
Josix
Julian Maicher
Kacper Kulczak
Kacper Muda
Kalyan R
Kamil Breguła
Karen Braganza
Karthik Dulam
Karthik Ravi
Karthikeyan Singaravelan
Kaxil Naik
Kevin Allen
Kim
Kris
Kunal Bhattacharya
LIU ZHE YOU
Lennox Stevenson
Linh
Lorin Dawson
Lou ✨
Lucy Hu
Lukas Mikelionis
Luyang Liu
Lyndon Fan
M. Olcay Tercanlı
Maciej Obuchowski
Madison Swain-Bowden
Maksim
Marcelo Trylesinski
Marcos Marx
Maria
Mark Andreev
Mark H
Matt Burke
Matt Dupree
Maxim Martynov
Mayuresh Kedari
Mehul Goyal
Mike
Mike Beckhusen
Mikhail Dengin
MishchenkoYuriy
Muhammad Hanif Mohamad Musa
Myles Hollowed
Narendra-Neerukonda
Natsu
Nikita
Niko Oliveira
Nishant Gupta
Nitesh Kumar Dubey Samsung
Nitochkin
Oleg Ovcharuk
Oleksandr Slynko
Omkar P
Owen Leung
Pandycool
Pankaj Koti
Park Jiwon
Pavan Sharma
Peng-Jui Wang
Peter Debelak
Phani Kumar
Pierre Jeambrun
Po-Yu Hsieh
Prajwal7842
Pratiksha
Purna Chander
Rafa
Rahul Madan
Rahul Vats
Ramit Kataria
Rishabh Srivastava
Rushabh Garambha
Ryan Eakman
Ryan Hatter
Rytis Ulys
SAI GANESH S
Sam Lendle
SamLiaoP
Saumil Patel
SaurabhhB
Sean Gabriel Bayron
Sean Rose
Sebastian Daum
SeonghwanLee
Shahar Epstein
Shahbaz Aamir
Shoaib UR Rehman
Shubham Raj
Simon Sawicki
Siva Kumar Edupuganti
Sneha Prabhu
Sooter Saalu
Srabasti Banerjee
Stefan Keidel
Steven Loria
Steven Shidi Zhou
Stijn De Haes
Success Moses
TakawaAkirayo
Tamara Janina Fingerlin
Tamas Palinkas
Tatiana Al-Chueyr
Topher Anderson
Tzu-ping Chung
Usiel Riedl
Utkarsh Sharma
Valentyn
Venkat VJ
Vikram Koka
Vikram Medabalimi
Vikramaditya Gaonkar
Vincent
Vincent Kling
VladaZakharova
Waldemar Hummer
Wang Ran (汪然)
Wei Lee
Wojciech Szlachta
Wonseok Yang
Yeonguk Choo
Yohei Kishimoto
Youngha, Park
Yuan Li
Zach Liu
Zhen-Lun (Kevin) Hong
althati
ambikagarg
atrbgithub
awdavidson
codecae
dan-js
darkag
davidfgcorreia
dominikhei
ellisms
enisnazif
fritz-astronomer
gaurav7261
geraj1010
got686-yandex
harjeevan maan
harry.shi
hikaruhk
hprassad
ipsatrivedi
jaejun
jj.lee
jonhspyro
kanagaraj
kandharvishnu
leoguzman
lucasmo
luoyuliuyin
mahdi alizadeh
majorosdonat
max
mayankymailusfedu
michaeljs-c
morooshka
ninad-opsverse
olegkachur-e
paolomoriello
perry2of5
pgvishnuram
phi-friday
rahulgoyal2987
raphaelauv
rgriffier
rom sharon
saucoide
sbock-slack
sc-anssi
seyoon-lim
simonprydden
skandala23
sonu4578
suyesh-amatya
svellaiyan
tnk-ysk
uzhastik
vatsrahul1001
vfeldsher
xavipuerto
xitep
yangyulely
yunchi
鐘翊修
김영준
What’s Next
We’d love your feedback. Try out the release, open issues, file PRs, or just join the conversation on the Airflow dev list, Slack, and GitHub.
Let’s build the future of data orchestration—together.
