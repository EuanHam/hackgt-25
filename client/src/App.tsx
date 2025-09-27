import { useEffect, useState } from 'react'
import Header from './components/Header'
import Feed from './components/Feed'
import Sidebar from './components/Sidebar'
import ImageModal from './components/ImageModal'
import type { FeedItem } from './types/feedTypes'
import './App.css'

const TOKEN = import.meta.env.VITE_TEMPORARY_TOKEN

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [emails, setEmails] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [imageModalState, setImageModalState] = useState({
    isOpen: false,
    imageUrl: '',
    alt: ''
  })

  console.log(TOKEN)

  const handleHamburgerClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  const handleImageClick = (imageUrl: string, alt: string) => {
    setImageModalState({
      isOpen: true,
      imageUrl,
      alt
    })
  }

  const handleImageModalClose = () => {
    setImageModalState({
      isOpen: false,
      imageUrl: '',
      alt: ''
    })
  }

  // Function to truncate text to fit UI (approximately 2 lines)
  const truncatePreview = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'http://127.0.0.1:8000/emails?start_date=2025-09-26&max_results=10',
          {
            headers: {
              'Authorization': `Bearer ${TOKEN}`
            }
          }
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Fetched emails:', data)
        
        // Transform API response to FeedItem format
        const transformedEmails: FeedItem[] = data.emails?.map((email: any, index: number) => ({
          id: email.id || `email-${index}`,
          type: 'email' as const,
          sender: email.sender || 'Unknown Sender',
          subject: email.subject || 'No Subject',
          preview: truncatePreview(email.body || email.snippet || 'No preview available'),
          timestamp: email.date || new Date().toLocaleDateString(),
          isRead: email.isRead || false
        })) || [];
        
        setEmails(transformedEmails);
      } catch (error) {
        console.error('Error fetching emails:', error)
        setEmails([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    }

    if (TOKEN) {
      fetchEmails();
    } else {
      setLoading(false);
    }
  }, [])

  

  return (
    <div className="app">
      <Header onHamburgerClick={handleHamburgerClick} />
      <main className={`main-content ${isSidebarOpen ? 'main-content-shifted' : ''}`}>
        {loading ? (
          <div className="loading-spinner">
            <p>Loading emails...</p>
          </div>
        ) : (
          <Feed 
            feedItems={emails} 
            onImageClick={handleImageClick} 
          />
        )}
      </main>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <ImageModal 
        isOpen={imageModalState.isOpen}
        imageUrl={imageModalState.imageUrl}
        alt={imageModalState.alt}
        onClose={handleImageModalClose}
      />
    </div>
  )
}

export default App
