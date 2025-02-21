import mysql from 'mysql2';

//DB Connection//
const server = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: process.env.DB_PASSWORD,
	database: 'artworks',
});

//User Table//
export const createTable = () => {
	server.query(`
    CREATE TABLE IF NOT EXISTS users (
       id INT NOT NULL AUTO_INCREMENT,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       password_hash VARCHAR(255) NOT NULL,
       PRIMARY KEY (id)
    )
  `);
};

//User Data//
export const createTestData = () => {
	server.query(
		`
    INSERT INTO users (id, name, email, password_hash)
    VALUES (1, "John Doe", "john@doe.com", "password_hash")
  `,
		(err, result) => {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					console.log('Duplicate entry found, ignoring...');
					return;
				}
				console.log('Error inserting artist:', err);
			} else {
				console.log('Users inserted successfully');
			}
		}
	);
};

//Users Routes//
export const setupRoutes = (app) => {
	app.get('/users', (req, res) => {
		server.query('SELECT * FROM users', (error, results) => {
			if (error) {
				console.error(error);
				res.status(500).json({ error: 'Internal Server Error' });
				return;
			}
			res.json(results);
		});
	});
};
