import CommentService from '../services/comment.service'
import CommentController from '../controllers/comment.controller'
jest.mock('../services/comment.service')

function mockRequest() {
  const req = {}
  req.body = jest.fn().mockReturnValue(req)
  req.params = jest.fn().mockReturnValue(req)
  return req
}

function mockResponse() {
  const res = {}
  res.send = jest.fn().mockReturnValue(res)
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('commentController', () => {
  let req, res, commentController, testData, commentId, fakeError

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
    req = mockRequest()
    req.params.id = 1
    res = mockResponse()
    CommentService.mockImplementation(() => {
      return {
        getAll: () => Promise.resolve(testData),
        create: (content) => Promise.resolve(commentId),
        remove: () => Promise.resolve(1),
      }
    })
    commentController = new CommentController()
  })

  it('can get all comments', async () => {
    await commentController.getAll(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json.mock.calls.length).toBe(1)
    expect(res.json).toHaveBeenCalledWith(testData)
  })

  it('returns error if it cannot get all comments', async () => {
    CommentService.mockImplementation(() => {
      return {
        getAll: () => {
          throw new Error(fakeError)
        },
      }
    })

    await commentController.getAll(req, res)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({ message: fakeError })
  })

  it('will not create an empty comment', async () => {
    await commentController.create(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      message: 'Content can not be empty.',
    })
  })

  it('can create a comment', async () => {
    const newComment = 'I have the information you seek.'
    req.body.content = newComment
    await commentController.create(req, res)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.send).toHaveBeenCalledWith({
      message: `Comment ${commentId} successfully added to database`,
    })
  })

  it('returns general error when it cannot create a comment', async () => {
    CommentService.mockImplementation(() => {
      return {
        create: (content) => {
          throw new Error(fakeError)
        },
      }
    })
    req.body.content = 'I have the information you seek.'
    await commentController.create(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.send).toHaveBeenCalledWith({ message: fakeError })
  })

  it('can delete a comment', async () => {
    req.params.commentId = commentId
    await commentController.remove(req, res)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.send).toHaveBeenCalledWith({
      message: 'Comment was deleted successfully.',
    })
  })

  it('returns 404 with useful error when cannot find comment to delete', async () => {
    CommentService.mockImplementation(() => {
      return {
        remove: () => Promise.resolve(0),
      }
    })
    req.params.commentId = commentId
    await commentController.remove(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.send).toHaveBeenCalledWith({
      message: `Comment with id ${commentId} not found.`,
    })
  })

  it('returns general error when cannot delete a comment', async () => {
    CommentService.mockImplementation(() => {
      return {
        remove: () => {
          throw new Error(fakeError)
        },
      }
    })
    req.params.commentId = commentId
    await commentController.remove(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send.mock.calls.length).toBe(1)
    expect(res.send).toHaveBeenCalledWith({
      message: `Could not delete comment with id ${commentId}.`,
    })
  })
})
