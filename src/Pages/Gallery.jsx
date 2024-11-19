
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid2 from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Card } from '@mui/material';


const Gallery = () => {
  const BASE_URL = "https://api.artic.edu/api/v1/artworks";
  const [artwork, setArtwork] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

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
              <div>Add Card</div>
            </Grid2>
          ))}
        </Grid2>

      </div>
    </div >
  )
}
export default Gallery
