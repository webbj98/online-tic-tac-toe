import { useEffect, useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { HomePage } from './pages/HomePage/HomePage';
import { GamePage } from './pages/GamePage/GamePage';
import { LobbyPage } from './pages/LobbyPage/LobbyPage';
import { socket } from './socket';
import {ROOM_EVENT_NAME, TEST_ROOM_NAME} from '../shared/config'
import { Events } from '../shared/events';
import Chat from './components/Chat/Chat';
import {Message, MessageType} from '../shared/model';
import UserNameInput from './pages/LobbyPage/UserNameInput';

function App() {
  // TODO: make game path have an id
  
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chat, setChat] = useState<Message[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [userList, setUserList] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  // const navigate = useNavigate();
  
  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onAddMessageToChat(message: Message) {
      setChat((prev) => [...prev, message])
    }

    function onUpdateUserList(user: string) {
      setUserList((prev) => [...prev, user])
    }

    function onGetUserList(users: string[]) {
      setUserList(users)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // socket.on(ROOM_EVENT_NAME, onRoomMsg);
    socket.on(Events.ChatMessage, onAddMessageToChat);
    socket.on(Events.UserListUpdate, onUpdateUserList);
    socket.on(Events.UserListGet, onGetUserList)
    // socket.on(Events.LobbyUpdate, )
    // socket.on(Events.ChatMessage, onAddMessageToChat);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      // socket.off(ROOM_EVENT_NAME, onRoomMsg);
      socket.off(Events.ChatMessage, onAddMessageToChat);
      socket.off(Events.UserListUpdate, onUpdateUserList)
      socket.off(Events.UserListGet, onGetUserList)
      // socket.off(Events.ChatSystemMessage, onAddMessageToChat);
    }
  }, [])


  const connect = () => {
    socket.connect();
  }

  const disconnect = () => {
    socket.disconnect();
  }

  const createLobby = () => {
    socket.emit(Events.LobbyCreate, (newLobbyKey: string) => {
      // navigate(`navigate/${newLobbyKey}`)
      
    })
  }

  const joinRoom = () => {
    socket.emit(Events.LobbyJoin, window.location.href)
  }

  const sendMessage = (inputMsg: string, lobbyKey?: string) => {
    const message: Message = {
      type: MessageType.USER,
      text: inputMsg,
      senderName: userName,
      ...(lobbyKey ? {lobbyKey} : {})
    };

    socket.emit(Events.ChatMessage, message)
  }

  const handleSetUserName = (name: string) => {
    socket.emit(Events.UserSetName, name)
    setUserName(name)
    joinRoom()
  }
  
  

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/lobby/:uuid',
      element: <LobbyPage users={userList} userName={userName} onSetUserName={handleSetUserName} />
    },
    {
      path: '/game',
      element: <GamePage />
    }
  ])


  

  

  return (
    <div>
      <h1>State: {'' + isConnected}</h1>
      

      <RouterProvider router={router} />
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={joinRoom}>Join Room</button>
      
      <Chat messages={chat} onSend={sendMessage}/>
      {/* {chat} */}
    </div>
  )
}

export default App
