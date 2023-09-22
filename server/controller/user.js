const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id: id }, "a454a5478a4s5d1d21d54d88fr");
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      try {
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

exports.login = async (req, res, next) => {
  try {
    let id;
    const { email, password } = req.body;
    const data = await User.findOne({ where: { email } });
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, data.password);
    if (passwordMatch) {
      const token = generateToken(data.id);
      return res
        .status(200)
        .json({ message: "Successfully logged in", data: data.name, token });
    } else {
      return res.status(401).json({ message: "Incorrect Password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { name } = req.query;
    const data = await User.findOne({
      where: { name },
      attributes: ["id", "name"],
    });
    if (data) {
      return res.status(200).json({ data, message: "User found" });
    }
    return res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ error: err, message: "Failed" });
  }
};
