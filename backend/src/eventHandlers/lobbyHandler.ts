import { Server, Socket } from "socket.io";
import { Events} from "shared/events"
import {Lobby} from "shared/model";

function register(io: Server, socket: Socket) {
    socket.on(Events.LobbyCreate, (lobby: Lobby) => {
        const lobbyName = crypto.randomUUID();
        socket.join(lobby.uuid);
    })

    // socket.on(Events.LobbyJoin, (lobby: Lobby) => {
    //     const 
    // } )

}