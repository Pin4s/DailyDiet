import fastify from 'fastify'
import { userRoutes } from './routes/user-route'
import { authRoutes } from './routes/auth-routes'

export const app = fastify()

app.register(userRoutes, {prefix: 'users'})
app.register(authRoutes, {prefix: 'auth'})