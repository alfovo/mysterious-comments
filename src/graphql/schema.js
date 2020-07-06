import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import CommentController from '../controllers/comment.controller'

const commentController = new CommentController()
const GraphQLComment = new GraphQLObjectType({
  name: 'comment',
  fields: {
    id: {
      type: GraphQLID,
    },
    content: {
      type: GraphQLString,
    },
    created_at: {
      type: GraphQLDateTime,
    },
    updated_at: {
      type: GraphQLDateTime,
    },
  },
})

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      comment: {
        type: new GraphQLList(GraphQLComment),
        args: {
          id: { type: GraphQLID },
        },
        resolve(parentValue, args, ctx) {
          let result
          if (args.id) {
            ctx.params.id = args.id
            result = commentController.get(ctx)
          } else {
            result = commentController.getAll(ctx)
          }
          return result.then((context) => {
            if (context.status !== 200) {
              throw new Error(context.body.message)
            } else return context.body
          })
        },
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'CommentMutations',
    fields: {
      addComment: {
        type: GraphQLComment,
        args: {
          content: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(parentValue, args, ctx) {
          ctx.request.body.content = args.content
          return commentController.create(ctx).then((context) => {
            if (context.status !== 200) {
              throw new Error(context.body.message)
            } else return
          })
        },
      },
      removeComment: {
        type: GraphQLComment,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(parentValue, args, ctx) {
          ctx.params.id = args.id
          return commentController.remove(ctx).then((context) => {
            if (context.status !== 200) {
              throw new Error(context.body.message)
            } else return
          })
        },
      },
    },
  }),
})
