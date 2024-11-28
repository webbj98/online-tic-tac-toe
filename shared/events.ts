export const Events = {
    LobbyCreate: 'lobby:create',
    LobbyJoin: 'lobby:join',
    LobbyUpdate: 'lobby:update',
    UserListUpdate: 'userList:update', //TODO: eval if can make this a general lobby update
    UserListGet: 'userList:get',
    ChatMessage: 'chat:message',
    
    // ChatSystemMessage: 'chat:systemMessage',
} as const;