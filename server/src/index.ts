import * as express from 'express';
import * as http from 'http';

import { start } from './application';
import { Db } from './db';

const PORT = process.env.PORT || 8080;

let application = start();
application.set('port', PORT);

Db.initialize().then(() => {
    let server = http.createServer(application);
    server.listen(PORT);
    server.on('listening', () => console.log(`Listening on ${server.address().port}...`));
    server.on('close', Db.terminate);
    server.on('error', console.error);
});
