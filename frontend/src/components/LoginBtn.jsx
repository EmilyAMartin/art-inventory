import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import Checkbox from '@mui/material/Checkbox';
import { AuthContext } from '../Pages/Context';
import toast from 'react-hot-toast';
import { BASE_URL } from '../config';

const LoginBtn = () => {
	const [open, setOpen] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { setCurrentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({ email, password }) =>
			fetch(`${BASE_URL}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
				credentials: 'include',
			}).then((res) => {
				if (!res.ok) {
					throw new Error('Invalid email or password');
				}
				return res.json();
			}),
		onSuccess: async () => {
			toast.success('Logged in successfully!');
			// Refetch the profile data after successful login
			await queryClient.invalidateQueries(['profile']);
			handleClose();
		},
		onError: (error) => {
			toast.error('Login failed: ' + error.message);
		},
	});

	const handleLogin = (event) => {
		event.preventDefault();
		if (!password) {
			toast.error('Password is required!');
			return;
		}
		mutation.mutate({ email, password });
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => event.preventDefault();

	return (
		<Box>
			<Button
				onClick={handleOpen}
				sx={{
					p: '0.5rem',
					color: '#ffffff',
					borderRadius: '1rem',
					fontSize: '1rem',
					fontWeight: 500,
					cursor: 'pointer',
					transition: '0.2s',
					width: 150,
					textTransform: 'none',
					bgcolor: '#6c63ff',
					'&:hover': {
						bgcolor: '#6c63ff90',
					},
				}}
			>
				Login
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
						<Typography variant='h5'>Login</Typography>
						<Typography variant='subtitle2'>
							Welcome, please login to continue
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
											edge='end'
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label='Password'
							/>
						</FormControl>

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Checkbox /> <Typography>Remember Password</Typography>
						</Box>

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
								onClick={handleLogin}
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
								disabled={mutation.isLoading}
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

export default LoginBtn;
