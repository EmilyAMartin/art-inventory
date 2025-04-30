import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
	Box,
	IconButton,
	Menu,
	MenuItem,
	Avatar,
	Typography,
	useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../Pages/Context';
import LoginBtn from './LoginBtn';

export const Navbar = () => {
	const { currentUser } = useContext(AuthContext);
	const [menuOpen, setMenuOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const navigate = useNavigate();
	const theme = useTheme();

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
		padding: '1rem',
		borderRadius: '0.5rem',
		backgroundColor: isActive ? 'lightgray' : 'transparent',
		'&:hover': {
			backgroundColor: isActive ? 'lightgray' : '#b9b5ff',
		},
	});

	return (
		<Box
			component='nav'
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				mt: '3rem',
				backgroundColor: '#fff',
				position: 'sticky',
				top: 0,
				zIndex: 1,
				flexDirection: { xs: 'column', sm: 'row' },
				paddingLeft: { xs: '0.5rem', sm: '3rem' },
				paddingRight: { xs: '0.5rem', sm: '3rem' },
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
					ml: 2,
				}}
			>
				<img
					src='./Images/Logo.png'
					alt='logo portfolio'
					width='85%'
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
					padding: 0,
					margin: 0,
					mb: { xs: '0.25rem', sm: 0 },
				}}
			>
				{/* Home */}
				<Box
					component='li'
					sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}
				>
					<Typography
						component={NavLink}
						to='/'
						onClick={handleLinkClick}
						sx={linkSx}
					>
						Home
					</Typography>
				</Box>

				{/* Gallery */}
				<Box
					component='li'
					sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}
				>
					<Typography
						component={NavLink}
						to='/Gallery'
						onClick={handleLinkClick}
						sx={linkSx}
					>
						Gallery
					</Typography>
				</Box>

				{/* Authenticated Routes */}
				{currentUser?.name && (
					<>
						<Box
							component='li'
							sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}
						>
							<Typography
								component={NavLink}
								to='/Portfolio'
								onClick={handleLinkClick}
								sx={linkSx}
							>
								Portfolio
							</Typography>
						</Box>

						<Box
							component='li'
							sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: 'center' }}
						>
							<Typography
								component={NavLink}
								to='/Favorites'
								onClick={handleLinkClick}
								sx={linkSx}
							>
								Favorites
							</Typography>
						</Box>

						{/* Avatar and Menu */}
						<Box component='li'>
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

							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
							>
								<MenuItem onClick={handleMenuClose}>
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
										textAlign: 'center',
										justifyContent: 'center',
										fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
										'&:hover': {
											backgroundColor: 'transparent',
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
						sx={{ mt: '6px', textAlign: 'center' }}
					>
						<LoginBtn />
					</Box>
				)}
			</Box>
		</Box>
	);
};
