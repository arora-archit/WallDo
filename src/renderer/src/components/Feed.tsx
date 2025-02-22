import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-grid-system'

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({})
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    const fetchFeed = async (page: number) => {
      try {
        const data = await window.api.fetchWallhavenFeed(page)
        console.log('Fetched data:', data)
        setFeed((prevFeed) => [...prevFeed, ...data.data])
      } catch (error) {
        console.error('Error fetching feed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeed(page)
  }, [page])

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
      const urlMap = urls.reduce(
        (acc, { id, url }) => {
          acc[id] = url
          return acc
        },
        {} as { [key: string]: string }
      )
      setImageUrls(urlMap)
    }

    if (feed.length > 0) {
      fetchImages()
    }
  }, [feed])

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>
  }

  const handleImageClick = async (item: any) => {
    if (downloading[item.id]) return

    try {
      setDownloading((prev) => ({ ...prev, [item.id]: true }))
      const imagePath = await window.api.downloadImage(item.path)
      console.log('Image downloaded to:', imagePath)
      setPopupMessage(`Image downloaded to: ${imagePath}`)
    } catch (error) {
      console.error('Error downloading image:', error)
      setPopupMessage('Error downloading image')
    } finally {
      setDownloading((prev) => ({ ...prev, [item.id]: false }))
      setTimeout(() => setPopupMessage(null), 3000) // Hide the message after 3 seconds
    }
  }

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <Container>
      <h1 className={'flex justify-center text-3xl'}>Wallhaven Feed</h1>
      <Row>
        {feed.map((item) => (
          <Col key={item.id} sm={6} md={4} lg={3}>
            <div
              className="relative h-48 w-full cursor-pointer overflow-hidden rounded-lg"
              onClick={() => handleImageClick(item)}
            >
              {imageUrls[item.id] ? (
                <img
                  className={`h-full w-full object-cover transition-all duration-300 ${
                    downloading[item.id] ? 'blur-sm' : ''
                  }`}
                  src={imageUrls[item.id]}
                  alt={item.id}
                />
              ) : (
                <p className="text-center">Loading...</p>
              )}

              {downloading[item.id] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="rounded-md bg-black/50 px-3 py-1 text-lg font-semibold text-white">
                    Downloading...
                  </p>
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>

      {popupMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 px-4 py-2 text-white shadow-md">
          {popupMessage}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button onClick={handleLoadMore} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Load More
        </button>
      </div>
    </Container>
  )
}

export default Feed