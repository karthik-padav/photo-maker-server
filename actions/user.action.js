const jwt = require("jsonwebtoken");
const { pool } = require("../config/dbConnection");

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(
    token,
    process.env.NEXT_AUTH_SECRET,
    { algorithms: ["HS384"] },
    async (err, user) => {
      if (err)
        return res.status(401).json({ message: "Unauthorized", error: err });

      if (user?.email) {
        try {
          const [rows] = await pool.execute(
            "SELECT * FROM User WHERE email = ?",
            [user.email]
          );

          if (rows.length) {
            req.user = rows[0];
            return next();
          } else {
            return res.status(404).json({ message: "User not found." });
          }
        } catch (dbError) {
          return res
            .status(500)
            .json({ message: "Database error", error: dbError });
        }
      } else {
        return res
          .status(404)
          .json({ message: "Email ID not found in token." });
      }
    }
  );
}

async function getUser(req, res) {
  if (!req?.user?.email) {
    return res.status(404).json({ message: "Email ID not found." });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM User WHERE email = ? and isActive = 1",
      [req.user.email]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(rows[0]);
  } catch (dbError) {
    return res.status(500).json({ message: "Database error", error: dbError });
  }
}

module.exports = { authenticateToken, getUser };
