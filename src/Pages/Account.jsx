import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { BsPersonCircle } from "react-icons/bs";

import { useRef } from 'react';

const Account = () => {
  const hiddenFileInput = useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };

  return (
    <>

      <div className='profile-header' style={{ marginTop: 50, gap: 25, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <BsPersonCircle fontSize={150} className="button-upload" onClick={handleClick}>
        </BsPersonCircle>
        <input
          type="file"
          onChange={handleChange}
          ref={hiddenFileInput}
          style={{ display: 'none' }} // Make the file input element invisible
        />
        <Typography variant="h6">Jane Doe</Typography>
      </div>
      <div className='profile-section' style={{ marginBottom: 50 }}>
        <Typography variant="h6">Profile</Typography>
        <TextField
          id="outlined-required"
          fullWidth
          margin="normal"
          label="Full Name"
          defaultValue=""
        />
        <TextField
          id="outlined-required"
          fullWidth
          margin="normal"
          label="Username"
          defaultValue=""
        />
        <TextField
          id="outlined-required"
          fullWidth
          margin="normal"
          label="Email Address"
          defaultValue=""
        />
        <TextField
          id="outlined-multiline-static"
          fullWidth
          label="Bio"
          multiline
          rows={4}
          defaultValue=""
        />
      </div>
      <div className='security-section' style={{ marginBottom: 50 }}>
        <Typography variant="h6">Password and Security</Typography>
        <TextField
          id="outlined-required"
          fullWidth
          margin="normal"
          label="Current Password"
        />
        <TextField
          id="outlined-required"
          fullWidth
          margin="normal"
          label="New Password"
        />
        <TextField
          id="outlined-required"
          fullWidth
          margin="normal"
          label="Re-type New Password"
        />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        paddingBottom: 30,
      }}>
        <button style={{
          padding: '0.6rem',
          backgroundColor: '#6c63ff',
          color: '#ffffff',
          outline: 'none',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: '0.2s',
          width: 150,
        }}>
          Submit
        </button>
      </div>
    </>
  )
}
export default Account