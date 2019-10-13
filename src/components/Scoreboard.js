import React, { Component } from 'react';
import { initialState, getGameScore, setScore } from '../scoreboard';

class Scoreboard extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.increaseScore = this.increaseScore.bind(this);
  }

  increaseScore(playerNumber) {
    this.setState(setScore(playerNumber, this.state));
  }

  render() {
    const score = getGameScore(this.state.gamePoints);
    return (
      <div>
        <h1>Tennis Scoreboard</h1>
        <h2 id="score">{`Score: ${score.scoreCall}`}</h2>
        <button
          className="player1-scores"
          type="button"
          onClick={() => this.increaseScore(1)}
        >
          Player 1 scores
        </button>
        <button
          className="player2-scores"
          type="button"
          onClick={() => this.increaseScore(2)}
        >
          Player 2 scores
        </button>
      </div>
    );
  }
}

export default Scoreboard;
