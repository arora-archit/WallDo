import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { Cloud, House, SettingsIcon, Rss } from 'lucide-react'
import Feed from '@renderer/components/Feed'
import Sync from '@renderer/components/Sync'
import Settings from '@renderer/components/Settings'
import Home from '@renderer/components/Home'

function App(): React.JSX.Element {
  return (
    <div className="flex h-screen flex-row">
      <nav className={'flex flex-col gap-y-4 bg-gray-700 px-4 py-3'}>
        <Link to={'/'} className={'flex flex-row gap-x-2'}>
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

      <div className={'flex flex-1 flex-col items-center justify-center p-4'}>
        <Routes>
          <Route path={'/'} element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/sync" element={<Sync />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
