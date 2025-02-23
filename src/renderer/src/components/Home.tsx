/* eslint-disable react/prop-types */
import { useImageContext } from '../context/imageContext'
import { Container, Row, Col } from 'react-grid-system'
import LazyLoad from 'react-lazyload'
import setWallpaper from './setWallpaper'
import '../assets/animation.css'
import { useState } from 'react'

const Home: React.FC = () => {
  const { imagePaths } = useImageContext()

  // Function to get a low-resolution version of an image
  const getLowResPath = (path: string) => path.replace(/(\.\w+)$/, '_lowres$1')

  return (
    <div className="min-h-screen">
      <Container>
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-200">Image Gallery</h1>
        <Row>
          {imagePaths.map((path, index) => (
            <Col key={index} sm={6} md={4} lg={3}>
              <ImageCard fullResPath={path} lowResPath={getLowResPath(path)} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

// Component for each image
const ImageCard: React.FC<{ fullResPath: string; lowResPath: string }> = ({
  fullResPath,
  lowResPath
}) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className="group relative mb-4 overflow-hidden rounded-xl"
      onClick={() => setWallpaper(fullResPath)}
    >
      <LazyLoad height={150} offset={50} placeholder={<Placeholder />}>
        {/* Low-res image loads first */}
        <img
          className={`absolute inset-0 h-40 w-full object-cover blur-md ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
          src={`file:///${lowResPath.replace(/\\/g, '/')}`}
          alt="Low Res"
        />
        {/* Full-res image fades in after loading */}
        <img
          className={`h-40 w-full cursor-pointer object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          src={`file:///${fullResPath.replace(/\\/g, '/')}`}
          alt="Full Res"
          onLoad={() => setIsLoaded(true)}
        />
      </LazyLoad>
      <AutoScrollText text={fullResPath} />
    </div>
  )
}

// Placeholder component for lazy loading
const Placeholder: React.FC = () => (
  <div className="h-40 w-full animate-pulse rounded-lg bg-gray-800" />
)

// Auto-scrolling text component
const AutoScrollText: React.FC<{ text: string }> = ({ text }) => (
  <div className="absolute bottom-0 w-full overflow-hidden bg-black/60 p-2 text-center text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
    <div className="scrolling-text group-hover:animate-scrollText inline-block whitespace-nowrap">
      {text}
    </div>
  </div>
)

export default Home
