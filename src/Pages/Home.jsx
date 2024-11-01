import React from 'react'
import SignUpBtn from '../components/SignUpBtn'
import LoginBtn from '../components/LoginBtn'

const Home = () => {
  return (

    <div className="App">
      <div className="home-container">
        <div className="home-banner-container">
          <div className="home-bannerImage-container"></div>
          <div className="home-text-section">
            <div className="home-heading">Welcome to Portfolio</div>
            <div className="home-primary-text">
              Your vibrant online platform where artists of all levels can showcase
              their own artworks, delve into an extensive gallery of masterpieces
              from renowned artists, and find endless inspiration for their next project.
              Whether you're looking to exhibit your creations, connect with fellow art enthusiasts,
              or explore the styles and techniques of the greats, Portfolio is your go-to platform
              for artistic expression and discovery. Join us in celebrating creativity and igniting your passion for art!
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 25 }}>
              <SignUpBtn />
              <LoginBtn />
            </div>
          </div>
          <div className="home-image-section">
            <img src="./Images/homeimg.png" alt="illustration of girl painting" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home