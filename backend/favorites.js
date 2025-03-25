export const createFavoritesTable = async (connection) => {
	try {
		await connection.query(`
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
export const setupFavoritesRoutes = (app, connection, session) => {
	app.get('/favorites', async (req, res) => {
		const userId = req.session.user?.id;
		if (!userId) {
			return res.status(401).json({ message: 'Not logged in' });
		}

		try {
			const [favorites] = await connection.query(
				'SELECT artworks.* FROM artworks INNER JOIN favorites ON artworks.id = favorites.artwork_external_id WHERE favorites.user_id = ?',
				[userId]
			);
			res.json({ userId, favorites });
		} catch (err) {
			console.error('Error fetching favorites:', err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	app.post('/favorites', (req, res) => {
		const { artworkId, favorite } = req.body;
		const userId = req.session.userId;

		if (!userId) {
			return res.status(400).send('User not authenticated');
		}

		const sql = `INSERT INTO favorites (artwork_external_id, user_id) VALUES (?, ?)`;
		db.query(sql, [artworkId, userId], (err, result) => {
			if (err) {
				console.error('Error adding favorite:', err);
				return res.status(500).send('Error adding favorite');
			}
			res.status(200).send({ message: 'Favorite added successfully' });
		});
	});
};
