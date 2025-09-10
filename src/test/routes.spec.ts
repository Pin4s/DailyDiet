// src/test/example.spec.ts

import request from "supertest"
import { test, describe, beforeAll, afterAll, expect, beforeEach } from "vitest"
import { app } from "../app"
import { execSync } from "child_process"

beforeAll(async () => {
    await app.ready()
})

beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all --env test')
    execSync('npm run knex migrate:latest --env test')
})

afterAll(async () => {
    await app.close()
})

async function createUserAndGetToken() {
    const userEmail = `user-${crypto.randomUUID()}@test.com`

    await request(app.server)
        .post('/users')
        .send({
            name: "Test User",
            email: userEmail,
            password: "password123",
        })

    const authResponse = await request(app.server)
        .post('/auth/login')
        .send({
            email: userEmail,
            password: "password123",
        })


    const { token } = authResponse.body
    return token
}

async function createMeal(token: string) {
    const createMealResponse = await request(app.server)
        .post('/meals')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: "Frango com Batata Doce",
            description: "Refeição clássica de pré-treino.",
            is_on_diet: true,
            date: "2025-10-10",
            time: "12:00",
        })

    return createMealResponse.body
}

describe('Users Routes', () => {
    test('should be able to create a new user', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: "Test User",
                email: "test@email.com",
                password: "123456",
            })
            .expect(201)
    })
})

describe('Auth Routes', () => {
    test('Should be able to create a new session', async () => {
        const token = await createUserAndGetToken()

        expect(token)
    })

    test('Should not be able to create a new session with wrong password', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: "Login User",
                email: "login@email.com",
                password: "password123",
            })
            .expect(201)

        const authResponse = await request(app.server)
            .post('/auth/login')
            .send({
                email: "login@email.com",
                password: "WRONGpassword123"
            }).expect(401)
    })
})

describe('Meal Routes', () => {
    test('User should be able to create a new meal', async () => {
        const token = await createUserAndGetToken()

        const createMealResponse = await request(app.server)
            .post('/meals')
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Frango Grelhado",
                description: "Peito de frango com batata doce.",
                is_on_diet: true,
                date: "2025-09-08",
                time: "12:30",
            })

        expect(createMealResponse.status).toBe(201)
    })

    test('should not be able to create a meal without a token', async () => {
        await request(app.server)
            .post('/meals')
            .send({
                name: "X-Tudo",
                description: "Não deveria ser criado",
                is_on_diet: false,
                date: "2025-09-08",
                time: "22:00",
            })
            .expect(401)
    })

    test('should be able to delete a meal', async () => {
        const token = await createUserAndGetToken()
        const newMeal = await createMeal(token)


        console.log(newMeal)
    })
})