export const Events = {
    LobbyCreate: 'lobby:create',
    LobbyJoin: 'lobby:join',
    LobbyUpdate: 'lobby:update',
    UserListUpdate: 'userList:update', //TODO: eval if can make this a general lobby update
    UserListGet: 'userList:get',
    UserSetName: 'user:setName',
    ChatMessage: 'chat:message',
    GameStart: 'game:start',
    GamePlaceSymbol: 'game:placeSymbol',
    GameUpdate: 'game:update'
    
    // ChatSystemMessage: 'chat:systemMessage',
} as const;