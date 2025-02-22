import { useImageContext } from '../context/imageContext'
import { Container, Row, Col } from 'react-grid-system'
import LazyLoad from 'react-lazyload'

const Home: React.FC = () => {
  const { imagePaths } = useImageContext()

  return (
    <Container>
      <Row>
        {imagePaths.map((path, index) => (
          <Col key={index} sm={6} md={4} lg={3}>
            <div className="h-48 w-full items-center justify-center overflow-hidden rounded-lg p-5">
              <LazyLoad height={200} offset={100}>
                <img
                  className="max-w-full object-cover"
                  src={`file:///${path.replace(/\\/g, '/')}`}
                  alt={`Image ${index}`}
                />
              </LazyLoad>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Home
