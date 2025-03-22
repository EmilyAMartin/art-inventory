import React, { useState, useEffect } from 'react';
import {
	TextField,
	Typography,
	FormControl,
	OutlinedInput,
	InputLabel,
	InputAdornment,
	IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

function Form({ userData }) {
	const [values, setValues] = useState({
		email: '',
		bio: '',
		name: '',
		username: '',
	});
	const [newpassword, setNewPassword] = useState('');
	const [reppassword, setRepPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(true); // Track login status

	// Populate values when userData is available
	useEffect(() => {
		if (userData) {
			setValues({
				username: userData.username || '',
				bio: userData.bio || '',
				email: userData.email || '',
				name: userData.name || '',
			});
		}

		// Check if the user is logged in when the component mounts
		const checkLoginStatus = async () => {
			try {
				const response = await axios.get('http://localhost:3000/profile', {
					withCredentials: true, // Ensure cookies are sent
				});
				if (response.status === 200) {
					setIsLoggedIn(true); // User is logged in
				}
			} catch (error) {
				console.log('User is not logged in:', error);
				setIsLoggedIn(false); // User is not logged in
			}
		};

		checkLoginStatus();
	}, [userData]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log('Submitting form with values:', values); // Log form data

		try {
			const response = await axios.put('http://localhost:3000/profile', values, {
				withCredentials: true, // Send credentials (cookies) with the request
			});
			console.log('Response:', response); // Log response for debugging
			if (response.status === 200) {
				alert('Profile updated successfully');
			} else {
				alert('Failed to update profile');
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			alert(
				'Error updating profile: ' +
					(error.response?.data?.message || 'Something went wrong')
			);
		}
	};

	const handleChange = (event) => {
		setValues((previousValues) => ({
			...previousValues,
			[event.target.name]: event.target.value,
		}));
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => event.preventDefault();

	const buttonStyle = {
		marginTop: '1.5rem',
		padding: '0.6rem',
		hover: '#6c63ff50',
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

	if (!isLoggedIn) {
		return (
			<Typography
				variant='h6'
				style={{ textAlign: 'center' }}
			>
				You must be logged in to update your profile.
			</Typography>
		);
	}

	return (
		<main>
			<Typography
				variant='h6'
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: 10,
				}}
			>
				{values.username || 'Username'}
			</Typography>

			<form
				style={{ display: 'flex', flexDirection: 'column', gap: 25 }}
				onSubmit={handleSubmit}
			>
				<Typography variant='h6'>Profile</Typography>

				{/* Full Name */}
				<TextField
					label='Full Name'
					type='text'
					name='name'
					id='name'
					placeholder='Full Name'
					onChange={handleChange}
					value={values.name}
					fullWidth
					margin='normal'
				/>

				{/* Username */}
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

				{/* Email */}
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

				{/* Bio */}
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
					marginTop='1rem'
					variant='h6'
				>
					Password and Security
				</Typography>

				{/* Current Password */}
				<TextField
					fullWidth
					margin='normal'
					label='Current Password'
					name='current-password'
					type='text'
					value={'**********'} // Masked value for current password
				/>

				{/* New Password */}
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
						onChange={(e) => setNewPassword(e.target.value)}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label={
										showPassword ? 'hide the password' : 'display the password'
									}
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

				{/* Re-Type Password */}
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
						onChange={(e) => setRepPassword(e.target.value)}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label={
										showPassword ? 'hide the password' : 'display the password'
									}
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

				{/* Submit Button */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignContent: 'center',
						paddingBottom: 30,
					}}
				>
					<button
						style={buttonStyle}
						type='submit'
					>
						Submit
					</button>
				</div>
			</form>
		</main>
	);
}

export default Form;
