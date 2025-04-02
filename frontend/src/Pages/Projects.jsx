import { useState, useEffect, useCallback } from 'react';
import AddProjectBtn from '../components/AddProjectBtn';
import ProjectCard from '../components/ProjectCard';
import AddNewBtn from '../components/AddNewBtn';
import NewArtCard from '../components/NewArtCard';

const ProjectPage = () => {
	const [projects, setProjects] = useState([]);
	const [newAddedArtwork, setNewAddedArtwork] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch projects from backend
	const fetchProjects = useCallback(async () => {
		try {
			const response = await fetch('http://localhost:3000/projects', {
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to fetch projects');
			}

			const data = await response.json();
			// Format the project data to match artwork format
			const formattedProjects = data.map((project) => ({
				...project,
				images: project.image_path ? [project.image_path] : [],
			}));
			setProjects(formattedProjects);
		} catch (error) {
			console.error('Error fetching projects:', error);
		}
	}, []);

	// Initial data fetch
	useEffect(() => {
		let isMounted = true;

		const fetchData = async () => {
			try {
				setIsLoading(true);
				await Promise.all([
					fetchProjects(),
					(async () => {
						const response = await fetch('http://localhost:3000/artworks', {
							credentials: 'include',
						});

						if (!response.ok) {
							throw new Error('Failed to fetch artworks');
						}

						const data = await response.json();
						const formattedArtworks = data.map((artwork) => ({
							...artwork,
							images: artwork.image_path ? [artwork.image_path] : [],
							location: artwork.place_of_origin,
							medium: artwork.medium_display,
							date: artwork.date_end,
						}));

						if (isMounted) {
							setNewAddedArtwork(formattedArtworks);
						}
					})(),
				]);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	}, [fetchProjects]);

	// Memoize the handlers
	const handleProjectAdded = useCallback((newProject) => {
		// Format the new project data to match artwork format
		const formattedProject = {
			...newProject,
			images: newProject.image_path ? [newProject.image_path] : [],
		};
		setProjects((prev) => [...prev, formattedProject]);
	}, []);

	const handleDeleteProject = useCallback(async (projectId) => {
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
	}, []);

	const handleNewArtworkAdded = useCallback((newArtwork) => {
		if (Array.isArray(newArtwork)) {
			setNewAddedArtwork(newArtwork);
		} else if (newArtwork && typeof newArtwork === 'object') {
			setNewAddedArtwork((prevState) => {
				// Check if artwork with same ID already exists
				const exists = prevState.some((art) => art.id === newArtwork.id);
				if (exists) {
					return prevState;
				}
				return [...prevState, newArtwork];
			});
		}
	}, []);

	const handleDeleteNewArtwork = useCallback((artworkId) => {
		setNewAddedArtwork((prev) => prev.filter((art) => art.id !== artworkId));
	}, []);

	// Memoize the render functions
	const renderProjects = useCallback(() => {
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
	}, [projects, handleDeleteProject]);

	const renderArtwork = useCallback(() => {
		if (!newAddedArtwork || newAddedArtwork.length === 0) {
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
				{newAddedArtwork.map((art) => (
					<div key={art.id}>
						<NewArtCard
							artwork={art}
							onDelete={handleDeleteNewArtwork}
						/>
					</div>
				))}
			</div>
		);
	}, [newAddedArtwork, handleDeleteNewArtwork]);

	return (
		<div
			style={{
				marginTop: 25,
				display: 'flex',
				flexDirection: 'column',
				gap: 30,
			}}
		>
			{/* Projects Section */}
			<div>
				<h2 style={{ marginBottom: '1rem' }}>Projects</h2>
				<AddProjectBtn onProjectAdded={handleProjectAdded} />
				{isLoading ? <div>Loading projects...</div> : renderProjects()}
			</div>

			{/* Artwork Section */}
			<div>
				<h2 style={{ marginBottom: '1rem' }}>Artwork</h2>
				<AddNewBtn onArtworkAdded={handleNewArtworkAdded} />
				{isLoading ? <div>Loading artwork...</div> : renderArtwork()}
			</div>
		</div>
	);
};

export default ProjectPage;
