import * as bcrypt from 'bcryptjs';
import { Application, NextFunction, Request, Response } from 'express';

import * as auth from '../auth';
import * as json from '../json';
import { Db } from '../db';

const ACCOUNT_SCHEMA = {
    type: 'object',
    properties: {
        email: { type: 'string' },
        password: { type: 'string' },
    },
    required: ['email', 'password'],
};

/** Returns whether the supplied account credentials are valid. */
export function authenticate(email: string, password: string): Promise<boolean> {
    return Db.call('select_account_password', email).then(hash => {
        if (hash) {
            return bcrypt.compare(password, hash);
        } else {
            return false;
        }
    });
}

/** Checks that the user-supplied password meets password requirements. */
function checkPassword(request: Request, response: Response, next: NextFunction) {
    if (request.body.password.length < 8) {
        response.status(400).json({ error: 'Password must be at least 8 characters long.' });
    } else if (request.body.password.length > 72) {
        response.status(400).json({ error: 'Password must be no more than 72 characters long.' });
    } else {
        next();
    }
}

/** Handles POST /accounts (account creation). */
function postAccounts(request: Request, response: Response, next: NextFunction) {
    bcrypt.hash(request.body.password, process.env.BCRYPT_ROUNDS).then(password => {
        Db.call('insert_account', request.body.email, password).then(success => {
            if (success) {
                response.status(200).json({ jwt: auth.generate(request.body.email) });
            } else {
                response.status(403).json({ error: 'Email is already in use.' });
            }
        }, next);
    }, next);
}

/** Handles POST /accounts/login (account login). */
function postAccountsLogin(request: Request, response: Response, next: NextFunction) {
    authenticate(request.body.email, request.body.password).then(success => {
        if (success) {
            response.status(200).json({ jwt: auth.generate(request.body.email) });
        } else {
            response.status(403).json({ error: 'Invalid email or password.' });
        }
    }, next);
}

export function use(application: Application) {
    application.post('/accounts', json.validate(ACCOUNT_SCHEMA), checkPassword, postAccounts);
    application.post('/accounts/login', json.validate(ACCOUNT_SCHEMA), postAccountsLogin);
}
