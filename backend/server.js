const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: '',
});
connection.connect();

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
	if (err) throw err;

	console.log('The solution is: ', rows[0].solution);
});

connection.end();
// Default route
app.get('/', (req, res) => {
	res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
