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
	Badge,
	Avatar,
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';

const ArtworkPost = ({ artwork }) => {
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);

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
					component='div'
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
