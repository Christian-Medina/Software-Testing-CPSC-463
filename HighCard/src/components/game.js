import React, { Component } from 'react';
import Card from './card';
import Board from './board';
import GameService from '../services/game';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: null,
      opponent: null,
      game: null,
      gameStarted: false
    };
  }

  // TODO fix error with game reset
  // TODO Display message when out of cards
  // TODO Low Res Screen fixes
  // TODO better front-end build step (maybe use docker?)

  // TODO add unit test w/ mocha
  // TODO add unit test using selenium

  // TODO call selenium from node



  /**
   * Conditionally renders the game board
   */
  renderBoard() {
    if(this.state.gameStarted) {
      const playerCard = this.state.player.deck.currentCard;
      const opponentCard = this.state.opponent.deck.currentCard;
      return <Board playerCard={playerCard} opponentCard={opponentCard} />
    } else {
      return <p>Start a new game to start playing!</p>
    }
  }

  /**
   * Button and Handler for starting and resetting games
   */
  renderStartOrRestButton() {
    async function handleClick(){
      const {player, opponent, game} = await GameService.resetGame(this.state.game);
      this.setState({
        gameStarted: true,
        player,
        opponent,
        game
      });
    }

    if(!this.state.gameStarted) {
      return <button type="button" className="btn btn-success" onClick={handleClick.bind(this)}>Start Game</button>
    } else {
      return <button type="button" className="btn btn-warning" onClick={handleClick.bind(this)}>Reset</button>
    }
  }

  async handleNextCard(event) {
    if(this.state.gameStarted) {
      const {player, opponent} = this.state;
      const playerDeck = await GameService.drawCard(player.deck);
      const opponentDeck = await GameService.drawCard(opponent.deck);
      this.setState({
        player: {
          deck: playerDeck
        },
        opponent: {
          deck: opponentDeck
        }
      })
    }
  }

  /**
   * JSX
   */
  render() {
    return (
      <div>
        <div className="container justify-content-end d-flex flex-column" style={{height: '93vh'}}>
          <div className="pt-3 row justify-content-center">
            <div className="col text-center">
              <div className="d-flex justify-content-center align-content-end">
                <Card fileName="cardBack_green4.png"/>
              </div>
            </div>
          </div>
          <div className="pr-5 pl-5 mt-auto row justify-content-center">
            <div className="col text-center">
              {this.renderBoard()}
            </div>
          </div>
          <div className="row mt-auto justify-content-center mb-2">
            <div className="col text-center">
              <div className="d-flex justify-content-center align-content-end">
                <div onClick={this.handleNextCard.bind(this)}>
                  <Card fileName="cardBack_blue4.png"/>
                </div>
              </div>
            </div>
          </div>
          <div className="row fixed-bottom bg-dark">
            <div className="col pl-4 p-2">
              {this.renderStartOrRestButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
