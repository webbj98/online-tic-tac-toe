import {DefaultEventsMap, Server, Socket } from 'socket.io';
import { LobbyStatus } from '../../../shared/model';
import { SERVER_NAMESPACE } from '../../../shared/config';
import { LobbyManager } from './LobbyManager';
// import { io, Socket } from "socket.io-client";
export class Lobby {
    key: string;
    io: Server;
    status: LobbyStatus;
    // In order to keep LobbyManager up to date, need to pass it in as the parent
    
    // WON'T do lobbyMANGAGER cause can just use a map
    // lobbyManager: LobbyManager  TODO: DO NEED

    // We pass in a socket in order to create the room because socket.io urges to use the join and leave functions
    // instead of other functions
    // https://socket.io/docs/v4/rooms/#implementation-details
    constructor(socket: Socket, io: Server ) {
        this.key = crypto.randomUUID();;
        this.io = io;
        this.status = LobbyStatus.PRE_ROUND;
        // this.lobbyManager = lobbyManager
        socket.join(this.key);
        // lobbyManager.addLobby(this)
    }

    getUsers() {
        return Array.from(this.io.of(SERVER_NAMESPACE).adapter.rooms.get(this.key) || []);
    }

    join(socket: Socket) {
        socket.join(this.key);
    }

    leave(socket: Socket) {
        socket.leave(this.key);
    }
}