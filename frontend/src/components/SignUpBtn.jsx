import React, { useState } from 'react';
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
import axios from 'axios';

const SignUpBtn = () => {
	const [open, setOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isHover, setIsHover] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleMouseUpPassword = (event) => {
		event.preventDefault();
	};
	const handleMouseEnter = () => {
		setIsHover(true);
	};
	const handleMouseLeave = () => {
		setIsHover(false);
	};

	//API Request to Backend//
	const handleSubmit = async () => {
		if (password !== repeatPassword) {
			alert('Passwords do not match!');
			return;
		}
		try {
			const response = await axios.post('http://localhost:3000/register', {
				name: email,
				email: email,
				password: password,
			});

			alert(response.data.message);
			handleClose();
		} catch (error) {
			console.error('Error registering user:', error);
			alert(
				error.response?.data?.message || 'An error occurred during registration.'
			);
		}
	};

	const buttonStyle = {
		padding: '0.5rem',
		hover: '#6c63ff50',
		color: '#ffffff',
		outline: 'none',
		border: 'none',
		borderRadius: '1rem',
		fontSize: '1rem',
		fontWeight: 500,
		cursor: 'pointer',
		transition: '0.2s',
		width: 150,
		backgroundColor: isHover ? '#4640ad' : '#6c63ff',
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
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleOpen}
			>
				Sign Up
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
						<Typography variant='h5'>Sign Up</Typography>
						<Typography variant='h7'>Welcome, please sign up to continue</Typography>
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-email'>Email</InputLabel>
							<OutlinedInput
								id='outlined-adornment-email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								endAdornment={<InputAdornment position='end'></InputAdornment>}
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
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type={showPassword ? 'text' : 'password'}
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
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-repeat-password'>
								Repeat Password
							</InputLabel>
							<OutlinedInput
								id='outlined-adornment-repeat-password'
								value={repeatPassword}
								onChange={(e) => setRepeatPassword(e.target.value)}
								type={showPassword ? 'text' : 'password'}
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
								label='Repeat Password'
							/>
						</FormControl>
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
								onClick={handleSubmit}
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

export default SignUpBtn;
