import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { BsPersonCircle } from "react-icons/bs";

const Account = () => {
  const [profileData, setProfileData] = useState([])
  const hiddenFileInput = useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };
  const handelSubmit = (e) => {
    event.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = []
    for (const [key, value] of formData.entries()) {
      data.push({ ...data, [key]: value })
    }
    setProfileData(data);
    localStorage.setItem("profile", JSON.stringify(data))
  }
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    setProfileData(profile)
  }, [])

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
      <form onSubmit={handelSubmit} >
        <Typography variant="h6">Profile</Typography>
        <TextField
          fullWidth
          margin='normal'
          label="Full Name"
          name="fullName"
          type='text'
          placeholder='Full Name'
          value={profileDat.fullName??""}
        />
        <TextField
          fullWidth
          margin='normal'
          label="Username"
          name="username"
          type='text'
          placeholder='Username'
        />
        <TextField
          fullWidth
          margin='normal'
          label="Email"
          name="email"
          type='email'
          placeholder='Email'
        />
        <TextField
          fullWidth
          margin='normal'
          label="Bio"
          name="bio"
          type='text'
          placeholder='Bio'
          multiline
          rows={4}
        />
        <Typography variant="h6">Password and Security</Typography>
        <TextField
          fullWidth
          margin='normal'
          label="Current Password"
          name="current-password"
          type='text'
          placeholder='Current Password'

        />
        <TextField
          fullWidth
          margin='normal'
          label="New Password"
          name="new-password"
          type='text'
          placeholder='New Password'
        />
        <TextField
          fullWidth
          margin='normal'
          label="Re-Type Password"
          name="re-type-password"
          type='text'
          placeholder='Re-Type Password'
        />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          paddingBottom: 30,
        }}>
          <button style={{
            marginTop: '1.5rem',
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
      </form>
    </>
  )
}
export default Account