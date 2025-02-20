import { server } from './db';
//Artist Table//

export const createTable = () => {
	server.query(`
    CREATE TABLE IF NOT EXISTS artist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      artist_title VARCHAR(255)
    )
  `);
};

//Artist Data//
export const createTestData = () => {
	server.query(
		`
    INSERT INTO artist (id, artist_title) 
    VALUES (1, 'Emily Martin')
  `,
		(err, result) => {
			if (err) {
				if (err.code === 'ER_DUP_ENTRY') {
					console.log('Duplicate entry found, ignoring...');
					return;
				}
				console.log('Error inserting artist:', err);
			} else {
				console.log('Artist inserted successfully');
			}
		}
	);
};

//Artist Routes//
export const setupRoutes = (app) => {
	app.get('/artists', (req, res) => {
		server.query('SELECT * FROM artist', (error, results) => {
			if (error) {
				console.error(error);
				res.status(500).json({ error: 'Internal Server Error' });
				return;
			}
			res.json(results);
		});
	});
};
