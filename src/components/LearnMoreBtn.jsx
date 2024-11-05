import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LearnMoreBtn = () => {
  const [artwork, setArtwork] = useState([]);
  const [open, setOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleMouseEnter = () => { setIsHover(true); };
  const handleMouseLeave = () => { setIsHover(false); };

  const buttonStyle = {
    padding: '0.5rem',
    hover: '#6c63ff50',
    color: '#ffffff',
    outline: 'none',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: '0.2s',
    width: 150,
    backgroundColor: isHover ? '#4640ad' : '#6c63ff',
    color: isHover ? 'white' : 'white',
  }
  const modalStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    p: 4,
  };

  return (
    <div>
      <button style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => { handleOpen() }}>
        Learn More
      </button>
      {artwork.map(art => (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.description}</Typography>
          </Box>
        </Modal>
      ))}
    </div>
  )
}
export default LearnMoreBtn