const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path'); // Import the path module

const app = express();
const port = 5000;

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', // Use an empty string for an empty password
    database: 'testing',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.json());

// Use the cors middleware
app.use(cors());

// Serve the result.html page
app.use(express.static('public'));

// Handle form submission
app.post('/submit', (req, res) => {
    const { companyUEN, companyName, fullname, position, email, phone } = req.body;

    const sql = 'INSERT INTO CompanyData (CompanyUEN, CompanyName, FullName, Position, Email, Phone) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [companyUEN, companyName, fullname, position, email, phone], (err, result) => {
        if (err) {
            console.error('Error inserting data into CompanyData:', err);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into CompanyData table');
            res.status(200).send('Data inserted into the database');
        }
    });
});

// Create a route to fetch submitted data
app.get('/fetchData', (req, res) => {
    const sql = 'SELECT * FROM CompanyData';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching data from CompanyData:', err);
            res.status(500).send('Error fetching data from the database');
        } else {
            res.status(200).json(result);
        }
    });
});

// Modify this route to send the result.html page
app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
