'use strict';

const Dotenv = require('dotenv');
const Confidence = require('@hapipal/confidence');
const Toys = require('@hapipal/toys');

Dotenv.config({ path: `${__dirname}/.env` });

module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $param: 'PORT',
            $coerce: 'number',
            $default: 3000
        },
        debug: {
            $filter: 'NODE_ENV',
            $default: {
                log: ['error', 'start'],
                request: ['error']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: '../lib',
                options: {}
            },
            {
                plugin: './plugins/swagger'
            },
            {
                plugin: {
                    $filter: 'NODE_ENV',
                    $default: '@hapipal/hpal-debug',
                    production: Toys.noop
                }
            }
        ]
    }
});
