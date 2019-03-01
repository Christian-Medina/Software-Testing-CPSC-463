const {BadRequest, NotImplemented} = require('@feathersjs/errors');

const MAX_DECKS = 5;

/**
 * Validate input for number of decks to create
 * @param context
 * @return {*}
 */
function validateDeckCount(context) {
  function checkDeckCount(n){
    if (!n || Number.isNaN(n)) {
      throw new BadRequest('Must send a nonzero "count" property for number of decks to create');
    } if(n > MAX_DECKS) {
      throw new BadRequest(`Must create no more than ${MAX_DECKS} at a time`);
    }
  }

  if (Array.isArray(context.data)) {
    context.data.forEach(data => checkDeckCount(data.count));
  } else {
    checkDeckCount(context.data.count);
  }
  return context;
}

/**
 * Validates the method for the deck update operation
 * @param context
 * @return {*}
 */
function validateDeckUpdate(context) {
  const {method} = context.data;
  const {updateMethods} = context.service;
  const validMethods = Object.keys(updateMethods).map(k => updateMethods[k]);
  if(!method || typeof method !== 'string') {
    throw new BadRequest('Missing "method" field for deck update');
  }
  if(!validMethods.find(m => m === method)) {
    throw new NotImplemented(`Invalid method "${method}"`);
  }

  return context;
}

/**
 * Retrieves a fresh copy of a deck
 * @param context
 * @return {Promise<*>}
 */
async function getDeck(context) {
  context.data.deck = await context.service.get(context.id);
  return context;
}

/**
 * Checks if there is still cards in the deck when using the "next" operation
 * @param context
 * @return {Promise<void>}
 */
async function validateDeckNext(context) {
  const {method} = context.data;
  const numCards = context.data.deck.cards.length;
  const currentIndex = context.data.deck.currentIndex;
  if (method === 'next') {
    if(currentIndex + 1 >= numCards) {
      throw new BadRequest('Cannot get next card: Deck has no more cards');
    }
  }
}



module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [validateDeckCount],
    update: [validateDeckUpdate, getDeck, validateDeckNext],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
