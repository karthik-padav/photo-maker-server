const mysql = require("mysql2/promise");
// const dotenv = require("dotenv");

// dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in .env file");
}
const pool = mysql.createPool(databaseUrl);

module.exports = { pool };
