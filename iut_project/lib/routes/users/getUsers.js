'use strict';

const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/users',
  options: {
    auth: {
      scope: ['user', 'admin']
    },
    tags: ['api']
  },
  handler: async (request, h) => {
    const { User } = request.models();
    return User.query();
  }
};
