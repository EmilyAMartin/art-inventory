import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import NewArtCard from './NewArtCard';

function NewArtCarousel({ artworks, handleDeleteNewArtwork }) {
	const [currentPage, setCurrentPage] = useState(0);
	const [slideDirection, setSlideDirection] = useState('left');

	const cardsPerPage = 6;
	const containerWidth = cardsPerPage * 250;

	const handleNextPage = () => {
		if (currentPage < Math.ceil((artworks || []).length / cardsPerPage) - 1) {
			setSlideDirection('left');
			setCurrentPage((prevPage) => prevPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 0) {
			setSlideDirection('right');
			setCurrentPage((prevPage) => prevPage - 1);
		}
	};

	const currentArtworks = (artworks || []).slice(
		currentPage * cardsPerPage,
		currentPage * cardsPerPage + cardsPerPage
	);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				height: '400px',
				width: '100%',
				marginTop: '40px',
			}}
		>
			<IconButton
				onClick={handlePrevPage}
				sx={{ margin: 5 }}
				disabled={currentPage === 0}
			>
				<NavigateBeforeIcon />
			</IconButton>
			<Box sx={{ width: `${containerWidth}px`, height: '100%' }}>
				<Slide
					direction={slideDirection}
					in={true}
				>
					<Stack
						spacing={2}
						direction='row'
						alignContent='center'
						justifyContent='center'
						sx={{ width: '100%', height: '100%' }}
					>
						{currentArtworks.map((art, i) => (
							<Box
								key={`art-${i}`}
								sx={{ width: '250px' }}
							>
								<NewArtCarousel
									artworks={artworks} // Pass the entire artworks array
									handleDeleteNewArtwork={handleDeleteNewArtwork}
								/>
							</Box>
						))}
					</Stack>
				</Slide>
			</Box>
			<IconButton
				onClick={handleNextPage}
				sx={{ margin: 5 }}
				disabled={currentPage >= Math.ceil(artworks.length / cardsPerPage) - 1}
			>
				<NavigateNextIcon />
			</IconButton>
		</Box>
	);
}

export default NewArtCarousel;
