import CommentService from '../services/comment.service'

export default class CommentController {
  // Create a new Comment.
  async create(ctx) {
    if (!ctx.request.body.content) {
      ctx.status = 400
      ctx.body = {
        message: 'Content can not be empty.',
      }
      return
    }
    const commentService = new CommentService()
    try {
      const commentId = await commentService.create(ctx.request.body.content)
      ctx.body = {
        message: `Comment ${commentId} successfully added to database`,
      }
    } catch (err) {
      ctx.status = 500
      ctx.body = {
        message:
          err.message || 'Some error occurred while creating the comment.',
      }
    }
  }

  // Retrieve all Comments from the database.
  async getAll(ctx) {
    const commentService = new CommentService()
    try {
      ctx.body = await commentService.getAll()
    } catch (err) {
      ctx.status = 500
      ctx.body = {
        message:
          err.message || 'Some error occurred while retrieving comments.',
      }
    }
  }

  // Retrieve a Comment with a specified commentId.
  async get(ctx) {
    const commentService = new CommentService()
    try {
      const comment = await commentService.get(ctx.params.commentId)
      if (!comment) {
        ctx.status = 404
        ctx.body = {
          message: `Comment with id ${ctx.params.commentId} not found.`,
        }
      } else {
        ctx.body = comment
      }
    } catch (err) {
      console.log(err)
      ctx.status(500).body({
        message: `Could not get comment with id ${ctx.params.commentId}.`,
      })
    }
  }

  // Delete a Comment with a specified commentId.
  async remove(ctx) {
    const commentService = new CommentService()
    try {
      const deleted = await commentService.remove(ctx.params.commentId)
      if (deleted === 1)
        ctx.body = { message: 'Comment was deleted successfully.' }
      else if (deleted === 0) {
        ctx.status = 404
        ctx.body = {
          message: `Comment with id ${ctx.params.commentId} not found.`,
        }
      } else {
        ctx.status = 500
        ctx.body = {
          message: `Some unexpected behavior occured when deleting comment ${ctx.params.commentId}.`,
        }
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
      ctx.body = {
        message: `Could not delete comment with id ${ctx.params.commentId}.`,
      }
    }
  }
}
