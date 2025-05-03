import React, { useRef } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import Form from '../components/Form';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './Context';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography } from '@mui/material';

const Account = () => {
	const addNewPhoto = useRef(null);
	const { currentUser, refetchCurrentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	const {
		data: userData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['userData'],
		queryFn: async () => {
			const response = await axios.get('http://localhost:3000/profile', {
				withCredentials: true,
			});
			const user = response.data.user;
			if (user.profile_image) {
				user.profile_image = `http://localhost:3000${user.profile_image}`;
			}
			return user;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(['userData'], data);
		},
	});

	const uploadImageMutation = useMutation({
		mutationFn: async (file) => {
			const formData = new FormData();
			formData.append('image', file);
			const response = await axios.post(
				'http://localhost:3000/profile/image',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					withCredentials: true,
				}
			);
			return response.data.user;
		},
		onSuccess: (updatedUser) => {
			updatedUser.profile_image = `http://localhost:3000${updatedUser.profile_image}`;
			refetchCurrentUser();
		},
		onError: (error) => {
			console.error('Error uploading image:', error);
		},
	});

	const handleClick = (event) => {
		addNewPhoto.current.click(event);
	};

	const handleChange = (event) => {
		const fileUploaded = event.target.files[0];
		if (fileUploaded) {
			uploadImageMutation.mutate(fileUploaded);
		}
	};

	if (isLoading) return <Box>Loading...</Box>;
	if (isError) return <Box>Error fetching user data</Box>;

	const hasCompleteProfile = userData.username && userData.bio;

	return (
		<>
			<Box
				className='profile-header'
				sx={{
					mt: 6,
					gap: 3,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{userData.profile_image ? (
					<Link to={`/users/${currentUser.id}`}>
						<Box
							component='img'
							src={userData.profile_image}
							alt='Profile'
							sx={{
								width: 150,
								height: 150,
								borderRadius: '50%',
								objectFit: 'cover',
								cursor: 'pointer',
							}}
						/>
					</Link>
				) : (
					<BsPersonCircle
						fontSize={150}
						className='button-upload'
						onClick={handleClick}
					/>
				)}
				<input
					type='file'
					onChange={handleChange}
					ref={addNewPhoto}
					style={{ display: 'none' }}
					accept='image/*'
				/>
				{userData.username && (
					<Typography
						variant='h5'
						sx={{ m: 0 }}
					>
						{userData.username}
					</Typography>
				)}
				{userData.bio && (
					<Typography
						variant='body1'
						sx={{ m: 0, color: 'gray', fontStyle: 'italic' }}
					>
						{userData.bio}
					</Typography>
				)}
			</Box>

			{hasCompleteProfile ? (
				<Form userData={userData} />
			) : (
				<Box sx={{ mt: 4 }}>
					<Typography variant='h6'>Your profile is incomplete</Typography>
					<Typography
						variant='body2'
						sx={{ mb: 2 }}
					>
						Please complete your profile by providing a username and bio.
					</Typography>
					<Form userData={userData} />
				</Box>
			)}
		</>
	);
};

export default Account;
