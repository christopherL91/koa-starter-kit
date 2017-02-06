'use strict';

import {QueryFile} from 'pg-promise';

export const queryFile = filePath => {
    return new QueryFile(filePath, {minify: true});
};
