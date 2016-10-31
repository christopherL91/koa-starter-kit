'use strict';

import Koa from 'koa';
import convert from 'koa-convert';
import createLogger from 'concurrency-logger';

import Public from './routes/public.js';

export default (config) => {
    const app = new Koa();

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.body = {message: err.message};
            ctx.status = err.status || 500;
        }
    });

    const logger = createLogger();

    //  Public router
    const open = Public(config);
    app.use(logger);
    app.use(open.routes());
    app.use(open.allowedMethods());
    return app;
};
