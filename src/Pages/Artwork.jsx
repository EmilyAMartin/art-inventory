import React, { useState } from "react";
import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Data from '../components/ArtData.json'
import SelectFilter from "../components/SelectFilter";
import Popover from '@mui/material/Popover';
import AddArtworkBtn from "../components/AddArtworkBtn";

const Artwork = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverImageId, setPopoverImageId] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverImageId(event.target.src)
  };
  const handleClose = () => {
    setAnchorEl(null);
    setPopoverImageId(null)
  };

  return (
    <div className="artwork-container">
      <div className='add-artwork'>
        <AddArtworkBtn />
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
                    onClick={handleClick}
                  />
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={popoverImageId}
                      alt=""
                    />
                  </Popover>
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