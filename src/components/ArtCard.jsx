import React, { useState } from 'react';
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';
import ReactCardFlip from 'react-card-flip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Popover from '@mui/material/Popover';

const ArtCard = ({ art, id }) => {
	const [reload, setReload] = useState(false);
	const [artwork, setArtwork] = useState(art);
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
	const handleFavClick = (id) => {
		const selectedArtwork = artwork;
		selectedArtwork.favorite = !artwork.favorite;
		if (selectedArtwork.favorite === true) {
			const favoritesList =
				JSON.parse(localStorage.getItem('favoritesList')) ?? [];
			favoritesList.push(selectedArtwork);
			localStorage.setItem('favoritesList', JSON.stringify(favoritesList));
			setReload(true);
		} else if (selectedArtwork.favorite === false) {
			const favoritesList =
				JSON.parse(localStorage.getItem('favoritesList')) ?? [];
			setReload(true);
			const updatedFavoritesList = favoritesList.filter(
				(art) => art.id !== selectedArtwork.id
			);
			localStorage.setItem('favoritesList', JSON.stringify(updatedFavoritesList));
		}
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
						image={
							art.image_path
								? art.image_path
								: `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`
						}
						alt=''
						onClick={handlePopClick}
					/>
					<Popover
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						id={id}
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
						{artwork.favorite === true && (
							<Favorite
								onClick={() => {
									handleFavClick(art.id);
								}}
							/>
						)}

						{artwork.favorite === false && (
							<FavoriteBorder
								onClick={() => {
									handleFavClick(art.id);
								}}
							/>
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
						<br></br>
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Artist: {art.artist_title}
						</Typography>
						<br></br>
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Date: {art.date_end}
						</Typography>
						<br></br>
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Place of Origin: {art.place_of_origin}
						</Typography>
						<br></br>
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Type: {art.artwork_type_title}
						</Typography>
						<br></br>
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Medium: {art.medium_display}
						</Typography>
						<br></br>
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
							style={{ fontSize: 15, fontWeight: 600 }}
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
