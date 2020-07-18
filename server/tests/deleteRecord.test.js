/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  describe, before, after, it,
} from 'mocha';
import app from '../app';
import { mockData, clearRecords, clearUsers } from './utils';

chai.use(chaiHttp);
chai.should();

describe('Deleting a record', () => {
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
      .end((_err, res) => {
        mockData.adminToken = res.body.data.token;
        done();
      });
  });
  before('Sign up a user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(mockData.benSignup)
      .end((_err, res) => {
        mockData.benToken = res.body.data.token;
        done();
      });
  });
  before('Create a new record', (done) => {
    chai.request(app)
      .post('/api/v1/records')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newIntRecord)
      .end((_err, res) => {
        mockData.recordId1 = res.body.data.record.id;
        done();
      });
  });

  before('Create another new record', (done) => {
    chai.request(app)
      .post('/api/v1/records')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newIntRecord)
      .end((_err, res) => {
        mockData.recordId2 = res.body.data.record.id;
        done();
      });
  });
  before('Change the record status to resolved', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/records/${mockData.recordId2}/status`)
      .set('Authorization', `Bearer ${mockData.adminToken}`)
      .send({ status: 'resolved' })
      .end((_err, _res) => {
        done();
      });
  });
  after('delete users', async () => {
    await clearUsers();
  });
  after('delete records', async () => {
    await clearRecords();
  });

  it('user should delete their record', (done) => {
    chai.request(app)
      .delete(`/api/v1/records/${mockData.recordId1}`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((_err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Record deleted successfully');
        done();
      });
  });

  it('Should not delete a record which is resolved', (done) => {
    chai.request(app)
      .delete(`/api/v1/records/${mockData.recordId2}`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((_err, res) => {
        res.should.have.status(403);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(403);
        res.body.should.have.property('error').eql('Record cannot be deleted');
        done();
      });
  });

  it('Should not delete a non-existing record', (done) => {
    chai.request(app)
      .delete('/api/v1/records/1000')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .end((_err, res) => {
        res.should.have.status(404);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Record not found');
        done();
      });
  });
});
