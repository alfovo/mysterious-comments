import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import commentRouter from './routes/comment.routes.js'
import dotenv from 'dotenv'
dotenv.config()

const app = new Koa()
const port = process.env.APP_PORT || '7555'

app.use(bodyParser())
app.use(commentRouter.routes())

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
