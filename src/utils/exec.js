'use strict';

import remoteExec from '@advinans/remote';

/*
 * Rather naive implementation.
 * Protocol: <STRING><NEWLINE><STRING><NEWLINE>
 * TODO: Ask Robert @rstenbo for advice
*/

export default (token) => async (username, password) => {
    const args = ['pgpool-createuser', username, password];
    return remoteExec(token)(args, token)
    .then(buffer =>  {
        const text = buffer.toString('utf8');
        const lines = text.split('\n');
        if(lines.length === 2) {
            const statusLine = lines[1]; // Contains error from docker
            const returnCode = statusLine.match(/\d+/)[0];
            return {text: lines[0], returnCode};
        }else {
            return {returnCode}; // OK
        }
    });
};
