import React, { useState, memo } from 'react';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactCardFlip from 'react-card-flip';
import CardActionArea from '@mui/material/CardActionArea';

const NewArtCard = memo(({ artwork, onDelete }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const open = Boolean(anchorEl);

	// Return early if artwork is undefined
	if (!artwork) {
		return null;
	}

	const handleDeleteClick = async (e) => {
		e.stopPropagation();
		try {
			const response = await fetch(
				`http://localhost:3000/artworks/${artwork.id}`,
				{
					method: 'DELETE',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to delete artwork');
			}

			// If deletion was successful, call the parent's onDelete
			onDelete(artwork.id);
		} catch (error) {
			console.error('Error deleting artwork:', error);
			alert(`Failed to delete artwork: ${error.message}`);
		}
	};

	// Get the first image from the images array or use a default image
	const imageUrl =
		artwork.images && artwork.images.length > 0
			? `http://localhost:3000/${artwork.images[0]}`
			: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmMGYwZjAiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNjY2Ij4KICAgIE5vIEltYWdlIEF2YWlsYWJsZQogIDwvdGV4dD4KPC9zdmc+';

	const handlePopClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopoverImageId(event.target.src);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setPopoverImageId(null);
	};

	return (
		<div style={{ marginTop: 25 }}>
			<ReactCardFlip
				isFlipped={flip}
				flipDirection='horizontal'
			>
				<Card
					className='card-font'
					sx={{ maxWidth: 300, maxHeight: 600 }}
				>
					<CardActionArea>
						<CardMedia
							style={{ width: 300, height: 300 }}
							component='img'
							image={imageUrl}
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
								sx={{
									position: 'absolute',
									bottom: 10,
									right: 10,
									zIndex: 2,
									'&:hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.04)',
									},
								}}
								onClick={handleDeleteClick}
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
								style={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
								onClick={() => setFlip(!flip)}
							>
								Learn More
							</div>
						</div>
					</CardActionArea>
				</Card>

				<Card
					className='card-back'
					sx={{ maxWidth: 300, maxHeight: 600 }}
				>
					<CardContent style={{ width: 300, height: 500 }}>
						<Typography
							gutterBottom
							fontSize={16}
							fontWeight={500}
							component='div'
						>
							{artwork.title}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Artist: {artwork.artist}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Date: {artwork.date}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Location: {artwork.location}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Medium: {artwork.medium}
						</Typography>
						<br />
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
							style={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
							onClick={() => setFlip(!flip)}
						>
							Back
						</div>
					</div>
				</Card>
			</ReactCardFlip>
		</div>
	);
});

NewArtCard.displayName = 'NewArtCard';

export default NewArtCard;
