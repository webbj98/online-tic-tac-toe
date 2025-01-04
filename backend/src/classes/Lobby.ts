import {DefaultEventsMap, Server, Socket } from 'socket.io';
import { LobbyStatus } from 'shared/model';
import { SERVER_NAMESPACE } from 'shared/config';
import { LobbyManager } from './LobbyManager.js';
import { Game } from './Game.js';
// import { io, Socket } from "socket.io-client";
export class Lobby {
    key: string;
    io: Server;
    status: LobbyStatus;
    game: Game | null;
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
        this.game = null;
    }

    getUsers() {
        return Array.from(this.io.of(SERVER_NAMESPACE).adapter.rooms.get(this.key) || []);
    }

    join(socket: Socket) {
        console.log(`Socket ${socket.id} is joining lobby ${this.key}`)
        socket.join(this.key);
    }

    leave(socket: Socket) {
        console.log('leaving lobby')
        socket.leave(this.key);
    }

    static getUserLobby(io: Server, socketId: string) {
        const lobby =  Array.from(io.of(SERVER_NAMESPACE).adapter.rooms)


    }
}