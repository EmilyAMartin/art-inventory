import React, { useRef } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import Form from '../components/Form';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './Context';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Account = () => {
	const addNewPhoto = useRef(null);
	const { currentUser, setCurrentUser } = useContext(AuthContext);
	const queryClient = useQueryClient();

	// Fetch user data using React Query
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

	// Mutation for image upload
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
			queryClient.setQueryData(['userData'], updatedUser);
			setCurrentUser(updatedUser);
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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error fetching user data</div>;
	}

	const hasCompleteProfile = userData.username && userData.bio;

	return (
		<>
			<div
				className='profile-header'
				style={{
					marginTop: 50,
					gap: 25,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{userData.profile_image ? (
					<Link to={`/users/${currentUser.id}`}>
						<img
							src={userData.profile_image}
							alt='Profile'
							style={{
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

				{userData.username && <h2 style={{ margin: 0 }}>{userData.username}</h2>}
				{userData.bio && (
					<p style={{ margin: 0, color: 'gray', fontStyle: 'italic' }}>
						{userData.bio}
					</p>
				)}
			</div>

			{hasCompleteProfile ? (
				<Form userData={userData} />
			) : (
				<div>
					<h2>Your profile is incomplete</h2>
					<p>Please complete your profile by providing a username and bio.</p>
					<Form userData={userData} />
				</div>
			)}
		</>
	);
};

export default Account;
