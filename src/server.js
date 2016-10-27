'use strict';

import App from './app.js';

const {
    PORT = 3000,
    BIND = '0.0.0.0'
} = process.env;
const addr = `${BIND}:${PORT}`;

//  Pass data to routes
const config = {};

const app = App(config);
app.listen({port: PORT, host: BIND}, () => {
    console.log(`Server started on ${addr}`);
});
