import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import PublicArtCarousel from './PublicArtCarousel';

const fetchUserData = async (userId) => {
	const userResponse = await axios.get(`http://localhost:3000/users/${userId}`);
	return userResponse.data;
};

const fetchUserArtworks = async (userId) => {
	const artworksResponse = await axios.get(
		`http://localhost:3000/users/${userId}/public-artworks`
	);
	return artworksResponse.data;
};

const UserProfile = () => {
	const { userId } = useParams();
	const {
		data: user,
		isLoading: isUserLoading,
		error: userError,
	} = useQuery({
		queryKey: ['user', userId],
		queryFn: () => fetchUserData(userId),
	});
	const {
		data: artworks,
		isLoading: isArtworksLoading,
		error: artworksError,
	} = useQuery({
		queryKey: ['artworks', userId],
		queryFn: () => fetchUserArtworks(userId),
		enabled: !!user,
	});

	if (isUserLoading || isArtworksLoading) {
		return <Typography>Loading...</Typography>;
	}

	if (userError || artworksError) {
		return <Typography>Error fetching data</Typography>;
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
			<div style={{ marginLeft: '1rem' }}>
				<h2>Artwork</h2>
			</div>
			<PublicArtCarousel artworks={artworks} />
		</Box>
	);
};

export default UserProfile;
