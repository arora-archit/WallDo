import { useState } from 'react'

const ImageViewer: React.FC = () => {
  const [images, setImages] = useState<string[]>([])

  const handleSelectDirectory = async (): Promise<void> => {
    const imagePaths = await window.api.selectDir()
    setImages(imagePaths)
  }

  return (
    <div className="p-4">
      <button
        onClick={handleSelectDirectory}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Select Directory
      </button>

      <div className="mt-4 flex flex-wrap gap-4">
        {images.map((path, index) => (
          <img
            key={index}
            src={`file:///${path.replace(/\\/g, '/')}`}
            alt={`Image ${index}`}
            className="w-24 h-24 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  )
}

export default ImageViewer
