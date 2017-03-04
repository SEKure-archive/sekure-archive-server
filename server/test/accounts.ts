import * as request from 'supertest';
import { expect } from 'chai';
import { Response } from 'supertest';

import { APPLICATION } from './test';

describe('/accounts', () => {
    let eric: string;
    let kyle: string;

    it('allows registration of eric@samson.com', done => {
        request(APPLICATION).post('/accounts')
            .send({ email: 'eric@samson.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.contain.keys('jwt');
                eric = response.body.jwt;
            }).end(done);
    });

    it('allows registration of kyle@mayes.com', done => {
        request(APPLICATION).post('/accounts')
            .send({ email: 'kyle@mayes.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.contain.keys('jwt');
                kyle = response.body.jwt;
            }).end(done);
    });

    it('disallows double registration of eric@samson.com', done => {
        request(APPLICATION).post('/accounts')
            .send({ email: 'eric@samson.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(403);
                expect(response.body.error).to.equal('Email is already in use.');
            }).end(done);
    });

    it('disallows double registration of kyle@mayes.com', done => {
        request(APPLICATION).post('/accounts')
            .send({ email: 'kyle@mayes.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(403);
                expect(response.body.error).to.equal('Email is already in use.');
            }).end(done);
    });

    it('allows eric@samson.com to log in', done => {
        request(APPLICATION).post('/accounts/login')
            .send({ email: 'eric@samson.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.contain.keys('jwt');
                eric = response.body.jwt;
            }).end(done);
    });

    it('allows kyle@mayes.com to log in', done => {
        request(APPLICATION).post('/accounts/login')
            .send({ email: 'kyle@mayes.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.contain.keys('jwt');
                kyle = response.body.jwt;
            }).end(done);
    });

    it('disallows eric@samson.com to log in with an invalid password', done => {
        request(APPLICATION).post('/accounts/login')
            .send({ email: 'eric@samson.com', password: 'hunter420' })
            .expect((response: Response) => {
                expect(response.status).to.equal(403);
                expect(response.body.error).to.equal('Invalid email or password.');
            }).end(done);
    });

    it('disallows kyle@mayes.com to log in with an invalid password', done => {
        request(APPLICATION).post('/accounts/login')
            .send({ email: 'kyle@mayes.com', password: 'hunter420' })
            .expect((response: Response) => {
                expect(response.status).to.equal(403);
                expect(response.body.error).to.equal('Invalid email or password.');
            }).end(done);
    });

    it('disallows sean@mcglincy.com to log in', done => {
        request(APPLICATION).post('/accounts/login')
            .send({ email: 'sean@mcglincy.com', password: 'hunter322' })
            .expect((response: Response) => {
                expect(response.status).to.equal(403);
                expect(response.body.error).to.equal('Invalid email or password.');
            }).end(done);
    });
});
