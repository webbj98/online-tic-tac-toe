import {useEffect, useState} from 'react'
import "./GamePage.css"
import { Board } from '../../components/Board/Board';
import { Game, GameState } from '../../../shared/model';
import { socket } from '../../socket';
import { Events } from '../../../shared/events';
// display 
    // board
    // tiles
// game logic
    // check game state (wining, turns, or draw)
    // placing tiles
// reset button

const startRows = 3;
const startCols = 3;
const BLANK_SYMBOL = '';
const PLAYER_ONE_SYMBOL = 'X';
const PLAYER_TWO_SYMBOL = 'O';
// TODO: consider using null instead of a blank string
const initBoard = new Array<string>(startRows * startCols).fill(BLANK_SYMBOL);

export const GamePage: React.FC<{game: Game | undefined}> = ({game}) => {
  // const [board, setBoard] = useState<string[]>([...initBoard]);
  // TODO: should be currentPlayerIdx
  // const [currentPlayerTurn, setCurrentPlayerTurn] = useState(0);

  useEffect(() => {
    

  }, [])

  if (!game) {
    return <h1>Issue: No game</h1>
  }

  const handleClickTile = (idx: number) => {
    // TODO: this may not be needed but doing in-case of state setting issues
    // TODO: check if the player who clicks it is the player whose turn it is
    if (game.board[idx] == BLANK_SYMBOL && game.gameState !== GameState.WON && game.gameState !== GameState.DRAW) {
      socket.emit(Events.GameStart)

      // setBoard((prevBoard) => {
      //   const newBoard = [...prevBoard];
      //   newBoard[idx] = playerTurnSymbol;
      //   return newBoard;
      // })

      // setCurrentPlayerTurn((prevTurn) => (prevTurn + 1) % currentPlayers.length )
    }
  }

  // const handleResetGame = () => {
  //   setBoard(initBoard);
  //   setCurrentPlayerTurn(0);
  // }

  
  

  let status = `${game.playerSymbols[game.playerTurnId]}'s turn!`
  if (game.gameState === GameState.WON) {
    // console.log()
    status = `${game.winnerId} won!`
  } else if (game.gameState === GameState.DRAW) {
    status = 'Draw!'
  }

  // console.log('hi')
  return (
    <div>
      <h1>Game</h1>
       <div>{status}</div>
      <Board board={game.board} numRows={startRows} numCols={startCols} onClickTile={handleClickTile} />

      {/* <button onClick={handleResetGame}>
        Reset Game
      </button>  */}
    </div>
  )
}




