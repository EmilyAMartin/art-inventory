import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import Home from './Pages/Home';
import Artwork from './Pages/Artwork';
import Account from './Pages/Account';
import Gallery from './Pages/Gallery';
import Projects from './Pages/Projects';
import Favorites from './Pages/Favorites';
import { AuthContext } from './Pages/Context';
import { useEffect, useState } from 'react';

function App() {
	const [currentUser, setCurrentUser] = useState(null);

	const refreshCurrentUser = async () => {
		const userResponse = await fetch('http://localhost:3000/profile', {
			method: 'GET',
			credentials: 'include',
		});
		if (userResponse.ok) {
			const userData = await userResponse.json();
			setCurrentUser(userData.user);
			return true;
		} else {
			setCurrentUser(undefined);
			if (userResponse.status === 401) {
				return false;
			} else {
				console.error('Failed to fetch user', userResponse);
				return false;
			}
		}
	};

	useEffect(() => {
		refreshCurrentUser();
	}, []);

	if (currentUser === null) {
		return <p>Loading...</p>;
	}

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
						path='/Favorites'
						element={<Favorites />}
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
