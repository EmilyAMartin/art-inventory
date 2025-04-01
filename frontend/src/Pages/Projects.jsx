import { useState } from 'react';
import AddProjectBtn from '../components/AddProjectBtn';
import ProjectCard from '../components/ProjectCard';
import AddNewBtn from '../components/AddNewBtn';
import NewArtCard from '../components/NewArtCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProjectPage = () => {
	const [projects, setProjects] = useState([]);
	const [newAddedArtwork, setNewAddedArtwork] = useState([]);

	const handleProjectAdded = (newProject) => {
		const updatedProjects = [...projects, newProject];
		setProjects(updatedProjects);
	};

	const handleDeleteProject = (index) => {
		const updatedProjects = projects.filter((_, i) => i !== index);
		setProjects(updatedProjects);
	};

	const handleNewArtworkAdded = (newNewArtwork) => {
		if (Array.isArray(newNewArtwork)) {
			setNewAddedArtwork(newNewArtwork);
		} else {
			setNewAddedArtwork((prevState) => [...prevState, newNewArtwork]);
		}
	};

	const handleDeleteNewArtwork = (index) => {
		setNewAddedArtwork((prevState) => prevState.filter((_, i) => i !== index));
	};

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
		],
	};

	const renderProjects = () => {
		if (projects.length === 0) {
			return <div>No projects added</div>;
		}

		if (projects.length <= 4) {
			return (
				<div
					style={{ marginTop: 25, display: 'flex', flexDirection: 'row', gap: 25 }}
				>
					{projects.map((project, index) => (
						<ProjectCard
							key={index}
							projects={[project]}
							handleDelete={() => handleDeleteProject(index)}
						/>
					))}
				</div>
			);
		}

		return (
			<Slider {...settings}>
				{projects.map((project, index) => (
					<div
						key={index}
						style={{ padding: '0 10px' }}
					>
						<ProjectCard
							projects={[project]}
							handleDelete={() => handleDeleteProject(index)}
						/>
					</div>
				))}
			</Slider>
		);
	};

	const renderArtwork = () => {
		if (!newAddedArtwork || newAddedArtwork.length === 0) {
			return (
				<div style={{ marginTop: '1rem', color: '#666' }}>No artwork available</div>
			);
		}

		if (newAddedArtwork.length <= 4) {
			return (
				<div
					style={{ marginTop: 25, display: 'flex', flexDirection: 'row', gap: 25 }}
				>
					{newAddedArtwork.map((art, index) => (
						<NewArtCard
							key={art.id || index}
							newAddedArtwork={newAddedArtwork}
							handleDelete={handleDeleteNewArtwork}
							index={index}
						/>
					))}
				</div>
			);
		}

		return (
			<Slider {...settings}>
				{newAddedArtwork.map((art, index) => (
					<div
						key={art.id || index}
						style={{ padding: '0 10px' }}
					>
						<NewArtCard
							newAddedArtwork={newAddedArtwork}
							handleDelete={handleDeleteNewArtwork}
							index={index}
						/>
					</div>
				))}
			</Slider>
		);
	};

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
				{renderProjects()}
			</div>

			{/* Artwork Section */}
			<div>
				<h2 style={{ marginBottom: '1rem' }}>Artwork</h2>
				<AddNewBtn onArtworkAdded={handleNewArtworkAdded} />
				{renderArtwork()}
			</div>
		</div>
	);
};

export default ProjectPage;
