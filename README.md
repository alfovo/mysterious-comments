# mysterious-comments

a simple API in node to store anonymous comments in a SQL db, only GET, POST and DELETE available.

## Prerequisites

To run, please first create a `.env` file at the top level of your directory and set the following variables to allow the app to connect with MySQL. You can copy the variables from the `config/example.env` file into a new `.env` file and them set them:

- DB_HOST
- DB_USERNAME
- DB_PASSWORD
- DB_NAME

If you don't set DB_NAME it will default to a database called `comments_mc_vice`. You can also set `REDIS_HOST` and `REDIS_PORT` if you'd like to use something other than the default 'localhost' and '6379' for port and host respectively.

Once you have set the env variables above and you have installed the dependencies via `npm install`, please run:

```
npx knex migrate:latest
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

The advantages of MySQL over PostgreSQL is that it's incredibly easy to install, set up and it is notably more popular that PostgreSQL. It's disadvantages are that it's not as fully SQL standard compliant and that while it performs well with read-heavy operations, concurrent read-writes can be problematic at large data volumes.

Since I'm assuming this is just a fun little site for mysterious posters, I don't think I need to worry about read-write concurrency issues at large volumes and since the operations we're performing from this API are simple, I don't think we need a more fully SQL compliant DBMS than MySQL. I think it's ok to prioritize ease of use for this use case.
