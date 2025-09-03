import mysql from 'mysql2/promise';

const url = process.env.MYSQL_URL;

// Optimized connection pool configuration for memory efficiency
export const dbPool = mysql.createPool({
	uri: url,
	// Connection pool settings to prevent memory leaks
	connectionLimit: 10, // Limit concurrent connections
	queueLimit: 0, // No limit on queued requests
	acquireTimeout: 60000, // 60 seconds to acquire connection
	timeout: 60000, // 60 seconds query timeout
	reconnect: true,
	// Memory optimization settings
	multipleStatements: false, // Prevent SQL injection and memory issues
	dateStrings: true, // Return dates as strings instead of Date objects
	// Connection lifecycle management
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
});

// Monitor pool health and log memory usage
setInterval(() => {
	const poolStatus = dbPool.pool.status();
	console.log(`DB Pool Status - Active: ${poolStatus.active}, Idle: ${poolStatus.idle}, Total: ${poolStatus.total}`);
}, 300000); // Log every 5 minutes

// Graceful shutdown to prevent memory leaks
process.on('SIGINT', async () => {
	console.log('Shutting down database pool...');
	await dbPool.end();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('Shutting down database pool...');
	await dbPool.end();
	process.exit(0);
});

// Helper function to execute queries with automatic connection management
export const executeQuery = async (query, params = []) => {
	let connection;
	try {
		connection = await dbPool.getConnection();
		const [results] = await connection.execute(query, params);
		return results;
	} catch (error) {
		console.error('Database query error:', error);
		throw error;
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

// Helper function for paginated queries to limit memory usage
export const executePaginatedQuery = async (query, params = [], page = 1, limit = 20) => {
	const offset = (page - 1) * limit;
	const paginatedQuery = `${query} LIMIT ? OFFSET ?`;
	const paginatedParams = [...params, limit, offset];
	
	return await executeQuery(paginatedQuery, paginatedParams);
};
