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

const ArtworkPost = ({ artwork, onSubmitComment }) => {
	const [comment, setComment] = useState('');
	const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);

	const handleCommentChange = (event) => {
		setComment(event.target.value);
	};

	const handleSubmitComment = () => {
		if (comment.trim()) {
			onSubmitComment(comment);
			setComment('');
		}
	};

	const toggleCommentSection = () => {
		setIsCommentSectionVisible((prev) => !prev);
	};

	return (
		<Card sx={{ maxWidth: 400, margin: '20px auto', borderRadius: 2 }}>
			<CardMedia
				component='img'
				height='250'
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
			</CardContent>
		</Card>
	);
};

export default ArtworkPost;
