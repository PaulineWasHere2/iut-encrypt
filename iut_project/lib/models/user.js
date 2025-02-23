'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');
const { sendWelcomeEmail } = require('../services/emailService');

module.exports = class User extends Model {

  static get tableName() {

    return 'user';
  }

  static get joiSchema() {

    return Joi.object({
      id: Joi.number().integer().greater(0),
      firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
      lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
      password: Joi.string().min(8).example('password').description('Password of the user'),
      email: Joi.string().email().example('john.doe@gmail.com').description('Mail of the user'),
      username: Joi.string().min(3).example('johndoe').description('Username of the user'),
      role: Joi.string()
        .valid('user', 'admin')
        .default('user')
        .description('Role of the user (user or admin)')
    });
  }

  $beforeInsert(queryContext) {

    this.updatedAt = new Date();
    this.createdAt = this.updatedAt;
    this.role = this.role || 'user';
    sendWelcomeEmail(this.email, this.firstName);
  }

  $beforeUpdate(opt, queryContext) {

    this.updatedAt = new Date();
  }

};