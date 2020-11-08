import chai from 'chai';
import chaiHttp from 'chai-http';
import { after, describe, it } from 'mocha';
import app from '../app';
import env from '../config/env';
import { mockData, clearUsers } from './utils';

chai.use(chaiHttp);
chai.should();

describe('Signup tests', () => {
  after('delete users', async () => {
    await clearUsers();
  });
  it('should create an admin', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/make-admin')
      .send({ password: env.A_PASSWORD })
      .end((_err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('status').eql(201);
        res.body.should.have.property('message').eql('Admin created successfully');
        done();
      });
  });
  it('should not create an admin when he already exists', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/make-admin')
      .send({ password: env.A_PASSWORD })
      .end((_err, res) => {
        res.should.have.status(409);
        res.body.should.have.property('status').eql(409);
        res.body.should.have.property('error').eql(`Admin already exists:${env.A_EMAIL}`);
        done();
      });
  });
  it('should not create an admin without necessary credentials', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/make-admin')
      .send({ password: 'aWrongPassword' })
      .end((_err, res) => {
        res.should.have.status(403);
        res.body.should.have.property('status').eql(403);
        res.body.should.have.property('error').eql('Forbidden');
        done();
      });
  });
  it('should signup a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.benSignup)
      .end((_err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('status').eql(201);
        res.body.should.have.property('message').eql('User created successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        mockData.benToken = res.body.data.token;
        done();
      });
  });
  it('should retrieve a user\'s data', (done) => {
    chai
      .request(app)
      .get('/api/v1/auth/userData')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((_err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Profile retrieved successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('userData');
        done();
      });
  });
  it('should signup another user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.bruceSignup)
      .end((_err, res) => {
        res.should.have.status(201);
        done();
      });
  });
  it('should not signup a user with incomplete info', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.benSignupInc)
      .end((_err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('lastName is required');
        done();
      });
  });
  it('should not signup a user with bad info', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.benSignupBad)
      .end((_err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not signup an an already existing user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.benSignup)
      .end((_err, res) => {
        res.should.have.status(409);
        res.body.should.have.property('status').eql(409);
        res.body.should.have.property('error').eql('Email already exists');
        done();
      });
  });
});
