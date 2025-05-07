import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactCardFlip from 'react-card-flip';
import CardActionArea from '@mui/material/CardActionArea';
import { BASE_URL } from '../config';

const ProjectCard = ({ project, handleDelete }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const open = Boolean(anchorEl);

	if (!project) {
		return null;
	}

	const imageUrl =
		project.images && project.images.length > 0
			? `${BASE_URL}/uploads/${project.images[0]}`
			: null;

	const handlePopClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopoverImageId(event.target.src);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setPopoverImageId(null);
	};

	return (
		<Box sx={{ marginTop: '1rem' }}>
			<ReactCardFlip
				isFlipped={flip}
				flipDirection='horizontal'
			>
				<Card
					className='card-font'
					sx={{ maxWidth: 300, maxHeight: 600 }}
				>
					<CardActionArea>
						<Box sx={{ position: 'relative', width: 300, height: 300 }}>
							<CardMedia
								sx={{ width: 300, height: 300 }}
								component='img'
								image={imageUrl}
								alt='Project Image'
								onClick={handlePopClick}
							/>
						</Box>

						<Popover
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
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
								height='140'
								image={popoverImageId}
								alt=''
							/>
						</Popover>

						<CardContent sx={{ width: 300, height: 200 }}>
							<IconButton
								aria-label='delete'
								sx={{
									position: 'absolute',
									color: 'black',
									bottom: 15,
									right: 15,
									zIndex: 2,
									'&:hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.04)',
									},
								}}
								onClick={(e) => {
									e.stopPropagation();
									handleDelete();
								}}
							>
								<DeleteIcon />
							</IconButton>

							<Typography
								gutterBottom
								fontSize={16}
								fontWeight={500}
								component='div'
							>
								{project.title}
							</Typography>

							<Typography
								variant='body2'
								sx={{ color: 'text.secondary' }}
							>
								{project.medium}
							</Typography>
						</CardContent>

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								m: 3,
							}}
						>
							<Typography
								sx={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
								onClick={() => setFlip(!flip)}
							>
								Learn More
							</Typography>
						</Box>
					</CardActionArea>
				</Card>

				<Card sx={{ maxWidth: 300, maxHeight: 600 }}>
					<CardContent sx={{ width: 300, height: 500 }}>
						<Typography
							gutterBottom
							fontSize={16}
							fontWeight={500}
							component='div'
						>
							{project.title}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Medium: {project.medium}
						</Typography>
						<br />
						<Typography
							variant='body2'
							sx={{ color: 'text.secondary' }}
						>
							Description: {project.description}
						</Typography>
					</CardContent>

					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							m: 3,
						}}
					>
						<Typography
							sx={{ fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
							onClick={() => setFlip(!flip)}
						>
							Back
						</Typography>
					</Box>
				</Card>
			</ReactCardFlip>
		</Box>
	);
};

export default ProjectCard;
