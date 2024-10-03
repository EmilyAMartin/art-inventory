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

const Gallery = () => {
  const BASE_URL = "https://api.artic.edu/api/v1/artworks";
  const [artwork, setArtwork] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverImageId, setPopoverImageId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [fav, setFav] = useState([]);

  const addFavArtwork = (artwork) => {
    const newFavList = [...fav, artwork];
    localStorage.setItem("fav", JSON.stringify(newFavList));
    setFav(newFavList);
  }
  const handleFavClick = (event) => {
    addFavArtwork(fav);
    setAnchorEl(event.currentTarget);
    setPopoverImageId(event.target.src)
  };

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

  const fetchDataByKeyword = async () => {
    const response = await axios.get(`${BASE_URL}/search?q=${searchQuery}`);
    const data = response.data.data;
    const fetchedData = await Promise.all(
      data.map(async (art) => {
        return await fetchDataById(art.id);
      })
    );

    setArtwork(fetchedData);
    setIsLoading(true);
    setIsLoading(false);
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
  const handleDelete = async (id) => {
    await axios.get(`${BASE_URL}?page=${page}` + id, {
      method: 'DELETE'
    })
    const newArtwork = artwork.filter(art => art.id != id)
    setArtwork(newArtwork)
  }


  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}?page=${page}`, {
          signal,
        });
        setArtwork(data.data);
        setError(null);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Fetch aborted");
          return;
        }
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    {
      page > 0 &&
        fetchData();
      return () => {
        abortController.abort();
        setIsLoading(true);
      };
    }
  }, [page]);


  return (
    <div id='galley-container' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '2rem 7rem' }}>
      <div className='favorites-list'>
        <h3>Favorites</h3>
        <Grid2 margin='auto' container spacing={8} style={{ marginTop: "10px", marginBottom: "50px" }}>
          {fav.map(art => (
            <Grid2 item xs={12} ms={5} key={art.id}>
              <Card sx={{ maxWidth: 100, maxHeight: 200, }}>
                <CardActionArea>
                  <CardMedia
                    style={{ width: 100, height: 100 }}
                    component="img"
                    image={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
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
                    <Typography gutterBottom variant="h6" component="div">{art.title}</Typography>
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
        <Grid2 margin='auto' container spacing={8} style={{ marginTop: "10px" }}>
          {artwork.map(art => (
            <Grid2 item xs={12} ms={5} key={art.id}>
              <Card sx={{ maxWidth: 300, maxHeight: 600, }}>
                <CardActionArea>
                  <CardMedia
                    style={{ width: 300, height: 300 }}
                    component="img"
                    image={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                    alt=""
                    onClick={handleClick}
                    handleDelete={handleDelete}
                  />
                  <IconButton onClick={() => handleDelete(art.id)} >
                    <Favorite />
                  </IconButton>
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
                    <Typography gutterBottom variant="h6" component="div">{art.title}</Typography>
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
export default Gallery