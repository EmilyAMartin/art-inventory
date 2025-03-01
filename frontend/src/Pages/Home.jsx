import React from 'react';
import SignUpBtn from '../components/SignUpBtn';
import LoginBtn from '../components/LoginBtn';

const Home = () => {
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
						<div style={{ display: 'flex', flexDirection: 'row', gap: 25 }}>
							<SignUpBtn />
							<LoginBtn />
						</div>
					</div>
					<div className='home-image-section'>
						<img
							src='./Images/home.png'
							alt='illustration of girl painting'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Home;
