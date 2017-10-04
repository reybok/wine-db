'use strict';

const errors = require('restify-errors');

const Wine = require('../models/wine');

module.exports = function(server) {
    server.get('/wines/', (req, res, next) => {
      let order = req.params.order ? (req.params.order < 0 ? -1 : 1) : 1;
      let sort = req.params.sort ? {[req.params.sort]: order} : undefined;

      Wine.find().sort(sort)
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
        .catch((err) => res.send(400, err));

      next();
    });

    server.put('/wines/:id', (req, res, next) => {
      let options = {
      /* return */new: true,
        runValidators: true,
      };

      Wine.findByIdAndUpdate(req.params.id, req.body, options)
        .then((doc) => res.send(200, doc))
        .catch((err) => res.send(400, err));

      next();
    });

    server.get('/wines/:id', (req, res, next) => {
      Wine.findById(req.params.id)
        .then((doc) => res.send(200, doc))
        .catch((err) => res.send(400, err));

      next();
    });

    server.del('/wines/:id', (req, res, next) => {
      Wine.findByIdAndRemove(req.params.id)
        .then((doc) => res.send(200, {success: true}))
        .catch((err) => res.send(400, err));

      next();
    });

    server.del('/dev/deleteAll/', (req, res, next) => {
      Wine.remove()
        .then((removed) => res.send(204))
        .catch((err) => res.send(500, err));

      next();
    });
};
