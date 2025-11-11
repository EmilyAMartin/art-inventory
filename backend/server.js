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
// Reduce JSON/urlencoded body size to avoid large payloads being held in memory
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '100kb' }));
app.use(
	express.urlencoded({
		limit: process.env.URLENCODED_BODY_LIMIT || '100kb',
		extended: true,
	})
);

const uploadDir = process.env.UPLOAD_DIR || '/data/uploads';
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Lightweight periodic memory logging to observe trends on small VMs
if (process.env.ENABLE_MEMORY_LOGGING !== 'false') {
	setInterval(() => {
		try {
			const m = process.memoryUsage();
			console.log('memory-usage', {
				rss: Math.round(m.rss / 1024 / 1024) + 'MB',
				heapTotal: Math.round(m.heapTotal / 1024 / 1024) + 'MB',
				heapUsed: Math.round(m.heapUsed / 1024 / 1024) + 'MB',
				external: Math.round(m.external / 1024 / 1024) + 'MB',
			});
		} catch (e) {
			console.error('Error measuring memory usage', e);
		}
	}, Number(process.env.MEMORY_LOG_INTERVAL_MS || 60000));
}

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

// Protected debug endpoint to inspect memory usage. Enable by setting DEBUG_SECRET in env.
app.get('/api/_debug/mem', (req, res) => {
	const secret = req.query.secret || req.headers['x-debug-secret'];
	if (!process.env.DEBUG_SECRET || secret !== process.env.DEBUG_SECRET) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	const mem = process.memoryUsage();
	const payload = {
		rss: mem.rss,
		heapTotal: mem.heapTotal,
		heapUsed: mem.heapUsed,
		external: mem.external,
		arrayBuffers: mem.arrayBuffers,
	};

	// If node was started with --expose-gc we can optionally trigger a GC and return post-GC stats.
	if (process.env.DEBUG_TRIGGER_GC === 'true' && global.gc) {
		try {
			global.gc();
			payload.postGc = process.memoryUsage();
		} catch (e) {
			payload.gcError = String(e);
		}
	}

	res.json(payload);
});

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
