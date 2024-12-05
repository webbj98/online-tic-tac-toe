import { Link, useNavigate } from "react-router-dom"
import { socket } from '../../socket';
import { Events } from "../../../shared/events";
import { useEffect, useState } from "react";

export const HomePage: React.FC = () => {
    const navigate = useNavigate()
    const [lobbyKey, setNewLobbyKey] = useState('')

    useEffect(() => {
        if (lobbyKey) {
            navigate(`/lobby/${lobbyKey}`)
        }

    }, [lobbyKey, navigate])

    const handleCreateLobby = () => {
        socket.emit(Events.LobbyCreate, (newLobbyKey: string) => {
            console.log('newLobbyKey: ', newLobbyKey)
            setNewLobbyKey(newLobbyKey.newLobbyKey)
            // setRedirected(true)
        })
        

    }

    return (
        <div>
            <h1>Home Screen</h1>

            <button onClick={handleCreateLobby}>Create Lobby</button>
        </div>
    )
}
