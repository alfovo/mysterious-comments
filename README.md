# mysterious-comments

a simple API in node to store anonymous comments in a SQL db, only GET, POST and DELETE available

Uses:

- a simple cache layer (redis)
- Grapql
- look ma, no express!

## Why I chose MySQL over PostgreSQL

The advantages of MySQL over PostgreSQL is that it's incredibly easy to install, set up and it is notably more popular that PostgreSQL. It's disadvantages are that it's not as fully SQL standard compliant and that while it performs well with read-heavy operations, concurrent read-writes can be problematic at large data volumes.

Since I'm assuming this is just a fun little site for mysterious posters, I don't think I need to worry about read-write concurrency issues at large volumes and since the operations we're performing from this API are simple, I don't think we need a more fully SQL compliant DBMS than MySQL. I think it's ok to prioritize ease of use for this use case.
