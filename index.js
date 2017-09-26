'use strict'

/**
 * Module Dependencies
 */
const config = require('./config');
const restify = require('restify');
const mongodb = require('mongodb').MongoClient;

/**
  * Initialize Server
  */
const server = restify.createServer({
  name    : config.name,
	version : config.version,
});

server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({ mapParams: true }));
server.use(restify.plugins.fullResponse());

/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, () => {
	// establish connection to mongodb
  mongodb.connect(config.db.uri, (error, db) => {

          if (error) {
              console.error('An error occurred while attempting to connect to MongoDB', error)
              process.exit(1);
          }

          //require('./routes')({ db, server });

          console.log(
              '%s v%s ready to accept connections on port %s in %s environment.',
              server.name,
              config.version,
              config.port,
              config.env
          );
  });

});
