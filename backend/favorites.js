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
		console.error('Error creating favorites table:', err.message || err);
	}
};
export const setupFavoritesRoutes = (app, connection, session) => {
	// GET: Fetch favorites
	app.get('/favorites', async (req, res) => {
		const userId = req.session.user?.id;
		if (!userId) {
			return res.status(401).json({ message: 'Not logged in' }); // Ensure user is logged in
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

		console.log('Received favorite request:', { artworkId, favorite, userId });

		if (!userId) {
			console.log('User is not logged in');
			return res.status(401).json({ message: 'Not logged in' });
		}

		try {
			if (favorite) {
				console.log('Adding favorite:', artworkId);
				await connection.query(
					'INSERT INTO favorites (user_id, artwork_id) VALUES (?, ?)',
					[userId, artworkId]
				);
			} else {
				console.log('Removing favorite:', artworkId);
				await connection.query(
					'DELETE FROM favorites WHERE user_id = ? AND artwork_id = ?',
					[userId, artworkId]
				);
			}

			const [favorites] = await connection.query(
				'SELECT artworks.* FROM artworks INNER JOIN favorites ON artworks.id = favorites.artwork_id WHERE favorites.user_id = ?',
				[userId]
			);
			console.log('Favorites fetched:', favorites);
			res.json(favorites);
		} catch (err) {
			console.error('Error updating favorites:', err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});
};
