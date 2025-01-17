import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Slider from 'react-slick';
import CardMedia from '@mui/material/CardMedia';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ProjectCard() {
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		// Get project data from localStorage
		const storedProjectData = JSON.parse(localStorage.getItem('projectData'));
		if (storedProjectData && Array.isArray(storedProjectData)) {
			setProjects(storedProjectData); // Set the array of projects
		}
	}, []);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	if (projects.length === 0) {
		return <Typography variant='h6'>No projects available</Typography>;
	}

	return (
		<div>
			{projects.map((project, index) => (
				<Card
					sx={{ maxWidth: 345 }}
					key={index}
				>
					<CardActionArea>
						{/* If there's only one image, do not use Slider */}
						{project.images && project.images.length === 1 ? (
							<CardMedia
								component='img'
								height='150'
								src={project.images[0]} // Show only the first image if there is only one
								alt='Project Image'
							/>
						) : (
							<Slider {...settings}>
								{/* Render images conditionally inside Slider */}
								{project.images && project.images.length > 0 ? (
									project.images.map((image, imgIndex) => (
										<CardMedia
											component='img'
											height='150'
											src={image}
											alt={`Project Image ${imgIndex + 1}`}
											key={imgIndex}
										/>
									))
								) : (
									<Typography
										variant='body2'
										sx={{ color: 'text.secondary' }}
									>
										No images available for this project.
									</Typography>
								)}
							</Slider>
						)}
						<CardContent>
							<Typography
								gutterBottom
								variant='h5'
								component='div'
							>
								{project.title}
							</Typography>
							<Typography
								variant='body1'
								sx={{ color: 'text.secondary' }}
							>
								{project.medium}
							</Typography>
							<br />
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary' }}
							>
								{project.description}
							</Typography>
						</CardContent>
					</CardActionArea>
				</Card>
			))}
		</div>
	);
}
