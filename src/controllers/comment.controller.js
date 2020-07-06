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
      const id = await commentService.create(ctx.request.body.content)
      ctx.body = {
        message: `Comment ${id} successfully added to database.`,
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
      ctx.body = {
        message:
          err.message || 'Some error occurred while creating the comment.',
      }
    }
    return ctx
  }

  // Retrieve all Comments from the database.
  async getAll(ctx) {
    const commentService = new CommentService()
    try {
      ctx.body = await commentService.getAll()
    } catch (err) {
      console.log(err)
      ctx.status = 500
      ctx.body = {
        message:
          err.message || 'Some error occurred while retrieving comments.',
      }
    }
    return ctx
  }

  // Retrieve a Comment with a specified id.
  async get(ctx) {
    const commentService = new CommentService()
    try {
      const comment = await commentService.get(ctx.params.id)
      if (!comment) {
        ctx.status = 404
        ctx.body = {
          message: `Comment with id ${ctx.params.id} not found.`,
        }
      } else {
        ctx.body = comment
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
      ctx.body = {
        message: `Could not get comment with id ${ctx.params.id}.`,
      }
    }
    return ctx
  }

  // Delete a Comment with a specified id.
  async remove(ctx) {
    const commentService = new CommentService()
    try {
      const deleted = await commentService.remove(ctx.params.id)
      if (deleted === 1)
        ctx.body = { message: 'Comment was deleted successfully.' }
      else if (deleted === 0) {
        ctx.status = 404
        ctx.body = {
          message: `Comment with id ${ctx.params.id} not found.`,
        }
      } else {
        ctx.status = 500
        ctx.body = {
          message: `Some unexpected behavior occured when deleting comment ${ctx.params.id}.`,
        }
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
      ctx.body = {
        message: `Could not delete comment with id ${ctx.params.id}.`,
      }
    }
    return ctx
  }
}
