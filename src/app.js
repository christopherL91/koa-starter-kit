'use strict';

import Koa from 'koa';
import convert from 'koa-convert';
import createLogger from 'concurrency-logger';
import bodyParser from 'koa-bodyparser';
import http from 'http';
import monitor from 'koa-monitor';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import cors from 'kcors';``

import Public from './routes/public.js';

export default (config) => {
    const app = new Koa();

    app.use(async(ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.body = {
                status: err.status || 500,
                message: err.message || 'Internal Server Error\n',
            };
            ctx.status = err.status || 500;
            ctx.app.emit('error', err, this);
        }
    });

    const logger = createLogger({
        timestamp: true,
        req: context => (
            context.originalUrl + '\n' +
            context.get('User-Agent')
        ),
    });

    //  Public router
    const open = Public(config);
    const server = http.createServer(app.callback());

    app.use(convert(cors()));
    app.use(helmet());
    app.use(compress());
    app.use(convert(monitor(server, {path: '/status'})));
    app.use(bodyParser());
    app.use(logger);
    app.use(open.routes());
    app.use(open.allowedMethods());
    return server;
};
