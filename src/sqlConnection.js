const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'sunilsy08',
    database : 'friends'
  });


module.exports = connection