import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

const Gallery = () => {
  const [artwork, setArtwork] = useState([]);
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    const response = await axios.get("https://api.artic.edu/api/v1/artworks?page=2")
    setArtwork(response.data.data)
  }

  const [search, setSearch] = useState([]);
  useEffect(() => {
    searchArtwork()
  }, [])
  const searchArtwork = async () => {
    const response = await axios.get("https://api.artic.edu/api/v1/artworks")
    setSearch(response.data.data)
  }

  return (
    <div className="artwork-container">
      <div>

        <Stack spacing={2} sx={{ width: 300 }} style={{ paddingLeft: 10 }}>
          <Autocomplete
            disableClearable
            options={search.map((response) => response.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    type: 'search',
                  },
                }}
              />
            )}
          />
        </Stack>

        <Container maxWidth="lg">
          <Grid2 container spacing={5} style={{ marginTop: "10px" }}>
            {artwork.map(art => (
              <Grid2 item xs={12} ms={4} key={art.id}>
                <Card sx={{ maxWidth: 250 }}>
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
        </Container>
      </div>
    </div>
  )
}
export default Gallery