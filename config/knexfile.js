import knex from 'knex'
import dotenv from 'dotenv'
dotenv.config()

const host = process.env.DB_HOST || 'localhost'
const user = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME || 'comments_mc_vice'

export default knex({
  client: 'mysql',
  connection: {
    user,
    password,
    database,
  },
})
