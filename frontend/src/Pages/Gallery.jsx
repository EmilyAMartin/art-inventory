import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import ArtCard from '../components/ArtCard';
import toast from 'react-hot-toast';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';
const RESULTS_PER_PAGE = 15;

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
		if (response.status === 401) return { isLoggedIn: false, favorites: [] };
		if (!response.ok) throw new Error('Failed to fetch favorites');

		const data = await response.json();
		return {
			isLoggedIn: true,
			favorites: Array.isArray(data.favorites)
				? data.favorites.map((fav) => fav.id)
				: [],
		};
	} catch {
		return { isLoggedIn: false, favorites: [] };
	}
};

const fetchArtwork = async ({ queryKey }) => {
	const [_key, page, searchQuery] = queryKey;
	const { isLoggedIn, favorites } = await fetchFavorites();
	const MAX_ATTEMPTS = 3;
	let attempts = 0;
	let currentPage = page;
	let validArtwork = [];
	let totalResults = 0;

	while (validArtwork.length < RESULTS_PER_PAGE && attempts < MAX_ATTEMPTS) {
		let data;

		if (searchQuery) {
			const searchResponse = await axios.get(
				`${BASE_URL}/search?q=${searchQuery}&page=${currentPage}`
			);
			totalResults = searchResponse.data.pagination.total;
			const results = await Promise.all(
				searchResponse.data.data.map((art) =>
					axios.get(`${BASE_URL}/${art.id}`).then((res) => res.data.data)
				)
			);
			data = results;
		} else {
			const response = await axios.get(`${BASE_URL}?page=${currentPage}`);
			totalResults = response.data.pagination.total;
			data = response.data.data;
		}

		const filtered = await Promise.all(
			data.map(async (art) => {
				if (!art.image_id) return null;
				const imageUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`;
				const hasValidImage = await checkImageUrl(imageUrl);
				if (!hasValidImage) return null;

				return {
					...art,
					image_url: imageUrl,
					favorite: favorites.includes(art.id),
				};
			})
		);

		validArtwork = [...validArtwork, ...filtered.filter((art) => art !== null)];
		currentPage++;
		attempts++;
	}

	return {
		artwork: validArtwork.slice(0, RESULTS_PER_PAGE),
		isLoggedIn,
		totalResults,
	};
};

const Gallery = () => {
	const [page, setPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['gallery', page, searchQuery],
		queryFn: fetchArtwork,
		keepPreviousData: true,
	});

	const handleFavUpdate = async (artworkId, isFavorite) => {
		if (!data?.isLoggedIn) {
			toast.error('You must be logged in to favorite artwork');
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

			toast.success(
				isFavorite
					? 'Artwork added to favorites!'
					: 'Artwork removed from favorites!'
			);
			refetch();
		} catch (err) {
			toast.error('Failed to update favorite status');
		}
	};

	const handleReset = () => {
		setSearchQuery('');
		setPage(1);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', margin: 5 }}>
			{/* Search Bar */}
			<Box
				className='search-bar'
				sx={{ display: 'flex', justifyContent: 'center' }}
			>
				<TextField
					id='search-bar'
					value={searchQuery}
					onInput={(e) => setSearchQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							setPage(1);
						}
					}}
					label='Search Keyword'
					variant='outlined'
					placeholder='Search...'
					size='small'
				/>
				<IconButton
					type='button'
					onClick={() => setPage(1)}
					aria-label='search'
					sx={{ fill: 'black' }}
				>
					<SearchIcon />
				</IconButton>
				<Button
					type='button'
					color='black'
					onClick={handleReset}
				>
					Reset
				</Button>
			</Box>

			{/* Search Buttons */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: 5,
					gap: 2,
				}}
			>
				{['Painting', 'Printmaking', 'Sculpture', 'Photography', 'Textile'].map(
					(preset) => (
						<Button
							key={preset}
							variant='outlined'
							sx={{
								borderRadius: '1rem',
								padding: '8px 16px',
								textTransform: 'capitalize',
								color: searchQuery === preset ? 'white' : 'black',
								backgroundColor: searchQuery === preset ? '#b9b5ff' : 'transparent',
								borderColor: searchQuery === preset ? '#b9b5ff' : 'lightgrey',
								'&:hover': {
									backgroundColor: '#b9b5ff',
									color: 'white',
								},
							}}
							onClick={() => {
								setSearchQuery(preset);
								setPage(1);
							}}
						>
							{preset}
						</Button>
					)
				)}
			</Box>

			{/* Artwork Grid */}
			<Box>
				{isLoading && <div>Loading...</div>}
				{error && <div>Error: {error.message}</div>}
				<Grid2
					container
					spacing={8}
					sx={{
						marginTop: 5,
						marginBottom: 3,
						display: 'flex',
						justifyContent: 'space-between',
					}}
				>
					{data?.artwork.map((art) => (
						<Grid2
							xs={12}
							ms={5}
							key={art.id}
						>
							<ArtCard
								art={art}
								handleFavUpdate={handleFavUpdate}
								isLoggedIn={data.isLoggedIn}
							/>
						</Grid2>
					))}
				</Grid2>
			</Box>

			{/* Pagination */}
			<Box
				sx={{
					marginTop: 5,
					display: 'flex',
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
					disabled={page * RESULTS_PER_PAGE >= (data?.totalResults || 0)}
					onClick={() => {
						setPage(page + 1);
						window.scrollTo(0, 0);
					}}
				>
					Next
				</Button>
			</Box>
		</Box>
	);
};

export default Gallery;
