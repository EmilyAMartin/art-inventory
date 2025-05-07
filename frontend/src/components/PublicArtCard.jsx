import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ReactCardFlip from 'react-card-flip';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import { BASE_URL } from '../config';

const PublicArtCard = ({ artwork }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const open = Boolean(anchorEl);

	if (!artwork) return null;

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
				<Card sx={{ maxWidth: 300, maxHeight: 600 }}>
					<CardActionArea>
						<CardMedia
							component='img'
							image={imageUrl}
							alt='Artwork Image'
							onClick={handlePopClick}
							sx={{ width: 300, height: 300 }}
						/>

						<Popover
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorReference='none'
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<CardMedia
								component='img'
								height='140'
								image={popoverImageId}
								alt='Enlarged Artwork'
							/>
						</Popover>

						<CardContent sx={{ width: 300, height: 200 }}>
							<Typography
								gutterBottom
								fontSize={16}
								fontWeight={500}
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

						<Box
							className='favorites-more'
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								m: 3,
							}}
						>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}
							>
								<Typography
									sx={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
									onClick={() => setFlip(!flip)}
								>
									Learn More
								</Typography>
							</Box>
						</Box>
					</CardActionArea>
				</Card>

				{/* Back Side */}
				<Card sx={{ maxWidth: 300, maxHeight: 600 }}>
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
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
							}}
						>
							<Typography
								sx={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
								onClick={() => setFlip(!flip)}
							>
								Back
							</Typography>
						</Box>
					</Box>
				</Card>
			</ReactCardFlip>
		</Box>
	);
};

export default PublicArtCard;
