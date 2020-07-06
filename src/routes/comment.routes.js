import Router from 'koa-router'
import graphqlHTTP from 'koa-graphql'
import schema from '../graphql/schema'
import CommentController from '../controllers/comment.controller'

const commentController = new CommentController()
const router = new Router()

router.all(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

// Create a new Comment
router.post('/comments', commentController.create)
//
// Retrieve all Comments
router.get('/comments', commentController.getAll)

// Retrieve a specified Comment with commentId
router.get('/comments/:id', commentController.get)

// Delete a Comment with commentId
router.delete('/comments/:id', commentController.remove)

export default router
