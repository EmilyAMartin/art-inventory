import React, { useContext, useState } from 'react';
import { AuthContext } from './Context'; // Import your AuthContext
import SignUpBtn from '../components/SignUpBtn';
import LoginBtn from '../components/LoginBtn';

import { Grid2, Container, Typography } from '@mui/material';
import ArtworkPost from '../components/ArtworkPost';

const Home = () => {
	// Get currentUser from AuthContext
	const { currentUser } = useContext(AuthContext);

	//New Test Section For Post//
	const [comments, setComments] = useState([]);

	const handleCommentSubmit = (comment) => {
		setComments([...comments, comment]);
	};

	const artwork = {
		title: 'Starry Night',
		artist: 'Vincent van Gogh',
		imageUrl: 'https://www.example.com/starry-night.jpg',
	};
	const posts = new Array(5).fill(artwork);

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
			<h2>What's new on Portfolio</h2>
			<Container sx={{ marginTop: '20px' }}>
				<Grid2
					container
					spacing={4}
					justifyContent='center'
				>
					{posts.map((artwork, index) => (
						<Grid2
							item
							xs={12}
							sm={6}
							md={4}
							lg={2}
							key={index}
						>
							<ArtworkPost
								artwork={artwork}
								onSubmitComment={handleCommentSubmit}
							/>
						</Grid2>
					))}
				</Grid2>
			</Container>
		</div>
	);
};

export default Home;
