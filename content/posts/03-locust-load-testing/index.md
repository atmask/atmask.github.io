---
title: 'Load Testing Applications with Locust'
tags: ["cloud", "load testing", "locust", "SRE", "python", "poetry"]
ShowToc: true
date: '2024-07-10T21:22:31-04:00'
draft: true
---
# Big Idea

I was recently tasked with configuring automated load tests to validate the health of a service under load and to identify bottlenecks and limits at which the service became overloaded. Up until this point, I had not worked first-hand with any load testing frameworks. Although there are many great load testing tools out there like JMeter, K6s, and Locust, I decided to get started with Locust as it is a framework I had heard of before and is a pure Python framework (Python is the language I think in right now). To rewind, load testing frameworks allow engineers to programmatically produce stress on a system by simulating a large volume of incoming requests to that system. Requests can be, but are not limited to, HTTP calls. You can also load test with gRPC or IoT protocols like MQTT. Locust is an open-source Python-based load testing framework. With Locust, all user behaviour is defined in Python code and tests can be executed from a single machine or distributed across many machines.

If you'd like to borrow a template for starting a Locust project, you can find my Locust boilerplate project on GitHub: https://github.com/atmask/locust-template

# Setting Up my First Locust Project

When setting up my Locust project, I decided to manage my project with `poetry`. `poetry` is a tool for managing the different apsect of python projects, such as dependencies and packaging, in a deterministic way.

To get started, I set up the following basic project structure:
```plaintext
locust-tests
│
├── LoadTests
│   ├── __init__.py
│   ├── locustfile.py
│   └── settings.py
└── README.md
```
> **Note:** # Do not worry about the contents of the `LoadTests/` dir. I have added them but for now the files can be left blank

## Installing Dependencies and Virtual Environment Setup

I won't go into detail about the installation and general usage of `poetry` here, but will provide the steps to get the project up and running. 

> 🛠️ **Note:** If you don't care to use `poetry`, you can also just add a venv using `python -m venv .venv` and set up the following `requirements.txt` file for something quick and easy:
>  ```bash
>  # requirements.txt file
>  locust
>  ```

First, initialize the new `poetry` managed project from `/locust-tests`:
```bash
poetry init
```

I like to have my virtual environment contained within my project so I also add a `poetry.toml` file to the root of my project with:
```toml
[virtualenvs]
in-project = true
```

Finally, you can add the dependencies using `potery add`. This will install the package along with its dependencies and store the dependencies in the `pyproject.toml` file and a `poetry.lock` file.
```bash
poetry add locust
```

Your project structure should now resemble the following:

```plaintext
locust-tests
│
├── LoadTests
│   ├── __init__.py
│   ├── locustfile.py
│   └── settings.py
├── README.md
├── poetry.lock
├── poetry.toml
├── pyproject.toml
└── struct.txt
```

## Writing a Simple Locust Test

To get started let's write a simple test that visits the main page for a website. To do this we have to write a class that represents  some type of "user" of the system. We will hive this user behaviours by writing functions and decorating those functions with `@task` decorator. When Locust runs, it will, by default, find all of the defined User classes in `locutfile.py` and randomly execute the `@task` decorated functions.

Here is an example for a first test. This example User class extends Locust's base HttpUser class and defines a behvaiour/task for visiting the root page of a site.

```python
# locustfile.py
from locust import HttpUser, task

class WebUser(HttpUser):
    @task
    def visit_main_page(self):
        '''Visit the main page of the domain'''
        self.client.get("/")
```

You may notice that the `GET` request does not sepcify a domain or scheme. This is because the Locust UI allows you ton configure domain you will run requests against interactively. Locust then builds and `Environment` object that gets passed ot the `HttpUser` class (and any class that extends it) in the constructor. The `client` then automatically uses the configured the domain as the base url for the requests.

You can now launch the Locust server run this first Locust test!
```bash

## If you are using poetry
poetry shell

## If you are using a venv
. .venv/bin/activate

## Enter the project containing the locustfile.py and run the locust server
cd LoadTests/
locust

## Expected output
>>> Starting web interface at http://0.0.0.0:8089
```

You should be able to navigate to the above url in your browser and see the Locust UI.
![Locust Dashboard](images/locust-dashboard.png) 


## Managing Different Types of Application Use Cases

In reality, you'll want to add more complex behaviours to your load tests. You likely also want to group the behaviours/task that you are automating to run against your server into different groups of user classes. This will let you define the behaviours of users in different scenarios such as an unathenticated user vs an authenticated user.

I will provide a project structure that seems scalable and maintable to me from a code perspective for expanding to this next part of developing a Locust project.



## Managing Authentication and Secrets

