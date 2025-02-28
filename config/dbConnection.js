const mysql = require("mysql2/promise");
// const dotenv = require("dotenv");

// dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in .env file");
}
const pool = mysql.createPool(databaseUrl);

module.exports = { pool };

// const mongoose = require("mongoose");

// const connectDb = async () => {
//   try {
//     const connect = await mongoose.connect(process.env.MONGODB_URL, {
//       // Add additional options
//       maxPoolSize: 20, // Set the max number of connections in the pool
//       useNewUrlParser: true, // Option to use the new MongoDB connection string parser
//       useUnifiedTopology: true, // Option for using the new server discovery and monitoring engine
//     });
//     console.log(
//       "Database connected: ",
//       connect.connection.host,
//       connect.connection.name
//     );
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };

// module.exports = connectDb;
