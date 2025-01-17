import React from 'react';
import AddProjectBtn from '../components/AddProjectBtn copy';
import ProjectCard from '../components/ProjectCard';
import Grid2 from '@mui/material/Grid2';

const Projects = () => {
	return (
		<div>
			<AddProjectBtn />
			<Grid2
				margin='auto'
				container
				spacing={8}
				style={{
					marginTop: '25px',
					marginBottom: '50px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-around',
				}}
			>
				<ProjectCard />
			</Grid2>
		</div>
	);
};

export default Projects;
