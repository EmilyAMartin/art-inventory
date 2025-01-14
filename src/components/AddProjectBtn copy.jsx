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
import { TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

const AddProjectBtn = () => {
	const [open, setOpen] = useState(false);
	const [isHover, setIsHover] = useState(false);
	const [images, setImages] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [title, setTitle] = useState('');
	const [medium, setMedium] = useState('');
	const [description, setDescription] = useState('');

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		resetForm();
		setOpen(false);
	};

	const handleMouseEnter = () => {
		setIsHover(true);
	};

	const handleMouseLeave = () => {
		setIsHover(false);
	};

	const handleImageChange = (e) => {
		const files = Array.from(e.target.files);
		const newImages = files.map((file) => {
			const reader = new FileReader();
			return new Promise((resolve) => {
				reader.onloadend = () => {
					resolve(reader.result);
				};
				reader.readAsDataURL(file);
			});
		});
		Promise.all(newImages).then((imageData) => {
			setImages((prevImages) => [...prevImages, ...imageData]);
		});
	};

	const handleNext = () => {
		if (currentIndex < images.length - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const handlePrev = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const handleSubmit = () => {
		resetForm();
		setOpen(false);
	};

	const resetForm = () => {
		setTitle('');
		setMedium('');
		setDescription('');
		setImages([]);
		setCurrentIndex(0);
	};

	// Button hover style
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

	// Modal style with responsive adjustments
	const modalStyle = {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		bgcolor: 'background.paper',
		maxWidth: '90%', // Adjust for smaller screens
		width: '600px', // Max width for larger screens (desktop)
		padding: '2rem', // Add padding for mobile
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
							gap: 20, // Adjusted gap for mobile view
							width: '100%',
						}}
					>
						<Typography variant='h5'>Add New Artwork</Typography>

						{/* Title Input */}
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-title'>Title</InputLabel>
							<OutlinedInput
								id='outlined-adornment-title'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								endAdornment={<InputAdornment position='end'></InputAdornment>}
								label='Title'
							/>
						</FormControl>

						{/* Medium Input */}
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<InputLabel htmlFor='outlined-adornment-medium'>Medium</InputLabel>
							<OutlinedInput
								id='outlined-adornment-medium'
								value={medium}
								onChange={(e) => setMedium(e.target.value)}
								endAdornment={<InputAdornment position='end'></InputAdornment>}
								label='Medium'
							/>
						</FormControl>
						<TextField
							sx={{ width: '100%' }}
							id='outlined-multiline-flexible'
							label='Description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							multiline
							maxRows={4}
						/>
						<FormControl
							sx={{ width: '100%' }}
							variant='outlined'
						>
							<Button
								component='label'
								role={undefined}
								variant='contained'
								startIcon={<CloudUploadIcon />}
								type='file'
								id='image-upload'
								accept='image/*'
								multiple
								onChange={handleImageChange}
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: '#6c63ff',
									padding: '8px',
									fontSize: '0.9rem',
									width: '100%',
								}}
							>
								Upload files
								<VisuallyHiddenInput
									type='file'
									onChange={(event) => console.log(event.target.files)}
									multiple
								/>
							</Button>
						</FormControl>

						{images.length > 0 && (
							<div style={{ marginTop: 20, textAlign: 'center' }}>
								<div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
									<Button
										onClick={handlePrev}
										disabled={currentIndex === 0}
										color='black'
									>
										Previous
									</Button>
									<img
										src={images[currentIndex]}
										alt={`Image ${currentIndex + 1}`}
										style={{
											maxWidth: '300px',
											maxHeight: '300px',
											objectFit: 'cover',
										}}
									/>
									<Button
										onClick={handleNext}
										disabled={currentIndex === images.length - 1}
										color='black'
									>
										Next
									</Button>
								</div>
								<p>
									{currentIndex + 1} / {images.length}
								</p>
							</div>
						)}

						<FormControl
							sx={{ width: '50%' }}
							variant='outlined'
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									gap: 30, // Adjust gap for mobile
									marginTop: 25,
									flexDirection: 'row', // Stack buttons on mobile
								}}
							>
								<SubmitButton
									sx={{ color: 'white' }}
									variant='contained'
									onClick={handleSubmit}
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

export default AddProjectBtn;
