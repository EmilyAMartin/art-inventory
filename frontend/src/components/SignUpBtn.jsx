import React, { useState } from 'react';
import { green, red } from '@mui/material/colors';
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
import toast from 'react-hot-toast';

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
	const handleMouseDownPassword = (event) => event.preventDefault();
	const handleMouseUpPassword = (event) => event.preventDefault();

	const handleSubmit = async () => {
		if (!password) {
			toast.error('Password is required!');
			return;
		}
		if (password !== repeatPassword) {
			toast.error('Passwords do not match!');
			return;
		}

		try {
			const response = await axios.post('http://localhost:3000/register', {
				name: email,
				email: email,
				password: password,
			});

			toast.success(response.data.message);
			handleClose();
		} catch (error) {
			console.error('Error registering user:', error);
			toast.error(
				error.response?.data?.message || 'An error occurred during registration.'
			);
		}
	};

	return (
		<Box>
			<Button
				onClick={handleOpen}
				sx={{
					p: '0.5rem',
					color: '#fff',
					borderRadius: '1rem',
					fontSize: '1rem',
					fontWeight: 500,
					cursor: 'pointer',
					transition: '0.2s',
					textTransform: 'none',
					width: 150,
					backgroundColor: isHover ? '#4640ad' : '#6c63ff',
					'&:hover': {
						backgroundColor: '#6c63ff50',
					},
				}}
				onMouseEnter={() => setIsHover(true)}
				onMouseLeave={() => setIsHover(false)}
			>
				Sign Up
			</Button>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						bgcolor: 'background.paper',
						maxWidth: 600,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 3,
							maxWidth: 600,
							p: 6,
						}}
					>
						<Typography variant='h5'>Sign Up</Typography>
						<Typography variant='subtitle1'>
							Welcome, please sign up to continue
						</Typography>

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

						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-repeat-password'>
								Repeat Password
							</InputLabel>
							<OutlinedInput
								id='outlined-adornment-repeat-password'
								type={showPassword ? 'text' : 'password'}
								value={repeatPassword}
								onChange={(e) => setRepeatPassword(e.target.value)}
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

						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								gap: 6,
								mt: 3,
							}}
						>
							<Button
								variant='contained'
								onClick={handleSubmit}
								sx={{
									fontSize: '1rem',
									textTransform: 'none',
									color: '#fff',
									borderRadius: '1rem',
									bgcolor: green[400],
									'&:hover': {
										bgcolor: green[700],
									},
								}}
							>
								Submit
							</Button>
							<Button
								variant='contained'
								onClick={handleClose}
								sx={{
									fontSize: '1rem',
									textTransform: 'none',
									color: '#fff',
									borderRadius: '1rem',
									bgcolor: red[500],
									'&:hover': {
										bgcolor: red[700],
									},
								}}
							>
								Cancel
							</Button>
						</Box>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};

export default SignUpBtn;
