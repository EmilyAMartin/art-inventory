import React, { useState } from 'react'
import "./Navbar.css";
import { Link, NavLink } from 'react-router-dom'
import { BsList } from "react-icons/bs";

import Modal from './Modal';
import { createPortal } from 'react-dom'


export const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleButtonClick = (value) => {
    setModalOpen(false);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <Link to="/" className='logo'><img src="./Images/Logo.png" alt="logo portfolio" /></Link>
      <div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
        <BsList />
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="Artwork">Artwork</NavLink></li>
        <li><NavLink to="Gallery">Gallery</NavLink></li>
        <li><NavLink to="Account">Account</NavLink></li>
        <button className="primary-button" onClick={() => setModalOpen(true)}>
          Login
        </button>
      </ul>
      {modalOpen && (
        createPortal(<Modal onSubmit={handleButtonClick} onCancel={handleButtonClick} onClose={handleButtonClick}>
          <div className='login-form-container'>
            <div className="login-header">Login</div>
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
            <span className="login-forgot-password">
              Forgot <a href="#">password?</a>
            </span>
          </div>
        </Modal>, document.body)
      )}
    </nav>
  );
};