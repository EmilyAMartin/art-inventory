import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactCardFlip from 'react-card-flip';

const NewArtCard = ({ newAddedArtwork, handleDelete, index }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const open = Boolean(anchorEl);

	const artwork = newAddedArtwork[index];
	if (!artwork) {
		console.error('Artwork not found at index', index);
		return <div>Artwork not found at index {index}</div>;
	}
	if (!artwork.images) {
		console.error("Artwork missing 'images' property:", artwork);
		return <div>No image available for this artwork</div>;
	}
	const handlePopClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopoverImageId(event.target.src);
	};
	const handleClose = () => {
		setAnchorEl(null);
		setPopoverImageId(null);
	};

	if (newAddedArtwork.length === 0) {
		return <div style={{ marginTop: 25 }}>No newAddedArtwork available</div>;
	}

	return (
		<div
			style={{ marginTop: 25, display: 'flex', flexDirection: 'row', gap: 25 }}
		>
			<ReactCardFlip
				isFlipped={flip}
				flipDirection='horizontal'
			>
				<Card
					className='card-font'
					sx={{ maxWidth: 300, maxHeight: 600, display: 'flex' }}
				>
					<CardActionArea>
						<CardMedia
							style={{ width: 300, height: 300 }}
							component='img'
							image={artwork.images}
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
								onClick={() => handleDelete(index)}
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
							<div
								style={{ fontSize: 15, fontWeight: 600 }}
								onClick={() => setFlip(!flip)}
							>
								Learn More
							</div>
						</div>
					</CardActionArea>
				</Card>
				<Card
					className='card-back'
					sx={{ maxWidth: 300, maxHeight: 600, display: 'flex' }}
				>
					<CardActionArea>
						<CardContent style={{ width: 300, height: 500 }}>
							<Typography
								gutterBottom
								fontSize={16}
								fontWeight={500}
								component='div'
							>
								{artwork.title}
							</Typography>
							<br></br>
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary' }}
							>
								Artist: {artwork.artist}
							</Typography>
							<br></br>
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary' }}
							>
								Date: {artwork.date}
							</Typography>
							<br></br>
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary' }}
							>
								Place of Origin: {artwork.location}
							</Typography>
							<br></br>
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary' }}
							>
								Medium: {artwork.medium}
							</Typography>
							<br></br>
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary' }}
							>
								Description: {artwork.description}
							</Typography>
						</CardContent>

						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								margin: 25,
							}}
						>
							<div
								style={{ fontSize: 15, fontWeight: 600 }}
								onClick={() => setFlip(!flip)}
							>
								Back
							</div>
						</div>
					</CardActionArea>
				</Card>
			</ReactCardFlip>
		</div>
	);
};

export default NewArtCard;
