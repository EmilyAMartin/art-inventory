import React, { useState, useEffect } from 'react';
import AddProjectBtn from '../components/AddProjectBtn copy';
import ProjectCard from '../components/ProjectCard';

const ProjectPage = () => {
	const [projects, setProjects] = useState([]);

	const fetchProjects = () => {
		const storedProjects = JSON.parse(localStorage.getItem('projectData')) || [];
		setProjects(storedProjects);
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	const handleProjectAdded = (newProject) => {
		const updatedProjects = [...projects, newProject];
		localStorage.setItem('projectData', JSON.stringify(updatedProjects));
		setProjects(updatedProjects);
	};

	const handleDeleteProject = (index) => {
		const updatedProjects = projects.filter((_, i) => i !== index);
		setProjects(updatedProjects);
		localStorage.setItem('projectData', JSON.stringify(updatedProjects));
	};

	return (
		<div
			style={{
				marginTop: 25,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<AddProjectBtn onProjectAdded={handleProjectAdded} />
			<ProjectCard
				projects={projects}
				handleDelete={handleDeleteProject}
			/>
		</div>
	);
};

export default ProjectPage;
