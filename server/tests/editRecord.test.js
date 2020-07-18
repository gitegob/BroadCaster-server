/* eslint-disable no-unused-vars */
import chai from 'chai';
import chaiHttp from 'chai-http';
import {
  describe, before, after, it,
} from 'mocha';
import app from '../app';
import { mockData, clearUsers, clearRecords } from './utils';

chai.use(chaiHttp);
chai.should();

describe('Editing a record', () => {
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
  before('Create a new record', (done) => {
    chai
      .request(app)
      .post('/api/v1/records')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newIntRecord)
      .end((err, res) => {
        mockData.recordId = res.body.data.record.id;
        done();
      });
  });
  after('delete users', async () => {
    await clearUsers();
  });
  after('delete records', async () => {
    await clearRecords();
  });

  it('should edit their record', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/records/${mockData.recordId}`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newRecordEdited)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Record edited successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('record');
        res.body.data.record.should.have.all.keys([
          'id',
          'createdOn',
          'authorId',
          'authorName',
          'title',
          'type',
          'district',
          'sector',
          'cell',
          'status',
          'description',
          'updatedOn',
        ]);
        done();
      });
  });
  it('should edit their record with no change', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/records/${mockData.recordId}`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newRecordEditedNoChange)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Record edited successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('record');
        res.body.data.record.should.have.all.keys([
          'id',
          'createdOn',
          'authorId',
          'authorName',
          'title',
          'type',
          'district',
          'sector',
          'cell',
          'status',
          'description',
          'updatedOn',
        ]);
        done();
      });
  });
  it('should not edit a record with invalid entries', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/records/${mockData.recordId}`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newRecordEditedWrong)
      .end((err, res) => {
        res.should.have.status(400);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('type must be one of [red-flag, intervention]');
        done();
      });
  });
  it('should not edit a non-existent record', (done) => {
    chai
      .request(app)
      .patch('/api/v1/records/12')
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newRecordEdited)
      .end((err, res) => {
        res.should.have.status(404);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Record not found');
        done();
      });
  });
  it('Admin should change the status of a record', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/records/${mockData.recordId}/status`)
      .set('Authorization', `Bearer ${mockData.adminToken}`)
      .send({ status: 'resolved' })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message').eql('Record status updated successfully');
        res.body.should.have.property('data');
        res.body.data.should.have.property('status').eql('resolved');
        done();
      });
  });
  it('should not edit a resolved record', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/records/${mockData.recordId}`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send(mockData.newRecordEdited)
      .end((err, res) => {
        res.should.have.status(403);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(403);
        res.body.should.have.property('error').eql('Record cannot be edited');
        done();
      });
  });
  it('Non-Admin should not change the status of a record', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/records/${mockData.recordId}/status`)
      .set('Authorization', `Bearer ${mockData.benToken}`)
      .send({ status: 'resolved' })
      .end((err, res) => {
        res.should.have.status(403);
        res.should.have.property('body');
        res.body.should.have.property('status').eql(403);
        res.body.should.have
          .property('error')
          .eql('This request requires Administrator privileges');
        done();
      });
  });
});
