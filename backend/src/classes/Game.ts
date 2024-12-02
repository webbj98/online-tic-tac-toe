import { PLAYER_SYMBOLS } from "../../../shared/config";
import { GameState } from "../../../shared/model";
import { Lobby } from "./Lobby";


const startRows = 3;
const startCols = 3;
const BLANK_SYMBOL = '';

export class Game {

    // maps socketId to their in-game symbol
    playerIdSymbolMap: Map<string, string>;
    board: string[];
    playerTurnId: string;
    gameState: GameState;
    winnerId: string | null;
    constructor (playerIds: string[] ) {
        this.playerIdSymbolMap = new Map();
        for (let i = 0; i < playerIds.length; i++) {
            this.playerIdSymbolMap.set(playerIds[i], PLAYER_SYMBOLS[i]);
        }

        this.board = new Array<string>(startRows * startCols).fill(BLANK_SYMBOL);
        this.playerTurnId = playerIds[0];
        this.gameState = GameState.PRE_GAME;
        this.winnerId = null;
    }

    placeSymbol(tileIdx: number) {
        // todo: 
        const symbol = this.playerIdSymbolMap.get(this.playerTurnId);

        if (!symbol) {
            throw Error(`Tried to place '${symbol}' when it is not their turn.`)
        }
        this.board[tileIdx] = symbol;
        console.log('boards new mark: ', this.board[tileIdx])
        const winner = this.findWinner();

        if (winner) {
            this.winnerId = this.playerTurnId;
            this.gameState = GameState.WON;
            return;
        }
        // const isDraw = this.checkIsDraw();
        if (this.checkIsDraw()) {
            this.gameState = GameState.DRAW;
            return;
        }

        let curPlayerIdx: number;
        const playerIds = [...this.playerIdSymbolMap.keys()]
        for (let i = 0; i < playerIds.length; i++) {
            if (this.playerTurnId === playerIds[i]) {
                curPlayerIdx = i;
                break;
            }
        }

        const nextPlayersTurn = playerIds[(curPlayerIdx! + 1) % playerIds.length ]
        this.playerTurnId = nextPlayersTurn;
    }

    findWinner() {
        //TODO: make better var names than i, j
        // TODO: min size of board should be 2x2
        // TOD: could just start at the second element when comparing as first is always true
        
        for (let i = 0; i < this.board.length; i += startRows) {
          let preVal = this.board[i];
          if (preVal === BLANK_SYMBOL) {
            continue;
          }
          // console.log('i: should go up by startRow ', i);
          for (let j = 0; j < startCols; j++) {
            const curVal = this.board[i+j]
            
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
          let preVal = this.board[j];
          
          if (preVal === BLANK_SYMBOL) {
            continue;
          }
          for (let i = 0; i < this.board.length; i += startRows) {
            const curVal = this.board[i + j]
            // console.log('-------')
            // console.log('cur idx: ', i+j);
            // console.log('curVal: ', curVal)
            // console.log('prevVal: ', preVal)
            // const curIdx = i + j;
            
            if (preVal == curVal && i + startRows >= this.board.length) {
              return curVal
            } else if (preVal !== curVal) {
              break;
            }
            preVal = curVal;
          }
        }
      
        // TODO: rewrite alg to be cleaner
        let preVal = this.board[0];
        for (let j = 0; j < this.board.length; j += startCols + 1) {
      
          const curVal = this.board[j];
          if (preVal == curVal && j == this.board.length - 1) {
            return curVal
          } else if (preVal !== curVal || preVal === BLANK_SYMBOL) {
            break;
          }
          preVal = curVal;
        }
      
        preVal = this.board[startCols-1];
        for (let j = startCols - 1; j < this.board.length; j += startCols - 1) {
          const curVal = this.board[j];
          
          if (preVal == curVal && j == this.board.length - startCols + 1) {
            return curVal
          } else if (preVal !== curVal || preVal === BLANK_SYMBOL) {
            break;
          }
        }
      
        return null;
    }

    checkIsDraw() {
        return !this.board.includes(BLANK_SYMBOL);
    }
}