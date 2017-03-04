import * as request from 'supertest';
import { expect } from 'chai';
import { Response } from 'supertest';

import { APPLICATION } from './test';

describe('/folders', () => {
    it('disallows the creation of /foo without authorization', done => {
        request(APPLICATION).post('/folders')
            .send({ path: '/foo' })
            .expect((response: Response) => {
                expect(response.status).to.equal(403);
                expect(response.body.error).to.equal('Permission denied.');
            }).end(done);
    });

    it('disallows the creation of /foo/bar without authorization', done => {
        request(APPLICATION).post('/folders')
            .send({ path: '/foo/bar' })
            .expect((response: Response) => {
                expect(response.status).to.equal(403);
                expect(response.body.error).to.equal('Permission denied.');
            }).end(done);
    });

    let eric: string;

    it('allows eric@samson.com to log in', done => {
        request(APPLICATION).post('/accounts/login')
            .send({ email: 'eric@samson.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                eric = response.body.jwt;
            }).end(done);
    });

    it('allows the creation of /foo', done => {
        request(APPLICATION).post('/folders')
            .send({ path: '/foo' }).set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(1);
            }).end(done);
    });

    it('allows the creation of /foo/bar', done => {
        request(APPLICATION).post('/folders')
            .send({ path: '/foo/bar' }).set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(2);
            }).end(done);
    });

    it('disallows the double creation of /foo', done => {
        request(APPLICATION).post('/folders')
            .send({ path: '/foo' }).set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(409);
                expect(response.body.error).to.equal('Folder already exists.');
            }).end(done);
    });

    it('disallows the double creation of /foo/bar', done => {
        request(APPLICATION).post('/folders')
            .send({ path: '/foo/bar' }).set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(409);
                expect(response.body.error).to.equal('Folder already exists.');
            }).end(done);
    });

    it('allows querying all folders', done => {
        request(APPLICATION).get('/folders')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                let folders = response.body.folders;
                expect(folders.length).to.equal(2);
                expect(folders[0].id).to.equal(1);
                expect(folders[0].path).to.equal('/foo');
                expect(folders[1].id).to.equal(2);
                expect(folders[1].path).to.equal('/foo/bar');
            }).end(done);
    });

    it('allows querying /foo', done => {
        request(APPLICATION).get('/folders/1')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(1);
                expect(response.body.path).to.equal('/foo');
                expect(response.body.files).to.deep.equal([]);
            }).end(done);
    });

    it('allows querying /foo/bar', done => {
        request(APPLICATION).get('/folders/2')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(2);
                expect(response.body.path).to.equal('/foo/bar');
                expect(response.body.files).to.deep.equal([]);
            }).end(done);
    });
});
