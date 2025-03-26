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
				'SELECT artworks.* FROM artworks INNER JOIN favorites ON artworks.id = favorites.artwork_external_id WHERE favorites.user_id = ?',
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
		const userId = req.session.userId;

		if (!userId) {
			return res.status(400).send('User not authenticated');
		}

		try {
			await dbPool.query(
				'INSERT INTO favorites (artwork_external_id, user_id) VALUES (?, ?)',
				[artworkId, userId]
			);
			res.status(200).send({ message: 'Favorite added successfully' });
		} catch (err) {
			console.error('Error adding favorite:', err);
			res.status(500).send('Error adding favorite');
		}
	});
};
