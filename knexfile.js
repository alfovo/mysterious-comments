const dotenv = require('dotenv').config()

const host = process.env.DB_HOST
const user = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME
const config = {
  client: 'mysql',
  connection: {
    user,
    password,
    database,
  },
  migrations: {
    directory: 'src/migrations',
  },
}

module.exports = config
