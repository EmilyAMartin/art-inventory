import React, { useState } from 'react';
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';
import ReactCardFlip from 'react-card-flip';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const NewArtCard = ({ newArtwork, handleFavUpdate, handleDelete }) => {
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
		const updatedArtwork = { ...artwork };
		updatedArtwork.favorite = !updatedArtwork.favorite;
		setArtworkState(updatedArtwork);
		handleFavUpdate(updatedArtwork);
	};
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};
	if (newArtwork.length === 0) {
		return <div style={{ marginTop: 25 }}>No newArtwork available</div>;
	}
	return (
		<div
			style={{ marginTop: 25, display: 'flex', flexDirection: 'row', gap: 25 }}
		>
			{newArtwork.map((artwork, index) => (
				<Card
					sx={{ maxWidth: 345 }}
					key={index}
				>
					<CardActionArea>
						{artwork.images && artwork.images.length === 1 ? (
							<CardMedia
								style={{ width: 300, height: 400 }}
								component='img'
								height='150'
								src={artwork.images[0]}
								alt='Artwork Image'
								onClick={handlePopClick}
							/>
						) : (
							<Slider {...settings}>
								{artwork.images && artwork.images.length > 0 ? (
									artwork.images.map((image, imgIndex) => (
										<CardMedia
											component='img'
											height='150'
											src={image}
											alt={`Artwork Image ${imgIndex + 1}`}
											key={imgIndex}
											onClick={handlePopClick}
										/>
									))
								) : (
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										No images available for this artwork.
									</Typography>
								)}
							</Slider>
						)}
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
							{artwork.favorite ? (
								<Favorite onClick={handleFavClick} />
							) : (
								<FavoriteBorder onClick={handleFavClick} />
							)}

							<div
								style={{ fontSize: 15, fontWeight: 600 }}
								onClick={() => setFlip(!flip)}
							>
								Learn More
							</div>
						</div>
					</CardActionArea>
				</Card>
			))}
		</div>
	);
};

export default NewArtCard;
