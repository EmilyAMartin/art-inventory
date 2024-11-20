import React, { useState, useEffect } from "react";
import Grid2 from '@mui/material/Grid2';
import Data from '../components/ArtData.json'
import AddArtworkBtn from "../components/AddArtworkBtn";
import ArtCard from "../components/ArtCard";

const Artwork = () => {
  const [artwork, setArtwork] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setIsLoading(false)
    setArtwork(Data)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 25, }}>
      <AddArtworkBtn />
      < div className="select-filter" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
        <select style={{ borderColor: 'lightgrey', borderRadius: '0.3rem', width: '25rem', height: '3rem', fontSize: '1rem' }}
          onChange={(e) => handleFilterChange(e)}>
          <option value="recent">Recently Added</option>
          <option value="favorites">Favorites</option>
        </select>

        <div>
          {isLoading === true && <div style={{ marginTop: 25 }} >No Favorites Added</div>}
          <Grid2 margin='auto' container spacing={8} style={{ marginTop: "25px", marginBottom: "50px", justifyContent: 'space-around' }}>
            {artwork.map(art => (
              <Grid2 item xs={12} ms={5} key={art.id}>
                <ArtCard art={art} />
              </Grid2>
            ))}
          </Grid2>
        </div>
      </div>
    </div>
  )
}

export default Artwork