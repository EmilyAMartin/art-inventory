import React, { useContext, useState } from 'react';
import './Navbar.css';
import { Link, NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../Pages/Context';
import LoginBtn from './LoginBtn';
import { Menu, MenuItem, IconButton } from '@mui/material';

export const Navbar = () => {
	const { currentUser } = useContext(AuthContext);
	const [menuOpen, setMenuOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleLinkClick = () => {
		setMenuOpen(false);
	};

	const handleAccountClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
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

				{/* Conditionally Login */}
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
									onClick={handleMenuClose}
									sx={{
										textAlign: 'center',
										'&:hover': {
											backgroundColor: 'transparent',
										},
									}}
								>
									<NavLink
										to='/Logout'
										className='dropdown-link'
									>
										Logout
									</NavLink>
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
