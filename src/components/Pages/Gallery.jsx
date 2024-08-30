import React from "react";
import ArtCard from "../ArtCard";

const Gallery = () => {

  return (
    <div className="artwork-container">
      <div>Category</div>
      <div className="media-card-container">
        <ArtCard />
        <ArtCard />
        <ArtCard />
        <ArtCard />
        <ArtCard />
      </div>

      <div>Favorites</div>
      <div className="media-card-container">
        <ArtCard />
        <ArtCard />
        <ArtCard />
        <ArtCard />
        <ArtCard />
      </div>

      <div>Recent Added</div>
      <div className="media-card-container">
        <ArtCard />
        <ArtCard />
        <ArtCard />
        <ArtCard />
        <ArtCard />
      </div>

    </div>

  )
}

export default Gallery