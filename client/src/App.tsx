import { useState } from 'react'
import Header from './components/Header'
import Feed from './components/Feed'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleHamburgerClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="app">
      <Header onHamburgerClick={handleHamburgerClick} />
      <main className={`main-content ${isSidebarOpen ? 'main-content-shifted' : ''}`}>
        <Feed />
      </main>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
    </div>
  )
}

export default App
