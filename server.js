const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors'); // Import the cors middleware

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
console.log(req)
    const sql = 'INSERT INTO CompanyData (CompanyUEN, CompanyName, FullName, Position, Email, Phone) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [companyUEN, companyName, fullname, position, email, phone], (err, result) => {
        if (err) {
            console.error('Error inserting data into CompanyData:', err);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into CompanyData table');
            res.status(200).send({"message":"Data inserted into CompanyData table"});
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

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/result.html');
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Import the ResultPage component
const ResultPage = require('./ResultPage');

// Modify the route for the result page
app.get('/result.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});