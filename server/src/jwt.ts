import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, RequestHandler, Response } from 'express';

/** Generates a new JWT associated with the supplied email. */
export function generate(email: string): string {
    return jwt.sign({ data: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

/** A middleware function that authenticates the request. */
export function authenticate(request: Request, response: Response, next: NextFunction) {
    let token = request.headers['authorization'];
    if (token && jwt.verify(token, process.env.JWT_SECRET)) {
        next();
    } else {
        response.status(403).json({ error: 'Permission denied.' })
    }
}
