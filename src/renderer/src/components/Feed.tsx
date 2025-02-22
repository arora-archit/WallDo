import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-grid-system'

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({})
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchFeed = async (page: number) => {
      try {
        const data = await window.api.fetchWallhavenFeed(page)
        setFeed((prevFeed) => [...prevFeed, ...data.data])
      } catch (error) {
        console.error('Error fetching feed:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeed(page)
  }, [page])

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
      setImageUrls(urls.reduce((acc, { id, url }) => ({ ...acc, [id]: url }), {}))
    }
    if (feed.length > 0) fetchImages()
  }, [feed])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold text-white">
        Loading...
      </div>
    )
  }

  const handleImageClick = async (item: any) => {
    if (downloading[item.id]) return
    try {
      setDownloading((prev) => ({ ...prev, [item.id]: true }))
      const imagePath = await window.api.downloadImage(item.path)
      setPopupMessage(`Image downloaded to: ${imagePath}`)
    } catch {
      setPopupMessage('Error downloading image')
    } finally {
      setDownloading((prev) => ({ ...prev, [item.id]: false }))
      setTimeout(() => setPopupMessage(null), 3000)
    }
  }

  return (
    <div className="min-h-screen">
      <Container>
        <h1 className="mb-6 text-center py-4 text-4xl font-bold text-gray-200">Wallhaven Feed</h1>
        <Row>
          {feed.map((item) => (
            <Col key={item.id} sm={6} md={4} lg={3}>
              <div
                className="relative mb-4 overflow-hidden rounded-xl border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={() => handleImageClick(item)}
              >
                {imageUrls[item.id] ? (
                  <img
                    className={`h-48 w-full object-cover ${downloading[item.id] ? 'blur-sm' : ''}`}
                    src={imageUrls[item.id]}
                    alt={item.id}
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center text-gray-400">
                    Loading...
                  </div>
                )}
                {downloading[item.id] && (
                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
                    <p className="rounded-md bg-gray-800 px-3 py-1 text-lg font-semibold text-white">
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
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-lg bg-blue-500 px-6 py-2 text-lg text-white shadow-md transition hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      </Container>
    </div>
  )
}

export default Feed
