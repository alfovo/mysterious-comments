exports.up = (knex, Promise) => {
  return knex.schema.createTable('comment', (table) => {
    table.increments('id').primary()
    table.string('content').notNullable()
    table.timestamps(false, true)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('comment')
}
