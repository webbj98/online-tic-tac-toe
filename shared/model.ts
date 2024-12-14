export interface User {
    // uuid: string;
    displayName: string;
}

export interface Lobby {
    uuid: string;
    userList: User[];
    status: LobbyStatus;
    gameState: string[];
}

export enum LobbyStatus {
    PRE_ROUND = 'pre-round',
    IN_GAME = 'in-game',
    POST_GAME = 'post-game'

}

export enum MessageType {
    USER = 'user',
    SYSTEM = 'system'
}

export interface Message {
    type: MessageType;
    text: string;
    senderName?: string;
    lobbyKey?: string;
}

export interface SocketIdUserNamePair {
    socketId: string;
    userName: string;
}

// Client version of Game. Is just an interface, not a class.
// The client must request the server to perform actions that modify Game
export interface GameObject {
    board: string[];
    playerSymbols: {[key: string]: string};
    playerTurnId: string;
    gameState: GameState;
    winnerId: string | null;
}

export enum GameState {
    STARTED = 'started',
    DRAW = 'draw',
    WON = 'won'
}