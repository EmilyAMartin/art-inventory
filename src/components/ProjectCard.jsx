import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Slider from 'react-slick';
import CardMedia from '@mui/material/CardMedia';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ProjectCard() {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardActionArea>
				<Slider {...settings}>
					<CardMedia
						component='img'
						height='150'
						src='./Images/13.jpg'
						alt='artwork'
					/>
					<CardMedia
						component='img'
						height='150'
						src='./Images/14.jpg'
						alt='artwork'
					/>
					<CardMedia
						component='img'
						height='150'
						src='./Images/15.jpg'
						alt='artwork'
					/>
					<CardMedia
						component='img'
						height='150'
						src='./Images/16.jpg'
						alt='artwork'
					/>
					<CardMedia
						component='img'
						height='150'
						src='./Images/17.jpg'
						alt='artwork'
					/>
				</Slider>

				<CardContent>
					<Typography
						gutterBottom
						variant='h5'
						component='div'
					>
						Title
					</Typography>
					<Typography
						variant='body1'
						sx={{ color: 'text.secondary' }}
					>
						Medium
					</Typography>
					<br />
					<Typography
						variant='body2'
						sx={{ color: 'text.secondary' }}
					>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste esse nobis
						veritatis voluptates voluptatum necessitatibus, doloremque eaque natus sed
						quod ut blanditiis atque a ea rem corporis laudantium sint ex.
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
