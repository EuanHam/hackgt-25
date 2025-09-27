import { useRef, useLayoutEffect, useState } from 'react'
import Header from './components/Header'
import Feed from './components/Feed'
import Sidebar from './components/Sidebar'
import ImageModal from './components/ImageModal'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)
  const SIDEBAR_WIDTH = 340;
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

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app">
    <Header ref={headerRef} onHamburgerClick={handleHamburgerClick} />
    <div
      className="main-wrapper"
      style={{
        marginTop: headerHeight,
        transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
        transform: isSidebarOpen ? `translateX(${SIDEBAR_WIDTH / 2}px)` : 'none'
      }}
    >
      <main className="main-content">
        <Feed onImageClick={handleImageClick} />
      </main>
    </div>
    <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} headerHeight={headerHeight} />
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
