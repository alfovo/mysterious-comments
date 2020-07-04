import CommentController from '../controllers/comment.controller.js'

const commentController = new CommentController()

export default function commentRouter(app) {
  // Create a new Comment
  app.post('/comments', commentController.create)

  // Retrieve all Comments
  app.get('/comments', commentController.getAll)

  // Delete a Comment with commentId
  app.delete('/comments/:commentId', commentController.remove)
}
