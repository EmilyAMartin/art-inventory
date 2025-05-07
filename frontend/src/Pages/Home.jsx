import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from './Context';
import SignUpBtn from '../components/SignUpBtn';
import LoginBtn from '../components/LoginBtn';
import ArtPostCarousel from '../components/ArtPostCarousel';
import { Box, Typography } from '@mui/material';
import { BASE_URL } from '../config';

const fetchPublicArtworks = async () => {
	const response = await fetch(`${BASE_URL}/artworks?visibility=public`, {
		credentials: 'include',
	});
	if (!response.ok) throw new Error('Failed to fetch public artworks');
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

	if (isLoading) return <Typography>Loading public artworks...</Typography>;
	if (isError) return <Typography>Error: {error.message}</Typography>;

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				margin: 10,
				gap: 4, // Maintain spacing between sections
			}}
		>
			{/* Hero Section */}
			<Box
				sx={{
					position: 'relative',
					display: 'flex',
					flexDirection: { xs: 'column-reverse', md: 'row' },
					alignItems: { xs: 'center', md: 'initial' },
					justifyContent: { xs: 'center', md: 'initial' },
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: '-100px',
						right: '-170px',
						zIndex: -2,
						maxWidth: {
							xs: '0px',
							sm: '450px',
							md: '600px',
							lg: '700px',
						},
						display: { xs: 'none', sm: 'block' },
					}}
				/>

				{/* Left Content */}
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: { xs: 'center', md: 'flex-start' },
						gap: '1rem',
						mt: { xs: '4rem', md: 0 },
					}}
				>
					<Typography
						variant='h2'
						sx={{
							fontSize: {
								xs: '2rem',
								sm: '3rem',
								md: 'clamp(2rem, 5vw, 3.5rem)',
							},
							fontWeight: 600,
							color: '#000',
							maxWidth: { xs: '90%', md: '600px' },
							textAlign: { xs: 'center', md: 'left' },
						}}
					>
						Welcome to Portfolio,
					</Typography>

					<Typography
						sx={{
							fontSize: {
								xs: '1rem',
								sm: '1.2rem',
								md: 'clamp(1rem, 3vw, 1.5rem)',
							},
							maxWidth: { xs: '80%', md: '500px' },
							color: '#000',
							textAlign: { xs: 'center', md: 'left' },
							my: '1rem',
						}}
					>
						Portfolio is a dynamic platform where artists can showcase their work,
						explore a curated gallery of masterpieces, and gain inspiration for their
						next project. Connect with fellow enthusiasts, discover new techniques,
						and celebrate creativity. Join us and ignite your passion for art!
					</Typography>

					{!currentUser && (
						<Box sx={{ display: 'flex', flexDirection: 'row', gap: '25px' }}>
							<SignUpBtn />
							<LoginBtn />
						</Box>
					)}
				</Box>

				{/* Right Content */}
				<Box
					sx={{
						flex: 1,
						width: '100%',
						display: 'flex',
						justifyContent: 'right',
					}}
				>
					<Box
						component='img'
						src='/art-inventory/Images/home.png'
						alt='Illustration of girl painting'
						sx={{
							width: {
								xs: '100%',
								sm: '90%',
								md: '80%',
								lg: '100%',
							},
							maxWidth: {
								xs: '350px',
								sm: '400px',
								md: '500px',
								lg: '700px',
							},
							height: 'auto',
						}}
					/>
				</Box>
			</Box>

			{/* Public Artwork Section */}
			<Box
				sx={{
					pb: 10,
				}}
			>
				<Typography variant='h6'>New on Portfolio</Typography>
				<ArtPostCarousel
					artworks={publicArtworks}
					onSubmitComment={setComments}
				/>
			</Box>
		</Box>
	);
};

export default Home;
