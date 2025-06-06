import React, { useState, useEffect } from 'react';
import {
	TextField,
	Typography,
	FormControl,
	OutlinedInput,
	InputLabel,
	InputAdornment,
	IconButton,
	Box,
	Button,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BASE_URL } from '../config';

const checkLoginStatus = async () => {
	const response = await axios.get(`${BASE_URL}/profile`, {
		withCredentials: true,
	});
	return response.status === 200;
};

const fetchProfile = async () => {
	const response = await axios.get(`${BASE_URL}/profile`, {
		withCredentials: true,
	});
	return response.data.user;
};

const updateProfile = async (values) => {
	const response = await axios.put(`${BASE_URL}/profile`, values, {
		withCredentials: true,
	});
	return response.data;
};

function Form() {
	const [values, setValues] = useState({
		email: '',
		bio: '',
		username: '',
	});
	const [currentPassword, setCurrentPassword] = useState('');
	const [newpassword, setNewPassword] = useState('');
	const [reppassword, setRepPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const queryClient = useQueryClient();

	const { data: isLoggedIn, isLoading: isLoginLoading } = useQuery({
		queryKey: ['checkLogin'],
		queryFn: checkLoginStatus,
		retry: false,
	});

	const { data: userProfile, isLoading: isProfileLoading } = useQuery({
		queryKey: ['profile'],
		queryFn: fetchProfile,
		enabled: isLoggedIn,
	});

	useEffect(() => {
		if (userProfile) {
			setValues({
				email: userProfile.email || '',
				bio: userProfile.bio || '',
				username: userProfile.username || '',
			});
		}
	}, [userProfile]);

	const mutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: () => {
			toast.success('Profile updated successfully!');
			queryClient.invalidateQueries(['profile']);
			setCurrentPassword('');
			setNewPassword('');
			setRepPassword('');
		},
		onError: (error) => {
			toast.error(
				`Error updating profile: ${
					error.response?.data?.message || 'Something went wrong'
				}`
			);
		},
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (
			(currentPassword || newpassword || reppassword) &&
			(!currentPassword || !newpassword || !reppassword)
		) {
			toast.error('To change your password, fill all password fields.');
			return;
		}
		if (newpassword && newpassword !== reppassword) {
			toast.error('New password and re-typed password do not match!');
			return;
		}
		const payload = { ...values };
		if (currentPassword && newpassword) {
			payload.currentPassword = currentPassword;
			payload.newPassword = newpassword;
		}
		mutation.mutate(payload);
	};

	const handleChange = (event) => {
		setValues((previousValues) => ({
			...previousValues,
			[event.target.name]: event.target.value,
		}));
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => event.preventDefault();

	if (isLoginLoading || isProfileLoading) {
		return <Typography>Loading...</Typography>;
	}

	if (!isLoggedIn) {
		return (
			<Typography
				variant='h6'
				sx={{ textAlign: 'center' }}
			>
				You must be logged in to update your profile.
			</Typography>
		);
	}

	return (
		<Box sx={{ mt: 10 }}>
			<Box
				component='form'
				onSubmit={handleSubmit}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 3,
				}}
			>
				<Typography variant='h6'>Profile</Typography>

				<TextField
					label='Username'
					type='text'
					name='username'
					id='username'
					placeholder='Username'
					onChange={handleChange}
					value={values.username}
					fullWidth
					margin='normal'
				/>

				<TextField
					label='Email'
					type='email'
					name='email'
					id='email'
					placeholder='Email'
					onChange={handleChange}
					value={values.email}
					fullWidth
					margin='normal'
				/>

				<TextField
					label='Bio'
					type='text'
					name='bio'
					id='bio'
					placeholder='Bio'
					value={values.bio}
					onChange={handleChange}
					fullWidth
					multiline
					rows={4}
					margin='normal'
				/>

				<Typography
					variant='h6'
					sx={{ mt: 2 }}
				>
					Password and Security
				</Typography>

				<TextField
					fullWidth
					margin='normal'
					label='Current Password'
					name='currentPassword'
					type={showPassword ? 'text' : 'password'}
					placeholder='Current Password'
					value={currentPassword}
					onChange={(e) => setCurrentPassword(e.target.value)}
				/>

				<FormControl
					fullWidth
					margin='normal'
					variant='outlined'
				>
					<InputLabel htmlFor='outlined-adornment-password'>New Password</InputLabel>
					<OutlinedInput
						id='outlined-adornment-password'
						label='New Password'
						name='new-password'
						placeholder='New Password'
						type={showPassword ? 'text' : 'password'}
						value={newpassword}
						onChange={(e) => setNewPassword(e.target.value)}
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
					/>
				</FormControl>

				<FormControl
					fullWidth
					margin='normal'
					variant='outlined'
				>
					<InputLabel htmlFor='outlined-adornment-reppassword'>
						Re-Type Password
					</InputLabel>
					<OutlinedInput
						id='outlined-adornment-reppassword'
						label='Re-Type Password'
						name='reppassword'
						placeholder='Re-Type Password'
						type={showPassword ? 'text' : 'password'}
						value={reppassword}
						onChange={(e) => setRepPassword(e.target.value)}
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
					/>
				</FormControl>

				<Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
					<Button
						type='submit'
						disabled={mutation.isLoading}
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
						{mutation.isLoading ? 'Updating...' : 'Submit'}
					</Button>
				</Box>
			</Box>
		</Box>
	);
}

export default Form;
