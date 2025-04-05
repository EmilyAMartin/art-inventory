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
	const [userId, setUserId] = useState(null);
	const [totalResults, setTotalResults] = useState(0);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const RESULTS_PER_PAGE = 12;

	const fetchDataById = async (id) => {
		const response = await axios.get(`${BASE_URL}/${id}`);
		return response.data.data;
	};

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
		try {
			const response = await fetch('http://localhost:3000/favorites', {
				method: 'GET',
				credentials: 'include',
			});

			if (response.status === 401) {
				// User is not logged in
				setIsLoggedIn(false);
				setUserId(null);
				return [];
			}

			if (!response.ok) {
				throw new Error('Failed to fetch favorite artworks');
			}

			setIsLoggedIn(true);
			const data = await response.json();
			setUserId(data.userId || null);

			if (!Array.isArray(data.favorites)) {
				return [];
			}

			return data.favorites.map((fav) => fav.id);
		} catch (err) {
			console.error('Error fetching favorites:', err);
			setIsLoggedIn(false);
			setUserId(null);
			return [];
		}
	};

	const fetchData = async () => {
		setIsLoading(true);
		try {
			let data;
			let currentPage = page;
			let validArtwork = [];
			const MAX_ATTEMPTS = 3; // Maximum number of additional pages to fetch
			let attempts = 0;

			// Fetch favorites list (will be empty if user is not logged in)
			const favoritesList = await fetchFavorites();

			while (validArtwork.length < RESULTS_PER_PAGE && attempts < MAX_ATTEMPTS) {
				if (searchQuery) {
					// First search for artworks matching the query
					const searchResponse = await axios.get(
						`${BASE_URL}/search?q=${searchQuery}&page=${currentPage}`
					);
					setTotalResults(searchResponse.data.pagination.total);
					// Then fetch full details for each artwork
					const searchResults = await Promise.all(
						searchResponse.data.data.map(async (art) => {
							return await fetchDataById(art.id);
						})
					);
					data = { data: searchResults };
				} else {
					// Regular page loading
					const response = await axios.get(`${BASE_URL}?page=${currentPage}`);
					setTotalResults(response.data.pagination.total);
					data = response.data;
				}

				// Filter and process artwork data
				const newValidArtwork = await Promise.all(
					data.data.map(async (art) => {
						// Check if the artwork has an image URL
						if (!art.image_id) {
							console.log('Skipping artwork due to no image_id:', art.id);
							return null;
						}

						// Use the IIIF API with the correct format
						const imageUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`;
						const hasValidImage = await checkImageUrl(imageUrl);

						if (!hasValidImage) {
							console.log('Skipping artwork due to invalid image:', art.id);
							return null;
						}

						return {
							...art,
							image_url: imageUrl,
							favorite: favoritesList.includes(art.id),
						};
					})
				);

				// Filter out null values and add to valid artwork
				validArtwork = [
					...validArtwork,
					...newValidArtwork.filter((art) => art !== null),
				];
				currentPage++;
				attempts++;
			}

			// Take only the first RESULTS_PER_PAGE items
			validArtwork = validArtwork.slice(0, RESULTS_PER_PAGE);

			setArtwork(validArtwork);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [page]);

	const handleFavUpdate = async (artworkId, isFavorite) => {
		if (!isLoggedIn) {
			alert('You must be logged in to favorite artwork');
			return;
		}

		try {
			const response = await fetch('http://localhost:3000/favorites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ artworkId, favorite: isFavorite }),
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to update favorite status');
			}

			// Update the artwork state to reflect the new favorite status
			setArtwork((prevArtwork) =>
				prevArtwork.map((art) =>
					art.id === artworkId ? { ...art, favorite: isFavorite } : art
				)
			);
		} catch (error) {
			console.error('Error updating favorites:', error);
			alert('Failed to update favorite status');
		}
	};

	const handleReset = () => {
		setSearchQuery('');
		setPage(1);
		fetchData();
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
						marginBottom: 25,
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
								userId={userId}
								isLoggedIn={isLoggedIn}
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
						disabled={page * RESULTS_PER_PAGE >= totalResults}
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
