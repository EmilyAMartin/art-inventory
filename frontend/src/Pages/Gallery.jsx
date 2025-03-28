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

	const checkImageUrl = async (imageUrl) => {
		try {
			const response = await fetch(imageUrl, { method: 'HEAD' });
			return response.ok;
		} catch (error) {
			return false;
		}
	};

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
				? favoritesData.favorites.map((fav) => fav.id)
				: [];
			const userId = favoritesData.userId || null;

			// Filter and process artwork data
			const validArtwork = await Promise.all(
				data.data.map(async (art) => {
					// Check if the artwork has an image URL
					if (!art.image_id) return null;

					const imageUrl = `https://www.artic.edu/iiif/2/${art.image_id}/full/400,/0/default.jpg`;
					const hasValidImage = await checkImageUrl(imageUrl);

					if (!hasValidImage) return null;

					return {
						...art,
						favorite: favoritesList.includes(art.id),
					};
				})
			);

			// Filter out null values (artworks with invalid images)
			const filteredArtwork = validArtwork.filter((art) => art !== null);

			setArtwork(filteredArtwork);
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

	const handleFavUpdate = async (artworkId, isFavorite) => {
		if (!userId) {
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

			// Update favorites list
			setFavorites((prevFavorites) =>
				isFavorite
					? [...prevFavorites, artworkId]
					: prevFavorites.filter((id) => id !== artworkId)
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
