/**
 * Class to do calculations with the current hand
 */
class HandService {
  static isPlayerWinner(playerCard, opponentCard) {
    const playerValue = playerCard.rankValue;
    const opponentValue = opponentCard.rankValue;
    return playerValue - opponentValue;  // numeric spread, 0 is tie
  }
}

export default  HandService
