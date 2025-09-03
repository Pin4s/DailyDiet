import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary()

        table.uuid('user_id').notNullable()
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

        table.string('name', 255).notNullable()
        table.string('description', 1000).notNullable()
        table.boolean('is_on_diet').notNullable()
        table.timestamp('date_time').notNullable()

        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

