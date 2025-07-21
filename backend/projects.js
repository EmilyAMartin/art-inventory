import { dbPool } from './db.js';
import upload from './fileUpload.js';
import path from 'path';
import fs from 'fs';
import express from 'express';

export const createTable = async () => {
	try {
		await dbPool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                title VARCHAR(255),
                medium VARCHAR(255),
                description TEXT,
                image_path VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

		console.log('Projects table schema updated successfully.');
	} catch (err) {
		console.error('Error updating projects table schema:', err);
	}
};

export const setupRoutes = (app) => {
	app.get('api/projects', async (req, res) => {
		if (!req.session.user) {
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
				message: 'You must be logged in to view projects',
			});
		}

		try {
			const [results] = await dbPool.query(
				`SELECT projects.id, projects.title, projects.medium, projects.description, projects.image_path
				FROM projects
				WHERE projects.user_id = ?`,
				[req.session.user.id]
			);
			const formattedProjects = results.map((project) => ({
				...project,
				images: project.image_path ? [project.image_path] : [],
				image_path: project.image_path,
			}));

			res.json(formattedProjects);
		} catch (error) {
			console.error('Error fetching projects:', error);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
			});
		}
	});

	app.post('api/projects', upload.single('image'), async (req, res) => {
		console.log('Received project creation request:', req.body);
		console.log('Uploaded file:', req.file);
		console.log('Session user:', req.session.user);

		if (!req.session.user) {
			console.log('No user session found');
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
				message: 'You must be logged in to add a project',
			});
		}

		try {
			const { title, medium, description } = req.body;
			const imagePath = req.file ? req.file.filename : null;

			console.log('File upload details:', {
				originalPath: req.file?.path,
				filename: req.file?.filename,
				imagePath,
			});

			console.log('Received data:', {
				title,
				medium,
				description,
				imagePath,
				userId: req.session.user.id,
			});

			if (!title || !medium) {
				console.log('Missing required fields');
				return res.status(400).json({
					success: false,
					error: 'Missing required fields',
					message: 'Title and medium are required',
				});
			}

			const query = `INSERT INTO projects (user_id, title, medium, description, image_path) VALUES (?, ?, ?, ?, ?)`;
			const values = [req.session.user.id, title, medium, description, imagePath];

			console.log('Executing query:', query);
			console.log('With values:', values);

			let result;
			try {
				[result] = await dbPool.query(query, values);
				console.log('Query result:', result);
			} catch (insertError) {
				console.error('Error inserting project:', insertError);
				return res.status(500).json({
					success: false,
					error: 'Database Error',
					message: 'Error inserting project into database',
					details: insertError.message,
				});
			}

			let newProject;
			try {
				[newProject] = await dbPool.query(
					`SELECT projects.id, projects.title, projects.medium, projects.description, projects.image_path
					FROM projects 
					WHERE projects.id = ?`,
					[result.insertId]
				);
				console.log('Retrieved new project:', newProject[0]);
				const project = newProject[0];
				console.log('Project before formatting:', project);
				project.images = project.image_path ? [project.image_path] : [];
				project.image_path = project.image_path;
				console.log('Project after formatting:', project);
			} catch (retrieveError) {
				console.error('Error retrieving new project:', retrieveError);
				return res.status(500).json({
					success: false,
					error: 'Database Error',
					message: 'Error retrieving newly created project',
					details: retrieveError.message,
				});
			}

			res.status(201).json({
				success: true,
				data: newProject[0],
			});
		} catch (error) {
			console.error('Error creating project:', error);
			console.error('Error stack:', error.stack);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
				stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
			});
		}
	});

	app.delete('api/projects/:id', async (req, res) => {
		if (!req.session.user) {
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
				message: 'You must be logged in to delete projects',
			});
		}

		try {
			const projectId = req.params.id;
			const [projectResult] = await dbPool.query(
				'SELECT user_id, image_path FROM projects WHERE id = ?',
				[projectId]
			);

			if (projectResult.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Not found',
					message: 'Project not found',
				});
			}

			if (projectResult[0].user_id !== req.session.user.id) {
				return res.status(403).json({
					success: false,
					error: 'Forbidden',
					message: 'You can only delete your own projects',
				});
			}

			if (projectResult[0].image_path) {
				try {
					fs.unlinkSync(projectResult[0].image_path);
				} catch (unlinkError) {
					console.error('Error deleting image file:', unlinkError);
				}
			}
			await dbPool.query('DELETE FROM projects WHERE id = ?', [projectId]);

			res.json({
				success: true,
				message: 'Project deleted successfully',
			});
		} catch (error) {
			console.error('Error deleting project:', error);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
			});
		}
	});
};
