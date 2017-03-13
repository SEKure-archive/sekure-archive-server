import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import * as accounts from './api/accounts';

/** Generates a new JWT associated with the supplied email. */
export function generate(email: string): string {
    return jwt.sign({ data: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}
/** Returns whether the supplied username and password is valid. */
function basicVerify(token: string, next: NextFunction) {
    let string = new Buffer(token, 'base64').toString('utf-8');
    let colon = string.indexOf(':');
    if (colon != -1) {
        accounts.authenticate(string.substr(0, colon), string.substr(colon + 1)).then(success => {
            if (success) next();
        }, console.error);
    }
}

/** Returns whether the supplied JWT is valid. */
function bearerVerify(token: string, next: NextFunction) {
    if (jwt.verify(token, process.env.JWT_SECRET)) {
        next();
    }
}

/** A middleware function that authenticates the request. */
export function authenticate(request: Request, response: Response, next: NextFunction) {
    let token = request.headers['authorization'];
    if (token && token.lastIndexOf('Basic ', 0) == 0) {
        basicVerify(token.substr(6), next);
    } else if (token && token.lastIndexOf('Bearer ', 0) == 0) {
        bearerVerify(token.substr(7), next);
    } else {
        response.status(403).json({ error: 'Permission denied.' })
    }
}
