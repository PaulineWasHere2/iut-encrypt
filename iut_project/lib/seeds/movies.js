'use strict';

exports.seed = async function(knex) {

  await knex('movies').del();

  await knex('movies').insert([
    {
      title: 'Inception',
      description: 'Un voleur expérimenté est impliqué dans une mission de rêve.',
      release_date: '2010-07-16',
      director: 'Christopher Nolan',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      title: 'Interstellar',
      description: 'Un groupe d’explorateurs voyage à travers un trou de ver dans l’espace.',
      release_date: '2014-11-07',
      director: 'Christopher Nolan',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      title: 'Matrix',
      description: 'Un hacker découvre la vérité sur la réalité.',
      release_date: '1999-03-31',
      director: 'Lana Wachowski, Lilly Wachowski',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};
