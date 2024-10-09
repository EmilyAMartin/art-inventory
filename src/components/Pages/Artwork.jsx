import React, { useState, useEffect } from "react";
import { BsPlusCircle } from "react-icons/bs";

import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
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

import SelectFilter from "../SelectFilter";

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

  return (
    <div className="artwork-container">
      <div className='add-artwork'>
        <Button sx={{ backgroundColor: '#6c63ff', color: 'white', margin: 1 }} onClick={() => setModalOpen(true)}>Add New Artwork</Button>
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

      <SelectFilter sx={{ width: '50%' }} />

      <div>
        <Grid2 margin='auto' container spacing={8} style={{ marginTop: "10px" }}>
          {Data.map((result, index) => (
            <Grid2 item xs={12} ms={5} key={index}>
              <Card sx={{ maxWidth: 300, maxHeight: 600, display: "flex" }}>
                <CardActionArea>
                  <CardMedia
                    style={{ width: 300, height: 300 }}
                    component="img"
                    image={result.image}
                    alt=""
                  />
                  <CardContent style={{ width: 300, height: 200 }}>
                    <Typography gutterBottom variant="h6" component="div">{result.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{result.artist}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{result.date}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </div>

    </div>


  )
}

export default Artwork