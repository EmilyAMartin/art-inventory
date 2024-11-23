import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import Data from '../components/ArtData.json';
import AddArtworkBtn from '../components/AddArtworkBtn';
import ArtCard from '../components/ArtCard';

const Artwork = () => {
	const [artwork, setArtwork] = useState(null); // Initialize as null
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const handleFilterChange = (e) => {
		if (e.target.value === 'recent') {
			setArtwork(Data);
		} else if (e.target.value === 'favorites') {
			setArtwork(JSON.parse(localStorage.getItem('favoritesList')));
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setArtwork(Data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

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
							width: '25rem',
							height: '3rem',
							fontSize: '1rem',
						}}
						onChange={(e) => handleFilterChange(e)}
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
						width: '25rem',
						height: '3rem',
						fontSize: '1rem',
					}}
					onChange={(e) => handleFilterChange(e)}
				>
					<option value='recent'>Recently Added</option>
					<option value='favorites'>Favorites</option>
				</select>

				<div>
					<Grid2
						margin='auto'
						container
						spacing={8}
						style={{
							marginTop: '25px',
							marginBottom: '50px',
							justifyContent: 'space-around',
						}}
					>
						{artwork.map((art) => (
							<Grid2
								xs={12}
								ms={5}
								key={art.id}
							>
								<ArtCard art={art} />
							</Grid2>
						))}
					</Grid2>
				</div>
			</div>
		</div>
	);
};

export default Artwork;
