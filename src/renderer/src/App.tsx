import React from 'react'
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Cloud, Home as HomeIcon, Settings as SettingsIcon, Rss } from 'lucide-react'
import Feed from '@renderer/components/Feed'
import Sync from '@renderer/components/Sync'
import Settings from '@renderer/components/Settings'
import Home from '@renderer/components/Home'
import { ImageProvider } from './context/imageContext'

function App(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-row bg-gray-800 text-gray-200">
      <Sidebar />
      <div className="ml-56 flex flex-1 flex-col items-center justify-center p-6">
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

// Sidebar Component
const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 flex h-screen w-56 flex-col gap-y-6 bg-gray-700 p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold text-gray-100">WallDo</h1>
      <NavItem to="/home" icon={<HomeIcon />} label="Home" active={location.pathname === '/home'} />
      <NavItem to="/feed" icon={<Rss />} label="Feed" active={location.pathname === '/feed'} />
      <NavItem to="/sync" icon={<Cloud />} label="Sync" active={location.pathname === '/sync'} />
      <NavItem to="/settings" icon={<SettingsIcon />} label="Settings" active={location.pathname === '/settings'} />
    </nav>
  )
}

// Sidebar Item Component
const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean }> = ({
  to,
  icon,
  label,
  active,
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-x-3 rounded-lg px-4 py-3 transition-all duration-300 ${
        active ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-600 hover:text-white'
      }`}
    >
      {icon}
      <p className="text-lg">{label}</p>
    </Link>
  )
}

export default App
