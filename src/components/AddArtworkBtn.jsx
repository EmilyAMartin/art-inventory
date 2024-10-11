import React from 'react'
import Modal from '../components/Modal';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { styled } from '@mui/material/styles';

const AddArtworkBtn = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const handleButtonClick = () => {
        setModalOpen(false);
    };
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    return (
        <>
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
            }}
                onClick={() => setModalOpen(true)}>
                Add New Artwork
            </button>

            {modalOpen && (
                createPortal(<Modal onSubmit={handleButtonClick} onCancel={handleButtonClick} onClose={handleButtonClick}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div>
                            <Typography gutterBottom variant="h5" component="div" paddingBottom={2} >Add New Artwork</Typography>
                        </div>
                        <div>

                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment- Title">Title</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-title"
                                    endAdornment={
                                        <InputAdornment position="end">
                                        </InputAdornment>
                                    }
                                    label="title"
                                />
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-date">Date</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-date"
                                    endAdornment={
                                        <InputAdornment position="end">
                                        </InputAdornment>
                                    }
                                    label="date"
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-medium">Medium</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-date"
                                    endAdornment={
                                        <InputAdornment position="end">
                                        </InputAdornment>
                                    }
                                    label="medium"
                                />
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-location">Location</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-date"
                                    endAdornment={
                                        <InputAdornment position="end">
                                        </InputAdornment>
                                    }
                                    label="location"
                                />
                            </FormControl>

                            <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-quantity">Quantity</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-date"
                                    endAdornment={
                                        <InputAdornment position="end">
                                        </InputAdornment>
                                    }
                                    label="quantity"
                                />
                            </FormControl>
                            <Button
                                sx={{ display: 'flex', justifyContent: 'center', m: 1, width: '100%' }}
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload files
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={(event) => console.log(event.target.files)}
                                    multiple
                                />
                            </Button>
                        </div>
                    </Box>
                </Modal>, document.body)
            )}
        </>
    )
}

export default AddArtworkBtn