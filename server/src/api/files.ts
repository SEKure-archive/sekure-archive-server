import { Application, NextFunction, Request, Response } from 'express';

import * as auth from '../auth';
import * as aws from '../aws';
import * as json from '../json';
import { Db } from '../db';

const FILE_SCHEMA = {
    type: 'object',
    properties: {
        region: { type: 'string' },
        accessKeyID: { type: 'string' },
        secretAccessKey: { type: 'string' },
        folder: { type: 'string' },
        name: { type: 'string' },
        mime: { type: 'string' },
        size: { type: 'number' },
        created: { type: 'string' },
        s3: { type: 'string' },
    },
    required: ['region', 'accessKeyID', 'secretAccessKey', 'folder', 'name', 'mime', 'size', 'created', 's3'],
};

/** Handles POST /files (file creation). */
function postFiles(request: Request, response: Response, next: NextFunction) {
    aws.validate(request.body.region, request.body.accessKeyID, request.body.secretAccessKey).then(success => {
        return Db.call(
            'insert_file',
            request.body.folder,
            request.body.name,
            request.body.mime,
            request.body.size,
            request.body.created,
            request.body.s3,
        ).then(success => {
            if (success) {
                response.status(200).end();
            } else {
                response.status(400).end();
            }
        });
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
    application.post('/files', json.validate(FILE_SCHEMA), postFiles);
    application.get('/files/:fileID', auth.authenticate, getFile);
}
