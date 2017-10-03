'use strict';

const restify = require('restify');
const mongodb = require('mongodb').MongoClient;

module.exports = (config, callback=undefined) => {
  const server = restify.createServer({
    name: config.name,
    version: config.version,
  });

  server.use(restify.plugins.jsonBodyParser({mapParams: true}));
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser({mapParams: true}));
  server.use(restify.plugins.fullResponse());

  let database = undefined;

  server.listen(config.port, () => {
    mongodb.connect(config.db.uri, (error, db) => { // TODO as promise
      if (error) {
        console.error('An error occurred while '+
          'attempting to connect to MongoDB', error);
        process.exit(1);
      }

      database = db;

      require('./routes/index')({db, server});

      console.log(
        '%s v%s ready to accept connections '+
        'on %s in %s environment.',
        server.name,
        config.version,
        server.url,
        config.env
      );

      typeof callback === 'function' && callback();
    });
  });

  server.clear = (callback=undefined) => {
    if (database) database.collection('wines').remove({});
    typeof callback === 'function' && callback();
  };

  server.stop = (callback=undefined) => {
    server.close();
    if (database) database.close();
    typeof callback === 'function' && callback();
  };

  return server;
};
