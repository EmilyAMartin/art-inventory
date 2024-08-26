import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import Home from './components/Pages/Home'
import Artwork from './components/Pages/Artwork'
import Account from './components/Pages/Account'
import Contact from './components/Contact'

function App() {
  return (
    <div className='App'>
      <Navbar />
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