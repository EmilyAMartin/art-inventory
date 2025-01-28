const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: ' art_gallery',
});

connection.query('USE art_gallery', (err) => {
	if (err) {
		console.error('Error selecting database:', err.stack);
		return;
	}
	console.log('Database selected');

	connection.query('SELECT * FROM artist', (err, results) => {
		if (err) {
			console.error('Error executing query:', err.stack);
			return;
		}
		console.log(results);
	});
});

connection.end();
