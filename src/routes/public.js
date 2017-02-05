'use strict';

import Router from 'koa-router';
import {OK, SERVICE_UNAVAILABLE} from 'http-status-codes';

export default (config) => {
    const router = new Router();
    const {db} = config;

    router.get('/healthz', async (ctx) => {
        return db.connection.proc('version') // Ping
        .then(version => {
            ctx.body = {
                statusCode: OK,
                body: {status: 'OK'},
                metadata: {},
            };
        })
        .catch(err => {
            ctx.throw(SERVICE_UNAVAILABLE, err);
        });
    });

    return router;
};
