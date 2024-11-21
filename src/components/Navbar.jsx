import React, { useState } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LoginBtn from "./LoginBtn";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav>
      <Link to="/" className="logo">
        <img src="./Images/Logo.png" alt="logo portfolio" />
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon style={{ margin: 10 }} />
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="Artwork">Artwork</NavLink>
        </li>
        <li>
          <NavLink to="Gallery">Gallery</NavLink>
        </li>
        <li>
          <NavLink to="Account">Account</NavLink>
        </li>
        <li style={{ marginTop: 6 }}>
          <LoginBtn />
        </li>
      </ul>
    </nav>
  );
};
