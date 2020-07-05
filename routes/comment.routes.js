import Router from 'koa-router'
import CommentController from '../controllers/comment.controller.js'

const commentController = new CommentController()
const router = new Router()

// Create a new Comment
router.post('/comments', commentController.create)
//
// Retrieve all Comments
router.get('/comments', commentController.getAll)

// Retrieve a specified Comment with commentId
router.get('/comments/:commentId', commentController.get)

// Delete a Comment with commentId
router.delete('/comments/:commentId', commentController.remove)

export default router
