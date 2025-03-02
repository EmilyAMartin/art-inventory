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
import axios from 'axios';

function App() {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		console.log('Checking login status...');
		axios
			.get('http://localhost:3306/check-login')
			.then((response) => {
				console.log('Login check response:', response.data);
				if (response.data.loggedIn) {
					setCurrentUser(response.data.user);
				}
			})
			.catch((error) => {
				console.error('Error checking login status:', error);
			});
	}, []);

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
						element={currentUser ? <Account /> : <Home />}
					/>
				</Routes>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
