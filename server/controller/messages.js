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
