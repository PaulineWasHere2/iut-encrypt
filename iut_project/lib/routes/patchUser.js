'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

module.exports = [
  {
    method: 'PATCH',
    path: '/user/{id}',
    options: {
      tags: ['api'],
      validate: {
        params: Joi.object({ id: Joi.number().integer().required() }),
        payload: Joi.object({
          firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
          lastName: Joi.string().min(3).example('Danver').description('Lastname of the user'),
          password: Joi.string().min(8).example('password').description('Password of the user'),
          email: Joi.string().email().example('john.danver@gmail.com').description('Mail of the user'),
          username: Joi.string().min(3).example('johndanver').description('Username of the user')

        })
      }
    },
    handler: async (request, h) => {
      const { User } = request.models();
      const { id } = request.params;
      let { password, ...updateData } = request.payload;

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await User.query().patchAndFetchById(id, updateData);
      return h.response().code(204);
    }
  }
];
