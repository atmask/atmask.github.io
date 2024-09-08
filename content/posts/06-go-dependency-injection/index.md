---
title: 'Dependency Injection In Go'
tags: ["go", "SOLID", 'dependency injection', 'clean architecture']
ShowToc: false
date: '2024-09-07T19:57:08-04:00'
draft: false
---
# Big Idea

Dependency Injection (the 'D' in SOLID design principles) is an important practice in good software architecture. When used well, it decouples a class's dependency on a certain interface from any one particular implementation of that dependency. This means that any class which implements the common interface of the dependency can be injected into the class at runtime for easy configuration. This is especially helpful when it comes to creating stubs for mocking when writing unit tests.

I've recently started learning Go. A very helpful companion for that journey has been Alex Edward's book [Let's Go](https://lets-go.alexedwards.net). In the book, Edwards walks through using dependency injection for managing global application configurations, such as logging, when writing a web server in Go. My goal in this post is to capture those ideas here so in a way that is helpful for me to come back to later on.


# Go: Dependency Injection

Go is not an object-oriented language like Python or Java. The construct of an object does not exist. However, like C, Go supports defining `structs`. A `struct` is a `Type` that is defined by a collection of fields. Here is an example:
```go
package main

import "fmt"

type Vertex struct {
	X int
	Y int
}

func main() {
	fmt.Println(Vertex{1, 2})
}
```

Now, because Go does not have objects does not mean you can give functionality to a `struct`. In Go you can define methods on a struct. Methods are just normal functions, except for the fact that they specify a special *receiver* argument that is specified between the `func` keyword and the function name.

```go
package main

import (
	"fmt"
	"math"
)

type Vertex struct {
	X, Y float64
}

func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main() {
	v := Vertex{3, 4}
	fmt.Println(v.Abs())
}
```

> In the above example the method is passed by value. It is more common to see the type of a receiver as a pointer so that the receiver instance can be changed. In this case, the receiver would be `(v *Vertex)`

What we can say about methods is that *they are executed in the context of a struct instance*. This means that the configuration of a particular struct can configure the methods it used. This configurability is important because this is how dependency injection (DI) works in Go.

Suppose we were making a Go program that stores data from an event to some data source. That data source could be a DB but maybe we want the flexibility to change the backing data source over time from SQL to NoSQL or from MySQL to Postgres or even to send it out to another service. Let's look at an example using DI to see how we could achieve this:

```go

// Define an interface for any backing repository
type IRepository interface {
    Store(string) error
}

// Allow any struct that implements the reposiory interface be injected into the Application
type Application struct{
	Repository *IRepository
}

func (app *Application) processEvent(s string) error {
    // Use the injected instance
    if err := app.Repository.Store(s); err != nil {
        return err
    }
    return nil
}
```

In the above example, you will see that we create an interface called `IRepository` that provides a set of methods that need to be defined for a struct to satisfy the interface. In this case, one method is defined: `Store(string)`. An `Application` struct can then be initialized with any struct whose methods satisfy the `IRepository` interface. It's easy to imagine many structs that could implement the `IRepository` interface such as a MongoClient struct, PostgresClient struct or even a struct that writes data that should be stored to a file or stdout.

