import React, { useRef, useState } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import Form from '../components/Form';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from './Context';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const Account = () => {
	const addNewPhoto = useRef(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const { currentUser, setCurrentUser } = useContext(AuthContext);

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
			setSelectedImage(data.profile_image);
		},
	});

	// Handle image upload manually
	const handleImageUpload = async (file) => {
		try {
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

			const updatedUser = response.data.user;
			updatedUser.profile_image = `http://localhost:3000${updatedUser.profile_image}`;
			setSelectedImage(updatedUser.profile_image);
			setCurrentUser(updatedUser);
		} catch (error) {
			console.error('Error uploading image:', error);
		}
	};

	const handleClick = (event) => {
		addNewPhoto.current.click(event);
	};

	const handleChange = (event) => {
		const fileUploaded = event.target.files[0];
		if (fileUploaded) {
			handleImageUpload(fileUploaded);
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
				{selectedImage ? (
					<Link to={`/users/${currentUser.id}`}>
						<img
							src={selectedImage}
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
