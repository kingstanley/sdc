const mysql = require('mysql');
const orm = require('orm');

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    password: "",
    user: "root",
    database: "nodeblog"
});

orm.connect("mysql://root:@localhost/nodeblog", (err, db) =>{
    if(err) throw err;
})
module.exports = con;