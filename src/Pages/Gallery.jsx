import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Favorite } from '@mui/icons-material';
import { FavoriteBorder } from '@mui/icons-material';

import { createPortal } from 'react-dom'
import LearnMoreModal from '../components/LearnMoreModal';
import Box from '@mui/material/Box';

const Gallery = () => {
  const BASE_URL = "https://api.artic.edu/api/v1/artworks";
  const [artwork, setArtwork] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverImageId, setPopoverImageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false)
  const handleModalButtonClick = (event) => {
    setModalOpen(false);
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

  const fetchDataByKeyword = async () => {
    setIsLoading(true);
    const response = await axios.get(`${BASE_URL}/search?q=${searchQuery}`);
    const data = response.data.data;
    const fetchedData = await Promise.all(
      data.map(async (art) => {
        return await fetchDataById(art.id);
      })
    );
    setIsLoading(false);
    setArtwork(fetchedData);
    setPage(0)
  };

  const fetchDataById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data.data;
  };

  const handleReset = () => {
    setPage(1);
    setSearchQuery("");
  }

  useEffect(() => {

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${BASE_URL}?page=${page}`);
        const favoritesList = JSON.parse(localStorage.getItem("favoritesList"));
        const dataWithFavorites = data.data.map((art) => {
          const isFavorite = favoritesList?.some((fav) => fav.id === art.id)
          return { ...art, favorite: isFavorite };
        })
        setArtwork(dataWithFavorites);
        setError(null);

      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        setError(error.message);

      } finally {
        setIsLoading(false);
      }
    };
    if (page > 0) {
      fetchData()
    }
    return () => {
      setIsLoading(true);
    };
  }, [page]);

  return (
    <div id='galley-container' style={{ display: 'flex', flexDirection: 'column' }}>
      <div className='search-bar' style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField
          id="search-bar"
          value={searchQuery}
          className="text"
          onInput={(e) => {
            setSearchQuery(e.target.value);
          }}
          label="Search Keyword"
          variant="outlined"
          placeholder="Search..."
          size="small"
        />
        <IconButton type="submit" onClick={fetchDataByKeyword} aria-label="search">
          <SearchIcon style={{ fill: "black" }} />
        </IconButton>
        <Button onClick={handleReset}>Reset </Button>
      </div>

      {page > 0 && (
        <div id='page-navigation'>
          <Button disabled={page === 1} color='black' onClick={() => setPage(page - 1)} > Prev</Button>
          <Button color='black' onClick={() => setPage(page + 1)}> Next</Button>
          {error && <div>{error}</div>}
        </div>
      )}

      <div className='galley-artwork'>
        {isLoading === true && <div>Loading...</div>}
        <Grid2 margin='auto' container spacing={8} style={{ marginTop: "10px", justifyContent: 'space-around' }}>
          {artwork.map(art => (
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
                      vertical: 'center',
                      horizontal: 'center',
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

                    <div className='learn-more-modal'>
                      <button style={{ color: "black" }} onClick={() => setModalOpen(true)}>
                        Learn More
                      </button>
                      {modalOpen && (
                        createPortal(
                          <LearnMoreModal
                            onClose={handleModalButtonClick}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                              <div>
                                <Typography gutterBottom variant="h5" component="div" paddingBottom={2} paddingLeft={12}>Description</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.description}</Typography>
                              </div>
                            </Box>
                          </LearnMoreModal>, document.body)
                      )}
                    </div>
                  </div>
                </CardActionArea>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </div>
    </div>
  )
}
export default Gallery