const mysql = require('mysql2');
//require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'M@rgaret634634',
    database: 'employee_tracker_db'
});

module.exports = db;