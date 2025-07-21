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
				`${BASE_URL}api/artworks/${artwork.id}/toggle-public`,
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
		<Box
			sx={{
				position: 'relative',
			}}
		>
			<Box
				sx={{
					filter: open ? 'blur(5px)' : 'none',
					pointerEvents: open ? 'none' : 'auto',
					transition: 'filter 0.3s ease',
				}}
			>
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
					<Card
						sx={{
							width: 300,
							height: 450,
							display: 'flex',
							flexDirection: 'column',
							boxSizing: 'border-box',
						}}
					>
						<CardContent
							sx={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								boxSizing: 'border-box',
								overflowY: 'auto',
								padding: 2,
							}}
						>
							<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
								<Typography
									variant='body2'
									sx={{
										color: 'text.secondary',
										whiteSpace: 'normal',
										wordBreak: 'break-word',
									}}
								>
									<b>Description:</b> {artwork.description}
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: 'text.secondary',
										whiteSpace: 'normal',
										wordBreak: 'break-word',
									}}
								>
									<b>Artist:</b> {artwork.artist}
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: 'text.secondary',
										whiteSpace: 'normal',
										wordBreak: 'break-word',
									}}
								>
									<b>Date:</b> {artwork.date}
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: 'text.secondary',
										whiteSpace: 'normal',
										wordBreak: 'break-word',
									}}
								>
									<b>Location:</b> {artwork.location}
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: 'text.secondary',
										whiteSpace: 'normal',
										wordBreak: 'break-word',
									}}
								>
									<b>Medium:</b> {artwork.medium}
								</Typography>
							</Box>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'flex-end',
									alignItems: 'center',
									width: '100%',
									mt: 2,
								}}
							>
								<Typography
									sx={{
										fontSize: 15,
										fontWeight: 600,
										cursor: 'pointer',
									}}
									onClick={() => setFlip(!flip)}
								>
									Back
								</Typography>
							</Box>
						</CardContent>
					</Card>
				</ReactCardFlip>
			</Box>

			{/* Popover */}
			<Popover
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					zIndex: 1300,
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
		</Box>
	);
};

export default NewArtCard;
