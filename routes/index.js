'use strict';

const errors = require('restify-errors');

module.exports = function(context) {
    const server = context.server;
    const db = context.db;

    const collection = db.collection('wines');

    server.get('/wines/', (req, res, next) => {
        collection.find().toArray()
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

        let data = Object.assign({}, req.body);

        collection.insertOne(data)
            .then((doc) => {
                let data = Object.assign({}, doc.ops[0]);
                data.id = data._id;
                data._id = {};
                res.send(200, data);
            })
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
        collection.remove({})
            .then((success) => res.send(204))
            .catch((err) => res.send(500, err));
    });
};
