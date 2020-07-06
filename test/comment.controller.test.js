import CommentService from '../src/services/comment.service'
import CommentController from '../src/controllers/comment.controller'
jest.mock('../src/services/comment.service')

function mockContext() {
  const ctx = {}
  ctx.status = jest.fn().mockReturnValue(ctx)
  ctx.body = jest.fn().mockReturnValue(ctx)
  return ctx
}

function mockRequest() {
  const request = {}
  request.body = jest.fn().mockReturnValue(request)
  request.params = jest.fn().mockReturnValue(request)
  return request
}

function mockResponse() {
  const res = {}
  res.send = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('commentController', () => {
  let commentController, testData, commentId, fakeError, ctx, request, res, red

  beforeAll(() => {
    testData = [
      {
        id: 1,
        content: 'Yo whats up? This app is so crazy.',
        created_at: '2020-07-03T00:47:47.000Z',
        updated_at: '2020-07-03T00:47:47.000Z',
      },
      {
        id: 2,
        content: 'I know, but what can you do?',
        created_at: '2020-07-03T01:17:33.000Z',
        updated_at: '2020-07-03T01:17:33.000Z',
      },
      {
        id: 3,
        content: 'whatcha think?',
        created_at: '2020-07-03T18:33:38.000Z',
        updated_at: '2020-07-03T18:33:38.000Z',
      },
    ]
    commentId = 13
    fakeError = 'MySQL: Give Up Your Inquiries Which Are Completely Useless'
  })

  beforeEach(() => {
    request = mockRequest()
    res = mockResponse()
    ctx = { request, res }
    ctx.params = {}
    CommentService.mockImplementation(() => {
      return {
        getAll: () => Promise.resolve(testData),
        get: () => Promise.resolve(testData[0]),
        create: (content) => Promise.resolve(commentId),
        remove: () => Promise.resolve(1),
      }
    })
    commentController = new CommentController()
  })

  it('can get all comments', async () => {
    await commentController.getAll(ctx)
    expect(ctx.body).toBe(testData)
  })

  it('returns error if it cannot get all comments', async () => {
    CommentService.mockImplementation(() => {
      return {
        getAll: () => {
          throw new Error(fakeError)
        },
      }
    })

    await commentController.getAll(ctx)
    expect(ctx.body.message).toBe(fakeError)
  })

  it('will not create an empty comment', async () => {
    await commentController.create(ctx)
    expect(ctx.status).toBe(400)
    expect(ctx.body.message).toBe('Content can not be empty.')
  })

  it('can create a comment', async () => {
    const newComment = 'I have the information you seek.'
    ctx.request.body.content = newComment
    await commentController.create(ctx)
    expect(ctx.body.message).toBe(
      `Comment ${commentId} successfully added to database.`
    )
  })

  it('returns general error when it cannot create a comment', async () => {
    CommentService.mockImplementation(() => {
      return {
        create: (content) => {
          throw new Error(fakeError)
        },
      }
    })
    ctx.request.body.content = 'I have the information you seek.'
    await commentController.create(ctx)
    expect(ctx.status).toBe(500)
    expect(ctx.body.message).toBe(fakeError)
  })

  it('can get a comment by id', async () => {
    ctx.params.id = commentId
    await commentController.get(ctx)
    expect(ctx.body).toBe(testData[0])
  })

  it('returns 404 with useful error when cannot find comment', async () => {
    CommentService.mockImplementation(() => {
      return {
        get: () => Promise.resolve(0),
      }
    })
    ctx.params.id = commentId
    await commentController.get(ctx)
    expect(ctx.body.message).toBe(`Comment with id ${commentId} not found.`)
  })

  it('can delete a comment', async () => {
    ctx.params.id = commentId
    await commentController.remove(ctx)
    expect(ctx.body.message).toBe('Comment was deleted successfully.')
  })

  it('returns 404 with useful error when cannot find comment to delete', async () => {
    CommentService.mockImplementation(() => {
      return {
        remove: () => Promise.resolve(0),
      }
    })
    ctx.params.id = commentId
    await commentController.remove(ctx)
    expect(ctx.status).toBe(404)
    expect(ctx.body.message).toBe(`Comment with id ${commentId} not found.`)
  })

  it('returns general error when cannot delete a comment', async () => {
    CommentService.mockImplementation(() => {
      return {
        remove: () => {
          throw new Error(fakeError)
        },
      }
    })
    ctx.params.id = commentId
    await commentController.remove(ctx)
    expect(ctx.status).toBe(500)
    expect(ctx.body.message).toBe(
      `Could not delete comment with id ${commentId}.`
    )
  })
})
