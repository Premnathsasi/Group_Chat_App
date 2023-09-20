const Messages = require("../models/messages");
const User = require("../models/user");

exports.postMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const data = await req.user.createMessage({
      message,
    });
    if (data) {
      return res
        .status(201)
        .json({
          message: "message created",
          data: { ...data, user: { name: req.user.name } },
        });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const data = await Messages.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    if (data) {
      return res.status(200).json({ data: data, message: "Messages found" });
    } else {
      return res.status(404).json({ message: "data no found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error ocurred", error: err });
  }
};
