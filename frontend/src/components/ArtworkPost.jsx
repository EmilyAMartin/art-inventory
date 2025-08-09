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
import CommentIcon from '@mui/icons-material/Comment';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { green, red } from '@mui/material/colors';
import { BASE_URL } from '../config';

const ArtworkPost = ({ artwork, isLoggedIn }) => {
	const [comment, setComment] = useState('');
	const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const open = Boolean(anchorEl);
	const queryClient = useQueryClient();

	const fetchComments = async (artworkId) => {
		const response = await fetch(`${BASE_URL}/comments/${artworkId}`, {
			credentials: 'include',
		});
		if (!response.ok) {
			throw new Error('Error fetching comments');
		}
		return response.json();
	};

	const submitComment = async ({ artworkId, commentText }) => {
		const response = await fetch(`${BASE_URL}/comments/${artworkId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ text: commentText }),
		});
		if (!response.ok) {
			throw new Error('Failed to submit comment');
		}
		return response.json();
	};

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

	const handleCommentChange = (event) => setComment(event.target.value);

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
			? artwork.images[0].startsWith('http')
				? artwork.images[0]
				: `https://art-portfolio.fly.dev/uploads/${artwork.images[0]}`
			: null;

	if (!artwork) return null;

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: 4 }}>
			<Card sx={{ maxWidth: 300, maxHeight: 450, position: 'relative' }}>
				<CardActionArea>
					<CardMedia
						sx={{ width: 300, height: 300 }}
						component='img'
						image={imageUrl}
						alt={artwork.title}
						onClick={handlePopClick}
					/>

					{/* Popover */}
					<Popover
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							position: 'fixed',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							zIndex: 1300,
						}}
						open={open}
						anchorEl={anchorEl}
						anchorReference='none'
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
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
						<Divider sx={{ my: 1 }} />

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
						</Box>
					</CardContent>
				</CardActionArea>

				{/* Comment button outside CardActionArea to prevent whole card hover */}
				<Box
					sx={{
						position: 'absolute',
						bottom: 16,
						right: 16,
					}}
				>
					<IconButton onClick={toggleCommentSection}>
						<Badge
							badgeContent={comments.length}
							color='primary'
						>
							<CommentIcon />
						</Badge>
					</IconButton>
				</Box>
			</Card>

			<Dialog
				open={isCommentSectionVisible}
				onClose={() => setIsCommentSectionVisible(false)}
				fullWidth
				maxWidth='sm'
			>
				<DialogTitle>Comments</DialogTitle>
				<DialogContent dividers>
					{!isLoggedIn ? (
						<Typography
							color='error'
							sx={{ mb: 2 }}
						>
							You must be logged in to leave a comment.
						</Typography>
					) : (
						<TextField
							label='Write a comment'
							variant='outlined'
							fullWidth
							multiline
							rows={2}
							value={comment}
							onChange={handleCommentChange}
							sx={{ mb: 2 }}
						/>
					)}

					{isLoading ? (
						<Typography>Loading comments...</Typography>
					) : isError ? (
						<Typography color='error'>Error: {error.message}</Typography>
					) : comments.length > 0 ? (
						<Box>
							<Typography
								variant='h6'
								sx={{ mb: 2 }}
							>
								All Comments:
							</Typography>
							{comments.map((comment, index) => (
								<Box
									key={index}
									display='flex'
									alignItems='flex-start'
									sx={{ mb: 2 }}
								>
									<Link
										to={`/users/${comment.user_id}`}
										sx={{ textDecoration: 'none' }}
									>
										<Avatar
											alt='Profile Picture'
											src={comment.profile_picture}
											sx={{ width: 30, height: 30, mr: 1, cursor: 'pointer' }}
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

				<DialogActions
					sx={{ display: 'flex', justifyContent: 'center', gap: 3, my: 2 }}
				>
					<Button
						variant='contained'
						onClick={handleSubmitComment}
						disabled={!isLoggedIn || mutation.isLoading}
						sx={{
							fontSize: '1rem',
							textTransform: 'none',
							color: '#fff',
							borderRadius: '1rem',
							bgcolor: green[400],
							'&:hover': { bgcolor: green[700] },
						}}
					>
						Submit
					</Button>
					<Button
						onClick={() => setIsCommentSectionVisible(false)}
						sx={{
							fontSize: '1rem',
							textTransform: 'none',
							color: '#fff',
							borderRadius: '1rem',
							bgcolor: red[500],
							'&:hover': { bgcolor: red[700] },
						}}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default ArtworkPost;
