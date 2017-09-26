'use strict';

module.exports = function(context) {
    const server = context.server;
    const db = context.db;

    const collection = db.collection('wines');

    server.get('/wines/', (req, res, next) => {
        next();
    });

    server.post('/wines/', (req, res, next) => {
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
};
