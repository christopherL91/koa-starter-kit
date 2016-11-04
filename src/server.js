'use strict';

import chalk from 'chalk';

import App from './app.js';

const {
    PORT = 3000,
    BIND = '0.0.0.0'
} = process.env;

const addr = `${BIND}:${PORT}`;

//  Pass data to routes
const config = {};

const server = App(config);

server.listen({port: PORT, host: BIND}, () => {
    const format = chalk.blue;
    const msg = `[Server]: Started on ${addr}`;
    console.log(`${format(msg)}`);
});
