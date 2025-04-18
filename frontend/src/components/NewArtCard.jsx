import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactCardFlip from 'react-card-flip';
import CardActionArea from '@mui/material/CardActionArea';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';

const NewArtCard = ({ artwork, onDelete }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const [isPublic, setIsPublic] = useState(artwork.isPublic || false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const open = Boolean(anchorEl);

	if (!artwork) {
		return null;
	}

	const handleTogglePublic = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/artworks/${artwork.id}/toggle-public`,
				{
					method: 'PATCH',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ isPublic: !isPublic }),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update public/private status');
			}

			setIsPublic((prev) => !prev);
		} catch (error) {
			console.error('Error updating public/private status:', error);
			toast.error('Failed to update public/private status');
		}
	};

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

			onDelete(artwork.id);
		} catch (error) {
			console.error('Error deleting artwork:', error);
			toast.error(`Failed to delete artwork: ${error.message}`);
		}
	};

	const handleNextImage = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % artwork.images.length);
	};

	const handlePreviousImage = () => {
		setCurrentImageIndex(
			(prevIndex) =>
				(prevIndex - 1 + artwork.images.length) % artwork.images.length
		);
	};

	const handlePopClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopoverImageId(event.target.src);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setPopoverImageId(null);
	};

	const imageUrl =
		artwork.images && artwork.images.length > 0
			? `http://localhost:3000/uploads/${artwork.images[currentImageIndex]}`
			: null;

	return (
		<div style={{ marginTop: '1rem' }}>
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

						{/* Image Navigation Buttons */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginTop: '0.5rem',
							}}
						>
							<Button
								variant='outlined'
								size='small'
								onClick={handlePreviousImage}
								disabled={artwork.images.length <= 1}
							>
								Previous
							</Button>
							<Button
								variant='outlined'
								size='small'
								onClick={handleNextImage}
								disabled={artwork.images.length <= 1}
							>
								Next
							</Button>
						</div>

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

							{/* Add Public/Private Toggle */}
							<div
								style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}
							>
								<Checkbox
									checked={isPublic}
									onChange={handleTogglePublic}
									color='primary'
								/>
								<Typography
									variant='body2'
									sx={{ marginLeft: '0.5rem' }}
								>
									Public
								</Typography>
							</div>
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
};

export default NewArtCard;
