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
	const [favorites, setFavorites] = useState([]);
	const [userId, setUserId] = useState(null);

	// Fetch data from the API
	const fetchData = async () => {
		setIsLoading(true);
		try {
			const { data } = await axios.get(`${BASE_URL}?page=${page}`);

			const favoritesResponse = await fetch('http://localhost:3000/favorites', {
				method: 'GET',
				credentials: 'include',
			});

			if (!favoritesResponse.ok) {
				throw new Error('Failed to fetch favorite artworks');
			}

			const favoritesData = await favoritesResponse.json();
			const favoritesList = Array.isArray(favoritesData.favorites)
				? favoritesData.favorites.map((art) => art.artwork_id)
				: [];
			const userId = favoritesData.userId || null;

			const dataWithFavorites = Array.isArray(data.data)
				? data.data.map((art) => {
						const isFavorite = favoritesList.includes(art.id);
						return { ...art, favorite: isFavorite };
				  })
				: [];

			setArtwork(dataWithFavorites);
			setFavorites(favoritesList);
			setUserId(userId);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [page]);

	const handleFavUpdate = (artworkId, isFavorite) => {
		console.log('userId:', userId);

		if (!userId) {
			alert('You must be logged in to favorite artwork');
			return;
		}

		const body = {
			artworkId, // Pass the API artwork ID here
			favorite: isFavorite,
			userId,
		};

		fetch('http://localhost:3000/favorites', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Favorite added:', data);
			})
			.catch((error) => {
				console.error('Error updating favorites:', error);
			});
	};

	// Function to reset search query and page
	const handleReset = () => {
		setSearchQuery('');
		setPage(1); // Reset to the first page
		fetchData(); // Reload the data with the reset query
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
					onClick={handleReset} // Call the handleReset function here
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
								key={art.id}
								art={art}
								handleFavUpdate={handleFavUpdate}
								userId={userId} // Make sure userId is passed down here
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
