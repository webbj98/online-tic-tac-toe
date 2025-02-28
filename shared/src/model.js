export var LobbyStatus;
(function (LobbyStatus) {
    LobbyStatus["PRE_ROUND"] = "pre-round";
    LobbyStatus["IN_GAME"] = "in-game";
    LobbyStatus["POST_GAME"] = "post-game";
})(LobbyStatus || (LobbyStatus = {}));
export var MessageType;
(function (MessageType) {
    MessageType["USER"] = "user";
    MessageType["SYSTEM"] = "system";
})(MessageType || (MessageType = {}));
export var GameState;
(function (GameState) {
    GameState["STARTED"] = "started";
    GameState["DRAW"] = "draw";
    GameState["WON"] = "won";
})(GameState || (GameState = {}));
