import React from "react";
import { BsPlusCircle } from "react-icons/bs";
import MediaCard from "../MediaCard";

const Artwork = () => {

  return (
    <div className="artwork-container">
      <div className='add-artwork'>
        <div>Add New Artwork</div>
        <div ><BsPlusCircle /></div>
      </div>
      <MediaCard />
    </div>

  )
}

export default Artwork