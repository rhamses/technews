---
title: "How to use Airflow with Trino"
link: "https://trino.io/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html"
guid: "https://trino.io/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html"
pubDate: "2022-07-13T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "The recent addition of the fault-tolerant\nexecution architecture,\ndelivered to Trino by Project Tardigrade, makes the use of Trino for running\nyour ETL workloads an even more compelling alternative than ever before. We’ve\nset up a demo environment for you to easily give it a try in Starburst\nGalaxy.\nWith Project Tardigrade providing an out-of-the-box solution with advanced\nresource-aware task scheduling and granular retries at the task/query level, we still\nneed a robust tool to schedule and manage workloads themselves. Apache\nAirflow is a great choice for this purpose.\nApache Airflow is a widely used workflow engine that allows you to schedule and\nrun complex data pipelines. Airflow provides many plug-and-play operators and\nhooks to integrate with many third-party services like Trino.\nTo get started using Airflow to run data pipelines with Trino you need to\ncomplete the following steps:\nInstall of Apache Airflow 2.10+\nInstall the TrinoHook\nCreate a Trino connection in Airflow\nDeploy a TrinoOperator\nDeploy your DAGs\nInstalling Apache Airflow in Docker\nThe best way to get you going, if you don’t already have an Airflow cluster\navailable, is to run Airflow in a container using docker compose. Just be\naware that this is not best practice for a production environment.\nRequirements for the host:\nDocker\nDocker Compose 1.28+\nStep 1) Create a directory named airflow for all our configuration files.\n\n$ mkdir airflow\n\n\nStep 2) In the airflow directory create three subdirectory called dags, plugins, and logs.\n\n$ cd airflow\n$ mkdir dags plugins logs\n\n\nStep 3) Download the Airflow docker compose yaml file.\n\n$ curl -LfO 'https://airflow.apache.org/docs/apache-airflow/stable/docker-compose.yaml'\n\n\nStep 4) Create an .env configuration file:\n\n$ echo -e \"AIRFLOW_UID=$(id -u)\" > .env\n$ echo \"AIRFLOW_GID=0\" >> .env \n\n\nStep 5) Start the Airflow containers\n\n$ docker-compose up -d\n\n\nInstalling the TrinoHook\nIf running Airflow in docker, you need to install the TrinoHook in\nall the docker containers using the apache/airflow:x.x.x image.\n\n$ docker ps \nCONTAINER ID   IMAGE                  PORTS                              NAMES\ncffdfaeb757e   apache/airflow:2.3.0   0.0.0.0:8080->8080/tcp             airflow_airflow-webserver_1\nb0e72f479a66   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-worker_1\n4cdb11b3e5e3   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-triggerer_1\n41d3c3107ddb   apache/airflow:2.3.0   0.0.0.0:5555->5555/tcp, 8080/tcp   airflow_flower_1\n229a11e9cdd3   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-scheduler_1\n68160240857d   postgres:13            5432/tcp                           airflow_postgres_1\na96b98da85df   redis:latest           6379/tcp                           airflow_redis_1\n\n\nTo install the TrinoHook you run pip install apache-airflow-providers-trino in\nthe first five containers.  Run the following command replacing the container id of\neach of the containers in your deployment.\n\n$ docker exec -it <container_id> pip install apache-airflow-providers-trino\n\n\nOnce you have done that you need to restart all five containers:\n\n$ docker container restart <container_id_1> ... <container_id_5>\n\n\nCreating a Trino connection\nAfter you have installed the TrinoHook and restarted Airflow you can create a\nconnection to your Trino cluster through the Airflow web UI.  If you just\ninstalled Airflow, then go to http://localhost:8080 on your browser and login.\nThe default credentials unless changed are airflow for username and password.\nGo to Admin > Connections.\nClick on the blue button to Add a new record.\nSelect Trino from the Connection Type dropdown and provide the following information:\nConnection Id\n   Whatever you want to call your connection.\n  \nThe hostname or host ip of your trino cluster, e.g., localhost, 10.10.10.1, or www.mytrino.com\n  \nSchema\n   A schema in your Trino cluster.\n  \nLogin\n   The username of the user that Airflow uses to connect to Trino.  Best practice would be to create a service account like ‘airflow’. Just understand that this user access level is used to execute SQL statements in Trino.\n  \nPassword\n   The password of the user that Airflow uses to connect to Trino if authentication is enabled.\n  \nPort\n   The port where the Trino Web UI can be accessed, e.g., 8080, 8443.\n  \nExtra\n   Additional settings, like protocol:https if using TLS, or verify:false if you are using a self-signed certificate.\n  \nBe aware that the test button might not actually return any feedback for Trino connections.\nDeploying a TrinoOperator\nAt the time of writing this article there is no TrinoOperator, so you have to\nwrite your own.  You find an implementation in the following section, to get you started.  This operator allows you to\nexecute any SQL statements that Trino supports such as SELECT, INSERT, CREATE, SET SESSION, and others. You can run multiple statements in a single task so\nthey are part of a single Trino session.\nTo create the TrinoOperator use your favorite text editor to create a file called\ntrino_operator.py with the following code in it and place it in the\nairflow/plugins directory you created earlier. Airflow automatically compiles the code and you are ready to start\nwriting DAGs.\nFor those new to Airflow, DAG (Directed Acyclic Graph) is a core Airflow\nconcept, a collection of tasks with dependencies and relationships that indicate\nto Airflow how they should be executed. DAGs are written in Python.\n\nfrom airflow.models.baseoperator import BaseOperator\nfrom airflow.utils.decorators import apply_defaults\nfrom airflow.providers.trino.hooks.trino import TrinoHook\nimport logging\nfrom typing import Sequence, Callable, Optional\n\ndef handler(cur):\n    cur.fetchall()\n\nclass TrinoCustomHook(TrinoHook):\n\n    def run(\n        self,\n        sql,\n        autocommit: bool = False,\n        parameters: Optional[dict] = None,\n        handler: Optional[Callable] = None,\n    ) -> None:\n        \"\"\":sphinx-autoapi-skip:\"\"\"\n\n        return super(TrinoHook, self).run(\n            sql=sql, autocommit=autocommit, parameters=parameters, handler=handler\n        )\n\nclass TrinoOperator(BaseOperator):\n\n    template_fields: Sequence[str] = ('sql',)\n\n    @apply_defaults\n    def __init__(self, trino_conn_id: str, sql, parameters=None, **kwargs) -> None:\n        super().__init__(**kwargs)\n        self.trino_conn_id = trino_conn_id\n        self.sql = sql\n        self.parameters = parameters\n\n    def execute(self, context):\n        task_instance = context['task']\n\n        logging.info('Creating Trino connection')\n        hook = TrinoCustomHook(trino_conn_id=self.trino_conn_id)\n\n        sql_statements = self.sql\n\n        if isinstance(sql_statements, str):\n            sql = list(filter(None,sql_statements.strip().split(';')))\n\n            if len(sql) == 1:\n                logging.info('Executing single sql statement')\n                sql = sql[0]\n                return hook.get_first(sql, parameters=self.parameters)\n\n            if len(sql) > 1:\n                logging.info('Executing multiple sql statements')\n                return hook.run(sql, autocommit=False, parameters=self.parameters, handler=handler)\n\n        if isinstance(sql_statements, list):\n            sql = []\n            for sql_statement in sql_statements:\n                sql.extend(list(filter(None,sql_statement.strip().split(';'))))\n\n            logging.info('Executing multiple sql statements')\n            return hook.run(sql, autocommit=False, parameters=self.parameters, handler=handler)\n\n\nDeploying a DAG\nNow that you have deployed the TrinoOperator you can start writing DAGs for your\ndata pipelines. Let’s write and deploy a simple sample DAG.  DAGs just like the\nTrinoOperator are deployed into the airflow/dags\ndirectory you created earlier.\nCreate a file called my_first_trino_dag.py with the following code, and save it in the airflow/dags directory.\n\nimport pendulum\n\nfrom airflow import DAG\nfrom airflow.operators.python_operator import PythonOperator\n\nfrom trino_operator import TrinoOperator\n\n## This method is called by task2 (below) to retrieve and print to the logs the return value of task1\ndef print_command(**kwargs):\n        task_instance = kwargs['task_instance']\n        print('Return Value: ',task_instance.xcom_pull(task_ids='task_1',key='return_value'))\n\nwith DAG(\n    default_args={\n        'depends_on_past': False\n    },\n    dag_id='my_first_trino_dag',\n    schedule_interval='0 8 * * *',\n    start_date=pendulum.datetime(2022, 5, 1, tz=\"US/Central\"),\n    catchup=False,\n    tags=['example'],\n) as dag:\n\n    ## Task 1 runs a Trino select statement to count the number of records \n    ## in the tpch.tiny.customer table\n    task1 = TrinoOperator(\n      task_id='task_1',\n      trino_conn_id='trino_connection',\n      sql=\"select count(1) from tpch.tiny.customer\")\n\n    ## Task 2 is a Python Operator that runs the print_command method above \n    task2 = PythonOperator(\n      task_id = 'print_command',\n      python_callable = print_command,\n      provide_context = True,\n      dag = dag)\n\n    ## Task 3 demonstrates how you can use results from previous statements in new SQL statements\n    task3 = TrinoOperator(\n      task_id='task_3',\n      trino_conn_id='trino_connection',\n      sql=\"select { { task_instance.xcom_pull(task_ids='task_1',key='return_value')[0] } }\")\n\n    ## Task 4 demonstrates how you can run multiple statements in a single session.  \n    ## Best practice is to run a single statement per task however statements that change session \n    ## settings must be run in a single task.  The set time zone statements in this example will \n    ## not affect any future tasks but the two now() functions would timestamps for the time zone \n    ## set before they were run.\n    task4 = TrinoOperator(\n      task_id='task_4',\n      trino_conn_id='trino_connection',\n      sql=\"set time zone 'America/Chicago'; select now(); set time zone 'UTC' ; select now()\")\n\n    ## The following syntax determines the dependencies between all the DAG tasks.\n    ## Task 1 will have to complete successfully before any other tasks run.\n    ## Tasks 3 and 4 won't run until Task 2 completes.\n    ## Tasks 3 and 4 can run in parallel if there are enough worker threads. \n    task1 >> task2 >> [task3, task4]\n\n\nJust like with the TrinoOperator DAGs are picked up and compiled by Airflow\nautomatically.  When Airflow fails to compile your DAG it displays an error\nmessage at the top of the page in the main page where all the DAGs are listed.\nYou can refresh this page a few times until your DAG is either added to the list\nor you see an error message.  You can expand the message to see the source of\nthe error.  Usually the information provided is enough to understand the issue.\nOnce the DAG shows up on your list you can trigger a manual run, using the play\nbutton on the right to  activate your DAG.  I recommend switching to the Graph\nview, using the action links on the right to see  how tasks change status as\nthey run.\nYou can see logs for each task by clicking on the corresponding box and selecting Log from the options at the top.\nCheck out the logs for the print_command task to see the return value of select statement from task_1\nAs you can see, output from print() commands can be found in these logs.\nConclusion\nApache Airflow has been around for many years now. It is used by many large\ncompanies in production environments. The open source project has an active\ncommunity, and I expect that in the near future we will have an official\nTrinoHook with additional out-of-the-box functionality. While there might be a\nslight learning curve for new users I think that is worth it.\nOn the Trino side there are some exciting enhancements for fault-tolerant\nexecution on\nthe roadmap of Project Tardigrade that will make Trino and Airflow an even\nbetter combination.\nStay tuned.\nNote from Trino community: We welcome blog submissions from the community. If\nyou have blog ideas, send a message in the #dev chat. We will mail you\nTrino swag as a token of appreciation for successful submissions. Enter the Trino\nSlack\nand join the conversation in the #project-tardigrade\nchannel.\nDiscuss on Reddit\nDiscuss On Hacker News"
author: "Willie Valdez"
contentHtml: "<div>\n<article>\n  <div><p>The recent addition of the <a target=\"_blank\" href=\"https://trino.io/docs/current/admin/fault-tolerant-execution.html\">fault-tolerant\nexecution</a> architecture,\ndelivered to Trino by Project Tardigrade, makes the use of Trino for running\nyour ETL workloads an even more compelling alternative than ever before. We’ve\nset up a demo environment for you to easily give it a try in <a target=\"_blank\" href=\"https://www.starburst.io/platform/starburst-galaxy/\">Starburst\nGalaxy</a>.</p>\n<!--more-->\n<p>With Project Tardigrade providing an out-of-the-box solution with advanced\nresource-aware task scheduling and granular retries at the task/query level, we still\nneed a robust tool to schedule and manage workloads themselves. Apache\nAirflow is a great choice for this purpose.</p>\n<p><a target=\"_blank\" href=\"https://airflow.apache.org/\">Apache Airflow</a> is a widely used workflow engine that allows you to schedule and\nrun complex data pipelines. Airflow provides many plug-and-play operators and\nhooks to integrate with many third-party services like Trino.</p>\n<p>To get started using Airflow to run data pipelines with Trino you need to\ncomplete the following steps:</p>\n<ul>\n  <li>Install of Apache Airflow 2.10+</li>\n  <li>Install the TrinoHook</li>\n  <li>Create a Trino connection in Airflow</li>\n  <li>Deploy a TrinoOperator</li>\n  <li>Deploy your DAGs</li>\n</ul>\n<h2 id=\"installing-apache-airflow-in-docker\">\n    Installing Apache Airflow in Docker <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html#installing-apache-airflow-in-docker\">#</a>\n</h2>\n<p>The best way to get you going, if you don’t already have an Airflow cluster\navailable, is to run Airflow in a container using docker compose. Just be\naware that this is not best practice for a production environment.</p>\n<p>Requirements for the host:</p>\n<ul>\n  <li>Docker</li>\n  <li>Docker Compose 1.28+</li>\n</ul>\n<p>Step 1) Create a directory named airflow for all our configuration files.</p>\n<div><pre><code>$ mkdir airflow\n</code></pre></div>\n<p>Step 2) In the airflow directory create three subdirectory called <code>dags</code>, <code>plugins</code>, and <code>logs</code>.</p>\n<div><pre><code>$ cd airflow\n$ mkdir dags plugins logs\n</code></pre></div>\n<p>Step 3) Download the Airflow docker compose yaml file.</p>\n<div><pre><code>$ curl -LfO 'https://airflow.apache.org/docs/apache-airflow/stable/docker-compose.yaml'\n</code></pre></div>\n<p>Step 4) Create an <code>.env</code> configuration file:</p>\n<div><pre><code>$ echo -e \"AIRFLOW_UID=$(id -u)\" &gt; .env\n$ echo \"AIRFLOW_GID=0\" &gt;&gt; .env \n</code></pre></div>\n<p>Step 5) Start the Airflow containers</p>\n<div><pre><code>$ docker-compose up -d\n</code></pre></div>\n<h2 id=\"installing-the-trinohook\">\n    Installing the TrinoHook <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html#installing-the-trinohook\">#</a>\n</h2>\n<p>If running Airflow in docker, you need to install the TrinoHook in\nall the docker containers using the <code>apache/airflow:x.x.x</code> image.</p>\n<div><pre><code>$ docker ps \nCONTAINER ID   IMAGE                  PORTS                              NAMES\ncffdfaeb757e   apache/airflow:2.3.0   0.0.0.0:8080-&gt;8080/tcp             airflow_airflow-webserver_1\nb0e72f479a66   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-worker_1\n4cdb11b3e5e3   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-triggerer_1\n41d3c3107ddb   apache/airflow:2.3.0   0.0.0.0:5555-&gt;5555/tcp, 8080/tcp   airflow_flower_1\n229a11e9cdd3   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-scheduler_1\n68160240857d   postgres:13            5432/tcp                           airflow_postgres_1\na96b98da85df   redis:latest           6379/tcp                           airflow_redis_1\n</code></pre></div>\n<p>To install the TrinoHook you run <code>pip install apache-airflow-providers-trino</code> in\nthe first five containers.  Run the following command replacing the container id of\neach of the containers in your deployment.</p>\n<div><pre><code>$ docker exec -it &lt;container_id&gt; pip install apache-airflow-providers-trino\n</code></pre></div>\n<p>Once you have done that you need to restart all five containers:</p>\n<div><pre><code>$ docker container restart &lt;container_id_1&gt; ... &lt;container_id_5&gt;\n</code></pre></div>\n<h2 id=\"creating-a-trino-connection\">\n    Creating a Trino connection <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html#creating-a-trino-connection\">#</a>\n</h2>\n<p>After you have installed the TrinoHook and restarted Airflow you can create a\nconnection to your Trino cluster through the Airflow web UI.  If you just\ninstalled Airflow, then go to <code>http://localhost:8080</code> on your browser and login.\nThe default credentials unless changed are <code>airflow</code> for username and password.</p>\n<p>Go to <strong>Admin</strong> &gt; <strong>Connections</strong>.</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/trino-airflow-blog/airflow-connections.png\">\n</p>\n<p>Click on the blue button to <strong>Add a new record</strong>.</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/trino-airflow-blog/airflow-new-connection.png\">\n</p>\n<p>Select <strong>Trino</strong> from the <strong>Connection Type</strong> dropdown and provide the following information:</p>\n<table>\n  <tr>\n   <td>Connection Id</td>\n   <td>Whatever you want to call your connection.</td>\n  </tr>\n  <tr>\n   <td>\n    Host\n   </td>\n   <td>The hostname or host ip of your trino cluster, e.g., <code>localhost</code>, <code>10.10.10.1</code>, or <code>www.mytrino.com</code></td>\n  </tr>\n  <tr>\n   <td>Schema</td>\n   <td>A schema in your Trino cluster.</td>\n  </tr>\n  <tr>\n   <td>Login</td>\n   <td>The username of the user that Airflow uses to connect to Trino.  Best practice would be to create a service account like ‘airflow’. Just understand that this user access level is used to execute SQL statements in Trino.</td>\n  </tr>\n  <tr>\n   <td>Password</td>\n   <td>The password of the user that Airflow uses to connect to Trino if authentication is enabled.</td>\n  </tr>\n  <tr>\n   <td>Port</td>\n   <td>The port where the Trino Web UI can be accessed, e.g., <code>8080</code>, <code>8443</code>.</td>\n  </tr>\n  <tr>\n   <td>Extra</td>\n   <td>Additional settings, like <code>protocol:https</code> if using TLS, or <code>verify:false</code> if you are using a self-signed certificate.</td>\n  </tr>\n</table>\n<p>Be aware that the test button might not actually return any feedback for Trino connections.</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/trino-airflow-blog/airflow-add-connection.png\">\n</p>\n<h2 id=\"deploying-a-trinooperator\">\n    Deploying a TrinoOperator <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html#deploying-a-trinooperator\">#</a>\n</h2>\n<p>At the time of writing this article there is no TrinoOperator, so you have to\nwrite your own.  You find an implementation in the following section, to get you started.  This operator allows you to\nexecute any SQL statements that Trino supports such as <code>SELECT</code>, <code>INSERT</code>, <code>CREATE</code>, <code>SET SESSION</code>, and others. You can run multiple statements in a single task so\nthey are part of a single Trino session.</p>\n<p>To create the TrinoOperator use your favorite text editor to create a file called\n<code>trino_operator.py</code> with the following code in it and place it in the\n<code>airflow/plugins</code> directory you created earlier. Airflow automatically compiles the code and you are ready to start\nwriting DAGs.</p>\n<p>For those new to Airflow, DAG (Directed Acyclic Graph) is a core Airflow\nconcept, a collection of tasks with dependencies and relationships that indicate\nto Airflow how they should be executed. DAGs are written in Python.</p>\n<div><pre><code><span>from</span> <span>airflow.models.baseoperator</span> <span>import</span> <span>BaseOperator</span>\n<span>from</span> <span>airflow.utils.decorators</span> <span>import</span> <span>apply_defaults</span>\n<span>from</span> <span>airflow.providers.trino.hooks.trino</span> <span>import</span> <span>TrinoHook</span>\n<span>import</span> <span>logging</span>\n<span>from</span> <span>typing</span> <span>import</span> <span>Sequence</span><span>,</span> <span>Callable</span><span>,</span> <span>Optional</span>\n<span>def</span> <span>handler</span><span>(</span><span>cur</span><span>):</span>\n    <span>cur</span><span>.</span><span>fetchall</span><span>()</span>\n<span>class</span> <span>TrinoCustomHook</span><span>(</span><span>TrinoHook</span><span>):</span>\n    <span>def</span> <span>run</span><span>(</span>\n        <span>self</span><span>,</span>\n        <span>sql</span><span>,</span>\n        <span>autocommit</span><span>:</span> <span>bool</span> <span>=</span> <span>False</span><span>,</span>\n        <span>parameters</span><span>:</span> <span>Optional</span><span>[</span><span>dict</span><span>]</span> <span>=</span> <span>None</span><span>,</span>\n        <span>handler</span><span>:</span> <span>Optional</span><span>[</span><span>Callable</span><span>]</span> <span>=</span> <span>None</span><span>,</span>\n    <span>)</span> <span>-&gt;</span> <span>None</span><span>:</span>\n        <span>\"\"\"</span><span>:sphinx-autoapi-skip:</span><span>\"\"\"</span>\n        <span>return</span> <span>super</span><span>(</span><span>TrinoHook</span><span>,</span> <span>self</span><span>).</span><span>run</span><span>(</span>\n            <span>sql</span><span>=</span><span>sql</span><span>,</span> <span>autocommit</span><span>=</span><span>autocommit</span><span>,</span> <span>parameters</span><span>=</span><span>parameters</span><span>,</span> <span>handler</span><span>=</span><span>handler</span>\n        <span>)</span>\n<span>class</span> <span>TrinoOperator</span><span>(</span><span>BaseOperator</span><span>):</span>\n    <span>template_fields</span><span>:</span> <span>Sequence</span><span>[</span><span>str</span><span>]</span> <span>=</span> <span>(</span><span>'</span><span>sql</span><span>'</span><span>,)</span>\n    <span>@apply_defaults</span>\n    <span>def</span> <span>__init__</span><span>(</span><span>self</span><span>,</span> <span>trino_conn_id</span><span>:</span> <span>str</span><span>,</span> <span>sql</span><span>,</span> <span>parameters</span><span>=</span><span>None</span><span>,</span> <span>**</span><span>kwargs</span><span>)</span> <span>-&gt;</span> <span>None</span><span>:</span>\n        <span>super</span><span>().</span><span>__init__</span><span>(</span><span>**</span><span>kwargs</span><span>)</span>\n        <span>self</span><span>.</span><span>trino_conn_id</span> <span>=</span> <span>trino_conn_id</span>\n        <span>self</span><span>.</span><span>sql</span> <span>=</span> <span>sql</span>\n        <span>self</span><span>.</span><span>parameters</span> <span>=</span> <span>parameters</span>\n    <span>def</span> <span>execute</span><span>(</span><span>self</span><span>,</span> <span>context</span><span>):</span>\n        <span>task_instance</span> <span>=</span> <span>context</span><span>[</span><span>'</span><span>task</span><span>'</span><span>]</span>\n        <span>logging</span><span>.</span><span>info</span><span>(</span><span>'</span><span>Creating Trino connection</span><span>'</span><span>)</span>\n        <span>hook</span> <span>=</span> <span>TrinoCustomHook</span><span>(</span><span>trino_conn_id</span><span>=</span><span>self</span><span>.</span><span>trino_conn_id</span><span>)</span>\n        <span>sql_statements</span> <span>=</span> <span>self</span><span>.</span><span>sql</span>\n        <span>if</span> <span>isinstance</span><span>(</span><span>sql_statements</span><span>,</span> <span>str</span><span>):</span>\n            <span>sql</span> <span>=</span> <span>list</span><span>(</span><span>filter</span><span>(</span><span>None</span><span>,</span><span>sql_statements</span><span>.</span><span>strip</span><span>().</span><span>split</span><span>(</span><span>'</span><span>;</span><span>'</span><span>)))</span>\n            <span>if</span> <span>len</span><span>(</span><span>sql</span><span>)</span> <span>==</span> <span>1</span><span>:</span>\n                <span>logging</span><span>.</span><span>info</span><span>(</span><span>'</span><span>Executing single sql statement</span><span>'</span><span>)</span>\n                <span>sql</span> <span>=</span> <span>sql</span><span>[</span><span>0</span><span>]</span>\n                <span>return</span> <span>hook</span><span>.</span><span>get_first</span><span>(</span><span>sql</span><span>,</span> <span>parameters</span><span>=</span><span>self</span><span>.</span><span>parameters</span><span>)</span>\n            <span>if</span> <span>len</span><span>(</span><span>sql</span><span>)</span> <span>&gt;</span> <span>1</span><span>:</span>\n                <span>logging</span><span>.</span><span>info</span><span>(</span><span>'</span><span>Executing multiple sql statements</span><span>'</span><span>)</span>\n                <span>return</span> <span>hook</span><span>.</span><span>run</span><span>(</span><span>sql</span><span>,</span> <span>autocommit</span><span>=</span><span>False</span><span>,</span> <span>parameters</span><span>=</span><span>self</span><span>.</span><span>parameters</span><span>,</span> <span>handler</span><span>=</span><span>handler</span><span>)</span>\n        <span>if</span> <span>isinstance</span><span>(</span><span>sql_statements</span><span>,</span> <span>list</span><span>):</span>\n            <span>sql</span> <span>=</span> <span>[]</span>\n            <span>for</span> <span>sql_statement</span> <span>in</span> <span>sql_statements</span><span>:</span>\n                <span>sql</span><span>.</span><span>extend</span><span>(</span><span>list</span><span>(</span><span>filter</span><span>(</span><span>None</span><span>,</span><span>sql_statement</span><span>.</span><span>strip</span><span>().</span><span>split</span><span>(</span><span>'</span><span>;</span><span>'</span><span>))))</span>\n            <span>logging</span><span>.</span><span>info</span><span>(</span><span>'</span><span>Executing multiple sql statements</span><span>'</span><span>)</span>\n            <span>return</span> <span>hook</span><span>.</span><span>run</span><span>(</span><span>sql</span><span>,</span> <span>autocommit</span><span>=</span><span>False</span><span>,</span> <span>parameters</span><span>=</span><span>self</span><span>.</span><span>parameters</span><span>,</span> <span>handler</span><span>=</span><span>handler</span><span>)</span>\n</code></pre></div>\n<h2 id=\"deploying-a-dag\">\n    Deploying a DAG <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html#deploying-a-dag\">#</a>\n</h2>\n<p>Now that you have deployed the TrinoOperator you can start writing DAGs for your\ndata pipelines. Let’s write and deploy a simple sample DAG.  DAGs just like the\nTrinoOperator are deployed into the airflow/dags\ndirectory you created earlier.</p>\n<p>Create a file called <code>my_first_trino_dag.py</code> with the following code, and save it in the <code>airflow/dags</code> directory.</p>\n<div><pre><code><span>import</span> <span>pendulum</span>\n<span>from</span> <span>airflow</span> <span>import</span> <span>DAG</span>\n<span>from</span> <span>airflow.operators.python_operator</span> <span>import</span> <span>PythonOperator</span>\n<span>from</span> <span>trino_operator</span> <span>import</span> <span>TrinoOperator</span>\n<span>## This method is called by task2 (below) to retrieve and print to the logs the return value of task1\n</span><span>def</span> <span>print_command</span><span>(</span><span>**</span><span>kwargs</span><span>):</span>\n        <span>task_instance</span> <span>=</span> <span>kwargs</span><span>[</span><span>'</span><span>task_instance</span><span>'</span><span>]</span>\n        <span>print</span><span>(</span><span>'</span><span>Return Value: </span><span>'</span><span>,</span><span>task_instance</span><span>.</span><span>xcom_pull</span><span>(</span><span>task_ids</span><span>=</span><span>'</span><span>task_1</span><span>'</span><span>,</span><span>key</span><span>=</span><span>'</span><span>return_value</span><span>'</span><span>))</span>\n<span>with</span> <span>DAG</span><span>(</span>\n    <span>default_args</span><span>=</span><span>{</span>\n        <span>'</span><span>depends_on_past</span><span>'</span><span>:</span> <span>False</span>\n    <span>},</span>\n    <span>dag_id</span><span>=</span><span>'</span><span>my_first_trino_dag</span><span>'</span><span>,</span>\n    <span>schedule_interval</span><span>=</span><span>'</span><span>0 8 * * *</span><span>'</span><span>,</span>\n    <span>start_date</span><span>=</span><span>pendulum</span><span>.</span><span>datetime</span><span>(</span><span>2022</span><span>,</span> <span>5</span><span>,</span> <span>1</span><span>,</span> <span>tz</span><span>=</span><span>\"</span><span>US/Central</span><span>\"</span><span>),</span>\n    <span>catchup</span><span>=</span><span>False</span><span>,</span>\n    <span>tags</span><span>=</span><span>[</span><span>'</span><span>example</span><span>'</span><span>],</span>\n<span>)</span> <span>as</span> <span>dag</span><span>:</span>\n    <span>## Task 1 runs a Trino select statement to count the number of records \n</span>    <span>## in the tpch.tiny.customer table\n</span>    <span>task1</span> <span>=</span> <span>TrinoOperator</span><span>(</span>\n      <span>task_id</span><span>=</span><span>'</span><span>task_1</span><span>'</span><span>,</span>\n      <span>trino_conn_id</span><span>=</span><span>'</span><span>trino_connection</span><span>'</span><span>,</span>\n      <span>sql</span><span>=</span><span>\"</span><span>select count(1) from tpch.tiny.customer</span><span>\"</span><span>)</span>\n    <span>## Task 2 is a Python Operator that runs the print_command method above \n</span>    <span>task2</span> <span>=</span> <span>PythonOperator</span><span>(</span>\n      <span>task_id</span> <span>=</span> <span>'</span><span>print_command</span><span>'</span><span>,</span>\n      <span>python_callable</span> <span>=</span> <span>print_command</span><span>,</span>\n      <span>provide_context</span> <span>=</span> <span>True</span><span>,</span>\n      <span>dag</span> <span>=</span> <span>dag</span><span>)</span>\n    <span>## Task 3 demonstrates how you can use results from previous statements in new SQL statements\n</span>    <span>task3</span> <span>=</span> <span>TrinoOperator</span><span>(</span>\n      <span>task_id</span><span>=</span><span>'</span><span>task_3</span><span>'</span><span>,</span>\n      <span>trino_conn_id</span><span>=</span><span>'</span><span>trino_connection</span><span>'</span><span>,</span>\n      <span>sql</span><span>=</span><span>\"</span><span>select { { task_instance.xcom_pull(task_ids=</span><span>'</span><span>task_1</span><span>'</span><span>,key=</span><span>'</span><span>return_value</span><span>'</span><span>)[0] } }</span><span>\"</span><span>)</span>\n    <span>## Task 4 demonstrates how you can run multiple statements in a single session.  \n</span>    <span>## Best practice is to run a single statement per task however statements that change session \n</span>    <span>## settings must be run in a single task.  The set time zone statements in this example will \n</span>    <span>## not affect any future tasks but the two now() functions would timestamps for the time zone \n</span>    <span>## set before they were run.\n</span>    <span>task4</span> <span>=</span> <span>TrinoOperator</span><span>(</span>\n      <span>task_id</span><span>=</span><span>'</span><span>task_4</span><span>'</span><span>,</span>\n      <span>trino_conn_id</span><span>=</span><span>'</span><span>trino_connection</span><span>'</span><span>,</span>\n      <span>sql</span><span>=</span><span>\"</span><span>set time zone </span><span>'</span><span>America/Chicago</span><span>'</span><span>; select now(); set time zone </span><span>'</span><span>UTC</span><span>'</span><span> ; select now()</span><span>\"</span><span>)</span>\n    <span>## The following syntax determines the dependencies between all the DAG tasks.\n</span>    <span>## Task 1 will have to complete successfully before any other tasks run.\n</span>    <span>## Tasks 3 and 4 won't run until Task 2 completes.\n</span>    <span>## Tasks 3 and 4 can run in parallel if there are enough worker threads. \n</span>    <span>task1</span> <span>&gt;&gt;</span> <span>task2</span> <span>&gt;&gt;</span> <span>[</span><span>task3</span><span>,</span> <span>task4</span><span>]</span>\n</code></pre></div>\n<p>Just like with the TrinoOperator DAGs are picked up and compiled by Airflow\nautomatically.  When Airflow fails to compile your DAG it displays an error\nmessage at the top of the page in the main page where all the DAGs are listed.\nYou can refresh this page a few times until your DAG is either added to the list\nor you see an error message.  You can expand the message to see the source of\nthe error.  Usually the information provided is enough to understand the issue.</p>\n<p>Once the DAG shows up on your list you can trigger a manual run, using the play\nbutton on the right to  activate your DAG.  I recommend switching to the Graph\nview, using the action links on the right to see  how tasks change status as\nthey run.</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/trino-airflow-blog/airflow-dag.png\">\n</p>\n<p>You can see logs for each task by clicking on the corresponding box and selecting Log from the options at the top.</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/trino-airflow-blog/airflow-task.png\">\n</p>\n<p>Check out the logs for the print_command task to see the return value of select statement from task_1</p>\n<p>\n   <img src=\"https://trino.io/assets/blog/trino-airflow-blog/airflow-logs.png\">\n</p>\n<p>As you can see, output from <code>print()</code> commands can be found in these logs.</p>\n<h2 id=\"conclusion\">\n    Conclusion <a target=\"_blank\" href=\"https://trino.io/blog/2022/07/13/how-to-use-airflow-to-schedule-trino-jobs.html#conclusion\">#</a>\n</h2>\n<p>Apache Airflow has been around for many years now. It is used by many large\ncompanies in production environments. The open source project has an active\ncommunity, and I expect that in the near future we will have an official\nTrinoHook with additional out-of-the-box functionality. While there might be a\nslight learning curve for new users I think that is worth it.</p>\n<p>On the Trino side there are some exciting enhancements for <a target=\"_blank\" href=\"https://trino.io/docs/current/admin/fault-tolerant-execution.html\">fault-tolerant\nexecution</a> on\nthe roadmap of Project Tardigrade that will make Trino and Airflow an even\nbetter combination.</p>\n<p>Stay tuned.</p>\n<p><em>Note from Trino community</em>: We welcome blog submissions from the community. If\nyou have blog ideas, send a message in the #dev chat. We will mail you\nTrino swag as a token of appreciation for successful submissions. Enter the <a target=\"_blank\" href=\"https://join.slack.com/t/trinodb/shared_invite/zt-1aek3l6bn-ZMsvFZJqP1ULx5pU17WP1Q\">Trino\nSlack</a>\nand join the conversation in the #project-tardigrade\n<a target=\"_blank\" href=\"https://join.slack.com/share/enQtMzc3OTczMzkxNDU0OC1mNzEyOWUzNjUyMTgyNDU3ZGJlYTZjYTllYTI1ZmFhMDBlMzYwZWQzOGVkMjhhOGNlMmQ5MWIxM2RmNzZjNWY0\">channel</a>.</p>\n<p><a target=\"_blank\" href=\"https://cutt.ly/airflow-reddit\">Discuss on Reddit</a></p>\n<p><a target=\"_blank\" href=\"https://news.ycombinator.com/item?id=32100426\">Discuss On Hacker News</a></p>\n  </div>\n</article>\n</div>"
---

The recent addition of the fault-tolerant
execution architecture,
delivered to Trino by Project Tardigrade, makes the use of Trino for running
your ETL workloads an even more compelling alternative than ever before. We’ve
set up a demo environment for you to easily give it a try in Starburst
Galaxy.
With Project Tardigrade providing an out-of-the-box solution with advanced
resource-aware task scheduling and granular retries at the task/query level, we still
need a robust tool to schedule and manage workloads themselves. Apache
Airflow is a great choice for this purpose.
Apache Airflow is a widely used workflow engine that allows you to schedule and
run complex data pipelines. Airflow provides many plug-and-play operators and
hooks to integrate with many third-party services like Trino.
To get started using Airflow to run data pipelines with Trino you need to
complete the following steps:
Install of Apache Airflow 2.10+
Install the TrinoHook
Create a Trino connection in Airflow
Deploy a TrinoOperator
Deploy your DAGs
Installing Apache Airflow in Docker
The best way to get you going, if you don’t already have an Airflow cluster
available, is to run Airflow in a container using docker compose. Just be
aware that this is not best practice for a production environment.
Requirements for the host:
Docker
Docker Compose 1.28+
Step 1) Create a directory named airflow for all our configuration files.

$ mkdir airflow


Step 2) In the airflow directory create three subdirectory called dags, plugins, and logs.

$ cd airflow
$ mkdir dags plugins logs


Step 3) Download the Airflow docker compose yaml file.

$ curl -LfO 'https://airflow.apache.org/docs/apache-airflow/stable/docker-compose.yaml'


Step 4) Create an .env configuration file:

$ echo -e "AIRFLOW_UID=$(id -u)" > .env
$ echo "AIRFLOW_GID=0" >> .env 


Step 5) Start the Airflow containers

$ docker-compose up -d


Installing the TrinoHook
If running Airflow in docker, you need to install the TrinoHook in
all the docker containers using the apache/airflow:x.x.x image.

$ docker ps 
CONTAINER ID   IMAGE                  PORTS                              NAMES
cffdfaeb757e   apache/airflow:2.3.0   0.0.0.0:8080->8080/tcp             airflow_airflow-webserver_1
b0e72f479a66   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-worker_1
4cdb11b3e5e3   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-triggerer_1
41d3c3107ddb   apache/airflow:2.3.0   0.0.0.0:5555->5555/tcp, 8080/tcp   airflow_flower_1
229a11e9cdd3   apache/airflow:2.3.0   8080/tcp                           airflow_airflow-scheduler_1
68160240857d   postgres:13            5432/tcp                           airflow_postgres_1
a96b98da85df   redis:latest           6379/tcp                           airflow_redis_1


To install the TrinoHook you run pip install apache-airflow-providers-trino in
the first five containers.  Run the following command replacing the container id of
each of the containers in your deployment.

$ docker exec -it <container_id> pip install apache-airflow-providers-trino


Once you have done that you need to restart all five containers:

$ docker container restart <container_id_1> ... <container_id_5>


Creating a Trino connection
After you have installed the TrinoHook and restarted Airflow you can create a
connection to your Trino cluster through the Airflow web UI.  If you just
installed Airflow, then go to http://localhost:8080 on your browser and login.
The default credentials unless changed are airflow for username and password.
Go to Admin > Connections.
Click on the blue button to Add a new record.
Select Trino from the Connection Type dropdown and provide the following information:
Connection Id
   Whatever you want to call your connection.
  
The hostname or host ip of your trino cluster, e.g., localhost, 10.10.10.1, or www.mytrino.com
  
Schema
   A schema in your Trino cluster.
  
Login
   The username of the user that Airflow uses to connect to Trino.  Best practice would be to create a service account like ‘airflow’. Just understand that this user access level is used to execute SQL statements in Trino.
  
Password
   The password of the user that Airflow uses to connect to Trino if authentication is enabled.
  
Port
   The port where the Trino Web UI can be accessed, e.g., 8080, 8443.
  
Extra
   Additional settings, like protocol:https if using TLS, or verify:false if you are using a self-signed certificate.
  
Be aware that the test button might not actually return any feedback for Trino connections.
Deploying a TrinoOperator
At the time of writing this article there is no TrinoOperator, so you have to
write your own.  You find an implementation in the following section, to get you started.  This operator allows you to
execute any SQL statements that Trino supports such as SELECT, INSERT, CREATE, SET SESSION, and others. You can run multiple statements in a single task so
they are part of a single Trino session.
To create the TrinoOperator use your favorite text editor to create a file called
trino_operator.py with the following code in it and place it in the
airflow/plugins directory you created earlier. Airflow automatically compiles the code and you are ready to start
writing DAGs.
For those new to Airflow, DAG (Directed Acyclic Graph) is a core Airflow
concept, a collection of tasks with dependencies and relationships that indicate
to Airflow how they should be executed. DAGs are written in Python.

from airflow.models.baseoperator import BaseOperator
from airflow.utils.decorators import apply_defaults
from airflow.providers.trino.hooks.trino import TrinoHook
import logging
from typing import Sequence, Callable, Optional

def handler(cur):
    cur.fetchall()

class TrinoCustomHook(TrinoHook):

    def run(
        self,
        sql,
        autocommit: bool = False,
        parameters: Optional[dict] = None,
        handler: Optional[Callable] = None,
    ) -> None:
        """:sphinx-autoapi-skip:"""

        return super(TrinoHook, self).run(
            sql=sql, autocommit=autocommit, parameters=parameters, handler=handler
        )

class TrinoOperator(BaseOperator):

    template_fields: Sequence[str] = ('sql',)

    @apply_defaults
    def __init__(self, trino_conn_id: str, sql, parameters=None, **kwargs) -> None:
        super().__init__(**kwargs)
        self.trino_conn_id = trino_conn_id
        self.sql = sql
        self.parameters = parameters

    def execute(self, context):
        task_instance = context['task']

        logging.info('Creating Trino connection')
        hook = TrinoCustomHook(trino_conn_id=self.trino_conn_id)

        sql_statements = self.sql

        if isinstance(sql_statements, str):
            sql = list(filter(None,sql_statements.strip().split(';')))

            if len(sql) == 1:
                logging.info('Executing single sql statement')
                sql = sql[0]
                return hook.get_first(sql, parameters=self.parameters)

            if len(sql) > 1:
                logging.info('Executing multiple sql statements')
                return hook.run(sql, autocommit=False, parameters=self.parameters, handler=handler)

        if isinstance(sql_statements, list):
            sql = []
            for sql_statement in sql_statements:
                sql.extend(list(filter(None,sql_statement.strip().split(';'))))

            logging.info('Executing multiple sql statements')
            return hook.run(sql, autocommit=False, parameters=self.parameters, handler=handler)


Deploying a DAG
Now that you have deployed the TrinoOperator you can start writing DAGs for your
data pipelines. Let’s write and deploy a simple sample DAG.  DAGs just like the
TrinoOperator are deployed into the airflow/dags
directory you created earlier.
Create a file called my_first_trino_dag.py with the following code, and save it in the airflow/dags directory.

import pendulum

from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from trino_operator import TrinoOperator

## This method is called by task2 (below) to retrieve and print to the logs the return value of task1
def print_command(**kwargs):
        task_instance = kwargs['task_instance']
        print('Return Value: ',task_instance.xcom_pull(task_ids='task_1',key='return_value'))

with DAG(
    default_args={
        'depends_on_past': False
    },
    dag_id='my_first_trino_dag',
    schedule_interval='0 8 * * *',
    start_date=pendulum.datetime(2022, 5, 1, tz="US/Central"),
    catchup=False,
    tags=['example'],
) as dag:

    ## Task 1 runs a Trino select statement to count the number of records 
    ## in the tpch.tiny.customer table
    task1 = TrinoOperator(
      task_id='task_1',
      trino_conn_id='trino_connection',
      sql="select count(1) from tpch.tiny.customer")

    ## Task 2 is a Python Operator that runs the print_command method above 
    task2 = PythonOperator(
      task_id = 'print_command',
      python_callable = print_command,
      provide_context = True,
      dag = dag)

    ## Task 3 demonstrates how you can use results from previous statements in new SQL statements
    task3 = TrinoOperator(
      task_id='task_3',
      trino_conn_id='trino_connection',
      sql="select { { task_instance.xcom_pull(task_ids='task_1',key='return_value')[0] } }")

    ## Task 4 demonstrates how you can run multiple statements in a single session.  
    ## Best practice is to run a single statement per task however statements that change session 
    ## settings must be run in a single task.  The set time zone statements in this example will 
    ## not affect any future tasks but the two now() functions would timestamps for the time zone 
    ## set before they were run.
    task4 = TrinoOperator(
      task_id='task_4',
      trino_conn_id='trino_connection',
      sql="set time zone 'America/Chicago'; select now(); set time zone 'UTC' ; select now()")

    ## The following syntax determines the dependencies between all the DAG tasks.
    ## Task 1 will have to complete successfully before any other tasks run.
    ## Tasks 3 and 4 won't run until Task 2 completes.
    ## Tasks 3 and 4 can run in parallel if there are enough worker threads. 
    task1 >> task2 >> [task3, task4]


Just like with the TrinoOperator DAGs are picked up and compiled by Airflow
automatically.  When Airflow fails to compile your DAG it displays an error
message at the top of the page in the main page where all the DAGs are listed.
You can refresh this page a few times until your DAG is either added to the list
or you see an error message.  You can expand the message to see the source of
the error.  Usually the information provided is enough to understand the issue.
Once the DAG shows up on your list you can trigger a manual run, using the play
button on the right to  activate your DAG.  I recommend switching to the Graph
view, using the action links on the right to see  how tasks change status as
they run.
You can see logs for each task by clicking on the corresponding box and selecting Log from the options at the top.
Check out the logs for the print_command task to see the return value of select statement from task_1
As you can see, output from print() commands can be found in these logs.
Conclusion
Apache Airflow has been around for many years now. It is used by many large
companies in production environments. The open source project has an active
community, and I expect that in the near future we will have an official
TrinoHook with additional out-of-the-box functionality. While there might be a
slight learning curve for new users I think that is worth it.
On the Trino side there are some exciting enhancements for fault-tolerant
execution on
the roadmap of Project Tardigrade that will make Trino and Airflow an even
better combination.
Stay tuned.
Note from Trino community: We welcome blog submissions from the community. If
you have blog ideas, send a message in the #dev chat. We will mail you
Trino swag as a token of appreciation for successful submissions. Enter the Trino
Slack
and join the conversation in the #project-tardigrade
channel.
Discuss on Reddit
Discuss On Hacker News
