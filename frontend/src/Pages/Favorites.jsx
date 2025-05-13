import React from 'react';
import Grid2 from '@mui/material/Grid2';
import ArtCard from '../components/ArtCard';
import axios from 'axios';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../config';

const checkImageUrl = async (imageUrl) => {
	try {
		const response = await fetch(imageUrl, { method: 'HEAD' });
		if (response.status === 403) return false;
		return response.ok || response.status === 302;
	} catch {
		return false;
	}
};

const fetchFavorites = async () => {
	const response = await fetch(`${BASE_URL}/favorites`, {
		method: 'GET',
		credentials: 'include',
	});
	if (response.status === 401) {
		return { isLoggedIn: false, artwork: [], userId: null };
	}
	if (!response.ok) {
		throw new Error('Failed to fetch favorite artworks');
	}
	const data = await response.json();
	const userId = data.userId || null;

	const artworkPromises = data.favorites.map(async (fav) => {
		try {
			const { data: artData } = await axios.get(
				`https://api.artic.edu/api/v1/artworks/${fav.id}`
			);
			if (!artData.data.image_id) return null;

			const imageUrl = `https://www.artic.edu/iiif/2/${artData.data.image_id}/full/400,/0/default.jpg`;
			const hasValidImage = await checkImageUrl(imageUrl);
			if (!hasValidImage) return null;

			return {
				...artData.data,
				favorite: true,
				image_url: imageUrl,
			};
		} catch {
			return null;
		}
	});

	const artworkResults = await Promise.all(artworkPromises);
	const validArtwork = artworkResults.filter((art) => art !== null);

	return {
		isLoggedIn: true,
		userId,
		artwork: validArtwork,
	};
};

const Favorites = () => {
	const navigate = useNavigate();

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['favorites'],
		queryFn: fetchFavorites,
		refetchOnWindowFocus: false,
	});

	const handleFavUpdate = async (artworkId) => {
		if (!data?.isLoggedIn) {
			toast.error('You must be logged in to update favorites');
			return;
		}
		try {
			const response = await fetch(`${BASE_URL}/favorites`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ artworkId, favorite: false }),
				credentials: 'include',
			});
			if (!response.ok) throw new Error('Failed to update favorite status');
			toast.success('Artwork removed from favorites');
			refetch();
		} catch {
			toast.error('Failed to update favorite status');
		}
	};

	if (isLoading)
		return <Typography sx={{ ml: 10 }}>Loading artwork...</Typography>;
	if (error) return <Typography>Error: {error.message}</Typography>;

	const { isLoggedIn, artwork } = data;

	if (!isLoggedIn) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					mt: '100px',
					textAlign: 'center',
				}}
			>
				<Typography
					variant='h5'
					gutterBottom
				>
					You need to be logged in to view your favorites
				</Typography>
				<Typography
					variant='body1'
					gutterBottom
					sx={{ mb: 2 }}
				>
					Please log in to see your favorite artworks
				</Typography>
				<Button
					variant='contained'
					color='primary'
					onClick={() => navigate('/login')}
				>
					Log In
				</Button>
			</Box>
		);
	}

	if (artwork.length === 0) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					mt: '100px',
					textAlign: 'center',
				}}
			>
				<Typography
					variant='h5'
					gutterBottom
				>
					No Favorites Added
				</Typography>
				<Typography
					variant='body1'
					gutterBottom
					sx={{ mb: 2 }}
				>
					Browse the gallery and add some artworks to your favorites
				</Typography>
				<Button
					variant='contained'
					color='primary'
					onClick={() => navigate('/gallery')}
				>
					Go to Gallery
				</Button>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 2,
				margin: 10,
			}}
		>
			<Grid2
				container
				spacing={8}
				sx={{ mt: 3, justifyContent: 'space-between' }}
			>
				{artwork.map((art) => (
					<Grid2
						xs={12}
						ms={5}
						key={art.id}
					>
						<ArtCard
							art={art}
							handleFavUpdate={handleFavUpdate}
							isLoggedIn={isLoggedIn}
						/>
					</Grid2>
				))}
			</Grid2>
		</Box>
	);
};

export default Favorites;
