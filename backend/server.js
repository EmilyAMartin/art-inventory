const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

//Server Info/
const server = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'casio1935',
	database: 'artwork',
});

//Connecting and Selecting Table//
server.connect((err) => {
	if (err) {
		console.error('Database connection failed: ' + err.stack);
		return;
	}
	console.log('Connected to the database.');
});

app.get('/artworks', (req, res) => {
	server.query('SELECT * FROM artworks', (err, results) => {
		if (err) {
			res.status(500).send('Error retrieving data from the database.');
			return;
		}
		res.json(results);
	});
});

//Selecting Port//
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

app.use(express.static('public'));
