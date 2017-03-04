import * as jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { Validator } from 'jsonschema';

/** Returns a middleware function that uses the supplied JSON schema for JSON validation. */
export function validate(schema: any): RequestHandler {
    let validator = new Validator();
    return (request, response, next) => {
        let result = validator.validate(request.body, schema);
        if (result.valid) {
            next();
        } else {
            response.status(400).json({ error: 'Invalid request.', schema: result.errors });
        }
    };
}
