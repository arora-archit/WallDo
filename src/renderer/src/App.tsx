import React from 'react'
import { Link, Routes, Route, Navigate } from 'react-router-dom'
import { Cloud, House, SettingsIcon, Rss } from 'lucide-react'
import Feed from '@renderer/components/Feed'
import Sync from '@renderer/components/Sync'
import Settings from '@renderer/components/Settings'
import Home from '@renderer/components/Home'
import { ImageProvider } from './context/imageContext'

function App(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-row">
      <nav className={'fixed top-0 left-0 flex h-screen w-48 flex-col gap-y-4 bg-gray-700 p-4'}>
        <Link to={'/home'} className={'flex flex-row gap-x-2'}>
          <House />
          <p>Home</p>
        </Link>
        <Link to={'/feed'} className={'flex flex-row gap-x-2'}>
          <Rss />
          <p>Feed</p>
        </Link>
        <Link to={'/sync'} className={'flex flex-row gap-x-2'}>
          <Cloud />
          <p>Sync</p>
        </Link>
        <Link to={'/settings'} className={'flex flex-row gap-x-2'}>
          <SettingsIcon />
          <p>Settings</p>
        </Link>
      </nav>

      <div className={'ml-48 flex flex-1 flex-col items-center justify-center p-4'}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <ImageProvider>
                <Home />
              </ImageProvider>
            }
          />
          <Route
            path="/feed"
            element={
              <ImageProvider>
                <Feed />
              </ImageProvider>
            }
          />
          <Route path="/sync" element={<Sync />} />
          <Route
            path="/settings"
            element={
              <ImageProvider>
                <Settings />
              </ImageProvider>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
