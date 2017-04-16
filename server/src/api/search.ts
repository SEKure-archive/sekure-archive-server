import { Application, NextFunction, Request, Response } from 'express';

import * as auth from '../auth';
import * as aws from '../aws';
import * as json from '../json';
import { Db } from '../db';

const SEARCH_SCHEMA = {
    type: 'object',
    properties: {
        query: { type: 'string' },
    },
    required: ['query'],
};

/** Handles POST /search (file searching). */
function postSearch(request: Request, response: Response, next: NextFunction) {
    Db.call('search_files', request.body.query).then(results => {
        response.status(200).json({ results });
    }, next);
}

export function use(application: Application) {
    application.post('/search', auth.authenticate, json.validate(SEARCH_SCHEMA), postSearch);
}
