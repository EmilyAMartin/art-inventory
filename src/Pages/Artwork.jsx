import React, { useState, useEffect } from "react";
import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Data from '../components/ArtData.json'
import Popover from '@mui/material/Popover';
import AddArtworkBtn from "../components/AddArtworkBtn";
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';

const Artwork = () => {
  const [artwork, setArtwork] = useState([]);
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

  const handleFavClick = (id) => {
    const updateArtwork = artwork.map((item) => {
      return item.id === id ? { ...item, favorite: !item.favorite } : item;
    })
    setArtwork(updateArtwork);
    const selectedArtwork = updateArtwork.find((art) => art.id === id);
    if (selectedArtwork.favorite === true) {
      const favoritesList =
        JSON.parse(localStorage.getItem("favoritesList")) ?? [];
      favoritesList.push(selectedArtwork);
      localStorage.setItem("favoritesList", JSON.stringify(favoritesList));
    } else if (selectedArtwork.favorite === false) {
      const favoritesList =
        JSON.parse(localStorage.getItem("favoritesList")) ?? [];
      const updatedFavoritesList = favoritesList.filter(
        (art) => art.id !== selectedArtwork.id
      );
      localStorage.setItem(
        "favoritesList",
        JSON.stringify(updatedFavoritesList)
      );
    }
  };

  const [filter, setFilter] = useState([])
  useEffect(() => {
    setFilter(JSON.parse(localStorage.getItem('favoritesList')));
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 25, }}>
      <AddArtworkBtn />

      < div className="select-filter"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center'
        }}>
        <select
          style={{
            borderColor: 'lightgrey',
            borderRadius: '0.3rem',
            width: '25rem',
            height: '3rem',
            fontSize: '1rem',
          }}
          onChange={(e) => setFilter(e.target.value)}>
          <option value="recent">Recently Added</option>
          <option value="favorites">Favorites</option>
        </select>
        <div>
          <Grid2 margin='auto' container spacing={8} style={{ marginTop: "10px", justifyContent: 'space-around' }}>
            {filter?.map(art => (
              <Grid2 item xs={12} ms={5} key={art.id}>
                <Card sx={{ maxWidth: 300, maxHeight: 600, display: "flex" }}>
                  <CardActionArea>
                    <CardMedia
                      style={{ width: 300, height: 300 }}
                      component="img"
                      image={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
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
                    {art.favorite === true && (
                      <Favorite
                        style={{ margin: 10 }}
                        onClick={() => { handleFavClick(art.id) }}
                      />
                    )}
                    {art.favorite === false && (
                      <FavoriteBorder
                        style={{ margin: 10 }}
                        onClick={() => { handleFavClick(art.id) }}
                      />
                    )}
                  </CardActionArea>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </div>
      </div>

      <div>
        <Grid2 margin='auto' container spacing={8} style={{ marginTop: "10px", justifyContent: 'space-around' }}>
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