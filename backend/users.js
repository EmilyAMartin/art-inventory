import bcrypt from 'bcryptjs';
import { server } from './db.js'; // Ensure the database connection is available

// User Table
export const createTable = () => {
	server.query(`
    CREATE TABLE IF NOT EXISTS users (
       id INT NOT NULL AUTO_INCREMENT,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       password_hash VARCHAR(255) NOT NULL,
       PRIMARY KEY (id)
    )
  `);
};

// User Data
export const createTestData = () => {
	server.query(
		`
    INSERT INTO users (id, name, email, password_hash)
    VALUES (1, "John Doe", "john@doe.com", "password_hash")
  `,
		(err, result) => {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					console.log('Duplicate entry found, ignoring...');
					return;
				}
				console.log('Error inserting user:', err);
			} else {
				console.log('Users inserted successfully');
			}
		}
	);
};

// Users Routes
export const setupRoutes = (app, connection, session) => {
	// Login Route
	app.post('/login', async (req, res) => {
		const { email, password } = req.body;

		try {
			const [usersResult] = await connection.query(
				'SELECT * FROM users WHERE email = ?',
				[email]
			);

			if (usersResult.length === 0) {
				return res.status(400).json({ message: 'User not found' });
			}

			const user = usersResult[0];
			const passwordMatch = await bcrypt.compare(password, user.password_hash);

			if (!passwordMatch) {
				return res.status(400).json({ message: 'Incorrect password' });
			}
			req.session.user = { id: user.id, name: user.name, email: user.email };
			res.json({ message: 'Logged in successfully' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	// Register Route
	app.post('/register', async (req, res) => {
		const { name, email, password } = req.body;

		try {
			const [existingUserResult] = await connection.query(
				'SELECT * FROM users WHERE email = ?',
				[email]
			);

			if (existingUserResult.length > 0) {
				return res.status(400).json({ message: 'User already exists' });
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			await connection.query(
				'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
				[name, email, hashedPassword]
			);

			const [newUserResult] = await connection.query(
				'SELECT * FROM users WHERE email = ?',
				[email]
			);
			const newUser = newUserResult[0];

			// Store user in session
			req.session.user = {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
			};

			res.json({ message: 'Registered successfully' });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	});

	// Profile Route
	app.get('/profile', (req, res) => {
		if (req.session.user) {
			res.json({ user: req.session.user });
		} else {
			res.status(401).json({ message: 'Not logged in' });
		}
	});
};
