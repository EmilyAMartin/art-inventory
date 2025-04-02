import { dbPool } from './db.js';
import upload from './fileUpload.js';
import path from 'path';
import fs from 'fs';
import express from 'express';

export const createTable = async () => {
	try {
		// First create the table if it doesn't exist
		await dbPool.query(`
      CREATE TABLE IF NOT EXISTS artwork (
        id INT AUTO_INCREMENT PRIMARY KEY,
        artist_id INT,
        title VARCHAR(255),
        date_end VARCHAR(50),
        image_path VARCHAR(255),
        place_of_origin VARCHAR(255),
        artwork_type_title VARCHAR(255),
        medium_display VARCHAR(255),
        credit_line VARCHAR(255),
        description TEXT,
        FOREIGN KEY (artist_id) REFERENCES users(id)
      );
    `);

		// Check if description column exists
		const [columns] = await dbPool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'artwork' 
      AND COLUMN_NAME = 'description';
    `);

		// Add description column if it doesn't exist
		if (columns.length === 0) {
			await dbPool.query(`
        ALTER TABLE artwork 
        ADD COLUMN description TEXT;
      `);
			console.log('Added description column to artwork table');
		}

		// Check if thumbnail column exists and remove it if it does
		const [thumbnailColumns] = await dbPool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'artwork' 
      AND COLUMN_NAME = 'thumbnail';
    `);

		if (thumbnailColumns.length > 0) {
			await dbPool.query(`
        ALTER TABLE artwork 
        DROP COLUMN thumbnail;
      `);
			console.log('Removed thumbnail column from artwork table');
		}

		console.log('Artwork table schema updated successfully.');
	} catch (err) {
		console.error('Error updating artwork table schema:', err);
	}
};

export const setupRoutes = (app) => {
	// Serve uploaded files
	app.use('/uploads', express.static('uploads'));

	app.get('/artworks', async (req, res) => {
		try {
			const [results] = await dbPool.query(
				`SELECT artwork.id, artwork.title, artwork.date_end, artwork.image_path, 
				artwork.place_of_origin, artwork.artwork_type_title, artwork.medium_display, 
				artwork.credit_line, artwork.description
				FROM artwork`
			);

			// Format the artwork data
			const formattedArtworks = results.map((artwork) => ({
				...artwork,
				location: artwork.place_of_origin,
				medium: artwork.medium_display,
				date: artwork.date_end,
				artist: artwork.artist || 'Unknown Artist',
				images: artwork.image_path ? [artwork.image_path] : [],
				description: artwork.description || '',
			}));

			res.json(formattedArtworks);
		} catch (error) {
			console.error('Error fetching artworks:', error);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
			});
		}
	});

	// Add new artwork route with file upload
	app.post('/artworks', upload.single('image'), async (req, res) => {
		console.log('Received artwork creation request:', req.body);
		console.log('Uploaded file:', req.file);
		console.log('Session user:', req.session.user);

		if (!req.session.user) {
			console.log('No user session found');
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
				message: 'You must be logged in to add artwork',
			});
		}

		try {
			const { title, artist, date, medium, location, description } = req.body;
			const imagePath = req.file ? req.file.path : null;

			console.log('Received data:', {
				title,
				artist,
				date,
				medium,
				location,
				description,
				imagePath,
				userId: req.session.user.id,
			});

			if (!title || !date || !medium || !location) {
				console.log('Missing required fields');
				return res.status(400).json({
					success: false,
					error: 'Missing required fields',
					message: 'Title, date, medium, and location are required',
				});
			}

			// Validate user exists
			try {
				const [userResult] = await dbPool.query(
					'SELECT id FROM users WHERE id = ?',
					[req.session.user.id]
				);
				if (userResult.length === 0) {
					console.log('User not found in database');
					return res.status(404).json({
						success: false,
						error: 'User not found',
						message: 'User account not found in database',
					});
				}
			} catch (userError) {
				console.error('Error checking user:', userError);
				return res.status(500).json({
					success: false,
					error: 'Database Error',
					message: 'Error checking user account',
					details: userError.message,
				});
			}

			// Insert the artwork into the database
			const query = `INSERT INTO artwork (
				artist_id,
				title,
				date_end,
				place_of_origin,
				artwork_type_title,
				medium_display,
				credit_line,
				image_path,
				description
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

			const values = [
				req.session.user.id,
				title,
				date,
				location,
				medium,
				medium,
				'Personal Collection',
				imagePath,
				description,
			];

			console.log('Executing query:', query);
			console.log('With values:', values);

			let result;
			try {
				[result] = await dbPool.query(query, values);
				console.log('Query result:', result);
			} catch (insertError) {
				console.error('Error inserting artwork:', insertError);
				return res.status(500).json({
					success: false,
					error: 'Database Error',
					message: 'Error inserting artwork into database',
					details: insertError.message,
				});
			}

			// Get the newly created artwork
			let newArtwork;
			try {
				[newArtwork] = await dbPool.query(
					`SELECT artwork.id, artwork.title, artwork.date_end, artwork.image_path, 
					artwork.place_of_origin, artwork.artwork_type_title, artwork.medium_display, 
					artwork.credit_line, artwork.description
					FROM artwork 
					WHERE artwork.id = ?`,
					[result.insertId]
				);
				console.log('Retrieved new artwork:', newArtwork[0]);

				// Format the artwork for frontend
				const artwork = newArtwork[0];
				artwork.images = artwork.image_path ? [artwork.image_path] : [];
				artwork.location = artwork.place_of_origin;
				artwork.medium = artwork.medium_display;
				artwork.date = artwork.date_end;
				artwork.artist = artist;
				delete artwork.place_of_origin;
				delete artwork.medium_display;
				delete artwork.date_end;
				delete artwork.credit_line;

				console.log('Formatted artwork for frontend:', artwork);
			} catch (retrieveError) {
				console.error('Error retrieving new artwork:', retrieveError);
				return res.status(500).json({
					success: false,
					error: 'Database Error',
					message: 'Error retrieving newly created artwork',
					details: retrieveError.message,
				});
			}

			res.status(201).json({
				success: true,
				data: newArtwork[0],
			});
		} catch (error) {
			console.error('Error creating artwork:', error);
			console.error('Error stack:', error.stack);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
				stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
			});
		}
	});

	// Delete artwork route
	app.delete('/artworks/:id', async (req, res) => {
		if (!req.session.user) {
			console.log('No user session found');
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
				message: 'You must be logged in to delete artwork',
			});
		}

		try {
			const artworkId = req.params.id;

			// First check if the artwork exists and belongs to the user
			const [artworkResult] = await dbPool.query(
				'SELECT artist_id, image_path FROM artwork WHERE id = ?',
				[artworkId]
			);

			if (artworkResult.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Not found',
					message: 'Artwork not found',
				});
			}

			if (artworkResult[0].artist_id !== req.session.user.id) {
				return res.status(403).json({
					success: false,
					error: 'Forbidden',
					message: 'You can only delete your own artwork',
				});
			}

			// Delete the image file if it exists
			if (artworkResult[0].image_path) {
				try {
					fs.unlinkSync(artworkResult[0].image_path);
				} catch (unlinkError) {
					console.error('Error deleting image file:', unlinkError);
					// Continue with database deletion even if file deletion fails
				}
			}

			// Delete the artwork from database
			await dbPool.query('DELETE FROM artwork WHERE id = ?', [artworkId]);

			res.json({
				success: true,
				message: 'Artwork deleted successfully',
			});
		} catch (error) {
			console.error('Error deleting artwork:', error);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
			});
		}
	});
};
