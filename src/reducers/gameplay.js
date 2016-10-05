import { INITIALIZE_GAMES,
        NEW_GAME,
        MAKE_MOVE,
        MOVE_CURSOR,
        SET_GAME_EVALUATOR,
        REQUEST_BOOK_MOVES,
        SET_BOOK_MOVES
      } from '../constants';

import {Map} from 'immutable';

import {
  gameFromImmutable,
  GameState,
} from '../store/model/gameState.js';

export default function gameplay(state = Map(), action) {
  let gameID = null, clientID = null, gameData = null, gameState;
  if (action.payload) {
    clientID = action.payload.clientID;
    gameID = action.payload.gameID;
    if (gameID && clientID) {
      gameData = state.getIn([clientID, 'games', gameID]);
      if (gameData) {
        gameState = gameFromImmutable(gameData);
      }
    }
  }

  switch (action.type) {
    case INITIALIZE_GAMES:
      return state.setIn([clientID, 'games'], Map());
    case NEW_GAME:
      if (!state.get(clientID)) {
        state = state.set(clientID, Map());
      }
      if (!state.get(clientID).get('games')) {
        state = state.setIn([clientID, 'games'], Map());
      }
      return state.setIn([clientID, 'games', gameID], new GameState().toImmutable());
    case MAKE_MOVE:
      const move = action.payload.move;
      const evaluator = action.payload.evaluator;
      if (gameState) {
        gameState.makeMove(move, evaluator);
        state = state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    case MOVE_CURSOR:
      if (gameState) {
        gameState.moveCursor(action.payload.cursor);
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    case SET_GAME_EVALUATOR:
      if (gameState) {
        gameState.setEvaluator(action.payload.evaluator);
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    case REQUEST_BOOK_MOVES: {
      if (gameState) {
        gameState.setRequest(REQUEST_BOOK_MOVES); // just use the constant
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
      return state;
    }
    case SET_BOOK_MOVES: {
      if (gameState) {
        gameState.setBookMoves(action.payload.bookMoves);
        gameState.setRequest('');
        return state.setIn([clientID, 'games', gameID], gameState.toImmutable());
      }
    }
    default:
      return state;
  }
}
