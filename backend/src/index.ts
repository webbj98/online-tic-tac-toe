import express from 'express';
import {createServer } from 'node:http'
import cors from 'cors';
import {Server, Socket } from 'socket.io';
// import {TEST_ROOM_NAME, BACKEND_PORT} from '@shared/config.js'
import {TEST_ROOM_NAME, BACKEND_PORT, FRONTEND_PROD_PORT, FRONTEND_DEV_PORT} from 'shared/config'
import {Events} from 'shared/events'
import {GameObject, GameState, Message, MessageType, SocketIdUserNamePair} from 'shared/model'
// import { BACKEND_PORT } from '../../shared/config.js';
import { Lobby } from './classes/Lobby.js';
import { Game } from './classes/Game.js';
// import { Socket } from 'socket.io-client';

const app = express();
const server = createServer(app);
console.log("process.env.PORT: ", process.env.PORT)
// TODO: change so that port uses env var
const port = process.env.PORT || BACKEND_PORT;
const io = new Server(server, {
    cors: {
        // TODO: change so that it uses node_env
        origin: `http://localhost:${process.env.PORT ? FRONTEND_PROD_PORT : FRONTEND_DEV_PORT}`
      }
})

// 
const startRows = 3;
const startCols = 3;
const BLANK_SYMBOL = '';

// TODO: consider using null instead of a blank string
const initBoard = new Array<string>(startRows * startCols).fill(BLANK_SYMBOL);

const socketUserNameMap = new Map<string, string>()
// const lobbyGameMap = new Map<string, Game>(); 
const keyLobbyMap = new Map<string, Lobby>()
// const io = new Server(app)

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log('lmao')
    res.send('Hello from Express TypeScript!');
});

app.get('/lobby/:id', (req, res) => {
    const id = req.params.id;
    console.log('id: ', id)
    console.log('rooms: ', io.of('/').adapter.rooms)
    const usersInLobby = io.of('/').adapter.rooms.get(id);
    console.log('reached lobby: ', usersInLobby)
    const userList = Array.from(usersInLobby || []);
    
    console.log('userList: ', userList)
    res.status(200).json({
        userList
    })
})

io.on(Events.Connection, (socket) => {
    console.log('a user connected');

    socket.on(Events.Disconnecting, () => {
        const lobbyKey = getUserLobbyKey(socket);

        console.log(`${socketUserNameMap.get(socket.id)} disconnected`);

        console.log('lobby key gotten: ', lobbyKey)
        if (lobbyKey) {
            const curLobby = keyLobbyMap.get(lobbyKey);

            sendLeaveLobbyMessage(io, socket.id, lobbyKey);
            const socketIds = keyLobbyMap.get(lobbyKey)!.getUsers();

            const usersWithoutDisconnecter = socketIds.filter((socketId) => socketId !== socket.id)
            socket.emit(Events.UserListGet, getSocketUserNames(usersWithoutDisconnecter));
            // socket.emit(Events.MessageSend, )

            // If the player is one of the players in game, end the game
            if (curLobby?.game?.playerIdSymbolMap.has(socket.id)) {
                curLobby.game = null;

                io.to(curLobby.key).emit(Events.GameStop)
                const message: Message = {
                    type: MessageType.SYSTEM,
                    text: `The game was stopped because ${socketUserNameMap.get(socket.id)} disconnected`
                }

                io.to(curLobby.key).emit(Events.MessageSend, message);

            }
            
        }
    })


    // we have to set up the listeners in the connection listener because
    // we need to establish that when get event from the socket, I can perform the task
    // (we probably don't want to get events from sockets that haven't connected)
    socket.on(Events.LobbyCreate, (callback) => {
        console.log(`User ${socket.id} joining room`);
        console.log('rooms socket is in: before lobby create ', [...socket.rooms.keys()])
        const newLobby = new Lobby(socket, io);
        keyLobbyMap.set(newLobby.key, newLobby)
        console.log('rooms socket is in: after lobby create ', [...socket.rooms.keys()])
        // socket.join(lobby.uuid);
        // socket.join(lobbyName);
        callback(newLobby.key)
    });

    socket.on(Events.LobbyJoin, (lobbyKey) => {
        // socket.join(lobbyKey)
        console.log('IN LOBY JOIN EVENT-------------')
        console.log('loby: key: ', lobbyKey)
        // console.log('keyLoby: ', keyLobbyMap.entries())
        const lobby = keyLobbyMap.get(lobbyKey)
        if (!lobby) {
            throw Error(`Tried to join lobby ${lobbyKey} which does not exist`)
        }
        
        lobby.join(socket);

        // console.log('socketUserNameMap: ', socketUserNameMap)
        sendJoinLobbyMessage(io, socket.id, lobbyKey);
        console.log('socketUserNameMap: ', socketUserNameMap);
        console.log('new socket id: ', socket.id);
        const userUpdateInfo: SocketIdUserNamePair = {
            socketId: socket.id,
            userName: socketUserNameMap.get(socket.id)!
        }
        socket.to(lobbyKey).emit(Events.UserListUpdate, userUpdateInfo);
        socket.emit(Events.UserListGet, getLobbyUserNames(io, lobbyKey));
        // io.to(roomKey).emit(Events.UserListUpdate, socket.id);
        // io.to(roomKey).emit(Events.ChatSystemMessage, `${socket.id} joined the lobby`)
        console.log(`${socket.id} joined the room`)
        // console.log('users in lobby after join: ', lobby.getUsers())
        // console.log('rooms socket is in: ', [...socket.rooms.keys()])
    })

    socket.on(Events.LobbyUpdate, (lobbyKey) => {
        io.to(lobbyKey).emit(Events.LobbyUpdate)
    } )

    socket.on(Events.UserSetName, (name: string) => {
        socketUserNameMap.set(socket.id, name)
    })

    socket.on(Events.MessageSend, (message: Message) => {
        // console.log(io.of('/').adapter.rooms);
        console.log('message: ', message)
        if (message.lobbyKey) {
            io.to(message.lobbyKey).emit(Events.MessageSend, message);
        } else {
            io.emit(Events.MessageSend, message)
        }        
    })

    socket.on(Events.GameStart, () => {
        // const lobbyUsers = getLobbyUserNames(io, )

        //TODO: change how getting curRoom works. Make it better
        // TODO: Also, make the getting of the socket type better
        const curLobbyKey = [...socket.rooms.keys()][1];
        // console.log('curLobbyKey: ', curLobbyKey);
        // console.log(`rooms ${socketUserNameMap.get(socket.id)} is in: `, socket.rooms.keys())
        // console.log('keyLobbyMap: ', keyLobbyMap)

        const lobbyUsers = keyLobbyMap.get(curLobbyKey)?.getUsers() || []
        // const lobbyUsers = getLobbyUserNames(io, curLobbyKey);

        const curLobby = keyLobbyMap.get(curLobbyKey);

        if (!curLobby) {
            throw Error(`Player ${socketUserNameMap.get(socket.id)} is not in a lobby.`)
        }

        const newGame = new Game(lobbyUsers)
        curLobby.game = newGame

        // const game = new Game()

        newGame.gameState = GameState.STARTED;
        console.log('newGame player symbol: ', newGame.playerIdSymbolMap)
        const newGameClient = newGame.toGameObject();

        io.to(curLobbyKey).emit(Events.GameStart, newGameClient);
        
    })

    socket.on(Events.GamePlaceSymbol, (tileIdx: number) => {
        
        const curRoom = [...socket.rooms.keys()][1];
        console.log('curRoom: ', curRoom)
        const curGame = keyLobbyMap.get(curRoom)?.game

        if (!curGame) {
            throw Error(`Lobby ${curRoom} does not have a game`)
        }

        curGame.placeSymbol(tileIdx)
        const newGameClient = curGame.toGameObject()
        io.to(curRoom).emit(Events.GameUpdate, newGameClient);


    })

    socket.on(Events.GameStop, () => {
        const curRoom = getUserLobbyKey(socket);
        if (!curRoom) {
            throw Error("The user's room didn't seem to exist")
        }
        
        const curLobby = keyLobbyMap.get(curRoom)

        if (!curLobby) {
            throw Error(`The lobby ${curRoom} doesn't exist`)
        }
        
        curLobby.game = null
        io.to(curLobby.key).emit(Events.GameStop)
        const message: Message = {
            type: MessageType.SYSTEM,
            text: `The game was stopped by ${socketUserNameMap.get(socket.id)}`
        }

        io.to(curLobby.key).emit(Events.MessageSend, message);

    })
})

io.on(Events.Disconnect, (socket) => {
    socket.on(Events.Disconnect, () => {
        console.log('got and listend for event')
    })
    console.log('---------disconnected socket: ', socket.id)
}) 

function sendJoinLobbyMessage(io: Server, socketId: string, lobbyKey: string) {
    
    const message: Message = {
        type: MessageType.SYSTEM,
        text: `${socketUserNameMap.get(socketId)} joined the lobby`
    }
    io.to(lobbyKey).emit(Events.MessageSend, message);
}

function sendLeaveLobbyMessage(io: Server, socketId: string, lobbyKey: string) {
    const message: Message = {
        type: MessageType.SYSTEM,
        text: `${socketUserNameMap.get(socketId)} left the lobby`
    }
    console.log('sending leave')
    io.to(lobbyKey).emit(Events.MessageSend, message);
}

function getLobbyUserNames(io: Server, lobbyKey: string) {
    const userSocketIds = Array.from(io.of('/').adapter.rooms.get(lobbyKey) || []);
    // todo: throw error if get socket id and it doesn't exist in map

    const socketIdUserNamePairs: SocketIdUserNamePair[] = userSocketIds.map((socketId) => {
        
        const userName = socketUserNameMap.get(socketId);
        if (!userName) {
            throw new Error(`There is no username for socket id ${socketId}`)
        }
        return {
            socketId,
            userName: socketUserNameMap.get(socketId)!,

        }
    })

    return socketIdUserNamePairs
}

function getSocketUserNames(socketIds: string[]) {
    return socketIds.map((socketId) => socketUserNameMap.get(socketId)); 
}


// Technically, a socket is in a lobby of its own name so need to filter that out. The socket should only ever be in one lobby though
function getUserLobbyKey(socket: Socket) {
    
    // const roomFromKeys = Object.keys(socket.rooms)
    const possLobby = Array.from(socket.rooms).filter((roomKey) => keyLobbyMap.has(roomKey));
    console.log('socket rooms: ', socket.rooms)
    console.log('keyLobbyMap: ', keyLobbyMap)
    console.log('pos lobbies: ', possLobby)
    if (possLobby.length > 0) {
        return possLobby[0]
    } else {
        return null
    }
}

server.listen(port, () => {
    console.log("process.env.PORT: ", process.env.PORT)
    console.log(`l;l;;lServer is running at http://localhost:${port}`);
});