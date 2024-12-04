import { Socket } from "socket.io-client";
import {Events} from "../../shared/events"
import { socket } from "../socket";

function joinLobby( lobbyId: string) {
    socket.emit(Events.LobbyJoin, lobbyId);
} 

function createLobby() {
    socket.emit(Events.LobbyCreate);

}
export function register() {
    socket.on(Events.LobbyCreate, createLobby);
    socket.on(Events.LobbyJoin, joinLobby);
}

export function deregister() {
    socket.off(Events.LobbyCreate, createLobby);
    socket.off(Events.LobbyJoin, joinLobby);
}
