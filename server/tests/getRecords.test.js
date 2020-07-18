/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import {
  describe, before, after, it,
} from 'mocha';
import app from '../app';
import { mockData, clearRecords, clearUsers } from './utils';

config();

chai.use(chaiHttp);
chai.should();

describe('Fetching records', () => {
  before('Sign up a user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.benSignup)
      .end((err, res) => {
        mockData.benToken = res.body.data.token;
        done();
      });
  });
  before('Sign up another user', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.bruceSignup)
      .end((err, res) => {
        mockData.bruceToken = res.body.data.token;
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
  before('Log in the admin', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.adminLogin)
      .end((err, res) => {
        mockData.adminToken = res.body.data.token;
        done();
      });
  });
  before('create a new intervention record', (done) => {
    chai
      .request(app)
      .post('/api/v1/records')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newIntRecord)
      .end((err, res) => {
        mockData.recordId1 = res.body.data.record.id;
        done();
      });
  });
  before('create a new red-flag record', (done) => {
    chai
      .request(app)
      .post('/api/v1/records')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newRedRecord)
      .end((err, res) => {
        done();
      });
  });
  before('create another red-flag record', (done) => {
    chai
      .request(app)
      .post('/api/v1/records')
      .set('Authorization', `Bearer ${mockData.bruceToken}`)
      .send(mockData.newRedRecord)
      .end((_err, res) => {
        mockData.recordId2 = res.body.data.record.id;
        done();
      });
  });
  after('delete users', async () => {
    await clearUsers();
  });
  after('delete records', async () => {
    await clearRecords();
  });
  it('should fetch all records by a user', (done) => {
    chai
      .request(app)
      .get('/api/v1/records')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Records fetched successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('records');
        res.body.data.records.should.be.a('Array');
        done();
      });
  });
  it('Admin should fetch all records by all users', (done) => {
    chai
      .request(app)
      .get('/api/v1/records')
      .set('Authorization', `Bearer ${mockData.adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Records fetched successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('records');
        res.body.data.records.should.be.a('Array');
        done();
      });
  });
  it('Admin should fetch all red-flag records by all users', (done) => {
    chai
      .request(app)
      .get('/api/v1/records/red-flags')
      .set('Authorization', `Bearer ${mockData.adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Records fetched successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('records');
        res.body.data.records.should.be.a('Array');
        done();
      });
  });
  it('Admin should fetch all intervention records by all users', (done) => {
    chai
      .request(app)
      .get('/api/v1/records/interventions')
      .set('Authorization', `Bearer ${mockData.adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Records fetched successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('records');
        res.body.data.records.should.be.a('Array');
        done();
      });
  });
  it('should fetch all red-flag records by a user', (done) => {
    chai
      .request(app)
      .get('/api/v1/records/red-flags')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Records fetched successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('records');
        res.body.data.records.should.be.a('Array');
        done();
      });
  });
  it('should fetch all intervention records by a user', (done) => {
    chai
      .request(app)
      .get('/api/v1/records/interventions')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Records fetched successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('records');
        res.body.data.records.should.be.a('Array');
        done();
      });
  });
  it('should fetch a single record by a user', (done) => {
    chai
      .request(app)
      .get(`/api/v1/records/${mockData.recordId1}`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Record fetched successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('record');
        res.body.data.record.should.be.a('Object');
        done();
      });
  });
  it('Admin should fetch a single record by any user', (done) => {
    chai
      .request(app)
      .get(`/api/v1/records/${mockData.recordId1}`)
      .set('Authorization', `Bearer ${mockData.adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Record fetched successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('record');
        res.body.data.record.should.be.a('Object');
        done();
      });
  });
  it("should not fetch another user's record", (done) => {
    chai
      .request(app)
      .get(`/api/v1/records/${mockData.recordId2}`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Record not found');
        done();
      });
  });
  it('should not fetch a record with invalid parameters', (done) => {
    chai
      .request(app)
      .get('/api/v1/records/2344657')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Invalid parameters');
        done();
      });
  });
});
