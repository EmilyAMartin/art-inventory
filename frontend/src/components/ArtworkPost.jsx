import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	TextField,
	Button,
	Box,
	Divider,
	IconButton,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import Avatar from '@mui/material/Avatar';

const ArtworkPost = ({ artwork, onSubmitComment }) => {
	const [comment, setComment] = useState('');
	const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
	const [comments, setComments] = useState([]); // State to hold all comments

	const handleCommentChange = (event) => {
		setComment(event.target.value);
	};

	const handleSubmitComment = () => {
		if (comment.trim()) {
			const newComment = {
				text: comment,
				profilePicture: 'https://www.example.com/default-profile-pic.jpg', // Placeholder profile picture URL
			};
			setComments((prevComments) => [...prevComments, newComment]); // Add the new comment to the list
			setComment(''); // Reset comment input
		}
	};

	const toggleCommentSection = () => {
		setIsCommentSectionVisible((prev) => !prev);
	};

	return (
		<Card sx={{ maxWidth: 250 }}>
			<CardMedia
				component='img'
				height='250'
				width='250'
				image={artwork.imageUrl}
				alt={artwork.title}
			/>
			<CardContent>
				<Typography
					variant='h5'
					component='div'
					sx={{ fontWeight: 'bold' }}
				>
					{artwork.title}
				</Typography>
				<Typography
					variant='subtitle1'
					color='text.secondary'
				>
					{artwork.artist}
				</Typography>
				<Divider sx={{ margin: '10px 0' }} />

				{/* Comment Bubble Icon */}
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography variant='h6'>Comments</Typography>
					<IconButton onClick={toggleCommentSection}>
						<CommentIcon />
					</IconButton>
				</Box>

				{/* Comment Section (Initially hidden) */}
				{isCommentSectionVisible && (
					<Box sx={{ marginTop: '10px' }}>
						<TextField
							label='Write a comment'
							variant='outlined'
							fullWidth
							multiline
							rows={4}
							value={comment}
							onChange={handleCommentChange}
							sx={{ marginBottom: '10px' }}
						/>
						<Box
							display='flex'
							justifyContent='space-between'
							alignItems='center'
						>
							<Button
								variant='contained'
								color='primary'
								onClick={handleSubmitComment}
								sx={{ marginTop: '10px' }}
							>
								Submit Comment
							</Button>
						</Box>
					</Box>
				)}

				{/* Display List of Comments */}
				{comments.length > 0 && (
					<Box sx={{ marginTop: '20px' }}>
						<Typography variant='h6'>All Comments:</Typography>
						<Box sx={{ marginTop: '10px' }}>
							{comments.map((comment, index) => (
								<Box
									key={index}
									display='flex'
									alignItems='center'
									sx={{ marginBottom: '10px' }}
								>
									<Avatar
										alt='Profile Picture'
										src={comment.profilePicture} // Profile picture URL
										sx={{ width: 30, height: 30, marginRight: '10px' }}
									/>
									<Typography
										variant='body2'
										color='text.secondary'
									>
										{comment.text}
									</Typography>
								</Box>
							))}
						</Box>
					</Box>
				)}
			</CardContent>
		</Card>
	);
};

export default ArtworkPost;
