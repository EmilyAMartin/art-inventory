import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import Home from './Pages/Home';
import Artwork from './Pages/Artwork';
import Account from './Pages/Account';
import Gallery from './Pages/Gallery';
import Projects from './Pages/Projects';
import { AuthContext } from './Pages/Context';
import { useState, useEffect } from 'react';

function App() {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		// Check if the user is logged in (check localStorage)
		const storedUser = JSON.parse(localStorage.getItem('currentUser'));
		if (storedUser) {
			setCurrentUser(storedUser); // If the user exists in localStorage, set them in context
		}
	}, []);

	// This useEffect ensures that when currentUser is set, it also gets saved to localStorage
	useEffect(() => {
		if (currentUser) {
			localStorage.setItem('currentUser', JSON.stringify(currentUser));
		}
	}, [currentUser]);

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
