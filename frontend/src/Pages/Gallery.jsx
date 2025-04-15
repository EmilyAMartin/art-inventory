import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import ArtCard from '../components/ArtCard';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { debounce } from 'lodash';

const Gallery = () => {
	const BASE_URL = 'https://api.artic.edu/api/v1/artworks';
	const [artwork, setArtwork] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const RESULTS_PER_PAGE = 12;
	const [totalResults, setTotalResults] = useState(0);

	const fetchDataById = async (id) => {
		const response = await axios.get(`${BASE_URL}/${id}`);
		return response.data.data;
	};

	const checkImageUrl = async (imageUrl) => {
		try {
			const response = await fetch(imageUrl, { method: 'HEAD' });
			return response.ok;
		} catch {
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
				setIsLoggedIn(false);
				return [];
			}
			if (!response.ok) throw new Error('Failed to fetch favorite artworks');

			setIsLoggedIn(true);
			const data = await response.json();
			return Array.isArray(data.favorites)
				? data.favorites.map((fav) => fav.id)
				: [];
		} catch (err) {
			console.error('Error fetching favorites:', err);
			setIsLoggedIn(false);
			return [];
		}
	};

	const fetchData = async () => {
		setIsLoading(true);
		try {
			let data;
			let currentPage = page;
			let validArtwork = [];
			const MAX_ATTEMPTS = 3;
			let attempts = 0;

			const favoritesList = await fetchFavorites();
			let combinedSearchQuery = searchQuery || selectedCategories.join(' ');

			while (validArtwork.length < RESULTS_PER_PAGE && attempts < MAX_ATTEMPTS) {
				if (combinedSearchQuery) {
					const searchResponse = await axios.get(
						`${BASE_URL}/search?q=${combinedSearchQuery}&page=${currentPage}`
					);
					setTotalResults(searchResponse.data.pagination.total);
					const searchResults = await Promise.all(
						searchResponse.data.data.map(async (art) => {
							return await fetchDataById(art.id);
						})
					);
					data = { data: searchResults };
				} else {
					const response = await axios.get(`${BASE_URL}?page=${currentPage}`);
					setTotalResults(response.data.pagination.total);
					data = response.data;
				}

				const newValidArtwork = await Promise.all(
					data.data.map(async (art) => {
						if (!art.image_id) return null;
						const imageUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`;
						const hasValidImage = await checkImageUrl(imageUrl);
						if (!hasValidImage) return null;
						return {
							...art,
							image_url: imageUrl,
							favorite: favoritesList.includes(art.id),
						};
					})
				);

				validArtwork = [
					...validArtwork,
					...newValidArtwork.filter((art) => art !== null),
				];
				currentPage++;
				attempts++;
			}

			setArtwork(validArtwork.slice(0, RESULTS_PER_PAGE));
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const debouncedFetchData = debounce(fetchData, 300);

	const handleFavUpdate = async (artworkId, isFavorite) => {
		if (!isLoggedIn) {
			alert('You must be logged in to favorite artwork');
			return;
		}

		try {
			const response = await fetch('http://localhost:3000/favorites', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ artworkId, favorite: isFavorite }),
				credentials: 'include',
			});
			if (!response.ok) throw new Error('Failed to update favorite status');

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
		setSelectedCategories([]);
		setPage(1);
		fetchData(); // Immediate call to reset the page
	};

	useEffect(() => {
		fetchData(); // Fetch data whenever page or selectedCategories change
	}, [page, selectedCategories]);

	return (
		<div
			id='gallery-container'
			style={{ display: 'flex', flexDirection: 'column' }}
		>
			{/* Search Bar */}
			<div
				className='search-bar'
				style={{ display: 'flex', justifyContent: 'center' }}
			>
				<TextField
					id='search-bar'
					value={searchQuery}
					onInput={(e) => setSearchQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							setSelectedCategories([]);
							setPage(1);
							debouncedFetchData();
						}
					}}
					label='Search Keyword'
					variant='outlined'
					placeholder='Search...'
					size='small'
				/>
				<IconButton
					type='button'
					onClick={debouncedFetchData}
					aria-label='search'
				>
					<SearchIcon style={{ fill: 'black' }} />
				</IconButton>
				<Button
					type='button'
					color='black'
					onClick={handleReset}
				>
					Reset
				</Button>
			</div>

			{/* Category Chips */}
			<Stack
				direction='row'
				spacing={1}
				sx={{ justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}
			>
				{[
					'Photography',
					'Painting',
					'Printmaking',
					'Sculpture',
					'Textile',
					'Digital',
				].map((category) => (
					<Chip
						key={category}
						label={category}
						variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
						color={selectedCategories.includes(category) ? 'primary' : 'default'}
						clickable
						component='button'
						onClick={(e) => {
							e.preventDefault();
							const alreadySelected = selectedCategories.includes(category);
							const newCategories = alreadySelected
								? selectedCategories.filter((cat) => cat !== category)
								: [...selectedCategories, category];
							setSelectedCategories(newCategories);
							setSearchQuery('');
							setPage(1);
							debouncedFetchData();
						}}
					/>
				))}
				{selectedCategories.length > 0 && (
					<Chip
						label='Clear'
						color='error'
						clickable
						component='button'
						onClick={(e) => {
							e.preventDefault();
							setSelectedCategories([]);
							setSearchQuery('');
							setPage(1);
							debouncedFetchData();
						}}
					/>
				)}
			</Stack>

			{/* Artwork Grid */}
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
								art={art}
								handleFavUpdate={handleFavUpdate}
								isLoggedIn={isLoggedIn}
							/>
						</Grid2>
					))}
				</Grid2>
			</div>

			{/* Pagination */}
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
			</div>
		</div>
	);
};

export default Gallery;
