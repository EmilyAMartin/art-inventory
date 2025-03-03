import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Checkbox from '@mui/material/Checkbox';
import { AuthContext } from '../Pages/Context';

const LoginBtn = () => {
	const [open, setOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { setCurrentUser } = useContext(AuthContext); // Access setCurrentUser from context

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => event.preventDefault();
	const handleMouseUpPassword = (event) => event.preventDefault();

	// API Request to Backend for login
	const handleLogin = async (event) => {
		event.preventDefault();
		setError('');
		try {
			const response = await fetch('http://localhost:3000/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				// After successful login, fetch user profile and update context
				const userResponse = await fetch('http://localhost:3000/profile');
				const userData = await userResponse.json();

				if (userResponse.ok) {
					setCurrentUser(userData.user); // Update context with the user data
					handleClose(); // Close the modal after successful login
					alert('Logged in successfully!');
				} else {
					setError('Error fetching user profile');
				}
			} else {
				const data = await response.json();
				setError(data.message || 'Login failed');
			}
		} catch (error) {
			console.error('Error:', error);
			setError('An error occurred. Please try again later.');
		}
	};

	const buttonStyle = {
		padding: '0.5rem',
		color: '#ffffff',
		outline: 'none',
		border: 'none',
		borderRadius: '0.5rem',
		fontSize: '1rem',
		fontWeight: 500,
		cursor: 'pointer',
		transition: '0.2s',
		width: 150,
		backgroundColor: '#6c63ff',
	};

	const modalStyle = {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		maxWidth: 600,
	};

	const SubmitButton = styled(Button)(({ theme }) => ({
		color: theme.palette.getContrastText(green[500]),
		backgroundColor: green[400],
		'&:hover': {
			backgroundColor: green[700],
		},
	}));

	const CancelButton = styled(Button)(({ theme }) => ({
		color: theme.palette.getContrastText(red[500]),
		backgroundColor: red[500],
		'&:hover': {
			backgroundColor: red[700],
		},
	}));

	return (
		<div>
			<button
				style={buttonStyle}
				onClick={handleOpen}
			>
				Login
			</button>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={modalStyle}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 25,
							maxWidth: 600,
							padding: 50,
						}}
					>
						<Typography variant='h5'>Login</Typography>
						<Typography variant='h7'>Welcome, please login to continue</Typography>
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-email'>Email</InputLabel>
							<OutlinedInput
								id='outlined-adornment-email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								label='Email'
							/>
						</FormControl>
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
							<OutlinedInput
								id='outlined-adornment-password'
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								endAdornment={
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											onMouseUp={handleMouseUpPassword}
											edge='end'
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label='Password'
							/>
						</FormControl>
						{error && <Typography color='error'>{error}</Typography>}
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Checkbox /> Remember Password
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								gap: 50,
								marginTop: 25,
							}}
						>
							<SubmitButton
								sx={{ color: 'white' }}
								variant='contained'
								onClick={handleLogin}
							>
								Submit
							</SubmitButton>
							<CancelButton
								sx={{ color: 'white' }}
								variant='contained'
								onClick={handleClose}
							>
								Cancel
							</CancelButton>
						</div>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default LoginBtn;
