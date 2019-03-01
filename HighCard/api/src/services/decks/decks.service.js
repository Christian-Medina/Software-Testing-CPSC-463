// Initializes the `deck` service on path `/deck`
const hooks = require('./decks.hooks');
const _ = require('lodash');
const { Service: MongoService } = require('feathers-mongodb');
const Promise = require('bluebird');

class DecksService extends MongoService{
  async setup(app) {
    this.app = app;
    this.suits = await app.service('cards/suits').find();
    this.ranks = await app.service('cards/ranks').find();
    this.updateMethods = {
      NEXT: 'NEXT'
    };
  }

  /**
   * constructs a deck of cards and saves them using the card service.
   * Handles creation of one or more decks
   * @param data
   * @return {void|*}
   */
  async create(data){
    if (Array.isArray(data)){
      return Promise.mapSeries(data, this._createDeck.bind(this)); // order should be preserved
    } else {
      return this._createDeck(data);
    }
  }

  /**
   * Handles PUT requests to a deck object
   * @param id
   * @param data
   * @param params
   * @return {Promise<void>}
   */
  async update(id, data, params) {
    const {method} = data;
    const updateMethods = this.updateMethods;
    switch (method) {
    case updateMethods.NEXT: return this._nextCard(id, data, params);
    }
  }

  /**
   * returns the next card of the deck and updates the deck
   * @param id
   * @param data
   * @param params
   */
  async _nextCard(id, data, params) {
    const cardsService = this.app.service('cards');
    const deck = data.deck;
    const currentIndex = deck.currentIndex + 1;
    const currentCard = await cardsService.get(deck.cards[currentIndex]);
    return this.patch(id, {currentIndex, currentCard});
  }

  /**
   * Method to create deck(s) given an object of API input
   * @param data
   * @return {Promise<{cards, deck}>}
   * @private
   */
  async _createDeck(data){
    const {count, shuffle, playerId, gameId} = data;

    const cardsService = this.app.service('cards');
    const cards = _.flatMap(
      _.range(count),
      deckNumber => this._make({...data, deckNumber}));
    let createdCards = await cardsService.create(cards);
    createdCards = shuffle? _.shuffle(createdCards): createdCards;
    createdCards = createdCards.map(card => card._id);
    const currentIndex = 0;
    const deck = {
      playerId,
      gameId,
      cards: createdCards,
      currentIndex,
      currentCard: await cardsService.get(createdCards[currentIndex])
    };
    return super.create(deck);
  }

  /**
   * Creates a deck of card objects
   * @param {String} gameId
   * @param {String} playerId
   * @param {Number} deckNumber
   * @private
   * @return {Array}
   */
  _make({gameId, playerId, deckNumber}) {
    const {suits, ranks} = this;
    return _.flatMap(_.values(suits), suit => {
      return _.values(ranks).map(({label, rank}) => {
        return {
          gameId,
          playerId,
          suit,
          rank: label,
          rankValue: rank,
          deckNumber
        };
      });
    });
  }
}

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/decks', new DecksService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('decks');

  mongoClient.then(db => {
    service.Model = db.collection('decks');
  });

  service.hooks(hooks);
};
