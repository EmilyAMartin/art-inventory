import React from 'react'
import { BsPlusCircle } from "react-icons/bs";

import Card from './Card';

import Modal from '../Modal';
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { BsImage } from "react-icons/bs";



const Artwork = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const handleButtonClick = () => {
    setModalOpen(false);
  };
  return (
    <div className="art-container">
      <div>Add New Artwork</div>
      <div onClick={() => setModalOpen(true)}><BsPlusCircle /></div>

      <h3>Painting</h3>
      <div className='artwork-grid'>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

      <h3>Photography</h3>
      <div className='artwork-grid'>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

      <h3>Printmaking</h3>
      <div className='artwork-grid'>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>

      {modalOpen && (
        createPortal(<Modal onSubmit={handleButtonClick} onCancel={handleButtonClick} onClose={handleButtonClick}>
          <div className="artwork-container">
            <div className="artwork-image-placeholder">
              <div className="artwork-header">Artwork</div>
              <div className="box">
                <div className="image-icon">
                  <BsImage />
                </div>
              </div>
            </div>

            <div className="artwork-form-container">d
              <label for="title">
                <b>Title</b>
              </label>
              <input
                aria-label="title"
                type="text"
                placeholder="Title"
                name="title"
                required
              />

              <label for="year">
                <b>Year</b>
              </label>
              <input
                aria-label="year"
                type="text"
                placeholder="Year"
                name="year"
                required
              />

              <label for="location">
                <b>Location</b>
              </label>
              <input
                aria-label="location"
                type="text"
                placeholder="Location"
                name="location"
                required
              />

              <label for="medium">
                <b>Medium</b>
              </label>
              <select
                class="dropdown-menu"
                id="dropdown"
                autocomplete="off"
              >
                <option value="" selected></option>
                <option value="painting">Painting</option>
                <option value="sculpture">Sculpture</option>
                <option value="printmaking">Printmaking</option>
                <option value="textile">Textile</option>
                <option value="photography">Photography</option>
                <option value="digital">Digital Art</option>
                <option value="other">Other</option>
              </select>

              <label for="quantity">
                <b>Quantity</b>
              </label>
              <input
                aria-label="number"
                type="number"
                placeholder=""
                name="quantity"
                min="1"
                max=""
                required
              />

              <label for="availability">
                <b>Availability</b>
              </label>
              <select
                class="dropdown-menu"
                id="dropdown"
                autocomplete="off"
              >
                <option value="" selected></option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </Modal>, document.body)
      )}
    </div>
  )
}

export default Artwork