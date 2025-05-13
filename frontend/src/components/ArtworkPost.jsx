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

const fetchComments = async (artworkId) => {
	const response = await fetch(`${BASE_URL}/api/comments/${artworkId}`, {
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Error fetching comments');
	}
	return response.json();
};

const submitComment = async ({ artworkId, commentText }) => {
	const response = await fetch(`${BASE_URL}/api/comments/${artworkId}`, {
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

const ArtworkPost = ({ artwork }) => {
	const [comment, setComment] = useState('');
	const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
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
			? `${BASE_URL}/uploads/${artwork.images[0]}`
			: null;

	if (!artwork) return null;

	return (
		<Box
			sx={{
				position: 'relative', // Ensure proper layering
			}}
		>
			{/* Background content wrapper */}
			<Box
				sx={{
					filter: open ? 'blur(5px)' : 'none', // Apply blur to the entire page
					pointerEvents: open ? 'none' : 'auto', // Disable interaction with blurred content
					transition: 'filter 0.3s ease', // Smooth transition for the blur effect
				}}
			>
				{/* Main content */}
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						paddingBottom: 4,
					}}
				>
					<Card sx={{ maxWidth: 300, maxHeight: 450 }}>
						<CardActionArea>
							<CardMedia
								sx={{ width: 300, height: 300 }}
								component='img'
								image={imageUrl}
								alt={artwork.title}
								onClick={handlePopClick}
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
						</CardActionArea>
					</Card>
				</Box>
			</Box>

			{/* Popover */}
			<Popover
				open={open}
				anchorEl={anchorEl}
				anchorReference='none'
				onClose={handleClose}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Dim background
					zIndex: 1300, // Ensure it appears above other content
				}}
			>
				<CardMedia
					component='img'
					image={popoverImageId}
					alt='Enlarged Artwork'
				/>
			</Popover>
		</Box>
	);
};

export default ArtworkPost;
