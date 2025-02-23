import { useState, useEffect } from 'react'
import { useImageContext } from '../context/imageContext'

const Settings: React.FC = () => {
  const { imagePaths, setImagePaths } = useImageContext()
  const [directory, setDirectory] = useState('')

  useEffect(() => {
    if (imagePaths.length > 0) {
      const dirPath = getDirectoryPath(imagePaths[0])
      setDirectory(dirPath)
    }
  }, [imagePaths])

  const handleSelectDirectory = async (): Promise<void> => {
    const selectedPaths = await window.api.selectDir()
    setImagePaths(selectedPaths)
    const dirPath = getDirectoryPath(selectedPaths[0])
    setDirectory(dirPath)
  }

  const handleDirectoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirectory(event.target.value)
  }

  const getDirectoryPath = (filePath: string): string => {
    if (navigator.platform.startsWith('Win')) {
      return filePath.substring(0, filePath.lastIndexOf('\\'))
    } else {
      return filePath.substring(0, filePath.lastIndexOf('/'))
    }
  }

  if (navigator.platform.startsWith('Linux') || navigator.platform.startsWith('Win')) {
    return (
      <div className="relative flex h-screen items-center justify-center">
        <div className="absolute backdrop-blur-md backdrop-brightness-75"></div>
        <div>
          <div className="relative z-10 w-[400px] rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <h1 className="mb-6 text-center text-2xl font-bold text-white">Settings</h1>
            <div className="space-y-4">
              <button
                onClick={handleSelectDirectory}
                className="w-full rounded-lg bg-blue-500 px-6 py-2 text-lg text-white shadow-md transition hover:bg-blue-600"
              >
                Select Directory
              </button>
              <input
                type="text"
                value={directory}
                onChange={handleDirectoryChange}
                className="w-full rounded-lg border border-white/20 bg-white/20 px-4 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500"
                placeholder="Selected directory"
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Settings
