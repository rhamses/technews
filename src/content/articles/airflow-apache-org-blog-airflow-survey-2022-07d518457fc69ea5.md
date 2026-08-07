---
title: "Airflow Survey 2022"
link: "https://airflow.apache.org/blog/airflow-survey-2022/"
guid: "https://airflow.apache.org/blog/airflow-survey-2022/"
pubDate: "2022-06-17T00:00:00.000Z"
site_name: "Apache Airflow"
site_feed: "https://airflow.apache.org/blog/index.xml"
category: "Data"
summary: "Airflow User Survey 2022\nThis year’s survey has come and gone, and with it we’ve got a new batch of data for everyone! We collected 210 responses over two weeks. We continue to see growth in both contributions and downloads over the last two years, and expect that trend will continue through 2022.\nThe raw response data will be made available here soon, in the meantime, feel free to email john.thomas@astronomer.io for a copy.\nTL;DR\nOverview of the user\nLike previous years, more than half of the Airflow users are Data Engineers (54%). Solutions Architects (13%), Developers (12%), DevOps (6%) and Data Scientists (4%) are also active Airflow users! There was a slight increase in the representation of Solutions Architect roles compared to results from 2020 and 2019 .\nAirflow is used and popular in bigger companies, 64% of Airflow users work for companies with 200+ employees which is an 11 percent increase compared to 2020.\n62% of the survey participants have more than 6 Airflow users in their company.\nMore Airflow users (65.9%) are willing to recommend Apache Airflow compared to the survey results in 2020 and 2019. There is a general positive trend in a willingness to recommend Airflow, 93% of surveyed Airflow users are willing to recommend Airflow ( 85.7% in 2019 and 92% in 2020 ), only 1% of users are not likely to recommend (3.6% in 2019 and 3.5% in 2020).\nAirflow documentation is a critical source of information, with more than 90% (15% increase compared to results from 2020) of survey participants using the documentation. Airflow documentation is also one of the top areas to improve! What’s interesting, also Stack Overflow usage is critical, with about 60% users declaring to use it as a source of information (24% increase compared to results from 2020).\nDeployments\n85% of the Airflow users have between 1 and 7 active Airflow instances. 62.5% of the Airflow users have between 11 and 250 DAGs in their largest Airflow instance. 75% of the surveyed Airflow users have between 1 and 100 tasks per DAG.\nClose to 85% of users use one of the Airflow 2 versions, 9.2% users still use 1.10.15, while the remaining 6.3% are still using older Airflow 1 versions. The good news is that the majority of users on Airflow 1 are planning migration to Airflow 2 quite soon, with resources and capacity being the main blockers.\nIn comparison to results from 2020, more users were interested in monitoring in general and specifically in using tools such as external monitoring services (40.7%, up from 29.6%) and information from metabase (35.7%, up from 25.1%).\nCelery (52.7%) and Kubernetes (39.4%) are the most common executors used.\nUsage\n81.3% of Airflow users who responded to the survey don’t have any customisation of Airflow.\nXcom (69.8%) is the most popular method to pass inputs and outputs between tasks, however Saving and Retrieving Inputs and Outputs from Storage still plays an important role (49%).\nLineage itself is a quite new topic for Airflow users, most of them don’t use lineage solutions but might be interested if supported by Airflow (47.5%), are not familiar with data lineage (29%) or that data lineage is not their concern (13%).\nThe Airflow web UI is used heavily for Monitoring Runs (95.9%), Accessing Task Logs (89.8%), Manually triggering DAGs (85.2%), Clearing Tasks (82.7%) and Marking Tasks as successful (60.7%). The top 3 views used are: List of DAGs, Task Logs and DAG Runs, which is very similar to results from 2020 and 2019.\nCommunity and contribution\nMost Airflow users (57.1%) are aware they could contribute but do not, and an additional 21.7% contribute very rarely. 14.8% of users were not aware they could contribute. There is much more to be done to engage our community to be more active contributors and raise the current 6.4% of users who actively contribute, especially considering that one important blocker for contribution is lack of knowledge on how to start (37.7%).\nThe future of Airflow\nThe top area for improvement is still the Airflow web UI (49.5%), closely followed by more telemetry for logging, monitoring and alerting purposes (48%). However all those efforts should go in line with improved documentation (36.6.%) and resources about using the Airflow, especially when we take into account the need of onboarding new users (36.6%).\nDAG Versioning(66.2%) is a winner for new features in Airflow, and it’s not a surprise as this feature may positively impact daily work of Airflow users. It is followed by three other ideas: Dependency management and Data-driven scheduling (42.6%), More dynamic task structure (42.1%) and Multi-Tenancy (37.9%).\nOverview of the user\nWhat best describes your current occupation? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \nData Engineer\n          114\n          54%\n      \nSolutions Architect\n          27\n          13%\n      \nDeveloper\n          25\n          12%\n      \nDevOps\n          12\n          6%\n      \nData Scientist\n          8\n          4%\n      \nSupport Engineer\n          5\n          2%\n      \nData Analyst\n          3\n          1%\n      \nBusiness Analyst\n          2\n          1%\n      \nOther\n          14\n          7%\n      \nAccording to the survey, more than half of Airflow users are Data Engineers (54%). Roles of the remaining Airflow users might be broken down into Solutions Architects (13%), Developers (12%), DevOps (6%) and Data Scientists (4%). The 2022 results are similar to those from 2019 and 2020 with a slight increase in the representation of Solutions Architect roles.\nHow often do you interact with Airflow? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \nEvery day\n          154\n          73%\n      \nAt least once per week\n          36\n          17%\n      \nAt least once per month\n          11\n          5%\n      \nLess than once per month\n          9\n          4%\n      \nUsers who took the survey are actively using Airflow as part of their current role. 73% of Airflow users who responded use it on a daily basis, 17% weekly.\nHow many people work at your company? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \n201-5000\n          85\n          41%\n      \n5000+\n          49\n          23%\n      \n51-200\n          46\n          22%\n      \n11-50\n          20\n          10%\n      \n1-10\n          9\n          4%\n      \nAirflow is a framework that is used and popular in bigger companies, 64% of Airflow users who responded (compared to 52.7% in 2020) work for companies bigger than 200 employees (41% in companies size 201-5000 and 23% in companies size 5000+).\nHow many people at your company use Airflow? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \n6-20\n          80\n          38%\n      \n1-5\n          61\n          29%\n      \n51-200\n          49\n          24%\n      \n200+\n          18\n          9%\n      \nAirflow is generally used by small to medium-sized teams. 62% of the survey participants have more than 6 Airflow users in their company (38% have between 6 and 200 users, 24% between 51-200 users).\nHow likely are you to recommend Apache Airflow? (single choice)\n\n          \n          \n          \n      \n\n          % 2019\n          % 2020\n          % 2022\n      \nVery Likely\n          45.4%\n          61.6%\n          65.9%\n      \nLikely\n          40.3%\n          30.4%\n          26.9%\n      \nNeutral\n          10.7%\n          5.4%\n          6.3%\n      \nUnlikely\n          2.6%\n          1.5%\n          0.5%\n      \nVery Unlikely\n          1%\n          1%\n          0.5%\n      \nAccording to the survey, more Airflow users (65.9%) are willing to recommend Apache Airflow compared to the survey results in 2020 and 2019. There is a general positive trend in a willingness to recommend Airflow, 93% of surveyed Airflow users are willing to recommend Airflow (92% in 2020 and 85.7% in 2019), only 1% of users are not likely to recommend (3.6% in 2019 and 3.5% in 2020 ).\nWhat is your source of information about Airflow? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nDocumentation\n          189\n          90.4%\n      \nAirflow website (Blog, etc.)\n          142\n          67.9%\n      \nStack Overflow\n          126\n          60.3%\n      \nGithub Issues\n          104\n          49.8%\n      \nSlack\n          96\n          45.9%\n      \nAirflow Summit Videos\n          88\n          42.1%\n      \nGitHub Discussions\n          76\n          36.4%\n      \nAirflow Community Webinars\n          41\n          19.6%\n      \nAstronomer Registry\n          51\n          24.4%\n      \nAirflow Mailing List\n          34\n          16.3%\n      \nAirflow documentation is a critical source of information, with more than 90% of survey participants using the documentation. It is of increasing importance compared to results from 2020 where documentation was at about 75% level. Moreover, more than 60% of users are getting information from the Airflow website (67.9% ) and Stack Overflow (60.3%) which is also a big increase compared to 36% level in 2020. What’s interesting is that Slack usage decreased from 63.05% in 2020 to 45.9% in 2022.\nDeployments\nHow many active DAGs do you have in your largest Airflow instance? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \n51-250\n          66\n          31.7%\n      \n11-50\n          64\n          30.8%\n      \n5-10\n          25\n          12.0%\n      \n251-500\n          20\n          9.6%\n      \n<5\n          14\n          6.7%\n      \n1000+\n          10\n          4.8%\n      \n501-1000\n          9\n          4.3%\n      \n62.5% of the Airflow users surveyed have between 11 and 250 DAGs in their largest Airflow instance.\nHow many active Airflow instances do you have? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \n1\n          52\n          25.2%\n      \n2\n          46\n          22.3%\n      \n4-7\n          40\n          19.4%\n      \n3\n          37\n          18.0%\n      \n20+\n          19\n          9.2%\n      \n8-10\n          7\n          3.4%\n      \n11-20\n          5\n          2.4%\n      \n85% of the Airflow users surveyed have between 1 and 7 active Airflow instances, and nearly 50% have only 1 or 2.\nWhat is the maximum number of tasks that you have used in a single DAG?(single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \n11-25\n          51\n          24.5%\n      \n26-50\n          41\n          19.7%\n      \n51-100\n          35\n          16.8%\n      \n<10\n          29\n          13.9%\n      \n101-250\n          23\n          11.1%\n      \n501-1000\n          9\n          4.3%\n      \n1000-2500\n          8\n          3.8%\n      \n251-500\n          8\n          3.8%\n      \n2500-5000\n          4\n          1.9%\n      \n75% of the surveyed Airflow users have between 1 and 100 tasks per DAG.\nHow many schedulers do you have in your largest Airflow instance? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \n1\n          113\n          55.1%\n      \n2\n          61\n          29.8%\n      \n3\n          18\n          8.8%\n      \n4+\n          13\n          6.3%\n      \nMore than half of Airflow users who responded to the survey have 1 scheduler in their largest Airflow instance, however it’s important to notice that the second half of Airflow users decided to have 2 schedulers and more.\nWhat executor type do you use? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nCelery\n          107\n          52.7 %\n      \nKubernetes\n          80\n          39.4%\n      \nLocal\n          49\n          24.1%\n      \nSequential\n          21\n          10.3%\n      \nCeleryKubernetes\n          14\n          6.9%\n      \nCelery (52.7%) and Kubernetes (39.4%) are the most common executors used. CeleryKubernetes (6.9%) executor also started to be noticed and used by Airflow users.\nIf you use the Celery executor, how many workers do you have in your largest Airflow instance? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \n2-5\n          64\n          44.8%\n      \n10+\n          28\n          19.6%\n      \n1\n          26\n          18.2%\n      \n6-10\n          25\n          17.5%\n      \nAmongst Celery executor users who responded to the survey, close to half the number (44.8%) have between 2 and 5 workers in their largest Airflow instance. It’s notable that nearly a fifth (19.6%) have more than 10 workers.\nWhich version of Airflow do you currently use? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \n1.10.14 or older\n          13\n          6.3%\n      \n1.10.15\n          19\n          9.2%\n      \n2.0.x\n          23\n          11.1%\n      \n2.1.x\n          24\n          11.6%\n      \n2.2.x\n          79\n          38.2%\n      \n2.3.x\n          49\n          23.7%\n      \nIt’s good to see that close to 85% of users who responded to the survey use one of the Airflow 2 versions, 9.2% users still use 1.10.15, while the remaining 6.3% are still using older Airflow 1.10 versions.\nThe good news is that the majority of users on Airflow 1 are planning migration to Airflow 2 quite soon, as for now they have capacity constraints to undertake such a significant effort in their opinion. However, it can also be noticed in the survey’s comments that some users are generally skeptical towards migration to Airflow 2, they have negative opinions about the new scheduler or compatibility with the helm chart.\nAs to plans about migration to the newest version of Airflow 2, users who responded to the survey are committed and waiting especially for the features related to dynamic DAGs. However, some users also reported that they are waiting to solve some dependencies they have or they prefer to wait a little bit more for the community to test the new version before they decide to move on.\nWhat metrics do you use to monitor Airflow? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nExternal monitoring service\n          81\n          40.7%\n      \nInformation from metadatabase\n          71\n          35.7%\n      \nStatsd\n          54\n          27.1%\n      \nI do not use monitoring\n          47\n          23.6%\n      \nOther\n          14\n          7%\n      \nIn comparison to results from 2020, more users are monitoring airflow in some way. External monitoring services (40.7%) and information from metabase (35.7%) started to play a more important role in Airflow monitoring.\nHow do you deploy Airflow? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nOn virtual machines (for example using AWS EC2)\n          63\n          30.6 %\n      \nUsing a managed service like Astronomer, Google Composer or AWS MWAA\n          54\n          26.2 %\n      \nOn Kubernetes (using Apache Airflow’s helm chart)\n          46\n          22.3%\n      \nOn premises\n          43\n          20.9%\n      \nOn Kubernetes (using custom deployments)\n          39\n          18.9%\n      \nOn Kubernetes (using another helm chart)\n          21\n          10.2%\n      \nOther\n          13\n          6.5%\n      \nMore than half of Airflow users who responded (51.4%) deploy Airflow on Kubernetes. This is about 20 percent more than in 2020. The remaining top deployment methods are on virtual machines (30.6%) and via managed services (26.2%).\nHow do you distribute your DAGs from your developer environment to the cloud? (single choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nUsing a synchronizing process (Git sync, GCS fuse, etc)\n          100\n          49%\n      \nBake them into the docker image\n          51\n          25%\n      \nShared files system\n          30\n          14.7%\n      \nOther\n          16\n          7.9%\n      \nI don’t know\n          7\n          3.4%\n      \nAccording to the survey responses, the most popular way of distributing DAGs is a synchronizing process, about half of Airflow users (49%) use this process to distribute DAGs from developer environments to the cloud.\nUsage\nDo you have any customisation of Airflow? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \nNo, we use vanilla airflow\n          165\n          81.3%\n      \nYes, we have a separate fork\n          13\n          6.4%\n      \nYes, we use a 3rd-party fork\n          12\n          5.9%\n      \nYes, we’ve backpropagated bug fixes to an older version\n          13\n          6.4%\n      \nMore Airflow users (81.3%) don’t have any customisation of Airflow (compared to 75.9% in 2020). Those Airflow users who have customisations (18.7%) decided to introduce them mainly to separate development and production workflows, to backport bug fixes, due to security fixes or to run a backfill command on Kubernetes pod.\nWhich Metadata Database do you use? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %I\n      \nPostgreSQL 13\n          86\n          43.9%\n      \nPostgreSQL 12\n          74\n          37.8%\n      \nMySQL 8\n          22\n          11.2%\n      \nMySQL 5\n          9\n          4.6%\n      \nMariaDB\n          4\n          2.0%\n      \nMsSQL\n          1\n          0.5%\n      \nAccording to the survey responses, the most popular metadata databases are PostgreSQL 13 (43.9%) and PostgreSQL 12 (37.8%). This represents a sharp increase from 2020, up from 68.9% to 81.7% total on PostgreSQL, with a corresponding decrease in MySQL, down from 23% to 15%. This is an interesting result taking into account community discussion about not adding support for more database backend or even deciding on single database support.\nWhat’s the primary method by which you integrate with providers and external services in your Airflow DAGs? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \nUsing existing dedicated operators / hooks\n          70\n          34.5%\n      \nUsing Bash/Python operators\n          58\n          28.6%\n      \nUsing custom operators / hooks\n          50\n          24.6%\n      \nUsing KubernetesPodOperator\n          25\n          12.3%\n      \nAccording to the survey responses, the following ways of using Airflow to connect to external services are the most popular: Using existing dedicated operators / hooks (34.5%), Using Bash/Python operators (28.6%), Using custom operators / hooks (24.6%). Using KubernetesPodOperator (12.3%) is less popular regarding the survey responses. The integration with providers and external services methods ranking is similar to the one from 2020.\nWhat providers do you use in your Airflow DAGs? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nAmazon Web Services\n          112\n          55.4%\n      \nGoogle Cloud Platform / Google APIs\n          79\n          39.1%\n      \nInternal company systems\n          75\n          37.1%\n      \nHadoop / Spark / Flink / Other Apache software\n          57\n          28.2%\n      \nMicrosoft Azure\n          17\n          8.4%\n      \nOther\n          21\n          10.5%\n      \nI do not use external services in my Airflow DAGs\n          14\n          6.9%\n      \nIt’s not surprising that Amazon Web Services (55.4% vs 59.6% in 2020), on the next three positions Google Cloud Platform (39.1% vs 47.7% in 2020 ), Internal company systems (37.1% vs 55.6% in 2020), and other Apache products (28.2% vs 35.47% in 2020) are leading Airflow providers.\nHow frequently do you upgrade Airflow environments? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \nevery 12 months\n          46\n          22.9%\n      \nevery 6 months\n          49\n          24.4%\n      \nonce a quarter\n          47\n          23.4%\n      \nWhenever there is a newer version\n          59\n          29.4%\n      \nDifferent frequencies of Airflow environments upgrades are almost equally popular amongst Airflow users who responded to the survey.\nDo you upgrade providers separately from the core? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \nWhen I need it\n          83\n          42.8%\n      \nNever - always use the providers that come with Airflow\n          68\n          35.1%\n      \nI did not know I can upgrade providers separately\n          32\n          16.5%\n      \nI upgrade providers when they are released\n          11\n          5.7%\n      \nAccording to the survey responses, Airflow users most often upgrade providers when they need it (42.8%) or prefer to stay with providers that come with Airflow (35.1%). It’s surprising that 16.5% of Airflow users who responded to the survey were not aware that they can upgrade their providers separately from the core Airflow.\nHow do you pass inputs and outputs between tasks? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nXcom\n          141\n          69.8%\n      \nSaving and retrieving from Storage\n          99\n          49%\n      \nTaskFlow\n          37\n          18.3%\n      \nOther\n          5\n          2.5%\n      \nWe don’t\n          29\n          14.4%\n      \nAccording to the survey responses, Xcom (69.8%) is the most popular method to pass inputs and outputs between tasks, however Saving and Retrieving Inputs and Outputs from Storage still plays an important role (49%). It’s interesting that close to 15% of Airflow users who responded to the survey declare to not pass any outputs or inputs between tasks.\nDo you use a data lineage backend? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nNo, but I will use such feature if fully supported in Airflow\n          95\n          47.5%\n      \nI’m not familiar with data lineage\n          58\n          29%\n      \nNo, data lineage isn’t a concern for my usage\n          26\n          13%\n      \nYes, I send lineage to an Open Source lineage repository\n          15\n          7.5%\n      \nYes, I send lineage to an Enterprise lineage repository\n          7\n          3.5%\n      \nYes, I send lineage to a custom internal lineage repository\n          9\n          4.5%\n      \nWhen asked what lineage backend Airflow users use, the answers indicated that, while lineage itself is a quite new topic, there is interest in the feature as a whole. Most Airflow users responded that they don’t use lineage solutions currently but might be interested in the future if supported by Airflow (47.5%), are not familiar with data lineage (29%) or that data lineage is not their concern (13%).\nWhich interfaces of Airflow do you use as part of your current role? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nOriginal Airflow Graphical User Interface\n          189\n          94%\n      \nCLI\n          98\n          48.8%\n      \nAPI\n          80\n          39.8%\n      \nCustom (own created) Airflow Graphical User Interface\n          12\n          6%\n      \nGCP Composer\n          1\n          0.5%\n      \nIt’s clear that usage of Airflow web UI is important as 94% of users who responded to the survey declare to use it as a part of their current role. Usage of CLI (48.8%) and API (39.8%) goes in pairs but are not so common compared to Airflow web UI usage.\n(If GUI Marked) What do you use the GUI for? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nMonitoring Runs\n          188\n          95.9%\n      \nAccessing Task Logs\n          176\n          89.8%\n      \nManually triggering DAGs\n          167\n          85.2%\n      \nClearing Tasks\n          162\n          82.7%\n      \nMarking Tasks as successful\n          119\n          60.7%\n      \nOther\n          6\n          3%\n      \nAirflow web UI is used heavily for monitoring: Monitoring Runs (95.9%) and troubleshooting: Accessing Task Logs (89.8%), Manually triggering DAGs (85.2%), Clearing Tasks (82.7%) and Marking Tasks as successful (60.7%).\n(if CLI Marked) What do you use the CLI For? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nBackfilling\n          63\n          56.8%\n      \nManually triggering DAGs\n          52\n          46.8%\n      \nClearing Tasks\n          26\n          23.4%\n      \nMonitoring Runs\n          25\n          22.5%\n      \nAccessing Task Logs\n          21\n          18.9%\n      \nMarking Tasks as successful\n          11\n          9.9%\n      \nOther\n          17\n          15.3%\n      \nCompared to Airflow web UI, Airflow CLI is used mainly for Backfilling (56.8%) and Manually triggering DAGs (46.8%).\nIn Airflow, which UI views are important for you? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nList of DAGs\n          178\n          89.4%\n      \nTask Logs\n          162\n          81.4%\n      \nDAG Runs\n          160\n          80.4%\n      \nGraph view\n          147\n          73.9%\n      \nGrid/Tree View\n          138\n          69.3%\n      \nRun Details\n          117\n          58.8%\n      \nDAG details\n          111\n          55.8%\n      \nTask Instances\n          102\n          51.3%\n      \nTask Duration\n          91\n          45.7%\n      \nCode\n          90\n          45.2%\n      \nTask Tries\n          60\n          30.2%\n      \nGantt\n          48\n          21.4%\n      \nLanding Times\n          27\n          13.6%\n      \nOther\n          4\n          2%\n      \nUI views importance ranking shows that the majority Airflow users use Web UI mostly for monitoring and/or troubleshooting purposes, where the top 3 views are List of DAGs (89.4%), Task Logs (81.4%) and DAG Runs (80.4%). The results are very similar to those from 2020 and 2019.\nCommunity and contribution\nAre you participating in the Airflow community discussions? (single choice)\n\n\n          \n          \n      \n\n          No.\n          %\n      \nI see them from time to time\n          99\n          48.3%\n      \nI regularly follow what’s being discussed but don’t participate\n          53\n          25.9%\n      \nI didn’t know I could\n          41\n          20.0%\n      \nI actively participate in the discussions\n          12\n          5.9%\n      \n\n          No.\n          %\n      \nI know I can but I do not contribute\n          116\n          57.1%\n      \nVery rarely when it relates to what I need\n          44\n          21.7%\n      \nI do not know I could\n          30\n          14.8%\n      \nI regularly contribute by discussing, reviewing and submitting PR\n          13\n          6.4%\n      \nResults related to the Airflow contribution are very similar to those about participating in the Airflow community discussions. Most of the Airflow users (57.1%) who responded to the survey are aware but do not contribute or contribute very rarely (21.7%). 14.8% of users were not aware they could contribute. Once again, it’s a clear indicator that there is much more to be done to engage our community to be more active contributors and raise the current 6.4% of users who actively contribute.\nIf you do not contribute - why?\n\n\n          \n          \n      \n\n          No.\n          %\n      \nI have no time to contribute even if would like to\n          65\n          38.9%\n      \nI don’t know how to start\n          63\n          37.7%\n      \nI don’t have a need to contribute\n          19\n          11.4%\n      \nI didn’t know I could\n          12\n          7.2%\n      \nMy employer has policy that makes it difficult to contribute\n          8\n          4.8%\n      \nAccording to the survey results, the most important blocker for the Airflow contribution is limited time (38.9%), but surprisingly interesting and important blocker is also lack of knowledge on how to start (37.7%), followed by lack of knowledge that it’s possible to contribute (7.2%).\nThe future of Airflow\nIn your opinion, what could be improved in Airflow? (multiple choice)\n\n          \n          \n      \n\n          No.\n          %\n      \nWeb UI\n          100\n          49.5%\n      \nLogging, monitoring and alerting\n          97\n          48.0%\n      \nExamples, how-to, onboarding documentation\n          74\n          36.6%\n      \nTechnical documentation\n          74\n          36.6%\n      \nScheduler performance\n          56\n          27.7%\n      \nReliability\n          52\n          25.7%\n      \nDAG authoring\n          48\n          23.8%\n      \nREST API\n          43\n          21.3%\n      \nAuthentication and authorization\n          41\n          20.3%\n      \nExternal integration e.g. AWS, GCP, Apache products\n          41\n          20.3%\n      \nBetter support for various deployments (Docker-compose/Nomad/Others)\n          39\n          19.3%\n      \nEverything works fine for me\n          19\n          9.4%\n      \nI don’t know\n          4\n          2.0%\n      \nThe results are quite self-explanatory. According to the survey results, the top area for improvement is still the Airflow web UI (49.5%), closely followed by more telemetry for logging, monitoring and alerting purposes (48%). However all those efforts should go in line with improved documentation (36.6.%) and resources about using the Airflow, especially when we take into account the need of onboarding new users (36.6%).\nWhich features would you like to see in Airflow?\n\n          \n          \n      \n\n          No.\n          %\n      \nDAG Versioning\n          129\n          66.2%\n      \nDependency management and Data-driven scheduling\n          83\n          42.6%\n      \nMore dynamic task structure\n          82\n          42.1%\n      \nMulti-Tenancy\n          74\n          37.9%\n      \nSignal-based scheduling\n          67\n          34.4%\n      \nBetter Security (Isolation)\n          65\n          33.3%\n      \nSubmitting new DAGs externally via API\n          53\n          27.2%\n      \nComposable Operators\n          46\n          23.6%\n      \nSupport for native cloud executors (AWS/GCP/Azure etc.)\n          44\n          22.6%\n      \nBetter support for Machine Learning\n          38\n          19.5%\n      \nRemote CLI\n          36\n          18.5%\n      \nSupport for hybrid executors\n          22\n          11.3%\n      \nAccording to the survey results, DAG Versioning is a winner for new features in Airflow, and it’s not a surprise as this feature may positively impact daily work of Airflow users. It is followed by three other ideas: Dependency management and Data-driven scheduling (42.6%), More dynamic task structure (42.1%) and Multi-Tenancy (37.9%). Another interesting point from that question is that only 11.3% think that support for hybrid executors is needed in Airflow.\nData\nIf you’re interested in taking a look at the raw data yourself, it’s available here: (Airflow User Survey 2022.csv)[/data/survey-responses/airflow-user-survey-responses-2022.csv.zip]"
author: "Apache Airflow"
contentHtml: "<h1 id=\"airflow-user-survey-2022\">Airflow User Survey 2022</h1>\n<p>This year’s survey has come and gone, and with it we’ve got a new batch of data for everyone! We collected 210 responses over two weeks. We continue to see growth in both contributions and downloads over the last two years, and expect that trend will continue through 2022.</p>\n<p>The raw response data will be made available here soon, in the meantime, feel free to email <a href=\"mailto:john.thomas@astronomer.io\">john.thomas@astronomer.io</a> for a copy.</p>\n<h2 id=\"tldr\">TL;DR</h2>\n<h3 id=\"overview-of-the-user\">Overview of the user</h3>\n<ul>\n<li>Like previous years, more than half of the Airflow users are Data Engineers (54%). Solutions Architects (13%), Developers (12%), DevOps (6%) and Data Scientists (4%) are also active Airflow users! There was a slight increase in the representation of Solutions Architect roles compared to results from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> and <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a> .</li>\n<li>Airflow is used and popular in bigger companies, 64% of Airflow users work for companies with 200+ employees which is an 11 percent increase compared to <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>.</li>\n<li>62% of the survey participants have more than 6 Airflow users in their company.</li>\n<li>More Airflow users (65.9%) are willing to recommend Apache Airflow compared to the survey results in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> and <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a>. There is a general positive trend in a willingness to recommend Airflow, 93% of surveyed Airflow users are willing to recommend Airflow ( 85.7% in <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a> and 92% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> ), only 1% of users are not likely to recommend (3.6% in <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a> and 3.5% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>).</li>\n<li>Airflow documentation is a critical source of information, with more than 90% (15% increase compared to results from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>) of survey participants using the documentation. Airflow documentation is also one of the top areas to improve! What’s interesting, also Stack Overflow usage is critical, with about 60% users declaring to use it as a source of information (24% increase compared to results from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>).</li>\n</ul>\n<h3 id=\"deployments\">Deployments</h3>\n<ul>\n<li>85% of the Airflow users have between 1 and 7 active Airflow instances. 62.5% of the Airflow users have between 11 and 250 DAGs in their largest Airflow instance. 75% of the surveyed Airflow users have between 1 and 100 tasks per DAG.</li>\n<li>Close to 85% of users use one of the Airflow 2 versions, 9.2% users still use 1.10.15, while the remaining 6.3% are still using older Airflow 1 versions. The good news is that the majority of users on Airflow 1 are planning migration to Airflow 2 quite soon, with resources and capacity being the main blockers.</li>\n<li>In comparison to results from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>, more users were interested in monitoring in general and specifically in using tools such as external monitoring services (40.7%, up from 29.6%) and information from metabase (35.7%, up from 25.1%).</li>\n<li>Celery (52.7%) and Kubernetes (39.4%) are the most common executors used.</li>\n</ul>\n<h3 id=\"usage\">Usage</h3>\n<ul>\n<li>81.3% of Airflow users who responded to the survey don’t have any customisation of Airflow.</li>\n<li>Xcom (69.8%) is the most popular method to pass inputs and outputs between tasks, however Saving and Retrieving Inputs and Outputs from Storage still plays an important role (49%).</li>\n<li>Lineage itself is a quite new topic for Airflow users, most of them don’t use lineage solutions but might be interested if supported by Airflow (47.5%), are not familiar with data lineage (29%) or that data lineage is not their concern (13%).</li>\n<li>The Airflow web UI is used heavily for Monitoring Runs (95.9%), Accessing Task Logs (89.8%), Manually triggering DAGs (85.2%), Clearing Tasks (82.7%) and Marking Tasks as successful (60.7%). The top 3 views used are: List of DAGs, Task Logs and DAG Runs, which is very similar to results from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> and <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a>.</li>\n</ul>\n<h3 id=\"community-and-contribution\">Community and contribution</h3>\n<ul>\n<li>Most Airflow users (57.1%) are aware they could contribute but do not, and an additional 21.7% contribute very rarely. 14.8% of users were not aware they could contribute. There is much more to be done to engage our community to be more active contributors and raise the current 6.4% of users who actively contribute, especially considering that one important blocker for contribution is lack of knowledge on how to start (37.7%).</li>\n</ul>\n<h3 id=\"the-future-of-airflow\">The future of Airflow</h3>\n<ul>\n<li>The top area for improvement is still the Airflow web UI (49.5%), closely followed by more telemetry for logging, monitoring and alerting purposes (48%). However all those efforts should go in line with improved documentation (36.6.%) and resources about using the Airflow, especially when we take into account the need of onboarding new users (36.6%).</li>\n<li>DAG Versioning(66.2%) is a winner for new features in Airflow, and it’s not a surprise as this feature may positively impact daily work of Airflow users. It is followed by three other ideas: Dependency management and Data-driven scheduling (42.6%), More dynamic task structure (42.1%) and Multi-Tenancy (37.9%).</li>\n</ul>\n<h2 id=\"overview-of-the-user-1\">Overview of the user</h2>\n<h3 id=\"what-best-describes-your-current-occupation-single-choice\">What best describes your current occupation? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image1.png\" alt=\"alt_text\" title=\"user_occupations\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Data Engineer</td>\n          <td>114</td>\n          <td>54%</td>\n      </tr>\n      <tr>\n          <td>Solutions Architect</td>\n          <td>27</td>\n          <td>13%</td>\n      </tr>\n      <tr>\n          <td>Developer</td>\n          <td>25</td>\n          <td>12%</td>\n      </tr>\n      <tr>\n          <td>DevOps</td>\n          <td>12</td>\n          <td>6%</td>\n      </tr>\n      <tr>\n          <td>Data Scientist</td>\n          <td>8</td>\n          <td>4%</td>\n      </tr>\n      <tr>\n          <td>Support Engineer</td>\n          <td>5</td>\n          <td>2%</td>\n      </tr>\n      <tr>\n          <td>Data Analyst</td>\n          <td>3</td>\n          <td>1%</td>\n      </tr>\n      <tr>\n          <td>Business Analyst</td>\n          <td>2</td>\n          <td>1%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>14</td>\n          <td>7%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey, more than half of Airflow users are Data Engineers (54%). Roles of the remaining Airflow users might be broken down into Solutions Architects (13%), Developers (12%), DevOps (6%) and Data Scientists (4%). The 2022 results are similar to <a href=\"https://airflow.apache.org/blog/airflow-survey/\">those from 2019</a> and <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> with a slight increase in the representation of Solutions Architect roles.</p>\n<h3 id=\"how-often-do-you-interact-with-airflow-single-choice\">How often do you interact with Airflow? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image2.png\" alt=\"alt_text\" title=\"interaction_frequency\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Every day</td>\n          <td>154</td>\n          <td>73%</td>\n      </tr>\n      <tr>\n          <td>At least once per week</td>\n          <td>36</td>\n          <td>17%</td>\n      </tr>\n      <tr>\n          <td>At least once per month</td>\n          <td>11</td>\n          <td>5%</td>\n      </tr>\n      <tr>\n          <td>Less than once per month</td>\n          <td>9</td>\n          <td>4%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Users who took the survey are actively using Airflow as part of their current role. 73% of Airflow users who responded use it on a daily basis, 17% weekly.</p>\n<h3 id=\"how-many-people-work-at-your-company-single-choice\">How many people work at your company? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image3.png\" alt=\"alt_text\" title=\"company_size\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>201-5000</td>\n          <td>85</td>\n          <td>41%</td>\n      </tr>\n      <tr>\n          <td>5000+</td>\n          <td>49</td>\n          <td>23%</td>\n      </tr>\n      <tr>\n          <td>51-200</td>\n          <td>46</td>\n          <td>22%</td>\n      </tr>\n      <tr>\n          <td>11-50</td>\n          <td>20</td>\n          <td>10%</td>\n      </tr>\n      <tr>\n          <td>1-10</td>\n          <td>9</td>\n          <td>4%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Airflow is a framework that is used and popular in bigger companies, 64% of Airflow users who responded (compared to 52.7% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>) work for companies bigger than 200 employees (41% in companies size 201-5000 and 23% in companies size 5000+).</p>\n<h3 id=\"how-many-people-at-your-company-use-airflow-single-choice\">How many people at your company use Airflow? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image4.png\" alt=\"alt_text\" title=\"airflow_usage\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>6-20</td>\n          <td>80</td>\n          <td>38%</td>\n      </tr>\n      <tr>\n          <td>1-5</td>\n          <td>61</td>\n          <td>29%</td>\n      </tr>\n      <tr>\n          <td>51-200</td>\n          <td>49</td>\n          <td>24%</td>\n      </tr>\n      <tr>\n          <td>200+</td>\n          <td>18</td>\n          <td>9%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Airflow is generally used by small to medium-sized teams. 62% of the survey participants have more than 6 Airflow users in their company (38% have between 6 and 200 users, 24% between 51-200 users).</p>\n<h3 id=\"how-likely-are-you-to-recommend-apache-airflow-single-choice\">How likely are you to recommend Apache Airflow? (single choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>% 2019</td>\n          <td>% 2020</td>\n          <td>% 2022</td>\n      </tr>\n      <tr>\n          <td>Very Likely</td>\n          <td>45.4%</td>\n          <td>61.6%</td>\n          <td>65.9%</td>\n      </tr>\n      <tr>\n          <td>Likely</td>\n          <td>40.3%</td>\n          <td>30.4%</td>\n          <td>26.9%</td>\n      </tr>\n      <tr>\n          <td>Neutral</td>\n          <td>10.7%</td>\n          <td>5.4%</td>\n          <td>6.3%</td>\n      </tr>\n      <tr>\n          <td>Unlikely</td>\n          <td>2.6%</td>\n          <td>1.5%</td>\n          <td>0.5%</td>\n      </tr>\n      <tr>\n          <td>Very Unlikely</td>\n          <td>1%</td>\n          <td>1%</td>\n          <td>0.5%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey, more Airflow users (65.9%) are willing to recommend Apache Airflow compared to the survey results in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> and <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a>. There is a general positive trend in a willingness to recommend Airflow, 93% of surveyed Airflow users are willing to recommend Airflow (92% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> and 85.7% in <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a>), only 1% of users are not likely to recommend (3.6% in <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a> and 3.5% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> ).</p>\n<h3 id=\"what-is-your-source-of-information-about-airflow-multiple-choice\">What is your source of information about Airflow? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Documentation</td>\n          <td>189</td>\n          <td>90.4%</td>\n      </tr>\n      <tr>\n          <td>Airflow website (Blog, etc.)</td>\n          <td>142</td>\n          <td>67.9%</td>\n      </tr>\n      <tr>\n          <td>Stack Overflow</td>\n          <td>126</td>\n          <td>60.3%</td>\n      </tr>\n      <tr>\n          <td>Github Issues</td>\n          <td>104</td>\n          <td>49.8%</td>\n      </tr>\n      <tr>\n          <td>Slack</td>\n          <td>96</td>\n          <td>45.9%</td>\n      </tr>\n      <tr>\n          <td>Airflow Summit Videos</td>\n          <td>88</td>\n          <td>42.1%</td>\n      </tr>\n      <tr>\n          <td>GitHub Discussions</td>\n          <td>76</td>\n          <td>36.4%</td>\n      </tr>\n      <tr>\n          <td>Airflow Community Webinars</td>\n          <td>41</td>\n          <td>19.6%</td>\n      </tr>\n      <tr>\n          <td>Astronomer Registry</td>\n          <td>51</td>\n          <td>24.4%</td>\n      </tr>\n      <tr>\n          <td>Airflow Mailing List</td>\n          <td>34</td>\n          <td>16.3%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Airflow documentation is a critical source of information, with more than 90% of survey participants using the documentation. It is of increasing importance compared to results from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> where documentation was at about 75% level. Moreover, more than 60% of users are getting information from the Airflow website (67.9% ) and Stack Overflow (60.3%) which is also a big increase compared to 36% level in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>. What’s interesting is that Slack usage decreased from 63.05% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> to 45.9% in 2022.</p>\n<h2 id=\"deployments-1\">Deployments</h2>\n<h3 id=\"how-many-active-dags-do-you-have-in-your-largest-airflow-instance-single-choice\">How many active DAGs do you have in your largest Airflow instance? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image5.png\" alt=\"alt_text\" title=\"active_dags\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>51-250</td>\n          <td>66</td>\n          <td>31.7%</td>\n      </tr>\n      <tr>\n          <td>11-50</td>\n          <td>64</td>\n          <td>30.8%</td>\n      </tr>\n      <tr>\n          <td>5-10</td>\n          <td>25</td>\n          <td>12.0%</td>\n      </tr>\n      <tr>\n          <td>251-500</td>\n          <td>20</td>\n          <td>9.6%</td>\n      </tr>\n      <tr>\n          <td>&lt;5</td>\n          <td>14</td>\n          <td>6.7%</td>\n      </tr>\n      <tr>\n          <td>1000+</td>\n          <td>10</td>\n          <td>4.8%</td>\n      </tr>\n      <tr>\n          <td>501-1000</td>\n          <td>9</td>\n          <td>4.3%</td>\n      </tr>\n  </tbody>\n</table>\n<p>62.5% of the Airflow users surveyed have between 11 and 250 DAGs in their largest Airflow instance.</p>\n<h3 id=\"how-many-active-airflow-instances-do-you-have-single-choice\">How many active Airflow instances do you have? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image6.png\" alt=\"alt_text\" title=\"image_tooltip\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>1</td>\n          <td>52</td>\n          <td>25.2%</td>\n      </tr>\n      <tr>\n          <td>2</td>\n          <td>46</td>\n          <td>22.3%</td>\n      </tr>\n      <tr>\n          <td>4-7</td>\n          <td>40</td>\n          <td>19.4%</td>\n      </tr>\n      <tr>\n          <td>3</td>\n          <td>37</td>\n          <td>18.0%</td>\n      </tr>\n      <tr>\n          <td>20+</td>\n          <td>19</td>\n          <td>9.2%</td>\n      </tr>\n      <tr>\n          <td>8-10</td>\n          <td>7</td>\n          <td>3.4%</td>\n      </tr>\n      <tr>\n          <td>11-20</td>\n          <td>5</td>\n          <td>2.4%</td>\n      </tr>\n  </tbody>\n</table>\n<p>85% of the Airflow users surveyed have between 1 and 7 active Airflow instances, and nearly 50% have only 1 or 2.</p>\n<h3 id=\"what-is-the-maximum-number-of-tasks-that-you-have-used-in-a-single-dagsingle-choice\">What is the maximum number of tasks that you have used in a single DAG?(single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image7.png\" alt=\"alt_text\" title=\"maximum tasks\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>11-25</td>\n          <td>51</td>\n          <td>24.5%</td>\n      </tr>\n      <tr>\n          <td>26-50</td>\n          <td>41</td>\n          <td>19.7%</td>\n      </tr>\n      <tr>\n          <td>51-100</td>\n          <td>35</td>\n          <td>16.8%</td>\n      </tr>\n      <tr>\n          <td>&lt;10</td>\n          <td>29</td>\n          <td>13.9%</td>\n      </tr>\n      <tr>\n          <td>101-250</td>\n          <td>23</td>\n          <td>11.1%</td>\n      </tr>\n      <tr>\n          <td>501-1000</td>\n          <td>9</td>\n          <td>4.3%</td>\n      </tr>\n      <tr>\n          <td>1000-2500</td>\n          <td>8</td>\n          <td>3.8%</td>\n      </tr>\n      <tr>\n          <td>251-500</td>\n          <td>8</td>\n          <td>3.8%</td>\n      </tr>\n      <tr>\n          <td>2500-5000</td>\n          <td>4</td>\n          <td>1.9%</td>\n      </tr>\n  </tbody>\n</table>\n<p>75% of the surveyed Airflow users have between 1 and 100 tasks per DAG.</p>\n<h3 id=\"how-many-schedulers-do-you-have-in-your-largest-airflow-instance-single-choice\">How many schedulers do you have in your largest Airflow instance? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image8.png\" alt=\"alt_text\" title=\"max_schedulers\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>1</td>\n          <td>113</td>\n          <td>55.1%</td>\n      </tr>\n      <tr>\n          <td>2</td>\n          <td>61</td>\n          <td>29.8%</td>\n      </tr>\n      <tr>\n          <td>3</td>\n          <td>18</td>\n          <td>8.8%</td>\n      </tr>\n      <tr>\n          <td>4+</td>\n          <td>13</td>\n          <td>6.3%</td>\n      </tr>\n  </tbody>\n</table>\n<p>More than half of Airflow users who responded to the survey have 1 scheduler in their largest Airflow instance, however it’s important to notice that the second half of Airflow users decided to have 2 schedulers and more.</p>\n<h3 id=\"what-executor-type-do-you-use-multiple-choice\">What executor type do you use? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Celery</td>\n          <td>107</td>\n          <td>52.7 %</td>\n      </tr>\n      <tr>\n          <td>Kubernetes</td>\n          <td>80</td>\n          <td>39.4%</td>\n      </tr>\n      <tr>\n          <td>Local</td>\n          <td>49</td>\n          <td>24.1%</td>\n      </tr>\n      <tr>\n          <td>Sequential</td>\n          <td>21</td>\n          <td>10.3%</td>\n      </tr>\n      <tr>\n          <td>CeleryKubernetes</td>\n          <td>14</td>\n          <td>6.9%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Celery (52.7%) and Kubernetes (39.4%) are the most common executors used. CeleryKubernetes (6.9%) executor also started to be noticed and used by Airflow users.</p>\n<h3 id=\"if-you-use-the-celery-executor-how-many-workers-do-you-have-in-your-largest-airflow-instance-single-choice\">If you use the Celery executor, how many workers do you have in your largest Airflow instance? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image9.png\" alt=\"alt_text\" title=\"max_workers\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>2-5</td>\n          <td>64</td>\n          <td>44.8%</td>\n      </tr>\n      <tr>\n          <td>10+</td>\n          <td>28</td>\n          <td>19.6%</td>\n      </tr>\n      <tr>\n          <td>1</td>\n          <td>26</td>\n          <td>18.2%</td>\n      </tr>\n      <tr>\n          <td>6-10</td>\n          <td>25</td>\n          <td>17.5%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Amongst Celery executor users who responded to the survey, close to half the number (44.8%) have between 2 and 5 workers in their largest Airflow instance. It’s notable that nearly a fifth (19.6%) have more than 10 workers.</p>\n<h3 id=\"which-version-of-airflow-do-you-currently-use-single-choice\">Which version of Airflow do you currently use? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image10.png\" alt=\"alt_text\" title=\"airflow_version\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>1.10.14 or older</td>\n          <td>13</td>\n          <td>6.3%</td>\n      </tr>\n      <tr>\n          <td>1.10.15</td>\n          <td>19</td>\n          <td>9.2%</td>\n      </tr>\n      <tr>\n          <td>2.0.x</td>\n          <td>23</td>\n          <td>11.1%</td>\n      </tr>\n      <tr>\n          <td>2.1.x</td>\n          <td>24</td>\n          <td>11.6%</td>\n      </tr>\n      <tr>\n          <td>2.2.x</td>\n          <td>79</td>\n          <td>38.2%</td>\n      </tr>\n      <tr>\n          <td>2.3.x</td>\n          <td>49</td>\n          <td>23.7%</td>\n      </tr>\n  </tbody>\n</table>\n<p>It&rsquo;s good to see that close to 85% of users who responded to the survey use one of the Airflow 2 versions, 9.2% users still use 1.10.15, while the remaining 6.3% are still using older Airflow 1.10 versions.</p>\n<p>The good news is that the majority of users on Airflow 1 are planning migration to Airflow 2 quite soon, as for now they have capacity constraints to undertake such a significant effort in their opinion. However, it can also be noticed in the survey’s comments that some users are generally skeptical towards migration to Airflow 2, they have negative opinions about the new scheduler or compatibility with the helm chart.</p>\n<p>As to plans about migration to the newest version of Airflow 2, users who responded to the survey are committed and waiting especially for the features related to dynamic DAGs. However, some users also reported that they are waiting to solve some dependencies they have or they prefer to wait a little bit more for the community to test the new version before they decide to move on.</p>\n<h3 id=\"what-metrics-do-you-use-to-monitor-airflow-multiple-choice\">What metrics do you use to monitor Airflow? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>External monitoring service</td>\n          <td>81</td>\n          <td>40.7%</td>\n      </tr>\n      <tr>\n          <td>Information from metadatabase</td>\n          <td>71</td>\n          <td>35.7%</td>\n      </tr>\n      <tr>\n          <td>Statsd</td>\n          <td>54</td>\n          <td>27.1%</td>\n      </tr>\n      <tr>\n          <td>I do not use monitoring</td>\n          <td>47</td>\n          <td>23.6%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>14</td>\n          <td>7%</td>\n      </tr>\n  </tbody>\n</table>\n<p>In comparison to results from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>, more users are monitoring airflow in some way. External monitoring services (40.7%) and information from metabase (35.7%) started to play a more important role in Airflow monitoring.</p>\n<h3 id=\"how-do-you-deploy-airflow-multiple-choice\">How do you deploy Airflow? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>On virtual machines (for example using AWS EC2)</td>\n          <td>63</td>\n          <td>30.6 %</td>\n      </tr>\n      <tr>\n          <td>Using a managed service like Astronomer, Google Composer or AWS MWAA</td>\n          <td>54</td>\n          <td>26.2 %</td>\n      </tr>\n      <tr>\n          <td>On Kubernetes (using Apache Airflow’s helm chart)</td>\n          <td>46</td>\n          <td>22.3%</td>\n      </tr>\n      <tr>\n          <td>On premises</td>\n          <td>43</td>\n          <td>20.9%</td>\n      </tr>\n      <tr>\n          <td>On Kubernetes (using custom deployments)</td>\n          <td>39</td>\n          <td>18.9%</td>\n      </tr>\n      <tr>\n          <td>On Kubernetes (using another helm chart)</td>\n          <td>21</td>\n          <td>10.2%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>13</td>\n          <td>6.5%</td>\n      </tr>\n  </tbody>\n</table>\n<p>More than half of Airflow users who responded (51.4%) deploy Airflow on Kubernetes. This is about 20 percent more than in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>. The remaining top deployment methods are on virtual machines (30.6%) and via managed services (26.2%).</p>\n<h3 id=\"how-do-you-distribute-your-dags-from-your-developer-environment-to-the-cloud-single-choice\">How do you distribute your DAGs from your developer environment to the cloud? (single choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Using a synchronizing process (Git sync, GCS fuse, etc)</td>\n          <td>100</td>\n          <td>49%</td>\n      </tr>\n      <tr>\n          <td>Bake them into the docker image</td>\n          <td>51</td>\n          <td>25%</td>\n      </tr>\n      <tr>\n          <td>Shared files system</td>\n          <td>30</td>\n          <td>14.7%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>16</td>\n          <td>7.9%</td>\n      </tr>\n      <tr>\n          <td>I don’t know</td>\n          <td>7</td>\n          <td>3.4%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey responses, the most popular way of distributing DAGs is a synchronizing process, about half of Airflow users (49%) use this process to distribute DAGs from developer environments to the cloud.</p>\n<h2 id=\"usage-1\">Usage</h2>\n<h3 id=\"do-you-have-any-customisation-of-airflow-single-choice\">Do you have any customisation of Airflow? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image11.png\" alt=\"alt_text\" title=\"customization\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>No, we use vanilla airflow</td>\n          <td>165</td>\n          <td>81.3%</td>\n      </tr>\n      <tr>\n          <td>Yes, we have a separate fork</td>\n          <td>13</td>\n          <td>6.4%</td>\n      </tr>\n      <tr>\n          <td>Yes, we use a 3rd-party fork</td>\n          <td>12</td>\n          <td>5.9%</td>\n      </tr>\n      <tr>\n          <td>Yes, we’ve backpropagated bug fixes to an older version</td>\n          <td>13</td>\n          <td>6.4%</td>\n      </tr>\n  </tbody>\n</table>\n<p>More Airflow users (81.3%) don’t have any customisation of Airflow (compared to 75.9% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>). Those Airflow users who have customisations (18.7%) decided to introduce them mainly to separate development and production workflows, to backport bug fixes, due to security fixes or to run a backfill command on Kubernetes pod.</p>\n<h3 id=\"which-metadata-database-do-you-use-single-choice\">Which Metadata Database do you use? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image12.png\" alt=\"alt_text\" title=\"database\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%I</td>\n      </tr>\n      <tr>\n          <td>PostgreSQL 13</td>\n          <td>86</td>\n          <td>43.9%</td>\n      </tr>\n      <tr>\n          <td>PostgreSQL 12</td>\n          <td>74</td>\n          <td>37.8%</td>\n      </tr>\n      <tr>\n          <td>MySQL 8</td>\n          <td>22</td>\n          <td>11.2%</td>\n      </tr>\n      <tr>\n          <td>MySQL 5</td>\n          <td>9</td>\n          <td>4.6%</td>\n      </tr>\n      <tr>\n          <td>MariaDB</td>\n          <td>4</td>\n          <td>2.0%</td>\n      </tr>\n      <tr>\n          <td>MsSQL</td>\n          <td>1</td>\n          <td>0.5%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey responses, the most popular metadata databases are PostgreSQL 13 (43.9%) and PostgreSQL 12 (37.8%). This represents a sharp increase from 2020, up from 68.9% to 81.7% total on PostgreSQL, with a corresponding decrease in MySQL, down from 23% to 15%. This is an interesting result taking into account community discussion about not adding support for more database backend or even deciding on single database support.</p>\n<h3 id=\"whats-the-primary-method-by-which-you-integrate-with-providers-and-external-services-in-your-airflow-dags-single-choice\">What&rsquo;s the primary method by which you integrate with providers and external services in your Airflow DAGs? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image13.png\" alt=\"alt_text\" title=\"providers_interface\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Using existing dedicated operators / hooks</td>\n          <td>70</td>\n          <td>34.5%</td>\n      </tr>\n      <tr>\n          <td>Using Bash/Python operators</td>\n          <td>58</td>\n          <td>28.6%</td>\n      </tr>\n      <tr>\n          <td>Using custom operators / hooks</td>\n          <td>50</td>\n          <td>24.6%</td>\n      </tr>\n      <tr>\n          <td>Using KubernetesPodOperator</td>\n          <td>25</td>\n          <td>12.3%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey responses, the following ways of using Airflow to connect to external services are the most popular: Using existing dedicated operators / hooks (34.5%), Using Bash/Python operators (28.6%), Using custom operators / hooks (24.6%). Using KubernetesPodOperator (12.3%) is less popular regarding the survey responses. The integration with providers and external services methods ranking is similar to the one from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a>.</p>\n<h3 id=\"what-providers-do-you-use-in-your-airflow-dags-multiple-choice\">What providers do you use in your Airflow DAGs? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Amazon Web Services</td>\n          <td>112</td>\n          <td>55.4%</td>\n      </tr>\n      <tr>\n          <td>Google Cloud Platform / Google APIs</td>\n          <td>79</td>\n          <td>39.1%</td>\n      </tr>\n      <tr>\n          <td>Internal company systems</td>\n          <td>75</td>\n          <td>37.1%</td>\n      </tr>\n      <tr>\n          <td>Hadoop / Spark / Flink / Other Apache software</td>\n          <td>57</td>\n          <td>28.2%</td>\n      </tr>\n      <tr>\n          <td>Microsoft Azure</td>\n          <td>17</td>\n          <td>8.4%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>21</td>\n          <td>10.5%</td>\n      </tr>\n      <tr>\n          <td>I do not use external services in my Airflow DAGs</td>\n          <td>14</td>\n          <td>6.9%</td>\n      </tr>\n  </tbody>\n</table>\n<p>It’s not surprising that Amazon Web Services (55.4% vs 59.6% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/\">2020</a>), on the next three positions Google Cloud Platform (39.1% vs 47.7% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/\">2020</a> ), Internal company systems (37.1% vs 55.6% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/\">2020</a>), and other Apache products (28.2% vs 35.47% in <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/\">2020</a>) are leading Airflow providers.</p>\n<h3 id=\"how-frequently-do-you-upgrade-airflow-environments-single-choice\">How frequently do you upgrade Airflow environments? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image14.png\" alt=\"alt_text\" title=\"upgrade_frequency\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>every 12 months</td>\n          <td>46</td>\n          <td>22.9%</td>\n      </tr>\n      <tr>\n          <td>every 6 months</td>\n          <td>49</td>\n          <td>24.4%</td>\n      </tr>\n      <tr>\n          <td>once a quarter</td>\n          <td>47</td>\n          <td>23.4%</td>\n      </tr>\n      <tr>\n          <td>Whenever there is a newer version</td>\n          <td>59</td>\n          <td>29.4%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Different frequencies of Airflow environments upgrades are almost equally popular amongst Airflow users who responded to the survey.</p>\n<h3 id=\"do-you-upgrade-providers-separately-from-the-core-single-choice\">Do you upgrade providers separately from the core? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image15.png\" alt=\"alt_text\" title=\"providers_upgrade\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>When I need it</td>\n          <td>83</td>\n          <td>42.8%</td>\n      </tr>\n      <tr>\n          <td>Never - always use the providers that come with Airflow</td>\n          <td>68</td>\n          <td>35.1%</td>\n      </tr>\n      <tr>\n          <td>I did not know I can upgrade providers separately</td>\n          <td>32</td>\n          <td>16.5%</td>\n      </tr>\n      <tr>\n          <td>I upgrade providers when they are released</td>\n          <td>11</td>\n          <td>5.7%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey responses, Airflow users most often upgrade providers when they need it (42.8%) or prefer to stay with providers that come with Airflow (35.1%). It’s surprising that 16.5% of Airflow users who responded to the survey were not aware that they can upgrade their providers separately from the core Airflow.</p>\n<h3 id=\"how-do-you-pass-inputs-and-outputs-between-tasks-multiple-choice\">How do you pass inputs and outputs between tasks? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Xcom</td>\n          <td>141</td>\n          <td>69.8%</td>\n      </tr>\n      <tr>\n          <td>Saving and retrieving from Storage</td>\n          <td>99</td>\n          <td>49%</td>\n      </tr>\n      <tr>\n          <td>TaskFlow</td>\n          <td>37</td>\n          <td>18.3%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>5</td>\n          <td>2.5%</td>\n      </tr>\n      <tr>\n          <td>We don’t</td>\n          <td>29</td>\n          <td>14.4%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey responses, Xcom (69.8%) is the most popular method to pass inputs and outputs between tasks, however Saving and Retrieving Inputs and Outputs from Storage still plays an important role (49%). It’s interesting that close to 15% of Airflow users who responded to the survey declare to not pass any outputs or inputs between tasks.</p>\n<h3 id=\"do-you-use-a-data-lineage-backend-multiple-choice\">Do you use a data lineage backend? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>No, but I will use such feature if fully supported in Airflow</td>\n          <td>95</td>\n          <td>47.5%</td>\n      </tr>\n      <tr>\n          <td>I’m not familiar with data lineage</td>\n          <td>58</td>\n          <td>29%</td>\n      </tr>\n      <tr>\n          <td>No, data lineage isn’t a concern for my usage</td>\n          <td>26</td>\n          <td>13%</td>\n      </tr>\n      <tr>\n          <td>Yes, I send lineage to an Open Source lineage repository</td>\n          <td>15</td>\n          <td>7.5%</td>\n      </tr>\n      <tr>\n          <td>Yes, I send lineage to an Enterprise lineage repository</td>\n          <td>7</td>\n          <td>3.5%</td>\n      </tr>\n      <tr>\n          <td>Yes, I send lineage to a custom internal lineage repository</td>\n          <td>9</td>\n          <td>4.5%</td>\n      </tr>\n  </tbody>\n</table>\n<p>When asked what lineage backend Airflow users use, the answers indicated that, while lineage itself is a quite new topic, there is interest in the feature as a whole. Most Airflow users responded that they don’t use lineage solutions currently but might be interested in the future if supported by Airflow (47.5%), are not familiar with data lineage (29%) or that data lineage is not their concern (13%).</p>\n<h3 id=\"which-interfaces-of-airflow-do-you-use-as-part-of-your-current-role-multiple-choice\">Which interfaces of Airflow do you use as part of your current role? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Original Airflow Graphical User Interface</td>\n          <td>189</td>\n          <td>94%</td>\n      </tr>\n      <tr>\n          <td>CLI</td>\n          <td>98</td>\n          <td>48.8%</td>\n      </tr>\n      <tr>\n          <td>API</td>\n          <td>80</td>\n          <td>39.8%</td>\n      </tr>\n      <tr>\n          <td>Custom (own created) Airflow Graphical User Interface</td>\n          <td>12</td>\n          <td>6%</td>\n      </tr>\n      <tr>\n          <td>GCP Composer</td>\n          <td>1</td>\n          <td>0.5%</td>\n      </tr>\n  </tbody>\n</table>\n<p>It’s clear that usage of Airflow web UI is important as 94% of users who responded to the survey declare to use it as a part of their current role. Usage of CLI (48.8%) and API (39.8%) goes in pairs but are not so common compared to Airflow web UI usage.</p>\n<h3 id=\"if-gui-marked-what-do-you-use-the-gui-for-multiple-choice\">(If GUI Marked) What do you use the GUI for? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Monitoring Runs</td>\n          <td>188</td>\n          <td>95.9%</td>\n      </tr>\n      <tr>\n          <td>Accessing Task Logs</td>\n          <td>176</td>\n          <td>89.8%</td>\n      </tr>\n      <tr>\n          <td>Manually triggering DAGs</td>\n          <td>167</td>\n          <td>85.2%</td>\n      </tr>\n      <tr>\n          <td>Clearing Tasks</td>\n          <td>162</td>\n          <td>82.7%</td>\n      </tr>\n      <tr>\n          <td>Marking Tasks as successful</td>\n          <td>119</td>\n          <td>60.7%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>6</td>\n          <td>3%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Airflow web UI is used heavily for monitoring: Monitoring Runs (95.9%) and troubleshooting: Accessing Task Logs (89.8%), Manually triggering DAGs (85.2%), Clearing Tasks (82.7%) and Marking Tasks as successful (60.7%).</p>\n<h3 id=\"if-cli-marked-what-do-you-use-the-cli-for-multiple-choice\">(if CLI Marked) What do you use the CLI For? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Backfilling</td>\n          <td>63</td>\n          <td>56.8%</td>\n      </tr>\n      <tr>\n          <td>Manually triggering DAGs</td>\n          <td>52</td>\n          <td>46.8%</td>\n      </tr>\n      <tr>\n          <td>Clearing Tasks</td>\n          <td>26</td>\n          <td>23.4%</td>\n      </tr>\n      <tr>\n          <td>Monitoring Runs</td>\n          <td>25</td>\n          <td>22.5%</td>\n      </tr>\n      <tr>\n          <td>Accessing Task Logs</td>\n          <td>21</td>\n          <td>18.9%</td>\n      </tr>\n      <tr>\n          <td>Marking Tasks as successful</td>\n          <td>11</td>\n          <td>9.9%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>17</td>\n          <td>15.3%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Compared to Airflow web UI, Airflow CLI is used mainly for Backfilling (56.8%) and Manually triggering DAGs (46.8%).</p>\n<h3 id=\"in-airflow-which-ui-views-are-important-for-you-multiple-choice\">In Airflow, which UI views are important for you? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>List of DAGs</td>\n          <td>178</td>\n          <td>89.4%</td>\n      </tr>\n      <tr>\n          <td>Task Logs</td>\n          <td>162</td>\n          <td>81.4%</td>\n      </tr>\n      <tr>\n          <td>DAG Runs</td>\n          <td>160</td>\n          <td>80.4%</td>\n      </tr>\n      <tr>\n          <td>Graph view</td>\n          <td>147</td>\n          <td>73.9%</td>\n      </tr>\n      <tr>\n          <td>Grid/Tree View</td>\n          <td>138</td>\n          <td>69.3%</td>\n      </tr>\n      <tr>\n          <td>Run Details</td>\n          <td>117</td>\n          <td>58.8%</td>\n      </tr>\n      <tr>\n          <td>DAG details</td>\n          <td>111</td>\n          <td>55.8%</td>\n      </tr>\n      <tr>\n          <td>Task Instances</td>\n          <td>102</td>\n          <td>51.3%</td>\n      </tr>\n      <tr>\n          <td>Task Duration</td>\n          <td>91</td>\n          <td>45.7%</td>\n      </tr>\n      <tr>\n          <td>Code</td>\n          <td>90</td>\n          <td>45.2%</td>\n      </tr>\n      <tr>\n          <td>Task Tries</td>\n          <td>60</td>\n          <td>30.2%</td>\n      </tr>\n      <tr>\n          <td>Gantt</td>\n          <td>48</td>\n          <td>21.4%</td>\n      </tr>\n      <tr>\n          <td>Landing Times</td>\n          <td>27</td>\n          <td>13.6%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>4</td>\n          <td>2%</td>\n      </tr>\n  </tbody>\n</table>\n<p>UI views importance ranking shows that the majority Airflow users use Web UI mostly for monitoring and/or troubleshooting purposes, where the top 3 views are List of DAGs (89.4%), Task Logs (81.4%) and DAG Runs (80.4%). The results are very similar to those from <a href=\"https://airflow.apache.org/blog/airflow-survey-2020/#overview-of-the-user\">2020</a> and <a href=\"https://airflow.apache.org/blog/airflow-survey/\">2019</a>.</p>\n<h2 id=\"community-and-contribution-1\">Community and contribution</h2>\n<h3 id=\"are-you-participating-in-the-airflow-community-discussions-single-choice\">Are you participating in the Airflow community discussions? (single choice)</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image16.png\" alt=\"alt_text\" title=\"discussions_engagement\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>I see them from time to time</td>\n          <td>99</td>\n          <td>48.3%</td>\n      </tr>\n      <tr>\n          <td>I regularly follow what&rsquo;s being discussed but don&rsquo;t participate</td>\n          <td>53</td>\n          <td>25.9%</td>\n      </tr>\n      <tr>\n          <td>I didn&rsquo;t know I could</td>\n          <td>41</td>\n          <td>20.0%</td>\n      </tr>\n      <tr>\n          <td>I actively participate in the discussions</td>\n          <td>12</td>\n          <td>5.9%</td>\n      </tr>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>I know I can but I do not contribute</td>\n          <td>116</td>\n          <td>57.1%</td>\n      </tr>\n      <tr>\n          <td>Very rarely when it relates to what I need</td>\n          <td>44</td>\n          <td>21.7%</td>\n      </tr>\n      <tr>\n          <td>I do not know I could</td>\n          <td>30</td>\n          <td>14.8%</td>\n      </tr>\n      <tr>\n          <td>I regularly contribute by discussing, reviewing and submitting PR</td>\n          <td>13</td>\n          <td>6.4%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Results related to the Airflow contribution are very similar to those about participating in the Airflow community discussions. Most of the Airflow users (57.1%) who responded to the survey are aware but do not contribute or contribute very rarely (21.7%). 14.8% of users were not aware they could contribute. Once again, it’s a clear indicator that there is much more to be done to engage our community to be more active contributors and raise the current 6.4% of users who actively contribute.</p>\n<h3 id=\"if-you-do-not-contribute---why\">If you do not contribute - why?</h3>\n<p><img src=\"/blog/airflow-survey-2022/images/image18.png\" alt=\"alt_text\" title=\"contribution_reasons\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>I have no time to contribute even if would like to</td>\n          <td>65</td>\n          <td>38.9%</td>\n      </tr>\n      <tr>\n          <td>I don’t know how to start</td>\n          <td>63</td>\n          <td>37.7%</td>\n      </tr>\n      <tr>\n          <td>I don’t have a need to contribute</td>\n          <td>19</td>\n          <td>11.4%</td>\n      </tr>\n      <tr>\n          <td>I didn’t know I could</td>\n          <td>12</td>\n          <td>7.2%</td>\n      </tr>\n      <tr>\n          <td>My employer has policy that makes it difficult to contribute</td>\n          <td>8</td>\n          <td>4.8%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey results, the most important blocker for the Airflow contribution is limited time (38.9%), but surprisingly interesting and important blocker is also lack of knowledge on how to start (37.7%), followed by lack of knowledge that it’s possible to contribute (7.2%).</p>\n<h2 id=\"the-future-of-airflow-1\">The future of Airflow</h2>\n<h3 id=\"in-your-opinion-what-could-be-improved-in-airflow-multiple-choice\">In your opinion, what could be improved in Airflow? (multiple choice)</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>Web UI</td>\n          <td>100</td>\n          <td>49.5%</td>\n      </tr>\n      <tr>\n          <td>Logging, monitoring and alerting</td>\n          <td>97</td>\n          <td>48.0%</td>\n      </tr>\n      <tr>\n          <td>Examples, how-to, onboarding documentation</td>\n          <td>74</td>\n          <td>36.6%</td>\n      </tr>\n      <tr>\n          <td>Technical documentation</td>\n          <td>74</td>\n          <td>36.6%</td>\n      </tr>\n      <tr>\n          <td>Scheduler performance</td>\n          <td>56</td>\n          <td>27.7%</td>\n      </tr>\n      <tr>\n          <td>Reliability</td>\n          <td>52</td>\n          <td>25.7%</td>\n      </tr>\n      <tr>\n          <td>DAG authoring</td>\n          <td>48</td>\n          <td>23.8%</td>\n      </tr>\n      <tr>\n          <td>REST API</td>\n          <td>43</td>\n          <td>21.3%</td>\n      </tr>\n      <tr>\n          <td>Authentication and authorization</td>\n          <td>41</td>\n          <td>20.3%</td>\n      </tr>\n      <tr>\n          <td>External integration e.g. AWS, GCP, Apache products</td>\n          <td>41</td>\n          <td>20.3%</td>\n      </tr>\n      <tr>\n          <td>Better support for various deployments (Docker-compose/Nomad/Others)</td>\n          <td>39</td>\n          <td>19.3%</td>\n      </tr>\n      <tr>\n          <td>Everything works fine for me</td>\n          <td>19</td>\n          <td>9.4%</td>\n      </tr>\n      <tr>\n          <td>I don’t know</td>\n          <td>4</td>\n          <td>2.0%</td>\n      </tr>\n  </tbody>\n</table>\n<p>The results are quite self-explanatory. According to the survey results, the top area for improvement is still the Airflow web UI (49.5%), closely followed by more telemetry for logging, monitoring and alerting purposes (48%). However all those efforts should go in line with improved documentation (36.6.%) and resources about using the Airflow, especially when we take into account the need of onboarding new users (36.6%).</p>\n<h3 id=\"which-features-would-you-like-to-see-in-airflow\">Which features would you like to see in Airflow?</h3>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th></th>\n          <th></th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td></td>\n          <td>No.</td>\n          <td>%</td>\n      </tr>\n      <tr>\n          <td>DAG Versioning</td>\n          <td>129</td>\n          <td>66.2%</td>\n      </tr>\n      <tr>\n          <td>Dependency management and Data-driven scheduling</td>\n          <td>83</td>\n          <td>42.6%</td>\n      </tr>\n      <tr>\n          <td>More dynamic task structure</td>\n          <td>82</td>\n          <td>42.1%</td>\n      </tr>\n      <tr>\n          <td>Multi-Tenancy</td>\n          <td>74</td>\n          <td>37.9%</td>\n      </tr>\n      <tr>\n          <td>Signal-based scheduling</td>\n          <td>67</td>\n          <td>34.4%</td>\n      </tr>\n      <tr>\n          <td>Better Security (Isolation)</td>\n          <td>65</td>\n          <td>33.3%</td>\n      </tr>\n      <tr>\n          <td>Submitting new DAGs externally via API</td>\n          <td>53</td>\n          <td>27.2%</td>\n      </tr>\n      <tr>\n          <td>Composable Operators</td>\n          <td>46</td>\n          <td>23.6%</td>\n      </tr>\n      <tr>\n          <td>Support for native cloud executors (AWS/GCP/Azure etc.)</td>\n          <td>44</td>\n          <td>22.6%</td>\n      </tr>\n      <tr>\n          <td>Better support for Machine Learning</td>\n          <td>38</td>\n          <td>19.5%</td>\n      </tr>\n      <tr>\n          <td>Remote CLI</td>\n          <td>36</td>\n          <td>18.5%</td>\n      </tr>\n      <tr>\n          <td>Support for hybrid executors</td>\n          <td>22</td>\n          <td>11.3%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey results, DAG Versioning is a winner for new features in Airflow, and it’s not a surprise as this feature may positively impact daily work of Airflow users. It is followed by three other ideas: Dependency management and Data-driven scheduling (42.6%), More dynamic task structure (42.1%) and Multi-Tenancy (37.9%). Another interesting point from that question is that only 11.3% think that support for hybrid executors is needed in Airflow.</p>\n<h2 id=\"data\">Data</h2>\n<p>If you&rsquo;re interested in taking a look at the raw data yourself, it&rsquo;s available here: (Airflow User Survey 2022.csv)[/data/survey-responses/airflow-user-survey-responses-2022.csv.zip]</p>"
---

Airflow User Survey 2022
This year’s survey has come and gone, and with it we’ve got a new batch of data for everyone! We collected 210 responses over two weeks. We continue to see growth in both contributions and downloads over the last two years, and expect that trend will continue through 2022.
The raw response data will be made available here soon, in the meantime, feel free to email john.thomas@astronomer.io for a copy.
TL;DR
Overview of the user
Like previous years, more than half of the Airflow users are Data Engineers (54%). Solutions Architects (13%), Developers (12%), DevOps (6%) and Data Scientists (4%) are also active Airflow users! There was a slight increase in the representation of Solutions Architect roles compared to results from 2020 and 2019 .
Airflow is used and popular in bigger companies, 64% of Airflow users work for companies with 200+ employees which is an 11 percent increase compared to 2020.
62% of the survey participants have more than 6 Airflow users in their company.
More Airflow users (65.9%) are willing to recommend Apache Airflow compared to the survey results in 2020 and 2019. There is a general positive trend in a willingness to recommend Airflow, 93% of surveyed Airflow users are willing to recommend Airflow ( 85.7% in 2019 and 92% in 2020 ), only 1% of users are not likely to recommend (3.6% in 2019 and 3.5% in 2020).
Airflow documentation is a critical source of information, with more than 90% (15% increase compared to results from 2020) of survey participants using the documentation. Airflow documentation is also one of the top areas to improve! What’s interesting, also Stack Overflow usage is critical, with about 60% users declaring to use it as a source of information (24% increase compared to results from 2020).
Deployments
85% of the Airflow users have between 1 and 7 active Airflow instances. 62.5% of the Airflow users have between 11 and 250 DAGs in their largest Airflow instance. 75% of the surveyed Airflow users have between 1 and 100 tasks per DAG.
Close to 85% of users use one of the Airflow 2 versions, 9.2% users still use 1.10.15, while the remaining 6.3% are still using older Airflow 1 versions. The good news is that the majority of users on Airflow 1 are planning migration to Airflow 2 quite soon, with resources and capacity being the main blockers.
In comparison to results from 2020, more users were interested in monitoring in general and specifically in using tools such as external monitoring services (40.7%, up from 29.6%) and information from metabase (35.7%, up from 25.1%).
Celery (52.7%) and Kubernetes (39.4%) are the most common executors used.
Usage
81.3% of Airflow users who responded to the survey don’t have any customisation of Airflow.
Xcom (69.8%) is the most popular method to pass inputs and outputs between tasks, however Saving and Retrieving Inputs and Outputs from Storage still plays an important role (49%).
Lineage itself is a quite new topic for Airflow users, most of them don’t use lineage solutions but might be interested if supported by Airflow (47.5%), are not familiar with data lineage (29%) or that data lineage is not their concern (13%).
The Airflow web UI is used heavily for Monitoring Runs (95.9%), Accessing Task Logs (89.8%), Manually triggering DAGs (85.2%), Clearing Tasks (82.7%) and Marking Tasks as successful (60.7%). The top 3 views used are: List of DAGs, Task Logs and DAG Runs, which is very similar to results from 2020 and 2019.
Community and contribution
Most Airflow users (57.1%) are aware they could contribute but do not, and an additional 21.7% contribute very rarely. 14.8% of users were not aware they could contribute. There is much more to be done to engage our community to be more active contributors and raise the current 6.4% of users who actively contribute, especially considering that one important blocker for contribution is lack of knowledge on how to start (37.7%).
The future of Airflow
The top area for improvement is still the Airflow web UI (49.5%), closely followed by more telemetry for logging, monitoring and alerting purposes (48%). However all those efforts should go in line with improved documentation (36.6.%) and resources about using the Airflow, especially when we take into account the need of onboarding new users (36.6%).
DAG Versioning(66.2%) is a winner for new features in Airflow, and it’s not a surprise as this feature may positively impact daily work of Airflow users. It is followed by three other ideas: Dependency management and Data-driven scheduling (42.6%), More dynamic task structure (42.1%) and Multi-Tenancy (37.9%).
Overview of the user
What best describes your current occupation? (single choice)


          
          
      

          No.
          %
      
Data Engineer
          114
          54%
      
Solutions Architect
          27
          13%
      
Developer
          25
          12%
      
DevOps
          12
          6%
      
Data Scientist
          8
          4%
      
Support Engineer
          5
          2%
      
Data Analyst
          3
          1%
      
Business Analyst
          2
          1%
      
Other
          14
          7%
      
According to the survey, more than half of Airflow users are Data Engineers (54%). Roles of the remaining Airflow users might be broken down into Solutions Architects (13%), Developers (12%), DevOps (6%) and Data Scientists (4%). The 2022 results are similar to those from 2019 and 2020 with a slight increase in the representation of Solutions Architect roles.
How often do you interact with Airflow? (single choice)


          
          
      

          No.
          %
      
Every day
          154
          73%
      
At least once per week
          36
          17%
      
At least once per month
          11
          5%
      
Less than once per month
          9
          4%
      
Users who took the survey are actively using Airflow as part of their current role. 73% of Airflow users who responded use it on a daily basis, 17% weekly.
How many people work at your company? (single choice)


          
          
      

          No.
          %
      
201-5000
          85
          41%
      
5000+
          49
          23%
      
51-200
          46
          22%
      
11-50
          20
          10%
      
1-10
          9
          4%
      
Airflow is a framework that is used and popular in bigger companies, 64% of Airflow users who responded (compared to 52.7% in 2020) work for companies bigger than 200 employees (41% in companies size 201-5000 and 23% in companies size 5000+).
How many people at your company use Airflow? (single choice)


          
          
      

          No.
          %
      
6-20
          80
          38%
      
1-5
          61
          29%
      
51-200
          49
          24%
      
200+
          18
          9%
      
Airflow is generally used by small to medium-sized teams. 62% of the survey participants have more than 6 Airflow users in their company (38% have between 6 and 200 users, 24% between 51-200 users).
How likely are you to recommend Apache Airflow? (single choice)

          
          
          
      

          % 2019
          % 2020
          % 2022
      
Very Likely
          45.4%
          61.6%
          65.9%
      
Likely
          40.3%
          30.4%
          26.9%
      
Neutral
          10.7%
          5.4%
          6.3%
      
Unlikely
          2.6%
          1.5%
          0.5%
      
Very Unlikely
          1%
          1%
          0.5%
      
According to the survey, more Airflow users (65.9%) are willing to recommend Apache Airflow compared to the survey results in 2020 and 2019. There is a general positive trend in a willingness to recommend Airflow, 93% of surveyed Airflow users are willing to recommend Airflow (92% in 2020 and 85.7% in 2019), only 1% of users are not likely to recommend (3.6% in 2019 and 3.5% in 2020 ).
What is your source of information about Airflow? (multiple choice)

          
          
      

          No.
          %
      
Documentation
          189
          90.4%
      
Airflow website (Blog, etc.)
          142
          67.9%
      
Stack Overflow
          126
          60.3%
      
Github Issues
          104
          49.8%
      
Slack
          96
          45.9%
      
Airflow Summit Videos
          88
          42.1%
      
GitHub Discussions
          76
          36.4%
      
Airflow Community Webinars
          41
          19.6%
      
Astronomer Registry
          51
          24.4%
      
Airflow Mailing List
          34
          16.3%
      
Airflow documentation is a critical source of information, with more than 90% of survey participants using the documentation. It is of increasing importance compared to results from 2020 where documentation was at about 75% level. Moreover, more than 60% of users are getting information from the Airflow website (67.9% ) and Stack Overflow (60.3%) which is also a big increase compared to 36% level in 2020. What’s interesting is that Slack usage decreased from 63.05% in 2020 to 45.9% in 2022.
Deployments
How many active DAGs do you have in your largest Airflow instance? (single choice)


          
          
      

          No.
          %
      
51-250
          66
          31.7%
      
11-50
          64
          30.8%
      
5-10
          25
          12.0%
      
251-500
          20
          9.6%
      
<5
          14
          6.7%
      
1000+
          10
          4.8%
      
501-1000
          9
          4.3%
      
62.5% of the Airflow users surveyed have between 11 and 250 DAGs in their largest Airflow instance.
How many active Airflow instances do you have? (single choice)


          
          
      

          No.
          %
      
1
          52
          25.2%
      
2
          46
          22.3%
      
4-7
          40
          19.4%
      
3
          37
          18.0%
      
20+
          19
          9.2%
      
8-10
          7
          3.4%
      
11-20
          5
          2.4%
      
85% of the Airflow users surveyed have between 1 and 7 active Airflow instances, and nearly 50% have only 1 or 2.
What is the maximum number of tasks that you have used in a single DAG?(single choice)


          
          
      

          No.
          %
      
11-25
          51
          24.5%
      
26-50
          41
          19.7%
      
51-100
          35
          16.8%
      
<10
          29
          13.9%
      
101-250
          23
          11.1%
      
501-1000
          9
          4.3%
      
1000-2500
          8
          3.8%
      
251-500
          8
          3.8%
      
2500-5000
          4
          1.9%
      
75% of the surveyed Airflow users have between 1 and 100 tasks per DAG.
How many schedulers do you have in your largest Airflow instance? (single choice)


          
          
      

          No.
          %
      
1
          113
          55.1%
      
2
          61
          29.8%
      
3
          18
          8.8%
      
4+
          13
          6.3%
      
More than half of Airflow users who responded to the survey have 1 scheduler in their largest Airflow instance, however it’s important to notice that the second half of Airflow users decided to have 2 schedulers and more.
What executor type do you use? (multiple choice)

          
          
      

          No.
          %
      
Celery
          107
          52.7 %
      
Kubernetes
          80
          39.4%
      
Local
          49
          24.1%
      
Sequential
          21
          10.3%
      
CeleryKubernetes
          14
          6.9%
      
Celery (52.7%) and Kubernetes (39.4%) are the most common executors used. CeleryKubernetes (6.9%) executor also started to be noticed and used by Airflow users.
If you use the Celery executor, how many workers do you have in your largest Airflow instance? (single choice)


          
          
      

          No.
          %
      
2-5
          64
          44.8%
      
10+
          28
          19.6%
      
1
          26
          18.2%
      
6-10
          25
          17.5%
      
Amongst Celery executor users who responded to the survey, close to half the number (44.8%) have between 2 and 5 workers in their largest Airflow instance. It’s notable that nearly a fifth (19.6%) have more than 10 workers.
Which version of Airflow do you currently use? (single choice)


          
          
      

          No.
          %
      
1.10.14 or older
          13
          6.3%
      
1.10.15
          19
          9.2%
      
2.0.x
          23
          11.1%
      
2.1.x
          24
          11.6%
      
2.2.x
          79
          38.2%
      
2.3.x
          49
          23.7%
      
It’s good to see that close to 85% of users who responded to the survey use one of the Airflow 2 versions, 9.2% users still use 1.10.15, while the remaining 6.3% are still using older Airflow 1.10 versions.
The good news is that the majority of users on Airflow 1 are planning migration to Airflow 2 quite soon, as for now they have capacity constraints to undertake such a significant effort in their opinion. However, it can also be noticed in the survey’s comments that some users are generally skeptical towards migration to Airflow 2, they have negative opinions about the new scheduler or compatibility with the helm chart.
As to plans about migration to the newest version of Airflow 2, users who responded to the survey are committed and waiting especially for the features related to dynamic DAGs. However, some users also reported that they are waiting to solve some dependencies they have or they prefer to wait a little bit more for the community to test the new version before they decide to move on.
What metrics do you use to monitor Airflow? (multiple choice)

          
          
      

          No.
          %
      
External monitoring service
          81
          40.7%
      
Information from metadatabase
          71
          35.7%
      
Statsd
          54
          27.1%
      
I do not use monitoring
          47
          23.6%
      
Other
          14
          7%
      
In comparison to results from 2020, more users are monitoring airflow in some way. External monitoring services (40.7%) and information from metabase (35.7%) started to play a more important role in Airflow monitoring.
How do you deploy Airflow? (multiple choice)

          
          
      

          No.
          %
      
On virtual machines (for example using AWS EC2)
          63
          30.6 %
      
Using a managed service like Astronomer, Google Composer or AWS MWAA
          54
          26.2 %
      
On Kubernetes (using Apache Airflow’s helm chart)
          46
          22.3%
      
On premises
          43
          20.9%
      
On Kubernetes (using custom deployments)
          39
          18.9%
      
On Kubernetes (using another helm chart)
          21
          10.2%
      
Other
          13
          6.5%
      
More than half of Airflow users who responded (51.4%) deploy Airflow on Kubernetes. This is about 20 percent more than in 2020. The remaining top deployment methods are on virtual machines (30.6%) and via managed services (26.2%).
How do you distribute your DAGs from your developer environment to the cloud? (single choice)

          
          
      

          No.
          %
      
Using a synchronizing process (Git sync, GCS fuse, etc)
          100
          49%
      
Bake them into the docker image
          51
          25%
      
Shared files system
          30
          14.7%
      
Other
          16
          7.9%
      
I don’t know
          7
          3.4%
      
According to the survey responses, the most popular way of distributing DAGs is a synchronizing process, about half of Airflow users (49%) use this process to distribute DAGs from developer environments to the cloud.
Usage
Do you have any customisation of Airflow? (single choice)


          
          
      

          No.
          %
      
No, we use vanilla airflow
          165
          81.3%
      
Yes, we have a separate fork
          13
          6.4%
      
Yes, we use a 3rd-party fork
          12
          5.9%
      
Yes, we’ve backpropagated bug fixes to an older version
          13
          6.4%
      
More Airflow users (81.3%) don’t have any customisation of Airflow (compared to 75.9% in 2020). Those Airflow users who have customisations (18.7%) decided to introduce them mainly to separate development and production workflows, to backport bug fixes, due to security fixes or to run a backfill command on Kubernetes pod.
Which Metadata Database do you use? (single choice)


          
          
      

          No.
          %I
      
PostgreSQL 13
          86
          43.9%
      
PostgreSQL 12
          74
          37.8%
      
MySQL 8
          22
          11.2%
      
MySQL 5
          9
          4.6%
      
MariaDB
          4
          2.0%
      
MsSQL
          1
          0.5%
      
According to the survey responses, the most popular metadata databases are PostgreSQL 13 (43.9%) and PostgreSQL 12 (37.8%). This represents a sharp increase from 2020, up from 68.9% to 81.7% total on PostgreSQL, with a corresponding decrease in MySQL, down from 23% to 15%. This is an interesting result taking into account community discussion about not adding support for more database backend or even deciding on single database support.
What’s the primary method by which you integrate with providers and external services in your Airflow DAGs? (single choice)


          
          
      

          No.
          %
      
Using existing dedicated operators / hooks
          70
          34.5%
      
Using Bash/Python operators
          58
          28.6%
      
Using custom operators / hooks
          50
          24.6%
      
Using KubernetesPodOperator
          25
          12.3%
      
According to the survey responses, the following ways of using Airflow to connect to external services are the most popular: Using existing dedicated operators / hooks (34.5%), Using Bash/Python operators (28.6%), Using custom operators / hooks (24.6%). Using KubernetesPodOperator (12.3%) is less popular regarding the survey responses. The integration with providers and external services methods ranking is similar to the one from 2020.
What providers do you use in your Airflow DAGs? (multiple choice)

          
          
      

          No.
          %
      
Amazon Web Services
          112
          55.4%
      
Google Cloud Platform / Google APIs
          79
          39.1%
      
Internal company systems
          75
          37.1%
      
Hadoop / Spark / Flink / Other Apache software
          57
          28.2%
      
Microsoft Azure
          17
          8.4%
      
Other
          21
          10.5%
      
I do not use external services in my Airflow DAGs
          14
          6.9%
      
It’s not surprising that Amazon Web Services (55.4% vs 59.6% in 2020), on the next three positions Google Cloud Platform (39.1% vs 47.7% in 2020 ), Internal company systems (37.1% vs 55.6% in 2020), and other Apache products (28.2% vs 35.47% in 2020) are leading Airflow providers.
How frequently do you upgrade Airflow environments? (single choice)


          
          
      

          No.
          %
      
every 12 months
          46
          22.9%
      
every 6 months
          49
          24.4%
      
once a quarter
          47
          23.4%
      
Whenever there is a newer version
          59
          29.4%
      
Different frequencies of Airflow environments upgrades are almost equally popular amongst Airflow users who responded to the survey.
Do you upgrade providers separately from the core? (single choice)


          
          
      

          No.
          %
      
When I need it
          83
          42.8%
      
Never - always use the providers that come with Airflow
          68
          35.1%
      
I did not know I can upgrade providers separately
          32
          16.5%
      
I upgrade providers when they are released
          11
          5.7%
      
According to the survey responses, Airflow users most often upgrade providers when they need it (42.8%) or prefer to stay with providers that come with Airflow (35.1%). It’s surprising that 16.5% of Airflow users who responded to the survey were not aware that they can upgrade their providers separately from the core Airflow.
How do you pass inputs and outputs between tasks? (multiple choice)

          
          
      

          No.
          %
      
Xcom
          141
          69.8%
      
Saving and retrieving from Storage
          99
          49%
      
TaskFlow
          37
          18.3%
      
Other
          5
          2.5%
      
We don’t
          29
          14.4%
      
According to the survey responses, Xcom (69.8%) is the most popular method to pass inputs and outputs between tasks, however Saving and Retrieving Inputs and Outputs from Storage still plays an important role (49%). It’s interesting that close to 15% of Airflow users who responded to the survey declare to not pass any outputs or inputs between tasks.
Do you use a data lineage backend? (multiple choice)

          
          
      

          No.
          %
      
No, but I will use such feature if fully supported in Airflow
          95
          47.5%
      
I’m not familiar with data lineage
          58
          29%
      
No, data lineage isn’t a concern for my usage
          26
          13%
      
Yes, I send lineage to an Open Source lineage repository
          15
          7.5%
      
Yes, I send lineage to an Enterprise lineage repository
          7
          3.5%
      
Yes, I send lineage to a custom internal lineage repository
          9
          4.5%
      
When asked what lineage backend Airflow users use, the answers indicated that, while lineage itself is a quite new topic, there is interest in the feature as a whole. Most Airflow users responded that they don’t use lineage solutions currently but might be interested in the future if supported by Airflow (47.5%), are not familiar with data lineage (29%) or that data lineage is not their concern (13%).
Which interfaces of Airflow do you use as part of your current role? (multiple choice)

          
          
      

          No.
          %
      
Original Airflow Graphical User Interface
          189
          94%
      
CLI
          98
          48.8%
      
API
          80
          39.8%
      
Custom (own created) Airflow Graphical User Interface
          12
          6%
      
GCP Composer
          1
          0.5%
      
It’s clear that usage of Airflow web UI is important as 94% of users who responded to the survey declare to use it as a part of their current role. Usage of CLI (48.8%) and API (39.8%) goes in pairs but are not so common compared to Airflow web UI usage.
(If GUI Marked) What do you use the GUI for? (multiple choice)

          
          
      

          No.
          %
      
Monitoring Runs
          188
          95.9%
      
Accessing Task Logs
          176
          89.8%
      
Manually triggering DAGs
          167
          85.2%
      
Clearing Tasks
          162
          82.7%
      
Marking Tasks as successful
          119
          60.7%
      
Other
          6
          3%
      
Airflow web UI is used heavily for monitoring: Monitoring Runs (95.9%) and troubleshooting: Accessing Task Logs (89.8%), Manually triggering DAGs (85.2%), Clearing Tasks (82.7%) and Marking Tasks as successful (60.7%).
(if CLI Marked) What do you use the CLI For? (multiple choice)

          
          
      

          No.
          %
      
Backfilling
          63
          56.8%
      
Manually triggering DAGs
          52
          46.8%
      
Clearing Tasks
          26
          23.4%
      
Monitoring Runs
          25
          22.5%
      
Accessing Task Logs
          21
          18.9%
      
Marking Tasks as successful
          11
          9.9%
      
Other
          17
          15.3%
      
Compared to Airflow web UI, Airflow CLI is used mainly for Backfilling (56.8%) and Manually triggering DAGs (46.8%).
In Airflow, which UI views are important for you? (multiple choice)

          
          
      

          No.
          %
      
List of DAGs
          178
          89.4%
      
Task Logs
          162
          81.4%
      
DAG Runs
          160
          80.4%
      
Graph view
          147
          73.9%
      
Grid/Tree View
          138
          69.3%
      
Run Details
          117
          58.8%
      
DAG details
          111
          55.8%
      
Task Instances
          102
          51.3%
      
Task Duration
          91
          45.7%
      
Code
          90
          45.2%
      
Task Tries
          60
          30.2%
      
Gantt
          48
          21.4%
      
Landing Times
          27
          13.6%
      
Other
          4
          2%
      
UI views importance ranking shows that the majority Airflow users use Web UI mostly for monitoring and/or troubleshooting purposes, where the top 3 views are List of DAGs (89.4%), Task Logs (81.4%) and DAG Runs (80.4%). The results are very similar to those from 2020 and 2019.
Community and contribution
Are you participating in the Airflow community discussions? (single choice)


          
          
      

          No.
          %
      
I see them from time to time
          99
          48.3%
      
I regularly follow what’s being discussed but don’t participate
          53
          25.9%
      
I didn’t know I could
          41
          20.0%
      
I actively participate in the discussions
          12
          5.9%
      

          No.
          %
      
I know I can but I do not contribute
          116
          57.1%
      
Very rarely when it relates to what I need
          44
          21.7%
      
I do not know I could
          30
          14.8%
      
I regularly contribute by discussing, reviewing and submitting PR
          13
          6.4%
      
Results related to the Airflow contribution are very similar to those about participating in the Airflow community discussions. Most of the Airflow users (57.1%) who responded to the survey are aware but do not contribute or contribute very rarely (21.7%). 14.8% of users were not aware they could contribute. Once again, it’s a clear indicator that there is much more to be done to engage our community to be more active contributors and raise the current 6.4% of users who actively contribute.
If you do not contribute - why?


          
          
      

          No.
          %
      
I have no time to contribute even if would like to
          65
          38.9%
      
I don’t know how to start
          63
          37.7%
      
I don’t have a need to contribute
          19
          11.4%
      
I didn’t know I could
          12
          7.2%
      
My employer has policy that makes it difficult to contribute
          8
          4.8%
      
According to the survey results, the most important blocker for the Airflow contribution is limited time (38.9%), but surprisingly interesting and important blocker is also lack of knowledge on how to start (37.7%), followed by lack of knowledge that it’s possible to contribute (7.2%).
The future of Airflow
In your opinion, what could be improved in Airflow? (multiple choice)

          
          
      

          No.
          %
      
Web UI
          100
          49.5%
      
Logging, monitoring and alerting
          97
          48.0%
      
Examples, how-to, onboarding documentation
          74
          36.6%
      
Technical documentation
          74
          36.6%
      
Scheduler performance
          56
          27.7%
      
Reliability
          52
          25.7%
      
DAG authoring
          48
          23.8%
      
REST API
          43
          21.3%
      
Authentication and authorization
          41
          20.3%
      
External integration e.g. AWS, GCP, Apache products
          41
          20.3%
      
Better support for various deployments (Docker-compose/Nomad/Others)
          39
          19.3%
      
Everything works fine for me
          19
          9.4%
      
I don’t know
          4
          2.0%
      
The results are quite self-explanatory. According to the survey results, the top area for improvement is still the Airflow web UI (49.5%), closely followed by more telemetry for logging, monitoring and alerting purposes (48%). However all those efforts should go in line with improved documentation (36.6.%) and resources about using the Airflow, especially when we take into account the need of onboarding new users (36.6%).
Which features would you like to see in Airflow?

          
          
      

          No.
          %
      
DAG Versioning
          129
          66.2%
      
Dependency management and Data-driven scheduling
          83
          42.6%
      
More dynamic task structure
          82
          42.1%
      
Multi-Tenancy
          74
          37.9%
      
Signal-based scheduling
          67
          34.4%
      
Better Security (Isolation)
          65
          33.3%
      
Submitting new DAGs externally via API
          53
          27.2%
      
Composable Operators
          46
          23.6%
      
Support for native cloud executors (AWS/GCP/Azure etc.)
          44
          22.6%
      
Better support for Machine Learning
          38
          19.5%
      
Remote CLI
          36
          18.5%
      
Support for hybrid executors
          22
          11.3%
      
According to the survey results, DAG Versioning is a winner for new features in Airflow, and it’s not a surprise as this feature may positively impact daily work of Airflow users. It is followed by three other ideas: Dependency management and Data-driven scheduling (42.6%), More dynamic task structure (42.1%) and Multi-Tenancy (37.9%). Another interesting point from that question is that only 11.3% think that support for hybrid executors is needed in Airflow.
Data
If you’re interested in taking a look at the raw data yourself, it’s available here: (Airflow User Survey 2022.csv)[/data/survey-responses/airflow-user-survey-responses-2022.csv.zip]
