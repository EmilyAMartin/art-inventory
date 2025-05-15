import { dbPool } from './db.js';
import upload from './fileUpload.js';
import path from 'path';
import fs from 'fs';
import express from 'express';

export const createTable = async () => {
	try {
		await dbPool.query(`
      CREATE TABLE IF NOT EXISTS artwork (
        id INT AUTO_INCREMENT PRIMARY KEY,
        artist_id INT,
        artist_name VARCHAR(255), 
        title VARCHAR(255),
        date_end VARCHAR(50),
        image_path VARCHAR(255),
        place_of_origin VARCHAR(255),
        artwork_type_title VARCHAR(255),
        medium_display VARCHAR(255),
        credit_line VARCHAR(255),
        description TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (artist_id) REFERENCES users(id)
      );
    `);

		const [artistNameCol] = await dbPool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'artwork' 
      AND COLUMN_NAME = 'artist_name';
    `);
		if (artistNameCol.length === 0) {
			await dbPool.query(`
        ALTER TABLE artwork 
        ADD COLUMN artist_name VARCHAR(255);
      `);
			console.log('Added artist_name column to artwork table');
		}
	} catch (err) {
		console.error('Error updating artwork table schema:', err);
	}
};

export const setupRoutes = (app) => {
	app.use('/uploads', express.static('uploads'));

	app.get('/artworks', async (req, res) => {
		try {
			const [results] = await dbPool.query(`
      SELECT id, title, date_end, image_path, 
             place_of_origin, artwork_type_title, medium_display, 
             credit_line, description, is_public, artist_name
      FROM artwork
      WHERE is_public = true
    `);

			const formattedArtworks = results.map((artwork) => ({
				...artwork,
				location: artwork.place_of_origin,
				medium: artwork.medium_display,
				date: artwork.date_end,
				artist: artwork.artist_name || 'Unknown Artist',
				images: artwork.image_path ? [artwork.image_path] : [],
				description: artwork.description || '',
				isPublic: artwork.is_public,
			}));

			res.json(formattedArtworks);
		} catch (error) {
			console.error('Error fetching public artworks:', error);
			res.status(500).json({ success: false, error: 'Internal Server Error' });
		}
	});
	app.get('/my-artworks', async (req, res) => {
		if (!req.session.user) {
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
			});
		}

		try {
			const [results] = await dbPool.query(
				`
      SELECT id, title, date_end, image_path, 
             place_of_origin, artwork_type_title, medium_display, 
             credit_line, description, is_public, artist_name
      FROM artwork
      WHERE artist_id = ?
    `,
				[req.session.user.id]
			);

			const formattedArtworks = results.map((artwork) => ({
				...artwork,
				location: artwork.place_of_origin,
				medium: artwork.medium_display,
				date: artwork.date_end,
				artist: artwork.artist_name || 'Unknown Artist',
				images: artwork.image_path ? [artwork.image_path] : [],
				description: artwork.description || '',
				isPublic: artwork.is_public,
			}));

			res.json(formattedArtworks);
		} catch (error) {
			console.error('Error fetching user artworks:', error);
			res.status(500).json({ success: false, error: 'Internal Server Error' });
		}
	});

	app.get('/users/:userId/public-artworks', async (req, res) => {
		try {
			const { userId } = req.params;

			const [results] = await dbPool.query(
				`
      SELECT id, title, date_end, image_path, 
             place_of_origin, artwork_type_title, medium_display, 
             credit_line, description, is_public, artist_name
      FROM artwork
      WHERE is_public = true AND artist_id = ?
    `,
				[userId]
			);

			const formattedArtworks = results.map((artwork) => ({
				...artwork,
				location: artwork.place_of_origin,
				medium: artwork.medium_display,
				date: artwork.date_end,
				artist: artwork.artist_name || 'Unknown Artist',
				images: artwork.image_path ? [artwork.image_path] : [],
				description: artwork.description || '',
				isPublic: artwork.is_public,
			}));

			res.json(formattedArtworks);
		} catch (error) {
			console.error('Error fetching public artworks by user:', error);
			res.status(500).json({ success: false, error: 'Internal Server Error' });
		}
	});

	app.post('/artworks', upload.single('image'), async (req, res) => {
		console.log('Received artwork creation request:', req.body);
		console.log('Uploaded file:', req.file);
		console.log('Session user:', req.session.user);

		if (!req.session.user) {
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
				message: 'You must be logged in to add artwork',
			});
		}

		try {
			const { title, artist, date, medium, location, description } = req.body;
			const imagePath = req.file ? req.file.filename : null;

			if (!title || !date || !medium || !location) {
				return res.status(400).json({
					success: false,
					error: 'Missing required fields',
					message: 'Title, date, medium, and location are required',
				});
			}
			const [userResult] = await dbPool.query(
				'SELECT id FROM users WHERE id = ?',
				[req.session.user.id]
			);
			if (userResult.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'User not found',
				});
			}
			const query = `INSERT INTO artwork (
			artist_id,
			artist_name,
			title,
			date_end,
			place_of_origin,
			artwork_type_title,
			medium_display,
			credit_line,
			image_path,
			description
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

			const values = [
				req.session.user.id,
				artist,
				title,
				date,
				location,
				medium,
				medium,
				'Personal Collection',
				imagePath,
				description,
			];

			const [result] = await dbPool.query(query, values);
			const [newArtwork] = await dbPool.query(
				`SELECT artwork.id, artwork.title, artwork.date_end, artwork.image_path, 
        artwork.place_of_origin, artwork.artwork_type_title, artwork.medium_display, 
        artwork.credit_line, artwork.description, artwork.is_public, artwork.artist_name
      FROM artwork 
      WHERE artwork.id = ?`,
				[result.insertId]
			);

			const artwork = newArtwork[0];
			artwork.images = artwork.image_path ? [artwork.image_path] : [];
			artwork.location = artwork.place_of_origin;
			artwork.medium = artwork.medium_display;
			artwork.date = artwork.date_end;
			artwork.artist = artwork.artist_name;

			delete artwork.place_of_origin;
			delete artwork.medium_display;
			delete artwork.date_end;
			delete artwork.credit_line;

			res.status(201).json({
				success: true,
				data: artwork,
			});
		} catch (error) {
			console.error('Error creating artwork:', error);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
			});
		}
	});

	app.patch('/artworks/:id/toggle-public', async (req, res) => {
		if (!req.session.user) {
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
				message: 'You must be logged in to update artwork visibility',
			});
		}

		const artworkId = req.params.id;
		const { isPublic } = req.body;

		try {
			const [artworkResult] = await dbPool.query(
				'SELECT artist_id FROM artwork WHERE id = ?',
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
					message: 'You can only update your own artwork',
				});
			}
			await dbPool.query('UPDATE artwork SET is_public = ? WHERE id = ?', [
				isPublic,
				artworkId,
			]);

			res.json({
				success: true,
				message: 'Artwork visibility updated successfully',
			});
		} catch (error) {
			console.error('Error updating artwork visibility:', error);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
			});
		}
	});
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
			if (artworkResult[0].image_path) {
				try {
					fs.unlinkSync(artworkResult[0].image_path);
				} catch (unlinkError) {
					console.error('Error deleting image file:', unlinkError);
				}
			}
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
