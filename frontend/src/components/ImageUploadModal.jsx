import { useState } from 'react';
import {
	Modal,
	Box,
	Typography,
	OutlinedInput,
	InputLabel,
	FormControl,
	TextField,
	Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { modalStyle } from '../styles/modalButtons'; // Kept only modalStyle
import toast from 'react-hot-toast';

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

			const missingFields = fields
				.filter((field) => field.required && !formData[field.name])
				.map((field) => field.label);

			if (missingFields.length > 0) {
				toast.error(
					`Please fill in all required fields: ${missingFields.join(', ')}`
				);
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
			toast.error(`Failed to submit: ${error.message}`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImages([reader.result]);
			};
			reader.readAsDataURL(file);
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
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 2.5,
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

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: '#6c63ff',
							p: 1,
							fontSize: '0.9rem',
							width: '100%',
							cursor: 'pointer',
							borderRadius: 1,
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
							<Typography>Upload file</Typography>
						</label>
						<input
							id='image-upload'
							type='file'
							accept='image/*'
							style={{ display: 'none' }}
							onChange={handleImageChange}
						/>
					</Box>

					{images.length > 0 && (
						<Box sx={{ textAlign: 'center' }}>
							<img
								src={images[0]}
								alt='Uploaded'
								style={{
									maxWidth: '300px',
									maxHeight: '300px',
									objectFit: 'cover',
								}}
							/>
						</Box>
					)}

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: 4,
							mt: 3,
							flexDirection: 'row',
						}}
					>
						<Button
							variant='contained'
							onClick={handleSubmit}
							sx={{
								fontSize: '1rem',
								textTransform: 'none',
								color: '#fff',
								borderRadius: '1rem',
								bgcolor: '#66bb6a',
								'&:hover': {
									bgcolor: '#388e3c',
								},
							}}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Submitting...' : submitText}
						</Button>
						<Button
							variant='contained'
							onClick={handleClose}
							sx={{
								fontSize: '1rem',
								textTransform: 'none',
								color: '#fff',
								borderRadius: '1rem',
								bgcolor: '#f44336',
								'&:hover': {
									bgcolor: '#d32f2f',
								},
							}}
							disabled={isSubmitting}
						>
							{cancelText}
						</Button>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default ImageUploadModal;
