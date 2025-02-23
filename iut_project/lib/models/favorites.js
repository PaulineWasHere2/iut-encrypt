'use strict';

const { Model } = require('objection');

module.exports = class Favorite extends Model {
  static get tableName() {
    return 'favorites';
  }

  static get idColumn() {
    return ['user_id', 'movie_id'];
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'movie_id'],
      properties: {
        user_id: { type: 'integer' },
        movie_id: { type: 'integer' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./user');
    const Movie = require('./movies');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'favorites.user_id',
          to: 'users.id'
        }
      },
      movie: {
        relation: Model.BelongsToOneRelation,
        modelClass: Movie,
        join: {
          from: 'favorites.movie_id',
          to: 'movies.id'
        }
      }
    };
  }
};
