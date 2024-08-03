const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.NEXT_AUTH_SECRET,
    { algorithms: ["HS384"] },
    async (err, user) => {
      if (err) return res.status(401).json({ err, message: "Unauthorized." });
      else if (user?.email) {
        const _user = await User.find({ email: user.email });
        if (_user.length) {
          req.user = _user[0];
          next();
        } else res.status(404).json({ message: "User not found." });
      } else res.status(404).json({ message: "Email id not found." });
    }
  );
}

module.exports.authenticateToken = authenticateToken;
