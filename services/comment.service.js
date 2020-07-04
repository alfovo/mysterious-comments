import knex from '../config/knexfile'
import redisClient from './config/redis'

export default class CommentService {
  create(content) {
    return knex('comment').insert({
      content,
    })
  }

  getAll() {
    return knex.select().table('comment')
  }

  remove(id) {
    return knex('comment').where('id', id).del()
  }
}
