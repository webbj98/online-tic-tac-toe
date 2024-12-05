export const Events = {
    Connection: 'connection',
    Connect: 'connect',
    Disconnect: 'disconnect',
    Disconnecting: 'disconnecting',
    LobbyCreate: 'lobby:create',
    LobbyJoin: 'lobby:join',
    LobbyUpdate: 'lobby:update',
    UserListUpdate: 'userList:update', //TODO: eval if can make this a general lobby update
    UserListGet: 'userList:get',
    UserSetName: 'user:setName',
    MessageSend: 'message:send',
    GameStart: 'game:start',
    GamePlaceSymbol: 'game:placeSymbol',
    GameUpdate: 'game:update'

    
    // ChatSystemMessage: 'chat:systemMessage',
} as const;