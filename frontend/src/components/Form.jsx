import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';

function Form() {
	const [values, setValues] = useState({
		email: '',
		bio: '',
		name: '',
		username: '',
	});
	const [newpassword, setNewPassword] = useState('');
	const [reppassword, setRepPassword] = useState('');
	const [isHover, setIsHover] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleMouseEnter = () => {
		setIsHover(true);
	};
	const handleMouseLeave = () => {
		setIsHover(false);
	};
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleMouseUpPassword = (event) => {
		event.preventDefault();
	};

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
		backgroundColor: isHover ? '#4640ad' : '#6c63ff',
	};

	function handleSubmit(event) {
		event.preventDefault();
		alert('Form was submitted');
	}

	function handleChange(event) {
		setValues((previousValues) => ({
			...previousValues,
			[event.target.name]: event.target.value,
		}));
	}

	return (
		<main>
			<Typography
				onChange={handleChange}
				value={values.username}
				variant='h6'
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginTop: 10,
				}}
			>
				{''}
				{values.username || 'Username'}
			</Typography>
			<form
				style={{ display: 'flex', flexDirection: 'column', gap: 25 }}
				onSubmit={handleSubmit}
			>
				<Typography variant='h6'>Profile</Typography>
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
					marginTop='1rem'
					variant='h6'
				>
					Password and Security
				</Typography>
				<TextField
					fullWidth
					margin='normal'
					label='Current Password'
					name='current-password'
					type='text'
					value={'**********'}
				/>
				<FormControl
					fullWidth
					margin='normal'
					variant='outlined'
				>
					<InputLabel htmlFor='outlined-adornment-password'>
						{' '}
						New Password
					</InputLabel>
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
									onMouseUp={handleMouseUpPassword}
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
						{' '}
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
									onMouseUp={handleMouseUpPassword}
									edge='end'
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>
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
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						Submit
					</button>
				</div>
			</form>
		</main>
	);
}

export default Form;
