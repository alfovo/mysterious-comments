import knexClient from '../../config/knexClient'
import { host, port } from '../../config/redisConfig'
import Redis from 'ioredis'

export default class CommentService {
  constructor() {
    this.redisClient = new Redis(port, host)
  }
  async create(content) {
    return knexClient('comment').insert({
      content,
    })
  }

  async getAll() {
    return knexClient.select().table('comment')
  }

  async get(id) {
    const cachedComment = await this.redisClient.get(id)
    if (cachedComment) {
      return JSON.parse(cachedComment)
    } else {
      const dbComment = await knexClient('comment').where('id', id)
      if (dbComment.length) {
        await this.redisClient.set(id, JSON.stringify(dbComment))
        return dbComment
      } else return
    }
  }

  async remove(id) {
    const deleted = await knexClient('comment').where('id', id).del()
    await this.redisClient.del(id)
    return deleted
  }
}
