import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';

const Gallery = () => {
  const [artwork, setArtwork] = useState([]);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts?userId=1")
    setArtwork(data)
  }

  return (
    <div className="artwork-container">
      <div>
        <Container maxWidth="lg">
          <Grid2 container spacing={5} style={{ marginTop: "10px" }}>
            {artwork.map(art => (
              <Grid2 item xs={12} ms={4} key={art.id}>
                <Card sx={{ maxWidth: 250 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image=""
                      alt=""
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {art.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {art.body}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        2023
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>

              </Grid2>
            ))}
          </Grid2>
        </Container>
      </div>
      <div>
      </div>

    </div>

  )
}

export default Gallery