const url = require('url');
const MongoClient = require('mongodb').MongoClient;
const logger = require('./logger');

module.exports = function (app) {
  const mongoConfig = app.get('mongodb');
  const {url:mongoUrl} = mongoConfig;
  const dbName = url.parse(mongoUrl).path.substring(1);
  const mongoOptions = mongoConfig.authEnabled === 'TRUE'? {auth: mongoConfig} : null;
  logger.info(`connecting to mongo with the following options: ${mongoOptions}`);
  const promise = MongoClient.connect(mongoUrl, mongoOptions).then(client => {
    logger.info(`connected to mongodb at ${mongoUrl}`);
    // For mongodb <= 2.2
    if(client.collection) {
      return client;
    }

    return client.db(dbName);
  })
    .catch(err => {
      logger.error(`Failed to connect to mongo at ${mongoUrl}: `, err);
    });

  app.set('mongoClient', promise);
};
