import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { Typography } from '@mui/material'

const Form = () => {
    const submitForm = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const payload = Object.fromEntries(formData)
    }
    const [isHover, setIsHover] = useState(false);
    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };
    const buttonStyle = {
        marginTop: '1.5rem',
        padding: '0.6rem',
        hover: '#6c63ff50',
        color: '#ffffff',
        outline: 'none',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: '0.2s',
        width: 150,
        backgroundColor: isHover ? '#4640ad' : '#6c63ff',
        color: isHover ? 'white' : 'white',
    }

    return (
        <form onSubmit={submitForm}>
            <Typography variant="h6">Profile</Typography>
            <TextField
                fullWidth
                margin='normal'
                label="Full Name"
                type='text'
                name="fullName"
                placeholder='Full Name'
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
                multiline
                rows={4}
                margin='normal'
                label="Bio"
                name="bio"
                type='text'
                placeholder='Bio'
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
                <button style={buttonStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    Submit
                </button>
            </div>
        </form>
    )
}

export default Form