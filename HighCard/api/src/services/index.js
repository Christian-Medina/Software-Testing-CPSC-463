const deck = require('./decks/decks.service.js');
const game = require('./games/games.service.js');
const player = require('./players/players.service.js');
const card = require('./cards/cards.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(deck);
  app.configure(game);
  app.configure(player);
  app.configure(card);
};
