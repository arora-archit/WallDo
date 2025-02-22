import { useContext } from 'react'
import { useImageContext } from '../context/imageContext'

const Settings: React.FC = () => {
  const { setImagePaths } = useImageContext()

  const handleSelectDirectory = async (): Promise<void> => {
    const imagePaths = await window.api.selectDir()
    setImagePaths(imagePaths)
  }

  return (
    <div className="p-4">
      <button
        onClick={handleSelectDirectory}
        className="rounded-lg bg-blue-500 px-4 py-2 text-white"
      >
        Select Directory
      </button>
    </div>
  )
}

export default Settings
