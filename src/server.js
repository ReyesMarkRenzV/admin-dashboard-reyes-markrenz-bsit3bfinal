const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'movieprojectdb', 
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


app.use(cors()); 
app.use(bodyParser.json()); 


app.post('/movies', (req, res) => {
  const { tmdbId, title, overview, popularity, releaseDate, voteAverage, backdropPath, posterPath, isFeatured } = req.body;

  const query = `
    INSERT INTO movies (tmdbId, title, overview, popularity, releaseDate, voteAverage, backdropPath, posterPath, isFeatured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [tmdbId, title, overview, popularity, releaseDate, voteAverage, backdropPath, posterPath, isFeatured];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting movie into database:', err);
      return res.status(500).send('Error saving movie');
    }
    res.status(201).send('Movie saved successfully');
  });
});


app.put('/movies/:id', (req, res) => {
  const { id } = req.params;
  const { tmdbId, title, overview, popularity, releaseDate, voteAverage, backdropPath, posterPath, isFeatured } = req.body;

  const query = `
    UPDATE movies 
    SET tmdbId = ?, title = ?, overview = ?, popularity = ?, releaseDate = ?, voteAverage = ?, backdropPath = ?, posterPath = ?, isFeatured = ?
    WHERE id = ?
  `;

  const values = [tmdbId, title, overview, popularity, releaseDate, voteAverage, backdropPath, posterPath, isFeatured, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating movie in database:', err);
      return res.status(500).send('Error updating movie');
    }
    res.status(200).send('Movie updated successfully');
  });
});


app.get('/movies/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM movies WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching movie:', err);
      return res.status(500).send('Error fetching movie');
    }
    res.status(200).json(result[0]);
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
