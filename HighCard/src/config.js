const config = {
  api: {
    proto: 'http',
    host: process.env.REACT_APP_API_HOST || 'example.com',
    basePath: '',
    services: {
      games: '/games',
      players: '/players',
      cards: '/cards',
      decks: '/decks'
    }
  }
};

console.log('LOADED CONFIG:');
console.dir(config);

export default config;
