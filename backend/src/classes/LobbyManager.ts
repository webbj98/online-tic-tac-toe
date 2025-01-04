import { Server } from "socket.io";
import { Lobby } from "./Lobby.js";
import { SERVER_NAMESPACE } from "shared/config";

export class LobbyManager {

    private static lobbyManagerInstance:  LobbyManager;
    
    keyLobbyMap: Map<string, Lobby>;
    io: Server;

    //TODO: have get take in singleton and/or figure out better way to have
    // manager have the server
    constructor (io: Server) {
        this.io = io;
        this.keyLobbyMap = new Map();
    }

    // public static getLobbyManager(io: Server) {
    //     if (this.lobbyManagerInstance) {
    //         return this.lobbyManagerInstance
    //     } else {
    //         this.lobbyManagerInstance = new LobbyManager(io);
    //     }
    // }

    getLobby(key: string) {

        // Find the room information and create a new lobby  if it doesn't exist in the map.
        if (!(this.keyLobbyMap.has(key))) {
            if (!this.io.of(SERVER_NAMESPACE).adapter.rooms.has(key)) {
                return undefined;
            }

            // const newLobby = new Lobby();
            
            // this.io.of(SERVER_NAMESPACE).adapter.rooms
        }
        this.keyLobbyMap.get(key);
    }

    addLobby(lobby: Lobby) {
        this.keyLobbyMap.set(lobby.key, lobby);
    }

    deleteLobby(lobbyKey: string) {
        this.keyLobbyMap.delete(lobbyKey);

    }

    getLobbies() {
        return [...this.keyLobbyMap.values()]
    }
}