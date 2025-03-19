import React, { useState } from 'react';
import AddNewBtn from '../components/AddNewBtn';
import Grid2 from '@mui/material/Grid2';
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

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 15,
				marginTop: 25,
			}}
		>
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
								index={index} // Pass index here explicitly
							/>
						</Grid2>
					))
				)}
			</Grid2>
		</div>
	);
};

export default Artwork;
