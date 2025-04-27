import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
	Popover,
	CardActionArea,
} from '@mui/material';
import ReactCardFlip from 'react-card-flip';
import CommentIcon from '@mui/icons-material/Comment';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchComments = async (artworkId) => {
	const response = await fetch(
		`http://localhost:3000/api/comments/${artworkId}`,
		{
			credentials: 'include',
		}
	);
	if (!response.ok) {
		throw new Error('Error fetching comments');
	}
	return response.json();
};

const submitComment = async ({ artworkId, commentText }) => {
	const response = await fetch(
		`http://localhost:3000/api/comments/${artworkId}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ text: commentText }),
		}
	);
	if (!response.ok) {
		throw new Error('Failed to submit comment');
	}
	return response.json();
};

const ArtworkPost = ({ artwork }) => {
	const [comment, setComment] = useState('');
	const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const open = Boolean(anchorEl);
	const queryClient = useQueryClient();

	const {
		data: comments = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['comments', artwork.id],
		queryFn: () => fetchComments(artwork.id),
		enabled: !!artwork.id,
	});

	const mutation = useMutation({
		mutationFn: submitComment,
		onSuccess: () => {
			queryClient.invalidateQueries(['comments', artwork.id]);
			setComment('');
			setIsCommentSectionVisible(false);
		},
		onError: (error) => {
			console.error('Error submitting comment:', error);
		},
	});

	const handleCommentChange = (event) => {
		setComment(event.target.value);
	};

	const handleSubmitComment = () => {
		if (!comment.trim()) return;
		mutation.mutate({ artworkId: artwork.id, commentText: comment });
	};

	const toggleCommentSection = () => {
		setIsCommentSectionVisible((prev) => !prev);
	};

	const handlePopClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopoverImageId(event.target.src);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setPopoverImageId(null);
	};

	const imageUrl =
		artwork.images && artwork.images.length > 0
			? `http://localhost:3000/uploads/${artwork.images[0]}`
			: null;

	if (!artwork) {
		return null;
	}

	return (
		<div style={{ marginTop: '1rem' }}>
			<ReactCardFlip
				isFlipped={flip}
				flipDirection='horizontal'
			>
				{/* Front Side */}
				<Card sx={{ maxWidth: 300, maxHeight: 600 }}>
					<CardActionArea>
						<CardMedia
							style={{ width: 300, height: 300 }}
							component='img'
							image={imageUrl}
							alt={artwork.title}
							onClick={handlePopClick}
						/>
						<Popover
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
						>
							<CardMedia
								component='img'
								image={popoverImageId}
								alt='Enlarged Artwork'
							/>
						</Popover>
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
							<Typography
								variant='body2'
								sx={{ color: 'text.secondary' }}
							>
								{artwork.date}
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
						</CardContent>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								margin: 25,
							}}
						>
							<div
								style={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
								onClick={() => setFlip(!flip)}
							>
								Learn More
							</div>
						</div>
					</CardActionArea>
				</Card>

				{/* Back Side */}
				<Card sx={{ maxWidth: 300, maxHeight: 600 }}>
					<CardContent style={{ width: 300, height: 500 }}>
						<Typography
							gutterBottom
							fontSize={16}
							fontWeight={500}
							component='div'
						>
							{artwork.title}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Artist: {artwork.artist}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Date: {artwork.date}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Location: {artwork.location}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Medium: {artwork.medium}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Description: {artwork.description}
						</Typography>
					</CardContent>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							margin: 25,
						}}
					>
						<div
							style={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
							onClick={() => setFlip(!flip)}
						>
							Back
						</div>
					</div>
				</Card>
			</ReactCardFlip>

			{/* Comment Section Dialog */}
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
					{isLoading ? (
						<Typography>Loading comments...</Typography>
					) : isError ? (
						<Typography color='error'>Error: {error.message}</Typography>
					) : comments.length > 0 ? (
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
									<Link
										to={`/users/${comment.user_id}`}
										style={{ textDecoration: 'none' }}
									>
										<Avatar
											alt='Profile Picture'
											src={comment.profile_picture}
											sx={{
												width: 30,
												height: 30,
												marginRight: '10px',
												cursor: 'pointer',
											}}
										/>
									</Link>
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
											{new Date(comment.created_at).toLocaleTimeString()}
										</Typography>
									</Box>
								</Box>
							))}
						</Box>
					) : (
						<Typography>No comments yet.</Typography>
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
		</div>
	);
};

export default ArtworkPost;
