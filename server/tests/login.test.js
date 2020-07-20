/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  before, describe, after, it,
} from 'mocha';
import app from '../app';
import { mockData, clearUsers } from './utils';

chai.use(chaiHttp);
chai.should();

describe('Login tests', () => {
  before('create a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.benSignup)
      .end((_err, _res) => {
        done();
      });
  });
  before('create the admin', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/make-admin')
      .send({ password: process.env.A_PASSWORD })
      .end((_err, _res) => {
        done();
      });
  });
  after('delete users', async () => {
    await clearUsers();
  });
  it('should log in a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.benLogin)
      .end((_err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('User logged in successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        done();
      });
  });
  it('should log in the admin', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.adminLogin)
      .end((_err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Admin logged in successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        done();
      });
  });
  it('should not login a user with incomplete info', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'Password@100' })
      .end((_err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('email is required');
        done();
      });
  });
  it('should not login a user with incorrect password', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.benLoginIncPwd)
      .end((_err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('status').eql(401);
        res.body.should.have.property('error').eql('Incorrect password');
        done();
      });
  });
  it('should not login a non-existing user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.benLoginNotFound)
      .end((_err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql("User doesn't exist");
        done();
      });
  });
});
