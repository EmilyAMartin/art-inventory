import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import AddArtworkBtn from '../components/AddArtworkBtn';
import ArtCard from '../components/ArtCard';

const Favorites = () => {
	const [artwork, setArtwork] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const storedFavorites = localStorage.getItem('favoritesList');
		if (storedFavorites) {
			console.log('Loaded from localStorage:', storedFavorites);
			setArtwork(JSON.parse(storedFavorites));
			setLoading(false);
		} else {
			const fetchData = async () => {
				setLoading(true);
				try {
					const response = await fetch('http://localhost:3000/artworks');
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					const data = await response.json();
					console.log('Fetched data from API:', data);
					setArtwork(data);
				} catch (err) {
					setError(err);
				} finally {
					setLoading(false);
				}
			};

			fetchData();
		}
	}, []);

	const handleFavUpdate = (updatedArtwork) => {
		setArtwork((prevArtwork) => {
			const updatedArtworkList = prevArtwork
				.filter((art) => art.id !== updatedArtwork.id || updatedArtwork.favorite)
				.map((art) =>
					art.id === updatedArtwork.id
						? { ...art, favorite: updatedArtwork.favorite }
						: art
				);
			localStorage.setItem('favoritesList', JSON.stringify(updatedArtworkList));

			return updatedArtworkList;
		});
	};

	console.log('Loading state:', loading);
	if (loading) {
		return <div>Loading artwork...</div>;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}
	if (!artwork || artwork.length === 0) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 15,
					marginTop: 25,
				}}
			>
				<AddArtworkBtn />
				<div>No Favorites Added</div>
			</div>
		);
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 15,
				marginTop: 25,
			}}
		>
			<Grid2
				style={{
					marginTop: 25,
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
				container
				spacing={8}
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
						/>
					</Grid2>
				))}
			</Grid2>
		</div>
	);
};

export default Favorites;
