import { useEffect, useState } from "react"
import { BACKEND_PORT } from "../../../shared/config"
import { useParams } from "react-router-dom"
import UserNameInput from "./UserNameInput";
import { LobbyMain } from "./LobbyMain";

export const LobbyPage: React.FC<{users: string[], userName: string, onSetUserName: (name: string) => void}> = ({users, userName, onSetUserName}) => {
    
    if (userName) {
        return <LobbyMain users={users} userName={userName} />
    } else {
        return <UserNameInput onSubmitName={onSetUserName} />
    }

    //TODO: makke a copy room code button
}