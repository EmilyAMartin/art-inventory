import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import PublicArtCarousel from './PublicArtCarousel';
import { BASE_URL } from '../config';

const fetchUserData = async (userId) => {
	const userResponse = await axios.get(`${BASE_URL}api/users/${userId}`);
	const user = userResponse.data;
	if (user.profile_image) {
		user.profile_image = `${BASE_URL}${user.profile_image}`;
	}
	return user;
};

const fetchUserArtworks = async (userId) => {
	const artworksResponse = await axios.get(
		`${BASE_URL}api/users/${userId}/public-artworks`
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

	if (
		!user ||
		typeof user !== 'object' ||
		Array.isArray(user) ||
		!user.username
	) {
		return <Typography>User not found.</Typography>;
	}

	return (
		<Box>
			{/*Profile Header */}
			<Box
				sx={{
					mt: 6,
					gap: 3,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{user.profile_image && (
					<Box
						component='img'
						src={user.profile_image}
						alt='Profile'
						sx={{
							width: 150,
							height: 150,
							borderRadius: '50%',
							objectFit: 'cover',
						}}
					/>
				)}

				{user.username && (
					<Typography
						variant='h5'
						sx={{ m: 0, textAlign: 'center' }}
					>
						{user.username}
					</Typography>
				)}

				{user.bio && (
					<Typography
						variant='body1'
						sx={{ m: 0, color: 'gray', fontStyle: 'italic', textAlign: 'center' }}
					>
						{user.bio}
					</Typography>
				)}
			</Box>
			{/* Public Artworks Carousel */}
			<Box sx={{ ml: 2, mt: 10, mb: 20 }}>
				<PublicArtCarousel artworks={artworks} />
			</Box>
		</Box>
	);
};

export default UserProfile;
