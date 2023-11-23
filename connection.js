// Import the mysql package
var mysql = require('mysql');

// Create a connection
var con = mysql.createConnection({
  host: '127.0.0.1',  // MySQL server host
  user: 'root',  // MySQL username
  password: '',  // MySQL password
  database: 'mytutor'  // MySQL database name
});

module.exports = con;
