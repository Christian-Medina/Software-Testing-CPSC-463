import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Card from './card';
import './board.css';
import HandService from '../services/hand';

class Board extends Component {

  static cardType = PropTypes.shape({
    rank: PropTypes.string,
    rankValue: PropTypes.number,
    suit: PropTypes.string
  });

  static propTypes = {
    playerCard: Board.cardType.isRequired,
    opponentCard: Board.cardType.isRequired
  };

  getScore(){
    const {playerCard , opponentCard} = this.props;
    return HandService.isPlayerWinner(playerCard, opponentCard)
  }

  getPlayerClassText() {
    let className = 'glow-effect rounded';
    if(this.getScore() > 0) {
      className += ' winner';
    }
    return className;
  }

  getOpponentClassText() {
    let className = 'glow-effect rounded';
    if(this.getScore() < 0) {
      className += ' winner';
    }
    return className;
  }

  getResultText() {
    const score = this.getScore();
    if (score > 0) {
      return 'YOU WIN!';
    } else if(score < 0) {
      return 'Better luck next time...';
    } else {
      return 'It\'s a tie game!';
    }
  }

  /**
   * JSX: The game board of the the two current cards
   */
  render() {
    const {playerCard , opponentCard} = this.props;
    return(
      <div className="bg-success d-flex flex-row justify-content-around align-content-center pt-4 rounded">
        <div className="pl-4">
          <div className={this.getPlayerClassText()}>
            <Card card={playerCard}/>
          </div>
          <p className="font-weight-bold">Player</p>
        </div>
        <p className="align-self-end font-weight-bold">{this.getResultText()}</p>
        <div className="pr-4">
          <div className={this.getOpponentClassText()}>
            <Card card={opponentCard}/>
          </div>
          <p className="font-weight-bold">Opponent</p>
        </div>
      </div>
    );
  }
}

Board.prototypes = {
  playerCard: PropTypes.string.isRequired
};

export default Board;
