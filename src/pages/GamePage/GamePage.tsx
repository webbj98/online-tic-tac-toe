import {useEffect, useState} from 'react'
import "./GamePage.css"
import { Board } from '../../components/Board/Board';
import { GameObject, GameState } from '../../../shared/model';
import { socket } from '../../socket';
import { Events } from '../../../shared/events';
import { BLANK_SYMBOL } from '../../../shared/config';
const startRows = 3;
const startCols = 3;
export const GamePage: React.FC<{game: GameObject | undefined}> = ({game}) => {
  if (!game) {
    return <h1>Issue: No game</h1>
  }

  const handleClickTile = (idx: number) => {
    if (game.board[idx] == BLANK_SYMBOL && game.playerTurnId === socket.id && game.gameState !== GameState.WON && game.gameState !== GameState.DRAW) {
      socket.emit(Events.GamePlaceSymbol, idx)
    }
  }

  const handleResetGame = () => {
    socket.emit(Events.GameStart)
  }

  let status = `${game.playerSymbols[game.playerTurnId]}'s turn!`
  if (game.gameState === GameState.WON) {
    status = `${game.winnerId} won!`
  } else if (game.gameState === GameState.DRAW) {
    status = 'Draw!'
  }

  return (
    <div>
      <h1>Game</h1>
      <div>{status}</div>

      <div className='game-window'>

        <Board board={game.board} numRows={startRows} numCols={startCols} onClickTile={handleClickTile} />

        {game.gameState === GameState.DRAW || game.gameState === GameState.WON && <button onClick={handleResetGame}>
          New Game
        </button>} 

       </div>
      
    </div>
  )
}




