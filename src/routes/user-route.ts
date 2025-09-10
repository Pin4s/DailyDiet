import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import z from 'zod'
import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { ensureAuthenticated } from '../middleware/ensure-authenticated'

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

        const { password_hash: _, ...user } = newUser

        return reply.status(201).send({ message: 'User created', user })
    })

    app.get('/metrics', { preHandler: ensureAuthenticated }, async (request, reply) => {

        const userId = request.user?.id

        if (!userId) {
            return reply.status(500).send({ message: 'User ID not found in request.' })
        }


        const totalMealsResult = await knex('meals')
            .where('user_id', userId)
            .count('id', { as: 'totalMeals' })
            .first()

        const onDietMealsResult = await knex('meals')
            .where('user_id', userId)
            .andWhere('is_on_diet', 1)
            .count('id', { as: 'onDietMeals' })
            .first()

        const notOnDietMealsResult = await knex('meals')
            .where('user_id', userId)
            .andWhere('is_on_diet', 0)
            .count('id', { as: 'notOnDietMeals' })
            .first()

        const totalMealsCount = (totalMealsResult?.totalMeals || '0')
        const onDietMealsCount = (onDietMealsResult?.onDietMeals || '0')
        const notOnDietMealsCount = (notOnDietMealsResult?.notOnDietMeals || '0')

        const allMealsForSequence = await knex('meals').where('user_id', userId).orderBy('date_time', 'asc').select('is_on_diet')

        let biggestOnDietSequence = 0;
        let currentSequence = 0;

        for (const meal of allMealsForSequence) {
            const isOnDiet = meal.is_on_diet === 1

            if (isOnDiet) {
                currentSequence++
            } else {
                currentSequence = 0
            }

            if (currentSequence > biggestOnDietSequence) {
                biggestOnDietSequence = currentSequence
            }
        }

        return reply.status(200).send({
            meal_metrics: {
                total_meals: totalMealsCount,
                on_diet_meals: onDietMealsCount,
                not_on_diet_meals: notOnDietMealsCount,
                biggest_on_diet_sequence: biggestOnDietSequence,
            }
        })
    })
}