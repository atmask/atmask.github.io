---
title: 'An Introduction to Async Programming in Python'
date: 2025-05-03T15:24:28-04:00
draft: false
---
# Big Idea

In this post I want to capture some introductory notes to async programming in Python. I want to capture the motivation for async programming, some examples of how async implemented in Python via the high-level apis of Python's stdlib async programming module: `asyncio`, and finally I want to explore the mechanics of the event loop which enable async programming.

# Motivation: The Problem of IO Bound Programs

The goal of Python's asyncio is module is improving the efficieny of IO bound programs. To understand what that means we need to understand the characteristics and the inefficiency of IO bound programs in the absennce of async programming apis.

First, an example. Imagine you are busy on a Saturday. You need to do dishes, do laundry, vaccum, and cook You could do all of these things as follows:
1. Load your laundry into the washer.
2. Go load the dishwasher.
3. Vaccum.
4. Rotate your laundy.
5. Start dinner prep.
6. Unload the dishwasher.
6. Unload the dryer.
This is logical! You are doing many things at once (**concurrently** will be our word to ralk about this) and importantly *when a task does not require your active attention* you spend your time on a task that does require your active attention and abilities. This is you, naturally adopting an asynchronous workflow. 

The above asynchronous workflow while intuitive in our daily lives is not often the default in programming. Many programs run inefficiently because they run sequentially. Let's reimagine our saturday:
1. Load your laundry and stand by the laundry machine until the washer is done.
2. Rotate the laundry into the dryer and wait for the dryer to complete.
3. Vaccum.
4. Load the dishwasher and wait watching the dishwasher until it completes.
5. Make dinner.
This is a totally differen and ridiculous way to imagine spending your Saturday. Without asynchronous work you waste incredible amounts of time waiting on tasks to complete. That time spent waiting, time where your *active attention and energy are not actively needed* for the task, result in you wasting your time which could be better spent on other things you need to do.

The problems of our second scenario are the problems of IO bound programs that are written to run sequentially (i.e. not asynchronously). When we talk about asynchronus programs, what we mean is programs that are written in such a way that *they identify units of work which do not at all points require the active resources* of the computer. By and large, a program running on a computer does not require the computer's active resources when it makes an IO request. Examples of IO requests could include reading from disk or sendign a request out to another computer across a network and waiting on a response from that computer (ex. http, database query, cache check, etc.). When a program is responsible for a large amount IO work then we say it is IO bound.


## Introducing `asnycio`
AsyncIO is the Python Standard Library's async programming module. It was first added in Python 3.4. In Python 3.5, the async/await syntax was added. What we will look at in this section is a simple use case of the async module.


# Peeling the Onion: Generators and Coroutines



# Event Loop Mechanics
Python ships with two stdlip event loop implementations. These are the: [SelectorEventLoop](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.SelectorEventLoop) and [ProtractorEventLoop](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.ProactorEventLoop). Both implementations are subclasses of the [AbstractEventLoop](https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.AbstractEventLoop).





## Supplementary: Demarcating the types of Concurrency

- Parallelism
- Concurrency
- Processes
- Threads
- 



# Resources
- [What the Heck is the Event Loop Anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ): This video, although based on the JS event loop, is a great visual introduction to the concepts of an event loop driven program
- [Demystifying AsyncIO: Building Your Own Event Loop](https://www.youtube.com/watch?v=Ww2HBNpu98g): EuroPycon Overview of building a Python Event Loop
- [Getting Started with Async Features in Python](https://realpython.com/python-async-features/)
- [AsyncIO in Python: A Complete Walkthrough](https://realpython.com/async-io-python)


basically all calls to `await fn` are  equivalent to `yield` calls from generators. The event loops starts the task and then event yeilds a callback to thevent loop. This yield means that the async function suspends it context and hands control back to the event loop
