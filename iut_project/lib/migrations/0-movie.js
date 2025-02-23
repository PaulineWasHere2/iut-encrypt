'use strict';

module.exports = {

  async up(knex) {

    await knex.schema.createTable('movies', (table) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.date('release_date').notNullable();
      table.string('director').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  },

  async down(knex) {
    await knex.schema.dropTableIfExists('movies');
  }
};
