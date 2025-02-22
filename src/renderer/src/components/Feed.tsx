import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-grid-system'

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<unknown[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({})
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const data = await window.api.fetchWallhavenFeed()
        console.log('Fetched data:', data)
        setFeed(data.data)
      } catch (error) {
        console.error('Error fetching feed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeed()
  }, [])

  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchImages = async () => {
      const urls = await Promise.all(
        feed.map(async (item) => {
          if (item.thumbs && item.thumbs.small) {
            const url = await window.api.fetchWallhavenImage(item.thumbs.small)
            return { id: item.id, url }
          }
          return { id: item.id, url: '' }
        })
      )
      const urlMap = urls.reduce((acc, { id, url }) => {
        acc[id] = url
        return acc
      }, {})
      setImageUrls(urlMap)
    }

    if (feed.length > 0) {
      fetchImages()
    }
  }, [feed])

  if (loading) {
    return <div>Loading...</div>
  }
  const handleImageClick = async (item: any) => {
    if (downloading[item.id]) return

    try {
      setDownloading((prev) => ({ ...prev, [item.id]: true }))
      const imagePath = await window.api.downloadImage(item.path)
      console.log('Image downloaded to:', imagePath)
    } catch (error) {
      console.error('Error downloading image:', error)
    } finally {
      setDownloading((prev) => ({ ...prev, [item.id]: false }))
    }
  }
  return (
    <Container>
      <h1>Wallhaven Feed</h1>
      <Row>
        {feed.map((item) => (
          <Col key={item.id} sm={6} md={4} lg={3}>
            <div
              className={`h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg p-5 ${downloading[item.id] ? 'opacity-50' : ''}`}
              onClick={() => handleImageClick(item)}
            >
              {imageUrls[item.id] ? (
                <img className="max-w-full object-cover" src={imageUrls[item.id]} alt={item.id} />
              ) : (
                <p>Loading...</p>
              )}
              {downloading[item.id] && (
                <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                  <p className="text-white">Downloading...</p>
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default Feed
