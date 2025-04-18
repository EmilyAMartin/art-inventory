import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { modalStyle, SubmitButton, CancelButton } from '../styles/modalButtons';
import toast, { Toaster } from 'react-hot-toast';

const ImageUploadModal = ({
	open,
	onClose,
	onSubmit,
	title,
	fields,
	submitText = 'Submit',
	cancelText = 'Cancel',
}) => {
	const [images, setImages] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState(
		fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
	);

	const handleSubmit = async () => {
		if (isSubmitting) return;

		try {
			setIsSubmitting(true);

			// Check required fields
			const missingFields = fields
				.filter((field) => field.required)
				.filter((field) => !formData[field.name])
				.map((field) => field.label);

			if (missingFields.length > 0) {
				toast.error(
					`Please fill in all required fields: ${missingFields.join(', ')}`
				); // Show error toast
				return;
			}

			const submitData = new FormData();
			Object.entries(formData).forEach(([key, value]) => {
				submitData.append(key, value);
			});

			if (images.length > 0) {
				const response = await fetch(images[0]);
				const blob = await response.blob();
				submitData.append('image', blob, 'image.jpg');
			}

			await onSubmit(submitData);
			resetForm();
			onClose();
		} catch (error) {
			console.error('Error submitting form:', error);
			toast.error(`Failed to submit: ${error.message}`); // Show error toast
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0]; // Get only the first file
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImages([reader.result]); // Replace the images array with a single image
			};
			reader.readAsDataURL(file);
		}
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

	const resetForm = () => {
		setFormData(
			fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
		);
		setImages([]);
		setCurrentIndex(0);
	};

	const handleInputChange = (fieldName) => (e) => {
		setFormData((prev) => ({ ...prev, [fieldName]: e.target.value }));
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={modalStyle}>
				{/* Toaster Component */}
				<Toaster
					position='top-center'
					reverseOrder={false}
				/>

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
					<Typography variant='h5'>{title}</Typography>

					{fields.map((field) =>
						field.multiline ? (
							<TextField
								key={field.name}
								sx={{ width: '100%' }}
								id={`outlined-multiline-${field.name}`}
								label={field.label}
								value={formData[field.name]}
								onChange={handleInputChange(field.name)}
								multiline
								maxRows={4}
							/>
						) : (
							<FormControl
								key={field.name}
								sx={{ width: '100%' }}
								variant='outlined'
							>
								<InputLabel htmlFor={`outlined-adornment-${field.name}`}>
									{field.label}
								</InputLabel>
								<OutlinedInput
									id={`outlined-adornment-${field.name}`}
									value={formData[field.name]}
									onChange={handleInputChange(field.name)}
									label={field.label}
								/>
							</FormControl>
						)
					)}

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
							Upload file
						</label>
						<input
							id='image-upload'
							type='file'
							accept='image/*'
							style={{ display: 'none' }}
							onChange={handleImageChange}
						/>
					</div>

					{images.length > 0 && (
						<div style={{ textAlign: 'center' }}>
							<img
								src={images[0]} // Always display the first image
								alt='Uploaded'
								style={{
									maxWidth: '300px',
									maxHeight: '300px',
									objectFit: 'cover',
								}}
							/>
						</div>
					)}

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
							{isSubmitting ? 'Submitting...' : submitText}
						</SubmitButton>
						<CancelButton
							sx={{ color: 'white' }}
							variant='contained'
							onClick={handleClose}
							disabled={isSubmitting}
						>
							{cancelText}
						</CancelButton>
					</div>
				</div>
			</Box>
		</Modal>
	);
};

export default ImageUploadModal;
