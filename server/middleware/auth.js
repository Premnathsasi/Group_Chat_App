const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    User.findByPk(user.id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = { authenticate };
