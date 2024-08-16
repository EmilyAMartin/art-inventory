import React from 'react'
import { BsPlusCircle } from "react-icons/bs";

const Artwork = () => {
  return (
    <div className="art-container">
      <div>Add New Artwork</div>
      <div onClick={() => setModalOpen(true)}>
        <BsPlusCircle />
      </div>
    </div>
  )
}

export default Artwork