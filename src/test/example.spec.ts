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



