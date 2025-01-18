import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Slider from 'react-slick';
import CardMedia from '@mui/material/CardMedia';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ProjectCard({ projects }) {
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
		<div
			style={{ marginTop: 25, display: 'flex', flexDirection: 'row', gap: 25 }}
		>
			{projects.map((project, index) => (
				<Card
					sx={{ maxWidth: 345 }}
					key={index}
				>
					<CardActionArea>
						{project.images && project.images.length === 1 ? (
							<CardMedia
								component='img'
								height='150'
								src={project.images[0]}
								alt='Project Image'
							/>
						) : (
							<Slider {...settings}>
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
