---
title: 'Index Condition Pushdown Optimization in MySQL'
date: 2025-06-02T21:56:17-04:00
draft: false
tags: ["SRE", "Systems", "MySQL", "Optimization", "Architecture", "explainer", "DBA", "Databases"]
---
# Big Idea

Getting under the hood of database implementations is starting to become an area of growing interest to me. Early in my career I was always content with SQL as an interface to datastore that 'just works'. That is, until it doesn't anymore. It's at those points that I am now being pushed to understand why a particular database implementation has particular behaviour charatersitics in different circumstances. Further, I have never crossed-paths with a professional DBA and oftentimes feel left like there's a whole sphere of mystery for me here. As I plunge these depths for the first time, however, I find much of the same interesting aspects of design and layering that have made K8s of interest to me. 

With that said, I'm kicking off potentially a series of DB related posts with a short and niche post about MySQL's Index Condition Pushdown (ICP) optimization.


# Enough MySQL Architecture to be Dangerous

Before diving right into how ICP works it's helpful to understand just enough MySQL architecture to be dangerous on the topic. While I will note for the sake of completeness that MySQL follows a client/server architecture, that is not the key part of MySQL that is of importance at the moment. What is important is the architecture of the MySQL server.

The MySQL server is split into two main layers: the MySQL server and the the Storage Engine. MySQL was designed with a strong interface that segarates the logical responsbilities of the relationsal database management (parsing, optimization, caching) from the actual implementation of data storage to a particular medium. These two sides of the interface correspond the server layer and storage engine layer respectively. The spearation of the MySQL server application from underlying storage implementation has allowed theMySQL community to create pluggable storage engine layer with different implementations of disk storage, memory storage, and csv storage. The most widely adopted engine at this time is the InnoDB engine. 


# Optmizing Query Execution with Index Condition Pushdown (ICP)

Now that we have a basic grasp that MySQL architecture has distinct layers between the MySQL server and the lower-level storage engine plugin it makes more sense to explain ICP. In it's simplest form, ICP is an optimization in which the responsibility of filtering which would normally be done by the mysql server _after_ the storage engine fetched and returned rows is delegated to (i.e. pushed down) to the storage engine when that column being filtered on is part of a composite index for which the left most part of the index has been used in the selected key.

That's still a lot to unpack so let's list that out one by one to understand the attributes of ICP:
- **Optimiaztion**: Filtering at the storage engine layer rather than passing data back to the server is an optimization that reduces the amount of IO a query performs. IO is reduced because the storage engine _does not need to read the full row from disk_ but can instead filter just based on the relevant index key.
- **Filtering on a Composite Column**:
- **Directly Filtering the left-most parts of the index**:




# Resources
- [High-Performance MySQL](https://www.oreilly.com/library/view/high-performance-mysql/9781449332471/ch01.html)
- [InnoDB Architecture](https://dev.mysql.com/doc/refman/8.4/en/innodb-architecture.html)
- [GeeksForGeeks: MySQL Architecture](https://www.geeksforgeeks.org/architecture-of-mysql/)
- [Yt: MySQL Architecture](https://www.youtube.com/watch?v=aKOaQfpW7to)
- [MySQL ICP](https://dev.mysql.com/doc/refman/8.4/en/index-condition-pushdown-optimization.html)
