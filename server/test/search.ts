import * as aws from 'aws-sdk';
import * as request from 'supertest';
import { expect } from 'chai';
import { Response } from 'supertest';

import { APPLICATION } from './test';

describe('/files', () => {
    let eric: string;

    it('allows eric@samson.com to log in', done => {
        request(APPLICATION).post('/accounts/login')
            .send({ email: 'eric@samson.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                eric = `Bearer ${response.body.jwt}`;
            }).end(done);
    });

    it('allows searching for /foo', done => {
        request(APPLICATION).get('/search')
            .set('Authorization', eric)
            .send({ query: '.txt' })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.results.length).to.equal(2);
            }).end(done);
    });
});
