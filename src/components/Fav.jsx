import React, { useState } from 'react';
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';

const Fav = (art, id) => {
	const [artwork, setArtwork] = useState(art);
	const handleFavClick = (id) => {
		const selectedArtwork = artwork;
		selectedArtwork.favorite = !artwork.favorite;
		if (selectedArtwork.favorite === true) {
			const favoritesList =
				JSON.parse(localStorage.getItem('favoritesList')) ?? [];
			favoritesList.push(selectedArtwork);
			localStorage.setItem('favoritesList', JSON.stringify(favoritesList));
		} else if (selectedArtwork.favorite === false) {
			const favoritesList =
				JSON.parse(localStorage.getItem('favoritesList')) ?? [];

			const updatedFavoritesList = favoritesList.filter(
				(art) => art.id !== selectedArtwork.id
			);
			localStorage.setItem('favoritesList', JSON.stringify(updatedFavoritesList));
		}
		setReload(true);
	};
	return (
		<div>
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
		</div>
	);
};
export default Fav;
