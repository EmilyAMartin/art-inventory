import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

const AddArtworkBtn = () => {
	const [open, setOpen] = useState(false);
	const [isHover, setIsHover] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const handleMouseEnter = () => {
		setIsHover(true);
	};
	const handleMouseLeave = () => {
		setIsHover(false);
	};

	const buttonStyle = {
		padding: '0.5rem',
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
	};
	const modalStyle = {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
	};
	const SubmitButton = styled(Button)(({ theme }) => ({
		color: theme.palette.getContrastText(green[500]),
		backgroundColor: green[400],
		'&:hover': {
			backgroundColor: green[700],
		},
	}));
	const CancelButton = styled(Button)(({ theme }) => ({
		color: theme.palette.getContrastText(red[500]),
		backgroundColor: red[500],
		'&:hover': {
			backgroundColor: red[700],
		},
	}));
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
		<div>
			<button
				style={buttonStyle}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleOpen}
			>
				Add New Artwork
			</button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Box sx={modalStyle}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 25,
							width: '90vw',
							padding: 50,
						}}
					>
						<Typography variant='h5'>Add New Artwork</Typography>
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment- Title'>Title</InputLabel>
							<OutlinedInput
								id='outlined-adornment-title'
								endAdornment={<InputAdornment position='end'></InputAdornment>}
								label='title'
							/>
						</FormControl>

						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-date'>Date</InputLabel>
							<OutlinedInput
								id='outlined-adornment-date'
								endAdornment={<InputAdornment position='end'></InputAdornment>}
								label='date'
							/>
						</FormControl>
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-medium'>Medium</InputLabel>
							<OutlinedInput
								id='outlined-adornment-date'
								endAdornment={<InputAdornment position='end'></InputAdornment>}
								label='medium'
							/>
						</FormControl>

						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-location'>Location</InputLabel>
							<OutlinedInput
								id='outlined-adornment-date'
								endAdornment={<InputAdornment position='end'></InputAdornment>}
								label='location'
							/>
						</FormControl>

						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-quantity'>Quantity</InputLabel>
							<OutlinedInput
								id='outlined-adornment-date'
								endAdornment={<InputAdornment position='end'></InputAdornment>}
								label='quantity'
							/>
							<Button
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									width: '15%',
									marginTop: 3,
								}}
								component='label'
								role={undefined}
								variant='contained'
								tabIndex={-1}
							>
								Upload files
								<VisuallyHiddenInput
									type='file'
									onChange={(event) => console.log(event.target.files)}
									multiple
								/>
							</Button>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									gap: 50,
									marginTop: 25,
								}}
							>
								<SubmitButton
									sx={{ color: 'white' }}
									variant='contained'
									onClick={handleClose}
								>
									Submit
								</SubmitButton>
								<CancelButton
									sx={{ color: 'white' }}
									variant='contained'
									onClick={handleClose}
								>
									Cancel
								</CancelButton>
							</div>
						</FormControl>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default AddArtworkBtn;
