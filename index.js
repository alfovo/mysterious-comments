import express from 'express'
import bodyParser from 'body-parser'
import commentRouter from './routes/comment.routes.js'
import redisClient from './config/redis'

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())

redisClient.on('connect', function () {
  console.log('redis is connected')
})

commentRouter(app, redisClient)

app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
