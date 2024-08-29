import React from "react";
import { BsPlusCircle } from "react-icons/bs";
import ArtCard from "../ArtCard";

const Artwork = () => {

  return (
    <div className="artwork-container">
      <div className='add-artwork'>
        <div>Add New Artwork</div>
        <div ><BsPlusCircle /></div>
      </div>

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

export default Artwork