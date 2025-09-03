// Memory optimization configuration and utilities

// Node.js memory optimization settings
export const optimizeNodeMemory = () => {
	// Set max old space size to prevent memory leaks
	if (process.env.NODE_OPTIONS) {
		process.env.NODE_OPTIONS += ' --max-old-space-size=512';
	} else {
		process.env.NODE_OPTIONS = '--max-old-space-size=512';
	}

	// Enable garbage collection
	if (process.env.NODE_OPTIONS) {
		process.env.NODE_OPTIONS += ' --expose-gc';
	} else {
		process.env.NODE_OPTIONS = '--expose-gc';
	}

	console.log('Node.js memory optimization enabled');
};

// Database query optimization settings
export const DB_OPTIMIZATION = {
	MAX_RESULTS_PER_PAGE: 50,
	DEFAULT_PAGE_SIZE: 20,
	QUERY_TIMEOUT: 30000, // 30 seconds
	CONNECTION_TIMEOUT: 60000, // 60 seconds
	MAX_CONNECTIONS: 10,
	IDLE_TIMEOUT: 300000, // 5 minutes
};

// Image optimization settings
export const IMAGE_OPTIMIZATION = {
	MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
	THUMBNAIL_SIZE: 150,
	MEDIUM_SIZE: 800,
	LARGE_SIZE: 1200,
	QUALITY: {
		THUMBNAIL: 70,
		MEDIUM: 80,
		LARGE: 85,
		ORIGINAL: 85
	}
};

// Session optimization settings
export const SESSION_OPTIMIZATION = {
	SECRET: process.env.SESSION_SECRET || 'your-default-secret',
	RESAVE: false,
	SAVE_UNINITIALIZED: false,
	COOKIE: {
		HTTP_ONLY: true,
		SECURE: false,
		SAME_SITE: 'lax',
		MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
	},
	STORE_OPTIONS: {
		CREATE_DATABASE_TABLE: true,
		SCHEMA: {
			tableName: 'sessions',
			columnNames: {
				session_id: 'session_id',
				expires: 'expires',
				data: 'data'
			}
		}
	}
};

// Memory monitoring utilities
export const MemoryMonitor = {
	logUsage: () => {
		const memUsage = process.memoryUsage();
		const formatMB = (bytes) => Math.round(bytes / 1024 / 1024);
		
		console.log('=== Memory Usage Report ===');
		console.log(`RSS: ${formatMB(memUsage.rss)} MB`);
		console.log(`Heap Total: ${formatMB(memUsage.heapTotal)} MB`);
		console.log(`Heap Used: ${formatMB(memUsage.heapUsed)} MB`);
		console.log(`External: ${formatMB(memUsage.external)} MB`);
		console.log(`Array Buffers: ${formatMB(memUsage.arrayBuffers)} MB`);
		console.log('==========================');
	},

	getMemoryStats: () => {
		const memUsage = process.memoryUsage();
		return {
			rss: Math.round(memUsage.rss / 1024 / 1024),
			heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
			heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
			external: Math.round(memUsage.external / 1024 / 1024),
			arrayBuffers: Math.round(memUsage.arrayBuffers / 1024 / 1024)
		};
	},

	checkMemoryThreshold: (thresholdMB = 400) => {
		const stats = MemoryMonitor.getMemoryStats();
		if (stats.heapUsed > thresholdMB) {
			console.warn(`⚠️  High memory usage detected: ${stats.heapUsed} MB`);
			return true;
		}
		return false;
	}
};

// Garbage collection utilities
export const GarbageCollector = {
	forceGC: () => {
		if (global.gc) {
			global.gc();
			console.log('🧹 Forced garbage collection performed');
			return true;
		}
		console.log('⚠️  Garbage collection not available. Use --expose-gc flag');
		return false;
	},

	scheduleGC: (intervalMinutes = 10) => {
		if (global.gc) {
			setInterval(() => {
				global.gc();
				console.log('🧹 Scheduled garbage collection performed');
			}, intervalMinutes * 60 * 1000);
			console.log(`🕐 Garbage collection scheduled every ${intervalMinutes} minutes`);
		}
	}
};

export default {
	optimizeNodeMemory,
	DB_OPTIMIZATION,
	IMAGE_OPTIMIZATION,
	SESSION_OPTIMIZATION,
	MemoryMonitor,
	GarbageCollector
};
