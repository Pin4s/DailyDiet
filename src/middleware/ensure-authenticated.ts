import { FastifyReply, FastifyRequest } from 'fastify'
import { verify } from 'jsonwebtoken'
import { authConfig } from '../config/auth'
import { env } from '../env'

interface TokenPayload {
    sub: string
}

async function ensureAuthenticated(request: FastifyRequest, reply: FastifyReply) {
    try {
        const authHeader = request.headers.authorization
        console.log("Entrou no ensure")

        if (!authHeader) {
            return reply.status(401).send({ message: "JWT Token not found" })
        }

        if (!env.JWT_SECRET) {
            return reply.status(500).send({ message: "JWT_SECRET not configured" })
        }

        const [_, token] = authHeader.split(" ")

        if (token === undefined) {
            return reply.status(401).send({ message: "JWT Token not found" })
        }

        const { sub: user_id } = verify(token, env.JWT_SECRET) as TokenPayload

            ; (request as any).user = { id: user_id }
    } catch (error) {
        return reply.status(401).send({ message: "Invalid JWT Token" })
    }
}

export { ensureAuthenticated }