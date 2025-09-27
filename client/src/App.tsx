import Header from './components/Header'
import Feed from './components/Feed'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Feed />
      </main>
    </div>
  )
}

export default App
