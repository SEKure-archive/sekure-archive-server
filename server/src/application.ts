import * as cors from 'cors';
import * as express from 'express';
import * as parser from 'body-parser';
import { Application, NextFunction, Response, Request } from 'express';

import * as accounts from './api/accounts';
import * as files from './api/files';
import * as folders from './api/folders';
import * as search from './api/search';

/** Reports any uncaught errors as internal server errors. */
function ise(error: any, request: Request, response: Response, next: NextFunction) {
    if (response.headersSent) {
        return next(error);
    }
    console.error(error);
    return response.status(500).json({ error: 'Internal server error.' });
}

/** Starts the server application. */
export function start(): Application {
    let application = express();
    application.use(cors());
    application.use(parser.json());
    application.get('/ping', (request, response) => response.status(200).end());
    accounts.use(application);
    files.use(application);
    folders.use(application);
    search.use(application);
    application.use(ise);
    return application;
}
