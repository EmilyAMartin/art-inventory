import { dbPool } from './db.js';

export const createTable = async () => {
	try {
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
        thumbnail JSON,
        FOREIGN KEY (artist_id) REFERENCES users(id)
      );
    `);
		console.log('Artwork table created successfully.');
	} catch (err) {
		console.error('Error creating artwork table:', err);
	}
};

export const createTestData = async () => {
	try {
		await dbPool.query(
			`
    INSERT INTO artwork (id, artist_id, title, date_end, image_path, place_of_origin, artwork_type_title, medium_display, credit_line, thumbnail) 
    VALUES
    (1, 1, 'Terra Nova 1', '2022', 'Images/1.jpg', 'Canada', 'Photography', 'Scanned silver gelatin print', 'Personal Collection', '{"alt_text": "This image was taken during the summer of 2022. The photograph is of the inside of the Terra Nova Sulphite Mill in Glovertown, NL."}'),
    (2, 1, 'Terra Nova 2', '2022', 'Images/2.jpg', 'Canada', 'Photography', 'Scanned silver gelatin print', 'Personal Collection', '{"alt_text": "This image was take during the summer of 2022. The photograph is of the inside of the Terra Nova Sulphite Mill in Glovertown, NL."}'),
    (3, 1, 'Iris', '2014', 'Images/3.jpg', 'Canada', 'Photography', 'Printed silver gelatin print', 'Personal Collection', '{"alt_text": "This image was made in 2014 using ink on glass. It is an abstract photograph meant to play on the idea of viewer perception and the meaning of an artwork."}'),
    (4, 1, 'Leaves', '2014', 'Images/4.jpg', 'Canada', 'Photography', 'Printed silver gelatin print', 'Personal Collection', '{"alt_text": "This image was made in 2014 using ink on glass. It is an abstract photograph meant to play on the idea of viewer perception and the meaning of an artwork."}'),
    (5, 1, 'Blue Beetle', '2018', 'Images/5.jpg', 'Canada', 'Digital', 'Digital artwork printed on mat paper', 'Personal Collection', '{"alt_text": "This image was made in 2018 using photoshop. The artist used images taken from the Newfoundland insectarium to create colorful bug illustrations"}'),
    (6, 1, 'Skull', '2018', 'Images/6.jpg', 'Canada', 'Digital', 'Digital artwork printed on mat paper', 'Personal Collection', '{"alt_text": "This image was made in 2018 using ink on glass. The artist used images of a local hunters animal skulls to create colorful illustrations."}'),
    (7, 1, 'Coy Fish', '2019', 'Images/7.jpg', 'Canada', 'Printmaking', 'Lino print printed on mat paper', 'Personal Collection', '{"alt_text": "This image was made in 2019. The artist made serval editions of this print using different color schemes."}'),
    (8, 1, 'Newfoundland Iris', '2019', 'Images/8.jpg', 'Canada', 'Watercolor', 'Watercolor painting scanned and printed on mat paper', 'Personal Collection', '{"alt_text": "This image was made in 2019. It is one of three watercolor paintings the artist made of Newfoundland flowers."}')
    `
		);
		console.log('Artwork inserted successfully');
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY') {
			console.log('Duplicate entry found, ignoring...');
			return;
		}
		console.log('Error inserting artwork:', err);
	}
};

export const setupRoutes = (app) => {
	app.get('/artworks', async (req, res) => {
		try {
			const [results] = await dbPool.query(
				`SELECT artwork.id, artwork.title, artwork.date_end, artwork.image_path, artwork.place_of_origin, artwork.artwork_type_title, artwork.medium_display, artwork.credit_line, artwork.thumbnail, 
       users.name AS artist
      FROM artwork 
      JOIN users ON artwork.artist_id = users.id`
			);
			res.json(results);
		} catch (error) {
			console.error('Error fetching artworks:', error);
			res.status(500).json({
				success: false,
				error: 'Internal Server Error',
				details: error.message,
			});
		}
	});

	// Add new artwork route
	app.post('/artworks', async (req, res) => {
		console.log('Received artwork creation request:', req.body);
		console.log('Session user:', req.session.user);
		console.log('Session ID:', req.session.id);
		console.log('Request headers:', req.headers);

		if (!req.session.user) {
			console.log('No user session found');
			return res.status(401).json({
				success: false,
				error: 'Not logged in',
				message: 'You must be logged in to add artwork',
			});
		}

		try {
			const { title, artist, date, medium, location, description, images } =
				req.body;

			console.log('Received data:', {
				title,
				artist,
				date,
				medium,
				location,
				description,
				imagesLength: images?.length,
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
				thumbnail
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

			const values = [
				req.session.user.id,
				title,
				date,
				location,
				medium,
				medium,
				'Personal Collection',
				JSON.stringify({ alt_text: description, images: images }),
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

			// Get the newly created artwork with artist information
			let newArtwork;
			try {
				[newArtwork] = await dbPool.query(
					`SELECT artwork.id, artwork.title, artwork.date_end, artwork.image_path, 
					artwork.place_of_origin, artwork.artwork_type_title, artwork.medium_display, 
					artwork.credit_line, artwork.thumbnail, users.name AS artist
					FROM artwork 
					JOIN users ON artwork.artist_id = users.id
					WHERE artwork.id = ?`,
					[result.insertId]
				);
				console.log('Retrieved new artwork:', newArtwork[0]);

				// Parse the thumbnail JSON and add it to the response
				const artwork = newArtwork[0];
				let thumbnail;
				try {
					thumbnail =
						typeof artwork.thumbnail === 'string'
							? JSON.parse(artwork.thumbnail)
							: artwork.thumbnail;
				} catch (parseError) {
					console.error('Error parsing thumbnail:', parseError);
					thumbnail = { alt_text: '', images: [] };
				}

				artwork.images = thumbnail.images || [];
				artwork.description = thumbnail.alt_text || '';
				artwork.location = artwork.place_of_origin;
				artwork.medium = artwork.medium_display;
				artwork.date = artwork.date_end;
				delete artwork.thumbnail;
				delete artwork.place_of_origin;
				delete artwork.medium_display;
				delete artwork.date_end;
				delete artwork.image_path;
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
};
