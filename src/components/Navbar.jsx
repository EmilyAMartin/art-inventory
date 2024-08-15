import React, {useState} from 'react'
import "./Navbar.css";
import { Link, NavLink } from 'react-router-dom'

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
 
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
        </ul>
    </nav>
  );
};