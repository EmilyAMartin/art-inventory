import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import { IconButton, useMediaQuery } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import ArtworkPost from './ArtworkPost';
import { AuthContext } from '../Pages/Context';

function ArtPostCarousel({ artworks, onSubmitComment }) {
	const { currentUser } = useContext(AuthContext);
	const isSmallScreen = useMediaQuery('(max-width:600px)');
	const isTablet = useMediaQuery('(max-width:1024px)');
	let cardsPerPage;
	if (isSmallScreen) {
		cardsPerPage = 1;
	} else if (isTablet) {
		cardsPerPage = 3;
	} else {
		cardsPerPage = 5;
	}
	const containerWidth = cardsPerPage * 300;

	const [currentPage, setCurrentPage] = useState(0);
	const [slideDirection, setSlideDirection] = useState('left');

	const maxPage = Math.max(0, Math.ceil(artworks.length / cardsPerPage) - 1);
	const safeCurrentPage = Math.min(currentPage, maxPage);

	const handleNextPage = () => {
		const nextPage = Math.min(safeCurrentPage + 1, maxPage);
		if (safeCurrentPage < maxPage) {
			setSlideDirection('left');
			setCurrentPage(nextPage);
		}
	};

	const handlePrevPage = () => {
		const prevPage = Math.max(safeCurrentPage - 1, 0);
		if (safeCurrentPage > 0) {
			setSlideDirection('right');
			setCurrentPage(prevPage);
		}
	};

	const handleDotClick = (idx) => {
		setSlideDirection(idx > safeCurrentPage ? 'left' : 'right');
		setCurrentPage(idx);
	};

	const currentArtworks = artworks.slice(
		safeCurrentPage * cardsPerPage,
		safeCurrentPage * cardsPerPage + cardsPerPage
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
			{!(isSmallScreen || isTablet) && (
				<IconButton
					onClick={handlePrevPage}
					sx={{ margin: 5 }}
					disabled={safeCurrentPage === 0}
				>
					<NavigateBeforeIcon />
				</IconButton>
			)}

			<Box
				sx={{
					width: `${containerWidth}px`,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
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
								sx={{ width: '300px' }}
							>
								<ArtworkPost
									onSubmitComment={onSubmitComment}
									key={art.id}
									artwork={art}
									isLoggedIn={!!currentUser}
								/>
							</Box>
						))}
					</Stack>
				</Slide>
				<br />
				<br />
				<br />
				{(isSmallScreen || isTablet) && (
					<Stack
						direction='row'
						spacing={1}
						sx={{
							mt: 2,
							bgcolor: 'background.paper',
							borderRadius: 2,
							py: 0.5,
							px: 2,
							boxShadow: 1,
						}}
					>
						{Array.from({ length: maxPage + 1 }).map((_, idx) => (
							<IconButton
								key={idx}
								size='small'
								onClick={() => handleDotClick(idx)}
								sx={{
									color: idx === safeCurrentPage ? 'primary.main' : 'grey.400',
									width: 16,
									height: 16,
									padding: 0,
								}}
							>
								<Box
									sx={{
										width: 10,
										height: 10,
										borderRadius: '50%',
										bgcolor: idx === safeCurrentPage ? 'primary.main' : 'grey.400',
									}}
								/>
							</IconButton>
						))}
					</Stack>
				)}
			</Box>
			{!(isSmallScreen || isTablet) && (
				<IconButton
					onClick={handleNextPage}
					sx={{ margin: 5 }}
					disabled={safeCurrentPage >= maxPage}
				>
					<NavigateNextIcon />
				</IconButton>
			)}
		</Box>
	);
}

export default ArtPostCarousel;
