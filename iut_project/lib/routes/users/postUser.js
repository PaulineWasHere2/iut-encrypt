'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

module.exports = [
  {
    method: 'POST',
    path: '/user/login',
    options: {
      auth: false,
      tags: ['api'],
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().example('john.doe@example.com').description('Email of the user'),
          password: Joi.string().required().example('securepassword').description('Password of the user')
        })
      }
    },
    handler: async (request, h) => {
      const { User } = request.models();

      const { email, password } = request.payload;

      const user = await User.query().findOne({ email });
      if (!user) {
        throw Boom.unauthorized('Invalid email or password');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw Boom.unauthorized('Invalid email or password');
      }

      const scope = user.role === 'admin' ? 'admin' : 'user';

      const token = Jwt.token.generate(
        {
          aud: 'urn:audience:iut',
          iss: 'urn:issuer:iut',
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          scope: scope
        },
        {
          key: 'random_string',
          algorithm: 'HS512'
        },
        {
          ttlSec: 14400
        }
      );

      return { token };
    }
  }
];
