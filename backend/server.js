import 'dotenv/config';
import * as artist from './artist.js';
import * as artwork from './artwork.js';
import * as users from './users.js';

import express from 'express';
import mysql from 'mysql2/promise';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const url = process.env.MYSQL_URL;
const connection = mysql.createPool(url);
const sessionStore = new MySQLStore({}, connection);
const app = express();

const corsOptions = {
	origin: 'http://localhost:5173',
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'your-default-secret',
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

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

// Initialize Database (create tables and insert test data)
const initDb = async () => {
	try {
		await artist.createTable(connection);
		await artwork.createTable(connection);
		await users.createTable(connection);

		await artist.createTestData(connection);
		await artwork.createTestData(connection);
		await users.createTestData(connection);
	} catch (err) {
		console.error('Error initializing database:', err);
	}
};

initDb();

// Setup Routes for Artist and Artwork
artist.setupRoutes(app);
artwork.setupRoutes(app);
users.setupRoutes(app);

// Global error handler (last middleware)
app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).json({ message: 'Internal Server Error' });
});

app.use(express.static('public'));

// Start the server
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
