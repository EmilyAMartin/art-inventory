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
import { Typography } from '@mui/material';
import { BASE_URL } from '../config';

const API_URL = 'https://api.artic.edu/api/v1/artworks';
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
		const response = await fetch(`${BASE_URL}/favorites`, {
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
	const MAX_ATTEMPTS = 30;
	let attempts = 0;
	let currentApiPage = 1;
	let validArtwork = [];
	let totalResults = 0;
	const artworksToSkip = (page - 1) * RESULTS_PER_PAGE;

	while (
		validArtwork.length < artworksToSkip + RESULTS_PER_PAGE &&
		attempts < MAX_ATTEMPTS
	) {
		let data;

		if (searchQuery) {
			const searchResponse = await axios.get(
				`${API_URL}/search?q=${searchQuery}&page=${currentApiPage}`
			);
			totalResults = searchResponse.data.pagination.total;
			const results = await Promise.all(
				searchResponse.data.data.map((art) =>
					axios.get(`${API_URL}/${art.id}`).then((res) => res.data.data)
				)
			);
			data = results;
		} else {
			const response = await axios.get(`${API_URL}?page=${currentApiPage}`);
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
		if (!data.length) break;
		currentApiPage++;
		attempts++;
	}

	const artwork = validArtwork.slice(
		artworksToSkip,
		artworksToSkip + RESULTS_PER_PAGE
	);

	return {
		artwork,
		isLoggedIn,
		totalResults: validArtwork.length,
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
			const response = await fetch(`${BASE_URL}/favorites`, {
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
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 4,
			}}
		>
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
					gap: 2,
					flexWrap: 'wrap',
					padding: 2,
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
								backgroundColor: searchQuery === preset ? '#6c63ff' : 'transparent',
								borderColor: searchQuery === preset ? '#6c63ff' : 'lightgrey',
								'&:hover': {
									backgroundColor: '#6c63ff',
									color: 'white',
								},

								width: {
									xs: '100%',
									sm: 'auto',
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
				{isLoading && <Typography>Loading...</Typography>}
				{error && <Typography>Error: {error.message}</Typography>}
				{!isLoading && data?.artwork.length === 0 && (
					<Typography>No artworks found for this search.</Typography>
				)}
				<Grid2
					container
					spacing={8}
					sx={{
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
