import 'dotenv/config';
import * as artwork from './artwork.js';
import * as users from './users.js';
import * as favorites from './favorites.js';

import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import cors from 'cors';
import { dbPool } from './db.js';
import path from 'path';

const sessionStore = new MySQLStore({}, dbPool);
const app = express();
const corsOptions = {
	origin: 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const initDb = async () => {
	try {
		await users.createTable();
		await artwork.createTable();
		await favorites.createFavoritesTable();
	} catch (err) {
		console.error('Error initializing database:', err);
	}
};

initDb();
artwork.setupRoutes(app);
users.setupRoutes(app);
favorites.setupFavoritesRoutes(app);

app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).json({ message: 'Internal Server Error' });
});

app.use(express.static('public'));

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
