import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import ProjectCard from './ProjectCard';

function ProjectCardCarousel({ projects, handleDeleteProject }) {
	const [currentPage, setCurrentPage] = useState(0);
	const [slideDirection, setSlideDirection] = useState('left');

	const cardsPerPage = 3; // Number of cards to display per page
	const containerWidth = cardsPerPage * 300; // Adjust based on card width

	const handleNextPage = () => {
		if (currentPage < Math.ceil(projects.length / cardsPerPage) - 1) {
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

	const currentProjects = projects.slice(
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
				disabled={currentPage === 0}
			>
				<NavigateBeforeIcon />
			</IconButton>

			{/* Carousel Content */}
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
						{currentProjects.map((project, i) => (
							<Box
								key={`project-${i}`}
								sx={{ width: '300px' }}
							>
								<ProjectCard
									project={project}
									handleDelete={() => handleDeleteProject(project.id)}
								/>
							</Box>
						))}
					</Stack>
				</Slide>
			</Box>

			{/* Next Button */}
			<IconButton
				onClick={handleNextPage}
				sx={{ margin: 5 }}
				disabled={currentPage >= Math.ceil(projects.length / cardsPerPage) - 1}
			>
				<NavigateNextIcon />
			</IconButton>
		</Box>
	);
}

export default ProjectCardCarousel;
