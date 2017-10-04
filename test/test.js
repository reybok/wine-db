'use strict';

process.env.NODE_ENV = 'test';
process.env.PORT = 8080;
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/api-test';

const request = require('superagent');
const expect = require('expect.js');

const Wine = require('../models/wine');

describe('API', function() {
  const PATH = 'localhost:'+process.env.PORT;
  let server = undefined;

  before(function(done) {
    let config = require('../config');
    server = require('../server')(config, done);
  });

  describe('GET/wines', function() {
    let content = [
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

    it('should GET empty array on empty database', function(done) {
      request
        .get(PATH+'/wines')
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
          done();
        });
    });
    it('should GET all wines in the database', function(done) {
      createContent(content, done, () => {
        request
          .get(PATH+'/wines')
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body).to.eql(content);
            done();
          });
      });
    });
    it('should GET and filter wines by \'name\'', function(done) {
      createContent(content, done, () => {
        request
          .get(PATH+'/wines')
          .query({name: 'Rießling'})
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(1);
            expect(res.body[0]).to.eql(content[1]);
            done();
          });
      });
    });
    it('should GET and filter wines by \'year\'', function(done) {
      createContent(content, done, () => {
        request
          .get(PATH+'/wines')
          .query({year: 2013})
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(1);
            expect(res.body[0]).to.eql(content[0]);
            done();
          });
      });
    });
    it('should GET and filter wines by \'type\'', function(done) {
      createContent(content, done, () => {
        request
          .get(PATH+'/wines')
          .query({type: 'white'})
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(1);
            expect(res.body[0]).to.eql(content[1]);
            done();
          });
      });
    });
    it('should GET and filter wines by \'country\'', function(done) {
      createContent(content, done, () => {
        request
          .get(PATH+'/wines')
          .query({country: 'France'})
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(1);
            expect(res.body[0]).to.eql(content[0]);
            done();
          });
      });
    });

    afterEach(function(done) {
      Wine.remove(done);
    });
  });

  describe('POST/wines', function() {
    it('should not POST a wine without \'name\' field', function(done) {
      let wine = {
        year: 2011,
        country: 'France',
        type: 'red',
        description: 'Sensual and understated',
      };
      request
        .post(PATH+'/wines')
        .send(wine)
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(400);
          expect(res.body.name).to.be('ValidationError');
          expect(res.body.errors).to.exist;
          expect(res.body.errors.name.kind).to.be('required');
          expect(res.body.errors.name.path).to.be('name');
          done();
        });
    });
    it('should not POST a wine without \'year\' field', function(done) {
      let wine = {
        name: 'Pinot noir',
        country: 'France',
        type: 'red',
        description: 'Sensual and understated',
      };
      request
        .post(PATH+'/wines')
        .send(wine)
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(400);
          expect(res.body.name).to.be('ValidationError');
          expect(res.body.errors).to.exist;
          expect(res.body.errors.year.kind).to.be('required');
          expect(res.body.errors.year.path).to.be('year');
          done();
        });
    });
    it('should not POST a wine with a wrong \'year\' format', function(done) {
      let wine = {
        name: 'Pinot noir',
        year: 'Zweitausendelf',
        country: 'France',
        type: 'red',
        description: 'Sensual and understated',
      };
      request
        .post(PATH+'/wines')
        .send(wine)
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(400);
          expect(res.body.name).to.be('ValidationError');
          expect(res.body.errors).to.exist;
          expect(res.body.errors.year.kind).to.be('Number');
          expect(res.body.errors.year.path).to.be('year');
          done();
        });
    });
    it('should not POST a wine without \'country\' field', function(done) {
      let wine = {
        name: 'Pinot noir',
        year: 2011,
        type: 'red',
        description: 'Sensual and understated',
      };
      request
        .post(PATH+'/wines')
        .send(wine)
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(400);
          expect(res.body.name).to.be('ValidationError');
          expect(res.body.errors).to.exist;
          expect(res.body.errors.country.kind).to.be('required');
          expect(res.body.errors.country.path).to.be('country');
          done();
        });
    });
    it('should not POST a wine without \'type\' field', function(done) {
      let wine = {
        name: 'Pinot noir',
        year: 2011,
        country: 'France',
        description: 'Sensual and understated',
      };
      request
        .post(PATH+'/wines')
        .send(wine)
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(400);
          expect(res.body.name).to.be('ValidationError');
          expect(res.body.errors).to.exist;
          expect(res.body.errors.type.kind).to.be('required');
          expect(res.body.errors.type.path).to.be('type');
          done();
        });
    });
    it('should not POST a wine with invalid \'type\'', function(done) {
      let wine = {
        name: 'Pinot noir',
        year: 2011,
        country: 'France',
        type: 'blue',
        description: 'Sensual and understated',
      };
      request
        .post(PATH+'/wines')
        .send(wine)
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(400);
          expect(res.body.name).to.be('ValidationError');
          expect(res.body.errors).to.exist;
          expect(res.body.errors.type.kind).to.be('enum');
          expect(res.body.errors.type.path).to.be('type');
          done();
        });
    });
    it('should POST a valid wine and return document with id', function(done) {
      let wine = {
        name: 'Pinot noir',
        year: 2011,
        country: 'France',
        type: 'red',
        description: 'Sensual and understated',
      };
      request
        .post(PATH+'/wines')
        .send(wine)
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body._id).to.exist;
          let doc = Object.assign({}, res.body);
          delete doc['_id'];
          expect(doc).to.eql(wine);
          done();
        });
    });
    it('should POST a wine without \'description\' field', function(done) {
      let wine = {
        name: 'Pinot noir',
        year: 2011,
        country: 'France',
        type: 'red',
      };
      request
        .post(PATH+'/wines')
        .send(wine)
        .end((err, res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body).to.exist;
          expect(res.body._id).to.exist;
          let doc = Object.assign({}, res.body);
          delete doc._id;
          expect(doc).to.eql(wine);
          done();
        });
    });

    afterEach(function(done) {
      Wine.remove(done);
    });
  });

  describe('PUT/wines/:id', function() {
    let content = {
      _id: '59d33e98ef56b0402864c69c',
      name: 'Pinot noir',
      year: 2011,
      country: 'France',
      type: 'red',
      description: 'The normal one',
    };

    it('should not UPDATE if \'id\' is invalid', function(done) {
      createContent(content, done, () => {
        request
          .put(PATH+'/wines/this1sN0t4validID')
          .send({name: 'Das Update'})
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
    it('should not UPDATE if new \'year\' is invalid', function(done) {
      createContent(content, done, () => {
        request
          .put(PATH+'/wines/'+content._id)
          .send({year: 'Zweitausendelf'})
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
    it('should not UPDATE if new \'type\' is invalid', function(done) {
      createContent(content, done, () => {
        request
          .put(PATH+'/wines/'+content._id)
          .send({type: 'blue'})
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
    it('should UPDATE and return document', function(done) {
      let update = {
        name: 'Das Update',
        year: 2017,
        country: 'Germany',
        type: 'white',
        description: '*NEW* *NEW* *NEW*',
      };
      let wine = Object.assign({}, content, update);

      createContent(content, done, () => {
        request
          .put(PATH+'/wines/'+content._id)
          .send(update)
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body).to.eql(wine);
            done();
          });
      });
    });

    afterEach(function(done) {
      Wine.remove(done);
    });
  });

  describe('GET/wines/:id', function() {
    let content = [
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

    it('should not GET anything if \'id\' is invalid', function(done) {
      createContent(content, done, () => {
        request
          .get(PATH+'/wines/this1sN0t4validID')
          .end((err, res) => {
            expect(err).to.exist;
            expect(err.status).to.equal(400);
            done();
          });
      });
    });
    it('should GET a wine from the database', function(done) {
      createContent(content, done, () => {
        request
          .get(PATH+'/wines/'+content[0]._id)
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body).to.eql(content[0]);
            done();
          });
      });
    });

    afterEach(function(done) {
      Wine.remove(done);
    });
  });

  describe('DEL/wines/:id', function() {
    let content = {
      _id: '59d33e98ef56b0402864c69c',
      name: 'Pinot noir',
      year: 2011,
      country: 'France',
      type: 'red',
      description: 'The normal one',
    };

    it('should not DELETE if \'id\' is invalid', function(done) {
      createContent(content, done, () => {
        request
          .delete(PATH+'/wines/this1sN0t4validID')
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(400);
            done();
          });
      });
    });

    it('should DELETE document from db and message success', function(done) {
      createContent(content, done, () => {
        request
          .delete(PATH+'/wines/'+content._id)
          .end((err, res) => {
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body.success).to.be(true);

            Wine.count({}, (err, count) => {
              if (err) {
                done(err);
              } else {
                expect(count).to.be(0);
                done();
              }
            });
          });
      });
    });

    afterEach(function(done) {
      Wine.remove(done);
    });
  });

  after(function(done) {
    server.close(done);
  });
});

function createContent(content, done, callback) {
  content = [].concat(content);
  Wine.count({}).then((count) => {
    expect(count).to.be(0);
    Wine.create(content).then((success) => {
      Wine.count({}).then((count) => {
          expect(count).to.be(content.length);
          typeof callback === 'function' && callback();
        }).catch((err) => done(err));
    }).catch((err) => done(err));
  }).catch((err) => done(err));
}
