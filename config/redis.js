import redis from 'redis'
import { promisify } from 'util'
import dotenv from 'dotenv'
dotenv.config()

const host = process.env.REDIS_HOST || 'localhost'
const port = process.env.REDIS_PORT || '6379'

const client =
  host && port ? redis.createClient(port, host) : redis.createClient()

client.on('connect', function () {
  console.log(`redis is running on ${host}:${port}`)
})

client.on('error', function (err) {
  console.log('Error ' + err)
})

client.getAsync = promisify(client.get).bind(client)
client.delAsync = promisify(client.del).bind(client)

export default client
