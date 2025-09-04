import fastify from 'fastify'
import { userRoutes } from './routes/user-route'
import { authRoutes } from './routes/auth-routes'
import { mealsRoutes } from './routes/meals-routes'

export const app = fastify()

app.register(userRoutes, { prefix: 'users' })
app.register(authRoutes, { prefix: 'auth' })
app.register(mealsRoutes, { prefix: 'meals' })