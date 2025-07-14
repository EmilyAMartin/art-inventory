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
import { BASE_URL } from './config.js';

const sessionStore = new MySQLStore({}, dbPool);
const app = express();
const allowedOrigins = [
	'http://localhost:5173',
	'https://art-portfolio.fly.dev',
];

const corsOptions = {
	origin: allowedOrigins,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const uploadDir = process.env.UPLOAD_DIR || '/data/uploads';
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
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
		await users.createTable(dbPool);
		await artwork.createTable(dbPool);
		await favorites.createFavoritesTable(dbPool);
		await comments.createCommentsTable(dbPool);
		await projects.createTable(dbPool);
		console.log('Database initialized successfully.');
	} catch (err) {
		console.error('Error initializing database:', err);
		process.exit(1);
	}
};

initDb();

artwork.setupRoutes(app);
users.setupRoutes(app);
favorites.setupFavoritesRoutes(app);
comments.setupCommentRoutes(app);
projects.setupRoutes(app);

// Serve static files from React build
app.use(express.static(path.join(import.meta.dirname, '../frontend/dist')));

// Catch-all route for SPA client-side routing
app.get('*', (req, res, next) => {
	if (
		req.method === 'GET' &&
		!req.path.startsWith('/api') &&
		!req.path.startsWith('/uploads') &&
		!req.path.startsWith('/artwork') &&
		!req.path.startsWith('/users') &&
		!req.path.startsWith('/favorites') &&
		!req.path.startsWith('/projects') &&
		!req.path.startsWith('/comments')
	) {
		res.sendFile(path.join(import.meta.dirname, '../frontend/dist/index.html'));
	} else {
		next();
	}
});

app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).json({ message: 'Internal Server Error' });
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
