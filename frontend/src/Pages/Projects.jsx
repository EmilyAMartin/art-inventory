import React, { useState } from 'react';
import AddProjectBtn from '../components/AddProjectBtn';
import ProjectCard from '../components/ProjectCard';

const ProjectPage = () => {
	const [projects, setProjects] = useState([]);

	const handleProjectAdded = (newProject) => {
		const updatedProjects = [...projects, newProject];
		setProjects(updatedProjects);
	};

	const handleDeleteProject = (index) => {
		const updatedProjects = projects.filter((_, i) => i !== index);
		setProjects(updatedProjects);
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
