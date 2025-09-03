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

// Memory monitoring and optimization
const logMemoryUsage = () => {
	const memUsage = process.memoryUsage();
	console.log('Memory Usage:', {
		rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
		heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
		heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
		external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
	});
};

// Log memory usage every 5 minutes
setInterval(logMemoryUsage, 300000);

// Force garbage collection if available (Node.js with --expose-gc flag)
if (global.gc) {
	setInterval(() => {
		global.gc();
		console.log('Garbage collection performed');
	}, 600000); // Every 10 minutes
}

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

// Reduce request size limits to prevent memory issues
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));

// Add compression to reduce memory usage
import compression from 'compression';
app.use(compression({
	level: 6, // Balanced compression level
	threshold: 1024, // Only compress responses > 1KB
	filter: (req, res) => {
		// Don't compress images
		if (req.headers['x-no-compression']) {
			return false;
		}
		return compression.filter(req, res);
	}
}));

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

app.use(express.static(path.join(import.meta.dirname, './dist')));

app.get(/^\/(?!api\/).*$/, (req, res) => {
	res.sendFile(path.join(import.meta.dirname, './dist/index.html'));
});

app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).json({ message: 'Internal Server Error' });
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
