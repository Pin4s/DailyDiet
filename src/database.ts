import { knex as setupKnex, Knex } from "knex";

export const config: Knex.Config = {
    client: 'sqlite3',
    connection: {
        filename: './app.db'
    },
    useNullAsDefault: true,
    migrations:{
        extension: 'ts',
        directory: './database/migrations'
    }
}
export const knex = setupKnex(config)