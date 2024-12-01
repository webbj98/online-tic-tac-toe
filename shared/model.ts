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

export interface Game {
    board: string[];
    playerSymbols: Map<string, string>;
    lobbyKey: string;
    playerTurn: string;
}