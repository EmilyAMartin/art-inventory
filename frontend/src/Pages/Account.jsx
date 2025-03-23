import React, { useRef, useState, useEffect } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import Form from '../components/Form';
import axios from 'axios';

const Account = () => {
	const addNewPhoto = useRef(null);
	const handleClick = (event) => {
		addNewPhoto.current.click(event);
	};
	const handleChange = (event) => {
		const fileUploaded = event.target.files[0];
		handleFile(fileUploaded);
	};
	const handleFile = () => {};

	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get('http://localhost:3000/profile', {
					withCredentials: true,
				});
				setUserData(response.data.user);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, []);

	if (userData === null) {
		return <div>Loading...</div>;
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
