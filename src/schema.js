'use strict';

import Joi from 'joi';

export const indexSchema = body => {
    return new Promise((resolve, reject) => {
        const schema = Joi.object().keys({
            username: Joi.string().required(),
            schema: Joi.string().required(),
            secretName: Joi.string().required(),
        });
        Joi.validate(body, schema, (err, value) => {
            err? reject(err):resolve(value);
        });
    });
};
