import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";
import z from "zod";
import { knex } from "../database";


export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', ensureAuthenticated)

    app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const bodySchema = z.object({
            name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
            description: z.string().min(6, { message: 'Description must be at least 6 characters long' }),
            is_on_diet: z.boolean(),
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
            time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
        })

        const { name, description, date, time, is_on_diet } = bodySchema.parse(request.body)

        const combinedDateTimeString = `${date}T${time}:00`

        const parsedDateTime = new Date(combinedDateTimeString)

        if (isNaN(parsedDateTime.getTime())) {
            return reply.status(400).send({ message: 'Invalid date or time provided.' })
        }

        const userId = request.user?.id

        if (!userId) {
            return reply.status(500).send({ message: 'User ID not found in request.' })
        }

        const newMeal = await knex('meals').insert({
            id: crypto.randomUUID(),
            user_id: userId,
            name,
            description,
            date_time: parsedDateTime.toISOString(),
            is_on_diet
        }).returning('*')

        return reply.status(201).send({ message: 'New meal created', meal: newMeal })
    })

    app.get('/', async (request, reply) => {
        const userId = request.user?.id

        if (!userId) {
            return reply.status(500).send({ message: 'User ID not found in request.' })
        }

        const meals = await knex('meals')
        .select('*').where({ user_id: userId })

        const transformedMeal = meals.map(meal => ({
            ...meal,
            is_on_diet: meal.is_on_diet === 1
        })) 

        return reply.send({ Meals: transformedMeal })
    })

    app.get('/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.uuid()
        })

        const { id } = paramsSchema.parse(request.params)

        const userId = request.user?.id

        if (!userId) {
            return reply.status(500).send({ message: 'User ID not found in request' })
        }

        const meal = await knex('meals').select('*').where({ id: id, user_id: userId }).first()

        if (!meal) {
            return reply.status(404).send({ message: 'Meal not found or does not belong to user' });
        }

        return reply.send({ Meal: meal })
    })

    app.put('/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.uuid()
        })

        const bodySchema = z.object({
            name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
            description: z.string().min(6, { message: 'Description must be at least 6 characters long' }),
            is_on_diet: z.boolean(),
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
            time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
        })

        const { id } = paramsSchema.parse(request.params)
        const { name, description, date, time, is_on_diet } = bodySchema.parse(request.body)

        const userId = request.user?.id

        if (!userId) {
            return reply.status(500).send({ message: 'User ID not found in request' })
        }

        const combinedDateTimeString = `${date}T${time}:00`

        const parsedDateTime = new Date(combinedDateTimeString)

        if (isNaN(parsedDateTime.getTime())) {
            return reply.status(400).send({ message: 'Invalid date or time provided.' })
        }

        const updatedMeal = await knex('meals')
            .update({ name, description, date_time: parsedDateTime.toISOString(), is_on_diet, updated_at: knex.fn.now() })
            .where({ id: id, user_id: userId })
            .returning("*")

        if (!updatedMeal) {
            return reply.status(404).send({ message: 'Meal not found or does not belong to user' });
        }

        return reply.send({ updated_meal: updatedMeal })
    })

    app.delete('/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.uuid()
        })


        const { id } = paramsSchema.parse(request.params)

        const userId = request.user?.id

        if (!userId) {
            return reply.status(500).send({ message: 'User ID not found in request' })
        }


        await knex('meals')
            .delete()
            .where({ id: id, user_id: userId })

        

        return reply.send({ message: "Successfully deleted" }).status(201)
    })
}