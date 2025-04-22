import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Grid } from '@mui/material';

const UserProfile = () => {
	const { userId } = useParams(); // Get the user ID from the URL
	const [user, setUser] = useState(null);
	const [artworks, setArtworks] = useState([]);

	useEffect(() => {
		// Fetch user data
		const fetchUserData = async () => {
			try {
				const userResponse = await axios.get(
					`http://localhost:3000/users/${userId}`
				);
				setUser(userResponse.data);

				// Fetch user's public artwork
				const artworkResponse = await axios.get(
					`http://localhost:3000/users/${userId}/artworks`
				);
				setArtworks(artworkResponse.data);
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
				}}
			>
				<img
					src={user.profile_image}
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

			{/* Public Artwork */}
			<Typography
				variant='h5'
				sx={{ marginBottom: '20px' }}
			>
				Public Artwork
			</Typography>
			<Grid
				container
				spacing={2}
			>
				{artworks.map((artwork) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						key={artwork.id}
					>
						<img
							src={`http://localhost:3000/uploads/${artwork.image}`}
							alt={artwork.title}
							style={{
								width: '100%',
								height: '200px',
								objectFit: 'cover',
								borderRadius: '10px',
							}}
						/>
						<Typography
							variant='body1'
							sx={{ marginTop: '10px' }}
						>
							{artwork.title}
						</Typography>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default UserProfile;
