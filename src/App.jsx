import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import Home from './components/Pages/Home'
import Artwork from './components/Pages/Artwork'
import Account from './components/Pages/Account'
import Contact from './components/Pages/Contact'
import { Modal } from './components/Modal'

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Modal>
        <h1>This is the modal header</h1>
        <p>This is the modal description</p>
      </Modal>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Artwork" element={<Artwork />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

export default App
