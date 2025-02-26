import mysql from 'mysql2';

//DB Connection//
export const server = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: process.env.DB_PASSWORD,
	database: 'artworks',
});
