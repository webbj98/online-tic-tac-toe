import { Tile } from '../Tile/Tile'
import './Board.css'

export const Board: React.FC<{
    board: string[], 
    numRows: number, 
    numCols: number, 
    onClickTile: (idx: number) => void
  }> = ({board, numRows, numCols, onClickTile }) => {
    //TODO: make id not idx
    const boardDisplay = board.map((tileSymbol, idx) => <div key={idx} onClick={() => onClickTile(idx)}><Tile symbol={tileSymbol} /></div> )
    //TODO: delete later
    numRows++;
    return (
      <div className="board" style={{gridTemplateColumns: `repeat(${numCols}, 1fr)`}}>
        {boardDisplay}
      </div>
    )
  }