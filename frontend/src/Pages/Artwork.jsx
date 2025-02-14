import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import AddArtworkBtn from '../components/AddArtworkBtn';
import ArtCard from '../components/ArtCard';

import AddNewBtn from '../components/AddNewBtn';
import { Typography } from '@mui/material';
import NewArtCard from '../components/NewArtCard';

const Artwork = () => {
	//New Section//
	const [newArtwork, setNewArtwork] = useState([]);
	const fetchNewArtwork = () => {
		const storedNewArtwork =
			JSON.parse(localStorage.getItem('artworkData')) || [];
		setNewArtwork(storedNewArtwork);
	};
	useEffect(() => {
		fetchNewArtwork();
	}, []);
	const handleNewArtworkAdded = (newNewArtwork) => {
		const updatedNewArtwork = [...newArtwork, newNewArtwork];
		localStorage.setItem('artworkData', JSON.stringify(updatedNewArtwork));
		setNewArtwork(updatedNewArtwork);
	};
	const handleDeleteNewArtwork = (index) => {
		const updatedNewArtwork = newArtwork.filter((_, i) => i !== index);
		setNewArtwork(updatedNewArtwork);
		localStorage.setItem('artworkData', JSON.stringify(updatedNewArtwork));
	};
	//New Section//

	const [artwork, setArtwork] = useState([]);
	const [filter, setFilter] = useState('recent');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch('http://localhost:3000/artworks');
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();

				if (filter === 'recent') {
					const favoritesList =
						JSON.parse(localStorage.getItem('favoritesList')) || [];
					const artworkWithFavorites = data.map((art) => {
						return {
							...art,
							favorite: favoritesList.some((fav) => fav.id === art.id),
						};
					});
					setArtwork(artworkWithFavorites);
				} else if (filter === 'favorites') {
					const favoritesList =
						JSON.parse(localStorage.getItem('favoritesList')) || [];
					setArtwork(favoritesList);
				}
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [filter]);

	const handleFilterChange = (e) => {
		setFilter(e.target.value);
	};

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

		if (filter === 'favorites') {
			setArtwork(favoritesList);
		} else {
			setArtwork((prevArtwork) =>
				prevArtwork.map((art) =>
					art.id === updatedArtwork.id
						? { ...art, favorite: updatedArtwork.favorite }
						: art
				)
			);
		}
	};

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
				<div
					className='select-filter'
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignContent: 'center',
					}}
				>
					<select
						style={{
							borderColor: 'lightgrey',
							borderRadius: '0.3rem',
							width: '20rem',
							height: '3rem',
							fontSize: '1rem',
						}}
						onChange={handleFilterChange}
						value={filter}
					>
						<option value='recent'>Recently Added</option>
						<option value='favorites'>Favorites</option>
					</select>
				</div>
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
			<AddArtworkBtn />
			<div
				className='select-filter'
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignContent: 'center',
				}}
			>
				<select
					style={{
						borderColor: 'lightgrey',
						borderRadius: '0.3rem',
						width: '20rem',
						height: '3rem',
						fontSize: '1rem',
					}}
					onChange={handleFilterChange}
					value={filter}
				>
					<option value='recent'>Recently Added</option>
					<option value='favorites'>Favorites</option>
				</select>

				<div>
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

				<Typography>Test Section</Typography>
				<AddNewBtn onArtworkAdded={handleNewArtworkAdded} />
				<div
					style={{
						marginTop: 25,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}
				>
					<NewArtCard
						newArtwork={newArtwork}
						handleDelete={handleDeleteNewArtwork}
					/>
				</div>
			</div>
		</div>
	);
};

export default Artwork;
