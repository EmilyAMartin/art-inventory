import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import PublicArtCarousel from './PublicArtCarousel';
import { BASE_URL } from '../config';
import toast from 'react-hot-toast';

const fetchUserArtworks = async (userId) => {
	try {
		const response = await axios.get(
			`${BASE_URL}/users/${userId}/public-artworks`,
			{
				withCredentials: true,
			}
		);
		return response.data;
	} catch (err) {
		if (err.response && err.response.status === 401) {
			return [];
		}
		throw err;
	}
};

const fetchUserData = async (userId) => {
	try {
		const userResponse = await axios.get(`${BASE_URL}/users/${userId}`, {
			withCredentials: true,
		});
		const user = userResponse.data;
		if (user.profile_image) {
			user.profile_image = `${BASE_URL}${user.profile_image}`;
		}
		user.isLoggedIn = true;
		return user;
	} catch (err) {
		if (err.response && err.response.status === 401) {
			return { isLoggedIn: false };
		}
		throw err;
	}
};

const UserProfile = () => {
	const { userId } = useParams();
	const queryClient = useQueryClient();

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

	const isLoggedIn = user?.isLoggedIn;

	const favMutation = useMutation({
		mutationFn: async ({ artworkId, favorite }) => {
			const response = await fetch(
				`${BASE_URL}/public-artworks/${artworkId}/favorite`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ artworkId, favorite }),
					credentials: 'include',
				}
			);
			if (!response.ok) throw new Error('Failed to update favorite');
			return { artworkId, favorite };
		},
		onMutate: async ({ artworkId, favorite }) => {
			await queryClient.cancelQueries(['artworks', userId]);
			const previousArtworks = queryClient.getQueryData(['artworks', userId]);
			queryClient.setQueryData(['artworks', userId], (old) =>
				old
					? old.map((art) => (art.id === artworkId ? { ...art, favorite } : art))
					: old
			);
			return { previousArtworks };
		},
		onError: (err, variables, context) => {
			toast.error('Failed to update favorite');
			if (context?.previousArtworks) {
				queryClient.setQueryData(['artworks', userId], context.previousArtworks);
			}
		},
		onSuccess: ({ favorite }) => {
			toast.success(favorite ? 'Added to favorites' : 'Removed from favorites');
		},
		onSettled: () => {
			queryClient.invalidateQueries(['artworks', userId]);
		},
	});

	const handleFavUpdate = (artworkId, favorite) => {
		if (!isLoggedIn) {
			toast.error('You must be logged in to favorite artwork');
			return;
		}
		favMutation.mutate({ artworkId, favorite });
	};

	if (isUserLoading) return <Typography>Loading user...</Typography>;
	if (userError) return <Typography>Error loading user.</Typography>;
	if (!user) return <Typography>User not found.</Typography>;

	if (isArtworksLoading) return <Typography>Loading artworks...</Typography>;
	if (artworksError) return <Typography>Error loading artworks.</Typography>;

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

				{user.username && (
					<Typography
						variant='h5'
						sx={{ m: 0 }}
					>
						{user.username}
					</Typography>
				)}

				{user.bio && (
					<Typography
						variant='body1'
						sx={{ m: 0, color: 'gray', fontStyle: 'italic' }}
					>
						{user.bio}
					</Typography>
				)}
			</Box>
			{/* Public Artworks Carousel */}
			<Box sx={{ ml: 2, mt: 10 }}>
				<Typography variant='h5'>Artwork</Typography>
				<PublicArtCarousel
					artworks={artworks}
					handleFavUpdate={handleFavUpdate}
					isLoggedIn={isLoggedIn}
				/>
			</Box>
		</Box>
	);
};

export default UserProfile;
