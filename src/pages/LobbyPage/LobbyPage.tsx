import { useEffect, useState } from "react"
import { BACKEND_PORT } from "../../../shared/config"
import { useParams } from "react-router-dom"
import UserNameInput from "./UserNameInput";
import { LobbyMain } from "./LobbyMain";
import { GameObject, SocketIdUserNamePair } from "../../../shared/model";
import { GamePage } from "../GamePage/GamePage";

export const LobbyPage: React.FC<{
    users: Map<string, string>, 
    userName: string,
    game: GameObject | undefined;
    onSetUserName: (name: string) => void
}>  = ({users, userName, game, onSetUserName}) => {
    console.log('game: ', game)
    if (game) {
        return <GamePage game={game} users={users} />
    } else if (userName) {
        console.log('userMap: ', users)
        console.log('user values: ', Array.from(users.values()))
        return <LobbyMain userList={Array.from(users.values())} userName={userName} />
    } else {
        return <UserNameInput onSubmitName={onSetUserName} />
    }
}