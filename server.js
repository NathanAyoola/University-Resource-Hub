const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'B1903ayd!',
  database: 'your-mysql-database',
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Your signup and login routes go here

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
