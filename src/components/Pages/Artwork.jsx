import React, { useState, useEffect } from "react";
import { BsPlusCircle } from "react-icons/bs";

import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';
import Data from '../ArtData.json'

import Modal from '../Modal';
import { createPortal } from 'react-dom'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Artwork = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleButtonClick = () => {
    setModalOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="artwork-container">
      <div className='add-artwork'>
        <div>Add New Artwork</div>
        <div onClick={() => setModalOpen(true)} ><BsPlusCircle /></div>
        <div>
          {modalOpen && (
            createPortal(<Modal onSubmit={handleButtonClick} onCancel={handleButtonClick} onClose={handleButtonClick}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div>
                  <Typography gutterBottom variant="h5" component="div" paddingBottom={2} >Add New Artwork</Typography>
                </div>
                <div>

                  <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment- Title">Title</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-title"
                      endAdornment={
                        <InputAdornment position="end">
                        </InputAdornment>
                      }
                      label="title"
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-date">Date</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-date"
                      endAdornment={
                        <InputAdornment position="end">
                        </InputAdornment>
                      }
                      label="date"
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-medium">Medium</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-date"
                      endAdornment={
                        <InputAdornment position="end">
                        </InputAdornment>
                      }
                      label="medium"
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-location">Location</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-date"
                      endAdornment={
                        <InputAdornment position="end">
                        </InputAdornment>
                      }
                      label="location"
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-quantity">Quantity</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-date"
                      endAdornment={
                        <InputAdornment position="end">
                        </InputAdornment>
                      }
                      label="quantity"
                    />
                  </FormControl>

                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload files
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => console.log(event.target.files)}
                      multiple
                    />
                  </Button>
                </div>
              </Box>
            </Modal>, document.body)
          )}
        </div>
      </div>
      <div>
        <Button
          id="demo-positioned-button"
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          style={{ color: 'black' }}
        >
          Display
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleClose}>Recently Added</MenuItem>
          <MenuItem onClick={handleClose}>Favorites</MenuItem>
        </Menu>
      </div>
      <div>
        <Container maxWidth="lg">
          <Grid2 container spacing={5} style={{ marginTop: "20px" }}>
            {Data.map((result, index) => (
              <Grid2 item xs={12} ms={4} key={index}>
                <Card sx={{ maxWidth: 250 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={result.image}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {result.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {result.artist}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {result.date}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </div>

    </div>


  )
}

export default Artwork