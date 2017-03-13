import { Application, NextFunction, Request, Response } from 'express';

import * as auth from '../auth';
import * as json from '../json';
import { Db } from '../db';

const FILE_SCHEMA = {
    type: 'object',
    properties: {
        folder_id: { type: 'number' },
        name: { type: 'string' },
        mime: { type: 'string' },
    },
    required: ['folder_id', 'name', 'mime'],
};

/** Handles POST /files (file creation). */
function postFiles(request: Request, response: Response, next: NextFunction) {
    Db.callOne('insert_file', request.body.folder_id, request.body.name, request.body.mime).then(result => {
        result.file_id = parseInt(result.file_id);
        result.version_id = parseInt(result.version_id);
        response.status(200).json(result);
    }, next);
}

/** Handles GET /files/:fileID (file querying). */
function getFile(request: Request, response: Response, next: NextFunction) {
    Db.callOne('select_file', request.params.fileID).then(file => {
        if (file) {
            file.f.versions = file.vs;
            response.status(200).json(file.f);
        } else {
            response.status(404).json({ error: 'No such file.' });
        }
    }, next);
}

export function use(application: Application) {
    application.post('/files', auth.authenticate, json.validate(FILE_SCHEMA), postFiles);
    application.get('/files/:fileID', auth.authenticate, getFile);
}
