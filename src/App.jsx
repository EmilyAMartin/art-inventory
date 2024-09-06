import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import Home from './components/Pages/Home'
import Artwork from './components/Pages/Artwork'
import Account from './components/Pages/Account'
import Gallery from './components/Pages/Gallery'

import axios from 'axios'
import { useState } from 'react'

function App() {
  const [quote, setQuote] = useState('')
  const getQuote = () => {
    axios.get('https://api.quotable.io/random')
      .then(res => {
        console.log(res)
        setQuote(res.data.content)
      }).catch(err => {
        console.log(err)
      })
  }
  return (
    <div className='App'>
      <Navbar />

      <div>
        <button onClick={getQuote}>Get Quote</button>
        {quote && <div>{quote}</div>}
      </div>


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