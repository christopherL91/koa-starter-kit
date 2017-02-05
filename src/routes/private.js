'use strict';

import Router from 'koa-router';
import jwt from 'koa-jwt';
import {generate} from 'randomstring';
import {CREATED} from 'http-status-codes';

import {indexSchema} from '../schema.js'; // Maybe rewrite this as an middleware
import {secretManifest, insertSecret} from '../utils/kubernetes.js';

export default (config) => {
    const router = new Router();
    //router.use(jwt({secret: config.jwt_secret})); // Protect router.
    const {db, remoteExec, k8} = config;

    router.post('/', async (ctx) => {
        const values = await indexSchema(ctx.request.body);
        const password = generate({
            length: 20,
            charset: 'alphabetic',
        });
        const response = await remoteExec(values.username, password);
        // TODO: Check response.returnCode for error and act accordingly.
        // @rstenbo
        await db.connection.task(t=> {
            return t.batch([
                t.oneOrNone(db.schemaQuery, values.schema),
                t.oneOrNone(db.userQuery, {username: values.username, password}))
            ]);
        });
        const encodedSecretName = Buffer.from(values.secretName).toString('base64');
        const encodedPassword = Buffer.from(password).toString('base64');

        const manifest = secretManifest({
            secretName: values.secretName,
            username: encodedSecretName,
            password: encodedPassword,
        });
        const secret = await insertSecret(k8)(manifest);
        ctx.status = CREATED;
        ctx.body = {secret};
    });

    return router;
};
