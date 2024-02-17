const mysql = require('mysql2/promise');
require('dotenv').config();

// const connection = mysql.createPool({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"paint_corner"
// });
console.log('1111')
try {
const connection = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
});
console.log(connection)s
} catch (e) {
    console.log(e,'22222222')
}

module.exports = connection;
