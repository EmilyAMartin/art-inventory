import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import ArtCard from '../components/ArtCard';

const Favorites = () => {
	const [artwork, setArtwork] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchFavorites = async () => {
			setLoading(true);
			try {
				const response = await fetch('http://localhost:3000/favorites', {
					method: 'GET',
					credentials: 'include',
				});

				if (!response.ok) {
					throw new Error('Failed to fetch favorite artworks');
				}

				const data = await response.json();
				setArtwork(data); // Store the fetched favorite artworks
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchFavorites();
	}, []);

	const handleFavUpdate = async (artworkId, currentFavoriteStatus) => {
		const newFavoriteStatus = !currentFavoriteStatus;
		try {
			const response = await fetch('http://localhost:3000/favorites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ artworkId, favorite: newFavoriteStatus }),
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to update favorite status');
			}

			// Fetch updated list from the server
			const updatedResponse = await fetch('http://localhost:3000/favorites', {
				method: 'GET',
				credentials: 'include',
			});

			const updatedData = await updatedResponse.json();
			setArtwork(updatedData);
		} catch (err) {
			setError(err);
		}
	};

	if (loading) {
		return <div>Loading artwork...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
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
							favoriteStatus={art.favorite}
						/>
					</Grid2>
				))}
			</Grid2>
		</div>
	);
};

export default Favorites;
