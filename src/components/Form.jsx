import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { Typography } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';

const Form = () => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [bio, setBio] = useState('')
    const [newpassword, setNewPassword] = useState('')
    const [reppassword, setRepPassword] = useState('')
    const [isHover, setIsHover] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleMouseEnter = () => { setIsHover(true); };
    const handleMouseLeave = () => { setIsHover(false); };
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
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
            <Typography marginTop="1rem" variant="h6">Password and Security</Typography>
            <TextField
                fullWidth
                margin='normal'
                label='Current Password'
                name="current-password"
                type='text'
                value={'**********'}
            />
            <FormControl fullWidth margin='normal' variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password"> New Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    label="New Password"
                    name="new-password"
                    placeholder='New Password'
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setNewPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <FormControl fullWidth margin='normal' variant="outlined">
                <InputLabel htmlFor="outlined-adornment-reppassword"> Re-Type Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-reppassword"
                    label="Re=Type Password"
                    name="reppassword"
                    placeholder='Re-Type Password'
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setRepPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={
                                    showPassword ? 'hide the password' : 'display the password'
                                }
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

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