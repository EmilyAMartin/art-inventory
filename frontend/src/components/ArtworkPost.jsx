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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

const ArtworkPost = ({ artwork }) => {
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
	const timeAgo = (date) => {
		const seconds = Math.floor((new Date() - new Date(date)) / 1000);
		if (seconds < 60) return 'Just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
		const days = Math.floor(hours / 24);
		return `${days} day${days !== 1 ? 's' : ''} ago`;
	};

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/api/comments/${artwork.id}`,
					{ credentials: 'include' }
				);
				const data = await response.json();
				setComments(data);
			} catch (err) {
				console.error('Error fetching comments:', err);
			}
		};

		fetchComments();
	}, [artwork.id]);

	const handleCommentChange = (event) => {
		setComment(event.target.value);
	};

	const handleSubmitComment = async () => {
		if (!comment.trim()) return;

		try {
			const response = await fetch(
				`http://localhost:3000/api/comments/${artwork.id}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ text: comment }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Failed to submit comment:', errorData.message);
				return;
			}

			setComment('');
			setIsCommentSectionVisible(false);
			const updatedComments = await fetch(
				`http://localhost:3000/api/comments/${artwork.id}`,
				{ credentials: 'include' }
			).then((res) => res.json());
			setComments(updatedComments);
		} catch (err) {
			console.error('Error submitting comment:', err);
		}
	};
	const toggleCommentSection = () => {
		setIsCommentSectionVisible((prev) => !prev);
	};

	const imageUrl =
		artwork.images && artwork.images.length > 0
			? `http://localhost:3000/uploads/${artwork.images[0]}`
			: null;

	return (
		<Card sx={{ maxWidth: 300, maxHeight: 600 }}>
			<CardMedia
				style={{ width: 300, height: 300 }}
				component='img'
				image={imageUrl}
				alt='Artwork Image'
			/>

			<CardContent>
				<Typography
					gutterBottom
					fontSize={16}
					fontWeight={500}
				>
					{artwork.title}
				</Typography>
				<Typography
					variant='body2'
					sx={{ color: 'text.secondary' }}
				>
					{artwork.artist}
				</Typography>
				<Divider sx={{ margin: '10px 0' }} />

				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography
						variant='body1'
						fontWeight={500}
						sx={{ color: 'text.secondary' }}
					>
						Comments
					</Typography>
					<IconButton onClick={toggleCommentSection}>
						<Badge
							badgeContent={comments.length}
							color='primary'
						>
							<CommentIcon />
						</Badge>
					</IconButton>
				</Box>

				<Dialog
					open={isCommentSectionVisible}
					onClose={() => setIsCommentSectionVisible(false)}
					fullWidth
					maxWidth='sm'
				>
					<DialogTitle>Comments</DialogTitle>
					<DialogContent dividers>
						<TextField
							label='Write a comment'
							variant='outlined'
							fullWidth
							multiline
							rows={2}
							value={comment}
							onChange={handleCommentChange}
							sx={{ marginBottom: '10px' }}
						/>

						{comments.length > 0 && (
							<Box>
								<Typography
									variant='h6'
									sx={{ marginBottom: '10px' }}
								>
									All Comments:
								</Typography>
								{comments.map((comment, index) => (
									<Box
										key={index}
										display='flex'
										alignItems='flex-start'
										sx={{ marginBottom: '15px' }}
									>
										<Avatar
											alt='Profile Picture'
											src={comment.profile_picture}
											sx={{ width: 30, height: 30, marginRight: '10px' }}
										/>
										<Box>
											<Typography
												variant='body2'
												sx={{ fontWeight: 'bold' }}
											>
												{comment.user_name}
											</Typography>
											<Typography
												variant='body2'
												color='text.secondary'
											>
												{comment.text}
											</Typography>
											<Typography
												variant='caption'
												color='text.disabled'
											>
												{timeAgo(comment.created_at)}
											</Typography>
										</Box>
									</Box>
								))}
							</Box>
						)}
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => setIsCommentSectionVisible(false)}
							color='secondary'
						>
							Close
						</Button>
						<Button
							variant='contained'
							color='primary'
							onClick={handleSubmitComment}
						>
							Submit
						</Button>
					</DialogActions>
				</Dialog>
			</CardContent>
		</Card>
	);
};

export default ArtworkPost;
