import { useState, useEffect } from 'react';
import AddProjectBtn from '../components/AddProjectBtn';
import AddNewBtn from '../components/AddNewBtn';
import ProjectCard from '../components/ProjectCard';
import NewArtCard from '../components/NewArtCard';

const PortfolioPage = () => {
	const [projects, setProjects] = useState([]);
	const [artworks, setArtworks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Initial data fetch
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
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

				setProjects(formattedProjects);
				setArtworks(formattedArtworks);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleProjectAdded = (newProject) => {
		const formattedProject = {
			...newProject,
			images: newProject.image_path ? [newProject.image_path] : [],
		};
		setProjects((prev) => [...prev, formattedProject]);
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

			setProjects((prev) => prev.filter((project) => project.id !== projectId));
		} catch (error) {
			console.error('Error deleting project:', error);
			alert('Failed to delete project');
		}
	};

	const handleNewArtworkAdded = (newArtwork) => {
		if (Array.isArray(newArtwork)) {
			setArtworks(newArtwork);
		} else if (newArtwork && typeof newArtwork === 'object') {
			setArtworks((prevState) => {
				const exists = prevState.some((art) => art.id === newArtwork.id);
				if (exists) {
					return prevState;
				}
				return [...prevState, newArtwork];
			});
		}
	};

	const handleDeleteNewArtwork = (artworkId) => {
		setArtworks((prev) => prev.filter((art) => art.id !== artworkId));
	};
	const renderProjects = () => {
		if (projects.length === 0) {
			return <div>No projects added</div>;
		}

		return (
			<div
				style={{
					width: '100%',
					padding: '0 20px',
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
					gap: '20px',
					justifyContent: 'center',
				}}
			>
				{projects.map((project) => (
					<div key={project.id}>
						<ProjectCard
							project={project}
							handleDelete={() => handleDeleteProject(project.id)}
						/>
					</div>
				))}
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
			<div
				style={{
					width: '100%',
					padding: '0 20px',
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
					gap: '20px',
					justifyContent: 'center',
				}}
			>
				{artworks.map((art) => (
					<div key={art.id}>
						<NewArtCard
							artwork={art}
							onDelete={handleDeleteNewArtwork}
						/>
					</div>
				))}
			</div>
		);
	};

	return (
		<div style={{ marginBottom: '3rem' }}>
			{/* Project Section */}
			<div style={{ margin: '1rem' }}>
				<h2>Portfolio</h2>
			</div>
			<div style={{ margin: '1rem' }}>
				<AddProjectBtn onProjectAdded={handleProjectAdded} />
			</div>
			{isLoading ? <div>Loading projects...</div> : renderProjects()}

			{/* Artwork Section */}
			<div style={{ marginTop: '2rem', marginLeft: '1rem' }}>
				<h2>Artwork</h2>
			</div>
			<div style={{ margin: '1rem' }}>
				<AddNewBtn onArtworkAdded={handleNewArtworkAdded} />
			</div>
			{isLoading ? <div>Loading artwork...</div> : renderArtwork()}
		</div>
	);
};

export default PortfolioPage;
