import mysql from 'mysql2/promise';

// Configure pool with sensible defaults for small VMs
const dbUrl = process.env.MYSQL_URL;
const connectionLimit = Number(process.env.DB_CONNECTION_LIMIT || 5);

export const dbPool = mysql.createPool({
	uri: dbUrl,
	connectionLimit,
	waitForConnections: true,
	queueLimit: 0,
});
