const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Server Info
const server = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'artworks',
});

// Create Tables//
const initDb = () => {
	server.query(`
    CREATE TABLE IF NOT EXISTS artist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      artist_title VARCHAR(255)
    )
  `);

	server.query(`
    CREATE TABLE IF NOT EXISTS artwork (
      id INT AUTO_INCREMENT PRIMARY KEY,
      artist_id INT,
      title VARCHAR(255),
      date_end DATE,
      image_path VARCHAR(255),
      place_of_origin VARCHAR(255),
      artwork_type_title VARCHAR(255),
      medium_display VARCHAR(255),
      credit_line VARCHAR(255),
      thumbnail VARCHAR(255),
      FOREIGN KEY (artist_id) REFERENCES artist(id)
    )
  `);
};
initDb();

// Artist Table//
server.query(
	`
  INSERT INTO artist (artist_title) 
  VALUES
  ('Emily Martin'),
  ('Emily Martin'),
  ('Emily Martin'),
  ('Emily Martin'),
  ('Emily Martin'),
  ('Emily Martin'),
  ('Emily Martin'),
  ('Emily Martin')
`,
	(err, result) => {
		if (err) {
			console.log('Error inserting artist:', err);
		} else {
			console.log('Artist inserted successfully');
		}
	}
);

//Artwork Table//
server.query(
	`
  INSERT INTO artwork (artist_id, title, date_end, image_path, place_of_origin, artwork_type_title, medium_display, credit_line, thumbnail) 
  VALUES
    (1, 'Terra Nova 1', '2022-01-01', 'Images/1.jpg', 'Canada', 'Photography', 'Scanned silver gelatin print', 'Personal Collection', '{"alt_text": "This image was taken during the summer of 2022. The photograph is of the inside of the Terra Nova Sulphite Mill in Glovertown, NL."}'),
    (2, 'Terra Nova 2', '2022-01-01', 'Images/2.jpg', 'Canada', 'Photography', 'Scanned silver gelatin print', 'Personal Collection', '{"alt_text": "This image was take during the summer of 2022. The photograph is of the inside of the Terra Nova Sulphite Mill in Glovertown, NL."}'),
    (3, 'Iris', '2014-01-01', 'Images/3.jpg', 'Canada', 'Photography', 'Printed silver gelatin print', 'Personal Collection', '{"alt_text": "This image was made in 2014 using ink on glass. It is an abstract photograph meant to play on the idea of viewer perception and the meaning of an artwork."}'),
    (4, 'Leaves', '2014-01-01', 'Images/4.jpg', 'Canada', 'Photography', 'Printed silver gelatin print', 'Personal Collection', '{"alt_text": "This image was made in 2014 using ink on glass. It is an abstract photograph meant to play on the idea of viewer perception and the meaning of an artwork."}'),
    (5, 'Blue Beetle', '2018-01-01', 'Images/5.jpg', 'Canada', 'Digital', 'Digital artwork printed on mat paper', 'Personal Collection', '{"alt_text": "This image was made in 2018 using photoshop. The artist used images taken from the Newfoundland insectarium to create colorful bug illustrations"}'),
    (6, 'Skull', '2018-01-01', 'Images/6.jpg', 'Canada', 'Digital', 'Digital artwork printed on mat paper', 'Personal Collection', '{"alt_text": "This image was made in 2018 using ink on glass. The artist used images of a local hunters animal skulls to create colorful illustrations."}'),
    (7, 'Coy Fish', '2019-01-01', 'Images/7.jpg', 'Canada', 'Printmaking', 'Lino print printed on mat paper', 'Personal Collection', '{"alt_text": "This image was made in 2019. The artist made serval editions of this print using different color schemes."}'),
    (8, 'Newfoundland Iris', '2019-01-01', 'Images/8.jpg', 'Canada', 'Watercolor', 'Watercolor painting scanned and printed on mat paper', 'Personal Collection', '{"alt_text": "This image was made in 2019. It is one of three watercolor paintings the artist made of Newfoundland flowers."}')
`,
	(err, result) => {
		if (err) {
			console.log('Error inserting artwork:', err);
		} else {
			console.log('Artwork inserted successfully');
		}
	}
);

// Fetch Artworks//
app.get('/artworks', (req, res) => {
	server.query(
		`SELECT artwork.id, artwork.title, artwork.date_end, artwork.image_path, artwork.place_of_origin, artwork.artwork_type_title,artwork.medium_display, artwork.credit_line, artwork.thumbnail, 
      artist.artist_title AS artist 
     FROM artwork 
     JOIN artist ON artwork.artist_id = artist.id`,
		(error, results) => {
			if (error) {
				res.status(500).json({ error: error.message });
				return;
			}
			res.json(results);
		}
	);
});

// Selecting Port//
const port = 3000;
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

app.use(express.static('public'));
