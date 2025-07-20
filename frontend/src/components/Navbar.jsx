import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
	Box,
	IconButton,
	Menu,
	MenuItem,
	Avatar,
	Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../Pages/Context';
import LoginBtn from './api/loginBtn';
import { BASE_URL } from '../config';

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

	const handleLogout = async () => {
		try {
			const response = await fetch(`${BASE_URL}/api/logout`, {
				method: 'POST',
				credentials: 'include',
			});
			if (!response.ok) throw new Error('Failed to log out');
			setMenuOpen(false);
			window.location.href = '/';
		} catch (err) {
			console.error('Logout error:', err);
		}
	};

	const linkSx = ({ isActive }) => ({
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		textDecoration: 'none',
		color: 'black',
		display: 'block',
		px: '1rem',
		py: '0.75rem',
		borderRadius: '0.5rem',
		backgroundColor: isActive ? 'lightgray' : 'transparent',
		'&:hover': {
			backgroundColor: isActive ? 'lightgray' : '#b9b5ff',
		},
	});

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					bgcolor: '#fff',
					position: 'sticky',
					width: '100%',
					top: 0,
					zIndex: 1,
					flexDirection: { xs: 'column', sm: 'row' },
				}}
			>
				{/* Logo */}
				<Box
					component={Link}
					to='/'
					sx={{
						fontSize: '3rem',
						fontWeight: 'bold',
						textDecoration: 'none',
						color: 'black',
					}}
					onClick={handleLinkClick}
				>
					<Box
						component='img'
						src='./Images/Logo.png'
						alt='logo portfolio'
						sx={{ width: '85%' }}
					/>
				</Box>

				{/* Mobile Menu Button */}
				<Box
					onClick={() => setMenuOpen(!menuOpen)}
					sx={{
						display: { xs: 'flex', sm: 'none' },
						position: 'absolute',
						top: '0.75rem',
						right: '0.5rem',
						cursor: 'pointer',
					}}
				>
					<MenuIcon />
				</Box>

				{/* Navigation Links */}
				<Box
					component='ul'
					sx={{
						display: { xs: menuOpen ? 'flex' : 'none', sm: 'flex' },
						flexDirection: { xs: 'column', sm: 'row' },
						width: { xs: '100%', sm: 'auto' },
						listStyle: 'none',
						p: 0,
						m: 0,
						mb: { xs: '0.25rem', sm: 0 },
					}}
				>
					{['/', '/Gallery'].map((path, index) => (
						<Box
							component='li'
							key={path}
							sx={{
								width: { xs: '100%', sm: 'auto' },
								textAlign: 'center',
							}}
						>
							<Typography
								component={NavLink}
								to={path}
								onClick={handleLinkClick}
								sx={linkSx}
							>
								{index === 0 ? 'Home' : 'Gallery'}
							</Typography>
						</Box>
					))}

					{currentUser?.name && (
						<>
							{['/Portfolio', '/Favorites'].map((path) => (
								<Box
									component='li'
									key={path}
									sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}
								>
									<Typography
										component={NavLink}
										to={path}
										onClick={handleLinkClick}
										sx={linkSx}
									>
										{path.replace('/', '')}
									</Typography>
								</Box>
							))}
							{/* Avatar & Account Menu */}
							<Box>
								<Box
									sx={{
										display: 'flex',
										justifyContent: { xs: 'center', sm: 'flex-start' },
										alignItems: 'center',
										mt: { xs: 2, sm: 0 },
									}}
								>
									<IconButton onClick={handleAccountClick}>
										{currentUser.profile_image ? (
											<Avatar
												src={currentUser.profile_image}
												alt={currentUser.name}
												sx={{ width: 35, height: 35 }}
											/>
										) : (
											<AccountCircleIcon sx={{ color: 'black', fontSize: '125%' }} />
										)}
									</IconButton>
								</Box>
								<Menu
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={handleMenuClose}
									anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
									transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								>
									<MenuItem
										onClick={() => {
											handleMenuClose();
											handleLinkClick();
										}}
									>
										<Typography
											component={NavLink}
											to='/Account'
											sx={linkSx}
										>
											Account
										</Typography>
									</MenuItem>
									<MenuItem
										onClick={handleLogout}
										sx={{
											justifyContent: 'center',
											fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
											'&:hover': {
												bgcolor: 'transparent',
											},
										}}
									>
										Logout
									</MenuItem>
								</Menu>
							</Box>
						</>
					)}

					{/* Login Button */}
					{!currentUser?.name && (
						<Box
							component='li'
							sx={{ textAlign: 'center' }}
						>
							<LoginBtn />
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};
