import './Tile.css'

export const Tile: React.FC<{symbol: string}> = ({symbol}) => {

    return (
      <div className='tile'>
        
        {symbol}
  
      </div>
    )
  }