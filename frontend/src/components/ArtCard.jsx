import { useState } from 'react';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import ReactCardFlip from 'react-card-flip';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

const ArtCard = ({ art, handleFavUpdate, isLoggedIn }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);

	const open = Boolean(anchorEl);

	const handlePopClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopoverImageId(event.target.src);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setPopoverImageId(null);
	};

	const handleFavClick = () => {
		if (!isLoggedIn) return;
		handleFavUpdate(art.id, !art.favorite);
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

		const Icon = art.favorite ? Favorite : FavoriteBorder;

		return (
			<Icon
				onClick={handleFavClick}
				sx={{ cursor: 'pointer' }}
			/>
		);
	};

	return (
		<Box
			sx={{
				position: 'relative', // Ensure proper layering
			}}
		>
			{/* Background content wrapper */}
			<Box
				sx={{
					filter: open ? 'blur(5px)' : 'none', // Apply blur to the entire page
					pointerEvents: open ? 'none' : 'auto', // Disable interaction with blurred content
					transition: 'filter 0.3s ease', // Smooth transition for the blur effect
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
								image={art.image_url}
								alt='Artwork'
								onClick={handlePopClick}
							/>
							<CardContent sx={{ width: 300 }}>
								<Typography
									gutterBottom
									sx={{
										mr: 5,
										fontSize: 'clamp(0.8rem, 4vw, 1rem)',
										fontWeight: 500,
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									}}
								>
									{art.title}
								</Typography>
								<Typography
									variant='body2'
									sx={{ color: 'text.secondary' }}
								>
									{art.artist_title}
								</Typography>
								<Typography
									variant='body2'
									sx={{ color: 'text.secondary' }}
								>
									{art.date_end}
								</Typography>

								<Box
									sx={{
										position: 'absolute',
										mt: 2,
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}
								>
									<Typography
										sx={{
											mr: 21,
											fontSize: 15,
											fontWeight: 600,
											cursor: 'pointer',
										}}
										onClick={() => setFlip(true)}
									>
										Learn More
									</Typography>
									{renderFavoriteIcon()}
								</Box>
							</CardContent>
						</CardActionArea>
					</Card>

					{/* Back */}
					<Card sx={{ maxWidth: 300, maxHeight: 450, display: 'flex' }}>
						<CardActionArea>
							<CardContent
								sx={{
									width: 300,
									height: 500,
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<Box>
									<Typography
										gutterBottom
										sx={{
											mr: 5,
											fontSize: 'clamp(0.8rem, 4vw, 1rem)',
											fontWeight: 500,
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
										}}
									>
										{art.title}
									</Typography>
									<br />
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										Artist: {art.artist_title}
									</Typography>
									<br />
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										Date: {art.date_end}
									</Typography>
									<br />
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										Place of Origin: {art.place_of_origin}
									</Typography>
									<br />
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										Type: {art.artwork_type_title}
									</Typography>
									<br />
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										Medium: {art.medium_display}
									</Typography>
									<br />
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										Description: {art?.thumbnail?.alt_text}
									</Typography>
									<br />
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										Credit: {art.credit_line}
									</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										mt: 50,
										position: 'absolute',
									}}
								>
									<Typography
										sx={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
										onClick={() => setFlip(false)}
									>
										Back
									</Typography>
								</Box>
							</CardContent>
						</CardActionArea>
					</Card>
				</ReactCardFlip>
			</Box>

			{/* Popover */}
			<Popover
				id={art.id}
				open={open}
				anchorEl={anchorEl}
				anchorReference='none'
				onClose={handleClose}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Dim background
					zIndex: 1300, // Ensure it appears above other content
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

export default ArtCard;
