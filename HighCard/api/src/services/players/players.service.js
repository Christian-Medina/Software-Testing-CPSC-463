// Initializes the `player` service on path `/player`
const createService = require('feathers-mongodb');
const hooks = require('./players.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/players', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('players');

  mongoClient.then(db => {
    service.Model = db.collection('players');
  });

  service.hooks(hooks);
};
