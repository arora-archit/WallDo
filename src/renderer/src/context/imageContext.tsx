import React, { createContext, useState, useContext, useEffect } from 'react'

interface ImageContextType {
  imagePaths: string[]
  setImagePaths: (paths: string[]) => void
}

const ImageContext = createContext<ImageContextType | undefined>(undefined)

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [imagePaths, setImagePaths] = useState<string[]>([])

  useEffect(() => {
    const storedPaths = localStorage.getItem('imagePaths')
    if (storedPaths) {
      setImagePaths(JSON.parse(storedPaths))
    }
  }, [])

  const setImagePathsWithStorage = (paths: string[]) => {
    setImagePaths(paths)
    localStorage.setItem('imagePaths', JSON.stringify(paths))
  }

  return (
    <ImageContext.Provider value={{ imagePaths, setImagePaths: setImagePathsWithStorage }}>
      {children}
    </ImageContext.Provider>
  )
}

export const useImageContext = (): ImageContextType => {
  const context = useContext(ImageContext)
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider')
  }
  return context
}
