'use strict';

import Koa from 'koa';
import convert from 'koa-convert';
import bodyParser from 'koa-bodyparser';
import http from 'http';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import cors from 'kcors';``

import Public from './routes/public.js';
import Private from './routes/private.js';

import trackmiddleware from './utils/track-middleware.js';

export default (config) => {
    const app = new Koa();
    const {log} = config;

    app.use(async(ctx, next) => {
        try {
            await next();
            log.info({req: ctx.req, res: ctx.res});
        } catch (err) {
            const statusCode = err.status || 500;
            ctx.status = statusCode;
            ctx.body = {
                statusCode,
                body: {},
                error: {
                    message: err.message || 'Internal Server Error\n',
                },
                metadata: {},
            };
            log.error({req: ctx.req, res: ctx.res, err});
        }
    });

    // Public/Private router.
    const open = Public(config);
    const closed = Private(config);

    app.use(trackmiddleware);
    app.use(convert(cors()));
    app.use(helmet());
    app.use(compress());
    app.use(bodyParser());
    app.use(open.routes());
    app.use(open.allowedMethods());
    app.use(closed.routes());
    app.use(closed.allowedMethods());
    return http.createServer(app.callback());
};
