const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Default route
app.get('/', (req, res) => {
	res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
