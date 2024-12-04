import { useEffect, useState } from "react"
import { BACKEND_PORT } from "../../../shared/config"
import { useParams } from "react-router-dom"
import UserNameInput from "./UserNameInput";
import { LobbyMain } from "./LobbyMain";
import { GameObject } from "../../../shared/model";
import { GamePage } from "../GamePage/GamePage";

export const LobbyPage: React.FC<{
    users: string[], 
    userName: string,
    game: GameObject | undefined;
    onSetUserName: (name: string) => void
}>  = ({users, userName, game, onSetUserName}) => {
    console.log('game: ', game)
    if (game) {
        return <GamePage game={game} />
    } else if (userName) {
        return <LobbyMain users={users} userName={userName} />
    } else {
        return <UserNameInput onSubmitName={onSetUserName} />
    }
}