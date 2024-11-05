import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import { Typography } from '@mui/material'

const Form = () => {
    const [fullname, setFullname] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const submitForm = (e) => {
        e.preventDefault()
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

    useEffect(() => {
        window.localStorage.setItem('form-data', JSON.stringify())
    });

    return (

        <form>
            <Typography variant="h6">Profile</Typography>
            <TextField
                fullWidth
                margin='normal'
                label="Full Name"
                type='text'
                name="fullname"
                placeholder='Full Name'
                onChange={(e) => { setFullname(e.target.value) }}
            />
            <TextField
                fullWidth
                margin='normal'
                label="Username"
                name="username"
                type='text'
                placeholder='Username'
                onChange={(e) => { setUsername(e.target.value) }}
            />
            <TextField
                fullWidth
                margin='normal'
                label="Email"
                name="email"
                type='email'
                placeholder='Email'
                onChange={(e) => { setEmail(e.target.value) }}
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
                onChange={(e) => { setBio(e.target.value) }}
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
                    onClick={submitForm}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    Submit
                </button>
            </div>
        </form>
    )
}

export default Form