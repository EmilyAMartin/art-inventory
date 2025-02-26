import { server } from './db.js';
import bcrypt from 'bcryptjs';

// User Table//
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

// User Data //
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

// Register//
export const registerUser = async (name, email, password, connection) => {
	try {
		const [existingUserResult] = await connection.query(
			'SELECT * FROM users WHERE email = ?',
			[email]
		);

		if (existingUserResult.length > 0) {
			throw new Error('User already exists');
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
		return newUserResult[0];
	} catch (err) {
		throw new Error('Error registering user: ' + err.message);
	}
};

// Login//
export const loginUser = async (email, password, connection) => {
	try {
		const [usersResult] = await connection.query(
			'SELECT * FROM users WHERE email = ?',
			[email]
		);

		if (usersResult.length === 0) {
			throw new Error('User not found');
		}

		const user = usersResult[0];
		const passwordMatch = await bcrypt.compare(password, user.password_hash);

		if (!passwordMatch) {
			throw new Error('Incorrect password');
		}

		return user;
	} catch (err) {
		throw new Error('Error logging in user: ' + err.message);
	}
};

// Users Routes //
export const setupRoutes = (app, connection) => {
	// Register Route
	app.post('/register', async (req, res) => {
		const { name, email, password } = req.body;

		try {
			const newUser = await registerUser(name, email, password, connection);
			req.session.user = {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
			};
			res.json({ message: 'Registered successfully' });
		} catch (err) {
			res.status(400).json({ message: err.message });
		}
	});

	// Login Route
	app.post('/login', async (req, res) => {
		const { email, password } = req.body;

		try {
			const user = await loginUser(email, password, connection);
			req.session.user = { id: user.id, name: user.name, email: user.email };
			res.json({ message: 'Logged in successfully' });
		} catch (err) {
			res.status(400).json({ message: err.message });
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

	// Get All Users Route (for testing, you may remove this later)
	app.get('/users', (req, res) => {
		connection.query('SELECT * FROM users', (error, results) => {
			if (error) {
				console.error(error);
				res.status(500).json({ error: 'Internal Server Error' });
				return;
			}
			res.json(results);
		});
	});
};
