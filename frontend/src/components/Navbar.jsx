import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../Pages/Context';
import LoginBtn from './LoginBtn';
import { Menu, MenuItem, IconButton } from '@mui/material';

export const Navbar = () => {
	const { currentUser } = useContext(AuthContext);
	const [menuOpen, setMenuOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const navigate = useNavigate();

	const handleLinkClick = () => {
		setMenuOpen(false);
	};

	const handleAccountClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		try {
			// Call the backend logout API
			const response = await fetch('http://localhost:3000/logout', {
				method: 'POST',
				credentials: 'include', // Make sure cookies are included in the request
			});

			if (!response.ok) {
				throw new Error('Failed to log out');
			}

			// Optionally clear any local storage or frontend state
			// localStorage.removeItem('currentUser'); // Optional, if you store it in localStorage

			setMenuOpen(false);

			// Redirect and reload the page to force the state change
			window.location.href = '/'; // This will reload the page and redirect to the home page
		} catch (err) {
			console.error('Logout error:', err);
		}
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
				<li>
					<NavLink
						to='/Gallery'
						onClick={handleLinkClick}
					>
						Gallery
					</NavLink>
				</li>

				{/* Conditionally show menu items if the user is logged in */}
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
						<li className='account'>
							<IconButton onClick={handleAccountClick}>
								<AccountCircleIcon style={{ color: 'black', fontSize: '125%' }} />
							</IconButton>

							{/* Drop Down Menu */}
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								sx={{
									width: '160px',
									padding: '0px',
								}}
							>
								<MenuItem
									onClick={handleMenuClose}
									sx={{
										textAlign: 'center',
										'&:hover': {
											backgroundColor: 'transparent',
										},
									}}
								>
									<NavLink
										to='/Account'
										className='dropdown-link'
									>
										Account
									</NavLink>
								</MenuItem>
								<MenuItem
									onClick={handleLogout}
									sx={{
										textAlign: 'center',
										'&:hover': {
											backgroundColor: 'transparent',
										},
									}}
								>
									Logout
								</MenuItem>
							</Menu>
						</li>
					</>
				)}
				<li style={{ marginTop: 6 }}>{!currentUser?.name && <LoginBtn />}</li>
			</ul>
		</nav>
	);
};
