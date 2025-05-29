import React from 'react';
import Grid2 from '@mui/material/Grid2';
import ArtCard from '../components/ArtCard';
import PublicArtCard from '../components/PublicArtCard';
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

const fetchPublicArtFavorites = async () => {
	const response = await fetch(`${BASE_URL}/public-artworks/favorites`, {
		method: 'GET',
		credentials: 'include',
	});
	if (response.status === 401) {
		return [];
	}
	if (!response.ok) {
		throw new Error('Failed to fetch public artwork favorites');
	}
	const data = await response.json();
	return data.favorites.map((art) => ({
		...art,
		favorite: true,
		image_url:
			art.images && art.images.length > 0
				? `${BASE_URL}/uploads/${art.images[0]}`
				: null,
	}));
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
				type: 'external',
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

	const {
		data: externalData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['favorites'],
		queryFn: fetchFavorites,
		refetchOnWindowFocus: false,
	});

	const { data: publicArtFavorites = [], refetch: refetchPublic } = useQuery({
		queryKey: ['publicArtFavorites'],
		queryFn: fetchPublicArtFavorites,
		refetchOnWindowFocus: false,
	});

	const handleFavUpdate = async (artworkId, type = 'external') => {
		if (!externalData?.isLoggedIn) {
			toast.error('You must be logged in to update favorites');
			return;
		}
		try {
			if (type === 'external') {
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
			} else if (type === 'public') {
				const response = await fetch(
					`${BASE_URL}/public-artworks/${artworkId}/favorite`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ artworkId, favorite: false }),
						credentials: 'include',
					}
				);
				if (!response.ok) throw new Error('Failed to update favorite status');
				toast.success('Artwork removed from favorites');
				refetchPublic();
			}
		} catch {
			toast.error('Failed to update favorite status');
		}
	};

	if (isLoading)
		return <Typography sx={{ ml: 10 }}>Loading artwork...</Typography>;
	if (error) return <Typography>Error: {error.message}</Typography>;

	const { isLoggedIn, artwork: externalArtwork = [] } = externalData || {};

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

	const allFavorites = [
		...(externalArtwork.map((art) => ({ ...art, type: 'external' })) || []),
		...(publicArtFavorites.map((art) => ({ ...art, type: 'public' })) || []),
	];

	if (allFavorites.length === 0) {
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
					sx={{
						p: '0.5rem',
						color: '#fff',
						borderRadius: '1rem',
						fontSize: '1rem',
						fontWeight: 500,
						cursor: 'pointer',
						transition: '0.2s',
						textTransform: 'none',
						width: 150,
						backgroundColor: '#6c63ff',
					}}
				>
					Gallery
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
				mt: 10,
				gap: 2,
			}}
		>
			<Grid2
				container
				spacing={8}
				sx={{ mt: 3, justifyContent: 'space-between' }}
			>
				{allFavorites.map((art) => (
					<Grid2
						xs={12}
						ms={5}
						key={`${art.type}-${art.id}`}
					>
						{art.type === 'external' ? (
							<ArtCard
								art={art}
								handleFavUpdate={() => handleFavUpdate(art.id, 'external')}
								isLoggedIn={isLoggedIn}
							/>
						) : (
							<PublicArtCard
								artwork={art}
								handleFavUpdate={() => handleFavUpdate(art.id, 'public')}
								isLoggedIn={isLoggedIn}
							/>
						)}
					</Grid2>
				))}
			</Grid2>
		</Box>
	);
};

export default Favorites;
