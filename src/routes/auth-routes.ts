import { FastifyInstance } from "fastify";
import z from "zod";
import { env } from "../env";
import { knex } from "../database";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { sign } from "jsonwebtoken";

export async function authRoutes(app: FastifyInstance) {
    app.post('/login', async (request, reply) => {
        const bodySchema = z.object({
            email: z.email(),
            password: z.string().min(6, 'Password must be at least 6 characters long'),
        })

        const { email, password } = bodySchema.parse(request.body)

        const user = await knex('users').where({ email }).first()

        if (!user) {
            return reply.status(401).send({ message: 'Invalid credentials.' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash)

        if (!isPasswordCorrect) {
            return reply.status(401).send({ message: 'Invalid credentials.' })
        }

        const { password_hash: _, ...userWithoutPassword } = user

        const token = sign({
            name: user.name,
            email: user.email
        }, env.JWT_SECRET, {
            subject: user.id,
            expiresIn: '3d'
        })

        return reply.send({ token, user: userWithoutPassword })
    })
}