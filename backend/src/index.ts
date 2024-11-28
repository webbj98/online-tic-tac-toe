import express from 'express';
import {createServer } from 'node:http'
import cors from 'cors';
import {Server } from 'socket.io';
import {ROOM_EVENT_NAME, TEST_ROOM_NAME} from '../../shared/misc'
import {Events} from '../../shared/events'
import {Lobby, Message} from '../../shared/model'

const app = express();
const server = createServer(app);
const port = 3001;
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174"
      }
})

// const io = new Server(app)

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express TypeScript!');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('pingEvent', (msg) => {
        io.emit('pingEvent', 'pong')
        console.log('PONG')
    });

    // we have to set up the listeners in the connection listener because
    // we need to establish that when get event from the socket, I can perform the task
    // (we probably don't want to get events from sockets that haven't connected)
    socket.on(Events.LobbyCreate, () => {
        console.log(`User ${socket.id} joining room`);
        const lobbyName = crypto.randomUUID();
        // socket.join(lobby.uuid);
        socket.join(lobbyName);
    });

    socket.on(Events.LobbyJoin, (roomKey) => {
        socket.join(roomKey);
        io.to(roomKey).emit(Events.ChatSystemMessage, `${socket.id} joined the lobby`)
        console.log(`${socket.id} joined the room`)
        
    })

    socket.on(ROOM_EVENT_NAME, () => {
        console.log('sending room msg')
        io.to(TEST_ROOM_NAME).emit(ROOM_EVENT_NAME, 'HERE ROOM MSG')
    });

    socket.on(Events.ChatPlayerMessage, (message: Message) => {
        io.to(TEST_ROOM_NAME).emit(Events.ChatPlayerMessage, message)
    })

    // socket.on()
})

// io.on('joinRoom', (socket) => {
//     console.log(`User ${socket.id} joining room`);
//     // socket.join(TEST_ROOM_NAME);
// })

// io.on(ROOM_EVENT_NAME, (socket) => {
    
// } )


// io.on('pingEvent', (socket) => {
//     console.log(socket.)
// })

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});