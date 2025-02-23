'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

module.exports = [
  {
    method: 'PATCH',
    path: '/user/{id}/promote',
    options: {
      auth: {
        scope: ['admin']
      },
      tags: ['api'],
      validate: {
        params: Joi.object({
          id: Joi.number().integer().required()
        })
      }
    },
    handler: async (request, h) => {
      const { User } = request.models();
      const { id } = request.params;

      const user = await User.query().findById(id);
      if (!user) {
        throw Boom.notFound('User not found');
      }

      await User.query().patchAndFetchById(id, { role: 'admin' });

      return { message: 'User promoted to admin' };
    }
  }
];