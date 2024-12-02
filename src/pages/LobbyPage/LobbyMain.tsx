import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import { Events } from "../../../shared/events";

export const LobbyMain: React.FC<{users: string[], userName: string}> = ({users, userName}) => {
    const {id} = useParams();
    // const [users, setUsers] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    console.log('users: ', users )
    const userDisplay = users?.map((user) => <div>{user}</div>)
    
    useEffect(() => {
        setIsLoading(true)
    }, [id])

    const handleStartGame = () => {
        socket.emit(Events.GameStart);

    }

    //TODO: makke a copy room code button
    return (
        <div>
            <h1>Lobby Page</h1>

            <p>Room Code: 1XYO</p> 

            <div>
                <h2>Users:</h2>
                {userDisplay}
            </div>

            <button onClick={handleStartGame}>Start Game</button>




        </div>
    )
}