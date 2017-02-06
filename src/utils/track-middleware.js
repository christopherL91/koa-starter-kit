'use strict';

export default async (ctx, next) => {
    const Id = ctx.headers['x-request-id'];
    if(Id) ctx.set('X-Request-ID', Id);
    await next();
};
