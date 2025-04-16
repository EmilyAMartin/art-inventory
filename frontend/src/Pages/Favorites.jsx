import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import ArtCard from '../components/ArtCard';
import axios from 'axios';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
	const [artwork, setArtwork] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userId, setUserId] = useState(null);
	const navigate = useNavigate();

	const checkImageUrl = async (imageUrl) => {
		try {
			const response = await fetch(imageUrl, { method: 'HEAD' });
			if (response.status === 403) {
				console.log('Image access forbidden (403):', imageUrl);
				return false;
			}
			return response.ok || response.status === 302;
		} catch (error) {
			console.log('Image access error:', error);
			return false;
		}
	};

	const fetchFavorites = async () => {
		setLoading(true);
		try {
			const response = await fetch('http://localhost:3000/favorites', {
				method: 'GET',
				credentials: 'include',
			});

			if (response.status === 401) {
				setIsLoggedIn(false);
				setUserId(null);
				setArtwork([]);
				setLoading(false);
				return;
			}

			if (!response.ok) {
				throw new Error('Failed to fetch favorite artworks');
			}

			setIsLoggedIn(true);
			const data = await response.json();
			setUserId(data.userId || null);

			if (!Array.isArray(data.favorites)) {
				setArtwork([]);
				return;
			}

			const artworkPromises = data.favorites.map(async (fav) => {
				try {
					const { data: artData } = await axios.get(
						`https://api.artic.edu/api/v1/artworks/${fav.id}`
					);

					if (!artData.data.image_id) {
						console.log('Skipping artwork due to no image_id:', fav.id);
						return null;
					}

					const imageUrl = `https://www.artic.edu/iiif/2/${artData.data.image_id}/full/400,/0/default.jpg`;
					const hasValidImage = await checkImageUrl(imageUrl);

					if (!hasValidImage) {
						console.log('Skipping artwork due to invalid image:', fav.id);
						return null;
					}

					return {
						...artData.data,
						favorite: true,
						image_url: imageUrl,
					};
				} catch (err) {
					console.error(`Error fetching artwork ${fav.id}:`, err);
					return null;
				}
			});

			const artworkResults = await Promise.all(artworkPromises);
			const validArtwork = artworkResults.filter((art) => art !== null);
			setArtwork(validArtwork);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFavorites();
	}, []);

	const handleFavUpdate = async (artworkId) => {
		if (!isLoggedIn) {
			alert('You must be logged in to update favorites');
			return;
		}

		try {
			const response = await fetch('http://localhost:3000/favorites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ artworkId, favorite: false }),
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to update favorite status');
			}

			setArtwork((prevArtwork) =>
				prevArtwork.filter((art) => art.id !== artworkId)
			);
		} catch (err) {
			setError(err.message);
		}
	};

	const handleLogin = () => {
		navigate('/login');
	};

	if (loading) {
		return <div>Loading artwork...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (!isLoggedIn) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: '100px',
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
					style={{ marginBottom: '20px' }}
				>
					Please log in to see your favorite artworks
				</Typography>
				<Button
					variant='contained'
					color='primary'
					onClick={handleLogin}
				>
					Log In
				</Button>
			</div>
		);
	}

	if (artwork.length === 0) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: '100px',
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
					style={{ marginBottom: '20px' }}
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
			</div>
		);
	}

	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 25 }}
		>
			<Grid2
				container
				spacing={8}
				style={{ marginTop: 25, justifyContent: 'space-between' }}
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
		</div>
	);
};

export default Favorites;
