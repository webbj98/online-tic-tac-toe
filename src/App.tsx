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
import {GameObject, Message, MessageType, SocketIdUserNamePair} from '../shared/model';
import UserNameInput from './pages/LobbyPage/UserNameInput';
import { getLobbyKeyFromUrl } from './util';

function App() {
  // TODO: make game path have an id
  
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chat, setChat] = useState<Message[]>([]);
  const [userIdMap, setUserIdMap] = useState<Map<string, string>>(new Map());
  const [userName, setUserName] = useState('');
  const [curGame, setCurGame] = useState<GameObject | undefined>();
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

    function onUpdateUserIdMap(user: SocketIdUserNamePair) {
      setUserIdMap((prev) => {
        const newMap = new Map([...prev])
        newMap.set(user.socketId, user.userName)
        return newMap
      })
    }

    function onGetUserList(users: SocketIdUserNamePair[]) {

      setUserIdMap(new Map(users.map((user) => [user.socketId, user.userName])))
    }

    function onGameStart(game: GameObject) {
      // navigate to game page
      setCurGame(game)
      console.log('navigate to new page: ')
    }

    function onGameUpdate(game: GameObject) {
      setCurGame(game)
    }

    function onGameStop() {
      setCurGame(undefined)
    }

    socket.on(Events.Connect, onConnect);
    socket.on(Events.Disconnect, onDisconnect);

    // socket.on(ROOM_EVENT_NAME, onRoomMsg);
    socket.on(Events.MessageSend, onAddMessageToChat);
    socket.on(Events.UserListUpdate, onUpdateUserIdMap);
    socket.on(Events.UserListGet, onGetUserList);
    socket.on(Events.GameStart, onGameStart);
    socket.on(Events.GameUpdate, onGameUpdate);
    socket.on(Events.GameStop, onGameStop);
    // socket.on(Events.LobbyUpdate, )
    // socket.on(Events.ChatMessage, onAddMessageToChat);

    return () => {
      socket.off(Events.Connect, onConnect);
      socket.off(Events.Disconnect, onDisconnect);
      // socket.off(ROOM_EVENT_NAME, onRoomMsg);
      socket.off(Events.MessageSend, onAddMessageToChat);
      socket.off(Events.UserListUpdate, onUpdateUserIdMap);
      socket.off(Events.UserListGet, onGetUserList);
      socket.off(Events.GameStart, onGameStart);
      socket.off(Events.GameUpdate, onGameUpdate);
      socket.off(Events.GameStop, onGameStop);
      // socket.off(Events.ChatSystemMessage, onAddMessageToChat);
    }
  }, [])


  const connect = () => {
    socket.connect();
  }

  const disconnect = () => {
    socket.disconnect();
  }

  const joinRoom = () => {
    socket.emit(Events.LobbyJoin, getLobbyKeyFromUrl())
  }

  const sendMessage = (inputMsg: string) => {
    const message: Message = {
      type: MessageType.USER,
      text: inputMsg,
      senderName: userName,
      lobbyKey: getLobbyKeyFromUrl()
    };

    socket.emit(Events.MessageSend, message)
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
      element: <LobbyPage users={userIdMap} userName={userName} game={curGame} onSetUserName={handleSetUserName} />
    },
    // {
    //   path: '/lobby/:uuid/game',
    //   element: <GamePage game={curGame} />
    // }
  ])

  return (
    <div>
      <h1>State: {'' + isConnected}</h1>
      

      <RouterProvider router={router} />
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
       
      <Chat messages={chat} onSend={sendMessage}/>
      {/* {chat} */}
    </div>
  )
}

export default App
