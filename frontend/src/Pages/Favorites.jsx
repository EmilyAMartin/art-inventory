import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import ArtCard from '../components/ArtCard';
import axios from 'axios';

const Favorites = () => {
	const [artwork, setArtwork] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchFavorites = async () => {
		setLoading(true);
		try {
			// First get the list of favorite IDs
			const response = await fetch('http://localhost:3000/favorites', {
				method: 'GET',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to fetch favorite artworks');
			}

			const data = await response.json();
			if (!Array.isArray(data.favorites)) {
				setArtwork([]);
				return;
			}

			// Then fetch the artwork details for each favorite
			const artworkPromises = data.favorites.map(async (fav) => {
				try {
					const { data: artData } = await axios.get(
						`https://api.artic.edu/api/v1/artworks/${fav.id}`
					);
					return { ...artData.data, favorite: true };
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

	const handleFavUpdate = async (artworkId, currentFavoriteStatus) => {
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

			// Remove the artwork from the local state immediately
			setArtwork((prevArtwork) =>
				prevArtwork.filter((art) => art.id !== artworkId)
			);
		} catch (err) {
			setError(err.message);
		}
	};

	if (loading) {
		return <div>Loading artwork...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (artwork.length === 0) {
		return <div>No Favorites Added</div>;
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
							favoriteStatus={true}
						/>
					</Grid2>
				))}
			</Grid2>
		</div>
	);
};

export default Favorites;
