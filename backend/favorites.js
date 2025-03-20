export const createFavoritesTable = async (connection) => {
	try {
		await connection.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        artwork_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (artwork_id) REFERENCES artworks(id) ON DELETE CASCADE
      );
    `);
		console.log('Favorites table created successfully.');
	} catch (err) {
		console.error('Error creating favorites table:', err);
	}
};

export const setupFavoritesRoutes = (app, connection, session) => {
	app.get('/favorites', async (req, res) => {
		const userId = req.session.user?.id;
		if (!userId) {
			return res.status(401).json({ message: 'Not logged in' });
		}

		try {
			const [favorites] = await connection.query(
				'SELECT artworks.* FROM artworks INNER JOIN favorites ON artworks.id = favorites.artwork_id WHERE favorites.user_id = ?',
				[userId]
			);
			res.json(favorites);
		} catch (err) {
			console.error('Error fetching favorites:', err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	app.post('/favorites', async (req, res) => {
		const userId = req.session.user?.id;
		const { artworkId, favorite } = req.body;

		if (!userId) {
			return res.status(401).json({ message: 'Not logged in' });
		}

		try {
			if (favorite) {
				await connection.query(
					'INSERT INTO favorites (user_id, artwork_id) VALUES (?, ?)',
					[userId, artworkId]
				);
			} else {
				await connection.query(
					'DELETE FROM favorites WHERE user_id = ? AND artwork_id = ?',
					[userId, artworkId]
				);
			}
			const [favorites] = await connection.query(
				'SELECT artworks.* FROM artworks INNER JOIN favorites ON artworks.id = favorites.artwork_id WHERE favorites.user_id = ?',
				[userId]
			);
			res.json(favorites);
		} catch (err) {
			console.error('Error updating favorites:', err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});
};
