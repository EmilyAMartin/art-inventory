import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import PublicArtCarousel from './PublicArtCarousel'; // Import the new carousel component

const UserProfile = () => {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [artworks, setArtworks] = useState([]); // State for artworks

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				// Fetch user data
				const userResponse = await axios.get(
					`http://localhost:3000/users/${userId}`
				);
				setUser(userResponse.data);

				// Fetch user's public artworks
				const artworksResponse = await axios.get(
					`http://localhost:3000/users/${userId}/public-artworks`
				);
				setArtworks(artworksResponse.data);
			} catch (error) {
				console.error('Error fetching data:', error);
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

			{/* Public Artworks Carousel */}
			<div style={{}}>
				<h2>Artwork</h2>
			</div>
			<PublicArtCarousel artworks={artworks} />
		</Box>
	);
};

export default UserProfile;
