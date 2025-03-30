import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Slider from 'react-slick';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ProjectCard({ projects, handleDelete }) {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	if (projects.length === 0) {
		return <div style={{ marginTop: 25 }}>No projects added</div>;
	}

	return (
		<div
			style={{ marginTop: 25, display: 'flex', flexDirection: 'row', gap: 25 }}
		>
			{projects.map((project, index) => (
				<Card
					sx={{ maxWidth: 300, maxHeight: 600 }}
					key={index}
				>
					<CardActionArea>
						{project.images && project.images.length === 1 ? (
							<CardMedia
								style={{ width: 300, height: 300 }}
								component='img'
								src={project.images[0]}
								alt='Project Image'
							/>
						) : (
							<Slider {...settings}>
								{project.images && project.images.length > 0 ? (
									project.images.map((image, imgIndex) => (
										<CardMedia
											component='img'
											style={{ width: 300, height: 300 }}
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
						<CardContent style={{ width: 300, height: 200 }}>
							<Typography
								gutterBottom
								fontSize={16}
								fontWeight={500}
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
							{/* Delete Button */}
							<IconButton
								aria-label='delete'
								color='black'
								sx={{
									position: 'absolute',
									bottom: 10,
									right: 10,
									zIndex: 2,
									'&:hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.04)',
									},
								}}
								onClick={(e) => {
									e.stopPropagation();
									handleDelete(index);
								}}
							>
								<DeleteIcon />
							</IconButton>
						</CardContent>
					</CardActionArea>
				</Card>
			))}
		</div>
	);
}
