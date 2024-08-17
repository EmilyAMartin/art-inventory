import React, { useState } from 'react'
import "./Navbar.css";
import { Link, NavLink } from 'react-router-dom'
import { BsList } from "react-icons/bs";

export const Navbar = () => {
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
        <li><NavLink to="Account">Account</NavLink></li>
        <li><NavLink to="Contact">Contact</NavLink></li>
        <button className="primary-button" onClick={() => setModalOpen(true)}>
          Login
        </button>
      </ul>
    </nav>
  );
};