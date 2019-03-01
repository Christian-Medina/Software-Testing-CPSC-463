// Initializes the `game` service on path `/game`
const { Service: MongoService } = require('feathers-mongodb');
const hooks = require('./games.hooks');
const { ObjectId } = require('mongodb');

class GamesService extends MongoService {
  setup(app){
    this.app = app;
  }
  async remove(id, params){
    const game = await super.remove(id, params);
    const cards = await this.app.service('cards').remove(null, {query: {gameId: id}});
    const decks = await this.app.service('decks').remove(null, {query: {gameId: id}});
    const players = await this.app.service('players').remove(null, {query: {_id: {$in: [ObjectId(game.playerId), ObjectId(game.opponentId)]}}});

    return {
      decks,
      cards,
      players,
      games: [game]
    };
  }
}

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/games', new GamesService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('games');

  mongoClient.then(db => {
    service.Model = db.collection('games');
  });

  service.hooks(hooks);
};
