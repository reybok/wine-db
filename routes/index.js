'use strict';

const errors = require('restify-errors');

const Wine = require('../models/wine');

module.exports = function(server) {
    server.get('/wines/', (req, res, next) => {
      Wine.find()
        .then((wines) => res.send(200, wines))
        .catch((err) => res.send(500, err));

      next();
    });

    server.post('/wines/', (req, res, next) => {
      if (!req.is('json')) {
        return next(
          new errors.InvalidContentError('\'application/json\' expected!')
        );
      }

      Wine.create(req.body)
        .then((doc) => res.send(200, doc))
        .catch((err) => res.send(500, err));

      next();
    });

    server.put('/wines/:id', (req, res, next) => {
      next();
    });

    server.get('/wines/:id', (req, res, next) => {
      next();
    });

    server.del('/wines/:id', (req, res, next) => {
      next();
    });

    server.del('/dev/deleteAll/', (req, res, next) => {
      Wine.remove()
        .then((removed) => res.send(204))
        .catch((err) => res.send(500, err));
    });
};
