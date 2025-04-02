import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
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

const AddProjectBtn = ({ onProjectAdded }) => {
	const [open, setOpen] = useState(false);
	const [isHover, setIsHover] = useState(false);
	const [images, setImages] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [title, setTitle] = useState('');
	const [medium, setMedium] = useState('');
	const [description, setDescription] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = useCallback(async () => {
		if (isSubmitting) return; // Prevent duplicate submissions

		try {
			setIsSubmitting(true); // Set submitting state

			// Validate required fields
			if (!title || !medium) {
				alert('Please fill in all required fields: Title and Medium');
				return;
			}

			// Create FormData object
			const formData = new FormData();
			formData.append('title', title);
			formData.append('medium', medium);
			formData.append('description', description);

			// Add image file if exists
			if (images.length > 0) {
				console.log('Adding image to form data');
				const response = await fetch(images[0]);
				const blob = await response.blob();
				formData.append('image', blob, 'project.jpg');
			}

			console.log('Submitting form data:', {
				title,
				medium,
				description,
				hasImage: images.length > 0,
			});

			const response = await fetch('http://localhost:3000/projects', {
				method: 'POST',
				body: formData,
				credentials: 'include',
			});

			console.log('Response status:', response.status);
			console.log(
				'Response headers:',
				Object.fromEntries(response.headers.entries())
			);

			const responseText = await response.text();
			console.log('Raw response:', responseText);

			let responseData;
			try {
				responseData = JSON.parse(responseText);
			} catch (error) {
				console.error('Error parsing response:', error);
				throw new Error(`Server returned invalid JSON response: ${responseText}`);
			}

			if (!response.ok) {
				throw new Error(
					responseData.message || responseData.error || 'Failed to add project'
				);
			}

			if (!responseData.success) {
				throw new Error(
					responseData.message || responseData.error || 'Failed to add project'
				);
			}

			// Only add the new project once and reset form
			onProjectAdded(responseData.data);
			resetForm();
			setOpen(false);
		} catch (error) {
			console.error('Error adding project:', error);
			alert(`Failed to add project: ${error.message}`);
		} finally {
			setIsSubmitting(false); // Reset submitting state
		}
	}, [title, medium, description, images, isSubmitting, onProjectAdded]);

	const handleOpen = useCallback(() => setOpen(true), []);
	const handleClose = useCallback(() => {
		resetForm();
		setOpen(false);
	}, []);

	const handleMouseEnter = useCallback(() => setIsHover(true), []);
	const handleMouseLeave = useCallback(() => setIsHover(false), []);

	const handleImageChange = useCallback((e) => {
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
	}, []);

	const handleNext = useCallback(() => {
		if (currentIndex < images.length - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	}, [currentIndex, images.length]);

	const handlePrev = useCallback(() => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	}, [currentIndex]);

	const resetForm = useCallback(() => {
		setTitle('');
		setMedium('');
		setDescription('');
		setImages([]);
		setCurrentIndex(0);
	}, []);

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
		maxWidth: '90%',
		width: '600px',
		padding: '2rem',
		maxHeight: '90vh',
		overflow: 'auto',
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
			<div
				style={buttonStyle}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleOpen}
			>
				Add New Project
			</div>
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
							gap: 20,
							width: '100%',
						}}
					>
						<Typography variant='h5'>Add New Project</Typography>

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

						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: '#6c63ff',
								padding: '8px',
								fontSize: '0.9rem',
								width: '100%',
								cursor: 'pointer',
								borderRadius: '4px',
							}}
						>
							<label
								htmlFor='image-upload'
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									cursor: 'pointer',
									color: 'white',
								}}
							>
								<CloudUploadIcon />
								Upload files
							</label>
							<input
								id='image-upload'
								type='file'
								multiple
								accept='image/*'
								style={{ display: 'none' }}
								onChange={handleImageChange}
							/>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'center',
								gap: '10px',
							}}
						>
							<div
								onClick={handlePrev}
								style={{
									padding: '8px 16px',
									cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
									opacity: currentIndex === 0 ? 0.5 : 1,
									backgroundColor: '#f0f0f0',
									borderRadius: '4px',
								}}
							>
								Previous
							</div>
							<div
								onClick={handleNext}
								style={{
									padding: '8px 16px',
									cursor: currentIndex === images.length - 1 ? 'not-allowed' : 'pointer',
									opacity: currentIndex === images.length - 1 ? 0.5 : 1,
									backgroundColor: '#f0f0f0',
									borderRadius: '4px',
								}}
							>
								Next
							</div>
						</div>
						{images.length > 0 && (
							<div style={{ textAlign: 'center' }}>
								<div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
									<img
										src={images[currentIndex]}
										alt={`Image ${currentIndex + 1}`}
										style={{
											maxWidth: '300px',
											maxHeight: '300px',
											objectFit: 'cover',
										}}
									/>
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
									gap: 30,
									marginTop: 25,
									flexDirection: 'row',
								}}
							>
								<SubmitButton
									sx={{ color: 'white' }}
									variant='contained'
									onClick={handleSubmit}
									disabled={isSubmitting}
								>
									{isSubmitting ? 'Submitting...' : 'Submit'}
								</SubmitButton>
								<CancelButton
									sx={{ color: 'white' }}
									variant='contained'
									onClick={handleClose}
									disabled={isSubmitting}
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

AddProjectBtn.propTypes = {
	onProjectAdded: PropTypes.func.isRequired,
};

export default AddProjectBtn;
