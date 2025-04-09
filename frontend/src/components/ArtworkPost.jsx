import React, { useState, useEffect } from 'react';
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
	Badge,
	Avatar,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';

const ArtworkPost = ({ artwork }) => {
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
	const [artworkData, setArtworkData] = useState(null);

	// Fetch artwork data (if it's not directly passed as a prop)
	useEffect(() => {
		if (!artwork) {
			axios
				.get('/api/artwork') // Replace with your actual endpoint to fetch artwork
				.then((response) => {
					setArtworkData(response.data); // Assuming the response has the artwork data
				})
				.catch((error) => {
					console.error('Error fetching artwork:', error);
				});
		} else {
			setArtworkData(artwork); // If artwork is already passed as a prop, use it directly
		}
	}, [artwork]);

	// Show loading state until artwork is fetched
	if (!artworkData) {
		return <div>Loading artwork...</div>;
	}

	const handleCommentChange = (event) => {
		setComment(event.target.value);
	};

	const handleSubmitComment = () => {
		if (comment.trim()) {
			const newComment = {
				text: comment,
				profilePicture: 'https://www.example.com/default-profile-pic.jpg',
			};
			setComments((prevComments) => [...prevComments, newComment]);
			setComment('');
			setIsCommentSectionVisible(false);
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
				image={`http://localhost:3000${artworkData.image_path}`}
				alt={artworkData.title || 'Artwork'}
				onError={(e) => {
					e.target.onerror = null;
				}}
			/>
			<CardContent>
				<Typography
					variant='h5'
					component='div'
					sx={{ fontWeight: 'bold' }}
				>
					{artworkData.title}
				</Typography>
				<Typography
					variant='subtitle1'
					color='text.secondary'
				>
					{artworkData.artist}
				</Typography>
				<Divider sx={{ margin: '10px 0' }} />

				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography variant='h6'>Comments</Typography>
					<IconButton onClick={toggleCommentSection}>
						<Badge
							badgeContent={comments.length}
							color='primary'
						>
							<CommentIcon />
						</Badge>
					</IconButton>
				</Box>

				{isCommentSectionVisible && (
					<Box sx={{ marginTop: '10px' }}>
						{/* Comment Input Box */}
						<TextField
							label='Write a comment'
							variant='outlined'
							fullWidth
							multiline
							rows={1}
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
												src={comment.profilePicture}
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
					</Box>
				)}
			</CardContent>
		</Card>
	);
};

export default ArtworkPost;
