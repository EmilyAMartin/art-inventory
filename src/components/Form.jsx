import React, { useState } from 'react'
import { TextField } from '@mui/material'
import { Typography } from '@mui/material'

const Form = () => {

    const submitForm = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const payload = Object.fromEntries(formData)

        console.log(payload)
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
            <button variant="primary" type="submit">Submit</button>
        </form>
    )
}

export default Form