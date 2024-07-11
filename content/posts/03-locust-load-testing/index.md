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

> 🛠️ **Note:** If you don't care to use `poetry` you can also just add a venv using `python -m venv .venv` and set up the following `requirements.txt` file for something quick and easy:
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


