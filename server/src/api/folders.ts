import { Application, NextFunction, Request, Response } from 'express';

import * as json from '../json';
import * as jwt from '../jwt';
import { Db } from '../db';

const FOLDER_SCHEMA = {
    type: 'object',
    properties: {
        path: { type: 'string' },
    },
    required: ['path'],
};

/** Handles GET /folders (folder querying). */
function getFolders(request: Request, response: Response, next: NextFunction) {
    Db.callMany('select_folders').then(folders => {
        for (let folder of folders) { folder.id = parseInt(folder.id); }
        response.status(200).json({ folders: folders });
    }, next);
}

/** Handles POST /folders (folder creation). */
function postFolders(request: Request, response: Response, next: NextFunction) {
    Db.call('insert_folder', request.body.path).then(id => {
        if (id) {
            response.status(200).json({ id: parseInt(id) });
        } else {
            response.status(409).json({ error: 'Folder already exists.' });
        }
    }, next);
}

/** Handles GET /folders/:folderID (folder querying). */
function getFolder(request: Request, response: Response, next: NextFunction) {
    Db.callOne('select_folder', request.params.folderID).then(folder => {
        if (folder) {
            folder.f.id = parseInt(folder.f.id);
            folder.f.files = folder.fs;
            response.status(200).json(folder.f);
        } else {
            response.status(404).json({ error: 'No such folder.' });
        }
    }, next);
}

export function use(application: Application) {
    application.get('/folders', jwt.authenticate, getFolders);
    application.post('/folders', jwt.authenticate, json.validate(FOLDER_SCHEMA), postFolders);
    application.get('/folders/:folderID', jwt.authenticate, getFolder);
}
