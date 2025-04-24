import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const UserProfile = () => {
	const { userId } = useParams();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				// Fetch user data
				const userResponse = await axios.get(
					`http://localhost:3000/users/${userId}`
				);
				console.log('User Response:', userResponse.data); // Debugging log
				setUser(userResponse.data);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserData();
	}, [userId]);

	if (!user) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<Box sx={{ padding: '20px' }}>
			{/* Profile Picture and Bio */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginBottom: '20px',
					marginTop: '50px',
				}}
			>
				<img
					src={`http://localhost:3000${user.profile_image}`}
					alt='Profile'
					style={{
						width: '150px',
						height: '150px',
						borderRadius: '50%',
						objectFit: 'cover',
					}}
				/>
				<Typography
					variant='h4'
					sx={{ marginTop: '10px' }}
				>
					{user.username}
				</Typography>
				<Typography
					variant='body1'
					sx={{ marginTop: '10px', fontStyle: 'italic', color: 'gray' }}
				>
					{user.bio}
				</Typography>
			</Box>
		</Box>
	);
};

export default UserProfile;
