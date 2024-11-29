import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const LobbyMain: React.FC<{users: string[], userName: string}> = ({users, userName}) => {
    const {id} = useParams();
    // const [users, setUsers] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    console.log('users: ', users )
    const userDisplay = users?.map((user) => <div>{user}</div>)
    
    useEffect(() => {
        setIsLoading(true)
        // async function fetchUserList() {
        //     try {
        //         const response = await fetch(`http://localhost:${BACKEND_PORT}/lobby/testRoom`, {
        //             method: 'GET',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             }
        //         });
        //         console.log('result: ', response)
                
        //         const result = await response.json();
        //         if (response.ok) {
        //             console.log('result: ', result.userList)
        //             setUsers(result.userList);
    
        //         } else {
        //             throw new Error(result)
        //         }
                
        //     } catch (error) {
        //         console.log('error: ', error)
        //     } finally {
        //         setIsLoading(false)
        //     }
        // };

        // console.log('id: ', id)
        // fetchUserList();
    }, [id])

    //TODO: makke a copy room code button
    return (
        <div>
            <h1>Lobby Page</h1>

            <p>Room Code: 1XYO</p> 

            <div>
                <h2>Users:</h2>
                {userDisplay}
            </div>

            <button>Start Game</button>




        </div>
    )
}