import React, { useContext, useState } from 'react';
import { AuthContext } from './Context'; // Import your AuthContext
import SignUpBtn from '../components/SignUpBtn';
import LoginBtn from '../components/LoginBtn';

import { Typography } from '@mui/material';
import ArtworkPost from '../components/ArtworkPost';
import Slider from 'react-slick'; // Import the carousel component

const Home = () => {
	// Get currentUser from AuthContext
	const { currentUser } = useContext(AuthContext);

	// New Test Section For Post
	const [comments, setComments] = useState([]);

	const handleCommentSubmit = (comment) => {
		setComments([...comments, comment]);
	};

	const artwork = {
		title: 'Untitled',
		artist: 'Emily Martin',
		imageUrl: 'Images/13.jpg',
	};
	const posts = new Array(10).fill(artwork);

	// Carousel settings
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		centerMode: true, // Centers the active slide, optional
		centerPadding: '0', // Optional: removes extra padding around the center slide
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<div className='App'>
			<div className='home-container'>
				<div className='home-banner-container'>
					<div className='home-bannerImage-container'></div>
					<div className='home-text-section'>
						<div className='home-heading'>Welcome to Portfolio,</div>
						<div className='home-primary-text'>
							Portfolio is a dynamic platform where artists can showcase their work,
							explore a curated gallery of masterpieces, and gain inspiration for their
							next project. Connect with fellow enthusiasts, discover new techniques,
							and celebrate creativity. Join us and ignite your passion for art!
						</div>
						{!currentUser && ( // Only show buttons if user is not logged in
							<div style={{ display: 'flex', flexDirection: 'row', gap: 25 }}>
								<SignUpBtn />
								<LoginBtn />
							</div>
						)}
					</div>
					<div className='home-image-section'>
						<img
							src='./Images/home.png'
							alt='illustration of girl painting'
						/>
					</div>
				</div>
			</div>

			{/* New Section */}
			<Typography>What's new on Portfolio</Typography>
			{/* Carousel component */}
			<Slider {...settings}>
				{posts.map((artwork, index) => (
					<div
						key={index}
						style={{ padding: '0 1rem' }}
					>
						{' '}
						{/* Add horizontal padding to each slide */}
						<ArtworkPost
							artwork={artwork}
							onSubmitComment={handleCommentSubmit}
						/>
					</div>
				))}
			</Slider>
			<br />
			<br />
			<br />
			<Typography>Trending on Portfolio</Typography>
			{/* Carousel component */}
			<Slider {...settings}>
				{posts.map((artwork, index) => (
					<div
						key={index}
						style={{ padding: '0 1rem' }}
					>
						{' '}
						{/* Add horizontal padding to each slide */}
						<ArtworkPost
							artwork={artwork}
							onSubmitComment={handleCommentSubmit}
						/>
					</div>
				))}
			</Slider>
			<br />
			<br />
			<br />
		</div>
	);
};

export default Home;
