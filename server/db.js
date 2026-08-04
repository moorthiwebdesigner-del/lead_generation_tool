const mysql = require("mysql2");

const db = mysql.createPool({

  host: process.env.MYSQLHOST,

  user: process.env.MYSQLUSER,

  password: process.env.MYSQLPASSWORD,

  database: process.env.MYSQLDATABASE,

  port: process.env.MYSQLPORT,

});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  }
});

module.exports = db;