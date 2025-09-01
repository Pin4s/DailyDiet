import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import z from 'zod'
import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'

export async function userRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const bodySchema = z.object({
            name: z.string(),
            email: z.email(),
            password: z.string().min(6, 'Password must be at least 6 characters long'),
        })

        const { name, email, password } = bodySchema.parse(request.body)

        const userEmailAlreadyExists = await knex('users').where({ email }).first()

        if (userEmailAlreadyExists) {
            return reply.status(409).send({ message: 'Email already exists.' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [newUser] = await knex('users').insert({
            id: crypto.randomUUID(),
            name,
            email,
            password_hash: hashedPassword,
        }).returning('*')

        const { password_hash: _, ...userWithoutPassword } = newUser

        return reply.send({ message: 'User route works!', newUser })
    })
}