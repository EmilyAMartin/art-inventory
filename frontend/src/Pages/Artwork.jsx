import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import AddArtworkBtn from '../components/AddArtworkBtn';
import ArtCard from '../components/ArtCard';

import AddNewBtn from '../components/AddNewBtn';
import { Typography } from '@mui/material';
import NewArtCard from '../components/NewArtCard';

const Artwork = () => {
	// New Section //
	const [newAddedArtwork, setNewAddedArtwork] = useState([]);

	const handleNewArtworkAdded = (newNewArtwork) => {
		setNewAddedArtwork((prevState) => [...prevState, newNewArtwork]);
	};

	const handleDeleteNewArtwork = (index) => {
		setNewAddedArtwork((prevState) => prevState.filter((_, i) => i !== index));
	};

	// New Section //

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
				setArtwork(data);
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
		setArtwork((prevArtwork) =>
			prevArtwork.map((art) =>
				art.id === updatedArtwork.id
					? { ...art, favorite: updatedArtwork.favorite }
					: art
			)
		);
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

				{/* First Grid */}
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

				<Typography>Test Section</Typography>
				<AddNewBtn onArtworkAdded={handleNewArtworkAdded} />
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
					{newAddedArtwork.length === 0 ? (
						<div>No New Artwork Available</div>
					) : (
						newAddedArtwork.map((art, index) => (
							<Grid2
								xs={12}
								ms={5}
								key={art.id}
							>
								<NewArtCard
									newAddedArtwork={newAddedArtwork}
									handleDelete={handleDeleteNewArtwork}
									handleFavUpdate={handleFavUpdate}
									index={index} // Pass index here explicitly
								/>
							</Grid2>
						))
					)}
				</Grid2>
			</div>
		</div>
	);
};

export default Artwork;
