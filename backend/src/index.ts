import express from 'express';
import {createServer } from 'node:http'
import cors from 'cors';
import {Server } from 'socket.io';
import {ROOM_EVENT_NAME, TEST_ROOM_NAME} from '../../shared/config'
import {Events} from '../../shared/events'
import {Lobby, Message, MessageType} from '../../shared/model'
import { BACKEND_PORT } from '../../shared/config';
import { Socket } from 'socket.io-client';

const app = express();
const server = createServer(app);
const port = BACKEND_PORT;
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174"
      }
})

const socketUserNameMap = new Map<string, string>()

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
    socket.on(Events.LobbyCreate, () => {
        console.log(`User ${socket.id} joining room`);
        const lobbyName = crypto.randomUUID();
        // socket.join(lobby.uuid);
        socket.join(lobbyName);
        sendJoinLobbyMessage(io, socket.id, lobbyName)
    });

    socket.on(Events.LobbyJoin, (roomKey) => {
        socket.join(roomKey);
        console.log('socketUserNameMap: ', socketUserNameMap)
        sendJoinLobbyMessage(io, socket.id, roomKey);
        socket.to(roomKey).emit(Events.UserListUpdate, socketUserNameMap.get(socket.id));
        socket.emit(Events.UserListGet, getLobbyUsers(io, roomKey));
        // io.to(roomKey).emit(Events.UserListUpdate, socket.id);
        // io.to(roomKey).emit(Events.ChatSystemMessage, `${socket.id} joined the lobby`)
        console.log(`${socket.id} joined the room`)
    })

    socket.on(Events.LobbyUpdate, (lobbyKey) => {
        io.to(TEST_ROOM_NAME).emit(Events.LobbyUpdate)
    } )

    socket.on(Events.UserSetName, (name: string) => {
        socketUserNameMap.set(socket.id, name)
    })

    socket.on(Events.ChatMessage, (message: Message) => {
        console.log(io.of('/').adapter.rooms);
        io.to(TEST_ROOM_NAME).emit(Events.ChatMessage, message)
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

    return userSocketids.map((socketId) => socketUserNameMap.get(socketId));
}
// io.on('joinRoom', (socket) => {
//     console.log(`User ${socket.id} joining room`);
//     // socket.join(TEST_ROOM_NAME);
// })

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});