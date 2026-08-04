const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    console.error("❌ PostgreSQL Connection Failed:", err);
  } else {
    console.log("✅ PostgreSQL Connected Successfully");
  }
});

module.exports = pool;