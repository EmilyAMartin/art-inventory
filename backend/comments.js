import { dbPool } from './db.js';

export async function createCommentsTable() {
	const sql = `
    CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        artwork_id INT NOT NULL,
        user_id INT NOT NULL, -- Links comments to users
        user_name VARCHAR(255),
        text TEXT NOT NULL,
        profile_picture VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artwork_id) REFERENCES artwork(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ensure user_id references the users table
    );`;
	await dbPool.query(sql);
}

export function setupCommentRoutes(app) {
	// Fetch comments for a specific artwork
	app.get('/api/comments/:artworkId', async (req, res) => {
		try {
			const [rows] = await dbPool.query(
				`SELECT id, text, user_name, user_id, profile_picture, created_at 
                FROM comments 
                WHERE artwork_id = ? 
                ORDER BY created_at DESC`,
				[req.params.artworkId]
			);

			// Add full URL for profile_picture if it exists
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

	// Add a new comment to a specific artwork
	app.post('/api/comments/:artworkId', async (req, res) => {
		const { artworkId } = req.params;
		const { text } = req.body;
		const user = req.session.user; // Assuming user session is available

		if (!user) {
			return res.status(401).json({ message: 'Not authenticated' });
		}

		if (!text?.trim()) {
			return res.status(400).json({ message: 'Comment text is required' });
		}

		try {
			await dbPool.query(
				`INSERT INTO comments (artwork_id, user_id, user_name, text, profile_picture)
                VALUES (?, ?, ?, ?, ?)`,
				[
					artworkId,
					user.id, // Use the logged-in user's ID
					user.username || user.name, // Use username or name
					text,
					user.profile_image || 'https://example.com/default-pic.jpg', // Default profile picture if none exists
				]
			);

			res.status(201).json({ message: 'Comment added successfully' });
		} catch (err) {
			console.error('Error saving comment:', err);
			res.status(500).json({ message: 'Error saving comment' });
		}
	});
}
