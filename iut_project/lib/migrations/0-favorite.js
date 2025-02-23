'use strict';

module.exports = {

  async up(knex) {

    await knex.schema.createTable('favorites', (table) => {
      table.integer('user_id').unsigned().notNullable();
      table.integer('movie_id').unsigned().notNullable();
      table.primary(['user_id', 'movie_id']);
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.foreign('movie_id').references('movies.id').onDelete('CASCADE');
    });
  },

  async down(knex) {
    await knex.schema.dropTableIfExists('favorites');
  }
};
