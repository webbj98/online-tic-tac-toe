import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001';


//TODO:  prevent auto connect so only happens when press connect button
    // explained in the TIP section
    // https://socket.io/how-to/use-with-react

export const socket = io(URL);
// function getSocketLobby() {

    

// }