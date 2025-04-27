import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from './Context';
import SignUpBtn from '../components/SignUpBtn';
import LoginBtn from '../components/LoginBtn';
import ArtPostCarousel from '../components/ArtPostCarousel';

const fetchPublicArtworks = async () => {
	const response = await fetch(
		'http://localhost:3000/artworks?visibility=public',
		{
			credentials: 'include',
		}
	);
	if (!response.ok) {
		throw new Error('Failed to fetch public artworks');
	}
	return response.json();
};

const Home = () => {
	const { currentUser } = useContext(AuthContext);
	const [comments, setComments] = useState([]);
	const {
		data: publicArtworks = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['publicArtworks'],
		queryFn: fetchPublicArtworks,
	});

	const handleCommentSubmit = (comment) => {
		setComments([...comments, comment]);
	};

	if (isLoading) {
		return <p>Loading public artworks...</p>;
	}

	if (isError) {
		return <p>Error: {error.message}</p>;
	}

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
							src='/art-inventory/Images/home.png'
							alt='Illustration of girl painting'
						/>
					</div>
				</div>
			</div>

			<div className='art-post-section'>
				<h2>New on Portfolio</h2>
				<ArtPostCarousel
					artworks={publicArtworks}
					onSubmitComment={handleCommentSubmit}
				/>
			</div>
		</div>
	);
};

export default Home;
