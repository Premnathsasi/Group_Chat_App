const Messages = require("../models/messages");

exports.postMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const data = await req.user.createMessage({
      message,
    });
    if (data) {
      return res.status(201).json({ message: "message created", data: data });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    const data = await Messages.findAll();
    console.log(data);
    if (data) {
      return res.status(200).json({ data: data, message: "Messages found" });
    } else {
      return res.status(404).json({ message: "data no found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error ocurred", error: err });
  }
};
