import { useState, useEffect } from 'react';
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';
import ReactCardFlip from 'react-card-flip';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Tooltip from '@mui/material/Tooltip';

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
		if (!isLoggedIn) {
			return;
		}
		handleFavUpdate(art.id, !art.favorite);
	};

	const FavoriteIcon = () => {
		if (!isLoggedIn) {
			return (
				<Tooltip title='Log in to favorite artwork'>
					<div style={{ cursor: 'not-allowed' }}>
						<FavoriteBorder style={{ opacity: 0.5 }} />
					</div>
				</Tooltip>
			);
		}

		return art.favorite ? (
			<Favorite
				onClick={handleFavClick}
				style={{ cursor: 'pointer' }}
			/>
		) : (
			<FavoriteBorder
				onClick={handleFavClick}
				style={{ cursor: 'pointer' }}
			/>
		);
	};

	return (
		<ReactCardFlip
			isFlipped={flip}
			flipDirection='horizontal'
		>
			<Card
				className='card-font'
				sx={{ maxWidth: 300, maxHeight: 600, display: 'flex' }}
			>
				<CardActionArea>
					<CardMedia
						style={{ width: 300, height: 300 }}
						component='img'
						image={art.image_url}
						alt='Artwork'
						onClick={handlePopClick}
					/>
					<Popover
						sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
						id={art.id}
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
						<Typography
							gutterBottom
							fontSize={16}
							fontWeight={500}
							component='div'
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
					</CardContent>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							margin: 25,
						}}
					>
						<FavoriteIcon />

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
				sx={{ maxWidth: 300, maxHeight: 600, display: 'flex' }}
			>
				<CardActionArea>
					<CardContent style={{ width: 300, height: 500 }}>
						<Typography
							gutterBottom
							fontSize={16}
							fontWeight={500}
							component='div'
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
				</CardActionArea>
			</Card>
		</ReactCardFlip>
	);
};

export default ArtCard;
