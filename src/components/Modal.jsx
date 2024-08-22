import React from 'react'
import "./Modal.css"

const Modal = () => {
  return (
    <div className='modal-container'>
      <div className='modal'>
        <div className='modal-header'>
          <p className='close'>&times;</p>
        </div>
        <div className='modal-context'>
          <h1>This is the modal title</h1>
        </div>
        <div className='modal-footer'>
          <button className='btn btn-submit'>Submit</button>
          <button className='btn btn-cancel'>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default Modal