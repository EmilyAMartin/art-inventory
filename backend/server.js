import 'dotenv/config';
import * as artwork from './artwork.js';
import * as users from './users.js';
import * as favorites from './favorites.js';

import express from 'express';
import mysql from 'mysql2/promise';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import cors from 'cors';

const url = process.env.MYSQL_URL;
const connection = mysql.createPool(url);
const sessionStore = new MySQLStore({}, connection);
const app = express();
const corsOptions = {
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'PUT'],
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

const initDb = async () => {
	try {
		await users.createTable(connection);
		await artwork.createTable(connection);
		await favorites.createFavoritesTable(connection);
		await artwork.createTestData(connection);
		await users.createTestData(connection);
	} catch (err) {
		console.error('Error initializing database:', err);
	}
};

initDb();
artwork.setupRoutes(app);
users.setupRoutes(app, connection, session);
favorites.setupFavoritesRoutes(app, connection, session);
app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).json({ message: 'Internal Server Error' });
});

app.use(express.static('public'));

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
