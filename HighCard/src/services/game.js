import ApiService from './api';

/**
 * Service for interacting with API to manipulate game state
 */
class GameService {

  /**
   * Creates a new game using the API
   * @return {Promise<{game, opponent: {deck: *, player: *}, player: {deck: *, player: *}}>}
   */
  static async createGame() {
    const { post, players, decks, games } = ApiService;
    // create players
    const [player, opponent] = await post(players(), [{name: 'player'}, {name: 'opponent'}]);

    // create game
    const game = await post(games(), {
      playerId: player._id,
      opponentId: opponent._id
    });

    //create decks
    const [playerDeck, opponentDeck] = await post(decks(), [
      {playerId: player._id, gameId: game._id, count: 1, shuffle: true},
      {playerId: opponent._id, gameId: game._id, count: 1, shuffle: true}
    ]);

    // return structured data
    return {
      player: {
        player: player,
        deck: playerDeck
      },
      opponent: {
        player: opponent,
        deck: opponentDeck
      },
      game
    };
  }

  /**
   * Restarts the game with a fresh deck. Also clean up the old game
   * @param game
   */
  static resetGame(game) {
    // delete the existing game if it exists
    if(game) {
      ApiService.delete(`${ApiService.games()}/${game._id}`); // we don't need to wait for this to complete
    }
    return GameService.createGame();
  }

  /**
   * Get the next card in the deck using the API
   * @param deck
   */
  static async drawCard(deck) {
    return ApiService.put(`${ApiService.decks()}/${deck._id}`, {method: 'NEXT'});
  }
}

export default GameService;
