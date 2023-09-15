const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      try {
        console.log(err);
        const data = await User.create({
          name,
          email,
          phoneNumber,
          password: hash,
        });
        if (data) {
          return res
            .status(201)
            .json({ data, message: "Account successfully created" });
        }
      } catch (err) {
        res.status(500).json({ error: err, message: "Error Occured" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err, message: "Error Occured" });
  }
};
