import { dbPool } from './db.js';

export const createFavoritesTable = async () => {
	try {
		await dbPool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        artwork_external_id INT NOT NULL, 
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
		console.log('Favorites table created successfully.');
	} catch (err) {
		console.error('Error creating favorites table:', err.message || err);
	}
};

export const setupFavoritesRoutes = (app) => {
	app.get('/favorites', async (req, res) => {
		const userId = req.session.user?.id;
		if (!userId) {
			return res.status(401).json({ message: 'Not logged in' });
		}

		try {
			const [favorites] = await dbPool.query(
				'SELECT artwork_external_id as id FROM favorites WHERE user_id = ?',
				[userId]
			);
			res.json({ userId, favorites });
		} catch (err) {
			console.error('Error fetching favorites:', err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	app.post('/favorites', async (req, res) => {
		const { artworkId, favorite } = req.body;
		const userId = req.session.user?.id;

		if (!userId) {
			return res.status(401).json({ message: 'Not logged in' });
		}

		try {
			if (favorite) {
				// Add favorite
				await dbPool.query(
					'INSERT INTO favorites (artwork_external_id, user_id) VALUES (?, ?)',
					[artworkId, userId]
				);
				res.status(200).json({ message: 'Favorite added successfully' });
			} else {
				// Remove favorite
				await dbPool.query(
					'DELETE FROM favorites WHERE artwork_external_id = ? AND user_id = ?',
					[artworkId, userId]
				);
				res.status(200).json({ message: 'Favorite removed successfully' });
			}
		} catch (err) {
			console.error('Error updating favorite:', err);
			res.status(500).json({ message: 'Error updating favorite' });
		}
	});
};
