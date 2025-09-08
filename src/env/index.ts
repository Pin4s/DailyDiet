import { config } from 'dotenv'
import z from "zod";

if(process.env.NODE_ENV === 'test'){
    config({path: '.env.test'})
}else{
    config()
}

const envSchema = z.object({
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    PORT: z.coerce.number().default(3333)
})

export const env = envSchema.parse(process.env)