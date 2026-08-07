---
title: "Airflow Survey 2020"
link: "https://airflow.apache.org/blog/airflow-survey-2020/"
guid: "https://airflow.apache.org/blog/airflow-survey-2020/"
pubDate: "2021-03-09T00:00:00.000Z"
site_name: "Apache Airflow"
site_feed: "https://airflow.apache.org/blog/index.xml"
category: "Data"
summary: "Apache Airflow Survey 2020\nWorld of data processing tools is growing steadily. Apache Airflow seems to be already considered as\ncrucial component of this complex ecosystem. We observe steady growth in number of users as well as in\nan amount of active contributors. So listening and understanding our community is of high importance.\nIt’s worth to note that the 2020 survey was still mostly about 1.10.X version of Apache Airflow and\npossibly many drawbacks were addressed in the 2.0 version that was released in December 2020. But if this\nis true, we will learn next year!\nOverview of the user\n\nWhat best describes your current occupation? (single choice)\n\n          No.\n          %\n      \nData Engineer\n          115\n          56.65\n      \nDeveloper\n          28\n          13.79\n      \nDevOps\n          17\n          8.37\n      \nSolutions Architect\n          14\n          6.9\n      \nData Scientist\n          12\n          5.91\n      \nOther\n          10\n          4.93\n      \nData Analyst\n          4\n          1.97\n      \nSupport Engineer\n          3\n          1.48\n      \nThose results are not a surprise as Airflow is a tool dedicated to data-related tasks. The majority of\nour users are data engineers, scientists or analysts. The 2020 results are similar to those from 2019 with\nvisible slight increase in ML use cases.\nAdditionally, 79% of users uses Airflow on daily basis and 16% interacts with it at least once a week.\nHow many people work in your company? (single choice)\n\n          No.\n          %\n      \n200+\n          107\n          52.71\n      \n51-200\n          44\n          21.67\n      \n11-50\n          37\n          18.23\n      \n1-10\n          15\n          7.39\n      \nHow many people in your company use Airflow? (single choice)\n\n          No.\n          %\n      \n1-5\n          84\n          41.38\n      \n6-20\n          75\n          36.95\n      \n21-50\n          23\n          11.33\n      \n50+\n          21\n          10.34\n      \nAirflow is a software that is used and trusted by big companies. We can also see that Airflow can work\nfine for teams of different sizes. However, in some cases users may use multiple Airflow instances.\nAre you considering moving to other workflow engines? (single choice)\n\n          No.\n          %\n      \nNo, we are happy with Airflow\n          174\n          85.71\n      \nYes\n          29\n          14.29\n      \nNearly 1 out of 7 users is considering migrating to other workflow engines. Their decision is usually\njustified by need of easier workflow writing experience (12.32%), better UI/UX and faster scheduler\n(8.37% both).\nWhile the first point may be addressed by TaskFlow API in Airflow 2.0 the other two are definitely addressed\nin the new major version. And the early feedback from 2.0 users seems to be confirming it.\nThe alternative engines considered by users are mainly Prefect and Argo. Some participants also mentioned\nLuigi, Kubeflow or custom solutions.\nAre you or your team actively participating in Airflow development - contributing? (single choice)\n\n          No.\n          %\n      \nI wish we could\n          99\n          48.77\n      \nNo\n          59\n          29.06\n      \nYes\n          45\n          22.17\n      \nThis is really heart-warming result. It means that 1 out of 5 users contributes actively to our project!\nBut it would be good to learn if there’s something else than time that is stopping people who wish to contribute\nfrom doing it. If there are some other obstacles we definitely would like to learn about them so we can improve.\nThat said - if you know something we can improve please reach out via Slack, dev list or Github\ndiscussions.\nHow likely are you to recommend Apache Airflow? (single choice)\n\n          No.\n          2020 %\n          2019 %\n      \nVery Likely\n          125\n          61.58\n          45.45%\n      \nLikely\n          62\n          30.54\n          40.26%\n      \nNeutral\n          11\n          5.42\n          10.71%\n      \nUnlikely\n          3\n          1.48\n          2.60%\n      \nVery unlikely\n          2\n          0.99\n          0.97%\n      \nHere is good news! It seems that people are more willing to recommend Apache Airflow than year before.\nWhat is your source of information about Airflow? (multiple choice)\n\n          No.\n          %\n      \nDocumentation\n          154\n          75.86\n      \nAirflow website\n          139\n          68.47\n      \nSlack\n          128\n          63.05\n      \nGithub\n          127\n          62.56\n      \nStack Overflow\n          72\n          35.47\n      \nAirflow Summit Videos\n          44\n          21.67\n      \nThe dev mailing list\n          33\n          16.26\n      \nAwesome Apache Airflow repository\n          21\n          10.34\n      \nOther\n          15\n          7.39\n      \nHere we see that Airflow documentation is the crucial source of information. What’s interesting is that more\nthan 60% of users are getting information from Github and Slack channels.\n\nAirflow uses cases\nDo you have any customisation of Airflow? (single choice)\n\n          No.\n          %\n      \nNo, we use vanilla Airflow\n          154\n          75.86\n      \nYes, we have small patches (no fork)\n          34\n          16.75\n      \nYes, we have separate fork\n          15\n          7.39\n      \nWhen onboarding new members to airflow, what is the biggest problem? (multiple choice)\n\n          No.\n          %\n      \nNo guide on best practises on developing DAGs\n          102\n          50.25\n      \nThere is no easy option to launch Airflow\n          64\n          31.53\n      \nSmall number of tutorials on different aspects of using Airflow\n          57\n          28.08\n      \nDocumentation is not clear enough\n          53\n          26.11\n      \nThere is no easy option to deploy DAGs to an Airflow instance\n          52\n          25.62\n      \nNo problems\n          34\n          16.75\n      \nSmall number of blogs regarding Airflow\n          30\n          14.78\n      \nWhich interface(s) of Airflow do you use as part of your current role? (multiple choice)\n\n          No.\n          %\n      \nOriginal Airflow Graphical User Interface\n          199\n          98.03\n      \nCLI\n          88\n          43.35\n      \nAPI\n          48\n          23.65\n      \nCustom (own created) Airflow Graphical User Interface\n          12\n          5.91\n      \nOther\n          3\n          1.48\n      \nDo you combine multiple DAGs? (multiple choice)\n\n          No.\n          %\n      \nYes, by triggering another DAG\n          87\n          42.86\n      \nNo, I don’t combine multiple DAGs\n          79\n          38.92\n      \nYes, through SubDAG\n          40\n          19.7\n      \nOther\n          18\n          8.87\n      \nHow do you integrate with external services? (multiple choice)\n\n          No.\n          %\n      \nUsing existing dedicated operators / hooks\n          147\n          72.41\n      \nUsing Bash / Python operator\n          140\n          68.97\n      \nUsing own custom operators / hooks\n          138\n          67.98\n      \nOther\n          12\n          5.91\n      \nWhat external services do you use in your Airflow DAGs? (multiple choice)\n\n          No.\n          %\n      \nAmazon Web Services\n          121\n          59.61\n      \nInternal company systems\n          113\n          55.67\n      \nGoogle Cloud Platform / Google APIs\n          97\n          47.78\n      \nHadoop / Spark / Flink / Other Apache software\n          72\n          35.47\n      \nMicrosoft Azure\n          21\n          10.34\n      \nOther\n          19\n          9.36\n      \nI do not use external services in my Airflow DAGs\n          5\n          2.46\n      \n\nDo you use Airflow Plugins? If yes, what do you use them for? (multiple choice)\n\n          No.\n          %\n      \nAdding new operators/sensors and hooks\n          119\n          58.62\n      \nI don’t use Airflow plugins\n          69\n          33.99\n      \nAdding AppBuilder views & menu items\n          27\n          13.3\n      \nAdding new executors\n          17\n          8.37\n      \nAdding OperatorExtraLinks\n          13\n          6.4\n      \n| Other\nDo you use Airflow’s data lineage feature? (single choice)\n\n          No.\n          %\n      \nNo, I will use such feature if fully supported in Airflow\n          105\n          51.72\n      \nNo, data lineage isn’t a concern for my usage.\n          68\n          33.5\n      \nYes, I use another data lineage product\n          24\n          11.82\n      \nYes, I use custom implementation\n          5\n          2.46\n      \nYes, I use Airflow’s experimental data lineage feature\n          1\n          0.49\n      \nWhen asked what lineage product users use, the answers were varying from custom tools\nto known product like Amundsen, Atlas or dbt.\nDeployment\nHow many active DAGs do you have in your largest Airflow instance? (open question)\nNumber of DAGs\n          No.\n          %\n      \n< 20\n          64\n          32\n      \n21-40\n          33\n          16\n      \n41-60\n          13\n          6\n      \n61-100\n          32\n          16\n      \n101-200\n          31\n          15\n      \n201-300\n          8\n          4\n      \n301-999\n          12\n          6\n      \n1000+\n          10\n          5\n      \nWhat is the maximum number of tasks that you have used in one DAG? (open question)\nNumber of DAGs\n          No.\n          %\n      \n< 10\n          42\n          21\n      \n11-20\n          31\n          15\n      \n21-30\n          15\n          7\n      \n31-40\n          11\n          5\n      \n41-50\n          22\n          11\n      \n51-100\n          39\n          19\n      \n101-200\n          16\n          8\n      \n201-500\n          16\n          8\n      \n501+\n          11\n          5\n      \nWhich version of Airflow do you use currently? (single choice)\n\n          No.\n          %\n      \n1.10.14\n          55\n          27.09\n      \n2.0.0+\n          45\n          22.17\n      \n1.10.12\n          27\n          13.3\n      \n1.10.10\n          26\n          12.81\n      \n1.10.11\n          14\n          6.9\n      \n1.10.5 or older\n          10\n          4.93\n      \n1.10.9\n          8\n          3.94\n      \n1.10.13\n          7\n          3.45\n      \n1.10.6\n          4\n          1.97\n      \n1.10.7\n          4\n          1.97\n      \n1.10.8\n          3\n          1.48\n      \nThis was probably one of the most important questions in the survey. While it’s good to see\nthat more than 60% of users use one of three latest Airflow versions, it’s worrying that the rest\nare using versions that are old or have known security vulnerabilities.\nAdditionally, more than 20% of users are already using 2.0.0+ versions which is reasonably good information.\nWhat meta-database do you use? (single choice)\n\n          No.\n          %\n      \nPostgres 12\n          36\n          17.73\n      \nPostgres 9.6\n          33\n          16.26\n      \nPostgres 11\n          31\n          15.27\n      \nMySQL 5.7\n          27\n          13.3\n      \nMySQL 8.0\n          20\n          9.85\n      \nPostgres 10\n          20\n          9.85\n      \nOther\n          19\n          9.36\n      \nPostgres 13\n          18\n          8.87\n      \nThis means that more about 69% of users decide to use Postgres as their meta-database.\nMySQL is the choice of nearly 24% users. The other responses included some MySQL versions\nlike MariaDB or cloud hosted database like Cloud SQL (used by Google Composer) or AWS Aurora.\nIt’s good to know that users rather avoid using SQLite in production deployments!\nWhat executor type do you use? (single choice)\n\n\n          No.\n          2020\n          2019\n      \nCelery\n          100\n          49.26%\n          44.81%\n      \nKubernetes\n          48\n          23.65%\n          16.88%\n      \nLocal\n          40\n          19.7%\n          27.60%\n      \nSequential\n          10\n          4.93%\n          7.14%\n      \nOther\n          5\n          2.46%\n          3.57\n      \nIn comparison to previous year it seems that more users use currently Celery and\nKubernetes executors and LocalExecutor usage dropped by nearly 8 points. This may\nsuggest that users’ deployments are growing, and they need more scalable solutions.\nAmong CeleryExecutor users 78% use Redis as a broker, 19% use RabbitMQ and the rest\nis using other brokers or is not sure what is used in their deployments.\nWhat metrics do you use to monitor Airflow? (multiple choice)\n\n          No.\n          %\n      \nI do not use monitoring\n          65\n          32.02\n      \nExternal monitoring service\n          60\n          29.56\n      \nInformation from metadatabase\n          51\n          25.12\n      \nStatsd\n          49\n          24.14\n      \nOther\n          31\n          15.27\n      \nThe other responses included mostly information about tools used by users\nincluding DataDog and Prometheus exporter.\nHow do you deploy Airflow? (single choice)\n\n          No.\n          %\n      \nOn virtual machines (for example using AWS EC2)\n          64\n          31.53\n      \nUsing a managed service like Astronomer, Google Composer or AWS MWAA\n          35\n          17.24\n      \nOn Kubernetes (using custom deployments)\n          29\n          14.29\n      \nOn premises\n          28\n          13.79\n      \nOn Kubernetes (using another helm chart)\n          20\n          9.85\n      \nOn Kubernetes (using Apache Airflow’s helm chart)\n          17\n          8.37\n      \nOther\n          12\n          5.91\n      \nNearly 33% of users deploys Airflow using some kind of Kubernetes deployment. This is about\n10 percent more than in 2019. There’s slightly increase in usage of Airflow via\nmanaged services (14.61% in 2019).\nDo you use containerisation for deployment? (single choice)\n\n          No.\n          %\n      \nYes, using helm chart / kubernetes\n          58\n          28.57\n      \nNo, I don’t use containerisation\n          57\n          28.08\n      \nYes, single docker image\n          49\n          24.14\n      \nYes, using docker compose\n          39\n          19.21\n      \nAmong users who do not use Kubernetes based deployments 58% of them use containerisation. About\n42% of those users use docker-compose for deployments.\nHow do you distribute your DAGs? (single choice)\n\n          No.\n          %\n      \nUsing a synchronizing process (Git sync, GCS fuse, etc)\n          79\n          38.92\n      \nBake them into the docker image\n          56\n          27.59\n      \nShared files system\n          34\n          16.75\n      \nOther\n          20\n          9.85\n      \nI don’t know\n          14\n          6.9\n      \nThe most popular way of distributing DAGs seems to be using a synchronizing process. About\n40% of users use this process together with Kubernetes deployments.\nFuture of Airflow\nIn your opinion, what could be improved in Airflow? (multiple choice)\n\n          No.\n          %\n      \nWeb UI\n          100\n          49.26\n      \nExamples, how-to, onboarding documentation\n          90\n          44.33\n      \nLogging, monitoring and alerting\n          90\n          44.33\n      \nTechnical documentation\n          90\n          44.33\n      \nScheduler performance\n          83\n          40.89\n      \nDAG authoring\n          64\n          31.53\n      \nAuthentication and authorization\n          58\n          28.57\n      \nREST API\n          51\n          25.12\n      \nOther\n          44\n          21.67\n      \nReliability\n          41\n          20.2\n      \nExternal integration e.g. AWS, GCP, Apache products\n          36\n          17.73\n      \nSecurity\n          28\n          13.79\n      \nCLI\n          20\n          9.85\n      \nEverything work fine for me\n          14\n          6.9\n      \nI don’t know\n          4\n          1.97\n      \nWhich features would most interest you? (multiple choice)\n\n          No.\n          %\n      \nDAG versioning\n          109\n          53.69\n      \nBuiltin statistics\n          71\n          34.98\n      \nImproved data lineage\n          65\n          32.02\n      \nScheduling at the start of the interval\n          63\n          31.03\n      \nStateless workers\n          59\n          29.06\n      \nMore option to configure schedules (time units, increments)\n          57\n          28.08\n      \nMulti-tenant deployment\n          49\n          24.14\n      \nDAG fetcher (AIP-5)\n          39\n          19.21\n      \nGeneric transfer operator\n          34\n          16.75\n      \nOther\n          33\n          16.26\n      \nI have everything I need\n          11\n          5.42\n      \nNothing\n          11\n          5.42\n      \nWill you consider migrating to Airflow 2.0? (single choice)\n\n          No.\n          %\n      \nYes, as soon as possible\n          81\n          39.9\n      \nYes, once it’s mature (for example after 2.1)\n          72\n          35.47\n      \nI am already using Airflow 2.0+\n          39\n          19.21\n      \nI don’t know yet\n          8\n          3.94\n      \nNo, I do not plan to migrate\n          3\n          1.48\n      \nWhat are the features of Airflow 2.0 you are most excited about? (multiple choice)\n\n          No.\n          %\n      \nGeneral performance improvements\n          133\n          65.52\n      \nRefreshed WebUI\n          102\n          50.25\n      \nScheduler HA\n          99\n          48.77\n      \nOfficial docker image\n          84\n          41.38\n      \n@task decorator\n          56\n          27.59\n      \nOfficial helm chart\n          51\n          25.12\n      \nProviders packages\n          41\n          20.2\n      \nConfigurable XCom backends\n          33\n          16.26\n      \nCeleryKubernetesExecutor\n          31\n          15.27\n      \nOther\n          12\n          5.91\n      \nSummary\nFrom an open-source point of view, it is good to see that many people would love to contribute to Apache Airflow.\nThis means that there are resources that if unleashed may make our community even stronger. From a product perspective, it is important to know that users are usually using the latest versions of our software and\nare willing to upgrade to new ones.\nFinally, there are still some things to improve - documentation, onboarding guides and plug-and-play airflow\ndeployments. However, we hope that with the increase of adoption there will be an increase in people willing\nto share their experience and tools.\nData\nIf you think I missed something or you simply want to look for insights on your own, the data is available for you here: (Airflow User Survey 2020.csv)[/data/survey-responses/airflow-user-survey-responses-2020.csv.zip]"
author: "Apache Airflow"
contentHtml: "<h1 id=\"apache-airflow-survey-2020\">Apache Airflow Survey 2020</h1>\n<p>World of data processing tools is growing steadily. Apache Airflow seems to be already considered as\ncrucial component of this complex ecosystem. We observe steady growth in number of users as well as in\nan amount of active contributors. So listening and understanding our community is of high importance.</p>\n<p>It&rsquo;s worth to note that the 2020 survey was still mostly about 1.10.X version of Apache Airflow and\npossibly many drawbacks were addressed in the 2.0 version that was released in December 2020. But if this\nis true, we will learn next year!</p>\n<h2 id=\"overview-of-the-user\">Overview of the user</h2>\n<p><img src=\"/blog/airflow-survey-2020/What_best_describes_your_current_occupation.png\" alt=\"\"></p>\n<p><strong>What best describes your current occupation? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Data Engineer</td>\n          <td>115</td>\n          <td>56.65</td>\n      </tr>\n      <tr>\n          <td>Developer</td>\n          <td>28</td>\n          <td>13.79</td>\n      </tr>\n      <tr>\n          <td>DevOps</td>\n          <td>17</td>\n          <td>8.37</td>\n      </tr>\n      <tr>\n          <td>Solutions Architect</td>\n          <td>14</td>\n          <td>6.9</td>\n      </tr>\n      <tr>\n          <td>Data Scientist</td>\n          <td>12</td>\n          <td>5.91</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>10</td>\n          <td>4.93</td>\n      </tr>\n      <tr>\n          <td>Data Analyst</td>\n          <td>4</td>\n          <td>1.97</td>\n      </tr>\n      <tr>\n          <td>Support Engineer</td>\n          <td>3</td>\n          <td>1.48</td>\n      </tr>\n  </tbody>\n</table>\n<p>Those results are not a surprise as Airflow is a tool dedicated to data-related tasks. The majority of\nour users are data engineers, scientists or analysts. The 2020 results are similar to <a href=\"https://airflow.apache.org/blog/airflow-survey/\">those from 2019</a> with\nvisible slight increase in ML use cases.</p>\n<p>Additionally, 79% of users uses Airflow on daily basis and 16% interacts with it at least once a week.</p>\n<p><strong>How many people work in your company? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>200+</td>\n          <td>107</td>\n          <td>52.71</td>\n      </tr>\n      <tr>\n          <td>51-200</td>\n          <td>44</td>\n          <td>21.67</td>\n      </tr>\n      <tr>\n          <td>11-50</td>\n          <td>37</td>\n          <td>18.23</td>\n      </tr>\n      <tr>\n          <td>1-10</td>\n          <td>15</td>\n          <td>7.39</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>How many people in your company use Airflow? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>1-5</td>\n          <td>84</td>\n          <td>41.38</td>\n      </tr>\n      <tr>\n          <td>6-20</td>\n          <td>75</td>\n          <td>36.95</td>\n      </tr>\n      <tr>\n          <td>21-50</td>\n          <td>23</td>\n          <td>11.33</td>\n      </tr>\n      <tr>\n          <td>50+</td>\n          <td>21</td>\n          <td>10.34</td>\n      </tr>\n  </tbody>\n</table>\n<p>Airflow is a software that is used and trusted by big companies. We can also see that Airflow can work\nfine for teams of different sizes. However, in some cases users may use multiple Airflow instances.</p>\n<p><strong>Are you considering moving to other workflow engines? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>No, we are happy with Airflow</td>\n          <td>174</td>\n          <td>85.71</td>\n      </tr>\n      <tr>\n          <td>Yes</td>\n          <td>29</td>\n          <td>14.29</td>\n      </tr>\n  </tbody>\n</table>\n<p>Nearly 1 out of 7 users is considering migrating to other workflow engines. Their decision is usually\njustified by need of <strong>easier workflow writing experience</strong> (12.32%), <strong>better UI/UX</strong> and <strong>faster scheduler</strong>\n(8.37% both).</p>\n<p>While the first point may be addressed by <a href=\"http://airflow.apache.org/docs/apache-airflow/stable/concepts.html#taskflow-api\">TaskFlow API</a> in Airflow 2.0 the other two are definitely addressed\nin the new major version. And the early feedback from 2.0 users seems to be confirming it.</p>\n<p>The alternative engines considered by users are mainly Prefect and Argo. Some participants also mentioned\nLuigi, Kubeflow or custom solutions.</p>\n<p><strong>Are you or your team actively participating in Airflow development - contributing? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>I wish we could</td>\n          <td>99</td>\n          <td>48.77</td>\n      </tr>\n      <tr>\n          <td>No</td>\n          <td>59</td>\n          <td>29.06</td>\n      </tr>\n      <tr>\n          <td>Yes</td>\n          <td>45</td>\n          <td>22.17</td>\n      </tr>\n  </tbody>\n</table>\n<p>This is really heart-warming result. It means that 1 out of 5 users contributes actively to our project!\nBut it would be good to learn if there&rsquo;s something else than time that is stopping people who wish to contribute\nfrom doing it. If there are some other obstacles we definitely would like to learn about them so we can improve.\nThat said - if you know something we can improve please reach out via Slack, dev list or Github\ndiscussions.</p>\n<p><strong>How likely are you to recommend Apache Airflow? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>2020 %</th>\n          <th>2019 %</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Very Likely</td>\n          <td>125</td>\n          <td>61.58</td>\n          <td>45.45%</td>\n      </tr>\n      <tr>\n          <td>Likely</td>\n          <td>62</td>\n          <td>30.54</td>\n          <td>40.26%</td>\n      </tr>\n      <tr>\n          <td>Neutral</td>\n          <td>11</td>\n          <td>5.42</td>\n          <td>10.71%</td>\n      </tr>\n      <tr>\n          <td>Unlikely</td>\n          <td>3</td>\n          <td>1.48</td>\n          <td>2.60%</td>\n      </tr>\n      <tr>\n          <td>Very unlikely</td>\n          <td>2</td>\n          <td>0.99</td>\n          <td>0.97%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Here is good news! It seems that people are more willing to recommend Apache Airflow than year before.</p>\n<p><strong>What is your source of information about Airflow? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Documentation</td>\n          <td>154</td>\n          <td>75.86</td>\n      </tr>\n      <tr>\n          <td>Airflow website</td>\n          <td>139</td>\n          <td>68.47</td>\n      </tr>\n      <tr>\n          <td>Slack</td>\n          <td>128</td>\n          <td>63.05</td>\n      </tr>\n      <tr>\n          <td>Github</td>\n          <td>127</td>\n          <td>62.56</td>\n      </tr>\n      <tr>\n          <td>Stack Overflow</td>\n          <td>72</td>\n          <td>35.47</td>\n      </tr>\n      <tr>\n          <td>Airflow Summit Videos</td>\n          <td>44</td>\n          <td>21.67</td>\n      </tr>\n      <tr>\n          <td>The dev mailing list</td>\n          <td>33</td>\n          <td>16.26</td>\n      </tr>\n      <tr>\n          <td>Awesome Apache Airflow repository</td>\n          <td>21</td>\n          <td>10.34</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>15</td>\n          <td>7.39</td>\n      </tr>\n  </tbody>\n</table>\n<p>Here we see that Airflow documentation is the crucial source of information. What&rsquo;s interesting is that more\nthan 60% of users are getting information from Github and Slack channels.</p>\n<p><img src=\"/blog/airflow-survey-2020/Where_are_you_based.png\" alt=\"\"></p>\n<h2 id=\"airflow-uses-cases\">Airflow uses cases</h2>\n<p><strong>Do you have any customisation of Airflow? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>No, we use vanilla Airflow</td>\n          <td>154</td>\n          <td>75.86</td>\n      </tr>\n      <tr>\n          <td>Yes, we have small patches (no fork)</td>\n          <td>34</td>\n          <td>16.75</td>\n      </tr>\n      <tr>\n          <td>Yes, we have separate fork</td>\n          <td>15</td>\n          <td>7.39</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>When onboarding new members to airflow, what is the biggest problem? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>No guide on best practises on developing DAGs</td>\n          <td>102</td>\n          <td>50.25</td>\n      </tr>\n      <tr>\n          <td>There is no easy option to launch Airflow</td>\n          <td>64</td>\n          <td>31.53</td>\n      </tr>\n      <tr>\n          <td>Small number of tutorials on different aspects of using Airflow</td>\n          <td>57</td>\n          <td>28.08</td>\n      </tr>\n      <tr>\n          <td>Documentation is not clear enough</td>\n          <td>53</td>\n          <td>26.11</td>\n      </tr>\n      <tr>\n          <td>There is no easy option to deploy DAGs to an Airflow instance</td>\n          <td>52</td>\n          <td>25.62</td>\n      </tr>\n      <tr>\n          <td>No problems</td>\n          <td>34</td>\n          <td>16.75</td>\n      </tr>\n      <tr>\n          <td>Small number of blogs regarding Airflow</td>\n          <td>30</td>\n          <td>14.78</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>Which interface(s) of Airflow do you use as part of your current role? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Original Airflow Graphical User Interface</td>\n          <td>199</td>\n          <td>98.03</td>\n      </tr>\n      <tr>\n          <td>CLI</td>\n          <td>88</td>\n          <td>43.35</td>\n      </tr>\n      <tr>\n          <td>API</td>\n          <td>48</td>\n          <td>23.65</td>\n      </tr>\n      <tr>\n          <td>Custom (own created) Airflow Graphical User Interface</td>\n          <td>12</td>\n          <td>5.91</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>3</td>\n          <td>1.48</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>Do you combine multiple DAGs? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Yes, by triggering another DAG</td>\n          <td>87</td>\n          <td>42.86</td>\n      </tr>\n      <tr>\n          <td>No, I don&rsquo;t combine multiple DAGs</td>\n          <td>79</td>\n          <td>38.92</td>\n      </tr>\n      <tr>\n          <td>Yes, through SubDAG</td>\n          <td>40</td>\n          <td>19.7</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>18</td>\n          <td>8.87</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>How do you integrate with external services? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Using existing dedicated operators / hooks</td>\n          <td>147</td>\n          <td>72.41</td>\n      </tr>\n      <tr>\n          <td>Using Bash / Python operator</td>\n          <td>140</td>\n          <td>68.97</td>\n      </tr>\n      <tr>\n          <td>Using own custom operators / hooks</td>\n          <td>138</td>\n          <td>67.98</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>12</td>\n          <td>5.91</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>What external services do you use in your Airflow DAGs? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Amazon Web Services</td>\n          <td>121</td>\n          <td>59.61</td>\n      </tr>\n      <tr>\n          <td>Internal company systems</td>\n          <td>113</td>\n          <td>55.67</td>\n      </tr>\n      <tr>\n          <td>Google Cloud Platform / Google APIs</td>\n          <td>97</td>\n          <td>47.78</td>\n      </tr>\n      <tr>\n          <td>Hadoop / Spark / Flink / Other Apache software</td>\n          <td>72</td>\n          <td>35.47</td>\n      </tr>\n      <tr>\n          <td>Microsoft Azure</td>\n          <td>21</td>\n          <td>10.34</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>19</td>\n          <td>9.36</td>\n      </tr>\n      <tr>\n          <td>I do not use external services in my Airflow DAGs</td>\n          <td>5</td>\n          <td>2.46</td>\n      </tr>\n  </tbody>\n</table>\n<p><img src=\"/blog/airflow-survey-2020/What_external_services_do_you_use_in_your_Airflow_DAGs.png\" alt=\"\"></p>\n<p><strong>Do you use Airflow Plugins? If yes, what do you use them for? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Adding new operators/sensors and hooks</td>\n          <td>119</td>\n          <td>58.62</td>\n      </tr>\n      <tr>\n          <td>I don&rsquo;t use Airflow plugins</td>\n          <td>69</td>\n          <td>33.99</td>\n      </tr>\n      <tr>\n          <td>Adding AppBuilder views &amp; menu items</td>\n          <td>27</td>\n          <td>13.3</td>\n      </tr>\n      <tr>\n          <td>Adding new executors</td>\n          <td>17</td>\n          <td>8.37</td>\n      </tr>\n      <tr>\n          <td>Adding OperatorExtraLinks</td>\n          <td>13</td>\n          <td>6.4</td>\n      </tr>\n  </tbody>\n</table>\n<p>| Other</p>\n<p><strong>Do you use Airflow&rsquo;s data lineage feature? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>No, I will use such feature if fully supported in Airflow</td>\n          <td>105</td>\n          <td>51.72</td>\n      </tr>\n      <tr>\n          <td>No, data lineage isn’t a concern for my usage.</td>\n          <td>68</td>\n          <td>33.5</td>\n      </tr>\n      <tr>\n          <td>Yes, I use another data lineage product</td>\n          <td>24</td>\n          <td>11.82</td>\n      </tr>\n      <tr>\n          <td>Yes, I use custom implementation</td>\n          <td>5</td>\n          <td>2.46</td>\n      </tr>\n      <tr>\n          <td>Yes, I use Airflow&rsquo;s experimental data lineage feature</td>\n          <td>1</td>\n          <td>0.49</td>\n      </tr>\n  </tbody>\n</table>\n<p>When asked what lineage product users use, the answers were varying from custom tools\nto known product like Amundsen, Atlas or dbt.</p>\n<h2 id=\"deployment\">Deployment</h2>\n<p><strong>How many active DAGs do you have in your largest Airflow instance? (open question)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th>Number of DAGs</th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>&lt; 20</td>\n          <td>64</td>\n          <td>32</td>\n      </tr>\n      <tr>\n          <td>21-40</td>\n          <td>33</td>\n          <td>16</td>\n      </tr>\n      <tr>\n          <td>41-60</td>\n          <td>13</td>\n          <td>6</td>\n      </tr>\n      <tr>\n          <td>61-100</td>\n          <td>32</td>\n          <td>16</td>\n      </tr>\n      <tr>\n          <td>101-200</td>\n          <td>31</td>\n          <td>15</td>\n      </tr>\n      <tr>\n          <td>201-300</td>\n          <td>8</td>\n          <td>4</td>\n      </tr>\n      <tr>\n          <td>301-999</td>\n          <td>12</td>\n          <td>6</td>\n      </tr>\n      <tr>\n          <td>1000+</td>\n          <td>10</td>\n          <td>5</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>What is the maximum number of tasks that you have used in one DAG? (open question)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th>Number of DAGs</th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>&lt; 10</td>\n          <td>42</td>\n          <td>21</td>\n      </tr>\n      <tr>\n          <td>11-20</td>\n          <td>31</td>\n          <td>15</td>\n      </tr>\n      <tr>\n          <td>21-30</td>\n          <td>15</td>\n          <td>7</td>\n      </tr>\n      <tr>\n          <td>31-40</td>\n          <td>11</td>\n          <td>5</td>\n      </tr>\n      <tr>\n          <td>41-50</td>\n          <td>22</td>\n          <td>11</td>\n      </tr>\n      <tr>\n          <td>51-100</td>\n          <td>39</td>\n          <td>19</td>\n      </tr>\n      <tr>\n          <td>101-200</td>\n          <td>16</td>\n          <td>8</td>\n      </tr>\n      <tr>\n          <td>201-500</td>\n          <td>16</td>\n          <td>8</td>\n      </tr>\n      <tr>\n          <td>501+</td>\n          <td>11</td>\n          <td>5</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>Which version of Airflow do you use currently? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>1.10.14</td>\n          <td>55</td>\n          <td>27.09</td>\n      </tr>\n      <tr>\n          <td>2.0.0+</td>\n          <td>45</td>\n          <td>22.17</td>\n      </tr>\n      <tr>\n          <td>1.10.12</td>\n          <td>27</td>\n          <td>13.3</td>\n      </tr>\n      <tr>\n          <td>1.10.10</td>\n          <td>26</td>\n          <td>12.81</td>\n      </tr>\n      <tr>\n          <td>1.10.11</td>\n          <td>14</td>\n          <td>6.9</td>\n      </tr>\n      <tr>\n          <td>1.10.5 or older</td>\n          <td>10</td>\n          <td>4.93</td>\n      </tr>\n      <tr>\n          <td>1.10.9</td>\n          <td>8</td>\n          <td>3.94</td>\n      </tr>\n      <tr>\n          <td>1.10.13</td>\n          <td>7</td>\n          <td>3.45</td>\n      </tr>\n      <tr>\n          <td>1.10.6</td>\n          <td>4</td>\n          <td>1.97</td>\n      </tr>\n      <tr>\n          <td>1.10.7</td>\n          <td>4</td>\n          <td>1.97</td>\n      </tr>\n      <tr>\n          <td>1.10.8</td>\n          <td>3</td>\n          <td>1.48</td>\n      </tr>\n  </tbody>\n</table>\n<p>This was probably one of the most important questions in the survey. While it&rsquo;s good to see\nthat more than 60% of users use one of three latest Airflow versions, it&rsquo;s worrying that the rest\nare using versions that are old or have known security vulnerabilities.</p>\n<p>Additionally, more than 20% of users are already using 2.0.0+ versions which is reasonably good information.</p>\n<p><strong>What meta-database do you use? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Postgres 12</td>\n          <td>36</td>\n          <td>17.73</td>\n      </tr>\n      <tr>\n          <td>Postgres 9.6</td>\n          <td>33</td>\n          <td>16.26</td>\n      </tr>\n      <tr>\n          <td>Postgres 11</td>\n          <td>31</td>\n          <td>15.27</td>\n      </tr>\n      <tr>\n          <td>MySQL 5.7</td>\n          <td>27</td>\n          <td>13.3</td>\n      </tr>\n      <tr>\n          <td>MySQL 8.0</td>\n          <td>20</td>\n          <td>9.85</td>\n      </tr>\n      <tr>\n          <td>Postgres 10</td>\n          <td>20</td>\n          <td>9.85</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>19</td>\n          <td>9.36</td>\n      </tr>\n      <tr>\n          <td>Postgres 13</td>\n          <td>18</td>\n          <td>8.87</td>\n      </tr>\n  </tbody>\n</table>\n<p>This means that more about 69% of users decide to use Postgres as their meta-database.\nMySQL is the choice of nearly 24% users. The other responses included some MySQL versions\nlike MariaDB or cloud hosted database like Cloud SQL (used by Google Composer) or AWS Aurora.</p>\n<p>It&rsquo;s good to know that users rather avoid using SQLite in production deployments!</p>\n<p><strong>What executor type do you use? (single choice)</strong></p>\n<p><img src=\"/blog/airflow-survey-2020/What_executor_type_do_you_use.png\" alt=\"\"></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>2020</th>\n          <th>2019</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Celery</td>\n          <td>100</td>\n          <td>49.26%</td>\n          <td>44.81%</td>\n      </tr>\n      <tr>\n          <td>Kubernetes</td>\n          <td>48</td>\n          <td>23.65%</td>\n          <td>16.88%</td>\n      </tr>\n      <tr>\n          <td>Local</td>\n          <td>40</td>\n          <td>19.7%</td>\n          <td>27.60%</td>\n      </tr>\n      <tr>\n          <td>Sequential</td>\n          <td>10</td>\n          <td>4.93%</td>\n          <td>7.14%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>5</td>\n          <td>2.46%</td>\n          <td>3.57</td>\n      </tr>\n  </tbody>\n</table>\n<p>In comparison to previous year it seems that more users use currently Celery and\nKubernetes executors and LocalExecutor usage dropped by nearly 8 points. This may\nsuggest that users&rsquo; deployments are growing, and they need more scalable solutions.</p>\n<p>Among CeleryExecutor users 78% use Redis as a broker, 19% use RabbitMQ and the rest\nis using other brokers or is not sure what is used in their deployments.</p>\n<p><strong>What metrics do you use to monitor Airflow? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>I do not use monitoring</td>\n          <td>65</td>\n          <td>32.02</td>\n      </tr>\n      <tr>\n          <td>External monitoring service</td>\n          <td>60</td>\n          <td>29.56</td>\n      </tr>\n      <tr>\n          <td>Information from metadatabase</td>\n          <td>51</td>\n          <td>25.12</td>\n      </tr>\n      <tr>\n          <td>Statsd</td>\n          <td>49</td>\n          <td>24.14</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>31</td>\n          <td>15.27</td>\n      </tr>\n  </tbody>\n</table>\n<p>The other responses included mostly information about tools used by users\nincluding DataDog and Prometheus exporter.</p>\n<p><strong>How do you deploy Airflow? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>On virtual machines (for example using AWS EC2)</td>\n          <td>64</td>\n          <td>31.53</td>\n      </tr>\n      <tr>\n          <td>Using a managed service like Astronomer, Google Composer or AWS MWAA</td>\n          <td>35</td>\n          <td>17.24</td>\n      </tr>\n      <tr>\n          <td>On Kubernetes (using custom deployments)</td>\n          <td>29</td>\n          <td>14.29</td>\n      </tr>\n      <tr>\n          <td>On premises</td>\n          <td>28</td>\n          <td>13.79</td>\n      </tr>\n      <tr>\n          <td>On Kubernetes (using another helm chart)</td>\n          <td>20</td>\n          <td>9.85</td>\n      </tr>\n      <tr>\n          <td>On Kubernetes (using Apache Airflow&rsquo;s helm chart)</td>\n          <td>17</td>\n          <td>8.37</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>12</td>\n          <td>5.91</td>\n      </tr>\n  </tbody>\n</table>\n<p>Nearly 33% of users deploys Airflow using some kind of Kubernetes deployment. This is about\n10 percent more than in 2019. There&rsquo;s slightly increase in usage of Airflow via\nmanaged services (14.61% in 2019).</p>\n<p><strong>Do you use containerisation for deployment? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Yes, using helm chart / kubernetes</td>\n          <td>58</td>\n          <td>28.57</td>\n      </tr>\n      <tr>\n          <td>No, I don’t use containerisation</td>\n          <td>57</td>\n          <td>28.08</td>\n      </tr>\n      <tr>\n          <td>Yes, single docker image</td>\n          <td>49</td>\n          <td>24.14</td>\n      </tr>\n      <tr>\n          <td>Yes, using docker compose</td>\n          <td>39</td>\n          <td>19.21</td>\n      </tr>\n  </tbody>\n</table>\n<p>Among users who do not use Kubernetes based deployments 58% of them use containerisation. About\n42% of those users use docker-compose for deployments.</p>\n<p><strong>How do you distribute your DAGs? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Using a synchronizing process (Git sync, GCS fuse, etc)</td>\n          <td>79</td>\n          <td>38.92</td>\n      </tr>\n      <tr>\n          <td>Bake them into the docker image</td>\n          <td>56</td>\n          <td>27.59</td>\n      </tr>\n      <tr>\n          <td>Shared files system</td>\n          <td>34</td>\n          <td>16.75</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>20</td>\n          <td>9.85</td>\n      </tr>\n      <tr>\n          <td>I don’t know</td>\n          <td>14</td>\n          <td>6.9</td>\n      </tr>\n  </tbody>\n</table>\n<p>The most popular way of distributing DAGs seems to be using a synchronizing process. About\n40% of users use this process together with Kubernetes deployments.</p>\n<h2 id=\"future-of-airflow\">Future of Airflow</h2>\n<p><strong>In your opinion, what could be improved in Airflow? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Web UI</td>\n          <td>100</td>\n          <td>49.26</td>\n      </tr>\n      <tr>\n          <td>Examples, how-to, onboarding documentation</td>\n          <td>90</td>\n          <td>44.33</td>\n      </tr>\n      <tr>\n          <td>Logging, monitoring and alerting</td>\n          <td>90</td>\n          <td>44.33</td>\n      </tr>\n      <tr>\n          <td>Technical documentation</td>\n          <td>90</td>\n          <td>44.33</td>\n      </tr>\n      <tr>\n          <td>Scheduler performance</td>\n          <td>83</td>\n          <td>40.89</td>\n      </tr>\n      <tr>\n          <td>DAG authoring</td>\n          <td>64</td>\n          <td>31.53</td>\n      </tr>\n      <tr>\n          <td>Authentication and authorization</td>\n          <td>58</td>\n          <td>28.57</td>\n      </tr>\n      <tr>\n          <td>REST API</td>\n          <td>51</td>\n          <td>25.12</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>44</td>\n          <td>21.67</td>\n      </tr>\n      <tr>\n          <td>Reliability</td>\n          <td>41</td>\n          <td>20.2</td>\n      </tr>\n      <tr>\n          <td>External integration e.g. AWS, GCP, Apache products</td>\n          <td>36</td>\n          <td>17.73</td>\n      </tr>\n      <tr>\n          <td>Security</td>\n          <td>28</td>\n          <td>13.79</td>\n      </tr>\n      <tr>\n          <td>CLI</td>\n          <td>20</td>\n          <td>9.85</td>\n      </tr>\n      <tr>\n          <td>Everything work fine for me</td>\n          <td>14</td>\n          <td>6.9</td>\n      </tr>\n      <tr>\n          <td>I don’t know</td>\n          <td>4</td>\n          <td>1.97</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>Which features would most interest you? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>DAG versioning</td>\n          <td>109</td>\n          <td>53.69</td>\n      </tr>\n      <tr>\n          <td>Builtin statistics</td>\n          <td>71</td>\n          <td>34.98</td>\n      </tr>\n      <tr>\n          <td>Improved data lineage</td>\n          <td>65</td>\n          <td>32.02</td>\n      </tr>\n      <tr>\n          <td>Scheduling at the start of the interval</td>\n          <td>63</td>\n          <td>31.03</td>\n      </tr>\n      <tr>\n          <td>Stateless workers</td>\n          <td>59</td>\n          <td>29.06</td>\n      </tr>\n      <tr>\n          <td>More option to configure schedules (time units, increments)</td>\n          <td>57</td>\n          <td>28.08</td>\n      </tr>\n      <tr>\n          <td>Multi-tenant deployment</td>\n          <td>49</td>\n          <td>24.14</td>\n      </tr>\n      <tr>\n          <td>DAG fetcher (AIP-5)</td>\n          <td>39</td>\n          <td>19.21</td>\n      </tr>\n      <tr>\n          <td>Generic transfer operator</td>\n          <td>34</td>\n          <td>16.75</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>33</td>\n          <td>16.26</td>\n      </tr>\n      <tr>\n          <td>I have everything I need</td>\n          <td>11</td>\n          <td>5.42</td>\n      </tr>\n      <tr>\n          <td>Nothing</td>\n          <td>11</td>\n          <td>5.42</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>Will you consider migrating to Airflow 2.0? (single choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Yes, as soon as possible</td>\n          <td>81</td>\n          <td>39.9</td>\n      </tr>\n      <tr>\n          <td>Yes, once it’s mature (for example after 2.1)</td>\n          <td>72</td>\n          <td>35.47</td>\n      </tr>\n      <tr>\n          <td>I am already using Airflow 2.0+</td>\n          <td>39</td>\n          <td>19.21</td>\n      </tr>\n      <tr>\n          <td>I don&rsquo;t know yet</td>\n          <td>8</td>\n          <td>3.94</td>\n      </tr>\n      <tr>\n          <td>No, I do not plan to migrate</td>\n          <td>3</td>\n          <td>1.48</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>What are the features of Airflow 2.0 you are most excited about? (multiple choice)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>General performance improvements</td>\n          <td>133</td>\n          <td>65.52</td>\n      </tr>\n      <tr>\n          <td>Refreshed WebUI</td>\n          <td>102</td>\n          <td>50.25</td>\n      </tr>\n      <tr>\n          <td>Scheduler HA</td>\n          <td>99</td>\n          <td>48.77</td>\n      </tr>\n      <tr>\n          <td>Official docker image</td>\n          <td>84</td>\n          <td>41.38</td>\n      </tr>\n      <tr>\n          <td>@task decorator</td>\n          <td>56</td>\n          <td>27.59</td>\n      </tr>\n      <tr>\n          <td>Official helm chart</td>\n          <td>51</td>\n          <td>25.12</td>\n      </tr>\n      <tr>\n          <td>Providers packages</td>\n          <td>41</td>\n          <td>20.2</td>\n      </tr>\n      <tr>\n          <td>Configurable XCom backends</td>\n          <td>33</td>\n          <td>16.26</td>\n      </tr>\n      <tr>\n          <td>CeleryKubernetesExecutor</td>\n          <td>31</td>\n          <td>15.27</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>12</td>\n          <td>5.91</td>\n      </tr>\n  </tbody>\n</table>\n<h2 id=\"summary\">Summary</h2>\n<p>From an open-source point of view, it is good to see that many people would love to contribute to Apache Airflow.\nThis means that there are resources that if unleashed may make our community even stronger. From a product perspective, it is important to know that users are usually using the latest versions of our software and\nare willing to upgrade to new ones.</p>\n<p>Finally, there are still some things to improve - documentation, onboarding guides and plug-and-play airflow\ndeployments. However, we hope that with the increase of adoption there will be an increase in people willing\nto share their experience and tools.</p>\n<h2 id=\"data\">Data</h2>\n<p>If you think I missed something or you simply want to look for insights on your own, the data is available for you here: (Airflow User Survey 2020.csv)[/data/survey-responses/airflow-user-survey-responses-2020.csv.zip]</p>"
---

Apache Airflow Survey 2020
World of data processing tools is growing steadily. Apache Airflow seems to be already considered as
crucial component of this complex ecosystem. We observe steady growth in number of users as well as in
an amount of active contributors. So listening and understanding our community is of high importance.
It’s worth to note that the 2020 survey was still mostly about 1.10.X version of Apache Airflow and
possibly many drawbacks were addressed in the 2.0 version that was released in December 2020. But if this
is true, we will learn next year!
Overview of the user

What best describes your current occupation? (single choice)

          No.
          %
      
Data Engineer
          115
          56.65
      
Developer
          28
          13.79
      
DevOps
          17
          8.37
      
Solutions Architect
          14
          6.9
      
Data Scientist
          12
          5.91
      
Other
          10
          4.93
      
Data Analyst
          4
          1.97
      
Support Engineer
          3
          1.48
      
Those results are not a surprise as Airflow is a tool dedicated to data-related tasks. The majority of
our users are data engineers, scientists or analysts. The 2020 results are similar to those from 2019 with
visible slight increase in ML use cases.
Additionally, 79% of users uses Airflow on daily basis and 16% interacts with it at least once a week.
How many people work in your company? (single choice)

          No.
          %
      
200+
          107
          52.71
      
51-200
          44
          21.67
      
11-50
          37
          18.23
      
1-10
          15
          7.39
      
How many people in your company use Airflow? (single choice)

          No.
          %
      
1-5
          84
          41.38
      
6-20
          75
          36.95
      
21-50
          23
          11.33
      
50+
          21
          10.34
      
Airflow is a software that is used and trusted by big companies. We can also see that Airflow can work
fine for teams of different sizes. However, in some cases users may use multiple Airflow instances.
Are you considering moving to other workflow engines? (single choice)

          No.
          %
      
No, we are happy with Airflow
          174
          85.71
      
Yes
          29
          14.29
      
Nearly 1 out of 7 users is considering migrating to other workflow engines. Their decision is usually
justified by need of easier workflow writing experience (12.32%), better UI/UX and faster scheduler
(8.37% both).
While the first point may be addressed by TaskFlow API in Airflow 2.0 the other two are definitely addressed
in the new major version. And the early feedback from 2.0 users seems to be confirming it.
The alternative engines considered by users are mainly Prefect and Argo. Some participants also mentioned
Luigi, Kubeflow or custom solutions.
Are you or your team actively participating in Airflow development - contributing? (single choice)

          No.
          %
      
I wish we could
          99
          48.77
      
No
          59
          29.06
      
Yes
          45
          22.17
      
This is really heart-warming result. It means that 1 out of 5 users contributes actively to our project!
But it would be good to learn if there’s something else than time that is stopping people who wish to contribute
from doing it. If there are some other obstacles we definitely would like to learn about them so we can improve.
That said - if you know something we can improve please reach out via Slack, dev list or Github
discussions.
How likely are you to recommend Apache Airflow? (single choice)

          No.
          2020 %
          2019 %
      
Very Likely
          125
          61.58
          45.45%
      
Likely
          62
          30.54
          40.26%
      
Neutral
          11
          5.42
          10.71%
      
Unlikely
          3
          1.48
          2.60%
      
Very unlikely
          2
          0.99
          0.97%
      
Here is good news! It seems that people are more willing to recommend Apache Airflow than year before.
What is your source of information about Airflow? (multiple choice)

          No.
          %
      
Documentation
          154
          75.86
      
Airflow website
          139
          68.47
      
Slack
          128
          63.05
      
Github
          127
          62.56
      
Stack Overflow
          72
          35.47
      
Airflow Summit Videos
          44
          21.67
      
The dev mailing list
          33
          16.26
      
Awesome Apache Airflow repository
          21
          10.34
      
Other
          15
          7.39
      
Here we see that Airflow documentation is the crucial source of information. What’s interesting is that more
than 60% of users are getting information from Github and Slack channels.

Airflow uses cases
Do you have any customisation of Airflow? (single choice)

          No.
          %
      
No, we use vanilla Airflow
          154
          75.86
      
Yes, we have small patches (no fork)
          34
          16.75
      
Yes, we have separate fork
          15
          7.39
      
When onboarding new members to airflow, what is the biggest problem? (multiple choice)

          No.
          %
      
No guide on best practises on developing DAGs
          102
          50.25
      
There is no easy option to launch Airflow
          64
          31.53
      
Small number of tutorials on different aspects of using Airflow
          57
          28.08
      
Documentation is not clear enough
          53
          26.11
      
There is no easy option to deploy DAGs to an Airflow instance
          52
          25.62
      
No problems
          34
          16.75
      
Small number of blogs regarding Airflow
          30
          14.78
      
Which interface(s) of Airflow do you use as part of your current role? (multiple choice)

          No.
          %
      
Original Airflow Graphical User Interface
          199
          98.03
      
CLI
          88
          43.35
      
API
          48
          23.65
      
Custom (own created) Airflow Graphical User Interface
          12
          5.91
      
Other
          3
          1.48
      
Do you combine multiple DAGs? (multiple choice)

          No.
          %
      
Yes, by triggering another DAG
          87
          42.86
      
No, I don’t combine multiple DAGs
          79
          38.92
      
Yes, through SubDAG
          40
          19.7
      
Other
          18
          8.87
      
How do you integrate with external services? (multiple choice)

          No.
          %
      
Using existing dedicated operators / hooks
          147
          72.41
      
Using Bash / Python operator
          140
          68.97
      
Using own custom operators / hooks
          138
          67.98
      
Other
          12
          5.91
      
What external services do you use in your Airflow DAGs? (multiple choice)

          No.
          %
      
Amazon Web Services
          121
          59.61
      
Internal company systems
          113
          55.67
      
Google Cloud Platform / Google APIs
          97
          47.78
      
Hadoop / Spark / Flink / Other Apache software
          72
          35.47
      
Microsoft Azure
          21
          10.34
      
Other
          19
          9.36
      
I do not use external services in my Airflow DAGs
          5
          2.46
      

Do you use Airflow Plugins? If yes, what do you use them for? (multiple choice)

          No.
          %
      
Adding new operators/sensors and hooks
          119
          58.62
      
I don’t use Airflow plugins
          69
          33.99
      
Adding AppBuilder views & menu items
          27
          13.3
      
Adding new executors
          17
          8.37
      
Adding OperatorExtraLinks
          13
          6.4
      
| Other
Do you use Airflow’s data lineage feature? (single choice)

          No.
          %
      
No, I will use such feature if fully supported in Airflow
          105
          51.72
      
No, data lineage isn’t a concern for my usage.
          68
          33.5
      
Yes, I use another data lineage product
          24
          11.82
      
Yes, I use custom implementation
          5
          2.46
      
Yes, I use Airflow’s experimental data lineage feature
          1
          0.49
      
When asked what lineage product users use, the answers were varying from custom tools
to known product like Amundsen, Atlas or dbt.
Deployment
How many active DAGs do you have in your largest Airflow instance? (open question)
Number of DAGs
          No.
          %
      
< 20
          64
          32
      
21-40
          33
          16
      
41-60
          13
          6
      
61-100
          32
          16
      
101-200
          31
          15
      
201-300
          8
          4
      
301-999
          12
          6
      
1000+
          10
          5
      
What is the maximum number of tasks that you have used in one DAG? (open question)
Number of DAGs
          No.
          %
      
< 10
          42
          21
      
11-20
          31
          15
      
21-30
          15
          7
      
31-40
          11
          5
      
41-50
          22
          11
      
51-100
          39
          19
      
101-200
          16
          8
      
201-500
          16
          8
      
501+
          11
          5
      
Which version of Airflow do you use currently? (single choice)

          No.
          %
      
1.10.14
          55
          27.09
      
2.0.0+
          45
          22.17
      
1.10.12
          27
          13.3
      
1.10.10
          26
          12.81
      
1.10.11
          14
          6.9
      
1.10.5 or older
          10
          4.93
      
1.10.9
          8
          3.94
      
1.10.13
          7
          3.45
      
1.10.6
          4
          1.97
      
1.10.7
          4
          1.97
      
1.10.8
          3
          1.48
      
This was probably one of the most important questions in the survey. While it’s good to see
that more than 60% of users use one of three latest Airflow versions, it’s worrying that the rest
are using versions that are old or have known security vulnerabilities.
Additionally, more than 20% of users are already using 2.0.0+ versions which is reasonably good information.
What meta-database do you use? (single choice)

          No.
          %
      
Postgres 12
          36
          17.73
      
Postgres 9.6
          33
          16.26
      
Postgres 11
          31
          15.27
      
MySQL 5.7
          27
          13.3
      
MySQL 8.0
          20
          9.85
      
Postgres 10
          20
          9.85
      
Other
          19
          9.36
      
Postgres 13
          18
          8.87
      
This means that more about 69% of users decide to use Postgres as their meta-database.
MySQL is the choice of nearly 24% users. The other responses included some MySQL versions
like MariaDB or cloud hosted database like Cloud SQL (used by Google Composer) or AWS Aurora.
It’s good to know that users rather avoid using SQLite in production deployments!
What executor type do you use? (single choice)


          No.
          2020
          2019
      
Celery
          100
          49.26%
          44.81%
      
Kubernetes
          48
          23.65%
          16.88%
      
Local
          40
          19.7%
          27.60%
      
Sequential
          10
          4.93%
          7.14%
      
Other
          5
          2.46%
          3.57
      
In comparison to previous year it seems that more users use currently Celery and
Kubernetes executors and LocalExecutor usage dropped by nearly 8 points. This may
suggest that users’ deployments are growing, and they need more scalable solutions.
Among CeleryExecutor users 78% use Redis as a broker, 19% use RabbitMQ and the rest
is using other brokers or is not sure what is used in their deployments.
What metrics do you use to monitor Airflow? (multiple choice)

          No.
          %
      
I do not use monitoring
          65
          32.02
      
External monitoring service
          60
          29.56
      
Information from metadatabase
          51
          25.12
      
Statsd
          49
          24.14
      
Other
          31
          15.27
      
The other responses included mostly information about tools used by users
including DataDog and Prometheus exporter.
How do you deploy Airflow? (single choice)

          No.
          %
      
On virtual machines (for example using AWS EC2)
          64
          31.53
      
Using a managed service like Astronomer, Google Composer or AWS MWAA
          35
          17.24
      
On Kubernetes (using custom deployments)
          29
          14.29
      
On premises
          28
          13.79
      
On Kubernetes (using another helm chart)
          20
          9.85
      
On Kubernetes (using Apache Airflow’s helm chart)
          17
          8.37
      
Other
          12
          5.91
      
Nearly 33% of users deploys Airflow using some kind of Kubernetes deployment. This is about
10 percent more than in 2019. There’s slightly increase in usage of Airflow via
managed services (14.61% in 2019).
Do you use containerisation for deployment? (single choice)

          No.
          %
      
Yes, using helm chart / kubernetes
          58
          28.57
      
No, I don’t use containerisation
          57
          28.08
      
Yes, single docker image
          49
          24.14
      
Yes, using docker compose
          39
          19.21
      
Among users who do not use Kubernetes based deployments 58% of them use containerisation. About
42% of those users use docker-compose for deployments.
How do you distribute your DAGs? (single choice)

          No.
          %
      
Using a synchronizing process (Git sync, GCS fuse, etc)
          79
          38.92
      
Bake them into the docker image
          56
          27.59
      
Shared files system
          34
          16.75
      
Other
          20
          9.85
      
I don’t know
          14
          6.9
      
The most popular way of distributing DAGs seems to be using a synchronizing process. About
40% of users use this process together with Kubernetes deployments.
Future of Airflow
In your opinion, what could be improved in Airflow? (multiple choice)

          No.
          %
      
Web UI
          100
          49.26
      
Examples, how-to, onboarding documentation
          90
          44.33
      
Logging, monitoring and alerting
          90
          44.33
      
Technical documentation
          90
          44.33
      
Scheduler performance
          83
          40.89
      
DAG authoring
          64
          31.53
      
Authentication and authorization
          58
          28.57
      
REST API
          51
          25.12
      
Other
          44
          21.67
      
Reliability
          41
          20.2
      
External integration e.g. AWS, GCP, Apache products
          36
          17.73
      
Security
          28
          13.79
      
CLI
          20
          9.85
      
Everything work fine for me
          14
          6.9
      
I don’t know
          4
          1.97
      
Which features would most interest you? (multiple choice)

          No.
          %
      
DAG versioning
          109
          53.69
      
Builtin statistics
          71
          34.98
      
Improved data lineage
          65
          32.02
      
Scheduling at the start of the interval
          63
          31.03
      
Stateless workers
          59
          29.06
      
More option to configure schedules (time units, increments)
          57
          28.08
      
Multi-tenant deployment
          49
          24.14
      
DAG fetcher (AIP-5)
          39
          19.21
      
Generic transfer operator
          34
          16.75
      
Other
          33
          16.26
      
I have everything I need
          11
          5.42
      
Nothing
          11
          5.42
      
Will you consider migrating to Airflow 2.0? (single choice)

          No.
          %
      
Yes, as soon as possible
          81
          39.9
      
Yes, once it’s mature (for example after 2.1)
          72
          35.47
      
I am already using Airflow 2.0+
          39
          19.21
      
I don’t know yet
          8
          3.94
      
No, I do not plan to migrate
          3
          1.48
      
What are the features of Airflow 2.0 you are most excited about? (multiple choice)

          No.
          %
      
General performance improvements
          133
          65.52
      
Refreshed WebUI
          102
          50.25
      
Scheduler HA
          99
          48.77
      
Official docker image
          84
          41.38
      
@task decorator
          56
          27.59
      
Official helm chart
          51
          25.12
      
Providers packages
          41
          20.2
      
Configurable XCom backends
          33
          16.26
      
CeleryKubernetesExecutor
          31
          15.27
      
Other
          12
          5.91
      
Summary
From an open-source point of view, it is good to see that many people would love to contribute to Apache Airflow.
This means that there are resources that if unleashed may make our community even stronger. From a product perspective, it is important to know that users are usually using the latest versions of our software and
are willing to upgrade to new ones.
Finally, there are still some things to improve - documentation, onboarding guides and plug-and-play airflow
deployments. However, we hope that with the increase of adoption there will be an increase in people willing
to share their experience and tools.
Data
If you think I missed something or you simply want to look for insights on your own, the data is available for you here: (Airflow User Survey 2020.csv)[/data/survey-responses/airflow-user-survey-responses-2020.csv.zip]
