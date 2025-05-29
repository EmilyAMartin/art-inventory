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
		await dbPool.query(`
      CREATE TABLE IF NOT EXISTS public_artwork_favorites (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        public_artwork_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (public_artwork_id) REFERENCES public_artworks(id) ON DELETE CASCADE
      );
    `);

		console.log('Favorites tables created successfully.');
	} catch (err) {
		console.error('Error creating favorites tables:', err.message || err);
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
				await dbPool.query(
					'INSERT INTO favorites (artwork_external_id, user_id) VALUES (?, ?)',
					[artworkId, userId]
				);
				res.status(200).json({ message: 'Favorite added successfully' });
			} else {
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

	app.post('/public-artworks/:artworkId/favorite', async (req, res) => {
		const userId = req.session.user?.id;
		const { artworkId } = req.params;
		const { favorite } = req.body;

		if (!userId) {
			return res.status(401).json({ message: 'Not logged in' });
		}

		try {
			if (favorite) {
				await dbPool.query(
					'INSERT IGNORE INTO public_artwork_favorites (public_artwork_id, user_id) VALUES (?, ?)',
					[artworkId, userId]
				);
				res.status(200).json({ message: 'Favorite added successfully' });
			} else {
				await dbPool.query(
					'DELETE FROM public_artwork_favorites WHERE public_artwork_id = ? AND user_id = ?',
					[artworkId, userId]
				);
				res.status(200).json({ message: 'Favorite removed successfully' });
			}
		} catch (err) {
			console.error('Error updating public artwork favorite:', err);
			res.status(500).json({ message: 'Error updating favorite' });
		}
	});

	app.get('/public-artworks/favorites', async (req, res) => {
		const userId = req.session.user?.id;
		if (!userId) {
			return res.status(401).json({ message: 'Not logged in' });
		}
		try {
			const [favorites] = await dbPool.query(
				`SELECT pa.* FROM public_artworks pa
				 JOIN public_artwork_favorites paf ON pa.id = paf.public_artwork_id
				 WHERE paf.user_id = ?`,
				[userId]
			);
			res.json({ favorites });
		} catch (err) {
			console.error('Error fetching public artwork favorites:', err);
			res.status(500).json({ message: 'Error fetching favorites' });
		}
	});
};
