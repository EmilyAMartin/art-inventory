import React from "react";
import { BsPlusCircle } from "react-icons/bs";
import ArtCard from "../ArtCard";

import Modal from '../Modal'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Artwork = () => {

  const [modalOpen, setModalOpen] = useState(false)
  const handleButtonClick = () => {
    setModalOpen(false);
  };


  return (
    <div className="artwork-container">
      <div className='add-artwork'>
        <div>Add New Artwork</div>
        <div onClick={() => setModalOpen(true)} ><BsPlusCircle /></div>
        <div>
          {modalOpen && (
            createPortal(<Modal onSubmit={handleButtonClick} onCancel={handleButtonClick} onClose={handleButtonClick}>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload files
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => console.log(event.target.files)}
                  multiple
                />
              </Button>


            </Modal>, document.body)
          )}

        </div>


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