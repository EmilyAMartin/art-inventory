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
		setProjects((prevProjects) => {
			return prevProjects.filter((_, i) => i !== index);
		});
	};

	return (
		<div
			style={{ marginTop: 25, display: 'flex', flexDirection: 'column', gap: 25 }}
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
