const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 5000;

// MySQL configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pet_profile_management_system',
  port: 3306,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the MySQL database');
});

// Parse JSON bodies for this server
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads', // Remove the trailing slash after "uploads"
  filename: (req, file, cb) => {
    // Use the original filename for the uploaded file
    cb(null, file.originalname);
  },
});


const upload = multer({ storage });

// Get all pet profiles
app.get('/api/pets', (req, res) => {
  const sql = 'SELECT * FROM pets';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// Create a new pet profile
app.post('/api/pets', upload.single('picture'), (req, res) => {
  const { species, breed, gender, color_markings, weight, size, medical_history, vaccination_status, price} = req.body;
  const picture = req.file ? req.file.path : ''; // Use the file path if a file was uploaded, otherwise, use an empty string
  const sql =
    'INSERT INTO pets (picture, species, breed, gender, color_markings, weight, size, medical_history, vaccination_status, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [picture, species, breed, gender, color_markings, weight, size, medical_history, vaccination_status, price];
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'Pet profile created successfully' });
  });
});

// Update an existing pet profile
app.put('/api/pets/:id', upload.single('picture'), (req, res) => {
  const { id } = req.params;
  const { species, breed, gender, color_markings, weight, size, medical_history, vaccination_status, price} = req.body;
  const picture = req.file ? req.file.path : ''; // Use the file path if a file was uploaded, otherwise, use an empty string
  const sql =
    'UPDATE pets SET picture = ?, species = ?, breed = ?, gender = ?, color_markings = ?, weight = ?, size = ?, medical_history = ?, vaccination_status = ?, price = ? WHERE id = ?';
  const values = [picture, species, breed, gender, color_markings, weight, size, medical_history, vaccination_status, price, id];
  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'Pet profile updated successfully' });
  });
});

// Delete a pet profile
app.delete('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM pets WHERE id = ?';
  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'Pet profile deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
