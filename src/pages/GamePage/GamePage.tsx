import {useState} from 'react'
import "./GamePage.css"
import { Board } from '../../components/Board/Board';

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

const currentPlayers = [PLAYER_ONE_SYMBOL, PLAYER_TWO_SYMBOL];

function findWinner(board: string[]) {
    
  //TODO: make better var names than i, j
  // TODO: min size of board should be 2x2
  // TOD: could just start at the second element when comparing as first is always true
  
  for (let i = 0; i < board.length; i += startRows) {
    let preVal = board[i];
    if (preVal === BLANK_SYMBOL) {
      continue;
    }
    // console.log('i: should go up by startRow ', i);
    for (let j = 0; j < startCols; j++) {
      const curVal = board[i+j]
      
      // const prevIdx = curIdx - 1 
      if (preVal == curVal && j == startCols - 1) {
        return curVal;
      } else if (preVal !== curVal) {
        break;
      }
      preVal = curVal;
    }
  }
  // [1,2,3,4,5,6,7,8,9]

  // console.log('******************************')

  for (let j = 0; j < startCols; j++) {
    let preVal = board[j];
    
    if (preVal === BLANK_SYMBOL) {
      continue;
    }
    for (let i = 0; i < board.length; i += startRows) {
      const curVal = board[i + j]
      // console.log('-------')
      // console.log('cur idx: ', i+j);
      // console.log('curVal: ', curVal)
      // console.log('prevVal: ', preVal)
      // const curIdx = i + j;
      
      if (preVal == curVal && i + startRows >= board.length) {
        return curVal
      } else if (preVal !== curVal) {
        break;
      }
      preVal = curVal;
    }
  }

  // [1,2,3,4,5,6,7,8,9]
  // [3, 5, 7]

  // [1,5,9]
  // [1,2,3,4,  5,6,7,8, 9,10,11,12, 13,14,15,16]
  // [4, 7, 18, 13]


  // TODO: rewrite alg to be cleaner
  let preVal = board[0];
  for (let j = 0; j < board.length; j += startCols + 1) {

    const curVal = board[j];
    if (preVal == curVal && j == board.length - 1) {
      return curVal
    } else if (preVal !== curVal || preVal === BLANK_SYMBOL) {
      break;
    }
    preVal = curVal;
  }

  preVal = board[startCols-1];
  for (let j = startCols - 1; j < board.length; j += startCols - 1) {
    const curVal = board[j];
    
    if (preVal == curVal && j == board.length - startCols + 1) {
      return curVal
    } else if (preVal !== curVal || preVal === BLANK_SYMBOL) {
      break;
    }
  }

  return '';
}

function checkIsDraw(board: string[]) {
  return !board.includes(BLANK_SYMBOL);
}
export const GamePage: React.FC = () => {

  const [board, setBoard] = useState<string[]>([...initBoard]);
  // TODO: should be currentPlayerIdx
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(0);

  const winner = findWinner(board);
  const isDraw = checkIsDraw(board);

  const handleClickTile = (idx: number) => {
    // TODO: this may not be needed but doing in-case of state setting issues
    // TODO: check if the player who clicks it is the player whose turn it is
    if (board[idx] == BLANK_SYMBOL && !isDraw && !winner) {
      const playerTurnSymbol = currentPlayers[currentPlayerTurn];

      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[idx] = playerTurnSymbol;
        return newBoard;
      })

      setCurrentPlayerTurn((prevTurn) => (prevTurn + 1) % currentPlayers.length )
    }
  }

  const handleResetGame = () => {
    setBoard(initBoard);
    setCurrentPlayerTurn(0);
  }

  
  

  let status = `${currentPlayers[currentPlayerTurn]}'s turn!`
  if (winner) {
    // console.log()
    status = `${winner} won!`
  } else if (isDraw) {
    status = 'Draw!'
  }

  // console.log('hi')
  return (
    <div>
      <h1>Game</h1>
       <div>{status}</div>
      <Board board={board} numRows={startRows} numCols={startCols} onClickTile={handleClickTile} />

      <button onClick={handleResetGame}>
        Reset Game
      </button> 
    </div>
  )
}




