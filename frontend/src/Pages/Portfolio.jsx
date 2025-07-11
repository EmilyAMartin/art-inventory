import AddProjectBtn from '../components/AddProjectBtn';
import AddNewBtn from '../components/AddNewBtn';
import ProjectCardCarousel from '../components/ProjectCardCarousel';
import NewArtCardCarousel from '../components/NewArtCarousel';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../components/queryClient';
import { Box, Typography } from '@mui/material';
import { BASE_URL } from '../config';

const fetchPortfolioData = async () => {
	const [projectsResponse, artworksResponse] = await Promise.all([
		fetch(`${BASE_URL}/projects`, {
			credentials: 'include',
		}),
		fetch(`${BASE_URL}/my-artworks`, {
			credentials: 'include',
		}),
	]);

	if (!projectsResponse.ok) {
		throw new Error('Failed to fetch projects');
	}
	if (!artworksResponse.ok) {
		throw new Error('Failed to fetch artworks');
	}

	const [projectsData, artworksData] = await Promise.all([
		projectsResponse.json(),
		artworksResponse.json(),
	]);

	const formattedProjects = projectsData.map((project) => ({
		...project,
		images: project.image_path ? [project.image_path] : [],
	}));

	const formattedArtworks = artworksData.map((artwork) => ({
		...artwork,
		images: artwork.image_path ? [artwork.image_path] : [],
		location: artwork.place_of_origin,
		medium: artwork.medium_display,
		date: artwork.date_end,
	}));

	return {
		formattedProjects,
		formattedArtworks,
	};
};

const PortfolioPage = () => {
	const { isLoading, data } = useQuery({
		queryFn: fetchPortfolioData,
		meta: {
			errorMessage: 'Failed to fetch portfolio data!',
		},
	});

	const projects = data?.formattedProjects;
	const artworks = data?.formattedArtworks;

	const handleProjectAdded = (newProject) => {
		queryClient.invalidateQueries(['portfolio']);
		toast.success('Project added successfully');
	};

	const handleDeleteProject = async (projectId) => {
		try {
			const response = await fetch(`${BASE_URL}/projects/${projectId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to delete project');
			}

			queryClient.invalidateQueries(['portfolio']);
			toast.success('Project deleted successfully');
		} catch (error) {
			console.error('Error deleting project:', error);
			toast.error('Failed to delete project');
		}
	};

	const handleNewArtworkAdded = (newArtwork) => {
		queryClient.invalidateQueries(['portfolio']);
		toast.success('Artwork added successfully');
	};

	const handleDeleteNewArtwork = async (artworkId) => {
		try {
			const response = await fetch(`${BASE_URL}/artworks/${artworkId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to delete artwork');
			}

			queryClient.invalidateQueries(['portfolio']);
			toast.success('Artwork deleted successfully');
		} catch (error) {
			console.error('Error deleting artwork:', error);
			toast.error('Failed to delete artwork');
		}
	};

	const renderProjects = () => {
		if (!projects || projects.length === 0) {
			return (
				<Box sx={{ mt: 2, color: '#666' }}>
					<Typography>No projects available</Typography>
				</Box>
			);
		}

		return (
			<Box>
				<ProjectCardCarousel
					projects={projects}
					handleDeleteProject={handleDeleteProject}
				/>
			</Box>
		);
	};

	const renderArtwork = () => {
		if (!artworks || artworks.length === 0) {
			return (
				<Box sx={{ mt: 2, color: '#666' }}>
					<Typography>No artworks available</Typography>
				</Box>
			);
		}

		return (
			<Box>
				<NewArtCardCarousel
					artworks={artworks}
					handleDeleteNewArtwork={handleDeleteNewArtwork}
				/>
			</Box>
		);
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				paddingBottom: 20,
				minHeight: '100vh',
				boxSizing: 'border-box',
			}}
		>
			{/* Artwork Section */}
			<Typography
				variant='h6'
				sx={{
					marginTop: 5,
					textAlign: { xs: 'left', md: 'left' },
				}}
			>
				Artwork
			</Typography>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: { xs: 'center', md: 'flex-start' }, // Center on mobile, left on desktop
					width: '100%',
				}}
			>
				<AddNewBtn onArtworkAdded={handleNewArtworkAdded} />
				{isLoading ? <Typography>Loading artwork...</Typography> : renderArtwork()}
			</Box>

			{/* Project Section */}
			<Typography
				variant='h6'
				sx={{
					marginTop: 20,
					textAlign: { xs: 'left', md: 'left' },
				}}
			>
				Projects
			</Typography>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: { xs: 'center', md: 'flex-start' },
					width: '100%',
				}}
			>
				<AddProjectBtn onProjectAdded={handleProjectAdded} />
				{isLoading ? (
					<Typography>Loading projects...</Typography>
				) : (
					renderProjects()
				)}
			</Box>

			<Box sx={{ height: 50 }} />
		</Box>
	);
};

export default PortfolioPage;
