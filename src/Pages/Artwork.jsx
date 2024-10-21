import React, { useState, useEffect } from "react";
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
import ClearIcon from '@mui/icons-material/Clear';

const Artwork = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverImageId, setPopoverImageId] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handlePopClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverImageId(event.target.src)
  };
  const handleClose = () => {
    setAnchorEl(null);
    setPopoverImageId(null)
  };

  const [fav, setFav] = useState([]);
  useEffect(() => {
    setFav(JSON.parse(localStorage.getItem('favoritesList')));
  }, [])

  return (
    <div className="artwork-container">
      <div className='add-artwork'>
        <AddArtworkBtn />
      </div>
      <SelectFilter
        sx={{ width: '50%' }} />

      <div style={{ marginBottom: 50 }} className='favorites-list'>
        <h4>Favorite List</h4>
        <Grid2 margin='auto' container spacing={8} style={{ marginTop: "10px" }}>
          {fav?.map(art => (
            <Grid2 item xs={12} ms={5} key={art.id}>
              <Card sx={{ maxWidth: 300, maxHeight: 600, display: "flex" }}>
                <CardActionArea>
                  <CardMedia
                    style={{ width: 300, height: 300 }}
                    component="img"
                    image={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                    onClick={handlePopClick}
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
                    <Typography gutterBottom fontSize={16} fontWeight={500} component="div">{art.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.artist_title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.place_of_origin}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.date_end}</Typography>
                  </CardContent>
                  <ClearIcon style={{ margin: 10 }} />
                </CardActionArea>

              </Card>
            </Grid2>
          ))}
        </Grid2>
      </div>

      <div>
        <Grid2 margin='auto' container spacing={8} style={{ marginTop: "10px" }}>
          {Data.map((art, index) => (
            <Grid2 item xs={12} ms={5} key={index}>
              <Card sx={{ maxWidth: 300, maxHeight: 600, display: "flex" }}>
                <CardActionArea>
                  <CardMedia
                    style={{ width: 300, height: 300 }}
                    component="img"
                    image={art.image_id}
                    alt=""
                    onClick={handlePopClick}
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
                    <Typography gutterBottom fontSize={16} fontWeight={500} component="div">{art.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.artist_title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.place_of_origin}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.date_end}</Typography>
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