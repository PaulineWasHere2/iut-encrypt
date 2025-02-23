'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class Movie extends Model {

  static get tableName() {
    return 'movies';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      title: Joi.string().min(1).required().example('Inception').description('Titre du film'),
      description: Joi.string().min(10).required().example('Un voleur expérimenté est impliqué dans une mission dans des rêves.').description('Description du film'),
      releaseDate: Joi.date().required().example('2010-07-16').description('Date de sortie du film'),
      director: Joi.string().min(3).required().example('Christopher Nolan').description('Réalisateur du film'),
      createdAt: Joi.date(),
      updatedAt: Joi.date()
    });
  }

  $beforeInsert(queryContext) {
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
  }

  $beforeUpdate(opt, queryContext) {
    this.updatedAt = new Date();
  }

};
