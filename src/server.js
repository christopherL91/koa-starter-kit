'use strict';

import chalk from 'chalk';
import emoji from 'node-emoji';
import bunyan from '@advinans/logging';
import postgres from 'pg-promise';
import K8Api from 'kubernetes-client';
import path from 'path';

import App from './app.js';
import remoteExec from './utils/exec.js';
import {queryFile} from './utils/db.js';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(1));

const {
    PORT = 8080,
    BIND = '0.0.0.0',
    K8URL = 'https://104.199.87.26',
    TOKEN,
    SECRET = 'thisisnotasecret',
    DB_HOST = 'localhost',
    DB_PORT = 5432,
    DB_USERNAME = 'postgres',
    DB_PASSWORD = 'password',
    DB_DATABASE = 'postgres',
} = process.env;

const addr = `${BIND}:${PORT}`;
const name = 'Advinans-Bouncer';

const pgp = postgres();
const dbOptions = {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
    user: DB_USERNAME,
    password: DB_PASSWORD,
};

const k8 = new K8Api({
    url: K8URL,
    insecureSkipTlsVerify: true,
    auth: {
        bearer: TOKEN,
    },
});

//  Pass data to routes
const config = {
    log: bunyan(name).requestLogger(),
    jwt_secret: SECRET,
    remoteExec: remoteExec(TOKEN),
    db: {
        connection: pgp(dbOptions),
        schemaQuery: queryFile(path.resolve(__dirname, './queries/schema.sql')),
        userQuery: queryFile(path.resolve(__dirname, './queries/user.sql')),
    },
    k8,
};

const server = App(config);
server.listen({port: PORT, host: BIND}, () => {
    const format = chalk.blue;
    const rocket = emoji.get(':rocket:');
    const msg = `[${name}]: Started on ${addr} ${rocket}`;
    console.error(`${format(msg)}`);
});
