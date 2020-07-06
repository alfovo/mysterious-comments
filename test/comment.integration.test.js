import knexClient from '../config/knexClient'
import server from '../index'
import request from 'supertest'

describe('happy path routes integration tests', () => {
  const content = 'holy cow!'
  beforeEach(() => {
    return knexClient.migrate.rollback().then(() => {
      return knexClient.migrate.latest()
    })
  })

  afterEach(() => {
    return knexClient.migrate.rollback()
  })

  // I'm still getting a TCPSERVERWRAP, rats!
  afterAll((done) => {
    return server && server.close(done)
  })

  fit('creates a comment, route POST comments/', async () => {
    const response = await request(server).post('/comments').send({ content })
    expect(response.status).toEqual(200)
    expect(JSON.parse(response.text)).toHaveProperty(
      'message',
      'Comment 1 successfully added to database.'
    )
  })

  it('gets all comments, route GET comments/', async () => {
    await request(server).post('/comments').send({ content })
    await request(server).post('/comments').send({ content })
    const response = await request(server).get('/comments')
    expect(response.status).toEqual(200)
    expect(JSON.parse(response.text).length).toBe(2)
    expect(JSON.parse(response.text)[0]).toHaveProperty('content', content)
  })

  it('gets a comment, route GET comments/:id', async () => {
    await request(server).post('/comments').send({ content })
    const response = await request(server).get('/comments/1')
    expect(response.status).toEqual(200)
    expect(JSON.parse(response.text)[0]).toHaveProperty('content', content)
  })

  it('deletes a comment, route DELETE comments/:id', async () => {
    await request(server).post('/comments').send({ content })
    const response = await request(server).delete('/comments/1')
    expect(response.status).toEqual(200)
    expect(JSON.parse(response.text)).toHaveProperty(
      'message',
      'Comment was deleted successfully.'
    )
  })
})
