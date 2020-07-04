import CommentService from '../services/comment.service'

export default class CommentController {
  // Create a new Comment.
  async create(req, res) {
    if (!req.body.content) {
      res.status(400).send({
        message: 'Content can not be empty.',
      })
      return
    }
    const commentService = new CommentService()
    try {
      const commentId = await commentService.create(req.body.content)
      res.send({
        message: `Comment ${commentId} successfully added to database`,
      })
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the comment.',
      })
    }
  }

  // Retrieve all Comments from the database.
  async getAll(req, res) {
    const commentService = new CommentService()
    try {
      res.json(await commentService.getAll())
    } catch (err) {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving comments.',
      })
    }
  }

  // Delete a Comment with a specified commentId.
  async remove(req, res) {
    const commentService = new CommentService()
    try {
      const deleted = await commentService.remove(req.params.commentId)
      if (deleted === 1)
        res.send({ message: 'Comment was deleted successfully.' })
      else if (deleted === 0) {
        res.status(404).send({
          message: `Comment with id ${req.params.commentId} not found.`,
        })
      } else {
        res.status(500).send({
          message: `Some unexpected behavior occured when deleting comment ${req.params.commentId}.`,
        })
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete comment with id ${req.params.commentId}.`,
      })
    }
  }
}
