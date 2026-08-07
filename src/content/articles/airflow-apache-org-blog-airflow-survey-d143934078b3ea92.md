---
title: "Airflow Survey 2019"
link: "https://airflow.apache.org/blog/airflow-survey/"
guid: "https://airflow.apache.org/blog/airflow-survey/"
pubDate: "2019-12-11T00:00:00.000Z"
site_name: "Apache Airflow"
site_feed: "https://airflow.apache.org/blog/index.xml"
category: "Data"
summary: "Apache Airflow Survey 2019\nApache Airflow is growing faster than ever.\nThus, receiving and adjusting to our users’ feedback is a must. We created\nsurvey and we got 308 responses.\nLet’s see who Airflow users are, how they play with it, and what they miss.\nOverview of the user\nWhat best describes your current occupation?\n\n          No.\n          %\n      \nData Engineer\n          194\n          62.99%\n      \nDeveloper\n          34\n          11.04%\n      \nArchitect\n          23\n          7.47%\n      \nData Scientist\n          19\n          6.17%\n      \nData Analyst\n          13\n          4.22%\n      \nDevOps\n          13\n          4.22%\n      \nIT Administrator\n          2\n          0.65%\n      \nMachine Learning Engineer\n          2\n          0.65%\n      \nManager\n          2\n          0.65%\n      \nOperations\n          2\n          0.65%\n      \nChief Data Officer\n          1\n          0.32%\n      \nEngineering Manager\n          1\n          0.32%\n      \nIntern\n          1\n          0.32%\n      \nProduct owner\n          1\n          0.32%\n      \nQuant\n          1\n          0.32%\n      \nIn your day to day job, what do you use Airflow for?\n\n          No.\n          %\n      \nData processing (ETL)\n          298\n          96.75%\n      \nArtificial Intelligence and Machine Learning Pipelines\n          90\n          29.22%\n      \nAutomating DevOps operations\n          64\n          20.78%\n      \nAccording to the survey, most of the Airflow users are the “data” people. Moreover,\n28.57% uses Airflow to both ETL and ML pipelines meaning that those two fields\nare somehow connected. Only five respondents use Airflow for DevOps operations only,\nThat means that other 59 people who use Airflow for DevOps stuff use it also for\nETL / ML  purposes.\nHow many active DAGs do you have in your largest Airflow instance?\n\n          No.\n          %\n      \n0-20\n          115\n          37.34%\n      \n21-40\n          65\n          21.10%\n      \n41-60\n          44\n          14.29%\n      \n61-100\n          28\n          9.09%\n      \n101-200\n          28\n          9.09%\n      \n201-300\n          7\n          2.27%\n      \n301-999\n          8\n          2.60%\n      \n1000+\n          13\n          4.22%\n      \nThe majority of users do not exceed 100 active DAGs per Airflow instance. However,\nas we can see there are users who exceed thousands of DAGs with a maximum number 5000.\nWhat is the maximum number of tasks that you have used in one DAG?\n\n          No.\n          %\n      \n0-10\n          61\n          19.81%\n      \n11-20\n          60\n          19.48%\n      \n21-30\n          31\n          10.06%\n      \n31-40\n          21\n          6.82%\n      \n41-50\n          26\n          8.44%\n      \n51-100\n          36\n          11.69%\n      \n101-200\n          28\n          9.09%\n      \n201-500\n          21\n          6.82%\n      \n501+\n          24\n          11.54%\n      \nThe given maximum number of tasks in a single DAG was 10 000 (!). The number of tasks\ndepends on the purposes of a DAG, so it’s rather hard to say if users have “simple”\nor “complicated” workflows.\nWhen onboarding new members to Airflow, what is the biggest problem?\n\n          No.\n          %\n      \nNo guide on best practises on developing DAGs\n          160\n          51.95%\n      \nSmall number of tutorials on different aspects of using Airflow\n          57\n          18.51%\n      \nDocumentation is not clear enough\n          42\n          13.64%\n      \nSmall number of blogs regarding Airflow\n          6\n          1.95%\n      \nOther\n          43\n          13.96%\n      \nThis is an important result. Using Airflow is all about writing and scheduling DAGs.\nNo guide or any other complete resource on best practices for developing Dags is a big\nproblem. Diving deep in the “other” answers, we can find that:\nAirflow’s “magic” (scheduler, executors, schedule times) is hard to understand\nDAG testing is not easy to do and to explain\nAirflow UI needs some love.\nHow likely are you to recommend Apache Airflow?\n\n          No.\n          %\n      \nVery Likely\n          140\n          45.45%\n      \nLikely\n          124\n          40.26%\n      \nNeutral\n          33\n          10.71%\n      \nUnlikely\n          8\n          2.60%\n      \nVery unlikely\n          3\n          0.97%\n      \nThis means that more than 85% of people who use Airflow like it. It seems Airflow does\nits job nicely. However, we have to remember that this survey is likely biased - it’s\nmore likely that you respond to the survey if you like the tool you use. Should we\nfocus then on those 11 people who did not like Airflow? It’s a good question.\nAirflow usage\nWhich interface(s) of Airflow do you use as part of your current role?\n\n          No.\n          %\n      \nOriginal Airflow Graphical User Interface\n          297\n          96.43%\n      \nCLI\n          126\n          40.91%\n      \nOriginal Airflow Graphical User Interface, CLI\n          117\n          37.99%\n      \nAPI\n          60\n          19.48%\n      \nOriginal Airflow Graphical User Interface, CLI, API\n          32\n          10.39%\n      \nCustom (own created) Airflow Graphical User Interface\n          25\n          8.12%\n      \nIt’s visible that usage of CLI goes in pair with using Airflow web UI. Our\nsurvey included some UX related questions to allow us to understand how users\nuse Airflow webserver.\nWhat do you use the Graphical User Interface for?\n\nWhat do you use CLI for?\n\nIn Airflow, which UI view(s) are important for you?\n\nHere we see that the majority uses Web UI mostly for monitoring purposes:\nMonitoring DAGs\nAccessing logs\nAn interesting result is that many people seem not to use backfilling as\nthere’s no other way than to do it by CLI.\nWhat executor type do you use?\n\n          No.\n          %\n      \nCelery\n          138\n          44.81%\n      \nLocal\n          85\n          27.60%\n      \nKubernetes\n          52\n          16.88%\n      \nSequential\n          22\n          7.14%\n      \nOther\n          11\n          3.57\n      \nThe other option mostly consisted of information that someone uses a few types or is\nmigrating from one executor to another. What can be observed is an increase in usage\nof Local and Kubernetes executors when compared to results from an earlier survey done\nby Ash.\nDo you use Kubernetes-based deployments for Airflow?\n\n          No.\n          %\n      \nNo - we do not plan to use Kubernetes near term\n          88\n          28.57%\n      \nYes - setup on our own via Helm Chart or similar\n          65\n          21.10%\n      \nNot yet - but we use Kubernetes in our organization and we could move\n          61\n          19.81%\n      \nYes - via managed service in the cloud (Composer / Astronomer etc.)\n          45\n          14.61%\n      \nNot yet - but we plan to deploy Kubernetes in our organization soon\n          42\n          13.64%\n      \nOther\n          7\n          2.27%\n      \nThe most interesting thing is that there’s nearly 30% of users who do not use Kubernetes,\nand they are not going to move. This means we should keep other deployment options in\nmind when working on Airflow 2.0. On the other hand, almost 70% of the users already\nuse Kubernetes, or it’s a viable option for them.\nDo you combine multiple DAGs?\n\n          No.\n          %\n      \nNo, I don’t combine multiple DAGs\n          127\n          41.23%\n      \nYes, through SubDAG\n          73\n          23.70%\n      \nYes, by triggering another DAG\n          72\n          23.38%\n      \nOther\n          36\n          11.69%\n      \nIn the other category, 9 people explicitly mentioned using ExternalTaskSensor,\nand I think it could be treated as running subDAGs by triggering other DAGs.\nDo you use Airflow Plugins? If yes, what do you use it for?\n\n          No.\n          %\n      \nAdding new operators/sensors and hooks\n          187\n          60.71%\n      \nI don’t use Airflow plugins\n          109\n          35.39%\n      \nAdding AppBuilder views & menu items\n          31\n          10.06%\n      \nAdding new executor\n          18\n          5.84%\n      \nAdding OperatorExtraLinks\n          7\n          2.27%\n      \nThe high percentage - 60%  for “Adding new operators/sensors and hooks” is quite a\nsurprising result for some of us - especially that you do not actually need to use the\nplugin mechanism to add any of those. Those are standard python objects, and you can\nsimply drop your hooks/operators/sensors code to PYTHONPATH environment variable and\nthey will work. It seems that this may be a result of a lack of best practices guide.\nPlugins are more useful for adding views and menu items - yet only 10%.\nOperatorExtraLinks are even more useful (though relatively new) feature, so it’s not\nentirely surprising they are hardly used.\nIt was also kind of surprising that someone at all uses plugins to use their own\nexecutors. We considered removing that option recently - but now we have to rethink\nour approach.\nWhat metrics do you use to monitor Airflow?\nThere were a lot of different responses. Some use Prometheus and other services,\nothers do not use any monitoring. One of the interesting responses linked to this\nsolution for airflow_operators_metrics.\nExternal services\nWhat external services do you use in your Airflow DAGs?\n\n          No.\n          %\n      \nAmazon Web Services\n          160\n          51.95%\n      \nInternal company systems\n          150\n          48.7%\n      \nHadoop / Spark / Flink / Other Apache software\n          119\n          38.64%\n      \nGoogle Cloud Platform / Google APIs\n          112\n          36.36%\n      \nMicrosoft Azure\n          28\n          9.09%\n      \nI do not use external services in my Airflow DAGs\n          18\n          5.84%\n      \nIt’s not surprising that Amazon Web Services is leading the way as they are considered the most mature\ncloud provider. Internal system and other Apache products on the next two positions are\nquite understandable if we take into account that the majority uses Airflow for ETL processes.\nWhat external services do you use in your Airflow DAGs? (Mixed providers)\n\n          No.\n          %\n      \nGoogle Cloud Platform / Google APIs, Amazon Web Services\n          44\n          14.29%\n      \nAmazon Web Services, Microsoft Azure\n          5\n          1.62%\n      \nGoogle Cloud Platform / Google APIs, Microsoft Azure\n          4\n          1.3%\n      \nThis result is not surprising because companies usually prefer to stick with one cloud\nprovider.\nHow do you integrate with external services?\n\n          No.\n          %\n      \nUsing Bash / Python operator\n          220\n          71.43%\n      \nUsing existing, dedicated operators / hooks\n          217\n          70.45%\n      \nUsing own, custom operators / hooks\n          216\n          70.13%\n      \nWe had some anecdotal evidence that people use more Python/Bash operators than the\ndedicated ones - but it looks like all ways of using Airflow to connect to external\nservices are equally popular.\nWhat can be improved\nIn your opinion, what could be improved in Airflow?\n\n          No.\n          %\n      \nScheduler performance\n          189\n          61.36%\n      \nWeb UI\n          180\n          58.44%\n      \nLogging, monitoring and alerting\n          145\n          47.08%\n      \nExamples, how-to, onboarding documentation\n          143\n          46.43%\n      \nTechnical documentation\n          137\n          44.48%\n      \nReliability\n          112\n          36.36%\n      \nREST API\n          96\n          31.17%\n      \nAuthentication and authorization\n          89\n          28.9%\n      \nExternal integration e.g. AWS, GCP, Apache product\n          49\n          15.91%\n      \nCLI\n          41\n          13.31%\n      \nI don’t know\n          5\n          1.62%\n      \nThe results are rather quite self-explaining. Improved performance of Airflow, better\nUI, and more telemetry are desirable. But this should go in pair with improved\ndocumentation and resources about using the Airflow, especially when we\ntake into account the problem of onboarding new users.\nAnother interesting point from that question is that only 16% think that operators\nshould be extended and improved. This suggests that we should focus on improving\nAirflow core instead of adding more and more integrations.\nWhat would be the most interesting feature for you?\n\n          No.\n          %\n      \nProduction-ready Airflow docker image\n          175\n          56.82%\n      \nDeclarative way of writing DAGs / automated DAGs generation\n          155\n          50.32%\n      \nHorizontal Autoscaling\n          122\n          39.61%\n      \nAsynchronous Operators\n          97\n          31.49%\n      \nStateless web server\n          81\n          26.3%\n      \nKnative Executor\n          48\n          15.58%\n      \nI already have all I need\n          13\n          4.22%\n      \nProduction Docker image wins, and it’s not a surprise. We all know that deploying\nAirflow is not a plug and play process, and that’s why the official image is being\nworked on by Jarek Potiuk. An unexpected result is that half of the users would like to\nhave a declarative way of creating DAGs. That seems to be something that is “against Airflow”\nas we always emphasize the possibility of writing workflows in pure python. Stories\nabout DAG generators are not new and confirm that there’s a need for a way to\ndeclare DAGs."
author: "Apache Airflow"
contentHtml: "<h1 id=\"apache-airflow-survey-2019\">Apache Airflow Survey 2019</h1>\n<p>Apache Airflow is <a href=\"https://www.astronomer.io/blog/why-airflow/\">growing faster than ever</a>.\nThus, receiving and adjusting to our users’ feedback is a must. We created\n<a href=\"https://forms.gle/XAzR1pQBZiftvPQM7\">survey</a> and we got <strong>308</strong> responses.\nLet’s see who Airflow users are, how they play with it, and what they miss.</p>\n<h1 id=\"overview-of-the-user\">Overview of the user</h1>\n<p><strong>What best describes your current occupation?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Data Engineer</td>\n          <td>194</td>\n          <td>62.99%</td>\n      </tr>\n      <tr>\n          <td>Developer</td>\n          <td>34</td>\n          <td>11.04%</td>\n      </tr>\n      <tr>\n          <td>Architect</td>\n          <td>23</td>\n          <td>7.47%</td>\n      </tr>\n      <tr>\n          <td>Data Scientist</td>\n          <td>19</td>\n          <td>6.17%</td>\n      </tr>\n      <tr>\n          <td>Data Analyst</td>\n          <td>13</td>\n          <td>4.22%</td>\n      </tr>\n      <tr>\n          <td>DevOps</td>\n          <td>13</td>\n          <td>4.22%</td>\n      </tr>\n      <tr>\n          <td>IT Administrator</td>\n          <td>2</td>\n          <td>0.65%</td>\n      </tr>\n      <tr>\n          <td>Machine Learning Engineer</td>\n          <td>2</td>\n          <td>0.65%</td>\n      </tr>\n      <tr>\n          <td>Manager</td>\n          <td>2</td>\n          <td>0.65%</td>\n      </tr>\n      <tr>\n          <td>Operations</td>\n          <td>2</td>\n          <td>0.65%</td>\n      </tr>\n      <tr>\n          <td>Chief Data Officer</td>\n          <td>1</td>\n          <td>0.32%</td>\n      </tr>\n      <tr>\n          <td>Engineering Manager</td>\n          <td>1</td>\n          <td>0.32%</td>\n      </tr>\n      <tr>\n          <td>Intern</td>\n          <td>1</td>\n          <td>0.32%</td>\n      </tr>\n      <tr>\n          <td>Product owner</td>\n          <td>1</td>\n          <td>0.32%</td>\n      </tr>\n      <tr>\n          <td>Quant</td>\n          <td>1</td>\n          <td>0.32%</td>\n      </tr>\n  </tbody>\n</table>\n<p><strong>In your day to day job, what do you use Airflow for?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Data processing (ETL)</td>\n          <td>298</td>\n          <td>96.75%</td>\n      </tr>\n      <tr>\n          <td>Artificial Intelligence and Machine Learning Pipelines</td>\n          <td>90</td>\n          <td>29.22%</td>\n      </tr>\n      <tr>\n          <td>Automating DevOps operations</td>\n          <td>64</td>\n          <td>20.78%</td>\n      </tr>\n  </tbody>\n</table>\n<p>According to the survey, most of the Airflow users are the “data” people. Moreover,\n28.57% uses Airflow to both ETL and ML pipelines meaning that those two fields\nare somehow connected. Only five respondents use Airflow for DevOps operations only,\nThat means that other 59 people who use Airflow for DevOps stuff use it also for\nETL / ML  purposes.</p>\n<p><strong>How many active DAGs do you have in your largest Airflow instance?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>0-20</td>\n          <td>115</td>\n          <td>37.34%</td>\n      </tr>\n      <tr>\n          <td>21-40</td>\n          <td>65</td>\n          <td>21.10%</td>\n      </tr>\n      <tr>\n          <td>41-60</td>\n          <td>44</td>\n          <td>14.29%</td>\n      </tr>\n      <tr>\n          <td>61-100</td>\n          <td>28</td>\n          <td>9.09%</td>\n      </tr>\n      <tr>\n          <td>101-200</td>\n          <td>28</td>\n          <td>9.09%</td>\n      </tr>\n      <tr>\n          <td>201-300</td>\n          <td>7</td>\n          <td>2.27%</td>\n      </tr>\n      <tr>\n          <td>301-999</td>\n          <td>8</td>\n          <td>2.60%</td>\n      </tr>\n      <tr>\n          <td>1000+</td>\n          <td>13</td>\n          <td>4.22%</td>\n      </tr>\n  </tbody>\n</table>\n<p>The majority of users do not exceed 100 active DAGs per Airflow instance. However,\nas we can see there are users who exceed thousands of DAGs with a maximum number 5000.</p>\n<p><strong>What is the maximum number of tasks that you have used in one DAG?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>0-10</td>\n          <td>61</td>\n          <td>19.81%</td>\n      </tr>\n      <tr>\n          <td>11-20</td>\n          <td>60</td>\n          <td>19.48%</td>\n      </tr>\n      <tr>\n          <td>21-30</td>\n          <td>31</td>\n          <td>10.06%</td>\n      </tr>\n      <tr>\n          <td>31-40</td>\n          <td>21</td>\n          <td>6.82%</td>\n      </tr>\n      <tr>\n          <td>41-50</td>\n          <td>26</td>\n          <td>8.44%</td>\n      </tr>\n      <tr>\n          <td>51-100</td>\n          <td>36</td>\n          <td>11.69%</td>\n      </tr>\n      <tr>\n          <td>101-200</td>\n          <td>28</td>\n          <td>9.09%</td>\n      </tr>\n      <tr>\n          <td>201-500</td>\n          <td>21</td>\n          <td>6.82%</td>\n      </tr>\n      <tr>\n          <td>501+</td>\n          <td>24</td>\n          <td>11.54%</td>\n      </tr>\n  </tbody>\n</table>\n<p>The given maximum number of tasks in a single DAG was 10 000 (!). The number of tasks\ndepends on the purposes of a DAG, so it’s rather hard to say if users have “simple”\nor “complicated” workflows.</p>\n<p><strong>When onboarding new members to Airflow, what is the biggest problem?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>No guide on best practises on developing DAGs</td>\n          <td>160</td>\n          <td>51.95%</td>\n      </tr>\n      <tr>\n          <td>Small number of tutorials on different aspects of using Airflow</td>\n          <td>57</td>\n          <td>18.51%</td>\n      </tr>\n      <tr>\n          <td>Documentation is not clear enough</td>\n          <td>42</td>\n          <td>13.64%</td>\n      </tr>\n      <tr>\n          <td>Small number of blogs regarding Airflow</td>\n          <td>6</td>\n          <td>1.95%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>43</td>\n          <td>13.96%</td>\n      </tr>\n  </tbody>\n</table>\n<p>This is an important result. Using Airflow is all about writing and scheduling DAGs.\nNo guide or any other complete resource on best practices for developing Dags is a big\nproblem. Diving deep in the “other” answers, we can find that:</p>\n<ul>\n<li>Airflow’s “magic” (scheduler, executors, schedule times) is hard to understand</li>\n<li>DAG testing is not easy to do and to explain</li>\n<li>Airflow UI needs some love.</li>\n</ul>\n<p><strong>How likely are you to recommend Apache Airflow?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Very Likely</td>\n          <td>140</td>\n          <td>45.45%</td>\n      </tr>\n      <tr>\n          <td>Likely</td>\n          <td>124</td>\n          <td>40.26%</td>\n      </tr>\n      <tr>\n          <td>Neutral</td>\n          <td>33</td>\n          <td>10.71%</td>\n      </tr>\n      <tr>\n          <td>Unlikely</td>\n          <td>8</td>\n          <td>2.60%</td>\n      </tr>\n      <tr>\n          <td>Very unlikely</td>\n          <td>3</td>\n          <td>0.97%</td>\n      </tr>\n  </tbody>\n</table>\n<p>This means that more than 85% of people who use Airflow like it. It seems Airflow does\nits job nicely. However, we have to remember that this survey is likely biased - it’s\nmore likely that you respond to the survey if you like the tool you use. Should we\nfocus then on those 11 people who did not like Airflow? It’s a good question.</p>\n<h2 id=\"airflow-usage\">Airflow usage</h2>\n<p><strong>Which interface(s) of Airflow do you use as part of your current role?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Original Airflow Graphical User Interface</td>\n          <td>297</td>\n          <td>96.43%</td>\n      </tr>\n      <tr>\n          <td>CLI</td>\n          <td>126</td>\n          <td>40.91%</td>\n      </tr>\n      <tr>\n          <td>Original Airflow Graphical User Interface, CLI</td>\n          <td>117</td>\n          <td>37.99%</td>\n      </tr>\n      <tr>\n          <td>API</td>\n          <td>60</td>\n          <td>19.48%</td>\n      </tr>\n      <tr>\n          <td>Original Airflow Graphical User Interface, CLI, API</td>\n          <td>32</td>\n          <td>10.39%</td>\n      </tr>\n      <tr>\n          <td>Custom (own created) Airflow Graphical User Interface</td>\n          <td>25</td>\n          <td>8.12%</td>\n      </tr>\n  </tbody>\n</table>\n<p>It’s visible that usage of CLI goes in pair with using Airflow web UI. Our\nsurvey included some UX related questions to allow us to understand how users\nuse Airflow webserver.</p>\n<p><strong>What do you use the Graphical User Interface for?</strong></p>\n<p><img src=\"/blog/airflow-survey/plot1.png\" alt=\"\"></p>\n<p><strong>What do you use CLI for?</strong></p>\n<p><img src=\"/blog/airflow-survey/plot2.png\" alt=\"\"></p>\n<p><strong>In Airflow, which UI view(s) are important for you?</strong></p>\n<p><img src=\"/blog/airflow-survey/plot3.png\" alt=\"\"></p>\n<p>Here we see that the majority uses Web UI mostly for monitoring purposes:</p>\n<ul>\n<li>Monitoring DAGs</li>\n<li>Accessing logs</li>\n</ul>\n<p>An interesting result is that many people seem not to use backfilling as\nthere’s no other way than to do it by CLI.</p>\n<p><strong>What executor type do you use?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Celery</td>\n          <td>138</td>\n          <td>44.81%</td>\n      </tr>\n      <tr>\n          <td>Local</td>\n          <td>85</td>\n          <td>27.60%</td>\n      </tr>\n      <tr>\n          <td>Kubernetes</td>\n          <td>52</td>\n          <td>16.88%</td>\n      </tr>\n      <tr>\n          <td>Sequential</td>\n          <td>22</td>\n          <td>7.14%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>11</td>\n          <td>3.57</td>\n      </tr>\n  </tbody>\n</table>\n<p>The other option mostly consisted of information that someone uses a few types or is\nmigrating from one executor to another. What can be observed is an increase in usage\nof Local and Kubernetes executors when compared to results from an earlier <a href=\"https://ash.berlintaylor.com/writings/2019/02/airflow-user-survey-2019/\">survey done\nby Ash</a>.</p>\n<p><strong>Do you use Kubernetes-based deployments for Airflow?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>No - we do not plan to use Kubernetes near term</td>\n          <td>88</td>\n          <td>28.57%</td>\n      </tr>\n      <tr>\n          <td>Yes - setup on our own via Helm Chart or similar</td>\n          <td>65</td>\n          <td>21.10%</td>\n      </tr>\n      <tr>\n          <td>Not yet - but we use Kubernetes in our organization and we could move</td>\n          <td>61</td>\n          <td>19.81%</td>\n      </tr>\n      <tr>\n          <td>Yes - via managed service in the cloud (Composer / Astronomer etc.)</td>\n          <td>45</td>\n          <td>14.61%</td>\n      </tr>\n      <tr>\n          <td>Not yet - but we plan to deploy Kubernetes in our organization soon</td>\n          <td>42</td>\n          <td>13.64%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>7</td>\n          <td>2.27%</td>\n      </tr>\n  </tbody>\n</table>\n<p>The most interesting thing is that there’s nearly 30% of users who do not use Kubernetes,\nand they are not going to move. This means we should keep other deployment options in\nmind when working on Airflow 2.0. On the other hand, almost 70% of the users already\nuse Kubernetes, or it’s a viable option for them.</p>\n<p><strong>Do you combine multiple DAGs?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>No, I don&rsquo;t combine multiple DAGs</td>\n          <td>127</td>\n          <td>41.23%</td>\n      </tr>\n      <tr>\n          <td>Yes, through SubDAG</td>\n          <td>73</td>\n          <td>23.70%</td>\n      </tr>\n      <tr>\n          <td>Yes, by triggering another DAG</td>\n          <td>72</td>\n          <td>23.38%</td>\n      </tr>\n      <tr>\n          <td>Other</td>\n          <td>36</td>\n          <td>11.69%</td>\n      </tr>\n  </tbody>\n</table>\n<p>In the other category, 9 people explicitly mentioned using <code>ExternalTaskSensor</code>,\nand I think it could be treated as running subDAGs by triggering other DAGs.</p>\n<p><strong>Do you use Airflow Plugins? If yes, what do you use it for?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Adding new operators/sensors and hooks</td>\n          <td>187</td>\n          <td>60.71%</td>\n      </tr>\n      <tr>\n          <td>I don&rsquo;t use Airflow plugins</td>\n          <td>109</td>\n          <td>35.39%</td>\n      </tr>\n      <tr>\n          <td>Adding AppBuilder views &amp; menu items</td>\n          <td>31</td>\n          <td>10.06%</td>\n      </tr>\n      <tr>\n          <td>Adding new executor</td>\n          <td>18</td>\n          <td>5.84%</td>\n      </tr>\n      <tr>\n          <td>Adding OperatorExtraLinks</td>\n          <td>7</td>\n          <td>2.27%</td>\n      </tr>\n  </tbody>\n</table>\n<p>The high percentage - 60%  for “Adding new operators/sensors and hooks” is quite a\nsurprising result for some of us - especially that you do not actually need to use the\nplugin mechanism to add any of those. Those are standard python objects, and you can\nsimply drop your hooks/operators/sensors code to <code>PYTHONPATH</code> environment variable and\nthey will work. It seems that this may be a result of a lack of best practices guide.</p>\n<p>Plugins are more useful for adding views and menu items - yet only 10%.\nOperatorExtraLinks are even more useful (though relatively new) feature, so it’s not\nentirely surprising they are hardly used.</p>\n<p>It was also kind of surprising that someone at all uses plugins to use their own\nexecutors. We considered removing that option recently - but now we have to rethink\nour approach.</p>\n<p><strong>What metrics do you use to monitor Airflow?</strong></p>\n<p>There were a lot of different responses. Some use Prometheus and other services,\nothers do not use any monitoring. One of the interesting responses linked to this\nsolution for <a href=\"https://github.com/mastak/airflow_operators_metrics\">airflow_operators_metrics</a>.</p>\n<h2 id=\"external-services\">External services</h2>\n<p><strong>What external services do you use in your Airflow DAGs?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Amazon Web Services</td>\n          <td>160</td>\n          <td>51.95%</td>\n      </tr>\n      <tr>\n          <td>Internal company systems</td>\n          <td>150</td>\n          <td>48.7%</td>\n      </tr>\n      <tr>\n          <td>Hadoop / Spark / Flink / Other Apache software</td>\n          <td>119</td>\n          <td>38.64%</td>\n      </tr>\n      <tr>\n          <td>Google Cloud Platform / Google APIs</td>\n          <td>112</td>\n          <td>36.36%</td>\n      </tr>\n      <tr>\n          <td>Microsoft Azure</td>\n          <td>28</td>\n          <td>9.09%</td>\n      </tr>\n      <tr>\n          <td>I do not use external services in my Airflow DAGs</td>\n          <td>18</td>\n          <td>5.84%</td>\n      </tr>\n  </tbody>\n</table>\n<p>It’s not surprising that Amazon Web Services is leading the way as they are considered the most mature\ncloud provider. Internal system and other Apache products on the next two positions are\nquite understandable if we take into account that the majority uses Airflow for ETL processes.</p>\n<p><strong>What external services do you use in your Airflow DAGs? (Mixed providers)</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Google Cloud Platform / Google APIs, Amazon Web Services</td>\n          <td>44</td>\n          <td>14.29%</td>\n      </tr>\n      <tr>\n          <td>Amazon Web Services, Microsoft Azure</td>\n          <td>5</td>\n          <td>1.62%</td>\n      </tr>\n      <tr>\n          <td>Google Cloud Platform / Google APIs, Microsoft Azure</td>\n          <td>4</td>\n          <td>1.3%</td>\n      </tr>\n  </tbody>\n</table>\n<p>This result is not surprising because companies usually prefer to stick with one cloud\nprovider.</p>\n<p><strong>How do you integrate with external services?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Using Bash / Python operator</td>\n          <td>220</td>\n          <td>71.43%</td>\n      </tr>\n      <tr>\n          <td>Using existing, dedicated operators / hooks</td>\n          <td>217</td>\n          <td>70.45%</td>\n      </tr>\n      <tr>\n          <td>Using own, custom operators / hooks</td>\n          <td>216</td>\n          <td>70.13%</td>\n      </tr>\n  </tbody>\n</table>\n<p>We had some anecdotal evidence that people use more Python/Bash operators than the\ndedicated ones - but it looks like all ways of using Airflow to connect to external\nservices are equally popular.</p>\n<h2 id=\"what-can-be-improved\">What can be improved</h2>\n<p><strong>In your opinion, what could be improved in Airflow?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Scheduler performance</td>\n          <td>189</td>\n          <td>61.36%</td>\n      </tr>\n      <tr>\n          <td>Web UI</td>\n          <td>180</td>\n          <td>58.44%</td>\n      </tr>\n      <tr>\n          <td>Logging, monitoring and alerting</td>\n          <td>145</td>\n          <td>47.08%</td>\n      </tr>\n      <tr>\n          <td>Examples, how-to, onboarding documentation</td>\n          <td>143</td>\n          <td>46.43%</td>\n      </tr>\n      <tr>\n          <td>Technical documentation</td>\n          <td>137</td>\n          <td>44.48%</td>\n      </tr>\n      <tr>\n          <td>Reliability</td>\n          <td>112</td>\n          <td>36.36%</td>\n      </tr>\n      <tr>\n          <td>REST API</td>\n          <td>96</td>\n          <td>31.17%</td>\n      </tr>\n      <tr>\n          <td>Authentication and authorization</td>\n          <td>89</td>\n          <td>28.9%</td>\n      </tr>\n      <tr>\n          <td>External integration e.g. AWS, GCP, Apache product</td>\n          <td>49</td>\n          <td>15.91%</td>\n      </tr>\n      <tr>\n          <td>CLI</td>\n          <td>41</td>\n          <td>13.31%</td>\n      </tr>\n      <tr>\n          <td>I don’t know</td>\n          <td>5</td>\n          <td>1.62%</td>\n      </tr>\n  </tbody>\n</table>\n<p>The results are rather quite self-explaining. Improved performance of Airflow, better\nUI, and more telemetry are desirable. But this should go in pair with improved\ndocumentation and resources about using the Airflow, especially when we\ntake into account the problem of onboarding new users.</p>\n<p>Another interesting point from that question is that only 16% think that operators\nshould be extended and improved. This suggests that we should focus on improving\nAirflow core instead of adding more and more integrations.</p>\n<p><strong>What would be the most interesting feature for you?</strong></p>\n<table>\n  <thead>\n      <tr>\n          <th></th>\n          <th>No.</th>\n          <th>%</th>\n      </tr>\n  </thead>\n  <tbody>\n      <tr>\n          <td>Production-ready Airflow docker image</td>\n          <td>175</td>\n          <td>56.82%</td>\n      </tr>\n      <tr>\n          <td>Declarative way of writing DAGs / automated DAGs generation</td>\n          <td>155</td>\n          <td>50.32%</td>\n      </tr>\n      <tr>\n          <td>Horizontal Autoscaling</td>\n          <td>122</td>\n          <td>39.61%</td>\n      </tr>\n      <tr>\n          <td>Asynchronous Operators</td>\n          <td>97</td>\n          <td>31.49%</td>\n      </tr>\n      <tr>\n          <td>Stateless web server</td>\n          <td>81</td>\n          <td>26.3%</td>\n      </tr>\n      <tr>\n          <td>Knative Executor</td>\n          <td>48</td>\n          <td>15.58%</td>\n      </tr>\n      <tr>\n          <td>I already have all I need</td>\n          <td>13</td>\n          <td>4.22%</td>\n      </tr>\n  </tbody>\n</table>\n<p>Production Docker image wins, and it’s not a surprise. We all know that deploying\nAirflow is not a plug and play process, and that’s why the official image is being\nworked on by Jarek Potiuk. An unexpected result is that half of the users would like to\nhave a declarative way of creating DAGs. That seems to be something that is “against Airflow”\nas we always emphasize the possibility of writing workflows in pure python. Stories\nabout DAG generators are not new and confirm that there’s a need for a way to\ndeclare DAGs.</p>"
---

Apache Airflow Survey 2019
Apache Airflow is growing faster than ever.
Thus, receiving and adjusting to our users’ feedback is a must. We created
survey and we got 308 responses.
Let’s see who Airflow users are, how they play with it, and what they miss.
Overview of the user
What best describes your current occupation?

          No.
          %
      
Data Engineer
          194
          62.99%
      
Developer
          34
          11.04%
      
Architect
          23
          7.47%
      
Data Scientist
          19
          6.17%
      
Data Analyst
          13
          4.22%
      
DevOps
          13
          4.22%
      
IT Administrator
          2
          0.65%
      
Machine Learning Engineer
          2
          0.65%
      
Manager
          2
          0.65%
      
Operations
          2
          0.65%
      
Chief Data Officer
          1
          0.32%
      
Engineering Manager
          1
          0.32%
      
Intern
          1
          0.32%
      
Product owner
          1
          0.32%
      
Quant
          1
          0.32%
      
In your day to day job, what do you use Airflow for?

          No.
          %
      
Data processing (ETL)
          298
          96.75%
      
Artificial Intelligence and Machine Learning Pipelines
          90
          29.22%
      
Automating DevOps operations
          64
          20.78%
      
According to the survey, most of the Airflow users are the “data” people. Moreover,
28.57% uses Airflow to both ETL and ML pipelines meaning that those two fields
are somehow connected. Only five respondents use Airflow for DevOps operations only,
That means that other 59 people who use Airflow for DevOps stuff use it also for
ETL / ML  purposes.
How many active DAGs do you have in your largest Airflow instance?

          No.
          %
      
0-20
          115
          37.34%
      
21-40
          65
          21.10%
      
41-60
          44
          14.29%
      
61-100
          28
          9.09%
      
101-200
          28
          9.09%
      
201-300
          7
          2.27%
      
301-999
          8
          2.60%
      
1000+
          13
          4.22%
      
The majority of users do not exceed 100 active DAGs per Airflow instance. However,
as we can see there are users who exceed thousands of DAGs with a maximum number 5000.
What is the maximum number of tasks that you have used in one DAG?

          No.
          %
      
0-10
          61
          19.81%
      
11-20
          60
          19.48%
      
21-30
          31
          10.06%
      
31-40
          21
          6.82%
      
41-50
          26
          8.44%
      
51-100
          36
          11.69%
      
101-200
          28
          9.09%
      
201-500
          21
          6.82%
      
501+
          24
          11.54%
      
The given maximum number of tasks in a single DAG was 10 000 (!). The number of tasks
depends on the purposes of a DAG, so it’s rather hard to say if users have “simple”
or “complicated” workflows.
When onboarding new members to Airflow, what is the biggest problem?

          No.
          %
      
No guide on best practises on developing DAGs
          160
          51.95%
      
Small number of tutorials on different aspects of using Airflow
          57
          18.51%
      
Documentation is not clear enough
          42
          13.64%
      
Small number of blogs regarding Airflow
          6
          1.95%
      
Other
          43
          13.96%
      
This is an important result. Using Airflow is all about writing and scheduling DAGs.
No guide or any other complete resource on best practices for developing Dags is a big
problem. Diving deep in the “other” answers, we can find that:
Airflow’s “magic” (scheduler, executors, schedule times) is hard to understand
DAG testing is not easy to do and to explain
Airflow UI needs some love.
How likely are you to recommend Apache Airflow?

          No.
          %
      
Very Likely
          140
          45.45%
      
Likely
          124
          40.26%
      
Neutral
          33
          10.71%
      
Unlikely
          8
          2.60%
      
Very unlikely
          3
          0.97%
      
This means that more than 85% of people who use Airflow like it. It seems Airflow does
its job nicely. However, we have to remember that this survey is likely biased - it’s
more likely that you respond to the survey if you like the tool you use. Should we
focus then on those 11 people who did not like Airflow? It’s a good question.
Airflow usage
Which interface(s) of Airflow do you use as part of your current role?

          No.
          %
      
Original Airflow Graphical User Interface
          297
          96.43%
      
CLI
          126
          40.91%
      
Original Airflow Graphical User Interface, CLI
          117
          37.99%
      
API
          60
          19.48%
      
Original Airflow Graphical User Interface, CLI, API
          32
          10.39%
      
Custom (own created) Airflow Graphical User Interface
          25
          8.12%
      
It’s visible that usage of CLI goes in pair with using Airflow web UI. Our
survey included some UX related questions to allow us to understand how users
use Airflow webserver.
What do you use the Graphical User Interface for?

What do you use CLI for?

In Airflow, which UI view(s) are important for you?

Here we see that the majority uses Web UI mostly for monitoring purposes:
Monitoring DAGs
Accessing logs
An interesting result is that many people seem not to use backfilling as
there’s no other way than to do it by CLI.
What executor type do you use?

          No.
          %
      
Celery
          138
          44.81%
      
Local
          85
          27.60%
      
Kubernetes
          52
          16.88%
      
Sequential
          22
          7.14%
      
Other
          11
          3.57
      
The other option mostly consisted of information that someone uses a few types or is
migrating from one executor to another. What can be observed is an increase in usage
of Local and Kubernetes executors when compared to results from an earlier survey done
by Ash.
Do you use Kubernetes-based deployments for Airflow?

          No.
          %
      
No - we do not plan to use Kubernetes near term
          88
          28.57%
      
Yes - setup on our own via Helm Chart or similar
          65
          21.10%
      
Not yet - but we use Kubernetes in our organization and we could move
          61
          19.81%
      
Yes - via managed service in the cloud (Composer / Astronomer etc.)
          45
          14.61%
      
Not yet - but we plan to deploy Kubernetes in our organization soon
          42
          13.64%
      
Other
          7
          2.27%
      
The most interesting thing is that there’s nearly 30% of users who do not use Kubernetes,
and they are not going to move. This means we should keep other deployment options in
mind when working on Airflow 2.0. On the other hand, almost 70% of the users already
use Kubernetes, or it’s a viable option for them.
Do you combine multiple DAGs?

          No.
          %
      
No, I don’t combine multiple DAGs
          127
          41.23%
      
Yes, through SubDAG
          73
          23.70%
      
Yes, by triggering another DAG
          72
          23.38%
      
Other
          36
          11.69%
      
In the other category, 9 people explicitly mentioned using ExternalTaskSensor,
and I think it could be treated as running subDAGs by triggering other DAGs.
Do you use Airflow Plugins? If yes, what do you use it for?

          No.
          %
      
Adding new operators/sensors and hooks
          187
          60.71%
      
I don’t use Airflow plugins
          109
          35.39%
      
Adding AppBuilder views & menu items
          31
          10.06%
      
Adding new executor
          18
          5.84%
      
Adding OperatorExtraLinks
          7
          2.27%
      
The high percentage - 60%  for “Adding new operators/sensors and hooks” is quite a
surprising result for some of us - especially that you do not actually need to use the
plugin mechanism to add any of those. Those are standard python objects, and you can
simply drop your hooks/operators/sensors code to PYTHONPATH environment variable and
they will work. It seems that this may be a result of a lack of best practices guide.
Plugins are more useful for adding views and menu items - yet only 10%.
OperatorExtraLinks are even more useful (though relatively new) feature, so it’s not
entirely surprising they are hardly used.
It was also kind of surprising that someone at all uses plugins to use their own
executors. We considered removing that option recently - but now we have to rethink
our approach.
What metrics do you use to monitor Airflow?
There were a lot of different responses. Some use Prometheus and other services,
others do not use any monitoring. One of the interesting responses linked to this
solution for airflow_operators_metrics.
External services
What external services do you use in your Airflow DAGs?

          No.
          %
      
Amazon Web Services
          160
          51.95%
      
Internal company systems
          150
          48.7%
      
Hadoop / Spark / Flink / Other Apache software
          119
          38.64%
      
Google Cloud Platform / Google APIs
          112
          36.36%
      
Microsoft Azure
          28
          9.09%
      
I do not use external services in my Airflow DAGs
          18
          5.84%
      
It’s not surprising that Amazon Web Services is leading the way as they are considered the most mature
cloud provider. Internal system and other Apache products on the next two positions are
quite understandable if we take into account that the majority uses Airflow for ETL processes.
What external services do you use in your Airflow DAGs? (Mixed providers)

          No.
          %
      
Google Cloud Platform / Google APIs, Amazon Web Services
          44
          14.29%
      
Amazon Web Services, Microsoft Azure
          5
          1.62%
      
Google Cloud Platform / Google APIs, Microsoft Azure
          4
          1.3%
      
This result is not surprising because companies usually prefer to stick with one cloud
provider.
How do you integrate with external services?

          No.
          %
      
Using Bash / Python operator
          220
          71.43%
      
Using existing, dedicated operators / hooks
          217
          70.45%
      
Using own, custom operators / hooks
          216
          70.13%
      
We had some anecdotal evidence that people use more Python/Bash operators than the
dedicated ones - but it looks like all ways of using Airflow to connect to external
services are equally popular.
What can be improved
In your opinion, what could be improved in Airflow?

          No.
          %
      
Scheduler performance
          189
          61.36%
      
Web UI
          180
          58.44%
      
Logging, monitoring and alerting
          145
          47.08%
      
Examples, how-to, onboarding documentation
          143
          46.43%
      
Technical documentation
          137
          44.48%
      
Reliability
          112
          36.36%
      
REST API
          96
          31.17%
      
Authentication and authorization
          89
          28.9%
      
External integration e.g. AWS, GCP, Apache product
          49
          15.91%
      
CLI
          41
          13.31%
      
I don’t know
          5
          1.62%
      
The results are rather quite self-explaining. Improved performance of Airflow, better
UI, and more telemetry are desirable. But this should go in pair with improved
documentation and resources about using the Airflow, especially when we
take into account the problem of onboarding new users.
Another interesting point from that question is that only 16% think that operators
should be extended and improved. This suggests that we should focus on improving
Airflow core instead of adding more and more integrations.
What would be the most interesting feature for you?

          No.
          %
      
Production-ready Airflow docker image
          175
          56.82%
      
Declarative way of writing DAGs / automated DAGs generation
          155
          50.32%
      
Horizontal Autoscaling
          122
          39.61%
      
Asynchronous Operators
          97
          31.49%
      
Stateless web server
          81
          26.3%
      
Knative Executor
          48
          15.58%
      
I already have all I need
          13
          4.22%
      
Production Docker image wins, and it’s not a surprise. We all know that deploying
Airflow is not a plug and play process, and that’s why the official image is being
worked on by Jarek Potiuk. An unexpected result is that half of the users would like to
have a declarative way of creating DAGs. That seems to be something that is “against Airflow”
as we always emphasize the possibility of writing workflows in pure python. Stories
about DAG generators are not new and confirm that there’s a need for a way to
declare DAGs.
