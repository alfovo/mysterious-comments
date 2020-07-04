import redis from 'redis'

const host = process.env.REDIS_HOST
const port = process.env.REDIS_PORT

const redisClient =
  host && port ? redis.createClient(port, host) : redis.createClient()

export default redisClient
