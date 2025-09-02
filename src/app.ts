import fastify from 'fastify'
import { userRoutes } from './routes/user-route'

export const app = fastify()

app.register(userRoutes, {prefix: 'users'})