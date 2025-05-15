import bcrypt from 'bcryptjs';
import { dbPool } from './db.js';
import upload from './fileUpload.js';
import path from 'path';
import fs from 'fs';

export const createTable = async () => {
	try {
		await dbPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      username VARCHAR(255),
      bio TEXT,
      profile_image VARCHAR(255),
      PRIMARY KEY (id)
    )
  `);
		console.log('Users table created successfully.');
	} catch (err) {
		console.error('Error creating users table:', err);
	}
};

export const setupRoutes = (app) => {
	app.post('/login', async (req, res) => {
		const { email, password } = req.body;

		console.log('Login attempt:', { email });

		try {
			const [usersResult] = await dbPool.query(
				'SELECT * FROM users WHERE email = ?',
				[email]
			);

			if (usersResult.length === 0) {
				console.log('User not found');
				return res.status(400).json({ message: 'User not found' });
			}

			const user = usersResult[0];
			const passwordMatch = await bcrypt.compare(password, user.password_hash);

			if (!passwordMatch) {
				console.log('Incorrect password');
				return res.status(400).json({ message: 'Incorrect password' });
			}

			req.session.user = {
				id: user.id,
				name: user.name,
				email: user.email,
				username: user.username,
				bio: user.bio,
				profile_image: user.profile_image,
			};
			console.log('Logged in successfully:', req.session.user);
			res.json({ message: 'Logged in successfully' });
		} catch (err) {
			console.error('Error in login:', err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	app.post('/logout', (req, res) => {
		if (req.session.user) {
			req.session.destroy((err) => {
				if (err) {
					return res.status(500).json({ message: 'Failed to log out' });
				}
				res.clearCookie('connect.sid');
				res.json({ message: 'Logged out successfully' });
			});
		} else {
			res.status(400).json({ message: 'No user is logged in' });
		}
	});

	app.post('/register', async (req, res) => {
		const { name, email, password, username, bio } = req.body;

		try {
			const [existingUserResult] = await dbPool.query(
				'SELECT * FROM users WHERE email = ?',
				[email]
			);

			if (existingUserResult.length > 0) {
				return res.status(400).json({ message: 'User already exists' });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			await dbPool.query(
				'INSERT INTO users (name, email, password_hash, username, bio) VALUES (?, ?, ?, ?, ?)',
				[name, email, hashedPassword, username, bio]
			);

			const [newUserResult] = await dbPool.query(
				'SELECT * FROM users WHERE email = ?',
				[email]
			);
			const newUser = newUserResult[0];

			req.session.user = {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profile_image: newUser.profile_image,
			};

			res.json({ message: 'Registered successfully' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	app.get('/profile', async (req, res) => {
		if (req.session.user) {
			try {
				const [userResult] = await dbPool.query(
					'SELECT id, name, email, username, bio, profile_image FROM users WHERE id = ?',
					[req.session.user.id]
				);
				if (userResult.length > 0) {
					req.session.user = userResult[0];
					res.json({ user: userResult[0] });
				} else {
					res.status(404).json({ message: 'User not found' });
				}
			} catch (err) {
				console.error('Error fetching user profile:', err);
				res.status(500).json({ message: 'Internal Server Error' });
			}
		} else {
			res.status(401).json({ message: 'Not logged in' });
		}
	});
	app.get('/users/:userId', async (req, res) => {
		try {
			const { userId } = req.params;

			const [userResult] = await dbPool.query(
				'SELECT id, name, email, username, bio, profile_image FROM users WHERE id = ?',
				[userId]
			);

			if (userResult.length === 0) {
				return res.status(404).json({ message: 'User not found' });
			}

			res.json(userResult[0]);
		} catch (err) {
			console.error('Error fetching user:', err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	app.put('/profile', async (req, res) => {
		if (req.session.user) {
			const { username, bio } = req.body;

			try {
				if (!username || !bio) {
					return res.status(400).json({ message: 'Username and Bio are required' });
				}

				const [userResult] = await dbPool.query(
					'SELECT id FROM users WHERE id = ?',
					[req.session.user.id]
				);

				if (userResult.length === 0) {
					return res.status(404).json({ message: 'User not found' });
				}

				await dbPool.query('UPDATE users SET username = ?, bio = ? WHERE id = ?', [
					username,
					bio,
					req.session.user.id,
				]);
				const [updatedUserResult] = await dbPool.query(
					'SELECT id, name, email, username, bio, profile_image FROM users WHERE id = ?',
					[req.session.user.id]
				);
				req.session.user = updatedUserResult[0];
				res.json({
					message: 'Profile updated successfully',
					user: updatedUserResult[0],
				});
			} catch (err) {
				console.error('Error updating user profile:', err);
				res.status(500).json({ message: 'Internal Server Error' });
			}
		} else {
			res.status(401).json({ message: 'Not logged in' });
		}
	});

	app.post('/profile/image', upload.single('image'), async (req, res) => {
		if (!req.session.user) {
			return res.status(401).json({ message: 'Not logged in' });
		}

		try {
			if (!req.file) {
				return res.status(400).json({ message: 'No image file provided' });
			}

			const imageUrl = `/uploads/${req.file.filename}`;
			const [userResult] = await dbPool.query(
				'SELECT profile_image FROM users WHERE id = ?',
				[req.session.user.id]
			);

			if (userResult[0].profile_image) {
				const oldImagePath = path.join(
					'uploads',
					path.basename(userResult[0].profile_image)
				);
				if (fs.existsSync(oldImagePath)) {
					fs.unlinkSync(oldImagePath);
				}
			}

			await dbPool.query('UPDATE users SET profile_image = ? WHERE id = ?', [
				imageUrl,
				req.session.user.id,
			]);

			const [updatedUserResult] = await dbPool.query(
				'SELECT id, name, email, username, bio, profile_image FROM users WHERE id = ?',
				[req.session.user.id]
			);
			req.session.user = updatedUserResult[0];

			res.json({
				message: 'Profile image updated successfully',
				user: updatedUserResult[0],
			});
		} catch (err) {
			console.error('Error updating profile image:', err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});
};
