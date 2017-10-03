'use strict';

const restify = require('restify');
const mongoose = require('mongoose');

module.exports = (config, callback=undefined) => {
  const server = restify.createServer({
    name: config.name,
    version: config.version,
  });

  server.use(restify.plugins.jsonBodyParser({mapParams: true}));
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser({mapParams: true}));
  server.use(restify.plugins.fullResponse());

  server.listen(config.port, () => {
    let options = {
      promiseLibrary: global.Promise,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000,
      // useMongoClient: true,
    };
    mongoose.Promise = options.promiseLibrary;
    let connection = mongoose.connection.openUri(config.db.uri, options);

    connection
      .then((db) => {
        require('./routes/index')(server);
        console.log(
          '%s v%s ready to accept connections '+
          'on %s in %s environment.',
          server.name,
          config.version,
          server.url,
          config.env
        );

        typeof callback === 'function' && callback();
      })
      .catch((err) => {
        console.error('An error occurred while '+
          'attempting to connect to MongoDB', error);
        process.exit(1);
      });

    server.on('close', (callback) => {
      connection.close(callback);
    });
  });

  return server;
};
