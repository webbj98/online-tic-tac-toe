import { useState } from 'react'
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

function App() {
  // TODO: make game have an id
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

  

  return (
    <RouterProvider router={router} />
  )
}

export default App
