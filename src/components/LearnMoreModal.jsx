import React from 'react'

const LearnMoreModal = ({ onClose, children }) => {
  return (
    <div className="modal-container" onClick={(e) => {
      if (e.target.className === "modal-container")
        onClose();
    }}
    >
      <div className='modal'>
        <div className='modal-header'>
          <p className='close' onClick={() => onClose()}>&times;</p>
        </div>
        <div className='modal-content'>
          {children}
        </div>
      </div>
    </div>
  )
}
export default LearnMoreModal