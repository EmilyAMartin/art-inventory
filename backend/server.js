import 'dotenv/config';
import * as artist from './artist.js';
import * as artwork from './artwork.js';
import * as users from './users.js';

import express from 'express';
import mysql from 'mysql2/promise';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import cors from 'cors';

const url = process.env.MYSQL_URL;
const connection = mysql.createPool(url);
const sessionStore = new MySQLStore({}, connection);
const app = express();

app.use(cors());
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'your-default-secret',
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
	})
);

// Initialize Database and Tables
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

// Setup Routes
artist.setupRoutes(app);
artwork.setupRoutes(app);
users.setupRoutes(app, connection); // Pass connection here

// Global error handler (last middleware)
app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).json({ message: 'Internal Server Error' });
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

// Serve static files
app.use(express.static('public'));
