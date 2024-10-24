import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,

    bgcolor: 'background.paper',
    p: 4,
};

const LearnMore = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button color='black' onClick={handleOpen}>Learn More</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Description
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{art.artist_title}</Typography>
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default LearnMore