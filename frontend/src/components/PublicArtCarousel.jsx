import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import PublicArtCard from './PublicArtCard';

function PublicArtCarousel({ artworks }) {
	const [currentPage, setCurrentPage] = useState(0);
	const [slideDirection, setSlideDirection] = useState('left');
	const [isSliding, setIsSliding] = useState(false); // Prevent rapid clicks during animation

	const cardsPerPage = 5; // Number of cards to display per page
	const containerWidth = cardsPerPage * 300; // Adjust based on card width

	const handleNextPage = () => {
		if (
			currentPage < Math.ceil(artworks.length / cardsPerPage) - 1 &&
			!isSliding
		) {
			setSlideDirection('left');
			setIsSliding(true); // Disable further clicks during animation
			setTimeout(() => {
				setCurrentPage((prevPage) => prevPage + 1);
				setIsSliding(false); // Re-enable clicks after animation
			}, 300); // Match the Slide animation duration
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 0 && !isSliding) {
			setSlideDirection('right');
			setIsSliding(true); // Disable further clicks during animation
			setTimeout(() => {
				setCurrentPage((prevPage) => prevPage - 1);
				setIsSliding(false); // Re-enable clicks after animation
			}, 300); // Match the Slide animation duration
		}
	};

	const currentArtworks = artworks.slice(
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
			{/* Previous Button */}
			<IconButton
				onClick={handlePrevPage}
				sx={{ margin: 5 }}
				disabled={currentPage === 0 || isSliding}
			>
				<NavigateBeforeIcon />
			</IconButton>

			{/* Carousel Content */}
			<Box sx={{ width: `${containerWidth}px`, height: '100%' }}>
				<Slide
					direction={slideDirection}
					in={!isSliding}
					mountOnEnter
					unmountOnExit
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
								sx={{ width: '300px' }}
							>
								<PublicArtCard artwork={art} />
							</Box>
						))}
					</Stack>
				</Slide>
			</Box>

			{/* Next Button */}
			<IconButton
				onClick={handleNextPage}
				sx={{ margin: 5 }}
				disabled={
					currentPage >= Math.ceil(artworks.length / cardsPerPage) - 1 || isSliding
				}
			>
				<NavigateNextIcon />
			</IconButton>
		</Box>
	);
}

export default PublicArtCarousel;
