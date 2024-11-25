import express from 'express';
import {createServer } from 'node:http'
import cors from 'cors';
import {Server } from 'socket.io';

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
    })
})

// io.on('pingEvent', (socket) => {
//     console.log(socket.)
// })

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});