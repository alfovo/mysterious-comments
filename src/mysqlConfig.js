var mysql = require("mysql");
require("dotenv").config();
const host = process.env.DB_HOST || "localhost";
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD || 1000;

var con = mysql.createConnection({
  host,
  user,
  password,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
