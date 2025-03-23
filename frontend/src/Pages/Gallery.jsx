import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import ArtCard from '../components/ArtCard';

const Gallery = () => {
	const BASE_URL = 'https://api.artic.edu/api/v1/artworks';
	const [artwork, setArtwork] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const [favorites, setFavorites] = useState([]); // Store the user's favorites from the backend

	// Fetch data from the backend
	const fetchData = async () => {
		setIsLoading(true);
		try {
			// Fetch gallery artwork
			const { data } = await axios.get(`${BASE_URL}?page=${page}`);

			const favoritesResponse = await fetch('http://localhost:3000/favorites', {
				method: 'GET',
				credentials: 'include', // Ensure user session is included
			});

			// If the response for favorites is not successful, handle it gracefully
			if (!favoritesResponse.ok) {
				throw new Error('Failed to fetch favorite artworks');
			}

			const favoritesData = await favoritesResponse.json();
			const favoritesList = favoritesData.map((art) => art.id);

			// Map favorites status onto the fetched artwork
			const dataWithFavorites = data.data.map((art) => {
				const isFavorite = favoritesList.includes(art.id);
				return { ...art, favorite: isFavorite };
			});

			// Set both the artwork and favorites list
			setArtwork(dataWithFavorites);
			setFavorites(favoritesList); // Store the favorites list
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	// Run the fetchData function when the component mounts or the page number changes
	useEffect(() => {
		fetchData();
	}, [page]);

	const handleFavUpdate = async (updatedArtwork) => {
		try {
			console.log('Sending request to server:', {
				artworkId: updatedArtwork.id,
				favorite: updatedArtwork.favorite, // true or false
			});

			const response = await fetch('http://localhost:3000/favorites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					artworkId: updatedArtwork.id,
					favorite: updatedArtwork.favorite, // true or false
				}),
				credentials: 'include', // Ensure user session is included
			});

			if (!response.ok) {
				throw new Error('Failed to update favorite status on the server');
			}

			// After updating the favorite, refetch the artwork to sync the UI
			fetchData();
		} catch (err) {
			console.error('Error updating favorite status:', err);
		}
	};

	const handleReset = () => {
		setPage(1);
		setSearchQuery('');
	};

	return (
		<div
			id='gallery-container'
			style={{ display: 'flex', flexDirection: 'column' }}
		>
			<div
				className='search-bar'
				style={{ display: 'flex', justifyContent: 'center' }}
			>
				<TextField
					id='search-bar'
					value={searchQuery}
					className='text'
					onInput={(e) => {
						setSearchQuery(e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							fetchData();
						}
					}}
					label='Search Keyword'
					variant='outlined'
					placeholder='Search...'
					size='small'
				/>
				<IconButton
					type='submit'
					onClick={fetchData}
					aria-label='search'
				>
					<SearchIcon style={{ fill: 'black' }} />
				</IconButton>
				<Button
					color='black'
					onClick={handleReset}
				>
					Reset
				</Button>
			</div>

			<div className='gallery-artwork'>
				{isLoading && <div>Loading...</div>}
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

			{page > 0 && (
				<div
					id='page-navigation'
					style={{
						marginBottom: 25,
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<Button
						disabled={page === 1}
						color='black'
						onClick={() => setPage(page - 1)}
					>
						Prev
					</Button>
					<Button
						color='black'
						onClick={() => {
							setPage(page + 1);
							window.scrollTo(0, 0);
						}}
					>
						Next
					</Button>
					{error && <div>{error}</div>}
				</div>
			)}
		</div>
	);
};

export default Gallery;
