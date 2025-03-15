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

	const handleFavUpdate = (updatedArtwork) => {
		const favoritesList = JSON.parse(localStorage.getItem('favoritesList')) || [];
		const index = favoritesList.findIndex((art) => art.id === updatedArtwork.id);
		if (updatedArtwork.favorite) {
			if (index === -1) {
				favoritesList.push(updatedArtwork);
			}
		} else {
			if (index !== -1) {
				favoritesList.splice(index, 1);
			}
		}
		localStorage.setItem('favoritesList', JSON.stringify(favoritesList));
	};

	const fetchDataByKeyword = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(`${BASE_URL}/search?q=${searchQuery}`);
			const data = response.data.data;

			// Use Promise.all to fetch details and validate image
			const fetchedData = await Promise.all(
				data.map(async (art) => {
					const artDetail = await fetchDataById(art.id);

					// Log the fetched artwork for debugging
					console.log('Fetched artwork details:', artDetail);

					// Check if the image is valid
					const imageValid = await isImageValid(artDetail.imageUrl);

					if (imageValid) {
						return artDetail; // Return artwork if image is valid
					}
					return null; // Return null if image is invalid
				})
			);

			// Filter out null values (i.e., artworks with invalid images)
			const validArtwork = fetchedData.filter((art) => art !== null);

			setArtwork(validArtwork); // Set valid artworks in the state
			setPage(0);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const isImageValid = async (imageUrl) => {
		if (!imageUrl) {
			console.error('Image URL is missing or invalid:', imageUrl);
			return false; // Return false if the image URL is missing
		}

		try {
			const response = await axios.get(imageUrl, {
				validateStatus: (status) => status === 200, // Only accept 200 responses
			});
			return response.status === 200; // Return true if the image is valid (200 OK)
		} catch (error) {
			console.error('Error loading image:', error);
			return false; // Return false if the image fails to load
		}
	};

	const fetchDataById = async (id) => {
		const response = await axios.get(`${BASE_URL}/${id}`);
		return response.data.data; // Assuming `data` contains the `imageUrl`
	};

	const handleReset = () => {
		setPage(1);
		setSearchQuery('');
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const { data } = await axios.get(`${BASE_URL}?page=${page}`);
				const favoritesList = JSON.parse(localStorage.getItem('favoritesList'));
				const dataWithFavorites = data.data.map((art) => {
					const isFavorite = favoritesList?.some((fav) => fav.id === art.id);
					return { ...art, favorite: isFavorite };
				});

				// Log fetched data before setting state
				console.log('Fetched data with favorites:', dataWithFavorites);

				setArtwork(dataWithFavorites);
				setError(null);
			} catch (error) {
				if (axios.isCancel(error)) {
					return;
				}
				setError(error.message);
			} finally {
				setIsLoading(false);
			}
		};

		if (page > 0) {
			fetchData();
		}
	}, [page]);

	return (
		<div
			id='galley-container'
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
							fetchDataByKeyword();
						}
					}}
					label='Search Keyword'
					variant='outlined'
					placeholder='Search...'
					size='small'
				/>
				<IconButton
					type='submit'
					onClick={fetchDataByKeyword}
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
			<div className='galley-artwork'>
				{isLoading === true && <div>Loading...</div>}
				<Grid2
					style={{
						marginTop: 50,
						marginBottom: 50,
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
						{' '}
						Prev
					</Button>
					<Button
						color='black'
						onClick={() => {
							setPage(page + 1);
							window.scrollTo(0, 0);
						}}
					>
						{' '}
						Next
					</Button>
					{error && <div>{error}</div>}
				</div>
			)}
		</div>
	);
};

export default Gallery;
