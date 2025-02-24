'use strict';

const Joi = require('joi')

module.exports = {
    method: 'POST',
    path: '/user',
    options: {
        auth: false,
        tags: ['api'],
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                email: Joi.string().email().required().example('john.doe@example.com').description('Email of the user'),
                username: Joi.string().required().min(3).example('johndoe').description('Username of the user'),
                password: Joi.string().required().min(8).example('securepassword').description('Password of the user'),
                role: Joi.string()
                  .valid('user', 'admin')
                  .default('user')
                  .description('Role of the user (user or admin)')
            })
        }
    },
    handler: async (request, h) => {
        const bcrypt = require('bcrypt');
        console.log(request.services());

        const { userService, mailService } = request.services();

        let { password, ...userData } = request.payload;
        userData.password = await bcrypt.hash(password, 10);

        try {
            const newUser = await userService.create({ ...userData, email, firstName });

            await mailService.sendWelcomeEmail(email, firstName);

            return h.response({ message: 'Utilisateur créé avec succès' }).code(201);
        } catch (error) {
            console.error('Erreur lors de la création de l’utilisateur :', error);
            return h.response({ error: 'Erreur lors de la création de l’utilisateur' }).code(500);
        }

        // return await userService.create(userData);
    }
};