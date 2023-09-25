const { Op } = require("sequelize");
const Messages = require("../models/messages");
const User = require("../models/user");
const Group = require("../models/group");
const { uploadToS3 } = require("../services/s3Services");
const { io } = require("../app");

exports.postMessage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No files to upload");
    }
    const { groupId } = req.body;
    const { originalname, buffer, mimetype } = req.file;
    const fileName = `${
      req.user.id
    }/upload${originalname}${new Date().toLocaleString()}`;
    const fileUrl = await uploadToS3(buffer, fileName, mimetype);
    if (fileUrl) {
      const data = await req.user.createMessage({
        fileUrl: fileUrl,
        groupId: groupId,
      });
      if (data) {
        return res.status(200).json({
          message: "message created",
          data: {
            ...data.toJSON(),
            user: { name: req.user.name },
          },
        });
      }
      return res.status(404).json({ message: "No data found" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { lastReceivedMessageId, groupId } = req.query;
    console.log(lastReceivedMessageId, groupId);

    // Fetch messages associated with the given group and sender's name
    const data = await Messages.findAll({
      where: {
        groupId: groupId, // Filter messages by groupId
      },
      include: [
        {
          model: User,
          attributes: ["name"], // Include sender's name
        },
      ],
    });
    if (data) {
      return res.status(200).json({ data: data, message: "Messages found" });
    } else {
      return res.status(404).json({ message: "Data not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error occurred", error: err });
  }
};
