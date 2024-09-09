import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';


import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';
import Data from '../ArtData.json'



const Gallery = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts")
    setPosts(data)
  }

  return (
    <div className="artwork-container">
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h5>{post.title}</h5>
            <p>{post.body}</p>
          </div>
        ))}
      </div>

      <div>
        <Container maxWidth="lg">
          <Grid2 container spacing={5} style={{ marginTop: "10px" }}>
            {Data.map((result, index) => (
              <Grid2 item xs={12} ms={4} key={index}>
                <Card sx={{ maxWidth: 250 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={result.image}
                      alt=""
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {result.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {result.artist}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {result.date}
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