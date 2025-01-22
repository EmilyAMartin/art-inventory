import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import Home from './Pages/Home';
import Artwork from './Pages/Artwork';
import Account from './Pages/Account';
import Gallery from './Pages/Gallery';
import Projects from './Pages/Projects';

function App() {
	return (
		<div className='App'>
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
		</div>
	);
}
export default App;
