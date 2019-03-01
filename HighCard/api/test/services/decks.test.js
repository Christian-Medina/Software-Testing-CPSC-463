const assert = require('assert');
const app = require('../../src/app');
const {BadRequest, NotImplemented} = require('@feathersjs/errors');

describe('\'deck\' service', function() {
  let service;
  let deck;
  let cards;

  it('registered the service', function() {
    service = app.service('decks');
    assert.ok(service, 'Registered the service');
  });

  describe('#create()', function() {
    it('should create a deck of 52 cards when given {count: 1}', async function() {
      deck = await service.create({count: 1});
      assert.strictEqual(deck.cards.length, 52);
    });
    it('should contain references to actual card objects', async function () {
      cards = (await app.service('cards').find({query: {_id: {$in: deck.cards}}})).data;
      assert.ok(cards);
      assert.strictEqual(cards.length, 52);
    });
    it('should not contain duplicate card values when using 1 deck', function() {
      const cardMap = cards.reduce((cardMap, {suit, rank}) => {
        cardMap[suit] = cardMap[suit] || {};
        cardMap[suit][rank] = true;
        return cardMap;
      }, {});
      const uniqueCardCount = Object.keys(cardMap).reduce((total, suit) => total + Object.keys(cardMap[suit]).length, 0);
      assert.strictEqual(uniqueCardCount, 52);
    });
    it('should have the current index index set to 0', function() {
      assert.strictEqual(deck.currentIndex, 0);
    });
    it('should contain the card data for the card at index 0', async function() {
      const firstCard = await app.service('cards').get(deck.cards[0]);
      assert.deepStrictEqual(deck.currentCard, firstCard);
    });
  });

  describe('#update()', function() {
    it('should return a \'Bad Request\' error if a method field is not given', async function() {
      await assert.rejects(service.update(null, {}), BadRequest);
    });
    it('should return a \'Not Implemented\' error if using an invalid method', async function(){
      await assert.rejects(service.update(null, {method: 'foo'}, NotImplemented));
    });
    describe('Method: NEXT', function() {
      it('should get the next card in the deck', async function() {
        const oldIndex = deck.currentIndex;
        const nextCard = await app.service('cards').get(deck.cards[oldIndex + 1]);
        const nextResult = await service.update(deck._id, {method: 'NEXT'});
        assert.deepStrictEqual(nextResult.currentCard, nextCard);
        assert.strictEqual(nextResult.currentIndex, oldIndex + 1);
      });
    });
  });
});
