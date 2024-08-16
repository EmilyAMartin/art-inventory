import React, {useState} from 'react'
import "./Navbar.css";
import { Link, NavLink } from 'react-router-dom'
import { createPortal } from "react-dom";
import Modal from "./Modal";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const handleButtonClick = (value) => {
    setModalOpen(false);};
 
    return (
    <nav>
        <Link to="/" className='logo'>Portfolio</Link>
        <div className='menu' onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
        </div>
        <ul className={menuOpen ? "open" : ""}>
            <li><NavLink to="Artwork">Artwork</NavLink></li>
            <li><NavLink to="Account">Account</NavLink></li>
            <li><NavLink to="Contact">Contact</NavLink></li>
            <button className="primary-button" onClick={() => setModalOpen(true)}>
            Login
          </button>
        </ul>

        <div className="login-modal">
        {modalOpen &&
          createPortal(
            <Modal
              closeModal={handleButtonClick}
              onSubmit={handleButtonClick}
              onCancel={handleButtonClick}
            >
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
            </Modal>,
            document.body
          )}
      </div>
      
    </nav>
  );
};