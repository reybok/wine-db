'use strict';

module.exports = {
    name: 'wine-db',
    version: '0.1.4',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/api',
    },
};
