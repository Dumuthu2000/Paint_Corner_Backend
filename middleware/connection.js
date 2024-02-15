const mysql = require('mysql2/promise');
require('dotenv').config();

// const connection = mysql.createPool({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"paint_corner"
// });

const connection = mysql.createPool({
    host:process.env.HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.DATABASE
});

module.exports = connection;
