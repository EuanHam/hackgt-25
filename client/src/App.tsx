import { useEffect, useState } from 'react'
import Header from './components/Header'
import Feed from './components/Feed'
import Sidebar from './components/Sidebar'
import ImageModal from './components/ImageModal'
import './App.css'

const TOKEN = import.meta.env.VITE_TEMPORARY_TOKEN

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/emails?start_date=2025-09-26&max_results=5',
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
      } catch (error) {
        console.error('Error fetching emails:', error)
      }
    }

    fetchEmails()
  }, [])

  

  return (
    <div className="app">
      <Header onHamburgerClick={handleHamburgerClick} />
      <main className={`main-content ${isSidebarOpen ? 'main-content-shifted' : ''}`}>
        <Feed onImageClick={handleImageClick} />
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
