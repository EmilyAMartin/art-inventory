import AddProjectBtn from '../components/AddProjectBtn';
import AddNewBtn from '../components/AddNewBtn';
import ProjectCardCarousel from '../components/ProjectCardCarousel';
import NewArtCardCarousel from '../components/NewArtCarousel';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../components/queryClient';

const fetchPortfolioData = async () => {
	const [projectsResponse, artworksResponse] = await Promise.all([
		fetch('http://localhost:3000/projects', {
			credentials: 'include',
		}),
		fetch('http://localhost:3000/my-artworks', {
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
		// refetch
		toast.success('Project added successfully');
	};

	const handleDeleteProject = async (projectId) => {
		try {
			const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
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
		// refetch
		toast.success('Artwork added successfully');
	};

	const handleDeleteNewArtwork = (artworkId) => {
		// refetch
		toast.success('Artwork deleted successfully');
	};

	const renderProjects = () => {
		if (!projects || projects.length === 0) {
			return (
				<div style={{ marginTop: '1rem', color: '#666' }}>
					No projects available
				</div>
			);
		}

		return (
			<div>
				<ProjectCardCarousel
					projects={projects}
					handleDeleteProject={handleDeleteProject}
				/>
			</div>
		);
	};

	const renderArtwork = () => {
		if (!artworks || artworks.length === 0) {
			return (
				<div style={{ marginTop: '1rem', color: '#666' }}>No artwork available</div>
			);
		}

		return (
			<div>
				<NewArtCardCarousel
					artworks={artworks}
					handleDeleteNewArtwork={handleDeleteNewArtwork}
				/>
			</div>
		);
	};

	return (
		<div style={{ marginBottom: '3rem' }}>
			{/* Project Section */}
			<div style={{ margin: '2rem' }}>
				<h2>Portfolio</h2>
			</div>
			<div style={{ margin: '2rem' }}>
				<AddProjectBtn onProjectAdded={handleProjectAdded} />
			</div>
			{isLoading ? <div>Loading projects...</div> : renderProjects()}

			{/* Artwork Section */}
			<div style={{ marginTop: '15rem', marginLeft: '2rem' }}>
				<h2>Artwork</h2>
			</div>
			<div style={{ margin: '2rem' }}>
				<AddNewBtn onArtworkAdded={handleNewArtworkAdded} />
			</div>
			{isLoading ? <div>Loading artwork...</div> : renderArtwork()}
		</div>
	);
};

export default PortfolioPage;
