import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../Pages/Context';
import LoginBtn from './LoginBtn';
import { Menu, MenuItem, IconButton, Avatar, Button } from '@mui/material';

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
			const response = await fetch('http://localhost:3000/logout', {
				method: 'POST',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to log out');
			}
			setMenuOpen(false);
			window.location.href = '/';
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
					width='85%'
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
								to='/Portfolio'
								onClick={handleLinkClick}
							>
								Portfolio
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/Favorites'
								onClick={handleLinkClick}
							>
								Favorites
							</NavLink>
						</li>
						<li className='account'>
							<IconButton onClick={handleAccountClick}>
								{currentUser.profile_image ? (
									<Avatar
										src={currentUser.profile_image}
										alt={currentUser.name}
										sx={{ width: 40, height: 40 }}
									/>
								) : (
									<AccountCircleIcon style={{ color: 'black', fontSize: '125%' }} />
								)}
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
										justifyContent: 'center',
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
