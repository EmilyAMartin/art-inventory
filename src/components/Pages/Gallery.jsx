import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Button from '@mui/material/Button';

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";

const SearchBar = ({ setSearchQuery }) => (
  <form>
    <TextField
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      label="Search Keyword"
      variant="outlined"
      placeholder="Search..."
      size="small"
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "black" }} />
    </IconButton>
  </form>
);

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    return data.filter((d) => d.toLowerCase().includes(query));
  }
};

const data = []



const Gallery = () => {
  const BASE_URL = "https://api.artic.edu/api/v1/artworks";
  const [artwork, setArtwork] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, data);

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
    fetchData();
    return () => {
      abortController.abort();
      setIsLoading(true);
    };
  }, [page]);

  return (
    <div id='galley-container' style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', margin: '2rem 7rem' }}>
      <div
        id='search-bar'
        style={{
          display: "flex",
          alignSelf: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 20
        }}
      >
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div style={{ padding: 3 }}>
          {dataFiltered.map((d) => (
            <div
              className="text"
              style={{
                padding: 5,
                justifyContent: "normal",
                fontSize: 20,
                color: "blue",
                margin: 1,
                width: "250px",
                BorderColor: "green",
                borderWidth: "10px"
              }}
              key={d.id}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      <div id='page-navigation'>
        <Button color='black' onClick={() => setPage(page - 1)}> Prev</Button>
        <Button color='black' onClick={() => setPage(page + 1)}> Next</Button>
        {error && <div>{error}</div>}
        {isLoading && <div>Loading...</div>}
      </div>

      <Grid2 margin='auto' container spacing={5} style={{ marginTop: "10px" }}>
        {artwork.map(art => (
          <Grid2 item xs={12} ms={5} key={art.id}>
            <Card sx={{ maxWidth: 200, maxHeight: 600, objectFit: 'scale-down' }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`}
                  alt=""
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">{art.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.artist_title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.place_of_origin}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.date_end}</Typography>
                  <FavoriteBorderIcon style={{ float: 'right', margin: "10" }} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </div>
  )
}
export default Gallery