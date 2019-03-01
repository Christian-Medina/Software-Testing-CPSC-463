import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';


class Card extends Component {

  static propTypes = {
    card: PropTypes.shape({
      rank: PropTypes.string,
      rankValue: PropTypes.number,
      suit: PropTypes.string
    }),
    fileName: PropTypes.string
  };

  static fileLocation = '/media/png/Cards/';

  /**
   * Determine the file name given a card object
   * @param rank
   * @param suit
   * @return {string}
   */
  static getFileName({rank, suit}) {
    return `/card${_.capitalize(suit)}s${_.capitalize(rank)}.png`;
  }

  /**
   * JSX: Render the card directly if given a filename, otherwise infer filename from card object
   */
  render() {
    const {card, fileName} = this.props;
    if (fileName) {
      return (<img src={Card.fileLocation + fileName} alt="card"/>);
    } else {
      return (<img src={Card.fileLocation + Card.getFileName(card)} alt="card"/>);
    }
  }
}

export default Card;
