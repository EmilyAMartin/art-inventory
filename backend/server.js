import 'dotenv/config';
import * as artwork from './artwork.js';
import * as users from './users.js';
import * as favorites from './favorites.js';
import * as projects from './projects.js';
import * as comments from './comments.js';

import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import cors from 'cors';
import { dbPool } from './db.js';
import path from 'path';
import fs from 'fs';

const sessionStore = new MySQLStore({}, dbPool);
const app = express();
const corsOptions = {
	origin: 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

app.use(
	session({
		secret: process.env.SESSION_SECRET || 'your-default-secret',
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

const initDb = async () => {
	try {
		await users.createTable(dbPool); // Pass dbPool to users.createTable
		await artwork.createTable(dbPool); // Pass dbPool to artwork.createTable
		await favorites.createFavoritesTable(dbPool); // Pass dbPool to favorites.createFavoritesTable
		await comments.createCommentsTable(dbPool); // Pass dbPool to comments.createCommentsTable
		await projects.createTable(dbPool); // Pass dbPool to projects.createTable
		console.log('Database initialized successfully.');
	} catch (err) {
		console.error('Error initializing database:', err);
		process.exit(1); // Exit the process if database initialization fails
	}
};

initDb();
artwork.setupRoutes(app);
users.setupRoutes(app);
favorites.setupFavoritesRoutes(app);
comments.setupCommentRoutes(app);
projects.setupRoutes(app);

app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).json({ message: 'Internal Server Error' });
});

app.use(express.static('public'));

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
