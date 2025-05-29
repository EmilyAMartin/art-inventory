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
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

const PublicArtCard = ({ artwork, handleFavUpdate, isLoggedIn }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const open = Boolean(anchorEl);

	if (!artwork) return null;
	const handleFavClick = () => {
		if (!isLoggedIn) return;
		handleFavUpdate(artwork.id, !artwork.favorite);
	};

	const renderFavoriteIcon = () => {
		if (!isLoggedIn) {
			return (
				<Tooltip title='Log in to favorite artwork'>
					<Box sx={{ cursor: 'not-allowed', display: 'inline-flex' }}>
						<FavoriteBorder sx={{ opacity: 0.5 }} />
					</Box>
				</Tooltip>
			);
		}
		const Icon = artwork.favorite ? Favorite : FavoriteBorder;
		return (
			<Icon
				onClick={handleFavClick}
				sx={{ cursor: 'pointer' }}
			/>
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
			? `${BASE_URL}/uploads/${artwork.images[0]}`
			: null;

	return (
		<Box sx={{ position: 'relative' }}>
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
								<Typography
									sx={{
										position: 'absolute',
										bottom: 15,
										left: 15,
										fontSize: 15,
										fontWeight: 600,
										cursor: 'pointer',
									}}
									onClick={() => setFlip(true)}
								>
									Learn More
								</Typography>
								<Box sx={{ position: 'absolute', bottom: 15, right: 15 }}>
									{renderFavoriteIcon()}
								</Box>
							</Box>
						</CardActionArea>
					</Card>
					{/* ...Back Side... */}
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

export default PublicArtCard;
