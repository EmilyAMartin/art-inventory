// comments.js
import { dbPool } from './db.js';

export async function createCommentsTable() {
	const sql = `
	CREATE TABLE IF NOT EXISTS comments (
		id INT AUTO_INCREMENT PRIMARY KEY,
		artwork_id INT NOT NULL,
		user_name VARCHAR(255),
		text TEXT NOT NULL,
		profile_picture VARCHAR(500),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (artwork_id) REFERENCES artwork(id) ON DELETE CASCADE
	);`;
	await dbPool.query(sql);
}

export function setupCommentRoutes(app) {
	app.get('/api/comments/:artworkId', async (req, res) => {
		try {
			const [rows] = await dbPool.query(
				`SELECT id, text, user_name, profile_picture, created_at 
            FROM comments 
            WHERE artwork_id = ? 
            ORDER BY created_at DESC`,
				[req.params.artworkId]
			);

			const fullComments = rows.map((comment) => ({
				...comment,
				profile_picture: comment.profile_picture
					? `http://localhost:3000${comment.profile_picture}`
					: 'https://example.com/default-pic.jpg',
			}));

			res.json(fullComments);
		} catch (err) {
			console.error('Error fetching comments:', err);
			res.status(500).json({ message: 'Failed to fetch comments' });
		}
	});

	app.post('/api/comments/:artworkId', async (req, res) => {
		const { artworkId } = req.params;
		const { text } = req.body;
		const user = req.session.user;

		if (!user) {
			return res.status(401).json({ message: 'Not authenticated' });
		}

		if (!text?.trim()) {
			return res.status(400).json({ message: 'Comment text is required' });
		}

		try {
			await dbPool.query(
				`INSERT INTO comments (artwork_id, user_name, text, profile_picture)
			VALUES (?, ?, ?, ?)`,
				[
					artworkId,
					user.username || user.name,
					text,
					user.profile_image || 'https://example.com/default-pic.jpg',
				]
			);

			res.status(201).json({ message: 'Comment added successfully' });
		} catch (err) {
			console.error('Error saving comment:', err);
			res.status(500).json({ message: 'Error saving comment' });
		}
	});
}
