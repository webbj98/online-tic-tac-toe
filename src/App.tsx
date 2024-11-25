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

function App() {
  // TODO: make game path have an id

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<string[]>([]);
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

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    socket.on('pingEvent', (msg) => {
      console.log(msg)
      onFooEvent(msg)
    })

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
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

  const ping = () => {
    socket.emit('pingEvent', 'ping')
  }

  

  return (
    <div>
      sdfsd
      <h1>State: {'' + isConnected}</h1>
      <p>{fooEvents}</p>
      <RouterProvider router={router} />
      <button onClick={connect}>Connect</button>
      <button onClick={ping}>Ping</button>


    </div>
  )
}

export default App
