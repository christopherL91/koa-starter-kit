import Koa from 'koa';

import Public from './routes/public.js';

export default (config) => {
    const app = new Koa();

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.body = { message: err.message };
            ctx.status = err.status || 500;
        }
    });

    //  Public router
    const open = Public(config);
    app.use(open.routes());
    app.use(open.allowedMethods());
    return app;
};
