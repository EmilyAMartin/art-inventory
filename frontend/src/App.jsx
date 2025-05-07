import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Home from './Pages/Home';
import Account from './Pages/Account';
import Gallery from './Pages/Gallery';
import Portfolio from './Pages/Portfolio';
import Favorites from './Pages/Favorites';
import UserProfile from './components/UserProfile';
import { AuthContext } from './Pages/Context';
import { useQuery } from '@tanstack/react-query';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Toast from './components/Toast';
import { BASE_URL } from './config';

function App() {
	const {
		data: currentUser,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['userProfile'],
		queryFn: async () => {
			const userResponse = await fetch(`${BASE_URL}/profile`, {
				method: 'GET',
				credentials: 'include',
			});
			if (!userResponse.ok) {
				if (userResponse.status === 401) {
					return null;
				}
				throw new Error('Failed to fetch user');
			}
			const data = await userResponse.json();
			if (data.user.profile_image) {
				data.user.profile_image = `${BASE_URL}${data.user.profile_image}`;
			}
			return data.user;
		},
		retry: false,
	});
	if (isLoading) {
		return <p>Loading...</p>;
	}
	return (
		<div className='App'>
			<Toast />
			<AuthContext.Provider value={{ currentUser, refetchCurrentUser: refetch }}>
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
		</div>
	);
}

export default App;
