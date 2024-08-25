import React from 'react'
import Modal from '../Modal'
import { useState } from 'react'
import { createPortal } from 'react-dom'

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleButtonClick = () => {
    setModalOpen(false);
  };

  return (
    <div className="App">
      <div className="home-container">
        <div className="home-banner-container">
          <div className="home-bannerImage-container"></div>
          <div className="home-text-section">
            <div className="home-heading">Lorem ipsum</div>
            <div className="home-primary-text">
              Lorem ipsum dolor sit amet consectetur. Ullamcorper elementum
              aliquam fermentum orci. Tristique quis a sit eget. Quis donec
              risus varius aenean pharetra cursus tellus magna ut.Quam ornare
              quis in sit faucibus ut dolor.
            </div>
            <button className="secondary-button" onClick={() => setModalOpen(true)}>Sign Up</button>
          </div>
          <div className="home-image-section">
            <img src="./Images/homeimg.png" alt="illustration of girl painting" />
          </div>
        </div>
      </div>
      {modalOpen && (
        createPortal(<Modal onSubmit={handleButtonClick} onCancel={handleButtonClick} onClose={handleButtonClick}>
          <h1>This is the modal header</h1>
          <p>This is the modal description</p>
        </Modal>, document.body)
      )}
    </div>
  )
}
export default Home