import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import * as artist from './artist.js';
import * as artwork from './artwork.js';
import * as users from './users.js';

const app = express();
app.use(cors());

//Initialize Database//
const initDb = () => {
	artist.createTable();
	artwork.createTable();
	users.createTable();

	artist.createTestData();
	artwork.createTestData();
	users.createTestData();
};
initDb();

//Setup Routes//
artist.setupRoutes(app);
artwork.setupRoutes(app);
users.setupRoutes(app);

const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

app.use(express.static('public'));
