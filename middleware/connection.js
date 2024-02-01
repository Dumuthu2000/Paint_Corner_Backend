const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"paint_corner"
});

module.exports = connection;