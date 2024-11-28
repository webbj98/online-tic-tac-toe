import { Socket } from "socket.io-client";
import {Events} from "../../shared/events"

function joinLobby(socket: Socket, lobbyId: string) {
    socket.emit(Events.LobbyJoin, lobbyId);
} 

function createLobby(socket: Socket) {
    socket.emit(Events.LobbyCreate);

}
export function register(socket: Socket) {
    socket.on(Events.LobbyCreate, createLobby);
    socket.on(Events.LobbyJoin, joinLobby);
}

export function deregister(socket: Socket) {
    socket.off(Events.LobbyCreate, createLobby);
    socket.off(Events.LobbyJoin, joinLobby);
}