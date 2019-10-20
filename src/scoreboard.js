const POINT_TO_SCORE = {
  '0': 'love',
  '1': '15',
  '2': '30',
  '3': '40',
};

/*
 * Game ends when one of the player reach 4 or 5 points:
 *    - When a player has 5 points is a sure win
 *    - When a player has 4 points the other one should have at least 2 point less
 */
function isGameEnded(gamePoints) {
  return (
    gamePoints.player1 === 5 ||
    gamePoints.player2 === 5 ||
    (gamePoints.player1 === 4 && gamePoints.player2 <= 2) ||
    (gamePoints.player1 <= 2 && gamePoints.player2 === 4)
  );
}

/*
 * Has one of the player the advantage? Both player cannot have the advantage at the same time
 */
function hasPlayerAdvantage(gamePoints) {
  return (
    !isGameEnded(gamePoints) &&
    (gamePoints.player1 === 4 || gamePoints.player2 === 4)
  );
}

export const initialState = {
  gamePoints: {
    player1: 0,
    player2: 0,
  },
  gameState: 'REGULAR',
};

export function setScore(playerNumber, previousState) {
  const gamePoints = Object.assign({}, previousState.gamePoints);
  let gameState = previousState.gameState;

  if (gameState === 'WINNING') {
    // nothing to do here
    return previousState;
  } else if (gameState === 'DEUCE') {
    if (gamePoints.player1 === gamePoints.player2) {
      gamePoints[`player${playerNumber}`] =
        previousState.gamePoints[`player${playerNumber}`] + 1;
    } else {
      const playerWithAdvantage =
        gamePoints.player1 > gamePoints.player2 ? 1 : 2;

      if (playerWithAdvantage !== playerNumber) {
        // draw: remove the other player advantage
        gamePoints[`player${playerWithAdvantage}`] =
          previousState.gamePoints[`player${playerWithAdvantage}`] - 1;
      } else {
        // win: increment the player score
        gamePoints[`player${playerNumber}`] =
          previousState.gamePoints[`player${playerNumber}`] + 1;
        gameState = 'WINNING';
      }
    }
  } else {
    // REGULAR STATE
    gamePoints[`player${playerNumber}`] =
      previousState.gamePoints[`player${playerNumber}`] + 1;
    if (gamePoints[`player${playerNumber}`] === 4) {
      gameState = 'WINNING';
    } else if (gamePoints.player1 === 3 && gamePoints.player2 === 3) {
      gameState = 'DEUCE';
    }
  }

  return {
    gamePoints,
    gameState,
  };
}

export function getGameScore(gamePoints) {
  const result = {
    scoreCall: null,
    winningPlayer: null,
  };

  // winning player
  if (gamePoints.player1 === gamePoints.player2) {
    result.winningPlayer = null;
  } else {
    result.winningPlayer =
      gamePoints.player1 > gamePoints.player2 ? `player1` : `player2`;
  }

  // score call
  if (isGameEnded(gamePoints)) {
    result.scoreCall = `Game, ${result.winningPlayer}`;
  } else if (hasPlayerAdvantage(gamePoints)) {
    result.scoreCall = `Advantage, ${result.winningPlayer}`;
  } else if (gamePoints.player1 === gamePoints.player2) {
    // draw
    const scorePrefix =
      gamePoints.player1 === 0
        ? `love`
        : POINT_TO_SCORE[`${gamePoints.player1}`];
    result.scoreCall = `${scorePrefix}-all`;
  } else {
    // one of the player is winning without the advantage
    result.scoreCall = `${POINT_TO_SCORE[`${gamePoints.player1}`]}-${
      POINT_TO_SCORE[`${gamePoints.player2}`]
    }`;
  }

  return result;
}
