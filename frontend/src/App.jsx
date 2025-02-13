import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import Home from './Pages/Home';
import Artwork from './Pages/Artwork';
import Account from './Pages/Account';
import Gallery from './Pages/Gallery';
import Projects from './Pages/Projects';
import { AuthContext } from './Pages/Context';
import { useState } from 'react';

function App() {
	const [currentUser, setCurrentUser] = useState({ name: 'Username' });
	return (
		<div className='App'>
			<AuthContext.Provider value={{ currentUser, setCurrentUser }}>
				<Navbar />
				<Routes>
					<Route
						path='/'
						element={<Home />}
					/>
					<Route
						path='/Artwork'
						element={<Artwork />}
					/>
					<Route
						path='/Projects'
						element={<Projects />}
					/>
					<Route
						path='/Gallery'
						element={<Gallery />}
					/>
					<Route
						path='/Account'
						element={<Account />}
					/>
				</Routes>
			</AuthContext.Provider>
		</div>
	);
}
export default App;
