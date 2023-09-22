const { Op } = require("sequelize");
const Messages = require("../models/messages");
const User = require("../models/user");
const Group = require("../models/group");

exports.postMessage = async (req, res, next) => {
  try {
    const { message, groupId } = req.body;
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const data = await req.user.createMessage({
      message,
      groupId: group.id,
    });
    if (data) {
      return res.status(201).json({
        message: "Message Created",
        data: {
          ...data.toJSON(),
          user: { name: req.user.name },
          group: { name: group.name },
        },
      });
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
