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
          <div className='registration-container'>
            <div className="registration-header">Sign Up</div>
            <div className="registration-primary-text">{" "}
              Please fill in this form to create an account.
            </div>

            <label for="email">
              <b>Email</b>
            </label>
            <input
              aria-label="email"
              type="text"
              placeholder="Enter Email"
              name="email"
              required
            />

            <label for="password">
              <b>Password</b>
            </label>
            <input
              aria-label="password"
              type="text"
              placeholder="Enter Password"
              name="password"
              required
            />

            <label for="repeat-password">
              <b>Repeat Password</b>
            </label>
            <input
              aria-label="repeat-password"
              type="text"
              placeholder="Repeat Password"
              name="repeat-password"
              required
            />

            <label>
              <input
                aria-label="remember-me-checkbox"
                type="checkbox"
                checked="checked"
                name="remember"
                style={{ marginRight: "0.5rem" }}
              />
              Remember me
            </label>
          </div>
        </Modal>, document.body)
      )}
    </div>
  )
}
export default Home