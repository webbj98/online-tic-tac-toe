import { useEffect, useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HomePage } from './pages/HomePage/HomePage';
import { GamePage } from './pages/GamePage/GamePage';
import { LobbyPage } from './pages/LobbyPage/LobbyPage';
import { socket } from './socket';
import {ROOM_EVENT_NAME, TEST_ROOM_NAME} from '../shared/misc'
import { Events } from '../shared/events';
import Chat from './components/Chat/Chat';
import {Message, MessageType} from '../shared/model';

function App() {
  // TODO: make game path have an id

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<string[]>([]);
  // const [roomMsgs, setRoomMsgs] = useState<string[]>([]);
  const [chat, setChat] = useState<Message[]>([]);
  const [chatMessage, setChatMessage] = useState('')
  
  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value: string) {
      setFooEvents(previous => [...previous, value]);
    }

    function onPingEvent(msg: string) {
      onFooEvent(msg)
    }

    // function onRoomMsg(msg: string) {
    //   console.log('got room msg')
    //   setRoomMsgs((prev) => [...prev, msg])

    // }

    function onAddMessageToChat(message: Message) {
      setChat((prev) => [...prev, message])
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    socket.on('pingEvent', onPingEvent);
    // socket.on(ROOM_EVENT_NAME, onRoomMsg);
    socket.on(Events.ChatPlayerMessage, onAddMessageToChat);
    socket.on(Events.ChatSystemMessage, onAddMessageToChat);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
      socket.off('pingEvent', onPingEvent)
      // socket.off(ROOM_EVENT_NAME, onRoomMsg);
      socket.off(Events.ChatPlayerMessage, onAddMessageToChat);
      socket.off(Events.ChatSystemMessage, onAddMessageToChat);
    }
  }, [])
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/lobby/:uuid',
      element: <LobbyPage />
    },
    {
      path: '/game',
      element: <GamePage />
    }
  ])


  const connect = () => {
    socket.connect();
  }

  const disconnect = () => {
    socket.disconnect();
  }

  const ping = () => {
    socket.emit('pingEvent', 'ping')
  }

  const createLobby = () => {
    socket.emit(Events.LobbyCreate)
  }

  const joinRoom = () => {
    socket.emit(Events.LobbyJoin, TEST_ROOM_NAME)
  }

  const sendMessage = () => {
    const message: Message = {
      type: MessageType.USER,
      text: chatMessage,
      senderName: socket.id
    };

    socket.emit(Events.ChatPlayerMessage, message)
  }

  
  console.log('chat: ', chat)
  return (
    <div>
      sdfsd
      <h1>State: {'' + isConnected}</h1>
      <p>{fooEvents}</p>
      {/* <p>ROOM MSGS: {chat}</p> */}
      <Chat messages={chat} />

      <RouterProvider router={router} />
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={ping}>Ping</button>
      <button onClick={createLobby}>Create Lobby</button>
      <button onClick={joinRoom}>Join Room</button>
      
      <button onClick={sendMessage}>Send room msg</button>
      <input type='text' value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} />
      {/* {chat} */}
    </div>
  )
}

export default App
