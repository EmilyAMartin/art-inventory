import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './Context';
import SignUpBtn from '../components/SignUpBtn';
import LoginBtn from '../components/LoginBtn';
import ArtworkPost from '../components/ArtworkPost';

const Home = () => {
	const { currentUser } = useContext(AuthContext);
	const [comments, setComments] = useState([]);
	const [publicArtworks, setPublicArtworks] = useState([]); // State for public artworks

	const handleCommentSubmit = (comment) => {
		setComments([...comments, comment]);
	};

	// Fetch public artworks
	useEffect(() => {
		const fetchPublicArtworks = async () => {
			try {
				const response = await fetch(
					'http://localhost:3000/artworks?visibility=public',
					{
						credentials: 'include',
					}
				);
				if (!response.ok) {
					throw new Error('Failed to fetch public artworks');
				}
				const data = await response.json();
				setPublicArtworks(data);
			} catch (error) {
				console.error('Error fetching public artworks:', error);
			}
		};

		fetchPublicArtworks();
	}, []);

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
						{!currentUser && (
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

			{/* New Art Section */}

			<h2>New on Portfolio</h2>
			<div style={{ display: 'flex', marginTop: '1rem', gap: '1rem' }}>
				{publicArtworks.map((artwork, index) => (
					<div key={index}>
						<ArtworkPost
							artwork={artwork}
							onSubmitComment={handleCommentSubmit}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
