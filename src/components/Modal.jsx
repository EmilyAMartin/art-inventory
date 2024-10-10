import "./Modal.css"
import React from 'react'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { red } from '@mui/material/colors';

const SubmitButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(green[500]),
  backgroundColor: green[400],
  '&:hover': {
    backgroundColor: green[700],
  },
}));
const CancelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(red[500]),
  backgroundColor: red[500],
  '&:hover': {
    backgroundColor: red[700],
  },
}));

const Modal = ({ onSubmit, onCancel, onClose, children }) => {
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 100, }}>
          <SubmitButton sx={{ color: 'white' }} variant="contained" onClick={() => onSubmit()}>Submit</SubmitButton>
          <CancelButton sx={{ color: 'white' }} variant="contained" onClick={() => onCancel()}>Cancel</CancelButton>
        </div>
      </div>
    </div>
  )
}
export default Modal