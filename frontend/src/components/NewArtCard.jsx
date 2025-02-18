import React, { useState } from 'react';
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const NewArtCard = ({
	newAddedArtwork,
	handleFavUpdate,
	handleDelete,
	index,
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const open = Boolean(anchorEl);

	// Ensure the artwork exists before trying to access its properties
	const artwork = newAddedArtwork[index]; // Directly use index

	// Check if artwork exists
	if (!artwork) {
		console.error('Artwork not found at index', index);
		return <div>Artwork not found at index {index}</div>; // Provide feedback on index
	}

	// Check if the artwork has the images property
	if (!artwork.images) {
		console.error("Artwork missing 'images' property:", artwork);
		return <div>No image available for this artwork</div>;
	}

	// Handle popover for image preview
	const handlePopClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopoverImageId(event.target.src);
	};
	const handleClose = () => {
		setAnchorEl(null);
		setPopoverImageId(null);
	};

	// Handle favorite click
	const handleFavClick = () => {
		const updatedArtwork = { ...artwork };
		updatedArtwork.favorite = !updatedArtwork.favorite;
		handleFavUpdate(updatedArtwork); // Update favorite status in parent
	};

	if (newAddedArtwork.length === 0) {
		return <div style={{ marginTop: 25 }}>No newAddedArtwork available</div>;
	}

	return (
		<div
			style={{ marginTop: 25, display: 'flex', flexDirection: 'row', gap: 25 }}
		>
			<Card
				sx={{ maxWidth: 345 }}
				key={index}
			>
				<CardActionArea>
					<CardMedia
						style={{ width: 300, height: 400 }}
						component='img'
						height='150'
						src={artwork.images || 'default-image.jpg'} // Use a fallback image if no image exists
						alt='Artwork Image'
						onClick={handlePopClick}
					/>

					<Popover
						sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
						open={open}
						anchorEl={anchorEl}
						anchorReference='none'
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<CardMedia
							component='img'
							height='140'
							image={popoverImageId}
							alt=''
						/>
					</Popover>

					<CardContent style={{ width: 300, height: 200 }}>
						<IconButton
							aria-label='delete'
							color='black'
							sx={{ position: 'absolute', top: 10, right: 10 }}
							onClick={() => handleDelete(index)} // Pass the index to handleDelete
						>
							<DeleteIcon />
						</IconButton>

						<Typography
							gutterBottom
							fontSize={16}
							fontWeight={500}
							component='div'
						>
							{artwork.title}
						</Typography>

						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							{artwork.artist}
						</Typography>
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							{artwork.date}
						</Typography>
					</CardContent>

					<div
						className='favorites-more'
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							margin: 25,
						}}
					>
						{artwork.favorite ? (
							<Favorite onClick={handleFavClick} />
						) : (
							<FavoriteBorder onClick={handleFavClick} />
						)}

						<div
							style={{ fontSize: 15, fontWeight: 600 }}
							onClick={() => setFlip(!flip)}
						>
							Learn More
						</div>
					</div>
				</CardActionArea>
			</Card>
		</div>
	);
};

export default NewArtCard;
