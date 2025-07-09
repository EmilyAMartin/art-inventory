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
			return null; // Hide the icon if not logged in
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
				position: 'relative',
				width: '100%',
				maxWidth: 400,
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
							display: 'flex',
							flexDirection: 'column',
							width: 300,
							height: 450,
							position: 'relative',
							boxShadow: 3,
							margin: '0 auto',
						}}
					>
						<CardActionArea>
							<CardMedia
								sx={{
									width: '100%',
									height: 300,
									objectFit: 'cover',
								}}
								component='img'
								image={art.image_url}
								alt='Artwork'
								onClick={handlePopClick}
							/>
							<CardContent
								sx={{
									padding: { xs: 1, sm: 2 },
									flexGrow: 1,
								}}
							>
								<Typography
									gutterBottom
									sx={{
										fontSize: { xs: '0.9rem', sm: '1rem' },
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
									sx={{
										color: 'text.secondary',
										fontSize: { xs: '0.8rem', sm: '0.9rem' },
									}}
								>
									{art.artist_title}
								</Typography>
								<Typography
									variant='body2'
									sx={{
										color: 'text.secondary',
										fontSize: { xs: '0.8rem', sm: '0.9rem' },
									}}
								>
									{art.date_end}
								</Typography>
							</CardContent>
						</CardActionArea>

						{/* Favorite Icon and Learn More */}
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: { xs: 1, sm: 2 },
								backgroundColor: 'rgba(255, 255, 255, 0.9)',
							}}
						>
							<Typography
								sx={{
									fontSize: { xs: '0.8rem', sm: '1rem' },
									fontWeight: 600,
									cursor: 'pointer',
								}}
								onClick={() => setFlip(true)}
							>
								Learn More
							</Typography>
							{renderFavoriteIcon()}
						</Box>
					</Card>

					{/* Back Side */}
					<Card
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: 300,
							height: 450,
							boxShadow: 3,
							margin: '0 auto',
						}}
					>
						<CardActionArea>
							<CardContent
								sx={{
									padding: { xs: 1, sm: 2 },
									display: 'flex',
									flexDirection: 'column',
									height: '100%',
									justifyContent: 'space-between',
								}}
							>
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
									<Typography
										variant='body2'
										sx={{
											color: 'text.secondary',
											fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
											whiteSpace: 'normal',
											wordBreak: 'break-word',
										}}
									>
										Place of Origin: {art.place_of_origin}
									</Typography>
									<Typography
										variant='body2'
										sx={{
											color: 'text.secondary',
											fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
											whiteSpace: 'normal',
											wordBreak: 'break-word',
										}}
									>
										Type: {art.artwork_type_title}
									</Typography>
									<Typography
										variant='body2'
										sx={{
											color: 'text.secondary',
											fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
											whiteSpace: 'normal',
											wordBreak: 'break-word',
										}}
									>
										Medium: {art.medium_display}
									</Typography>
									<Typography
										variant='body2'
										sx={{
											color: 'text.secondary',
											fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
											whiteSpace: 'normal',
											wordBreak: 'break-word',
										}}
									>
										Description: {art?.thumbnail?.alt_text}
									</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'flex-end',
										position: 'absolute',
										mt: 50,
									}}
								>
									<Typography
										sx={{
											fontSize: { xs: '0.8rem', sm: '1rem' },
											fontWeight: 600,
											cursor: 'pointer',
											marginTop: 'auto',
										}}
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
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					zIndex: 1300,
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
