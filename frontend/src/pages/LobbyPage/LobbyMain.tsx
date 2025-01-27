import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import { Events } from "shared/events";

export const LobbyMain: React.FC<{userList: string[]}> = ({userList}) => {
    const {id} = useParams();
    // const [users, setUsers] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    // console.log('users: ', users )
    console.log('userList: ', userList)
    const userDisplay = userList.map((user) => <div>{user}</div>)
    
    useEffect(() => {
        setIsLoading(true)
    }, [id])

    const handleStartGame = () => {
        socket.emit(Events.GameStart);

    }

    // console.log

    // if (isLoading) {
    //     return (
    //         <div>
    //             <h1>Loading...</h1>
    //         </div>
    //     )
    // }

    //TODO: makke a copy room code button
    return (
        <div>
            <h1>Lobby Page</h1>

            <div>
                <h2>Users:</h2>
                {userDisplay}
            </div>

            <button onClick={handleStartGame} disabled={userList.length < 2}>Start Game</button>




        </div>
    )
}