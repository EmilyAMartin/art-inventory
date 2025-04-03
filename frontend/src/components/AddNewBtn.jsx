import { useState } from 'react';
import { buttonStyle } from '../styles/modalButtons';
import ImageUploadModal from './ImageUploadModal';

const AddNewBtn = ({ onArtworkAdded }) => {
	const [open, setOpen] = useState(false);
	const [isHover, setIsHover] = useState(false);

	const fields = [
		{ name: 'title', label: 'Title', required: true },
		{ name: 'artist', label: 'Artist' },
		{ name: 'date', label: 'Date', required: true },
		{ name: 'medium', label: 'Medium', required: true },
		{ name: 'location', label: 'Location', required: true },
		{ name: 'description', label: 'Description', multiline: true },
	];

	const handleSubmit = async (formData) => {
		const response = await fetch('http://localhost:3000/artworks', {
			method: 'POST',
			body: formData,
			credentials: 'include',
		});

		const responseText = await response.text();
		let responseData;
		try {
			responseData = JSON.parse(responseText);
		} catch (error) {
			console.error('JSON parse error:', error);
			throw new Error(`Server returned invalid JSON response: ${responseText}`);
		}

		if (!response.ok || !responseData.success) {
			throw new Error(
				responseData.message || responseData.error || 'Failed to add artwork'
			);
		}

		onArtworkAdded(responseData.data);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleMouseEnter = () => setIsHover(true);
	const handleMouseLeave = () => setIsHover(false);

	return (
		<div>
			<div
				style={buttonStyle(isHover)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleOpen}
			>
				Add New Artwork
			</div>
			<ImageUploadModal
				open={open}
				onClose={handleClose}
				onSubmit={handleSubmit}
				title='Add New Artwork'
				fields={fields}
			/>
		</div>
	);
};

export default AddNewBtn;
