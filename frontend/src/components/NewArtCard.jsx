import React, { useState } from 'react';
import {
	Popover,
	Card,
	CardContent,
	CardMedia,
	Typography,
	IconButton,
	CardActionArea,
	Checkbox,
	Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactCardFlip from 'react-card-flip';
import toast from 'react-hot-toast';
import { queryClient } from './queryClient';
import { BASE_URL } from '../config';

const NewArtCard = ({ artwork, handleDelete, yourAuthToken }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const [isPublic, setIsPublic] = useState(artwork.isPublic || false);
	const open = Boolean(anchorEl);

	if (!artwork) return null;

	const handleDeleteClick = (e) => {
		e.stopPropagation();
		handleDelete(artwork.id);
	};

	const handleTogglePublic = async () => {
		const updatedStatus = !isPublic;

		try {
			const response = await fetch(
				`${BASE_URL}/artworks/${artwork.id}/toggle-public`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ isPublic: updatedStatus }),
					credentials: 'include',
				}
			);

			if (!response.ok) {
				throw new Error('Failed to update public status');
			}

			setIsPublic(updatedStatus);
			toast.success(`Artwork is now ${updatedStatus ? 'public' : 'private'}`);

			// Invalidate the portfolio query to refetch data
			queryClient.invalidateQueries(['portfolio']);
		} catch (error) {
			console.error('Toggle error:', error);
			toast.error('Failed to update public status');
		}
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
			? `${BASE_URL}/uploads/${artwork.images[0]}`
			: null;

	return (
		<Box sx={{ mt: '1rem' }}>
			<ReactCardFlip
				isFlipped={flip}
				flipDirection='horizontal'
			>
				{/* Front Side */}
				<Card
					sx={{
						maxWidth: 300,
						height: 450,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<CardActionArea>
						<CardMedia
							sx={{ width: 300, height: 300 }}
							component='img'
							image={imageUrl}
							alt='Artwork Image'
							onClick={handlePopClick}
						/>

						<Popover
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
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
								image={popoverImageId}
								alt='Enlarged Artwork'
							/>
						</Popover>

						<CardContent sx={{ width: 300, position: 'relative' }}>
							<IconButton
								aria-label='delete'
								sx={{
									position: 'absolute',
									bottom: -25,
									right: 35,
									zIndex: 2,
									color: 'black',
									'&:hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.04)',
									},
								}}
								onClick={handleDeleteClick}
							>
								<DeleteIcon />
							</IconButton>

							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<Typography
									gutterBottom
									fontSize={16}
									fontWeight={500}
								>
									{artwork.title}
								</Typography>

								<Box sx={{ display: 'flex', alignItems: 'center', ml: '2rem' }}>
									<Checkbox
										checked={isPublic}
										onChange={handleTogglePublic}
										color='primary'
									/>
									<Typography
										variant='body2'
										sx={{ mr: '2rem' }}
									>
										Public
									</Typography>
								</Box>
							</Box>

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

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<Typography
								sx={{
									position: 'absolute',
									bottom: -20,
									left: 15,
									fontSize: 15,
									fontWeight: 600,
									cursor: 'pointer',
								}}
								onClick={() => setFlip(true)}
							>
								Learn More
							</Typography>
						</Box>
					</CardActionArea>
				</Card>

				{/* Back Side */}
				<Card sx={{ maxWidth: 300, maxHeight: 450 }}>
					<CardContent sx={{ width: 300, height: 500 }}>
						<Typography
							gutterBottom
							fontSize={16}
							fontWeight={500}
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

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							m: 3,
						}}
					>
						<Typography
							sx={{
								position: 'absolute',
								bottom: 15,
								left: 15,
								zIndex: 2,
								fontSize: 15,
								fontWeight: 600,
								cursor: 'pointer',
							}}
							onClick={() => setFlip(!flip)}
						>
							Back
						</Typography>
					</Box>
				</Card>
			</ReactCardFlip>
		</Box>
	);
};

export default NewArtCard;
