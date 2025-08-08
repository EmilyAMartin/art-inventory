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
			? artwork.images[0].startsWith('http')
				? artwork.images[0]
				: `https://art-portfolio.fly.dev/uploads/${artwork.images[0]}`
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
							position: 'relative',
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
						</CardActionArea>

						{/* Learn More button outside CardActionArea */}
						<Typography
							sx={{
								position: 'absolute',
								bottom: 15,
								left: 15,
								fontSize: 15,
								fontWeight: 600,
								cursor: 'pointer',
								zIndex: 3,
								'&:hover': {
									color: 'primary.main',
								},
							}}
							onClick={() => setFlip(true)}
						>
							Learn More
						</Typography>
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
									gutterBottom
									fontSize={16}
									fontWeight={500}
								>
									{artwork.title}
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

export default PublicArtCard;
