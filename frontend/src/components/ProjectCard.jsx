import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactCardFlip from 'react-card-flip';
import CardActionArea from '@mui/material/CardActionArea';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const ProjectCard = ({ project, handleDelete }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [popoverImageId, setPopoverImageId] = useState(null);
	const [flip, setFlip] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const open = Boolean(anchorEl);

	if (!project) {
		return null;
	}

	const imageUrl =
		project.images && project.images.length > 0
			? `http://localhost:3000/uploads/${project.images[currentImageIndex]}`
			: null;

	const handlePopClick = (event) => {
		setAnchorEl(event.currentTarget);
		setPopoverImageId(event.target.src);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setPopoverImageId(null);
	};

	const handleNextImage = () => {
		if (project.images && project.images.length > 0) {
			setCurrentImageIndex((prevIndex) =>
				prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
			);
		}
	};

	const handlePrevImage = () => {
		if (project.images && project.images.length > 0) {
			setCurrentImageIndex((prevIndex) =>
				prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
			);
		}
	};

	return (
		<div style={{ marginTop: 25 }}>
			<ReactCardFlip
				isFlipped={flip}
				flipDirection='horizontal'
			>
				<Card
					className='card-font'
					sx={{ maxWidth: 300, maxHeight: 600 }}
				>
					<CardActionArea>
						<div style={{ position: 'relative', width: 300, height: 300 }}>
							<CardMedia
								style={{ width: 300, height: 300 }}
								component='img'
								image={imageUrl}
								alt='Project Image'
								onClick={handlePopClick}
							/>
							{project.images && project.images.length > 1 && (
								<>
									<IconButton
										onClick={handlePrevImage}
										sx={{
											position: 'absolute',
											left: 8,
											top: '50%',
											transform: 'translateY(-50%)',
											backgroundColor: 'rgba(255, 255, 255, 0.7)',
											'&:hover': {
												backgroundColor: 'rgba(255, 255, 255, 0.9)',
											},
										}}
									>
										<NavigateBeforeIcon />
									</IconButton>
									<IconButton
										onClick={handleNextImage}
										sx={{
											position: 'absolute',
											right: 8,
											top: '50%',
											transform: 'translateY(-50%)',
											backgroundColor: 'rgba(255, 255, 255, 0.7)',
											'&:hover': {
												backgroundColor: 'rgba(255, 255, 255, 0.9)',
											},
										}}
									>
										<NavigateNextIcon />
									</IconButton>
									<div
										style={{
											position: 'absolute',
											bottom: 8,
											left: '50%',
											transform: 'translateX(-50%)',
											backgroundColor: 'rgba(0, 0, 0, 0.5)',
											color: 'white',
											padding: '4px 8px',
											borderRadius: '12px',
											fontSize: '12px',
										}}
									>
										{currentImageIndex + 1} / {project.images.length}
									</div>
								</>
							)}
						</div>

						<Popover
							sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
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

						<CardContent style={{ width: 300, height: 200 }}>
							<IconButton
								aria-label='delete'
								color='black'
								sx={{
									position: 'absolute',
									bottom: 10,
									right: 10,
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

						<div
							className='favorites-more'
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

				<Card
					className='card-back'
					sx={{ maxWidth: 300, maxHeight: 600 }}
				>
					<CardContent style={{ width: 300, height: 500 }}>
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
		</div>
	);
};

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
