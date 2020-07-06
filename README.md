# mysterious-comments

a simple API in node to store anonymous comments in a SQL db, only GET, POST and DELETE available.

- has a simple cache layer (redis) ✅
- no ORMs ✅
- uses es6, es7 syntax ✅
- Grapql ✅
- look ma, no express! ✅

## Prerequisites

1. Make sure you have MySQL and Redis installed and running.

2. Create a `.env` file in your config directory and set the following variables to allow the app to connect with MySQL. You can copy the variables from the `config/example.env` file into a new `.env` file and then set at minimum:

- DB_HOST
- DB_USERNAME
- DB_PASSWORD
- DB_NAME

You can also set custom values for `REDIS_HOST`, `REDIS_PORT`, if you'd like to use something other than the default 'localhost' and '6379' for port and host respectively. The app will run on 7555 unless you set `APP_PORT`.

3. Once you have installed the dependencies via `npm install`, please run:

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

Please note that the tests tear down the comments table after running, so you'll need to run the latest migration after running the tests to be able to start the app.

## GraphQL

To run GraphQL queries, you can go to wherever the server is running, i.e. `http://localhost:7555/` in your browser to access the graphiQL interface.

To look at the listed content of all your comments run the following query in your graphiQL interface:

```
{
  comment {
    id
    content
  }
}
```

To look at a specific comment by id you can run:

```
{
  comment(id: 2) {
    id
    content
  }
}
```

Add a new comment:

```
mutation {
  addComment(content: "pls mysq, no!") {
    content
  }
}
```

or remove a comment:

```
mutation {
  removeComment(id: 2) {
    content
  }
}
```

I'm not as familiar with GraphQL best practices as I would like, so hopefully the error handling or schema definition isn't too unusual.

## Koa REST API

There is also a more conventional REST api with the following endpoints:

```
POST comments/
GET comments/
GET comments/:id
DELETE comments/:id
```

## Why I chose MySQL over PostgreSQL

The advantages of MySQL over PostgreSQL are that MySQL is incredibly easy to install and set up, and is notably more popular than PostgreSQL. Its disadvantages are that it's not as fully SQL standard compliant as PostgreSQL and while it performs well with read-heavy operations, concurrent read-writes can be problematic at large data volumes.

Since I am building a fun, simple, low traffic API for mysterious posters, I don't think the likelihood of encountering read-write concurrency issues is very high, nor do I think I will need a more fully SQL compliant DBMS than MySQL.

## Why I used knex

Although it's a bit overkill for this project, I used knex to access the MySQL database and knex migrations to create the comment database schema. In general, I feel strongly about making schema changes programmatically, having a history of schema updates, and being able to rollback schema changes. Most importantly for this project, I wanted to make it as easy as possible for project collaborators to set up their database and test out the API. Finally, I consider knex to be a query builder and not an ORM because it's at a lower level of abstraction than an ORM and doesn't directly map a record in our relational database to an object in our application. In retrospect I wish I had used the simple mysql database driver for this particular assignment.

## How I chose my cache writing policy

I considered three cache writing policies: the cache-aside, the write-through, and the write-back. I ruled out the write-back method because it's the most difficult to implement of the other three options, as it would require another service to sync the cache and database asynchronously. When deciding between write-through and cache-aside, I weighed whether my comment API would most likely be part of a write-heavy or read-heavy application.

I imagine my comment API backing a front-end that displays a queue of comments with the option to post a new comment. After posting a comment, the user would want to see an updated queue of comments with their recently written comment posted at the top. Each post to add a comment would result in a subsequent call to get an updated list of all the comments. Also, some users might even want to view the comments without posting.

Given this possible use of my API, wherein it writes and then re-reads data frequently, I am inclined to use a write-through caching policy with a slightly higher write latency but low read latency. However, the drawbacks of using the cache as the primary data source to read and write were enough to change my mind. As a cache, Redis is not designed to be resilient like an RDBMS, so changes to the data could be lost before they can be replicated to MySQL. For our hypothetical anonymous forum, I don't think performance improvements from caching are worth risking data loss. I think pagination would be a better way to improve the performance of the getAll comments endpoint than caching all the comment data in Redis. Plus, although it is unlikely because the comment data is simple and I imagine the comments themselves will not be numerous, caching all that data could be expensive.

So I decided to use the famous cache-aside pattern! The API will check the cache for individual reads, and if the comment isn't in the cache, it will search the database, and if the comment is in the database, update the cache and return the comment. We don't search the cache when listing all comments; instead, we query the database directly. For mutable operations, the API will update MySQL and only update Redis in the case of deletes. I won't spend too long mentioning the drawbacks of the cache-aside algorithm, but suffice to say it can guarantee eventual consistency if MySQL and Redis never fail. The edge case I'm most worried about is when a process is killed after deleting a record in MySQL but before deleting an entry in Redis. In this case, if the user retries the delete, the API will try again to delete the entry in Redis.

## For the future

If I had more time to work on this app I'd think harder about my tests and write tests for the caching logic or GraphQL layer. I would also solve the very annoying `TCPSERVERWRAP` problem in my integration tests.
