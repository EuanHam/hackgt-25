import { useState } from 'react'
import Header from './components/Header'
import Feed from './components/Feed'
import Sidebar from './components/Sidebar'
import ImageModal from './components/ImageModal'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [imageModalState, setImageModalState] = useState({
    isOpen: false,
    imageUrl: '',
    alt: ''
  })

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
