import express from 'express';
import {createServer } from 'node:http'
import cors from 'cors';
import {Server } from 'socket.io';
import {ROOM_EVENT_NAME, TEST_ROOM_NAME} from '../../shared/config'
import {Events} from '../../shared/events'
import {Game, Message, MessageType} from '../../shared/model'
import { BACKEND_PORT } from '../../shared/config';
import { Lobby } from './classes/Lobby';
// import { Socket } from 'socket.io-client';

const app = express();
const server = createServer(app);
const port = BACKEND_PORT;
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
      }
})

// 
const startRows = 3;
const startCols = 3;
const BLANK_SYMBOL = '';
const PLAYER_ONE_SYMBOL = 'X';
const PLAYER_TWO_SYMBOL = 'O';
// TODO: consider using null instead of a blank string
const initBoard = new Array<string>(startRows * startCols).fill(BLANK_SYMBOL);

const socketUserNameMap = new Map<string, string>()
const lobbyGameMap = new Map<string, Game>(); 
const keyLobbyMap = new Map<string, Lobby>()
// const io = new Server(app)

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    console.log('lmao')
    res.send('Hello from Express TypeScript!');
});

// app.get('/')
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

io.on('connection', (socket) => {
    console.log('a user connected');

    // we have to set up the listeners in the connection listener because
    // we need to establish that when get event from the socket, I can perform the task
    // (we probably don't want to get events from sockets that haven't connected)
    socket.on(Events.LobbyCreate, (callback) => {
        console.log(`User ${socket.id} joining room`);
        // const lobbyName = crypto.randomUUID();
        const newLobby = new Lobby(socket, io);
        keyLobbyMap.set(newLobby.key, newLobby)
        // socket.join(lobby.uuid);
        // socket.join(lobbyName);
        sendJoinLobbyMessage(io, socket.id, newLobby.key)
        callback({
            newLobbyKey: newLobby.key,
        })
    });

    socket.on(Events.LobbyJoin, (lobbyKey) => {
        // socket.join(lobbyKey)
        console.log('loby: key: ', lobbyKey)
        console.log('keyLoby: ', keyLobbyMap.entries())
        const lobby = keyLobbyMap.get(lobbyKey)
        if (!lobby) {
            throw Error(`Tried to join lobby ${lobbyKey} which does not exist`)
        }
        lobby.join(socket);

        // console.log('socketUserNameMap: ', socketUserNameMap)
        sendJoinLobbyMessage(io, socket.id, lobbyKey);
        socket.to(lobbyKey).emit(Events.UserListUpdate, socketUserNameMap.get(socket.id));
        socket.emit(Events.UserListGet, getLobbyUsers(io, lobbyKey));
        // io.to(roomKey).emit(Events.UserListUpdate, socket.id);
        // io.to(roomKey).emit(Events.ChatSystemMessage, `${socket.id} joined the lobby`)
        console.log(`${socket.id} joined the room`)
    })

    socket.on(Events.LobbyUpdate, (lobbyKey) => {
        io.to(lobbyKey).emit(Events.LobbyUpdate)
    } )

    socket.on(Events.UserSetName, (name: string) => {
        socketUserNameMap.set(socket.id, name)
    })

    socket.on(Events.ChatMessage, (message: Message) => {
        // console.log(io.of('/').adapter.rooms);
        if (message.lobbyKey) {
            io.to(message.lobbyKey).emit(Events.ChatMessage, message);
        } else {
            io.emit(Events.ChatMessage, message)
        }        
    })

    socket.on(Events.GameStart, () => {
        // const lobbyUsers = getLobbyUsers(io, )

        //TODO: change how getting curRoom works. Make it better
        // TODO: Also, make the getting of the socket type better
        const curRoom = [...socket.rooms.keys()][0];
        const lobbyUsers = getLobbyUsers(io, curRoom);
        const filteredUsers = lobbyUsers.filter((user) => user != undefined);


        const playerSymbols = new Map<string, string>([
            [filteredUsers[0], PLAYER_ONE_SYMBOL],
            [filteredUsers[1], PLAYER_TWO_SYMBOL],
        ])
        const newGame: Game = {
            board: initBoard,
            playerSymbols: playerSymbols,
            lobbyKey: curRoom,
            playerTurn: PLAYER_ONE_SYMBOL,
        }

        io.to(curRoom).emit(Events.GameStart, newGame);
        
    })

    socket.on(Events.GamePlaceSymbol, (tileIdx: number) => {
        const curRoom = [...socket.rooms.keys()][0];
        const curGame = lobbyGameMap.get(curRoom)!;
        // TODO: probably make playerTurn be playerTurnSymbol
        curGame.board[tileIdx] = curGame.playerTurn;

        if (curGame.playerTurn === PLAYER_ONE_SYMBOL) {
            curGame.playerTurn = PLAYER_TWO_SYMBOL;
        } else {
            curGame.playerTurn = PLAYER_ONE_SYMBOL
        }
        io.to(curRoom).emit(Events.GameUpdate, curGame);


    })
})

function sendJoinLobbyMessage(io: Server, socketId: string, lobbyKey: string) {
    
    const message: Message = {
        type: MessageType.SYSTEM,
        text: `${socketUserNameMap.get(socketId)} joined the lobby`
    }
    io.to(lobbyKey).emit(Events.ChatMessage, message)
}

function getLobbyUsers(io: Server, lobbyKey: string) {
    const userSocketids = Array.from(io.of('/').adapter.rooms.get(lobbyKey) || []);
    // todo: throw error if get socket id and it doesn't exist in map

    return userSocketids.map((socketId) => socketUserNameMap.get(socketId));
}

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});