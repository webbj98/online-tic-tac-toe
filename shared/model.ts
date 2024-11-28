export interface Player {
    uuid: string;
    displayName: string;
}

export interface Lobby {
    uuid: string;
    playerList: Player[];
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
}