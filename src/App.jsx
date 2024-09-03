import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import Home from './components/Pages/Home'
import Artwork from './components/Pages/Artwork'
import Account from './components/Pages/Account'
import Gallery from './components/Pages/Gallery'
import ArtData from './components/ArtData.json'

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Artwork" element={<Artwork />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Account" element={<Account />} />
      </Routes>
    </div>
  )
}
export default App