import knex from '../config/knexfile'
import redisClient from '../config/redis'

export default class CommentService {
  async create(content) {
    return knex('comment').insert({
      content,
    })
  }

  async getAll() {
    return knex.select().table('comment')
  }

  async get(id) {
    const cachedComment = await redisClient.getAsync(id)
    if (cachedComment) {
      return JSON.parse(cachedComment)
    } else {
      const dbComment = await knex('comment').where('id', id)
      if (dbComment.length) {
        await redisClient.set(id, JSON.stringify(dbComment))
        return dbComment
      } else return
    }
  }

  async remove(id) {
    const deleted = await knex('comment').where('id', id).del()
    await redisClient.delAsync(id)
    return deleted
  }
}
