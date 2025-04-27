import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import Home from './Pages/Home';
import Account from './Pages/Account';
import Gallery from './Pages/Gallery';
import Portfolio from './Pages/Portfolio';
import Favorites from './Pages/Favorites';
import UserProfile from './components/UserProfile';
import { AuthContext } from './Pages/Context';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Toast, { queryClient } from './components/Toast';

function App() {
	return (
		<div className='App'>
			<QueryClientProvider client={queryClient}>
				<Toast />
				<AppContent />
			</QueryClientProvider>
		</div>
	);
}

function AppContent() {
	const {
		data: currentUser,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ['currentUser'],
		queryFn: async () => {
			const userResponse = await fetch('http://localhost:3000/profile', {
				method: 'GET',
				credentials: 'include',
			});
			if (userResponse.ok) {
				const userData = await userResponse.json();
				if (userData.user.profile_image) {
					userData.user.profile_image = `http://localhost:3000${userData.user.profile_image}`;
				}
				return userData.user;
			} else {
				if (userResponse.status === 401) {
					return undefined;
				} else {
					throw new Error('Failed to fetch user');
				}
			}
		},
		refetchOnWindowFocus: false,
	});

	return (
		<AuthContext.Provider value={{ currentUser, refetch }}>
			<Navbar />
			<Routes>
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/Portfolio'
					element={<Portfolio />}
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
				<Route
					path='/users/:userId'
					element={<UserProfile />}
				/>
			</Routes>
		</AuthContext.Provider>
	);
}

export default App;
