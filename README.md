# mysterious-comments

a simple API in node to store anonymous comments in a SQL db, only GET, POST and DELETE available.

- a simple cache layer (redis) ✅
- Grapql
- look ma, no express! ✅

## Prerequisites

Make sure you have MySQL and Redis installed and running.

To run, please first create a `.env` file at the top level of your directory and set the following variables to allow the app to connect with MySQL. You can copy the variables from the `config/example.env` file into a new `.env` file and them set them:

- DB_HOST
- DB_USERNAME
- DB_PASSWORD
- DB_NAME

If you don't set DB_NAME it will default to a database called `comments_mc_vice`. You can also set `REDIS_HOST` and `REDIS_PORT` if you'd like to use something other than the default 'localhost' and '6379' for port and host respectively.

Once you have set the env variables above and you have installed the dependencies via `npm install`, please run:

```
npm run migrations
```

to set up your database with the `comment` table.

## To run

You can run the app with:

```
npm run start
```

And to run the tests, run:

```
npm run test
```

## Why I chose MySQL over PostgreSQL

The advantages of MySQL over PostgreSQL are that MySQL is incredibly easy to install and set up, and MySQL is notably more popular than PostgreSQL. Its disadvantages are that it's not as fully SQL standard compliant and that while it performs well with read-heavy operations, concurrent read-writes can be problematic at large data volumes.

Since this is just a fun, low traffic site for mysterious posters, it will never reach the data volume that can cause read-write concurrency issues, and since the operations we're performing from this API are simple, I don't think we need a more fully SQL compliant DBMS than MySQL.

## How I chose my cache writing policy

I considered three cache writing policies: the cache-aside, the write-through, and the write-back. I ruled out the write-back method because it's the most difficult to implement of the other three options, as it would require another service to sync the cache and database asynchronously. When deciding between write-through and cache-aside, I weighed whether my comment API would most likely be write-heavy or read-heavy.

I imagine my comment API is most likely to back a front-end that displays a queue of comments with the option to post a new comment. After posting a comment, the user would want to see an updated queue of comments with their recently written comment posted at the top. Each post to add a comment would result in a subsequent call to get an updated list of all the comments. Also, some users might even want to view the comments without posting.

Given this possible use of my API, wherein it writes and then re-reads data frequently, I am inclined to use a write-through caching policy with a slightly higher write latency but low read latency. However, the drawbacks of using the cache as the primary data source to read and write were enough to change my mind. As a cache, Redis is not designed to be resilient like and RDBMS, so changes could be lost before they can be replicated to MySQL. For our hypothetical anonymous forum, I don't think performance improvements from caching are worth risking data loss. I think pagination would be a better way to improve the performance of the getAll comments endpoint than caching all the comment data in Redis. Plus, although it is unlikely because the comment data is simple and I imagine the comments themselves will not be numerous, caching all that data could be expensive.

So I decided to use the famous cache-aside pattern! The API will check the cache for individual reads, and if the comment isn't in the cache, it will search the database, and if the comment is in the database, update the cache and return the comment. We don't search the cache when listing all comments; instead, we query the database directly. For mutable operations, the API will update MySQL and only update Redis in the case of deletes. I won't spend too long mentioning the drawbacks of the cache-aside algorithm, but suffice to say it can guarantee eventual consistency if MySQL and Redis never fail. The edge case I'm most worried about is when a process is killed after deleting a record in MySQL but before deleting an entry in Redis. In this case, if the user retries the delete, the API will try again to delete the entry in Redis.

## Why I used kinex
