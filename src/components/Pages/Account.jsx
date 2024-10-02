import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { BsPersonCircle } from "react-icons/bs";

const Account = () => {
  return (
    <>
      <div className='profile-header' style={{ marginTop: 50, gap: 25, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <BsPersonCircle fontSize={150} />
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
    </>
  )
}
export default Account