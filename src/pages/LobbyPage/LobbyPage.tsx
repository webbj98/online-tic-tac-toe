import { useState } from "react"

export const LobbyPage: React.FC = () => {
    const [players, setPlayers] = useState(['test1', 'test2'])

    const playerDisplay = players.map((player) => <div>{player}</div>)

    //TODO: makke a copy room code button
    return (
        <div>
            <h1>Lobby Page</h1>

            <p>Room Code: 1XYO</p> 

            <div>
                {playerDisplay}
            </div>

            <button>Start Game</button>




        </div>
    )
}