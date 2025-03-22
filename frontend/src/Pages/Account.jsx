import React, { useRef, useState, useEffect } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import Form from '../components/Form';
import axios from 'axios'; // Assuming you're using axios for API requests

const Account = () => {
	const addNewPhoto = useRef(null);
	const handleClick = (event) => {
		addNewPhoto.current.click(event);
	};
	const handleChange = (event) => {
		const fileUploaded = event.target.files[0];
		handleFile(fileUploaded);
	};
	const handleFile = () => {
		// Handle uploading a new profile picture
	};

	const [userData, setUserData] = useState(null);

	// Fetch user data when the component loads
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get('http://localhost:3000/profile', {
					withCredentials: true, // Ensure cookies (sessions) are sent with the request
				});
				setUserData(response.data.user);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

	// If user data is not yet loaded, show a loading message
	if (userData === null) {
		return <div>Loading...</div>;
	}

	// If the user doesn't have a username or bio, prompt them to fill it out
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
				<BsPersonCircle
					fontSize={150}
					className='button-upload'
					onClick={handleClick}
				/>
				<input
					type='file'
					onChange={handleChange}
					ref={addNewPhoto}
					style={{ display: 'none' }}
				/>
			</div>

			{/* Show the Form component if the profile is incomplete */}
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
