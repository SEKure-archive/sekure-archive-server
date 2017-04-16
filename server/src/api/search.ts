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

/** Handles GET /search (file/folder searching). */
function getSearch(request: Request, response: Response, next: NextFunction) {
    Db.call('search_files', request.body.query).then(results => {
        response.status(200).json({ results });
    }, next);
}

export function use(application: Application) {
    application.get('/search', auth.authenticate, json.validate(SEARCH_SCHEMA), getSearch);
}
