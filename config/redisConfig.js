import dotenv from 'dotenv'
dotenv.config()

export const host = process.env.REDIS_HOST || 'localhost'
export const port = process.env.REDIS_PORT || '6379'
