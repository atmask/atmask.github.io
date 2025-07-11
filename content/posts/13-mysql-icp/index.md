---
title: 'Index Condition Pushdown Optimization in MySQL'
date: 2025-06-02T21:56:17-04:00
draft: false
tags: ["SRE", "Systems", "MySQL", "Optimization", "Architecture", "explainer", "DBA", "Databases"]
---
# Big Idea

Getting under the hood of database implementations is becoming an area of growing interest for me. Early in my career, I was always content with SQL as an interface to a datastore that "just works." That is, until it doesn't anymore. It's at those points that I am now being pushed to understand why a particular database implementation has certain behavioral characteristics in different circumstances. Further, I have never crossed paths with a professional DBA and often feel like there's a whole sphere of mystery for me here. As I plunge these depths for the first time, however, I find many of the same interesting aspects of design and layering that have made K8s of interest to me.

With that said, I'm kicking off what may become a series of DB-related posts with a short and niche post about MySQL's Index Condition Pushdown (ICP) optimization.

# Enough MySQL Architecture to be Dangerous

Before diving right into how ICP works, it's helpful to understand just enough MySQL architecture to be dangerous on the topic. While I will note for the sake of completeness that MySQL follows a client/server architecture, that is not the key part of MySQL that is important at the moment. What is important is the architecture of the MySQL server.

The MySQL server is split into two main layers: the MySQL server and the Storage Engine. MySQL was designed with a strong interface that separates the logical responsibilities of the relational database management system (parsing, optimization, caching) from the actual implementation of data storage on a particular medium. These two sides of the interface correspond to the server layer and the storage engine layer, respectively. The separation of the MySQL server application from the underlying storage implementation has allowed the MySQL community to create a pluggable storage engine layer with different implementations for disk storage, memory storage, and CSV storage. The most widely adopted engine at this time is the InnoDB engine.

# Optimizing Query Execution with Index Condition Pushdown (ICP)

Now that we have a basic grasp that MySQL architecture has distinct layers between the MySQL server and the lower-level storage engine plugin, it makes more sense to explain ICP. In its simplest form, ICP is an optimization in which the responsibility of filtering — which would normally be done by the MySQL server *after* the storage engine fetched and returned rows — is delegated to (i.e. pushed down to) the storage engine when the column being filtered on is part of a composite index for which the leftmost part of the index has been used in the selected key.

That's still a lot to unpack, so let's list that out one by one to understand the attributes of ICP:
- **Optimization**: Filtering at the storage engine layer rather than passing data back to the server is an optimization that reduces the amount of I/O a query performs. I/O is reduced because the storage engine *does not need to read the full row from disk* but can instead filter just based on the relevant index key.
- **Filtering on a Composite Index**: A composite index is an index of multiple ordered columns. For example, an index on just the `id` col is not composite but and index across (`id`, `uuid`) would be composite and the order of the cols in the index matters.
- **Directly Filtering the Leftmost Parts of the Index**: When querying, a composite index is useable by the optimizer iff a leftmost prefix of the index is specified in the WHERE clause of the query. This is known as the leftmost prefix rule.

To give a more precise picture of how this is an optimization it's important to understand how indexes are structured in MYSQL. The primary index is referred to as the clustered index. When you look up data on the primary index the result is a full disk read of the fetched row contained in the index. Secondary indicies, however, only contain the indexed columns and a pointer to the primary key in the clustered index. By enabling filtering at the storage engine layer, we are able to filter rows using the contents of the secondary index alone without the expensive IO that would be performed when getting all unfilitered rows that are part of the index range filter otherwise.

# Resources
- [High-Performance MySQL](https://www.oreilly.com/library/view/high-performance-mysql/9781449332471/ch01.html)
- [InnoDB Architecture](https://dev.mysql.com/doc/refman/8.4/en/innodb-architecture.html)
- [GeeksForGeeks: MySQL Architecture](https://www.geeksforgeeks.org/architecture-of-mysql/)
- [Yt: MySQL Architecture](https://www.youtube.com/watch?v=aKOaQfpW7to)
- [MySQL ICP](https://dev.mysql.com/doc/refman/8.4/en/index-condition-pushdown-optimization.html)
- [Leftmost Prefix Rule](https://dev.mysql.com/doc/refman/8.4/en/multiple-column-indexes.html#:~:text=If%20the%20table%20has%20a,if%20you%20have%20a%20three%2Dcolumn)
- [Clustered and Secondary Indexes](https://dev.mysql.com/doc/refman/8.4/en/innodb-index-types.html)
- [The Physical Structure of the InnoDB Index](https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html)
