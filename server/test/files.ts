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

    let one = {
        region: 'us-east-1',
        accessKeyID: 'TOPSECRET',
        secretAccessKey: 'TOPSECRET',
        folder: '/baz',
        name: 'test.txt',
        mime: 'text/plain',
        size: 1024,
        created: '2017-03-18 10:26:00',
        s3: 's3://sekurearchive/baz/test.txt',
    };

    let two = {
        region: 'us-east-1',
        accessKeyID: 'TOPSECRET',
        secretAccessKey: 'TOPSECRET',
        folder: '/baz/qux',
        name: 'test.txt',
        mime: 'text/plain',
        size: 2048,
        created: '2017-03-18 10:26:00',
        s3: 's3://sekurearchive/baz/qux/test.txt',
    };

    it('allows the creation of /baz/test.txt', done => {
        request(APPLICATION).post('/files')
            .send(one)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
            }).end(done);
    });

    it('allows the creation of /baz/qux/test.txt', done => {
        request(APPLICATION).post('/files')
            .send(two)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
            }).end(done);
    });

    one.created = '2017-03-19 10:26:00';
    two.created = '2017-03-19 10:26:00';

    it('allows the creation of a new version of /baz/test.txt', done => {
        request(APPLICATION).post('/files')
            .send(one)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
            }).end(done);
    });

    it('allows the creation of a new version of /baz/qux/test.txt', done => {
        request(APPLICATION).post('/files')
            .send(two)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
            }).end(done);
    });

    it('allows querying /baz/test.txt', done => {
        request(APPLICATION).get('/files/1')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(1);
                expect(response.body.name).to.equal('test.txt');
                expect(response.body.mime).to.equal('text/plain');
                expect(response.body.versions.length).to.equal(2);
                expect(response.body.versions[0].id).to.equal(1);
                expect(response.body.versions[1].id).to.equal(3);
            }).end(done);
    });

    it('allows querying /baz/qux/test.txt', done => {
        request(APPLICATION).get('/files/2')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(2);
                expect(response.body.name).to.equal('test.txt');
                expect(response.body.mime).to.equal('text/plain');
                expect(response.body.versions.length).to.equal(2);
                expect(response.body.versions[0].id).to.equal(2);
                expect(response.body.versions[1].id).to.equal(4);
            }).end(done);
    });

    it('allows querying /baz', done => {
        request(APPLICATION).get('/folders/3')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(3);
                expect(response.body.path).to.equal('/baz');
                let file = {
                    id: 1,
                    folder_id: 3,
                    name: 'test.txt',
                    mime: 'text/plain',
                    size: 1024,
                    created: '2017-03-19T10:26:00',
                };
                expect(response.body.files).to.deep.equal([file]);
            }).end(done);
    });

    it('allows querying /baz/qux', done => {
        request(APPLICATION).get('/folders/4')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(4);
                expect(response.body.path).to.equal('/baz/qux');
                let file = {
                    id: 2,
                    folder_id: 4,
                    name: 'test.txt',
                    mime: 'text/plain',
                    size: 2048,
                    created: '2017-03-19T10:26:00',
                };
                expect(response.body.files).to.deep.equal([file]);
            }).end(done);
    });

    it('allows the download of /baz/test.txt', done => {
        request(APPLICATION).get('/files/1/download')
            .set('Authorization', eric)
            .send({ file_id: 1 })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal('message_identifier');
            }).end(done);
    });

    it('allows the download of /baz/qux/test.txt', done => {
        request(APPLICATION).get('/files/2/download')
            .set('Authorization', eric)
            .send({ file_id: 2 })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal('message_identifier');
            }).end(done);
    });
});
