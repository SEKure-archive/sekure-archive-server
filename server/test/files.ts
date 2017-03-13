import * as request from 'supertest';
import { expect } from 'chai';
import { Response } from 'supertest';

import { APPLICATION } from './test';

describe('/files', () => {
    it('disallows the creation of /foo/test.txt without authorization', done => {
        request(APPLICATION).post('/files')
            .send({ folder_id: 1, name: 'test.txt', mime: 'text/plain' })
            .expect((response: Response) => {
                expect(response.status).to.equal(403);
                expect(response.body.error).to.equal('Permission denied.');
            }).end(done);
    });

    it('disallows the creation of /foo/bar/test.txt without authorization', done => {
        request(APPLICATION).post('/files')
            .send({ folder_id: 2, name: 'test.txt', mime: 'text/plain' })
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
                eric = `Bearer ${response.body.jwt}`;
            }).end(done);
    });

    it('allows the creation of /foo/test.txt', done => {
        request(APPLICATION).post('/files')
            .send({ folder_id: 1, name: 'test.txt', mime: 'text/plain', size: 1024 })
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.file_id).to.equal(1);
                expect(response.body.version_id).to.equal(1);
            }).end(done);
    });

    it('allows the creation of /foo/bar/test.txt', done => {
        request(APPLICATION).post('/files')
            .send({ folder_id: 2, name: 'test.txt', mime: 'text/plain', size: 2048 })
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.file_id).to.equal(2);
                expect(response.body.version_id).to.equal(2);
            }).end(done);
    });

    it('allows the creation of a new version of /foo/test.txt', done => {
        request(APPLICATION).post('/files')
            .send({ folder_id: 1, name: 'test.txt', mime: 'text/plain', size: 1024 })
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.file_id).to.equal(1);
                expect(response.body.version_id).to.equal(3);
            }).end(done);
    });

    it('allows the creation of a new version of /foo/bar/test.txt', done => {
        request(APPLICATION).post('/files')
            .send({ folder_id: 2, name: 'test.txt', mime: 'text/plain', size: 2048 })
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.file_id).to.equal(2);
                expect(response.body.version_id).to.equal(4);
            }).end(done);
    });

    it('allows querying /foo/test.txt', done => {
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

    it('allows querying /foo/bar/test.txt', done => {
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

    it('allows querying /foo', done => {
        request(APPLICATION).get('/folders/1')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(1);
                expect(response.body.path).to.equal('/foo');
                let files = [{ id: 1, folder_id: 1, name: 'test.txt', mime: 'text/plain', size: 1024 }];
                expect(response.body.files).to.deep.equal(files);
            }).end(done);
    });

    it('allows querying /foo/bar', done => {
        request(APPLICATION).get('/folders/2')
            .set('Authorization', eric)
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body.id).to.equal(2);
                expect(response.body.path).to.equal('/foo/bar');
                let files = [{ id: 2, folder_id: 2, name: 'test.txt', mime: 'text/plain', size: 2048 }];
                expect(response.body.files).to.deep.equal(files);
            }).end(done);
    });
});
