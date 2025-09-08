// src/test/example.spec.ts

import request from "supertest"
import { test, describe, beforeAll, afterAll, expect } from "vitest"
import { app } from "../app"
import { execSync } from "child_process"

beforeAll(async () => {
    await app.ready()

    execSync('npm run knex migrate:rollback --all --env test')
    execSync('npm run knex migrate:latest --env test')
})

afterAll(async () => {
    await app.close()
})

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

describe('Auth Routes', async () => {
    test('Should be able to create a new session', async () => {
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
                password: "password123"
            }).expect(200)

        expect(authResponse.body).toEqual(
            expect.objectContaining({
                token: expect.any(String)
            })
        )
    })
})
