'use strict';

import {CONFLICT} from 'http-status-codes';

export const secretManifest = ({secretName, username, password}) => {
    return {
        apiVersion: 'v1',
        kind: 'Secret',
        metadata: {
            name: `${secretName}`,
        },
        data: {
            username: `${username}`,
            password: `${password}`,
        },
    };
};

export const insertSecret = k8 => manifest => {
    return new Promise((resolve, reject) => {
        k8.ns.secrets.post({body: manifest}, (err, result) => {
            if(err) {
                if(err.code === CONFLICT) { // Secret already exists, return it.
                    k8.ns.secrets(manifest.metadata.name).get((err, res) => {
                        err? reject(err): resolve(res);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result); // Secret was just created.
            }
        });
    });
};
