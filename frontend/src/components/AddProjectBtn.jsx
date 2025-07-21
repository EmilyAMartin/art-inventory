import { useState } from 'react';
import { Box, Button } from '@mui/material';
import ImageUploadModal from './ImageUploadModal';
import { BASE_URL } from '../config';

const AddProjectBtn = ({ onProjectAdded }) => {
	const [open, setOpen] = useState(false);
	const [isHover, setIsHover] = useState(false);

	const fields = [
		{ name: 'title', label: 'Title', required: true },
		{ name: 'medium', label: 'Medium', required: true },
		{ name: 'description', label: 'Description', multiline: true },
	];

	const handleSubmit = async (formData) => {
		const response = await fetch(`${BASE_URL}/projects`, {
			method: 'POST',
			body: formData,
			credentials: 'include',
		});

		const responseText = await response.text();
		let responseData;
		try {
			responseData = JSON.parse(responseText);
		} catch (error) {
			console.error('Error parsing response:', error);
			throw new Error(`Server returned invalid JSON response: ${responseText}`);
		}

		if (!response.ok || !responseData.success) {
			throw new Error(
				responseData.message || responseData.error || 'Failed to add project'
			);
		}

		onProjectAdded(responseData.data);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleMouseEnter = () => setIsHover(true);
	const handleMouseLeave = () => setIsHover(false);

	return (
		<Box>
			<Button
				sx={{
					p: '0.5rem',
					color: '#fff',
					borderRadius: '1rem',
					fontSize: '1rem',
					fontWeight: 500,
					cursor: 'pointer',
					transition: '0.2s',
					textTransform: 'none',
					width: 150,
					backgroundColor: isHover ? '#4640ad' : '#6c63ff',
					'&:hover': {
						backgroundColor: '#6c63ff50',
					},
				}}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleOpen}
			>
				New Project
			</Button>

			<ImageUploadModal
				open={open}
				onClose={handleClose}
				onSubmit={handleSubmit}
				title='Add New Project'
				fields={fields}
			/>
		</Box>
	);
};

export default AddProjectBtn;
