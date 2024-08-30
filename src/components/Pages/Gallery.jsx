import React from "react";
import ArtCard from "../ArtCard";
import MediumCard from "../MediumCard";

const Gallery = () => {

  return (
    <div className="artwork-container">
      <div>Category</div>
      <div className="media-card-container">
        <MediumCard />
        <MediumCard />
        <MediumCard />
        <MediumCard />
        <MediumCard />
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