import React, { useState, useEffect } from 'react'
import { TextField } from '@mui/material'
import { Typography } from '@mui/material'

const Form = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [newpassword, setNewPassword] = useState('')
    const [reppassword, setRepPassword] = useState('')

    const [isHover, setIsHover] = useState(false);
    const handleMouseEnter = () => { setIsHover(true); };
    const handleMouseLeave = () => { setIsHover(false); };

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
    function handleSubmission() {
        localStorage.clear();
        let userData = {
            Name: name,
            Username: username,
            Email: email,
            Bio: bio,
            NewPassword: newpassword,
            RepPassword: reppassword,
        };
        localStorage.setItem("userInfo", JSON.stringify(userData));
        alert("Form Submitted");
        window.location.reload();
    }
    return (

        <form>
            <Typography variant="h6">Profile</Typography>
            <TextField
                fullWidth
                margin='normal'
                label="Full Name"
                type='text'
                name="name"
                placeholder='Full Name'
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                fullWidth
                margin='normal'
                label="Username"
                name="username"
                type='text'
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                fullWidth
                margin='normal'
                label="Email"
                name="email"
                type='email'
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setBio(e.target.value)}
            />
            <Typography variant="h6">Password and Security</Typography>
            <TextField
                fullWidth
                margin='normal'
                label='Current Password'
                name="current-password"
                type='text'
                value={'**********'}
            />
            <TextField
                fullWidth
                margin='normal'
                label="New Password"
                name="new-password"
                type='text'
                placeholder='New Password'
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
                fullWidth
                margin='normal'
                label="Re-Type Password"
                name="re-type-password"
                type='text'
                placeholder='Re-Type Password'
                onChange={(e) => setRepPassword(e.target.value)}
            />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                paddingBottom: 30,
            }}>
                <button style={buttonStyle}
                    onClick={handleSubmission}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    Submit
                </button>
            </div>
        </form>
    )
}

export default Form