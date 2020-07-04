exports.up = function (knex) {
    return knex.schema.createTable('comment', function (t) {
        t.increments('id').primary()
        t.string('content').notNullable()
        t.timestamps(false, true)
    })
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('comment')
}
