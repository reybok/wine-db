'use strict';

const config = require('./config');
const restify = require('restify');
const mongodb = require('mongodb').MongoClient;

const server = restify.createServer({
  name: config.name,
  version: config.version,
});

server.use(restify.plugins.jsonBodyParser({mapParams: true}));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({mapParams: true}));
server.use(restify.plugins.fullResponse());

server.listen(config.port, () => {
  mongodb.connect(config.db.uri, (error, db) => {
          if (error) {
              console.error('An error occurred while '+
                'attempting to connect to MongoDB', error);
              process.exit(1);
          }

          // require('./routes')({ db, server });

          console.log(
              '%s v%s ready to accept connections'+
              'on port %s in %s environment.',
              server.name,
              config.version,
              config.port,
              config.env
          );
  });
});
