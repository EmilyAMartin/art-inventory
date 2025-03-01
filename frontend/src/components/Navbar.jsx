import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Link, NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../Pages/Context'; // Import the AuthContext
import LoginBtn from './LoginBtn';

export const Navbar = () => {
	const { currentUser } = useContext(AuthContext); // Access the currentUser from context
	const [menuOpen, setMenuOpen] = useState(false);
	const handleLinkClick = () => {
		setMenuOpen(false);
	};

	return (
		<nav>
			<Link
				to='/'
				className='logo'
			>
				<img
					src='./Images/Logo.png'
					alt='logo portfolio'
				/>
			</Link>
			<div
				className='menu'
				onClick={() => setMenuOpen(!menuOpen)}
			>
				<MenuIcon style={{ margin: 10 }} />
			</div>
			<ul className={menuOpen ? 'open' : ''}>
				<li>
					<NavLink
						to='/'
						onClick={handleLinkClick}
					>
						Home
					</NavLink>
				</li>

				{/* Conditionally render based on user status */}
				{currentUser?.name && (
					<>
						<li>
							<NavLink
								to='/Artwork'
								onClick={handleLinkClick}
							>
								Artwork
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/Projects'
								onClick={handleLinkClick}
							>
								Projects
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/Account'
								onClick={handleLinkClick}
							>
								Account
							</NavLink>
						</li>
					</>
				)}

				<li>
					<NavLink
						to='/Gallery'
						onClick={handleLinkClick}
					>
						Gallery
					</NavLink>
				</li>

				{/* Show Login button if no user is signed in */}
				<li style={{ marginTop: 6 }}>{!currentUser?.name && <LoginBtn />}</li>
			</ul>
		</nav>
	);
};
