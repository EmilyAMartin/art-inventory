import React, { useState } from 'react'
import "./Navbar.css";
import { Link, NavLink } from 'react-router-dom'
import { BsList } from "react-icons/bs";

import Modal from './Modal';
import { createPortal } from 'react-dom'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

export const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleButtonClick = (value) => {
    setModalOpen(false);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

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
        <li><NavLink to="Favorites">Favorites</NavLink></li>
        <li><NavLink to="Account">Account</NavLink></li>
        <button className="primary-button" onClick={() => setModalOpen(true)}>
          Login
        </button>
      </ul>
      {modalOpen && (
        createPortal(<Modal onSubmit={handleButtonClick} onCancel={handleButtonClick} onClose={handleButtonClick}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div>
              <Typography gutterBottom variant="h5" component="div" paddingBottom={2} paddingLeft={12}>Login</Typography>
              <Typography gutterBottom variant="h7" component="div" paddingBottom={1}>Welcome, please login to continue</Typography>
            </div>
            <div>
              <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-email"> Email</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email"
                  endAdornment={
                    <InputAdornment position="end">
                    </InputAdornment>
                  }
                  label="Email"
                />
              </FormControl>
              <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <Checkbox /> Remember Password
            </div>
          </Box>
        </Modal>, document.body)
      )}
    </nav >
  );
};