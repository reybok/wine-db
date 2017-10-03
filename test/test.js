'use strict';

process.env.NODE_ENV = 'test';
process.env.PORT = 8080;
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/api-test';

const request = require('superagent');
const expect = require('expect.js');

describe('API', function() {
  const PATH = 'localhost:'+process.env.PORT;
  let server = undefined;

  before(function(done) {
    let config = require('../config');
    server = require('../server')(config, done);
  });

  describe('GET/wines', function() {
    const content = [
      {
        _id: '59d33e98ef56b0402864c69c',
        name: 'Cabernet Sauvignon',
        year: 2013,
        country: 'France',
        type: 'red',
        description: 'A good one',
      },
      {
        _id: '59d33e9aef56b0402864c69d',
        name: 'Rießling',
        year: 2017,
        country: 'Germany',
        type: 'white',
        description: 'A commonly known wine',
      },
    ];

    before(function(done) {
      request
        .post(PATH+'/wines')
        .set('accept', 'application/json')
        .type('json')
        .send(JSON.stringify(content))
        .end((err, res) => {
          if (err) console.log(err);
          done();
        });
    });

    it('should return all documents', function(done) {
      request
        .get(PATH+'/wines')
        .then((res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body).to.have.length(2);
          expect(res.body).to.eql(content);
          done();
        })
        .catch((err) => done(err));
    });

    after(function(done) {
      server.clear(done);
    });
  });
  describe('POST/wines', function() {
    it('should create new document with id and save to db');
  });
  describe('PUT/wines/:id', function() {
    it('should return updated document');
  });
  describe('GET/wines/:id', function() {
    it('should return complete document for id parameter');
  });
  describe('DEL/wines/:id', function() {
    it('should delete document from db for id parameter');
  });

  after(function(done) {
    server.stop(done);
  });
});
