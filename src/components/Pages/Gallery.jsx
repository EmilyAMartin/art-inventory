import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import Button from '@mui/material/Button';




const Gallery = () => {
  const [artwork, setArtwork] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get(
        `https://api.artic.edu/api/v1/artworks?&page=${page + 1}`
      )
      .then((res) => {
        setArtwork((prevState) => [...res.data.data]);
        console.log(res.data);
        return res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="artwork-container">

      <div >
        <Button
          disabled={page === 1}
          onClick={() => setPage((prevState) => prevState - 1)}
        >
          Prev
        </Button>
        <Button onClick={() => setPage(page + 1)}>
          Next
        </Button>

        <Grid2 margin='auto' container spacing={5} style={{ marginTop: "10px" }}>
          {artwork.map(art => (
            <Grid2 item xs={12} ms={5} key={art.id}>
              <Card sx={{ maxWidth: 200 }}>
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
    </div>
  )
}
export default Gallery