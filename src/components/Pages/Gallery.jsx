import React, { useEffect } from "react";
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

import axios from 'axios'
import { useState } from 'react'

const Gallery = () => {

  //Working on API//
  const [quote, setQuote] = useState('')
  const getQuote = () => {
    axios.get('https://api.artic.edu/api/v1/artworks/129884')
      .then(res => {
        console.log(res)
        setQuote(res.data.data.title)
      }).catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="artwork-container">

      <div>
        <button onClick={getQuote}>Get Quote</button>
        {quote && <div>{quote}</div>}
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
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Untitled
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Artist Name
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