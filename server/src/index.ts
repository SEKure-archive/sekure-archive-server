import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

import { start } from './application';
import { Db } from './db';

Db.initialize().then(() => {
    if (process.env.SSL_KEY && process.env.SSL_CERT) {
        production();
    } else {
        development();
    }
});

function development() {
    let application = start();
    application.set('port', 8080);
    let server = http.createServer(application);
    server.listen(8080);
    server.on('listening', () => console.log(`Listening on ${server.address().port}...`));
    server.on('close', Db.terminate);
    server.on('error', console.error);
}

function production() {
    let application = start();
    application.set('port', 443);
    let key = fs.readFileSync(process.env.SSL_KEY, 'utf-8');
    let cert = fs.readFileSync(process.env.SSL_CERT, 'utf-8');
    let credentials = { key: key, cert: cert };
    let server = https.createServer(credentials, application);
    server.listen(443);
    server.on('listening', () => console.log(`Listening on ${server.address().port}...`));
    server.on('close', Db.terminate);
    server.on('error', console.error);
}
