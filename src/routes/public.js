'use strict';

import Router from 'koa-router';

export default (config) => {
    const router = new Router();

    router.get('/', async (ctx) => {
        ctx.body = {
            msg: 'Hello from public router'
        };
    });

    router.post('/', async (ctx) => {
        console.log(ctx.request.body);
    });

    return router;
};
