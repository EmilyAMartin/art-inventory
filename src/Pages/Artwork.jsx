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
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';

const Artwork = () => {
  const [artwork, setArtwork] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverImageId, setPopoverImageId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  const handleModalOpen = (id) => {
    console.log(id)
    setOpenModal(true);
  }
  const handleModalClose = () => {
    setOpenModal(false);
  }

  const handlePopClick = (event) => {
    setAnchorEl(event.currentTarget);
    setPopoverImageId(event.target.src)
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
    setPopoverImageId(null)
  };

  const handleFilterChange = (e) => {
    if (e.target.value === "recent") {
      setArtwork(Data);
      setIsLoading(false);
    } else if (e.target.value === "favorites") {
      setIsLoading(true);
      setArtwork(JSON.parse(localStorage.getItem('favoritesList')));
      setIsLoading(false)
    }
  }
  const handleFavClick = (id) => {

    const updateArtwork = artwork.map((item) => {
      return item.id === id ? { ...item, favorite: !item.favorite } : item;
    })
    console.log(id)
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
  useEffect(() => {
    setIsLoading(false)
    setArtwork(Data)
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
          onChange={(e) => handleFilterChange(e)}>
          <option value="recent">Recently Added</option>
          <option value="favorites">Favorites</option>
        </select>

        <div>
          {isLoading === true && <div style={{ marginTop: 25 }} >No Favorites Added</div>}
          <Grid2 margin='auto' container spacing={8} style={{ marginTop: "25px", justifyContent: 'space-around' }}>
            {artwork.map(art => (
              <Grid2 item xs={12} ms={5} key={art.id}>
                <Card sx={{ maxWidth: 300, maxHeight: 600, display: "flex" }}>
                  <CardActionArea>
                    <CardMedia
                      style={{ width: 300, height: 300 }}
                      component="img"
                      image={art.image_path ? art.image_path : `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                      onClick={handlePopClick}
                    />
                    <Popover
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      anchorReference="none"
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
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: 25 }}>
                      {art.favorite === true && (
                        <Favorite
                          onClick={() => { handleFavClick(art.id) }}
                        />
                      )}
                      {(art.favorite === undefined || art.favorite === false) && (
                        <FavoriteBorder
                          onClick={() => { handleFavClick(art.id) }}
                        />
                      )}
                      <div>
                        <Button color='black'
                          onClick={handleModalOpen}>
                          Learn More
                        </Button>
                        <Modal
                          open={openModal}
                          onClose={handleModalClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={modalStyle}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.description}</Typography>
                          </Box>
                        </Modal>
                      </div>
                    </div>
                  </CardActionArea>
                </Card>
              </Grid2>
            ))}
          </Grid2>

        </div>
      </div>
    </div>
  )
}

export default Artwork